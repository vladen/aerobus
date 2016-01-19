'use strict';

import { getGear }
  from './utilites';

// Internal representation of a section as a union of channels.
class SectionGear {
  constructor(bus, resolver) {
    this.bus = bus;
    this.resolver = resolver;
  }
  bubble(value) {
    this.each(channel => channel.bubble(value));
  }
  clear() {
    this.each(channel => channel.clear());
  }
  cycle(strategy) {
    this.each(channel => channel.cycle(strategy));
  }
  each(callback) {
    let channels = this.resolver();
    for (let i = -1, l = channels.length; ++i < l;)
      callback(getGear(channels[i]));
  }
  enable(value = true) {
    this.each(channel => channel.enable(value));
  }
  forward(forwarding) {
    this.each(channel => channel.forward(forwarding));
  }
  publish(data, callback) {
    this.each(channel => channel.publish(data, callback));
  }
  reset() {
    this.each(channel => channel.reset());
  }
  retain(limit) {
    this.each(channel => channel.retain(limit));
  }
  shuffle(strategy) {
    this.each(channel => channel.shuffle(strategy));
  }
  subscribe(subscription) {
    this.each(channel => channel.subscribe(subscription));
  }
  toggle() {
    this.each(channel => channel.toggle());
  }
  unsubscribe(unsubscription) {
    this.each(channel => channel.unsubscribe(unsubscription));
  }
}

export default SectionGear;
