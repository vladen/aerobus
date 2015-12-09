'use strict';

const
  CLASS_AEROBUS = 'Aerobus'
, CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + '.Channel'
, CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + '.Iterator'
, CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + '.Message'
, CLASS_AEROBUS_SECTION = CLASS_AEROBUS + '.Section'
, CLASS_AEROBUS_SUBSCRIBER = CLASS_AEROBUS + '.Subscriber'
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
, throwBusIsSealed = () => {
    throw new Error('This message bus is sealed and can not be reconfigured now.');
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
, throwOrderNotValid = value => {
    throw new TypeError(`Order expected to be a number, not "${classof(value)}".`);
  }
, throwOptionsNotValid = value => {
    throw new TypeError(`Options expected to be an object, not "${classof(value)}".`);
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
    this.Channel = subclassChannel();
    extend(this.Channel[$PROTOTYPE], config.channel);
    this.Message = subclassMessage();
    extend(this.Message[$PROTOTYPE], config.message);
    this.Section = subclassSection();
    extend(this.Section[$PROTOTYPE], config.section);
    this.bubbles = config.bubbles;
    this.channels = new Map;
    this.delimiter = config.delimiter;
    this.error = config.error;
    this.id = 0;
    this.sealed = false;
    this.trace = config.trace;
  }
  clear() {
    let channels = this.channels;
    for (let channel of channels.values()) setGear(channel.clear(), null);
    channels.clear();
    this.sealed = false;
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
    this.sealed = true;
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
  static fromFunction(next, name, order) {
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
      else if (isSomething(observer.complete)) {
        if (!isFunction(observer.complete)) throwObserverNotValid(observer);
        done = () => observer.complete();
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
   * @example
   * bus.root[Symbol.iterator]().done();
   * // => undefined
   */
  done() {
    getGear(this).done();
  }
  /**
   * Advances iteration of this channel/section.
   * @returns {Object} - Object containing whether 'done' or 'value' properties. The 'done' property returns true if the iteration has been ended; otherwise the 'value' property returns a Promise resolving to the next message published to this channel/section.
   * @example
   * var iterator = bus.root[Symbol.iterator]();
   * iterator.next();
   * // => Object {value: Promise}
   * iterator.done();
   * // => Unhandled promise rejection undefined
   * iterator.next();
   * // => Object {done: true}
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
  disable() {
    this.enable(false);
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
    if (!this.isEnabled) return;
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
    if (!this.isEnabled) return;
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
          subscribers.push([Subscriber.fromFunction, parameter]);
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
 * @property {bus} bus - The bus instance owning this channel.
 * @property {Boolean} isEnabled - True if this channel and all its ancestors are enabled; otherwise false.
 * @property {String} name - The name if this channel (empty string for root channel).
 * @property {Channel} [parent] - The parent channel (not set for root and error channels).
 * @property {Array} retentions - The list of retentions of this channel.
 * @property {Array} subscriptions - The list of subscriptions to this channel.
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
  get isEnabled() {
    return getGear(this).isEnabled;
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
   * Empties this channel. Removes all retentions and subscriptions.
   * @returns {Channel} - This channel.
   */
  clear() {
    getGear(this).clear();
    return this;
  }
  cycle(limit = 1, step = 1) {
    getGear(this).cycle(limit, step);
    return this;
  }
  /**
   * Disables this channel.
   * All subsequent publications to this and descendant channels will be ignored.
   * @returns {Channel} - This channel.
   */
  disable() {
    getGear(this).disable(false);
    return this;
  }
  /**
   * Enables or disables this channel depending on value.
   * All subsequent publications to this channel will be delivered.
   * Publications to descendant channels will be delivered only if the corresponding channel is enabled itself.
   * @param {Boolean} [value] - Optional value. When thruthy or omitted, the channel is enabled; otherwise disabled.
   * @returns {Channel} - This channel.
   */
  enable(value = true) {
    getGear(this).enable(value);
    return this;
  }
  /**
   * Publishes data to this channel.
   * Propagates publication to ancestor channels then notifies own subscribers.
   * If this channel is not standard "error" channel, subscribers are invoked within try block
   * and any error thrown by a subscriber will be published to standard "error" channel.
   * Subsequent subscribers will still be notified even if preceeding subscriber throws.
   * Error thrown by subscriber of standard "error" channel will be thrown.
   * @param {Any} [data] - Optional data to publish.
   * @param {Function} [callback] - Optional callback to invoke with array of values returned by all notified subscribers,
   * from all channels this publication is delivered to. 
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
   * Removes all retentions and subscriptions, enables channel and sets retentions limit to 0.
   * @returns {Channel} This channel.
   */
  reset() {
    getGear(this).reset();
    return this;
  }
  /**
   * Enables or disables retention policy for this channel.
   * Retention is a publication persisted in a channel to notify future subscribers.
   * Every new subscriber receives all the retentions right after its subscribtion.
   * @param {Number} [limit] - Optional number of latest retentions to persist.
   * When omitted or truthy, the channel retains Number.MAX_SAFE_INTEGER of publications.
   * When falsey, all retentions are removed and the channel stops retaining publications.
   * Otherwise the channel retains at most provided limit of publications.
   * @returns {Channel} This channel.
   */
  retain(limit = maxSafeInteger) {
    getGear(this).retain(limit);
    return this;
  }
  shuffle(limit = 1) {
    getGear(this).shuffle(limit);
    return this;
  }
  /**
   * Subscribes all provided subscribers to this channel.
   * If there are retained messages, notifies every subscriber with all retentions.
   * @param {...Function|Number} [parameters] - Subscriber functions to subscribe.
   * Or numeric order of this subscription (0 by default). 
   * Subscribtions with greater order are invoked later.
   * @returns {Channel} This channel.
   * @example
   * var bus = aerobus(), subscriber0 = (data, message) => {}, subscriber1 = () => {}, subscriber2 = () => {};
   * bus.root.subscribe(2, subscriber0).subscribe(1, subscriber1, subscriber2);
   */
  subscribe(...parameters) {
    getGear(this).subscribe(parameters);
    return this;
  }
  /**
   * Toggles state of this channel: enables when it is disabled and vice versa.
   * @returns {Channel} This channel.
   */
  toggle() {
    getGear(this).toggle();
    return this;
  }
  /**
   * Unsubscribes all provided subscribers from this channel.
   * Without arguments unsubscribes all subscribers.
   * @param {...Function} [subscribers] - Subscribers to unsubscribe.
   * @returns {Channel} This channel.
   */
  unsubscribe(...parameters) {
    getGear(this).unsubscribe(parameters);
    return this;
  }
  /**
   * Returns async iterator for this channel.
   * Async iterator returns Promise objects instead of immediate values.
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
 * @property {Channel} channel - The channel this message is directed to.
 * @property {Array} channels - The array of channels this message traversed.
 * @property {Error} [error] - The error object if this message is reaction to an error thrown by a subscriber.
 * @property {Message} [prior] - The previous message published to a channel preceeding current in publication chain.
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
   * Clears all united channels.
   * @returns {Section} This section.
   */
  clear() {
    getGear(this).call('clear');
    return this;
  }
  /**
   * Disables all united channels.
   * @returns {Section} This section.
   */
  disable() {
    getGear(this).call('disable');
    return this;
  }
  /**
   * Enables all united channels.
   * @returns {Section} This section.
   */
  enable(value = true) {
    getGear(this).apply('enable', value);
    return this;
  }
  /**
   * Publishes data to all united channels.
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
function aerobus(options = null) {
  let config = {
      bubbles: true
    , channel: {}
    , delimiter: '.'
    , error: error => { throw error; }
    , message: {}
    , section: {}
    , trace: noop
  };
  if (isSomething(options)) {
    if (!isObject(options)) throwOptionsNotValid(options);
    let { bubbles, channel, delimiter, error, message, section, trace } = options;
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
  }
  setGear(bus, new BusGear(config));
  return defineProperties(bus, {
    [$CLASS]: { value: CLASS_AEROBUS }
  , bubbles: { get: getBubbles, set: setBubbles }
  , clear: { value: clear }
  , create: { value: create }
  , channels: { get: getChannels }
  , delimiter: { get: getDelimiter, set: setDelimiter }
  , error: { get: getError, set: setError }
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
  function setBubbles(value) {
    getGear(bus).bubbles = !!value;
  }
  function getChannels() {
    return Array.from(getGear(bus).channels.values());
  }
  function getDelimiter() {
    return getGear(bus).delimiter;
  }
  function setDelimiter(value) {
    if (!isString(value) || value.length === 0) throwDelimiterNotValid(value);
    let gear = getGear(bus);
    if (gear.sealed) throwBusIsSealed();
    gear.delimiter = value;
  }
  function getError() {
    return getGear(bus).error;
  }
  function setError(value) {
    if (!isFunction(value)) throwErrorNotValid(value);
    getGear(bus).error = value;
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
