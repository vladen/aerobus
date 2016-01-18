(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('chai'), require('aerobus')) :
  typeof define === 'function' && define.amd ? define(['exports', 'chai', 'aerobus'], factory) :
  (factory((global.tests = {}),global.chai,global.aerobus));
}(this, function (exports,chai,aerobus) { 'use strict';

  aerobus = 'default' in aerobus ? aerobus['default'] : aerobus;

  var aerobusFactoryTests = describe('aerobus', () => {
    it('is function', () => {
      chai.assert.isFunction(aerobus);
    });

    describe('aerobus()', () => {
      it('returns instance of Aerobus', () => {
        chai.assert.typeOf(aerobus(), 'Aerobus');
      });

      describe('#bubbles', () => {
        it('is initially true', () => {
          chai.assert.isTrue(aerobus().bubbles);
        });
      });

      describe('#delimiter', () => {
        it('is initially "."', () => {
          chai.assert.strictEqual(aerobus().delimiter, '.');
        });
      });
    });

    describe('aerobus(@boolean)', () => {
      it('returns instance of Aerobus', () => {
        chai.assert.typeOf(aerobus(false), 'Aerobus');
      });

      describe('@boolean', () => {
        it('Aerobus.#bubbles gets @boolean', () => {
          let bubbles = false
            , bus = aerobus(bubbles);
          chai.assert.strictEqual(bus.bubbles, bubbles);
        });
      });
    });

    describe('aerobus(@function)', () => {
      it('returns instance of Aerobus', () => {
        chai.assert.typeOf(aerobus(() => {}), 'Aerobus');
      });

      describe('@function', () => {
        it('Aerobus.#error gets @function', () => {
          let error = () => {};
          chai.assert.strictEqual(aerobus(error).error, error);
        });
      });
    });

    describe('aerobus(@object)', () => {
      it('returns instance of Aerobus', () => {
        chai.assert.typeOf(aerobus({}), 'Aerobus');
      });

      it('Aerobus.#bubbles gets @object.bubbles', () => {
        let bubbles = false
          , bus = aerobus({ bubbles });
        chai.assert.strictEqual(bus.bubbles, bubbles);
      });

      it('throws @object.delimiter is empty string or not a string', () => {
        [ '', [], true, new Date, () => {}, 1, {} ].forEach(value =>
          chai.assert.throw(() => aerobus({ delimiter: value })));
      });

      it('Aerobus.#delimiter gets @object.delimiter', () => {
        let delimiter = ':'
          , bus = aerobus({ delimiter });
        chai.assert.strictEqual(bus.delimiter, delimiter);
      });

      it('throws if @object.error is not a function', () => {
        [ '', [], true, new Date, 1, {} ].forEach(value =>
          chai.assert.throw(() => aerobus({ error: value })));
      });

      it('Aerobus.#error gets @object.error', () => {
        let error = () => {}
          , bus = aerobus({ error });
        chai.assert.strictEqual(bus.error, error);
      });

      it('throws if @object.trace is not a function', () => {
        [ '', [], true, new Date, 1, {} ].forEach(value =>
          chai.assert.throw(() => aerobus({ trace: value })));
      });

      it('Aerobus.#trace gets @object.trace', () => {
        let trace = () => {}
          , bus = aerobus({ trace });
        chai.assert.strictEqual(bus.trace, trace);
      });

      describe('@object.channel', () => {
        it('extends Aerobus.Channel instances', () => {
          let extension = () => {}
            , bus = aerobus({ channel: { extension } });
          chai.assert.strictEqual(bus.root.extension, extension)
          chai.assert.strictEqual(bus('custom').extension, extension)
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
          Object.keys(extensions).forEach(key => chai.assert.isNotNull(bus.root[key]));
        });
      });

      describe('@object.message', () => {
        it('extends Aerobus.Message instances', () => {
          let extension = () => {}
            , bus = aerobus({ message: { extension } })
            , result
            , subscriber = (_, message) => result = message.extension;
          bus.root.subscribe(subscriber).publish();
          chai.assert.strictEqual(result, extension);
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
          Object.keys(extensions).forEach(key => chai.assert.isNotNull(result[key]));
        });
      });

      describe('@object.section', () => {
        it('extends Aerobus.Section instances', () => {
          let extension = () => {}
            , bus = aerobus({ section: { extension } });
          chai.assert.strictEqual(bus('', 'test').extension, extension);
          chai.assert.strictEqual(bus('', 'test0', 'test1').extension, extension);
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
          Object.keys(extensions).forEach(key => chai.assert.isNotNull(bus('', 'test')[key]));
        });
      });
    });

    describe('aerobus(@string)', () => {
      it('throws if @string is empty', () => {
        chai.assert.throw(() => aerobus(''));
      });

      it('returns instance of Aerobus', () => {
        chai.assert.typeOf(aerobus(':'), 'Aerobus');
      });

      it('Aerobus.#delimiter gets @string', () => {
        let delimiter = ':';
        chai.assert.strictEqual(aerobus(delimiter).delimiter, delimiter);
      });
    });

    describe('aerobus(@boolean, @function, @string)', () => {
      it('returns instance of Aerobus', () => {
        chai.assert.typeOf(aerobus(false, () => {}, ':'), 'Aerobus');
      });

      it('Aerobus.#bubbles gets @boolean', () => {
        let bubbles = false;
        chai.assert.strictEqual(aerobus(bubbles, () => {}, ':').bubbles, bubbles);
      });

      it('Aerobus.#error gets @function', () => {
        let error = () => {};
        chai.assert.strictEqual(aerobus(false, error, ':').error, error);
      });

      it('Aerobus.#delimiter gets @string', () => {
        let delimiter = ':';
        chai.assert.strictEqual(aerobus(false, () => {}, delimiter).delimiter, delimiter);
      });
    });

    describe('aerobus(!(@boolean | @function | @object | @string))', () => {
      it('throws', () => {
        [
          [], new Date, 42
        ].forEach(value => chai.assert.throw(() => aerobus(value)));
      });
    });
  });

  var aerobusInstanceTests = describe('Aerobus', () => {
    describe('is function', () => {
      chai.assert.instanceOf(aerobus(), Function);
    });

    describe('#()', () => {
      it('returns instance of Aerobus.Channel', () => {
        let bus = aerobus();
        chai.assert.typeOf(bus(), 'Aerobus.Channel');
      });

      it('returns #root channel', () => {
        let bus = aerobus()
          , channel = bus();
        chai.assert.strictEqual(channel, bus.root);
      });
    });

    describe('#("")', () => {
      it('returns instance of Aerobus.Channel', () => {
        let bus = aerobus();
        chai.assert.typeOf(bus(''), 'Aerobus.Channel');
      });

      it('returns #root channel', () => {
        let bus = aerobus()
          , channel = bus('');
        chai.assert.strictEqual(channel, bus.root);
      });
    });

    describe('#(@string)', () => {
      it('returns instance of Aerobus.Channel', () => {
        let bus = aerobus();
        chai.assert.typeOf(bus('test'), 'Aerobus.Channel');
      });

      it('Channel.#name gets @string', () => {
        let bus = aerobus(), name = 'test';
        chai.assert.strictEqual(bus(name).name, name);
      });
    });

    describe('#(...@strings)', () => {
      it('returns instance of Aerobus.Section', () => {
        chai.assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
      });

      it('Section.#channels include all specified channels', () => {
        let names = ['test1', 'test2']
          , section = aerobus()(...names);
        chai.assert.strictEqual(section.channels[0].name, names[0]);
        chai.assert.strictEqual(section.channels[1].name, names[1]);
      });
    });

    describe('#(!@string)', () => {
      it('throws', () => {
        [
          [], true, new Date, 42, {}
        ].forEach(value => chai.assert.throw(() => aerobus()(value)));
      });
    });

    describe('#bubble()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        chai.assert.strictEqual(bus.bubble(), bus);
      });

      it('sets #bubbles', () => {
        let bus = aerobus(false);
        bus.bubble();
        chai.assert.isTrue(bus.bubbles);
      });
    });

    describe('#bubble(false)', () => {
      it('clears #bubbles', () => {
        let bus = aerobus();
        bus.bubble(false);
        chai.assert.isFalse(bus.bubbles);
      });
    });

    describe('#bubbles', () => {
      it('is boolean', () => {
        chai.assert.isBoolean(aerobus().bubbles);
      });
    });

    describe('#channels', () => {
      it('is array', () => {
        chai.assert.isArray(aerobus().channels);
      });

      it('is initially empty', () => {
        chai.assert.strictEqual(aerobus().channels.length, 0);
      });

      it('contains root channel after it has been resolved', () => {
        let bus = aerobus(), channel = bus.root;
        chai.assert.include(bus.channels, channel);
      });

      it('contains custom channel after it has been resolved', () => {
        let bus = aerobus(), channel = bus('test');
        chai.assert.include(bus.channels, channel);
      });

      it('contains several channels after they have been resolved', () => {
        let bus = aerobus()
          , channel0 = bus.root
          , channel1 = bus('test')
          , channel2 = bus('parent.child');
        chai.assert.include(bus.channels, channel0);
        chai.assert.include(bus.channels, channel1);
        chai.assert.include(bus.channels, channel2);
      });
    });

    describe('#clear()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        chai.assert.strictEqual(bus.clear(), bus);
      });

      it('empties #channels', () => {
        let bus = aerobus()
          , channel0 = bus.root
          , channel1 = bus.error
          , channel2 = bus('test');
        bus.clear();
        chai.assert.strictEqual(bus.channels.length, 0);
        chai.assert.notInclude(bus.channels, channel0);
        chai.assert.notInclude(bus.channels, channel1);
        chai.assert.notInclude(bus.channels, channel2);
      });

      it('new instance of Channel is resolved for same name hereafter', () => {
        let bus = aerobus()
          , channel0 = bus.root
          , channel1 = bus.error
          , channel2 = bus('test');
        bus.clear();
        chai.assert.notStrictEqual(bus(channel0.name), channel0);
        chai.assert.notStrictEqual(bus(channel1.name), channel1);
        chai.assert.notStrictEqual(bus(channel2.name), channel2);
      });
    });

    describe('#create()', () => {
      it('returns new Aerobus instance', () => {
        chai.assert.typeOf(aerobus().create(), 'Aerobus');
      });

      it('new Aerobus inherits #bubbles', () => {
        let bubbles = false;
        chai.assert.strictEqual(aerobus(bubbles).create().bubbles, bubbles);
      });

      it('new Aerobus inherits #delimiter', () => {
        let delimiter = ':';
        chai.assert.strictEqual(aerobus(delimiter).create().delimiter, delimiter);
      });

      it('new Aerobus inherits #error', () => {
        let error = () => {};
        chai.assert.strictEqual(aerobus(error).create().error, error);
      });

      it('new Aerobus inherits #trace', () => {
        let trace = () => {};
        chai.assert.strictEqual(aerobus({ trace }).create().trace, trace);
      });

      it('new Aerobus inherits Aerobus.Channel class extensions', () => {
        let extension = () => {};
        chai.assert.strictEqual(aerobus({ channel : { extension } }).create().root.extension, extension);
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
        chai.assert.strictEqual(result.extension, extension);
      });

      it('new Aerobus inherits Aerobus.Section class extensions', () => {
        let extension = () => {};
        chai.assert.strictEqual(aerobus({ section : { extension } }).create()('test0', 'test1').extension, extension);
      });
    });

    describe('#delimiter', () => {
      it('is string', () => {
        chai.assert.isString(aerobus().delimiter);
      });

      it('is read-only', () => {
        chai.assert.throw(() => aerobus().delimiter = null);
      });
    });

    describe('#error', () => {
      it('is a function', () => {
        chai.assert.isFunction(aerobus().error);
      });

      it('is read-only', () => {
        chai.assert.throw(() => aerobus().error = null);
      });

      it('is invoked with error thrown in subscriber', done => {
        let result
          , error = new Error
          , bus = aerobus({ error: err => result = err });
        bus.root.subscribe(() => { throw error }).publish();
        setImmediate(() => {
          chai.assert.strictEqual(result, error);
          done();
        });
      });
    });

    describe('#root', () => {
      it('is instance of Aerobus.Channel', () => {
        chai.assert.typeOf(aerobus().root, 'Aerobus.Channel');
      });

      it('is read-only', () => {
        chai.assert.throw(() => aerobus().root = null);
      });
    });

    describe('#trace', () => {
      it('is function', () => {
        let bus = aerobus();
        chai.assert.isFunction(bus.trace);
      });

      it('is read-write', () => {
        let trace = () => {}
          , bus = aerobus();
        bus.trace = trace;
        chai.assert.strictEqual(bus.trace, trace);
      });

      it('is called from channel.bubble() with arguments ("bubble", channel, true)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.bubble(true);
        chai.assert.strictEqual(results[0], 'bubble');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], true);
      });

      it('is called from channel.bubble(false) with arguments ("bubble", channel, false)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.bubble(false);
        chai.assert.strictEqual(results[0], 'bubble');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], false);
      });

      it('is called from channel.clear() with arguments ("clear", channel)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.clear();
        chai.assert.strictEqual(results[0], 'clear');
        chai.assert.strictEqual(results[1], bus.root);
      });

      it('is called from channel.cycle() with arguments ("cycle", channel, 1, 1)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.cycle();
        chai.assert.strictEqual(results[0], 'cycle');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], 1);
        chai.assert.strictEqual(results[3], 1);
      });

      it('is called from channel.cycle(2) with arguments ("cycle", channel, 2, 2)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.cycle(2);
        chai.assert.strictEqual(results[0], 'cycle');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], 2);
        chai.assert.strictEqual(results[3], 2);
      });

      it('is called from channel.cycle(2, 1) with arguments ("cycle", channel, 2, 1)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.cycle(2, 1);
        chai.assert.strictEqual(results[0], 'cycle');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], 2);
        chai.assert.strictEqual(results[3], 1);
      });

      it('is called from channel.enable() with arguments ("enable", channel, true)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.enable();
        chai.assert.strictEqual(results[0], 'enable');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], true);
      });

      it('is called from channel.enable(false) with arguments ("enable", channel, false)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.enable(false);
        chai.assert.strictEqual(results[0], 'enable');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], false);
      });

      it('is called from channel.forward(@string) with arguments ("forward", channel, array) where array contains @string', () => {
        let results = []
          , forwarder = 'test'
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.forward(forwarder);
        chai.assert.strictEqual(results[0], 'forward');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.include(results[2], forwarder);
      });

      it('is called from channel.publish(@data) with arguments ("publish", channel, @data)', () => {
        let data = {}
          , results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.publish(data);
        chai.assert.strictEqual(results[0], 'publish');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], data);
      });

      it('is called from channel.reset() with arguments ("reset", channel)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.reset();
        chai.assert.strictEqual(results[0], 'reset');
        chai.assert.strictEqual(results[1], bus.root);
      });

      it('is called from channel.retain(@limit) with arguments ("retain", channel, @limit)', () => {
        let limit = 42
          , results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.retain(limit);
        chai.assert.strictEqual(results[0], 'retain');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], limit);
      });

      it('is called from channel.shuffle() with arguments ("shuffle", channel, 1)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.shuffle();
        chai.assert.strictEqual(results[0], 'shuffle');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], 1);
      });

      it('is called from channel.shuffle(2) with arguments ("shuffle", channel, 2)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.shuffle(2);
        chai.assert.strictEqual(results[0], 'shuffle');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.strictEqual(results[2], 2);
      });

      it('is called from channel.subscribe(@parameters) with arguments ("subscribe", channel, @parameters)', () => {
        let parameters = [() => {}]
          , results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.subscribe(...parameters);
        chai.assert.strictEqual(results[0], 'subscribe');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.includeMembers(results[2], parameters);
      });

      it('is called from channel.toggle() with arguments ("toggle", channel)', () => {
        let results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.toggle();
        chai.assert.strictEqual(results[0], 'toggle');
        chai.assert.strictEqual(results[1], bus.root);
      });

      it('is called from channel.unsubscribe(@parameters) with arguments ("unsubscribe", channel, @parameters)', () => {
        let parameters = [() => {}]
          , results = []
          , trace = (...args) => results = args
          , bus = aerobus({ trace });
        bus.root.unsubscribe(...parameters);
        chai.assert.strictEqual(results[0], 'unsubscribe');
        chai.assert.strictEqual(results[1], bus.root);
        chai.assert.includeMembers(results[2], parameters);
      });
    });

    describe('#unsubscribe()', () => {
      it('is fluent', () => {
        let bus = aerobus()
          , subscriber = () => {};
        chai.assert.strictEqual(bus.unsubscribe(subscriber), bus);
      });

      it('clears #subscribers of all channels', () => {
        let bus = aerobus(), channel0 = bus.root, channel1 = bus('test1'), channel2 = bus('test2')
          , subscriber0 = () => {}, subscriber1 = () => {};
        channel0.subscribe(subscriber0, subscriber1);
        channel1.subscribe(subscriber0);
        channel2.subscribe(subscriber1);
        bus.unsubscribe();
        chai.assert.strictEqual(channel0.subscribers.length, 0);
        chai.assert.strictEqual(channel1.subscribers.length, 0);
        chai.assert.strictEqual(channel2.subscribers.length, 0);
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
        chai.assert.notInclude(channel1.subscribers.map(existing => existing.next), subscriber);
        chai.assert.notInclude(channel2.subscribers.map(existing => existing.next), subscriber);
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
        chai.assert.notInclude(channel1.subscribers.map(existing => existing.next), subscriber1);
        chai.assert.notInclude(channel1.subscribers.map(existing => existing.next), subscriber2);
        chai.assert.notInclude(channel2.subscribers.map(existing => existing.next), subscriber1);
        chai.assert.notInclude(channel2.subscribers.map(existing => existing.next), subscriber2);
      });
    });
  });

  var channelTests = describe('Aerobus.Channel', () => {
    describe('#bubble()', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        chai.assert.strictEqual(channel.bubble(), channel);
      });

      it('sets #bubbles', () => {
        let channel = aerobus(false).root;
        channel.bubble();
        chai.assert.isTrue(channel.bubbles);
      });
    });

    describe('#bubble(false)', () => {
      it('clears #bubbles', () => {
        let channel = aerobus().root;
        channel.bubble(false);
        chai.assert.isFalse(channel.bubbles);
      });
    });

    describe('#bubbles', () => {
      it('is boolean', () => {
        chai.assert.isBoolean(aerobus().root.bubbles);
      });

      it('is initially true', () => {
        chai.assert.isTrue(aerobus().root.bubbles);
      });

      it('is inherited from bus config', () => {
        chai.assert.isTrue(aerobus(true).root.bubbles);
        chai.assert.isTrue(aerobus({ bubbles: true }).root.bubbles);
        chai.assert.isFalse(aerobus(false).root.bubbles);
        chai.assert.isFalse(aerobus({ bubbles: false }).root.bubbles);
      });
    });

    describe('#clear()', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        chai.assert.strictEqual(channel.clear(), channel);
      });

      it('clears #retentions', () => {
        let channel = aerobus().root;
        channel.retain().publish().clear();
        chai.assert.strictEqual(channel.retentions.length, 0);
      });

      it('clears #subscribers', () => {
        let channel = aerobus().root;
        channel.subscribe(() => {}).clear();
        chai.assert.strictEqual(channel.subscribers.length, 0);
      });

      /*
      it('rejects pending promise returned from iterator', done => {
        let channel = aerobus().root;
        channel[Symbol.iterator]().next().value.then(() => {}, done);
        channel.clear();
      });
      */
    });

    describe('#cycle()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        chai.assert.strictEqual(bus.root.cycle(), bus.root);
      });

      it('sets #strategy to instance of Aerobus.Strategy.Cycle', () => {
        chai.assert.typeOf(aerobus().root.cycle().strategy, 'Aerobus.Strategy.Cycle');
      });

      it('sets #strategy.limit to 1', () => {
        chai.assert.strictEqual(aerobus().root.cycle().strategy.limit, 1);
      });

      it('sets #strategy.name to "cycle"', () => {
        chai.assert.strictEqual(aerobus().root.cycle().strategy.name, 'cycle');
      });

      it('sets #strategy.step to 1', () => {
        chai.assert.strictEqual(aerobus().root.cycle().strategy.step, 1);
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
        chai.assert.strictEqual(result0, 2);
        chai.assert.strictEqual(result1, 1);
      });
    });

    describe('#cycle(2)', () => {
      it('sets #strategy.limit to 2', () => {
        chai.assert.strictEqual(aerobus().root.cycle(2).strategy.limit, 2);
      });

      it('sets #strategy.step to 2', () => {
        chai.assert.strictEqual(aerobus().root.cycle(2).strategy.step, 2);
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
        chai.assert.strictEqual(result0, 2);
        chai.assert.strictEqual(result1, 1);
        chai.assert.strictEqual(result2, 1);
      });
    });

    describe('#cycle(2, 1)', () => {
      it('sets #strategy.limit to 2', () => {
        chai.assert.strictEqual(aerobus().root.cycle(2, 1).strategy.limit, 2);
      });

      it('sets #strategy.step to 1', () => {
        chai.assert.strictEqual(aerobus().root.cycle(2, 1).strategy.step, 1);
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
        chai.assert.strictEqual(result0, 1);
        chai.assert.strictEqual(result1, 2);
        chai.assert.strictEqual(result2, 1);
      });
    });

    describe('#enable()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        chai.assert.strictEqual(bus.root.enable(), bus.root);
      });

      it('sets #enabled', () => {
        chai.assert.isTrue(aerobus().root.enable(false).enable().enabled);
      });
    });

    describe('#enable(false)', () => {
      it('clears #enabled', () => {
        chai.assert.isFalse(aerobus().root.enable(false).enabled);
      });

      it('supresses publication to this channel', () => {
        let result = false;
        aerobus().root.subscribe(() => result = true).enable(false).publish();
        chai.assert.isFalse(result);
      });

      it('supresses publication to descendant channel', () => {
        let channel = aerobus()('parent.child')
          , result = false;
        channel.subscribe(() => result = true).parent.enable(false);
        channel.publish();
        chai.assert.isFalse(result);
      });
    });

    describe('#enable(true)', () => {
      it('sets #enabled', () => {
        chai.assert.isTrue(aerobus().root.enable(false).enable(true).enabled);
      });

      it('resumes publication to this channel', () => {
        let result = false;
        aerobus().root.subscribe(() => result = true).enable(false).enable(true).publish();
        chai.assert.isTrue(result);
      });

      it('resumes publication to descendant channel', () => {
        let channel = aerobus()('parent.child')
          , result = false;
        channel.subscribe(() => result = true).parent.enable(false).enable(true);
        channel.publish();
        chai.assert.isTrue(result);
      });
    });

    describe('#enabled', () => {
      it('is boolean', () => {
        chai.assert.isBoolean(aerobus().root.enabled);
      });

      it('is initially true', () => {
        chai.assert.isTrue(aerobus().root.enabled);
      });
    });

    describe('#forward()', () => {
      it('throws', () => {
        chai.assert.throw(() => aerobus().root.forward());
      });
    });

    describe('#forward(@function)', () => {
      it('is fluent', () => {
        let bus = aerobus();
        chai.assert.strictEqual(bus.root.forward(() => {}), bus.root);
      });

      it('adds @function to #forwarders', () => {
        let bus = aerobus()
          , forwarder = () => {};
        bus.root.forward(forwarder);
        chai.assert.include(bus.root.forwarders, forwarder);
      });

      it('forwards publications to channel defined by @function', () => {
        let bus = aerobus()
          , result0, result1;
        bus('0').subscribe(data => result0 = data);
        bus('1').subscribe(data => result1 = data);
        bus('test').forward(data => '' + data).publish(0).publish(1);
        chai.assert.strictEqual(result0, 0);
        chai.assert.strictEqual(result1, 1);
      });

      it('forwards publications to multuple channels defined by @function', () => {
        let bus = aerobus()
          , result0, result1, result2;
        bus('0').subscribe(data => result0 = data);
        bus('1').subscribe(data => result1 = data);
        bus('test').subscribe(data => result2 = data).forward(data => ['0', '1', 'test']).publish(true);
        chai.assert.isTrue(result0);
        chai.assert.isTrue(result1);
        chai.assert.isTrue(result2);
      });

      it('does not forward publication when @function returns null', () => {
        let bus = aerobus()
          , result;
        bus('test').subscribe(data => result = data).forward(() => null).publish(true);
        chai.assert.isTrue(result);
      });

      it('does not forward publication when @function returns undefined', () => {
        let bus = aerobus()
          , result;
        bus('test').subscribe(data => result = data).forward(() => {}).publish(true);
        chai.assert.isTrue(result);
      });

      it('does not forward publication when @function returns #name of this channel', () => {
        let bus = aerobus()
          , result;
        bus('test').subscribe(data => result = data).forward(() => 'test').publish(true);
        chai.assert.isTrue(result);
      });

      it('stops forwarding publication when infinite forwarding loop is detected', () => {
        let bus = aerobus()
          , notifications = 0;
        bus('test0').forward(() => 'test1');
        bus('test1').forward(() => 'test0').subscribe(() => notifications++).publish(true);
        chai.assert.strictEqual(notifications, 1);
      });
    });

    describe('#forward(@string)', () => {
      it('adds @string to #forwarders', () => {
        let bus = aerobus()
          , forwarder = 'test';
        bus.root.forward(forwarder);
        chai.assert.include(bus.root.forwarders, forwarder);
      });

      it('forwards publications to channel specified by @string', () => {
        let bus = aerobus()
          , result;
        bus('sink').subscribe(data => result = data);
        bus('test').forward('sink').publish(true);
        chai.assert.isTrue(result);
      });
    });

    describe('#forward(@function, @string)', () => {
      it('adds @function and @string to #forwarders', () => {
        let bus = aerobus()
          , forwarders = [() => {}, 'test'];
        bus.root.forward(...forwarders);
        chai.assert.includeMembers(bus.root.forwarders, forwarders);
      });
    });

    describe('#forward(!(@function || @string))', () => {
      it('throws', () => {
        [new Array, true, new Date, 1, {}].forEach(value => 
          chai.assert.throw(() => aerobus().root.forward(value)));
      });
    });

    describe('#forwarders', () => {
      it('is array', () => {
        chai.assert.isArray(aerobus().root.forwarders);
      });

      it('is initially empty', () => {
        chai.assert.strictEqual(aerobus().root.forwarders.length, 0);
      });

      it('is clone of internal collection', () => {
        let channel = aerobus().root
          , forwarder = 'test';
        channel.forward(forwarder);
        channel.forwarders.length = 0;
        chai.assert.strictEqual(channel.forwarders.length, 1);
        channel.forwarders[0] = null;
        chai.assert.strictEqual(channel.forwarders[0], forwarder);
      });
    });

    /*
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
    */

    describe('#name', () => {
      it('is string', () => {
        chai.assert.isString(aerobus().root.name);
      });

      it('is "error" string for error channel', () => {
        chai.assert.strictEqual(aerobus().error.name, 'error');
      });

      it('is empty string for root channel', () => {
        chai.assert.strictEqual(aerobus().root.name, '');
      });

      it('is custom string for custom channel', () => {
        let name = 'some.custom.channel';
        chai.assert.strictEqual(aerobus()(name).name, name);
      });
    });

    describe('#parent', () => {
      it('is instance of Channel for custom channel', () => {
        chai.assert.typeOf(aerobus()('test').parent, 'Aerobus.Channel');
      });

      it('is root channel for channel of first level', () => {
        let bus = aerobus()
          , channel = bus('test');
        chai.assert.strictEqual(channel.parent, bus.root);
      });

      it('is parent channel for second level channel', () => {
        let bus = aerobus()
          , parent = bus('parent')
          , child = bus('parent.child');
        chai.assert.strictEqual(child.parent, parent);
      });

      it('is undefined for root channel', () => {
        chai.assert.isUndefined(aerobus().root.parent);
      });
    });

    describe('#publish()', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        chai.assert.strictEqual(channel.publish(), channel);
      });

      it('notifies own subscribers in subcription order ', () => {
        let results = []
          , subscriber0 = () => results.push('first')
          , subscriber1 = () => results.push('second');
        aerobus().root.subscribe(subscriber0, subscriber1).publish();
        chai.assert.strictEqual(results[0], 'first');
        chai.assert.strictEqual(results[1], 'second');
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
        chai.assert.strictEqual(results.length, 3);
        chai.assert.strictEqual(results[0], 'ancestor');
        chai.assert.strictEqual(results[1], 'parent');
        chai.assert.strictEqual(results[2], 'self');
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
        chai.assert.strictEqual(results.length, 1);
        chai.assert.strictEqual(results[0], 'self');
      });
    });

    describe('#publish(@object)', () => {
      it('notifies own subscriber with @object', () => {
        let publication = {}, result
          , subscriber = data => result = data;
        aerobus().root.subscribe(subscriber).publish(publication);
        chai.assert.strictEqual(result, publication);
      });

      it('notifies own and ancestor subscribers with @object', () => {
        let channel = aerobus()('parent.child'), publication = {}, results = []
          , subscriber = data => results.push(data);
        channel.parent.parent.subscribe(subscriber);
        channel.parent.subscribe(subscriber);
        channel.subscribe(subscriber);
        channel.publish(publication);
        chai.assert.strictEqual(results[0], publication);
        chai.assert.strictEqual(results[1], publication);
        chai.assert.strictEqual(results[2], publication);
      });
    });

    describe('#publish(@object, @function)', () => {
      it('invokes @function with array containing results returned from all own and ancestor subscribers', () => {
        let channel = aerobus()('parent.child'), result0 = {}, result1 = {}, result2 = {}, results
          , callback = data => results = data;
        channel.parent.parent.subscribe(() => result0);
        channel.parent.subscribe(() => result1);
        channel.subscribe(() => result2).publish({}, callback);
        chai.assert.include(results, result0);
        chai.assert.include(results, result1);
        chai.assert.include(results, result2);
      });
    });

    describe('#reset()', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        chai.assert.strictEqual(channel.reset(), channel);
      });

      it('sets #enabled', () => {
        let channel = aerobus().root;
        channel.enable(false).reset();
        chai.assert.isTrue(channel.enabled);
      });

      it('clears #forwarders', () => {
        let channel = aerobus().root;
        channel.forward('test').reset();
        chai.assert.strictEqual(channel.forwarders.length, 0);
      });

      it('clears #retentions', () => {
        let channel = aerobus().root;
        channel.retain().publish().reset();
        chai.assert.strictEqual(channel.retentions.length, 0);
      });

      it('resets #retentions.limit to 0', () => {
        let channel = aerobus().root;
        channel.retain().publish().reset();
        chai.assert.strictEqual(channel.retentions.limit, 0);
      });

      it('clears #subscribers', () => {
        let channel = aerobus().root;
        channel.subscribe(() => {}).reset();
        chai.assert.strictEqual(channel.subscribers.length, 0);
      });

      /*
      it('rejects pending promise returned from iterator', done => {
        let channel = aerobus().root;
        channel[Symbol.iterator]().next().value.then(() => {}, done);
        channel.reset();
      });
      */
    });

    describe('#retain()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        chai.assert.strictEqual(bus.root.retain(), bus.root);
      });

      it('sets #retentions.limit property to Number.MAX_SAFE_INTEGER', () => {
        let channel = aerobus().root;
        channel.retain();
        chai.assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
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
        chai.assert.strictEqual(results[0], publication0);
        chai.assert.strictEqual(results[1], publication1);
      });
    });

    describe('#retain(false)', () => {
      it('sets #retentions.limit to 0', () => {
        let channel = aerobus().root;
        channel.retain(false);
        chai.assert.strictEqual(channel.retentions.limit, 0);
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
        chai.assert.strictEqual(channel.retentions.length, 0);
      });
    });

    describe('#retain(true)', () => {
      it('sets #retentions.limit to Number.MAX_SAFE_INTEGER', () => {
        let channel = aerobus().root;
        channel.retain(true);
        chai.assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
      });
    });

    describe('#retain(@number)', () => {
      it('sets #retentions.limit to @number', () => {
        let limit = 42
          , channel = aerobus().root;
        channel.retain(limit);
        chai.assert.strictEqual(channel.retentions.limit, limit);
      });
    });

    describe('#retentions', () => {
      it('is array', () => {
        chai.assert.isArray(aerobus().root.retentions);
      });

      it('contains one latest publication when limited to 1', () => {
        let channel = aerobus().root
          , data0 = {}
          , data1 = {};
        channel
          .retain(1)
          .publish(data0)
          .publish(data1);
        chai.assert.strictEqual(channel.retentions.length, 1);
        chai.assert.strictEqual(channel.retentions[0].data, data1);
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
        chai.assert.strictEqual(channel.retentions.length, 2);
        chai.assert.strictEqual(channel.retentions[0].data, data1);
        chai.assert.strictEqual(channel.retentions[1].data, data2);
      });

      it('is clone of internal collection', () => {
        let channel = aerobus().root
          , data = {};
        channel
          .retain(1)
          .publish(data);
        channel.retentions.length = 0;
        chai.assert.strictEqual(channel.retentions.length, 1);
        channel.retentions[0] = null;
        chai.assert.strictEqual(channel.retentions[0].data, data);
      });
    });

    describe('#retentions.limit', () => {
      it('is number', () => {
        chai.assert.isNumber(aerobus().root.retentions.limit);
      });
    });

    describe('#shuffle()', () => {
      it('is fluent', () => {
        let bus = aerobus();
        chai.assert.strictEqual(bus.root.shuffle(), bus.root);
      });

      it('sets #strategy to instance of Aerobus.Strategy.Shuffle', () => {
        chai.assert.typeOf(aerobus().root.shuffle().strategy, 'Aerobus.Strategy.Shuffle');
      });

      it('sets #strategy.limit to 1', () => {
        chai.assert.strictEqual(aerobus().root.shuffle().strategy.limit, 1);
      });

      it('sets #strategy.name to "shuffle"', () => {
        chai.assert.strictEqual(aerobus().root.shuffle().strategy.name, 'shuffle');
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
        chai.assert.strictEqual(result0 + result1, 3);
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
        chai.assert.strictEqual(result0 + result1, 4);
      });
    });

    describe('#strategy', () => {
      it('is initially undefined', () => {
        chai.assert.isUndefined(aerobus().root.strategy);
      });
    });

    describe('#subscribe()', () => {
      it('throws', () => {
        chai.assert.throw(() => aerobus().root.subscribe());
      });
    });

    describe('#subscribe(@function)', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        chai.assert.strictEqual(channel.subscribe(() => {}), channel);
      });

      it('wraps @function with Aerobus.Subscriber and adds to #subscribers', () => {
        let channel = aerobus().root
          , subscriber = () => {};
        channel.subscribe(subscriber);
        chai.assert.strictEqual(channel.subscribers[0].next, subscriber);
      });

      it('does not deliver current publication to @function subscribed by subscriber being notified', () => {
        let channel = aerobus().root
          , result = true
          , subscriber1 = () => result = false
          , subscriber0 = () => channel.subscribe(subscriber1);
        channel.subscribe(subscriber0).publish();
        chai.assert.isTrue(result);
      });
    });

    describe('#subscribe(...@functions)', () => {
      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers', () => {
        let channel = aerobus().root
          , subscriber0 = () => {}
          , subscriber1 = () => {};
        channel.subscribe(subscriber0, subscriber1);
        chai.assert.strictEqual(channel.subscribers[0].next, subscriber0);
        chai.assert.strictEqual(channel.subscribers[1].next, subscriber1);
      });
    });

    describe('#subscribe(@number, @function)', () => {
      it('wraps @function with Aerobus.Subscriber and adds to #subscribers, @subscriber.order gets @number', () => {
        let channel = aerobus().root
          , order = -1;
        channel.subscribe(order, () => {});
        chai.assert.strictEqual(channel.subscribers[0].order, order);
      });

      it('wraps @function with Aerobus.Subscriber and adds #subscribers, logical position of @subscriber within #subscribers matches @number', () => {
        let channel = aerobus().root
          , subscriber0 = () => {}
          , subscriber1 = () => {};
        channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
        chai.assert.strictEqual(channel.subscribers[0].next, subscriber1);
        chai.assert.strictEqual(channel.subscribers[1].next, subscriber0);
      });
    });

    describe('#subscribe(@number, ...@functions)', () => {
      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers, each @subscriber.order gets @number', () => {
        let channel = aerobus().root
          , order = 1;
        channel
          .subscribe(order, () => {}, () => {});
        chai.assert.strictEqual(channel.subscribers[0].order, order);
        chai.assert.strictEqual(channel.subscribers[1].order, order);
      });

      it('wraps each of @functions with Aerobus.Subscriber and adds to #subscribers, logical position of each @subscriber within #subscribers matches @number', () => {
        let channel = aerobus().root
          , subscriber0 = () => {}
          , subscriber1 = () => {}
          , subscriber2 = () => {};
        channel.subscribe(subscriber0).subscribe(-1, subscriber1, subscriber2);
        chai.assert.strictEqual(channel.subscribers[0].next, subscriber1);
        chai.assert.strictEqual(channel.subscribers[1].next, subscriber2);
        chai.assert.strictEqual(channel.subscribers[2].next, subscriber0);
      });
    });

    describe('#subscribe(@string, @function)', () => {
      it('wraps @function with Aerobus.Subscriber and adds to #subscribers, @subscriber.name gets @string', () => {
        let channel = aerobus().root
          , name = 'test';
        channel.subscribe(name, () => {});
        chai.assert.strictEqual(channel.subscribers[0].name, name);
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
        chai.assert.isTrue(called);
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
        chai.assert.isTrue(called);
      });

      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.name gets @object.name', () => {
        let channel = aerobus().root
          , subscriber = {
              name: 'test'
            , next: () => {}
            };
        channel.subscribe(subscriber);
        chai.assert.strictEqual(channel.subscribers[0].name, subscriber.name);
      });

      it('wraps @object with Aerobus.Subscriber and adds to #subscribers, @subscriber.order gets @object.order', () => {
        let channel = aerobus().root
          , subscriber = {
              next: () => {}
            , order: 1
            };
        channel.subscribe(subscriber);
        chai.assert.strictEqual(channel.subscribers[0].order, subscriber.order);
      });

      it('throws if @object.done is not a function', () => {
        [new Array, true, new Date, 1, {}, 'test'].forEach(value =>
          chai.assert.throw(() => aerobus().root.subscribe({
            done: value
          })));
      });

      it('throws if @object.name is not a string', () => {
        [new Array, true, new Date, () => {}, 1, {}].forEach(value =>
          chai.assert.throw(() => aerobus().root.subscribe({
            name: value
          , next: () => {}
          })));
      });

      it('throws if @object does not contain "next" member', () => {
        chai.assert.throw(() => aerobus().root.subscribe({}));
      });

      it('throws if @object.next is not a function', () => {
        [new Array, true, new Date, 1, {}, 'test'].forEach(value =>
          chai.assert.throw(() => aerobus().root.subscribe({
            next: value
          })));
      });

      it('throws if @object.order is not a number', () => {
        [new Array, true, new Date, () => {}, {}, 'test'].forEach(value =>
          chai.assert.throw(() => aerobus().root.subscribe({
            next: () => {}
          , order: value
          })));
      });
    });

    describe('#subscribers', () => {
      it('is array', () => {
        chai.assert.isArray(aerobus().root.subscribers);
      });

      it('is initially empty', () => {
        chai.assert.strictEqual(aerobus().root.subscribers.length, 0);
      });

      it('is immutable', () => {
        let channel = aerobus().root
          , subscriber = () => {};
        channel.subscribe(subscriber);
        channel.subscribers.length = 0;
        chai.assert.strictEqual(channel.subscribers.length, 1);
        channel.subscribers[0] = null;
        chai.assert.strictEqual(channel.subscribers[0].next, subscriber);
      });
    });

    describe('#toggle()', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        chai.assert.strictEqual(channel.toggle(), channel);
      });

      it('disables enabled channel', () => {
        chai.assert.isFalse(aerobus().root.enable(true).toggle().enabled);
      });

      it('enables disabled channel', () => {
        chai.assert.isTrue(aerobus().root.enable(false).toggle().enabled);
      });
    });

    describe('#unsubscribe()', () => {
      it('is fluent', () => {
        let channel = aerobus().root;
        chai.assert.strictEqual(channel.unsubscribe(), channel);
      });
    });

    describe('#unsubscribe(@function)', () => {
      it('does not throw if @function has not been subscribed', () => {
        chai.assert.doesNotThrow(() => aerobus().root.unsubscribe(() => {}));
      });

      it('removes @function from #subscribers', () => {
        let channel = aerobus().root
          , subscriber = () => {};
        channel.subscribe(subscriber).unsubscribe(subscriber);
        chai.assert.strictEqual(channel.subscribers.length, 0);
      });

      it('prevents publication delivery to next subscriber when previous subscriber unsubscribes it', () => {
        let channel = aerobus().root
          , result = false
          , subscriber0 = () => result = true
          , subscriber1 = () => channel.unsubscribe(subscriber0);
        channel.subscribe(subscriber1, subscriber0).publish();
        chai.assert.isFalse(result);
      });

      it('does not break publication delivery when next subscriber unsubscribes previous', () => {
        let channel = aerobus().root
          , result = false
          , subscriber0 = () => {}
          , subscriber1 = () => channel.unsubscribe(subscriber0)
          , subscriber2 = () => result = true;
        channel.subscribe(subscriber0, subscriber1, subscriber2).publish();
        chai.assert.isTrue(result);
      });
    });

    describe('#unsubscribe(...@functions)', () => {
      it('removes all @functions from #subscribers', () => {
        let channel = aerobus().root
          , subscriber0 = () => {}
          , subscriber1 = () => {};
        channel.subscribe(subscriber0, subscriber1).unsubscribe(subscriber0, subscriber1);
        chai.assert.strictEqual(channel.subscribers.length, 0);
      });
    });

    describe('#unsubscribe(@object)', () => {
      it('does not throw if @object has not been subscribed', () => {
        chai.assert.doesNotThrow(() => aerobus().root.unsubscribe({}));
      });

      it('removes @object from #subscribers', () => {
        let channel = aerobus().root
          , subscriber = { next: () => {} };
        channel.subscribe(subscriber).unsubscribe(subscriber);
        chai.assert.strictEqual(channel.subscribers.length, 0);
      });

      it('invokes @object.done()', () => {
        let channel = aerobus().root
          , result
          , subscriber = {
              done: () => result = true
            , next: () => {}
            };
        channel.subscribe(subscriber).unsubscribe(subscriber);
        chai.assert.isTrue(result);
      });
    });

    describe('#unsubscribe(@string)', () => {
      it('does not throw if no #subscribers are named as @name', () => {
        chai.assert.doesNotThrow(() => aerobus().root.unsubscribe('test'));
      });

      it('removes all subscribers named as @string from  #subscribers', () => {
        let channel = aerobus().root
          , name = 'test'
          , subscriber0 = () => {}
          , subscriber1 = () => {};
        channel.subscribe(name, subscriber0).subscribe(subscriber1).unsubscribe(name);
        chai.assert.strictEqual(channel.subscribers.length, 1);
        chai.assert.strictEqual(channel.subscribers[0].next, subscriber1);
      });
    });

    describe('#unsubscribe(@subscriber)', () => {
      it('does not throw if @subscriber has not been subscribed', () => {
        let bus = aerobus()
          , channel0 = bus('test0')
          , channel1 = bus('test1');
        channel0.subscribe(() => {});
        chai.assert.doesNotThrow(() => channel1.unsubscribe(channel0.subscribers[0]));
      });

      it('removes @subscriber from #subscribers', () => {
        let channel = aerobus().root;
        channel
          .subscribe(() => {})
          .unsubscribe(channel.subscribers[0]);
        chai.assert.strictEqual(channel.subscribers.length, 0);
      })
    });
  });

  var messageTests = describe('Aerobus.Message', () => {
    describe('#cancel', () => {
      it('skips next subscriber when returned from previous subscriber', () => {
        let results = 0
          , canceller = (_, message) => message.cancel
          , subscriber = (_, message) => results++;
        aerobus().root.subscribe(canceller, subscriber).publish();
        chai.assert.strictEqual(results, 0);
      });

      it('skips subscriber of descendant channel when returned from subscriber of parent channel', () => {
        let channel = aerobus()('test')
          , results = 0
          , canceller = (_, message) => message.cancel
          , subscriber = (_, message) => results++;
        channel.parent.subscribe(canceller);
        channel.subscribe(subscriber).publish();
        chai.assert.strictEqual(results, 0);
      });
    });

    describe('#data', () => {
      it('gets published data', () => {
        let publication = {}
          , result
          , subscriber = (_, message) => result = message.data;
        aerobus().root.subscribe(subscriber).publish(publication);
        chai.assert.strictEqual(result, publication);
      });
    });

    describe('#destination', () => {
      it('gets channel name this message was delivered to', () => {
        let bus = aerobus()
          , channel = bus('test')
          , result
          , subscriber = (_, message) => result = message.destination;
        channel.subscribe(subscriber).publish();
        chai.assert.strictEqual(result, channel.name);
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
        chai.assert.include(results, root.name);
        chai.assert.include(results, parent.name);
        chai.assert.include(results, child.name);
      });
    });
  });

  var sectionTests = describe('Aerobus.Section', () => {
    describe('#channels', () => {
      it('is array', () => {
        chai.assert.isArray(aerobus()('test1', 'test2').channels);
      });

      it('gets array of all channels bound with this section', () => {
        let bus = aerobus()
          , channel0 = bus('test0')
          , channel1 = bus('test1')
          , section = bus('test0', 'test1');
        chai.assert.include(section.channels, channel0);
        chai.assert.include(section.channels, channel1);
      });
    });

    describe('#bubble()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.bubble(), section);
      });

      it('sets bubbles of all #channels', () => {
        let section = aerobus(false)('test1', 'test2');
        section.bubble();
        section.channels.forEach(channel => chai.assert.isTrue(channel.bubbles));
      });
    });

    describe('#bubble(false)', () => {
      it('clears bubbles of all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.bubble(false);
        section.channels.forEach(channel => chai.assert.isFalse(channel.bubbles));
      });
    });

    describe('#bubble(true)', () => {
      it('sets bubbles of all #channels', () => {
        let section = aerobus(false)('test1', 'test2');
        section.bubble(true);
        section.channels.forEach(channel => chai.assert.isTrue(channel.bubbles));
      });
    });

    describe('#clear()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.clear(), section);
      });

      it('clears subscribers of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , subscriber = () => {};
        section.channels.forEach(channel => channel.subscribe(subscriber));
        section.clear();
        section.channels.forEach(channel => chai.assert.strictEqual(channel.subscribers.length, 0));
      });
    });

    describe('#cycle()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.cycle(), section);
      });

      it('sets strategy of all #channels to instance of Aerobus.Strategy.Cycle', () => {
        let section = aerobus()('test1', 'test2');
        section.cycle();
        section.channels.forEach(channel => chai.assert.typeOf(channel.strategy, 'Aerobus.Strategy.Cycle'));
      });
    });

    describe('#enable()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.enable(), section);
      });

      it('enables all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.channels.forEach(channel => channel.enable(false));
        section.enable();
        section.channels.forEach(channel => chai.assert.isTrue(channel.enabled));
      });
    });

    describe('#enable(false)', () => {
      it('disables all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.enable(false);
        section.channels.forEach(channel => chai.assert.isFalse(channel.enabled));
      });
    });

    describe('#enable(true)', () => {
      it('enables all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.channels.forEach(channel => channel.enable(false));
        section.enable(true);
        section.channels.forEach(channel => chai.assert.isTrue(channel.enabled));
      });
    });

    describe('#forward(@function)', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.forward(() => {}), section);
      });

      it('adds @function to forwarders of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , forwarder = () => {};
        section.forward(forwarder);
        section.channels.forEach(channel => chai.assert.include(channel.forwarders, forwarder));
      });
    });

    describe('#forward(@string)', () => {
      it('adds @string to forwarders of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , forwarder = '';
        section.forward(forwarder);
        section.channels.forEach(channel => chai.assert.include(channel.forwarders, forwarder));
      });
    });

    describe('#forward(@function, @string)', () => {
      it('adds @string to forwarders of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , forwarder0 = () => {}
          , forwarder1 = '';
        section.forward(forwarder0, forwarder1);
        section.channels.forEach(channel => chai.assert.include(channel.forwarders, forwarder0));
        section.channels.forEach(channel => chai.assert.include(channel.forwarders, forwarder1));
      });
    });

    describe('#forward(!(@function || @string))', () => {
      let section = aerobus()('test1', 'test2');
      it('throws', () => {
        [new Array, true, new Date, 1, {}].forEach(value => 
          chai.assert.throw(() => section.forward(value)));
      });
    });

    describe('#publish()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.publish(), section);
      });

      it('notifies subscribers of all #channels in order of reference', () => {
        let bus = aerobus()
          , section = aerobus()('test1', 'test2')
          , results = []
          , subscriber0 = () => results.push('test1')
          , subscriber1 = () => results.push('test2');
        bus('test1').subscribe(subscriber0);
        bus('test2').subscribe(subscriber1);
        bus('test1', 'test2').publish();
        chai.assert.strictEqual(results[0], 'test1');
        chai.assert.strictEqual(results[1], 'test2');
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
        chai.assert.strictEqual(results[0].data, publication);
        chai.assert.strictEqual(results[0].destination, section.channels[0].name);
        chai.assert.strictEqual(results[1].data, publication);
        chai.assert.strictEqual(results[1].destination, section.channels[1].name);
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
        chai.assert.strictEqual(results[0], result0);
        chai.assert.strictEqual(results[1], result1);
      });
    });

    describe('#shuffle()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.shuffle(), section);
      });

      it('sets strategy of all #channels to instance of Aerobus.Strategy.Shuffle', () => {
        let section = aerobus()('test1', 'test2');
        section.shuffle();
        section.channels.forEach(channel => chai.assert.typeOf(channel.strategy, 'Aerobus.Strategy.Shuffle'));
      });
    });

    describe('#subscribe()', () => {
      it('throws', () => {
        chai.assert.throw(() => aerobus()('test1', 'test2').subscribe());
      });
    });

    describe('#subscribe(@function)', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.subscribe(() => {}), section);
      });

      it('adds @function to subscribers of all #channels', () => {
        let section = aerobus()('test1', 'test2')
          , subscriber = () => {};
        section.subscribe(subscriber);
        section.channels.forEach(
          channel => chai.assert.include(
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
          chai.assert.include(channel.subscribers.map(existing => existing.next), subscriber0);
          chai.assert.include(channel.subscribers.map(existing => existing.next), subscriber1);
        });
      });
    });

    describe('#toggle()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.toggle(), section);
      });

      it('disables all enabled #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.enable(true).toggle();
        section.channels.forEach(channel => chai.assert.isFalse(channel.enabled));
      });

      it('enables all disabled #channels', () => {
        let section = aerobus()('test1', 'test2');
        section.enable(false).toggle();
        section.channels.forEach(channel => chai.assert.isTrue(channel.enabled));
      });
    });

    describe('#unsubscribe()', () => {
      it('is fluent', () => {
        let section = aerobus()('test1', 'test2');
        chai.assert.strictEqual(section.unsubscribe(), section);
      });

      it('removes all subscribers of all #channels', () => {
        let section = aerobus()('test1', 'test2');
        section
          .subscribe(() => {}, () => {})
          .unsubscribe();
        section.channels.forEach(channel => chai.assert.strictEqual(channel.subscribers.length, 0));
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
          channel => chai.assert.notInclude(
            channel.subscribers.map(existing => existing.next)
          , subscriber));
      });
    });
  });

  exports.sectionTests = sectionTests;
  exports.messageTests = messageTests;
  exports.channelTests = channelTests;
  exports.aerobusInstanceTests = aerobusInstanceTests;
  exports.aerobusFactoryTests = aerobusFactoryTests;

}));