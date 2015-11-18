// arguments validators
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateCallback = validateCallback;
exports.validateCount = validateCount;
exports.validateDelimiter = validateDelimiter;
exports.validateDisposable = validateDisposable;
exports.validateInterval = validateInterval;
exports.validateName = validateName;
exports.validateSubscriber = validateSubscriber;
exports.validateTrace = validateTrace;

var _utilities = require("./utilities");

function validateCallback(value) {
  if (!(0, _utilities.isFunction)(value)) throw new Error(MESSAGE_CALLBACK);
}
function validateCount(value) {
  if (!(0, _utilities.isNumber)(value) || value < 1) throw new Error(MESSAGE_COUNT);
}
function validateDelimiter(value) {
  if (!(0, _utilities.isString)(value)) throw new Error(MESSAGE_DELIMITER);
}
function validateDisposable(value) {
  if (value.isDisposed) throw new Error(MESSAGE_DISPOSED);
}
function validateInterval(value) {
  if (!(0, _utilities.isNumber)(value) || value < 1) throw new Error(MESSAGE_INTERVAL);
}
function validateName(value) {
  if (!(0, _utilities.isString)(value)) throw new Error(MESSAGE_NAME);
}
function validateSubscriber(value) {
  if (!(0, _utilities.isFunction)(value)) throw new Error(MESSAGE_SUBSCRIBER);
}
function validateTrace(value) {
  if (!(0, _utilities.isFunction)(value)) throw new Error(MESSAGE_TRACE);
}
