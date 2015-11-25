'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['module', 'exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(module, exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod, mod.exports);
    global.aerobus = mod.exports;
  }
})(this, function (module, exports) {
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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DEFAULT_DELIMITER = '.',
      DEFAULT_ERROR = 'error',
      DEFAULT_ROOT = '';
  var MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
      MESSAGE_FORBIDDEN = 'Operation is forbidden.',
      MESSAGE_NAME = 'Name expected to be string.',
      MESSAGE_TRACE = 'Trace expected to be a function.';
  var CHANNEL = Symbol('channel'),
      BUS = Symbol('bus'),
      CHANNELS = Symbol('channels'),
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
      defineProperties = Object.defineProperties,
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

  function aerobus() {
    var ChannelBase = function ChannelBase() {
      _classCallCheck(this, ChannelBase);
    };

    var MessageBase = function MessageBase() {
      _classCallCheck(this, MessageBase);
    };

    var SectionBase = function SectionBase() {
      _classCallCheck(this, SectionBase);
    };

    var channels = new Map(),
        config = {
      delimiter: DEFAULT_DELIMITER,
      isSealed: false,
      trace: noop
    };

    for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
      parameters[_key] = arguments[_key];
    }

    parameters.forEach(function (parameter) {
      if (isFunction(parameter)) config.trace = parameter;else if (isString(parameter)) config.delimiter = parameter;else if (isObject(parameter)) {
        assign(ChannelBase.prototype, parameter.channel);
        assign(MessageBase.prototype, parameter.message);
        assign(SectionBase.prototype, parameter.section);
      }
    });
    var Channel = extendChannel(ChannelBase),
        Message = extendMessage(MessageBase),
        Section = extendSection(SectionBase);
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
      message: {
        value: message
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
      for (var _len2 = arguments.length, names = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        names[_key2] = arguments[_key2];
      }

      switch (names.length) {
        case 0:
          return getChannel(DEFAULT_ROOT);

        case 1:
          return getChannel(names[0]);

        default:
          return new Section(names.map(function (name) {
            return getChannel(name);
          }));
      }
    }

    function clear() {
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
      config.isSealed = false;
      return bus;
    }

    function getChannel(name) {
      var channel = channels.get(name);

      if (!channel) {
        var parent = undefined;

        if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
          if (!isString(name)) throw new TypeError(MESSAGE_NAME);
          var index = name.indexOf(config.delimiter);
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
      if (config.isSealed) throw new Error(MESSAGE_FORBIDDEN);
      if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
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
      if (config.isSealed) throw new Error(MESSAGE_FORBIDDEN);
      if (!isFunction(value)) throw new Error(MESSAGE_TRACE);
      config.trace = value;
    }

    function message() {
      for (var _len3 = arguments.length, items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        items[_key3] = arguments[_key3];
      }

      return new (Function.prototype.bind.apply(Message, [null].concat(items)))();
    }

    function unsubscribe() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = channels.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

      return bus;
    }
  }

  var Iterator = (function () {
    function Iterator(parent) {
      var _this = this;

      _classCallCheck(this, Iterator);

      this[DONE] = false;
      this[MESSAGES] = [];
      this[REJECTORS] = [];
      this[RESOLVERS] = [];
      this[PARENT] = parent.subscribe(this[SUBSCRIPTION] = function (data, message) {
        var resolves = _this[RESOLVERS];
        if (resolves.length) resolves.shift()(message);else _this[MESSAGES].push(message);
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
        var _this2 = this;

        if (this[DONE]) return {
          done: true
        };
        var messages = this[MESSAGES],
            value = messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
          _this2[REJECTORS].push(reject);

          _this2[RESOLVERS].push(resolve);
        });
        return {
          value: value
        };
      }
    }]);

    return Iterator;
  })();

  function extendChannel(base) {
    return (function (_base) {
      _inherits(Channel, _base);

      function Channel(bus, name, parent) {
        _classCallCheck(this, Channel);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this));

        _this3[BUS] = bus;
        _this3[ENABLED] = true;
        _this3[NAME] = name;
        _this3[PARENT] = parent;
        var retentions = _this3[RETENTIONS] = [];
        retentions.limit = 0;
        retentions.period = 0;
        _this3[SUBSCRIBERS] = [];
        _this3[TAG] = 'Channel';
        bus.trace('create', _this3);
        return _this3;
      }

      _createClass(Channel, [{
        key: 'clear',
        value: function clear() {
          this[ENABLED] = true;
          this[RETENTIONS].length = 0;
          this[SUBSCRIBERS] = [];
          this[BUS].trace('clear', this);
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
          if (!this[ENABLED]) return;
          var bus = this[BUS],
              message = bus.message(this, data);
          var retentions = this[RETENTIONS];

          if (retentions.limit > 0) {
            retentions.push(message);
            if (retentions.length > retentions.limit) retentions.shift();
          }

          if (this[NAME] !== DEFAULT_ERROR) {
            var parent = this[PARENT];
            if (parent) parent.publish(message);
            this[SUBSCRIBERS].forEach(function (subscriber) {
              try {
                subscriber(message.data, message);
              } catch (error) {
                bus.error.publish(bus.message(message, error));
              }
            });
          } else this[SUBSCRIBERS].forEach(function (subscriber) {
            return subscriber(message.error, message);
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
          this[BUS].trace('retain', this);
          return this;
        }
      }, {
        key: 'subscribe',
        value: function subscribe() {
          var _SUBSCRIBERS;

          for (var _len4 = arguments.length, subscribers = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            subscribers[_key4] = arguments[_key4];
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

          for (var _len5 = arguments.length, subscribers = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            subscribers[_key5] = arguments[_key5];
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

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this));

        _this4[HEADERS] = {};
        _this4[TAG] = 'Message';

        for (var _len6 = arguments.length, items = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          items[_key6] = arguments[_key6];
        }

        items.forEach(function (item) {
          if (isChannel(item)) {
            if (isUndefined(_this4[CHANNEL])) _this4[CHANNEL] = item.name;
          } else if (isFunction(item)) _this4[DATA] = item();else if (isError(item)) _this4[ERROR] = item;else if (isMessage(item)) {
            if (isUndefined(_this4[CHANNEL])) _this4[CHANNEL] = item.channel;
            _this4[DATA] = item.data;
            _this4[ERROR] = item.error;
            assign(_this4[HEADERS], item.headers);
          } else _this4[DATA] = item;
        });
        return _this4;
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

      function Section(channels) {
        _classCallCheck(this, Section);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this));

        _this5[CHANNELS] = channels;
        _this5[TAG] = 'Section';
        return _this5;
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
          for (var _len7 = arguments.length, subscribers = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            subscribers[_key7] = arguments[_key7];
          }

          this[CHANNELS].forEach(function (channel) {
            return channel.subscribe.apply(channel, subscribers);
          });
          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          for (var _len8 = arguments.length, subscribers = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            subscribers[_key8] = arguments[_key8];
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

  exports.default = aerobus;
  module.exports = exports['default'];
});
