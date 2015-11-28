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
    global.aerobusTest = mod.exports;
  }
})(this, function (_chai, _aerobus) {
  var _aerobus2 = _interopRequireDefault(_aerobus);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  describe('aerobus:', function () {
    it('should be a function', function () {
      _chai.assert.isFunction(_aerobus2.default);
    });
    describe('return value:', function () {
      describe('without arguments:', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.isFunction(bus);
        });
      });
      describe('with one function argument:', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)(function () {});

          _chai.assert.isFunction(bus);
        });
        it('should configure trace property', function () {
          var trace = function trace() {},
              bus = (0, _aerobus2.default)(trace);

          _chai.assert.strictEqual(bus.trace, trace);
        });
      });
      describe('with one object argument:', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)({});

          _chai.assert.isFunction(bus);
        });
        it('should extend instances of Channel class', function () {
          var extension = function extension() {},
              bus = (0, _aerobus2.default)({
            channel: {
              extension: extension
            }
          });

          _chai.assert.strictEqual(bus.root.extension, extension);

          _chai.assert.strictEqual(bus.error.extension, extension);

          _chai.assert.strictEqual(bus('test').extension, extension);
        });
        it('should extend instances of Message class', function (done) {
          var extension = function extension() {},
              bus = (0, _aerobus2.default)({
            message: {
              extension: extension
            }
          });

          bus.root.subscribe(function (data, message) {
            _chai.assert.strictEqual(message.extension, extension);

            done();
          });
          bus.root.publish();
        });
        it('should extend instances of Section class', function () {
          var extension = function extension() {},
              bus = (0, _aerobus2.default)({
            section: {
              extension: extension
            }
          });

          _chai.assert.strictEqual(bus('', 'test').extension, extension);
        });
      });
      describe('with one empty string argument:', function () {
        it('should throw', function () {
          _chai.assert.throw(function () {
            return (0, _aerobus2.default)('');
          });
        });
      });
      describe('with one not empty string argument:', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)(':');

          _chai.assert.isFunction(bus);
        });
        it('should configure delimiter property', function () {
          var delimiter = ':',
              bus = (0, _aerobus2.default)(delimiter);

          _chai.assert.strictEqual(bus.delimiter, delimiter);
        });
      });
      describe('with function and not empty string arguments:', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)(':', function () {});

          _chai.assert.isFunction(bus);
        });
        it('should configure delimiter and trace properties', function () {
          var delimiter = ':',
              trace = function trace() {},
              bus = (0, _aerobus2.default)(delimiter, trace);

          _chai.assert.strictEqual(bus.delimiter, delimiter);

          _chai.assert.strictEqual(bus.trace, trace);
        });
      });
      describe('return value:', function () {
        describe('without arguments:', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus()), 'Aerobus.Channel');
          });
          it('should be the root channel', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(bus(), bus.root);
          });
        });
        describe('with empty string argument:', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('')), 'Aerobus.Channel');
          });
          it('should be the root channel', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(bus(''), bus.root);
          });
        });
        describe('with "error" string argument:', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('error')), 'Aerobus.Channel');
          });
          it('should be the error channel', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(bus('error'), bus.error);
          });
        });
        describe('with one custom string argument:', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('test')), 'Aerobus.Channel');
          });
        });
        describe('with one non-string argument:', function () {
          it('should throw', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.throw(function () {
              return bus(true);
            });

            _chai.assert.throw(function () {
              return bus(false);
            });

            _chai.assert.throw(function () {
              return bus(1);
            });

            _chai.assert.throw(function () {
              return bus({});
            });

            _chai.assert.throw(function () {
              return bus([]);
            });
          });
        });
        describe('with several custom string arguments:', function () {
          it('should be an instance of the Section class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('test1', 'test2', 'test3')), 'Aerobus.Section');
          });
        });
        describe('with any non-string argument:', function () {
          it('should throw', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.throw(function () {
              return bus('', 1);
            });

            _chai.assert.throw(function () {
              return bus(false, '');
            });

            _chai.assert.throw(function () {
              return bus('', {});
            });

            _chai.assert.throw(function () {
              return bus([], '');
            });
          });
        });
      });
      describe('channels property:', function () {
        it('should return an array', function () {
          _chai.assert.isArray((0, _aerobus2.default)().channels);
        });
        it('should return empty array by default', function () {
          _chai.assert.strictEqual((0, _aerobus2.default)().channels.length, 0);
        });
        it('should return new array each time', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.notStrictEqual(bus.channels, bus.channels);
        });
        it('should contain error channel after its resolution', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus.error;

          _chai.assert.include(bus.channels, channel);
        });
        it('should contain root channel after its resolution', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus.root;

          _chai.assert.include(bus.channels, channel);
        });
        it('should contain custom channels after their resolution', function () {
          var bus = (0, _aerobus2.default)(),
              channel1 = bus('test1'),
              channel2 = bus('test2');

          _chai.assert.include(bus.channels, channel1);

          _chai.assert.include(bus.channels, channel2);
        });
      });
      describe('clear method:', function () {
        it('should be a function', function () {
          _chai.assert.isFunction((0, _aerobus2.default)().clear);
        });
        it('should be fluent', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(bus.clear(), bus);
        });
        it('should remove all channels', function () {
          var bus = (0, _aerobus2.default)();
          bus('test1');
          bus('test2');
          bus.clear();

          _chai.assert.strictEqual(bus.channels.length, 0);
        });
      });
      describe('delimiter property:', function () {
        it('should return a string', function () {
          _chai.assert.isString((0, _aerobus2.default)().delimiter);
        });
        it('should return provided value', function () {
          var delimiter = ':';

          _chai.assert.strictEqual((0, _aerobus2.default)(delimiter).delimiter, delimiter);
        });
        it('should not throw when updated if the bus is idle', function () {
          var delimiter = ':';

          _chai.assert.doesNotThrow(function () {
            return (0, _aerobus2.default)().delimiter = delimiter;
          });
        });
        it('should return updated value', function () {
          var delimiter = ':',
              bus = (0, _aerobus2.default)();
          bus.delimiter = delimiter;

          _chai.assert.strictEqual(bus.delimiter, delimiter);
        });
        it('should throw when updated if the bus is not idle', function () {
          var delimiter = ':',
              bus = (0, _aerobus2.default)();
          bus('test');

          _chai.assert.throw(function () {
            return bus.delimiter = delimiter;
          });
        });
        it('should not throw when updated if the bus clear', function () {
          var delimiter = ':',
              bus = (0, _aerobus2.default)();
          bus('test');
          bus.clear();

          _chai.assert.doesNotThrow(function () {
            return bus.delimiter = delimiter;
          });
        });
      });
      describe('error property:', function () {
        it('should return an instance of the Channel class', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(Object.classof(bus.error), 'Aerobus.Channel');
        });
        it('should invoke own subscription with an error thrown by a subscription of other channel', function (done) {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test'),
              error = new Error();
          bus.error.subscribe(function (thrown) {
            _chai.assert.strictEqual(thrown, error);

            done();
          });
          channel.subscribe(function () {
            throw error;
          });
          channel.publish();
        });
        it('should throw if subscription to the error channel throws', function () {
          var bus = (0, _aerobus2.default)(),
              error = new Error();
          bus.error.subscribe(function () {
            throw error;
          });

          _chai.assert.throw(function () {
            return bus.error.publish();
          });
        });
      });
      describe('root property:', function () {
        it('should be an instance of the Channel class', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(Object.classof(bus.root), 'Aerobus.Channel');
        });
        it('should eventually receive a publication to a descendant channel', function (done) {
          var bus = (0, _aerobus2.default)(),
              invocations = 0;
          bus.root.subscribe(function () {
            return ++invocations;
          });
          bus('test').publish();
          setImmediate(function () {
            _chai.assert.strictEqual(invocations, 1);

            done();
          });
        });
      });
      describe('trace property:', function () {
        it('should return a function', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.isFunction(bus.trace);
        });
        it('should return provided value', function () {
          var trace = function trace() {},
              bus = (0, _aerobus2.default)(trace);

          _chai.assert.strictEqual(bus.trace, trace);
        });
        it('should not throw when updated if the bus is idle', function () {
          var trace = function trace() {},
              bus = (0, _aerobus2.default)();

          _chai.assert.doesNotThrow(function () {
            return bus.trace = trace;
          });
        });
        it('should return updated value', function () {
          var trace = function trace() {},
              bus = (0, _aerobus2.default)();

          bus.trace = trace;

          _chai.assert.strictEqual(bus.trace, trace);
        });
        it('should throw when updated if the bus is not idle', function () {
          var trace = function trace() {},
              bus = (0, _aerobus2.default)();

          bus('test');

          _chai.assert.throw(function () {
            return bus.trace = trace;
          });
        });
        it('should not throw when updated if the bus clear', function () {
          var trace = function trace() {},
              bus = (0, _aerobus2.default)();

          bus('test');
          bus.clear();

          _chai.assert.doesNotThrow(function () {
            return bus.trace = trace;
          });
        });
      });
      describe('unsubscribe method:', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.isFunction(bus.unsubscribe);
        });
        it('should be fluent', function () {
          var bus = (0, _aerobus2.default)(),
              subscription = function subscription() {};

          _chai.assert.strictEqual(bus.unsubscribe(subscription), bus);
        });
        it('should remove one subscription from one channel', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test'),
              subscription = function subscription() {};

          channel.subscribe(subscription);
          bus.unsubscribe(subscription);

          _chai.assert.notInclude(channel.subscriptions, subscription);
        });
        it('should remove many subscriptions from one channel', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test'),
              subscriber1 = function subscriber1() {},
              subscriber2 = function subscriber2() {};

          channel.subscribe(subscriber1, subscriber2);
          bus.unsubscribe(subscriber1, subscriber2);

          _chai.assert.notInclude(channel.subscriptions, subscriber1);

          _chai.assert.notInclude(channel.subscriptions, subscriber2);
        });
        it('should remove one subscription from many channels', function () {
          var bus = (0, _aerobus2.default)(),
              channel1 = bus('test1'),
              channel2 = bus('test2'),
              subscription = function subscription() {};

          channel1.subscribe(subscription);
          channel2.subscribe(subscription);
          bus.unsubscribe(subscription);

          _chai.assert.notInclude(channel1.subscriptions, subscription);

          _chai.assert.notInclude(channel2.subscriptions, subscription);
        });
      });
    });
  });
  describe('Channel class:', function () {
    describe('bus property:', function () {
      it('should return own bus', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus('test').bus, bus);

        _chai.assert.strictEqual(bus.error.bus, bus);

        _chai.assert.strictEqual(bus.root.bus, bus);
      });
    });
    describe('clear method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.clear);
      });
      it('should be fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.clear(), channel);
      });
      it('should enable the channel', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.disable().clear();

        _chai.assert.isTrue(channel.isEnabled);
      });
      it('should remove all retentions', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain().publish().clear();

        _chai.assert.strictEqual(channel.retentions.length, 0);
      });
      it('should remove all subscriptions', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.subscribe(function () {}).clear();

        _chai.assert.strictEqual(channel.subscriptions.length, 0);
      });
    });
    describe('disable method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.disable);
      });
      it('should be fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.disable(), channel);
      });
      it('should disable the channel', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.disable();

        _chai.assert.isFalse(channel.isEnabled);
      });
      it('should supress publication delivery', function (done) {
        var channel = (0, _aerobus2.default)().root,
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        }).disable().publish();
        setImmediate(function () {
          _chai.assert.strictEqual(invocations, 0);

          done();
        });
      });
      it('should supress publication delivery to descendant channel', function (done) {
        var channel = (0, _aerobus2.default)()('parent.child'),
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        }).parent.disable();
        channel.publish();
        setImmediate(function () {
          _chai.assert.strictEqual(invocations, 0);

          done();
        });
      });
    });
    describe('enable method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.enable);
      });
      it('should be fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.enable(), bus.root);
      });
      it('should enable the channel when called without arguments', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.disable().enable().isEnabled);
      });
      it('should enable the channel when called with truthy argument', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.disable().enable(true).isEnabled);
      });
      it('should disable the channel when called with falsey argument', function () {
        _chai.assert.isFalse((0, _aerobus2.default)().root.enable(false).isEnabled);
      });
      it('should resume publication delivery', function (done) {
        var channel = (0, _aerobus2.default)().root,
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        }).disable().enable().publish();
        setImmediate(function () {
          _chai.assert.strictEqual(invocations, 1);

          done();
        });
      });
    });
    describe('isEnabled property:', function () {
      it('should return a boolean', function () {
        _chai.assert.isBoolean((0, _aerobus2.default)().root.isEnabled);
      });
      it('should return true by default', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.isEnabled);
      });
      it('should return false if parent channel is disabled', function () {
        var channel = (0, _aerobus2.default)()('test');
        channel.parent.disable();

        _chai.assert.isFalse(channel.isEnabled);
      });
      it('should return true after parent channel has been enabled', function () {
        var channel = (0, _aerobus2.default)()('test');
        channel.parent.disable().enable();

        _chai.assert.isTrue(channel.isEnabled);
      });
    });
    describe('@@iterator property:', function () {
      it('should return a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root[Symbol.iterator]);
      });
      describe('return value:', function () {
        it('should be an instance of the Iterator class', function () {
          _chai.assert.strictEqual(Object.classof((0, _aerobus2.default)().root[Symbol.iterator]()), 'Aerobus.Iterator');
        });
      });
    });
    describe('name property:', function () {
      it('should return a string', function () {
        _chai.assert.isString((0, _aerobus2.default)().root.name);
      });
      it('should return provided value', function () {
        var name = 'test';

        _chai.assert.strictEqual((0, _aerobus2.default)()(name).name, name);
      });
      it('name return "error" string for the error channel', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().error.name, 'error');
      });
      it('name return empty string for the root channel', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.name, '');
      });
    });
    describe('parent property:', function () {
      it('should return an instance of the Channel class for custom channel', function () {
        _chai.assert.strictEqual(Object.classof((0, _aerobus2.default)()('test').parent), 'Aerobus.Channel');
      });
      it('should return the root channel for a channel of first level depth', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.parent, bus.root);
      });
      it('should return non root channel for a channel of second level depth', function () {
        var bus = (0, _aerobus2.default)(),
            parent = 'parent',
            child = 'child',
            channel = bus(parent + bus.delimiter + child);

        _chai.assert.strictEqual(channel.parent.name, parent);
      });
      it('should be undefined for the error channel', function () {
        _chai.assert.isUndefined((0, _aerobus2.default)().error.parent);
      });
      it('should be undefined for the root channel', function () {
        _chai.assert.isUndefined((0, _aerobus2.default)().root.parent);
      });
    });
    describe('publish method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.publish);
      });
      it('should not throw when called without arguments', function () {
        _chai.assert.doesNotThrow(function () {
          return (0, _aerobus2.default)().root.publish();
        });
      });
      it('should throw when callback argument is not a function', function () {
        _chai.assert.throw(function () {
          return (0, _aerobus2.default)().root.publish({}, 'test');
        });
      });
      it('should be fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.publish(), channel);
      });
      it('should notify two own subscriptions with provided data in the order of subcription', function (done) {
        var count = 0,
            data = {};
        (0, _aerobus2.default)().root.subscribe(function (value) {
          _chai.assert.strictEqual(++count, 1);

          _chai.assert.strictEqual(value, data);
        }, function (value) {
          _chai.assert.strictEqual(++count, 2);

          _chai.assert.strictEqual(value, data);

          done();
        }).publish(data);
      });
      it('should notify ancestor subscriptions with provided data before own subscription', function (done) {
        var channel = (0, _aerobus2.default)()('parent.child'),
            count = 0,
            data = {};
        channel.parent.parent.subscribe(function (value) {
          _chai.assert.strictEqual(++count, 1);

          _chai.assert.strictEqual(value, data);
        });
        channel.parent.subscribe(function (value) {
          _chai.assert.strictEqual(++count, 2);

          _chai.assert.strictEqual(value, data);
        });
        channel.subscribe(function (value) {
          _chai.assert.strictEqual(++count, 3);

          _chai.assert.strictEqual(value, data);

          done();
        });
        channel.publish(data);
      });
      it('should notify all subscriptions and invoke callback with array containing all values returned by the subscriptions', function (done) {
        var channel = (0, _aerobus2.default)()('parent.child'),
            result1 = {},
            result2 = {},
            result3 = {};
        channel.parent.parent.subscribe(function () {
          return result1;
        });
        channel.parent.subscribe(function () {
          return result2;
        });
        channel.subscribe(function () {
          return result3;
        });
        channel.publish(null, function (results) {
          _chai.assert.include(results, result1);

          _chai.assert.include(results, result2);

          _chai.assert.include(results, result3);

          done();
        });
      });
    });
    describe('retain method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.retain);
      });
      it('should not throw when called without arguments', function () {
        _chai.assert.doesNotThrow(function () {
          return (0, _aerobus2.default)().root.retain();
        });
      });
      it('should be fluent', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.retain(), bus.root);
      });
      it('should set retentions.limit property to Number.MAX_SAFE_INTEGER when called without arguments', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain();

        _chai.assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
      it('should set retentions.limit property when called with numeric argument', function () {
        var limit = 1,
            channel = (0, _aerobus2.default)().root;
        channel.retain(limit);

        _chai.assert.strictEqual(channel.retentions.limit, limit);
      });
      it('should set retentions.limit property to Number.MAX_SAFE_INTEGER when called with truthy argument', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain(true);

        _chai.assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
      it('should set retentions.limit property to 0 when called with falsey argument', function () {
        var channel = (0, _aerobus2.default)().root;
        channel.retain(false);

        _chai.assert.strictEqual(channel.retentions.limit, 0);
      });
      it('should clear retentions array when called with falsey argument', function () {
        var channel = (0, _aerobus2.default)().root,
            data1 = {},
            data2 = {};
        channel.retain().publish(data1).publish(data2).retain(0);

        _chai.assert.strictEqual(channel.retentions.length, 0);
      });
      it('should deliver one retained publication to subsequent subscribtion', function (done) {
        var channel = (0, _aerobus2.default)().root,
            publication = {};
        channel.retain().publish(publication).subscribe(function (data) {
          _chai.assert.strictEqual(data, publication);

          done();
        });
      });
      it('should deliver two retained publications to subsequent subscribtion', function (done) {
        var channel = (0, _aerobus2.default)().root,
            publication1 = {},
            publication2 = {},
            expectations = [publication1, publication2];
        channel.retain().publish(publication1).publish(publication2).subscribe(function (data) {
          _chai.assert.strictEqual(data, expectations.shift());

          if (!expectations.length) done();
        });
      });
      it('should deliver retained publication to subsequent subscribtion after called with falsey argument', function (done) {
        var channel = (0, _aerobus2.default)().root,
            invocations = 0,
            publication = {};
        channel.retain().publish(publication).retain(false).subscribe(function () {
          return ++invocations;
        });
        setImmediate(function () {
          _chai.assert.strictEqual(invocations, 0);

          done();
        });
      });
    });
    describe('retentions property:', function () {
      it('should be an array', function () {
        _chai.assert.isArray((0, _aerobus2.default)().root.retentions);
      });
      it('should have numeric "limit" property', function () {
        _chai.assert.isNumber((0, _aerobus2.default)().root.retentions.limit);
      });
      it('should contain one latest publication when limited to 1', function () {
        var channel = (0, _aerobus2.default)().root,
            data1 = {},
            data2 = {};
        channel.retain(1).publish(data1).publish(data2);

        _chai.assert.strictEqual(channel.retentions.length, 1);

        _chai.assert.strictEqual(channel.retentions[0].data, data2);
      });
      it('should contain two latest publications when limited to 2', function () {
        var channel = (0, _aerobus2.default)().root,
            data1 = {},
            data2 = {},
            data3 = {};
        channel.retain(2).publish(data1).publish(data2).publish(data3);

        _chai.assert.strictEqual(channel.retentions.length, 2);

        _chai.assert.strictEqual(channel.retentions[0].data, data2);

        _chai.assert.strictEqual(channel.retentions[1].data, data3);
      });
    });
    describe('root property:', function () {
      it('should be the root channel of own bus', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.error.root, bus.root);

        _chai.assert.strictEqual(bus.root.root, bus.root);

        _chai.assert.strictEqual(bus('test').root, bus.root);
      });
    });
    describe('subscribe method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.subscribe);
      });
      it('should not throw when called without arguments', function () {
        _chai.assert.doesNotThrow(function () {
          return (0, _aerobus2.default)().root.subscribe();
        });
      });
      it('should be fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.subscribe(), channel);
      });
      it('should add one subscription to subscriptions array', function () {
        var channel = (0, _aerobus2.default)().root,
            subscription = function subscription() {};

        channel.subscribe(subscription);

        _chai.assert.include(channel.subscriptions, subscription);
      });
      it('should add many subscriptions to subscriptions array', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber1, subscriber2);

        _chai.assert.include(channel.subscriptions, subscriber1);

        _chai.assert.include(channel.subscriptions, subscriber2);
      });
    });
    describe('subscriptions property:', function () {
      it('should return an array', function () {
        _chai.assert.isArray((0, _aerobus2.default)().root.subscriptions);
      });
      it('should return empty array by default', function () {
        _chai.assert.strictEqual((0, _aerobus2.default)().root.subscriptions.length, 0);
      });
      it('should return new array each time', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.notStrictEqual(channel.subscriptions, channel.subscriptions);
      });
    });
    describe('toggle method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.toggle);
      });
      it('should be fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.toggle(), channel);
      });
      it('should disable enabled channel', function () {
        _chai.assert.isFalse((0, _aerobus2.default)().root.toggle().isEnabled);
      });
      it('should enable disabled channel', function () {
        _chai.assert.isTrue((0, _aerobus2.default)().root.disable().toggle().isEnabled);
      });
    });
    describe('unsubscribe method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root.unsubscribe);
      });
      it('should not throw when called without arguments', function () {
        _chai.assert.doesNotThrow(function () {
          return (0, _aerobus2.default)().root.unsubscribe();
        });
      });
      it('should be fluent', function () {
        var channel = (0, _aerobus2.default)().root;

        _chai.assert.strictEqual(channel.unsubscribe(), channel);
      });
      it('should remove specified subscriptions from the channel when called with arguments', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber1, subscriber2).unsubscribe(subscriber1, subscriber2);

        _chai.assert.notInclude(channel.subscriptions, subscriber1);

        _chai.assert.notInclude(channel.subscriptions, subscriber2);
      });
      it('should remove all subscriptions from the channel when called without arguments', function () {
        var channel = (0, _aerobus2.default)().root,
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber1, subscriber2).unsubscribe();

        _chai.assert.notInclude(channel.subscriptions, subscriber1);

        _chai.assert.notInclude(channel.subscriptions, subscriber2);
      });
    });
  });
  describe('Iterator class:', function () {
    describe('done method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)().root[Symbol.iterator]().done);
      });
      it('should stop iteration setting done property of the iterator result', function () {
        var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();
        iterator.done();

        _chai.assert.isTrue(iterator.next().done);
      });
      it('should reject pending iterator promise', function (done) {
        var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();
        iterator.next().value.then(function () {}, done);
        iterator.done();
      });
    });
    describe('next method:', function () {
      it('should be a function', function () {
        var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();

        _chai.assert.isFunction(iterator.next);
      });
      describe('return value:', function () {
        it('should be an object', function () {
          var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();

          _chai.assert.isObject(iterator.next());
        });
        describe('done property:', function () {
          it('should be falsey', function () {
            var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();

            _chai.assert.ok(!iterator.next().done);
          });
        });
        describe('value property:', function () {
          it('should return an instance of the Promise class', function () {
            var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();

            _chai.assert.strictEqual(Object.classof(iterator.next().value), 'Promise');
          });
          it('should return pending promise by default', function (done) {
            var iterator = (0, _aerobus2.default)().root[Symbol.iterator](),
                pending = {};
            Promise.race([iterator.next().value, Promise.resolve(pending)]).then(function (value) {
              _chai.assert.strictEqual(value, pending);

              done();
            });
          });
          it('should return a promise resolving after publication to the channel', function (done) {
            var channel = (0, _aerobus2.default)().root,
                iterator = channel[Symbol.iterator](),
                invocations = 0;
            iterator.next().value.then(function () {
              return ++invocations;
            });

            _chai.assert.strictEqual(invocations, 0);

            channel.publish();
            setImmediate(function (message) {
              _chai.assert.strictEqual(invocations, 1);

              done();
            });
          });
          it('should return a promise resolving after a publication with a message containing published data', function (done) {
            var channel = (0, _aerobus2.default)().root,
                data = {},
                iterator = channel[Symbol.iterator]();
            iterator.next().value.then(function (message) {
              _chai.assert.strictEqual(message.data, data);

              done();
            });
            channel.publish(data);
          });
          it('should return resolved promise after a publication', function (done) {
            var channel = (0, _aerobus2.default)().root,
                data = {},
                iterator = channel[Symbol.iterator]();
            channel.publish(data);
            Promise.race([iterator.next().value, Promise.resolve()]).then(function (value) {
              _chai.assert.strictEqual(value.data, data);

              done();
            });
          });
        });
      });
    });
  });
  describe('Message class:', function () {
    describe('channel property:', function () {
      it('should return name of the publishing channel', function (done) {
        var bus = (0, _aerobus2.default)(),
            error = bus.error,
            root = bus.root,
            test = bus('test'),
            pending = 3;
        error.subscribe(function (_, message) {
          _chai.assert.strictEqual(message.channel, error.name);

          if (! --pending) done();
        }).publish();
        root.subscribe(function (_, message) {
          _chai.assert.strictEqual(message.channel, root.name);

          if (! --pending) done();
        }).publish();
        test.subscribe(function (_, message) {
          _chai.assert.strictEqual(message.channel, test.name);

          if (! --pending) done();
        }).publish();
      });
    });
    describe('data property:', function () {
      it('should return data provided to the publish method', function (done) {
        var data = {};
        (0, _aerobus2.default)().root.subscribe(function (_, message) {
          _chai.assert.strictEqual(message.data, data);

          done();
        }).publish(data);
      });
    });
    describe('error property:', function () {
      it('should return caught error', function (done) {
        var bus = (0, _aerobus2.default)(),
            error = new Error();
        bus.error.subscribe(function (_, message) {
          _chai.assert.strictEqual(message.error, error);

          done();
        });
        bus.root.subscribe(function () {
          throw error;
        }).publish();
      });
    });
  });
  describe('Section class:', function () {
    describe('bus property:', function () {
      it('should return own bus', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus('test1', 'test2').bus, bus);
      });
    });
    describe('channels property:', function () {
      it('should return an array', function () {
        _chai.assert.isArray((0, _aerobus2.default)()('test1', 'test2').channels);
      });
      it('should return new array instance each time', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.notStrictEqual(section.channels, section.channels);
      });
    });
    describe('clear method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)()('test1', 'test2').clear);
      });
      it('should be fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.clear(), section);
      });
      it('should clear all the channels referenced', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.channels.forEach(function (channel) {
          return channel.subscribe(function () {});
        });
        section.clear();
        section.channels.forEach(function (channel) {
          return _chai.assert.strictEqual(channel.subscriptions.length, 0);
        });
      });
    });
    describe('disable method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)()('test1', 'test2').disable);
      });
      it('should be fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.disable(), section);
      });
      it('should disable all the channels referenced', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.disable();
        section.channels.forEach(function (channel) {
          return _chai.assert.isFalse(channel.isEnabled);
        });
      });
    });
    describe('enable method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)()('test1', 'test2').enable);
      });
      it('should be fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.enable(), section);
      });
      it('should enable all the channels referenced', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.disable().enable();
        section.channels.forEach(function (channel) {
          return _chai.assert.isTrue(channel.isEnabled);
        });
      });
    });
    describe('publish method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)()('test1', 'test2').publish);
      });
      it('should be fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.publish(), section);
      });
      it('should publish to all the channels referenced', function () {
        var count = 0,
            section = (0, _aerobus2.default)()('test1', 'test2');
        section.subscribe(function () {
          return ++count;
        }).publish();

        _chai.assert.strictEqual(count, section.channels.length);
      });
    });
    describe('subscribe method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)()('test1', 'test2').subscribe);
      });
      it('should be fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.subscribe(), section);
      });
      it('should subscribe to all the channels referenced', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.subscribe(function () {});
        section.channels.forEach(function (channel) {
          return _chai.assert.strictEqual(channel.subscriptions.length, 1);
        });
      });
    });
    describe('toggle method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)()('test1', 'test2').toggle);
      });
      it('should be fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.toggle(), section);
      });
      it('should toggle all the channels referenced', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.toggle();
        section.channels.forEach(function (channel) {
          return _chai.assert.isFalse(channel.isEnabled);
        });
      });
    });
    describe('unsubscribe method:', function () {
      it('should be a function', function () {
        _chai.assert.isFunction((0, _aerobus2.default)()('test1', 'test2').unsubscribe);
      });
      it('should be fluent', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');

        _chai.assert.strictEqual(section.unsubscribe(), section);
      });
      it('should unsubscribe from all the channels referenced', function () {
        var section = (0, _aerobus2.default)()('test1', 'test2');
        section.subscribe(function () {}).unsubscribe();
        section.channels.forEach(function (channel) {
          return _chai.assert.strictEqual(channel.subscriptions.length, 0);
        });
      });
    });
  });
});
