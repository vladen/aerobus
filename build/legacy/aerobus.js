var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toArray(arr) {
    return Array.isArray(arr) ? arr : Array.from(arr);
  }

  var _objectDefineProperti;

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

  var _createClass = function () {
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
  }();

  var CLASS = Symbol.toStringTag;
  var PROTOTYPE = 'prototype';
  var CLASS_AEROBUS = 'Aerobus';
  var CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + '.Channel';
  var CLASS_AEROBUS_FORWARDING = CLASS_AEROBUS + '.Forwarding';
  var CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + '.Message';
  var CLASS_AEROBUS_PLAN = CLASS_AEROBUS + '.PLAN';
  var CLASS_AEROBUS_SECTION = CLASS_AEROBUS + '.Section';
  var CLASS_AEROBUS_STRATEGY_CYCLE = CLASS_AEROBUS + '.Strategy.Cycle';
  var CLASS_AEROBUS_STRATEGY_SHUFFLE = CLASS_AEROBUS + '.Strategy.Shuffle';
  var CLASS_AEROBUS_SUBSCRIBER = CLASS_AEROBUS + '.Subscriber';
  var CLASS_AEROBUS_SUBSCRIPTION = CLASS_AEROBUS + '.Subscription';
  var CLASS_AEROBUS_UNSUBSCRIPTION = CLASS_AEROBUS + '.Unsubscription';
  var CLASS_ARRAY = 'Array';
  var CLASS_BOOLEAN = 'Boolean';
  var CLASS_FUNCTION = 'Function';
  var CLASS_NUMBER = 'Number';
  var CLASS_REGEXP = 'RegExp';
  var CLASS_OBJECT = 'Object';
  var CLASS_STRING = 'String';
  var objectAssign = Object.assign;
  var objectCreate = Object.create;
  var objectDefineProperties = Object.defineProperties;
  var objectDefineProperty = Object.defineProperty;
  var objectFreeze = Object.freeze;
  var objectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var objectGetOwnPropertyNames = Object.getOwnPropertyNames;
  var mathFloor = Math.floor;
  var mathMax = Math.max;
  var mathMin = Math.min;
  var mathRandom = Math.random;
  var maxSafeInteger = Number.MAX_SAFE_INTEGER;

  var isNothing = function isNothing(value) {
    return value == null;
  };

  var isSomething = function isSomething(value) {
    return value != null;
  };

  var extend = function extend(target, source) {
    if (isNothing(source)) return target;
    var names = objectGetOwnPropertyNames(source);

    for (var i = names.length - 1; i >= 0; i--) {
      var name = names[i];
      if (name in target) continue;
      objectDefineProperty(target, name, objectGetOwnPropertyDescriptor(source, name));
    }

    return target;
  };

  var finalize = function finalize(collection, error) {
    for (var i = collection.length; i--;) {
      try {
        collection[i].done();
      } catch (e) {
        setImmediate(function () {
          return error(e);
        });
      }

      collection[i] = null;
    }
  };

  var objectToString = Object.prototype.toString;

  var classOf = function classOf(value) {
    return objectToString.call(value).slice(8, -1);
  };

  var classIs = function classIs(className) {
    return function (value) {
      return classOf(value) === className;
    };
  };

  var isArray = classIs(CLASS_ARRAY);
  var isFunction = classIs(CLASS_FUNCTION);
  var isNumber = classIs(CLASS_NUMBER);
  var isObject = classIs(CLASS_OBJECT);
  var isString = classIs(CLASS_STRING);

  var noop = function noop() {};

  var truthy = function truthy() {
    return true;
  };

  var gears = new WeakMap();

  var getGear = function getGear(key) {
    var gear = gears.get(key);
    if (isNothing(gear)) throw errorGearNotFound(key);
    return gear;
  };

  var setGear = function setGear(key, gear) {
    if (isSomething(gear)) gears.set(key, gear);else gears.delete(key, gear);
  };

  var errorArgumentNotValid = function errorArgumentNotValid(value) {
    return new TypeError('Argument of type "' + classOf(value) + '" is not expected.');
  };

  var errorCallbackNotValid = function errorCallbackNotValid(value) {
    return new TypeError('Callback expected to be a function, not "' + classOf(value) + '".');
  };

  var errorChannelExtensionNotValid = function errorChannelExtensionNotValid(value) {
    return new TypeError('Channel class extensions expected to be an object, not "' + value + '".');
  };

  var errorDelimiterNotValid = function errorDelimiterNotValid(value) {
    return new TypeError('Delimiter expected to be not empty string, not "' + value + '".');
  };

  var errorErrorNotValid = function errorErrorNotValid(value) {
    return new TypeError('Error expected to be a function, not "' + classOf(value) + '".');
  };

  var errorForwarderNotValid = function errorForwarderNotValid() {
    return new TypeError('Forwarder expected to be a function or a channel name.');
  };

  var errorGearNotFound = function errorGearNotFound(value) {
    return new Error('This instance of "' + classOf(value) + '"" has been deleted.');
  };

  var errorMessageExtensionNotValid = function errorMessageExtensionNotValid(value) {
    return new TypeError('Message class extensions expected to be an object, not "' + value + '".');
  };

  var errorNameNotValid = function errorNameNotValid(value) {
    return new TypeError('Name expected to be a string, not "' + classOf(value) + '".');
  };

  var errorObservableNotValid = function errorObservableNotValid() {
    return new TypeError('Observable expected to be a channel name.');
  };

  var errorOrderNotValid = function errorOrderNotValid(value) {
    return new TypeError('Order expected to be a number, not "' + classOf(value) + '".');
  };

  var errorPlanExtensionNotValid = function errorPlanExtensionNotValid(value) {
    return new TypeError('Plan class extensions expected to be an object, not "' + value + '".');
  };

  var errorSectionExtensionNotValid = function errorSectionExtensionNotValid(value) {
    return new TypeError('Section class extensions expected to be an object, not "' + value + '".');
  };

  var errorSubscriberNotValid = function errorSubscriberNotValid() {
    return new TypeError('Subscriber expected to be a function or an object having "next" and optional "done" methods.');
  };

  var errorTraceNotValid = function errorTraceNotValid(value) {
    return new TypeError('Trace expected to be a function, not "' + classOf(value) + '".');
  };

  var errorAerobusExtensionNotValid = function errorAerobusExtensionNotValid(value) {
    return new TypeError('Aerobus extension expected to be an object, not "' + value + '".');
  };

  var ChannelGear = function () {
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
        var error = this.bus.error,
            observers = this.observers,
            retentions = this.retentions,
            subscribers = this.subscribers;
        if (retentions) retentions.length = 0;

        if (observers) {
          finalize(observers, error);
          delete this.observers;
        }

        if (subscribers) {
          finalize(subscribers, error);
          delete this.subscribers;
        }
      }
    }, {
      key: 'cycle',
      value: function cycle(strategy) {
        if (strategy) {
          this.trace('cycle', strategy.limit, strategy.step);
          this.strategy = strategy;
        } else {
          this.trace('cycle', 0, 0);
          delete this.strategy;
        }
      }
    }, {
      key: 'enable',
      value: function enable(value) {
        value = !!value;
        this.trace('enable', value);
        this.enabled = value;
      }
    }, {
      key: 'forward',
      value: function forward(forwarding) {
        var collection = this.forwarders,
            forwarders = forwarding.forwarders;
        this.trace('forward', forwarders);
        if (collection) collection.push.apply(collection, _toConsumableArray(forwarders));else this.forwarders = forwarders.slice();
      }
    }, {
      key: 'observe',
      value: function observe(observer) {
        var existing = this.observers;
        this.observers = existing ? existing.concat(observer) : [observer];
      }
    }, {
      key: 'publish',
      value: function publish(message, callback) {
        var _this = this;

        this.trace('publish', message);
        if (!this.isEnabled) return;
        var Message = this.bus.Message,
            observers = this.observers,
            skip = false;
        message = classOf(message) === CLASS_AEROBUS_MESSAGE ? new Message(message.data, message.id, [this.name].concat(message.route)) : new Message(message, ++this.bus.id, [this.name]);
        if (observers) for (var i = -1, l = observers.length; ++i < l;) {
          var observer = observers[i];
          if (observer) observer.next(message);
        }

        if (!message.route.includes(this.name, 1)) {
          var forwarders = this.forwarders;

          if (forwarders) {
            var destinations = new Set();
            skip = true;

            for (var i = -1, l = forwarders.length; ++i < l;) {
              var forwarder = forwarders[i],
                  names = isFunction(forwarder) ? forwarder(message.data, message) : forwarder;
              if (isArray(names)) for (var j = -1, m = names.length; ++j < m;) {
                var name = names[j];
                if (isNothing(name) || this.name === name) skip = false;else if (isString(name)) destinations.add(name);else throw errorNameNotValid(name);
              } else if (isNothing(names) || this.name === names) skip = false;else if (isString(names)) destinations.add(names);else throw errorNameNotValid(names);
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = destinations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var destination = _step.value;
                var result = getGear(this.bus.get(destination)).publish(message, callback);
                if (result === message.cancel) return result;
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
          }
        }

        if (skip) return;
        var retentions = this.retentions;

        if (retentions) {
          retentions.push(message);
          if (retentions.length > retentions.limit) retentions.shift();
        }

        if (this.bubbles) {
          var parent = this.parent;

          if (parent) {
            var result = parent.publish(message, callback);
            if (result === message.cancel) return result;
          }
        }

        var subscribers = this.subscribers;
        if (!subscribers) return;
        var strategy = this.strategy;
        if (strategy) subscribers = strategy.select(subscribers);

        for (var i = -1, l = subscribers.length; ++i < l;) {
          var subscriber = subscribers[i];
          if (subscriber) try {
            var result = subscriber.next(message.data, message);
            if (result === message.cancel) return result;
            callback(result);
          } catch (error) {
            callback(error);
            setImmediate(function () {
              return _this.bus.error(error, message);
            });
          }
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.trace('reset');
        var error = this.bus.error,
            observers = this.observers,
            subscribers = this.subscribers;
        this.enabled = true;
        delete this.forwarders;
        delete this.observers;
        delete this.plans;
        delete this.retentions;
        delete this.strategy;
        delete this.subscribers;
        delete this.subscriptions;
        if (observers) finalize(observers, error);
        if (subscribers) finalize(subscribers, error);
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        limit = isNumber(limit) ? mathMax(limit, 0) : limit ? maxSafeInteger : 0;
        this.trace('retain', limit);

        if (limit) {
          var collection = this.retentions;

          if (collection) {
            if (collection.length > limit) collection = this.retentions = collection.slice(collection.length - limit);
            collection.limit = limit;
          } else {
            this.retentions = [];
            this.retentions.limit = limit;
          }
        } else delete this.retentions;
      }
    }, {
      key: 'shuffle',
      value: function shuffle(strategy) {
        if (strategy) {
          this.trace('shuffle', strategy.limit);
          this.strategy = strategy;
        } else {
          this.trace('shuffle', 0);
          delete this.strategy;
        }
      }
    }, {
      key: 'subscribe',
      value: function subscribe(subscription) {
        var _this2 = this;

        this.trace('subscribe', subscription.parameters);
        var collection = this.subscribers,
            retentions = this.retentions,
            subscribers = subscription.subscribers;
        if (collection) for (var i = -1, l = subscribers.length; ++i < l;) {
          var subscriber = subscribers[i],
              last = collection.length - 1;
          if (collection[last].order <= subscriber.order) collection.push(subscriber);else {
            while (last > 0 && collection[last] > subscriber.order) {
              last--;
            }

            collection.splice(last, 0, subscriber);
          }
        } else this.subscribers = subscribers.slice();
        if (retentions) for (var i = -1, l = subscribers.length; ++i < l;) {
          var subscriber = subscribers[i];

          var _loop = function _loop(j, m) {
            var retention = retentions[j];

            try {
              subscriber.next(retention.data, retention);
            } catch (error) {
              setImmediate(function () {
                return _this2.bus.error(error, retention);
              });
            }
          };

          for (var j = -1, m = retentions.length; ++j < m;) {
            _loop(j, m);
          }
        }
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.trace('toggle');
        this.enabled = !this.enabled;
      }
    }, {
      key: 'unobserve',
      value: function unobserve(observer) {
        var existing = this.observers,
            excepted = [];
        if (existing) for (var j = existing.length; --j;) {
          var candidate = existing[j];
          if (observer === candidate) existing[j] = null;else excepted.push(observer);
        }
        if (excepted.length) this.observers = excepted;else delete this.observers;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(unsubscription) {
        var _this3 = this;

        this.trace('unsubscribe', unsubscription.parameters);
        var collection = this.subscribers,
            predicates = unsubscription.predicates;
        if (!collection) return;

        if (predicates.length) {
          var unsubscribed = 0;

          for (var i = collection.length; i--;) {
            var subscriber = collection[i];
            if (subscriber) for (var j = predicates.length; j--;) {
              if (predicates[j](subscriber)) {
                collection[i] = null;
                unsubscribed++;

                try {
                  subscriber.done();
                } catch (error) {
                  setImmediate(function () {
                    return _this3.bus.error(error);
                  });
                }

                break;
              }
            }
          }

          if (unsubscribed < collection.length) {
            var subscribers = [];

            for (var i = collection.length; i--;) {
              var subscriber = collection[i];
              if (subscriber) subscribers.push(subscriber);
            }

            this.subscribers = subscribers;
          } else delete this.subscribers;
        } else {
          for (var i = collection.length; i--;) {
            try {
              collection[i].done();
            } catch (error) {
              setImmediate(function () {
                return _this3.bus.error(error);
              });
            }
          }

          delete this.subscribers;
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
  }();

  var CycleStrategy = function () {
    function CycleStrategy(limit, step) {
      _classCallCheck(this, CycleStrategy);

      objectDefineProperties(this, {
        cursor: {
          value: 0,
          writable: true
        },
        limit: {
          value: limit
        },
        name: {
          value: 'cycle'
        },
        step: {
          value: step
        }
      });
    }

    _createClass(CycleStrategy, [{
      key: 'select',
      value: function select(subscribers) {
        var length = subscribers.length;
        if (!length) return [];
        var count = mathMin(this.limit, length),
            i = this.cursor,
            selected = Array(count);

        while (count-- > 0) {
          selected.push(subscribers[i++ % length]);
        }

        this.cursor += this.step;
        return selected;
      }
    }], [{
      key: 'create',
      value: function create(limit, step) {
        limit = isNumber(limit) ? limit > 0 ? limit : 0 : limit ? 1 : 0;
        if (!limit) return null;
        step = isNumber(step) && 0 < step ? step : limit;
        return new CycleStrategy(limit, step);
      }
    }]);

    return CycleStrategy;
  }();

  objectDefineProperty(CycleStrategy[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_STRATEGY_CYCLE
  });

  var Forwarding = function Forwarding(parameters) {
    _classCallCheck(this, Forwarding);

    var forwarders = [];

    for (var i = -1, l = parameters.length; ++i < l;) {
      var parameter = parameters[i];

      switch (classOf(parameter)) {
        case CLASS_AEROBUS_FORWARDING:
          forwarders.push.apply(forwarders, _toConsumableArray(parameter.forwarders));
          break;

        case CLASS_FUNCTION:
        case CLASS_STRING:
          forwarders.push(parameter);
          break;

        default:
          throw errorArgumentNotValid(parameter);
      }
    }

    if (!forwarders.length) throw errorForwarderNotValid();
    objectDefineProperty(this, 'forwarders', {
      value: forwarders
    });
  };

  objectDefineProperty(Forwarding[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_FORWARDING
  });

  var ShuffleStrategy = function () {
    function ShuffleStrategy(limit) {
      _classCallCheck(this, ShuffleStrategy);

      objectDefineProperties(this, {
        limit: {
          value: limit
        },
        name: {
          value: 'shuffle'
        }
      });
    }

    _createClass(ShuffleStrategy, [{
      key: 'select',
      value: function select(subscribers) {
        var length = subscribers.length;
        if (!length) return [];
        var count = mathMin(this.limit, length),
            selected = Array(count);

        do {
          var candidate = subscribers[mathFloor(mathRandom() * length)];
          if (!selected.includes(candidate)) selected[--count] = candidate;
        } while (count > 0);

        return selected;
      }
    }], [{
      key: 'create',
      value: function create(limit) {
        limit = isNumber(limit) ? limit > 0 ? limit : 0 : limit ? 1 : 0;
        if (!limit) return null;
        return new ShuffleStrategy(limit);
      }
    }]);

    return ShuffleStrategy;
  }();

  objectDefineProperty(ShuffleStrategy[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_STRATEGY_SHUFFLE
  });

  var Subscriber = function Subscriber(base, name, order) {
    _classCallCheck(this, Subscriber);

    var done = undefined,
        next = undefined;

    if (isFunction(base)) {
      done = noop;
      next = base;
    } else if (classOf(base) === CLASS_AEROBUS_SUBSCRIBER) {
      done = base.done;
      next = base.next;
      if (isNothing(name)) name = base.name;
      if (isNothing(order)) order = base.order;
    } else if (isObject(base) && isFunction(base.next)) {
      next = function next(data, message) {
        return base.next(data, message);
      };

      if (isSomething(base.done)) {
        if (isFunction(base.done)) {
          (function () {
            var disposed = false;

            done = function done() {
              if (disposed) return;
              disposed = true;
              base.done();
            };
          })();
        } else throw errorSubscriberNotValid(base);
      } else done = noop;
      if (isNothing(name) && isSomething(base.name)) if (isString(base.name)) name = base.name;else throw errorNameNotValid(base.name);
      if (isNothing(order) && isSomething(base.order)) if (isNumber(base.order)) order = base.order;else throw errorOrderNotValid(base.order);
    } else throw errorSubscriberNotValid(base);

    if (isNothing(order)) order = 0;
    objectDefineProperties(this, {
      base: {
        value: base
      },
      done: {
        value: done
      },
      next: {
        value: next
      },
      order: {
        value: order
      }
    });
    if (isSomething(name)) objectDefineProperty(this, 'name', {
      value: name
    });
  };

  objectDefineProperty(Subscriber[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_SUBSCRIBER
  });

  var Subscription = function Subscription(parameters) {
    _classCallCheck(this, Subscription);

    var builders = [],
        name = undefined,
        order = undefined;

    var _loop2 = function _loop2(i, l) {
      var parameter = parameters[i];

      switch (classOf(parameter)) {
        case CLASS_FUNCTION:
        case CLASS_OBJECT:
        case CLASS_AEROBUS_SUBSCRIBER:
          builders.push(function () {
            return new Subscriber(parameter, name, order);
          });
          break;

        case CLASS_NUMBER:
          order = parameter;
          break;

        case CLASS_STRING:
          name = parameter;
          break;

        default:
          throw errorArgumentNotValid(parameter);
      }
    };

    for (var i = -1, l = parameters.length; ++i < l;) {
      _loop2(i, l);
    }

    if (!builders.length) throw errorSubscriberNotValid();
    objectDefineProperties(this, {
      parameters: {
        value: parameters
      },
      subscribers: {
        value: builders.map(function (builder) {
          return builder();
        })
      }
    });
  };

  objectDefineProperty(Subscription[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_SUBSCRIPTION
  });

  var Unsubscription = function Unsubscription(parameters) {
    _classCallCheck(this, Unsubscription);

    var predicates = [];

    var _loop3 = function _loop3(i, l) {
      var parameter = parameters[i];

      switch (classOf(parameter)) {
        case CLASS_AEROBUS_SUBSCRIBER:
          predicates.push(function (subscriber) {
            return subscriber === parameter;
          });
          break;

        case CLASS_FUNCTION:
        case CLASS_OBJECT:
          predicates.push(function (subscriber) {
            return subscriber.base === parameter;
          });
          break;

        case CLASS_STRING:
          predicates.push(function (subscriber) {
            return subscriber.name === parameter;
          });
          break;

        default:
          throw errorArgumentNotValid(parameter);
      }
    };

    for (var i = -1, l = parameters.length; ++i < l;) {
      _loop3(i, l);
    }

    objectDefineProperties(this, {
      parameters: {
        value: parameters
      },
      predicates: {
        value: predicates
      }
    });
  };

  objectDefineProperty(Unsubscription[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_UNSUBSCRIPTION
  });

  var Common = function () {
    function Common() {
      _classCallCheck(this, Common);
    }

    _createClass(Common, [{
      key: 'bubble',
      value: function bubble() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        getGear(this).bubble(value);
        return this;
      }
    }, {
      key: 'clear',
      value: function clear() {
        getGear(this).clear();
        return this;
      }
    }, {
      key: 'cycle',
      value: function cycle() {
        var limit = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
        var step = arguments[1];
        getGear(this).cycle(CycleStrategy.create(limit, step));
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
      key: 'forward',
      value: function forward() {
        for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
          parameters[_key] = arguments[_key];
        }

        getGear(this).forward(new Forwarding(parameters));
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        var _this4 = this;

        if (isSomething(callback)) {
          (function () {
            if (!isFunction(callback)) throw errorCallbackNotValid(callback);
            var results = [];
            getGear(_this4).publish(data, function (result) {
              return results.push(result);
            });
            callback(results);
          })();
        } else getGear(this).publish(data, noop);

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
        getGear(this).shuffle(ShuffleStrategy.create(limit));
        return this;
      }
    }, {
      key: 'subscribe',
      value: function subscribe() {
        for (var _len2 = arguments.length, parameters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          parameters[_key2] = arguments[_key2];
        }

        getGear(this).subscribe(new Subscription(parameters));
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

        getGear(this).unsubscribe(new Unsubscription(parameters));
        return this;
      }
    }]);

    return Common;
  }();

  var ChannelBase = function (_Common) {
    _inherits(ChannelBase, _Common);

    function ChannelBase(bus, name, parent) {
      _classCallCheck(this, ChannelBase);

      var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(ChannelBase).call(this));

      objectDefineProperty(_this5, 'name', {
        value: name,
        enumerable: true
      });
      if (isSomething(parent)) objectDefineProperty(_this5, 'parent', {
        value: parent,
        enumerable: true
      });

      var trace = function trace(event) {
        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        return bus.trace.apply(bus, [event, _this5].concat(args));
      };

      setGear(_this5, new ChannelGear(bus, name, parent, trace));
      return _this5;
    }

    _createClass(ChannelBase, [{
      key: 'when',
      value: function when() {
        var gear = getGear(this),
            bus = gear.bus,
            Plan = bus.Plan;

        for (var _len5 = arguments.length, parameters = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          parameters[_key5] = arguments[_key5];
        }

        return new Plan(bus, parameters, [this]);
      }
    }, {
      key: 'bubbles',
      get: function get() {
        return getGear(this).bubbles;
      }
    }, {
      key: 'enabled',
      get: function get() {
        return getGear(this).isEnabled;
      }
    }, {
      key: 'forwarders',
      get: function get() {
        var gear = getGear(this),
            forwarders = gear.forwarders;
        return forwarders ? forwarders.slice() : [];
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
      key: 'strategy',
      get: function get() {
        return getGear(this).strategy;
      }
    }, {
      key: 'subscribers',
      get: function get() {
        var gear = getGear(this),
            subscribers = gear.subscribers;
        return subscribers ? subscribers.filter(isSomething) : [];
      }
    }]);

    return ChannelBase;
  }(Common);

  objectDefineProperty(ChannelBase[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_CHANNEL
  });

  function subclassChannel() {
    return function (_ChannelBase) {
      _inherits(Channel, _ChannelBase);

      function Channel(bus, name, parent) {
        _classCallCheck(this, Channel);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this, bus, name, parent));
      }

      return Channel;
    }(ChannelBase);
  }

  var SectionGear = function () {
    function SectionGear(bus, resolver) {
      _classCallCheck(this, SectionGear);

      this.bus = bus;
      this.resolver = resolver;
    }

    _createClass(SectionGear, [{
      key: 'bubble',
      value: function bubble(value) {
        this.each(function (channel) {
          return channel.bubble(value);
        });
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.each(function (channel) {
          return channel.clear();
        });
      }
    }, {
      key: 'cycle',
      value: function cycle(strategy) {
        this.each(function (channel) {
          return channel.cycle(strategy);
        });
      }
    }, {
      key: 'each',
      value: function each(callback) {
        var channels = this.resolver();

        for (var i = -1, l = channels.length; ++i < l;) {
          callback(getGear(channels[i]));
        }
      }
    }, {
      key: 'enable',
      value: function enable() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        this.each(function (channel) {
          return channel.enable(value);
        });
      }
    }, {
      key: 'forward',
      value: function forward(forwarding) {
        this.each(function (channel) {
          return channel.forward(forwarding);
        });
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        this.each(function (channel) {
          return channel.publish(data, callback);
        });
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.each(function (channel) {
          return channel.reset();
        });
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        this.each(function (channel) {
          return channel.retain(limit);
        });
      }
    }, {
      key: 'shuffle',
      value: function shuffle(strategy) {
        this.each(function (channel) {
          return channel.shuffle(strategy);
        });
      }
    }, {
      key: 'subscribe',
      value: function subscribe(subscription) {
        this.each(function (channel) {
          return channel.subscribe(subscription);
        });
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.each(function (channel) {
          return channel.toggle();
        });
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(unsubscription) {
        this.each(function (channel) {
          return channel.unsubscribe(unsubscription);
        });
      }
    }]);

    return SectionGear;
  }();

  var SectionBase = function (_Common2) {
    _inherits(SectionBase, _Common2);

    function SectionBase(bus, resolver) {
      _classCallCheck(this, SectionBase);

      var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(SectionBase).call(this));

      setGear(_this7, new SectionGear(bus, resolver));
      return _this7;
    }

    _createClass(SectionBase, [{
      key: 'when',
      value: function when(parameters) {
        var gear = getGear(this),
            bus = gear.bus,
            When = bus.When;
        return new When(bus, parameters, gear.channels);
      }
    }, {
      key: 'channels',
      get: function get() {
        return [].concat(_toConsumableArray(getGear(this).resolver()));
      }
    }]);

    return SectionBase;
  }(Common);

  objectDefineProperty(SectionBase[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_SECTION
  });

  function subclassSection() {
    return function (_SectionBase) {
      _inherits(Section, _SectionBase);

      function Section(bus, binder) {
        _classCallCheck(this, Section);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this, bus, binder));
      }

      return Section;
    }(SectionBase);
  }

  var MessageBase = function MessageBase(data, id, route) {
    _classCallCheck(this, MessageBase);

    objectDefineProperties(this, {
      data: {
        value: data,
        enumerable: true
      },
      destination: {
        value: route[0],
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

  objectDefineProperties(MessageBase[PROTOTYPE], (_objectDefineProperti = {}, _defineProperty(_objectDefineProperti, CLASS, {
    value: CLASS_AEROBUS_MESSAGE
  }), _defineProperty(_objectDefineProperti, 'cancel', {
    value: objectCreate(null)
  }), _objectDefineProperti));

  function subclassMessage() {
    return function (_MessageBase) {
      _inherits(Message, _MessageBase);

      function Message(data, id, route) {
        _classCallCheck(this, Message);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this, data, id, route));
      }

      return Message;
    }(MessageBase);
  }

  var Replay = function () {
    function Replay() {
      _classCallCheck(this, Replay);

      this.recordings = [];
    }

    _createClass(Replay, [{
      key: 'bubble',
      value: function bubble(value) {
        this.recordings.push(['bubble', value]);
      }
    }, {
      key: 'clear',
      value: function clear() {
        this.recordings.push(['clear']);
      }
    }, {
      key: 'enable',
      value: function enable() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        this.recordings.push(['enable', value]);
      }
    }, {
      key: 'forward',
      value: function forward(forwarding) {
        this.recordings.push(['forward', forwarding]);
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        this.recordings.push(['publish', data, callback]);
      }
    }, {
      key: 'replay',
      value: function replay(targets) {
        var recordings = this.recordings;

        for (var i = -1, l = recordings.length; ++i < l;) {
          var _recordings$i = _toArray(recordings[i]);

          var method = _recordings$i[0];

          var parameters = _recordings$i.slice(1);

          for (var j = -1, m = targets.length; ++j < m;) {
            var _getGear;

            (_getGear = getGear(targets[j]))[method].apply(_getGear, _toConsumableArray(parameters));
          }
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.recordings.push(['reset']);
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        this.recordings.push(['retain', limit]);
      }
    }, {
      key: 'subscribe',
      value: function subscribe(subscription) {
        this.recordings.push(['subscribe', subscription]);
      }
    }, {
      key: 'toggle',
      value: function toggle() {
        this.recordings.push(['toggle']);
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(unsubscription) {
        this.recordings.push(['unsubscribe', unsubscription]);
      }
    }, {
      key: 'cycle',
      value: function cycle(strategy) {
        this.recordings.push(['cycle', strategy]);
      }
    }, {
      key: 'shuffle',
      value: function shuffle(strategy) {
        this.recordings.push(['shuffle', strategy]);
      }
    }]);

    return Replay;
  }();

  var PlanGear = function (_Replay) {
    _inherits(PlanGear, _Replay);

    function PlanGear(bus, parameters, targets) {
      _classCallCheck(this, PlanGear);

      var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlanGear).call(this));

      _this10.condition = truthy;
      _this10.observables = [];
      _this10.targets = targets;

      for (var i = -1, l = parameters.length; ++i < l;) {
        var _parameter = parameters[i];

        switch (classOf(_parameter)) {
          case CLASS_FUNCTION:
            _this10.condition = _parameter;
            break;

          case CLASS_STRING:
            _this10.observables.push(_parameter);

            break;

          default:
            throw errorArgumentNotValid(_parameter);
        }
      }

      switch (_this10.observables.length) {
        case 0:
          throw errorObservableNotValid();

        case 1:
          _this10.observer = {
            done: noop,
            next: function next(message) {
              if (_this10.condition(message)) _this10.replay(_this10.targets);
            }
          };
          break;

        default:
          _this10.counters = new Map();
          _this10.observer = {
            done: noop,
            next: function next(message) {
              if (!_this10.condition(message)) return;
              var counters = _this10.counters,
                  destination = message.destination,
                  counter = counters.get(destination) || 0,
                  observables = _this10.observables;
              counters.set(destination, counter + 1);
              if (counters.size < observables.length) return;

              for (var i = -1, l = observables.length; ++i < l;) {
                var name = observables[i].name;
                counter = counters.get(name) - 1;
                if (counter) counters.set(name, counter);else counters.delete(name);
              }

              _this10.replay(_this10.targets);
            }
          };
          break;
      }

      for (var i = -1, l = _this10.observables.length; ++i < l;) {
        var observable = getGear(bus.get(_this10.observables[i]));
        observable.observe(_this10.observer);
        _this10.observables[i] = observable;
      }

      return _this10;
    }

    _createClass(PlanGear, [{
      key: 'done',
      value: function done() {
        for (var i = this.observables.length; i--;) {
          this.observables[i].unobserve(this.observer);
        }
      }
    }]);

    return PlanGear;
  }(Replay);

  var PlanBase = function (_Common3) {
    _inherits(PlanBase, _Common3);

    function PlanBase(bus, parameters, targets) {
      _classCallCheck(this, PlanBase);

      var _this11 = _possibleConstructorReturn(this, Object.getPrototypeOf(PlanBase).call(this));

      setGear(_this11, new PlanGear(bus, parameters, targets));
      return _this11;
    }

    _createClass(PlanBase, [{
      key: 'done',
      value: function done() {
        getGear(this).done();
        return this;
      }
    }, {
      key: 'condition',
      get: function get() {
        return getGear(this).condition;
      }
    }, {
      key: 'sources',
      get: function get() {
        return [].concat(_toConsumableArray(getGear(this).sources));
      }
    }, {
      key: 'targets',
      get: function get() {
        return [].concat(_toConsumableArray(getGear(this).targets));
      }
    }]);

    return PlanBase;
  }(Common);

  objectDefineProperty(PlanBase[PROTOTYPE], CLASS, {
    value: CLASS_AEROBUS_PLAN
  });

  function subclassPlan() {
    return function (_PlanBase) {
      _inherits(Plan, _PlanBase);

      function Plan(bus, parameters, target) {
        _classCallCheck(this, Plan);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Plan).call(this, bus, parameters, target));
      }

      return Plan;
    }(PlanBase);
  }

  var BusGear = function () {
    function BusGear(config) {
      _classCallCheck(this, BusGear);

      this.bubbles = config.bubbles;
      this.channels = new Map();
      this.delimiter = config.delimiter;
      this.error = config.error;
      this.id = 0;
      this.trace = config.trace;
      this.Channel = subclassChannel();
      extend(this.Channel[PROTOTYPE], config.channel);
      this.Message = subclassMessage();
      extend(this.Message[PROTOTYPE], config.message);
      this.Plan = subclassPlan();
      extend(this.Plan[PROTOTYPE], config.plan);
      this.Section = subclassSection();
      extend(this.Section[PROTOTYPE], config.section);
    }

    _createClass(BusGear, [{
      key: 'bubble',
      value: function bubble(value) {
        value = !!value;
        this.trace('bubble', value);
        this.bubbles = value;
      }
    }, {
      key: 'clear',
      value: function clear() {
        var channels = this.channels;
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = channels.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var channel = _step2.value;
            setGear(channel.clear(), null);
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

        channels.clear();
        this.patterns = [];
      }
    }, {
      key: 'get',
      value: function get(name) {
        var channels = this.channels,
            channel = channels.get(name);
        if (channel) return channel;
        var Channel = this.Channel;

        if (name === '') {
          channel = new Channel(this, name);
          channels.set(name, channel);
          return channel;
        }

        var parent = channels.get(''),
            delimiter = this.delimiter,
            parts = name.split(this.delimiter);

        if (!parent) {
          parent = new Channel(this, '');
          channels.set('', parent);
        }

        name = '';

        for (var i = -1, l = parts.length; ++i < l;) {
          name = name ? name + delimiter + parts[i] : parts[i];
          channel = channels.get(name);

          if (!channel) {
            channel = new Channel(this, name, parent);
            channels.set(name, channel);
          }

          parent = channel;
        }

        return channel;
      }
    }, {
      key: 'resolve',
      value: function resolve(names) {
        var arity = names.length;
        if (!arity) return this.get('');

        if (arity === 1) {
          var name = names[0];
          if (classOf(name) === CLASS_STRING) return this.get(name);
        }

        var Section = this.Section,
            channels = undefined,
            resolved = [];

        for (var i = -1, l = names.length; ++i < l;) {
          var name = names[i];

          switch (classOf(name)) {
            case CLASS_REGEXP:
              if (!channels) channels = Array.from(this.channels.values());

              for (var j = -1, m = channels.length; ++j < m;) {
                var channel = channels[j];
                if (name.test(channel.name)) resolved.push(channel);
              }

              break;

            case CLASS_STRING:
              resolved.push(this.get(name));
              break;

            default:
              throw errorNameNotValid(name);
          }
        }

        return new Section(this, function () {
          return resolved;
        });
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(unsubscription) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.channels.values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var channel = _step3.value;
            getGear(channel).unsubscribe(unsubscription);
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }]);

    return BusGear;
  }();

  var Config = function () {
    function Config(options) {
      _classCallCheck(this, Config);

      this.bubbles = true;
      this.channel = {};
      this.delimiter = '.';

      this.error = function (error) {
        throw error;
      };

      this.message = {};
      this.plan = {};
      this.section = {};
      this.trace = noop;
      this.bus = {};

      for (var i = -1, l = options.length; ++i < l;) {
        var option = options[i];

        switch (classOf(option)) {
          case CLASS_BOOLEAN:
            this.bubbles = option;
            break;

          case CLASS_FUNCTION:
            this.error = option;
            break;

          case CLASS_OBJECT:
            var bubbles = option.bubbles;
            var bus = option.bus;
            var channel = option.channel;
            var delimiter = option.delimiter;
            var error = option.error;
            var message = option.message;
            var plan = option.plan;
            var section = option.section;
            var trace = option.trace;
            if (isSomething(bubbles)) this.bubbles = !!bubbles;
            if (isSomething(delimiter)) if (isString(delimiter) && delimiter.length) this.delimiter = delimiter;else throw errorDelimiterNotValid(delimiter);
            if (isSomething(error)) if (isFunction(error)) this.error = error;else throw errorErrorNotValid(error);
            if (isSomething(trace)) if (isFunction(trace)) this.trace = trace;else throw errorTraceNotValid(trace);
            if (isSomething(channel)) if (isObject(channel)) objectAssign(this.channel, channel);else throw errorChannelExtensionNotValid(channel);
            if (isSomething(message)) if (isObject(message)) objectAssign(this.message, message);else throw errorMessageExtensionNotValid(message);
            if (isSomething(plan)) if (isObject(plan)) objectAssign(this.plan, plan);else throw errorPlanExtensionNotValid(plan);
            if (isSomething(section)) if (isObject(section)) objectAssign(this.section, section);else throw errorSectionExtensionNotValid(section);
            if (isSomething(bus)) if (isObject(bus)) objectAssign(this.bus, bus);else throw errorAerobusExtensionNotValid(bus);
            break;

          case CLASS_STRING:
            if (option.length) this.delimiter = option;else throw errorDelimiterNotValid(option);
            break;

          default:
            throw errorArgumentNotValid(option);
        }
      }

      objectDefineProperties(this, {
        bubbles: {
          value: this.bubbles
        },
        channel: {
          value: objectFreeze(this.channel)
        },
        delimiter: {
          value: this.delimiter
        },
        error: {
          value: this.error
        },
        message: {
          value: objectFreeze(this.message)
        },
        plan: {
          value: objectFreeze(this.plan)
        },
        section: {
          value: objectFreeze(this.section)
        },
        trace: {
          value: this.trace
        }
      });
      extend(this, this.bus);
    }

    _createClass(Config, [{
      key: 'override',
      value: function override(options) {
        var overriden = objectCreate(this);

        for (var i = -1, l = options.length; ++i < l;) {
          var option = options[i];

          switch (classOf(option)) {
            case CLASS_BOOLEAN:
              overriden.bubbles = option;
              break;

            case CLASS_FUNCTION:
              overriden.error = option;
              break;

            case CLASS_OBJECT:
              objectAssign(overriden, option);
              break;

            case CLASS_STRING:
              if (option.length) overriden.delimiter = option;else throw errorDelimiterNotValid(option);
              break;

            default:
              throw errorArgumentNotValid(option);
          }
        }

        return overriden;
      }
    }]);

    return Config;
  }();

  function aerobus() {
    var _objectDefineProperti2;

    for (var _len6 = arguments.length, options = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
      options[_key6] = arguments[_key6];
    }

    var config = new Config(options);
    setGear(bus, new BusGear(config));
    objectDefineProperties(bus, (_objectDefineProperti2 = {}, _defineProperty(_objectDefineProperti2, CLASS, {
      value: CLASS_AEROBUS
    }), _defineProperty(_objectDefineProperti2, 'bubble', {
      value: bubble
    }), _defineProperty(_objectDefineProperti2, 'bubbles', {
      get: getBubbles
    }), _defineProperty(_objectDefineProperti2, 'clear', {
      value: clear
    }), _defineProperty(_objectDefineProperti2, 'config', {
      value: config
    }), _defineProperty(_objectDefineProperti2, 'create', {
      value: create
    }), _defineProperty(_objectDefineProperti2, 'channels', {
      get: getChannels
    }), _defineProperty(_objectDefineProperti2, 'delimiter', {
      get: getDelimiter
    }), _defineProperty(_objectDefineProperti2, 'error', {
      get: getError
    }), _defineProperty(_objectDefineProperti2, 'root', {
      get: getRoot
    }), _defineProperty(_objectDefineProperti2, 'trace', {
      get: getTrace,
      set: setTrace
    }), _defineProperty(_objectDefineProperti2, 'unsubscribe', {
      value: unsubscribe
    }), _objectDefineProperti2));
    return extend(bus, config.bus);

    function bus() {
      for (var _len7 = arguments.length, names = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        names[_key7] = arguments[_key7];
      }

      return getGear(bus).resolve(names);
    }

    function bubble() {
      var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
      getGear(bus).bubble(value);
      return bus;
    }

    function clear() {
      getGear(bus).clear();
      return bus;
    }

    function create() {
      for (var _len8 = arguments.length, overrides = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        overrides[_key8] = arguments[_key8];
      }

      return aerobus(config.override(overrides));
    }

    function getBubbles() {
      return getGear(bus).bubbles;
    }

    function getChannels() {
      return Array.from(getGear(bus).channels.values());
    }

    function getDelimiter() {
      return getGear(bus).delimiter;
    }

    function getError() {
      return getGear(bus).error;
    }

    function getRoot() {
      return getGear(bus).get('');
    }

    function getTrace() {
      return getGear(bus).trace;
    }

    function setTrace(value) {
      if (!isFunction(value)) throw errorTraceNotValid(value);
      getGear(bus).trace = value;
    }

    function unsubscribe() {
      for (var _len9 = arguments.length, parameters = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        parameters[_key9] = arguments[_key9];
      }

      getGear(bus).unsubscribe(new Unsubscription(parameters));
      return bus;
    }
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});
