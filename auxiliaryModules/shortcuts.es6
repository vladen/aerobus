// shortcuts to native utility methods
'use strict';

export const _ArrayMap = Array.prototype.map
           , _ArraySlice = Array.prototype.slice
           , _clearInterval = clearInterval
           , _clearTimeout = clearTimeout
           , _ObjectCreate = Object.create
           , _ObjectDefineProperties = Object.defineProperties
           , _ObjectDefineProperty = Object.defineProperty
           , _ObjectKeys = Object.keys
           , _setImmediate = typeof setImmediate === 'function'
             ? setImmediate
              : typeof process === 'object' && isFunction(process.nextTick)
                ? process.nextTick
                : function(callback) {
                  return _setTimeout(callback, 0);
               }
           , _setInterval = setInterval
           , _setTimeout = setTimeout;