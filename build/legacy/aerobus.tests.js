'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'chai', 'aerobus'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('chai'), require('aerobus'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.chai, global.aerobus);
    global.aerobusTests = mod.exports;
  }
})(this, function (exports, _chai, _aerobus) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.aerobusFactoryTests = exports.aerobusInstanceTests = exports.channelTests = exports.messageTests = exports.sectionTests = undefined;

  var _aerobus2 = _interopRequireDefault(_aerobus);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var aerobusFactoryTests = describe('aerobus', function () {
    it('is function', function () {
      _chai.assert.isFunction(_aerobus2.default);
    });
    describe('aerobus()', function () {
      it('returns instance of Aerobus', function () {
        _chai.assert.typeOf((0, _aerobus2.default)(), 'Aerobus');
      });
      describe('#bubbles', function () {
        it('is initially true', function () {
          _chai.assert.isTrue((0, _aerobus2.default)().bubbles);
        });
      });
      describe('#delimiter', function () {
        it('is initially "."', function () {
          _chai.assert.strictEqual((0, _aerobus2.default)().delimiter, '.');
        });
      });
    });
    describe('aerobus(@boolean)', function () {
      it('returns instance of Aerobus', function () {
        _chai.assert.typeOf((0, _aerobus2.default)(false), 'Aerobus');
      });
      describe('@boolean', function () {
        it('Aerobus.#bubbles gets @boolean', function () {
          var bubbles = false,
              bus = (0, _aerobus2.default)(bubbles);

          _chai.assert.strictEqual(bus.bubbles, bubbles);
        });
      });
    });
    describe('aerobus(@function)', function () {
      it('returns instance of Aerobus', function () {
        _chai.assert.typeOf((0, _aerobus2.default)(function () {}), 'Aerobus');
      });
      describe('@function', function () {
        it('Aerobus.#error gets @function', function () {
          var error = function error() {};

          _chai.assert.strictEqual((0, _aerobus2.default)(error).error, error);
        });
      });
    });
    describe('aerobus(@object)', function () {
      it('returns instance of Aerobus', function () {
        _chai.assert.typeOf((0, _aerobus2.default)({}), 'Aerobus');
      });
      it('Aerobus.#bubbles gets @object.bubbles', function () {
        var bubbles = false,
            bus = (0, _aerobus2.default)({
          bubbles: bubbles
        });

        _chai.assert.strictEqual(bus.bubbles, bubbles);
      });
      it('throws @object.delimiter is empty string or not a string', function () {
        ['', [], true, new Date(), function () {}, 1, {}].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)({
              delimiter: value
            });
          });
        });
      });
      it('Aerobus.#delimiter gets @object.delimiter', function () {
        var delimiter = ':',
            bus = (0, _aerobus2.default)({
          delimiter: delimiter
        });

        _chai.assert.strictEqual(bus.delimiter, delimiter);
      });
      it('throws if @object.error is not a function', function () {
        ['', [], true, new Date(), 1, {}].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)({
              error: value
            });
          });
        });
      });
      it('Aerobus.#error gets @object.error', function () {
        var error = function error() {},
            bus = (0, _aerobus2.default)({
          error: error
        });

        _chai.assert.strictEqual(bus.error, error);
      });
      it('throws if @object.trace is not a function', function () {
        ['', [], true, new Date(), 1, {}].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)({
              trace: value
            });
          });
        });
      });
      it('Aerobus.#trace gets @object.trace', function () {
        var trace = function trace() {},
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        _chai.assert.strictEqual(bus.trace, trace);
      });
      describe('@object.channel', function () {
        it('extends Aerobus.Channel instances', function () {
          var extension = function extension() {},
              bus = (0, _aerobus2.default)({
            channel: {
              extension: extension
            }
          });

          _chai.assert.strictEqual(bus.root.extension, extension);

          _chai.assert.strictEqual(bus('custom').extension, extension);
        });
        it('preserves standard members', function () {
          var extensions = {
            bubble: null,
            bubbles: null,
            clear: null,
            enable: null,
            enabled: null,
            publish: null,
            reset: null,
            retain: null,
            retentions: null,
            subscribe: null,
            subscribers: null,
            toggle: null,
            unsubscribe: null
          },
              bus = (0, _aerobus2.default)({
            channel: extensions
          });
          Object.keys(extensions).forEach(function (key) {
            return _chai.assert.isNotNull(bus.root[key]);
          });
        });
      });
      describe('@object.message', function () {
        it('extends Aerobus.Message instances', function () {
          var extension = function extension() {},
              bus = (0, _aerobus2.default)({
            message: {
              extension: extension
            }
          }),
              result = undefined,
              subscriber = function subscriber(_, message) {
            return result = message.extension;
          };

          bus.root.subscribe(subscriber).publish();

          _chai.assert.strictEqual(result, extension);
        });
        it('preserves standard members', function () {
          var extensions = {
            cancel: null,
            destination: null,
            data: null,
            route: null
          },
              bus = (0, _aerobus2.default)({
            message: extensions
          }),
              result = undefined,
              subscriber = function subscriber(_, message) {
            return result = message;
          };

          bus.root.subscribe(subscriber).publish({});
          Object.keys(extensions).forEach(function (key) {
            return _chai.assert.isNotNull(result[key]);
          });
        });
      });
      describe('@object.section', function () {
        it('extends Aerobus.Section instances', function () {
          var extension = function extension() {},
              bus = (0, _aerobus2.default)({
            section: {
              extension: extension
            }
          });

          _chai.assert.strictEqual(bus('', 'test').extension, extension);

          _chai.assert.strictEqual(bus('', 'test0', 'test1').extension, extension);
        });
        it('preserves standard members', function () {
          var extensions = {
            bubble: null,
            channels: null,
            clear: null,
            enable: null,
            publish: null,
            reset: null,
            retain: null,
            subscribe: null,
            toggle: null,
            unsubscribe: null
          },
              bus = (0, _aerobus2.default)({
            channel: extensions
          });
          Object.keys(extensions).forEach(function (key) {
            return _chai.assert.isNotNull(bus('', 'test')[key]);
          });
        });
      });
    });
    describe('aerobus(@string)', function () {
      it('throws if @string is empty', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)('');
        });
      });
      it('returns instance of Aerobus', function () {
        _chai.assert.typeOf((0, _aerobus2.default)(':'), 'Aerobus');
      });
      it('Aerobus.#delimiter gets @string', function () {
        var delimiter = ':';

        _chai.assert.strictEqual((0, _aerobus2.default)(delimiter).delimiter, delimiter);
      });
    });
    describe('aerobus(@boolean, @function, @string)', function () {
      it('returns instance of Aerobus', function () {
        _chai.assert.typeOf((0, _aerobus2.default)(false, function () {}, ':'), 'Aerobus');
      });
      it('Aerobus.#bubbles gets @boolean', function () {
        var bubbles = false;

        _chai.assert.strictEqual((0, _aerobus2.default)(bubbles, function () {}, ':').bubbles, bubbles);
      });
      it('Aerobus.#error gets @function', function () {
        var error = function error() {};

        _chai.assert.strictEqual((0, _aerobus2.default)(false, error, ':').error, error);
      });
      it('Aerobus.#delimiter gets @string', function () {
        var delimiter = ':';

        _chai.assert.strictEqual((0, _aerobus2.default)(false, function () {}, delimiter).delimiter, delimiter);
      });
    });
    describe('aerobus(!(@boolean | @function | @object | @string))', function () {
      it('throws', function () {
        [[], new Date(), 42].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)(value);
          });
        });
      });
    });
  });
  var aerobusInstanceTests = describe('Aerobus', function () {
    describe('is function', function () {
      _chai.assert.instanceOf((0, _aerobus2.default)(), Function);
    });
    describe('#()', function () {
      it('returns instance of Aerobus.Channel', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.typeOf(bus(), 'Aerobus.Channel');
      });
      it('returns #root channel', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus();

        _chai.assert.strictEqual(channel, bus.root);
      });
    });
    describe('#("")', function () {
      it('returns instance of Aerobus.Channel', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.typeOf(bus(''), 'Aerobus.Channel');
      });
      it('returns #root channel', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('');

        _chai.assert.strictEqual(channel, bus.root);
      });
    });
    describe('#(@string)', function () {
      it('returns instance of Aerobus.Channel', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.typeOf(bus('test'), 'Aerobus.Channel');
      });
      it('Channel.#name gets @string', function () {
        var bus = (0, _aerobus2.default)(),
            name = 'test';

        _chai.assert.strictEqual(bus(name).name, name);
      });
    });
    describe('#(...@strings)', function () {
      it('returns instance of Aerobus.Section', function () {
        _chai.assert.typeOf((0, _aerobus2.default)()('test1', 'test2'), 'Aerobus.Section');
      });
      it('Section.#channels include all specified channels', function () {
        var names = ['test1', 'test2'],
            section = (0, _aerobus2.default)().apply(undefined, names);

        _chai.assert.strictEqual(section.channels[0].name, names[0]);

        _chai.assert.strictEqual(section.channels[1].name, names[1]);
      });
    });
    describe('#(!@string)', function () {
      it('throws', function () {
        [[], true, new Date(), 42, {}].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)()(value);
          });
        });
      });
    });
    describe('#bubble()', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.bubble(), bus);
      });
      it('sets #bubbles', function () {
        var bus = (0, _aerobus2.default)(false);
        bus.bubble();

        _chai.assert.isTrue(bus.bubbles);
      });
    });
    describe('#bubble(false)', function () {
      it('clears #bubbles', function () {
        var bus = (0, _aerobus2.default)();
        bus.bubble(false);

        _chai.assert.isFalse(bus.bubbles);
      });
    });
    describe('#bubbles', function () {
      it('is boolean', function () {
        _chai.assert.isBoolean((0, _aerobus2.default)().bubbles);
      });
    });
    describe('#channels', function () {
      it('is array', function () {
        _chai.assert.isArray((0, _aerobus2.default)().channels);
      });
      it('is initially empty', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().channels.length, 0);
      });
      it('contains root channel after it has been resolved', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus.root;

        _chai.assert.include(bus.channels, channel);
      });
      it('contains custom channel after it has been resolved', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.include(bus.channels, channel);
      });
      it('contains several channels after they have been resolved', function () {
        var bus = (0, _aerobus2.default)(),
            channel0 = bus.root,
            channel1 = bus('test'),
            channel2 = bus('parent.child');

        _chai.assert.include(bus.channels, channel0);

        _chai.assert.include(bus.channels, channel1);

        _chai.assert.include(bus.channels, channel2);
      });
    });
    describe('#clear()', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.clear(), bus);
      });
      it('empties #channels', function () {
        var bus = (0, _aerobus2.default)(),
            channel0 = bus.root,
            channel1 = bus.error,
            channel2 = bus('test');
        bus.clear();

        _chai.assert.strictEqual(bus.channels.length, 0);

        _chai.assert.notInclude(bus.channels, channel0);

        _chai.assert.notInclude(bus.channels, channel1);

        _chai.assert.notInclude(bus.channels, channel2);
      });
      it('new instance of Channel is resolved for same name hereafter', function () {
        var bus = (0, _aerobus2.default)(),
            channel0 = bus.root,
            channel1 = bus.error,
            channel2 = bus('test');
        bus.clear();

        _chai.assert.notStrictEqual(bus(channel0.name), channel0);

        _chai.assert.notStrictEqual(bus(channel1.name), channel1);

        _chai.assert.notStrictEqual(bus(channel2.name), channel2);
      });
    });
    describe('#create()', function () {
      it('returns new Aerobus instance', function () {
        _chai.assert.typeOf((0, _aerobus2.default)().create(), 'Aerobus');
      });
      it('new Aerobus inherits #bubbles', function () {
        var bubbles = false;

        _chai.assert.strictEqual((0, _aerobus2.default)(bubbles).create().bubbles, bubbles);
      });
      it('new Aerobus inherits #delimiter', function () {
        var delimiter = ':';

        _chai.assert.strictEqual((0, _aerobus2.default)(delimiter).create().delimiter, delimiter);
      });
      it('new Aerobus inherits #error', function () {
        var error = function error() {};

        _chai.assert.strictEqual((0, _aerobus2.default)(error).create().error, error);
      });
      it('new Aerobus inherits #trace', function () {
        var trace = function trace() {};

        _chai.assert.strictEqual((0, _aerobus2.default)({
          trace: trace
        }).create().trace, trace);
      });
      it('new Aerobus inherits Aerobus.Channel class extensions', function () {
        var extension = function extension() {};

        _chai.assert.strictEqual((0, _aerobus2.default)({
          channel: {
            extension: extension
          }
        }).create().root.extension, extension);
      });
      it('new Aerobus inherits Aerobus.Message class extensions', function () {
        var extension = function extension() {},
            result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message;
        };

        (0, _aerobus2.default)({
          message: {
            extension: extension
          }
        }).create().root.subscribe(subscriber).publish();

        _chai.assert.strictEqual(result.extension, extension);
      });
      it('new Aerobus inherits Aerobus.Section class extensions', function () {
        var extension = function extension() {};

        _chai.assert.strictEqual((0, _aerobus2.default)({
          section: {
            extension: extension
          }
        }).create()('test0', 'test1').extension, extension);
      });
    });
    describe('#delimiter', function () {
      it('is string', function () {
        _chai.assert.isString((0, _aerobus2.default)().delimiter);
      });
      it('is read-only', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)().delimiter = null;
        });
      });
    });
    describe('#error', function () {
      it('is a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().error);
      });
      it('is read-only', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)().error = null;
        });
      });
      it('is invoked with error thrown in subscriber', function (done) {
        var result = undefined,
            error = new Error(),
            bus = (0, _aerobus2.default)({
          error: function error(err) {
            return result = err;
          }
        });
        bus.root.subscribe(function () {
          throw error;
        }).publish();
        setImmediate(function () {
          _chai.assert.strictEqual(result, error);

          done();
        });
      });
    });
    describe('#root', function () {
      it('is instance of Aerobus.Channel', function () {
        _chai.assert.typeOf((0, _aerobus2.default)().root, 'Aerobus.Channel');
      });
      it('is read-only', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)().root = null;
        });
      });
    });
    describe('#trace', function () {
      it('is function', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.isFunction(bus.trace);
      });
      it('is read-write', function () {
        var trace = function trace() {},
            bus = (0, _aerobus2.default)();

        bus.trace = trace;

        _chai.assert.strictEqual(bus.trace, trace);
      });
      it('is called from channel.bubble() with arguments ("bubble", channel, true)', function () {
        var results = [],
            trace = function trace() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.bubble(true);

        _chai.assert.strictEqual(results[0], 'bubble');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], true);
      });
      it('is called from channel.bubble(false) with arguments ("bubble", channel, false)', function () {
        var results = [],
            trace = function trace() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.bubble(false);

        _chai.assert.strictEqual(results[0], 'bubble');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], false);
      });
      it('is called from channel.clear() with arguments ("clear", channel)', function () {
        var results = [],
            trace = function trace() {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.clear();

        _chai.assert.strictEqual(results[0], 'clear');

        _chai.assert.strictEqual(results[1], bus.root);
      });
      it('is called from channel.cycle() with arguments ("cycle", channel, 1, 1)', function () {
        var results = [],
            trace = function trace() {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.cycle();

        _chai.assert.strictEqual(results[0], 'cycle');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], 1);

        _chai.assert.strictEqual(results[3], 1);
      });
      it('is called from channel.cycle(2) with arguments ("cycle", channel, 2, 2)', function () {
        var results = [],
            trace = function trace() {
          for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.cycle(2);

        _chai.assert.strictEqual(results[0], 'cycle');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], 2);

        _chai.assert.strictEqual(results[3], 2);
      });
      it('is called from channel.cycle(2, 1) with arguments ("cycle", channel, 2, 1)', function () {
        var results = [],
            trace = function trace() {
          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.cycle(2, 1);

        _chai.assert.strictEqual(results[0], 'cycle');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], 2);

        _chai.assert.strictEqual(results[3], 1);
      });
      it('is called from channel.enable() with arguments ("enable", channel, true)', function () {
        var results = [],
            trace = function trace() {
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.enable();

        _chai.assert.strictEqual(results[0], 'enable');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], true);
      });
      it('is called from channel.enable(false) with arguments ("enable", channel, false)', function () {
        var results = [],
            trace = function trace() {
          for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.enable(false);

        _chai.assert.strictEqual(results[0], 'enable');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], false);
      });
      it('is called from channel.forward(@string) with arguments ("forward", channel, array) where array contains @string', function () {
        var results = [],
            forwarder = 'test',
            trace = function trace() {
          for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            args[_key9] = arguments[_key9];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.forward(forwarder);

        _chai.assert.strictEqual(results[0], 'forward');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.include(results[2], forwarder);
      });
      it('is called from channel.publish(@data) with arguments ("publish", channel, @data)', function () {
        var data = {},
            results = [],
            trace = function trace() {
          for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            args[_key10] = arguments[_key10];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.publish(data);

        _chai.assert.strictEqual(results[0], 'publish');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], data);
      });
      it('is called from channel.reset() with arguments ("reset", channel)', function () {
        var results = [],
            trace = function trace() {
          for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.reset();

        _chai.assert.strictEqual(results[0], 'reset');

        _chai.assert.strictEqual(results[1], bus.root);
      });
      it('is called from channel.retain(@limit) with arguments ("retain", channel, @limit)', function () {
        var limit = 42,
            results = [],
            trace = function trace() {
          for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            args[_key12] = arguments[_key12];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.retain(limit);

        _chai.assert.strictEqual(results[0], 'retain');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], limit);
      });
      it('is called from channel.shuffle() with arguments ("shuffle", channel, 1)', function () {
        var results = [],
            trace = function trace() {
          for (var _len13 = arguments.length, args = Array(_len13), _key13 = 0; _key13 < _len13; _key13++) {
            args[_key13] = arguments[_key13];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.shuffle();

        _chai.assert.strictEqual(results[0], 'shuffle');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], 1);
      });
      it('is called from channel.shuffle(2) with arguments ("shuffle", channel, 2)', function () {
        var results = [],
            trace = function trace() {
          for (var _len14 = arguments.length, args = Array(_len14), _key14 = 0; _key14 < _len14; _key14++) {
            args[_key14] = arguments[_key14];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.shuffle(2);

        _chai.assert.strictEqual(results[0], 'shuffle');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.strictEqual(results[2], 2);
      });
      it('is called from channel.subscribe(@parameters) with arguments ("subscribe", channel, @parameters)', function () {
        var _bus$root;

        var parameters = [function () {}],
            results = [],
            trace = function trace() {
          for (var _len15 = arguments.length, args = Array(_len15), _key15 = 0; _key15 < _len15; _key15++) {
            args[_key15] = arguments[_key15];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        (_bus$root = bus.root).subscribe.apply(_bus$root, parameters);

        _chai.assert.strictEqual(results[0], 'subscribe');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.includeMembers(results[2], parameters);
      });
      it('is called from channel.toggle() with arguments ("toggle", channel)', function () {
        var results = [],
            trace = function trace() {
          for (var _len16 = arguments.length, args = Array(_len16), _key16 = 0; _key16 < _len16; _key16++) {
            args[_key16] = arguments[_key16];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        bus.root.toggle();

        _chai.assert.strictEqual(results[0], 'toggle');

        _chai.assert.strictEqual(results[1], bus.root);
      });
      it('is called from channel.unsubscribe(@parameters) with arguments ("unsubscribe", channel, @parameters)', function () {
        var _bus$root2;

        var parameters = [function () {}],
            results = [],
            trace = function trace() {
          for (var _len17 = arguments.length, args = Array(_len17), _key17 = 0; _key17 < _len17; _key17++) {
            args[_key17] = arguments[_key17];
          }

          return results = args;
        },
            bus = (0, _aerobus2.default)({
          trace: trace
        });

        (_bus$root2 = bus.root).unsubscribe.apply(_bus$root2, parameters);

        _chai.assert.strictEqual(results[0], 'unsubscribe');

        _chai.assert.strictEqual(results[1], bus.root);

        _chai.assert.includeMembers(results[2], parameters);
      });
    });
    describe('#unsubscribe()', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)(),
            subscriber = function subscriber() {};

        _chai.assert.strictEqual(bus.unsubscribe(subscriber), bus);
      });
      it('clears #subscribers of all channels', function () {
        var bus = (0, _aerobus2.default)(),
            channel0 = bus.root,
            channel1 = bus('test1'),
            channel2 = bus('test2'),
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel0.subscribe(subscriber0, subscriber1);
        channel1.subscribe(subscriber0);
        channel2.subscribe(subscriber1);
        bus.unsubscribe();

        _chai.assert.strictEqual(channel0.subscribers.length, 0);

        _chai.assert.strictEqual(channel1.subscribers.length, 0);

        _chai.assert.strictEqual(channel2.subscribers.length, 0);
      });
    });
    describe('#unsubscribe(@function)', function () {
      it('removes @function from #subscribers of all channels', function () {
        var bus = (0, _aerobus2.default)(),
            channel1 = bus('test1'),
            channel2 = bus('test2'),
            subscriber = function subscriber() {};

        channel1.subscribe(subscriber);
        channel2.subscribe(subscriber);
        bus.unsubscribe(subscriber);

        _chai.assert.notInclude(channel1.subscribers.map(function (existing) {
          return existing.next;
        }), subscriber);

        _chai.assert.notInclude(channel2.subscribers.map(function (existing) {
          return existing.next;
        }), subscriber);
      });
    });
    describe('#unsubscribe(...@functions)', function () {
      it('removes @functions from #subscribers of all channels', function () {
        var bus = (0, _aerobus2.default)(),
            channel1 = bus('test1'),
            channel2 = bus('test2'),
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel1.subscribe(subscriber1, subscriber2);
        channel2.subscribe(subscriber1, subscriber2);
        bus.unsubscribe(subscriber1, subscriber2);

        _chai.assert.notInclude(channel1.subscribers.map(function (existing) {
          return existing.next;
        }), subscriber1);

        _chai.assert.notInclude(channel1.subscribers.map(function (existing) {
          return existing.next;
        }), subscriber2);

        _chai.assert.notInclude(channel2.subscribers.map(function (existing) {
          return existing.next;
        }), subscriber1);

        _chai.assert.notInclude(channel2.subscribers.map(function (existing) {
          return existing.next;
        }), subscriber2);
      });
    });
  });
  var channelTests = describe('Aerobus.Channel', function () {
    describe('#bubble()', function () {
      it('is fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.bubble(), channel);
      });
      it('sets #bubbles', function () {
        var channel = (0, _aerobus2.default)(false).root;
        channel.bubble();

        _chai.assert.isTrue(channel.bubbles);
      });
    });
    describe('#bubble(false)', function () {
      it('clears #bubbles', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.bubble(false);

        _chai.assert.isFalse(channel.bubbles);
      });
    });
    describe('#bubbles', function () {
      it('is boolean', function () {
        _chai.assert.isBoolean((0, _aerobus2.default)().root.bubbles);
      });
      it('is initially true', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.bubbles);
      });
      it('is inherited from bus config', function () {
        _chai.assert.isTrue((0, _aerobus2.default)(true).root.bubbles);

        _chai.assert.isTrue((0, _aerobus2.default)({
          bubbles: true
        }).root.bubbles);

        _chai.assert.isFalse((0, _aerobus2.default)(false).root.bubbles);

        _chai.assert.isFalse((0, _aerobus2.default)({
          bubbles: false
        }).root.bubbles);
      });
    });
    describe('#clear()', function () {
      it('is fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.clear(), channel);
      });
      it('clears #retentions', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain().publish().clear();

        _chai.assert.strictEqual(channel.retentions.length, 0);
      });
      it('clears #subscribers', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.subscribe(function () {}).clear();

        _chai.assert.strictEqual(channel.subscribers.length, 0);
      });
    });
    describe('#cycle()', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.cycle(), bus.root);
      });
      it('sets #strategy to instance of Aerobus.Strategy.Cycle', function () {
        _chai.assert.typeOf((0, _aerobus2.default)().root.cycle().strategy, 'Aerobus.Strategy.Cycle');
      });
      it('sets #strategy.limit to 1', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.cycle().strategy.limit, 1);
      });
      it('sets #strategy.name to "cycle"', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.cycle().strategy.name, 'cycle');
      });
      it('sets #strategy.step to 1', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.cycle().strategy.step, 1);
      });
      it('makes channel to deliver publication sequentially', function () {
        var result0 = 0,
            result1 = 0,
            subscriber0 = function subscriber0() {
          return ++result0;
        },
            subscriber1 = function subscriber1() {
          return ++result1;
        };

        (0, _aerobus2.default)().root.cycle().subscribe(subscriber0, subscriber1).publish().publish().publish();

        _chai.assert.strictEqual(result0, 2);

        _chai.assert.strictEqual(result1, 1);
      });
    });
    describe('#cycle(2)', function () {
      it('sets #strategy.limit to 2', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.cycle(2).strategy.limit, 2);
      });
      it('sets #strategy.step to 2', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.cycle(2).strategy.step, 2);
      });
      it('makes channel to deliver publication sequentially to pair of subscribers stepping two subscribers at once', function () {
        var result0 = 0,
            result1 = 0,
            result2 = 0,
            subscriber0 = function subscriber0() {
          return ++result0;
        },
            subscriber1 = function subscriber1() {
          return ++result1;
        },
            subscriber2 = function subscriber2() {
          return ++result2;
        };

        (0, _aerobus2.default)().root.cycle(2).subscribe(subscriber0, subscriber1, subscriber2).publish().publish();

        _chai.assert.strictEqual(result0, 2);

        _chai.assert.strictEqual(result1, 1);

        _chai.assert.strictEqual(result2, 1);
      });
    });
    describe('#cycle(2, 1)', function () {
      it('sets #strategy.limit to 2', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.cycle(2, 1).strategy.limit, 2);
      });
      it('sets #strategy.step to 1', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.cycle(2, 1).strategy.step, 1);
      });
      it('makes channel to deliver publication sequentially to pair of subscribers stepping one subscriber at once', function () {
        var result0 = 0,
            result1 = 0,
            result2 = 0,
            subscriber0 = function subscriber0() {
          return ++result0;
        },
            subscriber1 = function subscriber1() {
          return ++result1;
        },
            subscriber2 = function subscriber2() {
          return ++result2;
        };

        (0, _aerobus2.default)().root.cycle(2, 1).subscribe(subscriber0, subscriber1, subscriber2).publish().publish();

        _chai.assert.strictEqual(result0, 1);

        _chai.assert.strictEqual(result1, 2);

        _chai.assert.strictEqual(result2, 1);
      });
    });
    describe('#enable()', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.enable(), bus.root);
      });
      it('sets #enabled', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.enable(false).enable().enabled);
      });
    });
    describe('#enable(false)', function () {
      it('clears #enabled', function () {
        _chai.assert.isFalse((0, _aerobus2.default)().root.enable(false).enabled);
      });
      it('supresses publication to this channel', function () {
        var result = false;
        (0, _aerobus2.default)().root.subscribe(function () {
          return result = true;
        }).enable(false).publish();

        _chai.assert.isFalse(result);
      });
      it('supresses publication to descendant channel', function () {
        var channel = (0, _aerobus2.default)()('parent.child'),
            result = false;
        channel.subscribe(function () {
          return result = true;
        }).parent.enable(false);
        channel.publish();

        _chai.assert.isFalse(result);
      });
    });
    describe('#enable(true)', function () {
      it('sets #enabled', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.enable(false).enable(true).enabled);
      });
      it('resumes publication to this channel', function () {
        var result = false;
        (0, _aerobus2.default)().root.subscribe(function () {
          return result = true;
        }).enable(false).enable(true).publish();

        _chai.assert.isTrue(result);
      });
      it('resumes publication to descendant channel', function () {
        var channel = (0, _aerobus2.default)()('parent.child'),
            result = false;
        channel.subscribe(function () {
          return result = true;
        }).parent.enable(false).enable(true);
        channel.publish();

        _chai.assert.isTrue(result);
      });
    });
    describe('#enabled', function () {
      it('is boolean', function () {
        _chai.assert.isBoolean((0, _aerobus2.default)().root.enabled);
      });
      it('is initially true', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.enabled);
      });
    });
    describe('#forward()', function () {
      it('throws', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)().root.forward();
        });
      });
    });
    describe('#forward(@function)', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.forward(function () {}), bus.root);
      });
      it('adds @function to #forwarders', function () {
        var bus = (0, _aerobus2.default)(),
            forwarder = function forwarder() {};

        bus.root.forward(forwarder);

        _chai.assert.include(bus.root.forwarders, forwarder);
      });
      it('forwards publications to channel defined by @function', function () {
        var bus = (0, _aerobus2.default)(),
            result0 = undefined,
            result1 = undefined;
        bus('0').subscribe(function (data) {
          return result0 = data;
        });
        bus('1').subscribe(function (data) {
          return result1 = data;
        });
        bus('test').forward(function (data) {
          return '' + data;
        }).publish(0).publish(1);

        _chai.assert.strictEqual(result0, 0);

        _chai.assert.strictEqual(result1, 1);
      });
      it('forwards publications to multuple channels defined by @function', function () {
        var bus = (0, _aerobus2.default)(),
            result0 = undefined,
            result1 = undefined,
            result2 = undefined;
        bus('0').subscribe(function (data) {
          return result0 = data;
        });
        bus('1').subscribe(function (data) {
          return result1 = data;
        });
        bus('test').subscribe(function (data) {
          return result2 = data;
        }).forward(function (data) {
          return ['0', '1', 'test'];
        }).publish(true);

        _chai.assert.isTrue(result0);

        _chai.assert.isTrue(result1);

        _chai.assert.isTrue(result2);
      });
      it('does not forward publication when @function returns null', function () {
        var bus = (0, _aerobus2.default)(),
            result = undefined;
        bus('test').subscribe(function (data) {
          return result = data;
        }).forward(function () {
          return null;
        }).publish(true);

        _chai.assert.isTrue(result);
      });
      it('does not forward publication when @function returns undefined', function () {
        var bus = (0, _aerobus2.default)(),
            result = undefined;
        bus('test').subscribe(function (data) {
          return result = data;
        }).forward(function () {}).publish(true);

        _chai.assert.isTrue(result);
      });
      it('does not forward publication when @function returns #name of this channel', function () {
        var bus = (0, _aerobus2.default)(),
            result = undefined;
        bus('test').subscribe(function (data) {
          return result = data;
        }).forward(function () {
          return 'test';
        }).publish(true);

        _chai.assert.isTrue(result);
      });
      it('stops forwarding publication when infinite forwarding loop is detected', function () {
        var bus = (0, _aerobus2.default)(),
            notifications = 0;
        bus('test0').forward(function () {
          return 'test1';
        });
        bus('test1').forward(function () {
          return 'test0';
        }).subscribe(function () {
          return notifications++;
        }).publish(true);

        _chai.assert.strictEqual(notifications, 1);
      });
    });
    describe('#forward(@string)', function () {
      it('adds @string to #forwarders', function () {
        var bus = (0, _aerobus2.default)(),
            forwarder = 'test';
        bus.root.forward(forwarder);

        _chai.assert.include(bus.root.forwarders, forwarder);
      });
      it('forwards publications to channel specified by @string', function () {
        var bus = (0, _aerobus2.default)(),
            result = undefined;
        bus('sink').subscribe(function (data) {
          return result = data;
        });
        bus('test').forward('sink').publish(true);

        _chai.assert.isTrue(result);
      });
    });
    describe('#forward(@function, @string)', function () {
      it('adds @function and @string to #forwarders', function () {
        var _bus$root3;

        var bus = (0, _aerobus2.default)(),
            forwarders = [function () {}, 'test'];

        (_bus$root3 = bus.root).forward.apply(_bus$root3, forwarders);

        _chai.assert.includeMembers(bus.root.forwarders, forwarders);
      });
    });
    describe('#forward(!(@function || @string))', function () {
      it('throws', function () {
        [new Array(), true, new Date(), 1, {}].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)().root.forward(value);
          });
        });
      });
    });
    describe('#forwarders', function () {
      it('is array', function () {
        _chai.assert.isArray((0, _aerobus2.default)().root.forwarders);
      });
      it('is initially empty', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.forwarders.length, 0);
      });
      it('is clone of internal collection', function () {
        var channel = (0, _aerobus2.default)().root,
            forwarder = 'test';
        channel.forward(forwarder);
        channel.forwarders.length = 0;

        _chai.assert.strictEqual(channel.forwarders.length, 1);

        channel.forwarders[0] = null;

        _chai.assert.strictEqual(channel.forwarders[0], forwarder);
      });
    });
    describe('#name', function () {
      it('is string', function () {
        _chai.assert.isString((0, _aerobus2.default)().root.name);
      });
      it('is "error" string for error channel', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().error.name, 'error');
      });
      it('is empty string for root channel', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.name, '');
      });
      it('is custom string for custom channel', function () {
        var name = 'some.custom.channel';

        _chai.assert.strictEqual((0, _aerobus2.default)()(name).name, name);
      });
    });
    describe('#parent', function () {
      it('is instance of Channel for custom channel', function () {
        _chai.assert.typeOf((0, _aerobus2.default)()('test').parent, 'Aerobus.Channel');
      });
      it('is root channel for channel of first level', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.parent, bus.root);
      });
      it('is parent channel for second level channel', function () {
        var bus = (0, _aerobus2.default)(),
            parent = bus('parent'),
            child = bus('parent.child');

        _chai.assert.strictEqual(child.parent, parent);
      });
      it('is undefined for root channel', function () {
        _chai.assert.isUndefined((0, _aerobus2.default)().root.parent);
      });
    });
    describe('#publish()', function () {
      it('is fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.publish(), channel);
      });
      it('notifies own subscribers in subcription order ', function () {
        var results = [],
            subscriber0 = function subscriber0() {
          return results.push('first');
        },
            subscriber1 = function subscriber1() {
          return results.push('second');
        };

        (0, _aerobus2.default)().root.subscribe(subscriber0, subscriber1).publish();

        _chai.assert.strictEqual(results[0], 'first');

        _chai.assert.strictEqual(results[1], 'second');
      });
      it('notifies ancestor subscribers before own if #bubbles is set', function () {
        var channel = (0, _aerobus2.default)()('parent.child').bubble(true),
            results = [],
            ancestor = function ancestor() {
          return results.push('ancestor');
        },
            parent = function parent() {
          return results.push('parent');
        },
            self = function self() {
          return results.push('self');
        };

        channel.parent.parent.subscribe(ancestor);
        channel.parent.subscribe(parent);
        channel.subscribe(self);
        channel.publish();

        _chai.assert.strictEqual(results.length, 3);

        _chai.assert.strictEqual(results[0], 'ancestor');

        _chai.assert.strictEqual(results[1], 'parent');

        _chai.assert.strictEqual(results[2], 'self');
      });
      it('does not notify ancestor subscribers if #bubbles is not set', function () {
        var channel = (0, _aerobus2.default)()('parent.child').bubble(false),
            results = [],
            ancestor = function ancestor() {
          return results.push('ancestor');
        },
            parent = function parent() {
          return results.push('parent');
        },
            self = function self() {
          return results.push('self');
        };

        channel.parent.parent.subscribe(ancestor);
        channel.parent.subscribe(parent);
        channel.subscribe(self);
        channel.publish();

        _chai.assert.strictEqual(results.length, 1);

        _chai.assert.strictEqual(results[0], 'self');
      });
    });
    describe('#publish(@object)', function () {
      it('notifies own subscriber with @object', function () {
        var publication = {},
            result = undefined,
            subscriber = function subscriber(data) {
          return result = data;
        };

        (0, _aerobus2.default)().root.subscribe(subscriber).publish(publication);

        _chai.assert.strictEqual(result, publication);
      });
      it('notifies own and ancestor subscribers with @object', function () {
        var channel = (0, _aerobus2.default)()('parent.child'),
            publication = {},
            results = [],
            subscriber = function subscriber(data) {
          return results.push(data);
        };

        channel.parent.parent.subscribe(subscriber);
        channel.parent.subscribe(subscriber);
        channel.subscribe(subscriber);
        channel.publish(publication);

        _chai.assert.strictEqual(results[0], publication);

        _chai.assert.strictEqual(results[1], publication);

        _chai.assert.strictEqual(results[2], publication);
      });
    });
    describe('#publish(@object, @function)', function () {
      it('invokes @function with array containing results returned from all own and ancestor subscribers', function () {
        var channel = (0, _aerobus2.default)()('parent.child'),
            result0 = {},
            result1 = {},
            result2 = {},
            results = undefined,
            callback = function callback(data) {
          return results = data;
        };

        channel.parent.parent.subscribe(function () {
          return result0;
        });
        channel.parent.subscribe(function () {
          return result1;
        });
        channel.subscribe(function () {
          return result2;
        }).publish({}, callback);

        _chai.assert.include(results, result0);

        _chai.assert.include(results, result1);

        _chai.assert.include(results, result2);
      });
    });
    describe('#reset()', function () {
      it('is fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.reset(), channel);
      });
      it('sets #enabled', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.enable(false).reset();

        _chai.assert.isTrue(channel.enabled);
      });
      it('clears #forwarders', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.forward('test').reset();

        _chai.assert.strictEqual(channel.forwarders.length, 0);
      });
      it('clears #retentions', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain().publish().reset();

        _chai.assert.strictEqual(channel.retentions.length, 0);
      });
      it('resets #retentions.limit to 0', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain().publish().reset();

        _chai.assert.strictEqual(channel.retentions.limit, 0);
      });
      it('clears #subscribers', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.subscribe(function () {}).reset();

        _chai.assert.strictEqual(channel.subscribers.length, 0);
      });
    });
    describe('#retain()', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.retain(), bus.root);
      });
      it('sets #retentions.limit property to Number.MAX_SAFE_INTEGER', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain();

        _chai.assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
      it('notifies all subsequent subscribtions with all retained publications immediately in order of publication', function () {
        var channel = (0, _aerobus2.default)().root,
            publication0 = {},
            publication1 = {},
            results = [],
            subscriber = function subscriber(data) {
          return results.push(data);
        };

        channel.retain().publish(publication0).publish(publication1).subscribe(subscriber).subscribe(subscriber);

        _chai.assert.strictEqual(results[0], publication0);

        _chai.assert.strictEqual(results[1], publication1);
      });
    });
    describe('#retain(false)', function () {
      it('sets #retentions.limit to 0', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain(false);

        _chai.assert.strictEqual(channel.retentions.limit, 0);
      });
      it('clears #retentions', function () {
        var channel = (0, _aerobus2.default)().root,
            data0 = {},
            data1 = {};
        channel.retain().publish(data0).publish(data1).retain(false);

        _chai.assert.strictEqual(channel.retentions.length, 0);
      });
    });
    describe('#retain(true)', function () {
      it('sets #retentions.limit to Number.MAX_SAFE_INTEGER', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain(true);

        _chai.assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
    });
    describe('#retain(@number)', function () {
      it('sets #retentions.limit to @number', function () {
        var limit = 42,
            channel = (0, _aerobus2.default)().root;
        channel.retain(limit);

        _chai.assert.strictEqual(channel.retentions.limit, limit);
      });
    });
    describe('#retentions', function () {
      it('is array', function () {
        _chai.assert.isArray((0, _aerobus2.default)().root.retentions);
      });
      it('contains one latest publication when limited to 1', function () {
        var channel = (0, _aerobus2.default)().root,
            data0 = {},
            data1 = {};
        channel.retain(1).publish(data0).publish(data1);

        _chai.assert.strictEqual(channel.retentions.length, 1);

        _chai.assert.strictEqual(channel.retentions[0].data, data1);
      });
      it('contains two latest publications when limited to 2', function () {
        var channel = (0, _aerobus2.default)().root,
            data0 = {},
            data1 = {},
            data2 = {};
        channel.retain(2).publish(data0).publish(data1).publish(data2);

        _chai.assert.strictEqual(channel.retentions.length, 2);

        _chai.assert.strictEqual(channel.retentions[0].data, data1);

        _chai.assert.strictEqual(channel.retentions[1].data, data2);
      });
      it('is clone of internal collection', function () {
        var channel = (0, _aerobus2.default)().root,
            data = {};
        channel.retain(1).publish(data);
        channel.retentions.length = 0;

        _chai.assert.strictEqual(channel.retentions.length, 1);

        channel.retentions[0] = null;

        _chai.assert.strictEqual(channel.retentions[0].data, data);
      });
    });
    describe('#retentions.limit', function () {
      it('is number', function () {
        _chai.assert.isNumber((0, _aerobus2.default)().root.retentions.limit);
      });
    });
    describe('#shuffle()', function () {
      it('is fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.shuffle(), bus.root);
      });
      it('sets #strategy to instance of Aerobus.Strategy.Shuffle', function () {
        _chai.assert.typeOf((0, _aerobus2.default)().root.shuffle().strategy, 'Aerobus.Strategy.Shuffle');
      });
      it('sets #strategy.limit to 1', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.shuffle().strategy.limit, 1);
      });
      it('sets #strategy.name to "shuffle"', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.shuffle().strategy.name, 'shuffle');
      });
      it('makes channel delivering publication randomly', function () {
        var result0 = 0,
            result1 = 0,
            subscriber0 = function subscriber0() {
          return ++result0;
        },
            subscriber1 = function subscriber1() {
          return ++result1;
        };

        (0, _aerobus2.default)().root.shuffle().subscribe(subscriber0, subscriber1).publish().publish().publish();

        _chai.assert.strictEqual(result0 + result1, 3);
      });
    });
    describe('#shuffle(2)', function () {
      it('makes channel delivering publication randomly to pair of subscribers at once', function () {
        var result0 = 0,
            result1 = 0,
            subscriber0 = function subscriber0() {
          return ++result0;
        },
            subscriber1 = function subscriber1() {
          return ++result1;
        };

        (0, _aerobus2.default)().root.shuffle(2).subscribe(subscriber0, subscriber1).publish().publish();

        _chai.assert.strictEqual(result0 + result1, 4);
      });
    });
    describe('#strategy', function () {
      it('is initially undefined', function () {
        _chai.assert.isUndefined((0, _aerobus2.default)().root.strategy);
      });
    });
    describe('#subscribe()', function () {
      it('throws', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)().root.subscribe();
        });
      });
    });
    describe('#subscribe(@function)', function () {
      it('is fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.subscribe(function () {}), channel);
      });
      it('wraps @function with Aerobus.Subscriber and adds to #subscribers', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber = function subscriber() {};

        channel.subscribe(subscriber);

        _chai.assert.strictEqual(channel.subscribers[0].next, subscriber);
      });
      it('does not deliver current publication to @function subscribed by subscriber being notified', function () {
        var channel = (0, _aerobus2.default)().root,
            result = true,
            subscriber1 = function subscriber1() {
          return result = false;
        },
            subscriber0 = function subscriber0() {
          return channel.subscribe(subscriber1);
        };

        channel.subscribe(subscriber0).publish();

        _chai.assert.isTrue(result);
      });
    });
    describe('#subscribe(...@functions)', function () {
      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(subscriber0, subscriber1);

        _chai.assert.strictEqual(channel.subscribers[0].next, subscriber0);

        _chai.assert.strictEqual(channel.subscribers[1].next, subscriber1);
      });
    });
    describe('#subscribe(@number, @function)', function () {
      it('wraps @function with Aerobus.Subscriber and adds to #subscribers, @subscriber.order gets @number', function () {
        var channel = (0, _aerobus2.default)().root,
            order = -1;
        channel.subscribe(order, function () {});

        _chai.assert.strictEqual(channel.subscribers[0].order, order);
      });
      it('wraps @function with Aerobus.Subscriber and adds #subscribers, logical position of @subscriber within #subscribers matches @number', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(2, subscriber0).subscribe(1, subscriber1);

        _chai.assert.strictEqual(channel.subscribers[0].next, subscriber1);

        _chai.assert.strictEqual(channel.subscribers[1].next, subscriber0);
      });
    });
    describe('#subscribe(@number, ...@functions)', function () {
      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers, each @subscriber.order gets @number', function () {
        var channel = (0, _aerobus2.default)().root,
            order = 1;
        channel.subscribe(order, function () {}, function () {});

        _chai.assert.strictEqual(channel.subscribers[0].order, order);

        _chai.assert.strictEqual(channel.subscribers[1].order, order);
      });
      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers, logical position of each @subscriber within #subscribers matches @number', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber0).subscribe(-1, subscriber1, subscriber2);

        _chai.assert.strictEqual(channel.subscribers[0].next, subscriber1);

        _chai.assert.strictEqual(channel.subscribers[1].next, subscriber2);

        _chai.assert.strictEqual(channel.subscribers[2].next, subscriber0);
      });
    });
    describe('#subscribe(@string, @function)', function () {
      it('wraps @function with Aerobus.Subscriber and adds to #subscribers, @subscriber.name gets @string', function () {
        var channel = (0, _aerobus2.default)().root,
            name = 'test';
        channel.subscribe(name, function () {});

        _chai.assert.strictEqual(channel.subscribers[0].name, name);
      });
    });
    describe('#subscribe(@object)', function () {
      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.done invokes @object.done', function () {
        var channel = (0, _aerobus2.default)().root,
            called = false,
            subscriber = {
          done: function done() {
            return called = true;
          },
          next: function next() {}
        };
        channel.subscribe(subscriber);
        channel.subscribers[0].done();

        _chai.assert.isTrue(called);
      });
      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.next invokes @object.next', function () {
        var channel = (0, _aerobus2.default)().root,
            called = false,
            subscriber = {
          done: function done() {},
          next: function next() {
            return called = true;
          }
        };
        channel.subscribe(subscriber);
        channel.subscribers[0].next();

        _chai.assert.isTrue(called);
      });
      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.name gets @object.name', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber = {
          name: 'test',
          next: function next() {}
        };
        channel.subscribe(subscriber);

        _chai.assert.strictEqual(channel.subscribers[0].name, subscriber.name);
      });
      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.order gets @object.order', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber = {
          next: function next() {},
          order: 1
        };
        channel.subscribe(subscriber);

        _chai.assert.strictEqual(channel.subscribers[0].order, subscriber.order);
      });
      it('throws if @object.done is not a function', function () {
        [new Array(), true, new Date(), 1, {}, 'test'].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)().root.subscribe({
              done: value
            });
          });
        });
      });
      it('throws if @object.name is not a string', function () {
        [new Array(), true, new Date(), function () {}, 1, {}].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)().root.subscribe({
              name: value,
              next: function next() {}
            });
          });
        });
      });
      it('throws if @object does not contain "next" member', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)().root.subscribe({});
        });
      });
      it('throws if @object.next is not a function', function () {
        [new Array(), true, new Date(), 1, {}, 'test'].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)().root.subscribe({
              next: value
            });
          });
        });
      });
      it('throws if @object.order is not a number', function () {
        [new Array(), true, new Date(), function () {}, {}, 'test'].forEach(function (value) {
          return _chai.assert.throw(function () {
            return (0, _aerobus2.default)().root.subscribe({
              next: function next() {},
              order: value
            });
          });
        });
      });
    });
    describe('#subscribers', function () {
      it('is array', function () {
        _chai.assert.isArray((0, _aerobus2.default)().root.subscribers);
      });
      it('is initially empty', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.subscribers.length, 0);
      });
      it('is immutable', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber = function subscriber() {};

        channel.subscribe(subscriber);
        channel.subscribers.length = 0;

        _chai.assert.strictEqual(channel.subscribers.length, 1);

        channel.subscribers[0] = null;

        _chai.assert.strictEqual(channel.subscribers[0].next, subscriber);
      });
    });
    describe('#toggle()', function () {
      it('is fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.toggle(), channel);
      });
      it('disables enabled channel', function () {
        _chai.assert.isFalse((0, _aerobus2.default)().root.enable(true).toggle().enabled);
      });
      it('enables disabled channel', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.enable(false).toggle().enabled);
      });
    });
    describe('#unsubscribe()', function () {
      it('is fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.unsubscribe(), channel);
      });
    });
    describe('#unsubscribe(@function)', function () {
      it('does not throw if @function has not been subscribed', function () {
        _chai.assert.doesNotThrow(function () {
          return (0, _aerobus2.default)().root.unsubscribe(function () {});
        });
      });
      it('removes @function from #subscribers', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber = function subscriber() {};

        channel.subscribe(subscriber).unsubscribe(subscriber);

        _chai.assert.strictEqual(channel.subscribers.length, 0);
      });
      it('prevents publication delivery to next subscriber when previous subscriber unsubscribes it', function () {
        var channel = (0, _aerobus2.default)().root,
            result = false,
            subscriber0 = function subscriber0() {
          return result = true;
        },
            subscriber1 = function subscriber1() {
          return channel.unsubscribe(subscriber0);
        };

        channel.subscribe(subscriber1, subscriber0).publish();

        _chai.assert.isFalse(result);
      });
      it('does not break publication delivery when next subscriber unsubscribes previous', function () {
        var channel = (0, _aerobus2.default)().root,
            result = false,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {
          return channel.unsubscribe(subscriber0);
        },
            subscriber2 = function subscriber2() {
          return result = true;
        };

        channel.subscribe(subscriber0, subscriber1, subscriber2).publish();

        _chai.assert.isTrue(result);
      });
    });
    describe('#unsubscribe(...@functions)', function () {
      it('removes all @functions from #subscribers', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(subscriber0, subscriber1).unsubscribe(subscriber0, subscriber1);

        _chai.assert.strictEqual(channel.subscribers.length, 0);
      });
    });
    describe('#unsubscribe(@object)', function () {
      it('does not throw if @object has not been subscribed', function () {
        _chai.assert.doesNotThrow(function () {
          return (0, _aerobus2.default)().root.unsubscribe({});
        });
      });
      it('removes @object from #subscribers', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber = {
          next: function next() {}
        };
        channel.subscribe(subscriber).unsubscribe(subscriber);

        _chai.assert.strictEqual(channel.subscribers.length, 0);
      });
      it('invokes @object.done()', function () {
        var channel = (0, _aerobus2.default)().root,
            result = undefined,
            subscriber = {
          done: function done() {
            return result = true;
          },
          next: function next() {}
        };
        channel.subscribe(subscriber).unsubscribe(subscriber);

        _chai.assert.isTrue(result);
      });
    });
    describe('#unsubscribe(@string)', function () {
      it('does not throw if no #subscribers are named as @name', function () {
        _chai.assert.doesNotThrow(function () {
          return (0, _aerobus2.default)().root.unsubscribe('test');
        });
      });
      it('removes all subscribers named as @string from  #subscribers', function () {
        var channel = (0, _aerobus2.default)().root,
            name = 'test',
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(name, subscriber0).subscribe(subscriber1).unsubscribe(name);

        _chai.assert.strictEqual(channel.subscribers.length, 1);

        _chai.assert.strictEqual(channel.subscribers[0].next, subscriber1);
      });
    });
    describe('#unsubscribe(@subscriber)', function () {
      it('does not throw if @subscriber has not been subscribed', function () {
        var bus = (0, _aerobus2.default)(),
            channel0 = bus('test0'),
            channel1 = bus('test1');
        channel0.subscribe(function () {});

        _chai.assert.doesNotThrow(function () {
          return channel1.unsubscribe(channel0.subscribers[0]);
        });
      });
      it('removes @subscriber from #subscribers', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.subscribe(function () {}).unsubscribe(channel.subscribers[0]);

        _chai.assert.strictEqual(channel.subscribers.length, 0);
      });
    });
  });
  var messageTests = describe('Aerobus.Message', function () {
    describe('#cancel', function () {
      it('skips next subscriber when returned from previous subscriber', function () {
        var results = 0,
            canceller = function canceller(_, message) {
          return message.cancel;
        },
            subscriber = function subscriber(_, message) {
          return results++;
        };

        (0, _aerobus2.default)().root.subscribe(canceller, subscriber).publish();

        _chai.assert.strictEqual(results, 0);
      });
      it('skips subscriber of descendant channel when returned from subscriber of parent channel', function () {
        var channel = (0, _aerobus2.default)()('test'),
            results = 0,
            canceller = function canceller(_, message) {
          return message.cancel;
        },
            subscriber = function subscriber(_, message) {
          return results++;
        };

        channel.parent.subscribe(canceller);
        channel.subscribe(subscriber).publish();

        _chai.assert.strictEqual(results, 0);
      });
    });
    describe('#data', function () {
      it('gets published data', function () {
        var publication = {},
            result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message.data;
        };

        (0, _aerobus2.default)().root.subscribe(subscriber).publish(publication);

        _chai.assert.strictEqual(result, publication);
      });
    });
    describe('#destination', function () {
      it('gets channel name this message was delivered to', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test'),
            result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message.destination;
        };

        channel.subscribe(subscriber).publish();

        _chai.assert.strictEqual(result, channel.name);
      });
    });
    describe('#route', function () {
      it('gets array of channel names this message has traversed', function () {
        var bus = (0, _aerobus2.default)(),
            root = bus.root,
            parent = bus('parent'),
            child = bus('parent.child'),
            results = [],
            subscriber = function subscriber(_, message) {
          return results = message.route;
        };

        bus.root.subscribe(subscriber);
        child.publish();

        _chai.assert.include(results, root.name);

        _chai.assert.include(results, parent.name);

        _chai.assert.include(results, child.name);
      });
    });
  });
  var sectionTests = describe('Aerobus.Section', function () {
    describe('#channels', function () {
      it('is array', function () {
        _chai.assert.isArray((0, _aerobus2.default)()('test1', 'test2').channels);
      });
      it('gets array of all channels bound with this section', function () {
        var bus = (0, _aerobus2.default)(),
            channel0 = bus('test0'),
            channel1 = bus('test1'),
            section = bus('test0', 'test1');

        _chai.assert.include(section.channels, channel0);

        _chai.assert.include(section.channels, channel1);
      });
    });
    describe('#bubble()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.bubble(), section);
      });
      it('sets bubbles of all #channels', function () {
        var section = (0, _aerobus2.default)(false)('test1', 'test2');
        section.bubble();
        section.channels.forEach(function (channel) {
          return _chai.assert.isTrue(channel.bubbles);
        });
      });
    });
    describe('#bubble(false)', function () {
      it('clears bubbles of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.bubble(false);
        section.channels.forEach(function (channel) {
          return _chai.assert.isFalse(channel.bubbles);
        });
      });
    });
    describe('#bubble(true)', function () {
      it('sets bubbles of all #channels', function () {
        var section = (0, _aerobus2.default)(false)('test1', 'test2');
        section.bubble(true);
        section.channels.forEach(function (channel) {
          return _chai.assert.isTrue(channel.bubbles);
        });
      });
    });
    describe('#clear()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.clear(), section);
      });
      it('clears subscribers of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.channels.forEach(function (channel) {
          return channel.subscribe(subscriber);
        });
        section.clear();
        section.channels.forEach(function (channel) {
          return _chai.assert.strictEqual(channel.subscribers.length, 0);
        });
      });
    });
    describe('#cycle()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.cycle(), section);
      });
      it('sets strategy of all #channels to instance of Aerobus.Strategy.Cycle', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.cycle();
        section.channels.forEach(function (channel) {
          return _chai.assert.typeOf(channel.strategy, 'Aerobus.Strategy.Cycle');
        });
      });
    });
    describe('#enable()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.enable(), section);
      });
      it('enables all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.channels.forEach(function (channel) {
          return channel.enable(false);
        });
        section.enable();
        section.channels.forEach(function (channel) {
          return _chai.assert.isTrue(channel.enabled);
        });
      });
    });
    describe('#enable(false)', function () {
      it('disables all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.enable(false);
        section.channels.forEach(function (channel) {
          return _chai.assert.isFalse(channel.enabled);
        });
      });
    });
    describe('#enable(true)', function () {
      it('enables all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.channels.forEach(function (channel) {
          return channel.enable(false);
        });
        section.enable(true);
        section.channels.forEach(function (channel) {
          return _chai.assert.isTrue(channel.enabled);
        });
      });
    });
    describe('#forward(@function)', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.forward(function () {}), section);
      });
      it('adds @function to forwarders of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            forwarder = function forwarder() {};

        section.forward(forwarder);
        section.channels.forEach(function (channel) {
          return _chai.assert.include(channel.forwarders, forwarder);
        });
      });
    });
    describe('#forward(@string)', function () {
      it('adds @string to forwarders of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            forwarder = '';
        section.forward(forwarder);
        section.channels.forEach(function (channel) {
          return _chai.assert.include(channel.forwarders, forwarder);
        });
      });
    });
    describe('#forward(@function, @string)', function () {
      it('adds @string to forwarders of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            forwarder0 = function forwarder0() {},
            forwarder1 = '';

        section.forward(forwarder0, forwarder1);
        section.channels.forEach(function (channel) {
          return _chai.assert.include(channel.forwarders, forwarder0);
        });
        section.channels.forEach(function (channel) {
          return _chai.assert.include(channel.forwarders, forwarder1);
        });
      });
    });
    describe('#forward(!(@function || @string))', function () {
      var section = (0, _aerobus2.default)()('test1', 'test2');
      it('throws', function () {
        [new Array(), true, new Date(), 1, {}].forEach(function (value) {
          return _chai.assert.throw(function () {
            return section.forward(value);
          });
        });
      });
    });
    describe('#publish()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.publish(), section);
      });
      it('notifies subscribers of all #channels in order of reference', function () {
        var bus = (0, _aerobus2.default)(),
            section = (0, _aerobus2.default)()('test1', 'test2'),
            results = [],
            subscriber0 = function subscriber0() {
          return results.push('test1');
        },
            subscriber1 = function subscriber1() {
          return results.push('test2');
        };

        bus('test1').subscribe(subscriber0);
        bus('test2').subscribe(subscriber1);
        bus('test1', 'test2').publish();

        _chai.assert.strictEqual(results[0], 'test1');

        _chai.assert.strictEqual(results[1], 'test2');
      });
    });
    describe('#publish(@object)', function () {
      it('notifies subscribers of all #channels with @object in order of reference', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            publication = {},
            results = [],
            subscriber = function subscriber(_, message) {
          return results.push(message);
        };

        section.subscribe(subscriber).publish(publication);

        _chai.assert.strictEqual(results[0].data, publication);

        _chai.assert.strictEqual(results[0].destination, section.channels[0].name);

        _chai.assert.strictEqual(results[1].data, publication);

        _chai.assert.strictEqual(results[1].destination, section.channels[1].name);
      });
    });
    describe('#publish(null, @function)', function () {
      it('invokes @function with array of results returned from subscribers of all #channels in order of reference', function () {
        var bus = (0, _aerobus2.default)(),
            result0 = {},
            result1 = {},
            results = undefined;
        bus('test1').subscribe(function () {
          return result0;
        });
        bus('test2').subscribe(function () {
          return result1;
        });
        bus('test1', 'test2').publish(null, function (data) {
          return results = data;
        });

        _chai.assert.strictEqual(results[0], result0);

        _chai.assert.strictEqual(results[1], result1);
      });
    });
    describe('#shuffle()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.shuffle(), section);
      });
      it('sets strategy of all #channels to instance of Aerobus.Strategy.Shuffle', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.shuffle();
        section.channels.forEach(function (channel) {
          return _chai.assert.typeOf(channel.strategy, 'Aerobus.Strategy.Shuffle');
        });
      });
    });
    describe('#subscribe()', function () {
      it('throws', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)()('test1', 'test2').subscribe();
        });
      });
    });
    describe('#subscribe(@function)', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.subscribe(function () {}), section);
      });
      it('adds @function to subscribers of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.subscribe(subscriber);
        section.channels.forEach(function (channel) {
          return _chai.assert.include(channel.subscribers.map(function (existing) {
            return existing.next;
          }), subscriber);
        });
      });
    });
    describe('#subscribe(@function0, @function1)', function () {
      it('adds @function to subscribers all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        section.subscribe(subscriber0, subscriber1);
        section.channels.forEach(function (channel) {
          _chai.assert.include(channel.subscribers.map(function (existing) {
            return existing.next;
          }), subscriber0);

          _chai.assert.include(channel.subscribers.map(function (existing) {
            return existing.next;
          }), subscriber1);
        });
      });
    });
    describe('#toggle()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.toggle(), section);
      });
      it('disables all enabled #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.enable(true).toggle();
        section.channels.forEach(function (channel) {
          return _chai.assert.isFalse(channel.enabled);
        });
      });
      it('enables all disabled #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.enable(false).toggle();
        section.channels.forEach(function (channel) {
          return _chai.assert.isTrue(channel.enabled);
        });
      });
    });
    describe('#unsubscribe()', function () {
      it('is fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.unsubscribe(), section);
      });
      it('removes all subscribers of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.subscribe(function () {}, function () {}).unsubscribe();
        section.channels.forEach(function (channel) {
          return _chai.assert.strictEqual(channel.subscribers.length, 0);
        });
      });
    });
    describe('#unsubscribe(@function)', function () {
      it('removes @function from subscribers of all #channels', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.subscribe(subscriber).unsubscribe(subscriber);
        section.channels.forEach(function (channel) {
          return _chai.assert.notInclude(channel.subscribers.map(function (existing) {
            return existing.next;
          }), subscriber);
        });
      });
    });
  });
  exports.sectionTests = sectionTests;
  exports.messageTests = messageTests;
  exports.channelTests = channelTests;
  exports.aerobusInstanceTests = aerobusInstanceTests;
  exports.aerobusFactoryTests = aerobusFactoryTests;
});
