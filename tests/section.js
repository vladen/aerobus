'use strict';

import { assert } from 'chai';
import aerobus from 'aerobus';

export default describe('Aerobus.Section', () => {
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
        , section = aerobus()('test1', 'test2')
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