'use strict';

const
  CLASS_AEROBUS = 'Aerobus'
, CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + '.Channel'
, CLASS_AEROBUS_FORWARDING = CLASS_AEROBUS + '.Forwarding'
, CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + '.Iterator'
, CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + '.Message'
, CLASS_AEROBUS_SECTION = CLASS_AEROBUS + '.Section'
, CLASS_AEROBUS_SUBSCRIBER = CLASS_AEROBUS + '.Subscriber'
, CLASS_AEROBUS_SUBSCRIPTION = CLASS_AEROBUS + '.Subscription'
, CLASS_ARRAY = 'Array'
, CLASS_BOOLEAN = 'Boolean'
, CLASS_FUNCTION = 'Function'
, CLASS_NUMBER = 'Number'
, CLASS_OBJECT = 'Object'
, CLASS_STRING = 'String'

, $CLASS = Symbol.toStringTag
, $ITERATOR = Symbol.iterator
, $PROTOTYPE = 'prototype'

, maxSafeInteger = Number.MAX_SAFE_INTEGER

, assign = Object.assign
, defineProperties = Object.defineProperties
, defineProperty = Object.defineProperty
, floor = Math.floor
, max = Math.max
, min = Math.min
, random = Math.random

, classof = value => Object.prototype.toString.call(value).slice(8, -1)
, noop = () => {}

, isArray = value =>classof(value) === CLASS_ARRAY
, isFunction = value => classof(value) === CLASS_FUNCTION
, isNothing = value => value == null
, isNumber = value => classof(value) === CLASS_NUMBER
, isObject = value => classof(value) === CLASS_OBJECT
, isSomething = value => value != null
, isString = value => classof(value) === CLASS_STRING

, extend = (target, source) => isNothing(source)
    ? target
    : Object
      .getOwnPropertyNames(source)
      .reduce(
        (result, key) =>
          key in result
            ? result
            : defineProperty(result, key, Object.getOwnPropertyDescriptor(source, key))
      , target)

, errorArgumentNotValid = value =>
    new TypeError(`Argument of type "${classof(value)}" is not expected.`)
, errorCallbackNotValid = value =>
    new TypeError(`Callback expected to be a function, not "${classof(value)}".`)
, errorChannelExtensionNotValid = value =>
    new TypeError(`Channel class extensions expected to be an object, not "${value}".`)
, errorDelimiterNotValid = value =>
    new TypeError(`Delimiter expected to be not empty string, not "${value}".`)
, errorErrorNotValid = value =>
    new TypeError(`Error expected to be a function, not "${classof(value)}".`)
, errorForwarderNotValid = () =>
    new TypeError(`Forwarder expected to be a function or a string channel name.`)
, errorGearNotFound = value =>
    new Error(`This instance of "${classof(value)}"" has been deleted.`)
, errorMessageExtensionNotValid = value =>
    new TypeError(`Message class extensions expected to be an object, not "${value}".`)
, errorNameNotValid = value =>
    new TypeError(`Name expected to be a string, not "${classof(value)}".`)
, errorOrderNotValid = value =>
    new TypeError(`Order expected to be a number, not "${classof(value)}".`)
, errorSectionExtensionNotValid = value =>
    new TypeError(`Section class extensions expected to be an object, not "${value}".`)
, errorSubscriberNotValid = () =>
    new TypeError(`Subscriber expected to be a function or an object having "next" and optional "done" methods.`)
, errorTraceNotValid = value =>
    new TypeError(`Trace expected to be a function, not "${classof(value)}".`)

, gears = new WeakMap
, getGear = (key) => {
    var gear = gears.get(key);
    if (isNothing(gear)) throw errorGearNotFound(key);
    return gear;
  }
, setGear = (key, gear) => {
    isSomething(gear)
      ? gears.set(key, gear)
      : gears.delete(key, gear);
  }
;

