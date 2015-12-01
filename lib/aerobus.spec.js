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
      it('is empty array by default', function () {
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
      it('removes all channels', function () {
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
      it('notifies own subscription with error thrown by subscription of other channel', function (done) {
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
      it('throws if own subscription throws', function () {
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
      it('notifies own subscription with publication of descendant channel', function (done) {
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
            subscription = function subscription() {};

        assert.strictEqual(bus.unsubscribe(subscription), bus);
      });
      it('removes subscription from channel', function () {
        var bus = aerobus(),
            channel = bus('test'),
            subscription = function subscription() {};

        channel.subscribe(subscription);
        bus.unsubscribe(subscription);
        assert.notInclude(channel.subscriptions, subscription);
      });
      it('removes many subscriptions from channel', function () {
        var bus = aerobus(),
            channel = bus('test'),
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber1, subscriber2);
        bus.unsubscribe(subscriber1, subscriber2);
        assert.notInclude(channel.subscriptions, subscriber1);
        assert.notInclude(channel.subscriptions, subscriber2);
      });
      it('removes subscription from many channels', function () {
        var bus = aerobus(),
            channel1 = bus('test1'),
            channel2 = bus('test2'),
            subscription = function subscription() {};

        channel1.subscribe(subscription);
        channel2.subscribe(subscription);
        bus.unsubscribe(subscription);
        assert.notInclude(channel1.subscriptions, subscription);
        assert.notInclude(channel2.subscriptions, subscription);
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
    it('~Aerobus.Channel', function () {
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
    it('~Aerobus.Message', function () {
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
    it('~Aerobus.Section', function () {
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
  describe('aerobus(...)(@string0, @string1)', function () {
    it('is instance of Aerobus.Section', function () {
      assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
    });
    it('contains specified channels (.channels[0].name === @string0)', function () {
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
      it('clears .subscriptions', function () {
        var channel = aerobus().root;
        channel.subscribe(function () {}).clear();
        assert.strictEqual(channel.subscriptions.length, 0);
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
      it('supresses publication delivery', function (done) {
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
      it('supresses publication delivery to descendant channel', function (done) {
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
      it('resumes publication delivery', function (done) {
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
      it('is not root channel for second level channel', function () {
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
      it('notifies own subscription', function (done) {
        aerobus().root.subscribe(done).publish();
      });
      it('notifies own subscriptions in subcription order ', function (done) {
        var order = 0;
        aerobus().root.subscribe(function () {
          assert.strictEqual(++order, 1);
        }, function () {
          assert.strictEqual(++order, 2);
          done();
        }).publish();
      });
      it('notifies ancestor subscriptions before own subscription', function (done) {
        var channel = aerobus()('parent.child'),
            order = 0;
        channel.parent.parent.subscribe(function () {
          assert.strictEqual(++order, 1);
        });
        channel.parent.subscribe(function () {
          assert.strictEqual(++order, 2);
        });
        channel.subscribe(function () {
          assert.strictEqual(++order, 3);
          done();
        });
        channel.publish();
      });
    });
    describe('.publish(@any)', function () {
      it('notifies own subscription with @any', function (done) {
        var data = {};
        aerobus().root.subscribe(function (value) {
          assert.strictEqual(value, data);
          done();
        }).publish(data);
      });
      it('notifies own and ancestor subscriptions with @any', function (done) {
        var channel = aerobus()('parent.child'),
            count = 0,
            data = {};
        channel.parent.parent.subscribe(function (value) {
          assert.strictEqual(value, data);
          if (++count === 3) done();
        });
        channel.parent.subscribe(function (value) {
          assert.strictEqual(value, data);
          if (++count === 3) done();
        });
        channel.subscribe(function (value) {
          assert.strictEqual(value, data);
          if (++count === 3) done();
        });
        channel.publish(data);
      });
    });
    describe('.publish(@any, @function)', function () {
      it('invokes @function with array containing result returned from own subscription', function (done) {
        var channel = aerobus()('parent.child'),
            result = {};
        channel.subscribe(function () {
          return result;
        }).publish(null, function (results) {
          assert.include(results, result);
          done();
        });
      });
      it('invokes @function with array containing results returned from own subscriptions', function (done) {
        var channel = aerobus()('parent.child'),
            result0 = {},
            result1 = {};
        channel.subscribe(function () {
          return result0;
        }, function () {
          return result1;
        }).publish(null, function (results) {
          assert.include(results, result0);
          assert.include(results, result1);
          done();
        });
      });
      it('invokes @function with array containing result returned from parent subscription', function (done) {
        var channel = aerobus()('parent.child'),
            result = {};
        channel.parent.subscribe(function () {
          return result;
        });
        channel.publish(null, function (results) {
          assert.include(results, result);
          done();
        });
      });
      it('invokes @callback with array containing results returned from own and parent parent subscriptions', function (done) {
        var channel = aerobus()('parent.child'),
            result0 = {},
            result1 = {};
        channel.parent.subscribe(function () {
          return result0;
        });
        channel.subscribe(function () {
          return result1;
        }).publish(null, function (results) {
          assert.include(results, result0);
          assert.include(results, result1);
          done();
        });
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
      it('notifies all subsequent subscribtions with all retained publications immediately', function (done) {
        var channel = aerobus().root,
            publication0 = {},
            publication1 = {},
            expectations0 = [publication0, publication1],
            expectations1 = [publication0, publication1];
        channel.retain().publish(publication0).publish(publication1).subscribe(function (data) {
          assert.strictEqual(data, expectations0.shift());
        }).subscribe(function (data) {
          assert.strictEqual(data, expectations1.shift());
        });
        setImmediate(function () {
          assert.strictEqual(expectations0.length, 0);
          assert.strictEqual(expectations1.length, 0);
          done();
        });
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
            data1 = {},
            data2 = {};
        channel.retain().publish(data1).publish(data2).retain(0);
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
      it('clears .subscriptions', function () {
        var channel = aerobus().root;
        channel.subscribe(function () {}).reset();
        assert.strictEqual(channel.subscriptions.length, 0);
      });
    });
    describe('.retentions', function () {
      it('is array', function () {
        assert.isArray(aerobus().root.retentions);
      });
      it('contains one latest publication when limited to 1', function () {
        var channel = aerobus().root,
            data1 = {},
            data2 = {};
        channel.retain(1).publish(data1).publish(data2);
        assert.strictEqual(channel.retentions.length, 1);
        assert.strictEqual(channel.retentions[0].data, data2);
      });
      it('contains two latest publications when limited to 2', function () {
        var channel = aerobus().root,
            data1 = {},
            data2 = {},
            data3 = {};
        channel.retain(2).publish(data1).publish(data2).publish(data3);
        assert.strictEqual(channel.retentions.length, 2);
        assert.strictEqual(channel.retentions[0].data, data2);
        assert.strictEqual(channel.retentions[1].data, data3);
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
      it('adds @function to .subscriptions', function () {
        var channel = aerobus().root,
            subscription = function subscription() {};

        channel.subscribe(subscription);
        assert.include(channel.subscriptions, subscription);
      });
    });
    describe('.subscribe(@function0, @function1)', function () {
      it('adds @function0 and @function1 to .subscriptions', function () {
        var channel = aerobus().root,
            subscribtion0 = function subscribtion0() {},
            subscribtion1 = function subscribtion1() {};

        channel.subscribe(subscribtion0, subscribtion1);
        assert.include(channel.subscriptions, subscribtion0);
        assert.include(channel.subscriptions, subscribtion1);
      });
    });
    describe('.subscriptions', function () {
      it('is array', function () {
        assert.isArray(aerobus().root.subscriptions);
      });
      it('is empty array by default', function () {
        assert.strictEqual(aerobus().root.subscriptions.length, 0);
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
      it('removes @function from .subscriptions', function () {
        var channel = aerobus().root,
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber1, subscriber2).unsubscribe(subscriber1, subscriber2);
        assert.notInclude(channel.subscriptions, subscriber1);
        assert.notInclude(channel.subscriptions, subscriber2);
      });
    });
    describe('.unsubscribe(@function0, @function1)', function () {
      it('removes @function0 and @function1 from .subscriptions', function () {
        var channel = aerobus().root,
            subscribtion0 = function subscribtion0() {},
            subscribtion1 = function subscribtion1() {};

        channel.subscribe(subscribtion0, subscribtion1).unsubscribe(subscribtion0, subscribtion1);
        assert.notInclude(channel.subscriptions, subscribtion0);
        assert.notInclude(channel.subscriptions, subscribtion1);
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
      it('is pending promise without preceeding publication', function (done) {
        var iterator = aerobus().root[Symbol.iterator](),
            pending = {};
        Promise.race([iterator.next().value, Promise.resolve(pending)]).then(function (value) {
          assert.strictEqual(value, pending);
          done();
        });
      });
      it('is resolved promise with preceeding publication', function (done) {
        var channel = aerobus().root,
            data = {},
            iterator = channel[Symbol.iterator]();
        channel.publish(data);
        Promise.race([iterator.next().value, Promise.resolve()]).then(function (value) {
          assert.strictEqual(value.data, data);
          done();
        });
      });
      it('resolves after publication to channel', function (done) {
        var channel = aerobus().root,
            iterator = channel[Symbol.iterator](),
            invocations = 0;
        iterator.next().value.then(function () {
          return ++invocations;
        });
        assert.strictEqual(invocations, 0);
        channel.publish();
        setImmediate(function (message) {
          assert.strictEqual(invocations, 1);
          done();
        });
      });
      it('resolves with Aerobus.Message instance', function (done) {
        var channel = aerobus().root,
            iterator = channel[Symbol.iterator]();
        iterator.next().value.then(function (message) {
          assert.typeOf(message, 'Aerobus.Message');
          done();
        });
        channel.publish();
      });
      it('resolves with message.data returning published data', function (done) {
        var channel = aerobus().root,
            data = {},
            iterator = channel[Symbol.iterator]();
        iterator.next().value.then(function (message) {
          assert.strictEqual(message.data, data);
          done();
        });
        channel.publish(data);
      });
    });
  });
  describe('Aerobus.Message', function () {
    describe('.channel', function () {
      it('gets channel this message was delivered to', function (done) {
        var bus = aerobus(),
            channel = bus('test');
        channel.subscribe(function (_, message) {
          assert.strictEqual(message.channel, channel);
          done();
        }).publish();
      });
    });
    describe('.channels', function () {
      it('gets array of channels this message traversed', function (done) {
        var bus = aerobus(),
            root = bus.root,
            parent = bus('parent'),
            child = bus('parent.child');
        bus.root.subscribe(function (_, message) {
          assert.include(message.channels, root);
          assert.include(message.channels, parent);
          assert.include(message.channels, child);
          done();
        });
        child.publish();
      });
    });
    describe('.data', function () {
      it('gets published data', function (done) {
        var data = {};
        aerobus().root.subscribe(function (_, message) {
          assert.strictEqual(message.data, data);
          done();
        }).publish(data);
      });
    });
    describe('.error', function () {
      it('gets error caught in subscription', function (done) {
        var bus = aerobus(),
            error = new Error();
        bus.error.subscribe(function (_, message) {
          assert.strictEqual(message.error, error);
          done();
        });
        bus.root.subscribe(function () {
          throw error;
        }).publish();
      });
    });
    describe('.origin', function () {
      it('gets origin message delivered to previous channel in publication chain', function (done) {
        var bus = aerobus(),
            channel = bus('test'),
            origin = undefined;
        channel.subscribe(function (_, message) {
          assert.strictEqual(message.origin, origin);
          done();
        });
        bus.root.subscribe(function (_, message) {
          origin = message.origin;
        });
        channel.publish();
      });
      it('is undefined when message is delivered to single channel', function (done) {
        aerobus().root.subscribe(function (_, message) {
          assert.isUndefined(message.origin);
          done();
        }).publish();
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
      it('clears all bound channels', function () {
        var section = aerobus()('test1', 'test2');
        section.channels.forEach(function (channel) {
          return channel.subscribe(function () {});
        });
        section.clear();
        section.channels.forEach(function (channel) {
          return assert.strictEqual(channel.subscriptions.length, 0);
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
      it('publishes @object to all bound channels', function (done) {
        var count = 0,
            data = {},
            section = aerobus()('test1', 'test2');
        section.subscribe(function (value) {
          assert.strictEqual(value, data);
          if (++count === section.channels.length) done();
        }).publish(data);
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
            subscription = function subscription() {};

        section.subscribe(subscription);
        section.channels.forEach(function (channel) {
          return assert.include(channel.subscriptions, subscription);
        });
      });
    });
    describe('.subscribe(@function0, @function1)', function () {
      it('subscribes @function to all bound channels', function () {
        var section = aerobus()('test1', 'test2'),
            subscription0 = function subscription0() {},
            subscription1 = function subscription1() {};

        section.subscribe(subscription0, subscription1);
        section.channels.forEach(function (channel) {
          assert.include(channel.subscriptions, subscription0);
          assert.include(channel.subscriptions, subscription1);
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
        var section = aerobus()('test1', 'test2');
        section.subscribe(function () {}).unsubscribe();
        section.channels.forEach(function (channel) {
          return assert.strictEqual(channel.subscriptions.length, 0);
        });
      });
    });
  });
});