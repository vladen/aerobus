'use strict';

const DEFAULT_DELIMITER = '.', DEFAULT_ERROR = 'error', DEFAULT_ROOT = 'root';
const arrayFrom = Array.from, ObjectKeys = Object.keys, classof = Object.classof, defineProperties = Object.defineProperties;

//error message
const
  MESSAGE_ARGUMENTS = 'Unexpected number of arguments.'
, MESSAGE_COUNT = 'Count must be positive number.'
, MESSAGE_DELIMITER = 'Delimiter expected to be a string.'
, MESSAGE_DISPOSED = 'This object has been disposed.'
, MESSAGE_FORBIDDEN = 'Operation is forbidden.'
, MESSAGE_NAME = 'Name expected to be string.'
, MESSAGE_TRACE = 'Trace expected to be a function.';

//Symbols
const 
  BUS = Symbol('bus')
, CHANNEL = Symbol('channel')
, CHANNELS = Symbol('channels')
, CONFIGURABLE = Symbol('configurable')
, DATA = Symbol('data')
, DELIMITER = Symbol('delimeter')
, ENABLED = Symbol('enabled')
, ERROR = Symbol('error')
, HEADERS = Symbol('headers')
, NAME = Symbol('name')
, PARENT = Symbol('parent')
, RETAINING = Symbol('retaining')
, RETENTIONS = Symbol('retentions')
, STRATEGY = Symbol('strategy')
, TRACE = Symbol('trace')
, SUBSCRIBERS = Symbol('subscribers')
, SUBSCRIPTIONS = Symbol('subscriptions')
, EXTENTIONS = Symbol('extentions')
, TAG = Symbol.toStringTag




function buildChannelClass(base) {
  return class Channel extends base {
    constructor(bus, name, parent) {
      super();

      this[STRATEGY] = strategies.cyclically();
      this[RETAINING] = 0;
      this[RETENTIONS] = []
      this[SUBSCRIBERS] = [];
      this[BUS] = bus;
      this[NAME] = name;
      this[PARENT] = parent;
      this[ENABLED] = true;
      this[TAG] = 'Channel';

      bus.trace('create', this);
    }
    clear() {
      this[BUS].trace('clear', this);
      this[STRATEGY] = strategies.cyclically();
      this[RETAINING] = 0;
      this[ENABLED] = true;c
      this[RETENTIONS] = [];
      this[SUBSCRIBERS] = [];
    }
    get name() {
      return this[NAME];
    }
    // returns parent object of this activity
    get parent() {
      return this[PARENT];
    } 
    get retaining() {
      return this[RETAINING];
    } 
    get subscribers() {
      return this[SUBSCRIBERS];
    }
    get retentions() {
      return this[RETENTIONS];
    }
    publish(data, strategy) {    
      if (isUndefined(data)) throw new Error(MESSAGE_ARGUMENTS);
      let parent = this[PARENT];
      if (this[NAME] !== DEFAULT_ERROR && parent) parent.publish(data); 
      this.trigger(data);   
      if (isDefined(strategy)) this[STRATEGY] = strategies[strategy]();
      if (!this[SUBSCRIBERS].length) return this;
      let subscribers = this[STRATEGY](this[SUBSCRIBERS]);     
      subscribers.forEach((subscriber) => subscriber(data));    
      return this;
    }
    // activates or deactivates retaining of publications for this channel
    // when count is true this channel will retain 9e9 lastest publications
    // when count is a number this channel will retain corresponding number of lastest publications
    // when count is false or 0 this channel will not retain publications
    // all retained publications are authomatically delivered to all new subscriptions to this channel
    retain(count) {
      let retentions = this[RETENTIONS];
      if (!arguments.length || count === true) this[RETAINING] = 9e9;
      else if (!count) {
        this[RETAINING] = 0;
        retentions = undefined;
      } else {
        validateCount(count);
        this[RETAINING] = count;
        if (retentions) retentions.splice(0, retentions.length - count);
      }
      this[BUS].trace('retain', this);
      return this;
    }  
    // creates subscription to this channel
    // every subscriber must be a function
    subscribe(...subscribers) {
      if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
      this[SUBSCRIBERS].push(...subscribers);
      if (this[RETAINING]) {
        this[RETENTIONS].forEach((retention) => 
          subscribers.forEach((subscriber) => subscriber(retention))
        );
      }
      return this;
    }
    // unsubscribes all subscribers from all subscriptions to this channel
    unsubscribe(...subscribers) {
      if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
      subscribers.forEach((subscriber) => {
        let index = this[SUBSCRIBERS].indexOf(subscriber);
        if (index !== -1) this[SUBSCRIBERS].splice(index, 1);
      });
      return this;
    }
    dispose() {
      this[BUS].trace('dispose', this);
      this[STRATEGY] = this[RETAINING] = this[RETENTIONS] = this[SUBSCRIBERS] = 
      this[BUS] = this[NAME] = this[PARENT] = this[ENABLED] = this[TAG] = undefined;
    }
    trigger(message) {
      let name = this[NAME]
        , parent = this[PARENT]
        , retaining = this[RETAINING]
        , retentions = this[RETENTIONS]
      if (retaining) {
        if (retentions) retentions.push(message);
        else retentions = [message];
        if (retaining < retentions.length) retentions.shift();
      }
    }
    get isEnabled() {
      return this[ENABLED] && (!this[PARENT] || this[PARENT].isEnabled);
    } 
    // disables this activity
    disable() {
      validateDisposable(this);
      if (this[ENABLED]) {
        this[BUS].trace('disable', this);
        this[ENABLED] = false;
      }
      return this;
    }  
    // enables this activity
    enable(enable = true) {
      if (!enable) return this.disable();     
      validateDisposable(this);
      if (!this[ENABLED]) {
        this[BUS].trace('enable', this);
        this[ENABLED] = true;
      }
      return this;
    }
  }
}