class BusGear {
  constructor(config) {
    this.bubbles = config.bubbles;
    this.channels = new Map;
    this.delimiter = config.delimiter;
    this.error = config.error;
    this.id = 0;
    this.trace = config.trace;
    this.Channel = subclassChannel();
    extend(this.Channel[$PROTOTYPE], config.channel);
    this.Message = subclassMessage();
    extend(this.Message[$PROTOTYPE], config.message);
    this.Section = subclassSection();
    extend(this.Section[$PROTOTYPE], config.section);
  }
  bubble(value) {
    value = !!value;
    this.trace('bubble', value);
    this.bubbles = value;
  }
  clear() {
    let channels = this.channels;
    for (let channel of channels.values()) setGear(channel.clear(), null);
    channels.clear();
  }
  get(name) {
    let channels = this.channels
      , channel = channels.get(name);
    if (channel) return channel;
    if (!isString(name)) throw errorNameNotValid(name);
    let Channel = this.Channel;
    if (name === '') {
      channel = new Channel(this, name);
      channels.set(name, channel);
    }
    else {
      let parent = channels.get('');
      if (!parent) {
        parent = new Channel(this, '');
        channels.set('', parent);
      }
      let delimiter = this.delimiter, parts = name.split(this.delimiter);
      name = '';
      for (var i = 0, l = parts.length; i < l; i++) {
        name = name
          ? name + delimiter + parts[i]
          : parts[i];
        channel = channels.get(name);
        if (!channel) {
          channel = new Channel(this, name, parent);
          channels.set(name, channel);
        }
        parent = channel;
      }
    }
    return channel;
  }
  resolve(names) {
    switch (names.length) {
      case 0: return this.get('');
      case 1: return this.get(names[0]);
      default:
        let Section = this.Section;
        return new Section(names.map(name => this.get(name)));
    }
  }
  unsubscribe(parameters) {
    for (let channel of this.channels.values()) getGear(channel).unsubscribe(parameters);
  }
}

class Forwarding {
  constructor(parameters) {
    let forwarders = [];
    parameters.forEach(parameter => {
      switch (classof(parameter)) {
        case CLASS_AEROBUS_FORWARDING:
          forwarders.push(...parameter.forwarders);
          break;
        case CLASS_FUNCTION: case CLASS_STRING:
          forwarders.push(parameter);
          break;
        default:
          throw errorArgumentNotValid(parameter);
      }
    });
    if (!forwarders.length) throw errorForwarderNotValid();
    defineProperty(this, 'forwarders', { value: forwarders });
  }
}
defineProperty(Forwarding[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_FORWARDING });

class Subscriber {
  constructor(base, name, order) {
    let done, next;
    if (isFunction(base)) {
      done = noop;
      next = base;
    }
    else if (isObject(base) && isFunction(base.next)) {
      next = (_, message) => base.next(message);
      if (isSomething(base.done)) {
        if (!isFunction(base.done)) throw errorSubscriberNotValid(base);
        done = () => base.done();
      }
      else done = noop;
      if (isNothing(name) && isSomething(base.name)) {
        if (!isString(base.name)) throw errorNameNotValid(base.name);
        name = base.name;
      }
      if (isNothing(order) && isSomething(base.order)) {
        if (!isNumber(base.order)) throw errorOrderNotValid(base.order);
        order = base.order;
      }
    }
    else throw errorSubscriberNotValid(base);
    if (isNothing(order)) order = 0;
    defineProperties(this, {
      base: { value: base }
    , done: { value: done }
    , next: { value: next }
    , order: { value: order }
    });
    if (isSomething(name)) defineProperty(this, 'name', { value: name });
  }
}
defineProperty(Subscriber[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SUBSCRIBER });

class Subscription {
  constructor(parameters) {
    let builders = []
      , name
      , order;
    parameters.forEach(parameter => {
      switch (classof(parameter)) {
        case CLASS_AEROBUS_SUBSCRIBER:
          builders.push(() => parameter);
          break;
        case CLASS_FUNCTION: case CLASS_OBJECT:
          builders.push(() => new Subscriber(parameter, name, order));
          break;
        case CLASS_NUMBER:
          order = parameter;
          break;
        case CLASS_STRING:
          name = parameter;
          break;
        default:
          throw errorArgumentNotValid(parameter);
      }
    });
    if (!builders.length) throw errorSubscriberNotValid();
    defineProperty(this, 'subscribers', { value: builders.map(builder => builder()) });
  }
}
defineProperty(Subscription[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SUBSCRIPTION });

