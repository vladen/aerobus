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
  exports.validateCallback = validateCallback;
  exports.validateCount = validateCount;
  exports.validateDelimiter = validateDelimiter;
  exports.validateDisposable = validateDisposable;
  exports.validateInterval = validateInterval;
  exports.validateName = validateName;
  exports.validateSubscriber = validateSubscriber;
  exports.validateTrace = validateTrace;
  exports.default = aerobus;
  const DEFAULT_DELIMITER = '.',
        DEFAULT_ERROR = 'error',
        DEFAULT_ROOT = 'root';
  const arrayFrom = Array.from,
        ObjectKeys = Object.keys,
        classof = Object.classof,
        defineProperties = Object.defineProperties;
  const MESSAGE_ARGUMENTS = 'Unexpected number of arguments.',
        MESSAGE_CALLBACK = 'Callback expected to be a function.',
        MESSAGE_CHANNEL = 'Channel must be instance of channel class.',
        MESSAGE_CONDITION = 'Condition must be channel name or date or function or interval.',
        MESSAGE_COUNT = 'Count must be positive number.',
        MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
        MESSAGE_DISPOSED = 'This object has been disposed.',
        MESSAGE_FORBIDDEN = 'Operation is forbidden.',
        MESSAGE_INTERVAL = 'Interval must be positive number.',
        MESSAGE_NAME = 'Name expected to be string.',
        MESSAGE_OPERATION = 'Operation must be instance of publication or subscription class.',
        MESSAGE_STRATEGY = 'Strategy name must be one of the following: "cyclically", "randomly", "simultaneously".',
        MESSAGE_SUBSCRIBER = 'Subscriber must be function.',
        MESSAGE_TRACE = 'Trace expected to be a function.';
  const BUS = Symbol('bus'),
        CHANNEL = Symbol('channel'),
        CHANNELS = Symbol('channels'),
        CONFIGURABLE = Symbol('configurable'),
        DATA = Symbol('data'),
        DELIMITER = Symbol('delimeter'),
        ENABLED = Symbol('enabled'),
        ERROR = Symbol('error'),
        HEADERS = Symbol('headers'),
        NAME = Symbol('name'),
        PARENT = Symbol('parent'),
        RETAINING = Symbol('retaining'),
        RETENTIONS = Symbol('retentions'),
        STRATEGY = Symbol('strategy'),
        TRACE = Symbol('trace'),
        SUBSCRIBERS = Symbol('subscribers'),
        SUBSCRIPTIONS = Symbol('subscriptions'),
        TAG = Symbol.toStringTag;

  class Activity {
    constructor(bus, parent) {
      this[ENABLED] = true;
      this[PARENT] = parent;
      bus.trace('create', this);
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

  }

  class Aerobus {
    constructor(delimiter, trace, bus) {
      if (!isString(delimiter)) throw new Error(MESSAGE_DELIMITER);
      if (!isFunction(trace)) throw new TypeError(MESSAGE_TRACE);
      this[CHANNELS] = new Map();
      this[DELIMITER] = delimiter;
      this[TRACE] = trace;
      this[CONFIGURABLE] = true;
      this[BUS] = BUS;
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

        channel = new Channel(this, name, parent);
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

  class Channel extends Activity {
    constructor(bus, name, parent) {
      super(bus, parent);
      this[STRATEGY] = strategies.cyclically();
      this[RETAINING] = 0;
      this[RETENTIONS] = [];
      this[SUBSCRIBERS] = [];
      this[BUS] = bus;
      this[NAME] = name;
      this[PARENT] = parent;
      this[TAG] = 'Channel';
      bus.trace('create', this);
    }

    clear() {
      this[BUS].trace('clear', this);
      this[RETAINING] = undefined;
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
      this[RETENTIONS] = this[SUBSCRIBERS] = this[STRATEGY] = undefined;
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

  }

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
    }
    if (!(isPublication(argument) || isSubscription(argument))) data = argument;
  }

  class Message {
    constructor(...items) {
      this[DATA] = new Map();
      this[CHANNEL] = new Map();
      this[HEADERS] = new Map();

      for (let item of items) use(this, item);
    }

  }

  class Section {
    constructor(bus, channels) {
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

  const isDate = exports.isDate = value => classof(value) === 'Date',
        isArray = exports.isArray = value => classof(value) === 'Array',
        isError = exports.isError = value => classof(value) === 'Error',
        isNumber = exports.isNumber = value => classof(value) === 'Number',
        isString = exports.isString = value => classof(value) === 'String',
        isChannel = exports.isChannel = value => classof(value) === 'Channel',
        isSection = exports.isSection = value => classof(value) === 'Section',
        isMessage = exports.isMessage = value => classof(value) === 'Message',
        isFunction = exports.isFunction = value => classof(value) === 'Function',
        isDefined = exports.isDefined = value => value !== undefined,
        isUndefined = exports.isUndefined = value => value === undefined;

  function noop() {}

  function validateCallback(value) {
    if (!isFunction(value)) throw new Error(MESSAGE_CALLBACK);
  }

  function validateCount(value) {
    if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
  }

  function validateDelimiter(value) {
    if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
  }

  function validateDisposable(value) {
    if (value.isDisposed) throw new Error(MESSAGE_DISPOSED);
  }

  function validateInterval(value) {
    if (!isNumber(value) || value < 1) throw new Error(MESSAGE_INTERVAL);
  }

  function validateName(value) {
    if (!isString(value)) throw new Error(MESSAGE_NAME);
  }

  function validateSubscriber(value) {
    if (!isFunction(value)) throw new Error(MESSAGE_SUBSCRIBER);
  }

  function validateTrace(value) {
    if (!isFunction(value)) throw new Error(MESSAGE_TRACE);
  }

  function aerobus(delimiter = DEFAULT_DELIMITER, trace = noop) {
    if (isFunction(delimiter)) {
      trace = delimiter;
      delimiter = DEFAULT_DELIMITER;
    }

    let context = new Aerobus(delimiter, trace);
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
      switch (channels.length) {
        case 0:
          return context.get(DEFAULT_ROOT);

        case 1:
          return isArray(channels[0]) ? bus(...channels[0]) : context.get(channels[0]);

        default:
          return new Section(context, channels.map(channel => context.get(channel)));
      }
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
});
