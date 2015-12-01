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
    it('is function', function () {
      var bus = aerobus();
      assert.isFunction(bus);
    });
    describe('.channels', function () {
      it('is array', function () {
        assert.isArray(aerobus().channels);
      });
      it('is empty by default', function () {
        assert.strictEqual(aerobus().channels.length, 0);
      });
      it('contains error channel after it is created', function () {
        var bus = aerobus(),
            channel = bus.error;
        assert.include(bus.channels, channel);
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
            channel1 = bus.error,
            channel2 = bus('test');
        assert.include(bus.channels, channel0);
        assert.include(bus.channels, channel1);
        assert.include(bus.channels, channel2);
      });
    });
    describe('.clear()', function () {
      it('is fluent', function () {
        var bus = aerobus();
        assert.strictEqual(bus.clear(), bus);
      });
      it('clears .channels', function () {
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
    });
    describe('.delimiter', function () {
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
    describe('.error', function () {
      it('is instance of Aerobus.Channel', function () {
        assert.typeOf(aerobus().error, 'Aerobus.Channel');
      });
      it('notifies own subscribers with error thrown by subscribers in other channel', function (done) {
        var bus = aerobus(),
            channel = bus('test'),
            error = new Error();
        bus.error.subscribe(function (thrown) {
          assert.strictEqual(thrown, error);
          done();
        });
        channel.subscribe(function () {
          throw error;
        });
        channel.publish();
      });
      it('throws if own subscriber throws', function () {
        var bus = aerobus(),
            error = new Error();
        bus.error.subscribe(function () {
          throw error;
        });
        assert.throw(function () {
          return bus.error.publish();
        });
      });
    });
    describe('.root', function () {
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
    describe('.trace', function () {
      it('is function', function () {
        var bus = aerobus();
        assert.isFunction(bus.trace);
      });
      it('is writable when bus is empty', function () {
        var trace = function trace() {},
            bus = aerobus();

        bus.trace = trace;
        assert.strictEqual(bus.trace, trace);
      });
      it('is not writable when bus is not empty', function () {
        var trace = function trace() {},
            bus = aerobus();

        bus('test');
        assert.throw(function () {
          return bus.trace = trace;
        });
      });
      it('is writable again after bus has been cleared', function () {
        var trace = function trace() {},
            bus = aerobus();

        bus('test');
        bus.clear();
        assert.doesNotThrow(function () {
          return bus.trace = trace;
        });
      });
    });
    describe('.unsubscribe()', function () {
      it('is fluent', function () {
        var bus = aerobus(),
            subscriber = function subscriber() {};

        assert.strictEqual(bus.unsubscribe(subscriber), bus);
      });
    });
    describe('.unsubscribe(@function)', function () {
      it('removes @function from .subscribers of all channel', function () {
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
    describe('.unsubscribe(...@functions)', function () {
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
  describe('aerobus(@function)', function () {
    it('is a function', function () {
      var bus = aerobus(function () {});
      assert.isFunction(bus);
    });
    describe('.trace', function () {
      it('gets @function', function () {
        var trace = function trace() {},
            bus = aerobus(trace);

        assert.strictEqual(bus.trace, trace);
      });
    });
  });
  describe('aerobus("")', function () {
    it('throws error', function () {
      assert.throw(function () {
        return aerobus('');
      });
    });
  });
  describe('aerobus(@string)', function () {
    it('is function', function () {
      assert.isFunction(aerobus(':'));
    });
    it('.delimiter', function () {
      it('gets @string', function () {
        var delimiter = ':',
            bus = aerobus(delimiter);
        assert.strictEqual(bus.delimiter, delimiter);
      });
    });
  });
  describe('aerobus(@object)', function () {
    it('is function', function () {
      assert.isFunction(aerobus({}));
    });
    it('Aerobus.Channel', function () {
      it('instances extended with @object.channel', function () {
        var extension = function extension() {},
            bus = aerobus({
          channel: {
            extension: extension
          }
        });

        assert.strictEqual(bus.root.extension, extension);
        assert.strictEqual(bus.error.extension, extension);
        assert.strictEqual(bus('test').extension, extension);
      });
    });
    it('Aerobus.Message', function () {
      it('instances extended with @object.message', function (done) {
        var extension = function extension() {},
            bus = aerobus({
          message: {
            extension: extension
          }
        });

        bus.root.subscribe(function (data, message) {
          assert.strictEqual(message.extension, extension);
          done();
        });
        bus.root.publish();
      });
    });
    it('Aerobus.Section', function () {
      it('instances extended with @object.section', function () {
        var extension = function extension() {},
            bus = aerobus({
          section: {
            extension: extension
          }
        });

        assert.strictEqual(bus('', 'test').extension, extension);
      });
    });
  });
  describe('aerobus(@function, @string)', function () {
    it('is function', function () {
      var bus = aerobus(':', function () {});
      assert.isFunction(bus);
    });
    it('.delimiter gets @string', function () {
      var delimiter = ':',
          bus = aerobus(delimiter, function () {});
      assert.strictEqual(bus.delimiter, delimiter);
    });
    it('.trace gets @function', function () {
      var trace = function trace() {},
          bus = aerobus(':', trace);

      assert.strictEqual(bus.trace, trace);
    });
  });
  describe('aerobus(...)()', function () {
    it('is instance of Aerobus.Channel', function () {
      var bus = aerobus();
      assert.typeOf(bus(), 'Aerobus.Channel');
    });
    it('is root channel (equals to .bus.root)', function () {
      var channel = aerobus()();
      assert.strictEqual(channel, channel.bus.root);
    });
  });
  describe('aerobus(...)("")', function () {
    it('is instance of Aerobus.Channel', function () {
      var bus = aerobus();
      assert.typeOf(bus(''), 'Aerobus.Channel');
    });
    it('is root channel (equals to .bus.root)', function () {
      var channel = aerobus()('');
      assert.strictEqual(channel, channel.bus.root);
    });
    it('.name gets ""', function () {
      var bus = aerobus(),
          name = '';
      assert.strictEqual(bus(name).name, name);
    });
  });
  describe('aerobus(...)("error")', function () {
    it('is instance of Aerobus.Channel', function () {
      var bus = aerobus();
      assert.typeOf(bus('error'), 'Aerobus.Channel');
    });
    it('is error channel (equals to .bus.error)', function () {
      var channel = aerobus()('error');
      assert.strictEqual(channel, channel.bus.error);
    });
    it('.name gets "error"', function () {
      var bus = aerobus(),
          name = 'error';
      assert.strictEqual(bus(name).name, name);
    });
  });
  describe('aerobus(...)(@string)', function () {
    it('is instance of Aerobus.Channel', function () {
      var bus = aerobus();
      assert.typeOf(bus('test'), 'Aerobus.Channel');
    });
    it('.name gets @string', function () {
      var bus = aerobus(),
          name = 'test';
      assert.strictEqual(bus(name).name, name);
    });
  });
  describe('aerobus(...)(@array)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus()([]);
      });
    });
  });
  describe('aerobus(...)(@boolean)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus()(true);
      });
    });
  });
  describe('aerobus(...)(@date)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus()(new Date());
      });
    });
  });
  describe('aerobus(...)(@number)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus()(42);
      });
    });
  });
  describe('aerobus(...)(@object)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus()({});
      });
    });
  });
  describe('aerobus(...)(@strings)', function () {
    it('is instance of Aerobus.Section', function () {
      assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
    });
    it('contains specified channels (@strings includes .channels[0].name)', function () {
      var names = ['test1', 'test2'],
          section = aerobus().apply(undefined, names);
      assert.strictEqual(section.channels[0].name, names[0]);
      assert.strictEqual(section.channels[1].name, names[1]);
    });
  });
  describe('aerobus(...)(@number, @string)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus()(42, '');
      });
    });
  });
  describe('aerobus(...)(@string, @object)', function () {
    it('throws', function () {
      assert.throw(function () {
        return aerobus()('', {});
      });
    });
  });
  describe('Aerobus.Channel', function () {
    describe('.bus', function () {
      it('is parent bus', function () {
        var bus = aerobus();
        assert.strictEqual(bus('test').bus, bus);
        assert.strictEqual(bus.error.bus, bus);
        assert.strictEqual(bus.root.bus, bus);
      });
    });
    describe('.clear()', function () {
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
    describe('.disable()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.disable(), channel);
      });
      it('disables channel', function () {
        var channel = aerobus().root;
        channel.disable();
        assert.isFalse(channel.isEnabled);
      });
      it('supresses publication', function (done) {
        var channel = aerobus().root,
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        }).disable().publish();
        setImmediate(function () {
          assert.strictEqual(invocations, 0);
          done();
        });
      });
      it('supresses publication to descendant channel', function (done) {
        var channel = aerobus()('parent.child'),
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        }).parent.disable();
        channel.publish();
        setImmediate(function () {
          assert.strictEqual(invocations, 0);
          done();
        });
      });
    });
    describe('.enable()', function () {
      it('is fluent', function () {
        var bus = aerobus();
        assert.strictEqual(bus.root.enable(), bus.root);
      });
      it('enables channel', function () {
        assert.isTrue(aerobus().root.disable().enable().isEnabled);
      });
      it('resumes publication', function (done) {
        var channel = aerobus().root,
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        }).disable().enable().publish();
        setImmediate(function () {
          assert.strictEqual(invocations, 1);
          done();
        });
      });
    });
    describe('.enable(false)', function () {
      it('disables channel', function () {
        assert.isFalse(aerobus().root.enable(false).isEnabled);
      });
    });
    describe('.enable(true)', function () {
      it('enables channel', function () {
        assert.isTrue(aerobus().root.disable().enable(true).isEnabled);
      });
    });
    describe('.isEnabled', function () {
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
    describe('.[Symbol.iterator]', function () {
      it('is function', function () {
        assert.isFunction(aerobus().root[Symbol.iterator]);
      });
    });
    describe('.[Symbol.iterator] ()', function () {
      it('is instance of Aerobus.Iterator', function () {
        assert.typeOf(aerobus().root[Symbol.iterator](), 'Aerobus.Iterator');
      });
    });
    describe('.name', function () {
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
    describe('.parent', function () {
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
    describe('.publish()', function () {
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
    describe('.publish(@object)', function () {
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
    describe('.publish(@object, @function)', function () {
      it('invokes @function with array containing results returned from own and ancestor subscribers', function () {
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
        }).publish(null, callback);
        assert.include(results, result0);
        assert.include(results, result1);
        assert.include(results, result2);
      });
    });
    describe('.retain()', function () {
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
    describe('.retain(false)', function () {
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
    describe('.retain(true)', function () {
      it('sets .retentions.limit to Number.MAX_SAFE_INTEGER', function () {
        var channel = aerobus().root;
        channel.retain(true);
        assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
    });
    describe('.retain(@number)', function () {
      it('sets .retentions.limit to @number', function () {
        var limit = 42,
            channel = aerobus().root;
        channel.retain(limit);
        assert.strictEqual(channel.retentions.limit, limit);
      });
    });
    describe('.reset()', function () {
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
    describe('.retentions', function () {
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
    describe('.retentions.limit', function () {
      it('is number', function () {
        assert.isNumber(aerobus().root.retentions.limit);
      });
    });
    describe('.subscribe()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.subscribe(), channel);
      });
    });
    describe('.subscribe(@function)', function () {
      it('adds @function to .subscribers', function () {
        var channel = aerobus().root,
            subscriber = function subscriber() {};

        channel.subscribe(subscriber);
        assert.include(channel.subscribers, subscriber);
      });
    });
    describe('.subscribe(...@functions)', function () {
      it('adds @functions to .subscribers', function () {
        var channel = aerobus().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(subscriber0, subscriber1);
        assert.include(channel.subscribers, subscriber0);
        assert.include(channel.subscribers, subscriber1);
      });
    });
    describe('.subscribe(@number, @function)', function () {
      it('adds @function to .subscribers ordering by @number', function () {
        var channel = aerobus().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
        assert.strictEqual(channel.subscribers[0], subscriber1);
        assert.strictEqual(channel.subscribers[1], subscriber0);
      });
    });
    describe('.subscribe(@number, ...@functions)', function () {
      it('adds @functions to .subscribers ordering by @number', function () {
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
    describe('.subscribers', function () {
      it('is array', function () {
        assert.isArray(aerobus().root.subscribers);
      });
      it('is empty array by default', function () {
        assert.strictEqual(aerobus().root.subscribers.length, 0);
      });
    });
    describe('.toggle()', function () {
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
    describe('.unsubscribe()', function () {
      it('is fluent', function () {
        var channel = aerobus().root;
        assert.strictEqual(channel.unsubscribe(), channel);
      });
    });
    describe('.unsubscribe(@function)', function () {
      it('removes @function from .subscribers', function () {
        var channel = aerobus().root,
            subscriber = function subscriber() {};

        channel.subscribe(subscriber).unsubscribe(subscriber);
        assert.notInclude(channel.subscribers, subscriber);
        assert.notInclude(channel.subscribers, subscriber);
      });
    });
    describe('.unsubscribe(...@functions)', function () {
      it('removes all @functions from .subscribers', function () {
        var channel = aerobus().root,
            subscriber0 = function subscriber0() {},
            subscriber1 = function subscriber1() {};

        channel.subscribe(subscriber0, subscriber1).unsubscribe(subscriber0, subscriber1);
        assert.notInclude(channel.subscribers, subscriber0);
        assert.notInclude(channel.subscribers, subscriber1);
      });
    });
  });
  describe('Aerobus.Iterator', function () {
    describe('.done()', function () {
      it('rejects pending promise returned from iterator', function (done) {
        var iterator = aerobus().root[Symbol.iterator]();
        iterator.next().value.then(function () {}, done);
        iterator.done();
      });
    });
    describe('.next()', function () {
      it('returns object', function () {
        var iterator = aerobus().root[Symbol.iterator]();
        assert.isObject(iterator.next());
      });
    });
    describe('.next().done', function () {
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
    describe('.next().value', function () {
      it('is Promise', function () {
        var iterator = aerobus().root[Symbol.iterator]();
        assert.typeOf(iterator.next().value, 'Promise');
      });
      it('is pending promise when there is no preceeding publication', function (done) {
        var iterator = aerobus().root[Symbol.iterator](),
            pending = {},
            result = undefined;
        Promise.race([iterator.next().value, Promise.resolve(pending)]).then(function (resolved) {
          return result = resolved;
        });
        setImmediate(function () {
          assert.strictEqual(result, pending);
          done();
        });
      });
      it('is promise resolved with Aerobus.Message instance containing published data when there is preceeding publication', function (done) {
        var channel = aerobus().root,
            publication = {},
            iterator = channel[Symbol.iterator](),
            result = undefined;
        channel.publish(publication);
        iterator.next().value.then(function (resolved) {
          return result = resolved;
        });
        setImmediate(function () {
          assert.typeOf(result, 'Aerobus.Message');
          assert.strictEqual(result.data, publication);
          done();
        });
      });
      it('resolves after publication with Aerobus.Message instance containing published data', function (done) {
        var channel = aerobus().root,
            iterator = channel[Symbol.iterator](),
            publication = {},
            result = undefined,
            resolved = false;
        iterator.next().value.then(function (message) {
          resolved = true;
          result = message;
        });
        assert.isFalse(resolved);
        channel.publish(publication);
        setImmediate(function () {
          assert.isTrue(resolved);
          assert.typeOf(result, 'Aerobus.Message');
          assert.strictEqual(result.data, publication);
          done();
        });
      });
    });
  });
  describe('Aerobus.Message', function () {
    describe('.channel', function () {
      it('gets channel this message was delivered to', function () {
        var bus = aerobus(),
            channel = bus('test'),
            result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message.channel;
        };

        channel.subscribe(subscriber).publish();
        assert.strictEqual(result, channel);
      });
    });
    describe('.channels', function () {
      it('gets array of channels this message traversed', function () {
        var bus = aerobus(),
            root = bus.root,
            parent = bus('parent'),
            child = bus('parent.child'),
            results = [],
            subscriber = function subscriber(_, message) {
          return results = message.channels;
        };

        bus.root.subscribe(subscriber);
        child.publish();
        assert.include(results, root);
        assert.include(results, parent);
        assert.include(results, child);
      });
    });
    describe('.data', function () {
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
    describe('.error', function () {
      it('gets error caught in subscriber', function () {
        var bus = aerobus(),
            error = new Error(),
            result = undefined,
            errorSubscriber = function errorSubscriber(_, message) {
          return result = message.error;
        },
            throwSubscriber = function throwSubscriber() {
          throw error;
        };

        bus.error.subscribe(errorSubscriber);
        bus.root.subscribe(throwSubscriber).publish();
        assert.strictEqual(result, error);
      });
    });
    describe('.origin', function () {
      it('gets origin message delivered to previous channel in publication chain', function () {
        var bus = aerobus(),
            channel = bus('test'),
            origin = undefined,
            result = undefined,
            rootSubscriber = function rootSubscriber(_, message) {
          return origin = message.origin;
        },
            ownSubscriber = function ownSubscriber(_, message) {
          return result = message;
        };

        channel.subscribe(ownSubscriber);
        bus.root.subscribe(rootSubscriber);
        channel.publish();
        assert.strictEqual(result, origin);
      });
      it('is undefined when message is delivered to single channel', function () {
        var result = undefined,
            subscriber = function subscriber(_, message) {
          return result = message;
        };

        aerobus().root.subscribe(subscriber).publish();
        assert.isUndefined(result.origin);
      });
    });
  });
  describe('Aerobus.Section', function () {
    describe('.bus', function () {
      it('gets parent bus', function () {
        var bus = aerobus();
        assert.strictEqual(bus('test1', 'test2').bus, bus);
      });
    });
    describe('.channels', function () {
      it('is array', function () {
        assert.isArray(aerobus()('test1', 'test2').channels);
      });
      it('contains all bound channels', function () {
        var bus = aerobus(),
            channel0 = bus('test0'),
            channel1 = bus('test1'),
            section = bus('test0', 'test1');
        assert.include(section.channels, channel0);
        assert.include(section.channels, channel1);
      });
    });
    describe('.clear()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.clear(), section);
      });
      it('clears .subscribers of all bound channels', function () {
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
    describe('.disable()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.disable(), section);
      });
      it('disables all bound channels', function () {
        var section = aerobus()('test1', 'test2');
        section.disable();
        section.channels.forEach(function (channel) {
          return assert.isFalse(channel.isEnabled);
        });
      });
    });
    describe('.enable()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.enable(), section);
      });
      it('enables all bound channels', function () {
        var section = aerobus()('test1', 'test2');
        section.disable().enable();
        section.channels.forEach(function (channel) {
          return assert.isTrue(channel.isEnabled);
        });
      });
    });
    describe('.publish()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.publish(), section);
      });
    });
    describe('.publish(@object)', function () {
      it('publishes @object to all bound channels in order of declaration', function () {
        var section = aerobus()('test1', 'test2'),
            publication = {},
            results = [],
            subscriber = function subscriber(_, message) {
          return results.push(message.channel);
        };

        section.subscribe(subscriber).publish(publication);
        assert.strictEqual(results[0], section.channels[0]);
        assert.strictEqual(results[1], section.channels[1]);
      });
    });
    describe('.subscribe()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.subscribe(), section);
      });
    });
    describe('.subscribe(@function)', function () {
      it('subscribes @function to all bound channels', function () {
        var section = aerobus()('test1', 'test2'),
            subscriber = function subscriber() {};

        section.subscribe(subscriber);
        section.channels.forEach(function (channel) {
          return assert.include(channel.subscribers, subscriber);
        });
      });
    });
    describe('.subscribe(@function0, @function1)', function () {
      it('subscribes @function to all bound channels', function () {
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
    describe('.toggle()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.toggle(), section);
      });
      it('disables all enabled bound channels', function () {
        var section = aerobus()('test1', 'test2');
        section.toggle();
        section.channels.forEach(function (channel) {
          return assert.isFalse(channel.isEnabled);
        });
      });
      it('enables all disabled bound channels', function () {
        var section = aerobus()('test1', 'test2');
        section.disable().toggle();
        section.channels.forEach(function (channel) {
          return assert.isTrue(channel.isEnabled);
        });
      });
    });
    describe('.unsubscribe()', function () {
      it('is fluent', function () {
        var section = aerobus()('test1', 'test2');
        assert.strictEqual(section.unsubscribe(), section);
      });
    });
    describe('.unsubscribe(@function)', function () {
      it('unsubscribes @function from all bound channels', function () {
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