class IteratorGear {
  constructor(channels) {
    let subscriber = new Subscriber(
      {
        done: () => this.done()
      , next: message => this.emit(message)
      }
    , undefined
    , maxSafeInteger);
    this.disposed = false;
    this.disposer = () =>
      channels.forEach(channel => {
        let subscribers = channel.subscribers
          , index = subscribers
            ? subscribers.indexOf(subscriber)
            : -1;
        if (!~index) return;
        subscribers.splice(index, 1);
        if (!subscribers.length) delete channel.subscribers;
      });
    this.messages = [];
    this.rejects = [];
    this.resolves = [];
    channels.forEach(channel => {
      let subscribers = channel.subscribers;
      if (subscribers) subscribers.push(subscriber);
      else channel.subscribers = [subscriber];
    });
  }
  done() {
    if (this.disposed) return;
    this.disposed = true;
    this.rejects.forEach(reject => reject());
    this.disposer();
  }
  emit(message) {
    if (this.resolves.length) this.resolves.shift()(message);
    else this.messages.push(message);
  }
  next() {
    if (this.disposed) return { done: true };
    if (this.messages.length) return { value: Promise.resolve(this.messages.shift()) };
    return { value: new Promise((resolve, reject) => {
      this.rejects.push(reject);
      this.resolves.push(resolve);
    }) };
  }
}

/**
 * Iterator class.
 */
class Iterator {
  constructor(channels) {
    setGear(this, new IteratorGear(channels));
  }
  /**
   * Ends iteration of this channel/section and closes the iterator.
   */
  done() {
    getGear(this).done();
  }
  /**
   * Produces next message published to this channel/section.
   * @returns {Object} - Object containing whether 'done' or 'value' properties.
   * The 'done' property returns true if the iteration has been ended;
   * otherwise the 'value' property returns a Promise resolving to the next message published to this channel/section.
   */
  next() {
    return getGear(this).next();
  }
}
defineProperty(Iterator[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_ITERATOR });

