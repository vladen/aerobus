'use strict';

import {assert} from 'chai';
import aerobus from './aerobus';

describe('aerobus:', () => {
  it('should be a function', () => {
    assert.isFunction(aerobus);
  });

  describe('return value:', () => {
    describe('without arguments:', () => {
      it('should be a function', () => {
        let bus = aerobus();
        assert.isFunction(bus);
      });
    });

    describe('with one function argument:', () => {
      it('should be a function', () => {
        let bus = aerobus(() => {});
        assert.isFunction(bus);
      });

      it('should configure trace property', () => {
        let trace = () => {}, bus = aerobus(trace);
        assert.strictEqual(bus.trace, trace);
      });
    });

    describe('with one object argument:', () => {
      it('should be a function', () => {
        let bus = aerobus({});
        assert.isFunction(bus);
      });

      it('should extend instances of Channel class', () => {
        let extension = () => {}, bus = aerobus({
          channel: { extension }
        });
        assert.strictEqual(bus.root.extension, extension);
        assert.strictEqual(bus.error.extension, extension);
        assert.strictEqual(bus('test').extension, extension);
      });

      it('should extend instances of Message class', done => {
        let extension = () => {}, bus = aerobus({
          message: { extension }
        });
        bus.root.subscribe((data, message) => {
          assert.strictEqual(message.extension, extension);
          done();
        });
        bus.root.publish();
      });

      it('should extend instances of Section class', () => {
        let extension = () => {}, bus = aerobus({
          section: { extension }
        });
        assert.strictEqual(bus('', 'test').extension, extension);
      });
    });

    describe('with one empty string argument:', () => {
      it('should throw', () => {
        assert.throw(() => aerobus(''));
      });
    });

    describe('with one not empty string argument:', () => {
      it('should be a function', () => {
        let bus = aerobus(':');
        assert.isFunction(bus);
      });

      it('should configure delimiter property', () => {
        let delimiter = ':', bus = aerobus(delimiter);
        assert.strictEqual(bus.delimiter, delimiter);
      });
    });

    describe('with function and not empty string arguments:', () => {
      it('should be a function', () => {
        let bus = aerobus(':', () => {});
        assert.isFunction(bus);
      });

      it('should configure delimiter and trace properties', () => {
        let delimiter = ':', trace = () => {}, bus = aerobus(delimiter, trace);
        assert.strictEqual(bus.delimiter, delimiter);
        assert.strictEqual(bus.trace, trace);
      });
    });

    describe('return value:', () => {
      describe('without arguments:', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus()), 'Aerobus.Channel');
        });

        it('should be the root channel', () => {
          let bus = aerobus();
          assert.strictEqual(bus(), bus.root);
        });
      });

      describe('with empty string argument:', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('')), 'Aerobus.Channel');
        });

        it('should be the root channel', () => {
          let bus = aerobus();
          assert.strictEqual(bus(''), bus.root);
        });
      });

      describe('with "error" string argument:', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('error')), 'Aerobus.Channel');
        });

        it('should be the error channel', () => {
          let bus = aerobus();
          assert.strictEqual(bus('error'), bus.error);
        });
      });

      describe('with one custom string argument:', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('test')), 'Aerobus.Channel');
        });
      });

      describe('with one non-string argument:', () => {
        it('should throw', () => {
          let bus = aerobus();
          assert.throw(() => bus(true));
          assert.throw(() => bus(false));
          assert.throw(() => bus(1));
          assert.throw(() => bus({}));
          assert.throw(() => bus([]));
        });
      });

      describe('with several custom string arguments:', () => {
        it('should be an instance of the Section class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('test1', 'test2', 'test3')), 'Aerobus.Section');
        });
      });

      describe('with any non-string argument:', () => {
        it('should throw', () => {
          let bus = aerobus();
          assert.throw(() => bus('', 1));
          assert.throw(() => bus(false, ''));
          assert.throw(() => bus('', {}));
          assert.throw(() => bus([], ''));
        });
      });
    });

    describe('channels property:', () => {
      it('should return an array', () => {
        assert.isArray(aerobus().channels);
      });

      it('should return empty array by default', () => {
        assert.strictEqual(aerobus().channels.length, 0);
      });

      it('should return new array each time', () => {
        let bus = aerobus();
        assert.notStrictEqual(bus.channels, bus.channels);
      });

      it('should contain error channel after its resolution', () => {
        let bus = aerobus(), channel = bus.error;
        assert.include(bus.channels, channel);
      });

      it('should contain root channel after its resolution', () => {
        let bus = aerobus(), channel = bus.root;
        assert.include(bus.channels, channel);
      });

      it('should contain custom channels after their resolution', () => {
        let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2');
        assert.include(bus.channels, channel1);
        assert.include(bus.channels, channel2);
      });
    });

    describe('clear method:', () => {
      it('should be a function', () => {
        assert.isFunction(aerobus().clear);
      });

      it('should be fluent', () => {
        let bus = aerobus();
        assert.strictEqual(bus.clear(), bus);
      });

      it('should remove all channels', () => {
        let bus = aerobus();
        bus('test1');
        bus('test2');
        bus.clear();
        assert.strictEqual(bus.channels.length, 0);
      });
    });

    describe('delimiter property:', () => {
      it('should return a string', () => {
        assert.isString(aerobus().delimiter);
      });

      it('should return provided value', () => {
        let delimiter = ':';
        assert.strictEqual(aerobus(delimiter).delimiter, delimiter);
      });

      it('should not throw when updated if the bus is idle', () => {
        let delimiter = ':';
        assert.doesNotThrow(() => aerobus().delimiter = delimiter);
      });

      it('should return updated value', () => {
        let delimiter = ':', bus = aerobus();
        bus.delimiter = delimiter;
        assert.strictEqual(bus.delimiter, delimiter);
      });

      it('should throw when updated if the bus is not idle', () => {
        let delimiter = ':', bus = aerobus();
        bus('test');
        assert.throw(() => bus.delimiter = delimiter);
      });

      it('should not throw when updated if the bus clear', () => {
        let delimiter = ':', bus = aerobus();
        bus('test');
        bus.clear();
        assert.doesNotThrow(() => bus.delimiter = delimiter);
      });
    });

    describe('error property:', () => {
      it('should return an instance of the Channel class', () => {
        let bus = aerobus();
        assert.strictEqual(Object.classof(bus.error), 'Aerobus.Channel');
      });

      it('should invoke own subscription with an error thrown by a subscription of other channel', done => {
        let bus = aerobus(), channel = bus('test'), error = new Error;
        bus.error.subscribe(thrown => {
          assert.strictEqual(thrown, error);
          done();
        })
        channel.subscribe(() => { throw error });
        channel.publish();
      });

      it('should throw if subscription to the error channel throws', () => {
        let bus = aerobus(), error = new Error;
        bus.error.subscribe(() => { throw error });
        assert.throw(() => bus.error.publish());
      });
    });

    describe('root property:', () => {
      it('should be an instance of the Channel class', () => {
        let bus = aerobus();
        assert.strictEqual(Object.classof(bus.root), 'Aerobus.Channel');
      });

      it('should eventually receive a publication to a descendant channel', done => {
        let bus = aerobus(), invocations = 0;
        bus.root.subscribe(() => ++invocations);
        bus('test').publish();
        setImmediate(() => {
          assert.strictEqual(invocations, 1);
          done();
        });
      });
    });

    describe('trace property:', () => {
      it('should return a function', () => {
        let bus = aerobus();
        assert.isFunction(bus.trace);
      });

      it('should return provided value', () => {
        let trace = () => {}, bus = aerobus(trace);
        assert.strictEqual(bus.trace, trace);
      });

      it('should not throw when updated if the bus is idle', () => {
        let trace = () => {}, bus = aerobus();
        assert.doesNotThrow(() => bus.trace = trace);
      });

      it('should return updated value', () => {
        let trace = () => {}, bus = aerobus();
        bus.trace = trace;
        assert.strictEqual(bus.trace, trace);
      });

      it('should throw when updated if the bus is not idle', () => {
        let trace = () => {}, bus = aerobus();
        bus('test');
        assert.throw(() => bus.trace = trace);
      });

      it('should not throw when updated if the bus clear', () => {
        let trace = () => {}, bus = aerobus();
        bus('test');
        bus.clear();
        assert.doesNotThrow(() => bus.trace = trace);
      });
    });

    describe('unsubscribe method:', () => {
      it('should be a function', () => {
        let bus = aerobus();
        assert.isFunction(bus.unsubscribe);
      });

      it('should be fluent', () => {
        let bus = aerobus(), subscription = () => {};
        assert.strictEqual(bus.unsubscribe(subscription), bus);
      });

      it('should remove one subscription from one channel', () => {
        let bus = aerobus(), channel = bus('test'), subscription = () => {};
        channel.subscribe(subscription);
        bus.unsubscribe(subscription)
        assert.notInclude(channel.subscriptions, subscription);
      });

      it('should remove many subscriptions from one channel', () => {
        let bus = aerobus(), channel = bus('test'), subscriber1 = () => {}, subscriber2 = () => {};
        channel.subscribe(subscriber1, subscriber2);
        bus.unsubscribe(subscriber1, subscriber2)
        assert.notInclude(channel.subscriptions, subscriber1);
        assert.notInclude(channel.subscriptions, subscriber2);
      });

      it('should remove one subscription from many channels', () => {
        let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2'), subscription = () => {};
        channel1.subscribe(subscription);
        channel2.subscribe(subscription);
        bus.unsubscribe(subscription)
        assert.notInclude(channel1.subscriptions, subscription);
        assert.notInclude(channel2.subscriptions, subscription);
      });
    });
  });
});

