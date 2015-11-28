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

, $CHANNEL = Symbol('channel')
, $BUS = Symbol('bus')
, $CHANNELS = Symbol('channels')
, $DATA = Symbol('data')
, $DONE = Symbol('done')
, $ENABLED = Symbol('enabled')
, $CHANNEL_NAME_ERROR = Symbol('error')
, $MESSAGES = Symbol('messages')
, $NAME = Symbol('name')
, $PARENT = Symbol('parent')
, $RETENTIONS = Symbol('retentions')
, $RESOLVERS = Symbol('resolvers')
, $REJECTORS = Symbol('rejectors')
, $SUBSCRIPTION = Symbol('subscription')
, $SUBSCRIPTIONS = Symbol('subscriptions')

, maxSafeInteger = Number.MAX_SAFE_INTEGER

, classof = Object.classof
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
      : Object.defineProperty(result, name, Object.getOwnPropertyDescriptor(source, name))
  , target)
, throwError = error => {
    throw new Error(error);
  };

class Iterator {
  constructor(parent) {
    let subscription = (data, message) => {
      let resolves = this[$RESOLVERS];
      if (resolves.length) resolves.shift()(message);
      else this[$MESSAGES].push(message);
    };
    Object.defineProperties(this, {
      [$CLASS]: {value: CLASS_AEROBUS_ITERATOR}
    , [$DONE]: {value: false, writable: true}
    , [$MESSAGES]: {value: []}
    , [$PARENT]: {value: parent}
    , [$REJECTORS]: {value: []}
    , [$RESOLVERS]: {value: []}
    , [$SUBSCRIPTION]: {value: subscription}
    });
    parent.subscribe(subscription);
  }
  /**
   * Ends iteration of this channel/section and closes the iterator.
   * @example
   * bus.root[Symbol.iterator]().done();
   * // => undefined
   */
  done() {
    if (this[$DONE]) return;
    this[$DONE] = true;
    this[$PARENT].unsubscribe(this[$SUBSCRIPTION]);
    this[$REJECTORS].forEach(reject => reject());
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
    if (this[$DONE]) return { done: true };
    let messages = this[$MESSAGES], value = messages.length
      ? Promise.resolve(messages.shift())
      : new Promise((resolve, reject) => {
          this[$REJECTORS].push(reject);
          this[$RESOLVERS].push(resolve);
        });
    return { value };
  }
}

/**
 * Channel class.
 */