function buildSectionClass(base) {
  return class Section extends base {
    constructor(bus, channels) {  
      super();

      this[BUS] = bus;
      this[CHANNELS] = channels;
      this[TAG] = 'Section';
      bus.trace('create', this);
    }
    get channels(){
      return this[CHANNELS];
    }
    disable() {
      for (let channel of this[CHANNELS].values()) channel.disable();
      return this;
    }
    enable(value) {
      for (let channel of this[CHANNELS].values()) channel.enable(value);
      return this;
    } 
    // creates new publication to all this[CHANNELS] in this domain
    publish(data) {    
      for (let channel of this[CHANNELS].values()) channel.publish(data);
      return this;
    }
    // creates subscription to all this[CHANNELS] in this domain
    // every subscriber must be a function
    subscribe(...subscribers) {    
      for (let channel of this[CHANNELS].values()) channel.subscribe(...subscribers);
      return this;
    }
    // unsubscribes all subscribers from all this[CHANNELS] in this domain
    unsubscribe(...subscribers) {
      for (let channel of this[CHANNELS].values()) channel.unsubscribe(...subscribers);
      return this;
    }
    clear() {
      for (let channel of this[CHANNELS].values()) channel.clear();
      return this;
    }
  }
}

let strategies = {
  cyclically: function() {
    let index = -1;
    return function(items) {
      return [items[++index % items.length]];
    }
  },
  randomly: function() {
    return function(items) {
      return [items[Math.floor(items.length * Math.random())]];
    }
  },
  simultaneously: function() {
    return function(items) {
      return items;
    }
  }
}

// type checkers
export const isArray = (value) => classof(value) === 'Array'
           , isError = (value) => classof(value) === 'Error'
           , isNumber = (value) => classof(value) === 'Number'
           , isString = (value) => classof(value) === 'String'
           , isChannel = (value) => classof(value) === 'Channel'
           , isSection = (value) => classof(value) === 'Section'
           , isFunction = (value) => classof(value) === 'Function'
           , isDefined = (value) => value !== undefined
           , isUndefined = (value) => value === undefined;

// utility functions
function noop() {}

// arguments validators
export function validateCount(value) {
  if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
}
export function validateDisposable(value) {
  if (value.isDisposed) throw new Error(MESSAGE_DISPOSED);
}

