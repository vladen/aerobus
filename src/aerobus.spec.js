'use strict';

import {assert as assertAlias} from 'chai';
const assert = assertAlias; // for better readability of transpiled code

import aerobusAlias from './aerobus';
const aerobus = aerobusAlias; // for better readability of transpiled code

describe('aerobus', () => {
  it('is function', () => {
    assert.isFunction(aerobus);
  });
});

describe('aerobus()', () => {
  it('is function', () => {
    let bus = aerobus();
    assert.isFunction(bus);
  });

  describe('.channels', () => {
    it('is array', () => {
      assert.isArray(aerobus().channels);
    });

    it('is empty array by default', () => {
      assert.strictEqual(aerobus().channels.length, 0);
    });

    it('contains error channel after it is created', () => {
      let bus = aerobus(), channel = bus.error;
      assert.include(bus.channels, channel);
    });

    it('contains root channel after it is created', () => {
      let bus = aerobus(), channel = bus.root;
      assert.include(bus.channels, channel);
    });

    it('contains custom channel after it is created', () => {
      let bus = aerobus(), channel = bus('test');
      assert.include(bus.channels, channel);
    });

    it('contains several channels after they are created', () => {
      let bus = aerobus(), channel0 = bus.root, channel1 = bus.error, channel2 = bus('test');
      assert.include(bus.channels, channel0);
      assert.include(bus.channels, channel1);
      assert.include(bus.channels, channel2);
    });
  });

  describe('.clear()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.clear(), bus);
    });

    it('removes all channels', () => {
      let bus = aerobus(), channel0 = bus.root, channel1 = bus.error, channel2 = bus('test');
      bus.clear();
      assert.strictEqual(bus.channels.length, 0);
      assert.notInclude(bus.channels, channel0);
      assert.notInclude(bus.channels, channel1);
      assert.notInclude(bus.channels, channel2);
    });
  });

  describe('.delimiter', () => {
    it('is string', () => {
      assert.isString(aerobus().delimiter);
    });

    it('is writable when bus is empty', () => {
      let delimiter = ':', bus = aerobus();
      bus.delimiter = delimiter;
      assert.strictEqual(bus.delimiter, delimiter);
    });

    it('is not writable when bus is not empty', () => {
      let delimiter = ':', bus = aerobus();
      bus('test');
      assert.throw(() => bus.delimiter = delimiter);
    });

    it('is writable again after bus has been cleared', () => {
      let delimiter = ':', bus = aerobus();
      bus('test');
      bus.clear();
      assert.doesNotThrow(() => bus.delimiter = delimiter);
    });
  });

  describe('.error', () => {
    it('is instance of Aerobus.Channel', () => {
      assert.typeOf(aerobus().error, 'Aerobus.Channel');
    });

    it('notifies own subscription with error thrown by subscription of other channel', done => {
      let bus = aerobus(), channel = bus('test'), error = new Error;
      bus.error.subscribe(thrown => {
        assert.strictEqual(thrown, error);
        done();
      })
      channel.subscribe(() => { throw error });
      channel.publish();
    });

    it('throws if own subscription throws', () => {
      let bus = aerobus(), error = new Error;
      bus.error.subscribe(() => { throw error });
      assert.throw(() => bus.error.publish());
    });
  });

  describe('.root', () => {
    it('is instance of Aerobus.Channel', () => {
      assert.typeOf(aerobus().root, 'Aerobus.Channel');
    });

    it('notifies own subscription with publication of descendant channel', done => {
      let bus = aerobus(), invocations = 0;
      bus.root.subscribe(() => ++invocations);
      bus('test').publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 1);
        done();
      });
    });
  });

  describe('.trace', () => {
    it('is function', () => {
      let bus = aerobus();
      assert.isFunction(bus.trace);
    });

    it('is writable when bus is empty', () => {
      let trace = () => {}, bus = aerobus();
      bus.trace = trace;
      assert.strictEqual(bus.trace, trace);
    });

    it('is not writable when bus is not empty', () => {
      let trace = () => {}, bus = aerobus();
      bus('test');
      assert.throw(() => bus.trace = trace);
    });

    it('is writable again after bus has been cleared', () => {
      let trace = () => {}, bus = aerobus();
      bus('test');
      bus.clear();
      assert.doesNotThrow(() => bus.trace = trace);
    });
  });

  describe('.unsubscribe()', () => {
    it('is fluent', () => {
      let bus = aerobus(), subscription = () => {};
      assert.strictEqual(bus.unsubscribe(subscription), bus);
    });

    it('removes subscription from channel', () => {
      let bus = aerobus(), channel = bus('test'), subscription = () => {};
      channel.subscribe(subscription);
      bus.unsubscribe(subscription)
      assert.notInclude(channel.subscriptions, subscription);
    });

    it('removes many subscriptions from channel', () => {
      let bus = aerobus(), channel = bus('test'), subscriber1 = () => {}, subscriber2 = () => {};
      channel.subscribe(subscriber1, subscriber2);
      bus.unsubscribe(subscriber1, subscriber2)
      assert.notInclude(channel.subscriptions, subscriber1);
      assert.notInclude(channel.subscriptions, subscriber2);
    });

    it('removes subscription from many channels', () => {
      let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2'), subscription = () => {};
      channel1.subscribe(subscription);
      channel2.subscribe(subscription);
      bus.unsubscribe(subscription)
      assert.notInclude(channel1.subscriptions, subscription);
      assert.notInclude(channel2.subscriptions, subscription);
    });
  });
});

