'use strict';

const DELIMITER = '.', ERROR = 'error', ROOT = '';

const
  ERROR_DELIMITER = 'Delimiter expected to be a string.'
, ERROR_FORBIDDEN = 'This operation is forbidden for not empty bus instance.'
, ERROR_NAME = 'Name expected to be string.'
, ERROR_SUBSCRIBER = 'Subscriber expected to be a function.'
, ERROR_TRACE = 'Trace expected to be a function.'

, AEROBUS = 'Aerobus'
, CLASS_AEROBUS_CHANNEL = AEROBUS + DELIMITER + 'Channel'
, CLASS_AEROBUS_ITERATOR = AEROBUS + DELIMITER + 'Iterator'
, CLASS_AEROBUS_MESSAGE = AEROBUS + DELIMITER + 'Message'
, CLASS_AEROBUS_SECTION = AEROBUS + DELIMITER + 'Section'
, CLASS_ERROR = 'Error'
, CLASS_FUNCTION = 'Function'
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
, $ERROR = Symbol('error')
, $MESSAGES = Symbol('messages')
, $NAME = Symbol('name')
, $PARENT = Symbol('parent')
, $RETENTIONS = Symbol('retentions')
, $RESOLVERS = Symbol('resolvers')
, $REJECTORS = Symbol('rejectors')
, $SUBSCRIBERS = Symbol('subscribers')
, $SUBSCRIPTION = Symbol('subscription')

, array = Array.from
, assign = Object.assign
, classof = Object.classof
, defineProperties = Object.defineProperties
, defineProperty = Object.defineProperty
, isFunction = value => classof(value) === CLASS_FUNCTION
, isNothing = value => value == null
, isSomething = value => value != null
, isString = value => classof(value) === CLASS_STRING
, noop = () => {}
, throwError = error => {
    throw new Error(error);
  };

function aerobus(...parameters) {
  class ChannelBase {}
  class MessageBase {}
  class SectionBase {}
  let channels = new Map
    , config = {
        delimiter: DELIMITER
      , isSealed: false
      , trace: noop
    };
  parameters.forEach(parameter => {
    switch (classof(parameter)) {
      case CLASS_FUNCTION:
        config.trace = parameter;
        break;
      case CLASS_OBJECT:
        assign(ChannelBase.prototype, parameter.channel);
        assign(MessageBase.prototype, parameter.message);
        assign(SectionBase.prototype, parameter.section);
        break;
      case CLASS_STRING:
        config.delimiter = parameter;
        break;
    }
  });
  let Channel = createChannelClass(ChannelBase)
    , Message = createMessageClass(MessageBase)
    , Section = createSectionClass(SectionBase);
  return defineProperties(bus, {
    clear: {value: clear}
  , create: {value: aerobus}
  , channels: {get: getChannels}
  , delimiter: {get: getDelimiter, set: setDelimiter}
  , error: {get: getError}
  , root: {get: getRoot}
  , trace: {get: getTrace, set: setTrace}
  , unsubscribe: {value: unsubscribe}
  , wrap: {value: wrap}
  });
  function bus(...names) {
    switch (names.length) {
      case 0: return retrieve(ROOT);
      case 1: return retrieve(names[0]);
      default: return new Section(names.map(name => retrieve(name)));
    }
  }
  function clear() {
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    config.isSealed = false;
    return bus;
  }
  function getChannels() {
    return array(channels.values());
  }
  function getDelimiter() {
    return config.delimiter;
  }
  function setDelimiter(value) {
    if (config.isSealed) throwError(ERROR_FORBIDDEN);
    if (!isString(value)) throwError(ERROR_DELIMITER);
    config.delimiter = value;
  }
  function getError() {
    return retrieve(ERROR);
  }
  function getRoot() {
    return retrieve(ROOT);
  }
  function getTrace() {
    return config.trace;
  }
  function setTrace(value) {
    if (config.isSealed) throwError(ERROR_FORBIDDEN);
    if (!isFunction(value)) throwError(ERROR_TRACE);
    config.trace = value;
  }
  function retrieve(name) {
    let channel = channels.get(name);
    if (!channel) {
      let parent;
      if (name !== ROOT && name !== ERROR) {
          if (!isString(name)) throwError(ERROR_NAME);
          let index = name.indexOf(config.delimiter);
          parent = retrieve(-1 === index ? ROOT : name.substr(0, index));
      }
      channel = new Channel(bus, name, parent);
      config.isSealed = true;
      channels.set(name, channel);
    }
    return channel;
  }
  function wrap(...items) {
    return new Message(...items);
  }
  function unsubscribe(...subscribers) {
    for (let channel of channels.values()) channel.unsubscribe(...subscribers);
    return bus;
  }
}