describe('Channel class:', () => {
  describe('bus property:', () => {
    it('should return own bus', () => {
      let bus = aerobus();
      assert.strictEqual(bus('test').bus, bus);
      assert.strictEqual(bus.error.bus, bus);
      assert.strictEqual(bus.root.bus, bus);
    });
  });

  describe('clear method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.clear);
    });

    it('should be fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.clear(), channel);
    });

    it('should enable the channel', () => {
      let channel = aerobus().root;
      channel.disable().clear();
      assert.isTrue(channel.isEnabled);
    });

    it('should remove all retentions', () => {
      let channel = aerobus().root;
      channel.retain().publish().clear();
      assert.strictEqual(channel.retentions.length, 0);
    });

    it('should remove all subscriptions', () => {
      let channel = aerobus().root;
      channel.subscribe(() => {}).clear();
      assert.strictEqual(channel.subscriptions.length, 0);
    });
  });

  describe('disable method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.disable);
    });

    it('should be fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.disable(), channel);
    });

    it('should disable the channel', () => {
      let channel = aerobus().root;
      channel.disable();
      assert.isFalse(channel.isEnabled);
    });

    it('should supress publication delivery', done => {
      let channel = aerobus().root, invocations = 0;
      channel.subscribe(() => ++invocations).disable().publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 0);
        done();
      });
    });

    it('should supress publication delivery to descendant channel', done => {
      let channel = aerobus()('parent.child'), invocations = 0;
      channel.subscribe(() => ++invocations).parent.disable();
      channel.publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 0);
        done();
      });
    });
  });

  describe('enable method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.enable);
    });

    it('should be fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.enable(), bus.root);
    });

    it('should enable the channel when called without arguments', () => {
      assert.isTrue(aerobus().root.disable().enable().isEnabled);
    });

    it('should enable the channel when called with truthy argument', () => {
      assert.isTrue(aerobus().root.disable().enable(true).isEnabled);
    });

    it('should disable the channel when called with falsey argument', () => {
      assert.isFalse(aerobus().root.enable(false).isEnabled);
    });

    it('should resume publication delivery', done => {
      let channel = aerobus().root, invocations = 0;
      channel.subscribe(() => ++invocations).disable().enable().publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 1);
        done();
      });
    });
  });

  describe('isEnabled property:', () => {
    it('should return a boolean', () => {
      assert.isBoolean(aerobus().root.isEnabled);
    });

    it('should return true by default', () => {
      assert.isTrue(aerobus().root.isEnabled);
    });

    it('should return false if parent channel is disabled', () => {
      let channel = aerobus()('test');
      channel.parent.disable();
      assert.isFalse(channel.isEnabled);
    });

    it('should return true after parent channel has been enabled', () => {
      let channel = aerobus()('test');
      channel.parent.disable().enable();
      assert.isTrue(channel.isEnabled);
    });
  });

  describe('@@iterator property:', () => {
    it('should return a function', () => {
      assert.isFunction(aerobus().root[Symbol.iterator]);
    });

    describe('return value:', () => {
      it('should be an instance of the Iterator class', () => {
        assert.strictEqual(Object.classof(aerobus().root[Symbol.iterator]()), 'Aerobus.Iterator');
      });
    });
  });

  describe('name property:', () => {
    it('should return a string', () => {
      assert.isString(aerobus().root.name);
    });

    it('should return provided value', () => {
      let name = 'test';
      assert.strictEqual(aerobus()(name).name, name);
    });

    it('name return "error" string for the error channel', () => {
      assert.strictEqual(aerobus().error.name, 'error');
    });

    it('name return empty string for the root channel', () => {
      assert.strictEqual(aerobus().root.name, '');
    });
  });

  describe('parent property:', () => {
    it('should return an instance of the Channel class for custom channel', () => {
      assert.strictEqual(Object.classof(aerobus()('test').parent), 'Aerobus.Channel');
    });

    it('should return the root channel for a channel of first level depth', () => {
      let bus = aerobus(), channel = bus('test');
      assert.strictEqual(channel.parent, bus.root);
    });

    it('should return non root channel for a channel of second level depth', () => {
      let bus = aerobus(), parent = 'parent', child = 'child', channel = bus(parent + bus.delimiter + child);
      assert.strictEqual(channel.parent.name, parent);
    });

    it('should be undefined for the error channel', () => {
      assert.isUndefined(aerobus().error.parent);
    });

    it('should be undefined for the root channel', () => {
      assert.isUndefined(aerobus().root.parent);
    });
  });

  describe('publish method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.publish);
    });

    it('should not throw when called without arguments', () => {
      assert.doesNotThrow(() => aerobus().root.publish());
    });

    it('should throw when callback argument is not a function', () => {
      assert.throw(() => aerobus().root.publish({}, 'test'));
    });

    it('should be fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.publish(), channel);
    });

    it('should notify two own subscriptions with provided data in the order of subcription', done => {
      let count = 0, data = {};
      aerobus().root.subscribe(
        value => {
          assert.strictEqual(++count, 1);
          assert.strictEqual(value, data);
        },
        value => {
          assert.strictEqual(++count, 2);
          assert.strictEqual(value, data);
          done();
        }).publish(data);
    });

    it('should notify ancestor subscriptions with provided data before own subscription', done => {
      let channel = aerobus()('parent.child'), count = 0, data = {};
      channel.parent.parent.subscribe(value => {
        assert.strictEqual(++count, 1);
        assert.strictEqual(value, data);
      });
      channel.parent.subscribe(value => {
        assert.strictEqual(++count, 2);
        assert.strictEqual(value, data);
      });
      channel.subscribe(value => {
        assert.strictEqual(++count, 3);
        assert.strictEqual(value, data);
        done();
      });
      channel.publish(data);
    });

    it('should notify all subscriptions and invoke callback with array containing all values returned by the subscriptions', done => {
      let channel = aerobus()('parent.child'), result1 = {}, result2 = {}, result3 = {};
      channel.parent.parent.subscribe(() => result1);
      channel.parent.subscribe(() => result2);
      channel.subscribe(() => result3);
      channel.publish(null, results => {
        assert.include(results, result1);
        assert.include(results, result2);
        assert.include(results, result3);
        done();
      });
    });
  });

  describe('retain method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.retain);
    });

    it('should not throw when called without arguments', () => {
      assert.doesNotThrow(() => aerobus().root.retain());
    });

    it('should be fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.retain(), bus.root);
    });

    it('should set retentions.limit property to Number.MAX_SAFE_INTEGER when called without arguments', () => {
      let channel = aerobus().root;
      channel.retain();
      assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
    });

    it('should set retentions.limit property when called with numeric argument', () => {
      let limit = 1, channel = aerobus().root;
      channel.retain(limit);
      assert.strictEqual(channel.retentions.limit, limit);
    });

    it('should set retentions.limit property to Number.MAX_SAFE_INTEGER when called with truthy argument', () => {
      let channel = aerobus().root;
      channel.retain(true);
      assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
    });

    it('should set retentions.limit property to 0 when called with falsey argument', () => {
      let channel = aerobus().root;
      channel.retain(false);
      assert.strictEqual(channel.retentions.limit, 0);
    });

    it('should clear retentions array when called with falsey argument', () => {
      let channel = aerobus().root, data1 = {}, data2 = {};
      channel.retain().publish(data1).publish(data2).retain(0);
      assert.strictEqual(channel.retentions.length, 0);
    });

    it('should deliver one retained publication to subsequent subscribtion', done => {
      let channel = aerobus().root, publication = {};
      channel.retain().publish(publication).subscribe(data => {
        assert.strictEqual(data, publication);
        done();
      });
    });

    it('should deliver two retained publications to subsequent subscribtion', done => {
      let channel = aerobus().root, publication1 = {}, publication2 = {}, expectations = [publication1, publication2];
      channel.retain().publish(publication1).publish(publication2).subscribe(data => {
        assert.strictEqual(data, expectations.shift());
        if (!expectations.length) done();
      });
    });

    it('should deliver retained publication to subsequent subscribtion after called with falsey argument', done => {
      let channel = aerobus().root, invocations = 0, publication = {};
      channel.retain().publish(publication).retain(false).subscribe(() => ++invocations);
      setImmediate(() => {
        assert.strictEqual(invocations, 0);
        done();
      });
    });
  });

  describe('retentions property:', () => {
    it('should be an array', () => {
      assert.isArray(aerobus().root.retentions);
    });

    it('should have numeric "limit" property', () => {
      assert.isNumber(aerobus().root.retentions.limit);
    });

    it('should contain one latest publication when limited to 1', () => {
      let channel = aerobus().root, data1 = {}, data2 = {};
      channel.retain(1).publish(data1).publish(data2);
      assert.strictEqual(channel.retentions.length, 1);
      assert.strictEqual(channel.retentions[0].data, data2);
    });

    it('should contain two latest publications when limited to 2', () => {
      let channel = aerobus().root, data1 = {}, data2 = {}, data3 = {};
      channel.retain(2).publish(data1).publish(data2).publish(data3);
      assert.strictEqual(channel.retentions.length, 2);
      assert.strictEqual(channel.retentions[0].data, data2);
      assert.strictEqual(channel.retentions[1].data, data3);
    });
  });

  describe('root property:', () => {
    it('should be the root channel of own bus', () => {
      let bus = aerobus();
      assert.strictEqual(bus.error.root, bus.root);
      assert.strictEqual(bus.root.root, bus.root);
      assert.strictEqual(bus('test').root, bus.root);
    });
  });

  describe('subscribe method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.subscribe);
    });

    it('should not throw when called without arguments', () => {
      assert.doesNotThrow(() => aerobus().root.subscribe());
    });

    it('should be fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.subscribe(), channel);
    });

    it('should add one subscription to subscriptions array', () => {
      let channel = aerobus().root, subscription = () => {};
      channel.subscribe(subscription);
      assert.include(channel.subscriptions, subscription);
    });

    it('should add many subscriptions to subscriptions array', () => {
      let channel = aerobus().root, subscriber1 = () => {}, subscriber2 = () => {};
      channel.subscribe(subscriber1, subscriber2);
      assert.include(channel.subscriptions, subscriber1);
      assert.include(channel.subscriptions, subscriber2);
    });
  });

  describe('subscriptions property:', () => {
    it('should return an array', () => {
      assert.isArray(aerobus().root.subscriptions);
    });

    it('should return empty array by default', () => {
      assert.strictEqual(aerobus().root.subscriptions.length, 0);
    });

    it('should return new array each time', () => {
      let channel = aerobus().root;
      assert.notStrictEqual(channel.subscriptions, channel.subscriptions);
    });
  });

  describe('toggle method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.toggle);
    });

    it('should be fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.toggle(), channel);
    });

    it('should disable enabled channel', () => {
      assert.isFalse(aerobus().root.toggle().isEnabled);
    });

    it('should enable disabled channel', () => {
      assert.isTrue(aerobus().root.disable().toggle().isEnabled);
    });
  });

  describe('unsubscribe method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root.unsubscribe);
    });

    it('should not throw when called without arguments', () => {
      assert.doesNotThrow(() => aerobus().root.unsubscribe());
    });

    it('should be fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.unsubscribe(), channel);
    });

    it('should remove specified subscriptions from the channel when called with arguments', () => {
      let channel = aerobus().root, subscriber1 = () => {}, subscriber2 = () => {};
      channel.subscribe(subscriber1, subscriber2).unsubscribe(subscriber1, subscriber2);
      assert.notInclude(channel.subscriptions, subscriber1);
      assert.notInclude(channel.subscriptions, subscriber2);
    });

    it('should remove all subscriptions from the channel when called without arguments', () => {
      let channel = aerobus().root, subscriber1 = () => {}, subscriber2 = () => {};
      channel.subscribe(subscriber1, subscriber2).unsubscribe();
      assert.notInclude(channel.subscriptions, subscriber1);
      assert.notInclude(channel.subscriptions, subscriber2);
    });
  });
});

