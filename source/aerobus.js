'use strict';

import BusGear
  from './busGear';
import { errorArgumentNotValid, errorChannelExtensionNotValid, errorDelimiterNotValid, errorErrorNotValid, errorMessageExtensionNotValid, errorSectionExtensionNotValid, errorTraceNotValid, errorWhenExtensionNotValid }
  from './errors';
import { CLASS, CLASS_BOOLEAN, CLASS_FUNCTION, CLASS_OBJECT, CLASS_STRING, CLASS_AEROBUS } 
  from './symbols';
import Unsubscription
  from './unsubscription';
import { getGear, setGear, classOf, objectAssign, isSomething, isString, isFunction, isObject, objectDefineProperties, noop }
  from './utilites';

/**
 * The message bus factory.
 *  Creates new message bus instances.
 * @param {...boolean|function|object|string} parameters
 *  The boolean value defining default bubbling behavior;
 *  and/or the string delimiter of hierarchical channel names (dot by default);
 *  and/or the error callback, invoked asynchronously with (error, [message]) arguments,
 *  where error is an error thrown by a iterator/observer/subscriber and caught via the bus;
 *  and/or the object literal with settings to configure (bubbles, delimiter, error, trace)
 *  and extesions for internal classes (channel, message and section).
 * @returns {Aerobus}
 *  The new instance of Aerobus as a function which resolves channels/sets of channels
 *  and contains additional API members.
 * @throws
 *  If any option is of unsupported type (boolean, function, object, string);
 *  or delimiter string is empty;
 *  or option object contains non-string or empty "delimiter" property;
 *  or option object contains non-function "error" property;
 *  or option object contains non-function "trace" property;
 *  or option object contains non-object "channel" property;
 *  or option object contains non-object "message" property;
 *  or option object contains non-object "section" property.
 */
