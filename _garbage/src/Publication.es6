// creates publication class
'use strict';


import {strategies} from "utilites";
import {MESSAGE_STRATEGY} from "messages";
import {validateInterval} from "validators";
import {CHANNELS , STRATEGY, BUS} from "symbols"; 

const _setInterval = setInterval
    , _clearInterval = clearInterval;


export default class Publication extends Operation {
  constructor(bus) {
    this[CHANNELS] = [];
    this[STRATEGY] = strategies.cyclically();

    //TODO: Verify the equivalence of the results to the old version
    super(bus, this[CHANNELS]).onTrigger(trigger);
  }
  cyclically() {
    this[STRATEGY] = strategies.cyclically();
    return this;
  }
  get strategy() {
    return this[STRATEGY];
  }
  randomly() {
    this[STRATEGY] = strategies.randomly();
    return this;
  }
  // repeats this publication every interval with optional message
  // interval must be positive number
  // if message is function, it will be invoked each time
  repeat(data, interval) {
    let publication = this;
    if (1 === arguments.length) interval = data;
    validateInterval(interval);
    interval = _setInterval(trigger, interval);
    return publication.onDispose(dispose);

      dispose() {
      _clearInterval(interval);
    }

      trigger() {
      publication.trigger(data);
    }
  }

  simultaneously() {
    this[STRATEGY] = strategies.simultaneously();
    return this;
  }
  set strategy(value) {
    let factory = strategies[value];
    if (!factory) throw new Error(MESSAGE_STRATEGY);
    this[STRATEGY] = factory();
  }
  //TODO: Move inside
  trigger(message, next) {
    let strategy = this[STRATEGY]
      , channels = this[CHANNELS];
    for(let channel of strategy(channels)) channel.trigger(message);
    next();
  }
}