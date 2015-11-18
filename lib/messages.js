// error messages
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
    global.messages = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var MESSAGE_ARGUMENTS = exports.MESSAGE_ARGUMENTS = 'Unexpected number of arguments.',
      MESSAGE_CALLBACK = exports.MESSAGE_CALLBACK = 'Callback expected to be a function.',
      MESSAGE_CHANNEL = exports.MESSAGE_CHANNEL = 'Channel must be instance of channel class.',
      MESSAGE_CONDITION = exports.MESSAGE_CONDITION = 'Condition must be channel name or date or function or interval.',
      MESSAGE_COUNT = exports.MESSAGE_COUNT = 'Count must be positive number.',
      MESSAGE_DELIMITER = exports.MESSAGE_DELIMITER = 'Delimiter expected to be a string.',
      MESSAGE_DISPOSED = exports.MESSAGE_DISPOSED = 'This object has been disposed.',
      MESSAGE_FORBIDDEN = exports.MESSAGE_FORBIDDEN = 'Operation is forbidden.',
      MESSAGE_INTERVAL = exports.MESSAGE_INTERVAL = 'Interval must be positive number.',
      MESSAGE_NAME = exports.MESSAGE_NAME = 'Name expected to be string.',
      MESSAGE_OPERATION = exports.MESSAGE_OPERATION = 'Operation must be instance of publication or subscription class.',
      MESSAGE_STRATEGY = exports.MESSAGE_STRATEGY = 'Strategy name must be one of the following: "cyclically", "randomly", "simultaneously".',
      MESSAGE_SUBSCRIBER = exports.MESSAGE_SUBSCRIBER = 'Subscriber must be function.',
      MESSAGE_TRACE = exports.MESSAGE_TRACE = 'Trace expected to be a function.';
});
