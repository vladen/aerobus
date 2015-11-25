'use strict';

import {assert} from 'chai';
import aerobus from './aerobus';

describe('aerobus', () => {
  it('should be a function', () => {
    assert.isFunction(aerobus);
  });

  describe('@result', () => {
    it('should be a function', () => {
      let bus = aerobus();
      assert.isFunction(bus);
    });

    describe('channels', () => {
      it('should be an array', () => {
        let bus = aerobus();
        assert.isArray(bus.channels);
      });

      it('should be empty by default', () => {
        let bus = aerobus();
        assert.strictEqual(bus.channels.length, 0);
      });

      it('should contain error channel after its instantiation', () => {
        let bus = aerobus(), channel = bus.error;
        assert.include(bus.channels, channel);
      });

      it('should contain root channel after its instantiation', () => {
        let bus = aerobus(), channel = bus.root;
        assert.include(bus.channels, channel);
      });

      it('should contain one custom channel after its instantiation', () => {
        let bus = aerobus(), channel = bus('test');
        assert.include(bus.channels, channel);
      });

      it('should contain many custom channels after their instantiation', () => {
        let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2');
        assert.include(bus.channels, channel1);
        assert.include(bus.channels, channel2);
      });

      it('should be empty after clear', () => {
        let bus = aerobus();
        bus('test1');
        bus('test2');
        bus.clear();
        assert.strictEqual(bus.channels.length, 0);
      });
    });

    describe('clear', () => {
      it('should be a function', () => {
        let bus = aerobus();
        assert.isFunction(bus.clear);
      });

      it('should be fluent', () => {
        let bus = aerobus();
        assert.strictEqual(bus.clear(), bus);
      });
    });

    describe('delimiter', () => {
      it('should be a string', () => {
        let bus = aerobus();
        assert.isString(bus.delimiter);
      });

      it('should return provided value', () => {
        let delimiter = ':', bus = aerobus(delimiter);
        assert.strictEqual(bus.delimiter, delimiter);
      });

      it('should not throw when updated if the bus is idle', () => {
        let delimiter = ':', bus = aerobus();
        assert.doesNotThrow(() => bus.delimiter = delimiter);
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

    describe('error', () => {
      it('should be an instance of the Channel class', () => {
        let bus = aerobus();
        assert.strictEqual(Object.classof(bus.error), 'Channel');
      });

      it('should eventually receive an error thrown by a subscription of other channel', done => {
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

    describe('root', () => {
      it('should be an instance of the Channel class', () => {
        let bus = aerobus();
        assert.strictEqual(Object.classof(bus.root), 'Channel');
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

    describe('trace', () => {
      it('should be a function', () => {
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

    describe('unsubscribe', () => {
      it('should be a function', () => {
        let bus = aerobus();
        assert.isFunction(bus.unsubscribe);
      });

      it('should be fluent', () => {
        let bus = aerobus(), subscriber = () => {};
        assert.strictEqual(bus.unsubscribe(subscriber), bus);
      });

      it('should remove one subscriber from one channel', () => {
        let bus = aerobus(), channel = bus('test'), subscriber = () => {};
        channel.subscribe(subscriber);
        bus.unsubscribe(subscriber)
        assert.notInclude(channel.subscribers, subscriber);
      });

      it('should remove many subscribers from one channel', () => {
        let bus = aerobus(), channel = bus('test'), subscriber1 = () => {}, subscriber2 = () => {};
        channel.subscribe(subscriber1, subscriber2);
        bus.unsubscribe(subscriber1, subscriber2)
        assert.notInclude(channel.subscribers, subscriber1);
        assert.notInclude(channel.subscribers, subscriber2);
      });

      it('should remove one subscriber from many channels', () => {
        let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2'), subscriber = () => {};
        channel1.subscribe(subscriber);
        channel2.subscribe(subscriber);
        bus.unsubscribe(subscriber)
        assert.notInclude(channel1.subscribers, subscriber);
        assert.notInclude(channel2.subscribers, subscriber);
      });
    });

    describe('@result', () => {
      describe('without arguments', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus()), 'Channel');
        });

        it('should be the root channel', () => {
          let bus = aerobus();
          assert.strictEqual(bus(), bus.root);
        });
      });

      describe('with "" (empty string) argument', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('')), 'Channel');
        });

        it('should be the root channel', () => {
          let bus = aerobus();
          assert.strictEqual(bus(''), bus.root);
        });
      });

      describe('with "error" argument', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('error')), 'Channel');
        });

        it('should be the error channel', () => {
          let bus = aerobus();
          assert.strictEqual(bus('error'), bus.error);
        });
      });

      describe('with one custom string argument', () => {
        it('should be an instance of the Channel class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('test')), 'Channel');
        });
      });

      describe('with one non-string argument', () => {
        it('should throw', () => {
          let bus = aerobus();
          assert.throw(() => bus(true));
          assert.throw(() => bus(false));
          assert.throw(() => bus(1));
          assert.throw(() => bus({}));
          assert.throw(() => bus([]));
        });
      });

      describe('with several custom string arguments', () => {
        it('should be an instance of the Section class', () => {
          let bus = aerobus();
          assert.strictEqual(Object.classof(bus('test1', 'test2', 'test3')), 'Section');
        });
      });

      describe('with any non-string argument', () => {
        it('should throw', () => {
          let bus = aerobus();
          assert.throw(() => bus('', 1));
          assert.throw(() => bus(false, ''));
          assert.throw(() => bus('', {}));
          assert.throw(() => bus([], ''));
        });
      });
    });

  });

  describe('Channel', () => {
    describe('disable', () => {
      it('should be a function', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isFunction(channel.disable);
      });

      it('should be fluent', () => {
        let bus = aerobus(), channel = bus('test');
        assert.strictEqual(channel.disable(), channel);
      });

      it('should disable the channel', () => {
        let bus = aerobus(), channel = bus('test');
        channel.disable();
        assert.isFalse(channel.isEnabled);
      });

      it('should supress publication delivery', done => {
        let bus = aerobus(), channel = bus('test'), invocations = 0;
        channel.subscribe(() => ++invocations);
        channel.disable();
        channel.publish();
        setImmediate(() => {
          assert.strictEqual(invocations, 0);
          done();
        });
      });
    });

    describe('enable', () => {
      it('should be a function', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isFunction(channel.enable);
      });

      it('should be fluent', () => {
        let bus = aerobus(), channel = bus('test');
        assert.strictEqual(channel.enable(), channel);
      });

      it('should enable the channel being invoked without arguments', () => {
        let bus = aerobus(), channel = bus('test');
        channel.disable();
        channel.enable();
        assert.isTrue(channel.isEnabled);
      });

      it('should enable the channel being invoked with truthy argument', () => {
        let bus = aerobus(), channel = bus('test');
        channel.disable();
        channel.enable(true);
        assert.isTrue(channel.isEnabled);
      });

      it('should disable the channel being invoked with falsey argument', () => {
        let bus = aerobus(), channel = bus('test');
        channel.enable(false);
        assert.isFalse(channel.isEnabled);
      });

      it('should resume publication delivery', done => {
        let bus = aerobus(), channel = bus('test'), invocations = 0;
        channel.subscribe(() => ++invocations);
        channel.disable();
        channel.enable();
        channel.publish();
        setImmediate(() => {
          assert.strictEqual(invocations, 1);
          done();
        });
      });
    });

    describe('isEnabled', () => {
      it('should be a boolean', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isBoolean(channel.isEnabled);
      });

      it('should return true by default', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isTrue(channel.isEnabled);
      });
    });

    describe('@@iterator', () => {
      it('should be a function', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isFunction(channel[Symbol.iterator]);
      });
    });

    describe('name', () => {
      it('should be a string', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isString(channel.name);
      });

      it('should return provided value', () => {
        let name = 'test', bus = aerobus(), channel = bus(name);
        assert.strictEqual(channel.name, name);
      });

      it('name return "error" for the error channel', () => {
        let bus = aerobus();
        assert.strictEqual(bus.error.name, 'error');
      });

      it('name return "" for the root channel', () => {
        let bus = aerobus();
        assert.strictEqual(bus.root.name, '');
      });
    });

    describe('parent', () => {
      it('should be an instance of the Channel class', () => {
        let bus = aerobus(), channel = bus('test');
        assert.strictEqual(Object.classof(channel.parent), 'Channel');
      });

      it('should return the root channel for a channel of first level depth', () => {
        let bus = aerobus(), channel = bus('test');
        assert.strictEqual(channel.parent, bus.root);
      });

      it('should return non root channel for a channel of second level depth', () => {
        let parent = 'parent', child = 'child', bus = aerobus(), channel = bus(parent + bus.delimiter + child);
        assert.strictEqual(channel.parent.name, parent);
      });

      it('should be undefined for the error channel', () => {
        let bus = aerobus();
        assert.isUndefined(bus.root.parent);
      });

      it('should be undefined for the root channel', () => {
        let bus = aerobus();
        assert.isUndefined(bus.root.parent);
      });
    });

    describe('publish', () => {
      it('should be a function', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isFunction(channel.publish);
      });

      it('should not throw when invoked without arguments', () => {
        let bus = aerobus(), channel = bus('test');
        assert.doesNotThrow(() => channel.publish());
      });

      it('should be fluent', () => {
        let bus = aerobus(), channel = bus('test');
        assert.strictEqual(channel.publish(), channel);
      });

      it('should eventually invoke one subscriber with provided data', done => {
        let data = {}, bus = aerobus(), channel = bus('test');
        channel.subscribe(value => {
          assert.strictEqual(value, data);
          done();
        });
        channel.publish(data);
      });

      it('should eventually invoke many subscribers with provided data', done => {
        let count = 0, data = {}, bus = aerobus(), channel = bus('test');
        channel.subscribe(
          value => {
            assert.strictEqual(value, data);
            if (++count === 2) done();
          },
          value => {
            assert.strictEqual(value, data);
            if (++count === 2) done();
          });
        channel.publish(data);
      });
    });

    describe('subscribe', () => {
      it('should be a function', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isFunction(channel.subscribe);
      });

      it('should not throw when invoked without arguments', () => {
        let bus = aerobus(), channel = bus('test');
        assert.doesNotThrow(() => channel.subscribe());
      });

      it('should be fluent', () => {
        let bus = aerobus(), channel = bus('test'), subscriber = () => {};
        assert.strictEqual(channel.subscribe(subscriber), channel);
      });

      it('should add one subscriber to subscribers array', () => {
        let bus = aerobus(), channel = bus('test'), subscriber = () => {};
        channel.subscribe(subscriber);
        assert.include(channel.subscribers, subscriber);
      });

      it('should add many subscribers to subscribers array', () => {
        let bus = aerobus(), channel = bus('test'), subscriber1 = () => {}, subscriber2 = () => {};
        channel.subscribe(subscriber1, subscriber2);
        assert.include(channel.subscribers, subscriber1);
        assert.include(channel.subscribers, subscriber2);
      });
    });

    describe('subscribers', () => {
      it('should be an array', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isArray(channel.subscribers);
      });

      it('should be empty by default', () => {
        let bus = aerobus(), channel = bus('test');
        assert.strictEqual(channel.subscribers.length, 0);
      });
    });

    describe('unsubscribe', () => {
      it('should be a function', () => {
        let bus = aerobus(), channel = bus('test');
        assert.isFunction(channel.unsubscribe);
      });

      it('should not throw when invoked without arguments', () => {
        let bus = aerobus(), channel = bus('test');
        assert.doesNotThrow(() => channel.unsubscribe());
      });

      it('should be fluent', () => {
        let bus = aerobus(), channel = bus('test');
        assert.strictEqual(channel.unsubscribe(), channel);
      });

      it('should remove one subscriber from subscribers array', () => {
        let bus = aerobus(), channel = bus('test'), subscriber = () => {};
        channel.subscribe(subscriber);
        channel.unsubscribe(subscriber);
        assert.notInclude(channel.subscribers, subscriber);
      });

      it('should remove many subscribers from subscribers array', () => {
        let bus = aerobus(), channel = bus('test'), subscriber1 = () => {}, subscriber2 = () => {};
        channel.subscribe(subscriber1, subscriber2);
        channel.unsubscribe(subscriber1, subscriber2);
        assert.notInclude(channel.subscribers, subscriber1);
        assert.notInclude(channel.subscribers, subscriber2);
      });
    });

  });

});


