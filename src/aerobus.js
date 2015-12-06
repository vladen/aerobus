'use strict';

const
  CHANNEL_HIERARCHY_DELIMITER = '.'
, CHANNEL_NAME_ERROR = 'error'
, CHANNEL_NAME_ROOT = ''

, CLASS_AEROBUS = 'Aerobus'
, CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Channel'
, CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Iterator'
, CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Message'
, CLASS_AEROBUS_SECTION = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Section'
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
    throw new TypeError(`Unexpected argument type ${classof(value)}.`);
  }
, throwGearNotFound = value => {
    throw new Error(`This instance of ${classof(value)} object has been deleted.`);
  }
, throwCallbackNotValid = value => {
    throw new TypeError(`Callback expected to be a function, not ${classof(value)}.`);
  }
, throwDelimiterNotValid = value => {
    throw new TypeError(`Delimiter expected to be not empty string, not "${value}".`);
  }
, throwForbiden = () => {
    throw new Error('This operation is forbidden for existing context.');
  }
, throwNameNotValid = value => {
    throw new TypeError(`Name expected to be a string, not ${classof(value)}.`);
  }
, throwTraceNotValid = value => {
    throw new TypeError(`Trace expected to be a function, not ${classof(value)}.`);
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
    let Channel = this.Channel;
    if (name === CHANNEL_NAME_ROOT || name === CHANNEL_NAME_ERROR) {
      channel = new Channel(this, name);
      channels.set(name, channel);
    }
    else {
      if (!isString(name)) throwNameNotValid(name);
      let parent = channels.get(CHANNEL_NAME_ROOT);
      if (!parent) {
        parent = new Channel(this, CHANNEL_NAME_ROOT);
        channels.set(CHANNEL_NAME_ROOT, parent);
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
      case 0: return this.get(CHANNEL_NAME_ROOT);
      case 1: return this.get(names[0]);
      default:
        let Section = this.Section;
        return new Section(names.map(name => this.get(name)));
    }
  }
  unsubscribe(subscriptions) {
    for (let channel of this.channels.values()) getGear(channel).unsubscribe(subscriptions);
  }
}

