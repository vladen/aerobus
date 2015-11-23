'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.aerobus = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  const DEFAULT_DELIMITER = '.',
        DEFAULT_ERROR = 'error',
        DEFAULT_ROOT = 'root';
  const arrayFrom = Array.from,
        classof = Object.classof,
        defineProperties = Object.defineProperties,
        _objectAssign = Object.assign;
  const MESSAGE_ARGUMENTS = 'Unexpected number of arguments.',
        MESSAGE_COUNT = 'Count must be positive number.',
        MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
        MESSAGE_DISPOSED = 'This object has been disposed.',
        MESSAGE_FORBIDDEN = 'Operation is forbidden.',
        MESSAGE_NAME = 'Name expected to be string.',
        MESSAGE_TRACE = 'Trace expected to be a function.';
  const BUS = Symbol('bus'),
        CHANNEL = Symbol('channel'),
        CHANNELS = Symbol('channels'),
        CHANNELCLASS = Symbol('channelClass'),
        CONFIGURABLE = Symbol('configurable'),
        DATA = Symbol('data'),
        DELIMITER = Symbol('delimeter'),
        DONE = Symbol('done'),
        ENABLED = Symbol('enabled'),
        ERROR = Symbol('error'),
        HEADERS = Symbol('headers'),
        MESSAGECLASS = Symbol('messageclass'),
        MESSAGES = Symbol('messages'),
        NAME = Symbol('name'),
        PARENT = Symbol('parent'),
        RETAINING = Symbol('retaining'),
        RETENTIONS = Symbol('retentions'),
        RESOLVES = Symbol('resolves'),
        REJECTS = Symbol('rejects'),
        STRATEGY = Symbol('strategy'),
        SECTIONCLASS = Symbol('sectionClass'),
        SUBSCRIBERS = Symbol('subscribers'),
        SUBSCRIPTION = Symbol('subscription'),
        SUBSCRIPTIONS = Symbol('subscriptions'),
        TAG = Symbol.toStringTag,
        TRACE = Symbol('trace');

  const isArray = value => classof(value) === 'Array',
        isError = value => classof(value) === 'Error',
        isNumber = value => classof(value) === 'Number',
        isString = value => classof(value) === 'String',
        isChannel = value => classof(value) === 'Channel',
        isSection = value => classof(value) === 'Section',
        isMessage = value => classof(value) === 'Message',
        isFunction = value => classof(value) === 'Function',
        isObject = value => classof(value) === 'Object',
        isDefined = value => value !== undefined,
        isUndefined = value => value === undefined;

  function noop() {}

  function validateCount(value) {
    if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
  }

  function buildChannelClass(base) {
    return class Channel extends base {
      constructor(bus, name, parent) {
        super();
        this[BUS] = bus;
        this[ENABLED] = true;
        this[NAME] = name;
        this[PARENT] = parent;
        this[RETAINING] = 0;
        this[RETENTIONS] = [];
        this[SUBSCRIBERS] = [];
        this[TAG] = 'Channel';
        bus.trace('create', this);
      }

      get isEnabled() {
        return this[ENABLED] && (!this[PARENT] || this[PARENT].isEnabled);
      }

      get name() {
        return this[NAME];
      }

      get parent() {
        return this[PARENT];
      }

      get retaining() {
        return this[RETAINING];
      }

      get subscribers() {
        return this[SUBSCRIBERS];
      }

      clear() {
        this[BUS].trace('clear', this);
        this[ENABLED] = true;
        this[RETAINING] = 0;
        this[RETENTIONS] = [];
        this[SUBSCRIBERS] = [];
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
        if (isUndefined(data)) throw new Error(MESSAGE_ARGUMENTS);
        let parent = this[PARENT],
            subscribers = this[SUBSCRIBERS];
        if (this[NAME] !== DEFAULT_ERROR && parent) parent.publish(data);
        trigger(this, data);
        if (!subscribers.length) return this;
        subscribers.forEach(subscriber => subscriber(data));
        return this;

        function trigger(channel, message) {
          let retaining = channel[RETAINING],
              retentions = channel[RETENTIONS];

          if (retaining) {
            if (retentions) retentions.push(message);else retentions = [message];
            if (retaining < retentions.length) retentions.shift();
          }
        }
      }

      retain(count) {
        let retentions = this[RETENTIONS];
        if (!arguments.length || count === true) this[RETAINING] = Number.MAX_SAGE_INTEGER;else if (!count) {
          this[RETAINING] = 0;
          retentions = undefined;
        } else {
          validateCount(count);
          this[RETAINING] = count;
          if (retentions) retentions.splice(0, retentions.length - count);
        }
        this[BUS].trace('retain', this);
        return this;
      }

      subscribe(...subscribers) {
        if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
        this[SUBSCRIBERS].push(...subscribers);

        if (this[RETAINING]) {
          this[RETENTIONS].forEach(retention => subscribers.forEach(subscriber => subscriber(retention)));
        }

        return this;
      }

      unsubscribe(...subscribers) {
        if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
        subscribers.forEach(subscriber => {
          let index = this[SUBSCRIBERS].indexOf(subscriber);
          if (index !== -1) this[SUBSCRIBERS].splice(index, 1);
        });
        return this;
      }

      [Symbol.iterator]() {
        return new ChannelIterator(this);
      }

    };
  }

  function buildSectionClass(base) {
    return class Section extends base {
      constructor(bus, channels) {
        super();
        this[BUS] = bus;
        this[CHANNELS] = channels;
        this[TAG] = 'Section';
        bus.trace('create', this);
      }

      get channels() {
        return this[CHANNELS];
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
        return new ChannelIterator(this);
      }

    };
  }

  function buildMessageClass(base) {
    return class Message extends base {
      constructor(...items) {
        super();
        this[CHANNEL] = new Map();
        this[DATA] = new Map();
        this[HEADERS] = new Map();
        this[TAG] = 'Message';
        items.forEach(item => use(this, item));
      }

    };

    function use(message, argument) {
      let channel = message[CHANNEL],
          data = message[DATA],
          error = message[ERROR],
          headers = message[HEADERS];

      if (isChannel(argument)) {
        if (isUndefined(channel)) channel = argument.name;
        return;
      }

      if (isFunction(argument)) data = argument();else if (isError(argument)) error = argument;else if (isMessage(argument)) {
        if (isUndefined(channel)) channel = argument.channel;
        data = argument.data;
        error = argument.error;

        _ObjectAssign(headers, argument.headers);

        return;
      } else data = argument;
    }
  }

  class Aerobus {
    constructor(channelCLass, sectionClass, messageClass, delimiter, trace, bus) {
      if (!isString(delimiter)) throw new Error(MESSAGE_DELIMITER);
      if (!isFunction(trace)) throw new TypeError(MESSAGE_TRACE);
      this[BUS] = BUS;
      this[CHANNELS] = new Map();
      this[CHANNELCLASS] = channelCLass;
      this[CONFIGURABLE] = true;
      this[DELIMITER] = delimiter;
      this[MESSAGECLASS] = messageClass;
      this[TRACE] = trace;
      this[SECTIONCLASS] = sectionClass;
    }

    get channels() {
      return arrayFrom(this[CHANNELS].values());
    }

    get delimiter() {
      return this[DELIMITER];
    }

    set delimiter(value) {
      if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
      if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
      this[DELIMITER] = value;
    }

    get error() {
      return this.get(DEFAULT_ERROR);
    }

    get root() {
      return this.get(DEFAULT_ROOT);
    }

    get trace() {
      return this[TRACE];
    }

    set trace(value) {
      if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
      if (!isFunction(value)) throw new TypeError(MESSAGE_TRACE);
      this[TRACE] = value;
    }

    bus(...channels) {
      switch (channels.length) {
        case 0:
          return this.get(DEFAULT_ROOT);

        case 1:
          return isArray(channels[0]) ? bus(...channels[0]) : this.get(channels[0]);

        default:
          return new this[SECTIONCLASS](this, channels.map(channel => this.get(channel)));
      }
    }

    clear() {
      this.trace('clear', this[BUS]);
      let channels = this[CHANNELS];

      for (let channel of channels.values()) channel.clear();

      channels.clear();
      this[CONFIGURABLE] = true;
    }

    get(name) {
      let channels = this[CHANNELS],
          channel = channels.get(name);

      if (!channel) {
        let parent;

        if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
          if (!isString(name)) throw new TypeError(MESSAGE_NAME);
          let index = name.indexOf(this[DELIMITER]);
          parent = this.get(-1 === index ? DEFAULT_ROOT : name.substr(0, index));
        }

        channel = new this[CHANNELCLASS](this, name, parent, this[MESSAGECLASS]);
        this[CONFIGURABLE] = false;
        channels.set(name, channel);
      }

      return channel;
    }

    unsubscribe(...subscribers) {
      for (let channel of this[CHANNELS].values()) channel.unsubscribe(...subscribers);

      return this[BUS];
    }

  }

  class ChannelIterator {
    constructor(channel) {
      this[CHANNEL] = channel;
      this[DONE] = false;
      this[MESSAGES] = [];
      this[REJECTS] = [];
      this[RESOLVES] = [];

      this[SUBSCRIPTION] = message => {
        let resolves = this[RESOLVES];
        if (resolves.length) resolves.shift()(message);else this[MESSAGES].push(message);
      };

      channel.subscribe(this[SUBSCRIPTION]);
    }

    done() {
      if (this[DONE]) return;
      this[DONE] = true;
      this[CHANNEL].unsubscribe(this[SUBSCRIPTION]);
      this[REJECTS].forEach(reject => reject());
      this[REJECTS].length = this[RESOLVES].length = this[MESSAGES].length = 0;
    }

    next() {
      let messages = this[MESSAGES],
          rejects = this[REJECTS],
          resolves = this[RESOLVES];
      return this[DONE] ? {
        done: true
      } : {
        value: messages.length ? Promise.resolve(messages.shift()) : new Promise((resolve, reject) => {
          rejects.push(reject);
          resolves.push(resolve);
        })
      };
    }

  }

  function aerobus(...parameters) {
    let delimiter, trace, extention;
    if (parameters.length > 3) throw new Error(MESSAGE_ARGUMENTS);
    parameters.forEach(parameter => {
      if (isFunction(parameter)) {
        if (isDefined(trace)) throw new Error(MESSAGE_ARGUMENTS);
        trace = parameter;
      } else if (isString(parameter)) {
        if (isDefined(delimiter)) throw new Error(MESSAGE_ARGUMENTS);
        delimiter = parameter;
      } else if (isObject(parameter)) {
        if (isDefined(extention)) throw new Error(MESSAGE_ARGUMENTS);
        extention = parameter;
      }
    });
    if (isUndefined(delimiter)) delimiter = DEFAULT_DELIMITER;
    if (isUndefined(trace)) trace = noop;
    if (isUndefined(extention)) extention = {};

    let channelExtention = () => {},
        sectionExtention = () => {},
        messageExtention = () => {};

    _objectAssign(channelExtention.prototype, extention['Channel']);

    _objectAssign(sectionExtention.prototype, extention['Section']);

    _objectAssign(messageExtention.prototype, extention['Message']);

    let channelClass = buildChannelClass(channelExtention),
        sectionClass = buildSectionClass(sectionExtention),
        messageClass = buildMessageClass(messageExtention);
    let context = new Aerobus(channelClass, sectionClass, messageClass, delimiter, trace);
    return defineProperties(bus, {
      clear: {
        value: clear
      },
      create: {
        value: aerobus
      },
      channels: {
        get: getChannels
      },
      delimiter: {
        get: getDelimiter,
        set: setDelimiter
      },
      error: {
        get: getError
      },
      root: {
        get: getRoot
      },
      trace: {
        get: getTrace,
        set: setTrace
      },
      unsubscribe: {
        value: unsubscribe
      }
    });

    function bus(...channels) {
      return context.bus(...channels);
    }

    function clear() {
      context.clear();
      return bus;
    }

    function getChannels() {
      return context.channels;
    }

    function getDelimiter() {
      return context.delimiter;
    }

    function getError() {
      return context.error;
    }

    function getRoot() {
      return context.root;
    }

    function getTrace() {
      return context.trace;
    }

    function setDelimiter(value) {
      context.delimiter = value;
    }

    function setTrace(value) {
      context.trace = value;
    }

    function unsubscribe(...subscribers) {
      context.unsubscribe(...subscribers);
      return bus;
    }
  }

  exports.default = aerobus;
});
