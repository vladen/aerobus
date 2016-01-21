'use strict';

export default (aerobus, assert) => describe('Aerobus', () => {
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
  });

  describe('#(@string)', () => {
    it('returns instance of Aerobus.Channel', () => {
      let bus = aerobus();
      assert.typeOf(bus('test'), 'Aerobus.Channel');
    });

    it('Channel.#name gets @string', () => {
      let bus = aerobus(), name = 'test';
      assert.strictEqual(bus(name).name, name);
    });
  });

  describe('#(...@strings)', () => {
    it('returns instance of Aerobus.Section', () => {
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

    it('new Aerobus inherits Aerobus.Channel class extensions', () => {
      let extension = () => {};
      assert.strictEqual(aerobus({ channel : { extension } }).create().root.extension, extension);
    });

    it('new Aerobus inherits Aerobus.Message class extensions', () => {
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

    it('new Aerobus inherits Aerobus.Section class extensions', () => {
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
    it('is instance of Aerobus.Channel', () => {
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

    it('is called from channel.cycle() with arguments ("cycle", channel, 1, 1)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.cycle();
      assert.strictEqual(results[0], 'cycle');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], 1);
      assert.strictEqual(results[3], 1);
    });

    it('is called from channel.cycle(2) with arguments ("cycle", channel, 2, 2)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.cycle(2);
      assert.strictEqual(results[0], 'cycle');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], 2);
      assert.strictEqual(results[3], 2);
    });

    it('is called from channel.cycle(2, 1) with arguments ("cycle", channel, 2, 1)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.cycle(2, 1);
      assert.strictEqual(results[0], 'cycle');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], 2);
      assert.strictEqual(results[3], 1);
    });

    it('is called from channel.cycle(0) with arguments ("cycle", channel, 0, 0)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.cycle(0);
      assert.strictEqual(results[0], 'cycle');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], 0);
      assert.strictEqual(results[3], 0);
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

    it('is called from channel.publish(@data) with arguments ("publish", channel, @data)', () => {
      let data = {}
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.publish(data);
      assert.strictEqual(results[0], 'publish');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], data);
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

    it('is called from channel.shuffle() with arguments ("shuffle", channel, 1)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.shuffle();
      assert.strictEqual(results[0], 'shuffle');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], 1);
    });

    it('is called from channel.shuffle(2) with arguments ("shuffle", channel, 2)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.shuffle(2);
      assert.strictEqual(results[0], 'shuffle');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], 2);
    });

    it('is called from channel.shuffle(0) with arguments ("shuffle", channel, 0)', () => {
      let results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.shuffle(0);
      assert.strictEqual(results[0], 'shuffle');
      assert.strictEqual(results[1], bus.root);
      assert.strictEqual(results[2], 0);
    });

    it('is called from channel.subscribe(@parameters) with arguments ("subscribe", channel, @parameters)', () => {
      let parameters = [() => {}]
        , results = []
        , trace = (...args) => results = args
        , bus = aerobus({ trace });
      bus.root.subscribe(...parameters);
      assert.strictEqual(results[0], 'subscribe');
      assert.strictEqual(results[1], bus.root);
      assert.includeMembers(results[2], parameters);
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