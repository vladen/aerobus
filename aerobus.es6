/*
  let bus = aerobus(console.log.bind(console));
  ideas:
    dispose channel when it becomes empty
    channel.forward -
      static - accepts channel name 
      dynamic - accepts callback resolving channel name
    channel.zip
      zips publications from several channels and combine them via callback passing as array
      triggers combined publication to self
    buffer, distinct(untilChanged), randomize/reduce/sort until finished, whilst? operators
    subscription/publication strategies: cycle | random | serial | parallel
    delay/debounce/throttle/repeat may accept dynamic intervals (callback)
    subscriptions priority + cancellation via 'return false'
    named subscriptions/publications
    request - reponse pattern on promises
    plugable persistence with expiration
*/

'use strict';

// error messages
const MESSAGE_ARGUMENTS = 'Unexpected number of arguments.',
      MESSAGE_CALLBACK = 'Callback must be function.',
      MESSAGE_CHANNEL = 'Channel must be instance of channel class.',
      MESSAGE_CONDITION = 'Condition must be channel name or date or function or interval.',
      MESSAGE_COUNT = 'Count must be positive number.',
      MESSAGE_DELIMITER = 'Delimiter must be string.',
      MESSAGE_DISPOSED = 'Object has been disposed.',
      MESSAGE_FORBIDDEN = 'Operation is forbidden.',
      MESSAGE_INTERVAL = 'Interval must be positive number.',
      MESSAGE_NAME = 'Name must be string.',
      MESSAGE_OPERATION = 'Operation must be instance of publication or subscription class.',
      MESSAGE_STRATEGY = 'Strategy name must be one of the following: "cyclically", "randomly", "simultaneously".',
      MESSAGE_SUBSCRIBER = 'Subscriber must be function.',
      MESSAGE_TRACE = 'Trace must be function.';

// standard settings
const DELIMITER = '.', ERROR = 'error', ROOT = '';

// continuation flags
const CONTINUE = 0, FINISH = 2, SKIP = 1;

// shared variables
let identities = {};

// shortcuts to native utility methods
const _ArrayMap = Array.prototype.map,
      _ArraySlice = Array.prototype.slice,
      _clearInterval = clearInterval,
      _clearTimeout = clearTimeout,
      _ObjectCreate = Object.create,
      _ObjectDefineProperties = Object.defineProperties,
      _ObjectDefineProperty = Object.defineProperty,
      _ObjectKeys = Object.keys,
      _setImmediate = typeof setImmediate === 'function'
        ? setImmediate
        : typeof process === 'object' && isFunction(process.nextTick)
          ? process.nextTick
          : function(callback) {
            return _setTimeout(callback, 0);
          },
      _setInterval = setInterval,
      _setTimeout = setTimeout;

// invokes handler for each item of collection (array or enumerable object)
// handler can be function or name of item's method
function each(collection, handler) {
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
    //return handler.apply(undefined, [item].concat(parameters));
    return handler(...item, ...parameters);
  }
  function invokeProperty(item) {
    return item[handler].apply(item, parameters);
  }
  function invokeSelf(item) {
    //return item.apply(undefined, parameters);
    return item(...parameters);
  }
  function eachItem() {
    for (let i = 0, l = collection.length; i < l; i++) {
      var item = collection[i];
      //if (isDefined(item) && false === invoker(item)) break;
      if (isDefined(item) && (false === invoker(item))) break;
    }
  }
  function eachKey() {
    for (let key in collection) {
      let item = collection[key];
      //if (isDefined(item) && false === invoker(item)) break;
      if (isDefined(item) && (false === invoker(item))) break;
    }
  }
}

// returns next identity value for specified object by its name or constructor name
function identity(object) {
  let type = isFunction(object) ? object.name : object.constructor.name;
  //return type.toLowerCase() + '_' + (type in identities ? ++identities[type] : (identities[type] = 1));
  return '${type.toLowerCase()} ${(type in identities ? ++identities[type] : (identities[type] = 1))}';
}

// type checkers
function isArray(value) {
  return Array.isArray(value);
}
function isChannel(value) {
  return value instanceof Channel;
}
function isDate(value) {
  return value instanceof Date;
}
function isDefined(value) {
  return value !== undefined;
}
function isError(value) {
  return value instanceof Error;
}
function isFunction(value) {
  return value instanceof Function;
}
function isMessage(value) {
  return value instanceof Message;
}
function isNumber(value) {
  return 'number' === typeof value || value instanceof Number;
}
function isPublication(value) {
  return value instanceof Publication;
}
function isString(value) {
  return 'string' === typeof value || value instanceof String;
}
function isSubscription(value) {
  return value instanceof Subscription;
}
function isUndefined(value) {
  //return value === undefined;
  return !isDefined(value);
}

// utility functions
function noop() {}

// arguments validators
function validateCallback(value) {
  if (!isFunction(value)) throw new Error(MESSAGE_CALLBACK);
}
function validateCount(value) {
  if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
}
function validateDelimiter(value) {
  if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
}
function validateDisposable(value) {
  if (value.isDisposed) throw new Error(MESSAGE_DISPOSED);
}
function validateInterval(value) {
  if (!isNumber(value) || value < 1) throw new Error(MESSAGE_INTERVAL);
}
function validateName(value) {
  if (!isString(value)) throw new Error(MESSAGE_NAME);
}
function validateSubscriber(value) {
  if (!isFunction(value)) throw new Error(MESSAGE_SUBSCRIBER);
}
function validateTrace(value) {
  if (!isFunction(value)) throw new Error(MESSAGE_TRACE);
}
