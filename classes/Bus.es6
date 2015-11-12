'use strict';
 
 
import Domain from "classes/Domain";
import Channel from "classes/Channel";
 
import {ROOT, ERROR} from "../auxiliaryModules/standatdConstants";
import {MESSAGE_FORBIDDEN} from "../auxiliaryModules/errorMessages";
import {validateDelimiter, validateTrace, validateName} from "../auxiliaryModules/validators";
import {isArray, isFunction, isDefined, each} from "../auxiliaryModules/helpFunctions";
import {_ObjectCreate, _ObjectDefineProperties, _ObjectKeys, _ObjectValues} from "../auxiliaryModules/shortcuts";
 
 
const CHANNELS = Symbol('channels')
    , CONFIGURABLE = Symbol('configurable')
    , DELIMITER = Symbol('delimiter')
    , TRACE = Symbol('trace');
 
class Aerobus {
  constructor(delimiter, trace, bus) {
    this[CHANNELS] = new Map;
    this[DELIMITER] = delimiter;
    this[TRACE] = trace;
    this[CONFIGURABLE] = true;
  }
  clear() {
    this[TRACE]('clear', this[BUS]);
    this[CHANNELS].forEach(channel => channel.dispose());
    this[CHANNELS] = new Map;
    this[CONFIGURABLE] = true;
  }
  // returns array of all existing channels
  get channels() {
    return _ObjectValues(this[CHANNELS]);
  }
  // returns delimiter string
  get delimiter() {
    return this[DELIMITER];
  }
  // returns error channel
  get error() {
    return this.lookup(ERROR);
  }
  // returns root channel
  get root() {
    return this.lookup(ROOT);
  }
  // returns trace function
  get trace() {
    return this[TRACE];
  }
  // sets delimiter string if this bus is empty
  // otherwise throws error
  set delimiter(value) {
    if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
    validateDelimiter(value);
    this[DELIMITER] = value;
  }
  // sets trace function if this bus is empty
  // otherwise throws error
  set trace(value) {
    if (!this[CONFIGURABLE]) throw new Error(MESSAGE_FORBIDDEN);
    validateTrace(value);
    this[TRACE] = value;
  }
  lookup(name) {
    let channels = this[CHANNELS]
      , channel = channels[name];
    if (!channel) {
      let parent;
      if (name !== ROOT && name !== ERROR) {
          validateName(name);
          let index = name.indexOf(delimiter);
          parent = this.lookup(-1 === index ? ROOT : name.substr(0, index));
      }
      this[CONFIGURABLE] = false;
      channel = channels[name] = new Channel(this, name, parent).onDispose(() => delete channels[name]);
    }
    return channel;
  }
  // unsubscribes all specified subscribes from all channels of this bus
  unsubscribe(...subscribers) {
    this.channels.forEach(channel => channel.unsubscribe(subscribers));
  }
}
 
export default function aerobus(delimiter, trace) {
  if (!arguments.length) {
    delimiter = DELIMITER;
    trace = noop;
  } else if (isFunction(delimiter)) {
    trace = delimiter;
    delimiter = DELIMITER;
  } else {
    validateDelimiter(delimiter);
    if (isDefined(trace)) validateTrace(trace);
    else trace = noop;
  }
  return bus.bind(new Aerobus(delimiter, trace));
}
 
function bus(name1, name2, nameN) {
  let channels = this[CHANNELS]
    , delimiter = this[DELIMITER]
    , configurable = this[CONFIGURABLE]
    ,
  if (!arguments.length) return bus(ROOT);
  if (arguments.length > 1) return new Domain(bus, _ArrayMap.call(arguments, function(n) {
      return bus(n);
  }));
  let name = arguments[0];
  if (arguments.length === 1 && isArray(name)) return new Domain(bus, name.map(function(n) {
      return bus(n);
  }));
  let channel = channels[name];
  if (channel) return channel;
  let parent;
  if (name !== ROOT && name !== ERROR) {
      validateName(name);
      let index = name.indexOf(delimiter);
      parent = -1 === index ? bus(ROOT) : bus(name.substr(0, index));
  }
  configurable = false;
  channel = channels[name] = new Channel(bus, name, parent).onDispose(dispose);
  return channel;
 
  function dispose() {
      delete channels[name];
  }
}