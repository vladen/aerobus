// creates new activity class (abstract base for channels, publications and subscriptions)
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _symbols = require("./symbols");

var _validators = require("./validators");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Activity = (function () {
  function Activity(bus, parent) {
    _classCallCheck(this, Activity);

    this[_symbols.ENABLED] = true;
    this[_symbols.PARENT] = parent;
    bus.trace('create', this);
  }

  _createClass(Activity, [{
    key: "disable",

    // disables this activity
    value: function disable() {
      (0, _validators.validateDisposable)(this);
      if (this[_symbols.ENABLED]) {
        this[_symbols.BUS].trace('disable', this);
        this[_symbols.ENABLED] = false;
      }
      return this;
    }
    // enables this activity

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
