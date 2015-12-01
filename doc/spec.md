# TOC
   - [aerobus](#aerobus)
   - [aerobus()](#aerobus)
     - [.channels](#aerobus-channels)
     - [.clear()](#aerobus-clear)
     - [.delimiter](#aerobus-delimiter)
     - [.error](#aerobus-error)
     - [.root](#aerobus-root)
     - [.trace](#aerobus-trace)
     - [.unsubscribe()](#aerobus-unsubscribe)
   - [aerobus(@function)](#aerobusfunction)
     - [.trace](#aerobusfunction-trace)
   - [aerobus("")](#aerobus)
   - [aerobus(@string)](#aerobusstring)
   - [aerobus(@object)](#aerobusobject)
   - [aerobus(@function, @string)](#aerobusfunction-string)
   - [aerobus(...)()](#aerobus)
   - [aerobus(...)("")](#aerobus)
   - [aerobus(...)("error")](#aerobuserror)
   - [aerobus(...)(@string)](#aerobusstring)
   - [aerobus(...)(@array)](#aerobusarray)
   - [aerobus(...)(@boolean)](#aerobusboolean)
   - [aerobus(...)(@date)](#aerobusdate)
   - [aerobus(...)(@number)](#aerobusnumber)
   - [aerobus(...)(@object)](#aerobusobject)
   - [aerobus(...)(@string0, @string1)](#aerobusstring0-string1)
   - [aerobus(...)(@number, @string)](#aerobusnumber-string)
   - [aerobus(...)(@string, @object)](#aerobusstring-object)
   - [Aerobus.Channel](#aerobuschannel)
     - [.bus](#aerobuschannel-bus)
     - [.clear()](#aerobuschannel-clear)
     - [.disable()](#aerobuschannel-disable)
     - [.enable()](#aerobuschannel-enable)
     - [.enable(false)](#aerobuschannel-enablefalse)
     - [.enable(true)](#aerobuschannel-enabletrue)
     - [.isEnabled](#aerobuschannel-isenabled)
     - [.[Symbol.iterator]](#aerobuschannel-symboliterator)
     - [.[Symbol.iterator] ()](#aerobuschannel-symboliterator-)
     - [.name](#aerobuschannel-name)
     - [.parent](#aerobuschannel-parent)
     - [.publish()](#aerobuschannel-publish)
     - [.publish(@any)](#aerobuschannel-publishany)
     - [.publish(@any, @function)](#aerobuschannel-publishany-function)
     - [.retain()](#aerobuschannel-retain)
     - [.retain(false)](#aerobuschannel-retainfalse)
     - [.retain(true)](#aerobuschannel-retaintrue)
     - [.retain(@number)](#aerobuschannel-retainnumber)
     - [.reset()](#aerobuschannel-reset)
     - [.retentions](#aerobuschannel-retentions)
     - [.retentions.limit](#aerobuschannel-retentionslimit)
     - [.subscribe()](#aerobuschannel-subscribe)
     - [.subscribe(@function)](#aerobuschannel-subscribefunction)
     - [.subscribe(@function0, @function1)](#aerobuschannel-subscribefunction0-function1)
     - [.subscriptions](#aerobuschannel-subscriptions)
     - [.toggle()](#aerobuschannel-toggle)
     - [.unsubscribe()](#aerobuschannel-unsubscribe)
     - [.unsubscribe(@function)](#aerobuschannel-unsubscribefunction)
     - [.unsubscribe(@function0, @function1)](#aerobuschannel-unsubscribefunction0-function1)
   - [Aerobus.Iterator](#aerobusiterator)
     - [.done()](#aerobusiterator-done)
     - [.next()](#aerobusiterator-next)
     - [.next().done](#aerobusiterator-nextdone)
     - [.next().value](#aerobusiterator-nextvalue)
   - [Aerobus.Message](#aerobusmessage)
     - [.channel](#aerobusmessage-channel)
     - [.data](#aerobusmessage-data)
     - [.error property:](#aerobusmessage-error-property)
   - [Aerobus.Section](#aerobussection)
     - [.bus](#aerobussection-bus)
     - [.channels](#aerobussection-channels)
     - [.clear()](#aerobussection-clear)
     - [.disable()](#aerobussection-disable)
     - [.enable()](#aerobussection-enable)
     - [.publish()](#aerobussection-publish)
     - [.publish(@object)](#aerobussection-publishobject)
     - [.subscribe()](#aerobussection-subscribe)
     - [.subscribe(@function)](#aerobussection-subscribefunction)
     - [.subscribe(@function0, @function1)](#aerobussection-subscribefunction0-function1)
     - [.toggle()](#aerobussection-toggle)
     - [.unsubscribe()](#aerobussection-unsubscribe)
     - [.unsubscribe(@function)](#aerobussection-unsubscribefunction)
<a name=""></a>
 
<a name="aerobus"></a>
# aerobus
is function.

```js
assert.isFunction(aerobus);
```

<a name="aerobus"></a>
# aerobus()
is function.

```js
var bus = aerobus();
assert.isFunction(bus);
```

<a name="aerobus-channels"></a>
## .channels
is array.

```js
assert.isArray(aerobus().channels);
```

is empty array by default.

```js
assert.strictEqual(aerobus().channels.length, 0);
```

contains error channel after it is created.

```js
var bus = aerobus(),
    channel = bus.error;
assert.include(bus.channels, channel);
```

contains root channel after it is created.

```js
var bus = aerobus(),
    channel = bus.root;
assert.include(bus.channels, channel);
```

contains custom channel after it is created.

```js
var bus = aerobus(),
    channel = bus('test');
assert.include(bus.channels, channel);
```

contains several channels after they are created.

```js
var bus = aerobus(),
    channel0 = bus.root,
    channel1 = bus.error,
    channel2 = bus('test');
assert.include(bus.channels, channel0);
assert.include(bus.channels, channel1);
assert.include(bus.channels, channel2);
```

<a name="aerobus-clear"></a>
## .clear()
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.clear(), bus);
```

removes all channels.

```js
var bus = aerobus(),
    channel0 = bus.root,
    channel1 = bus.error,
    channel2 = bus('test');
bus.clear();
assert.strictEqual(bus.channels.length, 0);
assert.notInclude(bus.channels, channel0);
assert.notInclude(bus.channels, channel1);
assert.notInclude(bus.channels, channel2);
```

<a name="aerobus-delimiter"></a>
## .delimiter
is string.

```js
assert.isString(aerobus().delimiter);
```

is writable when bus is empty.

```js
var delimiter = ':',
    bus = aerobus();
bus.delimiter = delimiter;
assert.strictEqual(bus.delimiter, delimiter);
```

is not writable when bus is not empty.

```js
var delimiter = ':',
    bus = aerobus();
bus('test');
assert.throw(function () {
  return bus.delimiter = delimiter;
});
```

is writable again after bus has been cleared.

```js
var delimiter = ':',
    bus = aerobus();
bus('test');
bus.clear();
assert.doesNotThrow(function () {
  return bus.delimiter = delimiter;
});
```

<a name="aerobus-error"></a>
## .error
is instance of Aerobus.Channel.

```js
assert.typeOf(aerobus().error, 'Aerobus.Channel');
```

notifies own subscription with error thrown by subscription of other channel.

```js
var bus = aerobus(),
    channel = bus('test'),
    error = new Error();
bus.error.subscribe(function (thrown) {
  assert.strictEqual(thrown, error);
  done();
});
channel.subscribe(function () {
  throw error;
});
channel.publish();
```

throws if own subscription throws.

```js
var bus = aerobus(),
    error = new Error();
bus.error.subscribe(function () {
  throw error;
});
assert.throw(function () {
  return bus.error.publish();
});
```

<a name="aerobus-root"></a>
## .root
is instance of Aerobus.Channel.

```js
assert.typeOf(aerobus().root, 'Aerobus.Channel');
```

notifies own subscription with publication of descendant channel.

```js
var bus = aerobus(),
    invocations = 0;
bus.root.subscribe(function () {
  return ++invocations;
});
bus('test').publish();
setImmediate(function () {
  assert.strictEqual(invocations, 1);
  done();
});
```

<a name="aerobus-trace"></a>
## .trace
is function.

```js
var bus = aerobus();
assert.isFunction(bus.trace);
```

is writable when bus is empty.

```js
var trace = function trace() {},
    bus = aerobus();
bus.trace = trace;
assert.strictEqual(bus.trace, trace);
```

is not writable when bus is not empty.

```js
var trace = function trace() {},
    bus = aerobus();
bus('test');
assert.throw(function () {
  return bus.trace = trace;
});
```

is writable again after bus has been cleared.

```js
var trace = function trace() {},
    bus = aerobus();
bus('test');
bus.clear();
assert.doesNotThrow(function () {
  return bus.trace = trace;
});
```

<a name="aerobus-unsubscribe"></a>
## .unsubscribe()
is fluent.

```js
var bus = aerobus(),
    subscription = function subscription() {};
assert.strictEqual(bus.unsubscribe(subscription), bus);
```

removes subscription from channel.

```js
var bus = aerobus(),
    channel = bus('test'),
    subscription = function subscription() {};
channel.subscribe(subscription);
bus.unsubscribe(subscription);
assert.notInclude(channel.subscriptions, subscription);
```

removes many subscriptions from channel.

```js
var bus = aerobus(),
    channel = bus('test'),
    subscriber1 = function subscriber1() {},
    subscriber2 = function subscriber2() {};
channel.subscribe(subscriber1, subscriber2);
bus.unsubscribe(subscriber1, subscriber2);
assert.notInclude(channel.subscriptions, subscriber1);
assert.notInclude(channel.subscriptions, subscriber2);
```

removes subscription from many channels.

```js
var bus = aerobus(),
    channel1 = bus('test1'),
    channel2 = bus('test2'),
    subscription = function subscription() {};
channel1.subscribe(subscription);
channel2.subscribe(subscription);
bus.unsubscribe(subscription);
assert.notInclude(channel1.subscriptions, subscription);
assert.notInclude(channel2.subscriptions, subscription);
```

<a name="aerobusfunction"></a>
# aerobus(@function)
is a function.

```js
var bus = aerobus(function () {});
assert.isFunction(bus);
```

<a name="aerobusfunction-trace"></a>
## .trace
gets @function.

```js
var trace = function trace() {},
    bus = aerobus(trace);
assert.strictEqual(bus.trace, trace);
```

<a name="aerobus"></a>
# aerobus("")
throws error.

```js
assert.throw(function () {
  return aerobus('');
});
```

<a name="aerobusstring"></a>
# aerobus(@string)
is function.

```js
assert.isFunction(aerobus(':'));
```

.delimiter.

```js
it('gets @string', function () {
  var delimiter = ':',
      bus = aerobus(delimiter);
  assert.strictEqual(bus.delimiter, delimiter);
});
```

<a name="aerobusobject"></a>
# aerobus(@object)
is function.

```js
assert.isFunction(aerobus({}));
```

~Aerobus.Channel.

```js
it('instances extended with @object.channel', function () {
  var extension = function extension() {},
      bus = aerobus({
    channel: { extension: extension }
  });
  assert.strictEqual(bus.root.extension, extension);
  assert.strictEqual(bus.error.extension, extension);
  assert.strictEqual(bus('test').extension, extension);
});
```

~Aerobus.Message.

```js
it('instances extended with @object.message', function (done) {
  var extension = function extension() {},
      bus = aerobus({
    message: { extension: extension }
  });
  bus.root.subscribe(function (data, message) {
    assert.strictEqual(message.extension, extension);
    done();
  });
  bus.root.publish();
});
```

~Aerobus.Section.

```js
it('instances extended with @object.section', function () {
  var extension = function extension() {},
      bus = aerobus({
    section: { extension: extension }
  });
  assert.strictEqual(bus('', 'test').extension, extension);
});
```

<a name="aerobusfunction-string"></a>
# aerobus(@function, @string)
is function.

```js
var bus = aerobus(':', function () {});
assert.isFunction(bus);
```

.delimiter gets @string.

```js
var delimiter = ':',
    bus = aerobus(delimiter, function () {});
assert.strictEqual(bus.delimiter, delimiter);
```

.trace gets @function.

```js
var trace = function trace() {},
    bus = aerobus(':', trace);
assert.strictEqual(bus.trace, trace);
```

<a name="aerobus"></a>
# aerobus(...)()
is instance of Aerobus.Channel.

```js
var bus = aerobus();
assert.typeOf(bus(), 'Aerobus.Channel');
```

is root channel (equals to .bus.root).

```js
var channel = aerobus()();
assert.strictEqual(channel, channel.bus.root);
```

<a name="aerobus"></a>
# aerobus(...)("")
is instance of Aerobus.Channel.

```js
var bus = aerobus();
assert.typeOf(bus(''), 'Aerobus.Channel');
```

is root channel (equals to .bus.root).

```js
var channel = aerobus()('');
assert.strictEqual(channel, channel.bus.root);
```

.name gets "".

```js
var bus = aerobus(),
    name = '';
assert.strictEqual(bus(name).name, name);
```

<a name="aerobuserror"></a>
# aerobus(...)("error")
is instance of Aerobus.Channel.

```js
var bus = aerobus();
assert.typeOf(bus('error'), 'Aerobus.Channel');
```

is error channel (equals to .bus.error).

```js
var channel = aerobus()('error');
assert.strictEqual(channel, channel.bus.error);
```

.name gets "error".

```js
var bus = aerobus(),
    name = 'error';
assert.strictEqual(bus(name).name, name);
```

<a name="aerobusstring"></a>
# aerobus(...)(@string)
is instance of Aerobus.Channel.

```js
var bus = aerobus();
assert.typeOf(bus('test'), 'Aerobus.Channel');
```

.name gets @string.

```js
var bus = aerobus(),
    name = 'test';
assert.strictEqual(bus(name).name, name);
```

<a name="aerobusarray"></a>
# aerobus(...)(@array)
throws.

```js
assert.throw(function () {
  return aerobus()([]);
});
```

<a name="aerobusboolean"></a>
# aerobus(...)(@boolean)
throws.

```js
assert.throw(function () {
  return aerobus()(true);
});
```

<a name="aerobusdate"></a>
# aerobus(...)(@date)
throws.

```js
assert.throw(function () {
  return aerobus()(new Date());
});
```

<a name="aerobusnumber"></a>
# aerobus(...)(@number)
throws.

```js
assert.throw(function () {
  return aerobus()(42);
});
```

<a name="aerobusobject"></a>
# aerobus(...)(@object)
throws.

```js
assert.throw(function () {
  return aerobus()({});
});
```

<a name="aerobusstring0-string1"></a>
# aerobus(...)(@string0, @string1)
is instance of Aerobus.Section.

```js
assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
```

contains specified channels (.channels[0].name === @string0).

```js
var names = ['test1', 'test2'],
    section = aerobus().apply(undefined, names);
assert.strictEqual(section.channels[0].name, names[0]);
assert.strictEqual(section.channels[1].name, names[1]);
```

<a name="aerobusnumber-string"></a>
# aerobus(...)(@number, @string)
throws.

```js
assert.throw(function () {
  return aerobus()(42, '');
});
```

<a name="aerobusstring-object"></a>
# aerobus(...)(@string, @object)
throws.

```js
assert.throw(function () {
  return aerobus()('', {});
});
```

<a name="aerobuschannel"></a>
# Aerobus.Channel
<a name="aerobuschannel-bus"></a>
## .bus
is parent bus.

```js
var bus = aerobus();
assert.strictEqual(bus('test').bus, bus);
assert.strictEqual(bus.error.bus, bus);
assert.strictEqual(bus.root.bus, bus);
```

<a name="aerobuschannel-clear"></a>
## .clear()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.clear(), channel);
```

clears .retentions.

```js
var channel = aerobus().root;
channel.retain().publish().clear();
assert.strictEqual(channel.retentions.length, 0);
```

clears .subscriptions.

```js
var channel = aerobus().root;
channel.subscribe(function () {}).clear();
assert.strictEqual(channel.subscriptions.length, 0);
```

<a name="aerobuschannel-disable"></a>
## .disable()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.disable(), channel);
```

disables channel.

```js
var channel = aerobus().root;
channel.disable();
assert.isFalse(channel.isEnabled);
```

supresses publication delivery.

```js
var channel = aerobus().root,
    invocations = 0;
channel.subscribe(function () {
  return ++invocations;
}).disable().publish();
setImmediate(function () {
  assert.strictEqual(invocations, 0);
  done();
});
```

supresses publication delivery to descendant channel.

```js
var channel = aerobus()('parent.child'),
    invocations = 0;
channel.subscribe(function () {
  return ++invocations;
}).parent.disable();
channel.publish();
setImmediate(function () {
  assert.strictEqual(invocations, 0);
  done();
});
```

<a name="aerobuschannel-enable"></a>
## .enable()
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.root.enable(), bus.root);
```

enables channel.

```js
assert.isTrue(aerobus().root.disable().enable().isEnabled);
```

resumes publication delivery.

```js
var channel = aerobus().root,
    invocations = 0;
channel.subscribe(function () {
  return ++invocations;
}).disable().enable().publish();
setImmediate(function () {
  assert.strictEqual(invocations, 1);
  done();
});
```

<a name="aerobuschannel-enablefalse"></a>
## .enable(false)
disables channel.

```js
assert.isFalse(aerobus().root.enable(false).isEnabled);
```

<a name="aerobuschannel-enabletrue"></a>
## .enable(true)
enables channel.

```js
assert.isTrue(aerobus().root.disable().enable(true).isEnabled);
```

<a name="aerobuschannel-isenabled"></a>
## .isEnabled
is boolean.

```js
assert.isBoolean(aerobus().root.isEnabled);
```

is true by default.

```js
assert.isTrue(aerobus().root.isEnabled);
```

is false when channel is disabled.

```js
var channel = aerobus()('test');
channel.parent.disable();
assert.isFalse(channel.isEnabled);
```

is true after channel has been enabled.

```js
var channel = aerobus()('test');
channel.parent.disable().enable();
assert.isTrue(channel.isEnabled);
```

<a name="aerobuschannel-symboliterator"></a>
## .[Symbol.iterator]
is function.

```js
assert.isFunction(aerobus().root[Symbol.iterator]);
```

<a name="aerobuschannel-symboliterator-"></a>
## .[Symbol.iterator] ()
is instance of Aerobus.Iterator.

```js
assert.typeOf(aerobus().root[Symbol.iterator](), 'Aerobus.Iterator');
```

<a name="aerobuschannel-name"></a>
## .name
is string.

```js
assert.isString(aerobus().root.name);
```

is "error" string for error channel.

```js
assert.strictEqual(aerobus().error.name, 'error');
```

is empty string for root channel.

```js
assert.strictEqual(aerobus().root.name, '');
```

<a name="aerobuschannel-parent"></a>
## .parent
is instance of Aerobus.Channel for custom channel.

```js
assert.typeOf(aerobus()('test').parent, 'Aerobus.Channel');
```

is root channel for first level channel.

```js
var bus = aerobus(),
    channel = bus('test');
assert.strictEqual(channel.parent, bus.root);
```

is not root channel for second level channel.

```js
var bus = aerobus(),
    parent = 'parent',
    child = 'child',
    channel = bus(parent + bus.delimiter + child);
assert.strictEqual(channel.parent.name, parent);
```

is undefined for error channel.

```js
assert.isUndefined(aerobus().error.parent);
```

is undefined for root channel.

```js
assert.isUndefined(aerobus().root.parent);
```

<a name="aerobuschannel-publish"></a>
## .publish()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.publish(), channel);
```

notifies own subscription.

```js
aerobus().root.subscribe(done).publish();
```

notifies own subscriptions in subcription order .

```js
var order = 0;
aerobus().root.subscribe(function () {
  assert.strictEqual(++order, 1);
}, function () {
  assert.strictEqual(++order, 2);
  done();
}).publish();
```

notifies ancestor subscriptions before own subscription.

```js
var channel = aerobus()('parent.child'),
    order = 0;
channel.parent.parent.subscribe(function () {
  assert.strictEqual(++order, 1);
});
channel.parent.subscribe(function () {
  assert.strictEqual(++order, 2);
});
channel.subscribe(function () {
  assert.strictEqual(++order, 3);
  done();
});
channel.publish();
```

<a name="aerobuschannel-publishany"></a>
## .publish(@any)
notifies own subscription with @any.

```js
var data = {};
aerobus().root.subscribe(function (value) {
  assert.strictEqual(value, data);
  done();
}).publish(data);
```

notifies own and ancestor subscriptions with @any.

```js
var channel = aerobus()('parent.child'),
    count = 0,
    data = {};
channel.parent.parent.subscribe(function (value) {
  assert.strictEqual(value, data);
  if (++count === 3) done();
});
channel.parent.subscribe(function (value) {
  assert.strictEqual(value, data);
  if (++count === 3) done();
});
channel.subscribe(function (value) {
  assert.strictEqual(value, data);
  if (++count === 3) done();
});
channel.publish(data);
```

<a name="aerobuschannel-publishany-function"></a>
## .publish(@any, @function)
invokes @function with array containing result returned from own subscription.

```js
var channel = aerobus()('parent.child'),
    result = {};
channel.subscribe(function () {
  return result;
}).publish(null, function (results) {
  assert.include(results, result);
  done();
});
```

invokes @function with array containing results returned from own subscriptions.

```js
var channel = aerobus()('parent.child'),
    result0 = {},
    result1 = {};
channel.subscribe(function () {
  return result0;
}, function () {
  return result1;
}).publish(null, function (results) {
  assert.include(results, result0);
  assert.include(results, result1);
  done();
});
```

invokes @function with array containing result returned from parent subscription.

```js
var channel = aerobus()('parent.child'),
    result = {};
channel.parent.subscribe(function () {
  return result;
});
channel.publish(null, function (results) {
  assert.include(results, result);
  done();
});
```

invokes @callback with array containing results returned from own and parent parent subscriptions.

```js
var channel = aerobus()('parent.child'),
    result0 = {},
    result1 = {};
channel.parent.subscribe(function () {
  return result0;
});
channel.subscribe(function () {
  return result1;
}).publish(null, function (results) {
  assert.include(results, result0);
  assert.include(results, result1);
  done();
});
```

<a name="aerobuschannel-retain"></a>
## .retain()
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.root.retain(), bus.root);
```

sets .retentions.limit property to Number.MAX_SAFE_INTEGER.

```js
var channel = aerobus().root;
channel.retain();
assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
```

notifies all subsequent subscribtions with all retained publications immediately.

```js
var channel = aerobus().root,
    publication0 = {},
    publication1 = {},
    expectations0 = [publication0, publication1],
    expectations1 = [publication0, publication1];
channel.retain().publish(publication0).publish(publication1).subscribe(function (data) {
  assert.strictEqual(data, expectations0.shift());
}).subscribe(function (data) {
  assert.strictEqual(data, expectations1.shift());
});
setImmediate(function () {
  assert.strictEqual(expectations0.length, 0);
  assert.strictEqual(expectations1.length, 0);
  done();
});
```

<a name="aerobuschannel-retainfalse"></a>
## .retain(false)
sets .retentions.limit to 0.

```js
var channel = aerobus().root;
channel.retain(false);
assert.strictEqual(channel.retentions.limit, 0);
```

clears .retentions.

```js
var channel = aerobus().root,
    data1 = {},
    data2 = {};
channel.retain().publish(data1).publish(data2).retain(0);
assert.strictEqual(channel.retentions.length, 0);
```

<a name="aerobuschannel-retaintrue"></a>
## .retain(true)
sets .retentions.limit to Number.MAX_SAFE_INTEGER.

```js
var channel = aerobus().root;
channel.retain(true);
assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
```

<a name="aerobuschannel-retainnumber"></a>
## .retain(@number)
sets .retentions.limit to @number.

```js
var limit = 42,
    channel = aerobus().root;
channel.retain(limit);
assert.strictEqual(channel.retentions.limit, limit);
```

<a name="aerobuschannel-reset"></a>
## .reset()
is be fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.reset(), channel);
```

enables channel (sets .isEnabled to true).

```js
var channel = aerobus().root;
channel.disable().reset();
assert.isTrue(channel.isEnabled);
```

clears .retentions.

```js
var channel = aerobus().root;
channel.retain().publish().reset();
assert.strictEqual(channel.retentions.length, 0);
```

resets .retentions.limit.

```js
var channel = aerobus().root;
channel.retain().publish().reset();
assert.strictEqual(channel.retentions.limit, 0);
```

clears .subscriptions.

```js
var channel = aerobus().root;
channel.subscribe(function () {}).reset();
assert.strictEqual(channel.subscriptions.length, 0);
```

<a name="aerobuschannel-retentions"></a>
## .retentions
is array.

```js
assert.isArray(aerobus().root.retentions);
```

contains one latest publication when limited to 1.

```js
var channel = aerobus().root,
    data1 = {},
    data2 = {};
channel.retain(1).publish(data1).publish(data2);
assert.strictEqual(channel.retentions.length, 1);
assert.strictEqual(channel.retentions[0].data, data2);
```

contains two latest publications when limited to 2.

```js
var channel = aerobus().root,
    data1 = {},
    data2 = {},
    data3 = {};
channel.retain(2).publish(data1).publish(data2).publish(data3);
assert.strictEqual(channel.retentions.length, 2);
assert.strictEqual(channel.retentions[0].data, data2);
assert.strictEqual(channel.retentions[1].data, data3);
```

<a name="aerobuschannel-retentionslimit"></a>
## .retentions.limit
is number.

```js
assert.isNumber(aerobus().root.retentions.limit);
```

<a name="aerobuschannel-subscribe"></a>
## .subscribe()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.subscribe(), channel);
```

<a name="aerobuschannel-subscribefunction"></a>
## .subscribe(@function)
adds @function to .subscriptions.

```js
var channel = aerobus().root,
    subscription = function subscription() {};
channel.subscribe(subscription);
assert.include(channel.subscriptions, subscription);
```

<a name="aerobuschannel-subscribefunction0-function1"></a>
## .subscribe(@function0, @function1)
adds @function0 and @function1 to .subscriptions.

```js
var channel = aerobus().root,
    subscribtion0 = function subscribtion0() {},
    subscribtion1 = function subscribtion1() {};
channel.subscribe(subscribtion0, subscribtion1);
assert.include(channel.subscriptions, subscribtion0);
assert.include(channel.subscriptions, subscribtion1);
```

<a name="aerobuschannel-subscriptions"></a>
## .subscriptions
is array.

```js
assert.isArray(aerobus().root.subscriptions);
```

is empty array by default.

```js
assert.strictEqual(aerobus().root.subscriptions.length, 0);
```

<a name="aerobuschannel-toggle"></a>
## .toggle()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.toggle(), channel);
```

disables enabled channel.

```js
assert.isFalse(aerobus().root.toggle().isEnabled);
```

enables disabled channel.

```js
assert.isTrue(aerobus().root.disable().toggle().isEnabled);
```

<a name="aerobuschannel-unsubscribe"></a>
## .unsubscribe()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.unsubscribe(), channel);
```

<a name="aerobuschannel-unsubscribefunction"></a>
## .unsubscribe(@function)
removes @function from .subscriptions.

```js
var channel = aerobus().root,
    subscriber1 = function subscriber1() {},
    subscriber2 = function subscriber2() {};
channel.subscribe(subscriber1, subscriber2).unsubscribe(subscriber1, subscriber2);
assert.notInclude(channel.subscriptions, subscriber1);
assert.notInclude(channel.subscriptions, subscriber2);
```

<a name="aerobuschannel-unsubscribefunction0-function1"></a>
## .unsubscribe(@function0, @function1)
removes @function0 and @function1 from .subscriptions.

```js
var channel = aerobus().root,
    subscribtion0 = function subscribtion0() {},
    subscribtion1 = function subscribtion1() {};
channel.subscribe(subscribtion0, subscribtion1).unsubscribe(subscribtion0, subscribtion1);
assert.notInclude(channel.subscriptions, subscribtion0);
assert.notInclude(channel.subscriptions, subscribtion1);
```

<a name="aerobusiterator"></a>
# Aerobus.Iterator
<a name="aerobusiterator-done"></a>
## .done()
rejects pending promise returned from iterator.

```js
var iterator = aerobus().root[Symbol.iterator]();
iterator.next().value.then(function () {}, done);
iterator.done();
```

<a name="aerobusiterator-next"></a>
## .next()
returns object.

```js
var iterator = aerobus().root[Symbol.iterator]();
assert.isObject(iterator.next());
```

<a name="aerobusiterator-nextdone"></a>
## .next().done
is undefined by default.

```js
var iterator = aerobus().root[Symbol.iterator]();
assert.isUndefined(iterator.next().done);
```

is true after iterator is .done().

```js
var iterator = aerobus().root[Symbol.iterator]();
iterator.done();
assert.isTrue(iterator.next().done);
```

<a name="aerobusiterator-nextvalue"></a>
## .next().value
is Promise.

```js
var iterator = aerobus().root[Symbol.iterator]();
assert.typeOf(iterator.next().value, 'Promise');
```

is pending promise without preceeding publication.

```js
var iterator = aerobus().root[Symbol.iterator](),
    pending = {};
Promise.race([iterator.next().value, Promise.resolve(pending)]).then(function (value) {
  assert.strictEqual(value, pending);
  done();
});
```

is resolved promise with preceeding publication.

```js
var channel = aerobus().root,
    data = {},
    iterator = channel[Symbol.iterator]();
channel.publish(data);
Promise.race([iterator.next().value, Promise.resolve()]).then(function (value) {
  assert.strictEqual(value.data, data);
  done();
});
```

resolves after publication to channel.

```js
var channel = aerobus().root,
    iterator = channel[Symbol.iterator](),
    invocations = 0;
iterator.next().value.then(function () {
  return ++invocations;
});
assert.strictEqual(invocations, 0);
channel.publish();
setImmediate(function (message) {
  assert.strictEqual(invocations, 1);
  done();
});
```

resolves with Aerobus.Message instance.

```js
var channel = aerobus().root,
    iterator = channel[Symbol.iterator]();
iterator.next().value.then(function (message) {
  assert.typeOf(message, 'Aerobus.Message');
  done();
});
channel.publish();
```

resolves with message.data returning published data.

```js
var channel = aerobus().root,
    data = {},
    iterator = channel[Symbol.iterator]();
iterator.next().value.then(function (message) {
  assert.strictEqual(message.data, data);
  done();
});
channel.publish(data);
```

<a name="aerobusmessage"></a>
# Aerobus.Message
<a name="aerobusmessage-channel"></a>
## .channel
gets name of channel it was published to.

```js
var bus = aerobus(),
    error = bus.error,
    root = bus.root,
    test = bus('test'),
    pending = 3;
error.subscribe(function (_, message) {
  assert.strictEqual(message.channel, error.name);
  if (! --pending) done();
}).publish();
root.subscribe(function (_, message) {
  assert.strictEqual(message.channel, root.name);
  if (! --pending) done();
}).publish();
test.subscribe(function (_, message) {
  assert.strictEqual(message.channel, test.name);
  if (! --pending) done();
}).publish();
```

<a name="aerobusmessage-data"></a>
## .data
gets published data.

```js
var data = {};
aerobus().root.subscribe(function (_, message) {
  assert.strictEqual(message.data, data);
  done();
}).publish(data);
```

<a name="aerobusmessage-error-property"></a>
## .error property:
gets error caught in subscription.

```js
var bus = aerobus(),
    error = new Error();
bus.error.subscribe(function (_, message) {
  assert.strictEqual(message.error, error);
  done();
});
bus.root.subscribe(function () {
  throw error;
}).publish();
```

<a name="aerobussection"></a>
# Aerobus.Section
<a name="aerobussection-bus"></a>
## .bus
gets parent bus.

```js
var bus = aerobus();
assert.strictEqual(bus('test1', 'test2').bus, bus);
```

<a name="aerobussection-channels"></a>
## .channels
is array.

```js
assert.isArray(aerobus()('test1', 'test2').channels);
```

contains all bound channels.

```js
var bus = aerobus(),
    channel0 = bus('test0'),
    channel1 = bus('test1'),
    section = bus('test0', 'test1');
assert.include(section.channels, channel0);
assert.include(section.channels, channel1);
```

<a name="aerobussection-clear"></a>
## .clear()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.clear(), section);
```

clears all bound channels.

```js
var section = aerobus()('test1', 'test2');
section.channels.forEach(function (channel) {
  return channel.subscribe(function () {});
});
section.clear();
section.channels.forEach(function (channel) {
  return assert.strictEqual(channel.subscriptions.length, 0);
});
```

<a name="aerobussection-disable"></a>
## .disable()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.disable(), section);
```

disables all bound channels.

```js
var section = aerobus()('test1', 'test2');
section.disable();
section.channels.forEach(function (channel) {
  return assert.isFalse(channel.isEnabled);
});
```

<a name="aerobussection-enable"></a>
## .enable()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.enable(), section);
```

enables all bound channels.

```js
var section = aerobus()('test1', 'test2');
section.disable().enable();
section.channels.forEach(function (channel) {
  return assert.isTrue(channel.isEnabled);
});
```

<a name="aerobussection-publish"></a>
## .publish()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.publish(), section);
```

<a name="aerobussection-publishobject"></a>
## .publish(@object)
publishes @object to all bound channels.

```js
var count = 0,
    data = {},
    section = aerobus()('test1', 'test2');
section.subscribe(function (value) {
  assert.strictEqual(value, data);
  if (++count === section.channels.length) done();
}).publish(data);
```

<a name="aerobussection-subscribe"></a>
## .subscribe()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.subscribe(), section);
```

<a name="aerobussection-subscribefunction"></a>
## .subscribe(@function)
subscribes @function to all bound channels.

```js
var section = aerobus()('test1', 'test2'),
    subscription = function subscription() {};
section.subscribe(subscription);
section.channels.forEach(function (channel) {
  return assert.include(channel.subscriptions, subscription);
});
```

<a name="aerobussection-subscribefunction0-function1"></a>
## .subscribe(@function0, @function1)
subscribes @function to all bound channels.

```js
var section = aerobus()('test1', 'test2'),
    subscription0 = function subscription0() {},
    subscription1 = function subscription1() {};
section.subscribe(subscription0, subscription1);
section.channels.forEach(function (channel) {
  assert.include(channel.subscriptions, subscription0);
  assert.include(channel.subscriptions, subscription1);
});
```

<a name="aerobussection-toggle"></a>
## .toggle()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.toggle(), section);
```

disables all enabled bound channels.

```js
var section = aerobus()('test1', 'test2');
section.toggle();
section.channels.forEach(function (channel) {
  return assert.isFalse(channel.isEnabled);
});
```

enables all disabled bound channels.

```js
var section = aerobus()('test1', 'test2');
section.disable().toggle();
section.channels.forEach(function (channel) {
  return assert.isTrue(channel.isEnabled);
});
```

<a name="aerobussection-unsubscribe"></a>
## .unsubscribe()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.unsubscribe(), section);
```

<a name="aerobussection-unsubscribefunction"></a>
## .unsubscribe(@function)
unsubscribes @function from all bound channels.

```js
var section = aerobus()('test1', 'test2');
section.subscribe(function () {}).unsubscribe();
section.channels.forEach(function (channel) {
  return assert.strictEqual(channel.subscriptions.length, 0);
});
```

