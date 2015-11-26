/*
  bus.root.subscribe().after('name', 1).once()
  bus.root.subscribe().until('name').once()
  bus.root.subscribe().once()
  bus.root.subscribe().cycle()
  bus.root.subscribe().random()
*/

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
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

  var DELIMITER = '.',
      ERROR = 'error',
      ROOT = '';

  var ERROR_DELIMITER = 'Delimiter expected to be not empty string.',
      ERROR_FORBIDDEN = 'This operation is forbidden for not empty bus instance.',
      ERROR_NAME = 'Name expected to be string.',
      ERROR_SUBSCRIBER = 'Subscriber expected to be a function.',
      ERROR_TRACE = 'Trace expected to be a function.',
      AEROBUS = 'Aerobus',
      CLASS_AEROBUS_CHANNEL = AEROBUS + DELIMITER + 'Channel',
      CLASS_AEROBUS_ITERATOR = AEROBUS + DELIMITER + 'Iterator',
      CLASS_AEROBUS_MESSAGE = AEROBUS + DELIMITER + 'Message',
      CLASS_AEROBUS_SECTION = AEROBUS + DELIMITER + 'Section',
      CLASS_ERROR = 'Error',
      CLASS_FUNCTION = 'Function',
      CLASS_NUMBER = 'Number',
      CLASS_OBJECT = 'Object',
      CLASS_STRING = 'String',
      $CLASS = Symbol.toStringTag,
      $ITERATOR = Symbol.iterator,
      $CHANNEL = Symbol('channel'),
      $BUS = Symbol('bus'),
      $CHANNELS = Symbol('channels'),
      $DATA = Symbol('data'),
      $DONE = Symbol('done'),
      $ENABLED = Symbol('enabled'),
      $ERROR = Symbol('error'),
      $MESSAGES = Symbol('messages'),
      $NAME = Symbol('name'),
      $PARENT = Symbol('parent'),
      $RETENTIONS = Symbol('retentions'),
      $RESOLVERS = Symbol('resolvers'),
      $REJECTORS = Symbol('rejectors'),
      $SUBSCRIBERS = Symbol('subscribers'),
      $SUBSCRIPTION = Symbol('subscription'),
      array = Array.from,
      assign = Object.assign,
      classof = Object.classof,
      defineProperties = Object.defineProperties,
      defineProperty = Object.defineProperty,
      isFunction = function isFunction(value) {
    return classof(value) === CLASS_FUNCTION;
  },
      isNothing = function isNothing(value) {
    return value == null;
  },
      isNumber = function isNumber(value) {
    return classof(value) === CLASS_NUMBER;
  },
      isSomething = function isSomething(value) {
    return value != null;
  },
      isString = function isString(value) {
    return classof(value) === CLASS_STRING;
  },
      maxSafeInteger = Number.MAX_SAFE_INTEGER,
      noop = function noop() {},
      throwError = function throwError(error) {
    throw new Error(error);
  };

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
      delimiter: DELIMITER,
      isSealed: false,
      trace: noop
    };

    for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
      parameters[_key] = arguments[_key];
    }

    parameters.forEach(function (parameter) {
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
          if (parameter.length === 0) throwError(ERROR_DELIMITER);
          config.delimiter = parameter;
          break;
      }
    });
    var Channel = createChannelClass(ChannelBase),
        Message = createMessageClass(MessageBase),
        Section = createSectionClass(SectionBase);
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
      },
      wrap: {
        value: wrap
      }
    });

    function bus() {
      for (var _len2 = arguments.length, names = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        names[_key2] = arguments[_key2];
      }

      switch (names.length) {
        case 0:
          return retrieve(ROOT);

        case 1:
          return retrieve(names[0]);

        default:
          return new Section(names.map(function (name) {
            return retrieve(name);
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

    function getChannels() {
      return array(channels.values());
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
      var channel = channels.get(name);

      if (!channel) {
        var parent = undefined;

        if (name !== ROOT && name !== ERROR) {
          if (!isString(name)) throwError(ERROR_NAME);
          var index = name.indexOf(config.delimiter);
          parent = retrieve(-1 === index ? ROOT : name.substr(0, index));
        }

        channel = new Channel(bus, name, parent);
        config.isSealed = true;
        channels.set(name, channel);
      }

      return channel;
    }

    function wrap() {
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

      this[$CLASS] = CLASS_AEROBUS_ITERATOR;
      this[$DONE] = false;
      this[$MESSAGES] = [];
      this[$PARENT] = parent.subscribe(this[$SUBSCRIPTION] = function (data, message) {
        var resolves = _this[$RESOLVERS];
        if (resolves.length) resolves.shift()(message);else _this[$MESSAGES].push(message);
      });
      this[$REJECTORS] = [];
      this[$RESOLVERS] = [];
    }

    _createClass(Iterator, [{
      key: 'done',
      value: function done() {
        if (this[$DONE]) return;
        this[$DONE] = true;
        this[$PARENT].unsubscribe(this[$SUBSCRIPTION]);
        this[$REJECTORS].forEach(function (reject) {
          return reject();
        });
        this[$MESSAGES] = this[$PARENT] = this[$REJECTORS] = this[$RESOLVERS] = this[$SUBSCRIPTION] = undefined;
      }
    }, {
      key: 'next',
      value: function next() {
        var _this2 = this;

        if (this[$DONE]) return {
          done: true
        };
        var messages = this[$MESSAGES],
            value = messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
          _this2[$REJECTORS].push(reject);

          _this2[$RESOLVERS].push(resolve);
        });
        return {
          value: value
        };
      }
    }]);

    return Iterator;
  })();

  function createChannelClass(base) {
    return (function (_base) {
      _inherits(Channel, _base);

      function Channel(bus, name, parent) {
        var _defineProperties;

        _classCallCheck(this, Channel);

        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this));

        var retentions = [];
        retentions.limit = 0;
        retentions.period = 0;
        defineProperties(_this3, (_defineProperties = {}, _defineProperty(_defineProperties, $BUS, {
          value: bus
        }), _defineProperty(_defineProperties, $CLASS, {
          value: CLASS_AEROBUS_CHANNEL
        }), _defineProperty(_defineProperties, $ENABLED, {
          value: true,
          writable: true
        }), _defineProperty(_defineProperties, $NAME, {
          value: name,
          enumerable: true
        }), _defineProperty(_defineProperties, $PARENT, {
          value: parent
        }), _defineProperty(_defineProperties, $RETENTIONS, {
          value: retentions
        }), _defineProperty(_defineProperties, $SUBSCRIBERS, {
          value: []
        }), _defineProperties));
        bus.trace('create', _this3);
        return _this3;
      }

      _createClass(Channel, [{
        key: 'clear',
        value: function clear() {
          this[$ENABLED] = true;
          this[$RETENTIONS].length = this[$SUBSCRIBERS].length = 0;
          this[$BUS].trace('clear', this);
        }
      }, {
        key: 'disable',
        value: function disable() {
          if (this[$ENABLED]) {
            this[$BUS].trace('disable', this);
            this[$ENABLED] = false;
          }

          return this;
        }
      }, {
        key: 'enable',
        value: function enable() {
          var _enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

          if (!_enable) return this.disable();

          if (!this[$ENABLED]) {
            this[$BUS].trace('enable', this);
            this[$ENABLED] = true;
          }

          return this;
        }
      }, {
        key: 'publish',
        value: function publish(data) {
          if (!this.isEnabled) return;
          var bus = this[$BUS],
              message = bus.wrap(this, data);
          var retentions = this[$RETENTIONS];

          if (retentions.limit > 0) {
            retentions.push(message);
            if (retentions.length > retentions.limit) retentions.shift();
          }

          if (this[$NAME] !== ERROR) {
            var parent = this[$PARENT];
            if (parent) parent.publish(message);
            this[$SUBSCRIBERS].forEach(function (subscriber) {
              try {
                subscriber(message.data, message);
              } catch (error) {
                bus.error.publish(bus.wrap(message, error));
              }
            });
          } else this[$SUBSCRIBERS].forEach(function (subscriber) {
            return subscriber(message.error, message);
          });

          return this;
        }
      }, {
        key: 'retain',
        value: function retain(limit) {
          var retentions = this[$RETENTIONS];
          retentions.limit = arguments.length ? isNumber(limit) ? Math.max(limit, 0) : limit ? maxSafeInteger : 0 : maxSafeInteger;
          if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
          this[$BUS].trace('retain', this);
          return this;
        }
      }, {
        key: 'subscribe',
        value: function subscribe() {
          var _$SUBSCRIBERS;

          for (var _len4 = arguments.length, subscribers = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            subscribers[_key4] = arguments[_key4];
          }

          if (!subscribers.every(isFunction)) throwError(ERROR_SUBSCRIBER);

          (_$SUBSCRIBERS = this[$SUBSCRIBERS]).push.apply(_$SUBSCRIBERS, subscribers);

          this[$RETENTIONS].forEach(function (message) {
            return subscribers.forEach(function (subscriber) {
              return subscriber(message.data, message);
            });
          });
          return this;
        }
      }, {
        key: 'toggle',
        value: function toggle() {
          this[$ENABLED] ? this.disable() : this.enable();
          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          var list = this[$SUBSCRIBERS];

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
        key: $ITERATOR,
        value: function value() {
          return new Iterator(this);
        }
      }, {
        key: 'bus',
        get: function get() {
          return this[$BUS];
        }
      }, {
        key: 'isEnabled',
        get: function get() {
          return this[$ENABLED] && (!this[$PARENT] || this[$PARENT].isEnabled);
        }
      }, {
        key: 'name',
        get: function get() {
          return this[$NAME];
        }
      }, {
        key: 'parent',
        get: function get() {
          return this[$PARENT];
        }
      }, {
        key: 'retentions',
        get: function get() {
          var retentions = this[$RETENTIONS],
              clone = [].concat(_toConsumableArray(retentions));
          clone.limit = retentions.limit;
          return clone;
        }
      }, {
        key: 'root',
        get: function get() {
          return this[$BUS].root;
        }
      }, {
        key: 'subscribers',
        get: function get() {
          return [].concat(_toConsumableArray(this[$SUBSCRIBERS]));
        }
      }]);

      return Channel;
    })(base);
  }

  function createMessageClass(base) {
    return (function (_base2) {
      _inherits(Message, _base2);

      function Message() {
        var _defineProperties2;

        _classCallCheck(this, Message);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this));

        var channel = undefined,
            data = undefined,
            error = undefined;

        for (var _len6 = arguments.length, parameters = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          parameters[_key6] = arguments[_key6];
        }

        parameters.forEach(function (parameter) {
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
        defineProperties(_this4, (_defineProperties2 = {}, _defineProperty(_defineProperties2, $CHANNEL, {
          value: channel,
          enumerable: true
        }), _defineProperty(_defineProperties2, $CLASS, {
          value: CLASS_AEROBUS_MESSAGE
        }), _defineProperty(_defineProperties2, $DATA, {
          value: data,
          enumerable: true
        }), _defineProperties2));
        if (isSomething(error)) defineProperty(_this4, $ERROR, {
          value: error,
          enumerable: true
        });
        return _this4;
      }

      _createClass(Message, [{
        key: 'channel',
        get: function get() {
          return this[$CHANNEL];
        }
      }, {
        key: 'data',
        get: function get() {
          return this[$DATA];
        }
      }, {
        key: 'error',
        get: function get() {
          return this[$ERROR];
        }
      }]);

      return Message;
    })(base);
  }

  function createSectionClass(base) {
    function propagate(channels, method, parameters) {
      channels.forEach(parameters && parameters.length ? function (channel) {
        return channel[method].apply(channel, parameters);
      } : function (channel) {
        return channel[method]();
      });
    }

    return (function (_base3) {
      _inherits(Section, _base3);

      function Section(channels) {
        _classCallCheck(this, Section);

        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this));

        _this5[$CLASS] = CLASS_AEROBUS_SECTION;
        _this5[$CHANNELS] = channels;
        return _this5;
      }

      _createClass(Section, [{
        key: 'clear',
        value: function clear() {
          propagate(this[$CHANNELS], 'clear');
          return this;
        }
      }, {
        key: 'disable',
        value: function disable() {
          propagate(this[$CHANNELS], 'disable');
          return this;
        }
      }, {
        key: 'enable',
        value: function enable(value) {
          propagate(this[$CHANNELS], 'enable', [value]);
          return this;
        }
      }, {
        key: 'publish',
        value: function publish(data) {
          propagate(this[$CHANNELS], 'publish', [data]);
          return this;
        }
      }, {
        key: 'subscribe',
        value: function subscribe() {
          for (var _len7 = arguments.length, subscribers = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            subscribers[_key7] = arguments[_key7];
          }

          propagate(this[$CHANNELS], 'subscribe', subscribers);
          return this;
        }
      }, {
        key: 'enable',
        value: function enable() {
          propagate(this[$CHANNELS], 'toggle');
          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          for (var _len8 = arguments.length, subscribers = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            subscribers[_key8] = arguments[_key8];
          }

          propagate(this[$CHANNELS], 'unsubscribe', subscribers);
          return this;
        }
      }, {
        key: $ITERATOR,
        value: function value() {
          return new Iterator(this);
        }
      }, {
        key: 'bus',
        get: function get() {
          return this[$BUS];
        }
      }, {
        key: 'channels',
        get: function get() {
          return [].concat(_toConsumableArray(this[$CHANNELS]));
        }
      }]);

      return Section;
    })(base);
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});