/*

it('bus(\'test1\', \'test2\') should return Section object', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    assert.strictEqual(Object.classof(section), 'Section');
  });
  it('section channels should return array of Channel objects', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2')
      , channels = section.channels;
    assert.strictEqual(channels[0], bus('test1'));
    assert.strictEqual(channels[1], bus('test2'));
  });

  it('section disable should return section object', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    assert.strictEqual(section.disable(), section);
  });
  it('section channels isEnabled should return false after disable', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    section.disable();
    assert.notOk(bus('test1').isEnabled);
    assert.notOk(bus('test2').isEnabled);
  });
  it('section enable(false) should return section object', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    assert.strictEqual(section.enable(false), section);
  });
  it('section channels isEnabled should return false after enable(false)', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    section.enable(false);
    assert.notOk(bus('test1').isEnabled);
    assert.notOk(bus('test2').isEnabled);
  });
  it('section enable(true) should return section object', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    assert.strictEqual(section.enable(true), section);
  });
  it('section channels isEnabled should return true after enable(true)', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    section.enable(true);
    assert.ok(bus('test1').isEnabled);
    assert.ok(bus('test2').isEnabled);
  });

  it('section subscribe should return section object', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    assert.strictEqual(section.subscribe(subscriber), section);
  });
  it('section channels should return array/iterator containing subscriber', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    section.subscribe(subscriber);
    assert.notOk(bus('test1').subscribers.indexOf(subscriber) === -1);
    assert.notOk(bus('test2').subscribers.indexOf(subscriber) === -1);
  });

  it('section publish should return section object', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    invocations = 0;
    section.subscribe(subscriber);
    assert.strictEqual(section.publish(data), section);
  });
  it('subscriber should be invoked twice', () => {
    let bus = aerobus(delimiter, trace)
      , section = bus('test1', 'test2');
    invocations = 0;
    section.subscribe(subscriber);
    section.publish(data)
    assert.strictEqual(invocations, 2);
  }); 


  let invocations1 = 0, invocations2 = 0, subscriber1 = message => invocations1++, subscriber2 = message => invocations2++
  it('subscribe for same subscribers should return Channel object', () => {
    let bus = aerobus(delimiter, trace);
    assert.strictEqual(bus.root.subscribe(subscriber1, subscriber2), bus.root);
  });

  describe('strategy', () => {
    it('publish cyclically should call subscribers cyclically', () => {
      let bus = aerobus(delimiter, trace);
      bus.root.subscribe(subscriber1, subscriber2);
      assert.strictEqual(bus.root.publish(data, 'cyclically'), bus.root);
      assert.ok(invocations1 === 1 && invocations2 === 0);
      assert.strictEqual(bus.root.publish(data), bus.root);
      assert.ok(invocations1 === 1 && invocations2 === 1);
    });

    it('publish randomly should call subscribers randomly', () => {
      invocations1 = 0, invocations2 = 0;
      let bus = aerobus(delimiter, trace);
      bus.root.subscribe(subscriber1, subscriber2);
      assert.strictEqual(bus.root.publish(data, 'randomly'), bus.root);
      assert.ok(invocations1 + invocations2 === 1);
      assert.strictEqual(bus.root.publish(data), bus.root);
      assert.ok(invocations1 + invocations2 === 2);
    });
  });

  it('channel clear shoud clear subscribers', () => {
    let bus = aerobus(delimiter, trace);
    bus.root.subscribe(subscriber1, subscriber2);
    assert.strictEqual(bus.clear(), bus);
    assert.includeMembers(bus.channels, []);
  });

  it('retentions should work', () => {
    invocations = 0;
    let bus = aerobus(delimiter, trace);
    assert.strictEqual(bus.root.retain(1), bus.root);
    assert.strictEqual(bus.root.retaining, 1);
    bus.root.publish(data);
    bus.root.subscribe(subscriber);
    assert.strictEqual(invocations, 1);
  });

// #extension

  describe('extend', () => {
    it('extend should work with Channel', () => {
      let bus = aerobus(delimiter, trace, {
        Channel: {
          newMethod: () => 'test'
        }
      });
      assert.strictEqual(bus.root.newMethod(), 'test');
    });

    it('extend should work with Section', () => {
      let bus = aerobus(delimiter, trace, {
        Section: {
          newField: 'test'
        }
      });
      let section = bus('test1', 'test2');
      assert.strictEqual(section.newField, 'test');
    });

    it('extend should work independently', () => {
      let bus1 = aerobus(delimiter, trace, {
        Channel: {
          newField: 'test1'
        }
      });
      let bus2 = aerobus(delimiter, trace, {
        Channel: {
          newField: 'test2'
        }
      });
      let bus3 = aerobus();
      assert.strictEqual(bus1.root.newField, 'test1');
      assert.strictEqual(bus1('test1', 'test2').newField, undefined);
      assert.strictEqual(bus2.root.newField, 'test2');
      assert.strictEqual(bus3.root.newField, undefined);
    });

    it('extend should not redefine own properties', () => {
      let bus = aerobus(delimiter, trace, {
        Section: {
          publish: 'test'
        }
      });
      assert.notOk(bus.root.publish({}) === 'test');
    });

    it('extend should recognize parameters', () => {
      let bus = aerobus({
        Channel: {
          newField: 'test'
        }
      }, delimiter);
      assert.strictEqual(bus.delimiter, delimiter);
      assert.strictEqual(bus.root.newField, 'test');
    });
  });

// #iteration

  describe('iteration', () => {
    it('Symbol.iterator should be a function', () => {
      assert.isFunction(aerobus().root[Symbol.iterator]);
    });

    it('Symbol.iterator property should return object conforming extended iterator iterface', () => {
      let bus = aerobus(delimiter, trace);
      let iterator = bus.root[Symbol.iterator]();
      assert.isFunction(iterator.next);
      assert.isFunction(iterator.done);
    });

    it('iterator next should return promise in pending state before publish', (done) => {
      let bus = aerobus(delimiter, trace);
      let iterator = bus.root[Symbol.iterator]();
      let promise = iterator.next().value;
      let marker = {};
      Promise.race([promise, Promise.resolve(marker)]).then((value) => {
        assert.strictEqual(value, marker);
        done();
      });
    });

    it('publish should resolve promise', (done) => {
      let bus = aerobus(delimiter, trace);
      let iterator = bus.root[Symbol.iterator]();
      let promise = iterator.next().value;
      let marker1 = {}
        , marker2 = {};
      bus.root.publish(marker1);
      Promise.race([promise, Promise.resolve(marker2)]).then((value) => {
        assert.strictEqual(value, marker1);
        done();
      });
    });

    it('publish shoud remaining for next promises', () => {
      let bus = aerobus(delimiter, trace);
      let iterator = bus.root[Symbol.iterator]();
      let marker1 = {}
        , marker2 = {};
      bus.root.publish(marker1);
      let promise = iterator.next().value;
      Promise.race([promise, Promise.resolve(marker2)]).then((value) => {
        assert.strictEqual(value, marker1);
        done();
      });
    });

    it('done should end iteraion', () => {
      let bus = aerobus(delimiter, trace);
      let iterator = bus.root[Symbol.iterator]();
      iterator.done();
      let next = iterator.next();
      assert.strictEqual(next.done, true);
      assert.isUndefined(next.value);
    });

    it('iterator should work with Section', (done) => {
      let bus = aerobus(delimiter, trace);
      let iterator = bus('test1', 'test2')[Symbol.iterator]();
      assert.isFunction(iterator.next);
      assert.isFunction(iterator.done);

      let marker1 = {}
        , marker2 = {}
        , marker3 = {}
        , marker4 = {}
        , marker5 = {};

      let promise = iterator.next().value;
      let assert1 = Promise.race([promise, Promise.resolve(marker1)]).then((value) => {
        assert.strictEqual(value, marker1);
      });

      bus('test1').publish(marker2);
      let assert2 = Promise.race([promise, Promise.resolve(marker1)]).then((value) => {
        assert.strictEqual(value, marker2);
      });

      promise = iterator.next().value;
      let assert3 = Promise.race([promise, Promise.resolve(marker1)]).then((value) => {
        assert.strictEqual(value, marker1);
      });

      bus('test2').publish(marker3);
      let assert4 = Promise.race([promise, Promise.resolve(marker1)]).then((value) => {
        assert.strictEqual(value, marker3);
      });

      bus('test1').publish(marker4);
      bus('test2').publish(marker5);
      promise = iterator.next().value;
      let assert5 = Promise.race([promise, Promise.resolve(marker1)]).then((value) => {
        assert.strictEqual(value, marker4);
      });
      promise = iterator.next().value;
      let assert6 = Promise.race([promise, Promise.resolve(marker1)]).then((value) => {
        assert.strictEqual(value, marker5);
      });
      promise = iterator.next().value;
      let assert7 = Promise.race([promise, Promise.resolve(marker1)]).then((value) => {
        assert.strictEqual(value, marker1);
      });

      iterator.done();
      let next = iterator.next();
      assert.strictEqual(next.done, true);
      assert.isUndefined(next.value);

      Promise.all([assert1, assert2, assert3, assert4, assert5, assert6, assert7])
             .then(() => done());
    })
  });
*/