class ChannelGear {
  constructor(bus, name, parent, trace) {
    this.bubbles = bus.bubbles;
    this.bus = bus;
    this.enabled = true;
    this.name = name;
    if (parent) this.parent = getGear(parent);
    this.trace = trace;
    trace('create');
  }
  get isEnabled() {
    let parent = this.parent;
    return this.enabled && (!parent || parent.isEnabled);
  }
  bubble(value) {
    value = !!value;
    this.trace('bubble', value);
    this.bubbles = value;
  }
  clear() {
    this.trace('clear');
    let retentions = this.retentions;
    if (retentions) retentions.length = 0;
    let subscribers = this.subscribers;
    if (subscribers) {
      subscribers.forEach(subscriber =>
        setImmediate(() => subscriber.done()));
      delete this.subscribers;
    }
  }
  cycle(limit, step) {
    limit = isNumber(limit)
      ? limit > 0 ? limit : 0
      : limit ? 1 : 0;
    step = isNumber(step) && 0 < step
      ? step
      : limit;
    this.trace('cycle', limit, step);
    let index = 0;
    if (limit) this.strategy = subscriptions => {
      let length = subscriptions.length;
      if (!length) return [];
      let count = min(limit, length)
        , i = index
        , selected = Array(count);
      while (count-- > 0) selected[i] = subscriptions[i++ % length];
      index += step;
      return selected;
    }
    else delete this.strategy;
  }
  enable(value) {
    value = !!value;
    this.trace('enable', value);
    this.enabled = value;
  }
  forward(forwarding) {
    let forwarders = forwarding.forwarders;
    this.trace('forward', forwarders);
    let collection = this.forwarders || (this.forwarders = []);
    collection.push(...forwarders);
  }
  publish(message, reserve, respond) {
    if (!this.isEnabled) return;
    let bus = this.bus
      , Message = bus.Message
      , skip = false;
    message = classof(message) === CLASS_AEROBUS_MESSAGE
      ? new Message(message.data, message.id, [this.name].concat(message.route))
      : new Message(message, ++bus.id, [this.name]);
    this.trace('publish', message);
    if (!message.route.includes(this.name, 1)) {
      let forwarders = this.forwarders;
      if (forwarders) {
        let destinations = new Set;
        skip = true;
        forwarders.forEach(forwarder => {
          let names = isFunction(forwarder)
            ? forwarder(message.data, message)
            : forwarder;
          (isArray(names) ? names : [names]).forEach(name => {
            if (isNothing(name) || false === name) skip = false;
            else if (isString(name)) destinations.add(name);
            else throw errorNameNotValid(name);
          });
        });
        for (let destination of destinations) {
          if (destination === this.name) skip = false;
          else getGear(this.bus.get(destination)).publish(message, reserve, respond);
        }
      }
    }
    if (skip) return;
    let retentions = this.retentions;
    if (retentions) {
      retentions.push(message);
      if (retentions.length > retentions.limit) retentions.shift();
    }
    if (this.bubbles) {
      let parent = this.parent;
      if (parent) parent.publish(message, reserve, respond);
    }
    let subscribers = this.subscribers;
    if (!subscribers) return;
    let strategy = this.strategy;
    if (strategy) subscribers = strategy(subscribers);
    subscribers.forEach(subscriber => {
      reserve();
      try {
        respond(subscriber.next(message.data, message));
      }
      catch(error) {
        respond(error);
        setImmediate(() => bus.error(error, message));
      }
    });
  }
  reset() {
    this.trace('reset');
    let subscribers = this.subscribers;
    if (subscribers) subscribers.forEach(subscriber =>
      setImmediate(() => subscriber.done()));
    delete this.forwarders;
    delete this.retentions;
    delete this.strategy;
    delete this.subscribers;
    delete this.subscriptions;
    this.enabled = true;
  }
  retain(limit) {
    limit = isNumber(limit)
      ? max(limit, 0)
      : limit
        ? maxSafeInteger
        : 0;
    this.trace('retain', limit);
    let retentions = this.retentions;
    if (retentions) {
      retentions.limit = limit;
      if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
    }
    else {
      this.retentions = [];
      this.retentions.limit = limit;
    }
  }
  shuffle(limit) {
    limit = isNumber(limit)
      ? limit > 0 ? limit : 0
      : limit ? 1 : 0;
    this.trace('shuffle', limit);
    if (limit) this.strategy = subscriptions => {
      let length = subscriptions.length;
      if (!length) return [];
      let count = min(limit, length)
        , selected = Array(count);
      do {
        let candidate = subscriptions[floor(random() * length)];
        if (!selected.includes(candidate)) selected[--count] = candidate;
      }
      while (count > 0);
      return selected;
    }
    else delete this.strategy;
  }
  subscribe(subscription) {
    let subscribers = subscription.subscribers;
    this.trace('subscribe', subscribers);
    let bus = this.bus
      , collection = this.subscribers
      , retentions = this.retentions;
    if (collection) subscribers.forEach(subscriber => {
      let index = collection.findIndex(existing => existing.order > subscriber.order);
      -1 === index
        ? collection.push(subscriber)
        : collection.splice(index, 0, subscriber);
    });
    else this.subscribers = subscribers.slice();
    if (retentions) subscribers.forEach(subscriber => {
      retentions.forEach(message => {
        try {
          subscriber.next(message.data, message);
        }
        catch(error) {
          bus.error(error);
        }
      });
    });
  }
  toggle() {
    this.trace('toggle');
    this.enabled = !this.enabled;
  }
  unsubscribe(parameters) {
    this.trace('unsubscribe', parameters);
    let subscribers = this.subscribers;
    if (!subscribers) return;
    if (parameters.length) {
      let predicates = [];
      parameters.forEach(parameter => {
        switch (classof(parameter)) {
          case CLASS_AEROBUS_SUBSCRIBER:
            predicates.push(subscriber => subscriber === parameter);
            break;
          case CLASS_FUNCTION: case CLASS_OBJECT:
            predicates.push(subscriber => subscriber.base === parameter);
            break;
          case CLASS_STRING:
            predicates.push(subscriber => subscriber.name === parameter);
            break;
          default:
            throw errorArgumentNotValid(parameter);
        }
      });
      let i = subscribers.length;
      while (--i >= 0) {
        let subscriber = subscribers[i];
        if (predicates.some(predicate => predicate(subscriber))) {
          subscribers.splice(i, 1);
          setImmediate(() => subscriber.done());
        }
      }
      if (!subscribers.length) delete this.subscribers;
    }
    else {
      subscribers.forEach(subscriber => setImmediate(() => subscriber.done()));
      delete this.subscribers;
    }
  }
}

/**
 * Channel class.
 * @alias Channel
 * @property {Boolean} bubbles - Gets the bubbling state if this channel.
 * @property {bus} bus - Gets the bus instance owning this channel.
 * @property {Boolean} enabled - Gets the enabled state of this channel.
 * @property {String} name - Gets the name if this channel (empty string for root channel).
 * @property {Channel} [parent] - Gets the parent channel (undefined for root channel).
 * @property {Array} retentions - Gets the list of retentions kept by this channel.
 * @property {Array} subscribers - Gets the list of subscribers to this channel.
 */
