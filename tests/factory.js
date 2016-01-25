'use strict';

export default (aerobus, assert) => describe('aerobus', () => {
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
