// creates message class
'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./symbols", "./utilities"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./symbols"), require("./utilities"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.symbols, global.utilities);
    global.Message = mod.exports;
  }
})(this, function (exports, _symbols, _utilities) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _ObjectKeys = Object.keys;

  function use(message, argument) {
    var channel = message[_symbols.CHANNEL],
        headers = message[_symbols.HEADERS],
        data = message[_symbols.DATA],
        error = message[_symbols.ERROR];

    if ((0, _utilities.isChannel)(argument)) {
      if ((0, _utilities.isUndefined)(channel)) channel = argument.name;
      return;
    }

    if ((0, _utilities.isFunction)(argument)) data = argument();else if ((0, _utilities.isError)(argument)) error = argument;else if ((0, _utilities.isMessage)(argument)) {
      if ((0, _utilities.isUndefined)(channel)) channel = argument.channel;
      data = argument.data;
      error = argument.error;

      _ObjectKeys(argument.headers).forEach(function (key) {
        headers[key] = argument.headers[key];
      });

      return;
    }
    if (!((0, _utilities.isPublication)(argument) || (0, _utilities.isSubscription)(argument))) data = argument;
  }

  var Message = function Message() {
    _classCallCheck(this, Message);

    this[_symbols.DATA] = new Map();
    this[_symbols.CHANNEL] = new Map();
    this[_symbols.HEADERS] = new Map();

    for (var _len = arguments.length, items = Array(_len), _key = 0; _key < _len; _key++) {
      items[_key] = arguments[_key];
    }

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var item = _step.value;
        use(this, item);
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
  };

  exports.default = Message;
});
