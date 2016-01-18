'use strict';

import { assert } from 'chai';
import aerobus from 'aerobus';

export default describe('Aerobus.Iterator', () => {
  describe('#done()', () => {
    it('rejects pending promise', done => {
      let iterator = aerobus().root[Symbol.iterator]();
      iterator.next().value.then(() => {}, done);
      iterator.done();
    });
  });

  describe('#next()', () => {
    it('returns @object', () => {
      let iterator = aerobus().root[Symbol.iterator]();
      assert.isObject(iterator.next());
    });

    describe('@object.done', () => {
      it('is initially undefined', () => {
        let iterator = aerobus().root[Symbol.iterator]();
        assert.isUndefined(iterator.next().done);
      });

      it('is true after iterator has been done', () => {
        let iterator = aerobus().root[Symbol.iterator]();
        iterator.done();
        assert.isTrue(iterator.next().done);
      });
    });

    describe('@object.value', () => {
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

      it('is undefined after iterator has been done', () => {
        let iterator = aerobus().root[Symbol.iterator]();
        iterator.done();
        assert.isUndefined(iterator.next().value);
      });
    });
  });
});
