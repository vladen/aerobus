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

  var _slicedToArray = (function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  })();

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

  var CLASS_AEROBUS = 'Aerobus',
      CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + '.Channel',
      CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + '.Iterator',
      CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + '.Message',
      CLASS_AEROBUS_SECTION = CLASS_AEROBUS + '.Section',
      CLASS_AEROBUS_SUBSCRIBER = CLASS_AEROBUS + '.Subscriber',
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
      isObject = function isObject(value) {
    return classof(value) === CLASS_OBJECT;
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
    throw new TypeError('Argument of type "' + classof(value) + '" is unexpected.');
  },
      throwBusIsSealed = function throwBusIsSealed() {
    throw new Error('This message bus is sealed and can not be reconfigured now.');
  },
      throwGearNotFound = function throwGearNotFound(value) {
    throw new Error('This instance of "' + classof(value) + '"" has been deleted.');
  },
      throwCallbackNotValid = function throwCallbackNotValid(value) {
    throw new TypeError('Callback expected to be a function, not "' + classof(value) + '".');
  },
      throwChannelExtensionNotValid = function throwChannelExtensionNotValid(value) {
    throw new TypeError('Channel class extensions expected to be an object, not "' + value + '".');
  },
      throwDelimiterNotValid = function throwDelimiterNotValid(value) {
    throw new TypeError('Delimiter expected to be not empty string, not "' + value + '".');
  },
      throwErrorNotValid = function throwErrorNotValid(value) {
    throw new TypeError('Error expected to be a function, not "' + classof(value) + '".');
  },
      throwMessageExtensionNotValid = function throwMessageExtensionNotValid(value) {
    throw new TypeError('Message class extensions expected to be an object, not "' + value + '".');
  },
      throwNameNotValid = function throwNameNotValid(value) {
    throw new TypeError('Name expected to be a string, not "' + classof(value) + '".');
  },
      throwObserverNotValid = function throwObserverNotValid(value) {
    throw new TypeError('Observer expected to be an object having mandatory next method and optional done/complete method.');
  },
      throwOrderNotValid = function throwOrderNotValid(value) {
    throw new TypeError('Order expected to be a number, not "' + classof(value) + '".');
  },
      throwOptionsNotValid = function throwOptionsNotValid(value) {
    throw new TypeError('Options expected to be an object, not "' + classof(value) + '".');
  },
      throwSectionExtensionNotValid = function throwSectionExtensionNotValid(value) {
    throw new TypeError('Section class extensions expected to be an object, not "' + value + '".');
  },
      throwSubscriberNotValid = function throwSubscriberNotValid() {
    throw new TypeError('Subscriber expected to be a function or an observer object.');
  },
      throwTraceNotValid = function throwTraceNotValid(value) {
    throw new TypeError('Trace expected to be a function, not "' + classof(value) + '".');
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
      this.error = config.error;
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
        if (!isString(name)) throwNameNotValid(name);
        var Channel = this.Channel;

        if (name === '') {
          channel = new Channel(this, name);
          channels.set(name, channel);
        } else {
          var parent = channels.get('');

          if (!parent) {
            parent = new Channel(this, '');
            channels.set('', parent);
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
            return this.get('');

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
      value: function unsubscribe(parameters) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.channels.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var channel = _step2.value;
            getGear(channel).unsubscribe(parameters);
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

  var Subscriber = (function () {
    function Subscriber(next, done) {
      var name = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];
      var order = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
      var retain = arguments.length <= 4 || arguments[4] === undefined ? true : arguments[4];

      _classCallCheck(this, Subscriber);

      defineProperties(this, {
        done: {
          value: done
        },
        next: {
          value: next
        },
        name: {
          value: name,
          writable: true
        },
        order: {
          value: order,
          writable: true
        },
        retain: {
          value: retain
        }
      });
    }

    _createClass(Subscriber, null, [{
      key: 'fromFunction',
      value: function fromFunction(next, name, order) {
        return new Subscriber(next, noop, name, order);
      }
    }, {
      key: 'fromObserver',
      value: function fromObserver(observer, name, order) {
        var done = undefined,
            next = undefined;

        if (isFunction(observer.next)) {
          next = function (data, message) {
            return observer.next(message);
          };

          if (isSomething(observer.done)) {
            if (!isFunction(observer.done)) throwObserverNotValid(observer);

            done = function () {
              return observer.done();
            };
          } else if (isSomething(observer.complete)) {
            if (!isFunction(observer.complete)) throwObserverNotValid(observer);

            done = function () {
              return observer.complete();
            };
          } else done = noop;
        } else throwObserverNotValid(observer);

        return new Subscriber(next, done, name, order);
      }
    }]);

    return Subscriber;
  })();

  defineProperty(Subscriber[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_SUBSCRIBER
  });

  var IteratorGear = (function () {
    function IteratorGear(channels) {
      var _this2 = this;

      _classCallCheck(this, IteratorGear);

      this.disposed = false;

      this.disposer = function () {
        return channels.forEach(function (channel) {
          return channel.unsubscribe([_this2.subscriber]);
        });
      };

      this.messages = [];
      this.subscriber = new Subscriber(function (data, message) {
        return _this2.emit(message);
      }, function () {
        return _this2.done();
      }, undefined, maxSafeInteger, false);
      this.rejects = [];
      this.resolves = [];
      channels.forEach(function (channel) {
        return channel.subscribe([_this2.subscriber]);
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

      this.bubbles = bus.bubbles;
      this.bus = bus;
      this.enabled = true;
      this.name = name;
      if (parent) this.parent = getGear(parent);
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
        var retentions = this.retentions;
        if (retentions) retentions.length = 0;
        var subscribers = this.subscribers;
        if (subscribers) subscribers.forEach(function (subscriber) {
          return setImmediate(function () {
            return subscriber.done();
          });
        });
        this.retentions = this.subscribers = undefined;
      }
    }, {
      key: 'cycle',
      value: function cycle(limit, step) {
        limit = isNumber(limit) ? limit > 0 ? limit : 0 : limit ? 1 : 0;
        step = isNumber(step) && 9 < step ? step : limit;
        this.trace('cycle', limit, step);
        var index = 0;
        if (limit) this.strategy = function (subscriptions) {
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
        };else delete this.strategy;
      }
    }, {
      key: 'disable',
      value: function disable() {
        this.enable(false);
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
        var bus = this.bus,
            Message = bus.Message;
        return classof(message) === CLASS_AEROBUS_MESSAGE ? new Message(message.data, message.id, message.route.concat(this.name)) : new Message(message, ++bus.id, [this.name]);
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
      }
    }, {
      key: 'publish',
      value: function publish(message) {
        var _this4 = this;

        if (!this.isEnabled) return;
        message = this.envelop(message);
        this.trace('publish', message);
        this.propagate(message);
        var strategy = this.strategy,
            subscribers = this.subscribers;
        if (!subscribers) return;
        if (strategy) subscribers = strategy(subscribers);
        subscribers.forEach(function (subscriber) {
          try {
            subscriber.next(message.data, message);
          } catch (error) {
            setImmediate(function () {
              return _this4.bus.error(error, message);
            });
          }
        });
      }
    }, {
      key: 'request',
      value: function request(message, results) {
        var _this5 = this;

        if (!this.isEnabled) return;
        message = this.envelop(message);
        this.trace('request', message);
        this.propagate(message);
        var strategy = this.strategy,
            subscribers = this.subscribers;
        if (!subscribers) return;
        if (strategy) subscribers = strategy(subscribers);
        subscribers.forEach(function (subscriber) {
          try {
            results.push(subscriber.next(message.data, message));
          } catch (error) {
            results.push(error);
            setImmediate(function () {
              return _this5.bus.error(error, message);
            });
          }
        });
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.trace('reset');
        var retentions = this.retentions;
        if (retentions) retentions.length = 0;
        var subscribers = this.subscribers;
        if (subscribers) subscribers.forEach(function (subscriber) {
          return setImmediate(function () {
            return subscriber.done();
          });
        });
        this.enabled = true;
        this.retentions = this.strategy = this.subscribers = undefined;
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
        if (limit) this.strategy = function (subscriptions) {
          var length = subscriptions.length;
          if (!length) return [];
          var count = min(limit, length),
              selected = Array(count);

          do {
            var candidate = subscriptions[floor(random() * length)];
            if (-1 === selected.indexOf(candidate)) selected[--count] = candidate;
          } while (count > 0);

          return selected;
        };else delete this.strategy;
      }
    }, {
      key: 'subscribe',
      value: function subscribe(parameters) {
        var _this6 = this;

        this.trace('subscribe', parameters);
        var name = undefined,
            order = undefined,
            subscribers = [];
        parameters.forEach(function (parameter) {
          switch (classof(parameter)) {
            case CLASS_AEROBUS_SUBSCRIBER:
              subscribers.push([identity, parameter]);
              break;

            case CLASS_FUNCTION:
              subscribers.push([Subscriber.fromFunction, parameter]);
              break;

            case CLASS_NUMBER:
              order = parameter;
              break;

            case CLASS_OBJECT:
              subscribers.push([Subscriber.fromObserver, parameter]);
              break;

            case CLASS_STRING:
              name = parameter;
              break;

            default:
              throwArgumentNotValid(parameter);
          }
        });
        if (!subscribers.length) throwSubscriberNotValid();
        if (isNothing(order)) order = 0;
        subscribers = subscribers.map(function (_ref) {
          var _ref2 = _slicedToArray(_ref, 2);

          var factory = _ref2[0];
          var parameter = _ref2[1];
          return factory(parameter, name, order);
        });
        if (!this.subscribers) this.subscribers = [];
        subscribers.forEach(function (subscriber) {
          var index = _this6.subscribers.findIndex(function (existing) {
            return existing.order > subscriber.order;
          });

          -1 === index ? _this6.subscribers.push(subscriber) : _this6.subscribers.splice(index, 0, subscriber);
          if (_this6.retentions && subscriber.retain !== false) _this6.retentions.forEach(function (message) {
            try {
              subscriber.next(message.data, message);
            } catch (error) {
              setImmediate(function () {
                return _this6.bus.error(error, message);
              });
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
        var subscribers = this.subscribers;
        if (!subscribers) return;
        var predicates = [];

        if (parameters.length) {
          if (parameters) parameters.forEach(function (parameter) {
            switch (classof(parameter)) {
              case CLASS_AEROBUS_SUBSCRIBER:
                predicates.push(function (subscriber) {
                  return subscriber === parameter;
                });
                break;

              case CLASS_FUNCTION:
                predicates.push(function (subscriber) {
                  return subscriber.next === parameter;
                });
                break;

              case CLASS_OBJECT:
                predicates.push(function (subscriber) {
                  return subscriber.observer === parameter;
                });
                break;

              case CLASS_STRING:
                predicates.push(function (subscriber) {
                  return subscriber.name === parameter;
                });
                break;

              default:
                throwArgumentNotValid(parameter);
            }
          });
        } else predicates.push(function () {
          return true;
        });

        var i = subscribers.length;

        var _loop = function _loop() {
          var subscriber = subscribers[i];

          if (predicates.some(function (predicate) {
            return predicate(subscriber);
          })) {
            subscribers.splice(i, 1);
            setImmediate(function () {
              return subscriber.done();
            });
          }
        };

        while (--i >= 0) {
          _loop();
        }
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
      var _this7 = this;

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

        return bus.trace.apply(bus, [event, _this7].concat(args));
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
        getGear(this).disable(false);
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
        return new Iterator([getGear(this)]);
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
            subscribers = gear.subscribers;
        return subscribers ? subscribers.map(function (subscriber) {
          return subscriber.next;
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

  var MessageBase = function MessageBase(data, id, route) {
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
  };

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
        return new Iterator(getGear(this).channels);
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

    var options = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
    var config = {
      bubbles: true,
      channel: {},
      delimiter: '.',
      error: function error(_error) {
        throw _error;
      },
      message: {},
      section: {},
      trace: noop
    };

    if (isSomething(options)) {
      if (!isObject(options)) throwOptionsNotValid(options);
      var bubbles = options.bubbles;
      var channel = options.channel;
      var delimiter = options.delimiter;
      var error = options.error;
      var message = options.message;
      var section = options.section;
      var trace = options.trace;
      if (isSomething(bubbles)) config.bubbles = !!bubbles;

      if (isSomething(delimiter)) {
        if (!isString(delimiter) || !delimiter.length) throwDelimiterNotValid(delimiter);
        config.delimiter = delimiter;
      }

      if (isSomething(error)) {
        if (!isFunction(error)) throwErrorNotValid(error);
        config.error = error;
      }

      if (isSomething(trace)) {
        if (!isFunction(trace)) throwTraceNotValid(trace);
        config.trace = trace;
      }

      if (isSomething(channel)) {
        if (!isObject(channel)) throwChannelExtensionNotValid(channel);
        assign(config.channel, channel);
      }

      if (isSomething(message)) {
        if (!isObject(message)) throwMessageExtensionNotValid(message);
        assign(config.message, message);
      }

      if (isSomething(section)) {
        if (!isObject(section)) throwSectionExtensionNotValid(section);
        assign(config.section, section);
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
      get: getError,
      set: setError
    }), _defineProperty(_defineProperties, 'root', {
      get: getRoot
    }), _defineProperty(_defineProperties, 'trace', {
      get: getTrace,
      set: setTrace
    }), _defineProperty(_defineProperties, 'unsubscribe', {
      value: unsubscribe
    }), _defineProperties));

    function bus() {
      for (var _len7 = arguments.length, names = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        names[_key7] = arguments[_key7];
      }

      return getGear(bus).resolve(names);
    }

    function clear() {
      getGear(bus).clear();
      return bus;
    }

    function create(modifiers) {
      return aerobus(assign(config, modifiers));
    }

    function getBubbles() {
      return getGear(bus).bubbles;
    }

    function setBubbles(value) {
      getGear(bus).bubbles = !!value;
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
      if (gear.sealed) throwBusIsSealed();
      gear.delimiter = value;
    }

    function getError() {
      return getGear(bus).error;
    }

    function setError(value) {
      if (!isFunction(value)) throwErrorNotValid(value);
      getGear(bus).error = value;
    }

    function getRoot() {
      return getGear(bus).get('');
    }

    function getTrace() {
      return getGear(bus).trace;
    }

    function setTrace(value) {
      if (!isFunction(value)) throwTraceNotValid(value);
      getGear(bus).trace = value;
    }

    function unsubscribe() {
      for (var _len8 = arguments.length, parameters = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        parameters[_key8] = arguments[_key8];
      }

      getGear(bus).unsubscribe(parameters);
      return bus;
    }
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});