describe('aerobus(@function)', () => {
  it('is a function', () => {
    let bus = aerobus(() => {});
    assert.isFunction(bus);
  });

  describe('.trace', () => {
    it('gets @function', () => {
      let trace = () => {}, bus = aerobus(trace);
      assert.strictEqual(bus.trace, trace);
    });
  });
});

describe('aerobus("")', () => {
  it('throws error', () => {
    assert.throw(() => aerobus(''));
  });
});

describe('aerobus(@string)', () => {
  it('is function', () => {
    assert.isFunction(aerobus(':'));
  });

  it('.delimiter', () => {
    it('gets @string', () => {
      let delimiter = ':', bus = aerobus(delimiter);
      assert.strictEqual(bus.delimiter, delimiter);
    });
  });
});

describe('aerobus(@object)', () => {
  it('is function', () => {
    assert.isFunction(aerobus({}));
  });

  it('~Aerobus.Channel', () => {
    it('instances extended with @object.channel', () => {
      let extension = () => {}, bus = aerobus({
        channel: { extension }
      });
      assert.strictEqual(bus.root.extension, extension);
      assert.strictEqual(bus.error.extension, extension);
      assert.strictEqual(bus('test').extension, extension);
    });
  });

  it('~Aerobus.Message', () => {
    it('instances extended with @object.message', done => {
      let extension = () => {}, bus = aerobus({
        message: { extension }
      });
      bus.root.subscribe((data, message) => {
        assert.strictEqual(message.extension, extension);
        done();
      });
      bus.root.publish();
    });
  });

  it('~Aerobus.Section', () => {
    it('instances extended with @object.section', () => {
      let extension = () => {}, bus = aerobus({
        section: { extension }
      });
      assert.strictEqual(bus('', 'test').extension, extension);
    });
  });
});

describe('aerobus(@function, @string)', () => {
  it('is function', () => {
    let bus = aerobus(':', () => {});
    assert.isFunction(bus);
  });

  it('.delimiter gets @string', () => {
    let delimiter = ':', bus = aerobus(delimiter, () => {});
    assert.strictEqual(bus.delimiter, delimiter);
    
  });

  it('.trace gets @function', () => {
    let trace = () => {}, bus = aerobus(':', trace);
    assert.strictEqual(bus.trace, trace);
  });
});

describe('aerobus(...)()', () => {
  it('is instance of Aerobus.Channel', () => {
    let bus = aerobus();
    assert.typeOf(bus(), 'Aerobus.Channel');
  });
  it('is root channel (equals to .bus.root)', () => {
    let channel = aerobus()();
    assert.strictEqual(channel, channel.bus.root);
  });
});

describe('aerobus(...)("")', () => {
  it('is instance of Aerobus.Channel', () => {
    let bus = aerobus();
    assert.typeOf(bus(''), 'Aerobus.Channel');
  });
  it('is root channel (equals to .bus.root)', () => {
    let channel = aerobus()('');
    assert.strictEqual(channel, channel.bus.root);
  });
  it('.name gets ""', () => {
    let bus = aerobus(), name = '';
    assert.strictEqual(bus(name).name, name);
  });
});

