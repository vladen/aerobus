'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod);
    global.aerobus = mod.exports;
  }
})(this, function (module) {
  const DEFAULT_DELIMITER = '.',
        DEFAULT_ERROR = 'error',
        DEFAULT_ROOT = 'root';
  const MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
        MESSAGE_FORBIDDEN = 'Operation is forbidden.',
        MESSAGE_NAME = 'Name expected to be string.',
        MESSAGE_TRACE = 'Trace expected to be a function.';
  const CHANNEL = Symbol('channel'),
        CHANNELS = Symbol('channels'),
        CLASSES = Symbol('classes'),
        CONFIG = Symbol('config'),
        CONTEXT = Symbol('context'),
        DATA = Symbol('data'),
        DONE = Symbol('done'),
        ENABLED = Symbol('enabled'),
        ERROR = Symbol('error'),
        HEADERS = Symbol('headers'),
        ITERATOR = Symbol.iterator,
        MESSAGES = Symbol('messages'),
        NAME = Symbol('name'),
        PARENT = Symbol('parent'),
        RETENTIONS = Symbol('retentions'),
        RESOLVERS = Symbol('resolvers'),
        REJECTORS = Symbol('rejectors'),
        SUBSCRIBERS = Symbol('subscribers'),
        SUBSCRIPTION = Symbol('subscription'),
        TAG = Symbol.toStringTag;

  const array = Array.from,
        assign = Object.assign,
        classof = Object.classof,
        create = Object.create,
        defineProperties = Object.defineProperties,
        isArray = value => classof(value) === 'Array',
        isError = value => classof(value) === 'Error',
        isString = value => classof(value) === 'String',
        isChannel = value => classof(value) === 'Channel',
        isMessage = value => classof(value) === 'Message',
        isFunction = value => classof(value) === 'Function',
        isObject = value => classof(value) === 'Object',
        isUndefined = value => value === undefined,
        noop = () => {};

  class Context {
    constructor(classes, config) {
      this[CHANNELS] = new Map();
      this[CLASSES] = classes;
      this[CONFIG] = config;
    }

    get channels() {
      return array(this[CHANNELS].values());
    }

    get classes() {
      return this[CLASSES];
    }

    get config() {
      return this[CONFIG];
    }

    get delimiter() {
      return this[CONFIG].delimiter;
    }

    get error() {
      return this.get(DEFAULT_ERROR);
    }

    get root() {
      return this.get(DEFAULT_ROOT);
    }

    get trace() {
      return this[CONFIG].trace;
    }

    clear() {
      let channels = this[CHANNELS];

      for (let channel of channels.values()) channel.clear();

      channels.clear();
      this[CONFIG].isSealed = false;
    }

    get(...names) {
      switch (names.length) {
        case 0:
          return this.get(DEFAULT_ROOT);

        case 1:
          let name = isArray(names[0]);
          if (isArray(name)) return this.get(...name);
          let channels = this[CHANNELS],
              channel = channels.get(name);

          if (!channel) {
            let config = this[CONFIG],
                parent;

            if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
              if (!isString(name)) throw new TypeError(MESSAGE_NAME);
              let index = name.indexOf(config.delimiter);
              parent = this.get(-1 === index ? DEFAULT_ROOT : name.substr(0, index));
            }

            let Channel = this[CLASSES].channel;
            channel = new Channel(this, name, parent);
            config.isSealed = true;
            channels.set(name, channel);
          }

          return channel;

        default:
          let Section = this[CLASSES].section;
          return new Section(this, names.map(name => this.get(name)));
      }
    }

    unsubscribe(...subscribers) {
      for (let channel of this[CHANNELS].values()) channel.unsubscribe(...subscribers);
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
        if (resolves.length) resolves.shift()(message);else this[MESSAGES].push(message);
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
      if (this[DONE]) return {
        done: true
      };
      let messages = this[MESSAGES],
          value = messages.length ? Promise.resolve(messages.shift()) : new Promise((resolve, reject) => {
        this[REJECTORS].push(reject);
        this[RESOLVERS].push(resolve);
      });
      return {
        value
      };
    }

  }

  function aerobus(...parameters) {
    let config = {
      delimiter: DEFAULT_DELIMITER,
      isSealed: false,
      trace: noop
    },
        extensions = {
      channel: {},
      message: {},
      section: {}
    };
    parameters.forEach(parameter => {
      if (isFunction(parameter)) config.trace = parameter;else if (isString(parameter)) config.delimiter = parameter;else if (isObject(parameter)) {
        assign(extensions.channel, parameter.channel);
        assign(extensions.message, parameter.message);
        assign(extensions.section, parameter.section);
      }
    });
    let context = new Context({
      channel: extendChannel(create(extensions.channel)),
      message: extendMessage(create(extensions.message)),
      section: extendSection(create(extensions.section))
    }, config);
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
      return config.delimiter;
    }

    function getError() {
      return context.error;
    }

    function getRoot() {
      return context.root;
    }

    function getTrace() {
      return config.trace;
    }

    function setDelimiter(value) {
      if (config.isSealed) throw new Error(MESSAGE_FORBIDDEN);
      if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
      config.delimiter = value;
    }

    function setTrace(value) {
      if (config.isSealed) throw new Error(MESSAGE_FORBIDDEN);
      if (!isFunction(value)) throw new Error(MESSAGE_TRACE);
      config.trace = value;
    }

    function unsubscribe(...subscribers) {
      context.unsubscribe(...subscribers);
      return bus;
    }
  }

  function extendChannel(base) {
    return class Channel extends base {
      constructor(context, name, parent) {
        super();
        this[CONTEXT] = context;
        this[ENABLED] = true;
        this[NAME] = name;
        this[PARENT] = parent;
        let retentions = this[RETENTIONS] = [];
        retentions.limit = 0;
        retentions.period = 0;
        this[SUBSCRIBERS] = [];
        this[TAG] = 'Channel';
        this[CONTEXT].trace('clear', this);
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
        this[CONTEXT].trace('clear', this);
      }

      disable() {
        if (this[ENABLED]) {
          this[CONTEXT].trace('disable', this);
          this[ENABLED] = false;
        }

        return this;
      }

      enable(enable = true) {
        if (!enable) return this.disable();

        if (!this[ENABLED]) {
          this[CONTEXT].trace('enable', this);
          this[ENABLED] = true;
        }

        return this;
      }

      publish(data) {
        let context = this[CONTEXT],
            error,
            Message = context.classes.message,
            message = new Message(this, data);

        if (this[NAME] !== DEFAULT_ERROR) {
          let parent = this[PARENT];
          if (parent) parent.publish(message);
          error = context.error;
        }

        let retentions = this[RETENTIONS];

        if (retentions.limit > 0) {
          retentions.push(message);
          if (retentions.length > retentions.limit) retentions.shift();
        }

        this[SUBSCRIBERS].forEach(error ? subscriber => {
          try {
            subscriber(message.data, message);
          } catch (e) {
            error.publish(new Message(message, e));
          }
        } : subscriber => subscriber(message.data, message));
        return this;
      }

      retain(limit, period) {
        let retentions = this[RETENTIONS];
        if (!arguments.length || limit === true) retentions.limit = Number.MAX_SAGE_INTEGER;else if (!limit) {
          retentions.limit = 0;
          retentions = undefined;
        } else {
          retentions.limit = +limit || 0;
          if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
        }
        this[CONTEXT].trace('retain', this);
        return this;
      }

      subscribe(...subscribers) {
        subscribers = subscribers.filter(isFunction);
        this[SUBSCRIBERS].push(...subscribers);
        this[RETENTIONS].forEach(message => subscribers.forEach(subscriber => subscriber(message.data, message)));
        return this;
      }

      unsubscribe(...subscribers) {
        let list = this[SUBSCRIBERS];
        subscribers.forEach(subscriber => {
          let index = list.indexOf(subscriber);
          if (index !== -1) list.splice(index, 1);
        });
        return this;
      }

      [ITERATOR]() {
        return new Iterator(this);
      }

    };
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
          } else if (isFunction(item)) this[DATA] = item();else if (isError(item)) this[ERROR] = item;else if (isMessage(item)) {
            if (isUndefined(this[CHANNEL])) this[CHANNEL] = item.channel;
            this[DATA] = item.data;
            this[ERROR] = item.error;
            assign(this[HEADERS], item.headers);
          } else this[DATA] = item;
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

    };
  }

  function extendSection(base) {
    return class Section extends base {
      constructor(context, channels) {
        super();
        this[CONTEXT] = context;
        this[CHANNELS] = channels;
        this[TAG] = 'Section';
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

    };
  }

  module.exports = aerobus;
});
