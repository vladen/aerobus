'use strict';

import {assert as assertAlias} from 'chai';
const assert = assertAlias; // for better readability of transpiled code

import aerobusAlias from './aerobus';
const aerobus = aerobusAlias; // for better readability of transpiled code

/*
--------------------------------------------------------------------------------
aerobus
--------------------------------------------------------------------------------
*/

describe('aerobus', () => {
  it('is function', () => {
    assert.isFunction(aerobus);
  });
});

describe('aerobus()', () => {
  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus(), 'Aerobus');
  });

  describe('#bubbles', () => {
    it('is true', () => {
      assert.isTrue(aerobus().bubbles);
    });
  });

  describe('#delimiter', () => {
    it('is "."', () => {
      assert.strictEqual(aerobus().delimiter, '.');
    });
  });
});

describe('aerobus(@boolean)', () => {
  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus(false), 'Aerobus');
  });

  describe('@boolean', () => {
    it('Aerobus.#bubbles gets @boolean', () => {
      let bubbles = false
        , bus = aerobus(bubbles);
      assert.strictEqual(bus.bubbles, bubbles);
    });
  });
});

describe('aerobus(@function)', () => {
  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus(() => {}), 'Aerobus');
  });

  describe('@function', () => {
    it('Aerobus.#error gets @function', () => {
      let error = () => {};
      assert.strictEqual(aerobus(error).error, error);
    });
  });
});

describe('aerobus(@object)', () => {
  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus({}), 'Aerobus');
  });

  it('Aerobus.#bubbles gets @object.bubbles', () => {
    let bubbles = false
      , bus = aerobus({ bubbles });
    assert.strictEqual(bus.bubbles, bubbles);
  });

  it('throws @object.delimiter is empty string or not a string', () => {
    [ '', [], true, new Date, () => {}, 1, {} ].forEach(value =>
      assert.throw(() => aerobus({ delimiter: value })));
  });

  it('Aerobus.#delimiter gets @object.delimiter', () => {
    let delimiter = ':'
      , bus = aerobus({ delimiter });
    assert.strictEqual(bus.delimiter, delimiter);
  });

  it('throws if @object.error is not a function', () => {
    [ '', [], true, new Date, 1, {} ].forEach(value =>
      assert.throw(() => aerobus({ error: value })));
  });

  it('Aerobus.#error gets @object.error', () => {
    let error = () => {}
      , bus = aerobus({ error });
    assert.strictEqual(bus.error, error);
  });

  it('throws if @object.trace is not a function', () => {
    [ '', [], true, new Date, 1, {} ].forEach(value =>
      assert.throw(() => aerobus({ trace: value })));
  });

  it('Aerobus.#trace gets @object.trace', () => {
    let trace = () => {}
      , bus = aerobus({ trace });
    assert.strictEqual(bus.trace, trace);
  });

  describe('@object.channel', () => {
    it('extends Aerobus#Channel instances', () => {
      let extension = () => {}
        , bus = aerobus({ channel: { extension } });
      assert.strictEqual(bus.root.extension, extension)
      assert.strictEqual(bus('custom').extension, extension)
    });

    it('preserves standard members', () => {
      let extensions = {
            bubble: null
          , bubbles: null
          , clear: null
          , enable: null
          , enabled: null
          , publish: null
          , reset: null
          , retain: null
          , retentions: null
          , subscribe: null
          , subscribers: null
          , toggle: null
          , unsubscribe: null
          }
        , bus = aerobus({ channel: extensions });
      Object.keys(extensions).forEach(key => assert.isNotNull(bus.root[key]));
    });
  });

  describe('@object.message', () => {
    it('extends Aerobus#Message instances', () => {
      let extension = () => {}
        , bus = aerobus({ message: { extension } })
        , result
        , subscriber = (_, message) => result = message.extension;
      bus.root.subscribe(subscriber).publish();
      assert.strictEqual(result, extension);
    });

    it('preserves standard members', () => {
      let extensions = {
            cancel: null
          , destination: null
          , data: null
          , route: null
          }
        , bus = aerobus({ message: extensions })
        , result
        , subscriber = (_, message) => result = message;
      bus.root.subscribe(subscriber).publish({});
      Object.keys(extensions).forEach(key => assert.isNotNull(result[key]));
    });
  });

  describe('@object.section', () => {
    it('extends Aerobus#Section instances', () => {
      let extension = () => {}
        , bus = aerobus({ section: { extension } });
      assert.strictEqual(bus('', 'test').extension, extension);
      assert.strictEqual(bus('', 'test0', 'test1').extension, extension);
    });

    it('preserves standard members', () => {
      let extensions = {
            bubble: null
          , channels: null
          , clear: null
          , enable: null
          , publish: null
          , reset: null
          , retain: null
          , subscribe: null
          , toggle: null
          , unsubscribe: null
          }
        , bus = aerobus({ channel: extensions });
      Object.keys(extensions).forEach(key => assert.isNotNull(bus('', 'test')[key]));
    });
  });
});

describe('aerobus(@string)', () => {
  it('throws if @string is empty', () => {
    assert.throw(() => aerobus(''));
  });

  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus(':'), 'Aerobus');
  });

  it('Aerobus.#delimiter gets @string', () => {
    let delimiter = ':';
    assert.strictEqual(aerobus(delimiter).delimiter, delimiter);
  });
});

