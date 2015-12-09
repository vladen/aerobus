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
  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus(), 'Aerobus');
  });

  describe('Aerobus#bubbles', () => {
    it('is true', () => {
      assert.isTrue(aerobus().bubbles);
    });
  });

  describe('Aerobus#delimiter', () => {
    it('is "."', () => {
      assert.strictEqual(aerobus().delimiter, '.');
    });
  });
});

describe('aerobus(@object)', () => {
  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus({}), 'Aerobus');
  });

  describe('@object.bubbles', () => {
    it('configures Aerobus#bubbles', () => {
      let bubbles = false
        , bus = aerobus({ bubbles });
      assert.strictEqual(bus.bubbles, bubbles);
    });
  });

  describe('@object.delimiter', () => {
    it('must be not empty string', () => {
      assert.throw(() => aerobus({ delimiter: '' }));
      assert.throw(() => aerobus({ delimiter: [] }));
      assert.throw(() => aerobus({ delimiter: false }));
      assert.throw(() => aerobus({ delimiter: true }));
      assert.throw(() => aerobus({ delimiter: new Date }));
      assert.throw(() => aerobus({ delimiter: 0 }));
      assert.throw(() => aerobus({ delimiter: () => {} }));
      assert.throw(() => aerobus({ delimiter: {} }));
    });

    it('configures Aerobus#delimiter', () => {
      let delimiter = ':'
        , bus = aerobus({ delimiter });
      assert.strictEqual(bus.delimiter, delimiter);
    });
  });

  describe('@object.error', () => {
    it('must be a function', () => {
      assert.throw(() => aerobus({ error: '' }));
      assert.throw(() => aerobus({ error: [] }));
      assert.throw(() => aerobus({ error: false }));
      assert.throw(() => aerobus({ error: true }));
      assert.throw(() => aerobus({ delimiter: new Date }));
      assert.throw(() => aerobus({ delimiter: 0 }));
      assert.throw(() => aerobus({ error: {} }));
    });

    it('configures Aerobus#error', () => {
      let error = () => {}
        , bus = aerobus({ error });
      assert.strictEqual(bus.error, error);
    });
  });

  describe('@object.trace', () => {
    it('must be a function', () => {
      assert.throw(() => aerobus({ trace: '' }));
      assert.throw(() => aerobus({ trace: [] }));
      assert.throw(() => aerobus({ trace: false }));
      assert.throw(() => aerobus({ trace: true }));
      assert.throw(() => aerobus({ delimiter: new Date }));
      assert.throw(() => aerobus({ delimiter: 0 }));
      assert.throw(() => aerobus({ trace: {} }));
    });

    it('configures Aerobus#trace', () => {
      let trace = () => {}
        , bus = aerobus({ trace });
      assert.strictEqual(bus.trace, trace);
    });
  });

  describe('@object.channel', () => {
    it('extends Aerobus.Channel instances', () => {
      let extension = () => {}
        , bus = aerobus({
            channel: { extension }
          })
        , channels = [bus.root, bus('custom')];
      channels.forEach(channel => assert.strictEqual(channel.extension, extension));
    });

    it('preserves standard members', () => {
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
        , channels = [bus.root, bus('custom')];
      Object.keys(extensions).forEach(
        key => channels.forEach(
          channel => assert.isNotNull(channel[key])));
    });
  });

  describe('@object.message', () => {
    it('extends Aerobus.Message instances', () => {
      let extension = () => {}
        , bus = aerobus({
            message: { extension }
          })
        , result;
      bus.root.subscribe((_, message) => result = message.extension);
      bus.root.publish();
      assert.strictEqual(result, extension);
    });

    it('preserves standard members', () => {
      let extensions = {
            destination: null
          , data: null
          , route: null
          }
        , bus = aerobus({ message: extensions })
        , result;
      bus.root.subscribe((_, message) => result = message);
      bus.root.publish({});
      Object.keys(extensions).forEach(
        key => assert.isNotNull(result[key]));
    });
  });

  describe('@object.section', () => {
    it('extends Aerobus.Section instances', () => {
      let extension = () => {}
        , bus = aerobus({
            section: { extension }
          })
        , sections = [bus('', 'test'), bus('', 'test', 'parent.child')];
      sections.forEach(section => assert.strictEqual(section.extension, extension));
    });

    it('preserves standard members', () => {
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
        , sections = [bus('', 'test'), bus('', 'test', 'parent.child')];
      Object.keys(extensions).forEach(
        key => sections.forEach(
          section => assert.isNotNull(section[key])));
    });
  });
});