function aerobus(...options) {
  let config = {
      bubbles: true
    , channel: {}
    , delimiter: '.'
    , error: error => { throw error; }
    , message: {}
    , pattern: {}
    , section: {}
    , trace: noop
    , when: {}
  };
  // iterate options
  for (let i = -1, l = options.length; ++i < l;) {
    let option = options[i];
    // depending on class of option
    switch(classOf(option)) {
      // use boolean as 'bubbles' setting
      case CLASS_BOOLEAN:
        config.bubbles = option;
        break;
      // use function as 'error' setting
      case CLASS_FUNCTION:
        config.error = option;
        break;
      // parse object members
      case CLASS_OBJECT:
        let { bubbles, channel, delimiter, error, message, section, trace, when } = option;
        // use 'bubbles' field if defined
        if (isSomething(bubbles))
          config.bubbles = !!bubbles;
        // use 'delimiter' string if defined
        if (isSomething(delimiter))
          if (isString(delimiter) && delimiter.length)
            config.delimiter = delimiter;
          else throw errorDelimiterNotValid(delimiter);
        // use 'error' function if defined
        if (isSomething(error))
          if (isFunction(error))
            config.error = error;
          else throw errorErrorNotValid(error);
        // use 'trace' function if defined
        if (isSomething(trace))
          if (isFunction(trace))
            config.trace = trace;
          else throw errorTraceNotValid(trace);
        // use 'channel' if defined to extend Channel instances
        if (isSomething(channel))
          if (isObject(channel))
            objectAssign(config.channel, channel);
          else throw errorChannelExtensionNotValid(channel);
        // use 'message' if defined to extend Message instances
        if (isSomething(message))
          if (isObject(message))
            objectAssign(config.message, message);
          else throw errorMessageExtensionNotValid(message);
        // use 'section' if defined to extend Section instances
        if (isSomething(section))
          if (isObject(section))
            objectAssign(config.section, section);
          else throw errorSectionExtensionNotValid(section);
        // use 'when' if defined to extend When instances
        if (isSomething(when))
          if (isObject(when))
            objectAssign(config.when, when);
          else throw errorWhenExtensionNotValid(when);
        break;
      // use string as 'delimiter' setting
      case CLASS_STRING:
        if (option.length)
          config.delimiter = option;
        else throw errorDelimiterNotValid(option);
        break;
      // class of option is unexpected, throw
      default:
        throw errorArgumentNotValid(option);
    }
  }
  // keep the stuffe implementing bus in the private storage
  setGear(bus, new BusGear(config));
  // extend bus function with additional API members
  return objectDefineProperties(bus, {
    [CLASS]: { value: CLASS_AEROBUS }
  , bubble: { value: bubble }
  , bubbles: { get: getBubbles }
  , clear: { value: clear }
  , create: { value: create }
  , channels: { get: getChannels }
  , delimiter: { get: getDelimiter }
  , error: { get: getError }
  , root: { get: getRoot }
  , trace: { get: getTrace, set: setTrace }
  , unsubscribe: { value: unsubscribe }
  });
  /**
   * A message bus instance.
   *  Depending on arguments provided resolves channels and sets of channels (sections).
   * @global
   * @alias Aerobus
   * @param {...string} [names]
   *  The channel names to resolve. If not provided resolves the root channel.
   *  If one provided, resolves corresponding channel.
   *  Otherwise resolves section joining several channels into one logical unit.
   * @return {Channel|Section}
   *  Resolved channel or section.
   * @property {boolean} bubbles
   *  Gets the bubbling state of this bus.
   * @property {string} delimiter
   *  Gets the delimiter string used to split hierarchical channel names.
   * @property {array} channels
   *  Gets the list of existing channels.
   * @property {Channel} error
   *  Gets the error callback.
   * @property {Channel} root
   *  Gets the root channel.
   * @property {function} trace
   *  Gets or sets the trace callback.
   * @throws
   *  If any name is not a string.
   */
  function bus(...names) {
    return getGear(bus).resolve(names);
  }
  /**
   * Enables or disables publication bubbling for this bus depending on value.
   *  Every newly created chanel will inherit this setting.
   * @alias Aerobus#bubble
   * @param {boolean} value
   *  Truthy value to enable bubbling or falsey to disable.
   * @return {function}
   *  This bus.
   */
  function bubble(value = true) {
    getGear(bus).bubble(value);
    return bus;
  }
  /**
   * Empties this bus clearing and removing all existing channels.
   * @alias Aerobus#clear
   * @return {function}
   *  This bus.
   */
  function clear() {
    getGear(bus).clear();
    return bus;
  }
  /**
   * Creates new bus instance which inherits settings from this instance.
   * @alias Aerobus#create
   * @param {...any} [overrides]
   *  The overrides of settings being inherited.
   * @return {function}
   *  New message bus instance.
   */
  function create(...overrides) {
    let overriden = config;
    // iterate all overrides and then with config used to setup this instance.
    for (let i = -1, l = overrides.length; ++i < l;) {
      let override = overrides[i];
      // depending on class of override
      switch(classOf(override)) {
        // use boolean to override 'bubbles' setting
        case CLASS_BOOLEAN:
          overriden.bubbles = override;
          break;
        // use function to override 'error' setting
        case CLASS_FUNCTION:
          overriden.error = override;
          break;
        // use object to override all settings
        case CLASS_OBJECT:
          objectAssign(overriden, override);
          break;
        // use string to override 'delimiter' setting
        case CLASS_STRING:
          if (override.length)
            overriden.delimiter = override;
          else throw errorDelimiterNotValid(override);
          break;
        // class of override is unexpected, throw
        default:
          throw errorArgumentNotValid(override);
      }
    }
    return aerobus(overriden);
  }
  function getBubbles() {
    return getGear(bus).bubbles;
  }
  function getChannels() {
    return Array.from(getGear(bus).channels.values());
  }
  function getDelimiter() {
    return getGear(bus).delimiter;
  }
  function getError() {
    return getGear(bus).error;
  }
  function getRoot() {
    return getGear(bus).get('');
  }
  function getTrace() {
    return getGear(bus).trace;
  }
  function setTrace(value) {
    if (!isFunction(value))
      throw errorTraceNotValid(value);
    getGear(bus).trace = value;
  }
  /**
   * Unsubscribes provided subscribers or names from all channels of this bus.
   * @alias Aerobus#unsubscribe
   * @param {...function|string|Subscriber} [parameters]
   *  Subscribers and/or subscriber names to unsibscribe.
   *  If omitted, unsubscribes all subscribers from all channels.
   * @return {function}
   *  This bus.
   */
  function unsubscribe(...parameters) {
    getGear(bus).unsubscribe(new Unsubscription(parameters));
    return bus;
  }
}

export default aerobus;
