// creates domain class (group of channels)
'use strict';


import {BUS , CHANNELS} from "symbols"; 


class Domain {
  constructor(bus, channels) {
    bus.trace('create', this);
    this[BUS] = bus;
    this[CHANNELS] = channels;
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
    for (let channel of this[CHANNELS].values()) channel.subscribe(subscribers);
    return this;
  }
  // unsubscribes all subscribers from all this[CHANNELS] in this domain
  unsubscribe(...subscribers) {
    for (let channel of this[CHANNELS].values()) channel.unsubscribe(subscribers);
    return this;
  }
  clear() {
    for (let channel of this[CHANNELS].values()) channel.clear();
    return this;
  }
}

export default Domain