describe('aerobus(...)("error")', () => {
  it('is instance of Aerobus.Channel', () => {
    let bus = aerobus();
    assert.typeOf(bus('error'), 'Aerobus.Channel');
  });
  it('is error channel (equals to .bus.error)', () => {
    let channel = aerobus()('error');
    assert.strictEqual(channel, channel.bus.error);
  });
  it('.name gets "error"', () => {
    let bus = aerobus(), name = 'error';
    assert.strictEqual(bus(name).name, name);
  });
});

describe('aerobus(...)(@string)', () => {
  it('is instance of Aerobus.Channel', () => {
    let bus = aerobus();
    assert.typeOf(bus('test'), 'Aerobus.Channel');
  });
  it('.name gets @string', () => {
    let bus = aerobus(), name = 'test';
    assert.strictEqual(bus(name).name, name);
  });
});

describe('aerobus(...)(@array)', () => {
  it('throws', () => {
    assert.throw(() => aerobus()([]));
  });
});

describe('aerobus(...)(@boolean)', () => {
  it('throws', () => {
    assert.throw(() => aerobus()(true));
  });
});

describe('aerobus(...)(@date)', () => {
  it('throws', () => {
    assert.throw(() => aerobus()(new Date));
  });
});

describe('aerobus(...)(@number)', () => {
  it('throws', () => {
    assert.throw(() => aerobus()(42));
  });
});

describe('aerobus(...)(@object)', () => {
  it('throws', () => {
    assert.throw(() => aerobus()({}));
  });
});

describe('aerobus(...)(@string0, @string1)', () => {
  it('is instance of Aerobus.Section', () => {
    assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
  });

  it('contains specified channels (.channels[0].name === @string0)', () => {
    let names = ['test1', 'test2'], section = aerobus()(...names);
    assert.strictEqual(section.channels[0].name, names[0]);
    assert.strictEqual(section.channels[1].name, names[1]);
  });
});

describe('aerobus(...)(@number, @string)', () => {
  it('throws', () => {
    assert.throw(() => aerobus()(42, ''));
  });
});

describe('aerobus(...)(@string, @object)', () => {
  it('throws', () => {
    assert.throw(() => aerobus()('', {}));
  });
});