describe('Iterator class:', () => {
  describe('done method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus().root[Symbol.iterator]().done);
    });

    it('should stop iteration setting done property of the iterator result', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.done();
      assert.isTrue(iterator.next().done);
    });

    it('should reject pending iterator promise', done => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.next().value.then(() => {}, done);
      iterator.done();
    });
  });

  describe('next method:', () => {
    it('should be a function', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      assert.isFunction(iterator.next);
    });

    describe('return value:', () => {
      it('should be an object', () => {
        let iterator = aerobus().root[Symbol.iterator]();
        assert.isObject(iterator.next());
      });

      describe('done property:', () => {
        it('should be falsey', () => {
          let iterator = aerobus().root[Symbol.iterator]();
          assert.ok(!iterator.next().done);
        });
      });

      describe('value property:', () => {
        it('should return an instance of the Promise class', () => {
          let iterator = aerobus().root[Symbol.iterator]();
          assert.strictEqual(Object.classof(iterator.next().value), 'Promise');
        });

        it('should return pending promise by default', done => {
          let iterator = aerobus().root[Symbol.iterator](), pending = {};
          Promise.race([iterator.next().value, Promise.resolve(pending)]).then(
            value => {
              assert.strictEqual(value, pending);
              done();
            });
        });

        it('should return a promise resolving after publication to the channel', done => {
          let channel = aerobus().root, iterator = channel[Symbol.iterator](), invocations = 0;
          iterator.next().value.then(() => ++invocations);
          assert.strictEqual(invocations, 0);
          channel.publish();
          setImmediate(message => {
            assert.strictEqual(invocations, 1);
            done();
          });
        });

        it('should return a promise resolving after a publication with a message containing published data', done => {
          let channel = aerobus().root, data = {}, iterator = channel[Symbol.iterator]();
          iterator.next().value.then(message => {
            assert.strictEqual(message.data, data);
            done();
          });
          channel.publish(data);
        });

        it('should return resolved promise after a publication', done => {
          let channel = aerobus().root, data = {}, iterator = channel[Symbol.iterator]();
          channel.publish(data);
          Promise.race([iterator.next().value, Promise.resolve()]).then(
            value => {
              assert.strictEqual(value.data, data);
              done();
            });
        });
      });
    });
  });
});