class ChannelBase {
  constructor(bus, name, parent) {
    defineProperty(this, 'name', { value: name, enumerable: true });
    if (isSomething(parent)) defineProperty(this, 'parent', { value: parent, enumerable: true });
    let trace = (event, ...args) => bus.trace(event, this, ...args);
    setGear(this, new ChannelGear(bus, name, parent, trace));
  }
  get bubbles() {
    return getGear(this).bubbles;
  }
  get enabled() {
    return getGear(this).isEnabled;
  }
  get forwarders() {
    let gear = getGear(this)
      , forwarders = gear.forwarders;
    return forwarders
      ? forwarders.slice()
      : [];
  }
  get retentions() {
    let retentions = getGear(this).retentions
      , result = [];
    if (retentions) {
       result.push(...retentions);
       result.limit = retentions.limit;
    }
    else result.limit = 0;
    return result;
  }
  get subscribers() {
    let gear = getGear(this)
      , subscribers = gear.subscribers;
    return subscribers
      ? subscribers.slice()
      : [];
  }
  /**
   * Enables or disables publications bubbling for this channel depending on value.
   * If bubbling is enabled, the channel first delivers each publication to the parent channel
   * and only then notifies own subscribers.
   * @param {Boolean} [value] - When thruthy or omitted, the channel bubbles publications; otherwise not.
   * @returns {Channel} - This channel.
   */
  bubble(value = true) {
    getGear(this).bubble(value);
    return this;
  }
  /**
   * Empties this channel.
   * Removes all #retentions and #subscribers. Keeps #forwarders, #enabled and #bubbles settings.
   * @returns {Channel} - This channel.
   */
  clear() {
    getGear(this).clear();
    return this;
  }
  /**
   * Switches this channel to use 'cycle' delivery strategy.
   * Every publication will be delivered to the provided number of subscribers in rotation manner.
   * @param {Number} [limit=1] - The limit of subsequent subscribers receiving next publication.
   * @param {Number} [step=1] - The number of subsequent subscribers to step over after next publication.
   * If step is less than number, subscribers selected for a publication delivery will overlap.
   * @returns {Channel} This channel.
   */
  cycle(limit = 1, step = 1) {
    getGear(this).cycle(limit, step);
    return this;
  }
  /**
   * Enables or disables this channel depending on provided value.
   * Disabled channel supresses all publications.
   * @param {Boolean} [value] - When thruthy or omitted, the channel enables; otherwise disables.
   * @returns {Channel} - This channel.
   */
  enable(value = true) {
    getGear(this).enable(value);
    return this;
  }
  /**
   * Adds provided forwarders to this channel.
   * Forwarded message is not published to this channel
   * unless any of forwarders resolves false/null/undefined value
   * or explicit name of this channel.
   * To eliminate infinite forwarding, channel will not forward any publication
   * which already have traversed this channel.
   * @param {...Function|String} [parameters] - The function resolving destination channel name or array of names.
   * And/or string name of channel to forward publications to.
   * @returns {Channel} This channel.
   * @throws If any forwarder has value other than false/function/null/string/undefined.
   */
  forward(...parameters) {
    getGear(this).forward(new Forwarding(parameters));
    return this;
  }
  /**
   * Publishes message to this channel.
   * Bubbles publication to ancestor channels,
   * then notifies own subscribers within try block.
   * Any error thrown by a subscriber will be forwarded to the #bus.error callback.
   * Subsequent subscribers will still be notified even if preceeding subscriber throws.
   * @param {Any} [data] - The data to publish.
   * @param {Function} [callback] - The callback to invoke after publication has been delivered.
   * This callback receives single argument:
   * array of results returned from all notified subscribers of all channels this publication was delivered to.
   * When provided, forces message bus to use request/response pattern instead of publish/subscribe one.
   * @returns {Channel} This channel.
   * @throws If callback is not a function.
   */
  publish(data, callback) {
    if (isSomething(callback)) {
      if (!isFunction(callback)) throw errorCallbackNotValid(callback);
      let pending = 0
        , results = [];
      getGear(this).publish(data, () => ++pending, result => {
        results.push(result);
        if (--pending) return;
        callback(results);
        callback = null;
      });
      if (!pending && callback) callback(results);
    }
    else getGear(this).publish(data, noop, noop);
    return this;
  }
  /**
   * Resets this channel.
   * Removes all #retentions and #subscriptions, sets #bubbles, sets #enabled and resets #retentions.limit.
   * @returns {Channel} This channel.
   */
  reset() {
    getGear(this).reset();
    return this;
  }
  /**
   * Enables or disables retention policy for this channel.
   * Retention is a publication persisted in the channel
   * and used to notify future subscribers right after their subscription.
   * @param {Number} [limit] - Number of retentions to persist (LIFO).
   * When omitted or truthy, the channel retains all publications.
   * When falsey, all retentions are removed and the channel stops retaining publications.
   * Otherwise the channel retains at most provided limit of publications.
   * @returns {Channel} This channel.
   */
  retain(limit = maxSafeInteger) {
    getGear(this).retain(limit);
    return this;
  }
  /**
   * Switches this channel to use 'shuffle' delivery strategy.
   * Every publication will be delivered to provided number of random subscribers.
   * @param {Number} [limit=1] - The limit of random subscribers receiving next publication.
   * @returns {Channel} This channel.
   */
  shuffle(limit = 1) {
    getGear(this).shuffle(limit);
    return this;
  }
  /**
   * Subscribes all provided subscribers to this channel.
   * If there are retained messages, every subscriber will be notified with all retentions.
   * @param {...Function|Number|Object|String} [parameters] - Subscribers to subscribe.
   * And/or numeric order for all provided subscribers (0 by default).
   * Subscribers with greater order are invoked later.
   * And/or object implemeting observer interface containing "next" and "done" methods.
   * The "next" method is invoked for each publication being delivered, with single argument: published message.
   * The "done" method is invoked when observer has bee unsubscribed from this channel.
   * And/or string name for all provided subscribers.
   * All named subscribers can be unsubscribed at once by their name.
   * @returns {Channel} This channel.
   */
  subscribe(...parameters) {
    getGear(this).subscribe(new Subscription(parameters));
    return this;
  }
  /**
   * Enables this channel if it is disabled; otherwise disables it.
   * @returns {Channel} This channel.
   */
  toggle() {
    getGear(this).toggle();
    return this;
  }
  /**
   * Unsubscribes all subscribers or provided subscribers or subscribers with provided names from this channel.
   * @param {...Function|String} [parameters] - Subscribers and/or subscriber names to unsubscribe.
   * @returns {Channel} This channel.
   */
  unsubscribe(...parameters) {
    getGear(this).unsubscribe(parameters);
    return this;
  }
  /**
   * Returns async iterator for this channel.
   * Async iterator returns promises resolving to messages being published.
   * @alias Channel#@@iterator
   * @returns {Iterator} New instance of the Iterator class.
   */
  [$ITERATOR]() {
    return new Iterator([getGear(this)]);
  }
}

