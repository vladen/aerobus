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
      CLASS_AEROBUS = 'Aerobus',
      CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Channel',
      CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Iterator',
      CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Message',
      CLASS_AEROBUS_SECTION = CLASS_AEROBUS + CHANNEL_HIERARCHY_DELIMITER + 'Section',
      CLASS_BOOLEAN = 'Boolean',
      CLASS_FUNCTION = 'Function',
      CLASS_NUMBER = 'Number',
      CLASS_OBJECT = 'Object',
      CLASS_STRING = 'String',
      $CLASS = Symbol.toStringTag,
      $ITERATOR = Symbol.iterator,
      $PROTOTYPE = 'prototype',
      maxSafeInteger = Number.MAX_SAFE_INTEGER,
      assign = Object.assign,
      classof = function classof(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  },
      defineProperties = Object.defineProperties,
      defineProperty = Object.defineProperty,
      floor = Math.floor,
      max = Math.max,
      min = Math.min,
      random = Math.random,
      identity = function identity(value) {
    return value;
  },
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
      throwGearNotFound = function throwGearNotFound(value) {
    throw new Error('This instance of ' + classof(value) + ' object has been deleted.');
  },
      throwCallbackNotValid = function throwCallbackNotValid(value) {
    throw new TypeError('Callback expected to be a function, not ' + classof(value) + '.');
  },
      throwDelimiterNotValid = function throwDelimiterNotValid(value) {
    throw new TypeError('Delimiter expected to be not empty string, not "' + value + '".');
  },
      throwForbiden = function throwForbiden() {
    throw new Error('This operation is forbidden for existing context.');
  },
      throwNameNotValid = function throwNameNotValid(value) {
    throw new TypeError('Name expected to be a string, not ' + classof(value) + '.');
  },
      throwTraceNotValid = function throwTraceNotValid(value) {
    throw new TypeError('Trace expected to be a function, not ' + classof(value) + '.');
  },
      gears = new WeakMap(),
      getGear = function getGear(key) {
    var gear = gears.get(key);
    if (isNothing(gear)) throwGearNotFound(key);
    return gear;
  },
      setGear = function setGear(key, gear) {
    isSomething(gear) ? gears.set(key, gear) : gears.delete(key, gear);
  };

  var BusGear = (function () {
    function BusGear(config) {
      _classCallCheck(this, BusGear);

      this.Channel = subclassChannel();
      extend(this.Channel[$PROTOTYPE], config.channel);
      this.Message = subclassMessage();
      extend(this.Message[$PROTOTYPE], config.message);
      this.Section = subclassSection();
      extend(this.Section[$PROTOTYPE], config.section);
      this.bubbles = config.bubbles;
      this.channels = new Map();
      this.delimiter = config.delimiter;
      this.id = 0;
      this.sealed = false;
      this.trace = config.trace;
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
            setGear(channel.clear(), null);
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
        var Channel = this.Channel;

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
            var Section = this.Section;
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
    function IteratorGear(attach) {
      var _this2 = this;

      _classCallCheck(this, IteratorGear);

      this.disposed = false;
      this.messages = [];
      this.rejects = [];
      this.resolves = [];
      this.disposer = attach(function (message) {
        return _this2.emit(message);
      }, function () {
        return _this2.done();
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
      key: 'emit',
      value: function emit(message) {
        if (this.resolves.length) this.resolves.shift()(message);else this.messages.push(message);
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
    function Iterator(attach) {
      _classCallCheck(this, Iterator);

      setGear(this, new IteratorGear(attach));
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

      this.bubbles = bus.bubbles;
      this.bus = bus;
      this.enabled = true;
      this.name = name;
      if (parent) this.parent = getGear(parent);
      this.select = identity;
      this.trace = trace;
      trace('create');
    }

    _createClass(ChannelGear, [{
      key: 'bubble',
      value: function bubble(value) {
        value = !!value;
        this.trace('bubble', value);
        this.bubbles = value;
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.trace('clear');
        var observers = this.observers;
        if (observers) observers.forEach(function (observer) {
          return observer.done();
        });
        var retentions = this.retentions;
        if (retentions) retentions.length = 0;
        this.observers = this.subscriptions = undefined;
      }
    }, {
      key: 'cycle',
      value: function cycle(limit, step) {
        limit = isNumber(limit) ? limit > 0 ? limit : 0 : limit ? 1 : 0;
        step = isNumber(step) && 9 < step ? step : limit;
        this.trace('cycle', limit, step);
        var index = 0;
        this.select = limit ? function (subscriptions) {
          var length = subscriptions.length;
          if (!length) return [];
          var count = min(limit, length),
              i = index,
              selected = Array(count);

          while (count-- > 0) {
            selected[i] = subscriptions[i++ % length];
          }

          index += step;
          return selected;
        } : identity;
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
        if (classof(message) === CLASS_AEROBUS_MESSAGE) return this.name === CHANNEL_NAME_ERROR ? message : message.pass(this.name);
        var bus = this.bus,
            Message = bus.Message;
        return new Message(message, ++bus.id, [this.name]);
      }
    }, {
      key: 'propagate',
      value: function propagate(message) {
        var retentions = this.retentions;

        if (retentions) {
          retentions.push(message);
          if (retentions.length > retentions.limit) retentions.shift();
        }

        if (this.bubbles) {
          var parent = this.parent;
          if (parent) parent.publish(message);
        }

        if (this.observers) this.observers.forEach(function (observer) {
          return observer.next(message);
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
        var subscriptions = this.subscriptions;
        if (subscriptions) this.select(subscriptions).forEach(this.name === CHANNEL_NAME_ERROR ? function (subscription) {
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
        var subscriptions = this.subscriptions;
        if (subscriptions) this.select(subscriptions).forEach(this.name === CHANNEL_NAME_ERROR ? function (subscription) {
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
        var observers = this.observers;
        if (observers) observers.forEach(function (observer) {
          return observer.done();
        });
        this.retentions = this.observers = this.subscriptions = undefined;
        this.select = identity;
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        limit = isNumber(limit) ? max(limit, 0) : limit ? maxSafeInteger : 0;
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
      key: 'shuffle',
      value: function shuffle(limit) {
        limit = isNumber(limit) ? limit > 0 ? limit : 0 : limit ? 1 : 0;
        this.trace('shuffle', limit);
        this.select = limit ? function (subscriptions) {
          var length = subscriptions.length;
          if (!length) return [];
          var count = min(limit, length),
              selected = Array(count);

          do {
            var candidate = subscriptions[floor(random() * length)];
            if (-1 === selected.indexOf(candidate)) selected[--count] = candidate;
          } while (count > 0);

          return selected;
        } : identity;
      }
    }, {
      key: 'subscribe',
      value: function subscribe(parameters) {
        var _this7 = this;

        this.trace('subscribe', parameters);
        var name = undefined,
            order = 0,
            subscribers = [];
        parameters.forEach(function (parameter) {
          switch (classof(parameter)) {
            case CLASS_FUNCTION:
              subscribers.push(parameter);
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
        if (!subscribers.length) return;
        var subscriptions = subscribers.map(function (subscriber) {
          return {
            name: name,
            order: order,
            subscriber: subscriber
          };
        }),
            existing = this.subscriptions;

        if (existing) {
          var index = existing.findIndex(function (subscription) {
            return subscription.order > order;
          });
          -1 === index ? existing.push.apply(existing, _toConsumableArray(subscriptions)) : existing.splice.apply(existing, [index, 0].concat(_toConsumableArray(subscriptions)));
        } else this.subscriptions = subscriptions;

        var retentions = this.retentions;
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
        var _this8 = this;

        this.trace('unsubscribe', parameters);

        if (parameters.length) {
          (function () {
            var i = undefined,
                subscriptions = _this8.subscriptions;
            if (subscriptions) parameters.forEach(function (parameter) {
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
            });
          })();
        } else this.subscriptions = undefined;
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

  var ChannelBase = (function () {
    function ChannelBase(bus, name, parent) {
      var _this9 = this;

      _classCallCheck(this, ChannelBase);

      defineProperty(this, 'name', {
        value: name,
        enumerable: true
      });
      if (isSomething(parent)) defineProperty(this, 'parent', {
        value: parent,
        enumerable: true
      });

      var trace = function trace(event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return bus.trace.apply(bus, [event, _this9].concat(args));
      };

      setGear(this, new ChannelGear(bus, name, parent, trace));
    }

    _createClass(ChannelBase, [{
      key: 'clear',
      value: function clear() {
        getGear(this).clear();
        return this;
      }
    }, {
      key: 'cycle',
      value: function cycle() {
        var limit = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var step = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
        getGear(this).cycle(limit, step);
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
      key: 'shuffle',
      value: function shuffle() {
        var limit = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        getGear(this).shuffle(limit);
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
        var _this10 = this;

        return new Iterator(function (next, done) {
          return getGear(_this10).observe({
            next: next,
            done: done
          });
        });
      }
    }, {
      key: 'bubbles',
      get: function get() {
        return getGear(this).bubbles;
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
        var gear = getGear(this),
            subscriptions = gear.subscriptions;
        return subscriptions ? subscriptions.map(function (subscription) {
          return subscription.subscriber;
        }) : [];
      }
    }]);

    return ChannelBase;
  })();

  defineProperty(ChannelBase[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_CHANNEL
  });

  function subclassChannel() {
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
    function MessageBase(data, id, route) {
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
        id: {
          value: id,
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
            message = new Message(this.channel, this.id, this.route);
        defineProperty(message, 'error', {
          value: error
        });
        return message;
      }
    }, {
      key: 'pass',
      value: function pass(destination) {
        var Message = this.constructor,
            message = new Message(this.data, this.id, this.route.concat(destination));
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

      function Message(data, id, route) {
        _classCallCheck(this, Message);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this, data, id, route));
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

  var SectionBase = (function () {
    function SectionBase(channels) {
      _classCallCheck(this, SectionBase);

      setGear(this, new SectionGear(channels));
    }

    _createClass(SectionBase, [{
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
        var _this13 = this;

        return new Iterator(function (next, end) {
          var gear = getGear(_this13),
              channels = gear.channels,
              count = channels.length;

          var done = function done() {
            return ! --count && end();
          };

          var disposers = channels.map(function (channel) {
            return getGear(channel).observe({
              next: next,
              done: done
            });
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

    return SectionBase;
  })();

  defineProperty(SectionBase[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_SECTION
  });

  function subclassSection() {
    return (function (_SectionBase) {
      _inherits(Section, _SectionBase);

      function Section(bus, binder) {
        _classCallCheck(this, Section);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this, bus, binder));
      }

      return Section;
    })(SectionBase);
  }

  function aerobus() {
    var _defineProperties;

    for (var _len7 = arguments.length, parameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
      parameters[_key7] = arguments[_key7];
    }

    var config = {
      bubbles: true,
      channel: {},
      delimiter: CHANNEL_HIERARCHY_DELIMITER,
      message: {},
      section: {},
      trace: noop
    };

    for (var i = 0, l = parameters.length; i < l; i++) {
      var parameter = parameters[i];

      switch (classof(parameter)) {
        case CLASS_BOOLEAN:
          config.bubbles = parameter;
          break;

        case CLASS_FUNCTION:
          config.trace = parameter;
          break;

        case CLASS_OBJECT:
          if ('bubbles' in parameter) config.bubbles = !!parameter;

          if ('delimiter' in parameter) {
            var value = parameter.delimiter;
            if (!isString(value) || !value.length) throwDelimiterNotValid(value);
            config.delimiter = value;
          }

          if ('trace' in parameter) {
            var value = parameter.trace;
            if (!isFunction(value)) throwTraceNotValid(value);
            config.trace = value;
          }

          assign(config.channel, parameter.channel);
          assign(config.message, parameter.message);
          assign(config.section, parameter.section);
          break;

        case CLASS_STRING:
          if (!parameter.length) throwDelimiterNotValid(parameter);
          config.delimiter = parameter;
          break;

        default:
          throwArgumentNotValid(parameter);
      }
    }

    setGear(bus, new BusGear(config));
    return defineProperties(bus, (_defineProperties = {}, _defineProperty(_defineProperties, $CLASS, {
      value: CLASS_AEROBUS
    }), _defineProperty(_defineProperties, 'bubbles', {
      get: getBubbles,
      set: setBubbles
    }), _defineProperty(_defineProperties, 'clear', {
      value: clear
    }), _defineProperty(_defineProperties, 'create', {
      value: create
    }), _defineProperty(_defineProperties, 'channels', {
      get: getChannels
    }), _defineProperty(_defineProperties, 'delimiter', {
      get: getDelimiter,
      set: setDelimiter
    }), _defineProperty(_defineProperties, 'error', {
      get: getError
    }), _defineProperty(_defineProperties, 'root', {
      get: getRoot
    }), _defineProperty(_defineProperties, 'trace', {
      get: getTrace,
      set: setTrace
    }), _defineProperty(_defineProperties, 'unsubscribe', {
      value: unsubscribe
    }), _defineProperties));

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

    function create() {
      for (var _len9 = arguments.length, modifiers = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        modifiers[_key9] = arguments[_key9];
      }

      return aerobus.apply(undefined, _toConsumableArray(parameters.concat(modifiers)));
    }

    function getBubbles() {
      return getGear(bus).bubbles;
    }

    function setBubbles(value) {
      var gear = getGear(bus);
      if (gear.sealed) throwForbiden();
      gear.bubbles = !!value;
    }

    function getChannels() {
      return Array.from(getGear(bus).channels.values());
    }

    function getDelimiter() {
      return getGear(bus).delimiter;
    }

    function setDelimiter(value) {
      if (!isString(value) || value.length === 0) throwDelimiterNotValid(value);
      var gear = getGear(bus);
      if (gear.sealed) throwForbiden();
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
      if (!isFunction(value)) throwTraceNotValid(value);
      var gear = getGear(bus);
      if (gear.sealed) throwForbiden();
      gear.trace = value;
    }

    function unsubscribe() {
      for (var _len10 = arguments.length, subscribers = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        subscribers[_key10] = arguments[_key10];
      }

      getGear(bus).unsubscribe(subscribers);
      return bus;
    }
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});