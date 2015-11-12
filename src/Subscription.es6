// creates subscription class
'use strict';


import {validateSubscriber} from "validators";
import {BUS , STRATEGY, SUBSCRIBERS} from "symbols"; 
import {each, strategies, isDefined} from "utilites";
import {MESSAGE_STRATEGY, MESSAGE_ARGUMENTS} from "messages";


export default class Subscription extends Operation {
  constructor(bus, subscribers) {
    each(subscribers, validateSubscriber);

    this[BUS] = bus;
    this[SUBSCRIBERS] = subscribers;
    this[STRATEGY] = strategies.simultaneously();

    //TODO: Verify the equivalence of the results to the old version
    super(bus, []).onDispose(dispose).onTrigger(trigger);
  }
  cyclically() {
    this[STRATEGY] = strategies.cyclically();
    return this;
  }
  dispose() {
    this[SUBSCRIBERS].length = 0;
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
  subscribe(subscriber1, subscriber2, subscriberN) {
    if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    each(arguments, validateSubscriber);
    this[SUBSCRIBERS].push(...arguments)
    return this;
  }
  trigger(message, next) {
    each(this[STRATEGY](this[SUBSCRIBERS]), deliver);
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
  unsubscribe(subscriber1, subscriber2, subscriberN) {
    let subscribers = this[SUBSCRIBERS];
    each(arguments, function(subscriber) {
      let index = subscribers.indexOf(subscriber);
      if (-1 !== index) subscribers.splice(index, 1);
    });
    if (!subscribers.length) this.dispose();
  }
}