class Aerobus {
  constructor(extentions, delimiter, trace, bus) {
    if (!isString(delimiter)) throw new Error(MESSAGE_DELIMITER);
    if (!isFunction(trace)) throw new TypeError(MESSAGE_TRACE);
    this[CHANNELS] = new Map;
    this[DELIMITER] = delimiter;
    this[TRACE] = trace;
    this[CONFIGURABLE] = true;
    this[BUS] = BUS;
    this[EXTENTIONS] = extentions;
  }
  // returns array of all existing channels
  get channels() {
    return arrayFrom(this[CHANNELS].values());
  }
  // returns delimiter string
  get delimiter() {
    return this[DELIMITER];
  }
  // returns error channel
  get error() {
    return this.get(DEFAULT_ERROR);
  }
  // returns root channel
  get root() {
    return this.get(DEFAULT_ROOT);
  }
  // returns trace function
  get trace() {
    return this[TRACE];
  }
  // sets delimiter string if this object is configurable
  // otherwise throws error
  set delimiter(value) {
    if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
    if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
    this[DELIMITER] = value;
  }
  // sets trace function if this object is configurable
  // otherwise throws error
  set trace(value) {
    if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
    if (!isFunction(value)) throw new TypeError(MESSAGE_TRACE);
    this[TRACE] = value;
  }
  // disposes and deleted all channels
  // this object becomes configurable
  clear() {
    this.trace('clear', this[BUS]);
    let channels = this[CHANNELS];
    for (let channel of channels.values()) channel.dispose();
    channels.clear();
    this[CONFIGURABLE] = true;
  }
  // returns existing or new channel
  get(name) {   
    let channels = this[CHANNELS]
      , channel = channels.get(name);
    if (!channel) {
      let parent;
      if (name !== DEFAULT_ROOT && name !== DEFAULT_ERROR) {
          if (!isString(name)) throw new TypeError(MESSAGE_NAME);
          let index = name.indexOf(this[DELIMITER]);
          parent = this.get(-1 === index ? DEFAULT_ROOT : name.substr(0, index));
      }
      let extention = this[EXTENTIONS].get('Channel') || noop;
      let extentionChannel = buildChannelClass(extention);     
      channel = new extentionChannel(this, name, parent);
      this[CONFIGURABLE] = false;
      channels.set(name, channel);
    }
    return channel;
  }
  // unsubscribes all specified subscribes from all channels of this bus
  unsubscribe(...subscribers) {
    for (let channel of this[CHANNELS].values()) channel.unsubscribe(...subscribers);
    return this[BUS];
  }
}

function aerobus(delimiter = DEFAULT_DELIMITER, trace = noop) {
  if (isFunction(delimiter)) {
    trace = delimiter;
    delimiter = DEFAULT_DELIMITER;
  }
  let context = new Aerobus(this[EXTENTIONS], delimiter, trace);
  return Object.defineProperties(bus, {
    clear: {value: clear},
    create: {value: aerobus},
    channels: {get: getChannels},
    delimiter: {get: getDelimiter, set: setDelimiter},
    error: {get: getError},
    root: {get: getRoot},
    trace: {get: getTrace, set: setTrace},
    unsubscribe: {value: unsubscribe}
  });
  function bus(...channels) {
    switch (channels.length) {
      case 0:
        return context.get(DEFAULT_ROOT);
      case 1:
        return isArray(channels[0])
          ? bus(...channels[0])
          : context.get(channels[0]);
      default:
        let extention = context[EXTENTIONS].get('Section') || noop;
        let extentionSection = buildSectionClass(extention);
        return new extentionSection(context, channels.map(channel => context.get(channel)));
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
  function unsubscribe(...subscribers) {
    context.unsubscribe(...subscribers);
    return bus;
  }
}

aerobus[EXTENTIONS] = new Map;

function patchAerobus(href) {
  let self = href;
  let patchedbus = href.bind(self);
  patchedbus.extend = (name, parameters) => extend.call(self, name, parameters)
  return patchedbus;
};

function extend(name, parameters) {
  let patch = aerobus;  
  patch[EXTENTIONS] = new Map;
  for(let key of this[EXTENTIONS].keys()) path[EXTENTIONS].set(key, this[EXTENTIONS].get(key));
  let extention = patch[EXTENTIONS].get(name) || noop;
  Object.assign(extention.prototype, parameters);
  patch[EXTENTIONS].set(name, extention);
  return patchAerobus(patch);
};

export default patchAerobus(aerobus);
