'use strict';

import BusGear
  from './busGear';
import Config
  from './config';
import { errorTraceNotValid }
  from './errors';
import { CLASS, CLASS_AEROBUS }
  from './symbols';
import Unsubscription
  from './unsubscription';
import { getGear, setGear, isFunction, objectDefineProperties, extend }
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
 *  and extesions for internal classes (channel, message, plan and section).
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
  const config = new Config(options);
  // keep the stuff implementing bus in the private storage
  setGear(bus, new BusGear(config));
  // extend bus function with additional API members
  let mainBus = objectDefineProperties(bus, {
    [CLASS]: { value: CLASS_AEROBUS }
  , bubble: { value: bubble }
  , bubbles: { get: getBubbles }
  , clear: { value: clear }
  , config: { value: config }
  , create: { value: create }
  , channels: { get: getChannels }
  , delimiter: { get: getDelimiter }
  , error: { get: getError }
  , root: { get: getRoot }
  , trace: { get: getTrace, set: setTrace }
  , unsubscribe: { value: unsubscribe }
  });
  // extend main bus module with user defined extensions
  return extend(mainBus, config.aerobus);
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
    return aerobus(config.override(overrides));
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
    if (!isFunction(value)) throw errorTraceNotValid(value);
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
