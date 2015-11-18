// creates channel class
'use strict';

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./Activity", "./strategies", "./validators", "./messages", "./utilities", "./symbols"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./Activity"), require("./strategies"), require("./validators"), require("./messages"), require("./utilities"), require("./symbols"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.Activity, global.strategies, global.validators, global.messages, global.utilities, global.symbols);
    global.Channel = mod.exports;
  }
})(this, function (exports, _Activity2, _strategies, _validators, _messages, _utilities, _symbols) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _Activity3 = _interopRequireDefault(_Activity2);

  var _strategies2 = _interopRequireDefault(_strategies);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
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

    return call && ((typeof call === "undefined" ? "undefined" : _typeof(call)) === "object" || typeof call === "function") ? call : self;
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

  var ROOT = 'root',
      ERROR = 'error',
      defineProperties = Object.defineProperties,
      CHANNEL = 'Channel';

  var Channel = (function (_Activity) {
    _inherits(Channel, _Activity);

    function Channel(bus, name, parent) {
      _classCallCheck(this, Channel);

      var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Channel).call(this, bus, parent));

      _this[_symbols.STRATEGY] = _strategies2.default.cyclically();
      _this[_symbols.RETAINING] = 0;
      _this[_symbols.RETENTIONS] = [];
      _this[_symbols.SUBSCRIBERS] = [];
      _this[_symbols.BUS] = bus;
      _this[_symbols.NAME] = name;
      _this[_symbols.PARENT] = parent;
      _this[_symbols.TAG] = 'Channel';
      bus.trace('create', _this);
      return _this;
    }

    _createClass(Channel, [{
      key: "clear",
      value: function clear() {
        this[_symbols.BUS].trace('clear', this);

        this[_symbols.RETAINING] = undefined;
        this[_symbols.RETENTIONS] = [];
        this[_symbols.SUBSCRIBERS] = [];
      }
    }, {
      key: "publish",
      value: function publish(data, strategy) {
        if ((0, _utilities.isUndefined)(data)) throw new Error(_messages.MESSAGE_ARGUMENTS);
        var parent = this[_symbols.PARENT];
        if (this[_symbols.NAME] !== ERROR && parent) parent.publish(data);
        this.trigger(data);
        if ((0, _utilities.isDefined)(strategy)) this[_symbols.STRATEGY] = _strategies2.default[strategy]();
        if (!this[_symbols.SUBSCRIBERS].length) return this;

        var subscribers = this[_symbols.STRATEGY](this[_symbols.SUBSCRIBERS]);

        subscribers.forEach(function (subscriber) {
          return subscriber(data);
        });
        return this;
      }
    }, {
      key: "retain",
      value: function retain(count) {
        var retentions = this[_symbols.RETENTIONS];
        if (!arguments.length || count === true) this[_symbols.RETAINING] = 9e9;else if (!count) {
          this[_symbols.RETAINING] = 0;
          retentions = undefined;
        } else {
          (0, _validators.validateCount)(count);
          this[_symbols.RETAINING] = count;
          if (retentions) retentions.splice(0, retentions.length - count);
        }

        this[_symbols.BUS].trace('retain', this);

        return this;
      }
    }, {
      key: "subscribe",
      value: function subscribe() {
        var _SUBSCRIBERS;

        for (var _len = arguments.length, subscribers = Array(_len), _key = 0; _key < _len; _key++) {
          subscribers[_key] = arguments[_key];
        }

        if (!subscribers.length) throw new Error(_messages.MESSAGE_ARGUMENTS);

        (_SUBSCRIBERS = this[_symbols.SUBSCRIBERS]).push.apply(_SUBSCRIBERS, subscribers);

        if (this[_symbols.RETAINING]) {
          this[_symbols.RETENTIONS].forEach(function (retention) {
            return subscribers.forEach(function (subscriber) {
              return subscriber(retention);
            });
          });
        }

        return this;
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe() {
        var _this2 = this;

        for (var _len2 = arguments.length, subscribers = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          subscribers[_key2] = arguments[_key2];
        }

        if (!subscribers.length) throw new Error(_messages.MESSAGE_ARGUMENTS);
        subscribers.forEach(function (subscriber) {
          var index = _this2[_symbols.SUBSCRIBERS].indexOf(subscriber);

          if (index !== -1) _this2[_symbols.SUBSCRIBERS].splice(index, 1);
        });
        return this;
      }
    }, {
      key: "dispose",
      value: function dispose() {
        this[_symbols.BUS].trace('dispose', this);

        this[_symbols.RETENTIONS] = this[_symbols.SUBSCRIBERS] = this[_symbols.STRATEGY] = undefined;
      }
    }, {
      key: "trigger",
      value: function trigger(message) {
        var name = this[_symbols.NAME],
            parent = this[_symbols.PARENT],
            retaining = this[_symbols.RETAINING],
            retentions = this[_symbols.RETENTIONS];

        if (retaining) {
          if (retentions) retentions.push(message);else retentions = [message];
          if (retaining < retentions.length) retentions.shift();
        }
      }
    }, {
      key: "name",
      get: function get() {
        return this[_symbols.NAME];
      }
    }, {
      key: "parent",
      get: function get() {
        return this[_symbols.PARENT];
      }
    }, {
      key: "retaining",
      get: function get() {
        return this[_symbols.RETAINING];
      }
    }, {
      key: "subscribers",
      get: function get() {
        return this[_symbols.SUBSCRIBERS];
      }
    }, {
      key: "retentions",
      get: function get() {
        return this[_symbols.RETENTIONS];
      }
    }]);

    return Channel;
  })(_Activity3.default);

  exports.default = Channel;
});
