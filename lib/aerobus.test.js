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

  describe('aerobus', function () {
    it('should be a function', function () {
      _chai.assert.isFunction(_aerobus2.default);
    });
    describe('@result', function () {
      it('should be a function', function () {
        var bus = (0, _aerobus2.default)();

        _chai.assert.isFunction(bus);
      });
      describe('channels', function () {
        it('should be an array', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.isArray(bus.channels);
        });
        it('should be empty by default', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(bus.channels.length, 0);
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
        it('should be empty after clear', function () {
          var bus = (0, _aerobus2.default)();
          bus('test1');
          bus('test2');
          bus.clear();

          _chai.assert.strictEqual(bus.channels.length, 0);
        });
      });
      describe('clear', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.isFunction(bus.clear);
        });
        it('should be fluent', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(bus.clear(), bus);
        });
      });
      describe('delimiter', function () {
        it('should be a string', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.isString(bus.delimiter);
        });
        it('should return provided value', function () {
          var delimiter = ':',
              bus = (0, _aerobus2.default)(delimiter);

          _chai.assert.strictEqual(bus.delimiter, delimiter);
        });
        it('should not throw when updated if the bus is idle', function () {
          var delimiter = ':',
              bus = (0, _aerobus2.default)();

          _chai.assert.doesNotThrow(function () {
            return bus.delimiter = delimiter;
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
      describe('error', function () {
        it('should be an instance of the Channel class', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(Object.classof(bus.error), 'Channel');
        });
        it('should eventually receive an error thrown by a subscription of other channel', function (done) {
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
      describe('root', function () {
        it('should be an instance of the Channel class', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(Object.classof(bus.root), 'Channel');
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
      describe('trace', function () {
        it('should be a function', function () {
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
      describe('unsubscribe', function () {
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
      describe('@result', function () {
        describe('without arguments', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus()), 'Channel');
          });
          it('should be the root channel', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(bus(), bus.root);
          });
        });
        describe('with "" (empty string) argument', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('')), 'Channel');
          });
          it('should be the root channel', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(bus(''), bus.root);
          });
        });
        describe('with "error" argument', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('error')), 'Channel');
          });
          it('should be the error channel', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(bus('error'), bus.error);
          });
        });
        describe('with one custom string argument', function () {
          it('should be an instance of the Channel class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('test')), 'Channel');
          });
        });
        describe('with one non-string argument', function () {
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
        describe('with several custom string arguments', function () {
          it('should be an instance of the Section class', function () {
            var bus = (0, _aerobus2.default)();

            _chai.assert.strictEqual(Object.classof(bus('test1', 'test2', 'test3')), 'Section');
          });
        });
        describe('with any non-string argument', function () {
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
    });
    describe('Channel', function () {
      describe('disable', function () {
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
      });
      describe('enable', function () {
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
        it('should enable the channel being invoked without arguments', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');
          channel.disable();
          channel.enable();

          _chai.assert.isTrue(channel.isEnabled);
        });
        it('should enable the channel being invoked with truthy argument', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');
          channel.disable();
          channel.enable(true);

          _chai.assert.isTrue(channel.isEnabled);
        });
        it('should disable the channel being invoked with falsey argument', function () {
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
      describe('isEnabled', function () {
        it('should be a boolean', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.isBoolean(channel.isEnabled);
        });
        it('should return true by default', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.isTrue(channel.isEnabled);
        });
      });
      describe('@@iterator', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.isFunction(channel[Symbol.iterator]);
        });
      });
      describe('name', function () {
        it('should be a string', function () {
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
        it('name return "error" for the error channel', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(bus.error.name, 'error');
        });
        it('name return "" for the root channel', function () {
          var bus = (0, _aerobus2.default)();

          _chai.assert.strictEqual(bus.root.name, '');
        });
      });
      describe('parent', function () {
        it('should be an instance of the Channel class', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.strictEqual(Object.classof(channel.parent), 'Channel');
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
      describe('publish', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.isFunction(channel.publish);
        });
        it('should not throw when invoked without arguments', function () {
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
      describe('subscribe', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.isFunction(channel.subscribe);
        });
        it('should not throw when invoked without arguments', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.doesNotThrow(function () {
            return channel.subscribe();
          });
        });
        it('should be fluent', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test'),
              subscriber = function subscriber() {};

          _chai.assert.strictEqual(channel.subscribe(subscriber), channel);
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
      describe('subscribers', function () {
        it('should be an array', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.isArray(channel.subscribers);
        });
        it('should be empty by default', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.strictEqual(channel.subscribers.length, 0);
        });
      });
      describe('unsubscribe', function () {
        it('should be a function', function () {
          var bus = (0, _aerobus2.default)(),
              channel = bus('test');

          _chai.assert.isFunction(channel.unsubscribe);
        });
        it('should not throw when invoked without arguments', function () {
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
  });
});
