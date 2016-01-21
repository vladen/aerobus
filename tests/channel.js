'use strict';

export default (aerobus, assert) => describe('Aerobus.Channel', () => {
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

    it('cancels cycle strategy of this channel', () => {
      let channel = aerobus().root;
      let result0 = 0
        , result1 = 0
        , result2 = 0
        , subscriber0 = () => ++result0
        , subscriber1 = () => ++result1
        , subscriber2 = () => ++result2
        ;
      channel.cycle(2)
        .subscribe(subscriber0, subscriber1, subscriber2)
        .publish();
      assert.strictEqual(channel.strategy.name, 'cycle');

      channel.cycle(0)
        .publish();
      assert.isUndefined(channel.strategy);

      assert.strictEqual(result0, 2);
      assert.strictEqual(result1, 2);
      assert.strictEqual(result2, 1);
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
