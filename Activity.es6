// creates new activity class (abstract base for channels, publications and subscriptions)
'use strict';

import {validateDisposable, validateCallback} from "auxiliaryModules/validators";
import {each} from "auxiliaryModules/helpFunctions";

const DISPOSED = Symbol('disposed')
    , DISPOSERS = Symbol('disposers')
    , ENABLED = Symbol('enabled')
    , ENABLERS = Symbol('enablers')
    , ENSURED = Symbol('ensured')
    , TRIGGERS = Symbol('triggers')
    , BUS = Symbol('bus')
    , PARENT = Symbol('parent')

export default class Activity {
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
      this.notify();
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
    let parent = this[PARENT]
      , enablers = this[ENABLERS];

    if (parent && !parent.isEnabled) parent.onEnable(this.notify);
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
    let parent = this[PARENT]
      , enablers = this[ENABLERS];
    if (this.isEnabled) callback();
    else {
      if (!enablers.length && parent) parent.onEnable(this.notify);
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
    let message = new Message(data, activity)
      , enablers = activity[ENABLERS];

    this[BUS].trace('trigger', activity, message);
    if (activity.isEnabled) initiate();
    else if (message.headers.isEnsured) {
      if (!enablers.length && parent) parent.onEnable(initiate);
      enablers.push(initiate);
    }
    return activity;
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