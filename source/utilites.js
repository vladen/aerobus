'use strict';

import { errorGearNotFound }
  from './errors';
import { CLASS_ARRAY, CLASS_FUNCTION, CLASS_NUMBER, CLASS_OBJECT, CLASS_STRING }
  from './symbols';

// standard APIs shortcuts
export const objectAssign = Object.assign;
export const objectCreate = Object.create;
export const objectDefineProperties = Object.defineProperties;
export const objectDefineProperty = Object.defineProperty;
export const objectFreeze = Object.freeze;
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
const objectToString = Object.prototype.toString;
export const classOf = value => objectToString.call(value).slice(8, -1);
export const classIs = className => value => classOf(value) === className;
export const isArray = classIs(CLASS_ARRAY);
export const isFunction = classIs(CLASS_FUNCTION);
export const isNumber = classIs(CLASS_NUMBER);
export const isObject = classIs(CLASS_OBJECT);
export const isString = classIs(CLASS_STRING);
export const noop = () => {};
export const truthy = () => true;

// shared storage, getter and setter for all private assets
const gears = new WeakMap;
export const getGear = key => {
  let gear = gears.get(key);
  if (isNothing(gear))
    throw errorGearNotFound(key);
  return gear;
};
export const setGear = (key, gear) => {
  if (isSomething(gear))
    gears.set(key, gear);
  else gears.delete(key, gear);
};
