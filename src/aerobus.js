'use strict';

const
  CHANNEL_HIERARCHY_DELIMITER = '.'
, CHANNEL_NAME_ERROR = 'error'
, CHANNEL_NAME_ROOT = ''

, ERROR_CALLBACK = 'Callback expected to be a function.'
, ERROR_DELIMITER = 'Delimiter expected to be not empty string.'
, ERROR_FORBIDDEN = 'This operation is forbidden for not empty bus instance.'
, ERROR_NAME = 'Name expected to be string.'
, ERROR_SUBSCRIBTION = 'Subscription expected to be a function.'
, ERROR_TRACE = 'Trace expected to be a function.'

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
  : Object.getOwnPropertyNames(source).reduce(
    (result, name) => result.hasOwnProperty(name)
      ? result
      : defineProperty(result, name, Object.getOwnPropertyDescriptor(source, name))
  , target)
, throwError = error => {
    throw new Error(error);
  }
, contexts = new WeakMap;

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
 * @property {bus} bus - The bus instance owning this channel.
 * @property {boolean} isEnabled - True if this channel and all its ancestors are enabled; otherwise false.
 * @property {string} name - The name if this channel (empty string for root channel).
 * @property {channel} parent - The parent channel (undefined for root and error channels).
 * @property {array} retentions - The list of retentions of this channel.
 * @property {array} subscriptions - The list of subscriptions to this channel.
 */
