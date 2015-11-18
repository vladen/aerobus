// creates new activity class (abstract base for channels, publications and subscriptions)
'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./symbols", "./validators"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./symbols"), require("./validators"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.symbols, global.validators);
    global.Activity = mod.exports;
  }
})(this, function (exports, _symbols, _validators) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = (function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  })();

  var Activity = (function () {
    function Activity(bus, parent) {
      _classCallCheck(this, Activity);

      this[_symbols.ENABLED] = true;
      this[_symbols.PARENT] = parent;
      bus.trace('create', this);
    }

    _createClass(Activity, [{
      key: "disable",
      value: function disable() {
        (0, _validators.validateDisposable)(this);

        if (this[_symbols.ENABLED]) {
          this[_symbols.BUS].trace('disable', this);

          this[_symbols.ENABLED] = false;
        }

        return this;
      }
    }, {
      key: "enable",
      value: function enable() {
        var _enable = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        if (!_enable) return this.disable();
        (0, _validators.validateDisposable)(this);

        if (!this[_symbols.ENABLED]) {
          this[_symbols.BUS].trace('enable', this);

          this[_symbols.ENABLED] = true;
        }

        return this;
      }
    }, {
      key: "isEnabled",
      get: function get() {
        return this[_symbols.ENABLED] && (!this[_symbols.PARENT] || this[_symbols.PARENT].isEnabled);
      }
    }]);

    return Activity;
  })();

  exports.default = Activity;
});
