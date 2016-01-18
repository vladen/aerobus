'use strict';

import { assert } from 'chai';
import aerobus from 'aerobus';

export default describe('Aerobus.Message', () => {
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