class IteratorGear {
  constructor(attach) {
    this.disposed = false;
    this.messages = [];
    this.rejects = [];
    this.resolves = [];
    this.disposer = attach(
      message => this.emit(message)
    , () => this.done());
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
  constructor(attach) {
    setGear(this, new IteratorGear(attach));
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
    this.select = identity;
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
    let observers = this.observers;
    if (observers) observers.forEach(observer => observer.done());
    let retentions = this.retentions;
    if (retentions) retentions.length = 0;
    this.observers = this.subscriptions = undefined;
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
    this.select = limit
      ? subscriptions => {
          let length = subscriptions.length;
          if (!length) return [];
          let count = min(limit, length)
            , i = index
            , selected = Array(count);
          while (count-- > 0) selected[i] = subscriptions[i++ % length];
          index += step;
          return selected;
        }
      : identity;
  }
  disable() {
    this.trace('disable');
    this.enabled = false;
  }
  enable(value) {
    value = !!value;
    this.trace('enable', value);
    this.enabled = value;
  }
  envelop(message) {
    if (classof(message) === CLASS_AEROBUS_MESSAGE) return this.name === CHANNEL_NAME_ERROR
      ? message
      : message.pass(this.name);
    let bus = this.bus
      , Message = bus.Message;
    return new Message(message, ++bus.id, [this.name]);
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
    if (this.observers) this.observers.forEach(observer => observer.next(message));
  }
  observe(observer) {
    if (this.observers) this.observers.push(observer);
    else this.observers = [observer];
    return () => {
      let observers = this.observers
        , index = observers.indexOf(observer);
      if (~index) observers.splice(index, 1);
    };
  }
  publish(message) {
    if (!this.isEnabled) return;
    message = this.envelop(message);
    this.trace('publish', message);
    this.propagate(message);
    let subscriptions = this.subscriptions;
    if (subscriptions) this.select(subscriptions).forEach(this.name === CHANNEL_NAME_ERROR
      ? subscription => subscription.subscriber(message.error, message)
      : subscription => {
          try {
            subscription.subscriber(message.data, message);
          }
          catch(error) {
            this.bus.get(CHANNEL_NAME_ERROR).publish(message.fail(error));
          }
        });
  }
  request(message, results) {
    if (!this.isEnabled) return;
    message = this.envelop(message);
    this.trace('request', message);
    this.propagate(message);
    let subscriptions = this.subscriptions;
    if (subscriptions) this.select(subscriptions).forEach(this.name === CHANNEL_NAME_ERROR
      ? subscription => subscription.subscriber(message.error, message)
      : subscription => {
          try {
            results.push(subscription.subscriber(message.data, message));
          }
          catch(error) {
            results.push(error);
            this.bus.get(CHANNEL_NAME_ERROR).publish(message.fail(error));
          }
        });
  }
  reset() {
    this.trace('reset');
    this.enabled = true;
    let observers = this.observers;
    if (observers) observers.forEach(observer => observer.done());
    this.retentions = this.observers = this.subscriptions = undefined;
    this.select = identity;
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
    this.select = limit
      ? subscriptions => {
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
      : identity;
  }
  subscribe(parameters) {
    this.trace('subscribe', parameters);
    let name
      , order = 0
      , subscribers = [];
    parameters.forEach(parameter => {
      switch (classof(parameter)) {
        case CLASS_FUNCTION:
          subscribers.push(parameter);
          break;
        case CLASS_NUMBER:
          order = parameter;
          break;
        case CLASS_STRING:
          name = parameter;
          break;
        default:
          throwArgumentNotValid(parameter);
      }
    });
    if (!subscribers.length) return;
    let subscriptions = subscribers.map(subscriber => ({ name, order, subscriber }))
      , existing = this.subscriptions;
    if (existing) {
      let index = existing.findIndex(subscription => subscription.order > order);
      -1 === index
        ? existing.push(...subscriptions)
        : existing.splice(index, 0, ...subscriptions);
    }
    else this.subscriptions = subscriptions;
    let retentions = this.retentions;
    if (retentions) retentions.forEach(message => subscriptions.forEach(subscription => {
      try {
        subscription.subscriber(message.data, message);
      }
      catch(error) {
        this.bus.get(CHANNEL_NAME_ERROR).publish(message.fail(error));
      }
    }));
  }
  toggle() {
    this.trace('toggle');
    this.enabled = !this.enabled;
  }
  unsubscribe(parameters) {
    this.trace('unsubscribe', parameters);
    if (parameters.length) {
      let i, subscriptions = this.subscriptions;
      if (subscriptions) parameters.forEach(parameter => {
        switch (classof(parameter)) {
          case CLASS_FUNCTION:
            i = subscriptions.length;
            while (--i >= 0) if (subscriptions[i].subscriber === parameter) subscriptions.splice(i, 1);
            break;
          case CLASS_STRING:
            i = subscriptions.length;
            while (--i >= 0) if (subscriptions[i].name === parameter) subscriptions.splice(i, 1);
            break;
          default:
            throwArgumentNotValid(parameter);
        }
      });
    }
    else this.subscriptions = undefined;
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
      , subscriptions = gear.subscriptions;
    return subscriptions
      ? subscriptions.map(subscription => subscription.subscriber)
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
    getGear(this).disable();
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
    return new Iterator((next, done) => getGear(this).observe({ next, done }));
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
    fail(error) {
      let Message = this.constructor
        , message = new Message(this.channel, this.id, this.route);
      defineProperty(message, 'error', { value: error });
      return message;
    }
    pass(destination) {
      let Message = this.constructor
        , message = new Message(this.data, this.id, this.route.concat(destination));
      if (isSomething(this.error)) defineProperty(message, 'error', { value: this.error });
      return message;
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
    return new Iterator((next, end) => {
      let gear = getGear(this)
        , channels = gear.channels
        , count = channels.length;
      let done = () => !--count && end();
      let disposers = channels.map(channel => getGear(channel).observe({ next, done }));
      return () => disposers.forEach(disposer => disposer());
    });
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
 * @example
 * let bus = aerobus(':', console.log.bind(console), {
 *  channel: {test: () => 'test'},
 *  message: {test: () => 'test'},
 *  section: {test: () => 'test'}
 * });
 */
function aerobus(...parameters) {
  let config = {
      bubbles: true
    , channel: {}
    , delimiter: CHANNEL_HIERARCHY_DELIMITER
    , message: {}
    , section: {}
    , trace: noop
  };
  for (var i = 0, l = parameters.length; i < l; i++) {
    let parameter = parameters[i];
    switch (classof(parameter)) {
      case CLASS_BOOLEAN:
        config.bubbles = parameter;
        break;
      case CLASS_FUNCTION:
        config.trace = parameter;
        break;
      case CLASS_OBJECT:
        if ('bubbles' in parameter) config.bubbles = !!parameter;
        if ('delimiter' in parameter) {
          let value = parameter.delimiter;
          if (!isString(value) || !value.length) throwDelimiterNotValid(value);
          config.delimiter = value;
        }
        if ('trace' in parameter) {
          let value = parameter.trace;
          if (!isFunction(value)) throwTraceNotValid(value);
          config.trace = value;
        }
        assign(config.channel, parameter.channel);
        assign(config.message, parameter.message);
        assign(config.section, parameter.section);
        break;
      case CLASS_STRING:
        if (!parameter.length) throwDelimiterNotValid(parameter);
        config.delimiter = parameter;
        break;
      default:
        throwArgumentNotValid(parameter);
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
  function create(...modifiers) {
    return aerobus(...parameters.concat(modifiers));
  }
  function getBubbles() {
    return getGear(bus).bubbles;
  }
  function setBubbles(value) {
    let gear = getGear(bus);
    if (gear.sealed) throwForbiden();
    gear.bubbles = !!value;
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
    if (gear.sealed) throwForbiden();
    gear.delimiter = value;
  }
  function getError() {
    return getGear(bus).get(CHANNEL_NAME_ERROR);
  }
  function getRoot() {
    return getGear(bus).get(CHANNEL_NAME_ROOT);
  }
  function getTrace() {
    return getGear(bus).trace;
  }
  function setTrace(value) {
    if (!isFunction(value)) throwTraceNotValid(value);
    let gear = getGear(bus);
    if (gear.sealed) throwForbiden();
    gear.trace = value;
  }
  /**
   * Unsubscribes provided subscribers from all channels of this bus.
   * @alias bus.unsubscribe
   * @param {...Function} [subscribers] - Subscribers to unsibscribe.
   * If omitted, unsubscribes all subscribers from all channels.
   * @return {Function} This bus.
   * @example
   * let bus = aerobus(), subscriber0 = () => {}, subscriber1 = () => {};
   * bus.root.subscribe(subscriber0);
   * bus('example').subscribe(subscriber1);
   * bus.unsubscribe(subscriber0, subscriber1);
   */
  function unsubscribe(...subscribers) {
    getGear(bus).unsubscribe(subscribers);
    return bus;
  }
}

export default aerobus;
