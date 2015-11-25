'use strict';

const DEFAULT_DELIMITER = '.', DEFAULT_ERROR = 'error', DEFAULT_ROOT = '';

const
  ERROR_DELIMITER = 'Delimiter expected to be a string.'
, ERROR_FORBIDDEN = 'This operation is forbidden for not empty bus instance.'
, ERROR_NAME = 'Name expected to be string.'
, ERROR_SUBSCRIBER = 'Subscriber expected to be a function.'
, ERROR_TRACE = 'Trace expected to be a function.'

, CHANNEL = Symbol('channel')
, BUS = Symbol('bus')
, CHANNELS = Symbol('channels')
, DATA = Symbol('data')
, DONE = Symbol('done')
, ENABLED = Symbol('enabled')
, ERROR = Symbol('error')
, HEADERS = Symbol('headers')
, ITERATOR = Symbol.iterator
, MESSAGES = Symbol('messages')
, NAME = Symbol('name')
, PARENT = Symbol('parent')
, RETENTIONS = Symbol('retentions')
, RESOLVERS = Symbol('resolvers')
, REJECTORS = Symbol('rejectors')
, SUBSCRIBERS = Symbol('subscribers')
, SUBSCRIPTION = Symbol('subscription')
, TAG = Symbol.toStringTag

, array = Array.from
, assign = Object.assign
, classof = Object.classof
, defineProperties = Object.defineProperties
, isError = value => classof(value) === 'Error'
, isString = value => classof(value) === 'String'
, isChannel = value => classof(value) === 'Channel'
, isMessage = value => classof(value) === 'Message'
, isFunction = value => classof(value) === 'Function'
, isObject = value => classof(value) === 'Object'
, isUndefined = value => value === undefined
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
      delimiter: DEFAULT_DELIMITER,
      isSealed: false,
      trace: noop
    };
  parameters.forEach(parameter => {
    if (isFunction(parameter)) config.trace = parameter;
    else if (isString(parameter)) config.delimiter = parameter;
    else if (isObject(parameter)) {
      assign(ChannelBase.prototype, parameter.channel);
      assign(MessageBase.prototype, parameter.message);
      assign(SectionBase.prototype, parameter.section);
    }
  });
  let Channel = extendChannel(ChannelBase)
    , Message = extendMessage(MessageBase)
    , Section = extendSection(SectionBase);
  return defineProperties(bus, {
    clear: {value: clear},
    create: {value: aerobus},
    channels: {get: getChannels},
    delimiter: {get: getDelimiter, set: setDelimiter},
    error: {get: getError},
    message: {value: message},
    root: {get: getRoot},
    trace: {get: getTrace, set: setTrace},
    unsubscribe: {value: unsubscribe}
  });
  function bus(...names) {
    switch (names.length) {
      case 0: return getChannel(DEFAULT_ROOT);
      case 1: return getChannel(names[0]);
      default: return new Section(names.map(name => getChannel(name)));
    }
  }
  function clear() {
    for (let channel of channels.values()) channel.clear();
    channels.clear();
    config.isSealed = false;
    return bus;
  }
  function getChannel(name) {
    let channel = channels.get(name);
    if (!channel) {
      let parent;
      if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
          if (!isString(name)) throwError(ERROR_NAME);
          let index = name.indexOf(config.delimiter);
          parent = getChannel(-1 === index ? DEFAULT_ROOT : name.substr(0, index));
      }
      channel = new Channel(bus, name, parent);
      config.isSealed = true;
      channels.set(name, channel);
    }
    return channel;
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
    return getChannel(DEFAULT_ERROR);
  }
  function getRoot() {
    return getChannel(DEFAULT_ROOT);
  }
  function getTrace() {
    return config.trace;
  }
  function setTrace(value) {
    if (config.isSealed) throwError(ERROR_FORBIDDEN);
    if (!isFunction(value)) throwError(ERROR_TRACE);
    config.trace = value;
  }
  function message(...items) {
    return new Message(...items);
  }
  function unsubscribe(...subscribers) {
    for (let channel of channels.values()) channel.unsubscribe(...subscribers);
    return bus;
  }
}

class Iterator {
  constructor(parent) {
    this[DONE] = false;
    this[MESSAGES] = [];
    this[REJECTORS] = [];
    this[RESOLVERS] = [];
    this[PARENT] = parent.subscribe(this[SUBSCRIPTION] = (data, message) => {
      let resolves = this[RESOLVERS];
      if (resolves.length) resolves.shift()(message);
      else this[MESSAGES].push(message);
    });
  }
  done() {
    if (this[DONE]) return;
    this[DONE] = true;
    this[PARENT].unsubscribe(this[SUBSCRIPTION]);
    this[REJECTORS].forEach(reject => reject());
    this[MESSAGES] = this[PARENT] = this[REJECTORS] = this[RESOLVERS] = this[SUBSCRIPTION] = undefined;
  }
  next() {
    if (this[DONE]) return { done: true };
    let messages = this[MESSAGES], value = messages.length
      ? Promise.resolve(messages.shift())
      : new Promise((resolve, reject) => {
          this[REJECTORS].push(reject);
          this[RESOLVERS].push(resolve);
        });
    return { value };
  }
}

