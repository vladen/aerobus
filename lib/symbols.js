'use strict';

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
    global.symbols = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var BUS = exports.BUS = Symbol('bus'),
      CALLBACKS = exports.CALLBACKS = Symbol('callbacks'),
      CHANNEL = exports.CHANNEL = Symbol('channel'),
      CHANNELS = exports.CHANNELS = Symbol('channels'),
      CONFIGURABLE = exports.CONFIGURABLE = Symbol('configurable'),
      DATA = exports.DATA = Symbol('data'),
      DELIMITER = exports.DELIMITER = Symbol('delimeter'),
      DISPOSABLE = exports.DISPOSABLE = Symbol('disposable'),
      DISPOSED = exports.DISPOSED = Symbol('disposed'),
      ENABLED = exports.ENABLED = Symbol('enabled'),
      ENABLERS = exports.ENABLERS = Symbol('enablers'),
      ENSURED = exports.ENSURED = Symbol('ensured'),
      ERROR = exports.ERROR = Symbol('error'),
      HEADERS = exports.HEADERS = Symbol('headers'),
      INDEXES = exports.INDEXES = Symbol('indexes'),
      NAME = exports.NAME = Symbol('name'),
      PARENT = exports.PARENT = Symbol('parent'),
      PUBLICATIONS = exports.PUBLICATIONS = Symbol('publications'),
      RETAINING = exports.RETAINING = Symbol('retaining'),
      RETENTIONS = exports.RETENTIONS = Symbol('retentions'),
      SLOTS = exports.SLOTS = Symbol('slots'),
      STRATEGY = exports.STRATEGY = Symbol('strategy'),
      TRACE = exports.TRACE = Symbol('trace'),
      TRIGGERS = exports.TRIGGERS = Symbol('triggers'),
      SUBSCRIBERS = exports.SUBSCRIBERS = Symbol('subscribers'),
      SUBSCRIPTIONS = exports.SUBSCRIPTIONS = Symbol('subscriptions'),
      TAG = exports.TAG = Symbol.toStringTag;
});
