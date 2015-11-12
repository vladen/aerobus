/*
  let bus = aerobus(console.log.bind(console));
  ideas:
  dispose channel when it becomes empty
  channel.forward -
  static - accepts channel name 
  dynamic - accepts callback resolving channel name
  channel.zip
  zips publications from several channels and combine them via callback passing as array
  triggers combined publication to self
  buffer, distinct(untilChanged), randomize/reduce/sort until finished, whilst? operators
  subscription/publication strategies: cycle | random | serial | parallel
  delay/debounce/throttle/repeat may accept dynamic intervals (callback)
  subscriptions priority + cancellation via 'return false'
  named subscriptions/publications
  request - reponse pattern on promises
  plugable persistence with expiration
*/

'use strict';


import Domain from "classes/Domain";

import {ROOT} from "../auxiliaryModules/standatdConstants";
import {MESSAGE_FORBIDDEN} from "../auxiliaryModules/errorMessages";
import {validateDelimiter, validateTrace} from "../auxiliaryModules/validators";
import {isArray, isFunction, isDefined, each} from "../auxiliaryModules/helpFunctions";
import {_ObjectCreate, _ObjectDefineProperties, _ObjectKeys} from "../auxiliaryModules/shortcuts";


export default function aerobus(delimiter, trace) {
  let channels, configurable;
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
  // creates new channel or returns existing one
  // name must be a string
  // if multiple names are specified returns Domain object supporting simultaneous operations on multiple channels
  function bus(name1, name2, nameN) {
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
  init();
  _ObjectDefineProperties(bus, {
    clear: {
      value: clear
    },
    channels: {
      enumerable: true,
      get: getChannels
    },
    create: {
      value: aerobus
    },
    delimiter: {
      enumerable: true,
      get: getDelimiter,
      set: setDelimiter
    },
    error: {
      enumerable: true,
      get: getError
    },
    id: {
      enumerable: true,
      value: identity(bus)
    },
    root: {
      enumerable: true,
      get: getRoot
    },
    trace: {
      get: getTrace,
      set: setTrace
    },
    unsubscribe: {
      value: unsubscribe
    }
  });
  trace('create', bus);
  return bus;
  // empties this bus
  function clear() {
    trace('clear', bus);
    each(channels, 'dispose');
    init();
    return bus;
  }
  // returns array of all existing channels
  function getChannels() {
    return _ObjectKeys(channels).map(function(key) {
      return channels[key];
    });
  }
  // returns delimiter string
  function getDelimiter() {
    return delimiter;
  }
  // returns error channel
  function getError() {
    return bus(ERROR);
  }
  // returns root channel
  function getRoot() {
    return bus(ROOT);
  }
  // returns trace function
  function getTrace() {
    return trace;
  }

  function init() {
    channels = _ObjectCreate(null);
    configurable = true;
  }
  // sets delimiter string if this bus is empty
  // otherwise throws error
  function setDelimiter(value) {
    if (!configurable) throw new Error(MESSAGE_FORBIDDEN);
    validateDelimiter(delimiter);
    delimiter = value;
  }
  // sets trace function if this bus is empty
  // otherwise throws error
  function setTrace(value) {
    if (!configurable) throw new Error(MESSAGE_FORBIDDEN);
    validateTrace(value);
    trace = value;
  }
  // unsubscribes all specified subscribes from all channels of this bus
  function unsubscribe(subscriber1, subscriber2, subscriberN) {
    each(channels, 'unsubscribe', _ArraySlice.call(arguments));
    return bus;
  }
}
