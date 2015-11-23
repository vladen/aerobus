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
  exports.validateCount = validateCount;
  exports.validateDisposable = validateDisposable;
  const DEFAULT_DELIMITER = '.',
        DEFAULT_ERROR = 'error',
        DEFAULT_ROOT = 'root';
  const arrayFrom = Array.from,
        ObjectKeys = Object.keys,
        classof = Object.classof,
        defineProperties = Object.defineProperties;
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
        ENABLED = Symbol('enabled'),
        ERROR = Symbol('error'),
        HEADERS = Symbol('headers'),
        MESSAGECLASS = Symbol('messageclass'),
        NAME = Symbol('name'),
        PARENT = Symbol('parent'),
        RETAINING = Symbol('retaining'),
        RETENTIONS = Symbol('retentions'),
        STRATEGY = Symbol('strategy'),
        SECTIONCLASS = Symbol('sectionClass'),
        SUBSCRIBERS = Symbol('subscribers'),
        SUBSCRIPTIONS = Symbol('subscriptions'),
        TAG = Symbol.toStringTag,
        TRACE = Symbol('trace');

  function buildChannelClass(base) {
    return class Channel extends base {
      constructor(bus, name, parent) {
        super();
        this[STRATEGY] = strategies.cyclically();
        this[RETAINING] = 0;
        this[RETENTIONS] = [];
        this[SUBSCRIBERS] = [];
        this[BUS] = bus;
        this[NAME] = name;
        this[PARENT] = parent;
        this[ENABLED] = true;
        this[TAG] = 'Channel';
        bus.trace('create', this);
      }

      clear() {
        this[BUS].trace('clear', this);
        this[STRATEGY] = strategies.cyclically();
        this[RETAINING] = 0;
        this[ENABLED] = true;
        c;
        this[RETENTIONS] = [];
        this[SUBSCRIBERS] = [];
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

      get retentions() {
        return this[RETENTIONS];
      }

      publish(data, strategy) {
        if (isUndefined(data)) throw new Error(MESSAGE_ARGUMENTS);
        let parent = this[PARENT];
        if (this[NAME] !== DEFAULT_ERROR && parent) parent.publish(data);
        this.trigger(data);
        if (isDefined(strategy)) this[STRATEGY] = strategies[strategy]();
        if (!this[SUBSCRIBERS].length) return this;
        let subscribers = this[STRATEGY](this[SUBSCRIBERS]);
        subscribers.forEach(subscriber => subscriber(data));
        return this;
      }

      retain(count) {
        let retentions = this[RETENTIONS];
        if (!arguments.length || count === true) this[RETAINING] = 9e9;else if (!count) {
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

      dispose() {
        this[BUS].trace('dispose', this);
        this[STRATEGY] = this[RETAINING] = this[RETENTIONS] = this[SUBSCRIBERS] = this[BUS] = this[NAME] = this[PARENT] = this[ENABLED] = this[TAG] = undefined;
      }

      trigger(message) {
        let name = this[NAME],
            parent = this[PARENT],
            retaining = this[RETAINING],
            retentions = this[RETENTIONS];

        if (retaining) {
          if (retentions) retentions.push(message);else retentions = [message];
          if (retaining < retentions.length) retentions.shift();
        }
      }

      get isEnabled() {
        return this[ENABLED] && (!this[PARENT] || this[PARENT].isEnabled);
      }

      disable() {
        validateDisposable(this);

        if (this[ENABLED]) {
          this[BUS].trace('disable', this);
          this[ENABLED] = false;
        }

        return this;
      }

      enable(enable = true) {
        if (!enable) return this.disable();
        validateDisposable(this);

        if (!this[ENABLED]) {
          this[BUS].trace('enable', this);
          this[ENABLED] = true;
        }

        return this;
      }

      [Symbol.iterator]() {
        let done = false,
            messages = [],
            rejects = [],
            resolves = [],
            subscription = message => {
          if (resolves.length) resolves.shift()(message);else messages.push(message);
        };

        this.subscribe(subscription);
        return {
          done: () => {
            if (done) return;
            done = true;
            this.unsubscribe(subscription);
            rejects.forEach(reject => reject());
            rejects.length = resolves.length = messages.length = 0;
          },
          next: () => done ? {
            done: true
          } : {
            value: messages.length ? Promise.resolve(messages.shift()) : new Promise((resolve, reject) => {
              rejects.push(reject);
              resolves.push(resolve);
            })
          }
        };
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

      disable() {
        for (let channel of this[CHANNELS].values()) channel.disable();

        return this;
      }

      enable(value) {
        for (let channel of this[CHANNELS].values()) channel.enable(value);

        return this;
      }

      publish(data) {
        for (let channel of this[CHANNELS].values()) channel.publish(data);

        return this;
      }

      subscribe(...subscribers) {
        for (let channel of this[CHANNELS].values()) channel.subscribe(...subscribers);

        return this;
      }

      unsubscribe(...subscribers) {
        for (let channel of this[CHANNELS].values()) channel.unsubscribe(...subscribers);

        return this;
      }

      clear() {
        for (let channel of this[CHANNELS].values()) channel.clear();

        return this;
      }

      [Symbol.iterator]() {
        let done = false,
            messages = [],
            rejects = [],
            resolves = [],
            subscription = message => {
          if (resolves.length) resolves.shift()(message);else messages.push(message);
        };

        this.subscribe(subscription);
        return {
          done: () => {
            if (done) return;
            done = true;
            this.unsubscribe(subscription);
            rejects.forEach(reject => reject());
            rejects.length = resolves.length = messages.length = 0;
          },
          next: () => done ? {
            done: true
          } : {
            value: messages.length ? Promise.resolve(messages.shift()) : new Promise((resolve, reject) => {
              rejects.push(reject);
              resolves.push(resolve);
            })
          }
        };
      }

    };
  }

  function buildMessageClass(base) {
    return class Message extends base {
      constructor(...items) {
        super();
        this[DATA] = new Map();
        this[CHANNEL] = new Map();
        this[HEADERS] = new Map();
        this[TAG] = 'Message';
        items.forEach(item => use(this, item));
      }

    };

    function use(message, argument) {
      let channel = message[CHANNEL],
          headers = message[HEADERS],
          data = message[DATA],
          error = message[ERROR];

      if (isChannel(argument)) {
        if (isUndefined(channel)) channel = argument.name;
        return;
      }

      if (isFunction(argument)) data = argument();else if (isError(argument)) error = argument;else if (isMessage(argument)) {
        if (isUndefined(channel)) channel = argument.channel;
        data = argument.data;
        error = argument.error;

        _ObjectKeys(argument.headers).forEach(function (key) {
          headers[key] = argument.headers[key];
        });

        return;
      } else data = argument;
    }
  }

  let strategies = {
    cyclically: function () {
      let index = -1;
      return function (items) {
        return [items[++index % items.length]];
      };
    },
    randomly: function () {
      return function (items) {
        return [items[Math.floor(items.length * Math.random())]];
      };
    },
    simultaneously: function () {
      return function (items) {
        return items;
      };
    }
  };

  const isArray = exports.isArray = value => classof(value) === 'Array',
        isError = exports.isError = value => classof(value) === 'Error',
        isNumber = exports.isNumber = value => classof(value) === 'Number',
        isString = exports.isString = value => classof(value) === 'String',
        isChannel = exports.isChannel = value => classof(value) === 'Channel',
        isSection = exports.isSection = value => classof(value) === 'Section',
        isMessage = exports.isMessage = value => classof(value) === 'Message',
        isFunction = exports.isFunction = value => classof(value) === 'Function',
        isObject = exports.isObject = value => classof(value) === 'Object',
        isDefined = exports.isDefined = value => value !== undefined,
        isUndefined = exports.isUndefined = value => value === undefined;

  function noop() {}

  function validateCount(value) {
    if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
  }

  function validateDisposable(value) {
    if (value.isDisposed) throw new Error(MESSAGE_DISPOSED);
  }

  class Aerobus {
    constructor(channelCLass, sectionClass, messageClass, delimiter, trace, bus) {
      if (!isString(delimiter)) throw new Error(MESSAGE_DELIMITER);
      if (!isFunction(trace)) throw new TypeError(MESSAGE_TRACE);
      this[CHANNELS] = new Map();
      this[DELIMITER] = delimiter;
      this[TRACE] = trace;
      this[CONFIGURABLE] = true;
      this[BUS] = BUS;
      this[CHANNELCLASS] = channelCLass;
      this[SECTIONCLASS] = sectionClass;
      this[MESSAGECLASS] = messageClass;
    }

    get channels() {
      return arrayFrom(this[CHANNELS].values());
    }

    get delimiter() {
      return this[DELIMITER];
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

    set delimiter(value) {
      if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
      if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
      this[DELIMITER] = value;
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

      for (let channel of channels.values()) channel.dispose();

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

    Object.assign(channelExtention.prototype, extention['Channel']);
    Object.assign(sectionExtention.prototype, extention['Section']);
    Object.assign(messageExtention.prototype, extention['Message']);
    let channelClass = buildChannelClass(channelExtention),
        sectionClass = buildSectionClass(sectionExtention),
        messageClass = buildMessageClass(messageExtention);
    let context = new Aerobus(channelClass, sectionClass, messageClass, delimiter, trace);
    return Object.defineProperties(bus, {
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
