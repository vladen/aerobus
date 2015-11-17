// creates channel class
'use strict';


import Activity from "Activity";
import Subscription from "Subscription";

import {validateCount} from "validators";
import {MESSAGE_OPERATION, MESSAGE_ARGUMENTS} from "messages";
import {isSubscription, isDefined, isUndefined} from "utilites";
import {PUBLICATIONS , RETENTIONS, RETAINING, SUBSCRIPTIONS, INDEXES, SLOTS, BUS, NAME, PARENT} from "symbols"; 


function dispose() {
  let publications = this[PUBLCIATIONS]
      , subscriptions = this[SUBSCRIPTIONS]
      , retentions = this[RETENTIONS];
    for (let publication of publications.values()) this.detach(publication);
    for (let subscription of subscriptions.values()) this.detach(subscription);
    publications = retentions = subscriptions = undefined;
}

function trigger(message, next) {
 let name = this[NAME]
      , parent = this[PARENT]
      , retaining = this[RETAINING]
      , retentions = this[RETENTIONS]
      , subscriptions = this[SUBSCRIPTIONS];
    if (retaining) {
      if (retentions) retentions.push(message);
      else retentions = [message];
      if (retaining < retentions.length) retentions.shift();
    }
    for (let subscription of subscriptions.values()) subscription.trigger(message);
    if (name !== ERROR && parent) parent.trigger(message);
    next();
}

class Channel extends Activity {
  constructor(bus, name, parent) {
    //TODO: Verify the equivalence of the results to the old version
    //return Activity.call(channel, bus, parent).onDispose(dispose).onTrigger(trigger);
    super(bus, parent).onDispose(bind(this, dispose)).onTrigger(bind(this, trigger));

    this[PUBLICATIONS] = [];
    this[RETAINING] = 0;
    this[SUBSCRIPTIONS] = [];

    this[PUBLICATIONS][INDEXES] = new Map;
    this[PUBLICATIONS][SLOTS] = [];
    this[SUBSCRIPTIONS][INDEXES] = new Map;
    this[SUBSCRIPTIONS][SLOTS] = [];

    this[BUS] = bus;
    this[NAME] = name;
    this[PARENT] = parent;
  }
  // attaches operation to this channel
  attach(operation) {
    if (isPublication(operation)) insert(this[PUBLICATIONS]);
    else if (isSubscription(operation)) {
      if (insert(this[SUBSCRIPTIONS]) && this[RETAINING]) _setImmediate(deliver);
    } else throw new Error(MESSAGE_OPERATION);
    return this;

    function deliver() {
      this[RETENTIONS].forEach((retention) => operation.trigger(retention));
    }

    function insert(collection) {
      let index = collection.indexes[operation.id];
      if (isDefined(index)) return false;
      let slots = collection.slots;
      index = collection.indexes[operation.id] = slots.length ? slots.pop() : collection.length++;
      collection[index] = operation;
      return true;
    }
  }
  clear() {
    this[BUS].trace('clear', this);
    this[RETENTIONS] = undefined;
    for (let publication of this[PUBLICATIONS].values()) this.detach(publication);
    for (let subscription of this[SUBSCRIPTIONS].values()) this.detach(subscription);
  }
  // detaches operation from this channel
  detach(operation) {
    if (isPublication(operation)) remove(this[PUBLICATIONS]);
    else if (isSubscription(operation)) remove(this[SUBSCRIPTIONS]);
    else throw new Error(MESSAGE_OPERATION);
    return this;

    function remove(collection) {
      let index = collection.indexes[operation.id];
      if (isUndefined(index)) return;
      collection.slots.push(index);
      collection[index] = undefined;
      delete collection.indexes[operation.id];
    }
  }
  // returns parent object of this activity
  get parent() {
    return this[PARENT];
  }
  get publications() {
    return _ArraySlice.call(this[PUBLICATIONS]);
  }
  get retaining() {
    return this[RETAINING];
  }
  get subscriptions() {
    return _ArraySlice.call(this[SUBSCRIPTIONS]);
  }
  // publishes data to this channel immediately or creates new publication if no data present
  publish(data) {
    return arguments.length ? this.trigger(data) : new Publication(bus).attach(this);
  }
  // activates or deactivates retaining of publications for this channel
  // when count is true this channel will retain 9e9 lastest publications
  // when count is a number this channel will retain corresponding number of lastest publications
  // when count is false or 0 this channel will not retain publications
  // all retained publications are authomatically delivered to all new subscriptions to this channel
  retain(count) {
    let retaining = this[RETAINING]
      , retentions = this[RETENTIONS];
    if (!arguments.length || count === true) retaining = 9e9;
    else if (!count) {
      retaining = 0;
      retentions = undefined;
    } else {
      validateCount(count);
      retaining = count;
      if (retentions) retentions.splice(0, retentions.length - retaining);
    }
    this[BUS].trace('retain', this);
    return this;
  }  
  // creates subscription to this channel
  // every subscriber must be a function
  subscribe(...subscribers) {
    if (!subscribers.length) throw new Error(MESSAGE_ARGUMENTS);
    let subscription = new Subscription(this[BUS], subscribers);
    this.attach(subscription);
    return subscription;
  }
  // unsubscribes all subscribers from all subscriptions to this channel
  unsubscribe(...subscribers) {
    this[SUBSCRIPTIONS].forEach((subscription) => subscription.unsubscribe(...subscribers));
    return this;
  }
}

export default Channel