describe('Aerobus.Channel', () => {
  describe('.bus', () => {
    it('is parent bus', () => {
      let bus = aerobus();
      assert.strictEqual(bus('test').bus, bus);
      assert.strictEqual(bus.error.bus, bus);
      assert.strictEqual(bus.root.bus, bus);
    });
  });

  describe('.clear()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.clear(), channel);
    });

    it('clears .retentions', () => {
      let channel = aerobus().root;
      channel.retain().publish().clear();
      assert.strictEqual(channel.retentions.length, 0);
    });

    it('clears .subscriptions', () => {
      let channel = aerobus().root;
      channel.subscribe(() => {}).clear();
      assert.strictEqual(channel.subscriptions.length, 0);
    });
  });

  describe('.disable()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.disable(), channel);
    });

    it('disables channel', () => {
      let channel = aerobus().root;
      channel.disable();
      assert.isFalse(channel.isEnabled);
    });

    it('supresses publication delivery', done => {
      let channel = aerobus().root, invocations = 0;
      channel.subscribe(() => ++invocations).disable().publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 0);
        done();
      });
    });

    it('supresses publication delivery to descendant channel', done => {
      let channel = aerobus()('parent.child'), invocations = 0;
      channel.subscribe(() => ++invocations).parent.disable();
      channel.publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 0);
        done();
      });
    });
  });

  describe('.enable()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.enable(), bus.root);
    });

    it('enables channel', () => {
      assert.isTrue(aerobus().root.disable().enable().isEnabled);
    });

    it('resumes publication delivery', done => {
      let channel = aerobus().root, invocations = 0;
      channel.subscribe(() => ++invocations).disable().enable().publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 1);
        done();
      });
    });
  });

  describe('.enable(false)', () => {
    it('disables channel', () => {
      assert.isFalse(aerobus().root.enable(false).isEnabled);
    });
  });

  describe('.enable(true)', () => {
    it('enables channel', () => {
      assert.isTrue(aerobus().root.disable().enable(true).isEnabled);
    });
  });

  describe('.isEnabled', () => {
    it('is boolean', () => {
      assert.isBoolean(aerobus().root.isEnabled);
    });

    it('is true by default', () => {
      assert.isTrue(aerobus().root.isEnabled);
    });

    it('is false when channel is disabled', () => {
      let channel = aerobus()('test');
      channel.parent.disable();
      assert.isFalse(channel.isEnabled);
    });

    it('is true after channel has been enabled', () => {
      let channel = aerobus()('test');
      channel.parent.disable().enable();
      assert.isTrue(channel.isEnabled);
    });
  });

  describe('.[Symbol.iterator]', () => {
    it('is function', () => {
      assert.isFunction(aerobus().root[Symbol.iterator]);
    });
  });

  describe('.[Symbol.iterator] ()', () => {
    it('is instance of Aerobus.Iterator', () => {
      assert.typeOf(aerobus().root[Symbol.iterator](), 'Aerobus.Iterator');
    });
  });

  describe('.name', () => {
    it('is string', () => {
      assert.isString(aerobus().root.name);
    });

    it('is "error" string for error channel', () => {
      assert.strictEqual(aerobus().error.name, 'error');
    });

    it('is empty string for root channel', () => {
      assert.strictEqual(aerobus().root.name, '');
    });
  });

  describe('.parent', () => {
    it('is instance of Aerobus.Channel for custom channel', () => {
      assert.typeOf(aerobus()('test').parent, 'Aerobus.Channel');
    });

    it('is root channel for first level channel', () => {
      let bus = aerobus(), channel = bus('test');
      assert.strictEqual(channel.parent, bus.root);
    });

    it('is not root channel for second level channel', () => {
      let bus = aerobus(), parent = 'parent', child = 'child', channel = bus(parent + bus.delimiter + child);
      assert.strictEqual(channel.parent.name, parent);
    });

    it('is undefined for error channel', () => {
      assert.isUndefined(aerobus().error.parent);
    });

    it('is undefined for root channel', () => {
      assert.isUndefined(aerobus().root.parent);
    });
  });

  describe('.publish()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.publish(), channel);
    });

    it('notifies own subscription', done => {
      aerobus().root.subscribe(done).publish();
    });

    it('notifies own subscriptions in subcription order ', done => {
      let order = 0;
      aerobus().root.subscribe(
        () => {
          assert.strictEqual(++order, 1);
        },
        () => {
          assert.strictEqual(++order, 2);
          done();
        }).publish();
    });

    it('notifies ancestor subscriptions before own subscription', done => {
      let channel = aerobus()('parent.child'), order = 0;
      channel.parent.parent.subscribe(() => {
        assert.strictEqual(++order, 1);
      });
      channel.parent.subscribe(() => {
        assert.strictEqual(++order, 2);
      });
      channel.subscribe(() => {
        assert.strictEqual(++order, 3);
        done();
      });
      channel.publish();
    });
  });

  describe('.publish(@any)', () => {
    it('notifies own subscription with @any', done => {
      let data = {};
      aerobus().root.subscribe(
        value => {
          assert.strictEqual(value, data);
          done();
        }).publish(data);
    });
    it('notifies own and ancestor subscriptions with @any', done => {
      let channel = aerobus()('parent.child'), count = 0, data = {};
      channel.parent.parent.subscribe(value => {
        assert.strictEqual(value, data);
        if (++count === 3) done();
      });
      channel.parent.subscribe(value => {
        assert.strictEqual(value, data);
        if (++count === 3) done();
      });
      channel.subscribe(value => {
        assert.strictEqual(value, data);
        if (++count === 3) done();
      });
      channel.publish(data);
    });
  });

  describe('.publish(@any, @function)', () => {
    it('invokes @function with array containing result returned from own subscription', done => {
      let channel = aerobus()('parent.child'), result = {};
      channel
        .subscribe(() => result)
        .publish(null, results => {
          assert.include(results, result);
          done();
        });
    });
    it('invokes @function with array containing results returned from own subscriptions', done => {
      let channel = aerobus()('parent.child'), result0 = {}, result1 = {};
      channel
        .subscribe(() => result0, () => result1)
        .publish(null, results => {
          assert.include(results, result0);
          assert.include(results, result1);
          done();
        });
    });
    it('invokes @function with array containing result returned from parent subscription', done => {
      let channel = aerobus()('parent.child'), result = {};
      channel.parent.subscribe(() => result);
      channel.publish(null, results => {
        assert.include(results, result);
        done();
      });
    });
    it('invokes @callback with array containing results returned from own and parent parent subscriptions', done => {
      let channel = aerobus()('parent.child'), result0 = {}, result1 = {};
      channel.parent.subscribe(() => result0);
      channel.subscribe(() => result1).publish(null, results => {
        assert.include(results, result0);
        assert.include(results, result1);
        done();
      });
    });
  });

  describe('.retain()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.retain(), bus.root);
    });

    it('sets .retentions.limit property to Number.MAX_SAFE_INTEGER', () => {
      let channel = aerobus().root;
      channel.retain();
      assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
    });

    it('notifies all subsequent subscribtions with all retained publications immediately', done => {
      let channel = aerobus().root, publication0 = {}, publication1 = {}
        , expectations0 = [publication0, publication1]
        , expectations1 = [publication0, publication1];
      channel
        .retain()
        .publish(publication0)
        .publish(publication1)
        .subscribe(data => {
          assert.strictEqual(data, expectations0.shift());
        })
        .subscribe(data => {
          assert.strictEqual(data, expectations1.shift());
        });
      setImmediate(() => {
        assert.strictEqual(expectations0.length, 0);
        assert.strictEqual(expectations1.length, 0);
        done();
      });
    });
  });

  describe('.retain(false)', () => {
    it('sets .retentions.limit to 0', () => {
      let channel = aerobus().root;
      channel.retain(false);
      assert.strictEqual(channel.retentions.limit, 0);
    });

    it('clears .retentions', () => {
      let channel = aerobus().root, data1 = {}, data2 = {};
      channel.retain().publish(data1).publish(data2).retain(0);
      assert.strictEqual(channel.retentions.length, 0);
    });
  });

  describe('.retain(true)', () => {
    it('sets .retentions.limit to Number.MAX_SAFE_INTEGER', () => {
      let channel = aerobus().root;
      channel.retain(true);
      assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
    });
  });

  describe('.retain(@number)', () => {
    it('sets .retentions.limit to @number', () => {
      let limit = 42, channel = aerobus().root;
      channel.retain(limit);
      assert.strictEqual(channel.retentions.limit, limit);
    });
  });

  describe('.reset()', () => {
    it('is be fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.reset(), channel);
    });

    it('enables channel (sets .isEnabled to true)', () => {
      let channel = aerobus().root;
      channel.disable().reset();
      assert.isTrue(channel.isEnabled);
    });

    it('clears .retentions', () => {
      let channel = aerobus().root;
      channel.retain().publish().reset();
      assert.strictEqual(channel.retentions.length, 0);
    });

    it('resets .retentions.limit', () => {
      let channel = aerobus().root;
      channel.retain().publish().reset();
      assert.strictEqual(channel.retentions.limit, 0);
    });

    it('clears .subscriptions', () => {
      let channel = aerobus().root;
      channel.subscribe(() => {}).reset();
      assert.strictEqual(channel.subscriptions.length, 0);
    });
  });

  describe('.retentions', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.retentions);
    });

    it('contains one latest publication when limited to 1', () => {
      let channel = aerobus().root, data1 = {}, data2 = {};
      channel.retain(1).publish(data1).publish(data2);
      assert.strictEqual(channel.retentions.length, 1);
      assert.strictEqual(channel.retentions[0].data, data2);
    });

    it('contains two latest publications when limited to 2', () => {
      let channel = aerobus().root, data1 = {}, data2 = {}, data3 = {};
      channel.retain(2).publish(data1).publish(data2).publish(data3);
      assert.strictEqual(channel.retentions.length, 2);
      assert.strictEqual(channel.retentions[0].data, data2);
      assert.strictEqual(channel.retentions[1].data, data3);
    });
  });

  describe('.retentions.limit', () => {
    it('is number', () => {
      assert.isNumber(aerobus().root.retentions.limit);
    });
  });

  describe('.subscribe()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.subscribe(), channel);
    });
  });

  describe('.subscribe(@function)', () => {
    it('adds @function to .subscriptions', () => {
      let channel = aerobus().root, subscription = () => {};
      channel.subscribe(subscription);
      assert.include(channel.subscriptions, subscription);
    });
  });

  describe('.subscribe(@function0, @function1)', () => {
    it('adds @function0 and @function1 to .subscriptions', () => {
      let channel = aerobus().root, subscribtion0 = () => {}, subscribtion1 = () => {};
      channel.subscribe(subscribtion0, subscribtion1);
      assert.include(channel.subscriptions, subscribtion0);
      assert.include(channel.subscriptions, subscribtion1);
    });
  });

  describe('.subscriptions', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.subscriptions);
    });

    it('is empty array by default', () => {
      assert.strictEqual(aerobus().root.subscriptions.length, 0);
    });
  });

  describe('.toggle()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.toggle(), channel);
    });

    it('disables enabled channel', () => {
      assert.isFalse(aerobus().root.toggle().isEnabled);
    });

    it('enables disabled channel', () => {
      assert.isTrue(aerobus().root.disable().toggle().isEnabled);
    });
  });

  describe('.unsubscribe()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.unsubscribe(), channel);
    });
  });

  describe('.unsubscribe(@function)', () => {
    it('removes @function from .subscriptions', () => {
      let channel = aerobus().root, subscriber1 = () => {}, subscriber2 = () => {};
      channel.subscribe(subscriber1, subscriber2).unsubscribe(subscriber1, subscriber2);
      assert.notInclude(channel.subscriptions, subscriber1);
      assert.notInclude(channel.subscriptions, subscriber2);
    });
  });

  describe('.unsubscribe(@function0, @function1)', () => {
    it('removes @function0 and @function1 from .subscriptions', () => {
      let channel = aerobus().root, subscribtion0 = () => {}, subscribtion1 = () => {};
      channel.subscribe(subscribtion0, subscribtion1).unsubscribe(subscribtion0, subscribtion1);
      assert.notInclude(channel.subscriptions, subscribtion0);
      assert.notInclude(channel.subscriptions, subscribtion1);
    });
  });
});