defineProperty(ChannelBase[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_CHANNEL });

function subclassChannel() {
  return class Channel extends ChannelBase {
    constructor(bus, name, parent) {
      super(bus, name, parent);
    }
  }
}

/**
 * Message class.
 * @alias Message
 * @property {Any} data - The published data.
 * @property {String} destination - The channel name this message is directed to.
 * @property {Array} route - The array of channel names this message has traversed.
 */
class MessageBase {
  constructor(data, id, route) {
      defineProperties(this, {
        data: { value: data, enumerable: true }
      , destination: { value: route[0], enumerable: true }
      , id: { value: id, enumerable: true }
      , route: { value: route, enumerable: true }
      });
    }
}
defineProperty(MessageBase[$PROTOTYPE], $CLASS, { value : CLASS_AEROBUS_MESSAGE });

function subclassMessage() {
  return class Message extends MessageBase {
    constructor(data, id, route) {
      super(data, id, route);
    }
  }
}

class SectionGear {
  constructor(channels) {
    this.channels = channels;
  }
  apply(method, ...args) {
    this.channels.forEach(channel => {
      getGear(channel)[method](...args);
    });
  }
  call(method) {
    this.channels.forEach(channel => {
      getGear(channel)[method]();
    });
  }
}

/**
 * Section class.
 * @alias Section
 * @property {Array} channels - The array of channels this section unites.
 */