describe('aerobus(@boolean, @function, @string)', () => {
  it('returns instance of Aerobus', () => {
    assert.typeOf(aerobus(false, () => {}, ':'), 'Aerobus');
  });

  it('Aerobus.#bubbles gets @boolean', () => {
    let bubbles = false;
    assert.strictEqual(aerobus(bubbles, () => {}, ':').bubbles, bubbles);
  });

  it('Aerobus.#error gets @function', () => {
    let error = () => {};
    assert.strictEqual(aerobus(false, error, ':').error, error);
  });

  it('Aerobus.#delimiter gets @string', () => {
    let delimiter = ':';
    assert.strictEqual(aerobus(false, () => {}, delimiter).delimiter, delimiter);
  });
});

describe('aerobus(!(@boolean | @function | @object | @string))', () => {
  it('throws', () => {
    [
      [], new Date, 42
    ].forEach(value => assert.throw(() => aerobus(value)));
  });
});

/*
--------------------------------------------------------------------------------
Aerobus
--------------------------------------------------------------------------------
*/

describe('Aerobus', () => {
  describe('is function', () => {
    assert.instanceOf(aerobus(), Function);
  });

  describe('#()', () => {
    it('returns instance of Channel', () => {
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
    it('returns instance of Channel', () => {
      let bus = aerobus();
      assert.typeOf(bus(''), 'Aerobus.Channel');
    });

    it('returns #root channel', () => {
      let bus = aerobus()
        , channel = bus('');
      assert.strictEqual(channel, bus.root);
    });
  });

  describe('#(@string)', () => {
    it('returns instance of Channel', () => {
      let bus = aerobus();
      assert.typeOf(bus('test'), 'Aerobus.Channel');
    });

    it('Channel.#name gets @string', () => {
      let bus = aerobus(), name = 'test';
      assert.strictEqual(bus(name).name, name);
    });
  });

  describe('#(...@strings)', () => {
    it('returns instance of Section', () => {
      assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
    });

    it('Section.#channels include all specified channels', () => {
      let names = ['test1', 'test2']
        , section = aerobus()(...names);
      assert.strictEqual(section.channels[0].name, names[0]);
      assert.strictEqual(section.channels[1].name, names[1]);
    });
  });

  describe('#(!@string)', () => {
    it('throws', () => {
      [
        [], true, new Date, 42, {}
      ].forEach(value => assert.throw(() => aerobus()(value)));
    });
  });

  describe('#bubble()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.bubble(), bus);
    });

    it('sets #bubbles', () => {
      let bus = aerobus(false);
      bus.bubble();
      assert.isTrue(bus.bubbles);
    });
  });

  describe('#bubble(false)', () => {
    it('clears #bubbles', () => {
      let bus = aerobus();
      bus.bubble(false);
      assert.isFalse(bus.bubbles);
    });
  });

  describe('#bubbles', () => {
    it('is boolean', () => {
      assert.isBoolean(aerobus().bubbles);
    });
  });

  describe('#channels', () => {
    it('is array', () => {
      assert.isArray(aerobus().channels);
    });

    it('is initially empty', () => {
      assert.strictEqual(aerobus().channels.length, 0);
    });

    it('contains root channel after it has been resolved', () => {
      let bus = aerobus(), channel = bus.root;
      assert.include(bus.channels, channel);
    });

    it('contains custom channel after it has been resolved', () => {
      let bus = aerobus(), channel = bus('test');
      assert.include(bus.channels, channel);
    });

    it('contains several channels after they have been resolved', () => {
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

    it('new instance of Channel is resolved for same name hereafter', () => {
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
    it('returns new Aerobus instance', () => {
      assert.typeOf(aerobus().create(), 'Aerobus');
    });

    it('new Aerobus inherits #bubbles', () => {
      let bubbles = false;
      assert.strictEqual(aerobus(bubbles).create().bubbles, bubbles);
    });

    it('new Aerobus inherits #delimiter', () => {
      let delimiter = ':';
      assert.strictEqual(aerobus(delimiter).create().delimiter, delimiter);
    });

    it('new Aerobus inherits #error', () => {
      let error = () => {};
      assert.strictEqual(aerobus(error).create().error, error);
    });

    it('new Aerobus inherits #trace', () => {
      let trace = () => {};
      assert.strictEqual(aerobus({ trace }).create().trace, trace);
    });

    it('new Aerobus inherits Channel class extensions', () => {
      let extension = () => {};
      assert.strictEqual(aerobus({ channel : { extension } }).create().root.extension, extension);
    });

    it('new Aerobus inherits Message class extensions', () => {
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

    it('new Aerobus inherits Section class extensions', () => {
      let extension = () => {};
      assert.strictEqual(aerobus({ section : { extension } }).create()('test0', 'test1').extension, extension);
    });
  });

  describe('#delimiter', () => {
    it('is string', () => {
      assert.isString(aerobus().delimiter);
    });

    it('is read-only', () => {
      assert.throw(() => aerobus().delimiter = null);
    });
  });

  describe('#error', () => {
    it('is a function', () => {
      assert.isFunction(aerobus().error);
    });

    it('is read-only', () => {
      assert.throw(() => aerobus().error = null);
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
    it('is instance of Channel', () => {
      assert.typeOf(aerobus().root, 'Aerobus.Channel');
    });

    it('is read-only', () => {
      assert.throw(() => aerobus().root = null);
    });
  });

  describe('#trace', () => {
    it('is function', () => {
      let bus = aerobus();
      assert.isFunction(bus.trace);
    });

    it('is read-write', () => {
      let trace = () => {}
        , bus = aerobus();
      bus.trace = trace;
      assert.strictEqual(bus.trace, trace);
    });

    it('is called from channel.bubble() with arguments ("bubble", channel, true)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.bubble(true);
      assert.strictEqual(results[0], 'bubble');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], true);
    });

    it('is called from channel.bubble(false) with arguments ("bubble", channel, false)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.bubble(false);
      assert.strictEqual(results[0], 'bubble');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], false);
    });

    it('is called from channel.clear() with arguments ("clear", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.clear();
      assert.strictEqual(results[0], 'clear');
      assert.strictEqual(results[1], bus.root);
    });

    it('is called from channel.enable() with arguments ("enable", channel, true)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.enable();
      assert.strictEqual(results[0], 'enable');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], true);
    });

    it('is called from channel.enable(false) with arguments ("enable", channel, false)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.enable(false);
      assert.strictEqual(results[0], 'enable');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], false);
    });

    it('is called from channel.forward(@string) with arguments ("forward", channel, array) where array contains @string', () => {
      let results = []
        , forwarder = 'test'
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.forward(forwarder);
      assert.strictEqual(results[0], 'forward');
      assert.strictEqual(results[1], bus.root);
      assert.include(results[2], forwarder);
    });

    it('is called from channel.publish(@data) with arguments ("publish", channel, message) where message.data is @data', () => {
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

    it('is called from channel.reset() with arguments ("reset", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.reset();
      assert.strictEqual(results[0], 'reset');
      assert.strictEqual(results[1], bus.root);
    });

    it('is called from channel.retain(@limit) with arguments ("retain", channel, @limit)', () => {
      let limit = 42
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.retain(limit);
      assert.strictEqual(results[0], 'retain');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], limit);
    });

    it('is called from channel.subscribe(@function) with arguments ("subscribe", channel, array) where array contains Subscriber wrapping @function', () => {
      let subscriber = () => {}
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.subscribe(subscriber);
      assert.strictEqual(results[0], 'subscribe');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2][0].next, subscriber);
    });

    it('is called from channel.toggle() with arguments ("toggle", channel)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.toggle();
      assert.strictEqual(results[0], 'toggle');
      assert.strictEqual(results[1], bus.root);
    });

    it('is called from channel.unsubscribe(@parameters) with arguments ("unsubscribe", channel, @parameters)', () => {
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

    it('clears #subscribers of all channels', () => {
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
    it('removes @function from #subscribers of all channels', () => {
      let bus = aerobus()
        , channel1 = bus('test1')
        , channel2 = bus('test2')
        , subscriber = () => {};
      channel1.subscribe(subscriber);
      channel2.subscribe(subscriber);
      bus.unsubscribe(subscriber);
      assert.notInclude(channel1.subscribers.map(existing => existing.next), subscriber);
      assert.notInclude(channel2.subscribers.map(existing => existing.next), subscriber);
    });
  });

  describe('#unsubscribe(...@functions)', () => {
    it('removes @functions from #subscribers of all channels', () => {
      let bus = aerobus()
        , channel1 = bus('test1')
        , channel2 = bus('test2')
        , subscriber1 = () => {}
        , subscriber2 = () => {};
      channel1.subscribe(subscriber1, subscriber2);
      channel2.subscribe(subscriber1, subscriber2);
      bus.unsubscribe(subscriber1, subscriber2)
      assert.notInclude(channel1.subscribers.map(existing => existing.next), subscriber1);
      assert.notInclude(channel1.subscribers.map(existing => existing.next), subscriber2);
      assert.notInclude(channel2.subscribers.map(existing => existing.next), subscriber1);
      assert.notInclude(channel2.subscribers.map(existing => existing.next), subscriber2);
    });
  });
});