class Channel {
  constructor(bus, name, parent) {
    let retentions = [];
    retentions.limit = 0;
    retentions.period = 0;
    Object.defineProperties(this, {
      [$BUS]: {value: bus}
    , [$CLASS]: {value: CLASS_AEROBUS_CHANNEL}
    , [$ENABLED]: {value: true, writable: true}
    , [$NAME]: {value: name}
    , [$PARENT]: {value: parent}
    , [$RETENTIONS] : {value: retentions}
    , [$SUBSCRIPTIONS]: {value: []}
    });
    bus.trace('create', this);
  }
  /**
   * Returns the bus instance owning this channel.
   * @returns {function}
   */
  get bus() {
    return this[$BUS];
  }
  /**
   * Returns true if this channel is enabled; otherwise false.
   * @returns {boolean}
   */
  get isEnabled() {
    return this[$ENABLED] && (!this[$PARENT] || this[$PARENT].isEnabled);
  }
  /**
   * Returns the name if this channel (empty string for root channel).
   * @returns {string}
   */
  get name() {
    return this[$NAME];
  }
  /**
   * Returns the parent channel (undefined for root and error channels).
   * @returns {channel}
   */
  get parent() {
    return this[$PARENT];
  }
  /**
   * Returns clone of retentions array of this channel. Retention is a publication persisted in a channel for future subscriptions. Every new subscription receives all the retentions right after subscribe.
   * @returns {array}
   */
  get retentions() {
    let retentions = this[$RETENTIONS], clone = [...retentions];
    clone.limit = retentions.limit;
    return clone;
  }
  /**
   * Returns clone of subscriptions array of this channels.
   * @returns {array}
   */
  get subscriptions() {
    return [...this[$SUBSCRIPTIONS]];
  }
  /**
   * Empties this channel removing all the retentions/subscriptions. The enabled status and retentions limit setting are kept.
   * @returns {channel} This channel.
   */
  clear() {
    this[$BUS].trace('clear', this);
    this[$RETENTIONS].length = this[$SUBSCRIPTIONS].length = 0;
    return this;
  }
  disable() {
    if (this[$ENABLED]) {
      this[$BUS].trace('disable', this);
      this[$ENABLED] = false;
    }
    return this;
  }
  enable(enable = true) {
    if (!enable) return this.disable();
    if (!this[$ENABLED]) {
      this[$BUS].trace('enable', this);
      this[$ENABLED] = true;
    }
    return this;
  }
  publish(data, callback) {
    if (isSomething(callback) && !isFunction(callback)) throwError(ERROR_CALLBACK);
    if (!this.isEnabled) return;
    let bus = this[$BUS], message = bus.message(this, data), subscriptions = this[$SUBSCRIPTIONS];
    let retentions = this[$RETENTIONS];
    if (retentions.limit > 0) {
      retentions.push(message);
      if (retentions.length > retentions.limit) retentions.shift();
    }
    if (this[$NAME] === CHANNEL_NAME_ERROR) {
      if (callback) {
        let results = [];
        subscriptions.forEach(subscription => results.push(subscription(message.error, message)));
        callback(results);
      }
      else subscriptions.forEach(subscription => subscription(message.error, message));
      return this;
    }
    let parent = this[$PARENT];
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
   * @param {number} limit Optional number of latest retentions to persist. If not provided or truthy, the channel will retain Number.MAX_SAFE_INTEGER of publications. When falsey, all retentions are removed and the channel stops retaining messages. Otherwise the channel will retain at most limit messages.
   * @returns {channel} This channel.
   */
  retain(limit) {
    let retentions = this[$RETENTIONS];
    retentions.limit = arguments.length
      ? isNumber(limit)
        ? Math.max(limit, 0)
        : limit
          ? maxSafeInteger
          : 0
      : maxSafeInteger;
    if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
    this[$BUS].trace('retain', this);
    return this;
  }
  /**
   * Resets this channel enabling it, removing all the retentions/subscriptions and setting retentions limit to 0.
   * @returns {channel} This channel.
   */
  reset() {
    this[$BUS].trace('reset', this);
    this.clear();
    this[$ENABLED] = true;
    this[$RETENTIONS].limit = 0;
    return this;
  }
  /**
   * Subscribes all provided subscriptions to this channel. If no arguments specified, does nothing. If there are retentions in this channel, notifies all the subscriptions provided with all retained messages.
   * @param {...function} subscriptions Subscriptions to subscribe.
   * @returns {channel} This channel.
   */
  subscribe(...subscriptions) {
    if (!subscriptions.every(isFunction)) throwError(ERROR_SUBSCRIBTION);
    this[$SUBSCRIPTIONS].push(...subscriptions);
    this[$RETENTIONS].forEach(message => subscriptions.forEach(subscription => subscription(message.data, message)));
    return this;
  }
  /**
   * Toggles enabled status of this channel. Enables the channel when it is disabled and vice versa.
   * @returns {channel} This channel.
   */
  toggle() {
    this[$ENABLED] ? this.disable() : this.enable();
    return this;
  }
  /**
   * Unsubscribes all provided subscriptions from this channel. If no arguments specified, unsubscribes all subscriptions.
   * @param {...function} subscriptions Subscriptions to unsubscribe.
   * @returns {channel} This channel.
   */
  unsubscribe(...subscriptions) {
    if (subscriptions.length) {
      let list = this[$SUBSCRIPTIONS];
      subscriptions.forEach((subscription) => {
        let index = list.indexOf(subscription);
        if (index !== -1) list.splice(index, 1);
      });
    }
    else this[$SUBSCRIPTIONS].length = 0;
    return this;
  }
  /**
   * Returns async iterator for this channel.
   * @returns {iterator}
   */
  [$ITERATOR]() {
    return new Iterator(this);
  }
}

class Message {
  constructor(...components) {
    let channel, data, error;
    components.forEach(component => {
      switch (classof(component)) {
        case CLASS_AEROBUS_CHANNEL:
          if (isNothing(channel)) channel = component[$NAME];
          break;
        case CLASS_AEROBUS_MESSAGE:
          if (isNothing(channel)) channel = component[$CHANNEL];
          if (isNothing(data)) data = component[$DATA];
          if (isNothing(error)) error = component[$CHANNEL_NAME_ERROR];
          break;
        case CLASS_ERROR:
        if (isNothing(error)) error = component;
          break;
        default:
          if (isNothing(data)) data = component;
          break;
      }
    });
    Object.defineProperties(this, {
      [$CHANNEL]: {value: channel, enumerable: true}
    , [$CLASS]: {value: CLASS_AEROBUS_MESSAGE}
    , [$DATA]: {value: data, enumerable: true}
    });
    if (isSomething(error)) Object.defineProperty(this, $CHANNEL_NAME_ERROR, {value: error, enumerable: true});
  }
  get channel() {
    return this[$CHANNEL];
  }
  get data() {
    return this[$DATA];
  }
  get error() {
    return this[$CHANNEL_NAME_ERROR];
  }
}

class Section {
  constructor(bus, channels) {
    defineProperties(this, {
      [$BUS]: {value: bus}
    , [$CLASS]: {value: CLASS_AEROBUS_SECTION}
    , [$CHANNELS]: {value: channels}
    });
  }
  get bus() {
    return this[$BUS];
  }
  get channels() {
    return [...this[$CHANNELS]];
  }
  clear() {
    this[$CHANNELS].forEach(channel => channel.clear());
    return this;
  }
  disable() {
    this[$CHANNELS].forEach(channel => channel.disable());
    return this;
  }
  enable(value) {
    this[$CHANNELS].forEach(channel => channel.enable(value));
    return this;
  } 
  publish(data, callback) {
    this[$CHANNELS].forEach(channel => channel.publish(data, callback));
    return this;
  }
  subscribe(...subscriptions) {
    this[$CHANNELS].forEach(channel => channel.subscribe(...subscriptions));
    return this;
  }
  toggle() {
    this[$CHANNELS].forEach(channel => channel.toggle());
    return this;
  } 
  unsubscribe(...subscriptions) {
    this[$CHANNELS].forEach(channel => channel.unsubscribe(...subscriptions));
    return this;
  }
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
 * Creates new message bus. A message bus is a function returning channel or section (set of channels).
 * @param {string} delimiter String delimiter of hierarchical channel names (dot by default).
 * @param {function} trace Function consuming trace information, useful for debugging purposes.
 * @param {object} extensions Object containing sets of extesions for standard aerobus classes: channel, message and section.
 * @returns {function} New instance of message bus.
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
  let ChannelExtended = subclassChannel()
    , MessageExtended = subclassMessage()
    , SectionExtended = subsclassSection()
    , channels = new Map
    , config = {
          delimiter: CHANNEL_HIERARCHY_DELIMITER
        , isSealed: false
        , trace: noop
      };
  parameters.forEach(parameter => {
    switch (classof(parameter)) {
      case CLASS_FUNCTION:
        config.trace = parameter;
        break;
      case CLASS_OBJECT:
        extend(ChannelExtended.prototype, parameter.channel);
        extend(MessageExtended.prototype, parameter.message);
        extend(SectionExtended.prototype, parameter.section);
        break;
      case CLASS_STRING:
        if (parameter.length === 0) throwError(ERROR_DELIMITER);
        config.delimiter = parameter;
        break;
    }
  });
  return Object.defineProperties(bus, {
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
   * The message bus instance. Exposed as function returned from aerobus call. Resolves channels or sections (set of channels) depending on the argument number. As message bus creates any channel, its configuration throught 'delimiter' and 'trace' properties becomes forbidden.
   * @param {...names} names Names of the channels to resolve. If not provided, returns the root channel.
   * @return {channel|section} Single channel or section joining several channels into one logical unit.
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
      case 0: return retrieve(CHANNEL_NAME_ROOT);
      case 1: return retrieve(names[0]);
      default: return new SectionExtended(bus, names.map(name => retrieve(name)));
    }
  }
  /**
   * Empties message bus removing all existing channels and permitting bus configuration through 'delimiter' and 'trace' properties.
   * @return {function} This message bus.
   * @example
   * bus.clear();
   * // => function bus() { ...
   */
  function clear() {
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    config.isSealed = false;
    return bus;
  }
  /**
   * Exposed as readonly 'channels' property of the message bus. Gets array of existing channels.
   * @return {array} List of existing channels.
   * @example
   * bus.channels;
   * // => [ChannelExtended, ...]
   */
  function getChannels() {
    return Array.from(channels.values());
  }
  /**
   * Exposed as readable 'delimiter' property of this message bus. Gets the configured hierarchical channel name delimiter string.
   * @return The delimiter string.
   * @example
   * bus.delimiter;
   * // => '.'
   */
  function getDelimiter() {
    return config.delimiter;
  }
  /**
   * Exposed as writable 'delimiter' property of this message bus. Sets delimiter string for hierarchical channel names. If the message bus is not empty (contains channels), throws error.
   * @param {string} value The delimiter to use for splitting a channel name.
   * @return This message bus.
   */
  function setDelimiter(value) {
    if (config.isSealed) throwError(ERROR_FORBIDDEN);
    if (!isString(value) || value.length === 0) throwError(ERROR_DELIMITER);
    config.delimiter = value;
  }
  /**
   * Exposed as 'error' property of this message bus. Resolves error channel.
   * @return The error channel.
   * @example
   * bus.error;
   * // => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", ...
   */
  function getError() {
    return retrieve(CHANNEL_NAME_ERROR);
  }
  /**
   * Exposed as 'root' property of this message bus. Resolves root channel.
   * @return The root channel.
   * @example
   * bus.root;
   * // => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", ...
   */
  function getRoot() {
    return retrieve(CHANNEL_NAME_ROOT);
  }
  /**
   * Exposed as 'trace' property of this message bus. Gets the configured trace function.
   * @return The trace function.
   * @example
   * bus.trace;
   * // => function () { ...
   */
  function getTrace() {
    return config.trace;
  }
  /**
   * Sets trace function for this message bus. If the message bus is not empty (contains channels), throws error.
   * @param {function} value The function to use for trace.
   * @return This message bus.
   */
  function setTrace(value) {
    if (config.isSealed) throwError(ERROR_FORBIDDEN);
    if (!isFunction(value)) throwError(ERROR_TRACE);
    config.trace = value;
  }
  function message(...components) {
    return new MessageExtended(...components);
  }
  function retrieve(name) {
    let channel = channels.get(name);
    if (!channel) {
      let parent;
      if (name !== CHANNEL_NAME_ROOT && name !== CHANNEL_NAME_ERROR) {
          if (!isString(name)) throwError(ERROR_NAME);
          let index = name.indexOf(config.delimiter);
          parent = retrieve(-1 === index ? CHANNEL_NAME_ROOT : name.substr(0, index));
      }
      channel = new ChannelExtended(bus, name, parent);
      config.isSealed = true;
      channels.set(name, channel);
    }
    return channel;
  }
  /**
   * Unsubscribes provided subscriptions from all the channels.
   * @param {...function} subscriptions Subscriptions to unsibscribe.
   * @return This message bus.
   */
  function unsubscribe(...subscriptions) {
    for (let channel of channels.values()) channel.unsubscribe(...subscriptions);
    return bus;
  }
}

export default aerobus;
