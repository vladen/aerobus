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
      CLASS_AEROBUS_FORWARDING = CLASS_AEROBUS + '.Forwarding',
      CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + '.Iterator',
      CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + '.Message',
      CLASS_AEROBUS_SECTION = CLASS_AEROBUS + '.Section',
      CLASS_AEROBUS_SUBSCRIBER = CLASS_AEROBUS + '.Subscriber',
      CLASS_AEROBUS_SUBSCRIPTION = CLASS_AEROBUS + '.Subscription',
      CLASS_AEROBUS_WHEN = CLASS_AEROBUS + '.When',
      CLASS_AEROBUS_UNSUBSCRIPTION = CLASS_AEROBUS + '.Unsubscription',
      CLASS_ARRAY = 'Array',
      CLASS_BOOLEAN = 'Boolean',
      CLASS_FUNCTION = 'Function',
      CLASS_NUMBER = 'Number',
      CLASS_OBJECT = 'Object',
      CLASS_STRING = 'String',
      $CLASS = Symbol.toStringTag,
      $ITERATOR = Symbol.iterator,
      $PROTOTYPE = 'prototype',
      objectAssign = Object.assign,
      objectCreate = Object.create,
      objectDefineProperties = Object.defineProperties,
      objectDefineProperty = Object.defineProperty,
      objectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor,
      objectGetOwnPropertyNames = Object.getOwnPropertyNames,
      mathFloor = Math.floor,
      mathMax = Math.max,
      mathMin = Math.min,
      mathRandom = Math.random,
      maxSafeInteger = Number.MAX_SAFE_INTEGER,
      isNothing = function isNothing(value) {
    return value == null;
  },
      isSomething = function isSomething(value) {
    return value != null;
  },
      extend = function extend(target, source) {
    if (isNothing(source)) return target;
    var names = objectGetOwnPropertyNames(source);

    for (var i = names.length - 1; i >= 0; i--) {
      var name = names[i];
      if (name in target) continue;
      objectDefineProperty(target, name, objectGetOwnPropertyDescriptor(source, name));
    }

    return target;
  },
      classOf = function classOf(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  },
      classIs = function classIs(className) {
    return function (value) {
      return classOf(value) === className;
    };
  },
      isArray = classIs(CLASS_ARRAY),
      isFunction = classIs(CLASS_FUNCTION),
      isNumber = classIs(CLASS_NUMBER),
      isObject = classIs(CLASS_OBJECT),
      isString = classIs(CLASS_STRING),
      noop = function noop() {},
      errorArgumentNotValid = function errorArgumentNotValid(value) {
    return new TypeError('Argument of type "' + classOf(value) + '" is not expected.');
  },
      errorCallbackNotValid = function errorCallbackNotValid(value) {
    return new TypeError('Callback expected to be a function, not "' + classOf(value) + '".');
  },
      errorChannelExtensionNotValid = function errorChannelExtensionNotValid(value) {
    return new TypeError('Channel class extensions expected to be an object, not "' + value + '".');
  },
      errorDelimiterNotValid = function errorDelimiterNotValid(value) {
    return new TypeError('Delimiter expected to be not empty string, not "' + value + '".');
  },
      errorErrorNotValid = function errorErrorNotValid(value) {
    return new TypeError('Error expected to be a function, not "' + classOf(value) + '".');
  },
      errorForwarderNotValid = function errorForwarderNotValid() {
    return new TypeError('Forwarder expected to be a function or a string channel name.');
  },
      errorGearNotFound = function errorGearNotFound(value) {
    return new Error('This instance of "' + classOf(value) + '"" has been deleted.');
  },
      errorMessageExtensionNotValid = function errorMessageExtensionNotValid(value) {
    return new TypeError('Message class extensions expected to be an object, not "' + value + '".');
  },
      errorNameNotValid = function errorNameNotValid(value) {
    return new TypeError('Name expected to be a string, not "' + classOf(value) + '".');
  },
      errorOrderNotValid = function errorOrderNotValid(value) {
    return new TypeError('Order expected to be a number, not "' + classOf(value) + '".');
  },
      errorSectionExtensionNotValid = function errorSectionExtensionNotValid(value) {
    return new TypeError('Section class extensions expected to be an object, not "' + value + '".');
  },
      errorSubscriberNotValid = function errorSubscriberNotValid() {
    return new TypeError('Subscriber expected to be a function or an object having "next" and optional "done" methods.');
  },
      errorTraceNotValid = function errorTraceNotValid(value) {
    return new TypeError('Trace expected to be a function, not "' + classOf(value) + '".');
  },
      gears = new WeakMap(),
      getGear = function getGear(key) {
    var gear = gears.get(key);
    if (isNothing(gear)) throw errorGearNotFound(key);
    return gear;
  },
      setGear = function setGear(key, gear) {
    if (isSomething(gear)) gears.set(key, gear);else gears.delete(key, gear);
  };

  var BusGear = (function () {
    function BusGear(config) {
      _classCallCheck(this, BusGear);

      this.bubbles = config.bubbles;
      this.channels = new Map();
      this.delimiter = config.delimiter;
      this.error = config.error;
      this.id = 0;
      this.trace = config.trace;
      this.Channel = subclassChannel();
      extend(this.Channel[$PROTOTYPE], config.channel);
      this.Message = subclassMessage();
      extend(this.Message[$PROTOTYPE], config.message);
      this.Section = subclassSection();
      extend(this.Section[$PROTOTYPE], config.section);
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
      }
    }, {
      key: 'get',
      value: function get(name) {
        var channels = this.channels,
            channel = channels.get(name);
        if (channel) return channel;
        if (!isString(name)) throw errorNameNotValid(name);
        var Channel = this.Channel;

        if (name === '') {
          channel = new Channel(this, name);
          channels.set(name, channel);
          return channel;
        }

        var parent = channels.get(''),
            delimiter = this.delimiter,
            parts = name.split(this.delimiter);
        if (!parent) channels.set('', parent = new Channel(this, ''));
        name = '';

        for (var i = -1, l = parts.length; ++i < l;) {
          name = name ? name + delimiter + parts[i] : parts[i];
          channel = channels.get(name);
          if (!channel) channels.set(name, channel = new Channel(this, name, parent));
          parent = channel;
        }

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
            var Section = this.Section,
                channels = names.map(function (name) {
              return _this.get(name);
            });
            return new Section(function () {
              return channels;
            });
        }
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe(unsubscription) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.channels.values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var channel = _step2.value;
            getGear(channel).unsubscribe(unsubscription);
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

  objectDefineProperty(Forwarding[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_FORWARDING
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
      next = function (data, message) {
        return base.next(data, message);
      };

      if (isSomething(base.done)) {
        if (isFunction(base.done)) {
          (function () {
            var disposed = false;

            done = function () {
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

  objectDefineProperty(Subscriber[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_SUBSCRIBER
  });

  var Subscription = function Subscription(parameters) {
    _classCallCheck(this, Subscription);

    var builders = [],
        name = undefined,
        order = undefined;

    var _loop = function _loop(i, l) {
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
      _loop(i, l);
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

  objectDefineProperty(Subscription[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_SUBSCRIPTION
  });

  var Unsubscription = function Unsubscription(parameters) {
    _classCallCheck(this, Unsubscription);

    var predicates = [];

    var _loop2 = function _loop2(i, l) {
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
      _loop2(i, l);
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

  objectDefineProperty(Unsubscription[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_UNSUBSCRIPTION
  });

  var Common = (function () {
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
        var step = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];
        getGear(this).cycle(limit, step);
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
        var _this2 = this;

        if (isSomething(callback)) {
          (function () {
            if (!isFunction(callback)) throw errorCallbackNotValid(callback);
            var results = [];
            getGear(_this2).publish(data, function (result) {
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
        getGear(this).shuffle(limit);
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
  })();

  var IteratorGear = (function () {
    function IteratorGear(observables) {
      var _this3 = this;

      _classCallCheck(this, IteratorGear);

      this.disposed = false;
      this.messages = [];
      this.rejects = [];
      this.resolves = [];
      var count = 0,
          observer = {
        done: function done() {
          if (++count < observables.length) return;
          _this3.disposed = true;

          _this3.rejects.forEach(function (reject) {
            return reject();
          });
        },
        next: function next(message) {
          if (_this3.resolves.length) _this3.resolves.shift()(message);else _this3.messages.push(message);
        }
      };

      this.disposer = function () {
        for (var i = observables.length; i--;) {
          observables[i].unobserve(observer);
        }
      };

      for (var i = observables.length; i--;) {
        observables[i].observe(observer);
      }
    }

    _createClass(IteratorGear, [{
      key: 'done',
      value: function done() {
        if (this.disposed) return;
        this.disposed = true;
        var rejects = this.rejects;

        for (var i = rejects.length; i--;) {
          rejects[i]();
        }

        this.disposer();
      }
    }, {
      key: 'next',
      value: function next() {
        var _this4 = this;

        if (this.disposed) return {
          done: true
        };
        if (this.messages.length) return {
          value: Promise.resolve(this.messages.shift())
        };
        return {
          value: new Promise(function (resolve, reject) {
            _this4.rejects.push(reject);

            _this4.resolves.push(resolve);
          })
        };
      }
    }]);

    return IteratorGear;
  })();

  var Iterator = (function () {
    function Iterator(observables) {
      _classCallCheck(this, Iterator);

      setGear(this, new IteratorGear(observables));
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

  objectDefineProperty(Iterator[$PROTOTYPE], $CLASS, {
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
        var _this5 = this;

        this.trace('clear');
        var observers = this.observers,
            retentions = this.retentions,
            subscribers = this.subscribers;
        if (retentions) retentions.length = 0;

        if (observers) {
          for (var i = observers.length; i--;) {
            observers[i].done();
          }

          delete this.observers;
        }

        if (subscribers) {
          for (var i = subscribers.length; i--;) {
            try {
              subscribers[i].done();
            } catch (error) {
              setImmediate(function () {
                return _this5.bus.error(error);
              });
            }
          }

          delete this.subscribers;
        }
      }
    }, {
      key: 'cycle',
      value: function cycle(limit, step) {
        limit = isNumber(limit) ? limit > 0 ? limit : 0 : limit ? 1 : 0;
        step = isNumber(step) && 0 < step ? step : limit;
        this.trace('cycle', limit, step);
        var index = 0;
        if (!limit) delete this.strategy;else this.strategy = function (subscribers) {
          var length = subscribers.length;
          if (!length) return [];
          var count = mathMin(limit, length),
              i = index,
              selected = Array(count);

          while (count-- > 0) {
            selected[i] = subscribers[i++ % length];
          }

          index += step;
          return selected;
        };
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
        var forwarders = forwarding.forwarders;
        this.trace('forward', forwarders);
        var collection = this.forwarders;
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
        var _this6 = this;

        if (!this.isEnabled) return;
        var Message = this.bus.Message,
            skip = false;
        message = classOf(message) === CLASS_AEROBUS_MESSAGE ? new Message(message.data, message.id, [this.name].concat(message.route)) : new Message(message, ++this.bus.id, [this.name]);
        this.trace('publish', message);
        var observers = this.observers;
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

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = destinations[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var destination = _step3.value;
                var result = getGear(this.bus.get(destination)).publish(message, callback);
                if (result === message.cancel) return result;
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
        if (strategy) subscribers = strategy(subscribers);

        for (var i = -1, l = subscribers.length; ++i < l;) {
          var subscriber = subscribers[i];
          if (subscriber) try {
            var result = subscriber.next(message.data, message);
            if (result === message.cancel) return result;
            callback(result);
          } catch (error) {
            callback(error);
            setImmediate(function () {
              return _this6.bus.error(error, message);
            });
          }
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        var _this7 = this;

        this.trace('reset');
        var observers = this.observers,
            subscribers = this.subscribers;
        this.enabled = true;
        delete this.forwarders;
        delete this.observers;
        delete this.plans;
        delete this.retentions;
        delete this.strategy;
        delete this.subscribers;
        delete this.subscriptions;
        if (observers) for (var i = observers.length; i--;) {
          observers[i].done();
        }
        if (subscribers) for (var i = subscribers.length; i--;) {
          try {
            subscribers[i].done();
          } catch (error) {
            setImmediate(function () {
              return _this7.bus.error(error);
            });
          }
        }
      }
    }, {
      key: 'retain',
      value: function retain(limit) {
        limit = isNumber(limit) ? mathMax(limit, 0) : limit ? maxSafeInteger : 0;
        this.trace('retain', limit);
        var collection = this.retentions;

        if (collection) {
          if (collection.length > limit) collection = this.retentions = collection.slice(collection.length - limit);
          collection.limit = limit;
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
        if (!limit) delete this.strategy;else this.strategy = function (subscribers) {
          var length = subscribers.length;
          if (!length) return [];
          var count = mathMin(limit, length),
              selected = Array(count);

          do {
            var candidate = subscribers[mathFloor(mathRandom() * length)];
            if (!selected.includes(candidate)) selected[--count] = candidate;
          } while (count > 0);

          return selected;
        };
      }
    }, {
      key: 'subscribe',
      value: function subscribe(subscription) {
        var _this8 = this;

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

          var _loop3 = function _loop3(j, m) {
            var retention = retentions[j];

            try {
              subscriber.next(retention.data, retention);
            } catch (error) {
              setImmediate(function () {
                return _this8.bus.error(error, retention);
              });
            }
          };

          for (var j = -1, m = retentions.length; ++j < m;) {
            _loop3(j, m);
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
        var _this9 = this;

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
                    return _this9.bus.error(error);
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
                return _this9.bus.error(error);
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
  })();

  var ChannelBase = (function (_Common) {
    _inherits(ChannelBase, _Common);

    function ChannelBase(bus, name, parent) {
      _classCallCheck(this, ChannelBase);

      var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(ChannelBase).call(this));

      objectDefineProperty(_this10, 'name', {
        value: name,
        enumerable: true
      });
      if (isSomething(parent)) objectDefineProperty(_this10, 'parent', {
        value: parent,
        enumerable: true
      });

      var trace = function trace(event) {
        for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
          args[_key4 - 1] = arguments[_key4];
        }

        return bus.trace.apply(bus, [event, _this10].concat(args));
      };

      setGear(_this10, new ChannelGear(bus, name, parent, trace));
      return _this10;
    }

    _createClass(ChannelBase, [{
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
      key: 'subscribers',
      get: function get() {
        var gear = getGear(this),
            subscribers = gear.subscribers;
        return subscribers ? subscribers.filter(isSomething) : [];
      }
    }]);

    return ChannelBase;
  })(Common);

  objectDefineProperty(ChannelBase[$PROTOTYPE], $CLASS, {
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

  objectDefineProperties(MessageBase[$PROTOTYPE], (_objectDefineProperti = {}, _defineProperty(_objectDefineProperti, $CLASS, {
    value: CLASS_AEROBUS_MESSAGE
  }), _defineProperty(_objectDefineProperti, 'cancel', {
    value: objectCreate(null)
  }), _objectDefineProperti));

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

  var Replay = (function () {
    function Replay(resolver) {
      _classCallCheck(this, Replay);

      this.recordings = [];
      this.resolver = resolver;
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
      value: function replay() {
        var recordings = this.recordings,
            targets = this.resolver();

        for (var i = -1, l = recordings.length; ++i < l;) {
          var _recordings$i = _toArray(recordings[i]);

          var method = _recordings$i[0];

          var parameters = _recordings$i.slice(1);

          for (var j = -1, m = targets.length; ++j < m;) {
            var _targets$j;

            (_targets$j = targets[j])[method].apply(_targets$j, _toConsumableArray(parameters));
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
    }]);

    return Replay;
  })();

  var SectionGear = (function () {
    function SectionGear(resolver) {
      _classCallCheck(this, SectionGear);

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
  })();

  var SectionBase = (function (_Common2) {
    _inherits(SectionBase, _Common2);

    function SectionBase(resolver) {
      _classCallCheck(this, SectionBase);

      var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(SectionBase).call(this));

      setGear(_this13, new SectionGear(resolver));
      return _this13;
    }

    _createClass(SectionBase, [{
      key: $ITERATOR,
      value: function value() {
        return new Iterator(getGear(this).resolver());
      }
    }, {
      key: 'channels',
      get: function get() {
        return [].concat(_toConsumableArray(getGear(this).resolver()));
      }
    }]);

    return SectionBase;
  })(Common);

  objectDefineProperty(SectionBase[$PROTOTYPE], $CLASS, {
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

  var WhenGear = (function (_Replay) {
    _inherits(WhenGear, _Replay);

    function WhenGear(bus, parameters, target) {
      _classCallCheck(this, WhenGear);

      var _this15 = _possibleConstructorReturn(this, Object.getPrototypeOf(WhenGear).call(this, function () {
        return [target];
      }));

      var condition = undefined,
          observables = [],
          observer = {
        next: function next(message) {
          if (_this15.condition(message)) _this15.replay();
        }
      };

      for (var i = -1, l = parameters.length; ++i < l;) {
        var _parameter = parameters[i];

        switch (classOf(_parameter)) {
          case CLASS_FUNCTION:
            condition = _parameter;
            break;

          case CLASS_STRING:
            observables.push(_parameter);
            break;

          default:
            throw errorArgumentNotValid(_parameter);
        }
      }

      for (var i = observables.length - 1; i >= 0; i--) {
        var observable = observables[i];
        observable = observables[i] = bus.get(observable);
        observable.observe(observer);
      }

      _this15.condition = condition || function () {
        return true;
      };

      _this15.observables = observables;
      _this15.observer = observer;
      _this15.target = target;
      return _this15;
    }

    _createClass(WhenGear, [{
      key: 'done',
      value: function done() {
        var observables = this.observables,
            observer = this.observer;

        for (var i = observables.length; i--;) {
          observables[i].unobserve(observer);
        }
      }
    }]);

    return WhenGear;
  })(Replay);

  var WhenBase = (function (_Common3) {
    _inherits(WhenBase, _Common3);

    function WhenBase(bus, parameters, target) {
      _classCallCheck(this, WhenBase);

      var _this16 = _possibleConstructorReturn(this, Object.getPrototypeOf(WhenBase).call(this));

      setGear(_this16, new WhenGear(bus, parameters, target));
      return _this16;
    }

    _createClass(WhenBase, [{
      key: 'done',
      value: function done() {
        getGear(this).done();
        return this;
      }
    }, {
      key: $ITERATOR,
      value: function value() {
        return new Iterator([getGear(this).channel]);
      }
    }, {
      key: 'condition',
      get: function get() {
        return getGear(this).condition;
      }
    }, {
      key: 'observables',
      get: function get() {
        return [].concat(_toConsumableArray(getGear(this).observables));
      }
    }, {
      key: 'target',
      get: function get() {
        return getGear(this).target;
      }
    }]);

    return WhenBase;
  })(Common);

  objectDefineProperty(WhenBase[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_WHEN
  });

  function subclassWhen() {
    return (function (_WhenBase) {
      _inherits(When, _WhenBase);

      function When(bus, parameters, target) {
        _classCallCheck(this, When);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(When).call(this, bus, parameters, target));
      }

      return When;
    })(WhenBase);
  }

  function aerobus() {
    var _objectDefineProperti2;

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

    for (var _len5 = arguments.length, options = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
      options[_key5] = arguments[_key5];
    }

    for (var i = -1, l = options.length; ++i < l;) {
      var option = options[i];

      switch (classOf(option)) {
        case CLASS_BOOLEAN:
          config.bubbles = option;
          break;

        case CLASS_FUNCTION:
          config.error = option;
          break;

        case CLASS_OBJECT:
          var bubbles = option.bubbles;
          var channel = option.channel;
          var delimiter = option.delimiter;
          var error = option.error;
          var message = option.message;
          var section = option.section;
          var trace = option.trace;
          if (isSomething(bubbles)) config.bubbles = !!bubbles;
          if (isSomething(delimiter)) if (isString(delimiter) && delimiter.length) config.delimiter = delimiter;else throw errorDelimiterNotValid(delimiter);
          if (isSomething(error)) if (isFunction(error)) config.error = error;else throw errorErrorNotValid(error);
          if (isSomething(trace)) if (isFunction(trace)) config.trace = trace;else throw errorTraceNotValid(trace);
          if (isSomething(channel)) if (isObject(channel)) objectAssign(config.channel, channel);else throw errorChannelExtensionNotValid(channel);
          if (isSomething(message)) if (isObject(message)) objectAssign(config.message, message);else throw errorMessageExtensionNotValid(message);
          if (isSomething(section)) if (isObject(section)) objectAssign(config.section, section);else throw errorSectionExtensionNotValid(section);
          break;

        case CLASS_STRING:
          if (option.length) config.delimiter = option;else throw errorDelimiterNotValid(option);
          break;

        default:
          throw errorArgumentNotValid(option);
      }
    }

    setGear(bus, new BusGear(config));
    return objectDefineProperties(bus, (_objectDefineProperti2 = {}, _defineProperty(_objectDefineProperti2, $CLASS, {
      value: CLASS_AEROBUS
    }), _defineProperty(_objectDefineProperti2, 'bubble', {
      value: bubble
    }), _defineProperty(_objectDefineProperti2, 'bubbles', {
      get: getBubbles
    }), _defineProperty(_objectDefineProperti2, 'clear', {
      value: clear
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

    function bus() {
      for (var _len6 = arguments.length, names = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
        names[_key6] = arguments[_key6];
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
      var overriden = config;

      for (var _len7 = arguments.length, overrides = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        overrides[_key7] = arguments[_key7];
      }

      for (var i = -1, l = overrides.length; ++i < l;) {
        var override = overrides[i];

        switch (classOf(override)) {
          case CLASS_BOOLEAN:
            overriden.bubbles = override;
            break;

          case CLASS_FUNCTION:
            overriden.error = override;
            break;

          case CLASS_OBJECT:
            objectAssign(overriden, override);
            break;

          case CLASS_STRING:
            if (override.length) overriden.delimiter = override;else throw errorDelimiterNotValid(override);
            break;

          default:
            throw errorArgumentNotValid(override);
        }
      }

      return aerobus(overriden);
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
      for (var _len8 = arguments.length, parameters = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        parameters[_key8] = arguments[_key8];
      }

      getGear(bus).unsubscribe(new Unsubscription(parameters));
      return bus;
    }
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});