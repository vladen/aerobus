'use strict';


let identities = {}
const classof = Object.classof;

// returns next identity value for specified object by its name or constructor name
export function identity(object) {
  let type = isFunction(object) ? object.name : object.constructor.name,
      id = type in identities ? ++identities[type] : (identities[type] = 1);
  return `${type.toLowerCase()}_${id}`;
}

// type checkers
export const isDate = (value) => classof(value) === 'Date'
 					 , isArray = (value) => classof(value) === 'Array'
 					 , isError = (value) => classof(value) === 'Error'
 					 , isNumber = (value) => classof(value) === 'Number'
 					 , isString = (value) => classof(value) === 'String'
 					 , isChannel = (value) => classof(value) === 'Channel'
 					 , isSection = (value) => classof(value) === 'Section'
 					 , isMessage = (value) => classof(value) === 'Message'
 					 , isFunction = (value) => classof(value) === 'Function'
 					 , isDefined = (value) => value !== undefined
 					 , isUndefined = (value) => value === undefined;

// utility functions
export function noop() {}