describe('Message class:', () => {
  describe('channel property:', () => {
    it('should return name of the publishing channel', done => {
      let bus = aerobus(), error = bus.error, root = bus.root, test = bus('test'), pending = 3;
      error.subscribe((_, message) => {
        assert.strictEqual(message.channel, error.name);
        if (!--pending) done();
      }).publish();
      root.subscribe((_, message) => {
        assert.strictEqual(message.channel, root.name);
        if (!--pending) done();
      }).publish();
      test.subscribe((_, message) => {
        assert.strictEqual(message.channel, test.name);
        if (!--pending) done();
      }).publish();
    });
  });

  describe('data property:', () => {
    it('should return data provided to the publish method', done => {
      let data = {};
      aerobus().root.subscribe((_, message) => {
        assert.strictEqual(message.data, data);
        done();
      }).publish(data);
    });
  });

  describe('error property:', () => {
    it('should return caught error', done => {
      let bus = aerobus(), error = new Error;
      bus.error.subscribe((_, message) => {
        assert.strictEqual(message.error, error);
        done();
      });
      bus.root.subscribe(() => {
        throw error;
      }).publish();
    });
  });
});

describe('Section class:', () => {
  describe('bus property:', () => {
    it('should return own bus', () => {
      let bus = aerobus();
      assert.strictEqual(bus('test1', 'test2').bus, bus);
    });
  });

  describe('channels property:', () => {
    it('should return an array', () => {
      assert.isArray(aerobus()('test1', 'test2').channels);
    });

    it('should return new array instance each time', () => {
      let section = aerobus()('test1', 'test2');
      assert.notStrictEqual(section.channels, section.channels);
    });
  });

  describe('clear method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus()('test1', 'test2').clear);
    });

    it('should be fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.clear(), section);
    });

    it('should clear all the channels referenced', () => {
      let section = aerobus()('test1', 'test2');
      section.channels.forEach(channel => channel.subscribe(() => {}));
      section.clear();
      section.channels.forEach(channel => assert.strictEqual(channel.subscriptions.length, 0));
    });
  });

  describe('disable method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus()('test1', 'test2').disable);
    });

    it('should be fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.disable(), section);
    });

    it('should disable all the channels referenced', () => {
      let section = aerobus()('test1', 'test2');
      section.disable();
      section.channels.forEach(channel => assert.isFalse(channel.isEnabled));
    });
  });

  describe('enable method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus()('test1', 'test2').enable);
    });

    it('should be fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.enable(), section);
    });

    it('should enable all the channels referenced', () => {
      let section = aerobus()('test1', 'test2');
      section.disable().enable();
      section.channels.forEach(channel => assert.isTrue(channel.isEnabled));
    });
  });

  describe('publish method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus()('test1', 'test2').publish);
    });

    it('should be fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.publish(), section);
    });

    it('should publish to all the channels referenced', () => {
      let count = 0, section = aerobus()('test1', 'test2');
      section.subscribe(() => ++count).publish();
      assert.strictEqual(count, section.channels.length);
    });
  });

  describe('subscribe method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus()('test1', 'test2').subscribe);
    });

    it('should be fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.subscribe(), section);
    });

    it('should subscribe to all the channels referenced', () => {
      let section = aerobus()('test1', 'test2');
      section.subscribe(() => {});
      section.channels.forEach(channel => assert.strictEqual(channel.subscriptions.length, 1));
    });
  });

  describe('toggle method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus()('test1', 'test2').toggle);
    });

    it('should be fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.toggle(), section);
    });

    it('should toggle all the channels referenced', () => {
      let section = aerobus()('test1', 'test2');
      section.toggle();
      section.channels.forEach(channel => assert.isFalse(channel.isEnabled));
    });
  });

  describe('unsubscribe method:', () => {
    it('should be a function', () => {
      assert.isFunction(aerobus()('test1', 'test2').unsubscribe);
    });

    it('should be fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.unsubscribe(), section);
    });

    it('should unsubscribe from all the channels referenced', () => {
      let section = aerobus()('test1', 'test2');
      section.subscribe(() => {}).unsubscribe();
      section.channels.forEach(channel => assert.strictEqual(channel.subscriptions.length, 0));
    });
  });
});