describe('aerobus(!@object)', () => {
  it('throws', () => {
    assert.throw(() => aerobus([]));
    assert.throw(() => aerobus(true));
    assert.throw(() => aerobus(false));
    assert.throw(() => aerobus(new Date));
    assert.throw(() => aerobus(0));
    assert.throw(() => aerobus(''));
  });
});

describe('Aerobus', () => {
  describe('is function', () => {
    assert.instanceOf(aerobus(), Function);
  });

  describe('#()', () => {
    it('returns instance of Aerobus.Channel', () => {
      let bus = aerobus();
      assert.typeOf(bus(), 'Aerobus.Channel');
    });

    it('returns #root channel', () => {
      let bus = aerobus()
        , channel = bus();
      assert.strictEqual(channel, bus.root);
    });
  });

  describe('#("")', () => {
    it('returns instance of Aerobus.Channel', () => {
      let bus = aerobus();
      assert.typeOf(bus(''), 'Aerobus.Channel');
    });

    it('returns #root channel', () => {
      let bus = aerobus()
        , channel = bus('');
      assert.strictEqual(channel, bus.root);
    });

    describe('returned Aerobus.Channel#name', () => {
      it('gets ""', () => {
        let bus = aerobus()
          , name = '';
        assert.strictEqual(bus(name).name, name);
      });
    });
  });

  describe('#(@string)', () => {
    it('returns instance of Aerobus.Channel', () => {
      let bus = aerobus();
      assert.typeOf(bus('test'), 'Aerobus.Channel');
    });

    it('#name gets @string', () => {
      let bus = aerobus(), name = 'test';
      assert.strictEqual(bus(name).name, name);
    });
  });

  describe('#(...@strings)', () => {
    it('returns instance of Aerobus.Section', () => {
      assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
    });

    it('returned #channels contain specified channels', () => {
      let names = ['test1', 'test2']
        , section = aerobus()(...names);
      assert.strictEqual(section.channels[0].name, names[0]);
      assert.strictEqual(section.channels[1].name, names[1]);
    });
  });

  describe('#(!@string)', () => {
    it('throws', () => {
      assert.throw(() => aerobus()([]));
      assert.throw(() => aerobus()(true));
      assert.throw(() => aerobus()(new Date));
      assert.throw(() => aerobus()(42));
      assert.throw(() => aerobus()({}));
    });
  });

  describe('#channels', () => {
    it('is array', () => {
      assert.isArray(aerobus().channels);
    });

    it('is empty by default', () => {
      assert.strictEqual(aerobus().channels.length, 0);
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
      let bus = aerobus()
        , channel0 = bus.root
        , channel1 = bus('test')
        , channel2 = bus('parent.child');
      assert.include(bus.channels, channel0);
      assert.include(bus.channels, channel1);
      assert.include(bus.channels, channel2);
    });
  });

  describe('#clear()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.clear(), bus);
    });

    it('empties #channels', () => {
      let bus = aerobus()
        , channel0 = bus.root
        , channel1 = bus.error
        , channel2 = bus('test');
      bus.clear();
      assert.strictEqual(bus.channels.length, 0);
      assert.notInclude(bus.channels, channel0);
      assert.notInclude(bus.channels, channel1);
      assert.notInclude(bus.channels, channel2);
    });

    it('resolves new channel instance for same Aerobus.Channel#name ', () => {
      let bus = aerobus()
        , channel0 = bus.root
        , channel1 = bus.error
        , channel2 = bus('test');
      bus.clear();
      assert.notStrictEqual(bus(channel0.name), channel0);
      assert.notStrictEqual(bus(channel1.name), channel1);
      assert.notStrictEqual(bus(channel2.name), channel2);
    });
  });

  describe('#create()', () => {
    it('creates new Aerobus instance', () => {
      assert.typeOf(aerobus().create(), 'Aerobus');
    });

    it('new Aerobus instance inherits #delimiter', () => {
      let delimiter = ':';
      assert.strictEqual(aerobus({ delimiter }).create().delimiter, delimiter);
    });

    it('new Aerobus instance inherits #error', () => {
      let error = () => {};
      assert.strictEqual(aerobus({ error }).create().error, error);
    });

    it('new Aerobus instance inherits #trace', () => {
      let trace = () => {};
      assert.strictEqual(aerobus({ trace }).create().trace, trace);
    });

    it('new Aerobus instance inherits channel extension', () => {
      let extension = () => {};
      assert.strictEqual(aerobus({ channel : { extension } }).create().root.extension, extension);
    });

    it('new Aerobus instance inherits message extension', () => {
      let extension = () => {}
        , result
        , subscriber = (_, message) => result = message;
      aerobus({ message : { extension } })
        .create()
        .root
        .subscribe(subscriber)
        .publish();
      assert.strictEqual(result.extension, extension);
    });

    it('new Aerobus instance inherits section extension', () => {
      let extension = () => {};
      assert.strictEqual(aerobus({ section : { extension } }).create()('test0', 'test1').extension, extension);
    });
  });

  describe('#delimiter', () => {
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

  describe('#error', () => {
    it('is a function', () => {
      assert.isFunction(aerobus().error);
    });

    it('is writable', () => {
      let bus = aerobus()
        , error = () => {};
      bus.error = error;
      assert.strictEqual(bus.error, error);
    });

    it('is invoked with error thrown in subscriber', done => {
      let result
        , error = new Error
        , bus = aerobus({ error: err => result = err });
      bus.root.subscribe(() => { throw error }).publish();
      setImmediate(() => {
        assert.strictEqual(result, error);
        done();
      });
    });
  });

  describe('#root', () => {
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

  describe('#trace', () => {
    it('is function', () => {
      let bus = aerobus();
      assert.isFunction(bus.trace);
    });

    it('is writable', () => {
      let trace = () => {}
        , bus = aerobus();
      bus.trace = trace;
      assert.strictEqual(bus.trace, trace);
    });

    it('is invoked for channel.clear() with arguments ("clear", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.clear();
      assert.strictEqual(results[0], 'clear');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.disable() with arguments ("enable", channel, false)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.disable();
      assert.strictEqual(results[0], 'enable');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], false);
    });

    it('is invoked for channel.enable() with arguments ("enable", channel, true)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.enable();
      assert.strictEqual(results[0], 'enable');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], true);
    });

    it('is invoked for channel.enable(false) with arguments ("enable", channel, false)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.enable(false);
      assert.strictEqual(results[0], 'enable');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], false);
    });

    it('is invoked for channel.publish(@data) with arguments ("publish", channel, message) where message.data is @data', () => {
      let data = {}
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.publish(data);
      assert.strictEqual(results[0], 'publish');
      assert.strictEqual(results[1], bus.root);
      assert.typeOf(results[2], 'Aerobus.Message');
      assert.strictEqual(results[2].data, data);
    });

    it('is invoked for channel.reset() with arguments ("reset", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.reset();
      assert.strictEqual(results[0], 'reset');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.retain(@limit) with arguments ("retain", channel, @limit)', () => {
      let limit = 42
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.retain(limit);
      assert.strictEqual(results[0], 'retain');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], limit);
    });

    it('is invoked for channel.subscribe(@parameters) with arguments ("subscribe", channel, @parameters)', () => {
      let parameters = [1, () => {}]
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.subscribe(...parameters);
      assert.strictEqual(results[0], 'subscribe');
      assert.strictEqual(results[1], bus.root);
      assert.includeMembers(results[2], parameters);
    });

    it('is invoked for channel.toggle() with arguments ("toggle", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.toggle();
      assert.strictEqual(results[0], 'toggle');
      assert.strictEqual(results[1], bus.root);
    });

    it('is invoked for channel.unsubscribe(@parameters) with arguments ("unsubscribe", channel, @parameters)', () => {
      let parameters = [() => {}]
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.unsubscribe(...parameters);
      assert.strictEqual(results[0], 'unsubscribe');
      assert.strictEqual(results[1], bus.root);
      assert.includeMembers(results[2], parameters);
    });
  });

  describe('#unsubscribe()', () => {
    it('is fluent', () => {
      let bus = aerobus()
        , subscriber = () => {};
      assert.strictEqual(bus.unsubscribe(subscriber), bus);
    });

    it('clears .subscribers of all channels', () => {
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

  describe('#unsubscribe(@function)', () => {
    it('removes @function from .subscribers of all channels', () => {
      let bus = aerobus(), channel1 = bus('test1'), channel2 = bus('test2')
        , subscriber = () => {};
      channel1.subscribe(subscriber);
      channel2.subscribe(subscriber);
      bus.unsubscribe(subscriber);
      assert.notInclude(channel1.subscribers, subscriber);
      assert.notInclude(channel2.subscribers, subscriber);
    });
  });

  describe('#unsubscribe(...@functions)', () => {
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

describe('Aerobus.Channel', () => {
  describe('#clear()', () => {
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

  describe('#enable()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.enable(), bus.root);
    });

    it('enables channel', () => {
      assert.isTrue(aerobus().root.disable().enable().isEnabled);
    });
  });

  describe('#enable(false)', () => {
    it('disables channel', () => {
      assert.isFalse(aerobus().root.enable(false).isEnabled);
    });

    it('supresses publication to this channel', () => {
      let result = false;
      aerobus().root.subscribe(() => result = true).disable().publish();
      assert.isFalse(result);
    });

    it('supresses publication to descendant channel', () => {
      let channel = aerobus()('parent.child')
        , result = false;
      channel.subscribe(() => result = true).parent.disable();
      channel.publish();
      assert.isFalse(result);
    });
  });

  describe('#enable(true)', () => {
    it('enables channel', () => {
      assert.isTrue(aerobus().root.disable().enable(true).isEnabled);
    });

    it('resumes publication to this channel', () => {
      let result = false;
      aerobus().root.subscribe(() => result = true).enable(false).enable(true).publish();
      assert.isTrue(result);
    });

    it('resumes publication to descendant channel', () => {
      let channel = aerobus()('parent.child')
        , result = false;
      channel.subscribe(() => result = true).parent.enable(false).enable(true);
      channel.publish();
      assert.isTrue(result);
    });
  });

  describe('#isEnabled', () => {
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

  describe('#[Symbol.iterator]', () => {
    it('is function', () => {
      assert.isFunction(aerobus().root[Symbol.iterator]);
    });
  });

  describe('#[Symbol.iterator] ()', () => {
    it('is instance of Aerobus.Iterator', () => {
      assert.typeOf(aerobus().root[Symbol.iterator](), 'Aerobus.Iterator');
    });
  });

  describe('#name', () => {
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

  describe('#parent', () => {
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

  describe('#publish()', () => {
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

  describe('#publish(@object)', () => {
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

  describe('#publish(@object, @function)', () => {
    it('invokes @function with array containing results returned from all own and ancestor subscribers', () => {
      let channel = aerobus()('parent.child'), result0 = {}, result1 = {}, result2 = {}, results
        , callback = data => results = data;
      channel.parent.parent.subscribe(() => result0);
      channel.parent.subscribe(() => result1);
      channel.subscribe(() => result2).publish({}, callback);
      assert.include(results, result0);
      assert.include(results, result1);
      assert.include(results, result2);
    });
  });

  describe('#reset()', () => {
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

  describe('#retain()', () => {
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

  describe('#retain(false)', () => {
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

  describe('#retain(true)', () => {
    it('sets .retentions.limit to Number.MAX_SAFE_INTEGER', () => {
      let channel = aerobus().root;
      channel.retain(true);
      assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
    });
  });

  describe('#retain(@number)', () => {
    it('sets .retentions.limit to @number', () => {
      let limit = 42, channel = aerobus().root;
      channel.retain(limit);
      assert.strictEqual(channel.retentions.limit, limit);
    });
  });

  describe('#retentions', () => {
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

  describe('#retentions.limit', () => {
    it('is number', () => {
      assert.isNumber(aerobus().root.retentions.limit);
    });
  });

  describe('#subscribe()', () => {
    it('throws', () => {
      assert.throw(() => aerobus().root.subscribe());
    });
  });

  describe('#subscribe(@function)', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.subscribe(() => {}), channel);
    });

    it('adds @function to #subscribers', () => {
      let channel = aerobus().root
        , subscriber = () => {};
      channel.subscribe(subscriber);
      assert.include(channel.subscribers, subscriber);
    });
  });

  describe('#subscribe(...@functions)', () => {
    it('adds all @functions to #subscribers', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(subscriber0, subscriber1);
      assert.include(channel.subscribers, subscriber0);
      assert.include(channel.subscribers, subscriber1);
    });
  });

  describe('#subscribe(@number, @function)', () => {
    it('adds @function to #subscribers ordering by @number', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
      assert.strictEqual(channel.subscribers[0], subscriber1);
      assert.strictEqual(channel.subscribers[1], subscriber0);
    });
  });

  describe('#subscribe(@number, ...@functions)', () => {
    it('adds all @functions to #subscribers ordering by @number', () => {
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

  describe('#subscribers', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.subscribers);
    });

    it('is empty array by default', () => {
      assert.strictEqual(aerobus().root.subscribers.length, 0);
    });
  });

  describe('#toggle()', () => {
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

  describe('#unsubscribe()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.unsubscribe(), channel);
    });
  });

  describe('#unsubscribe(@function)', () => {
    it('removes @function from #subscribers', () => {
      let channel = aerobus().root
        , subscriber = () => {};
      channel.subscribe(subscriber).unsubscribe(subscriber);
      assert.notInclude(channel.subscribers, subscriber);
      assert.notInclude(channel.subscribers, subscriber);
    });
  });

  describe('#unsubscribe(...@functions)', () => {
    it('removes all @functions from #subscribers', () => {
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

  describe('#unsubscribe(@string)', () => {
    it('removes all subscriptions name as @string from #subscribers', () => {
      let channel = aerobus().root
        , name = 'test'
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(name, subscriber0).subscribe(subscriber1).unsubscribe(name);
      assert.notInclude(channel.subscribers, subscriber0);
      assert.include(channel.subscribers, subscriber1);
    });
  });
});

describe('Aerobus.Iterator', () => {
  describe('#done()', () => {
    it('rejects pending promise returned from iterator', done => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.next().value.then(() => {}, done);
      iterator.done();
    });
  });

  describe('#next()', () => {
    it('returns object', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      assert.isObject(iterator.next());
    });
  });

  describe('#next().done', () => {
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

  describe('#next().value', () => {
    it('is Promise', () => {
      assert.typeOf(aerobus().root[Symbol.iterator]().next().value, 'Promise');
    });

    it('is pending promise initially', done => {
      let pending = {}
        , result
        , iterator = aerobus().root[Symbol.iterator]();
      Promise
        .race([iterator.next().value, Promise.resolve(pending)])
        .then(resolved => result = resolved);
      setImmediate(() => {
        assert.strictEqual(result, pending);
        done();
      });
    });

    it('resolves with message containing data published preliminarily', done => {
      let data = {}
        , result
        , channel = aerobus().root
        , iterator = channel[Symbol.iterator]();
      channel.publish(data);
      iterator.next().value.then(resolved => result = resolved);
      setImmediate(() => {
        assert.typeOf(result, 'Aerobus.Message');
        assert.strictEqual(result.data, data);
        done();
      });
    });

    it('resolves with message containing data published subsequently', done => {
      let data = {}
        , result
        , channel = aerobus().root
        , iterator = channel[Symbol.iterator]();
      iterator.next().value.then(message => result = message);
      setImmediate(() => {
        assert.isUndefined(result);
        channel.publish(data);
      });
      setTimeout(() => {
        assert.typeOf(result, 'Aerobus.Message');
        assert.strictEqual(result.data, data);
        done();
      }, 10);
    });
  });
});

describe('Aerobus.Message', () => {
  describe('#destination', () => {
    it('gets channel name this message was delivered to', () => {
      let bus = aerobus(), channel = bus('test'), result
        , subscriber = (_, message) => result = message.destination;
      channel.subscribe(subscriber).publish();
      assert.strictEqual(result, channel.name);
    });
  });

  describe('#route', () => {
    it('gets array of channel names this message traversed', () => {
      let bus = aerobus(), root = bus.root, parent = bus('parent'), child = bus('parent.child'), results = []
        , subscriber = (_, message) => results = message.route;
      bus.root.subscribe(subscriber);
      child.publish();
      assert.include(results, root.name);
      assert.include(results, parent.name);
      assert.include(results, child.name);
    });
  });

  describe('#data', () => {
    it('gets published data', () => {
      let publication = {}, result
        , subscriber = (_, message) => result = message.data;
      aerobus().root.subscribe(subscriber).publish(publication);
      assert.strictEqual(result, publication);
    });
  });
});

describe('Aerobus.Section', () => {
  describe('#channels', () => {
    it('is array', () => {
      assert.isArray(aerobus()('test1', 'test2').channels);
    });

    it('contains all united channels', () => {
      let bus = aerobus()
        , channel0 = bus('test0')
        , channel1 = bus('test1')
        , section = bus('test0', 'test1');
      assert.include(section.channels, channel0);
      assert.include(section.channels, channel1);
    });
  });

  describe('#clear()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.clear(), section);
    });

    it('clears .subscribers of all united channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section.channels.forEach(channel => channel.subscribe(subscriber));
      section.clear();
      section.channels.forEach(channel => assert.strictEqual(channel.subscribers.length, 0));
    });
  });

  describe('#disable()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.disable(), section);
    });

    it('disables all united channels', () => {
      let section = aerobus()('test1', 'test2');
      section.disable();
      section.channels.forEach(channel => assert.isFalse(channel.isEnabled));
    });
  });

  describe('#enable()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.enable(), section);
    });

    it('enables all united channels', () => {
      let section = aerobus()('test1', 'test2');
      section.disable().enable();
      section.channels.forEach(channel => assert.isTrue(channel.isEnabled));
    });
  });

  describe('#publish()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.publish(), section);
    });
  });

  describe('#publish(@object)', () => {
    it('publishes @object to all united channels in order of declaration', () => {
      let section = aerobus()('test1', 'test2'), publication = {}, results = []
        , subscriber = (_, message) => results.push(message.destination);
      section
        .subscribe(subscriber)
        .publish(publication);
      assert.strictEqual(results[0], section.channels[0].name);
      assert.strictEqual(results[1], section.channels[1].name);
    });
  });

  describe('#subscribe()', () => {
    it('throws', () => {
      assert.throw(() => aerobus()('test1', 'test2').subscribe());
    });
  });

  describe('#subscribe(@function)', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.subscribe(() => {}), section);
    });

    it('subscribes @function to all united channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section.subscribe(subscriber);
      section.channels.forEach(channel => assert.include(channel.subscribers, subscriber));
    });
  });

  describe('#subscribe(@function0, @function1)', () => {
    it('subscribes @function to all united channels', () => {
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

  describe('#toggle()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.toggle(), section);
    });

    it('disables all united channels that enabled', () => {
      let section = aerobus()('test1', 'test2');
      section.toggle();
      section.channels.forEach(channel => assert.isFalse(channel.isEnabled));
    });

    it('enables all united channels that disabled', () => {
      let section = aerobus()('test1', 'test2');
      section.disable().toggle();
      section.channels.forEach(channel => assert.isTrue(channel.isEnabled));
    });
  });

  describe('#unsubscribe()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.unsubscribe(), section);
    });
  });

  describe('#unsubscribe(@function)', () => {
    it('unsubscribes @function from all united channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section
        .subscribe(subscriber)
        .unsubscribe(subscriber);
      section.channels.forEach(channel => assert.notInclude(channel.subscribers, subscriber));
    });
  });
});