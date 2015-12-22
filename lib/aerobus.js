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
      CLASS_ARRAY = 'Array',
      CLASS_BOOLEAN = 'Boolean',
      CLASS_FUNCTION = 'Function',
      CLASS_NUMBER = 'Number',
      CLASS_OBJECT = 'Object',
      CLASS_STRING = 'String',
      $CLASS = Symbol.toStringTag,
      $ITERATOR = Symbol.iterator,
      $PROTOTYPE = 'prototype',
      maxSafeInteger = Number.MAX_SAFE_INTEGER,
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
      classof = function classof(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
  },
      noop = function noop() {},
      isArray = function isArray(value) {
    return classof(value) === CLASS_ARRAY;
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
      errorArgumentNotValid = function errorArgumentNotValid(value) {
    return new TypeError('Argument of type "' + classof(value) + '" is not expected.');
  },
      errorCallbackNotValid = function errorCallbackNotValid(value) {
    return new TypeError('Callback expected to be a function, not "' + classof(value) + '".');
  },
      errorChannelExtensionNotValid = function errorChannelExtensionNotValid(value) {
    return new TypeError('Channel class extensions expected to be an object, not "' + value + '".');
  },
      errorDelimiterNotValid = function errorDelimiterNotValid(value) {
    return new TypeError('Delimiter expected to be not empty string, not "' + value + '".');
  },
      errorErrorNotValid = function errorErrorNotValid(value) {
    return new TypeError('Error expected to be a function, not "' + classof(value) + '".');
  },
      errorForwarderNotValid = function errorForwarderNotValid() {
    return new TypeError('Forwarder expected to be a function or a string channel name.');
  },
      errorGearNotFound = function errorGearNotFound(value) {
    return new Error('This instance of "' + classof(value) + '"" has been deleted.');
  },
      errorMessageExtensionNotValid = function errorMessageExtensionNotValid(value) {
    return new TypeError('Message class extensions expected to be an object, not "' + value + '".');
  },
      errorNameNotValid = function errorNameNotValid(value) {
    return new TypeError('Name expected to be a string, not "' + classof(value) + '".');
  },
      errorOrderNotValid = function errorOrderNotValid(value) {
    return new TypeError('Order expected to be a number, not "' + classof(value) + '".');
  },
      errorSectionExtensionNotValid = function errorSectionExtensionNotValid(value) {
    return new TypeError('Section class extensions expected to be an object, not "' + value + '".');
  },
      errorSubscriberNotValid = function errorSubscriberNotValid() {
    return new TypeError('Subscriber expected to be a function or an object having "next" and optional "done" methods.');
  },
      errorTraceNotValid = function errorTraceNotValid(value) {
    return new TypeError('Trace expected to be a function, not "' + classof(value) + '".');
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

        var parent = channels.get('');
        if (!parent) channels.set('', parent = new Channel(this, ''));
        var delimiter = this.delimiter,
            parts = name.split(this.delimiter);
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

  var Forwarding = function Forwarding(parameters) {
    _classCallCheck(this, Forwarding);

    var forwarders = [];

    for (var i = -1, l = parameters.length; ++i < l;) {
      var parameter = parameters[i];

      switch (classof(parameter)) {
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
    } else if (classof(base) === CLASS_AEROBUS_SUBSCRIBER) {
      done = base.done;
      next = base.next;
      if (isNothing(name)) name = base.name;
      if (isNothing(order)) order = base.order;
    } else if (isObject(base) && isFunction(base.next)) {
      next = function (_, message) {
        return base.next(message);
      };

      if (isSomething(base.done)) {
        if (!isFunction(base.done)) throw errorSubscriberNotValid(base);

        done = function () {
          return base.done();
        };
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

    var _loop = function _loop() {
      var parameter = parameters[i];

      switch (classof(parameter)) {
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
      _loop();
    }

    if (!builders.length) throw errorSubscriberNotValid();
    objectDefineProperty(this, 'subscribers', {
      value: builders.map(function (builder) {
        return builder();
      })
    });
  };

  objectDefineProperty(Subscription[$PROTOTYPE], $CLASS, {
    value: CLASS_AEROBUS_SUBSCRIPTION
  });

  var IteratorGear = (function () {
    function IteratorGear(channels) {
      var _this2 = this;

      _classCallCheck(this, IteratorGear);

      this.disposed = false;
      this.messages = [];
      this.rejects = [];
      this.resolves = [];
      var dones = 0,
          iterator = {
        done: function done() {
          if (++dones < channels.length) return;
          _this2.disposed = true;

          _this2.rejects.forEach(function (reject) {
            return reject();
          });
        },
        next: function next(message) {
          if (_this2.resolves.length) _this2.resolves.shift()(message);else _this2.messages.push(message);
        }
      };

      this.disposer = function () {
        for (var i = channels.length; i--;) {
          var channel = channels[i],
              collection = channel.iterators,
              iterators = [];
          if (collection) for (var j = collection.length; --j;) {
            var item = collection[j];
            if (item === iterator) collection[j] = null;else iterators.push(item);
          }
          if (iterators.length) channel.iterators = iterators;else delete channel.iterators;
        }
      };

      for (var i = channels.length; i--;) {
        var channel = channels[i],
            iterators = channel.iterators;
        if (iterators) channel.iterators = iterators.concat(iterator);else channel.iterators = [iterator];
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
    function Iterator(channels) {
      _classCallCheck(this, Iterator);

      setGear(this, new IteratorGear(channels));
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
        this.trace('clear');
        var iterators = this.iterators,
            retentions = this.retentions,
            subscribers = this.subscribers;
        if (retentions) retentions.length = 0;

        if (iterators) {
          for (var i = iterators.length; i--;) {
            iterators[i].done();
          }

          delete this.iterators;
        }

        if (subscribers) {
          for (var i = subscribers.length; i--;) {
            try {
              subscribers[i].done();
            } catch (error) {
              this.bus.error(error);
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
      key: 'publish',
      value: function publish(message, respond) {
        var _this4 = this;

        if (!this.isEnabled) return;
        var Message = this.bus.Message,
            skip = false;
        message = classof(message) === CLASS_AEROBUS_MESSAGE ? new Message(message.data, message.id, [this.name].concat(message.route)) : new Message(message, ++this.bus.id, [this.name]);
        this.trace('publish', message);

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
                var result = getGear(this.bus.get(destination)).publish(message, respond);
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
            var result = parent.publish(message, respond);
            if (result === message.cancel) return result;
          }
        }

        var iterators = this.iterators;
        if (iterators) for (var i = -1, l = iterators.length; ++i < l;) {
          var iterator = iterators[i];
          if (iterator) iterator.next(message);
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
            respond(result);
          } catch (error) {
            respond(error);
            setImmediate(function () {
              return _this4.bus.error(error, message);
            });
          }
        }
      }
    }, {
      key: 'reset',
      value: function reset() {
        this.trace('reset');
        var iterators = this.iterators,
            subscribers = this.subscribers;
        this.enabled = true;
        delete this.forwarders;
        delete this.iterators;
        delete this.retentions;
        delete this.strategy;
        delete this.subscribers;
        delete this.subscriptions;
        if (iterators) for (var i = iterators.length; i--;) {
          iterators[i].done();
        }
        if (subscribers) for (var i = subscribers.length; i--;) {
          try {
            subscribers[i].done();
          } catch (error) {
            this.bus.error(error);
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
        var subscribers = subscription.subscribers;
        this.trace('subscribe', subscribers);
        var collection = this.subscribers,
            retentions = this.retentions;
        if (collection) for (var i = -1, l = subscribers.length; ++i < l;) {
          var subscriber = subscribers[i],
              last = collection.length - 1;
          if (collection[last].order <= subscriber.order) collection.push(subscriber);else {
            while (last > 0 && collection[last] > subscriber.order) {
              last--;
            }

            collection.splice(last, 0, subscriber);
          }
          if (retentions) for (var j = -1, m = retentions.length; ++j < m;) {
            var message = retentions[j];

            try {
              subscriber.next(message.data, message);
            } catch (error) {
              this.bus.error(error);
            }
          }
        } else this.subscribers = subscribers.slice();
        if (retentions) for (var i = -1, l = subscribers.length; ++i < l;) {
          var subscriber = subscribers[i];

          for (var j = -1, m = retentions.length; ++j < m;) {
            var retention = retentions[j];

            try {
              subscriber.next(retention.data, retention);
            } catch (error) {
              this.bus.error(error);
            }
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
      key: 'unsubscribe',
      value: function unsubscribe(parameters) {
        this.trace('unsubscribe', parameters);
        var collection = this.subscribers;
        if (!collection) return;

        if (parameters.length) {
          var predicates = [];

          var _loop2 = function _loop2(i) {
            var parameter = parameters[i];

            switch (classof(parameter)) {
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

          for (var i = parameters.length; i--;) {
            _loop2(i);
          }

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
                  this.bus.error(error);
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
              this.bus.error(error);
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

  var ChannelBase = (function () {
    function ChannelBase(bus, name, parent) {
      var _this5 = this;

      _classCallCheck(this, ChannelBase);

      objectDefineProperty(this, 'name', {
        value: name,
        enumerable: true
      });
      if (isSomething(parent)) objectDefineProperty(this, 'parent', {
        value: parent,
        enumerable: true
      });

      var trace = function trace(event) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return bus.trace.apply(bus, [event, _this5].concat(args));
      };

      setGear(this, new ChannelGear(bus, name, parent, trace));
    }

    _createClass(ChannelBase, [{
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
        for (var _len2 = arguments.length, parameters = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          parameters[_key2] = arguments[_key2];
        }

        getGear(this).forward(new Forwarding(parameters));
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        var _this6 = this;

        if (isSomething(callback)) {
          (function () {
            if (!isFunction(callback)) throw errorCallbackNotValid(callback);
            var results = [];
            getGear(_this6).publish(data, function (result) {
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
        for (var _len3 = arguments.length, parameters = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          parameters[_key3] = arguments[_key3];
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
        for (var _len4 = arguments.length, parameters = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          parameters[_key4] = arguments[_key4];
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
  })();

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

  var SectionGear = (function () {
    function SectionGear(channels) {
      _classCallCheck(this, SectionGear);

      this.channels = channels;
    }

    _createClass(SectionGear, [{
      key: 'apply',
      value: function apply(method) {
        var channels = this.channels;

        for (var _len5 = arguments.length, args = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
          args[_key5 - 1] = arguments[_key5];
        }

        for (var i = -1, l = channels.length; ++i < l;) {
          var _getGear;

          (_getGear = getGear(channels[i]))[method].apply(_getGear, args);
        }
      }
    }, {
      key: 'call',
      value: function call(method) {
        var channels = this.channels;

        for (var i = -1, l = channels.length; ++i < l;) {
          getGear(channels[i])[method]();
        }
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
      key: 'bubble',
      value: function bubble() {
        var value = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
        getGear(this).apply('bubble', value);
        return this;
      }
    }, {
      key: 'clear',
      value: function clear() {
        getGear(this).call('clear');
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
      key: 'forward',
      value: function forward() {
        for (var _len6 = arguments.length, parameters = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
          parameters[_key6] = arguments[_key6];
        }

        getGear(this).apply('forward', new Forwarding(parameters));
        return this;
      }
    }, {
      key: 'publish',
      value: function publish(data, callback) {
        var _this9 = this;

        if (isSomething(callback)) {
          (function () {
            if (!isFunction(callback)) throw errorCallbackNotValid(callback);
            var results = [];
            getGear(_this9).apply('publish', data, function (result) {
              return results.push(result);
            });
            callback(results);
          })();
        } else getGear(this).apply('publish', data, noop, noop);

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
        for (var _len7 = arguments.length, parameters = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
          parameters[_key7] = arguments[_key7];
        }

        getGear(this).apply('subscribe', new Subscription(parameters));
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
        for (var _len8 = arguments.length, parameters = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
          parameters[_key8] = arguments[_key8];
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

    for (var _len9 = arguments.length, options = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
      options[_key9] = arguments[_key9];
    }

    for (var i = -1, l = options.length; ++i < l;) {
      var option = options[i];

      switch (classof(option)) {
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
      for (var _len10 = arguments.length, names = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        names[_key10] = arguments[_key10];
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

      for (var _len11 = arguments.length, overrides = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
        overrides[_key11] = arguments[_key11];
      }

      for (var i = -1, l = overrides.length; ++i < l;) {
        var override = overrides[i];

        switch (classof(override)) {
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
      for (var _len12 = arguments.length, parameters = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
        parameters[_key12] = arguments[_key12];
      }

      getGear(bus).unsubscribe(parameters);
      return bus;
    }
  }

  exports.default = aerobus;
  module.exports = exports['default'];
});