class SectionBase {
  constructor(channels) {
    setGear(this, new SectionGear(channels));
  }
  get channels() {
    return [...getGear(this).channels];
  }
  /**
   * Configures bubbling for all united channels.
   * @param {Boolean} - Truthy value to set channels bubbling; falsey to clear.
   * @returns {Section} This section.
   */
  bubble(value = true) {
    getGear(this).apply('bubble', value);
    return this;
  }
  /**
   * Clears all united channels.
   * @returns {Section} This section.
   */
  clear() {
    getGear(this).call('clear');
    return this;
  }
  /**
   * Enables or disabled all united channels.
   * @param {Boolean} - Truthy value to enable channels; falsey to disable.
   * @returns {Section} This section.
   */
  enable(value = true) {
    getGear(this).apply('enable', value);
    return this;
  }
  forward(...parameters) {
    getGear(this).apply('forward', new Forwarding(parameters));
    return this;
  }
  /**
   * Publishes message to all united channels.
   * @returns {Section} This section.
   */
  publish(data, callback) {
    if (isSomething(callback)) {
      if (!isFunction(callback)) throw errorCallbackNotValid(callback);
      let pending = 0
        , results = [];
      getGear(this).apply('publish', data, () => ++pending, result => {
        results.push(result);
        if (--pending) return;
        callback(results);
        callback = null;
      });
      if (!pending && callback) callback(results);
    }
    else getGear(this).apply('publish', data, noop, noop);
    return this;
  }
  /**
   * Resets all united channels.
   * @returns {Section} This section.
   */
  reset() {
    getGear(this).call('reset');
    return this;
  }
  /**
   * Enables or disables retention policy for all united channels.
   * @returns {Section} This section.
   */
  retain(limit) {
    getGear(this).apply('retain', limit);
    return this;
  }
  /**
   * Subscribes all provided subscribers to all united channels.
   * @returns {Section} This section.
   */
  subscribe(...parameters) {
    getGear(this).apply('subscribe', new Subscription(parameters));
    return this;
  }
  /**
   * Toggles enabled state of all united channels.
   * @returns {Section} This section.
   */
  toggle() {
    getGear(this).call('toggle');
    return this;
  }
  /**
   * Unsubscribes all provided subscribers from all united channels.
   * @returns {Section} This section.
   */
  unsubscribe(...parameters) {
    getGear(this).apply('unsubscribe', parameters);
    return this;
  }
  /**
   * Returns async iterator for this section. The iterator will iterate publications to all united channels.
   * @alias Section#@@iterator
   * @returns {Iterator} New instance of the Iterator class.
   */
  [$ITERATOR]() {
    return new Iterator(getGear(this).channels);
  }
}
defineProperty(SectionBase[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SECTION });

function subclassSection() {
  return class Section extends SectionBase {
    constructor(bus, binder) {
      super(bus, binder);
    }
  }
}

/**
 * Message bus factory. Creates and returns new message bus instance.
 * @param {...String|function|object} parameters - The boolean value defining default bubbling behavior.
 * And/or the string delimiter of hierarchical channel names (dot by default).
 * And/or the error callback, invoked asynchronously with (error, message) arguments when any subscriber throws.
 * And/or the object literal with settings to configure (bubbles, delimiter, error, trace)
 * and extesions for internal classes: channel, message and section.
 * @returns {Aerobus} New instance of message bus.
 * @throws If any option is of unsupported type (boolean, function, object, string)
 * or if option object contains non-string or empty "delimiter" property
 * or if option object contains non-function "error" property
 * or if option object contains non-function "trace" property
 * or if option object contains non-object "channel" property
 * or if option object contains non-object "message" property
 * or if option object contains non-object "section" property
 * or if option string is empty.
 */
