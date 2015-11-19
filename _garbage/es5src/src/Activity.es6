// creates new activity class (abstract base for channels, publications and subscriptions)
'use strict';

import Disposable from 'Disposable'

import {each} from "utilites";
import {MESSAGE_CALLBACK, MESSAGE_DISPOSED} from 'messages';
import {BUS, DISPOSERS, ENABLED, ENABLERS, ENSURED, PARENT, TRIGGERS} from "symbols"; 
import {validateCallback, validateDisposable} from "validators";

function notify(activity) {
  if (!activity[ENABLED]) return;
  let parent = activity[PARENT];
  if (parent && !parent.isEnabled) parent[ENABLERS].push(() => notify(activity));
  else {
    enablers = activity[ENABLERS];
    for (let i = 0, l = enablers.length; i < l; i++) enablers[i]();
    enablers.length = 0;
  }
}
// registers callback to be invoked when this object disposes
// callback must be a function
export function onDispose(activity, callback) {
  validateCallback(callback);
  if (activity[DISPOSED]) callback();
  else activity[DISPOSERS]
    ? activity[DISPOSERS].push(callback)
    : activity[DISPOSERS] = [callback];
}
// registers callback to be invoked once when this activity is enabled
// callback must be a function
export function onEnable(activity, callback) {
  validateCallback(callback);
  validateDisposable(activity);
  if (activity.isEnabled) callback();
  else {
    let parent = activity[PARENT]
      , enablers = activity[ENABLERS];
    if (!enablers.length && parent) parent.onEnable(() => notify(activity));
    enablers.push(callback);
  }
}
// registers callback to be invoked when activity is triggered
// callback must be a function
export function onTrigger(activity, callback) {
  validateCallback(callback);
  validateDisposable(activity);
  activity[TRIGGERS].push(callback);
}
function perform(activity, message) {
  let index = 1
    , finishing = false
    , triggers = activity[TRIGGERS];
  if (message.headers.isEnsured) onEnable(activity, next);
  else if (activity.isEnabled) next();
  function next(state) {
    if (activity.isDisposed) return;
    if (state & SKIP) index = 0;
    if (state & FINISH) finishing = true;
    if (isMessage(state)) message = state;
    if (index) triggers[index >= triggers.length ? index = 0 : index++](message, next);
    else if (finishing) activity.dispose();
  }
}

export default class Activity {
  constructor(bus, parent) {
    this[BUS] = bus;
    this[DISPOSERS] = [];
    this[ENABLED] = true;
    this[ENABLERS] = [];
    this[ENSURED] = false;
    this[TRIGGERS] = [];
    this[PARENT] = parent;
    bus.trace('create', this);
  }
  // returns true if this activity has been disposed 
  get isDisposed() {
      return this[DISPOSABLE].isDisposed;
  } 
  // returns true if this activity and all its parents are enabled 
  get isEnabled(){
    return this[ENABLED] && (!this[PARENT] || this[PARENT].enabled);
  } 
  // returns true if this activity is ensured
  get isEnsured() {
      return this[ENSURED];
  }
  // disables this activity
  disable() {
    validateDisposable(this);
    if (this[ENABLED]) {
      this[BUS].trace('disable', this);
      this[ENABLED] = false;
      this.notify();
    }
    return this;
  }
  // disposes this activity
  dispose() {
    if (this[DISPOSED]) return this;
    this[BUS].trace('dispose', this);
    this[DISPOSED] = true;
    this[ENABLED] = false;
    let disposers = this[DISPOSERS];
    for (var i = 0, l = disposers.length; i < l; i++) disposers[i]();
    this[ENABLERS] = this[DISPOSERS] = this[TRIGGERS] = null;
    return this;
  }
  // enables this activity
  enable() {
    validateDisposable(this);
    if (!this[ENABLED]) {
      this[BUS].trace('enable', this);
      this[ENABLED] = true;
      this.notify();
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
  // triggers registered operations on this activity
  trigger(data) {
    validateDisposable(this);
    let message = new Message(data, this);
    this[BUS].trace('trigger', this, message);
    perform(this, message);
    return this;
  }
}
