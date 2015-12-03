// todo: disable removed channels

'use strict';

const
  CHANNEL_HIERARCHY_DELIMITER = '.'
, CHANNEL_NAME_ERROR = 'error'
, CHANNEL_NAME_ROOT = ''

, ERROR_CALLBACK = 'Callback expected to be a function.'
, ERROR_DELIMITER = 'Delimiter expected to be not empty string.'
, ERROR_DISPOSED = 'This object has been disposed.'
, ERROR_FORBIDDEN = 'This operation is forbidden for not empty bus instance.'
, ERROR_NAME = 'Name expected to be string.'
, ERROR_TRACE = 'Trace expected to be a function.'
, ERROR_UNEXPECTED = 'Unexpected argument type.'

, AEROBUS = 'Aerobus'
, CLASS_AEROBUS_CHANNEL = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Channel'
, CLASS_AEROBUS_ITERATOR = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Iterator'
, CLASS_AEROBUS_MESSAGE = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Message'
, CLASS_AEROBUS_SECTION = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Section'
, CLASS_ERROR = 'Error'
, CLASS_FUNCTION = 'Function'
, CLASS_NUMBER = 'Number'
, CLASS_OBJECT = 'Object'
, CLASS_STRING = 'String'

, $CLASS = Symbol.toStringTag
, $ITERATOR = Symbol.iterator

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
, throwError = error => {
    throw new Error(error);
  }
, internals = new WeakMap
, getInternal = object => {
    var internal = internals.get(object);
    if (isNothing(internal)) throwError(ERROR_DISPOSED);
    return internal;
  }
, setInternal = (object, internal) => {
    internals.set(object, internal);
  };