function aerobus(...options) {
  let config = {
      bubbles: true
    , channel: {}
    , delimiter: '.'
    , error: error => { throw error; }
    , message: {}
    , section: {}
    , trace: noop
  };
  options.forEach(option => {
    switch(classof(option)) {
      case CLASS_BOOLEAN:
        config.bubbles = option;
        break;
      case CLASS_FUNCTION:
        config.error = option;
        break;
      case CLASS_OBJECT:
        let { bubbles, channel, delimiter, error, message, section, trace } = option;
        if (isSomething(bubbles)) config.bubbles = !!bubbles;
        if (isSomething(delimiter)) {
          if (!isString(delimiter) || !delimiter.length) throw errorDelimiterNotValid(delimiter);
          config.delimiter = delimiter;
        }
        if (isSomething(error)) {
          if (!isFunction(error)) throw errorErrorNotValid(error);
          config.error = error;
        }
        if (isSomething(trace)) {
          if (!isFunction(trace)) throw errorTraceNotValid(trace);
          config.trace = trace;
        }
        if (isSomething(channel)) {
          if (!isObject(channel)) throw errorChannelExtensionNotValid(channel);
          assign(config.channel, channel);
        }
        if (isSomething(message)) {
          if (!isObject(message)) throw errorMessageExtensionNotValid(message);
          assign(config.message, message);
        }
        if (isSomething(section)) {
          if (!isObject(section)) throw errorSectionExtensionNotValid(section);
          assign(config.section, section);
        }
        break;
      case CLASS_STRING:
        if (!option.length) throw errorDelimiterNotValid(option);
        config.delimiter = option;
        break;
      default: throw errorArgumentNotValid(option);
    }
  });
  setGear(bus, new BusGear(config));
  return defineProperties(bus, {
    [$CLASS]: { value: CLASS_AEROBUS }
  , bubble: { value: bubble }
  , bubbles: { get: getBubbles }
  , clear: { value: clear }
  , create: { value: create }
  , channels: { get: getChannels }
  , delimiter: { get: getDelimiter }
  , error: { get: getError }
  , root: { get: getRoot }
  , trace: { get: getTrace, set: setTrace }
  , unsubscribe: { value: unsubscribe }
  });
  /**
   * Message bus instance.
   * Resolves channels and sets of channels (sections) depending on arguments provided.
   * @global
   * @alias Aerobus
   * @param {...String} [names] - The channel names to resolve. If not provided resolves the root channel.
   * @return {Channel|Section} Single channel or section joining several channels into one logical unit.
   * @property {Boolean} bubbles - Gets the bubbling state of this bus.
   * @property {String} delimiter - Gets the configured delimiter string used to split hierarchical channel names.
   * @property {Array} channels - Gets the list of existing channels.
   * @property {Channel} error - Gets the configured error callback.
   * @property {Channel} root - Gets the root channel.
   * @property {Function} trace - Gets or sets the trace callback.
   * @throws If any name is not a string.
   */
  function bus(...names) {
    return getGear(bus).resolve(names);
  }
  function bubble(value = true) {
    getGear(bus).bubble(value);
    return bus;
  }
  /**
   * Empties this bus removing all existing channels.
   * @alias Aerobus#clear
   * @return {Function} This bus.
   */
  function clear() {
    getGear(bus).clear();
    return bus;
  }
  /**
   * Creates new bus instance which inherits settings from this instance.
   * @alias Aerobus#create
   * @param {...Any} [modifiers] - The alternate options to configure new message bus with.
   * @return {Function} New message bus instance.
   */
  function create(...overrides) {
    let overriden = config;
    overrides.forEach(override => {
      switch(classof(override)) {
        case CLASS_BOOLEAN:
          overriden.bubbles = override;
          break;
        case CLASS_FUNCTION:
          overriden.error = override;
          break;
        case CLASS_OBJECT:
          assign(overriden, override);
          break;
        case CLASS_STRING:
          if (!override.length) throw errorDelimiterNotValid(override);
          overriden.delimiter = override;
          break;
        default: throw errorArgumentNotValid(override);
      }
    });
    return aerobus(overriden);
  }
  function getBubbles() {
    return getGear(bus).bubbles;
  }
  function getChannels() {
    return Array.from(getGear(bus).channels.values());
  }
  function getDelimiter() {
    return getGear(bus).delimiter;
  }
  function getError() {
    return getGear(bus).error;
  }
  function getRoot() {
    return getGear(bus).get('');
  }
  function getTrace() {
    return getGear(bus).trace;
  }
  function setTrace(value) {
    if (!isFunction(value)) throw errorTraceNotValid(value);
    getGear(bus).trace = value;
  }
  /**
   * Unsubscribes provided subscribers from all channels of this bus.
   * @alias Aerobus#unsubscribe
   * @param {...Function|String} [parameters] - Subscribers and/or subscriber names to unsibscribe.
   * If omitted, unsubscribes all subscribers from all channels.
   * @return {Function} This bus.
   */
  function unsubscribe(...parameters) {
    getGear(bus).unsubscribe(parameters);
    return bus;
  }
}

export default aerobus;
