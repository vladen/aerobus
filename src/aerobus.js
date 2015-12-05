/*
  todo:
     - message forwarding
     - serialized publications
*/

'use strict';

const
  CHANNEL_HIERARCHY_DELIMITER = '.'
, CHANNEL_NAME_ERROR = 'error'
, CHANNEL_NAME_ROOT = ''

, AEROBUS = 'Aerobus'
, CLASS_AEROBUS_CHANNEL = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Channel'
, CLASS_AEROBUS_ITERATOR = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Iterator'
, CLASS_AEROBUS_MESSAGE = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Message'
, CLASS_AEROBUS_SECTION = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Section'
, CLASS_FUNCTION = 'Function'
, CLASS_NUMBER = 'Number'
, CLASS_OBJECT = 'Object'
, CLASS_STRING = 'String'

, $CLASS = Symbol.toStringTag
, $ITERATOR = Symbol.iterator
, $PROTOTYPE = 'prototype'

, maxSafeInteger = Number.MAX_SAFE_INTEGER

, classof = value => Object.prototype.toString.call(value).slice(8, -1)
, defineProperties = Object.defineProperties
, defineProperty = Object.defineProperty
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
, throwContextNotFound = value => {
    throw new Error(`Context for object of type ${classof(value)} was not found. The object might be disposed.`);
  }
, throwCallbackNotValid = value => {
    throw new TypeError(`Callback expected to be a function but ${classof(value)} was provided.`);
  }
, throwDelimiterNotValid = value => {
    throw new TypeError(`Delimiter expected to be not empty string but "${value}" was provided.`);
  }
, throwForbiden = () => {
    throw new Error('This operation is forbidden for existing context.');
  }
, throwNameNotValid = value => {
    throw new TypeError(`Name expected to be a string but ${classof(value)} was provided.`);
  }
, throwTraceNotValid = value => {
    throw new TypeError(`Trace expected to be a function but ${classof(value)} was provided.`);
  }

, gears = new WeakMap
, getGear = key => {
    var gear = gears.get(key);
    if (isNothing(gear)) throwContextNotFound(key);
    return gear;
  }
, setGear = (key, gear) => {
    isSomething(gear)
      ? gears.set(key, gear)
      : gears.delete(key, gear);
  };

class BusGear {
  constructor(classes, delimiter, trace) {
    this.channels = new Map;
    this.classes = classes;
    this.delimiter = delimiter;
    this.sealed = false;
    this.trace = trace;
  }
  clear() {
    let channels = this.channels;
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    this.sealed = false;
  }
  get(name) {
    let channels = this.channels
      , channel = channels.get(name);
    if (channel) return channel;
    let Channel = this.classes.Channel;
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
        let Section = this.classes.Section;
        return new Section(names.map(name => this.get(name)));
    }
  }
  unsubscribe(subscriptions) {
    for (let channel of this.channels.values()) getGear(channel).unsubscribe(subscriptions);
  }
}

