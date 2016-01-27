(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.aerobusTests = factory());
}(this, function () { 'use strict';

  var factoryTests = (aerobus, assert) => describe('aerobus', () => {
    it('is function', () => {
      assert.isFunction(aerobus);
    });

    describe('aerobus()', () => {
      it('returns instance of Aerobus', () => {
        assert.typeOf(aerobus(), 'Aerobus');
      });

      describe('#bubbles', () => {
        it('is initially true', () => {
          assert.isTrue(aerobus().bubbles);
        });
      });

      describe('#delimiter', () => {
        it('is initially "."', () => {
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

      describe('@object.bus', () => {
        it('extends Aerobus instances', () => {
          let extension = () => {}
            , bus = aerobus({ bus: { extension } });
          assert.strictEqual(bus.extension, extension);
        });
      });

      describe('@object.channel', () => {
        it('extends Aerobus.Channel instances', () => {
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
        it('extends Aerobus.Message instances', () => {
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
        it('extends Aerobus.Section instances', () => {
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
  });

  var instanceTests = (aerobus, assert) => describe('Aerobus', () => {
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

      it('is called from channel.cycle(false) with arguments ("cycle", channel, 0, 0)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.cycle(false);
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

      it('is called from channel.shuffle(false) with arguments ("shuffle", channel, 0)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.shuffle(false);
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

  var channelTests = (aerobus, assert) => describe('Aerobus.Channel', () => {
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
        assert.isBoolean(aerobus().root.bubbles);
      });

      it('is initially true', () => {
        assert.isTrue(aerobus().root.bubbles);
      });

      it('is inherited from bus config', () => {
        assert.isTrue(aerobus(true).root.bubbles);
        assert.isTrue(aerobus({ bubbles: true }).root.bubbles);
        assert.isFalse(aerobus(false).root.bubbles);
        assert.isFalse(aerobus({ bubbles: false }).root.bubbles);
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
    });

    describe('#cycle()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        assert.strictEqual(bus.root.cycle(), bus.root);
      });

      it('sets #strategy to instance of Aerobus.Strategy.Cycle', () => {
        assert.typeOf(aerobus().root.cycle().strategy, 'Aerobus.Strategy.Cycle');
      });

      it('sets #strategy.limit to 1', () => {
        assert.strictEqual(aerobus().root.cycle().strategy.limit, 1);
      });

      it('sets #strategy.name to "cycle"', () => {
        assert.strictEqual(aerobus().root.cycle().strategy.name, 'cycle');
      });

      it('sets #strategy.step to 1', () => {
        assert.strictEqual(aerobus().root.cycle().strategy.step, 1);
      });

      it('makes channel to deliver publication sequentially', () => {
        let result0 = 0
          , result1 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          ;
        aerobus().root
          .cycle()
          .subscribe(subscriber0, subscriber1)
          .publish()
          .publish()
          .publish();
        assert.strictEqual(result0, 2);
        assert.strictEqual(result1, 1);
      });
    });

    describe('#cycle(2)', () => {
      it('sets #strategy.limit to 2', () => {
        assert.strictEqual(aerobus().root.cycle(2).strategy.limit, 2);
      });

      it('sets #strategy.step to 2', () => {
        assert.strictEqual(aerobus().root.cycle(2).strategy.step, 2);
      });

      it('makes channel to deliver publication sequentially to pair of subscribers stepping two subscribers at once', () => {
        let result0 = 0
          , result1 = 0
          , result2 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          , subscriber2 = () => ++result2
          ;
        aerobus().root
          .cycle(2)
          .subscribe(subscriber0, subscriber1, subscriber2)
          .publish()
          .publish();
        assert.strictEqual(result0, 2);
        assert.strictEqual(result1, 1);
        assert.strictEqual(result2, 1);
      });
    });

    describe('#cycle(2, 1)', () => {
      it('sets #strategy.limit to 2', () => {
        assert.strictEqual(aerobus().root.cycle(2, 1).strategy.limit, 2);
      });

      it('sets #strategy.step to 1', () => {
        assert.strictEqual(aerobus().root.cycle(2, 1).strategy.step, 1);
      });

      it('makes channel to deliver publication sequentially to pair of subscribers stepping one subscriber at once', () => {
        let result0 = 0
          , result1 = 0
          , result2 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          , subscriber2 = () => ++result2
          ;
        aerobus().root
          .cycle(2, 1)
          .subscribe(subscriber0, subscriber1, subscriber2)
          .publish()
          .publish();
        assert.strictEqual(result0, 1);
        assert.strictEqual(result1, 2);
        assert.strictEqual(result2, 1);
      });
    });

    describe('#cycle(0)', () => {
      it('resets publication strategy for this channel', () => {
        let channel = aerobus().root
          ;
        channel.cycle(1).cycle(0);
        assert.isUndefined(channel.strategy);
      });

      it('makes channel to deliver publication to all subscribers at once', () => {
        let channel = aerobus().root
          , result0 = 0
          , result1 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          ;
        channel.subscribe(subscriber0, subscriber1)
          .cycle(1)
          .cycle(0)
          .publish();
        assert.strictEqual(result0, 1);
        assert.strictEqual(result1, 1);
      });
    });

    describe('#cycle(false)', () => {
      it('resets publication strategy for this channel', () => {
        let channel = aerobus().root
          ;
        channel.cycle(1).cycle(false);
        assert.isUndefined(channel.strategy);
      });

      it('makes channel to deliver publication to all subscribers at once', () => {
        let channel = aerobus().root
          , result0 = 0
          , result1 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          ;
        channel.subscribe(subscriber0, subscriber1)
          .cycle(1)
          .cycle(false)
          .publish();
        assert.strictEqual(result0, 1);
        assert.strictEqual(result1, 1);
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

    describe('#name', () => {
      it('is string', () => {
        assert.isString(aerobus().root.name);
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

    describe('#shuffle()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        assert.strictEqual(bus.root.shuffle(), bus.root);
      });

      it('sets #strategy to instance of Aerobus.Strategy.Shuffle', () => {
        assert.typeOf(aerobus().root.shuffle().strategy, 'Aerobus.Strategy.Shuffle');
      });

      it('sets #strategy.limit to 1', () => {
        assert.strictEqual(aerobus().root.shuffle().strategy.limit, 1);
      });

      it('sets #strategy.name to "shuffle"', () => {
        assert.strictEqual(aerobus().root.shuffle().strategy.name, 'shuffle');
      });

      it('makes channel delivering publication randomly', () => {
        let result0 = 0
          , result1 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          ;
        aerobus().root
          .shuffle()
          .subscribe(subscriber0, subscriber1)
          .publish()
          .publish()
          .publish();
        assert.strictEqual(result0 + result1, 3);
      });
    });

    describe('#shuffle(2)', () => {
      it('makes channel delivering publication randomly to pair of subscribers at once', () => {
        let result0 = 0
          , result1 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          ;
        aerobus().root
          .shuffle(2)
          .subscribe(subscriber0, subscriber1)
          .publish()
          .publish();
        assert.strictEqual(result0 + result1, 4);
      });
    });

    describe('#shuffle(0)', () => {
      it('resets publication strategy for this channel', () => {
        let channel = aerobus().root
          ;
        channel.shuffle(1).shuffle(0);
        assert.isUndefined(channel.strategy);
      });

      it('makes channel to deliver publication to all subscribers at once', () => {
        let channel = aerobus().root
          , result0 = 0
          , result1 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          ;
        channel.subscribe(subscriber0, subscriber1)
          .shuffle(1)
          .shuffle(0)
          .publish();
        assert.strictEqual(result0, 1);
        assert.strictEqual(result1, 1);
      });
    });

    describe('#shuffle(false)', () => {
      it('resets publication strategy for this channel', () => {
        let channel = aerobus().root
          ;
        channel.shuffle(1).shuffle(false);
        assert.isUndefined(channel.strategy);
      });

      it('makes channel to deliver publication to all subscribers at once', () => {
        let channel = aerobus().root
          , result0 = 0
          , result1 = 0
          , subscriber0 = () => ++result0
          , subscriber1 = () => ++result1
          ;
        channel.subscribe(subscriber0, subscriber1)
          .shuffle(1)
          .shuffle(false)
          .publish();
        assert.strictEqual(result0, 1);
        assert.strictEqual(result1, 1);
      });
    });

    describe('#strategy', () => {
      it('is initially undefined', () => {
        assert.isUndefined(aerobus().root.strategy);
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

      it('wraps @function with Aerobus.Subscriber and adds to #subscribers', () => {
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
      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers', () => {
        let channel = aerobus().root
          , subscriber0 = () => {}
          , subscriber1 = () => {};
        channel.subscribe(subscriber0, subscriber1);
        assert.strictEqual(channel.subscribers[0].next, subscriber0);
        assert.strictEqual(channel.subscribers[1].next, subscriber1);
      });
    });

    describe('#subscribe(@number, @function)', () => {
      it('wraps @function with Aerobus.Subscriber and adds to #subscribers, @subscriber.order gets @number', () => {
        let channel = aerobus().root
          , order = -1;
        channel.subscribe(order, () => {});
        assert.strictEqual(channel.subscribers[0].order, order);
      });

      it('wraps @function with Aerobus.Subscriber and adds #subscribers, logical position of @subscriber within #subscribers matches @number', () => {
        let channel = aerobus().root
          , subscriber0 = () => {}
          , subscriber1 = () => {};
        channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
        assert.strictEqual(channel.subscribers[0].next, subscriber1);
        assert.strictEqual(channel.subscribers[1].next, subscriber0);
      });
    });

    describe('#subscribe(@number, ...@functions)', () => {
      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers, each @subscriber.order gets @number', () => {
        let channel = aerobus().root
          , order = 1;
        channel
          .subscribe(order, () => {}, () => {});
        assert.strictEqual(channel.subscribers[0].order, order);
        assert.strictEqual(channel.subscribers[1].order, order);
      });

      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers, logical position of each @subscriber within #subscribers matches @number', () => {
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
      it('wraps @function with Aerobus.Subscriber and adds to #subscribers, @subscriber.name gets @string', () => {
        let channel = aerobus().root
          , name = 'test';
        channel.subscribe(name, () => {});
        assert.strictEqual(channel.subscribers[0].name, name);
      });
    });

    describe('#subscribe(@object)', () => {
      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.done invokes @object.done', () => {
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

      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.next invokes @object.next', () => {
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

      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.name gets @object.name', () => {
        let channel = aerobus().root
          , subscriber = {
              name: 'test'
            , next: () => {}
            };
        channel.subscribe(subscriber);
        assert.strictEqual(channel.subscribers[0].name, subscriber.name);
      });

      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.order gets @object.order', () => {
        let channel = aerobus().root
          , subscriber = {
              next: () => {}
            , order: 1
            };
        channel.subscribe(subscriber);
        assert.strictEqual(channel.subscribers[0].order, subscriber.order);
      });

      it('throws if @object.done is not a function', () => {
        [new Array, true, new Date, 1, {}, 'test'].forEach(value =>
          assert.throw(() => aerobus().root.subscribe({
            done: value
          })));
      });

      it('throws if @object.name is not a string', () => {
        [new Array, true, new Date, () => {}, 1, {}].forEach(value =>
          assert.throw(() => aerobus().root.subscribe({
            name: value
          , next: () => {}
          })));
      });

      it('throws if @object does not contain "next" member', () => {
        assert.throw(() => aerobus().root.subscribe({}));
      });

      it('throws if @object.next is not a function', () => {
        [new Array, true, new Date, 1, {}, 'test'].forEach(value =>
          assert.throw(() => aerobus().root.subscribe({
            next: value
          })));
      });

      it('throws if @object.order is not a number', () => {
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

      it('is immutable', () => {
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

    describe('#when()', () => {
      it('throws', () => {
        assert.throws(() => aerobus().root.when());
      });
    });

    describe('#when(@string)', () => {
      it('returns instance of Aerobus.PLAN', () => {
        assert.typeOf(aerobus().root.when('channel'), 'Aerobus.PLAN');
      });
      it('the pending operation executes after publication of message in the observable channel', () => {
        let bus = aerobus()
          , channel1 = bus('channel1')
          , channel2 = bus('channel2')
          , result = 0
          , subscriber = () => ++result
          ;
        channel2.subscribe(subscriber)
          .when('channel1')
          .publish();
        channel1.publish();
        assert.strictEqual(result, 1);
      });
      it('possible to use all available methods in the pending operation', () => {
        ['cycle', 'shuffle', 'bubble', 'clear', 'enable', 'forward',
         'publish', 'reset', 'retain', 'subscribe', 'toggle', 'unsubscribe'].forEach(value => 
          assert.doesNotThrow(() => aerobus().root.when('channel')[value]));
      });
    });

    describe('#when(...@string)', () => {
      it('the pending operation executes after publication of messages in all observable channels', () => {
        let bus = aerobus()
          , channel1 = bus('channel1')
          , channel2 = bus('channel2')
          , channel3 = bus('channel3')
          , result = 0
          , subscriber = () => ++result
          ;
        channel3.subscribe(subscriber)
          .when('channel1', 'channel2')
          .publish();
        channel1.publish();
        assert.strictEqual(result, 0);
        channel2.publish();
        assert.strictEqual(result, 1);
        channel1.publish();
        channel1.publish();
        channel2.publish();
        assert.strictEqual(result, 2);
        channel2.publish();
        assert.strictEqual(result, 3);
      });
    });

    describe('#unsubscribe()', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        assert.strictEqual(channel.unsubscribe(), channel);
      });
    });

    describe('#unsubscribe(@function)', () => {
      it('does not throw if @function has not been subscribed', () => {
        assert.doesNotThrow(() => aerobus().root.unsubscribe(() => {}));
      });

      it('removes @function from #subscribers', () => {
        let channel = aerobus().root
          , subscriber = () => {};
        channel.subscribe(subscriber).unsubscribe(subscriber);
        assert.strictEqual(channel.subscribers.length, 0);
      });

      it('prevents publication delivery to next subscriber when previous subscriber unsubscribes it', () => {
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
      it('does not throw if @object has not been subscribed', () => {
        assert.doesNotThrow(() => aerobus().root.unsubscribe({}));
      });

      it('removes @object from #subscribers', () => {
        let channel = aerobus().root
          , subscriber = { next: () => {} };
        channel.subscribe(subscriber).unsubscribe(subscriber);
        assert.strictEqual(channel.subscribers.length, 0);
      });

      it('invokes @object.done()', () => {
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
      it('does not throw if no #subscribers are named as @name', () => {
        assert.doesNotThrow(() => aerobus().root.unsubscribe('test'));
      });

      it('removes all subscribers named as @string from  #subscribers', () => {
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
      it('does not throw if @subscriber has not been subscribed', () => {
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

  var messageTests = (aerobus, assert) => describe('Aerobus.Message', () => {
    describe('#cancel', () => {
      it('skips next subscriber when returned from previous subscriber', () => {
        let results = 0
          , canceller = (_, message) => message.cancel
          , subscriber = (_, message) => results++;
        aerobus().root.subscribe(canceller, subscriber).publish();
        assert.strictEqual(results, 0);
      });

      it('skips subscriber of descendant channel when returned from subscriber of parent channel', () => {
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
      it('gets array of channel names this message has traversed', () => {
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

  var sectionTests = (aerobus, assert) => describe('Aerobus.Section', () => {
    describe('#channels', () => {
      it('is array', () => {
        assert.isArray(aerobus()('test1', 'test2').channels);
      });

      it('gets array of all channels bound with this section', () => {
        let bus = aerobus()
          , channel0 = bus('test0')
          , channel1 = bus('test1')
          , section = bus('test0', 'test1');
        assert.include(section.channels, channel0);
        assert.include(section.channels, channel1);
      });
    });

    describe('#bubble()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        assert.strictEqual(section.bubble(), section);
      });

      it('sets bubbles of all #channels', () => {
        let section = aerobus(false)('test1', 'test2');
        section.bubble();
        section.channels.forEach(channel => assert.isTrue(channel.bubbles));
      });
    });

    describe('#bubble(false)', () => {
      it('clears bubbles of all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.bubble(false);
        section.channels.forEach(channel => assert.isFalse(channel.bubbles));
      });
    });

    describe('#bubble(true)', () => {
      it('sets bubbles of all #channels', () => {
        let section = aerobus(false)('test1', 'test2');
        section.bubble(true);
        section.channels.forEach(channel => assert.isTrue(channel.bubbles));
      });
    });

    describe('#clear()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        assert.strictEqual(section.clear(), section);
      });

      it('clears subscribers of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , subscriber = () => {};
        section.channels.forEach(channel => channel.subscribe(subscriber));
        section.clear();
        section.channels.forEach(channel => assert.strictEqual(channel.subscribers.length, 0));
      });
    });

    describe('#cycle()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        assert.strictEqual(section.cycle(), section);
      });

      it('sets strategy of all #channels to instance of Aerobus.Strategy.Cycle', () => {
        let section = aerobus()('test1', 'test2');
        section.cycle();
        section.channels.forEach(channel => assert.typeOf(channel.strategy, 'Aerobus.Strategy.Cycle'));
      });
    });

    describe('#enable()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        assert.strictEqual(section.enable(), section);
      });

      it('enables all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.channels.forEach(channel => channel.enable(false));
        section.enable();
        section.channels.forEach(channel => assert.isTrue(channel.enabled));
      });
    });

    describe('#enable(false)', () => {
      it('disables all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.enable(false);
        section.channels.forEach(channel => assert.isFalse(channel.enabled));
      });
    });

    describe('#enable(true)', () => {
      it('enables all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.channels.forEach(channel => channel.enable(false));
        section.enable(true);
        section.channels.forEach(channel => assert.isTrue(channel.enabled));
      });
    });

    describe('#forward(@function)', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        assert.strictEqual(section.forward(() => {}), section);
      });

      it('adds @function to forwarders of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , forwarder = () => {};
        section.forward(forwarder);
        section.channels.forEach(channel => assert.include(channel.forwarders, forwarder));
      });
    });

    describe('#forward(@string)', () => {
      it('adds @string to forwarders of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , forwarder = '';
        section.forward(forwarder);
        section.channels.forEach(channel => assert.include(channel.forwarders, forwarder));
      });
    });

    describe('#forward(@function, @string)', () => {
      it('adds @string to forwarders of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , forwarder0 = () => {}
          , forwarder1 = '';
        section.forward(forwarder0, forwarder1);
        section.channels.forEach(channel => assert.include(channel.forwarders, forwarder0));
        section.channels.forEach(channel => assert.include(channel.forwarders, forwarder1));
      });
    });

    describe('#forward(!(@function || @string))', () => {
      let section = aerobus()('test1', 'test2');
      it('throws', () => {
        [new Array, true, new Date, 1, {}].forEach(value => 
          assert.throw(() => section.forward(value)));
      });
    });

    describe('#publish()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        assert.strictEqual(section.publish(), section);
      });

      it('notifies subscribers of all #channels in order of reference', () => {
        let bus = aerobus()
          , results = []
          , subscriber0 = () => results.push('test1')
          , subscriber1 = () => results.push('test2');
        bus('test1').subscribe(subscriber0);
        bus('test2').subscribe(subscriber1);
        bus('test1', 'test2').publish();
        assert.strictEqual(results[0], 'test1');
        assert.strictEqual(results[1], 'test2');
      });
    });

    describe('#publish(@object)', () => {
      it('notifies subscribers of all #channels with @object in order of reference', () => {
        let section = aerobus()('test1', 'test2')
          , publication = {}
          , results = []
          , subscriber = (_, message) => results.push(message);
        section
          .subscribe(subscriber)
          .publish(publication);
        assert.strictEqual(results[0].data, publication);
        assert.strictEqual(results[0].destination, section.channels[0].name);
        assert.strictEqual(results[1].data, publication);
        assert.strictEqual(results[1].destination, section.channels[1].name);
      });
    });

    describe('#publish(null, @function)', () => {
      it('invokes @function with array of results returned from subscribers of all #channels in order of reference', () => {
        let bus = aerobus()
          , result0 = {}
          , result1 = {}
          , results;
        bus('test1').subscribe(() => result0);
        bus('test2').subscribe(() => result1);
        bus('test1', 'test2').publish(null, data => results = data);
        assert.strictEqual(results[0], result0);
        assert.strictEqual(results[1], result1);
      });
    });

    describe('#shuffle()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        assert.strictEqual(section.shuffle(), section);
      });

      it('sets strategy of all #channels to instance of Aerobus.Strategy.Shuffle', () => {
        let section = aerobus()('test1', 'test2');
        section.shuffle();
        section.channels.forEach(channel => assert.typeOf(channel.strategy, 'Aerobus.Strategy.Shuffle'));
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

      it('adds @function to subscribers of all #channels', () => {
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
      it('adds @function to subscribers all #channels', () => {
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

      it('disables all enabled #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.enable(true).toggle();
        section.channels.forEach(channel => assert.isFalse(channel.enabled));
      });

      it('enables all disabled #channels', () => {
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

      it('removes all subscribers of all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section
          .subscribe(() => {}, () => {})
          .unsubscribe();
        section.channels.forEach(channel => assert.strictEqual(channel.subscribers.length, 0));
      });
    });

    describe('#unsubscribe(@function)', () => {
      it('removes @function from subscribers of all #channels', () => {
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

  var aerobus = (aerobus, assert) => {
    factoryTests(aerobus, assert);
    instanceTests(aerobus, assert);
    channelTests(aerobus, assert);
    messageTests(aerobus, assert);
    sectionTests(aerobus, assert);
  };

  return aerobus;

}));