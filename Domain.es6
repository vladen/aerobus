// creates domain class (group of channels)
'use strict';

import Publication from "Publication";
import Subscription from "Subscription";

import {MESSAGE_ARGUMENTS} from "auxiliaryModules/errorMessages";

const BUS = Symbol('bus')
    , CHANNELS = Symbol('channels');

export default class Domain {
  constructor(bus, channels) {
    this[BUS] = bus;
    this[CHANNELS] = channels;
  }
  disable() {
    each(this[CHANNELS], 'disable');
    return this;
  }
  enable(value) {
    each(this[CHANNELS], 'enable', value);
    return this;
  }
  ensure(value) {
    each(this[CHANNELS], 'ensure', value);
    return this;
  }
  preserve(count) {
    each(this[CHANNELS], 'preserve', count);
    return this;
  }
  // creates new publication to all this[CHANNELS] in this domain
  publish(data) {
    if (arguments.length) {
      each(this[CHANNELS], 'trigger', data);
      return this;
    } else {
      let publication = new Publication(this[BUS]);
      each(this[CHANNELS], 'attach', publication);
      return publication;
    }
  }
  // creates subscription to all this[CHANNELS] in this domain
  // every subscriber must be a function
  subscribe(subscriber1, subscriber2, subscriberN) {
    if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    let subscription = new Subscription(this[BUS], _ArraySlice.call(arguments));
    each(this[CHANNELS], 'attach', subscription);
    return subscription;
  }
  // unsubscribes all subscribers from all this[CHANNELS] in this domain
  unsubscribe(subscriber1, subscriber2, subscriberN) {
    each(this[CHANNELS], 'unsubscribe', _ArraySlice.call(arguments));
    return this;
  }
}