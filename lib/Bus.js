'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = aerobus;

var _Section = require('./Section');

var _Section2 = _interopRequireDefault(_Section);

var _Channel = require('./Channel');

var _Channel2 = _interopRequireDefault(_Channel);

var _messages = require('./messages');

var _utilities = require('./utilities');

var _symbols = require('./symbols');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULT_DELIMITER = '.',
    ERROR = 'error',
    ROOT = 'root';
var arrayFrom = require('core-js/library/fn/array/from');

var Aerobus = (function () {
  function Aerobus(delimiter, trace, bus) {
    _classCallCheck(this, Aerobus);

    if (!(0, _utilities.isString)(delimiter)) throw new Error(_messages.MESSAGE_DELIMITER);
    if (!(0, _utilities.isFunction)(trace)) throw new TypeError(_messages.MESSAGE_TRACE);
    this[_symbols.CHANNELS] = new Map();
    this[_symbols.DELIMITER] = delimiter;
    this[_symbols.TRACE] = trace;
    this[_symbols.CONFIGURABLE] = true;
    this[_symbols.BUS] = _symbols.BUS;
  }
  // returns array of all existing channels

  _createClass(Aerobus, [{
    key: 'clear',

    // disposes and deleted all channels
    // this object becomes configurable
    value: function clear() {
      this.trace('clear', this[_symbols.BUS]);
      var channels = this[_symbols.CHANNELS];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = channels.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var channel = _step.value;
          channel.dispose();
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
      this[_symbols.CONFIGURABLE] = true;
    }
    // returns existing or new channel

  }, {
    key: 'get',
    value: function get(name) {
      var channels = this[_symbols.CHANNELS],
          channel = channels.get(name);
      if (!channel) {
        var parent = undefined;
        if (name !== ROOT && name !== ERROR) {
          if (!(0, _utilities.isString)(name)) throw new TypeError(_messages.MESSAGE_NAME);
          var index = name.indexOf(this[_symbols.DELIMITER]);
          parent = this.get(-1 === index ? ROOT : name.substr(0, index));
        }
        channel = new _Channel2.default(this, name, parent);
        this[_symbols.CONFIGURABLE] = false;
        channels.set(name, channel);
      }
      return channel;
    }
    // unsubscribes all specified subscribes from all channels of this bus

  }, {
    key: 'unsubscribe',
    value: function unsubscribe() {
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this[_symbols.CHANNELS].values()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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

      return this[_symbols.BUS];
    }
  }, {
    key: 'channels',
    get: function get() {
      return arrayFrom(this[_symbols.CHANNELS].values());
    }
    // returns delimiter string

  }, {
    key: 'delimiter',
    get: function get() {
      return this[_symbols.DELIMITER];
    }
    // returns error channel
    ,

    // sets delimiter string if this object is configurable
    // otherwise throws error
    set: function set(value) {
      if (!this[_symbols.CONFIGURABLE]) throw new Error(_messages.MESSAGE_FORBIDDEN);
      if (!(0, _utilities.isString)(value)) throw new Error(_messages.MESSAGE_DELIMITER);
      this[_symbols.DELIMITER] = value;
    }
    // sets trace function if this object is configurable
    // otherwise throws error

  }, {
    key: 'error',
    get: function get() {
      return this.get(ERROR);
    }
    // returns root channel

  }, {
    key: 'root',
    get: function get() {
      return this.get(ROOT);
    }
    // returns trace function

  }, {
    key: 'trace',
    get: function get() {
      return this[_symbols.TRACE];
    },
    set: function set(value) {
      if (!this[_symbols.CONFIGURABLE]) throw new Error(_messages.MESSAGE_FORBIDDEN);
      if (!(0, _utilities.isFunction)(value)) throw new TypeError(_messages.MESSAGE_TRACE);
      this[_symbols.TRACE] = value;
    }
  }]);

  return Aerobus;
})();

function aerobus() {
  var delimiter = arguments.length <= 0 || arguments[0] === undefined ? DEFAULT_DELIMITER : arguments[0];
  var trace = arguments.length <= 1 || arguments[1] === undefined ? _utilities.noop : arguments[1];

  if ((0, _utilities.isFunction)(delimiter)) {
    trace = delimiter;
    delimiter = DEFAULT_DELIMITER;
  }
  var context = new Aerobus(delimiter, trace);
  return Object.defineProperties(bus, {
    clear: { value: clear },
    create: { value: aerobus },
    channels: { get: getChannels },
    delimiter: { get: getDelimiter, set: setDelimiter },
    error: { get: getError },
    root: { get: getRoot },
    trace: { get: getTrace, set: setTrace },
    unsubscribe: { value: unsubscribe }
  });
  function bus() {
    for (var _len = arguments.length, channels = Array(_len), _key = 0; _key < _len; _key++) {
      channels[_key] = arguments[_key];
    }

    switch (channels.length) {
      case 0:
        return context.get(ROOT);
      case 1:
        return (0, _utilities.isArray)(channels[0]) ? bus.apply(undefined, _toConsumableArray(channels[0])) : context.get(channels[0]);
      default:
        return new _Section2.default(context, channels.map(function (channel) {
          return context.get(channel);
        }));
    }
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
