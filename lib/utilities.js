'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.utilities = mod.exports;
  }
})(this, function (exports) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.identity = identity;
  exports.noop = noop;
  var identities = {};
  var classof = Object.classof;

  function identity(object) {
    var type = isFunction(object) ? object.name : object.constructor.name,
        id = type in identities ? ++identities[type] : identities[type] = 1;
    return type.toLowerCase() + '_' + id;
  }

  var isDate = exports.isDate = function isDate(value) {
    return classof(value) === 'Date';
  },
      isArray = exports.isArray = function isArray(value) {
    return classof(value) === 'Array';
  },
      isError = exports.isError = function isError(value) {
    return classof(value) === 'Error';
  },
      isNumber = exports.isNumber = function isNumber(value) {
    return classof(value) === 'Number';
  },
      isString = exports.isString = function isString(value) {
    return classof(value) === 'String';
  },
      isChannel = exports.isChannel = function isChannel(value) {
    return classof(value) === 'Channel';
  },
      isSection = exports.isSection = function isSection(value) {
    return classof(value) === 'Section';
  },
      isMessage = exports.isMessage = function isMessage(value) {
    return classof(value) === 'Message';
  },
      isFunction = exports.isFunction = function isFunction(value) {
    return classof(value) === 'Function';
  },
      isDefined = exports.isDefined = function isDefined(value) {
    return value !== undefined;
  },
      isUndefined = exports.isUndefined = function isUndefined(value) {
    return value === undefined;
  };

  function noop() {}
});
