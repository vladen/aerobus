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
      let item = collection[i];
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

//TODO: ADD Aerobus class

// creates new activity class (abstract base for channels, publications and subscriptions)
const DISPOSED = Symbol('disposed'),
      DISPOSERS = Symbol('disposers'),
      ENABLED = Symbol('enabled'),
      ENABLERS = Symbol('enablers'),
      ENSURED = Symbol('ensured'),
      TRIGGERS = Symbol('triggers'),
      BUS = Symbol('bus'),
      PARENT = Symbol('parent');

class Activity {
  constructor(bus, parent){
    this[DISPOSED] = false;
    this[DISPOSERS] = [];
    this[ENABLED] = true;
    this[ENABLERS] = [];
    this[ENSURED] = false;
    this[TRIGGERS] = [];
    this[BUS] = bus;
    this[PARENT] = parent;

    bus.trace('create', this);
  }
  // disables this activity
  disable() {
    validateDisposable(this);
    if (this[ENABLED]) {
      this[BUS].trace('disable', this);
      this[ENABLED] = false;
      notify();
    }
    return this;
  }
  // disposes this activity
  dispose() {
    if (!this[DISPOSED]) {
      this[BUS].trace('dispose', this);
      this[DISPOSED] = true;
      this[ENABLED] = false;
      each(this[DISPOSERS]);
      this[DISPOSERS].length = this[ENABLERS].length = this[TRIGGERS].length = 0;
    }
    return this;
  }
  // enables this activity
  enable() {
    validateDisposable(this);
    if (!this[ENABLED]) {
      this[BUS].trace('enable', this);
      this[ENABLED] = true;
      notify();
    }
    return this;
  }
  ensure() {
    validateDisposable(this);
    if (!this[ENSURED]) {
      this[BUS].trace('ensure', this);
      this[ENSURED] = true;
    }
    return this;
  }
  // returns true if this activity has been disposed 
  get isDisposed() {
      return this[DISPOSED];
  } 
  // returns true if this activity and all its parents are enabled 
  get isEnabled(){
    return this[ENABLED] && (!this[PARENT] || this[PARENT].isEnabled);
  } 
  // returns true if this activity is ensured
  get isEnsured() {
      return this[ENSURED];
  }
  notify() {
    if (!this[ENABLED]) return;
    let parent = this[PARENT],
        enablers = this[ENABLERS];

    if (parent && !parent.isEnabled) parent.onEnable(notify);
    else {
      each(enablers);
      enablers.length = 0;
    }
  }
  // registers callback to be invoked when this activity is being disposed
  // throws error if this activity was alredy disposed
  // callback must be a function
  onDispose(callback) {
    validateCallback(callback);
    if (this[DISPOSED]) callback();
    else this[DISPOSERS].push(callback);
    return this;
  }
  // registers callback to be invoked once when this activity is enabled
  // callback must be a function
  onEnable(callback) {
    validateDisposable(this);
    validateCallback(callback);
    let parent = this[PARENT],
        enablers = this[ENABLERS];
    if (this.isEnabled) callback();
    else {
      if (!enablers.length && parent) parent.onEnable(notify);
      enablers.push(callback);
    }
    return this;
  }
  // registers callback to be invoked when this activity is triggered
  // callback must be a function
  // fix: unstable trigger may fail others
  onTrigger(callback) {
    validateDisposable(this);
    validateCallback(callback);
    this[TRIGGERS].push(callback);
    return this;
  }
  // triggers registered operations on this activity
  trigger(data) {
    let activity = this;
    validateDisposable(activity);
    let message = new Message(data, this),
        enablers = this[ENABLERS];

    this[BUS].trace('trigger', activity, message);
    if (this.isEnabled) initiate();
    else if (message.headers.isEnsured) {
      if (!enablers.length && parent) parent.onEnable(initiate);
      enablers.push(initiate);
    }
    return this;
    function initiate() {
     let index = 1, finishing = false;
     next();
     return activity;
     function next(state) {
        if (activity[DISPOSED]) return;
        if (state & SKIP) index = 0;
        if (state & FINISH) finishing = true;
        if (isMessage(state)) message = state;
        if (index > 0) activity[TRIGGERS][index >= triggers.length ? index = 0 : index++](message, next);
        else if (finishing) dispose();
      }
    }
  }
}

function activity(bus, parent){
  return new Activity(bus, parent);
}