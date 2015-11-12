'use strict';

let identities = {};

// invokes handler for each item of collection (array or enumerable object)
// handler can be function or name of item's method
export function each(collection, handler) {
  if (collection == null) return;
  let invoker, parameters;
  if (1 === arguments.length) {
    invoker = invokeSelf;
    parameters = [];
  }
  else if (isString(handler)) {
    invoker = invokeProperty;
    parameters = _ArraySlice.call(arguments, 2);
  }
  else if (isFunction(handler)) {
    invoker = invokeHandler;
    parameters = _ArraySlice.call(arguments, 2);
  }
  else {
    invoker = invokeSelf;
    parameters = handler;
  }

  isNumber(collection.length) ? eachItem() : eachKey();
  function invokeHandler(item) {
    return handler(...item, ...parameters);
  }
  function invokeProperty(item) {
    return item[handler].apply(item, parameters);
  }
  function invokeSelf(item) {
    return item(...parameters);
  }
  function eachItem() {
    for (let i = 0, l = collection.length; i < l; i++) {
      let item = collection[i];
      if (isDefined(item) && false === invoker(item)) break;
    }
  }
  function eachKey() {
    for (let key in collection) {
      let item = collection[key];
      if (isDefined(item) && false === invoker(item)) break;
    }
  }
}

// returns next identity value for specified object by its name or constructor name
export function identity(object) {
  let type = isFunction(object) ? object.name : object.constructor.name,
      id = type in identities ? ++identities[type] : (identities[type] = 1);
  return `${type.toLowerCase()}_${id}`;
}

// type checkers
export function isArray(value) {
  return Array.isArray(value);
}
export function isChannel(value) {
  return value instanceof Channel;
}
export function isDate(value) {
  return value instanceof Date;
}
export function isDefined(value) {
  return value !== undefined;
}
export function isError(value) {
  return value instanceof Error;
}
export function isFunction(value) {
  return value instanceof Function;
}
export function isMessage(value) {
  return value instanceof Message;
}
export function isNumber(value) {
  return 'number' === typeof value || value instanceof Number;
}
export function isPublication(value) {
  return value instanceof Publication;
}
export function isString(value) {
  return 'string' === typeof value || value instanceof String;
}
export function isSubscription(value) {
  return value instanceof Subscription;
}
export function isUndefined(value) {
  return value === undefined;
}

// utility functions
export function noop() {}