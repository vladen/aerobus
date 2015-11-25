'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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
  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === 'undefined' ? 'undefined' : _typeof(superClass)));
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var DEFAULT_DELIMITER = '.',
      DEFAULT_ERROR = 'error',
      DEFAULT_ROOT = 'root';
  var MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
      MESSAGE_FORBIDDEN = 'Operation is forbidden.',
      MESSAGE_NAME = 'Name expected to be string.',
      MESSAGE_TRACE = 'Trace expected to be a function.';
  var CHANNEL = Symbol('channel'),
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

  var array = Array.from,
      assign = Object.assign,
      classof = Object.classof,
      create = Object.create,
      defineProperties = Object.defineProperties,
      isArray = function isArray(value) {
    return classof(value) === 'Array';
  },
      isError = function isError(value) {
    return classof(value) === 'Error';
  },
      isString = function isString(value) {
    return classof(value) === 'String';
  },
      isChannel = function isChannel(value) {
    return classof(value) === 'Channel';
  },
      isMessage = function isMessage(value) {
    return classof(value) === 'Message';
  },
      isFunction = function isFunction(value) {
    return classof(value) === 'Function';
  },
      isObject = function isObject(value) {
    return classof(value) === 'Object';
  },
      isUndefined = function isUndefined(value) {
    return value === undefined;
  },
      noop = function noop() {};

  var Context = (function () {
    function Context(classes, config) {
      _classCallCheck(this, Context);

      this[CHANNELS] = new Map();
      this[CLASSES] = classes;
      this[CONFIG] = config;
    }

    _createClass(Context, [{
      key: 'clear',
      value: function clear() {
        var channels = this[CHANNELS];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = channels.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var channel = _step.value;
            channel.clear();
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        channels.clear();
        this[CONFIG].isSealed = false;
      }
    }, {
      key: 'get',
      value: function get() {
        var _this = this;

        for (var _len = arguments.length, names = Array(_len), _key = 0; _key < _len; _key++) {
          names[_key] = arguments[_key];
        }

        switch (names.length) {
          case 0:
            return this.get(DEFAULT_ROOT);

          case 1:
            var name = isArray(names[0]);
            if (isArray(name)) return this.get.apply(this, _toConsumableArray(name));
            var channels = this[CHANNELS],
                channel = channels.get(name);

            if (!channel) {
              var config = this[CONFIG],
                  parent = undefined;

              if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
                if (!isString(name)) throw new TypeError(MESSAGE_NAME);
                var index = name.indexOf(config.delimiter);
                parent = this.get(-1 === index ? DEFAULT_ROOT : name.substr(0, index));
              }

              var Channel = this[CLASSES].channel;
              channel = new Channel(this, name, parent);
              config.isSealed = true;
              channels.set(name, channel);
            }

            return channel;

          default:
            var Section = this[CLASSES].section;
            return new Section(this, names.map(function (name) {
              return _this.get(name);
            }));
        }
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this[CHANNELS].values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var channel = _step2.value;
            channel.unsubscribe.apply(channel, arguments);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }, {
      key: 'channels',
      get: function get() {
        return array(this[CHANNELS].values());
      }
    }, {
      key: 'classes',
      get: function get() {
        return this[CLASSES];
      }
    }, {
      key: 'config',
      get: function get() {
        return this[CONFIG];
      }
    }, {
      key: 'delimiter',
      get: function get() {
        return this[CONFIG].delimiter;
      }
    }, {
      key: 'error',
      get: function get() {
        return this.get(DEFAULT_ERROR);
      }
    }, {
      key: 'root',
      get: function get() {
        return this.get(DEFAULT_ROOT);
      }
    }, {
      key: 'trace',
      get: function get() {
        return this[CONFIG].trace;
      }
    }]);

    return Context;
  })();

  var Iterator = (function () {
    function Iterator(parent) {
      var _this2 = this;

      _classCallCheck(this, Iterator);

      this[DONE] = false;
      this[MESSAGES] = [];
      this[REJECTORS] = [];
      this[RESOLVERS] = [];
      this[PARENT] = parent.subscribe(this[SUBSCRIPTION] = function (data, message) {
        var resolves = _this2[RESOLVERS];
        if (resolves.length) resolves.shift()(message);else _this2[MESSAGES].push(message);
      });
    }

    _createClass(Iterator, [{
      key: 'done',
      value: function done() {
        if (this[DONE]) return;
        this[DONE] = true;
        this[PARENT].unsubscribe(this[SUBSCRIPTION]);
        this[REJECTORS].forEach(function (reject) {
          return reject();
        });
        this[MESSAGES] = this[PARENT] = this[REJECTORS] = this[RESOLVERS] = this[SUBSCRIPTION] = undefined;
      }
    }, {
      key: 'next',
      value: function next() {
        var _this3 = this;

        if (this[DONE]) return {
          done: true
        };
        var messages = this[MESSAGES],
            value = messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
          _this3[REJECTORS].push(reject);

          _this3[RESOLVERS].push(resolve);
        });
        return {
          value: value
        };
      }
    }]);

    return Iterator;
  })();

  function aerobus() {
    var config = {
      delimiter: DEFAULT_DELIMITER,
      isSealed: false,
      trace: noop
    },
        extensions = {
      channel: {},
      message: {},
      section: {}
    };

    for (var _len2 = arguments.length, parameters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      parameters[_key2] = arguments[_key2];
    }

    parameters.forEach(function (parameter) {
      if (isFunction(parameter)) config.trace = parameter;else if (isString(parameter)) config.delimiter = parameter;else if (isObject(parameter)) {
        assign(extensions.channel, parameter.channel);
        assign(extensions.message, parameter.message);
        assign(extensions.section, parameter.section);
      }
    });
    var context = new Context({
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

    function bus() {
      return context.bus.apply(context, arguments);
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

    function unsubscribe() {
      context.unsubscribe.apply(context, arguments);
      return bus;
    }
  }

  function extendChannel(base) {
    return (function (_base) {
      _inherits(Channel, _base);

      function Channel(context, name, parent) {
        _classCallCheck(this, Channel);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this));

        _this4[CONTEXT] = context;
        _this4[ENABLED] = true;
        _this4[NAME] = name;
        _this4[PARENT] = parent;
        var retentions = _this4[RETENTIONS] = [];
        retentions.limit = 0;
        retentions.period = 0;
        _this4[SUBSCRIBERS] = [];
        _this4[TAG] = 'Channel';

        _this4[CONTEXT].trace('clear', _this4);

        return _this4;
      }

      _createClass(Channel, [{
        key: 'clear',
        value: function clear() {
          this[ENABLED] = true;
          this[RETENTIONS].length = 0;
          this[SUBSCRIBERS] = [];
          this[CONTEXT].trace('clear', this);
        }
      }, {
        key: 'disable',
        value: function disable() {
          if (this[ENABLED]) {
            this[CONTEXT].trace('disable', this);
            this[ENABLED] = false;
          }

          return this;
        }
      }, {
        key: 'enable',
        value: function enable() {
          var _enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

          if (!_enable) return this.disable();

          if (!this[ENABLED]) {
            this[CONTEXT].trace('enable', this);
            this[ENABLED] = true;
          }

          return this;
        }
      }, {
        key: 'publish',
        value: function publish(data) {
          var context = this[CONTEXT],
              error = undefined,
              Message = context.classes.message,
              message = new Message(this, data);

          if (this[NAME] !== DEFAULT_ERROR) {
            var parent = this[PARENT];
            if (parent) parent.publish(message);
            error = context.error;
          }

          var retentions = this[RETENTIONS];

          if (retentions.limit > 0) {
            retentions.push(message);
            if (retentions.length > retentions.limit) retentions.shift();
          }

          this[SUBSCRIBERS].forEach(error ? function (subscriber) {
            try {
              subscriber(message.data, message);
            } catch (e) {
              error.publish(new Message(message, e));
            }
          } : function (subscriber) {
            return subscriber(message.data, message);
          });
          return this;
        }
      }, {
        key: 'retain',
        value: function retain(limit, period) {
          var retentions = this[RETENTIONS];
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
      }, {
        key: 'subscribe',
        value: function subscribe() {
          var _SUBSCRIBERS;

          for (var _len3 = arguments.length, subscribers = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            subscribers[_key3] = arguments[_key3];
          }

          subscribers = subscribers.filter(isFunction);

          (_SUBSCRIBERS = this[SUBSCRIBERS]).push.apply(_SUBSCRIBERS, _toConsumableArray(subscribers));

          this[RETENTIONS].forEach(function (message) {
            return subscribers.forEach(function (subscriber) {
              return subscriber(message.data, message);
            });
          });
          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          var list = this[SUBSCRIBERS];

          for (var _len4 = arguments.length, subscribers = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            subscribers[_key4] = arguments[_key4];
          }

          subscribers.forEach(function (subscriber) {
            var index = list.indexOf(subscriber);
            if (index !== -1) list.splice(index, 1);
          });
          return this;
        }
      }, {
        key: ITERATOR,
        value: function value() {
          return new Iterator(this);
        }
      }, {
        key: 'isEnabled',
        get: function get() {
          return this[ENABLED] && (!this[PARENT] || this[PARENT].isEnabled);
        }
      }, {
        key: 'name',
        get: function get() {
          return this[NAME];
        }
      }, {
        key: 'parent',
        get: function get() {
          return this[PARENT];
        }
      }, {
        key: 'retentions',
        get: function get() {
          var retentions = this[RETENTIONS];
          return {
            count: retentions.length,
            limit: retentions.limit,
            period: retentions.period
          };
        }
      }, {
        key: 'subscribers',
        get: function get() {
          return [].concat(_toConsumableArray(this[SUBSCRIBERS]));
        }
      }]);

      return Channel;
    })(base);
  }

  function extendMessage(base) {
    return (function (_base2) {
      _inherits(Message, _base2);

      function Message() {
        _classCallCheck(this, Message);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this));

        _this5[HEADERS] = {};
        _this5[TAG] = 'Message';

        for (var _len5 = arguments.length, items = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          items[_key5] = arguments[_key5];
        }

        items.forEach(function (item) {
          if (isChannel(item)) {
            if (isUndefined(_this5[CHANNEL])) _this5[CHANNEL] = item.name;
          } else if (isFunction(item)) _this5[DATA] = item();else if (isError(item)) _this5[ERROR] = item;else if (isMessage(item)) {
            if (isUndefined(_this5[CHANNEL])) _this5[CHANNEL] = item.channel;
            _this5[DATA] = item.data;
            _this5[ERROR] = item.error;
            assign(_this5[HEADERS], item.headers);
          } else _this5[DATA] = item;
        });
        return _this5;
      }

      _createClass(Message, [{
        key: 'channel',
        get: function get() {
          return this[CHANNEL];
        }
      }, {
        key: 'data',
        get: function get() {
          return this[DATA];
        }
      }, {
        key: 'error',
        get: function get() {
          return this[ERROR];
        }
      }, {
        key: 'headers',
        get: function get() {
          return this[HEADERS];
        }
      }]);

      return Message;
    })(base);
  }

  function extendSection(base) {
    return (function (_base3) {
      _inherits(Section, _base3);

      function Section(context, channels) {
        _classCallCheck(this, Section);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this));

        _this6[CONTEXT] = context;
        _this6[CHANNELS] = channels;
        _this6[TAG] = 'Section';
        return _this6;
      }

      _createClass(Section, [{
        key: 'clear',
        value: function clear() {
          this[CHANNELS].forEach(function (channel) {
            return channel.clear();
          });
          return this;
        }
      }, {
        key: 'disable',
        value: function disable() {
          this[CHANNELS].forEach(function (channel) {
            return channel.disable();
          });
          return this;
        }
      }, {
        key: 'enable',
        value: function enable(value) {
          this[CHANNELS].forEach(function (channel) {
            return channel.enable(value);
          });
          return this;
        }
      }, {
        key: 'publish',
        value: function publish(data) {
          this[CHANNELS].forEach(function (channel) {
            return channel.publish(data);
          });
          return this;
        }
      }, {
        key: 'subscribe',
        value: function subscribe() {
          for (var _len6 = arguments.length, subscribers = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            subscribers[_key6] = arguments[_key6];
          }

          this[CHANNELS].forEach(function (channel) {
            return channel.subscribe.apply(channel, subscribers);
          });
          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          for (var _len7 = arguments.length, subscribers = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            subscribers[_key7] = arguments[_key7];
          }

          this[CHANNELS].forEach(function (channel) {
            return channel.unsubscribe.apply(channel, subscribers);
          });
          return this;
        }
      }, {
        key: Symbol.iterator,
        value: function value() {
          return new Iterator(this);
        }
      }, {
        key: 'channels',
        get: function get() {
          return [].concat(_toConsumableArray(this[CHANNELS]));
        }
      }]);

      return Section;
    })(base);
  }

  module.exports = aerobus;
});
