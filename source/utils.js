'use strict';

// class names
export const CLASS_AEROBUS = 'Aerobus';
export const CLASS_AEROBUS_CHANNEL = CLASS_AEROBUS + '.Channel';
export const CLASS_AEROBUS_FORWARDING = CLASS_AEROBUS + '.Forwarding';
export const CLASS_AEROBUS_ITERATOR = CLASS_AEROBUS + '.Iterator';
export const CLASS_AEROBUS_MESSAGE = CLASS_AEROBUS + '.Message';
export const CLASS_AEROBUS_SECTION = CLASS_AEROBUS + '.Section';
export const CLASS_AEROBUS_STRATEGY_CYCLE = CLASS_AEROBUS + '.Strategy.Cycle';
export const CLASS_AEROBUS_STRATEGY_SHUFFLE = CLASS_AEROBUS + '.Strategy.Shuffle';
export const CLASS_AEROBUS_SUBSCRIBER = CLASS_AEROBUS + '.Subscriber';
export const CLASS_AEROBUS_SUBSCRIPTION = CLASS_AEROBUS + '.Subscription';
export const CLASS_AEROBUS_UNSUBSCRIPTION = CLASS_AEROBUS + '.Unsubscription';
export const CLASS_AEROBUS_WHEN = CLASS_AEROBUS + '.When';
export const CLASS_ARRAY = 'Array';
export const CLASS_BOOLEAN = 'Boolean';
export const CLASS_FUNCTION = 'Function';
export const CLASS_NUMBER = 'Number';
export const CLASS_REGEXP = 'RegExp';
export const CLASS_OBJECT = 'Object';
export const CLASS_STRING = 'String';
// well-known symbols
export const $CLASS = Symbol.toStringTag;
// export const $ITERATOR = Symbol.iterator;
export const $PROTOTYPE = 'prototype';
// standard APIs shortcuts
export const objectAssign = Object.assign;
export const objectCreate = Object.create;
export const objectDefineProperties = Object.defineProperties;
export const objectDefineProperty = Object.defineProperty;
export const objectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
export const objectGetOwnPropertyNames = Object.getOwnPropertyNames;
export const mathFloor = Math.floor;
export const mathMax = Math.max;
export const mathMin = Math.min;
export const mathRandom = Math.random;
export const maxSafeInteger = Number.MAX_SAFE_INTEGER;
// utility functions
export const isNothing = value => value == null;
export const isSomething = value => value != null;
export const extend = (target, source) => {
    if (isNothing(source)) return target;
    let names = objectGetOwnPropertyNames(source);
    for (let i = names.length - 1; i >= 0; i--){
      let name = names[i];
      if (name in target) continue;
      objectDefineProperty(target, name, objectGetOwnPropertyDescriptor(source, name));
    }
    return target;
  };
export const finalize = (collection, error) => {
    for (let i = collection.length; i--;) {
      try {
        collection[i].done();
      }
      catch (e) {
        setImmediate(() => error(e));
      }
      collection[i] = null;
    }
  };
export const classOf = value => Object.prototype.toString.call(value).slice(8, -1);
export const classIs = className => value => classOf(value) === className;
export const isArray = classIs(CLASS_ARRAY);
export const isFunction = classIs(CLASS_FUNCTION);
export const isNumber = classIs(CLASS_NUMBER);
export const isObject = classIs(CLASS_OBJECT);
export const isString = classIs(CLASS_STRING);
export const noop = () => {};
export const truthy = () => true;
// error builders
export const errorArgumentNotValid = value =>
    new TypeError(`Argument of type "${classOf(value)}" is not expected.`);
export const errorCallbackNotValid = value =>
    new TypeError(`Callback expected to be a function, not "${classOf(value)}".`);
export const errorChannelExtensionNotValid = value =>
    new TypeError(`Channel class extensions expected to be an object, not "${value}".`);
export const errorDelimiterNotValid = value =>
    new TypeError(`Delimiter expected to be not empty string, not "${value}".`);
export const errorDependencyNotValid = () =>
    new TypeError(`Dependency expected to be a channel name.`);
export const errorErrorNotValid = value =>
    new TypeError(`Error expected to be a function, not "${classOf(value)}".`);
export const errorForwarderNotValid = () =>
    new TypeError(`Forwarder expected to be a function or a channel name.`);
export const errorGearNotFound = value =>
    new Error(`This instance of "${classOf(value)}"" has been deleted.`);
export const errorMessageExtensionNotValid = value =>
    new TypeError(`Message class extensions expected to be an object, not "${value}".`);
export const errorNameNotValid = value =>
    new TypeError(`Name expected to be a string, not "${classOf(value)}".`);
export const errorOrderNotValid = value =>
    new TypeError(`Order expected to be a number, not "${classOf(value)}".`);
export const errorSectionExtensionNotValid = value =>
    new TypeError(`Section class extensions expected to be an object, not "${value}".`);
export const errorSubscriberNotValid = () =>
    new TypeError(`Subscriber expected to be a function or an object having "next" and optional "done" methods.`);
export const errorTraceNotValid = value =>
    new TypeError(`Trace expected to be a function, not "${classOf(value)}".`);
export const errorWhenExtensionNotValid = value =>
  new TypeError(`When class extensions expected to be an object, not "${value}".`);
// shared storage, getter and setter for all private assets
export const gears = new WeakMap;
export const getGear = key => {
    let gear = gears.get(key);
    if (isNothing(gear)) throw errorGearNotFound(key);
    return gear;
  };
export const setGear = (key, gear) => {
    if (isSomething(gear)) gears.set(key, gear);
    else gears.delete(key, gear);
  };
