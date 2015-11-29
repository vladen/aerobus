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
      maxSafeInteger = Number.MAX_SAFE_INTEGER,
      classof = function classof(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  },
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
      noop = function noop() {},
      extend = function extend(target, source) {
    return isNothing(source) ? target : Object.getOwnPropertyNames(source).reduce(function (result, name) {
      return result.hasOwnProperty(name) ? result : defineProperty(result, name, Object.getOwnPropertyDescriptor(source, name));
    }, target);
  },
      throwError = function throwError(error) {
    throw new Error(error);
  },
      contexts = new WeakMap();

  var Iterator = (function () {
    function Iterator(parent) {
      var _this = this;

      _classCallCheck(this, Iterator);

      var subscription = function subscription(data, message) {
        var context = contexts.get(_this),
            resolvers = context.resolvers;
        if (resolvers.length) resolvers.shift()(message);else context.messages.push(message);
      };

      defineProperty(this, $CLASS, {
        value: CLASS_AEROBUS_ITERATOR
      });
      parent.subscribe(subscription);
      contexts.set(this, {
        done: false,
        messages: [],
        parent: parent,
        rejectors: [],
        resolvers: [],
        subscription: subscription
      });
    }

    _createClass(Iterator, [{
      key: 'done',
      value: function done() {
        var context = contexts.get(this);
        if (context.done) return;
        context.done = true;
        context.parent.unsubscribe(context.subscription);
        context.rejectors.forEach(function (reject) {
          return reject();
        });
      }
    }, {
      key: 'next',
      value: function next() {
        var context = contexts.get(this);
        if (context.done) return {
          done: true
        };
        var messages = context.messages,
            value = messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
          context.rejectors.push(reject);
          context.resolvers.push(resolve);
        });
        return {
          value: value
        };
      }
    }]);

    return Iterator;
  })();

  var ChannelBase = (function () {
    function ChannelBase(bus, name, parent) {
      var _defineProperties;

      _classCallCheck(this, ChannelBase);

      defineProperties(this, (_defineProperties = {}, _defineProperty(_defineProperties, $CLASS, {
        value: CLASS_AEROBUS_CHANNEL
      }), _defineProperty(_defineProperties, 'bus', {
        value: bus,
        enumerable: true
      }), _defineProperty(_defineProperties, 'name', {
        value: name,
        enumerable: true
      }), _defineProperties));
      if (isSomething(parent)) defineProperty(this, 'parent', {
        value: parent,
        enumerable: true
      });
      var retentions = [];
      retentions.limit = 0;
      contexts.set(this, {
        enabled: true,
        retentions: retentions,
        subscriptions: []
      });
      bus.trace('create', this);
    }

    _createClass(ChannelBase, [{
      key: 'clear',
      value: function clear() {
        this.bus.trace('clear', this);
        var context = contexts.get(this);
        context.retentions.length = context.subscriptions.length = 0;
        return this;
      }
    }, {
      key: 'disable',
      value: function disable() {
        var context = contexts.get(this);

        if (context.enabled) {
          this.bus.trace('disable', this);
          context.enabled = false;
        }

        return this;
      }
    }, {
      key: 'enable',
      value: function enable() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        if (!value) return this.disable();
        var context = contexts.get(this);

        if (!context.enabled) {
          this.bus.trace('enable', this);
          context.enabled = true;
        }

        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        if (isSomething(callback) && !isFunction(callback)) throwError(ERROR_CALLBACK);
        if (!this.isEnabled) return;
        var bus = this.bus,
            context = contexts.get(this),
            message = bus.message(this, data),
            retentions = context.retentions;

        if (retentions.limit > 0) {
          retentions.push(message);
          if (retentions.length > retentions.limit) retentions.shift();
        }

        var subscriptions = context.subscriptions;

        if (this.name === CHANNEL_NAME_ERROR) {
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

        var parent = this.parent;

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
        var retentions = contexts.get(this).retentions;
        retentions.limit = arguments.length ? isNumber(limit) ? Math.max(limit, 0) : limit ? maxSafeInteger : 0 : maxSafeInteger;
        if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
        this.bus.trace('retain', this);
        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        var context = contexts.get(this);
        this.bus.trace('reset', this);
        context.enabled = true;
        context.retentions.limit = 0;
        context.retentions.length = context.subscriptions.length = 0;
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        var _context$subscription;

        for (var _len = arguments.length, subscriptions = Array(_len), _key = 0; _key < _len; _key++) {
          subscriptions[_key] = arguments[_key];
        }

        if (!subscriptions.every(isFunction)) throwError(ERROR_SUBSCRIBTION);
        var context = contexts.get(this);

        (_context$subscription = context.subscriptions).push.apply(_context$subscription, subscriptions);

        context.retentions.forEach(function (message) {
          return subscriptions.forEach(function (subscription) {
            return subscription(message.data, message);
          });
        });
        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        contexts.get(this).enabled ? this.disable() : this.enable();
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        var existing = contexts.get(this).subscriptions;

        for (var _len2 = arguments.length, subscriptions = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          subscriptions[_key2] = arguments[_key2];
        }

        if (subscriptions.length) subscriptions.forEach(function (subscription) {
          var index = existing.indexOf(subscription);
          if (index !== -1) existing.splice(index, 1);
        });else existing.length = 0;
        return this;
      }
    }, {
      key: $ITERATOR,
      value: function value() {
        return new Iterator(this);
      }
    }, {
      key: 'isEnabled',
      get: function get() {
        return contexts.get(this).enabled && (!this.parent || this.parent.isEnabled);
      }
    }, {
      key: 'retentions',
      get: function get() {
        var retentions = contexts.get(this).retentions,
            clone = [].concat(_toConsumableArray(retentions));
        clone.limit = retentions.limit;
        return clone;
      }
    }, {
      key: 'subscriptions',
      get: function get() {
        return [].concat(_toConsumableArray(contexts.get(this).subscriptions));
      }
    }]);

    return ChannelBase;
  })();

  var MessageBase = function MessageBase() {
    var _defineProperties2;

    _classCallCheck(this, MessageBase);

    var channel = undefined,
        data = undefined,
        error = undefined;

    for (var _len3 = arguments.length, components = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      components[_key3] = arguments[_key3];
    }

    components.forEach(function (component) {
      switch (classof(component)) {
        case CLASS_AEROBUS_CHANNEL:
          if (isNothing(channel)) channel = component.name;
          break;

        case CLASS_AEROBUS_MESSAGE:
          if (isNothing(channel)) channel = component.channel;
          if (isNothing(data)) data = component.data;
          if (isNothing(error)) error = component.error;
          break;

        case CLASS_ERROR:
          if (isNothing(error)) error = component;
          break;

        default:
          if (isNothing(data)) data = component;
          break;
      }
    });
    defineProperties(this, (_defineProperties2 = {}, _defineProperty(_defineProperties2, $CLASS, {
      value: CLASS_AEROBUS_MESSAGE
    }), _defineProperty(_defineProperties2, 'channel', {
      value: channel,
      enumerable: true
    }), _defineProperty(_defineProperties2, 'data', {
      value: data,
      enumerable: true
    }), _defineProperties2));
    if (isSomething(error)) defineProperty(this, 'error', {
      value: error,
      enumerable: true
    });
  };

  var SectionBase = (function () {
    function SectionBase(bus, channels) {
      _classCallCheck(this, SectionBase);

      contexts.set(this, {
        channels: channels
      });
      defineProperties(this, _defineProperty({
        bus: {
          value: bus
        }
      }, $CLASS, {
        value: CLASS_AEROBUS_SECTION
      }));
    }

    _createClass(SectionBase, [{
      key: 'clear',
      value: function clear() {
        this.channels.forEach(function (channel) {
          return channel.clear();
        });
        return this;
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.channels.forEach(function (channel) {
          return channel.disable();
        });
        return this;
      }
    }, {
      key: 'enable',
      value: function enable(value) {
        this.channels.forEach(function (channel) {
          return channel.enable(value);
        });
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        this.channels.forEach(function (channel) {
          return channel.publish(data, callback);
        });
        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.channels.forEach(function (channel) {
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

        this.channels.forEach(function (channel) {
          return channel.subscribe.apply(channel, subscriptions);
        });
        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.channels.forEach(function (channel) {
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

        this.channels.forEach(function (channel) {
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
      key: 'channels',
      get: function get() {
        return [].concat(_toConsumableArray(contexts.get(this).channels));
      }
    }]);

    return SectionBase;
  })();

  function extendChannel() {
    return (function (_ChannelBase) {
      _inherits(Channel, _ChannelBase);

      function Channel(bus, name, parent) {
        _classCallCheck(this, Channel);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this, bus, name, parent));
      }

      return Channel;
    })(ChannelBase);
  }

  function extendMessage() {
    return (function (_MessageBase) {
      _inherits(Message, _MessageBase);

      function Message() {
        var _Object$getPrototypeO;

        _classCallCheck(this, Message);

        for (var _len6 = arguments.length, components = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          components[_key6] = arguments[_key6];
        }

        return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Message)).call.apply(_Object$getPrototypeO, [this].concat(components)));
      }

      return Message;
    })(MessageBase);
  }

  function extendSection() {
    return (function (_SectionBase) {
      _inherits(Section, _SectionBase);

      function Section(bus, channels) {
        _classCallCheck(this, Section);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this, bus, channels));
      }

      return Section;
    })(SectionBase);
  }

  function aerobus() {
    var channels = new Map(),
        delimiter = CHANNEL_HIERARCHY_DELIMITER,
        sealed = false,
        trace = noop,
        ExtendedChannel = extendChannel(),
        ExtendedMessage = extendMessage(),
        ExtendedSection = extendSection();

    for (var _len7 = arguments.length, parameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      parameters[_key7] = arguments[_key7];
    }

    parameters.forEach(function (parameter) {
      switch (classof(parameter)) {
        case CLASS_FUNCTION:
          trace = parameter;
          break;

        case CLASS_OBJECT:
          extend(ExtendedChannel.prototype, parameter.channel);
          extend(ExtendedMessage.prototype, parameter.message);
          extend(ExtendedSection.prototype, parameter.section);
          break;

        case CLASS_STRING:
          if (parameter.length === 0) throwError(ERROR_DELIMITER);
          delimiter = parameter;
          break;
      }
    });
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
      for (var _len8 = arguments.length, names = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        names[_key8] = arguments[_key8];
      }

      switch (names.length) {
        case 0:
          return resolve(CHANNEL_NAME_ROOT);

        case 1:
          return resolve(names[0]);

        default:
          return new ExtendedSection(bus, names.map(function (name) {
            return resolve(name);
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
      sealed = false;
      return bus;
    }

    function getChannels() {
      return Array.from(channels.values());
    }

    function getDelimiter() {
      return delimiter;
    }

    function setDelimiter(value) {
      if (sealed) throwError(ERROR_FORBIDDEN);
      if (!isString(value) || value.length === 0) throwError(ERROR_DELIMITER);
      delimiter = value;
    }

    function getError() {
      return resolve(CHANNEL_NAME_ERROR);
    }

    function getRoot() {
      return resolve(CHANNEL_NAME_ROOT);
    }

    function getTrace() {
      return trace;
    }

    function setTrace(value) {
      if (sealed) throwError(ERROR_FORBIDDEN);
      if (!isFunction(value)) throwError(ERROR_TRACE);
      trace = value;
    }

    function message() {
      for (var _len9 = arguments.length, components = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        components[_key9] = arguments[_key9];
      }

      return new (Function.prototype.bind.apply(ExtendedMessage, [null].concat(components)))();
    }

    function resolve(name) {
      var channel = channels.get(name);

      if (!channel) {
        var parent = undefined;

        if (name !== CHANNEL_NAME_ROOT && name !== CHANNEL_NAME_ERROR) {
          if (!isString(name)) throwError(ERROR_NAME);
          var index = name.indexOf(delimiter);
          parent = resolve(-1 === index ? CHANNEL_NAME_ROOT : name.substr(0, index));
        }

        channel = new ExtendedChannel(bus, name, parent);
        sealed = true;
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