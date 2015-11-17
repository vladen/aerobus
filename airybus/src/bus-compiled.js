'use strict';

var register = require("babel-register");

import Domain from 'Domain.es6';
import Channel from 'Channel';

import { MESSAGE_DELIMITER, MESSAGE_FORBIDDEN, MESSAGE_NAME, MESSAGE_TRACE } from 'messages';
import { isArray, isFunction, noop } from 'utilities';
import { CHANNELS, CONFIGURABLE, DELIMITER, DISPOSABLE, TRACE } from 'symbols';

const DEFAULT_DELIMITER = '.',
      DEFAULT_ERROR = 'error',
      DEFAULT_ROOT = '';

class Aerobus {
  constructor(delimiter, trace, bus) {
    if (!isString(delimiter)) throw new Error(MESSAGE_DELIMITER);
    if (!isFunction(trace)) throw new TypeError(MESSAGE_TRACE);
    this[CHANNELS] = new Map();
    this[DELIMITER] = delimiter;
    this[TRACE] = trace;
    this[CONFIGURABLE] = true;
  }
  // returns array of all existing channels
  get channels() {
    return Array.from(this[CHANNELS].values());
  }
  // returns delimiter string
  get delimiter() {
    return this[DELIMITER];
  }
  // returns error channel
  get error() {
    return this.get(ERROR);
  }
  // returns root channel
  get root() {
    return this.get(ROOT);
  }
  // returns trace function
  get trace() {
    return this[TRACE];
  }
  // sets delimiter string if this object is configurable
  // otherwise throws error
  set delimiter(value) {
    if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
    if (!isString(delimiter)) throw new Error(MESSAGE_DELIMITER);
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
    let channels = this[CHANNELS],
        channel = channels.get(name);
    if (!channel) {
      let parent;
      if (name !== ROOT && name !== ERROR) {
        if (!isString(name)) throw new TypeError(MESSAGE_NAME);
        let index = name.indexOf(delimiter);
        parent = this.get(-1 === index ? ROOT : name.substr(0, index));
      }
      channel = new Channel(this, name, parent);
      channel[DISPOSABLE].onDispose(() => channels.delete(name));
      this[CONFIGURABLE] = false;
      channels.set(name, channel);
    }
    return channel;
  }
  // unsubscribes all specified subscribes from all channels of this bus
  unsubscribe(...subscribers) {
    for (let channel of this[CHANNELS].values()) channel.unsubscribe(...subscribers);
  }
}

export default function aerobus(delimiter = DEFAULT_DELIMITER, trace = noop) {
  if (isFunction(delimiter)) {
    trace = delimiter;
    delimiter = DEFAULT_DELIMITER;
  }
  let context = new Aerobus(delimiter, trace);
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
  function bus(...channels) {
    switch (channels.length) {
      case 0:
        return context.get(ROOT);
      case 1:
        return isArray(channels[0]) ? bus(...channels[0]) : context.get(channels[0]);
      default:
        return new Domain(context, channels.map(channel => context.get(channel)));
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
