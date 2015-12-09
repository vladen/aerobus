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
    describe('Aerobus#bubbles', function () {
      it('is true', function () {
        assert.isTrue(aerobus().bubbles);
      });
    });
    describe('Aerobus#delimiter', function () {
      it('is "."', function () {
        assert.strictEqual(aerobus().delimiter, '.');
      });
    });
  });
  describe('aerobus(@object)', function () {
    it('returns instance of Aerobus', function () {
      assert.typeOf(aerobus({}), 'Aerobus');
    });
    describe('@object.bubbles', function () {
      it('configures Aerobus#bubbles', function () {
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
      it('configures Aerobus#delimiter', function () {
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
      it('configures Aerobus#error', function () {
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
      it('configures Aerobus#trace', function () {
        var trace = function trace() {},
            bus = aerobus({
          trace: trace
        });

        assert.strictEqual(bus.trace, trace);
      });
    });
    describe('@object.channel', function () {
      it('extends Aerobus.Channel instances', function () {
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
          clear: null,
          disable: null,
          enable: null,
          isEnabled: null,
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
      it('extends Aerobus.Message instances', function () {
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
      it('extends Aerobus.Section instances', function () {
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
          channels: null,
          clear: null,
          disable: null,
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
  describe('aerobus(!@object)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus([]);
      });
      assert.throw(function () {
        return aerobus(true);
      });
      assert.throw(function () {
        return aerobus(false);
      });
      assert.throw(function () {
        return aerobus(new Date());
      });
      assert.throw(function () {
        return aerobus(0);
      });
      assert.throw(function () {
        return aerobus('');
      });
    });
  });
  describe('Aerobus', function () {
    describe('is function', function () {
      assert.instanceOf(aerobus(), Function);
    });
    describe('#()', function () {
      it('returns instance of Aerobus.Channel', function () {
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
      it('returns instance of Aerobus.Channel', function () {
        var bus = aerobus();
        assert.typeOf(bus(''), 'Aerobus.Channel');
      });
      it('returns #root channel', function () {
        var bus = aerobus(),
            channel = bus('');
        assert.strictEqual(channel, bus.root);
      });
      describe('returned Aerobus.Channel#name', function () {
        it('gets ""', function () {
          var bus = aerobus(),
              name = '';
          assert.strictEqual(bus(name).name, name);
        });
      });
    });
    describe('#(@string)', function () {
      it('returns instance of Aerobus.Channel', function () {
        var bus = aerobus();
        assert.typeOf(bus('test'), 'Aerobus.Channel');
      });
      it('#name gets @string', function () {
        var bus = aerobus(),
            name = 'test';
        assert.strictEqual(bus(name).name, name);
      });
    });
    describe('#(...@strings)', function () {
      it('returns instance of Aerobus.Section', function () {
        assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
      });
      it('returned #channels contain specified channels', function () {
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
    describe('#channels', function () {
      it('is array', function () {
        assert.isArray(aerobus().channels);
      });
      it('is empty by default', function () {
        assert.strictEqual(aerobus().channels.length, 0);
      });
      it('contains root channel after it is created', function () {
        var bus = aerobus(),
            channel = bus.root;
        assert.include(bus.channels, channel);
      });
      it('contains custom channel after it is created', function () {
        var bus = aerobus(),
            channel = bus('test');
        assert.include(bus.channels, channel);
      });
      it('contains several channels after they are created', function () {
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
      it('resolves new channel instance for same Aerobus.Channel#name ', function () {
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
      it('creates new Aerobus instance', function () {
        assert.typeOf(aerobus().create(), 'Aerobus');
      });
      it('new Aerobus instance inherits #delimiter', function () {
        var delimiter = ':';
        assert.strictEqual(aerobus({
          delimiter: delimiter
        }).create().delimiter, delimiter);
      });
      it('new Aerobus instance inherits #error', function () {
        var error = function error() {};

        assert.strictEqual(aerobus({
          error: error
        }).create().error, error);
      });
      it('new Aerobus instance inherits #trace', function () {
        var trace = function trace() {};

        assert.strictEqual(aerobus({
          trace: trace
        }).create().trace, trace);
      });
      it('new Aerobus instance inherits channel extension', function () {
        var extension = function extension() {};

        assert.strictEqual(aerobus({
          channel: {
            extension: extension
          }
        }).create().root.extension, extension);
      });
      it('new Aerobus instance inherits message extension', function () {
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
      it('new Aerobus instance inherits section extension', function () {
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
      it('is writable when bus is empty', function () {
        var delimiter = ':',
            bus = aerobus();
        bus.delimiter = delimiter;
        assert.strictEqual(bus.delimiter, delimiter);
      });
      it('is not writable when bus is not empty', function () {
        var delimiter = ':',
            bus = aerobus();
        bus('test');
        assert.throw(function () {
          return bus.delimiter = delimiter;
        });
      });
      it('is writable again after bus has been cleared', function () {
        var delimiter = ':',
            bus = aerobus();
        bus('test');
        bus.clear();
        assert.doesNotThrow(function () {
          return bus.delimiter = delimiter;
        });
      });
    });
    describe('#error', function () {
      it('is a function', function () {
        assert.isFunction(aerobus().error);
      });
      it('is writable', function () {
        var bus = aerobus(),
            error = function error() {};

        bus.error = error;
        assert.strictEqual(bus.error, error);
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
      it('is instance of Aerobus.Channel', function () {
        assert.typeOf(aerobus().root, 'Aerobus.Channel');
      });
      it('notifies own subscriber with message published to descendant channel', function (done) {
        var bus = aerobus(),
            invocations = 0;
        bus.root.subscribe(function () {
          return ++invocations;
        });
        bus('test').publish();
        setImmediate(function () {
          assert.strictEqual(invocations, 1);
          done();
        });
      });
    });
    describe('#trace', function () {
      it('is function', function () {
        var bus = aerobus();
        assert.isFunction(bus.trace);
      });
      it('is writable', function () {
        var trace = function trace() {},
            bus = aerobus();

        bus.trace = trace;
        assert.strictEqual(bus.trace, trace);
      });
      it('is invoked for channel.clear() with arguments ("clear", channel)', function () {
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

        bus.root.clear();
        assert.strictEqual(results[0], 'clear');
        assert.strictEqual(results[1], bus.root);
      });
      it('is invoked for channel.disable() with arguments ("enable", channel, false)', function () {
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

        bus.root.disable();
        assert.strictEqual(results[0], 'enable');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], false);
      });
      it('is invoked for channel.enable() with arguments ("enable", channel, true)', function () {
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

        bus.root.enable();
        assert.strictEqual(results[0], 'enable');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], true);
      });
      it('is invoked for channel.enable(false) with arguments ("enable", channel, false)', function () {
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

        bus.root.enable(false);
        assert.strictEqual(results[0], 'enable');
        assert.strictEqual(results[1], bus.root);
        assert.strictEqual(results[2], false);
      });
      it('is invoked for channel.publish(@data) with arguments ("publish", channel, message) where message.data is @data', function () {
        var data = {},
            results = [],
            trace = function trace() {
          for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
            args[_key5] = arguments[_key5];
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
          for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
            args[_key6] = arguments[_key6];
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
          for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
            args[_key7] = arguments[_key7];
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
          for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
            args[_key8] = arguments[_key8];
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
          for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
            args[_key9] = arguments[_key9];
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
          for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
            args[_key10] = arguments[_key10];
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
      it('removes @functions from .subscribers of all channels', function () {
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
    describe('#clear()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.clear(), channel);
      });
      it('clears .retentions', function () {
        var channel = aerobus().root;
        channel.retain().publish().clear();
        assert.strictEqual(channel.retentions.length, 0);
      });
      it('clears .subscribers', function () {
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
      it('enables channel', function () {
        assert.isTrue(aerobus().root.disable().enable().isEnabled);
      });
    });
    describe('#enable(false)', function () {
      it('disables channel', function () {
        assert.isFalse(aerobus().root.enable(false).isEnabled);
      });
      it('supresses publication to this channel', function () {
        var result = false;
        aerobus().root.subscribe(function () {
          return result = true;
        }).disable().publish();
        assert.isFalse(result);
      });
      it('supresses publication to descendant channel', function () {
        var channel = aerobus()('parent.child'),
            result = false;
        channel.subscribe(function () {
          return result = true;
        }).parent.disable();
        channel.publish();
        assert.isFalse(result);
      });
    });
    describe('#enable(true)', function () {
      it('enables channel', function () {
        assert.isTrue(aerobus().root.disable().enable(true).isEnabled);
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
    describe('#isEnabled', function () {
      it('is boolean', function () {
        assert.isBoolean(aerobus().root.isEnabled);
      });
      it('is true by default', function () {
        assert.isTrue(aerobus().root.isEnabled);
      });
      it('is false when channel is disabled', function () {
        var channel = aerobus()('test');
        channel.parent.disable();
        assert.isFalse(channel.isEnabled);
      });
      it('is true after channel has been enabled', function () {
        var channel = aerobus()('test');
        channel.parent.disable().enable();
        assert.isTrue(channel.isEnabled);
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
      it('is instance of Aerobus.Channel for custom channel', function () {
        assert.typeOf(aerobus()('test').parent, 'Aerobus.Channel');
      });
      it('is root channel for first level channel', function () {
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
      it('is undefined for error channel', function () {
        assert.isUndefined(aerobus().error.parent);
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
        var traces = [],
            subscriber0 = function subscriber0() {
          return traces.push('first');
        },
            subscriber1 = function subscriber1() {
          return traces.push('second');
        };

        aerobus().root.subscribe(subscriber0, subscriber1).publish();
        assert.strictEqual(traces[0], 'first');
        assert.strictEqual(traces[1], 'second');
      });
      it('notifies ancestor subscribers before own', function () {
        var channel = aerobus()('parent.child'),
            traces = [],
            ancestor = function ancestor() {
          return traces.push('ancestor');
        },
            parent = function parent() {
          return traces.push('parent');
        },
            self = function self() {
          return traces.push('self');
        };

        channel.parent.parent.subscribe(ancestor);
        channel.parent.subscribe(parent);
        channel.subscribe(self);
        channel.publish();
        assert.strictEqual(traces[0], 'ancestor');
        assert.strictEqual(traces[1], 'parent');
        assert.strictEqual(traces[2], 'self');
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
      it('enables channel (sets .isEnabled to true)', function () {
        var channel = aerobus().root;
        channel.disable().reset();
        assert.isTrue(channel.isEnabled);
      });
      it('clears .retentions', function () {
        var channel = aerobus().root;
        channel.retain().publish().reset();
        assert.strictEqual(channel.retentions.length, 0);
      });
      it('resets .retentions.limit', function () {
        var channel = aerobus().root;
        channel.retain().publish().reset();
        assert.strictEqual(channel.retentions.limit, 0);
      });
      it('clears .subscribers', function () {
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
      it('sets .retentions.limit property to Number.MAX_SAFE_INTEGER', function () {
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
      it('sets .retentions.limit to 0', function () {
        var channel = aerobus().root;
        channel.retain(false);
        assert.strictEqual(channel.retentions.limit, 0);
      });
      it('clears .retentions', function () {
        var channel = aerobus().root,
            publication0 = {},
            publication1 = {};
        channel.retain().publish(publication0).publish(publication1).retain(false);
        assert.strictEqual(channel.retentions.length, 0);
      });
    });
    describe('#retain(true)', function () {
      it('sets .retentions.limit to Number.MAX_SAFE_INTEGER', function () {
        var channel = aerobus().root;
        channel.retain(true);
        assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
    });
    describe('#retain(@number)', function () {
      it('sets .retentions.limit to @number', function () {
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
        assert.isFalse(aerobus().root.toggle().isEnabled);
      });
      it('enables disabled channel', function () {
        assert.isTrue(aerobus().root.disable().toggle().isEnabled);
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
      it('contains all united channels', function () {
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
      it('clears .subscribers of all united channels', function () {
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
    describe('#disable()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.disable(), section);
      });
      it('disables all united channels', function () {
        var section = aerobus()('test1', 'test2');
        section.disable();
        section.channels.forEach(function (channel) {
          return assert.isFalse(channel.isEnabled);
        });
      });
    });
    describe('#enable()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.enable(), section);
      });
      it('enables all united channels', function () {
        var section = aerobus()('test1', 'test2');
        section.disable().enable();
        section.channels.forEach(function (channel) {
          return assert.isTrue(channel.isEnabled);
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
      it('publishes @object to all united channels in order of declaration', function () {
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
      it('subscribes @function to all united channels', function () {
        var section = aerobus()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.subscribe(subscriber);
        section.channels.forEach(function (channel) {
          return assert.include(channel.subscribers, subscriber);
        });
      });
    });
    describe('#subscribe(@function0, @function1)', function () {
      it('subscribes @function to all united channels', function () {
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
      it('disables all united channels that enabled', function () {
        var section = aerobus()('test1', 'test2');
        section.toggle();
        section.channels.forEach(function (channel) {
          return assert.isFalse(channel.isEnabled);
        });
      });
      it('enables all united channels that disabled', function () {
        var section = aerobus()('test1', 'test2');
        section.disable().toggle();
        section.channels.forEach(function (channel) {
          return assert.isTrue(channel.isEnabled);
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
      it('unsubscribes @function from all united channels', function () {
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