/*
--------------------------------------------------------------------------------
Aerobus.Channel
--------------------------------------------------------------------------------
*/

describe('Aerobus.Channel', () => {
  describe('#bubble()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.bubble(), channel);
    });

    it('sets #bubbles', () => {
      let channel = aerobus(false).root;
      channel.bubble();
      assert.isTrue(channel.bubbles);
    });
  });

  describe('#bubble(false)', () => {
    it('clears #bubbles', () => {
      let channel = aerobus().root;
      channel.bubble(false);
      assert.isFalse(channel.bubbles);
    });
  });

  describe('#bubbles', () => {
    it('is boolean', () => {
      assert.isTrue(aerobus().root.bubbles);
    });

    it('is inherited from parent bus', () => {
      assert.isTrue(aerobus(true).root.bubbles);
      assert.isFalse(aerobus(false).root.bubbles);
    });
  });

  describe('#clear()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.clear(), channel);
    });

    it('clears #retentions', () => {
      let channel = aerobus().root;
      channel.retain().publish().clear();
      assert.strictEqual(channel.retentions.length, 0);
    });

    it('clears #subscribers', () => {
      let channel = aerobus().root;
      channel.subscribe(() => {}).clear();
      assert.strictEqual(channel.subscribers.length, 0);
    });

    it('rejects pending promise returned from iterator', done => {
      let channel = aerobus().root;
      channel[Symbol.iterator]().next().value.then(() => {}, done);
      channel.reset();
    });
  });

  describe('#enable()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.enable(), bus.root);
    });

    it('sets #enabled', () => {
      assert.isTrue(aerobus().root.enable(false).enable().enabled);
    });
  });

  describe('#enable(false)', () => {
    it('clears #enabled', () => {
      assert.isFalse(aerobus().root.enable(false).enabled);
    });

    it('supresses publication to this channel', () => {
      let result = false;
      aerobus().root.subscribe(() => result = true).enable(false).publish();
      assert.isFalse(result);
    });

    it('supresses publication to descendant channel', () => {
      let channel = aerobus()('parent.child')
        , result = false;
      channel.subscribe(() => result = true).parent.enable(false);
      channel.publish();
      assert.isFalse(result);
    });
  });

  describe('#enable(true)', () => {
    it('sets #enabled', () => {
      assert.isTrue(aerobus().root.enable(false).enable(true).enabled);
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

  describe('#enabled', () => {
    it('is boolean', () => {
      assert.isBoolean(aerobus().root.enabled);
    });

    it('is initially true', () => {
      assert.isTrue(aerobus().root.enabled);
    });
  });

  describe('#forward()', () => {
    it('throws', () => {
      assert.throw(() => aerobus().root.forward());
    });
  });

  describe('#forward(@function)', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.forward(() => {}), bus.root);
    });

    it('adds @function to #forwarders', () => {
      let bus = aerobus()
        , forwarder = () => {};
      bus.root.forward(forwarder);
      assert.include(bus.root.forwarders, forwarder);
    });

    it('forwards publications to channel defined by @function', () => {
      let bus = aerobus()
        , result0, result1;
      bus('0').subscribe(data => result0 = data);
      bus('1').subscribe(data => result1 = data);
      bus('test').forward(data => '' + data).publish(0).publish(1);
      assert.strictEqual(result0, 0);
      assert.strictEqual(result1, 1);
    });

    it('forwards publications to multuple channels defined by @function', () => {
      let bus = aerobus()
        , result0, result1, result2;
      bus('0').subscribe(data => result0 = data);
      bus('1').subscribe(data => result1 = data);
      bus('test').subscribe(data => result2 = data).forward(data => ['0', '1', 'test']).publish(true);
      assert.isTrue(result0);
      assert.isTrue(result1);
      assert.isTrue(result2);
    });

    it('does not forward publication when @function returns null', () => {
      let bus = aerobus()
        , result;
      bus('test').subscribe(data => result = data).forward(() => null).publish(true);
      assert.isTrue(result);
    });

    it('does not forward publication when @function returns undefined', () => {
      let bus = aerobus()
        , result;
      bus('test').subscribe(data => result = data).forward(() => {}).publish(true);
      assert.isTrue(result);
    });

    it('does not forward publication when @function returns #name of this channel', () => {
      let bus = aerobus()
        , result;
      bus('test').subscribe(data => result = data).forward(() => 'test').publish(true);
      assert.isTrue(result);
    });

    it('stops forwarding publication when infinite forwarding loop is detected', () => {
      let bus = aerobus()
        , notifications = 0;
      bus('test0').forward(() => 'test1');
      bus('test1').forward(() => 'test0').subscribe(() => notifications++).publish(true);
      assert.strictEqual(notifications, 1);
    });
  });

  describe('#forward(@string)', () => {
    it('adds @string to #forwarders', () => {
      let bus = aerobus()
        , forwarder = 'test';
      bus.root.forward(forwarder);
      assert.include(bus.root.forwarders, forwarder);
    });

    it('forwards publications to channel specified by @string', () => {
      let bus = aerobus()
        , result;
      bus('sink').subscribe(data => result = data);
      bus('test').forward('sink').publish(true);
      assert.isTrue(result);
    });
  });

  describe('#forward(@function, @string)', () => {
    it('adds @function and @string to #forwarders', () => {
      let bus = aerobus()
        , forwarders = [() => {}, 'test'];
      bus.root.forward(...forwarders);
      assert.includeMembers(bus.root.forwarders, forwarders);
    });
  });

  describe('#forward(!(@function || @string))', () => {
    it('throws', () => {
      [new Array, true, new Date, 1, {}].forEach(value => 
        assert.throw(() => aerobus().root.forward(value)));
    });
  });

  describe('#forwarders', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.forwarders);
    });

    it('is initially empty', () => {
      assert.strictEqual(aerobus().root.forwarders.length, 0);
    });

    it('is clone of internal collection', () => {
      let channel = aerobus().root
        , forwarder = 'test';
      channel.forward(forwarder);
      channel.forwarders.length = 0;
      assert.strictEqual(channel.forwarders.length, 1);
      channel.forwarders[0] = null;
      assert.strictEqual(channel.forwarders[0], forwarder);
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
    it('is instance of Channel for custom channel', () => {
      assert.typeOf(aerobus()('test').parent, 'Aerobus.Channel');
    });

    it('is root channel for channel of first level', () => {
      let bus = aerobus()
        , channel = bus('test');
      assert.strictEqual(channel.parent, bus.root);
    });

    it('is parent channel for second level channel', () => {
      let bus = aerobus()
        , parent = bus('parent')
        , child = bus('parent.child');
      assert.strictEqual(child.parent, parent);
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
      let results = []
        , subscriber0 = () => results.push('first')
        , subscriber1 = () => results.push('second');
      aerobus().root.subscribe(subscriber0, subscriber1).publish();
      assert.strictEqual(results[0], 'first');
      assert.strictEqual(results[1], 'second');
    });

    it('notifies ancestor subscribers before own if #bubbles is set', () => {
      let channel = aerobus()('parent.child').bubble(true)
        , results = []
        , ancestor = () => results.push('ancestor')
        , parent = () => results.push('parent')
        , self = () => results.push('self');
      channel.parent.parent.subscribe(ancestor);
      channel.parent.subscribe(parent);
      channel.subscribe(self);
      channel.publish();
      assert.strictEqual(results.length, 3);
      assert.strictEqual(results[0], 'ancestor');
      assert.strictEqual(results[1], 'parent');
      assert.strictEqual(results[2], 'self');
    });

    it('does not notify ancestor subscribers if #bubbles is not set', () => {
      let channel = aerobus()('parent.child').bubble(false)
        , results = []
        , ancestor = () => results.push('ancestor')
        , parent = () => results.push('parent')
        , self = () => results.push('self');
      channel.parent.parent.subscribe(ancestor);
      channel.parent.subscribe(parent);
      channel.subscribe(self);
      channel.publish();
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0], 'self');
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
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.reset(), channel);
    });

    it('sets #enabled', () => {
      let channel = aerobus().root;
      channel.enable(false).reset();
      assert.isTrue(channel.enabled);
    });

    it('clears #forwarders', () => {
      let channel = aerobus().root;
      channel.forward('test').reset();
      assert.strictEqual(channel.forwarders.length, 0);
    });

    it('clears #retentions', () => {
      let channel = aerobus().root;
      channel.retain().publish().reset();
      assert.strictEqual(channel.retentions.length, 0);
    });

    it('resets #retentions.limit to 0', () => {
      let channel = aerobus().root;
      channel.retain().publish().reset();
      assert.strictEqual(channel.retentions.limit, 0);
    });

    it('clears #subscribers', () => {
      let channel = aerobus().root;
      channel.subscribe(() => {}).reset();
      assert.strictEqual(channel.subscribers.length, 0);
    });

    it('rejects pending promise returned from iterator', done => {
      let channel = aerobus().root;
      channel[Symbol.iterator]().next().value.then(() => {}, done);
      channel.reset();
    });
  });

  describe('#retain()', () => {
    it('is fluent', () => {
      let bus = aerobus();
      assert.strictEqual(bus.root.retain(), bus.root);
    });

    it('sets #retentions.limit property to Number.MAX_SAFE_INTEGER', () => {
      let channel = aerobus().root;
      channel.retain();
      assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
    });

    it('notifies all subsequent subscribtions with all retained publications immediately in order of publication', () => {
      let channel = aerobus().root
        , publication0 = {}
        , publication1 = {}
        , results = []
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
    it('sets #retentions.limit to 0', () => {
      let channel = aerobus().root;
      channel.retain(false);
      assert.strictEqual(channel.retentions.limit, 0);
    });

    it('clears #retentions', () => {
      let channel = aerobus().root
        , data0 = {}
        , data1 = {};
      channel
        .retain()
        .publish(data0)
        .publish(data1)
        .retain(false);
      assert.strictEqual(channel.retentions.length, 0);
    });
  });

  describe('#retain(true)', () => {
    it('sets #retentions.limit to Number.MAX_SAFE_INTEGER', () => {
      let channel = aerobus().root;
      channel.retain(true);
      assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
    });
  });

  describe('#retain(@number)', () => {
    it('sets #retentions.limit to @number', () => {
      let limit = 42
        , channel = aerobus().root;
      channel.retain(limit);
      assert.strictEqual(channel.retentions.limit, limit);
    });
  });

  describe('#retentions', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.retentions);
    });

    it('contains one latest publication when limited to 1', () => {
      let channel = aerobus().root
        , data0 = {}
        , data1 = {};
      channel
        .retain(1)
        .publish(data0)
        .publish(data1);
      assert.strictEqual(channel.retentions.length, 1);
      assert.strictEqual(channel.retentions[0].data, data1);
    });

    it('contains two latest publications when limited to 2', () => {
      let channel = aerobus().root
        , data0 = {}
        , data1 = {}
        , data2 = {};
      channel
        .retain(2)
        .publish(data0)
        .publish(data1)
        .publish(data2);
      assert.strictEqual(channel.retentions.length, 2);
      assert.strictEqual(channel.retentions[0].data, data1);
      assert.strictEqual(channel.retentions[1].data, data2);
    });

    it('is clone of internal collection', () => {
      let channel = aerobus().root
        , data = {};
      channel
        .retain(1)
        .publish(data);
      channel.retentions.length = 0;
      assert.strictEqual(channel.retentions.length, 1);
      channel.retentions[0] = null;
      assert.strictEqual(channel.retentions[0].data, data);
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

    it('adds new subscriber to #subscribers, subscriber.next gets @function', () => {
      let channel = aerobus().root
        , subscriber = () => {};
      channel.subscribe(subscriber);
      assert.strictEqual(channel.subscribers[0].next, subscriber);
    });

    it('does not deliver current publication to @function subscribed by subscriber being notified', () => {
      let channel = aerobus().root
        , result = true
        , subscriber1 = () => result = false
        , subscriber0 = () => channel.subscribe(subscriber1);
      channel.subscribe(subscriber0).publish();
      assert.isTrue(result);
    });
  });

  describe('#subscribe(...@functions)', () => {
    it('adds new subscribers to #subscribers, each Subscriber#next returns next element of @functions', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(subscriber0, subscriber1);
      assert.strictEqual(channel.subscribers[0].next, subscriber0);
      assert.strictEqual(channel.subscribers[1].next, subscriber1);
    });
  });

  describe('#subscribe(@number, @function)', () => {
    it('adds new subscriber to #subscribers, Subscriber#order returns @number', () => {
      let channel = aerobus().root
        , order = -1;
      channel.subscribe(order, () => {});
      assert.strictEqual(channel.subscribers[0].order, order);
    });

    it('adds new subscriber to #subscribers, logical position of Subscriber matches @number', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
      assert.strictEqual(channel.subscribers[0].next, subscriber1);
      assert.strictEqual(channel.subscribers[1].next, subscriber0);
    });
  });

  describe('#subscribe(@number, ...@functions)', () => {
    it('adds new subscribers to #subscribers, each Subscriber#order returns @number', () => {
      let channel = aerobus().root
        , order = 1;
      channel
        .subscribe(order, () => {}, () => {});
      assert.strictEqual(channel.subscribers[0].order, order);
      assert.strictEqual(channel.subscribers[1].order, order);
    });

    it('adds new subscribers to #subscribers, logical position of each Subscriber matches @number', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {}
        , subscriber2 = () => {};
      channel.subscribe(subscriber0).subscribe(-1, subscriber1, subscriber2);
      assert.strictEqual(channel.subscribers[0].next, subscriber1);
      assert.strictEqual(channel.subscribers[1].next, subscriber2);
      assert.strictEqual(channel.subscribers[2].next, subscriber0);
    });
  });

  describe('#subscribe(@string, @function)', () => {
    it('adds new subscriber to #subscribers, Subscriber#name returns @string', () => {
      let channel = aerobus().root
        , name = 'test';
      channel.subscribe(name, () => {});
      assert.strictEqual(channel.subscribers[0].name, name);
    });
  });

  describe('#subscribe(@object)', () => {
    it('adds new subscriber to #subscribers, Subscriber#done calls @object.done', () => {
      let channel = aerobus().root
        , called = false
        , subscriber = {
            done: () => called = true
          , next: () => {}
          };
      channel.subscribe(subscriber);
      channel.subscribers[0].done();
      assert.isTrue(called);
    });

    it('adds new subscriber to #subscribers, Subscriber#next calls @object.next', () => {
      let channel = aerobus().root
        , called = false
        , subscriber = {
            done: () => {}
          , next: () => called = true
          };
      channel.subscribe(subscriber);
      channel.subscribers[0].next();
      assert.isTrue(called);
    });

    it('adds new subscriber to #subscribers, Subscriber#name returns @object.name', () => {
      let channel = aerobus().root
        , subscriber = {
            name: 'test'
          , next: () => {}
          };
      channel.subscribe(subscriber);
      assert.strictEqual(channel.subscribers[0].name, subscriber.name);
    });

    it('adds new subscriber to #subscribers, Subscriber#order returns @object.order', () => {
      let channel = aerobus().root
        , subscriber = {
            next: () => {}
          , order: 1
          };
      channel.subscribe(subscriber);
      assert.strictEqual(channel.subscribers[0].order, subscriber.order);
    });

    it('throws if @object#done is not a function', () => {
      [new Array, true, new Date, 1, {}, 'test'].forEach(value =>
        assert.throw(() => aerobus().root.subscribe({
          done: value
        })));
    });

    it('throws if @object#name is not a string', () => {
      [new Array, true, new Date, () => {}, 1, {}].forEach(value =>
        assert.throw(() => aerobus().root.subscribe({
          name: value
        , next: () => {}
        })));
    });

    it('throws if @object does not contain #next', () => {
      assert.throw(() => aerobus().root.subscribe({}));
    });

    it('throws if @object#next is not a function', () => {
      [new Array, true, new Date, 1, {}, 'test'].forEach(value =>
        assert.throw(() => aerobus().root.subscribe({
          next: value
        })));
    });

    it('throws if @object#order is not a number', () => {
      [new Array, true, new Date, () => {}, {}, 'test'].forEach(value =>
        assert.throw(() => aerobus().root.subscribe({
          next: () => {}
        , order: value
        })));
    });
  });

  describe('#subscribers', () => {
    it('is array', () => {
      assert.isArray(aerobus().root.subscribers);
    });

    it('is initially empty', () => {
      assert.strictEqual(aerobus().root.subscribers.length, 0);
    });

    it('is clone of internal collection', () => {
      let channel = aerobus().root
        , subscriber = () => {};
      channel.subscribe(subscriber);
      channel.subscribers.length = 0;
      assert.strictEqual(channel.subscribers.length, 1);
      channel.subscribers[0] = null;
      assert.strictEqual(channel.subscribers[0].next, subscriber);
    });
  });

  describe('#toggle()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.toggle(), channel);
    });

    it('disables enabled channel', () => {
      assert.isFalse(aerobus().root.enable(true).toggle().enabled);
    });

    it('enables disabled channel', () => {
      assert.isTrue(aerobus().root.enable(false).toggle().enabled);
    });
  });

  describe('#unsubscribe()', () => {
    it('is fluent', () => {
      let channel = aerobus().root;
      assert.strictEqual(channel.unsubscribe(), channel);
    });
  });

  describe('#unsubscribe(@function)', () => {
    it('does not throw if @function is not subscribed', () => {
      assert.doesNotThrow(() => aerobus().root.unsubscribe(() => {}));
    });

    it('removes @function from #subscribers', () => {
      let channel = aerobus().root
        , subscriber = () => {};
      channel.subscribe(subscriber).unsubscribe(subscriber);
      assert.strictEqual(channel.subscribers.length, 0);
    });

    it('prevents publication delivery to next subscriber when previous unsubscribes it', () => {
      let channel = aerobus().root
        , result = false
        , subscriber0 = () => result = true
        , subscriber1 = () => channel.unsubscribe(subscriber0);
      channel.subscribe(subscriber1, subscriber0).publish();
      assert.isFalse(result);
    });

    it('does not break publication delivery when next subscriber unsubscribes previous', () => {
      let channel = aerobus().root
        , result = false
        , subscriber0 = () => {}
        , subscriber1 = () => channel.unsubscribe(subscriber0)
        , subscriber2 = () => result = true;
      channel.subscribe(subscriber0, subscriber1, subscriber2).publish();
      assert.isTrue(result);
    });
  });

  describe('#unsubscribe(...@functions)', () => {
    it('removes all @functions from #subscribers', () => {
      let channel = aerobus().root
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(subscriber0, subscriber1).unsubscribe(subscriber0, subscriber1);
      assert.strictEqual(channel.subscribers.length, 0);
    });
  });

  describe('#unsubscribe(@object)', () => {
    it('does not throw if @object is not subscribed', () => {
      assert.doesNotThrow(() => aerobus().root.unsubscribe({}));
    });

    it('removes @object from #subscribers', () => {
      let channel = aerobus().root
        , subscriber = { next: () => {} };
      channel.subscribe(subscriber).unsubscribe(subscriber);
      assert.strictEqual(channel.subscribers.length, 0);
    });

    it('calls @object.done()', () => {
      let channel = aerobus().root
        , result
        , subscriber = {
            done: () => result = true
          , next: () => {}
          };
      channel.subscribe(subscriber).unsubscribe(subscriber);
      assert.isTrue(result);
    });
  });

  describe('#unsubscribe(@string)', () => {
    it('does not throw if @name is not subscribed', () => {
      assert.doesNotThrow(() => aerobus().root.unsubscribe('test'));
    });

    it('removes all subscriptions named as @string from #subscribers', () => {
      let channel = aerobus().root
        , name = 'test'
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      channel.subscribe(name, subscriber0).subscribe(subscriber1).unsubscribe(name);
      assert.strictEqual(channel.subscribers.length, 1);
      assert.strictEqual(channel.subscribers[0].next, subscriber1);
    });
  });

  describe('#unsubscribe(@subscriber)', () => {
    it('does not throw if @subscriber is not subscribed', () => {
      let bus = aerobus()
        , channel0 = bus('test0')
        , channel1 = bus('test1');
      channel0.subscribe(() => {});
      assert.doesNotThrow(() => channel1.unsubscribe(channel0.subscribers[0]));
    });

    it('removes @subscriber from #subscribers', () => {
      let channel = aerobus().root;
      channel
        .subscribe(() => {})
        .unsubscribe(channel.subscribers[0]);
      assert.strictEqual(channel.subscribers.length, 0);
    })
  });
});

