'use strict';

import subclassChannel
  from './channelBase';
import { errorNameNotValid }
  from './errors';
import subclassSection
  from './sectionBase';
import subclassMessage
  from './messageBase';
import subclassPlan
  from './planBase';
import { CLASS_STRING, CLASS_REGEXP, PROTOTYPE }
  from './symbols';
import { classOf, extend, getGear, setGear }
  from './utilites';


// Internal representation of Aerobus as a map of the channels.
class BusGear {
  constructor(config) {
    this.bubbles = config.bubbles;
    this.channels = new Map;
    this.delimiter = config.delimiter;
    this.error = config.error;
    this.id = 0;
    /*
    this.patterns = [];
    */
    this.trace = config.trace;
    // extended classes used by this instance
    this.Channel = subclassChannel();
    extend(this.Channel[PROTOTYPE], config.channel);
    this.Message = subclassMessage();
    extend(this.Message[PROTOTYPE], config.message);
    this.Plan = subclassPlan();
    extend(this.Plan[PROTOTYPE], config.plan);
    this.Section = subclassSection();
    extend(this.Section[PROTOTYPE], config.section);
  }
  // sets bubbles behavior
  bubble(value) {
    value = !!value;
    this.trace('bubble', value);
    this.bubbles = value;
  }
  // clears and removes all channels
  clear() {
    let channels = this.channels;
    for (let channel of channels.values())
      setGear(channel.clear(), null);
    channels.clear();
    this.patterns = [];
  }
  // gets a channel by its name
  get(name) {
    let channels = this.channels
      , channel = channels.get(name);
    // if channel already exists, just return it
    if (channel)
      return channel;
    // get root channel if name is empty string
    let Channel = this.Channel;
    if (name === '') {
      channel = new Channel(this, name);
      channels.set(name, channel);
      return channel;
    }
    // build channels hierarchy starting from root channel
    let parent = channels.get('')
      , delimiter = this.delimiter
      , parts = name.split(this.delimiter);
    if (!parent) {
      parent = new Channel(this, '');
      channels.set('', parent);
    }
    name = '';
    for (let i = -1, l = parts.length; ++i < l;) {
      name = name
        ? name + delimiter + parts[i]
        : parts[i];
      channel = channels.get(name);
      if (!channel) {
        channel = new Channel(this, name, parent);
        channels.set(name, channel);
      }
      parent = channel;
    }
    return channel;
  }
  // resolves a channel, pattern or section by several names
  resolve(names) {
    let arity = names.length;
    // if no names passed, get the root channel
    if (!arity)
      return this.get('');
    // if single string name is passed, get the corresponding channel
    if (arity === 1) {
      let name = names[0];
      if (classOf(name) === CLASS_STRING)
        return this.get(name);
    }
    // otherwise parse names and return section
    let Section = this.Section
      , channels
      , resolved = [];
    for (let i = -1, l = names.length; ++i < l;) {
      let name = names[i];
      switch (classOf(name)) {
        case CLASS_REGEXP:
          if (!channels)
            channels = Array.from(this.channels.values());
          for (let j = -1, m = channels.length; ++j < m;) {
            let channel = channels[j];
            if (name.test(channel.name))
              resolved.push(channel);
          }
          break;
        case CLASS_STRING:
          resolved.push(this.get(name));
          break;
        default:
          throw errorNameNotValid(name);
      }
    }
    return new Section(this, () => resolved);
  }
  // unsubscribe from all channels
  unsubscribe(unsubscription) {
    for (let channel of this.channels.values())
      getGear(channel).unsubscribe(unsubscription);
  }
}

export default BusGear;
