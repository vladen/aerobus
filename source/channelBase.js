'use strict';

import ChannelGear
  from './channelGear';
import Common
  from './common';
import { CLASS, CLASS_AEROBUS_CHANNEL, PROTOTYPE }
  from './symbols';
import { isSomething, getGear, objectDefineProperty, setGear }
  from './utilites';

/**
 * Channel class.
 * @alias Channel
 * @extends Common
 * @property {boolean} bubbles
 *  Gets the bubbling state if this channel.
 * @property {Aerobus} bus
 *  Gets the bus instance owning this channel.
 * @property {boolean} enabled
 *  Gets the enabled state of this channel.
 * @property {string} name
 *  Gets the name if this channel (empty string for root channel).
 * @property {Channel} [parent]
 *  Gets the parent channel (undefined for root channel).
 * @property {array} retentions
 *  Gets the list of retentions kept by this channel.
 * @property {array} subscribers
 *  Gets the list of subscribers to this channel.
 */
export class ChannelBase extends Common {
  constructor(bus, name, parent) {
    super();
    objectDefineProperty(this, 'name', { value: name, enumerable: true });
    if (isSomething(parent))
      objectDefineProperty(this, 'parent', { value: parent, enumerable: true });
    let trace = (event, ...args) => bus.trace(event, this, ...args);
    setGear(this, new ChannelGear(bus, name, parent, trace));
    /*
    let patterns = bus.patterns;
    if (patterns.length) {
      let replayee = [this];
      for (let i = - 1, l = patterns.length; ++i < l;) {
        let pattern = patterns[i];
        if (pattern.regex.test(name))
          pattern.replay(replayee);
      }
    }
    */
  }
  get bubbles() {
    return getGear(this).bubbles;
  }
  get enabled() {
    return getGear(this).isEnabled;
  }
  get forwarders() {
    let gear = getGear(this)
      , forwarders = gear.forwarders;
    return forwarders
      ? forwarders.slice()
      : [];
  }
  get retentions() {
    let retentions = getGear(this).retentions
      , result = [];
    if (retentions) {
       result.push(...retentions);
       result.limit = retentions.limit;
    }
    else result.limit = 0;
    return result;
  }
  get strategy() {
    return getGear(this).strategy;
  }
  get subscribers() {
    let gear = getGear(this)
      , subscribers = gear.subscribers;
    return subscribers
      ? subscribers.filter(isSomething)
      : [];
  }
  when(parameters) {
    let gear = getGear(this)
      , bus = gear.bus
      , When = bus.When;
    return new When(bus, parameters, [this]);
  }
}
objectDefineProperty(ChannelBase[PROTOTYPE], CLASS, { value: CLASS_AEROBUS_CHANNEL });

export default function subclassChannel() {
  return class Channel extends ChannelBase {
    constructor(bus, name, parent) {
      super(bus, name, parent);
    }
  }
}