class IteratorGear {
  constructor(init) {
    this.disposed = false;
    this.messages = [];
    this.rejects = [];
    this.resolves = [];
    this.disposer = init(message => {
      if (this.resolves.length) this.resolves.shift()(message);
      else this.messages.push(message);
    });
  }
  done() {
    if (this.disposed) return;
    this.disposed = true;
    this.rejects.forEach(reject => reject());
    this.disposer();
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
    this.bus = bus;
    this.enabled = true;
    this.name = name;
    if (parent) this.parent = getGear(parent);
    this.subscriptions = [];
    this.trace = trace;
    trace('create');
  }
  get isEnabled() {
    let parent = this.parent;
    return this.enabled && (!parent || parent.isEnabled);
  }
  clear() {
    this.trace('clear');
    this.subscriptions.length = 0;
    if (this.retentions) this.retentions.length = 0;
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
    if (classof(message) === CLASS_AEROBUS_MESSAGE) return message.pass(this.name);
    let Message = this.bus.classes.Message;
    return new Message(message, [this.name]);
  }
  propagate(message) {
    let retentions = this.retentions;
    if (retentions) {
      retentions.push(message);
      if (retentions.length > retentions.limit) retentions.shift();
    }
    let parent = this.parent;
    if (parent) parent.publish(message);
    if (this.observers) this.observers.forEach(observer => observer(message));
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
    this.subscriptions.forEach(this.name === CHANNEL_NAME_ERROR
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
    this.subscriptions.forEach(this.name === CHANNEL_NAME_ERROR
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
    this.subscriptions.length = 0;
    this.retentions = undefined;
  }
  retain(limit) {
    limit = isNumber(limit)
      ? Math.max(limit, 0)
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
  subscribe(parameters) {
    this.trace('subscribe', parameters);
    let name
      , order = 0
      , subscriptions = [];
    parameters.forEach(parameter => {
      switch (classof(parameter)) {
        case CLASS_FUNCTION:
          subscriptions.push({ subscriber: parameter });
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
    subscriptions.forEach(subscription => {
      subscription.name = name;
      subscription.order = order;
    });
    let existing = this.subscriptions
      , index = existing.findIndex(subscription => subscription.order > order)
      , retentions = this.retentions;
    -1 === index
      ? existing.push(...subscriptions)
      : existing.splice(index, 0, ...subscriptions);
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
    let i, subscriptions = this.subscriptions;
    if (parameters.length) parameters.forEach(parameter => {
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
    else subscriptions.length = 0;
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
class ChannelApi {
  constructor(bus, name, parent) {
    setGear(this, new ChannelGear(bus, name, parent, (event, ...args) => bus.trace(event, this, ...args)));
    defineProperty(this, 'name', { value: name, enumerable: true });
    if (isSomething(parent)) defineProperty(this, 'parent', { value: parent, enumerable: true });
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
    return getGear(this).subscriptions.map(subscription => subscription.subscriber);
  }
  /**
   * Empties this channel. Removes all retentions and subscriptions.
   * @returns {Channel} - This channel.
   */
  clear() {
    getGear(this).clear();
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
    return new Iterator(observer => getGear(this).observe(observer));
  }
}

defineProperty(ChannelApi[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_CHANNEL });

function subclassChannel() {
  return class Channel extends ChannelApi {
    constructor(classes, name, parent) {
      super(classes, name, parent);
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
  constructor(data, route) {
      defineProperties(this, {
        data: { value: data, enumerable: true }
      , destination: { value: route[route.length - 1], enumerable: true }
      , route: { value: route, enumerable: true }
      });
    }
    fail(error) {
      let Message = this.constructor
        , message = new Message(this.channel, this.route);
      defineProperty(message, 'error', { value: error });
      return message;
    }
    pass(destination) {
      let Message = this.constructor
        , message = new Message(this.data, this.route.concat(destination));
      if (isSomething(this.error)) defineProperty(message, 'error', { value: this.error });
      return message;
    }
}
defineProperty(MessageBase[$PROTOTYPE], $CLASS, { value : CLASS_AEROBUS_MESSAGE });

function subclassMessage() {
  return class Message extends MessageBase {
    constructor(data, route) {
      super(data, route);
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
class SectionApi {
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
    return new Iterator(observer => {
      let disposers = getGear(this).channels.map(channel => getGear(channel).observe(observer));
      return () => disposers.forEach(disposer => disposer());
    });
  }
}
defineProperty(SectionApi[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SECTION });

function subclassSection() {
  return class Section extends SectionApi {
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
  let delimiter = CHANNEL_HIERARCHY_DELIMITER
    , trace = noop
    , Channel = subclassChannel()
    , Message = subclassMessage()
    , Section = subclassSection()
  for (var i = 0, l = parameters.length; i < l; i++) {
    let parameter = parameters[i];
    switch (classof(parameter)) {
      case CLASS_FUNCTION:
        trace = parameter;
        break;
      case CLASS_OBJECT:
        extend(Channel.prototype, parameter.channel);
        extend(Message.prototype, parameter.message);
        extend(Section.prototype, parameter.section);
        break;
      case CLASS_STRING:
        if (parameter.length === 0) throwDelimiterNotValid(parameter);
        delimiter = parameter;
        break;
      default:
        throwArgumentNotValid(parameter);
    }
  }
  setGear(bus, new BusGear({ Channel, Message, Section }, delimiter, trace));
  return defineProperties(bus, {
    clear: {value: clear}
  , create: {value: aerobus}
  , channels: {get: getChannels}
  , delimiter: {get: getDelimiter, set: setDelimiter}
  , error: {get: getError}
  , root: {get: getRoot}
  , trace: {get: getTrace, set: setTrace}
  , unsubscribe: {value: unsubscribe}
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
  function getChannels() {
    return Array.from(getGear(bus).channels.values());
  }
  function getDelimiter() {
    return getGear(bus).delimiter;
  }
  function setDelimiter(value) {
    let gear = getGear(bus);
    if (gear.sealed) throwForbiden();
    if (!isString(value) || value.length === 0) throwDelimiterNotValid(value);
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
    let gear = getGear(bus);
    if (gear.sealed) throwForbiden();
    if (!isFunction(value)) throwTraceNotValid(value);
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