class BusInternal {
  constructor(api, parameters) {
    this.Channel = extendChannel();
    this.Message = extendMessage();
    this.Section = extendSection();
    this.api = api;
    this.channels = new Map;
    this.delimiter = CHANNEL_HIERARCHY_DELIMITER;
    this.sealed = false;
    this.trace = noop;
    for (var i = 0, l = parameters.length; i < l; i++) {
      let parameter = parameters[i];
      switch (classof(parameter)) {
        case CLASS_FUNCTION:
          this.trace = parameter;
          break;
        case CLASS_OBJECT:
          extend(this.Channel.prototype, parameter.channel);
          extend(this.Message.prototype, parameter.message);
          extend(this.Section.prototype, parameter.section);
          break;
        case CLASS_STRING:
          if (parameter.length === 0) throwError(ERROR_DELIMITER);
          this.delimiter = parameter;
          break;
        default:
          throwError(ERROR_UNEXPECTED);
      }
    }
  }
  clear() {
    this.trace('clear', this.api);
    let channels = this.channels;
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    this.sealed = false;
  }
  resolveOne(name) {
    let channels = this.channels;
    let channel = channels.get(name);
    if (channel) return channel;
    let Channel = this.Channel;
    if (name === CHANNEL_NAME_ROOT || name === CHANNEL_NAME_ERROR) {
      channel = new Channel(this, name);
      channels.set(name, channel);
      return channel;
    }
    else if (!isString(name)) throwError(ERROR_NAME);
    else {
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
  resolveMany(names) {
    switch (names.length) {
      case 0: return this.resolveOne(CHANNEL_NAME_ROOT);
      case 1: return this.resolveOne(names[0]);
      default:
        let Section = this.Section;
        return new Section(this, names.map(name => this.resolveOne(name)));
    }
  }
  unsubscribe(subscriptions) {
    this.trace('unsubscribe', this.api, { subscriptions });
    for (let channel of this.channels.values()) channel.unsubscribe(...subscriptions);
  }
}

class IteratorInternal {
  constructor(parent, subscription) {
    this.done = false;
    this.messages = [];
    this.parent = parent;
    this.rejectors = [];
    this.resolvers = [];
    this.subscription = subscription;
  }
}

/**
 * Iterator class.
 */
class Iterator {
  constructor(parent) {
    let subscription = (data, message) => {
      let internal = getInternal(this), resolvers = internal.resolvers;
      if (resolvers.length) resolvers.shift()(message);
      else internal.messages.push(message);
    };
    parent.subscribe(subscription);
    setInternal(this, new IteratorInternal(parent, subscription));
    defineProperty(this, $CLASS, { value: CLASS_AEROBUS_ITERATOR });
  }
  /**
   * Ends iteration of this channel/section and closes the iterator.
   * @example
   * bus.root[Symbol.iterator]().done();
   * // => undefined
   */
  done() {
    let internal = getInternal(this);
    if (internal.done) return;
    internal.done = true;
    internal.parent.unsubscribe(internal.subscription);
    internal.rejectors.forEach(reject => reject());
  }
  /**
   * Advances iteration of this channel/section.
   * @returns {object} Object containing whether 'done' or 'value' properties. The 'done' property returns true if the iteration has been ended; otherwise the 'value' property returns a Promise resolving to the next message published to this channel/section.
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
    let internal = getInternal(this);
    if (internal.done) return { done: true };
    let messages = internal.messages, value = messages.length
      ? Promise.resolve(messages.shift())
      : new Promise((resolve, reject) => {
          internal.rejectors.push(reject);
          internal.resolvers.push(resolve);
        });
    return { value };
  }
}

class ChannelInternal {
  constructor(bus, parent) {
    let retentions = [];
    retentions.limit = 0;
    this.bus = bus;
    this.enabled = true;
    this.parent = parent;
    this.retentions = retentions;
    this.subscriptions = [];
  }
}

/**
 * Channel class.
 * @alias Channel
 * @property {bus} bus - The bus instance owning this channel.
 * @property {boolean} isEnabled - True if this channel and all its ancestors are enabled; otherwise false.
 * @property {string} name - The name if this channel (empty string for root channel).
 * @property {channel} parent - The parent channel (undefined for root and error channels).
 * @property {array} retentions - The list of retentions of this channel.
 * @property {array} subscriptions - The list of subscriptions to this channel.
 */
class ChannelBase {
  constructor(bus, name, parent) {
    setInternal(this, new ChannelInternal(bus, parent));
    defineProperties(this, {
      [$CLASS]: { value: CLASS_AEROBUS_CHANNEL }
    , bus: { value: bus.api, enumerable: true }
    , name: { value: name, enumerable: true }
    });
    if (isSomething(parent)) defineProperty(this, 'parent', { value: parent, enumerable: true });
    bus.trace('create', this);
  }
  get isEnabled() {
    return getInternal(this).enabled && (!this.parent || this.parent.isEnabled);
  }
  get retentions() {
    let retentions = getInternal(this).retentions, clone = [...retentions];
    clone.limit = retentions.limit;
    return clone;
  }
  get subscribers() {
    return getInternal(this).subscriptions.map(subscription => subscription.subscriber);
  }
  /**
   * Empties this channel. Removes all retentions and subscriptions.
   * @returns {Channel} - This channel.
   */
  clear() {
    let internal = getInternal(this);
    internal.bus.trace('clear', this);
    internal.retentions.length = internal.subscriptions.length = 0;
    return this;
  }
  disable() {
    let internal = getInternal(this);
    internal.bus.trace('disable', this);
    internal.enabled = false;
    return this;
  }
  enable(value = true) {
    value = !!value;
    let internal = getInternal(this);
    internal.bus.trace('enable', this, value);
    internal.enabled = value;
    return this;
  }
  /**
   * 
   */
  publish(data, callback) {
    if (isSomething(callback) && !isFunction(callback)) throwError(ERROR_CALLBACK);
    if (!this.isEnabled) return;
    let internal = getInternal(this)
      , bus = internal.bus
      , Message = bus.Message
      , message = new Message(this, data)
      , retentions = internal.retentions
      , subscriptions = internal.subscriptions;
    internal.bus.trace('publish', this, message);
    if (retentions.limit > 0) {
      retentions.push(message);
      if (retentions.length > retentions.limit) retentions.shift();
    }
    if (this.name === CHANNEL_NAME_ERROR) {
      if (callback) {
        let results = [];
        subscriptions.forEach(subscription => results.push(subscription.subscriber(message.error, message)));
        callback(results);
      }
      else subscriptions.forEach(subscription => subscription.subscriber(message.error, message));
      return this;
    }
    let parent = internal.parent;
    if (callback) {
      let results = [];
      if (parent) parent.publish(message, parentResults => results.push(...parentResults));
      subscriptions.forEach(subscription => {
        try {
          results.push(subscription.subscriber(message.data, message));
        }
        catch(error) {
          results.push(error);
          bus.resolveOne(CHANNEL_NAME_ERROR).publish(new Message(message, error), errorResults => error.results = errorResults);
        }
      });
      callback(results);
    }
    else {
      if (parent) parent.publish(message);
      subscriptions.forEach(subscription => {
        try {
          subscription.subscriber(message.data, message);
        }
        catch(error) {
          bus.resolveOne(CHANNEL_NAME_ERROR).publish(new Message(message, error));
        }
      });
    }
    return this;
  }
  /**
   * Resets this channel.
   * Removes all retentions and subscriptions, enables channel and sets retentions limit to 0.
   * @returns {Channel} This channel.
   */
  reset() {
    let internal = getInternal(this);
    internal.bus.trace('reset', this);
    internal.enabled = true;
    internal.retentions.limit = 0;
    internal.retentions.length = internal.subscriptions.length = 0;
    return this;
  }
  /**
   * Enables or disables retention policy for this channel.
   * Retention is a publication persisted in a channel for future subscriptions.
   * Every new subscription receives all the retentions right after subscribe.
   * @param {number} limit Optional number of latest retentions to persist.
   * When omitted or truthy, the channel retains Number.MAX_SAFE_INTEGER of publications.
   * When falsey, all retentions are removed and the channel stops retaining messages.
   * Otherwise the channel retains at most provided limit of messages.
   * @returns {Channel} This channel.
   */
  retain(limit) {
    let internal = getInternal(this)
      , retentions = internal.retentions;
    limit = arguments.length
      ? isNumber(limit)
        ? Math.max(limit, 0)
        : limit
          ? maxSafeInteger
          : 0
      : maxSafeInteger;
    internal.bus.trace('retain', this, limit);
    retentions.limit = limit;
    if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
    return this;
  }
  /**
   * Subscribes all provided subscribers to this channel.
   * If there are retained messages, notifies all the subscribers provided with all this messages.
   * @param {...function|number} parameters -
   * Subscriber functions to subscribe.
   * Or numeric order of this subscription (0 by default). Subscribers with greater order are invoked later.
   * @returns {Channel} This channel.
   * @example
   * var bus = aerobus(), subscriber0 = (data, message) => {}, subscriber1 = () => {}, subscriber2 = () => {};
   * bus.root.subscribe(2, subscriber0).subscribe(1, subscriber1, subscriber2);
   */
  subscribe(...parameters) {
    let internal = getInternal(this)
      , bus = internal.bus
      , Message = bus.Message
      , order = 0
      , retentions = internal.retentions
      , subscribers = []
      , subscriptions = internal.subscriptions;
    internal.bus.trace('subscribe', this, parameters);
    parameters.forEach(parameter => {
      switch (classof(parameter)) {
        case CLASS_FUNCTION:
          subscribers.push(parameter);
          break;
        case CLASS_NUMBER:
          order = parameter;
          break;
        default:
          throwError(ERROR_UNEXPECTED);
      }
    });
    let index = subscriptions.findIndex(subscription => subscription.order > order);
    -1 === index
      ? subscriptions.push(...subscribers.map(subscriber => ({order, subscriber})))
      : subscriptions.splice(index, 0, ...subscribers.map(subscriber => ({order, subscriber})));
    retentions.forEach(message => subscribers.forEach(subscriber => {
      try {
        subscriber(message.data, message);
      }
      catch(error) {
        bus.resolveOne(CHANNEL_NAME_ERROR).publish(new Message(message, error));
      }
    }));
    return this;
  }
  /**
   * Toggles state of this channel: enables if it is disabled and vice versa.
   * @returns {Channel} This channel.
   */
  toggle() {
    let internal = getInternal(this);
    internal.bus.trace('toggle', this);
    internal.enabled = !internal.enabled;
    return this;
  }
  /**
   * Unsubscribes all provided subscribers from this channel.
   * If no arguments specified, unsubscribes all subscribers.
   * @param {...function} subscribers - Subscribers to unsubscribe.
   * @returns {Channel} - This channel.
   */
  unsubscribe(...subscribers) {
    let internal = getInternal(this)
      , subscriptions = internal.subscriptions;
    internal.bus.trace('unsubscribe', this, subscribers);
    if (!subscribers.length) subscriptions.length = 0;
    else {
      let i = subscribers.length;
      while (--i >= 0 && subscriptions.length) {
        let subscriber = subscribers[i], j = 0;
        while (j < subscriptions.length)
          if (subscriptions[j].subscriber === subscriber) subscriptions.splice(j, 1);
          else j++;
      }
    }
    return this;
  }
  /**
   * Returns async iterator for this channel.
   * @alias Channel#@@iterator
   * @returns {Iterator} - New instance of the Iterator class.
   */
  [$ITERATOR]() {
    return new Iterator(this);
  }
}

function extendChannel() {
  return class Channel extends ChannelBase {
    constructor(bus, name, parent) {
      super(bus, name, parent);
    }
  }
}

/**
 * Message class.
 * @alias Message
 * @property {any} data - The published data.
 * @property {channel} channel - The channel this message is directed to.
 * @property {array} channels - The array of channels this message traversed.
 * @property {error} error - The error object if this message is reaction to an exception in some subscriber.
 */
class MessageBase {
  constructor(...components) {
    let channel, data, error, prior;
    components.forEach(component => {
      switch (classof(component)) {
        case CLASS_AEROBUS_CHANNEL:
          channel = component;
          break;
        case CLASS_AEROBUS_MESSAGE:
          prior = component;
          if (isNothing(data)) data = component.data;
          if (isNothing(error)) error = component.error;
          break;
        case CLASS_ERROR:
          error = component;
          break;
        default:
          data = component;
          break;
      }
    });
    defineProperties(this, {
      [$CLASS]: { value: CLASS_AEROBUS_MESSAGE }
    , channel: { value: channel, enumerable: true }
    , data: { value: data, enumerable: true }
    });
    if (isSomething(error)) defineProperty(this, 'error', { value: error, enumerable: true });
    if (isSomething(prior)) defineProperty(this, 'prior', { value: prior, enumerable: true });
  }
  get channels() {
    let channels = [this.channel], prior = this.prior;
    while (prior) {
      channels.push(prior.channel);
      prior = prior.prior;
    }
    return channels;
  }
}

function extendMessage() {
  return class Message extends MessageBase {
    constructor(...components) {
      super(...components);
    }
  }
}

class SectionIternal {
  constructor(bus, channels) {
    this.bus = bus;
    this.channels = channels;
  }
}

/**
 * Section class.
 * @alias Section
 * @property {array} channels - The array of channels this section bounds.
 */
class SectionBase {
  constructor(bus, channels) {
    setInternal(this, new SectionIternal(bus, channels));
    defineProperties(this, {
      bus: {value: bus.api}
    , [$CLASS]: {value: CLASS_AEROBUS_SECTION}
    });
  }
  get channels() {
    return [...getInternal(this).channels];
  }
  /**
   * Clears all bound channels.
   * @returns {Section} - This section.
   */
  clear() {
    getInternal(this).channels.forEach(channel => channel.clear());
    return this;
  }
  /**
   * Disables all bound channels.
   * @returns {Section} - This section.
   */
  disable() {
    getInternal(this).channels.forEach(channel => channel.disable());
    return this;
  }
  /**
   * Enables all bound channels.
   * @returns {Section} - This section.
   */
  enable(value) {
    getInternal(this).channels.forEach(channel => channel.enable(value));
    return this;
  }
  /**
   * Publishes data to all bound channels.
   * @param {any} data - The data to publish.
   * @param {function} callback -
   * The callback function which is invoked with array of responses of all notified sunscribers.
   * @returns {Section} - This section.
   */
  publish(data, callback) {
    getInternal(this).channels.forEach(channel => channel.publish(data, callback));
    return this;
  }
  /**
   * Resets all bound channels.
   * @returns {Section} - This section.
   */
  reset() {
    getInternal(this).channels.forEach(channel => channel.reset());
    return this;
  }
  /**
   * Subscribes all provided subscribers to all bound channels.
   * @param {...function} parameters - 
   * Subscriber function to subscribe. Subscriber function may accept two arguments (data, message),
   * where data is the published data and message - is the instance of Message class.
   * Or numeric order of this subscription (0 by default). Subscribers with greater order are invoked later.
   * @returns {Section} - This section.
   */
  subscribe(...parameters) {
    getInternal(this).channels.forEach(channel => channel.subscribe(...parameters));
    return this;
  }
  /**
   * Toggles enabled state of all bound channels.
   * @returns {Section} - This section.
   */
  toggle() {
    getInternal(this).channels.forEach(channel => channel.toggle());
    return this;
  }
  /**
   * Unsubscribes all provided subscribers from all bound channels.
   * @param {...function} subcriptions - Subscribers to unsubscribe.
   * @returns {Section} - This section.
   */
  unsubscribe(...subscribers) {
    getInternal(this).channels.forEach(channel => channel.unsubscribe(...subscribers));
    return this;
  }
  /**
   * Returns async iterator for this channel.
   * @alias Section#@@iterator
   * @returns {Iterator} - New instance of the Iterator class.
   */
  [$ITERATOR]() {
    return new Iterator(this);
  }
}

function extendSection() {
  return class Section extends SectionBase {
    constructor(bus, channels) {
      super(bus, channels);
    }
  }
}

/**
 * Message bus factory. Creates and returns new message bus instance.
 * @param {...string|function|object} parameters - 
 * The string delimiter of hierarchical channel names (dot by default).
 * Or the trace function, useful for debugging purposes.
 * Or the object with sets of extesions for aerobus internal classes: channel, message and section.
 * @returns {bus} New instance of message bus.
 * @example
 * let bus = aerobus(':', console.log.bind(console), {
 *  channel: {test: () => 'test'},
 *  message: {test: () => 'test'},
 *  section: {test: () => 'test'}
 * });
 */
function aerobus(...parameters) {
  let internal;
  /**
   * Message bus instance.
   * Resolves channels or set of channels (sections) depending on arguments provided.
   * After any channel is created, bus configuration is forbidden, 'delimiter' and 'trace' properties become read-only.
   * After bus is cleared, it can be configured again, 'delimiter' and 'trace' properties become read-write.
   * @global
   * @param {...names} names - Names of the channels to resolve. If not provided, returns the root channel.
   * @return {channel|section} - Single channel or section joining several channels into one logical unit.
   * @property {string} delimiter - The configured delimiter string for hierarchical channel names, writable while bus is empty.
   * @property {array} channels - The list of existing channels.
   * @property {channel} error - The error channel.
   * @property {channel} root - The root channel.
   * @property {function} trace - The configured trace function, writable while bus is empty.
   * @example
   * bus(), subscriber = () => {};
   * bus('test').subscribe(subscriber);
   * bus('test1', 'test2').disable().subscribe(subscriber);
   */
  function bus(...names) {
    return internal.resolveMany(names);
  }
  /**
   * Empties this bus. Removes all existing channels and permits bus configuration via 'delimiter' and 'trace' properties.
   * @alias bus.clear
   * @return {function} This bus.
   * @example
   * let bus = aerobus();
   * bus.clear();
   */
  function clear() {
    internal.clear();
    return bus;
  }
  function getChannels() {
    return Array.from(internal.channels.values());
  }
  function getDelimiter() {
    return internal.delimiter;
  }
  function setDelimiter(value) {
    if (internal.sealed) throwError(ERROR_FORBIDDEN);
    if (!isString(value) || value.length === 0) throwError(ERROR_DELIMITER);
    internal.delimiter = value;
  }
  function getError() {
    return internal.resolveOne(CHANNEL_NAME_ERROR);
  }
  function getRoot() {
    return internal.resolveOne(CHANNEL_NAME_ROOT);
  }
  function getTrace() {
    return internal.trace;
  }
  function setTrace(value) {
    if (internal.sealed) throwError(ERROR_FORBIDDEN);
    if (!isFunction(value)) throwError(ERROR_TRACE);
    internal.trace = value;
  }
  /**
   * Unsubscribes provided subscribers from all channels of this bus.
   * @alias bus.unsubscribe
   * @param {...function} subscribers - Subscribers to unsibscribe.
   * @return This bus.
   * let bus = aerobus(), subscriber0 = () => {}, subscriber1 = () => {};
   * bus.root.subscribe(subscriber0);
   * bus('example').subscribe(subscriber1);
   * bus.unsubscribe(subscriber0, subscriber1);
   */
  function unsubscribe(...subscribers) {
    internal.unsubscribe(subscribers);
    return bus;
  }
  internal = new BusInternal(bus, parameters);
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
}

export default aerobus;
