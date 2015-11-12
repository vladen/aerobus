// creates channel class
'use strict';


import Publication from "Publication";
import Subscription from "Subscription";

import {_setImmediate} from "auxiliaryModules/shortcuts";
import {validateCount} from "auxiliaryModules/validators";
import {MESSAGE_OPERATION, MESSAGE_ARGUMENTS} from "auxiliaryModules/errorMessages";
import {isPublication, isSubscription, isDefined, isUndefined, each} from "auxiliaryModules/helpFunctions";


const PUBLICATIONS = Symbol('publications')
    , RETENTIONS = Symbol('retentions')
    , RETAINING = Symbol('retaining')
    , SUBSCRIPTIONS = Symbol('subscriptions')
    , INDEXES = Symbol('indexes')
    , SLOTS = Symbol('slots')
    , BUS = Symbol('BUS')
    , NAME = Symbol('NAME')
    , PARENT = Symbol('PARENT');
    

export default Channel extends Activity {
  constructor(bus, name, parent) {
    //return Activity.call(channel, bus, parent).onDispose(dispose).onTrigger(trigger);
    super(bus, parent).onDispose(this.dispose).onTrigger(this.trigger);

    this[PUBLICATIONS] = [];
    this[RETAINING] = 0;
    this[SUBSCRIPTIONS] = [];

    this[PUBLICATIONS][INDEXES] = _ObjectCreate(null);
    this[PUBLICATIONS][SLOTS] = [];
    this[SUBSCRIPTIONS][INDEXES] = _ObjectCreate(null);
    this[SUBSCRIPTIONS][SLOTS] = [];

    this[BUS] = bus;
    this[NAME] = name;
    /*if (parent) _ObjectDefineProperty(channel, 'parent', {
      enumerable: true,
      get: getParent
    });*/
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
      each(this[RETENTIONS], operation.trigger);
    }

    function insert(collection) {
      let index = collection.indexes[operation.id];
      if (isDefined(index)) return false;
      let slots = collection.slots;
      index = collection.indexes[operation.id] = slots.length ? slots.pop() : collection.length++;
      collection[index] = operation;
      operation.attach(this);
      return true;
    }
  }
  clear() {
    this[BUS].trace('clear', this);
    this[RETENTIONS] = undefined;
    each(this[PUBLICATIONS], this.detach);
    each(this[SUBSCRIPTIONS], this.detach);
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
      operation.detach(this);
    }
  }
  dispose() {
    let publications = this[PUBLCIATIONS]
      , subscriptions = this[SUBSCRIPTIONS]
      , retentions = this[RETENTIONS];
    each(publications, this.detach);
    each(subscriptions, this.detach);
    publications = retentions = subscriptions = undefined;
  }
  // returns parent object of this activity
  get getParent() {
    return this[PARENT];
  }
  get getPublications() {
    return _ArraySlice.call(this[PUBLICATIONS]);
  }
  get getRetaining() {
    return this[RETAINING];
  }
  get getSubscriptions() {
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
  trigger(message, next) {
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
    each(subscriptions, 'trigger', message);
    if (name !== ERROR && parent) parent.trigger(message);
    next();
  }
  // creates subscription to this channel
  // every subscriber must be a function
  subscribe(subscriber1, subscriber2, subscriberN) {
    if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    return new Subscription(this[BUS], _ArraySlice.call(arguments)).attach(this);
  }
  // unsubscribes all subscribers from all subscriptions to this channel
  function unsubscribe(subscriber1, subscriber2, subscriberN) {
    each(this[SUBSCRIPTIONS], 'unsubscribe', _ArraySlice.call(arguments));
    return this;
  }
}