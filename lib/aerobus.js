// todo: disable removed channels

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

  var CHANNEL_HIERARCHY_DELIMITER = '.',
      CHANNEL_NAME_ERROR = 'error',
      CHANNEL_NAME_ROOT = '',
      ERROR_CALLBACK = 'Callback expected to be a function.',
      ERROR_DELIMITER = 'Delimiter expected to be not empty string.',
      ERROR_DISPOSED = 'This object has been disposed.',
      ERROR_FORBIDDEN = 'This operation is forbidden for not empty bus instance.',
      ERROR_NAME = 'Name expected to be string.',
      ERROR_TRACE = 'Trace expected to be a function.',
      ERROR_UNEXPECTED = 'Unexpected argument type.',
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
    return isNothing(source) ? target : Object.getOwnPropertyNames(source).reduce(function (result, key) {
      return key in result ? result : defineProperty(result, key, Object.getOwnPropertyDescriptor(source, key));
    }, target);
  },
      throwError = function throwError(error) {
    throw new Error(error);
  },
      internals = new WeakMap(),
      getInternal = function getInternal(object) {
    var internal = internals.get(object);
    if (isNothing(internal)) throwError(ERROR_DISPOSED);
    return internal;
  },
      setInternal = function setInternal(object, internal) {
    internals.set(object, internal);
  };

  var BusInternal = (function () {
    function BusInternal(api, parameters) {
      _classCallCheck(this, BusInternal);

      this.Channel = extendChannel();
      this.Message = extendMessage();
      this.Section = extendSection();
      this.api = api;
      this.channels = new Map();
      this.delimiter = CHANNEL_HIERARCHY_DELIMITER;
      this.sealed = false;
      this.trace = noop;

      for (var i = 0, l = parameters.length; i < l; i++) {
        var parameter = parameters[i];

        switch (classof(parameter)) {
          case CLASS_FUNCTION:
            this.trace = parameter;
            break;

          case CLASS_OBJECT:
            extend(this.Channel.prototype, parameter.channel);
            extend(this.Message.prototype, parameter.message);
            extend(this.Section.prototype, parameter.section);
            break;

          case CLASS_STRING:
            if (parameter.length === 0) throwError(ERROR_DELIMITER);
            this.delimiter = parameter;
            break;

          default:
            throwError(ERROR_UNEXPECTED);
        }
      }
    }

    _createClass(BusInternal, [{
      key: 'clear',
      value: function clear() {
        var channels = this.channels;
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
        this.sealed = false;
      }
    }, {
      key: 'resolveOne',
      value: function resolveOne(name) {
        var channels = this.channels;
        var channel = channels.get(name);
        if (channel) return channel;
        var Channel = this.Channel;

        if (name === CHANNEL_NAME_ROOT || name === CHANNEL_NAME_ERROR) {
          channel = new Channel(this, name);
          channels.set(name, channel);
          return channel;
        } else if (!isString(name)) throwError(ERROR_NAME);else {
          var parent = channels.get(CHANNEL_NAME_ROOT);

          if (!parent) {
            parent = new Channel(this, CHANNEL_NAME_ROOT);
            channels.set(CHANNEL_NAME_ROOT, parent);
          }

          var delimiter = this.delimiter,
              parts = name.split(this.delimiter);
          name = '';

          for (var i = 0, l = parts.length; i < l; i++) {
            name = name ? name + delimiter + parts[i] : parts[i];
            channel = channels.get(name);

            if (!channel) {
              channel = new Channel(this, name, parent);
              channels.set(name, channel);
            }

            parent = channel;
          }
        }

        this.sealed = true;
        return channel;
      }
    }, {
      key: 'resolveMany',
      value: function resolveMany(names) {
        var _this = this;

        switch (names.length) {
          case 0:
            return this.resolveOne(CHANNEL_NAME_ROOT);

          case 1:
            return this.resolveOne(names[0]);

          default:
            var Section = this.Section;
            return new Section(this, names.map(function (name) {
              return _this.resolveOne(name);
            }));
        }
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(subscriptions) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.channels.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var channel = _step2.value;
            channel.unsubscribe.apply(channel, _toConsumableArray(subscriptions));
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
    }]);

    return BusInternal;
  })();

  var IteratorInternal = function IteratorInternal(parent, subscription) {
    _classCallCheck(this, IteratorInternal);

    this.done = false;
    this.messages = [];
    this.parent = parent;
    this.rejectors = [];
    this.resolvers = [];
    this.subscription = subscription;
  };

  var Iterator = (function () {
    function Iterator(parent) {
      var _this2 = this;

      _classCallCheck(this, Iterator);

      var subscription = function subscription(data, message) {
        var internal = getInternal(_this2),
            resolvers = internal.resolvers;
        if (resolvers.length) resolvers.shift()(message);else internal.messages.push(message);
      };

      parent.subscribe(subscription);
      setInternal(this, new IteratorInternal(parent, subscription));
      defineProperty(this, $CLASS, {
        value: CLASS_AEROBUS_ITERATOR
      });
    }

    _createClass(Iterator, [{
      key: 'done',
      value: function done() {
        var internal = getInternal(this);
        if (internal.done) return;
        internal.done = true;
        internal.parent.unsubscribe(internal.subscription);
        internal.rejectors.forEach(function (reject) {
          return reject();
        });
      }
    }, {
      key: 'next',
      value: function next() {
        var internal = getInternal(this);
        if (internal.done) return {
          done: true
        };
        var messages = internal.messages,
            value = messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
          internal.rejectors.push(reject);
          internal.resolvers.push(resolve);
        });
        return {
          value: value
        };
      }
    }]);

    return Iterator;
  })();

  var ChannelInternal = function ChannelInternal(bus, parent) {
    _classCallCheck(this, ChannelInternal);

    var retentions = [];
    retentions.limit = 0;
    this.bus = bus;
    this.enabled = true;
    this.parent = parent;
    this.retentions = retentions;
    this.subscriptions = [];
  };

  var ChannelBase = (function () {
    function ChannelBase(bus, name, parent) {
      var _defineProperties;

      _classCallCheck(this, ChannelBase);

      setInternal(this, new ChannelInternal(bus, parent));
      defineProperties(this, (_defineProperties = {}, _defineProperty(_defineProperties, $CLASS, {
        value: CLASS_AEROBUS_CHANNEL
      }), _defineProperty(_defineProperties, 'bus', {
        value: bus.api,
        enumerable: true
      }), _defineProperty(_defineProperties, 'name', {
        value: name,
        enumerable: true
      }), _defineProperties));
      if (isSomething(parent)) defineProperty(this, 'parent', {
        value: parent,
        enumerable: true
      });
      bus.trace('create', this);
    }

    _createClass(ChannelBase, [{
      key: 'clear',
      value: function clear() {
        var internal = getInternal(this);
        internal.bus.trace('clear', this);
        internal.retentions.length = internal.subscriptions.length = 0;
        return this;
      }
    }, {
      key: 'disable',
      value: function disable() {
        var internal = getInternal(this);
        internal.bus.trace('disable', this);
        internal.enabled = false;
        return this;
      }
    }, {
      key: 'enable',
      value: function enable() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        value = !!value;
        var internal = getInternal(this);
        internal.bus.trace('enable', this, value);
        internal.enabled = value;
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        if (isSomething(callback) && !isFunction(callback)) throwError(ERROR_CALLBACK);
        if (!this.isEnabled) return;
        var internal = getInternal(this),
            bus = internal.bus,
            Message = bus.Message,
            message = new Message(this, data),
            retentions = internal.retentions,
            subscriptions = internal.subscriptions;
        internal.bus.trace('publish', this, message);

        if (retentions.limit > 0) {
          retentions.push(message);
          if (retentions.length > retentions.limit) retentions.shift();
        }

        if (this.name === CHANNEL_NAME_ERROR) {
          if (callback) {
            (function () {
              var results = [];
              subscriptions.forEach(function (subscription) {
                return results.push(subscription.subscriber(message.error, message));
              });
              callback(results);
            })();
          } else subscriptions.forEach(function (subscription) {
            return subscription.subscriber(message.error, message);
          });

          return this;
        }

        var parent = internal.parent;

        if (callback) {
          (function () {
            var results = [];
            if (parent) parent.publish(message, function (parentResults) {
              return results.push.apply(results, _toConsumableArray(parentResults));
            });
            subscriptions.forEach(function (subscription) {
              try {
                results.push(subscription.subscriber(message.data, message));
              } catch (error) {
                results.push(error);
                bus.resolveOne(CHANNEL_NAME_ERROR).publish(new Message(message, error), function (errorResults) {
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
              subscription.subscriber(message.data, message);
            } catch (error) {
              bus.resolveOne(CHANNEL_NAME_ERROR).publish(new Message(message, error));
            }
          });
        }

        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        var internal = getInternal(this);
        internal.bus.trace('reset', this);
        internal.enabled = true;
        internal.retentions.limit = 0;
        internal.retentions.length = internal.subscriptions.length = 0;
        return this;
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        var internal = getInternal(this),
            retentions = internal.retentions;
        limit = arguments.length ? isNumber(limit) ? Math.max(limit, 0) : limit ? maxSafeInteger : 0 : maxSafeInteger;
        internal.bus.trace('retain', this, limit);
        retentions.limit = limit;
        if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        var internal = getInternal(this),
            bus = internal.bus,
            Message = bus.Message,
            order = 0,
            retentions = internal.retentions,
            subscribers = [],
            subscriptions = internal.subscriptions;

        for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
          parameters[_key] = arguments[_key];
        }

        internal.bus.trace('subscribe', this, parameters);
        parameters.forEach(function (parameter) {
          switch (classof(parameter)) {
            case CLASS_FUNCTION:
              subscribers.push(parameter);
              break;

            case CLASS_NUMBER:
              order = parameter;
              break;

            default:
              throwError(ERROR_UNEXPECTED);
          }
        });
        var index = subscriptions.findIndex(function (subscription) {
          return subscription.order > order;
        });
        -1 === index ? subscriptions.push.apply(subscriptions, _toConsumableArray(subscribers.map(function (subscriber) {
          return {
            order: order,
            subscriber: subscriber
          };
        }))) : subscriptions.splice.apply(subscriptions, [index, 0].concat(_toConsumableArray(subscribers.map(function (subscriber) {
          return {
            order: order,
            subscriber: subscriber
          };
        }))));
        retentions.forEach(function (message) {
          return subscribers.forEach(function (subscriber) {
            try {
              subscriber(message.data, message);
            } catch (error) {
              bus.resolveOne(CHANNEL_NAME_ERROR).publish(new Message(message, error));
            }
          });
        });
        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        var internal = getInternal(this);
        internal.bus.trace('toggle', this);
        internal.enabled = !internal.enabled;
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        var internal = getInternal(this),
            subscriptions = internal.subscriptions;

        for (var _len2 = arguments.length, subscribers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          subscribers[_key2] = arguments[_key2];
        }

        internal.bus.trace('unsubscribe', this, subscribers);
        if (!subscribers.length) subscriptions.length = 0;else {
          var i = subscribers.length;

          while (--i >= 0 && subscriptions.length) {
            var subscriber = subscribers[i],
                j = 0;

            while (j < subscriptions.length) {
              if (subscriptions[j].subscriber === subscriber) subscriptions.splice(j, 1);else j++;
            }
          }
        }
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
        return getInternal(this).enabled && (!this.parent || this.parent.isEnabled);
      }
    }, {
      key: 'retentions',
      get: function get() {
        var retentions = getInternal(this).retentions,
            clone = [].concat(_toConsumableArray(retentions));
        clone.limit = retentions.limit;
        return clone;
      }
    }, {
      key: 'subscribers',
      get: function get() {
        return getInternal(this).subscriptions.map(function (subscription) {
          return subscription.subscriber;
        });
      }
    }]);

    return ChannelBase;
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

  var MessageBase = (function () {
    function MessageBase() {
      var _defineProperties2;

      _classCallCheck(this, MessageBase);

      var channel = undefined,
          data = undefined,
          error = undefined,
          prior = undefined;

      for (var _len3 = arguments.length, components = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        components[_key3] = arguments[_key3];
      }

      components.forEach(function (component) {
        switch (classof(component)) {
          case CLASS_AEROBUS_CHANNEL:
            channel = component;
            break;

          case CLASS_AEROBUS_MESSAGE:
            prior = component;
            if (isNothing(data)) data = component.data;
            if (isNothing(error)) error = component.error;
            break;

          case CLASS_ERROR:
            error = component;
            break;

          default:
            data = component;
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
      if (isSomething(prior)) defineProperty(this, 'prior', {
        value: prior,
        enumerable: true
      });
    }

    _createClass(MessageBase, [{
      key: 'channels',
      get: function get() {
        var channels = [this.channel],
            prior = this.prior;

        while (prior) {
          channels.push(prior.channel);
          prior = prior.prior;
        }

        return channels;
      }
    }]);

    return MessageBase;
  })();

  function extendMessage() {
    return (function (_MessageBase) {
      _inherits(Message, _MessageBase);

      function Message() {
        var _Object$getPrototypeO;

        _classCallCheck(this, Message);

        for (var _len4 = arguments.length, components = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          components[_key4] = arguments[_key4];
        }

        return _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Message)).call.apply(_Object$getPrototypeO, [this].concat(components)));
      }

      return Message;
    })(MessageBase);
  }

  var SectionIternal = function SectionIternal(bus, channels) {
    _classCallCheck(this, SectionIternal);

    this.bus = bus;
    this.channels = channels;
  };

  var SectionBase = (function () {
    function SectionBase(bus, channels) {
      _classCallCheck(this, SectionBase);

      setInternal(this, new SectionIternal(bus, channels));
      defineProperties(this, _defineProperty({
        bus: {
          value: bus.api
        }
      }, $CLASS, {
        value: CLASS_AEROBUS_SECTION
      }));
    }

    _createClass(SectionBase, [{
      key: 'clear',
      value: function clear() {
        getInternal(this).channels.forEach(function (channel) {
          return channel.clear();
        });
        return this;
      }
    }, {
      key: 'disable',
      value: function disable() {
        getInternal(this).channels.forEach(function (channel) {
          return channel.disable();
        });
        return this;
      }
    }, {
      key: 'enable',
      value: function enable(value) {
        getInternal(this).channels.forEach(function (channel) {
          return channel.enable(value);
        });
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        getInternal(this).channels.forEach(function (channel) {
          return channel.publish(data, callback);
        });
        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        getInternal(this).channels.forEach(function (channel) {
          return channel.reset();
        });
        return this;
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        getInternal(this).channels.forEach(function (channel) {
          return channel.retain(limit);
        });
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        for (var _len5 = arguments.length, parameters = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          parameters[_key5] = arguments[_key5];
        }

        getInternal(this).channels.forEach(function (channel) {
          return channel.subscribe.apply(channel, parameters);
        });
        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        getInternal(this).channels.forEach(function (channel) {
          return channel.toggle();
        });
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        for (var _len6 = arguments.length, subscribers = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          subscribers[_key6] = arguments[_key6];
        }

        getInternal(this).channels.forEach(function (channel) {
          return channel.unsubscribe.apply(channel, subscribers);
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
        return [].concat(_toConsumableArray(getInternal(this).channels));
      }
    }]);

    return SectionBase;
  })();

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
    var internal = undefined;

    function bus() {
      for (var _len8 = arguments.length, names = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        names[_key8] = arguments[_key8];
      }

      return internal.resolveMany(names);
    }

    function clear() {
      internal.clear();
      return bus;
    }

    function getChannels() {
      return Array.from(internal.channels.values());
    }

    function getDelimiter() {
      return internal.delimiter;
    }

    function setDelimiter(value) {
      if (internal.sealed) throwError(ERROR_FORBIDDEN);
      if (!isString(value) || value.length === 0) throwError(ERROR_DELIMITER);
      internal.delimiter = value;
    }

    function getError() {
      return internal.resolveOne(CHANNEL_NAME_ERROR);
    }

    function getRoot() {
      return internal.resolveOne(CHANNEL_NAME_ROOT);
    }

    function getTrace() {
      return internal.trace;
    }

    function setTrace(value) {
      if (internal.sealed) throwError(ERROR_FORBIDDEN);
      if (!isFunction(value)) throwError(ERROR_TRACE);
      internal.trace = value;
    }

    function unsubscribe() {
      for (var _len9 = arguments.length, subscribers = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        subscribers[_key9] = arguments[_key9];
      }

      internal.unsubscribe(subscribers);
      return bus;
    }

    for (var _len7 = arguments.length, parameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      parameters[_key7] = arguments[_key7];
    }

    internal = new BusInternal(bus, parameters);
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
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});