class Channel {
  constructor(bus, name, parent) {
    defineProperties(this, {
      [$CLASS]: { value: CLASS_AEROBUS_CHANNEL }
    , bus: { value: bus, enumerable: true }
    , name: { value: name, enumerable: true }
    });
    if (isSomething(parent)) defineProperty(this, 'parent', { value: parent, enumerable: true });
    let retentions = [];
    retentions.limit = 0;
    contexts.set(this, {
      enabled: true
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
  get subscriptions() {
    return [...contexts.get(this).subscriptions];
  }
  /**
   * Empties this channel. Removes all retentions and subscriptions.
   * @returns {Channel} - This channel.
   */
  clear() {
    this.bus.trace('clear', this);
    let context = contexts.get(this);
    context.retentions.length = context.subscriptions.length = 0;
    return this;
  }
  disable() {
    let context = contexts.get(this);
    if (context.enabled) {
      this.bus.trace('disable', this);
      context.enabled = false;
    }
    return this;
  }
  enable(value = true) {
    if (!value) return this.disable();
    let context = contexts.get(this);
    if (!context.enabled) {
      this.bus.trace('enable', this);
      context.enabled = true;
    }
    return this;
  }
  publish(data, callback) {
    if (isSomething(callback) && !isFunction(callback)) throwError(ERROR_CALLBACK);
    if (!this.isEnabled) return;
    let bus = this.bus, context = contexts.get(this), message = bus.message(this, data), retentions = context.retentions;
    if (retentions.limit > 0) {
      retentions.push(message);
      if (retentions.length > retentions.limit) retentions.shift();
    }
    let subscriptions = context.subscriptions;
    if (this.name === CHANNEL_NAME_ERROR) {
      if (callback) {
        let results = [];
        subscriptions.forEach(subscription => results.push(subscription(message.error, message)));
        callback(results);
      }
      else subscriptions.forEach(subscription => subscription(message.error, message));
      return this;
    }
    let parent = this.parent;
    if (callback) {
      let results = [];
      if (parent) parent.publish(message, parentResults => results.push(...parentResults));
      subscriptions.forEach(subscription => {
        try {
          results.push(subscription(message.data, message));
        }
        catch(error) {
          results.push(error);
          bus.error.publish(bus.message(message, error), errorResults => error.results = errorResults);
        }
      });
      callback(results);
    }
    else {
      if (parent) parent.publish(message);
      subscriptions.forEach(subscription => {
        try {
          subscription(message.data, message);
        }
        catch(error) {
          bus.error.publish(bus.message(message, error));
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
    let retentions = contexts.get(this).retentions;
    retentions.limit = arguments.length
      ? isNumber(limit)
        ? Math.max(limit, 0)
        : limit
          ? maxSafeInteger
          : 0
      : maxSafeInteger;
    if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
    this.bus.trace('retain', this);
    return this;
  }
  /**
   * Resets this channel.
   * Removes all retentions and subscriptions, enables channel and sets retentions limit to 0.
   * @returns {Channel} This channel.
   */
  reset() {
    let context = contexts.get(this);
    this.bus.trace('reset', this);
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
  subscribe(...subscriptions) {
    if (!subscriptions.every(isFunction)) throwError(ERROR_SUBSCRIBTION);
    let context = contexts.get(this);
    context.subscriptions.push(...subscriptions);
    context.retentions.forEach(message => subscriptions.forEach(subscription => subscription(message.data, message)));
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
  unsubscribe(...subscriptions) {
    let existing = contexts.get(this).subscriptions;
    if (subscriptions.length) subscriptions.forEach((subscription) => {
      let index = existing.indexOf(subscription);
      if (index !== -1) existing.splice(index, 1);
    });
    else existing.length = 0;
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

/**
 * Message class.
 * @property {any} data - The published data.
 * @property {channel} channel - The channel this message was initially published to.
 * @property {error} error - The error object if this message is a reaction to an exception in some subscription.
 */
class Message {
  constructor(...components) {
    let channel, data, error;
    components.forEach(component => {
      switch (classof(component)) {
        case CLASS_AEROBUS_CHANNEL:
          if (isNothing(channel)) channel = component.name;
          break;
        case CLASS_AEROBUS_MESSAGE:
          if (isNothing(channel)) channel = component.channel;
          if (isNothing(data)) data = component.data;
          if (isNothing(error)) error = component.error;
          break;
        case CLASS_ERROR:
        if (isNothing(error)) error = component;
          break;
        default:
          if (isNothing(data)) data = component;
          break;
      }
    });
    defineProperties(this, {
      [$CLASS]: { value: CLASS_AEROBUS_MESSAGE }
    , channel: { value: channel, enumerable: true }
    , data: { value: data, enumerable: true }
    });
    if (isSomething(error)) defineProperty(this, 'error', { value: error, enumerable: true });
  }
}

/**
 * Section class.
 * @property {array} channels - The list of channels this section refers.
 */
class Section {
  constructor(bus, channels) {
    contexts.set(this, {
      channels: channels
    });
    defineProperties(this, {
      bus: {value: bus}
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

function subclassChannel() {
  return class ChannelExtended extends Channel {
    constructor(bus, name, parent) {
      super(bus, name, parent);
    }
  }
}

function subclassMessage() {
  return class MessageExtended extends Message {
    constructor(...components) {
      super(...components);
    }
  }
}

function subsclassSection() {
  return class SectionExtended extends Section {
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
  let channels = new Map, delimiter = CHANNEL_HIERARCHY_DELIMITER, sealed = false, trace = noop
    , Channel = subclassChannel(), Message = subclassMessage(), Section = subsclassSection();
  parameters.forEach(parameter => {
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
        if (parameter.length === 0) throwError(ERROR_DELIMITER);
        delimiter = parameter;
        break;
    }
  });
  return defineProperties(bus, {
    clear: {value: clear}
  , create: {value: aerobus}
  , channels: {get: getChannels}
  , delimiter: {get: getDelimiter, set: setDelimiter}
  , error: {get: getError}
  , message: {value: message}
  , root: {get: getRoot}
  , trace: {get: getTrace, set: setTrace}
  , unsubscribe: {value: unsubscribe}
  });
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
   * // => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", Symbol(name): "" ...
   * bus('test');
   * // => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", Symbol(name): "test" ...
   * bus('test1', 'test2');
   * // => SectionExtended {Symbol(Symbol.toStringTag): "Aerobus.Section", Symbol(channels): Array[2] ...
   */
  function bus(...names) {
    switch (names.length) {
      case 0: return resolve(CHANNEL_NAME_ROOT);
      case 1: return resolve(names[0]);
      default: return new Section(bus, names.map(name => resolve(name)));
    }
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
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    sealed = false;
    return bus;
  }
  function getChannels() {
    return Array.from(channels.values());
  }
  function getDelimiter() {
    return delimiter;
  }
  function setDelimiter(value) {
    if (sealed) throwError(ERROR_FORBIDDEN);
    if (!isString(value) || value.length === 0) throwError(ERROR_DELIMITER);
    delimiter = value;
  }
  function getError() {
    return resolve(CHANNEL_NAME_ERROR);
  }
  function getRoot() {
    return resolve(CHANNEL_NAME_ROOT);
  }
  function getTrace() {
    return trace;
  }
  function setTrace(value) {
    if (sealed) throwError(ERROR_FORBIDDEN);
    if (!isFunction(value)) throwError(ERROR_TRACE);
    trace = value;
  }
  function message(...components) {
    return new Message(...components);
  }
  function resolve(name) {
    let channel = channels.get(name);
    if (!channel) {
      let parent;
      if (name !== CHANNEL_NAME_ROOT && name !== CHANNEL_NAME_ERROR) {
          if (!isString(name)) throwError(ERROR_NAME);
          let index = name.indexOf(delimiter);
          parent = resolve(-1 === index ? CHANNEL_NAME_ROOT : name.substr(0, index));
      }
      channel = new Channel(bus, name, parent);
      sealed = true;
      channels.set(name, channel);
    }
    return channel;
  }
  /**
   * Unsubscribes provided subscriptions from all channels of this bus.
   * @alias bus.unsubscribe
   * @param {...function} subscriptions - Subscriptions to unsibscribe.
   * @return This message bus.
   */
  function unsubscribe(...subscriptions) {
    for (let channel of channels.values()) channel.unsubscribe(...subscriptions);
    return bus;
  }
}

export default aerobus;
