'use strict';

const
  CLASS_AEROBUS = 'Aerobus'
, CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + '.Channel'
, CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + '.Iterator'
, CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + '.Message'
, CLASS_AEROBUS_SECTION = CLASS_AEROBUS + '.Section'
, CLASS_AEROBUS_SUBSCRIBER = CLASS_AEROBUS + '.Subscriber'
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
, classof = value => Object.prototype.toString.call(value).slice(8, -1)
, defineProperties = Object.defineProperties
, defineProperty = Object.defineProperty
, floor = Math.floor
, max = Math.max
, min = Math.min
, random = Math.random
, identity = value => value
, isFunction = value => classof(value) === CLASS_FUNCTION
, isNothing = value => value == null
, isNumber = value => classof(value) === CLASS_NUMBER
, isObject = value => classof(value) === CLASS_OBJECT
, isSomething = value => value != null
, isString = value => classof(value) === CLASS_STRING
, noop = () => {}
, extend = (target, source) => isNothing(source)
  ? target
  : Object
    .getOwnPropertyNames(source)
    .reduce(
      (result, key) => key in result
        ? result
        : defineProperty(result, key, Object.getOwnPropertyDescriptor(source, key))
    , target)

, throwArgumentNotValid = value => {
    throw new TypeError(`Argument of type "${classof(value)}" is unexpected.`);
  }
, throwGearNotFound = value => {
    throw new Error(`This instance of "${classof(value)}"" has been deleted.`);
  }
, throwCallbackNotValid = value => {
    throw new TypeError(`Callback expected to be a function, not "${classof(value)}".`);
  }
, throwChannelExtensionNotValid = value => {
    throw new TypeError(`Channel class extensions expected to be an object, not "${value}".`);
  }
, throwDelimiterNotValid = value => {
    throw new TypeError(`Delimiter expected to be not empty string, not "${value}".`);
  }
, throwErrorNotValid = value => {
    throw new TypeError(`Error expected to be a function, not "${classof(value)}".`);
  }
, throwMessageExtensionNotValid = value => {
    throw new TypeError(`Message class extensions expected to be an object, not "${value}".`);
  }
, throwNameNotValid = value => {
    throw new TypeError(`Name expected to be a string, not "${classof(value)}".`);
  }
, throwObserverNotValid = value => {
    throw new TypeError(`Observer expected to be an object having mandatory next method and optional done/complete method.`);
  }
, throwSectionExtensionNotValid = value => {
    throw new TypeError(`Section class extensions expected to be an object, not "${value}".`);
  }
, throwSubscriberNotValid = () => {
    throw new TypeError(`Subscriber expected to be a function or an observer object.`);
  }
, throwTraceNotValid = value => {
    throw new TypeError(`Trace expected to be a function, not "${classof(value)}".`);
  }
, throwUnexpectedParameter = value => {
    throw new TypeError(`Unexpected parameter type "${classof(value)}".`);
  }

, gears = new WeakMap
, getGear = (key) => {
    var gear = gears.get(key);
    if (isNothing(gear)) throwGearNotFound(key);
    return gear;
  }
, setGear = (key, gear) => {
    isSomething(gear)
      ? gears.set(key, gear)
      : gears.delete(key, gear);
  };

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
    if (!isString(name)) throwNameNotValid(name);
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

class Subscriber {
  constructor(next, done, name = undefined, order = 0, retain = true) {
    defineProperties(this, {
      done: { value: done }
    , next: { value: next }
    , name: { value: name, writable: true }
    , order: { value: order, writable: true }
    , retain: { value: retain }
    });
  }
  static fromCallback(next, name, order) {
    return new Subscriber(next, noop, name, order);
  }
  static fromObserver(observer, name, order) {
    let done, next;
    if (isFunction(observer.next)) {
      next = (data, message) => observer.next(message);
      if (isSomething(observer.done)) {
        if (!isFunction(observer.done)) throwObserverNotValid(observer);
        done = () => observer.done();
      }
      else done = noop;
    }
    else throwObserverNotValid(observer);
    return new Subscriber(next, done, name, order);
  }
}
defineProperty(Subscriber[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SUBSCRIBER });

