// todo: disable removed channels

'use strict';

const
  CHANNEL_HIERARCHY_DELIMITER = '.'
, CHANNEL_NAME_ERROR = 'error'
, CHANNEL_NAME_ROOT = ''

, ERROR_CALLBACK = 'Callback expected to be a function.'
, ERROR_DELIMITER = 'Delimiter expected to be not empty string.'
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

, array = Array.from
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
  : Object.getOwnPropertyNames(source).reduce(
    (result, name) => result.hasOwnProperty(name)
      ? result
      : defineProperty(result, name, Object.getOwnPropertyDescriptor(source, name))
  , target)
, throwError = error => {
    throw new Error(error);
  }
, contexts = new WeakMap;

class Bus {
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
    let channels = this.channels;
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    this.sealed = false;
  }
  getOne(name) {
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
  getMany(names) {
    switch (names.length) {
      case 0: return this.getOne(CHANNEL_NAME_ROOT);
      case 1: return this.getOne(names[0]);
      default:
        let Section = this.Section;
        return new Section(this, names.map(name => this.getOne(name)));
    }
  }
  unsubscribe(subscriptions) {
    for (let channel of this.channels.values()) channel.unsubscribe(...subscriptions);
  }
}

/**
 * Iterator class.
 */
class Iterator {
  constructor(parent) {
    let subscription = (data, message) => {
      let context = contexts.get(this), resolvers = context.resolvers;
      if (resolvers.length) resolvers.shift()(message);
      else context.messages.push(message);
    };
    defineProperty(this, $CLASS, { value: CLASS_AEROBUS_ITERATOR });
    parent.subscribe(subscription);
    contexts.set(this, {
      done: false
    , messages: []
    , parent: parent
    , rejectors: []
    , resolvers: []
    , subscription: subscription
    });
  }
  /**
   * Ends iteration of this channel/section and closes the iterator.
   * @example
   * bus.root[Symbol.iterator]().done();
   * // => undefined
   */
  done() {
    let context = contexts.get(this);
    if (context.done) return;
    context.done = true;
    context.parent.unsubscribe(context.subscription);
    context.rejectors.forEach(reject => reject());
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
    let context = contexts.get(this);
    if (context.done) return { done: true };
    let messages = context.messages, value = messages.length
      ? Promise.resolve(messages.shift())
      : new Promise((resolve, reject) => {
          context.rejectors.push(reject);
          context.resolvers.push(resolve);
        });
    return { value };
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
    defineProperties(this, {
      [$CLASS]: { value: CLASS_AEROBUS_CHANNEL }
    , bus: { value: bus.api, enumerable: true }
    , name: { value: name, enumerable: true }
    });
    if (isSomething(parent)) defineProperty(this, 'parent', { value: parent, enumerable: true });
    let retentions = [];
    retentions.limit = 0;
    contexts.set(this, {
      bus: bus
    , enabled: true
    , parent: parent
    , retentions: retentions
    , subscriptions: []
    });
    bus.trace('create', this);
  }
  get isEnabled() {
    return contexts.get(this).enabled && (!this.parent || this.parent.isEnabled);
  }
  get retentions() {
    let retentions = contexts.get(this).retentions, clone = [...retentions];
    clone.limit = retentions.limit;
    return clone;
  }
  get subscribers() {
    return contexts.get(this).subscriptions.map(subscription => subscription.subscriber);
  }
  /**
   * Empties this channel. Removes all retentions and subscriptions.
   * @returns {Channel} - This channel.
   */
  clear() {
    let context = contexts.get(this);
    context.bus.trace('clear', this);
    context.retentions.length = context.subscriptions.length = 0;
    return this;
  }
  disable() {
    let context = contexts.get(this);
    if (context.enabled) {
      context.bus.trace('disable', this);
      context.enabled = false;
    }
    return this;
  }
  enable(value = true) {
    if (!value) return this.disable();
    let context = contexts.get(this);
    if (!context.enabled) {
      context.bus.trace('enable', this);
      context.enabled = true;
    }
    return this;
  }
  publish(data, callback) {
    if (isSomething(callback) && !isFunction(callback)) throwError(ERROR_CALLBACK);
    if (!this.isEnabled) return;
    let context = contexts.get(this)
      , bus = context.bus
      , Message = bus.Message
      , message = new Message(this, data)
      , retentions = context.retentions
      , subscriptions = context.subscriptions;
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
    let parent = context.parent;
    if (callback) {
      let results = [];
      if (parent) parent.publish(message, parentResults => results.push(...parentResults));
      subscriptions.forEach(subscription => {
        try {
          results.push(subscription.subscriber(message.data, message));
        }
        catch(error) {
          results.push(error);
          bus.getOne(CHANNEL_NAME_ERROR).publish(new Message(message, error), errorResults => error.results = errorResults);
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
          bus.getOne(CHANNEL_NAME_ERROR).publish(new Message(message, error));
        }
      });
    }
    return this;
  }
  /**
   * Enables or disables retention policy for this channel.
   * Retention is a publication persisted in a channel for future subscriptions.
   * Every new subscription receives all the retentions right after subscribe.
   * @param {number} limit Optional number of latest retentions to persist.
   * When omitted or truthy, the channel will retain Number.MAX_SAFE_INTEGER of publications.
   * When falsey, all retentions are removed and the channel stops retaining messages.
   * Otherwise the channel will retain at most provided limit of messages.
   * @returns {Channel} This channel.
   */
  retain(limit) {
    let context = contexts.get(this), retentions = context.retentions;
    retentions.limit = arguments.length
      ? isNumber(limit)
        ? Math.max(limit, 0)
        : limit
          ? maxSafeInteger
          : 0
      : maxSafeInteger;
    if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
    context.bus.trace('retain', this);
    return this;
  }
  /**
   * Resets this channel.
   * Removes all retentions and subscriptions, enables channel and sets retentions limit to 0.
   * @returns {Channel} This channel.
   */
  reset() {
    let context = contexts.get(this);
    context.bus.trace('reset', this);
    context.enabled = true;
    context.retentions.limit = 0;
    context.retentions.length = context.subscriptions.length = 0;
    return this;
  }
  /**
   * Subscribes all provided subscriptions to this channel.
   * If there are retained messages, notifies all the subscriptions provided with all this messages.
   * If no arguments specified, does nothing.
   * @param {...function} subscriptions - Subscriptions to subscribe.
   * @returns {Channel} This channel.
   */
  subscribe(...parameters) {
    let context = contexts.get(this)
      , bus = context.bus
      , Message = bus.Message
      , order = 0
      , retentions = context.retentions
      , subscribers = []
      , subscriptions = context.subscriptions;
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
        bus.getOne(CHANNEL_NAME_ERROR).publish(new Message(message, error));
      }
    }));
    return this;
  }
  /**
   * Toggles state of this channel: enables if it is disabled and vice versa.
   * @returns {Channel} This channel.
   */
  toggle() {
    contexts.get(this).enabled ? this.disable() : this.enable();
    return this;
  }
  /**
   * Unsubscribes all provided subscriptions from this channel.
   * If no arguments specified, unsubscribes all subscriptions.
   * @param {...function} subscriptions - Subscriptions to unsubscribe.
   * @returns {Channel} - This channel.
   */
  unsubscribe(...subscribers) {
    let context = contexts.get(this)
      , subscriptions = context.subscriptions;
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
 * @property {channel} channel - The channel this message was initially published to.
 * @property {error} error - The error object if this message is a reaction to an exception in some subscription.
 */
class MessageBase {
  constructor(...components) {
    let channel, data, error, origin;
    components.forEach(component => {
      switch (classof(component)) {
        case CLASS_AEROBUS_CHANNEL:
          channel = component;
          break;
        case CLASS_AEROBUS_MESSAGE:
          origin = component;
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
    if (isSomething(origin)) defineProperty(this, 'origin', { value: origin, enumerable: true });
  }
  get channels() {
    let channels = [this.channel], origin = this.origin;
    while (origin) {
      channels.push(origin.channel);
      origin = origin.origin;
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

/**
 * Section class.
 * @alias Section
 * @property {array} channels - The list of channels this section refers.
 */
class SectionBase {
  constructor(bus, channels) {
    contexts.set(this, {
      bus: bus
    , channels: channels
    });
    defineProperties(this, {
      bus: {value: bus.api}
    , [$CLASS]: {value: CLASS_AEROBUS_SECTION}
    });
  }
  get channels() {
    return [...contexts.get(this).channels];
  }
  /**
   * Clears all referred channels.
   * @returns {Section} - This section.
   */
  clear() {
    this.channels.forEach(channel => channel.clear());
    return this;
  }
  /**
   * Disables all referred channels.
   * @returns {Section} - This section.
   */
  disable() {
    this.channels.forEach(channel => channel.disable());
    return this;
  }
  /**
   * Enables all referred channels.
   * @returns {Section} - This section.
   */
  enable(value) {
    this.channels.forEach(channel => channel.enable(value));
    return this;
  }
  /**
   * Publishes data to all referred channels.
   * @param {any} data - The data to publish.
   * @param {function} callback - The callback function which will be called with responses of all notified sunscriptions collected to array.
   * @returns {Section} - This section.
   */
  publish(data, callback) {
    this.channels.forEach(channel => channel.publish(data, callback));
    return this;
  }
  /**
   * Resets all referred channels.
   * @returns {Section} - This section.
   */
  reset() {
    this.channels.forEach(channel => channel.reset());
    return this;
  }
  /**
   * Subscribes all provided subscriptions to all referred channels.
   * @param {...function} subcriptions - Subscriptions to subscribe.
   * @returns {Section} - This section.
   */
  subscribe(...subscriptions) {
    this.channels.forEach(channel => channel.subscribe(...subscriptions));
    return this;
  }
  /**
   * Toggles enabled state of all referred channels.
   * @returns {Section} - This section.
   */
  toggle() {
    this.channels.forEach(channel => channel.toggle());
    return this;
  }
  /**
   * Unsubscribes all provided subscriptions from all referred channels.
   * @param {...function} subcriptions - Subscriptions to unsubscribe.
   * @returns {Section} - This section.
   */
  unsubscribe(...subscriptions) {
    this.channels.forEach(channel => channel.unsubscribe(...subscriptions));
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
 * Message bus factory. Creates and returns new message bus.
 * @param {string} delimiter - The string delimiter of hierarchical channel names (dot by default).
 * @param {function} trace - The function consuming trace information, useful for debugging purposes.
 * @param {object} extensions - The object with extesions of internal classes: channel, message and section.
 * @returns {bus} New instance of message bus.
 * @example
 * var bus = aerobus(':', console.log.bind(console), {
 *  channel: {test: () => 'test'},
 *  message: {test: () => 'test'},
 *  section: {test: () => 'test'}
 * });
 * bus('channel');
 * // => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", ...
 * bus('channel1', 'channel2'); // returns a section
 * // => SectionExtended {Symbol(Symbol.toStringTag): "Aerobus.Section", ...
 */
function aerobus(...parameters) {
  let instance;
  /**
   * Message bus instance.
   * Resolves channels or sections (set of channels) depending on arguments.
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
   * bus();
   * // => Channel {name: "", Symbol(Symbol.toStringTag): "Aerobus.Channel"}
   * bus('test');
   * // => Channel {name: "test", parent: Channel, Symbol(Symbol.toStringTag): "Aerobus.Channel"}
   * bus('test1', 'test2');
   * // => Section {Symbol(Symbol.toStringTag): "Aerobus.Section"}
   */
  function bus(...names) {
    return instance.getMany(names);
  }
  /**
   * Empties this bus. Removes all existing channels and permits bus configuration via 'delimiter' and 'trace' properties.
   * @alias bus.clear
   * @return {function} This message bus.
   * @example
   * bus.clear();
   * // => function bus() { ...
   */
  function clear() {
    instance.clear();
    return bus;
  }
  function getChannels() {
    return array(instance.channels.values());
  }
  function getDelimiter() {
    return instance.delimiter;
  }
  function setDelimiter(value) {
    if (instance.sealed) throwError(ERROR_FORBIDDEN);
    if (!isString(value) || value.length === 0) throwError(ERROR_DELIMITER);
    instance.delimiter = value;
  }
  function getError() {
    return instance.getOne(CHANNEL_NAME_ERROR);
  }
  function getRoot() {
    return instance.getOne(CHANNEL_NAME_ROOT);
  }
  function getTrace() {
    return instance.trace;
  }
  function setTrace(value) {
    if (instance.sealed) throwError(ERROR_FORBIDDEN);
    if (!isFunction(value)) throwError(ERROR_TRACE);
    instance.trace = value;
  }
  /**
   * Unsubscribes provided subscriptions from all channels of this bus.
   * @alias bus.unsubscribe
   * @param {...function} subscriptions - Subscriptions to unsibscribe.
   * @return This message bus.
   */
  function unsubscribe(...subscriptions) {
    instance.unsubscribe(subscriptions);
    return bus;
  }
  instance = new Bus(bus, parameters);
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