function extendChannel(base) {
  return class Channel extends base {
    constructor(bus, name, parent) {
      super();
      this[BUS] = bus;
      this[ENABLED] = true;
      this[NAME] = name;
      this[PARENT] = parent;
      let retentions = this[RETENTIONS] = [];
      retentions.limit = 0;
      retentions.period = 0;
      this[SUBSCRIBERS] = [];
      this[TAG] = 'Channel';
      bus.trace('create', this);
    }
    get bus() {
      return this[BUS];
    }
    get isEnabled() {
      return this[ENABLED] && (!this[PARENT] || this[PARENT].isEnabled);
    }
    get name() {
      return this[NAME];
    }
    // returns parent object of this activity
    get parent() {
      return this[PARENT];
    } 
    get retentions() {
      let retentions = this[RETENTIONS];
      return {
        count: retentions.length,
        limit: retentions.limit,
        period: retentions.period
      };
    } 
    get subscribers() {
      return [...this[SUBSCRIBERS]];
    }
    clear() {
      this[ENABLED] = true;
      this[RETENTIONS].length = 0;
      this[SUBSCRIBERS] = [];
      this[BUS].trace('clear', this);
    } 
    disable() {
      if (this[ENABLED]) {
        this[BUS].trace('disable', this);
        this[ENABLED] = false;
      }
      return this;
    }
    enable(enable = true) {
      if (!enable) return this.disable();
      if (!this[ENABLED]) {
        this[BUS].trace('enable', this);
        this[ENABLED] = true;
      }
      return this;
    }
    publish(data) {
      if (!this[ENABLED]) return;
      let bus = this[BUS], message = bus.message(this, data);
      let retentions = this[RETENTIONS];
      if (retentions.limit > 0) {
        retentions.push(message);
        if (retentions.length > retentions.limit) retentions.shift();
      }
      if (this[NAME] !== DEFAULT_ERROR) {
        let parent = this[PARENT];
        if (parent) parent.publish(message);
        this[SUBSCRIBERS].forEach(subscriber => {
          try {
            subscriber(message.data, message);
          }
          catch(error) {
            bus.error.publish(bus.message(message, error));
          }
        });
      }
      else this[SUBSCRIBERS].forEach(subscriber => subscriber(message.error, message));
      return this;
    }
    retain(limit, period) {
      let retentions = this[RETENTIONS];
      if (!arguments.length || limit === true) retentions.limit = Number.MAX_SAGE_INTEGER;
      else if (!limit) {
        retentions.limit = 0;
        retentions = undefined;
      } else {
        retentions.limit = +limit || 0;
        if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
      }
      this[BUS].trace('retain', this);
      return this;
    }
    subscribe(...subscribers) {
      if (!subscribers.every(isFunction)) throwError(ERROR_SUBSCRIBER);
      this[SUBSCRIBERS].push(...subscribers);
      this[RETENTIONS].forEach(message => subscribers.forEach(subscriber => subscriber(message.data, message)));
      return this;
    }
    unsubscribe(...subscribers) {
      let list = this[SUBSCRIBERS];
      subscribers.forEach((subscriber) => {
        let index = list.indexOf(subscriber);
        if (index !== -1) list.splice(index, 1);
      });
      return this;
    }
    [ITERATOR]() {
      return new Iterator(this);
    }
  }
}

function extendMessage(base) {
  return class Message extends base {
    constructor(...items) {
      super();
      this[HEADERS] = {};
      this[TAG] = 'Message';
      items.forEach(item => {
        if (isChannel(item)) {
          if (isUndefined(this[CHANNEL])) this[CHANNEL] = item.name;
        }
        else if (isFunction(item)) this[DATA] = item();
        else if (isError(item)) this[ERROR] = item;
        else if (isMessage(item)) {
          if (isUndefined(this[CHANNEL])) this[CHANNEL] = item.channel;
          this[DATA] = item.data;
          this[ERROR] = item.error;
          assign(this[HEADERS], item.headers);
        }
        else this[DATA] = item;
      });
    }
    get channel() {
      return this[CHANNEL];
    }
    get data() {
      return this[DATA];
    }
    get error() {
      return this[ERROR];
    }
    get headers() {
      return this[HEADERS];
    }
  }
}

function extendSection(base) {
  return class Section extends base {
    constructor(channels) {
      super();
      this[CHANNELS] = channels;
      this[TAG] = 'Section';
    }
    get bus() {
      return this[BUS];
    }
    get channels() {
      return [...this[CHANNELS]];
    }
    clear() {
      this[CHANNELS].forEach(channel => channel.clear());
      return this;
    }
    disable() {
      this[CHANNELS].forEach(channel => channel.disable());
      return this;
    }
    enable(value) {
      this[CHANNELS].forEach(channel => channel.enable(value));
      return this;
    } 
    publish(data) {
      this[CHANNELS].forEach(channel => channel.publish(data));
      return this;
    }
    subscribe(...subscribers) {
      this[CHANNELS].forEach(channel => channel.subscribe(...subscribers));
      return this;
    }
    unsubscribe(...subscribers) {
      this[CHANNELS].forEach(channel => channel.unsubscribe(...subscribers));
      return this;
    }
    [Symbol.iterator]() {
      return new Iterator(this);
    }
  }
}

export default aerobus;
