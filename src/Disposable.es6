'use strict';

import {validateCallback} from "validators";
import {DISPOSED, DISPOSERS} from "symbols";

export default class Disposable {
  constructor() {
    this[DISPOSERS] = [];
  }
  // returns true if this object has been disposed 
  get isDisposed() {
    return this[DISPOSED];
  } 
  // disposes this object
  dispose() {
    if (this[DISPOSED]) return this;
    this[DISPOSED] = true;
    let disposers = this[DISPOSERS];
    disposers.forEach(disposer => disposer());
    disposers.length = 0;
    return this;
  }
  // registers callback to be invoked when this object disposes
  onDispose(callback) {
    validateCallback(callback);
    if (this[DISPOSED]) callback();
    else this[DISPOSERS].push(callback);
    return this;
  }
}
