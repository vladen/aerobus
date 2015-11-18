// creates channel class
'use strict';


import Activity from "./Activity";
import strategies from "./strategies";

import {validateCount} from "./validators";
import {MESSAGE_ARGUMENTS} from "./messages";
import {isDefined, isUndefined} from "./utilities";
import {SUBSCRIBERS, RETAINING, RETENTIONS, BUS, NAME, PARENT, STRATEGY, TAG} from "./symbols"; 


const ROOT = 'root', ERROR = 'error', defineProperties = Object.defineProperties, CHANNEL = 'Channel';


class Channel extends Activity {
  constructor(bus, name, parent) {
    super(bus, parent);   

    this[STRATEGY] = strategies.cyclically();
    this[RETAINING] = 0;
    this[RETENTIONS] = []
    this[SUBSCRIBERS] = [];
    this[BUS] = bus;
    this[NAME] = name;
    this[PARENT] = parent;
    this[TAG] = 'Channel';

    bus.trace('create', this);
  }
  clear() {
    this[BUS].trace('clear', this);
    this[RETAINING] = undefined;
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
    if (this[NAME] !== ERROR && parent) parent.publish(data); 
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
    this[RETENTIONS] = this[SUBSCRIBERS] = this[STRATEGY] = undefined;
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
}

export default Channel
