'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.aerobus = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.validateCount = validateCount;
  exports.validateDisposable = validateDisposable;

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

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && ((typeof call === 'undefined' ? 'undefined' : _typeof(call)) === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
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

  var DEFAULT_DELIMITER = '.',
      DEFAULT_ERROR = 'error',
      DEFAULT_ROOT = 'root';
  var arrayFrom = Array.from,
      ObjectKeys = Object.keys,
      classof = Object.classof,
      defineProperties = Object.defineProperties;
  var MESSAGE_ARGUMENTS = 'Unexpected number of arguments.',
      MESSAGE_COUNT = 'Count must be positive number.',
      MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
      MESSAGE_DISPOSED = 'This object has been disposed.',
      MESSAGE_FORBIDDEN = 'Operation is forbidden.',
      MESSAGE_NAME = 'Name expected to be string.',
      MESSAGE_TRACE = 'Trace expected to be a function.';
  var BUS = Symbol('bus'),
      CHANNEL = Symbol('channel'),
      CHANNELS = Symbol('channels'),
      CHANNELCLASS = Symbol('channelClass'),
      CONFIGURABLE = Symbol('configurable'),
      DATA = Symbol('data'),
      DELIMITER = Symbol('delimeter'),
      ENABLED = Symbol('enabled'),
      ERROR = Symbol('error'),
      EXTENTIONS = Symbol('extentons'),
      HEADERS = Symbol('headers'),
      MESSAGECLASS = Symbol('messageclass'),
      NAME = Symbol('name'),
      PARENT = Symbol('parent'),
      RETAINING = Symbol('retaining'),
      RETENTIONS = Symbol('retentions'),
      STRATEGY = Symbol('strategy'),
      SECTIONCLASS = Symbol('sectionClass'),
      SUBSCRIBERS = Symbol('subscribers'),
      SUBSCRIPTIONS = Symbol('subscriptions'),
      TAG = Symbol.toStringTag,
      TRACE = Symbol('trace');

  function buildChannelClass(base) {
    return (function (_base) {
      _inherits(Channel, _base);

      function Channel(bus, name, parent, messageClass) {
        _classCallCheck(this, Channel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this));

        _this[STRATEGY] = strategies.cyclically();
        _this[RETAINING] = 0;
        _this[RETENTIONS] = [];
        _this[SUBSCRIBERS] = [];
        _this[BUS] = bus;
        _this[NAME] = name;
        _this[PARENT] = parent;
        _this[ENABLED] = true;
        _this[TAG] = 'Channel';
        _this[MESSAGECLASS] = messageClass;
        bus.trace('create', _this);
        return _this;
      }

      _createClass(Channel, [{
        key: 'clear',
        value: function clear() {
          this[BUS].trace('clear', this);
          this[STRATEGY] = strategies.cyclically();
          this[RETAINING] = 0;
          this[ENABLED] = true;
          c;
          this[RETENTIONS] = [];
          this[SUBSCRIBERS] = [];
        }
      }, {
        key: 'publish',
        value: function publish(data, strategy) {
          if (isUndefined(data)) throw new Error(MESSAGE_ARGUMENTS);
          var parent = this[PARENT];
          if (this[NAME] !== DEFAULT_ERROR && parent) parent.publish(data);
          this.trigger(data);
          if (isDefined(strategy)) this[STRATEGY] = strategies[strategy]();
          if (!this[SUBSCRIBERS].length) return this;
          var subscribers = this[STRATEGY](this[SUBSCRIBERS]);
          subscribers.forEach(function (subscriber) {
            return subscriber(data);
          });
          return this;
        }
      }, {
        key: 'retain',
        value: function retain(count) {
          var retentions = this[RETENTIONS];
          if (!arguments.length || count === true) this[RETAINING] = 9e9;else if (!count) {
            this[RETAINING] = 0;
            retentions = undefined;
          } else {
            validateCount(count);
            this[RETAINING] = count;
            if (retentions) retentions.splice(0, retentions.length - count);
          }
          this[BUS].trace('retain', this);
          return this;
        }
      }, {
        key: 'subscribe',
        value: function subscribe() {
          var _SUBSCRIBERS;

          for (var _len = arguments.length, subscribers = Array(_len), _key = 0; _key < _len; _key++) {
            subscribers[_key] = arguments[_key];
          }

          if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);

          (_SUBSCRIBERS = this[SUBSCRIBERS]).push.apply(_SUBSCRIBERS, subscribers);

          if (this[RETAINING]) {
            this[RETENTIONS].forEach(function (retention) {
              return subscribers.forEach(function (subscriber) {
                return subscriber(retention);
              });
            });
          }

          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          var _this2 = this;

          for (var _len2 = arguments.length, subscribers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            subscribers[_key2] = arguments[_key2];
          }

          if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
          subscribers.forEach(function (subscriber) {
            var index = _this2[SUBSCRIBERS].indexOf(subscriber);

            if (index !== -1) _this2[SUBSCRIBERS].splice(index, 1);
          });
          return this;
        }
      }, {
        key: 'dispose',
        value: function dispose() {
          this[BUS].trace('dispose', this);
          this[STRATEGY] = this[RETAINING] = this[RETENTIONS] = this[SUBSCRIBERS] = this[BUS] = this[NAME] = this[PARENT] = this[ENABLED] = this[TAG] = undefined;
        }
      }, {
        key: 'trigger',
        value: function trigger(message) {
          var name = this[NAME],
              parent = this[PARENT],
              retaining = this[RETAINING],
              retentions = this[RETENTIONS];

          if (retaining) {
            if (retentions) retentions.push(message);else retentions = [message];
            if (retaining < retentions.length) retentions.shift();
          }
        }
      }, {
        key: 'disable',
        value: function disable() {
          validateDisposable(this);

          if (this[ENABLED]) {
            this[BUS].trace('disable', this);
            this[ENABLED] = false;
          }

          return this;
        }
      }, {
        key: 'enable',
        value: function enable() {
          var _enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

          if (!_enable) return this.disable();
          validateDisposable(this);

          if (!this[ENABLED]) {
            this[BUS].trace('enable', this);
            this[ENABLED] = true;
          }

          return this;
        }
      }, {
        key: Symbol.iterator,
        value: function value() {
          var _this3 = this;

          var _done = false,
              messages = [],
              rejects = [],
              resolves = [],
              subscription = function subscription(message) {
            if (resolves.length) resolves.shift()(message);else messages.push(message);
          };

          this.subscribe(subscription);
          return {
            done: function done() {
              if (_done) return;
              _done = true;

              _this3.unsubscribe(subscription);

              rejects.forEach(function (reject) {
                return reject();
              });
              rejects.length = resolves.length = messages.length = 0;
            },
            next: function next() {
              return _done ? {
                done: true
              } : {
                value: messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
                  rejects.push(reject);
                  resolves.push(resolve);
                })
              };
            }
          };
        }
      }, {
        key: 'name',
        get: function get() {
          return this[NAME];
        }
      }, {
        key: 'parent',
        get: function get() {
          return this[PARENT];
        }
      }, {
        key: 'retaining',
        get: function get() {
          return this[RETAINING];
        }
      }, {
        key: 'subscribers',
        get: function get() {
          return this[SUBSCRIBERS];
        }
      }, {
        key: 'retentions',
        get: function get() {
          return this[RETENTIONS];
        }
      }, {
        key: 'isEnabled',
        get: function get() {
          return this[ENABLED] && (!this[PARENT] || this[PARENT].isEnabled);
        }
      }]);

      return Channel;
    })(base);
  }

  function buildSectionClass(base) {
    return (function (_base2) {
      _inherits(Section, _base2);

      function Section(bus, channels) {
        _classCallCheck(this, Section);

        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Section).call(this));

        _this4[BUS] = bus;
        _this4[CHANNELS] = channels;
        _this4[TAG] = 'Section';
        bus.trace('create', _this4);
        return _this4;
      }

      _createClass(Section, [{
        key: 'disable',
        value: function disable() {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this[CHANNELS].values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var channel = _step.value;
              channel.disable();
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

          return this;
        }
      }, {
        key: 'enable',
        value: function enable(value) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this[CHANNELS].values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var channel = _step2.value;
              channel.enable(value);
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

          return this;
        }
      }, {
        key: 'publish',
        value: function publish(data) {
          var _iteratorNormalCompletion3 = true;
          var _didIteratorError3 = false;
          var _iteratorError3 = undefined;

          try {
            for (var _iterator3 = this[CHANNELS].values()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
              var channel = _step3.value;
              channel.publish(data);
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

          return this;
        }
      }, {
        key: 'subscribe',
        value: function subscribe() {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = this[CHANNELS].values()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var channel = _step4.value;
              channel.subscribe.apply(channel, arguments);
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }

          return this;
        }
      }, {
        key: 'unsubscribe',
        value: function unsubscribe() {
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = this[CHANNELS].values()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var channel = _step5.value;
              channel.unsubscribe.apply(channel, arguments);
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }

          return this;
        }
      }, {
        key: 'clear',
        value: function clear() {
          var _iteratorNormalCompletion6 = true;
          var _didIteratorError6 = false;
          var _iteratorError6 = undefined;

          try {
            for (var _iterator6 = this[CHANNELS].values()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
              var channel = _step6.value;
              channel.clear();
            }
          } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion6 && _iterator6.return) {
                _iterator6.return();
              }
            } finally {
              if (_didIteratorError6) {
                throw _iteratorError6;
              }
            }
          }

          return this;
        }
      }, {
        key: Symbol.iterator,
        value: function value() {
          var _this5 = this;

          var _done2 = false,
              messages = [],
              rejects = [],
              resolves = [],
              subscription = function subscription(message) {
            if (resolves.length) resolves.shift()(message);else messages.push(message);
          };

          this.subscribe(subscription);
          return {
            done: function done() {
              if (_done2) return;
              _done2 = true;

              _this5.unsubscribe(subscription);

              rejects.forEach(function (reject) {
                return reject();
              });
              rejects.length = resolves.length = messages.length = 0;
            },
            next: function next() {
              return _done2 ? {
                done: true
              } : {
                value: messages.length ? Promise.resolve(messages.shift()) : new Promise(function (resolve, reject) {
                  rejects.push(reject);
                  resolves.push(resolve);
                })
              };
            }
          };
        }
      }, {
        key: 'channels',
        get: function get() {
          return this[CHANNELS];
        }
      }]);

      return Section;
    })(base);
  }

  function buildMessageClass(base) {
    return (function (_base3) {
      _inherits(Message, _base3);

      function Message() {
        _classCallCheck(this, Message);

        var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(Message).call(this));

        _this6[DATA] = new Map();
        _this6[CHANNEL] = new Map();
        _this6[HEADERS] = new Map();
        _this6[TAG] = 'Message';

        for (var _len3 = arguments.length, items = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          items[_key3] = arguments[_key3];
        }

        items.forEach(function (item) {
          return use(_this6, item);
        });
        return _this6;
      }

      return Message;
    })(base);

    function use(message, argument) {
      var channel = message[CHANNEL],
          headers = message[HEADERS],
          data = message[DATA],
          error = message[ERROR];

      if (isChannel(argument)) {
        if (isUndefined(channel)) channel = argument.name;
        return;
      }

      if (isFunction(argument)) data = argument();else if (isError(argument)) error = argument;else if (isMessage(argument)) {
        if (isUndefined(channel)) channel = argument.channel;
        data = argument.data;
        error = argument.error;

        _ObjectKeys(argument.headers).forEach(function (key) {
          headers[key] = argument.headers[key];
        });

        return;
      } else data = argument;
    }
  }

  var strategies = {
    cyclically: function cyclically() {
      var index = -1;
      return function (items) {
        return [items[++index % items.length]];
      };
    },
    randomly: function randomly() {
      return function (items) {
        return [items[Math.floor(items.length * Math.random())]];
      };
    },
    simultaneously: function simultaneously() {
      return function (items) {
        return items;
      };
    }
  };

  var isArray = exports.isArray = function isArray(value) {
    return classof(value) === 'Array';
  },
      isError = exports.isError = function isError(value) {
    return classof(value) === 'Error';
  },
      isNumber = exports.isNumber = function isNumber(value) {
    return classof(value) === 'Number';
  },
      isString = exports.isString = function isString(value) {
    return classof(value) === 'String';
  },
      isChannel = exports.isChannel = function isChannel(value) {
    return classof(value) === 'Channel';
  },
      isSection = exports.isSection = function isSection(value) {
    return classof(value) === 'Section';
  },
      isMessage = exports.isMessage = function isMessage(value) {
    return classof(value) === 'Message';
  },
      isFunction = exports.isFunction = function isFunction(value) {
    return classof(value) === 'Function';
  },
      isDefined = exports.isDefined = function isDefined(value) {
    return value !== undefined;
  },
      isUndefined = exports.isUndefined = function isUndefined(value) {
    return value === undefined;
  };

  function noop() {}

  function validateCount(value) {
    if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
  }

  function validateDisposable(value) {
    if (value.isDisposed) throw new Error(MESSAGE_DISPOSED);
  }

  var Aerobus = (function () {
    function Aerobus(channelCLass, sectionClass, messageClass, delimiter, trace, bus) {
      _classCallCheck(this, Aerobus);

      if (!isString(delimiter)) throw new Error(MESSAGE_DELIMITER);
      if (!isFunction(trace)) throw new TypeError(MESSAGE_TRACE);
      this[CHANNELS] = new Map();
      this[DELIMITER] = delimiter;
      this[TRACE] = trace;
      this[CONFIGURABLE] = true;
      this[BUS] = BUS;
      this[CHANNELCLASS] = channelCLass;
      this[SECTIONCLASS] = sectionClass;
      this[MESSAGECLASS] = messageClass;
    }

    _createClass(Aerobus, [{
      key: 'bus',
      value: (function (_bus) {
        function bus() {
          return _bus.apply(this, arguments);
        }

        bus.toString = function () {
          return _bus.toString();
        };

        return bus;
      })(function () {
        var _this7 = this;

        for (var _len4 = arguments.length, channels = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          channels[_key4] = arguments[_key4];
        }

        switch (channels.length) {
          case 0:
            return this.get(DEFAULT_ROOT);

          case 1:
            return isArray(channels[0]) ? bus.apply(undefined, _toConsumableArray(channels[0])) : this.get(channels[0]);

          default:
            return new this[SECTIONCLASS](this, channels.map(function (channel) {
              return _this7.get(channel);
            }));
        }
      })
    }, {
      key: 'clear',
      value: function clear() {
        this.trace('clear', this[BUS]);
        var channels = this[CHANNELS];
        var _iteratorNormalCompletion7 = true;
        var _didIteratorError7 = false;
        var _iteratorError7 = undefined;

        try {
          for (var _iterator7 = channels.values()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var channel = _step7.value;
            channel.dispose();
          }
        } catch (err) {
          _didIteratorError7 = true;
          _iteratorError7 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
              _iterator7.return();
            }
          } finally {
            if (_didIteratorError7) {
              throw _iteratorError7;
            }
          }
        }

        channels.clear();
        this[CONFIGURABLE] = true;
      }
    }, {
      key: 'get',
      value: function get(name) {
        var channels = this[CHANNELS],
            channel = channels.get(name);

        if (!channel) {
          var parent = undefined;

          if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
            if (!isString(name)) throw new TypeError(MESSAGE_NAME);
            var index = name.indexOf(this[DELIMITER]);
            parent = this.get(-1 === index ? DEFAULT_ROOT : name.substr(0, index));
          }

          channel = new this[CHANNELCLASS](this, name, parent, this[MESSAGECLASS]);
          this[CONFIGURABLE] = false;
          channels.set(name, channel);
        }

        return channel;
      }
    }, {
      key: 'unsubscribe',
      value: function unsubscribe() {
        var _iteratorNormalCompletion8 = true;
        var _didIteratorError8 = false;
        var _iteratorError8 = undefined;

        try {
          for (var _iterator8 = this[CHANNELS].values()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var channel = _step8.value;
            channel.unsubscribe.apply(channel, arguments);
          }
        } catch (err) {
          _didIteratorError8 = true;
          _iteratorError8 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
              _iterator8.return();
            }
          } finally {
            if (_didIteratorError8) {
              throw _iteratorError8;
            }
          }
        }

        return this[BUS];
      }
    }, {
      key: 'channels',
      get: function get() {
        return arrayFrom(this[CHANNELS].values());
      }
    }, {
      key: 'delimiter',
      get: function get() {
        return this[DELIMITER];
      },
      set: function set(value) {
        if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
        if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
        this[DELIMITER] = value;
      }
    }, {
      key: 'error',
      get: function get() {
        return this.get(DEFAULT_ERROR);
      }
    }, {
      key: 'root',
      get: function get() {
        return this.get(DEFAULT_ROOT);
      }
    }, {
      key: 'trace',
      get: function get() {
        return this[TRACE];
      },
      set: function set(value) {
        if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
        if (!isFunction(value)) throw new TypeError(MESSAGE_TRACE);
        this[TRACE] = value;
      }
    }]);

    return Aerobus;
  })();

  function aerobus() {
    var delimiter = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_DELIMITER : arguments[0];
    var trace = arguments.length <= 1 || arguments[1] === undefined ? noop : arguments[1];

    if (isFunction(delimiter)) {
      trace = delimiter;
      delimiter = DEFAULT_DELIMITER;
    }

    var channelExtention = this[EXTENTIONS].get('Channel') || noop,
        sectionExtention = this[EXTENTIONS].get('Section') || noop,
        messageExtention = this[EXTENTIONS].get('Message') || noop,
        channelClass = buildChannelClass(channelExtention),
        sectionClass = buildSectionClass(sectionExtention),
        messageClass = buildMessageClass(messageExtention);
    var context = new Aerobus(channelClass, sectionClass, messageClass, delimiter, trace);
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
      return context.bus.apply(context, arguments);
    }

    function clear() {
      context.clear();
      return bus;
    }

    function getChannels() {
      return context.channels;
    }

    function getDelimiter() {
      return context.delimiter;
    }

    function getError() {
      return context.error;
    }

    function getRoot() {
      return context.root;
    }

    function getTrace() {
      return context.trace;
    }

    function setDelimiter(value) {
      context.delimiter = value;
    }

    function setTrace(value) {
      context.trace = value;
    }

    function unsubscribe() {
      context.unsubscribe.apply(context, arguments);
      return bus;
    }
  }

  aerobus[EXTENTIONS] = new Map();

  function patchAerobus(href) {
    var self = href;
    var patchedbus = href.bind(self);

    patchedbus.extend = function (name, parameters) {
      return extend.call(self, name, parameters);
    };

    return patchedbus;
  }

  ;

  function extend(name, parameters) {
    var patch = aerobus;
    patch[EXTENTIONS] = new Map();
    var _iteratorNormalCompletion9 = true;
    var _didIteratorError9 = false;
    var _iteratorError9 = undefined;

    try {
      for (var _iterator9 = this[EXTENTIONS].keys()[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
        var key = _step9.value;
        path[EXTENTIONS].set(key, this[EXTENTIONS].get(key));
      }
    } catch (err) {
      _didIteratorError9 = true;
      _iteratorError9 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion9 && _iterator9.return) {
          _iterator9.return();
        }
      } finally {
        if (_didIteratorError9) {
          throw _iteratorError9;
        }
      }
    }

    var extention = patch[EXTENTIONS].get(name) || noop;
    Object.assign(extention.prototype, parameters);
    patch[EXTENTIONS].set(name, extention);
    return patchAerobus(patch);
  }

  ;
  exports.default = patchAerobus(aerobus);
});
