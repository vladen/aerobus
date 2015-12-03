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

    it('is empty by default', () => {
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

    it('clears .channels', () => {
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

    it('notifies own subscribers with error thrown by subscribers in other channel', done => {
      let bus = aerobus(), channel = bus('test'), error = new Error;
      bus.error.subscribe(thrown => {
        assert.strictEqual(thrown, error);
        done();
      })
      channel.subscribe(() => { throw error });
      channel.publish();
    });

    it('throws if own subscriber throws', () => {
      let bus = aerobus(), error = new Error;
      bus.error.subscribe(() => { throw error });
      assert.throw(() => bus.error.publish());
    });
  });

  describe('.root', () => {
    it('is instance of Aerobus.Channel', () => {
      assert.typeOf(aerobus().root, 'Aerobus.Channel');
    });

    it('notifies own subscriber with message published to descendant channel', done => {
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

    it('is invoked for channel.clear with arguments ("clear", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.clear();
      assert.strictEqual(results[0], 'clear');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.disable with arguments ("disable", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.disable();
      assert.strictEqual(results[0], 'disable');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.enable with arguments ("enable", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.enable();
      assert.strictEqual(results[0], 'enable');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.publish with arguments ("publish", channel, message)', () => {
      let data = {}
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.publish(data);
      assert.strictEqual(results[0], 'publish');
      assert.strictEqual(results[1], bus.root);
      assert.typeOf(results[2], 'Aerobus.Message');
      assert.strictEqual(results[2].data, data);
    });

    it('is invoked for channel.reset with arguments ("reset", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.reset();
      assert.strictEqual(results[0], 'reset');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.retain with arguments ("retain", channel, limit)', () => {
      let limit = 42
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.retain(limit);
      assert.strictEqual(results[0], 'retain');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], limit);
    });

    it('is invoked for channel.subscribe with arguments ("subscribe", channel, parameters)', () => {
      let parameters = [1, () => {}]
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.subscribe(...parameters);
      assert.strictEqual(results[0], 'subscribe');
      assert.strictEqual(results[1], bus.root);
      assert.includeMembers(results[2], parameters);
    });

    it('is invoked for channel.toggle with arguments ("toggle", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.toggle();
      assert.strictEqual(results[0], 'toggle');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.unsubscribe with arguments ("unsubscribe", channel, subscribers)', () => {
      let subscribers = [() => {}]
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus(trace);
      bus.root.unsubscribe(...subscribers);
      assert.strictEqual(results[0], 'unsubscribe');
      assert.strictEqual(results[1], bus.root);
      assert.includeMembers(results[2], subscribers);
    });
  });

  describe('.unsubscribe()', () => {
    it('is fluent', () => {
      let bus = aerobus()
        , subscriber = () => {};
      assert.strictEqual(bus.unsubscribe(subscriber), bus);
    });

    it('clears .subscribers of all channel', () => {
      let bus = aerobus(), channel0 = bus.root, channel1 = bus('test1'), channel2 = bus('test2')
        , subscriber0 = () => {}, subscriber1 = () => {};
      channel0.subscribe(subscriber0, subscriber1);
      channel1.subscribe(subscriber0);
      channel2.subscribe(subscriber1);
      bus.unsubscribe();
      assert.strictEqual(channel0.subscribers.length, 0);
      assert.strictEqual(channel1.subscribers.length, 0);
      assert.strictEqual(channel2.subscribers.length, 0);
    });
  });

  describe('.unsubscribe(@function)', () => {
    it('removes @function from .subscribers of all channel', () => {
      let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2')
        , subscriber = () => {};
      channel1.subscribe(subscriber);
      channel2.subscribe(subscriber);
      bus.unsubscribe(subscriber);
      assert.notInclude(channel1.subscribers, subscriber);
      assert.notInclude(channel2.subscribers, subscriber);
    });
  });

  describe('.unsubscribe(...@functions)', () => {
    it('removes @functions from .subscribers of all channels', () => {
      let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2')
        , subscriber1 = () => {}
        , subscriber2 = () => {};
      channel1.subscribe(subscriber1, subscriber2);
      channel2.subscribe(subscriber1, subscriber2);
      bus.unsubscribe(subscriber1, subscriber2)
      assert.notInclude(channel1.subscribers, subscriber1);
      assert.notInclude(channel1.subscribers, subscriber2);
      assert.notInclude(channel2.subscribers, subscriber1);
      assert.notInclude(channel2.subscribers, subscriber2);
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
      let trace = () => {}
        , bus = aerobus(trace);
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

  describe('.delimiter', () => {
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

  describe('Aerobus.Channel instances created by this bus', () => {
    it('are extended with @object.channel members', () => {
      let extension = () => {}
        , bus = aerobus({
            channel: { extension }
          })
        , channels = [bus.root, bus.error, bus('custom')];
      channels.forEach(channel => assert.strictEqual(channel.extension, extension));
    });

    it('keep all standard api members', () => {
      let extensions = {
            clear: null
          , disable: null
          , enable: null
          , isEnabled: null
          , publish: null
          , reset: null
          , retain: null
          , retentions: null
          , subscribe: null
          , subscribers: null
          , toggle: null
          , unsubscribe: null
          }
        , bus = aerobus({ channel: extensions })
        , channels = [bus.root, bus.error, bus('custom')];
      Object.keys(extensions).forEach(
        key => channels.forEach(
          channel => assert.isNotNull(channel[key])));
    });
  });

  describe('Aerobus.Message instances created by this bus', () => {
    it('are extended with @object.message members', () => {
      let extension = () => {}
        , bus = aerobus({
            message: { extension }
          })
        , result;
      bus.root.subscribe((_, message) => result = message.extension);
      bus.root.publish();
      assert.strictEqual(result, extension);
    });

    it('keep all standard api members', () => {
      let extensions = {
            channel: null
          , data: null
          }
        , bus = aerobus({ message: extensions })
        , result;
      bus.root.subscribe((_, message) => result = message);
      bus.root.publish({});
      Object.keys(extensions).forEach(
        key => assert.isNotNull(result[key]));
    });
  });

  describe('Aerobus.Message instances created by this bus', () => {
    it('are extended with @object.section members', () => {
      let extension = () => {}
        , bus = aerobus({
            section: { extension }
          })
        , sections = [bus('root', 'error'), bus('root', 'error', 'custom')];
      sections.forEach(section => assert.strictEqual(section.extension, extension));
    });

    it('keep all standard api members', () => {
      let extensions = {
            channels: null
          , clear: null
          , disable: null
          , enable: null
          , publish: null
          , reset: null
          , retain: null
          , subscribe: null
          , toggle: null
          , unsubscribe: null
          }
        , bus = aerobus({ channel: extensions })
        , sections = [bus('root', 'error'), bus('root', 'error', 'custom')];
      Object.keys(extensions).forEach(
        key => sections.forEach(
          section => assert.isNotNull(section[key])));
    });
  });
});

describe('aerobus(@function, @string)', () => {
  it('is function', () => {
    let bus = aerobus(':', () => {});
    assert.isFunction(bus);
  });

  describe('.delimiter', () => {
    it('gets @string', () => {
      let delimiter = ':', bus = aerobus(delimiter, () => {});
      assert.strictEqual(bus.delimiter, delimiter);
    });
  })

  describe('.trace', () => {
    it('gets @function', () => {
      let trace = () => {}
        , bus = aerobus(':', trace);
      assert.strictEqual(bus.trace, trace);
    });
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

  describe('.name', () => {
    it('gets ""', () => {
      let bus = aerobus(), name = '';
      assert.strictEqual(bus(name).name, name);
    });
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

describe('aerobus(...)(@strings)', () => {
  it('is instance of Aerobus.Section', () => {
    assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
  });

  it('contains specified channels (@strings includes .channels[0].name)', () => {
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

    it('clears .subscribers', () => {
      let channel = aerobus().root;
      channel.subscribe(() => {}).clear();
      assert.strictEqual(channel.subscribers.length, 0);
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

    it('supresses publication', done => {
      let channel = aerobus().root, invocations = 0;
      channel.subscribe(() => ++invocations).disable().publish();
      setImmediate(() => {
        assert.strictEqual(invocations, 0);
        done();
      });
    });

    it('supresses publication to descendant channel', done => {
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

    it('resumes publication', done => {
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

    it('is custom string for custom channel', () => {
      let name = 'some.custom.channel';
      assert.strictEqual(aerobus()(name).name, name);
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

    it('is parent channel for second level channel', () => {
      let bus = aerobus(), parent = bus('parent'), child = bus('parent.child');
      assert.strictEqual(child.parent, parent);
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

    it('notifies own subscribers in subcription order ', () => {
      let traces = []
        , subscriber0 = () => traces.push('first')
        , subscriber1 = () => traces.push('second');
      aerobus().root.subscribe(subscriber0, subscriber1).publish();
      assert.strictEqual(traces[0], 'first');
      assert.strictEqual(traces[1], 'second');
    });

    it('notifies ancestor subscribers before own', () => {
      let channel = aerobus()('parent.child'), traces = []
        , ancestor = () => traces.push('ancestor')
        , parent = () => traces.push('parent')
        , self = () => traces.push('self');
      channel.parent.parent.subscribe(ancestor);
      channel.parent.subscribe(parent);
      channel.subscribe(self);
      channel.publish();
      assert.strictEqual(traces[0], 'ancestor');
      assert.strictEqual(traces[1], 'parent');
      assert.strictEqual(traces[2], 'self');
    });
  });

  describe('.publish(@object)', () => {
    it('notifies own subscriber with @object', () => {
      let publication = {}, result
        , subscriber = data => result = data;
      aerobus().root.subscribe(subscriber).publish(publication);
      assert.strictEqual(result, publication);
    });

    it('notifies own and ancestor subscribers with @object', () => {
      let channel = aerobus()('parent.child'), publication = {}, results = []
        , subscriber = data => results.push(data);
      channel.parent.parent.subscribe(subscriber);
      channel.parent.subscribe(subscriber);
      channel.subscribe(subscriber);
      channel.publish(publication);
      assert.strictEqual(results[0], publication);
      assert.strictEqual(results[1], publication);
      assert.strictEqual(results[2], publication);
    });
  });

  describe('.publish(@object, @function)', () => {
    it('invokes @function with array containing results returned from own and ancestor subscribers', () => {
      let channel = aerobus()('parent.child'), result0 = {}, result1 = {}, result2 = {}, results
        , callback = data => results = data;
      channel.parent.parent.subscribe(() => result0);
      channel.parent.subscribe(() => result1);
      channel.subscribe(() => result2).publish(null, callback);
      assert.include(results, result0);
      assert.include(results, result1);
      assert.include(results, result2);
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

    it('notifies all subsequent subscribtions with all retained publications immediately in order of publication', () => {
      let channel = aerobus().root, publication0 = {}, publication1 = {}, results = []
        , subscriber = data => results.push(data);
      channel
        .retain()
        .publish(publication0)
        .publish(publication1)
        .subscribe(subscriber)
        .subscribe(subscriber);
      assert.strictEqual(results[0], publication0);
      assert.strictEqual(results[1], publication1);
    });
  });

  describe('.retain(false)', () => {
    it('sets .retentions.limit to 0', () => {
      let channel = aerobus().root;
      channel.retain(false);
      assert.strictEqual(channel.retentions.limit, 0);
    });

    it('clears .retentions', () => {
      let channel = aerobus().root, publication0 = {}, publication1 = {};
      channel
        .retain()
        .publish(publication0)
        .publish(publication1)
        .retain(false);
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

    it('clears .subscribers', () => {
      let channel = aerobus().root;
      channel.subscribe(() => {}).reset();
      assert.strictEqual(channel.subscribers.length, 0);
    });
  });

  describe('.retentions', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.retentions);
    });

    it('contains one latest publication when limited to 1', () => {
      let channel = aerobus().root, publication0 = {}, publication1 = {};
      channel
        .retain(1)
        .publish(publication0)
        .publish(publication1);
      assert.strictEqual(channel.retentions.length, 1);
      assert.strictEqual(channel.retentions[0].data, publication1);
    });

    it('contains two latest publications when limited to 2', () => {
      let channel = aerobus().root, publication0 = {}, publication1 = {}, publication2 = {};
      channel
        .retain(2)
        .publish(publication0)
        .publish(publication1)
        .publish(publication2);
      assert.strictEqual(channel.retentions.length, 2);
      assert.strictEqual(channel.retentions[0].data, publication1);
      assert.strictEqual(channel.retentions[1].data, publication2);
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
    it('adds @function to .subscribers', () => {
      let channel = aerobus().root
        , subscriber = () => {};
      channel.subscribe(subscriber);
      assert.include(channel.subscribers, subscriber);
    });
  });

  describe('.subscribe(...@functions)', () => {
    it('adds @functions to .subscribers', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(subscriber0, subscriber1);
      assert.include(channel.subscribers, subscriber0);
      assert.include(channel.subscribers, subscriber1);
    });
  });

  describe('.subscribe(@number, @function)', () => {
    it('adds @function to .subscribers ordering by @number', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
      assert.strictEqual(channel.subscribers[0], subscriber1);
      assert.strictEqual(channel.subscribers[1], subscriber0);
    });
  });

  describe('.subscribe(@number, ...@functions)', () => {
    it('adds @functions to .subscribers ordering by @number', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {}
        , subscriber2 = () => {};
      channel.subscribe(subscriber0).subscribe(-1, subscriber1, subscriber2);
      assert.strictEqual(channel.subscribers[0], subscriber1);
      assert.strictEqual(channel.subscribers[1], subscriber2);
      assert.strictEqual(channel.subscribers[2], subscriber0);
    });
  });

  describe('.subscribers', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.subscribers);
    });

    it('is empty array by default', () => {
      assert.strictEqual(aerobus().root.subscribers.length, 0);
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
    it('removes @function from .subscribers', () => {
      let channel = aerobus().root
        , subscriber = () => {};
      channel.subscribe(subscriber).unsubscribe(subscriber);
      assert.notInclude(channel.subscribers, subscriber);
      assert.notInclude(channel.subscribers, subscriber);
    });
  });

  describe('.unsubscribe(...@functions)', () => {
    it('removes all @functions from .subscribers', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel
        .subscribe(subscriber0, subscriber1)
        .unsubscribe(subscriber0, subscriber1);
      assert.notInclude(channel.subscribers, subscriber0);
      assert.notInclude(channel.subscribers, subscriber1);
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

    it('is pending promise when there is no preceeding publication', done => {
      let iterator = aerobus().root[Symbol.iterator](), pending = {}, result;
      Promise
        .race([iterator.next().value, Promise.resolve(pending)])
        .then(resolved => result = resolved);
      setImmediate(() => {
        assert.strictEqual(result, pending);
        done();
      });
    });

    it('is promise resolved with Aerobus.Message instance containing published data when there is preceeding publication', done => {
      let channel = aerobus().root, publication = {}, iterator = channel[Symbol.iterator](), result;
      channel.publish(publication);
      iterator.next().value.then(resolved => result = resolved);
      setImmediate(() => {
        assert.typeOf(result, 'Aerobus.Message');
        assert.strictEqual(result.data, publication);
        done();
      });
    });

    it('resolves after publication with Aerobus.Message instance containing published data', done => {
      let channel = aerobus().root, iterator = channel[Symbol.iterator](), publication = {}, result, resolved = false;
      iterator.next().value.then(message => {
        resolved = true;
        result = message;
      });
      assert.isFalse(resolved);
      channel.publish(publication);
      setImmediate(() => {
        assert.isTrue(resolved);
        assert.typeOf(result, 'Aerobus.Message');
        assert.strictEqual(result.data, publication);
        done();
      });
    });
  });
});

describe('Aerobus.Message', () => {
  describe('.channel', () => {
    it('gets channel this message was delivered to', () => {
      let bus = aerobus(), channel = bus('test'), result
        , subscriber = (_, message) => result = message.channel;
      channel.subscribe(subscriber).publish();
      assert.strictEqual(result, channel);
    });
  });

  describe('.channels', () => {
    it('gets array of channels this message traversed', () => {
      let bus = aerobus(), root = bus.root, parent = bus('parent'), child = bus('parent.child'), results = []
        , subscriber = (_, message) => results = message.channels;
      bus.root.subscribe(subscriber);
      child.publish();
      assert.include(results, root);
      assert.include(results, parent);
      assert.include(results, child);
    });
  });

  describe('.data', () => {
    it('gets published data', () => {
      let publication = {}, result
        , subscriber = (_, message) => result = message.data;
      aerobus().root.subscribe(subscriber).publish(publication);
      assert.strictEqual(result, publication);
    });
  });

  describe('.error', () => {
    it('gets error caught in subscriber', () => {
      let bus = aerobus(), error = new Error, result
        , errorSubscriber = (_, message) => result = message.error
        , throwSubscriber = () => { throw error };
      bus.error.subscribe(errorSubscriber);
      bus.root.subscribe(throwSubscriber).publish();
      assert.strictEqual(result, error);
    });
  });

  describe('.prior', () => {
    it('gets prior message delivered to previous channel in publication chain', () => {
      let bus = aerobus(), channel = bus('test'), prior, result
        , rootSubscriber = (_, message) => prior = message.prior
        , ownSubscriber = (_, message) => result = message;
      channel.subscribe(ownSubscriber);
      bus.root.subscribe(rootSubscriber);
      channel.publish();
      assert.strictEqual(result, prior);
    });

    it('is undefined when message is delivered to single channel', () => {
      let result
        , subscriber = (_, message) => result = message;
      aerobus().root.subscribe(subscriber).publish();
      assert.isUndefined(result.prior);
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

    it('clears .subscribers of all bound channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section.channels.forEach(channel => channel.subscribe(subscriber));
      section.clear();
      section.channels.forEach(channel => assert.strictEqual(channel.subscribers.length, 0));
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
    it('publishes @object to all bound channels in order of declaration', () => {
      let section = aerobus()('test1', 'test2'), publication = {}, results = []
        , subscriber = (_, message) => results.push(message.channel);
      section
        .subscribe(subscriber)
        .publish(publication);
      assert.strictEqual(results[0], section.channels[0]);
      assert.strictEqual(results[1], section.channels[1]);
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
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section.subscribe(subscriber);
      section.channels.forEach(channel => assert.include(channel.subscribers, subscriber));
    });
  });

  describe('.subscribe(@function0, @function1)', () => {
    it('subscribes @function to all bound channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      section.subscribe(subscriber0, subscriber1);
      section.channels.forEach(channel => {
        assert.include(channel.subscribers, subscriber0);
        assert.include(channel.subscribers, subscriber1);
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
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section
        .subscribe(subscriber)
        .unsubscribe(subscriber);
      section.channels.forEach(channel => assert.notInclude(channel.subscribers, subscriber));
    });
  });
});