/*
--------------------------------------------------------------------------------
Aerobus.Iterator
--------------------------------------------------------------------------------
*/

describe('Aerobus.Iterator', () => {
  describe('#done()', () => {
    it('rejects pending promise', done => {
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
    it('is initially undefined', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      assert.isUndefined(iterator.next().done);
    });

    it('is true after iterator has been #done()', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.done();
      assert.isTrue(iterator.next().done);
    });
  });

  describe('#next().value', () => {
    it('is promise', () => {
      assert.typeOf(aerobus().root[Symbol.iterator]().next().value, 'Promise');
    });

    it('is initially pending', done => {
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

    it('resolves with messages published earlier', done => {
      let data0 = {}
        , data1 = {}
        , results = []
        , channel = aerobus().root
        , iterator = channel[Symbol.iterator]()
        , resolver = resolved => results.push(resolved);
      channel.publish(data0).publish(data1);
      iterator.next().value.then(resolver);
      iterator.next().value.then(resolver);
      setImmediate(() => {
        assert.strictEqual(results.length, 2);
        assert.typeOf(results[0], 'Aerobus.Message');
        assert.typeOf(results[1], 'Aerobus.Message');
        assert.strictEqual(results[0].data, data0);
        assert.strictEqual(results[1].data, data1);
        done();
      });
    });

    it('resolves with message published later', done => {
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

    it('ignores "cycle" publication strategy', done => {
      let result = 0
        , channel = aerobus().root;
      channel.cycle(1);
      channel[Symbol.iterator]().next().value.then(_ => result++);
      channel[Symbol.iterator]().next().value.then(_ => result++);
      channel.publish();
      setImmediate(() => {
        assert.strictEqual(result, 2);
        done();
      });
    });

    it('ignores "shuffle" publication strategy', done => {
      let result = 0
        , channel = aerobus().root;
      channel.shuffle(1);
      channel[Symbol.iterator]().next().value.then(_ => result++);
      channel[Symbol.iterator]().next().value.then(_ => result++);
      channel.publish();
      setImmediate(() => {
        assert.strictEqual(result, 2);
        done();
      });
    });

    it('ignores publication forwarding', done => {
      let result
        , channel = aerobus()('test0');
      channel.forward('test1');
      channel[Symbol.iterator]().next().value.then(_ => result = true);
      channel.publish();
      setImmediate(() => {
        assert.isTrue(result);
        done();
      });
    });

    it('is undefined after iterator has been #done()', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.done();
      assert.isUndefined(iterator.next().value);
    });
  });
});

/*
--------------------------------------------------------------------------------
Aerobus.Message
--------------------------------------------------------------------------------
*/

describe('Aerobus.Message', () => {
  describe('#cancel', () => {
    it('skips next subscriber when returned from previous subscriber', () => {
      let results = 0
        , canceller = (_, message) => message.cancel
        , subscriber = (_, message) => results++;
      aerobus().root.subscribe(canceller, subscriber).publish();
      assert.strictEqual(results, 0);
    });

    it('skips subsequent subscriber when returned from subscriber of parent channel', () => {
      let channel = aerobus()('test')
        , results = 0
        , canceller = (_, message) => message.cancel
        , subscriber = (_, message) => results++;
      channel.parent.subscribe(canceller);
      channel.subscribe(subscriber).publish();
      assert.strictEqual(results, 0);
    });
  });

  describe('#data', () => {
    it('gets published data', () => {
      let publication = {}
        , result
        , subscriber = (_, message) => result = message.data;
      aerobus().root.subscribe(subscriber).publish(publication);
      assert.strictEqual(result, publication);
    });
  });

  describe('#destination', () => {
    it('gets channel name this message was delivered to', () => {
      let bus = aerobus()
        , channel = bus('test')
        , result
        , subscriber = (_, message) => result = message.destination;
      channel.subscribe(subscriber).publish();
      assert.strictEqual(result, channel.name);
    });
  });

  describe('#route', () => {
    it('gets array of channel names this message traversed', () => {
      let bus = aerobus()
        , root = bus.root
        , parent = bus('parent')
        , child = bus('parent.child')
        , results = []
        , subscriber = (_, message) => results = message.route;
      bus.root.subscribe(subscriber);
      child.publish();
      assert.include(results, root.name);
      assert.include(results, parent.name);
      assert.include(results, child.name);
    });
  });
});

/*
--------------------------------------------------------------------------------
Aerobus.Section
--------------------------------------------------------------------------------
*/

describe('Aerobus.Section', () => {
  describe('#channels', () => {
    it('is array', () => {
      assert.isArray(aerobus()('test1', 'test2').channels);
    });

    it('contains all referenced #channels', () => {
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

    it('clears #subscribers of all #channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section.channels.forEach(channel => channel.subscribe(subscriber));
      section.clear();
      section.channels.forEach(channel => assert.strictEqual(channel.subscribers.length, 0));
    });
  });

  describe('#enable()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.enable(), section);
    });

    it('sets #enabled for all #channels', () => {
      let section = aerobus()('test1', 'test2');
      section.enable(false).enable();
      section.channels.forEach(channel => assert.isTrue(channel.enabled));
    });
  });

  describe('#enable(false)', () => {
    it('clears #enabled for all #channels', () => {
      let section = aerobus()('test1', 'test2');
      section.enable(false);
      section.channels.forEach(channel => assert.isFalse(channel.enabled));
    });
  });

  describe('#forward(@string)', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.forward(''), section);
    });

    it('adds @string to #forwarders of all #channels', () => {
      let section = aerobus()('test1', 'test2')
        , forwarder = '';
      section.forward(forwarder);
      section.channels.forEach(channel => assert.include(channel.forwarders, forwarder));
    });
  });

  describe('#publish()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.publish(), section);
    });
  });

  describe('#publish(@object)', () => {
    it('publishes @object to all #channels in order of channel reference', () => {
      let section = aerobus()('test1', 'test2')
        , publication = {}
        , results = []
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

    it('adds @function to #subscribers of all #channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section.subscribe(subscriber);
      section.channels.forEach(
        channel => assert.include(
          channel.subscribers.map(existing => existing.next)
        , subscriber));
    });
  });

  describe('#subscribe(@function0, @function1)', () => {
    it('adds @function to #subscribers all #channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber0 = () => {}
        , subscriber1 = () => {};
      section.subscribe(subscriber0, subscriber1);
      section.channels.forEach(channel => {
        assert.include(channel.subscribers.map(existing => existing.next), subscriber0);
        assert.include(channel.subscribers.map(existing => existing.next), subscriber1);
      });
    });
  });

  describe('#toggle()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.toggle(), section);
    });

    it('clears #enabled for all enabled #channels', () => {
      let section = aerobus()('test1', 'test2');
      section.enable(true).toggle();
      section.channels.forEach(channel => assert.isFalse(channel.enabled));
    });

    it('sets #enabled for all disabled #channels', () => {
      let section = aerobus()('test1', 'test2');
      section.enable(false).toggle();
      section.channels.forEach(channel => assert.isTrue(channel.enabled));
    });
  });

  describe('#unsubscribe()', () => {
    it('is fluent', () => {
      let section = aerobus()('test1', 'test2');
      assert.strictEqual(section.unsubscribe(), section);
    });
  });

  describe('#unsubscribe(@function)', () => {
    it('removes @function from #subscribers of all #channels', () => {
      let section = aerobus()('test1', 'test2')
        , subscriber = () => {};
      section
        .subscribe(subscriber)
        .unsubscribe(subscriber);
      section.channels.forEach(
        channel => assert.notInclude(
          channel.subscribers.map(existing => existing.next)
        , subscriber));
    });
  });
});