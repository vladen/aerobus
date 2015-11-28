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

  var CHANNEL_HIERARCHY_DELIMITER = '.',
      CHANNEL_NAME_ERROR = 'error',
      CHANNEL_NAME_ROOT = '',
      ERROR_CALLBACK = 'Callback expected to be a function.',
      ERROR_DELIMITER = 'Delimiter expected to be not empty string.',
      ERROR_FORBIDDEN = 'This operation is forbidden for not empty bus instance.',
      ERROR_NAME = 'Name expected to be string.',
      ERROR_SUBSCRIBTION = 'Subscription expected to be a function.',
      ERROR_TRACE = 'Trace expected to be a function.',
      AEROBUS = 'Aerobus',
      CLASS_AEROBUS_CHANNEL = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Channel',
      CLASS_AEROBUS_ITERATOR = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Iterator',
      CLASS_AEROBUS_MESSAGE = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Message',
      CLASS_AEROBUS_SECTION = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Section',
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
      $CHANNEL_NAME_ERROR = Symbol('error'),
      $MESSAGES = Symbol('messages'),
      $NAME = Symbol('name'),
      $PARENT = Symbol('parent'),
      $RETENTIONS = Symbol('retentions'),
      $RESOLVERS = Symbol('resolvers'),
      $REJECTORS = Symbol('rejectors'),
      $SUBSCRIPTION = Symbol('subscription'),
      $SUBSCRIPTIONS = Symbol('subscriptions'),
      maxSafeInteger = Number.MAX_SAFE_INTEGER,
      classof = Object.classof,
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
      noop = function noop() {},
      extend = function extend(target, source) {
    return isNothing(source) ? target : Object.getOwnPropertyNames(source).reduce(function (result, name) {
      return result.hasOwnProperty(name) ? result : Object.defineProperty(result, name, Object.getOwnPropertyDescriptor(source, name));
    }, target);
  },
      throwError = function throwError(error) {
    throw new Error(error);
  };

  var Iterator = (function () {
    function Iterator(parent) {
      var _this = this,
          _Object$definePropert;

      _classCallCheck(this, Iterator);

      var subscription = function subscription(data, message) {
        var resolves = _this[$RESOLVERS];
        if (resolves.length) resolves.shift()(message);else _this[$MESSAGES].push(message);
      };

      Object.defineProperties(this, (_Object$definePropert = {}, _defineProperty(_Object$definePropert, $CLASS, {
        value: CLASS_AEROBUS_ITERATOR
      }), _defineProperty(_Object$definePropert, $DONE, {
        value: false,
        writable: true
      }), _defineProperty(_Object$definePropert, $MESSAGES, {
        value: []
      }), _defineProperty(_Object$definePropert, $PARENT, {
        value: parent
      }), _defineProperty(_Object$definePropert, $REJECTORS, {
        value: []
      }), _defineProperty(_Object$definePropert, $RESOLVERS, {
        value: []
      }), _defineProperty(_Object$definePropert, $SUBSCRIPTION, {
        value: subscription
      }), _Object$definePropert));
      parent.subscribe(subscription);
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

  var Channel = (function () {
    function Channel(bus, name, parent) {
      var _Object$definePropert2;

      _classCallCheck(this, Channel);

      var retentions = [];
      retentions.limit = 0;
      retentions.period = 0;
      Object.defineProperties(this, (_Object$definePropert2 = {}, _defineProperty(_Object$definePropert2, $BUS, {
        value: bus
      }), _defineProperty(_Object$definePropert2, $CLASS, {
        value: CLASS_AEROBUS_CHANNEL
      }), _defineProperty(_Object$definePropert2, $ENABLED, {
        value: true,
        writable: true
      }), _defineProperty(_Object$definePropert2, $NAME, {
        value: name
      }), _defineProperty(_Object$definePropert2, $PARENT, {
        value: parent
      }), _defineProperty(_Object$definePropert2, $RETENTIONS, {
        value: retentions
      }), _defineProperty(_Object$definePropert2, $SUBSCRIPTIONS, {
        value: []
      }), _Object$definePropert2));
      bus.trace('create', this);
    }

    _createClass(Channel, [{
      key: 'clear',
      value: function clear() {
        this[$BUS].trace('clear', this);
        this[$RETENTIONS].length = this[$SUBSCRIPTIONS].length = 0;
        return this;
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
      value: function publish(data, callback) {
        if (isSomething(callback) && !isFunction(callback)) throwError(ERROR_CALLBACK);
        if (!this.isEnabled) return;
        var bus = this[$BUS],
            message = bus.message(this, data),
            subscriptions = this[$SUBSCRIPTIONS];
        var retentions = this[$RETENTIONS];

        if (retentions.limit > 0) {
          retentions.push(message);
          if (retentions.length > retentions.limit) retentions.shift();
        }

        if (this[$NAME] === CHANNEL_NAME_ERROR) {
          if (callback) {
            (function () {
              var results = [];
              subscriptions.forEach(function (subscription) {
                return results.push(subscription(message.error, message));
              });
              callback(results);
            })();
          } else subscriptions.forEach(function (subscription) {
            return subscription(message.error, message);
          });

          return this;
        }

        var parent = this[$PARENT];

        if (callback) {
          (function () {
            var results = [];
            if (parent) parent.publish(message, function (parentResults) {
              return results.push.apply(results, _toConsumableArray(parentResults));
            });
            subscriptions.forEach(function (subscription) {
              try {
                results.push(subscription(message.data, message));
              } catch (error) {
                results.push(error);
                bus.error.publish(bus.message(message, error), function (errorResults) {
                  return error.results = errorResults;
                });
              }
            });
            callback(results);
          })();
        } else {
          if (parent) parent.publish(message);
          subscriptions.forEach(function (subscription) {
            try {
              subscription(message.data, message);
            } catch (error) {
              bus.error.publish(bus.message(message, error));
            }
          });
        }

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
      key: 'reset',
      value: function reset() {
        this[$BUS].trace('reset', this);
        this.clear();
        this[$ENABLED] = true;
        this[$RETENTIONS].limit = 0;
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        var _$SUBSCRIPTIONS;

        for (var _len = arguments.length, subscriptions = Array(_len), _key = 0; _key < _len; _key++) {
          subscriptions[_key] = arguments[_key];
        }

        if (!subscriptions.every(isFunction)) throwError(ERROR_SUBSCRIBTION);

        (_$SUBSCRIPTIONS = this[$SUBSCRIPTIONS]).push.apply(_$SUBSCRIPTIONS, subscriptions);

        this[$RETENTIONS].forEach(function (message) {
          return subscriptions.forEach(function (subscription) {
            return subscription(message.data, message);
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
        var _this3 = this;

        for (var _len2 = arguments.length, subscriptions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          subscriptions[_key2] = arguments[_key2];
        }

        if (subscriptions.length) {
          (function () {
            var list = _this3[$SUBSCRIPTIONS];
            subscriptions.forEach(function (subscription) {
              var index = list.indexOf(subscription);
              if (index !== -1) list.splice(index, 1);
            });
          })();
        } else this[$SUBSCRIPTIONS].length = 0;

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
      key: 'subscriptions',
      get: function get() {
        return [].concat(_toConsumableArray(this[$SUBSCRIPTIONS]));
      }
    }]);

    return Channel;
  })();

  var Message = (function () {
    function Message() {
      var _Object$definePropert3;

      _classCallCheck(this, Message);

      var channel = undefined,
          data = undefined,
          error = undefined;

      for (var _len3 = arguments.length, components = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        components[_key3] = arguments[_key3];
      }

      components.forEach(function (component) {
        switch (classof(component)) {
          case CLASS_AEROBUS_CHANNEL:
            if (isNothing(channel)) channel = component[$NAME];
            break;

          case CLASS_AEROBUS_MESSAGE:
            if (isNothing(channel)) channel = component[$CHANNEL];
            if (isNothing(data)) data = component[$DATA];
            if (isNothing(error)) error = component[$CHANNEL_NAME_ERROR];
            break;

          case CLASS_ERROR:
            if (isNothing(error)) error = component;
            break;

          default:
            if (isNothing(data)) data = component;
            break;
        }
      });
      Object.defineProperties(this, (_Object$definePropert3 = {}, _defineProperty(_Object$definePropert3, $CHANNEL, {
        value: channel,
        enumerable: true
      }), _defineProperty(_Object$definePropert3, $CLASS, {
        value: CLASS_AEROBUS_MESSAGE
      }), _defineProperty(_Object$definePropert3, $DATA, {
        value: data,
        enumerable: true
      }), _Object$definePropert3));
      if (isSomething(error)) Object.defineProperty(this, $CHANNEL_NAME_ERROR, {
        value: error,
        enumerable: true
      });
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
        return this[$CHANNEL_NAME_ERROR];
      }
    }]);

    return Message;
  })();

  var Section = (function () {
    function Section(bus, channels) {
      var _Object$definePropert4;

      _classCallCheck(this, Section);

      Object.defineProperties(this, (_Object$definePropert4 = {}, _defineProperty(_Object$definePropert4, $BUS, {
        value: bus
      }), _defineProperty(_Object$definePropert4, $CLASS, {
        value: CLASS_AEROBUS_SECTION
      }), _defineProperty(_Object$definePropert4, $CHANNELS, {
        value: channels
      }), _Object$definePropert4));
    }

    _createClass(Section, [{
      key: 'clear',
      value: function clear() {
        this[$CHANNELS].forEach(function (channel) {
          return channel.clear();
        });
        return this;
      }
    }, {
      key: 'disable',
      value: function disable() {
        this[$CHANNELS].forEach(function (channel) {
          return channel.disable();
        });
        return this;
      }
    }, {
      key: 'enable',
      value: function enable(value) {
        this[$CHANNELS].forEach(function (channel) {
          return channel.enable(value);
        });
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        this[$CHANNELS].forEach(function (channel) {
          return channel.publish(data, callback);
        });
        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        this[$CHANNELS].forEach(function (channel) {
          return channel.reset();
        });
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        for (var _len4 = arguments.length, subscriptions = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          subscriptions[_key4] = arguments[_key4];
        }

        this[$CHANNELS].forEach(function (channel) {
          return channel.subscribe.apply(channel, subscriptions);
        });
        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this[$CHANNELS].forEach(function (channel) {
          return channel.toggle();
        });
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        for (var _len5 = arguments.length, subscriptions = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          subscriptions[_key5] = arguments[_key5];
        }

        this[$CHANNELS].forEach(function (channel) {
          return channel.unsubscribe.apply(channel, subscriptions);
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
      key: 'channels',
      get: function get() {
        return [].concat(_toConsumableArray(this[$CHANNELS]));
      }
    }]);

    return Section;
  })();

  function subclassChannel() {
    return (function (_Channel) {
      _inherits(ChannelExtended, _Channel);

      function ChannelExtended(bus, name, parent) {
        _classCallCheck(this, ChannelExtended);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(ChannelExtended).call(this, bus, name, parent));
      }

      return ChannelExtended;
    })(Channel);
  }

  function subclassMessage() {
    return (function (_Message) {
      _inherits(MessageExtended, _Message);

      function MessageExtended() {
        var _Object$getPrototypeO;

        _classCallCheck(this, MessageExtended);

        for (var _len6 = arguments.length, components = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          components[_key6] = arguments[_key6];
        }

        return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(MessageExtended)).call.apply(_Object$getPrototypeO, [this].concat(components)));
      }

      return MessageExtended;
    })(Message);
  }

  function subsclassSection() {
    return (function (_Section) {
      _inherits(SectionExtended, _Section);

      function SectionExtended(bus, channels) {
        _classCallCheck(this, SectionExtended);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(SectionExtended).call(this, bus, channels));
      }

      return SectionExtended;
    })(Section);
  }

  function aerobus() {
    var ChannelExtended = subclassChannel(),
        MessageExtended = subclassMessage(),
        SectionExtended = subsclassSection(),
        channels = new Map(),
        config = {
      delimiter: CHANNEL_HIERARCHY_DELIMITER,
      isSealed: false,
      trace: noop
    };

    for (var _len7 = arguments.length, parameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      parameters[_key7] = arguments[_key7];
    }

    parameters.forEach(function (parameter) {
      switch (classof(parameter)) {
        case CLASS_FUNCTION:
          config.trace = parameter;
          break;

        case CLASS_OBJECT:
          extend(ChannelExtended.prototype, parameter.channel);
          extend(MessageExtended.prototype, parameter.message);
          extend(SectionExtended.prototype, parameter.section);
          break;

        case CLASS_STRING:
          if (parameter.length === 0) throwError(ERROR_DELIMITER);
          config.delimiter = parameter;
          break;
      }
    });
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
      for (var _len8 = arguments.length, names = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        names[_key8] = arguments[_key8];
      }

      switch (names.length) {
        case 0:
          return retrieve(CHANNEL_NAME_ROOT);

        case 1:
          return retrieve(names[0]);

        default:
          return new SectionExtended(bus, names.map(function (name) {
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
      return Array.from(channels.values());
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
      return retrieve(CHANNEL_NAME_ERROR);
    }

    function getRoot() {
      return retrieve(CHANNEL_NAME_ROOT);
    }

    function getTrace() {
      return config.trace;
    }

    function setTrace(value) {
      if (config.isSealed) throwError(ERROR_FORBIDDEN);
      if (!isFunction(value)) throwError(ERROR_TRACE);
      config.trace = value;
    }

    function message() {
      for (var _len9 = arguments.length, components = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        components[_key9] = arguments[_key9];
      }

      return new (Function.prototype.bind.apply(MessageExtended, [null].concat(components)))();
    }

    function retrieve(name) {
      var channel = channels.get(name);

      if (!channel) {
        var parent = undefined;

        if (name !== CHANNEL_NAME_ROOT && name !== CHANNEL_NAME_ERROR) {
          if (!isString(name)) throwError(ERROR_NAME);
          var index = name.indexOf(config.delimiter);
          parent = retrieve(-1 === index ? CHANNEL_NAME_ROOT : name.substr(0, index));
        }

        channel = new ChannelExtended(bus, name, parent);
        config.isSealed = true;
        channels.set(name, channel);
      }

      return channel;
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

  exports.default = aerobus;
  module.exports = exports['default'];
});
