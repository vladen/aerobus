/*
  bus.root.subscribe().after('name', 1).once()
  bus.root.subscribe().until('name').once()
  bus.root.subscribe().once()
  bus.root.subscribe().cycle()
  bus.root.subscribe().random()
*/

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
  done() {
    if (this[$DONE]) return;
    this[$DONE] = true;
    this[$PARENT].unsubscribe(this[$SUBSCRIPTION]);
    this[$REJECTORS].forEach(reject => reject());
  }
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

class Channel {
  constructor(bus, name, parent) {
    let retentions = [];
    retentions.limit = 0;
    retentions.period = 0;
    Object.defineProperties(this, {
      [$BUS]: {value: bus}
    , [$CLASS]: {value: CLASS_AEROBUS_CHANNEL}
    , [$ENABLED]: {value: true, writable: true}
    , [$NAME]: {value: name, enumerable: true}
    , [$PARENT]: {value: parent}
    , [$RETENTIONS] : {value: retentions}
    , [$SUBSCRIPTIONS]: {value: []}
    });
    bus.trace('create', this);
  }
  get bus() {
    return this[$BUS];
  }
  get isEnabled() {
    return this[$ENABLED] && (!this[$PARENT] || this[$PARENT].isEnabled);
  }
  get name() {
    return this[$NAME];
  }
  get parent() {
    return this[$PARENT];
  } 
  get retentions() {
    let retentions = this[$RETENTIONS], clone = [...retentions];
    clone.limit = retentions.limit;
    return clone;
  }
  get root() {
    return this[$BUS].root;
  } 
  get subscriptions() {
    return [...this[$SUBSCRIPTIONS]];
  }
  clear() {
    this[$BUS].trace('clear', this);
    this[$ENABLED] = true;
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
  subscribe(...subscriptions) {
    if (!subscriptions.every(isFunction)) throwError(ERROR_SUBSCRIBTION);
    this[$SUBSCRIPTIONS].push(...subscriptions);
    this[$RETENTIONS].forEach(message => subscriptions.forEach(subscription => subscription(message.data, message)));
    return this;
  }
  toggle() {
    this[$ENABLED] ? this.disable() : this.enable();
    return this;
  }
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
    this[$BUS] = bus;
    this[$CLASS] = CLASS_AEROBUS_SECTION;
    this[$CHANNELS] = channels;
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
  function bus(...names) {
    switch (names.length) {
      case 0: return retrieve(CHANNEL_NAME_ROOT);
      case 1: return retrieve(names[0]);
      default: return new SectionExtended(bus, names.map(name => retrieve(name)));
    }
  }
  function clear() {
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    config.isSealed = false;
    return bus;
  }
  function getChannels() {
    return Array.from(channels.values());
  }
  function getDelimiter() {
    return config.delimiter;
  }
  function setDelimiter(value) {
    if (config.isSealed) throwError(ERROR_FORBIDDEN);
    if (!isString(value) || value.length === 0) throwError(ERROR_DELIMITER);
    config.delimiter = value;
  }
  function getError() {
    return retrieve(CHANNEL_NAME_ERROR);
  }
  function getRoot() {
    return retrieve(CHANNEL_NAME_ROOT);
  }
  function getTrace() {
    return config.trace;
  }
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
  function unsubscribe(...subscribers) {
    for (let channel of channels.values()) channel.unsubscribe(...subscribers);
    return bus;
  }
}

export default aerobus;
