'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
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

  var DEFAULT_DELIMITER = '.',
      DEFAULT_ERROR = 'error',
      DEFAULT_ROOT = 'root';
  var arrayFrom = Array.from,
      classof = Object.classof,
      defineProperties = Object.defineProperties,
      _objectAssign = Object.assign;
  var MESSAGE_ARGUMENTS = 'Unexpected number of arguments.',
      MESSAGE_COUNT = 'Count must be positive number.',
      MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
      MESSAGE_DISPOSED = 'This object has been disposed.',
      MESSAGE_FORBIDDEN = 'Operation is forbidden.',
      MESSAGE_NAME = 'Name expected to be string.',
      MESSAGE_TRACE = 'Trace expected to be a function.';
  var BUS = Symbol('bus'),
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

  var isArray = function isArray(value) {
    return classof(value) === 'Array';
  },
      isError = function isError(value) {
    return classof(value) === 'Error';
  },
      isNumber = function isNumber(value) {
    return classof(value) === 'Number';
  },
      isString = function isString(value) {
    return classof(value) === 'String';
  },
      isChannel = function isChannel(value) {
    return classof(value) === 'Channel';
  },
      isSection = function isSection(value) {
    return classof(value) === 'Section';
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
      isDefined = function isDefined(value) {
    return value !== undefined;
  },
      isUndefined = function isUndefined(value) {
    return value === undefined;
  };

  function noop() {}

  function validateCount(value) {
    if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
  }

  function buildChannelClass(base) {
    return (function (_base) {
      _inherits(Channel, _base);

      function Channel(bus, name, parent) {
        _classCallCheck(this, Channel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this));

        _this[BUS] = bus;
        _this[ENABLED] = true;
        _this[NAME] = name;
        _this[PARENT] = parent;
        _this[RETAINING] = 0;
        _this[RETENTIONS] = [];
        _this[SUBSCRIBERS] = [];
        _this[TAG] = 'Channel';
        bus.trace('create', _this);
        return _this;
      }

      _createClass(Channel, [{
        key: 'clear',
        value: function clear() {
          this[BUS].trace('clear', this);
          this[ENABLED] = true;
          this[RETAINING] = 0;
          this[RETENTIONS] = [];
          this[SUBSCRIBERS] = [];
        }
      }, {
        key: 'disable',
        value: function disable() {
          if (this[ENABLED]) {
            this[BUS].trace('disable', this);
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
            this[BUS].trace('enable', this);
            this[ENABLED] = true;
          }

          return this;
        }
      }, {
        key: 'publish',
        value: function publish(data) {
          if (isUndefined(data)) throw new Error(MESSAGE_ARGUMENTS);
          var parent = this[PARENT],
              subscribers = this[SUBSCRIBERS];
          if (this[NAME] !== DEFAULT_ERROR && parent) parent.publish(data);
          trigger(this, data);
          if (!subscribers.length) return this;
          subscribers.forEach(function (subscriber) {
            return subscriber(data);
          });
          return this;

          function trigger(channel, message) {
            var retaining = channel[RETAINING],
                retentions = channel[RETENTIONS];

            if (retaining) {
              if (retentions) retentions.push(message);else retentions = [message];
              if (retaining < retentions.length) retentions.shift();
            }
          }
        }
      }, {
        key: 'retain',
        value: function retain(count) {
          var retentions = this[RETENTIONS];
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
      }, {
        key: 'subscribe',
        value: function subscribe() {
          var _SUBSCRIBERS;

          for (var _len = arguments.length, subscribers = Array(_len), _key = 0; _key < _len; _key++) {
            subscribers[_key] = arguments[_key];
          }

          if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);

          (_SUBSCRIBERS = this[SUBSCRIBERS]).push.apply(_SUBSCRIBERS, subscribers);

          if (this[RETAINING]) {
            this[RETENTIONS].forEach(function (retention) {
              return subscribers.forEach(function (subscriber) {
                return subscriber(retention);
              });
            });
          }

          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          var _this2 = this;

          for (var _len2 = arguments.length, subscribers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            subscribers[_key2] = arguments[_key2];
          }

          if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
          subscribers.forEach(function (subscriber) {
            var index = _this2[SUBSCRIBERS].indexOf(subscriber);

            if (index !== -1) _this2[SUBSCRIBERS].splice(index, 1);
          });
          return this;
        }
      }, {
        key: Symbol.iterator,
        value: function value() {
          return new ChannelIterator(this);
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
        key: 'retaining',
        get: function get() {
          return this[RETAINING];
        }
      }, {
        key: 'subscribers',
        get: function get() {
          return this[SUBSCRIBERS];
        }
      }]);

      return Channel;
    })(base);
  }

  function buildSectionClass(base) {
    return (function (_base2) {
      _inherits(Section, _base2);

      function Section(bus, channels) {
        _classCallCheck(this, Section);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this));

        _this3[BUS] = bus;
        _this3[CHANNELS] = channels;
        _this3[TAG] = 'Section';
        bus.trace('create', _this3);
        return _this3;
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
          for (var _len3 = arguments.length, subscribers = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            subscribers[_key3] = arguments[_key3];
          }

          this[CHANNELS].forEach(function (channel) {
            return channel.subscribe.apply(channel, subscribers);
          });
          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          for (var _len4 = arguments.length, subscribers = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            subscribers[_key4] = arguments[_key4];
          }

          this[CHANNELS].forEach(function (channel) {
            return channel.unsubscribe.apply(channel, subscribers);
          });
          return this;
        }
      }, {
        key: Symbol.iterator,
        value: function value() {
          return new ChannelIterator(this);
        }
      }, {
        key: 'channels',
        get: function get() {
          return this[CHANNELS];
        }
      }]);

      return Section;
    })(base);
  }

  function buildMessageClass(base) {
    return (function (_base3) {
      _inherits(Message, _base3);

      function Message() {
        _classCallCheck(this, Message);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this));

        _this4[CHANNEL] = new Map();
        _this4[DATA] = new Map();
        _this4[HEADERS] = new Map();
        _this4[TAG] = 'Message';

        for (var _len5 = arguments.length, items = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          items[_key5] = arguments[_key5];
        }

        items.forEach(function (item) {
          return use(_this4, item);
        });
        return _this4;
      }

      return Message;
    })(base);

    function use(message, argument) {
      var channel = message[CHANNEL],
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

  var Aerobus = (function () {
    function Aerobus(channelCLass, sectionClass, messageClass, delimiter, trace, bus) {
      _classCallCheck(this, Aerobus);

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

    _createClass(Aerobus, [{
      key: 'bus',
      value: (function (_bus) {
        function bus() {
          return _bus.apply(this, arguments);
        }

        bus.toString = function () {
          return _bus.toString();
        };

        return bus;
      })(function () {
        var _this5 = this;

        for (var _len6 = arguments.length, channels = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          channels[_key6] = arguments[_key6];
        }

        switch (channels.length) {
          case 0:
            return this.get(DEFAULT_ROOT);

          case 1:
            return isArray(channels[0]) ? bus.apply(undefined, _toConsumableArray(channels[0])) : this.get(channels[0]);

          default:
            return new this[SECTIONCLASS](this, channels.map(function (channel) {
              return _this5.get(channel);
            }));
        }
      })
    }, {
      key: 'clear',
      value: function clear() {
        this.trace('clear', this[BUS]);
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
        this[CONFIGURABLE] = true;
      }
    }, {
      key: 'get',
      value: function get(name) {
        var channels = this[CHANNELS],
            channel = channels.get(name);

        if (!channel) {
          var parent = undefined;

          if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
            if (!isString(name)) throw new TypeError(MESSAGE_NAME);
            var index = name.indexOf(this[DELIMITER]);
            parent = this.get(-1 === index ? DEFAULT_ROOT : name.substr(0, index));
          }

          channel = new this[CHANNELCLASS](this, name, parent, this[MESSAGECLASS]);
          this[CONFIGURABLE] = false;
          channels.set(name, channel);
        }

        return channel;
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

        return this[BUS];
      }
    }, {
      key: 'channels',
      get: function get() {
        return arrayFrom(this[CHANNELS].values());
      }
    }, {
      key: 'delimiter',
      get: function get() {
        return this[DELIMITER];
      },
      set: function set(value) {
        if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
        if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
        this[DELIMITER] = value;
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
        return this[TRACE];
      },
      set: function set(value) {
        if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
        if (!isFunction(value)) throw new TypeError(MESSAGE_TRACE);
        this[TRACE] = value;
      }
    }]);

    return Aerobus;
  })();

  var ChannelIterator = (function () {
    function ChannelIterator(channel) {
      var _this6 = this;

      _classCallCheck(this, ChannelIterator);

      this[CHANNEL] = channel;
      this[DONE] = false;
      this[MESSAGES] = [];
      this[REJECTS] = [];
      this[RESOLVES] = [];

      this[SUBSCRIPTION] = function (message) {
        var resolves = _this6[RESOLVES];
        if (resolves.length) resolves.shift()(message);else _this6[MESSAGES].push(message);
      };

      channel.subscribe(this[SUBSCRIPTION]);
    }

    _createClass(ChannelIterator, [{
      key: 'done',
      value: function done() {
        if (this[DONE]) return;
        this[DONE] = true;
        this[CHANNEL].unsubscribe(this[SUBSCRIPTION]);
        this[REJECTS].forEach(function (reject) {
          return reject();
        });
        this[REJECTS].length = this[RESOLVES].length = this[MESSAGES].length = 0;
      }
    }, {
      key: 'next',
      value: function next() {
        var messages = this[MESSAGES],
            rejects = this[REJECTS],
            resolves = this[RESOLVES];
        return this[DONE] ? {
          done: true
        } : {
          value: messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
            rejects.push(reject);
            resolves.push(resolve);
          })
        };
      }
    }]);

    return ChannelIterator;
  })();

  function aerobus() {
    var delimiter = undefined,
        trace = undefined,
        extention = undefined;

    for (var _len7 = arguments.length, parameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      parameters[_key7] = arguments[_key7];
    }

    if (parameters.length > 3) throw new Error(MESSAGE_ARGUMENTS);
    parameters.forEach(function (parameter) {
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

    var channelExtention = function channelExtention() {},
        sectionExtention = function sectionExtention() {},
        messageExtention = function messageExtention() {};

    _objectAssign(channelExtention.prototype, extention['Channel']);

    _objectAssign(sectionExtention.prototype, extention['Section']);

    _objectAssign(messageExtention.prototype, extention['Message']);

    var channelClass = buildChannelClass(channelExtention),
        sectionClass = buildSectionClass(sectionExtention),
        messageClass = buildMessageClass(messageExtention);
    var context = new Aerobus(channelClass, sectionClass, messageClass, delimiter, trace);
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

    function unsubscribe() {
      context.unsubscribe.apply(context, arguments);
      return bus;
    }
  }

  exports.default = aerobus;
});