describe('Aerobus.Iterator', () => {
  describe('.done()', () => {
    it('rejects pending promise returned from iterator', done => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.next().value.then(() => {}, done);
      iterator.done();
    });
  });

  describe('.next()', () => {
    it('returns object', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      assert.isObject(iterator.next());
    });
  });

  describe('.next().done', () => {
    it('is undefined by default', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      assert.isUndefined(iterator.next().done);
    });

    it('is true after iterator is .done()', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.done();
      assert.isTrue(iterator.next().done);
    });
  });

  describe('.next().value', () => {
    it('is Promise', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      assert.typeOf(iterator.next().value, 'Promise');
    });

    it('is pending promise without preceeding publication', done => {
      let iterator = aerobus().root[Symbol.iterator](), pending = {};
      Promise
        .race([iterator.next().value, Promise.resolve(pending)])
        .then(
          value => {
            assert.strictEqual(value, pending);
            done();
          });
    });

    it('is resolved promise with preceeding publication', done => {
      let channel = aerobus().root, data = {}, iterator = channel[Symbol.iterator]();
      channel.publish(data);
      Promise
        .race([iterator.next().value, Promise.resolve()])
        .then(
          value => {
            assert.strictEqual(value.data, data);
            done();
          });
    });

    it('resolves after publication to channel', done => {
      let channel = aerobus().root, iterator = channel[Symbol.iterator](), invocations = 0;
      iterator.next().value.then(() => ++invocations);
      assert.strictEqual(invocations, 0);
      channel.publish();
      setImmediate(message => {
        assert.strictEqual(invocations, 1);
        done();
      });
    });

    it('resolves with Aerobus.Message instance', done => {
      let channel = aerobus().root, iterator = channel[Symbol.iterator]();
      iterator.next().value.then(message => {
        assert.typeOf(message, 'Aerobus.Message');
        done();
      });
      channel.publish();
    });

    it('resolves with message.data returning published data', done => {
      let channel = aerobus().root, data = {}, iterator = channel[Symbol.iterator]();
      iterator.next().value.then(message => {
        assert.strictEqual(message.data, data);
        done();
      });
      channel.publish(data);
    });
  });
});