class Iterator {
  constructor(parent) {
    this[$CLASS] = CLASS_AEROBUS_ITERATOR;
    this[$DONE] = false;
    this[$MESSAGES] = [];
    this[$PARENT] = parent.subscribe(this[$SUBSCRIPTION] = (data, message) => {
      let resolves = this[$RESOLVERS];
      if (resolves.length) resolves.shift()(message);
      else this[$MESSAGES].push(message);
    });
    this[$REJECTORS] = [];
    this[$RESOLVERS] = [];
  }
  done() {
    if (this[$DONE]) return;
    this[$DONE] = true;
    this[$PARENT].unsubscribe(this[$SUBSCRIPTION]);
    this[$REJECTORS].forEach(reject => reject());
    this[$MESSAGES] = this[$PARENT] = this[$REJECTORS] = this[$RESOLVERS] = this[$SUBSCRIPTION] = undefined;
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

function createChannelClass(base) {
  return class Channel extends base {
    constructor(bus, name, parent) {
      super();
      let retentions = [];
      retentions.limit = 0;
      retentions.period = 0;
      defineProperties(this, {
        [$BUS]: {value: bus}
      , [$CLASS]: {value: CLASS_AEROBUS_CHANNEL}
      , [$ENABLED]: {value: true, writable: true}
      , [$NAME]: {value: name, enumerable: true}
      , [$PARENT]: {value: parent}
      , [$RETENTIONS] : {value: retentions}
      , [$SUBSCRIBERS]: {value: []}
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
    // returns parent object of this activity
    get parent() {
      return this[$PARENT];
    } 
    get retentions() {
      let retentions = this[$RETENTIONS];
      return {
        count: retentions.length,
        limit: retentions.limit,
        period: retentions.period
      };
    } 
    get subscribers() {
      return [...this[$SUBSCRIBERS]];
    }
    clear() {
      this[$ENABLED] = true;
      this[$RETENTIONS].length = this[$SUBSCRIBERS].length = 0;
      this[$BUS].trace('clear', this);
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
    publish(data) {
      if (!this.isEnabled) return;
      let bus = this[$BUS], message = bus.wrap(this, data);
      let retentions = this[$RETENTIONS];
      if (retentions.limit > 0) {
        retentions.push(message);
        if (retentions.length > retentions.limit) retentions.shift();
      }
      if (this[$NAME] !== ERROR) {
        let parent = this[$PARENT];
        if (parent) parent.publish(message);
        this[$SUBSCRIBERS].forEach(subscriber => {
          try {
            subscriber(message.data, message);
          }
          catch(error) {
            bus.error.publish(bus.wrap(message, error));
          }
        });
      }
      else this[$SUBSCRIBERS].forEach(subscriber => subscriber(message.error, message));
      return this;
    }
    retain(limit, period) {
      let retentions = this[$RETENTIONS];
      if (!arguments.length || limit === true) retentions.limit = Number.MAX_SAGE_INTEGER;
      else if (!limit) {
        retentions.limit = 0;
        retentions = undefined;
      } else {
        retentions.limit = +limit || 0;
        if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
      }
      this[$BUS].trace('retain', this);
      return this;
    }
    subscribe(...subscribers) {
      if (!subscribers.every(isFunction)) throwError(ERROR_SUBSCRIBER);
      this[$SUBSCRIBERS].push(...subscribers);
      this[$RETENTIONS].forEach(message => subscribers.forEach(subscriber => subscriber(message.data, message)));
      return this;
    }
    unsubscribe(...subscribers) {
      let list = this[$SUBSCRIBERS];
      subscribers.forEach((subscriber) => {
        let index = list.indexOf(subscriber);
        if (index !== -1) list.splice(index, 1);
      });
      return this;
    }
    [$ITERATOR]() {
      return new Iterator(this);
    }
  }
}

function createMessageClass(base) {
  return class Message extends base {
    constructor(...parameters) {
      super();
      let channel, data, error;
      parameters.forEach(parameter => {
        switch (classof(parameter)) {
          case CLASS_AEROBUS_CHANNEL:
            if (isNothing(channel)) channel = parameter[$NAME];
            break;
          case CLASS_AEROBUS_MESSAGE:
            if (isNothing(channel)) channel = parameter[$CHANNEL];
            if (isNothing(data)) data = parameter[$DATA];
            if (isNothing(error)) error = parameter[$ERROR];
            break;
          case CLASS_ERROR:
          if (isNothing(error)) error = parameter;
            break;
          default:
            if (isNothing(data)) data = parameter;
            break;
        }
      });
      defineProperties(this, {
        [$CHANNEL]: {value: channel, enumerable: true}
      , [$CLASS]: {value: CLASS_AEROBUS_MESSAGE}
      , [$DATA]: {value: data, enumerable: true}
      });
      if (isSomething(error)) defineProperty(this, $ERROR, {value: error, enumerable: true});
    }
    get channel() {
      return this[$CHANNEL];
    }
    get data() {
      return this[$DATA];
    }
    get error() {
      return this[$ERROR];
    }
  }
}

function createSectionClass(base) {
  return class Section extends base {
    constructor(channels) {
      super();
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
    publish(data) {
      this[$CHANNELS].forEach(channel => channel.publish(data));
      return this;
    }
    subscribe(...subscribers) {
      this[$CHANNELS].forEach(channel => channel.subscribe(...subscribers));
      return this;
    }
    unsubscribe(...subscribers) {
      this[$CHANNELS].forEach(channel => channel.unsubscribe(...subscribers));
      return this;
    }
    [$ITERATOR]() {
      return new Iterator(this);
    }
  }
}

export default aerobus;
