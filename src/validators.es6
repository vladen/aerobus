// arguments validators
'use strict';

import {isFunction, isNumber, isString} from "helpFunctions";

export function validateCallback(value) {
  if (!isFunction(value)) throw new Error(MESSAGE_CALLBACK);
}
export function validateCount(value) {
  if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
}
export function validateDelimiter(value) {
  if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
}
export function validateDisposable(value) {
  if (value.isDisposed) throw new Error(MESSAGE_DISPOSED);
}
export function validateInterval(value) {
  if (!isNumber(value) || value < 1) throw new Error(MESSAGE_INTERVAL);
}
export function validateName(value) {
  if (!isString(value)) throw new Error(MESSAGE_NAME);
}
export function validateSubscriber(value) {
  if (!isFunction(value)) throw new Error(MESSAGE_SUBSCRIBER);
}
export function validateTrace(value) {
  if (!isFunction(value)) throw new Error(MESSAGE_TRACE);
}