describe('Aerobus.Message', () => {
  describe('.channel', () => {
    it('gets name of channel it was published to', done => {
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

  describe('.data', () => {
    it('gets published data', done => {
      let data = {};
      aerobus().root.subscribe((_, message) => {
        assert.strictEqual(message.data, data);
        done();
      }).publish(data);
    });
  });

  describe('.error property:', () => {
    it('gets error caught in subscription', done => {
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

describe('Aerobus.Section', () => {
  describe('.bus', () => {
    it('gets parent bus', () => {
      let bus = aerobus();
      assert.strictEqual(bus('test1', 'test2').bus, bus);
    });
  });

  describe('.channels', () => {
    it('is array', () => {
      assert.isArray(aerobus()('test1', 'test2').channels);
    });

    it('contains all bound channels', () => {
      let bus = aerobus(), channel0 = bus('test0'), channel1 = bus('test1'), section = bus('test0', 'test1');
      assert.include(section.channels, channel0);
      assert.include(section.channels, channel1);
    });
  });

  describe('.clear()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.clear(), section);
    });

    it('clears all bound channels', () => {
      let section = aerobus()('test1', 'test2');
      section.channels.forEach(channel => channel.subscribe(() => {}));
      section.clear();
      section.channels.forEach(channel => assert.strictEqual(channel.subscriptions.length, 0));
    });
  });

  describe('.disable()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.disable(), section);
    });

    it('disables all bound channels', () => {
      let section = aerobus()('test1', 'test2');
      section.disable();
      section.channels.forEach(channel => assert.isFalse(channel.isEnabled));
    });
  });

  describe('.enable()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.enable(), section);
    });

    it('enables all bound channels', () => {
      let section = aerobus()('test1', 'test2');
      section.disable().enable();
      section.channels.forEach(channel => assert.isTrue(channel.isEnabled));
    });
  });

  describe('.publish()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.publish(), section);
    });
  });

  describe('.publish(@object)', () => {
    it('publishes @object to all bound channels', done => {
      let count = 0, data = {}, section = aerobus()('test1', 'test2');
      section
        .subscribe(
          value => {
            assert.strictEqual(value, data);
            if (++count === section.channels.length) done();
          })
        .publish(data);
    });
  });

  describe('.subscribe()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.subscribe(), section);
    });
  });

  describe('.subscribe(@function)', () => {
    it('subscribes @function to all bound channels', () => {
      let section = aerobus()('test1', 'test2'), subscription = () => {};
      section.subscribe(subscription);
      section.channels.forEach(channel => assert.include(channel.subscriptions, subscription));
    });
  });

  describe('.subscribe(@function0, @function1)', () => {
    it('subscribes @function to all bound channels', () => {
      let section = aerobus()('test1', 'test2'), subscription0 = () => {}, subscription1 = () => {};
      section.subscribe(subscription0, subscription1);
      section.channels.forEach(channel => {
        assert.include(channel.subscriptions, subscription0);
        assert.include(channel.subscriptions, subscription1);
      });
    });
  });

  describe('.toggle()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.toggle(), section);
    });

    it('disables all enabled bound channels', () => {
      let section = aerobus()('test1', 'test2');
      section.toggle();
      section.channels.forEach(channel => assert.isFalse(channel.isEnabled));
    });

    it('enables all disabled bound channels', () => {
      let section = aerobus()('test1', 'test2');
      section.disable().toggle();
      section.channels.forEach(channel => assert.isTrue(channel.isEnabled));
    });
  });

  describe('.unsubscribe()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.unsubscribe(), section);
    });
  });

  describe('.unsubscribe(@function)', () => {
    it('unsubscribes @function from all bound channels', () => {
      let section = aerobus()('test1', 'test2');
      section.subscribe(() => {}).unsubscribe();
      section.channels.forEach(channel => assert.strictEqual(channel.subscriptions.length, 0));
    });
  });
});