/*
  todo:
     - message forwarding
     - serialized publications
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

  var CHANNEL_HIERARCHY_DELIMITER = '.',
      CHANNEL_NAME_ERROR = 'error',
      CHANNEL_NAME_ROOT = '',
      AEROBUS = 'Aerobus',
      CLASS_AEROBUS_CHANNEL = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Channel',
      CLASS_AEROBUS_ITERATOR = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Iterator',
      CLASS_AEROBUS_MESSAGE = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Message',
      CLASS_AEROBUS_SECTION = AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Section',
      CLASS_FUNCTION = 'Function',
      CLASS_NUMBER = 'Number',
      CLASS_OBJECT = 'Object',
      CLASS_STRING = 'String',
      $CLASS = Symbol.toStringTag,
      $ITERATOR = Symbol.iterator,
      $PROTOTYPE = 'prototype',
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
      throwArgumentNotValid = function throwArgumentNotValid(value) {
    throw new TypeError('Unexpected argument type ' + classof(value) + '.');
  },
      throwContextNotFound = function throwContextNotFound(value) {
    throw new Error('Context for object of type ' + classof(value) + ' was not found. The object might be disposed.');
  },
      throwCallbackNotValid = function throwCallbackNotValid(value) {
    throw new TypeError('Callback expected to be a function but ' + classof(value) + ' was provided.');
  },
      throwDelimiterNotValid = function throwDelimiterNotValid(value) {
    throw new TypeError('Delimiter expected to be not empty string but "' + value + '" was provided.');
  },
      throwForbiden = function throwForbiden() {
    throw new Error('This operation is forbidden for existing context.');
  },
      throwNameNotValid = function throwNameNotValid(value) {
    throw new TypeError('Name expected to be a string but ' + classof(value) + ' was provided.');
  },
      throwTraceNotValid = function throwTraceNotValid(value) {
    throw new TypeError('Trace expected to be a function but ' + classof(value) + ' was provided.');
  },
      gears = new WeakMap(),
      getGear = function getGear(key) {
    var gear = gears.get(key);
    if (isNothing(gear)) throwContextNotFound(key);
    return gear;
  },
      setGear = function setGear(key, gear) {
    isSomething(gear) ? gears.set(key, gear) : gears.delete(key, gear);
  };

  var BusGear = (function () {
    function BusGear(classes, delimiter, trace) {
      _classCallCheck(this, BusGear);

      this.channels = new Map();
      this.classes = classes;
      this.delimiter = delimiter;
      this.sealed = false;
      this.trace = trace;
    }

    _createClass(BusGear, [{
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
      key: 'get',
      value: function get(name) {
        var channels = this.channels,
            channel = channels.get(name);
        if (channel) return channel;
        var Channel = this.classes.Channel;

        if (name === CHANNEL_NAME_ROOT || name === CHANNEL_NAME_ERROR) {
          channel = new Channel(this, name);
          channels.set(name, channel);
        } else {
          if (!isString(name)) throwNameNotValid(name);
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
      key: 'resolve',
      value: function resolve(names) {
        var _this = this;

        switch (names.length) {
          case 0:
            return this.get(CHANNEL_NAME_ROOT);

          case 1:
            return this.get(names[0]);

          default:
            var Section = this.classes.Section;
            return new Section(names.map(function (name) {
              return _this.get(name);
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
            getGear(channel).unsubscribe(subscriptions);
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

    return BusGear;
  })();

  var IteratorGear = (function () {
    function IteratorGear(init) {
      var _this2 = this;

      _classCallCheck(this, IteratorGear);

      this.disposed = false;
      this.messages = [];
      this.rejects = [];
      this.resolves = [];
      this.disposer = init(function (message) {
        if (_this2.resolves.length) _this2.resolves.shift()(message);else _this2.messages.push(message);
      });
    }

    _createClass(IteratorGear, [{
      key: 'done',
      value: function done() {
        if (this.disposed) return;
        this.disposed = true;
        this.rejects.forEach(function (reject) {
          return reject();
        });
        this.disposer();
      }
    }, {
      key: 'next',
      value: function next() {
        var _this3 = this;

        if (this.disposed) return {
          done: true
        };
        if (this.messages.length) return {
          value: Promise.resolve(this.messages.shift())
        };
        return {
          value: new Promise(function (resolve, reject) {
            _this3.rejects.push(reject);

            _this3.resolves.push(resolve);
          })
        };
      }
    }]);

    return IteratorGear;
  })();

  var Iterator = (function () {
    function Iterator(init) {
      _classCallCheck(this, Iterator);

      setGear(this, new IteratorGear(init));
    }

    _createClass(Iterator, [{
      key: 'done',
      value: function done() {
        getGear(this).done();
      }
    }, {
      key: 'next',
      value: function next() {
        return getGear(this).next();
      }
    }]);

    return Iterator;
  })();

  defineProperty(Iterator[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_ITERATOR
  });

  var ChannelGear = (function () {
    function ChannelGear(bus, name, parent, trace) {
      _classCallCheck(this, ChannelGear);

      this.bus = bus;
      this.enabled = true;
      this.name = name;
      if (parent) this.parent = getGear(parent);
      this.subscriptions = [];
      this.trace = trace;
      trace('create');
    }

    _createClass(ChannelGear, [{
      key: 'clear',
      value: function clear() {
        this.trace('clear');
        this.subscriptions.length = 0;
        if (this.retentions) this.retentions.length = 0;
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.trace('disable');
        this.enabled = false;
      }
    }, {
      key: 'enable',
      value: function enable(value) {
        value = !!value;
        this.trace('enable', value);
        this.enabled = value;
      }
    }, {
      key: 'envelop',
      value: function envelop(message) {
        if (classof(message) === CLASS_AEROBUS_MESSAGE) return message.pass(this.name);
        var Message = this.bus.classes.Message;
        return new Message(message, [this.name]);
      }
    }, {
      key: 'propagate',
      value: function propagate(message) {
        var retentions = this.retentions;

        if (retentions) {
          retentions.push(message);
          if (retentions.length > retentions.limit) retentions.shift();
        }

        var parent = this.parent;
        if (parent) parent.publish(message);
        if (this.observers) this.observers.forEach(function (observer) {
          return observer(message);
        });
      }
    }, {
      key: 'observe',
      value: function observe(observer) {
        var _this4 = this;

        if (this.observers) this.observers.push(observer);else this.observers = [observer];
        return function () {
          var observers = _this4.observers,
              index = observers.indexOf(observer);
          if (~index) observers.splice(index, 1);
        };
      }
    }, {
      key: 'publish',
      value: function publish(message) {
        var _this5 = this;

        if (!this.isEnabled) return;
        message = this.envelop(message);
        this.trace('publish', message);
        this.propagate(message);
        this.subscriptions.forEach(this.name === CHANNEL_NAME_ERROR ? function (subscription) {
          return subscription.subscriber(message.error, message);
        } : function (subscription) {
          try {
            subscription.subscriber(message.data, message);
          } catch (error) {
            _this5.bus.get(CHANNEL_NAME_ERROR).publish(message.fail(error));
          }
        });
      }
    }, {
      key: 'request',
      value: function request(message, results) {
        var _this6 = this;

        if (!this.isEnabled) return;
        message = this.envelop(message);
        this.trace('request', message);
        this.propagate(message);
        this.subscriptions.forEach(this.name === CHANNEL_NAME_ERROR ? function (subscription) {
          return subscription.subscriber(message.error, message);
        } : function (subscription) {
          try {
            results.push(subscription.subscriber(message.data, message));
          } catch (error) {
            results.push(error);

            _this6.bus.get(CHANNEL_NAME_ERROR).publish(message.fail(error));
          }
        });
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.trace('reset');
        this.enabled = true;
        this.subscriptions.length = 0;
        this.retentions = undefined;
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        limit = isNumber(limit) ? Math.max(limit, 0) : limit ? maxSafeInteger : 0;
        this.trace('retain', limit);
        var retentions = this.retentions;

        if (retentions) {
          retentions.limit = limit;
          if (retentions.length > retentions.limit) retentions.splice(0, retentions.length - retentions.limit);
        } else {
          this.retentions = [];
          this.retentions.limit = limit;
        }
      }
    }, {
      key: 'subscribe',
      value: function subscribe(parameters) {
        var _this7 = this;

        this.trace('subscribe', parameters);
        var name = undefined,
            order = 0,
            subscriptions = [];
        parameters.forEach(function (parameter) {
          switch (classof(parameter)) {
            case CLASS_FUNCTION:
              subscriptions.push({
                subscriber: parameter
              });
              break;

            case CLASS_NUMBER:
              order = parameter;
              break;

            case CLASS_STRING:
              name = parameter;
              break;

            default:
              throwArgumentNotValid(parameter);
          }
        });
        subscriptions.forEach(function (subscription) {
          subscription.name = name;
          subscription.order = order;
        });
        var existing = this.subscriptions,
            index = existing.findIndex(function (subscription) {
          return subscription.order > order;
        }),
            retentions = this.retentions;
        -1 === index ? existing.push.apply(existing, subscriptions) : existing.splice.apply(existing, [index, 0].concat(subscriptions));
        if (retentions) retentions.forEach(function (message) {
          return subscriptions.forEach(function (subscription) {
            try {
              subscription.subscriber(message.data, message);
            } catch (error) {
              _this7.bus.get(CHANNEL_NAME_ERROR).publish(message.fail(error));
            }
          });
        });
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.trace('toggle');
        this.enabled = !this.enabled;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(parameters) {
        this.trace('unsubscribe', parameters);
        var i = undefined,
            subscriptions = this.subscriptions;
        if (parameters.length) parameters.forEach(function (parameter) {
          switch (classof(parameter)) {
            case CLASS_FUNCTION:
              i = subscriptions.length;

              while (--i >= 0) {
                if (subscriptions[i].subscriber === parameter) subscriptions.splice(i, 1);
              }

              break;

            case CLASS_STRING:
              i = subscriptions.length;

              while (--i >= 0) {
                if (subscriptions[i].name === parameter) subscriptions.splice(i, 1);
              }

              break;

            default:
              throwArgumentNotValid(parameter);
          }
        });else subscriptions.length = 0;
      }
    }, {
      key: 'isEnabled',
      get: function get() {
        var parent = this.parent;
        return this.enabled && (!parent || parent.isEnabled);
      }
    }]);

    return ChannelGear;
  })();

  var ChannelApi = (function () {
    function ChannelApi(bus, name, parent) {
      var _this8 = this;

      _classCallCheck(this, ChannelApi);

      setGear(this, new ChannelGear(bus, name, parent, function (event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return bus.trace.apply(bus, [event, _this8].concat(args));
      }));
      defineProperty(this, 'name', {
        value: name,
        enumerable: true
      });
      if (isSomething(parent)) defineProperty(this, 'parent', {
        value: parent,
        enumerable: true
      });
    }

    _createClass(ChannelApi, [{
      key: 'clear',
      value: function clear() {
        getGear(this).clear();
        return this;
      }
    }, {
      key: 'disable',
      value: function disable() {
        getGear(this).disable();
        return this;
      }
    }, {
      key: 'enable',
      value: function enable() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        getGear(this).enable(value);
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        if (isSomething(callback)) {
          if (!isFunction(callback)) throwCallbackNotValid(callback);
          var results = [];
          getGear(this).request(data, results);
          callback(results);
        } else getGear(this).publish(data);

        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        getGear(this).reset();
        return this;
      }
    }, {
      key: 'retain',
      value: function retain() {
        var limit = arguments.length <= 0 || arguments[0] === undefined ? maxSafeInteger : arguments[0];
        getGear(this).retain(limit);
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        for (var _len2 = arguments.length, parameters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          parameters[_key2] = arguments[_key2];
        }

        getGear(this).subscribe(parameters);
        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        getGear(this).toggle();
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        for (var _len3 = arguments.length, parameters = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          parameters[_key3] = arguments[_key3];
        }

        getGear(this).unsubscribe(parameters);
        return this;
      }
    }, {
      key: $ITERATOR,
      value: function value() {
        var _this9 = this;

        return new Iterator(function (observer) {
          return getGear(_this9).observe(observer);
        });
      }
    }, {
      key: 'isEnabled',
      get: function get() {
        return getGear(this).isEnabled;
      }
    }, {
      key: 'retentions',
      get: function get() {
        var retentions = getGear(this).retentions,
            result = [];

        if (retentions) {
          result.push.apply(result, _toConsumableArray(retentions));
          result.limit = retentions.limit;
        } else result.limit = 0;

        return result;
      }
    }, {
      key: 'subscribers',
      get: function get() {
        return getGear(this).subscriptions.map(function (subscription) {
          return subscription.subscriber;
        });
      }
    }]);

    return ChannelApi;
  })();

  defineProperty(ChannelApi[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_CHANNEL
  });

  function subclassChannel() {
    return (function (_ChannelApi) {
      _inherits(Channel, _ChannelApi);

      function Channel(classes, name, parent) {
        _classCallCheck(this, Channel);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this, classes, name, parent));
      }

      return Channel;
    })(ChannelApi);
  }

  var MessageBase = (function () {
    function MessageBase(data, route) {
      _classCallCheck(this, MessageBase);

      defineProperties(this, {
        data: {
          value: data,
          enumerable: true
        },
        destination: {
          value: route[route.length - 1],
          enumerable: true
        },
        route: {
          value: route,
          enumerable: true
        }
      });
    }

    _createClass(MessageBase, [{
      key: 'fail',
      value: function fail(error) {
        var Message = this.constructor,
            message = new Message(this.channel, this.route);
        defineProperty(message, 'error', {
          value: error
        });
        return message;
      }
    }, {
      key: 'pass',
      value: function pass(destination) {
        var Message = this.constructor,
            message = new Message(this.data, this.route.concat(destination));
        if (isSomething(this.error)) defineProperty(message, 'error', {
          value: this.error
        });
        return message;
      }
    }]);

    return MessageBase;
  })();

  defineProperty(MessageBase[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_MESSAGE
  });

  function subclassMessage() {
    return (function (_MessageBase) {
      _inherits(Message, _MessageBase);

      function Message(data, route) {
        _classCallCheck(this, Message);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this, data, route));
      }

      return Message;
    })(MessageBase);
  }

  var SectionGear = (function () {
    function SectionGear(channels) {
      _classCallCheck(this, SectionGear);

      this.channels = channels;
    }

    _createClass(SectionGear, [{
      key: 'apply',
      value: function apply(method) {
        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        this.channels.forEach(function (channel) {
          var _getGear;

          (_getGear = getGear(channel))[method].apply(_getGear, args);
        });
      }
    }, {
      key: 'call',
      value: function call(method) {
        this.channels.forEach(function (channel) {
          getGear(channel)[method]();
        });
      }
    }]);

    return SectionGear;
  })();

  var SectionApi = (function () {
    function SectionApi(channels) {
      _classCallCheck(this, SectionApi);

      setGear(this, new SectionGear(channels));
    }

    _createClass(SectionApi, [{
      key: 'clear',
      value: function clear() {
        getGear(this).call('clear');
        return this;
      }
    }, {
      key: 'disable',
      value: function disable() {
        getGear(this).call('disable');
        return this;
      }
    }, {
      key: 'enable',
      value: function enable() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        getGear(this).apply('enable', value);
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        getGear(this).apply('publish', data, callback);
        return this;
      }
    }, {
      key: 'reset',
      value: function reset() {
        getGear(this).call('reset');
        return this;
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        getGear(this).apply('retain', limit);
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        for (var _len5 = arguments.length, parameters = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          parameters[_key5] = arguments[_key5];
        }

        getGear(this).apply('subscribe', parameters);
        return this;
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        getGear(this).call('toggle');
        return this;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        for (var _len6 = arguments.length, parameters = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          parameters[_key6] = arguments[_key6];
        }

        getGear(this).apply('unsubscribe', parameters);
        return this;
      }
    }, {
      key: $ITERATOR,
      value: function value() {
        var _this12 = this;

        return new Iterator(function (observer) {
          var disposers = getGear(_this12).channels.map(function (channel) {
            return getGear(channel).observe(observer);
          });
          return function () {
            return disposers.forEach(function (disposer) {
              return disposer();
            });
          };
        });
      }
    }, {
      key: 'channels',
      get: function get() {
        return [].concat(_toConsumableArray(getGear(this).channels));
      }
    }]);

    return SectionApi;
  })();

  defineProperty(SectionApi[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_SECTION
  });

  function subclassSection() {
    return (function (_SectionApi) {
      _inherits(Section, _SectionApi);

      function Section(bus, binder) {
        _classCallCheck(this, Section);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this, bus, binder));
      }

      return Section;
    })(SectionApi);
  }

  function aerobus() {
    var delimiter = CHANNEL_HIERARCHY_DELIMITER,
        trace = noop,
        Channel = subclassChannel(),
        Message = subclassMessage(),
        Section = subclassSection();

    for (var _len7 = arguments.length, parameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      parameters[_key7] = arguments[_key7];
    }

    for (var i = 0, l = parameters.length; i < l; i++) {
      var parameter = parameters[i];

      switch (classof(parameter)) {
        case CLASS_FUNCTION:
          trace = parameter;
          break;

        case CLASS_OBJECT:
          extend(Channel.prototype, parameter.channel);
          extend(Message.prototype, parameter.message);
          extend(Section.prototype, parameter.section);
          break;

        case CLASS_STRING:
          if (parameter.length === 0) throwDelimiterNotValid(parameter);
          delimiter = parameter;
          break;

        default:
          throwArgumentNotValid(parameter);
      }
    }

    setGear(bus, new BusGear({
      Channel: Channel,
      Message: Message,
      Section: Section
    }, delimiter, trace));
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
      for (var _len8 = arguments.length, names = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        names[_key8] = arguments[_key8];
      }

      return getGear(bus).resolve(names);
    }

    function clear() {
      getGear(bus).clear();
      return bus;
    }

    function getChannels() {
      return Array.from(getGear(bus).channels.values());
    }

    function getDelimiter() {
      return getGear(bus).delimiter;
    }

    function setDelimiter(value) {
      var gear = getGear(bus);
      if (gear.sealed) throwForbiden();
      if (!isString(value) || value.length === 0) throwDelimiterNotValid(value);
      gear.delimiter = value;
    }

    function getError() {
      return getGear(bus).get(CHANNEL_NAME_ERROR);
    }

    function getRoot() {
      return getGear(bus).get(CHANNEL_NAME_ROOT);
    }

    function getTrace() {
      return getGear(bus).trace;
    }

    function setTrace(value) {
      var gear = getGear(bus);
      if (gear.sealed) throwForbiden();
      if (!isFunction(value)) throwTraceNotValid(value);
      gear.trace = value;
    }

    function unsubscribe() {
      for (var _len9 = arguments.length, subscribers = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        subscribers[_key9] = arguments[_key9];
      }

      getGear(bus).unsubscribe(subscribers);
      return bus;
    }
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});