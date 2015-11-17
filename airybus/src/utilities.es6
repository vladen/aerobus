'use strict';

let identities = {}
  , classof = Object.classof;


// returns next identity value for specified object by its name or constructor name
export function identity(object) {
  let type = isFunction(object) ? object.name : object.constructor.name,
      id = type in identities ? ++identities[type] : (identities[type] = 1);
  return `${type.toLowerCase()}_${id}`;
}

// type checkers
export isDate = (value) => classof(value) === 'Date';
export isArray = (value) => classof(value) === 'Array';
export isError = (value) => classof(value) === 'Error';
export isNumber = (value) => classof(value) === 'Number';
export isString = (value) => classof(value) === 'String';
export isChannel = (value) => classof(value) === 'Channel';
export isMessage = (value) => classof(value) === 'Message';
export isFunction = (value) => classof(value) === 'Function';
export isSubscription = (value) => classof(value) === 'Subscription';

export function isDefined(value) {
  return value !== undefined;
}
export function isUndefined(value) {
  return value === undefined;
}


// utility functions
export function noop() {}
