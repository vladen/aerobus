// creates subscription class
'use strict';


import {validateSubscriber} from "validators";
import {BUS , STRATEGY, SUBSCRIBERS} from "symbols"; 
import {strategies, isDefined} from "utilites";
import {MESSAGE_STRATEGY, MESSAGE_ARGUMENTS} from "messages";


export default class Subscription extends Operation {
  constructor(bus, subscribers) {
    for (let subscriber of subscribers) validateSubscriber(subscriber);

    this[BUS] = bus;
    this[SUBSCRIBERS] = subscribers;
    this[STRATEGY] = strategies.simultaneously();

    //TODO: Verify the equivalence of the results to the old version
    super(bus, []).onDispose(() => this[SUBSCRIBERS].length = 0)).onTrigger(trigger);
  }
  cyclically() {
    this[STRATEGY] = strategies.cyclically();
    return this;
  }  
  get strategy() {
    return this[STRATEGY];
  }
  // returns clone of subscribers array
  get subscribers() {
    return _ArraySlice.call(this[SUBSCRIBERS]);
  }
  randomly() {
    this[STRATEGY] = strategies.randomly();
    return this;
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
  subscribe(...subscribers) {
    if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
    for (let subscriber of subscribers) validateSubscriber(subscriber);
    this[SUBSCRIBERS].push(...subscribers)
    return this;
  }
  trigger(message, next) {
    let strategy = this[STRATEGY],
        subscribers = this[SUBSCRIBERS];
    strategy(subscribers).foreach(subscriber => deliver(subscriber));
    next();

    deliver(subscriber) {
      if (isDefined(message.error)) subscriber(message.error, message);
      else try {
        subscriber(message.data, message);
      } catch (error) {
        this[BUS].error.trigger(new Message(message, error));
      }
    }
  }
  // unsubscribes all specified subscribers from this subscription
  unsubscribe(...unsubscribers) {    
    let subscribers = this[SUBSCRIBERS];
    for (let subscriber of unsubscribers) {
      let index = subscribers.indexOf(subscriber);
      if (-1 !== index) subscribers.splice(index, 1);
    }    
   
    if (!subscribers.length) subscribers.length = 0;
  }
}
