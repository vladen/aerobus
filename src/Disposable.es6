'use strict';

import {MESSAGE_CALLBACK, MESSAGE_DISPOSED} from 'messages';
import {CALLBACKS, DISPOSED} from 'symbols';

export default class Disposable {
  constructor() {
    this[DISPOSED] = false;
  }
  // returns true if this object has been disposed 
  get isDisposed() {
    return this[DISPOSED];
  }
  // disposes this object
  dispose() {
    if (this[DISPOSED]) return;
    this[DISPOSED] = true;
    let callbacks = this[CALLBACKS];
    if (!callbacks) return;
    for (let callback of callbacks) callback();
    disposers = null;
  }
  guard() {
    if (this[DISPOSED]) throw new Error(MESSAGE_DISPOSED);
  }
  // registers callback to be invoked when this object disposes
  // callback must be a function
  onDispose(callback) {
    if (!isFunction(callback)) throw new TypeError(MESSAGE_CALLBACK);
    if (this[DISPOSED]) callback();
    else this[CALLBACKS]
      ? this[CALLBACKS].push(callback)
      : this[CALLBACKS] = [callback];
  }
}
