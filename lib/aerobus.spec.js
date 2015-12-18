'use strict';

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['chai', './aerobus'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('chai'), require('./aerobus'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.chai, global.aerobus);
    global.aerobusSpec = mod.exports;
  }
})(this, function (_chai, _aerobus) {
  var _aerobus2 = _interopRequireDefault(_aerobus);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var assert = _chai.assert;
  var aerobus = _aerobus2.default;
  describe('aerobus', function () {
    it('is function', function () {
      assert.isFunction(aerobus);
    });
  });
  describe('aerobus()', function () {
    it('returns instance of Aerobus', function () {
      assert.typeOf(aerobus(), 'Aerobus');
    });
    describe('#bubbles', function () {
      it('is true', function () {
        assert.isTrue(aerobus().bubbles);
      });
    });
    describe('#delimiter', function () {
      it('is "."', function () {
        assert.strictEqual(aerobus().delimiter, '.');
      });
    });
  });
  describe('aerobus(@array)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus([]);
      });
    });
  });
  describe('aerobus(@boolean)', function () {
    it('returns instance of Aerobus', function () {
      assert.typeOf(aerobus(false), 'Aerobus');
    });
    describe('@boolean', function () {
      it('configures #bubbles', function () {
        var bubbles = false,
            bus = aerobus(bubbles);
        assert.strictEqual(bus.bubbles, bubbles);
      });
    });
  });
  describe('aerobus(@date)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus(new Date());
      });
    });
  });
  describe('aerobus(@function)', function () {
    it('returns instance of Aerobus', function () {
      assert.typeOf(aerobus(function () {}), 'Aerobus');
    });
    describe('@function', function () {
      it('configures #error', function () {
        var error = function error() {},
            bus = aerobus(error);

        assert.strictEqual(bus.error, error);
      });
    });
  });
  describe('aerobus(@number)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus(0);
      });
    });
  });
  describe('aerobus(@object)', function () {
    it('returns instance of Aerobus', function () {
      assert.typeOf(aerobus({}), 'Aerobus');
    });
    describe('@object.bubbles', function () {
      it('configures #bubbles', function () {
        var bubbles = false,
            bus = aerobus({
          bubbles: bubbles
        });
        assert.strictEqual(bus.bubbles, bubbles);
      });
    });
    describe('@object.delimiter', function () {
      it('must be not empty string', function () {
        assert.throw(function () {
          return aerobus({
            delimiter: ''
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: []
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: false
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: true
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: new Date()
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: 0
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: function delimiter() {}
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: {}
          });
        });
      });
      it('configures #delimiter', function () {
        var delimiter = ':',
            bus = aerobus({
          delimiter: delimiter
        });
        assert.strictEqual(bus.delimiter, delimiter);
      });
    });
    describe('@object.error', function () {
      it('must be a function', function () {
        assert.throw(function () {
          return aerobus({
            error: ''
          });
        });
        assert.throw(function () {
          return aerobus({
            error: []
          });
        });
        assert.throw(function () {
          return aerobus({
            error: false
          });
        });
        assert.throw(function () {
          return aerobus({
            error: true
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: new Date()
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: 0
          });
        });
        assert.throw(function () {
          return aerobus({
            error: {}
          });
        });
      });
      it('configures #error', function () {
        var error = function error() {},
            bus = aerobus({
          error: error
        });

        assert.strictEqual(bus.error, error);
      });
    });
    describe('@object.trace', function () {
      it('must be a function', function () {
        assert.throw(function () {
          return aerobus({
            trace: ''
          });
        });
        assert.throw(function () {
          return aerobus({
            trace: []
          });
        });
        assert.throw(function () {
          return aerobus({
            trace: false
          });
        });
        assert.throw(function () {
          return aerobus({
            trace: true
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: new Date()
          });
        });
        assert.throw(function () {
          return aerobus({
            delimiter: 0
          });
        });
        assert.throw(function () {
          return aerobus({
            trace: {}
          });
        });
      });
      it('configures #trace', function () {
        var trace = function trace() {},
            bus = aerobus({
          trace: trace
        });

        assert.strictEqual(bus.trace, trace);
      });
    });
    describe('@object.channel', function () {
      it('extends Channel instances', function () {
        var extension = function extension() {},
            bus = aerobus({
          channel: {
            extension: extension
          }
        }),
            channels = [bus.root, bus('custom')];

        channels.forEach(function (channel) {
          return assert.strictEqual(channel.extension, extension);
        });
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
            bus = aerobus({
          channel: extensions
        }),
            channels = [bus.root, bus('custom')];
        Object.keys(extensions).forEach(function (key) {
          return channels.forEach(function (channel) {
            return assert.isNotNull(channel[key]);
          });
        });
      });
    });
    describe('@object.message', function () {
      it('extends Message instances', function () {
        var extension = function extension() {},
            bus = aerobus({
          message: {
            extension: extension
          }
        }),
            result = undefined;

        bus.root.subscribe(function (_, message) {
          return result = message.extension;
        });
        bus.root.publish();
        assert.strictEqual(result, extension);
      });
      it('preserves standard members', function () {
        var extensions = {
          destination: null,
          data: null,
          route: null
        },
            bus = aerobus({
          message: extensions
        }),
            result = undefined;
        bus.root.subscribe(function (_, message) {
          return result = message;
        });
        bus.root.publish({});
        Object.keys(extensions).forEach(function (key) {
          return assert.isNotNull(result[key]);
        });
      });
    });
    describe('@object.section', function () {
      it('extends Section instances', function () {
        var extension = function extension() {},
            bus = aerobus({
          section: {
            extension: extension
          }
        }),
            sections = [bus('', 'test'), bus('', 'test', 'parent.child')];

        sections.forEach(function (section) {
          return assert.strictEqual(section.extension, extension);
        });
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
            bus = aerobus({
          channel: extensions
        }),
            sections = [bus('', 'test'), bus('', 'test', 'parent.child')];
        Object.keys(extensions).forEach(function (key) {
          return sections.forEach(function (section) {
            return assert.isNotNull(section[key]);
          });
        });
      });
    });
  });
  describe('aerobus(@string)', function () {
    it('returns instance of Aerobus', function () {
      assert.typeOf(aerobus(':'), 'Aerobus');
    });
    describe('@string', function () {
      it('configures #delimiter', function () {
        var delimiter = ':',
            bus = aerobus(delimiter);
        assert.strictEqual(bus.delimiter, delimiter);
      });
      it('throws if empty', function () {
        assert.throw(function () {
          return aerobus('');
        });
      });
    });
  });
  describe('aerobus(@boolean, @function, @string)', function () {
    it('returns instance of Aerobus', function () {
      assert.typeOf(aerobus(false, function () {}, ':'), 'Aerobus');
    });
    describe('@boolean', function () {
      it('configures #bubbles', function () {
        var bubbles = false,
            bus = aerobus(bubbles, function () {}, ':');
        assert.strictEqual(bus.bubbles, bubbles);
      });
    });
    describe('@function', function () {
      it('configures #error', function () {
        var error = function error() {},
            bus = aerobus(false, error, ':');

        assert.strictEqual(bus.error, error);
      });
    });
    describe('@string', function () {
      it('configures #delimiter', function () {
        var delimiter = ':',
            bus = aerobus(false, function () {}, delimiter);
        assert.strictEqual(bus.delimiter, delimiter);
      });
    });
  });
  describe('Aerobus', function () {
    describe('is function', function () {
      assert.instanceOf(aerobus(), Function);
    });
    describe('#()', function () {
      it('returns instance of Channel', function () {
        var bus = aerobus();
        assert.typeOf(bus(), 'Aerobus.Channel');
      });
      it('returns #root channel', function () {
        var bus = aerobus(),
            channel = bus();
        assert.strictEqual(channel, bus.root);
      });
    });
    describe('#("")', function () {
      it('returns instance of Channel', function () {
        var bus = aerobus();
        assert.typeOf(bus(''), 'Aerobus.Channel');
      });
      it('returns #root channel', function () {
        var bus = aerobus(),
            channel = bus('');
        assert.strictEqual(channel, bus.root);
      });
    });
    describe('#(@string)', function () {
      it('returns instance of Channel', function () {
        var bus = aerobus();
        assert.typeOf(bus('test'), 'Aerobus.Channel');
      });
      it('Channel.#name gets @string', function () {
        var bus = aerobus(),
            name = 'test';
        assert.strictEqual(bus(name).name, name);
      });
    });
    describe('#(...@strings)', function () {
      it('returns instance of Section', function () {
        assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
      });
      it('Section.#channels include all specified channels', function () {
        var names = ['test1', 'test2'],
            section = aerobus().apply(undefined, names);
        assert.strictEqual(section.channels[0].name, names[0]);
        assert.strictEqual(section.channels[1].name, names[1]);
      });
    });
    describe('#(!@string)', function () {
      it('throws', function () {
        assert.throw(function () {
          return aerobus()([]);
        });
        assert.throw(function () {
          return aerobus()(true);
        });
        assert.throw(function () {
          return aerobus()(new Date());
        });
        assert.throw(function () {
          return aerobus()(42);
        });
        assert.throw(function () {
          return aerobus()({});
        });
      });
    });
    describe('#bubble()', function () {
      it('is fluent', function () {
        var bus = aerobus();
        assert.strictEqual(bus.bubble(), bus);
      });
      it('sets #bubbles', function () {
        var bus = aerobus(false);
        bus.bubble();
        assert.isTrue(bus.bubbles);
      });
    });
    describe('#bubble(false)', function () {
      it('clears #bubbles', function () {
        var bus = aerobus();
        bus.bubble(false);
        assert.isFalse(bus.bubbles);
      });
    });
    describe('#bubbles', function () {
      it('is boolean', function () {
        assert.isBoolean(aerobus().bubbles);
      });
    });
    describe('#channels', function () {
      it('is array', function () {
        assert.isArray(aerobus().channels);
      });
      it('is empty by default', function () {
        assert.strictEqual(aerobus().channels.length, 0);
      });
      it('contain root channel after its creation', function () {
        var bus = aerobus(),
            channel = bus.root;
        assert.include(bus.channels, channel);
      });
      it('contain custom channel after its creation', function () {
        var bus = aerobus(),
            channel = bus('test');
        assert.include(bus.channels, channel);
      });
      it('contains several channels after their creation', function () {
        var bus = aerobus(),
            channel0 = bus.root,
            channel1 = bus('test'),
            channel2 = bus('parent.child');
        assert.include(bus.channels, channel0);
        assert.include(bus.channels, channel1);
        assert.include(bus.channels, channel2);
      });
    });
    describe('#clear()', function () {
      it('is fluent', function () {
        var bus = aerobus();
        assert.strictEqual(bus.clear(), bus);
      });
      it('empties #channels', function () {
        var bus = aerobus(),
            channel0 = bus.root,
            channel1 = bus.error,
            channel2 = bus('test');
        bus.clear();
        assert.strictEqual(bus.channels.length, 0);
        assert.notInclude(bus.channels, channel0);
        assert.notInclude(bus.channels, channel1);
        assert.notInclude(bus.channels, channel2);
      });
      it('resolves new instance of Channel for same name ', function () {
        var bus = aerobus(),
            channel0 = bus.root,
            channel1 = bus.error,
            channel2 = bus('test');
        bus.clear();
        assert.notStrictEqual(bus(channel0.name), channel0);
        assert.notStrictEqual(bus(channel1.name), channel1);
        assert.notStrictEqual(bus(channel2.name), channel2);
      });
    });
    describe('#create()', function () {
      it('returns new Aerobus instance', function () {
        assert.typeOf(aerobus().create(), 'Aerobus');
      });
      it('new Aerobus inherits #bubbles', function () {
        var bubbles = false;
        assert.strictEqual(aerobus(bubbles).create().bubbles, bubbles);
      });
      it('new Aerobus inherits #delimiter', function () {
        var delimiter = ':';
        assert.strictEqual(aerobus(delimiter).create().delimiter, delimiter);
      });
      it('new Aerobus inherits #error', function () {
        var error = function error() {};

        assert.strictEqual(aerobus(error).create().error, error);
      });
      it('new Aerobus inherits #trace', function () {
        var trace = function trace() {};

        assert.strictEqual(aerobus({
          trace: trace
        }).create().trace, trace);
      });
      it('new Aerobus inherits channel extensions', function () {
        var extension = function extension() {};

        assert.strictEqual(aerobus({
          channel: {
            extension: extension
          }
        }).create().root.extension, extension);
      });
      it('new Aerobus inherits message extensions', function () {
        var extension = function extension() {},
            result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message;
        };

        aerobus({
          message: {
            extension: extension
          }
        }).create().root.subscribe(subscriber).publish();
        assert.strictEqual(result.extension, extension);
      });
      it('new Aerobus inherits section extensions', function () {
        var extension = function extension() {};

        assert.strictEqual(aerobus({
          section: {
            extension: extension
          }
        }).create()('test0', 'test1').extension, extension);
      });
    });
    describe('#delimiter', function () {
      it('is string', function () {
        assert.isString(aerobus().delimiter);
      });
      it('is read-only', function () {
        assert.throw(function () {
          return aerobus().delimiter = null;
        });
      });
    });
    describe('#error', function () {
      it('is a function', function () {
        assert.isFunction(aerobus().error);
      });
      it('is read-only', function () {
        assert.throw(function () {
          return aerobus().error = null;
        });
      });
      it('is invoked with error thrown in subscriber', function (done) {
        var result = undefined,
            error = new Error(),
            bus = aerobus({
          error: function error(err) {
            return result = err;
          }
        });
        bus.root.subscribe(function () {
          throw error;
        }).publish();
        setImmediate(function () {
          assert.strictEqual(result, error);
          done();
        });
      });
    });
    describe('#root', function () {
      it('is instance of Channel', function () {
        assert.typeOf(aerobus().root, 'Aerobus.Channel');
      });
      it('is read-only', function () {
        assert.throw(function () {
          return aerobus().root = null;
        });
      });
    });
    describe('#trace', function () {
      it('is function', function () {
        var bus = aerobus();
        assert.isFunction(bus.trace);
      });
      it('is read-write', function () {
        var trace = function trace() {},
            bus = aerobus();

        bus.trace = trace;
        assert.strictEqual(bus.trace, trace);
      });
      it('is invoked for channel.bubble() with arguments ("bubble", channel, true)', function () {
        var results = [],
            trace = function trace() {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.bubble(true);
        assert.strictEqual(results[0], 'bubble');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], true);
      });
      it('is invoked for channel.bubble(false) with arguments ("bubble", channel, false)', function () {
        var results = [],
            trace = function trace() {
          for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.bubble(false);
        assert.strictEqual(results[0], 'bubble');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], false);
      });
      it('is invoked for channel.clear() with arguments ("clear", channel)', function () {
        var results = [],
            trace = function trace() {
          for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            args[_key3] = arguments[_key3];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.clear();
        assert.strictEqual(results[0], 'clear');
        assert.strictEqual(results[1], bus.root);
      });
      it('is invoked for channel.enable() with arguments ("enable", channel, true)', function () {
        var results = [],
            trace = function trace() {
          for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            args[_key4] = arguments[_key4];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.enable();
        assert.strictEqual(results[0], 'enable');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], true);
      });
      it('is invoked for channel.enable(false) with arguments ("enable", channel, false)', function () {
        var results = [],
            trace = function trace() {
          for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.enable(false);
        assert.strictEqual(results[0], 'enable');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], false);
      });
      it('is invoked for channel.forward(@string) with arguments ("forward", channel, array) where array contains @string', function () {
        var results = [],
            forwarder = 'test',
            trace = function trace() {
          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.forward(forwarder);
        assert.strictEqual(results[0], 'forward');
        assert.strictEqual(results[1], bus.root);
        assert.include(results[2], forwarder);
      });
      it('is invoked for channel.publish(@data) with arguments ("publish", channel, message) where message.data is @data', function () {
        var data = {},
            results = [],
            trace = function trace() {
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.publish(data);
        assert.strictEqual(results[0], 'publish');
        assert.strictEqual(results[1], bus.root);
        assert.typeOf(results[2], 'Aerobus.Message');
        assert.strictEqual(results[2].data, data);
      });
      it('is invoked for channel.reset() with arguments ("reset", channel)', function () {
        var results = [],
            trace = function trace() {
          for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.reset();
        assert.strictEqual(results[0], 'reset');
        assert.strictEqual(results[1], bus.root);
      });
      it('is invoked for channel.retain(@limit) with arguments ("retain", channel, @limit)', function () {
        var limit = 42,
            results = [],
            trace = function trace() {
          for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            args[_key9] = arguments[_key9];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.retain(limit);
        assert.strictEqual(results[0], 'retain');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], limit);
      });
      it('is invoked for channel.subscribe(@parameters) with arguments ("subscribe", channel, @parameters)', function () {
        var _bus$root;

        var parameters = [1, function () {}],
            results = [],
            trace = function trace() {
          for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            args[_key10] = arguments[_key10];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        (_bus$root = bus.root).subscribe.apply(_bus$root, parameters);

        assert.strictEqual(results[0], 'subscribe');
        assert.strictEqual(results[1], bus.root);
        assert.includeMembers(results[2], parameters);
      });
      it('is invoked for channel.toggle() with arguments ("toggle", channel)', function () {
        var results = [],
            trace = function trace() {
          for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
            args[_key11] = arguments[_key11];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        bus.root.toggle();
        assert.strictEqual(results[0], 'toggle');
        assert.strictEqual(results[1], bus.root);
      });
      it('is invoked for channel.unsubscribe(@parameters) with arguments ("unsubscribe", channel, @parameters)', function () {
        var _bus$root2;

        var parameters = [function () {}],
            results = [],
            trace = function trace() {
          for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
            args[_key12] = arguments[_key12];
          }

          return results = args;
        },
            bus = aerobus({
          trace: trace
        });

        (_bus$root2 = bus.root).unsubscribe.apply(_bus$root2, parameters);

        assert.strictEqual(results[0], 'unsubscribe');
        assert.strictEqual(results[1], bus.root);
        assert.includeMembers(results[2], parameters);
      });
    });
    describe('#unsubscribe()', function () {
      it('is fluent', function () {
        var bus = aerobus(),
            subscriber = function subscriber() {};

        assert.strictEqual(bus.unsubscribe(subscriber), bus);
      });
      it('clears .subscribers of all channels', function () {
        var bus = aerobus(),
            channel0 = bus.root,
            channel1 = bus('test1'),
            channel2 = bus('test2'),
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel0.subscribe(subscriber0, subscriber1);
        channel1.subscribe(subscriber0);
        channel2.subscribe(subscriber1);
        bus.unsubscribe();
        assert.strictEqual(channel0.subscribers.length, 0);
        assert.strictEqual(channel1.subscribers.length, 0);
        assert.strictEqual(channel2.subscribers.length, 0);
      });
    });
    describe('#unsubscribe(@function)', function () {
      it('removes @function from .subscribers of all channels', function () {
        var bus = aerobus(),
            channel1 = bus('test1'),
            channel2 = bus('test2'),
            subscriber = function subscriber() {};

        channel1.subscribe(subscriber);
        channel2.subscribe(subscriber);
        bus.unsubscribe(subscriber);
        assert.notInclude(channel1.subscribers, subscriber);
        assert.notInclude(channel2.subscribers, subscriber);
      });
    });
    describe('#unsubscribe(...@functions)', function () {
      it('removes @functions from #subscribers of all channels', function () {
        var bus = aerobus(),
            channel1 = bus('test1'),
            channel2 = bus('test2'),
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel1.subscribe(subscriber1, subscriber2);
        channel2.subscribe(subscriber1, subscriber2);
        bus.unsubscribe(subscriber1, subscriber2);
        assert.notInclude(channel1.subscribers, subscriber1);
        assert.notInclude(channel1.subscribers, subscriber2);
        assert.notInclude(channel2.subscribers, subscriber1);
        assert.notInclude(channel2.subscribers, subscriber2);
      });
    });
  });
  describe('Aerobus.Channel', function () {
    describe('#bubble()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.bubble(), channel);
      });
      it('sets #bubbles', function () {
        var channel = aerobus(false).root;
        channel.bubble();
        assert.isTrue(channel.bubbles);
      });
    });
    describe('#bubble(false)', function () {
      it('clears #bubbles', function () {
        var channel = aerobus().root;
        channel.bubble(false);
        assert.isFalse(channel.bubbles);
      });
    });
    describe('#bubbles', function () {
      it('is boolean', function () {
        assert.isTrue(aerobus().root.bubbles);
      });
      it('is inherited from parent bus', function () {
        assert.isTrue(aerobus(true).root.bubbles);
        assert.isFalse(aerobus(false).root.bubbles);
      });
    });
    describe('#clear()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.clear(), channel);
      });
      it('clears #retentions', function () {
        var channel = aerobus().root;
        channel.retain().publish().clear();
        assert.strictEqual(channel.retentions.length, 0);
      });
      it('clears #subscribers', function () {
        var channel = aerobus().root;
        channel.subscribe(function () {}).clear();
        assert.strictEqual(channel.subscribers.length, 0);
      });
    });
    describe('#enable()', function () {
      it('is fluent', function () {
        var bus = aerobus();
        assert.strictEqual(bus.root.enable(), bus.root);
      });
      it('sets #enabled', function () {
        assert.isTrue(aerobus().root.enable(false).enable().enabled);
      });
    });
    describe('#enable(false)', function () {
      it('clears #enabled', function () {
        assert.isFalse(aerobus().root.enable(false).enabled);
      });
      it('supresses publication to this channel', function () {
        var result = false;
        aerobus().root.subscribe(function () {
          return result = true;
        }).enable(false).publish();
        assert.isFalse(result);
      });
      it('supresses publication to descendant channel', function () {
        var channel = aerobus()('parent.child'),
            result = false;
        channel.subscribe(function () {
          return result = true;
        }).parent.enable(false);
        channel.publish();
        assert.isFalse(result);
      });
    });
    describe('#enable(true)', function () {
      it('sets #enabled', function () {
        assert.isTrue(aerobus().root.enable(false).enable(true).enabled);
      });
      it('resumes publication to this channel', function () {
        var result = false;
        aerobus().root.subscribe(function () {
          return result = true;
        }).enable(false).enable(true).publish();
        assert.isTrue(result);
      });
      it('resumes publication to descendant channel', function () {
        var channel = aerobus()('parent.child'),
            result = false;
        channel.subscribe(function () {
          return result = true;
        }).parent.enable(false).enable(true);
        channel.publish();
        assert.isTrue(result);
      });
    });
    describe('#enabled', function () {
      it('is boolean', function () {
        assert.isBoolean(aerobus().root.enabled);
      });
      it('is true by default', function () {
        assert.isTrue(aerobus().root.enabled);
      });
    });
    describe('#forward()', function () {
      it('is fluent', function () {
        var bus = aerobus();
        assert.strictEqual(bus.root.forward(), bus.root);
      });
    });
    describe('#forward(@function)', function () {
      it('adds @function to #forwarders', function () {
        var bus = aerobus(),
            forwarder = function forwarder() {};

        bus.root.forward(forwarder);
        assert.include(bus.root.forwarders, forwarder);
      });
      it('forwards publications to channel defined by @function', function () {
        var bus = aerobus(),
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
        assert.strictEqual(result0, 0);
        assert.strictEqual(result1, 1);
      });
      it('forwards publications to multuple channels defined by @function', function () {
        var bus = aerobus(),
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
        assert.isTrue(result0);
        assert.isTrue(result1);
        assert.isTrue(result2);
      });
      it('does not forward publication when @function returns false', function () {
        var bus = aerobus(),
            result = undefined;
        bus('test').subscribe(function (data) {
          return result = data;
        }).forward(function () {
          return false;
        }).publish(true);
        assert.isTrue(result);
      });
      it('does not forward publication when @function returns undefined', function () {
        var bus = aerobus(),
            result = undefined;
        bus('test').subscribe(function (data) {
          return result = data;
        }).forward(function () {}).publish(true);
        assert.isTrue(result);
      });
      it('does not forward publication when @function returns #name of this channel', function () {
        var bus = aerobus(),
            result = undefined;
        bus('test').subscribe(function (data) {
          return result = data;
        }).forward(function () {
          return 'test';
        }).publish(true);
        assert.isTrue(result);
      });
      it('stops forwarding publication when infinite forwarding loop is detected', function () {
        var bus = aerobus(),
            notifications = 0;
        bus('test0').forward(function () {
          return 'test1';
        });
        bus('test1').forward(function () {
          return 'test0';
        }).subscribe(function () {
          return notifications++;
        }).publish(true);
        assert.strictEqual(notifications, 1);
      });
    });
    describe('#forward(@string)', function () {
      it('adds @string to #forwarders', function () {
        var bus = aerobus(),
            forwarder = 'test';
        bus.root.forward(forwarder);
        assert.include(bus.root.forwarders, forwarder);
      });
      it('forwards publications to channel specified by @string', function () {
        var bus = aerobus(),
            result = undefined;
        bus('sink').subscribe(function (data) {
          return result = data;
        });
        bus('test').forward('sink').publish(true);
        assert.isTrue(result);
      });
    });
    describe('#forward(@function, @string)', function () {
      it('adds @function and @string to #forwarders', function () {
        var _bus$root3;

        var bus = aerobus(),
            forwarders = [function () {}, 'test'];

        (_bus$root3 = bus.root).forward.apply(_bus$root3, forwarders);

        assert.includeMembers(bus.root.forwarders, forwarders);
      });
    });
    describe('#forward(!(@function || @string))', function () {
      it('throws', function () {
        var bus = aerobus();
        assert.throw(function () {
          return bus.root.forward([]);
        });
        assert.throw(function () {
          return bus.root.forward(false);
        });
        assert.throw(function () {
          return bus.root.forward(true);
        });
        assert.throw(function () {
          return bus.root.forward(new Date());
        });
        assert.throw(function () {
          return bus.root.forward(1);
        });
        assert.throw(function () {
          return bus.root.forward({});
        });
      });
    });
    describe('#forwarders', function () {
      it('is array', function () {
        assert.isArray(aerobus().root.forwarders);
      });
      it('is empty by default', function () {
        assert.strictEqual(aerobus().root.forwarders.length, 0);
      });
    });
    describe('#[Symbol.iterator]', function () {
      it('is function', function () {
        assert.isFunction(aerobus().root[Symbol.iterator]);
      });
    });
    describe('#[Symbol.iterator] ()', function () {
      it('is instance of Aerobus.Iterator', function () {
        assert.typeOf(aerobus().root[Symbol.iterator](), 'Aerobus.Iterator');
      });
    });
    describe('#name', function () {
      it('is string', function () {
        assert.isString(aerobus().root.name);
      });
      it('is "error" string for error channel', function () {
        assert.strictEqual(aerobus().error.name, 'error');
      });
      it('is empty string for root channel', function () {
        assert.strictEqual(aerobus().root.name, '');
      });
      it('is custom string for custom channel', function () {
        var name = 'some.custom.channel';
        assert.strictEqual(aerobus()(name).name, name);
      });
    });
    describe('#parent', function () {
      it('is instance of Channel for custom channel', function () {
        assert.typeOf(aerobus()('test').parent, 'Aerobus.Channel');
      });
      it('is root channel for channel of first level', function () {
        var bus = aerobus(),
            channel = bus('test');
        assert.strictEqual(channel.parent, bus.root);
      });
      it('is parent channel for second level channel', function () {
        var bus = aerobus(),
            parent = bus('parent'),
            child = bus('parent.child');
        assert.strictEqual(child.parent, parent);
      });
      it('is undefined for root channel', function () {
        assert.isUndefined(aerobus().root.parent);
      });
    });
    describe('#publish()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.publish(), channel);
      });
      it('notifies own subscribers in subcription order ', function () {
        var results = [],
            subscriber0 = function subscriber0() {
          return results.push('first');
        },
            subscriber1 = function subscriber1() {
          return results.push('second');
        };

        aerobus().root.subscribe(subscriber0, subscriber1).publish();
        assert.strictEqual(results[0], 'first');
        assert.strictEqual(results[1], 'second');
      });
      it('notifies ancestor subscribers before own if #bubbles is set', function () {
        var channel = aerobus()('parent.child').bubble(true),
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
        assert.strictEqual(results.length, 3);
        assert.strictEqual(results[0], 'ancestor');
        assert.strictEqual(results[1], 'parent');
        assert.strictEqual(results[2], 'self');
      });
      it('does not notify ancestor subscribers if #bubbles is not set', function () {
        var channel = aerobus()('parent.child').bubble(false),
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
        assert.strictEqual(results.length, 1);
        assert.strictEqual(results[0], 'self');
      });
    });
    describe('#publish(@object)', function () {
      it('notifies own subscriber with @object', function () {
        var publication = {},
            result = undefined,
            subscriber = function subscriber(data) {
          return result = data;
        };

        aerobus().root.subscribe(subscriber).publish(publication);
        assert.strictEqual(result, publication);
      });
      it('notifies own and ancestor subscribers with @object', function () {
        var channel = aerobus()('parent.child'),
            publication = {},
            results = [],
            subscriber = function subscriber(data) {
          return results.push(data);
        };

        channel.parent.parent.subscribe(subscriber);
        channel.parent.subscribe(subscriber);
        channel.subscribe(subscriber);
        channel.publish(publication);
        assert.strictEqual(results[0], publication);
        assert.strictEqual(results[1], publication);
        assert.strictEqual(results[2], publication);
      });
    });
    describe('#publish(@object, @function)', function () {
      it('invokes @function with array containing results returned from all own and ancestor subscribers', function () {
        var channel = aerobus()('parent.child'),
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
        assert.include(results, result0);
        assert.include(results, result1);
        assert.include(results, result2);
      });
    });
    describe('#reset()', function () {
      it('is be fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.reset(), channel);
      });
      it('sets #enabled', function () {
        var channel = aerobus().root;
        channel.enable(false).reset();
        assert.isTrue(channel.enabled);
      });
      it('clears #forwarders', function () {
        var channel = aerobus().root;
        channel.forward('test').reset();
        assert.strictEqual(channel.forwarders.length, 0);
      });
      it('clears #retentions', function () {
        var channel = aerobus().root;
        channel.retain().publish().reset();
        assert.strictEqual(channel.retentions.length, 0);
      });
      it('resets #retentions.limit', function () {
        var channel = aerobus().root;
        channel.retain().publish().reset();
        assert.strictEqual(channel.retentions.limit, 0);
      });
      it('clears #subscribers', function () {
        var channel = aerobus().root;
        channel.subscribe(function () {}).reset();
        assert.strictEqual(channel.subscribers.length, 0);
      });
    });
    describe('#retain()', function () {
      it('is fluent', function () {
        var bus = aerobus();
        assert.strictEqual(bus.root.retain(), bus.root);
      });
      it('sets #retentions.limit property to Number.MAX_SAFE_INTEGER', function () {
        var channel = aerobus().root;
        channel.retain();
        assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
      it('notifies all subsequent subscribtions with all retained publications immediately in order of publication', function () {
        var channel = aerobus().root,
            publication0 = {},
            publication1 = {},
            results = [],
            subscriber = function subscriber(data) {
          return results.push(data);
        };

        channel.retain().publish(publication0).publish(publication1).subscribe(subscriber).subscribe(subscriber);
        assert.strictEqual(results[0], publication0);
        assert.strictEqual(results[1], publication1);
      });
    });
    describe('#retain(false)', function () {
      it('sets #retentions.limit to 0', function () {
        var channel = aerobus().root;
        channel.retain(false);
        assert.strictEqual(channel.retentions.limit, 0);
      });
      it('clears #retentions', function () {
        var channel = aerobus().root,
            publication0 = {},
            publication1 = {};
        channel.retain().publish(publication0).publish(publication1).retain(false);
        assert.strictEqual(channel.retentions.length, 0);
      });
    });
    describe('#retain(true)', function () {
      it('sets #retentions.limit to Number.MAX_SAFE_INTEGER', function () {
        var channel = aerobus().root;
        channel.retain(true);
        assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
    });
    describe('#retain(@number)', function () {
      it('sets #retentions.limit to @number', function () {
        var limit = 42,
            channel = aerobus().root;
        channel.retain(limit);
        assert.strictEqual(channel.retentions.limit, limit);
      });
    });
    describe('#retentions', function () {
      it('is array', function () {
        assert.isArray(aerobus().root.retentions);
      });
      it('contains one latest publication when limited to 1', function () {
        var channel = aerobus().root,
            publication0 = {},
            publication1 = {};
        channel.retain(1).publish(publication0).publish(publication1);
        assert.strictEqual(channel.retentions.length, 1);
        assert.strictEqual(channel.retentions[0].data, publication1);
      });
      it('contains two latest publications when limited to 2', function () {
        var channel = aerobus().root,
            publication0 = {},
            publication1 = {},
            publication2 = {};
        channel.retain(2).publish(publication0).publish(publication1).publish(publication2);
        assert.strictEqual(channel.retentions.length, 2);
        assert.strictEqual(channel.retentions[0].data, publication1);
        assert.strictEqual(channel.retentions[1].data, publication2);
      });
    });
    describe('#retentions.limit', function () {
      it('is number', function () {
        assert.isNumber(aerobus().root.retentions.limit);
      });
    });
    describe('#subscribe()', function () {
      it('throws', function () {
        assert.throw(function () {
          return aerobus().root.subscribe();
        });
      });
    });
    describe('#subscribe(@function)', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.subscribe(function () {}), channel);
      });
      it('adds @function to #subscribers', function () {
        var channel = aerobus().root,
            subscriber = function subscriber() {};

        channel.subscribe(subscriber);
        assert.include(channel.subscribers, subscriber);
      });
    });
    describe('#subscribe(...@functions)', function () {
      it('adds all @functions to #subscribers', function () {
        var channel = aerobus().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(subscriber0, subscriber1);
        assert.include(channel.subscribers, subscriber0);
        assert.include(channel.subscribers, subscriber1);
      });
    });
    describe('#subscribe(@number, @function)', function () {
      it('adds @function to #subscribers ordering by @number', function () {
        var channel = aerobus().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
        assert.strictEqual(channel.subscribers[0], subscriber1);
        assert.strictEqual(channel.subscribers[1], subscriber0);
      });
    });
    describe('#subscribe(@number, ...@functions)', function () {
      it('adds all @functions to #subscribers ordering by @number', function () {
        var channel = aerobus().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber0).subscribe(-1, subscriber1, subscriber2);
        assert.strictEqual(channel.subscribers[0], subscriber1);
        assert.strictEqual(channel.subscribers[1], subscriber2);
        assert.strictEqual(channel.subscribers[2], subscriber0);
      });
    });
    describe('#subscribers', function () {
      it('is array', function () {
        assert.isArray(aerobus().root.subscribers);
      });
      it('is empty array by default', function () {
        assert.strictEqual(aerobus().root.subscribers.length, 0);
      });
    });
    describe('#toggle()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.toggle(), channel);
      });
      it('disables enabled channel', function () {
        assert.isFalse(aerobus().root.enable(true).toggle().enabled);
      });
      it('enables disabled channel', function () {
        assert.isTrue(aerobus().root.enable(false).toggle().enabled);
      });
    });
    describe('#unsubscribe()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.unsubscribe(), channel);
      });
    });
    describe('#unsubscribe(@function)', function () {
      it('removes @function from #subscribers', function () {
        var channel = aerobus().root,
            subscriber = function subscriber() {};

        channel.subscribe(subscriber).unsubscribe(subscriber);
        assert.notInclude(channel.subscribers, subscriber);
        assert.notInclude(channel.subscribers, subscriber);
      });
    });
    describe('#unsubscribe(...@functions)', function () {
      it('removes all @functions from #subscribers', function () {
        var channel = aerobus().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(subscriber0, subscriber1).unsubscribe(subscriber0, subscriber1);
        assert.notInclude(channel.subscribers, subscriber0);
        assert.notInclude(channel.subscribers, subscriber1);
      });
    });
    describe('#unsubscribe(@string)', function () {
      it('removes all subscriptions name as @string from #subscribers', function () {
        var channel = aerobus().root,
            name = 'test',
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(name, subscriber0).subscribe(subscriber1).unsubscribe(name);
        assert.notInclude(channel.subscribers, subscriber0);
        assert.include(channel.subscribers, subscriber1);
      });
    });
  });
  describe('Aerobus.Iterator', function () {
    describe('#done()', function () {
      it('rejects pending promise returned from iterator', function (done) {
        var iterator = aerobus().root[Symbol.iterator]();
        iterator.next().value.then(function () {}, done);
        iterator.done();
      });
    });
    describe('#next()', function () {
      it('returns object', function () {
        var iterator = aerobus().root[Symbol.iterator]();
        assert.isObject(iterator.next());
      });
    });
    describe('#next().done', function () {
      it('is undefined by default', function () {
        var iterator = aerobus().root[Symbol.iterator]();
        assert.isUndefined(iterator.next().done);
      });
      it('is true after iterator is .done()', function () {
        var iterator = aerobus().root[Symbol.iterator]();
        iterator.done();
        assert.isTrue(iterator.next().done);
      });
    });
    describe('#next().value', function () {
      it('is Promise', function () {
        assert.typeOf(aerobus().root[Symbol.iterator]().next().value, 'Promise');
      });
      it('is pending promise initially', function (done) {
        var pending = {},
            result = undefined,
            iterator = aerobus().root[Symbol.iterator]();
        Promise.race([iterator.next().value, Promise.resolve(pending)]).then(function (resolved) {
          return result = resolved;
        });
        setImmediate(function () {
          assert.strictEqual(result, pending);
          done();
        });
      });
      it('resolves with message containing data published preliminarily', function (done) {
        var data = {},
            result = undefined,
            channel = aerobus().root,
            iterator = channel[Symbol.iterator]();
        channel.publish(data);
        iterator.next().value.then(function (resolved) {
          return result = resolved;
        });
        setImmediate(function () {
          assert.typeOf(result, 'Aerobus.Message');
          assert.strictEqual(result.data, data);
          done();
        });
      });
      it('resolves with message containing data published subsequently', function (done) {
        var data = {},
            result = undefined,
            channel = aerobus().root,
            iterator = channel[Symbol.iterator]();
        iterator.next().value.then(function (message) {
          return result = message;
        });
        setImmediate(function () {
          assert.isUndefined(result);
          channel.publish(data);
        });
        setTimeout(function () {
          assert.typeOf(result, 'Aerobus.Message');
          assert.strictEqual(result.data, data);
          done();
        }, 10);
      });
    });
  });
  describe('Aerobus.Message', function () {
    describe('#destination', function () {
      it('gets channel name this message was delivered to', function () {
        var bus = aerobus(),
            channel = bus('test'),
            result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message.destination;
        };

        channel.subscribe(subscriber).publish();
        assert.strictEqual(result, channel.name);
      });
    });
    describe('#route', function () {
      it('gets array of channel names this message traversed', function () {
        var bus = aerobus(),
            root = bus.root,
            parent = bus('parent'),
            child = bus('parent.child'),
            results = [],
            subscriber = function subscriber(_, message) {
          return results = message.route;
        };

        bus.root.subscribe(subscriber);
        child.publish();
        assert.include(results, root.name);
        assert.include(results, parent.name);
        assert.include(results, child.name);
      });
    });
    describe('#data', function () {
      it('gets published data', function () {
        var publication = {},
            result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message.data;
        };

        aerobus().root.subscribe(subscriber).publish(publication);
        assert.strictEqual(result, publication);
      });
    });
  });
  describe('Aerobus.Section', function () {
    describe('#channels', function () {
      it('is array', function () {
        assert.isArray(aerobus()('test1', 'test2').channels);
      });
      it('contains all referenced #channels', function () {
        var bus = aerobus(),
            channel0 = bus('test0'),
            channel1 = bus('test1'),
            section = bus('test0', 'test1');
        assert.include(section.channels, channel0);
        assert.include(section.channels, channel1);
      });
    });
    describe('#clear()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.clear(), section);
      });
      it('clears #subscribers of all #channels', function () {
        var section = aerobus()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.channels.forEach(function (channel) {
          return channel.subscribe(subscriber);
        });
        section.clear();
        section.channels.forEach(function (channel) {
          return assert.strictEqual(channel.subscribers.length, 0);
        });
      });
    });
    describe('#enable()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.enable(), section);
      });
      it('sets #enabled for all #channels', function () {
        var section = aerobus()('test1', 'test2');
        section.enable(false).enable();
        section.channels.forEach(function (channel) {
          return assert.isTrue(channel.enabled);
        });
      });
    });
    describe('#enable(false)', function () {
      it('clears #enabled for all #channels', function () {
        var section = aerobus()('test1', 'test2');
        section.enable(false);
        section.channels.forEach(function (channel) {
          return assert.isFalse(channel.enabled);
        });
      });
    });
    describe('#forward()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.forward(), section);
      });
    });
    describe('#forward(@function)', function () {
      it('adds @function to #forwarders of all #channels', function () {
        var section = aerobus()('test1', 'test2'),
            forwarder = function forwarder() {};

        section.forward(forwarder);
        section.channels.forEach(function (channel) {
          return assert.include(channel.forwarders, forwarder);
        });
      });
    });
    describe('#publish()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.publish(), section);
      });
    });
    describe('#publish(@object)', function () {
      it('publishes @object to all #channels in order of channel reference', function () {
        var section = aerobus()('test1', 'test2'),
            publication = {},
            results = [],
            subscriber = function subscriber(_, message) {
          return results.push(message.destination);
        };

        section.subscribe(subscriber).publish(publication);
        assert.strictEqual(results[0], section.channels[0].name);
        assert.strictEqual(results[1], section.channels[1].name);
      });
    });
    describe('#subscribe()', function () {
      it('throws', function () {
        assert.throw(function () {
          return aerobus()('test1', 'test2').subscribe();
        });
      });
    });
    describe('#subscribe(@function)', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.subscribe(function () {}), section);
      });
      it('adds @function to #subscribers of all #channels', function () {
        var section = aerobus()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.subscribe(subscriber);
        section.channels.forEach(function (channel) {
          return assert.include(channel.subscribers, subscriber);
        });
      });
    });
    describe('#subscribe(@function0, @function1)', function () {
      it('adds @function to #subscribers all #channels', function () {
        var section = aerobus()('test1', 'test2'),
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        section.subscribe(subscriber0, subscriber1);
        section.channels.forEach(function (channel) {
          assert.include(channel.subscribers, subscriber0);
          assert.include(channel.subscribers, subscriber1);
        });
      });
    });
    describe('#toggle()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.toggle(), section);
      });
      it('clears #enabled for all enabled #channels', function () {
        var section = aerobus()('test1', 'test2');
        section.enable(true).toggle();
        section.channels.forEach(function (channel) {
          return assert.isFalse(channel.enabled);
        });
      });
      it('sets #enabled for all disabled #channels', function () {
        var section = aerobus()('test1', 'test2');
        section.enable(false).toggle();
        section.channels.forEach(function (channel) {
          return assert.isTrue(channel.enabled);
        });
      });
    });
    describe('#unsubscribe()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.unsubscribe(), section);
      });
    });
    describe('#unsubscribe(@function)', function () {
      it('removes @function from #subscribers of all #channels', function () {
        var section = aerobus()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.subscribe(subscriber).unsubscribe(subscriber);
        section.channels.forEach(function (channel) {
          return assert.notInclude(channel.subscribers, subscriber);
        });
      });
    });
  });
});