class IteratorGear {
  constructor(channels) {
    this.disposed = false;
    this.disposer = () => channels.forEach(channel => channel.unsubscribe([this.subscriber]));
    this.messages = [];
    this.subscriber = new Subscriber(
      (data, message) => this.emit(message)
    , () => this.done()
    , undefined, maxSafeInteger, false);
    this.rejects = [];
    this.resolves = [];
    channels.forEach(channel => channel.subscribe([this.subscriber]));
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
  constructor(init) {
    setGear(this, new IteratorGear(init));
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
  get pathEnabled() {
    let parent = this.parent;
    return this.enabled && (!parent || parent.pathEnabled);
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
    if (subscribers) subscribers.forEach(subscriber => setImmediate(() => subscriber.done()));
    this.retentions = this.subscribers = undefined;
  }
  cycle(limit, step) {
    limit = isNumber(limit)
      ? limit > 0 ? limit : 0
      : limit ? 1 : 0;
    step = isNumber(step) && 9 < step
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
  envelop(message) {
    let bus = this.bus
      , Message = bus.Message;
    return classof(message) === CLASS_AEROBUS_MESSAGE
      ? new Message(message.data, message.id, message.route.concat(this.name))
      : new Message(message, ++bus.id, [this.name]);
  }
  propagate(message) {
    let retentions = this.retentions;
    if (retentions) {
      retentions.push(message);
      if (retentions.length > retentions.limit) retentions.shift();
    }
    if (this.bubbles) {
      let parent = this.parent;
      if (parent) parent.publish(message);
    }
  }
  publish(message) {
    if (!this.pathEnabled) return;
    message = this.envelop(message);
    this.trace('publish', message);
    this.propagate(message);
    let strategy = this.strategy
      , subscribers = this.subscribers;
    if (!subscribers) return;
    if (strategy) subscribers = strategy(subscribers);
    subscribers.forEach(subscriber => {
      try {
        subscriber.next(message.data, message);
      }
      catch(error) {
        setImmediate(() => this.bus.error(error, message));
      }
    });
  }
  request(message, results) {
    if (!this.pathEnabled) return;
    message = this.envelop(message);
    this.trace('request', message);
    this.propagate(message);
    let strategy = this.strategy
      , subscribers = this.subscribers;
    if (!subscribers) return;
    if (strategy) subscribers = strategy(subscribers);
    subscribers.forEach(subscriber => {
      try {
        results.push(subscriber.next(message.data, message));
      }
      catch(error) {
        results.push(error);
        setImmediate(() => this.bus.error(error, message));
      }
    });
  }
  reset() {
    this.trace('reset');
   let retentions = this.retentions;
    if (retentions) retentions.length = 0;
    let subscribers = this.subscribers;
    if (subscribers) subscribers.forEach(subscriber => setImmediate(() => subscriber.done()));
    this.enabled = true;
    this.retentions = this.strategy = this.subscribers = undefined;
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
        if (-1 === selected.indexOf(candidate)) selected[--count] = candidate;
      }
      while (count > 0);
      return selected;
    }
    else delete this.strategy;
  }
  subscribe(parameters) {
    this.trace('subscribe', parameters);
    let name
      , order
      , subscribers = [];
    parameters.forEach(parameter => {
      switch (classof(parameter)) {
        case CLASS_AEROBUS_SUBSCRIBER:
          subscribers.push([identity, parameter]);
          break;
        case CLASS_FUNCTION:
          subscribers.push([Subscriber.fromCallback, parameter]);
          break;
        case CLASS_NUMBER:
          order = parameter;
          break;
        case CLASS_OBJECT:
          subscribers.push([Subscriber.fromObserver, parameter]);
          break;
        case CLASS_STRING:
          name = parameter;
          break;
        default:
          throwArgumentNotValid(parameter);
      }
    });
    if (!subscribers.length) throwSubscriberNotValid();
    if (isNothing(order)) order = 0;
    subscribers = subscribers.map(([ factory, parameter ]) => factory(parameter, name, order));
    if (!this.subscribers) this.subscribers = [];
    subscribers.forEach(subscriber => {
      let index = this.subscribers.findIndex(existing => existing.order > subscriber.order);
      -1 === index
        ? this.subscribers.push(subscriber)
        : this.subscribers.splice(index, 0, subscriber);
      if (this.retentions && subscriber.retain !== false) this.retentions.forEach(message => {
        try {
          subscriber.next(message.data, message);
        }
        catch(error) {
          setImmediate(() => this.bus.error(error, message));
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
    let predicates = [];
    if (parameters.length) {
      if (parameters) parameters.forEach(parameter => {
        switch (classof(parameter)) {
          case CLASS_AEROBUS_SUBSCRIBER:
            predicates.push(subscriber => subscriber === parameter);
            break;
          case CLASS_FUNCTION:
            predicates.push(subscriber => subscriber.next === parameter);
            break;
          case CLASS_OBJECT:
            predicates.push(subscriber => subscriber.observer === parameter);
            break;
          case CLASS_STRING:
            predicates.push(subscriber => subscriber.name === parameter);
            break;
          default:
            throwArgumentNotValid(parameter);
        }
      });
    }
    else predicates.push(() => true);
    let i = subscribers.length;
    while (--i >= 0) {
      let subscriber = subscribers[i];
      if (predicates.some(predicate => predicate(subscriber))) {
        subscribers.splice(i, 1);
        setImmediate(() => subscriber.done());
      }
    }
  }
}

/**
 * Channel class.
 * @alias Channel
 * @property {Boolean} bubbles - True if this channel bubbles publications to ancestor; otherwise false.
 * @property {bus} bus - The bus instance owning this channel.
 * @property {Boolean} enabled - True if this channel and all its ancestors are enabled; otherwise false.
 * @property {String} name - The name if this channel (empty string for root channel).
 * @property {Channel} [parent] - The parent channel (undefined for root channel).
 * @property {Array} retentions - The list of retentions kept by this channel.
 * @property {Array} subscribers - The list of subscribers to this channel.
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
    return getGear(this).pathEnabled;
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
      ? subscribers.map(subscriber => subscriber.next)
      : [];
  }
  /**
   * Enables or disables publications bubbling for this channel depending on value.
   * If bubbling is enabled, a channel first delivers each publication to the parent channel
   * and then notifies own subscribers.
   * @param {Boolean} [value] - When thruthy or omitted, the channel bubbles; otherwise not.
   * @returns {Channel} - This channel.
   */
  bubble(value = true) {
    getGear(this).bubble(value);
    return this;
  }
  /**
   * Empties this channel.
   * Removes all #retentions and #subscriptions. Keeps @enabled and @bubbles settings.
   * @returns {Channel} - This channel.
   */
  clear() {
    getGear(this).clear();
    return this;
  }
  /**
   * Switches this channel to use 'cycle' delivery strategy.
   * Every publication will be delivered to provided number of subscribers in rotation.
   * @param {Number} [limit=1] - The limit of subsequent subscribers receiving next publication.
   * @param {Number} [step=1] - The number of subsequent subscribers step after next publication.
   * If step is less than number, subscribers selected for a publication delivery will overlap.
   * @returns {Channel} This channel.
   */
  cycle(limit = 1, step = 1) {
    getGear(this).cycle(limit, step);
    return this;
  }
  /**
   * Enables or disables this channel depending on value.
   * Disabled channel supresses all publications.
   * @param {Boolean} [value] - When thruthy or omitted, the channel enables; otherwise disables.
   * @returns {Channel} - This channel.
   */
  enable(value = true) {
    getGear(this).enable(value);
    return this;
  }
  /**
   * Publishes message to this channel.
   * Propagates publication to ancestor channels then notifies own subscribers using try block.
   * Any error thrown by a subscriber will be forwarded to the @bus.error callback.
   * Subsequent subscribers will still be notified even if preceeding subscriber throws.
   * @param {Any} [data] - The data to publish.
   * @param {Function} [callback] - The callback to invoke after publication has been delivered.
   * Callback is invoked with array of values returned by all notified subscribers
   * of all channels this publication was delivered to.
   * When provided, forces message bus to use request/response pattern instead of publish/subscribe.
   * @returns {Channel} This channel.
   */
  publish(data, callback) {
    if (isSomething(callback)) {
      if (!isFunction(callback)) throwCallbackNotValid(callback);
      let results = [];
      getGear(this).request(data, results);
      callback(results);
    }
    else getGear(this).publish(data);
    return this;
  }
  /**
   * Resets this channel.
   * Removes all #retentions and #subscriptions, sets #bubbles, sets #enabled and resets #retentions.limit to 0.
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
   * @param {...Function|Number|Object|String} [parameters] - Subscriber function to subscribe.
   * Or numeric order for all provided subscribers (0 by default).
   * Subscribers with greater order are invoked later.
   * Or object implemeting observer interface containing "next" and "done" methods.
   * The "next" method is invoked for each publication being delivered with single argument - published message.
   * The "done" method ends publications delivery and unsubscribes observer from this channel.
   * Or string name for all provided subscribers.
   * All named subscribers can be unsubscribed at once by their name.
   * @returns {Channel} This channel.
   */
  subscribe(...parameters) {
    getGear(this).subscribe(parameters);
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
   * @param {...Function|String} [parameters] - Subscriber function to unsubscribe.
   * Or string name of subscribers to unsubscribe.
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
      , destination: { value: route[route.length - 1], enumerable: true }
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
  /**
   * Publishes message to all united channels.
   * @returns {Section} This section.
   */
  publish(data, callback) {
    getGear(this).apply('publish', data, callback);
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
    getGear(this).apply('subscribe', parameters);
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
 * @param {...String|function|object} parameters - 
 * The string delimiter of hierarchical channel names (dot by default).
 * Or the trace function, useful for debugging purposes.
 * Or the object with extesions for internal aerobus classes: channel, message and section.
 * @returns {bus} New instance of message bus.
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
          if (!isString(delimiter) || !delimiter.length) throwDelimiterNotValid(delimiter);
          config.delimiter = delimiter;
        }
        if (isSomething(error)) {
          if (!isFunction(error)) throwErrorNotValid(error);
          config.error = error;
        }
        if (isSomething(trace)) {
          if (!isFunction(trace)) throwTraceNotValid(trace);
          config.trace = trace;
        }
        if (isSomething(channel)) {
          if (!isObject(channel)) throwChannelExtensionNotValid(channel);
          assign(config.channel, channel);
        }
        if (isSomething(message)) {
          if (!isObject(message)) throwMessageExtensionNotValid(message);
          assign(config.message, message);
        }
        if (isSomething(section)) {
          if (!isObject(section)) throwSectionExtensionNotValid(section);
          assign(config.section, section);
        }
        break;
      case CLASS_STRING:
        if (!option.length) throwDelimiterNotValid(option);
        config.delimiter = option;
        break;
      default: throwUnexpectedParameter(option);
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
   * Resolves channels or set of channels (sections) depending on arguments provided.
   * After any channel is created, bus configuration is forbidden, 'delimiter' and 'trace' properties become read-only.
   * After bus is cleared, it can be configured again, 'delimiter' and 'trace' properties become read-write.
   * @global
   * @param {...String} [names] - Names of the channels to resolve. If not provided, returns the root channel.
   * @return {Channel|Section} - Single channel or section joining several channels into one logical unit.
   * @property {String} delimiter - The configured delimiter string for hierarchical channel names, writable while bus is empty.
   * @property {Array} channels - The list of existing channels.
   * @property {Channel} error - The error channel.
   * @property {Channel} root - The root channel.
   * @property {Function} trace - The configured trace function, writable while bus is empty.
   * @example
   * bus(), subscriber = () => {};
   * bus('test').subscribe(subscriber);
   * bus('test1', 'test2').disable().subscribe(subscriber);
   */
  function bus(...names) {
    return getGear(bus).resolve(names);
  }
  function bubble(value = true) {
    getGear(bus).bubble(value);
    return bus;
  }
  /**
   * Empties this bus. Removes all existing channels and permits bus configuration via 'delimiter' and 'trace' properties.
   * @alias bus.clear
   * @return {Function} This bus.
   * @example
   * let bus = aerobus();
   * bus.clear();
   */
  function clear() {
    getGear(bus).clear();
    return bus;
  }
  function create(modifiers) {
    return aerobus(assign(config, modifiers));
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
    if (!isFunction(value)) throwTraceNotValid(value);
    getGear(bus).trace = value;
  }
  /**
   * Unsubscribes provided subscribers from all channels of this bus.
   * @alias bus.unsubscribe
   * @param {...Function|String} [parameters] - Subscriber function or names to unsibscribe.
   * If omitted, unsubscribes all subscribers from all channels.
   * @return {Function} This bus.
   */
  function unsubscribe(...parameters) {
    getGear(bus).unsubscribe(parameters);
    return bus;
  }
}

export default aerobus;
