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
        it('should return new instance each time', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.notStrictEqual(bus.channels, bus.channels);
        });
        it('should contain error channel after its instantiation', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus.error;

          _chai.assert.include(bus.channels, channel);
        });
        it('should contain root channel after its instantiation', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus.root;

          _chai.assert.include(bus.channels, channel);
        });
        it('should contain one custom channel after its instantiation', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.include(bus.channels, channel);
        });
        it('should contain many custom channels after their instantiation', function () {
          var bus = (0, _aerobus2.default)(),
              channel1 = bus('test1'),
              channel2 = bus('test2');

          _chai.assert.include(bus.channels, channel1);

          _chai.assert.include(bus.channels, channel2);
        });
        it('should be empty after clear method call', function () {
          var bus = (0, _aerobus2.default)();
          bus('test1');
          bus('test2');
          bus.clear();

          _chai.assert.strictEqual(bus.channels.length, 0);
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
        it('should invoke own subscriber with an error thrown by a subscription of other channel', function (done) {
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
              subscriber = function subscriber() {};

          _chai.assert.strictEqual(bus.unsubscribe(subscriber), bus);
        });
        it('should remove one subscriber from one channel', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test'),
              subscriber = function subscriber() {};

          channel.subscribe(subscriber);
          bus.unsubscribe(subscriber);

          _chai.assert.notInclude(channel.subscribers, subscriber);
        });
        it('should remove many subscribers from one channel', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test'),
              subscriber1 = function subscriber1() {},
              subscriber2 = function subscriber2() {};

          channel.subscribe(subscriber1, subscriber2);
          bus.unsubscribe(subscriber1, subscriber2);

          _chai.assert.notInclude(channel.subscribers, subscriber1);

          _chai.assert.notInclude(channel.subscribers, subscriber2);
        });
        it('should remove one subscriber from many channels', function () {
          var bus = (0, _aerobus2.default)(),
              channel1 = bus('test1'),
              channel2 = bus('test2'),
              subscriber = function subscriber() {};

          channel1.subscribe(subscriber);
          channel2.subscribe(subscriber);
          bus.unsubscribe(subscriber);

          _chai.assert.notInclude(channel1.subscribers, subscriber);

          _chai.assert.notInclude(channel2.subscribers, subscriber);
        });
      });
    });
  });
  describe('Channel class:', function () {
    describe('bus property:', function () {
      it('should return the owning bus', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus('test').bus, bus);

        _chai.assert.strictEqual(bus.error.bus, bus);

        _chai.assert.strictEqual(bus.root.bus, bus);
      });
    });
    describe('disable method:', function () {
      it('should be a function', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isFunction(channel.disable);
      });
      it('should be fluent', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.disable(), channel);
      });
      it('should disable the channel', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');
        channel.disable();

        _chai.assert.isFalse(channel.isEnabled);
      });
      it('should supress publication delivery', function (done) {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test'),
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        });
        channel.disable();
        channel.publish();
        setImmediate(function () {
          _chai.assert.strictEqual(invocations, 0);

          done();
        });
      });
      it('should supress publication delivery to descendant channel', function (done) {
        var bus = (0, _aerobus2.default)(),
            channel = bus('parent.child'),
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        });
        bus.root.disable();
        channel.publish();
        setImmediate(function () {
          _chai.assert.strictEqual(invocations, 0);

          done();
        });
      });
    });
    describe('enable method:', function () {
      it('should be a function', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isFunction(channel.enable);
      });
      it('should be fluent', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.enable(), channel);
      });
      it('should enable the channel when called without arguments', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');
        channel.disable();
        channel.enable();

        _chai.assert.isTrue(channel.isEnabled);
      });
      it('should enable the channel when called with truthy argument', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');
        channel.disable();
        channel.enable(true);

        _chai.assert.isTrue(channel.isEnabled);
      });
      it('should disable the channel when called with falsey argument', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');
        channel.enable(false);

        _chai.assert.isFalse(channel.isEnabled);
      });
      it('should resume publication delivery', function (done) {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test'),
            invocations = 0;
        channel.subscribe(function () {
          return ++invocations;
        });
        channel.disable();
        channel.enable();
        channel.publish();
        setImmediate(function () {
          _chai.assert.strictEqual(invocations, 1);

          done();
        });
      });
    });
    describe('isEnabled property:', function () {
      it('should return a boolean', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isBoolean(channel.isEnabled);
      });
      it('should return true by default', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isTrue(channel.isEnabled);
      });
      it('should return false if parent channel is disabled', function () {
        var bus = (0, _aerobus2.default)(),
            parent = bus('parent'),
            child = bus('parent.child');
        parent.disable();

        _chai.assert.isFalse(child.isEnabled);
      });
    });
    describe('@@iterator property:', function () {
      it('should return a function', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isFunction(channel[Symbol.iterator]);
      });
      describe('return value:', function () {
        it('should be an instance of the Iterator class', function () {
          var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();

          _chai.assert.strictEqual(Object.classof(iterator), 'Aerobus.Iterator');
        });
      });
    });
    describe('name property:', function () {
      it('should return a string', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isString(channel.name);
      });
      it('should return provided value', function () {
        var name = 'test',
            bus = (0, _aerobus2.default)(),
            channel = bus(name);

        _chai.assert.strictEqual(channel.name, name);
      });
      it('name return "error" string for the error channel', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.error.name, 'error');
      });
      it('name return empty string for the root channel', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.strictEqual(bus.root.name, '');
      });
    });
    describe('parent property:', function () {
      it('should return an instance of the Channel class', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(Object.classof(channel.parent), 'Aerobus.Channel');
      });
      it('should return the root channel for a channel of first level depth', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.parent, bus.root);
      });
      it('should return non root channel for a channel of second level depth', function () {
        var parent = 'parent',
            child = 'child',
            bus = (0, _aerobus2.default)(),
            channel = bus(parent + bus.delimiter + child);

        _chai.assert.strictEqual(channel.parent.name, parent);
      });
      it('should be undefined for the error channel', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.isUndefined(bus.root.parent);
      });
      it('should be undefined for the root channel', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.isUndefined(bus.root.parent);
      });
    });
    describe('publish method:', function () {
      it('should be a function', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isFunction(channel.publish);
      });
      it('should not throw when called without arguments', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.doesNotThrow(function () {
          return channel.publish();
        });
      });
      it('should be fluent', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.publish(), channel);
      });
      it('should eventually invoke one subscriber with provided data', function (done) {
        var data = {},
            bus = (0, _aerobus2.default)(),
            channel = bus('test');
        channel.subscribe(function (value) {
          _chai.assert.strictEqual(value, data);

          done();
        });
        channel.publish(data);
      });
      it('should eventually invoke many subscribers with provided data', function (done) {
        var count = 0,
            data = {},
            bus = (0, _aerobus2.default)(),
            channel = bus('test');
        channel.subscribe(function (value) {
          _chai.assert.strictEqual(value, data);

          if (++count === 2) done();
        }, function (value) {
          _chai.assert.strictEqual(value, data);

          if (++count === 2) done();
        });
        channel.publish(data);
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
    describe('subscribe method:', function () {
      it('should be a function', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isFunction(channel.subscribe);
      });
      it('should not throw when called without arguments', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.doesNotThrow(function () {
          return channel.subscribe();
        });
      });
      it('should be fluent', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.subscribe(), channel);
      });
      it('should add one subscriber to subscribers array', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test'),
            subscriber = function subscriber() {};

        channel.subscribe(subscriber);

        _chai.assert.include(channel.subscribers, subscriber);
      });
      it('should add many subscribers to subscribers array', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test'),
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber1, subscriber2);

        _chai.assert.include(channel.subscribers, subscriber1);

        _chai.assert.include(channel.subscribers, subscriber2);
      });
    });
    describe('subscribers property:', function () {
      it('should return an array', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isArray(channel.subscribers);
      });
      it('should return empty array by default', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.subscribers.length, 0);
      });
    });
    describe('unsubscribe method:', function () {
      it('should be a function', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.isFunction(channel.unsubscribe);
      });
      it('should not throw when called without arguments', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.doesNotThrow(function () {
          return channel.unsubscribe();
        });
      });
      it('should be fluent', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test');

        _chai.assert.strictEqual(channel.unsubscribe(), channel);
      });
      it('should remove one subscriber from subscribers array', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test'),
            subscriber = function subscriber() {};

        channel.subscribe(subscriber);
        channel.unsubscribe(subscriber);

        _chai.assert.notInclude(channel.subscribers, subscriber);
      });
      it('should remove many subscribers from subscribers array', function () {
        var bus = (0, _aerobus2.default)(),
            channel = bus('test'),
            subscriber1 = function subscriber1() {},
            subscriber2 = function subscriber2() {};

        channel.subscribe(subscriber1, subscriber2);
        channel.unsubscribe(subscriber1, subscriber2);

        _chai.assert.notInclude(channel.subscribers, subscriber1);

        _chai.assert.notInclude(channel.subscribers, subscriber2);
      });
    });
  });
  describe('Iterator class:', function () {
    describe('done method:', function () {
      it('should be a function', function () {
        var iterator = (0, _aerobus2.default)().root[Symbol.iterator]();

        _chai.assert.isFunction(iterator.done);
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
});
