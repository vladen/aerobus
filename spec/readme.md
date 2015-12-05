# TOC
   - [aerobus](#aerobus)
   - [aerobus()](#aerobus)
     - [.channels](#aerobus-channels)
     - [.clear()](#aerobus-clear)
     - [.create()](#aerobus-create)
     - [.delimiter](#aerobus-delimiter)
     - [.error](#aerobus-error)
     - [.root](#aerobus-root)
     - [.trace](#aerobus-trace)
     - [.unsubscribe()](#aerobus-unsubscribe)
     - [.unsubscribe(@function)](#aerobus-unsubscribefunction)
     - [.unsubscribe(...@functions)](#aerobus-unsubscribefunctions)
   - [aerobus(@function)](#aerobusfunction)
     - [.trace](#aerobusfunction-trace)
   - [aerobus("")](#aerobus)
   - [aerobus(@string)](#aerobusstring)
     - [.delimiter](#aerobusstring-delimiter)
   - [aerobus(@object)](#aerobusobject)
     - [Aerobus.Channel instances created by this bus](#aerobusobject-aerobuschannel-instances-created-by-this-bus)
     - [Aerobus.Message instances created by this bus](#aerobusobject-aerobusmessage-instances-created-by-this-bus)
   - [aerobus(@function, @string)](#aerobusfunction-string)
     - [.delimiter](#aerobusfunction-string-delimiter)
     - [.trace](#aerobusfunction-string-trace)
   - [aerobus(...)()](#aerobus)
   - [aerobus(...)("")](#aerobus)
     - [.name](#aerobus-name)
   - [aerobus(...)("error")](#aerobuserror)
   - [aerobus(...)(@string)](#aerobusstring)
   - [aerobus(...)(@array)](#aerobusarray)
   - [aerobus(...)(@boolean)](#aerobusboolean)
   - [aerobus(...)(@date)](#aerobusdate)
   - [aerobus(...)(@number)](#aerobusnumber)
   - [aerobus(...)(@object)](#aerobusobject)
   - [aerobus(...)(@strings)](#aerobusstrings)
   - [aerobus(...)(@number, @string)](#aerobusnumber-string)
   - [aerobus(...)(@string, @object)](#aerobusstring-object)
   - [Aerobus.Channel](#aerobuschannel)
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
     - [.publish(@object)](#aerobuschannel-publishobject)
     - [.request()](#aerobuschannel-request)
     - [.request(@function)](#aerobuschannel-requestfunction)
     - [.retain()](#aerobuschannel-retain)
     - [.retain(false)](#aerobuschannel-retainfalse)
     - [.retain(true)](#aerobuschannel-retaintrue)
     - [.retain(@number)](#aerobuschannel-retainnumber)
     - [.reset()](#aerobuschannel-reset)
     - [.retentions](#aerobuschannel-retentions)
     - [.retentions.limit](#aerobuschannel-retentionslimit)
     - [.subscribe()](#aerobuschannel-subscribe)
     - [.subscribe(@function)](#aerobuschannel-subscribefunction)
     - [.subscribe(...@functions)](#aerobuschannel-subscribefunctions)
     - [.subscribe(@number, @function)](#aerobuschannel-subscribenumber-function)
     - [.subscribe(@number, ...@functions)](#aerobuschannel-subscribenumber-functions)
     - [.subscribers](#aerobuschannel-subscribers)
     - [.toggle()](#aerobuschannel-toggle)
     - [.unsubscribe()](#aerobuschannel-unsubscribe)
     - [.unsubscribe(@function)](#aerobuschannel-unsubscribefunction)
     - [.unsubscribe(...@functions)](#aerobuschannel-unsubscribefunctions)
   - [Aerobus.Iterator](#aerobusiterator)
     - [.done()](#aerobusiterator-done)
     - [.next()](#aerobusiterator-next)
     - [.next().done](#aerobusiterator-nextdone)
     - [.next().value](#aerobusiterator-nextvalue)
   - [Aerobus.Message](#aerobusmessage)
     - [.destination](#aerobusmessage-destination)
     - [.route](#aerobusmessage-route)
     - [.data](#aerobusmessage-data)
     - [.error](#aerobusmessage-error)
   - [Aerobus.Section](#aerobussection)
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

is empty by default.

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

clears .channels.

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

<a name="aerobus-create"></a>
## .create()
is aerobus function.

```js
assert.strictEqual(aerobus().create, aerobus);
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

notifies own subscribers with error thrown by subscribers in other channel.

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

throws if own subscriber throws.

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

notifies own subscriber with message published to descendant channel.

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

is invoked for channel.clear with arguments ("clear", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return results = args;
},
    bus = aerobus(trace);
bus.root.clear();
assert.strictEqual(results[0], 'clear');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.disable with arguments ("disable", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  return results = args;
},
    bus = aerobus(trace);
bus.root.disable();
assert.strictEqual(results[0], 'disable');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.enable with arguments ("enable", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }
  return results = args;
},
    bus = aerobus(trace);
bus.root.enable();
assert.strictEqual(results[0], 'enable');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.publish with arguments ("publish", channel, message).

```js
var data = {},
    results = [],
    trace = function trace() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }
  return results = args;
},
    bus = aerobus(trace);
bus.root.publish(data);
assert.strictEqual(results[0], 'publish');
assert.strictEqual(results[1], bus.root);
assert.typeOf(results[2], 'Aerobus.Message');
assert.strictEqual(results[2].data, data);
```

is invoked for channel.reset with arguments ("reset", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }
  return results = args;
},
    bus = aerobus(trace);
bus.root.reset();
assert.strictEqual(results[0], 'reset');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.retain with arguments ("retain", channel, limit).

```js
var limit = 42,
    results = [],
    trace = function trace() {
  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }
  return results = args;
},
    bus = aerobus(trace);
bus.root.retain(limit);
assert.strictEqual(results[0], 'retain');
assert.strictEqual(results[1], bus.root);
assert.strictEqual(results[2], limit);
```

is invoked for channel.subscribe with arguments ("subscribe", channel, parameters).

```js
var _bus$root;
var parameters = [1, function () {}],
    results = [],
    trace = function trace() {
  for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }
  return results = args;
},
    bus = aerobus(trace);
(_bus$root = bus.root).subscribe.apply(_bus$root, parameters);
assert.strictEqual(results[0], 'subscribe');
assert.strictEqual(results[1], bus.root);
assert.includeMembers(results[2], parameters);
```

is invoked for channel.toggle with arguments ("toggle", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }
  return results = args;
},
    bus = aerobus(trace);
bus.root.toggle();
assert.strictEqual(results[0], 'toggle');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.parameters with arguments ("unsubscribe", channel, parameters).

```js
var _bus$root2;
var parameters = [function () {}],
    results = [],
    trace = function trace() {
  for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }
  return results = args;
},
    bus = aerobus(trace);
(_bus$root2 = bus.root).unsubscribe.apply(_bus$root2, parameters);
assert.strictEqual(results[0], 'unsubscribe');
assert.strictEqual(results[1], bus.root);
assert.includeMembers(results[2], parameters);
```

<a name="aerobus-unsubscribe"></a>
## .unsubscribe()
is fluent.

```js
var bus = aerobus(),
    subscriber = function subscriber() {};
assert.strictEqual(bus.unsubscribe(subscriber), bus);
```

clears .subscribers of all channel.

```js
var bus = aerobus(),
    channel0 = bus.root,
    channel1 = bus('test1'),
    channel2 = bus('test2'),
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel0.subscribe(subscriber0, subscriber1);
channel1.subscribe(subscriber0);
channel2.subscribe(subscriber1);
bus.unsubscribe();
assert.strictEqual(channel0.subscribers.length, 0);
assert.strictEqual(channel1.subscribers.length, 0);
assert.strictEqual(channel2.subscribers.length, 0);
```

<a name="aerobus-unsubscribefunction"></a>
## .unsubscribe(@function)
removes @function from .subscribers of all channel.

```js
var bus = aerobus(),
    channel1 = bus('test1'),
    channel2 = bus('test2'),
    subscriber = function subscriber() {};
channel1.subscribe(subscriber);
channel2.subscribe(subscriber);
bus.unsubscribe(subscriber);
assert.notInclude(channel1.subscribers, subscriber);
assert.notInclude(channel2.subscribers, subscriber);
```

<a name="aerobus-unsubscribefunctions"></a>
## .unsubscribe(...@functions)
removes @functions from .subscribers of all channels.

```js
var bus = aerobus(),
    channel1 = bus('test1'),
    channel2 = bus('test2'),
    subscriber1 = function subscriber1() {},
    subscriber2 = function subscriber2() {};
channel1.subscribe(subscriber1, subscriber2);
channel2.subscribe(subscriber1, subscriber2);
bus.unsubscribe(subscriber1, subscriber2);
assert.notInclude(channel1.subscribers, subscriber1);
assert.notInclude(channel1.subscribers, subscriber2);
assert.notInclude(channel2.subscribers, subscriber1);
assert.notInclude(channel2.subscribers, subscriber2);
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

<a name="aerobusstring-delimiter"></a>
## .delimiter
gets @string.

```js
var delimiter = ':',
    bus = aerobus(delimiter);
assert.strictEqual(bus.delimiter, delimiter);
```

<a name="aerobusobject"></a>
# aerobus(@object)
is function.

```js
assert.isFunction(aerobus({}));
```

<a name="aerobusobject-aerobuschannel-instances-created-by-this-bus"></a>
## Aerobus.Channel instances created by this bus
are extended with @object.channel members.

```js
var extension = function extension() {},
    bus = aerobus({
  channel: { extension: extension }
}),
    channels = [bus.root, bus.error, bus('custom')];
channels.forEach(function (channel) {
  return assert.strictEqual(channel.extension, extension);
});
```

keep all standard api members.

```js
var extensions = {
  clear: null,
  disable: null,
  enable: null,
  isEnabled: null,
  publish: null,
  reset: null,
  retain: null,
  retentions: null,
  subscribe: null,
  subscribers: null,
  toggle: null,
  unsubscribe: null
},
    bus = aerobus({ channel: extensions }),
    channels = [bus.root, bus.error, bus('custom')];
Object.keys(extensions).forEach(function (key) {
  return channels.forEach(function (channel) {
    return assert.isNotNull(channel[key]);
  });
});
```

<a name="aerobusobject-aerobusmessage-instances-created-by-this-bus"></a>
## Aerobus.Message instances created by this bus
are extended with @object.message members.

```js
var extension = function extension() {},
    bus = aerobus({
  message: { extension: extension }
}),
    result = undefined;
bus.root.subscribe(function (_, message) {
  return result = message.extension;
});
bus.root.publish();
assert.strictEqual(result, extension);
```

keep all standard api members.

```js
var extensions = {
  destination: null,
  data: null,
  route: null
},
    bus = aerobus({ message: extensions }),
    result = undefined;
bus.root.subscribe(function (_, message) {
  return result = message;
});
bus.root.publish({});
Object.keys(extensions).forEach(function (key) {
  return assert.isNotNull(result[key]);
});
```

<a name="aerobusobject-aerobusmessage-instances-created-by-this-bus"></a>
## Aerobus.Message instances created by this bus
are extended with @object.section members.

```js
var extension = function extension() {},
    bus = aerobus({
  section: { extension: extension }
}),
    sections = [bus('root', 'error'), bus('root', 'error', 'custom')];
sections.forEach(function (section) {
  return assert.strictEqual(section.extension, extension);
});
```

keep all standard api members.

```js
var extensions = {
  channels: null,
  clear: null,
  disable: null,
  enable: null,
  publish: null,
  reset: null,
  retain: null,
  subscribe: null,
  toggle: null,
  unsubscribe: null
},
    bus = aerobus({ channel: extensions }),
    sections = [bus('root', 'error'), bus('root', 'error', 'custom')];
Object.keys(extensions).forEach(function (key) {
  return sections.forEach(function (section) {
    return assert.isNotNull(section[key]);
  });
});
```

<a name="aerobusfunction-string"></a>
# aerobus(@function, @string)
is function.

```js
var bus = aerobus(':', function () {});
assert.isFunction(bus);
```

<a name="aerobusfunction-string-delimiter"></a>
## .delimiter
gets @string.

```js
var delimiter = ':',
    bus = aerobus(delimiter, function () {});
assert.strictEqual(bus.delimiter, delimiter);
```

<a name="aerobusfunction-string-trace"></a>
## .trace
gets @function.

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
var bus = aerobus(),
    channel = bus();
assert.strictEqual(channel, bus.root);
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
var bus = aerobus(),
    channel = bus('');
assert.strictEqual(channel, bus.root);
```

<a name="aerobus-name"></a>
## .name
gets "".

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
var bus = aerobus(),
    channel = bus('error');
assert.strictEqual(channel, bus.error);
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

<a name="aerobusstrings"></a>
# aerobus(...)(@strings)
is instance of Aerobus.Section.

```js
assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
```

contains specified channels (@strings includes .channels[0].name).

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

clears .subscribers.

```js
var channel = aerobus().root;
channel.subscribe(function () {}).clear();
assert.strictEqual(channel.subscribers.length, 0);
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

supresses publication.

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

supresses publication to descendant channel.

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

resumes publication.

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

is custom string for custom channel.

```js
var name = 'some.custom.channel';
assert.strictEqual(aerobus()(name).name, name);
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

is parent channel for second level channel.

```js
var bus = aerobus(),
    parent = bus('parent'),
    child = bus('parent.child');
assert.strictEqual(child.parent, parent);
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

notifies own subscribers in subcription order .

```js
var traces = [],
    subscriber0 = function subscriber0() {
  return traces.push('first');
},
    subscriber1 = function subscriber1() {
  return traces.push('second');
};
aerobus().root.subscribe(subscriber0, subscriber1).publish();
assert.strictEqual(traces[0], 'first');
assert.strictEqual(traces[1], 'second');
```

notifies ancestor subscribers before own.

```js
var channel = aerobus()('parent.child'),
    traces = [],
    ancestor = function ancestor() {
  return traces.push('ancestor');
},
    parent = function parent() {
  return traces.push('parent');
},
    self = function self() {
  return traces.push('self');
};
channel.parent.parent.subscribe(ancestor);
channel.parent.subscribe(parent);
channel.subscribe(self);
channel.publish();
assert.strictEqual(traces[0], 'ancestor');
assert.strictEqual(traces[1], 'parent');
assert.strictEqual(traces[2], 'self');
```

<a name="aerobuschannel-publishobject"></a>
## .publish(@object)
notifies own subscriber with @object.

```js
var publication = {},
    result = undefined,
    subscriber = function subscriber(data) {
  return result = data;
};
aerobus().root.subscribe(subscriber).publish(publication);
assert.strictEqual(result, publication);
```

notifies own and ancestor subscribers with @object.

```js
var channel = aerobus()('parent.child'),
    publication = {},
    results = [],
    subscriber = function subscriber(data) {
  return results.push(data);
};
channel.parent.parent.subscribe(subscriber);
channel.parent.subscribe(subscriber);
channel.subscribe(subscriber);
channel.publish(publication);
assert.strictEqual(results[0], publication);
assert.strictEqual(results[1], publication);
assert.strictEqual(results[2], publication);
```

<a name="aerobuschannel-request"></a>
## .request()
throws.

```js
assert.throw(function () {
  return aerobus().root.request();
});
```

<a name="aerobuschannel-requestfunction"></a>
## .request(@function)
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.request(function () {}), channel);
```

invokes @function with array containing results returned from all own and ancestor subscribers.

```js
var channel = aerobus()('parent.child'),
    result0 = {},
    result1 = {},
    result2 = {},
    results = undefined,
    callback = function callback(data) {
  return results = data;
};
channel.parent.parent.subscribe(function () {
  return result0;
});
channel.parent.subscribe(function () {
  return result1;
});
channel.subscribe(function () {
  return result2;
}).request(callback);
assert.include(results, result0);
assert.include(results, result1);
assert.include(results, result2);
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

notifies all subsequent subscribtions with all retained publications immediately in order of publication.

```js
var channel = aerobus().root,
    publication0 = {},
    publication1 = {},
    results = [],
    subscriber = function subscriber(data) {
  return results.push(data);
};
channel.retain().publish(publication0).publish(publication1).subscribe(subscriber).subscribe(subscriber);
assert.strictEqual(results[0], publication0);
assert.strictEqual(results[1], publication1);
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
    publication0 = {},
    publication1 = {};
channel.retain().publish(publication0).publish(publication1).retain(false);
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

clears .subscribers.

```js
var channel = aerobus().root;
channel.subscribe(function () {}).reset();
assert.strictEqual(channel.subscribers.length, 0);
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
    publication0 = {},
    publication1 = {};
channel.retain(1).publish(publication0).publish(publication1);
assert.strictEqual(channel.retentions.length, 1);
assert.strictEqual(channel.retentions[0].data, publication1);
```

contains two latest publications when limited to 2.

```js
var channel = aerobus().root,
    publication0 = {},
    publication1 = {},
    publication2 = {};
channel.retain(2).publish(publication0).publish(publication1).publish(publication2);
assert.strictEqual(channel.retentions.length, 2);
assert.strictEqual(channel.retentions[0].data, publication1);
assert.strictEqual(channel.retentions[1].data, publication2);
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
adds @function to .subscribers.

```js
var channel = aerobus().root,
    subscriber = function subscriber() {};
channel.subscribe(subscriber);
assert.include(channel.subscribers, subscriber);
```

<a name="aerobuschannel-subscribefunctions"></a>
## .subscribe(...@functions)
adds @functions to .subscribers.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel.subscribe(subscriber0, subscriber1);
assert.include(channel.subscribers, subscriber0);
assert.include(channel.subscribers, subscriber1);
```

<a name="aerobuschannel-subscribenumber-function"></a>
## .subscribe(@number, @function)
adds @function to .subscribers ordering by @number.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
assert.strictEqual(channel.subscribers[0], subscriber1);
assert.strictEqual(channel.subscribers[1], subscriber0);
```

<a name="aerobuschannel-subscribenumber-functions"></a>
## .subscribe(@number, ...@functions)
adds @functions to .subscribers ordering by @number.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {},
    subscriber2 = function subscriber2() {};
channel.subscribe(subscriber0).subscribe(-1, subscriber1, subscriber2);
assert.strictEqual(channel.subscribers[0], subscriber1);
assert.strictEqual(channel.subscribers[1], subscriber2);
assert.strictEqual(channel.subscribers[2], subscriber0);
```

<a name="aerobuschannel-subscribers"></a>
## .subscribers
is array.

```js
assert.isArray(aerobus().root.subscribers);
```

is empty array by default.

```js
assert.strictEqual(aerobus().root.subscribers.length, 0);
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
removes @function from .subscribers.

```js
var channel = aerobus().root,
    subscriber = function subscriber() {};
channel.subscribe(subscriber).unsubscribe(subscriber);
assert.notInclude(channel.subscribers, subscriber);
assert.notInclude(channel.subscribers, subscriber);
```

<a name="aerobuschannel-unsubscribefunctions"></a>
## .unsubscribe(...@functions)
removes all @functions from .subscribers.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel.subscribe(subscriber0, subscriber1).unsubscribe(subscriber0, subscriber1);
assert.notInclude(channel.subscribers, subscriber0);
assert.notInclude(channel.subscribers, subscriber1);
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

is pending promise when there is no preceeding publication.

```js
var iterator = aerobus().root[Symbol.iterator](),
    pending = {},
    result = undefined;
Promise.race([iterator.next().value, Promise.resolve(pending)]).then(function (resolved) {
  return result = resolved;
});
setImmediate(function () {
  assert.strictEqual(result, pending);
  done();
});
```

is promise resolved with Aerobus.Message instance containing published data when there is preceeding publication.

```js
var channel = aerobus().root,
    publication = {},
    iterator = channel[Symbol.iterator](),
    result = undefined;
channel.publish(publication);
iterator.next().value.then(function (resolved) {
  return result = resolved;
});
setImmediate(function () {
  assert.typeOf(result, 'Aerobus.Message');
  assert.strictEqual(result.data, publication);
  done();
});
```

resolves after publication with Aerobus.Message instance containing published data.

```js
var channel = aerobus().root,
    iterator = channel[Symbol.iterator](),
    publication = {},
    result = undefined,
    resolved = false;
iterator.next().value.then(function (message) {
  resolved = true;
  result = message;
});
assert.isFalse(resolved);
channel.publish(publication);
setImmediate(function () {
  assert.isTrue(resolved);
  assert.typeOf(result, 'Aerobus.Message');
  assert.strictEqual(result.data, publication);
  done();
});
```

<a name="aerobusmessage"></a>
# Aerobus.Message
<a name="aerobusmessage-destination"></a>
## .destination
gets channel name this message was delivered to.

```js
var bus = aerobus(),
    channel = bus('test'),
    result = undefined,
    subscriber = function subscriber(_, message) {
  return result = message.destination;
};
channel.subscribe(subscriber).publish();
assert.strictEqual(result, channel.name);
```

<a name="aerobusmessage-route"></a>
## .route
gets array of channel names this message traversed.

```js
var bus = aerobus(),
    root = bus.root,
    parent = bus('parent'),
    child = bus('parent.child'),
    results = [],
    subscriber = function subscriber(_, message) {
  return results = message.route;
};
bus.root.subscribe(subscriber);
child.publish();
assert.include(results, root.name);
assert.include(results, parent.name);
assert.include(results, child.name);
```

<a name="aerobusmessage-data"></a>
## .data
gets published data.

```js
var publication = {},
    result = undefined,
    subscriber = function subscriber(_, message) {
  return result = message.data;
};
aerobus().root.subscribe(subscriber).publish(publication);
assert.strictEqual(result, publication);
```

<a name="aerobusmessage-error"></a>
## .error
gets error caught in subscriber.

```js
var bus = aerobus(),
    error = new Error(),
    result = undefined,
    errorSubscriber = function errorSubscriber(_, message) {
  return result = message.error;
},
    throwSubscriber = function throwSubscriber() {
  throw error;
};
bus.error.subscribe(errorSubscriber);
bus.root.subscribe(throwSubscriber).publish();
assert.strictEqual(result, error);
```

<a name="aerobussection"></a>
# Aerobus.Section
<a name="aerobussection-channels"></a>
## .channels
is array.

```js
assert.isArray(aerobus()('test1', 'test2').channels);
```

contains all united channels.

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

clears .subscribers of all united channels.

```js
var section = aerobus()('test1', 'test2'),
    subscriber = function subscriber() {};
section.channels.forEach(function (channel) {
  return channel.subscribe(subscriber);
});
section.clear();
section.channels.forEach(function (channel) {
  return assert.strictEqual(channel.subscribers.length, 0);
});
```

<a name="aerobussection-disable"></a>
## .disable()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.disable(), section);
```

disables all united channels.

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

enables all united channels.

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
publishes @object to all united channels in order of declaration.

```js
var section = aerobus()('test1', 'test2'),
    publication = {},
    results = [],
    subscriber = function subscriber(_, message) {
  return results.push(message.destination);
};
section.subscribe(subscriber).publish(publication);
assert.strictEqual(results[0], section.channels[0].name);
assert.strictEqual(results[1], section.channels[1].name);
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
subscribes @function to all united channels.

```js
var section = aerobus()('test1', 'test2'),
    subscriber = function subscriber() {};
section.subscribe(subscriber);
section.channels.forEach(function (channel) {
  return assert.include(channel.subscribers, subscriber);
});
```

<a name="aerobussection-subscribefunction0-function1"></a>
## .subscribe(@function0, @function1)
subscribes @function to all united channels.

```js
var section = aerobus()('test1', 'test2'),
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
section.subscribe(subscriber0, subscriber1);
section.channels.forEach(function (channel) {
  assert.include(channel.subscribers, subscriber0);
  assert.include(channel.subscribers, subscriber1);
});
```

<a name="aerobussection-toggle"></a>
## .toggle()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.toggle(), section);
```

disables all united channels that enabled.

```js
var section = aerobus()('test1', 'test2');
section.toggle();
section.channels.forEach(function (channel) {
  return assert.isFalse(channel.isEnabled);
});
```

enables all united channels that disabled.

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
unsubscribes @function from all united channels.

```js
var section = aerobus()('test1', 'test2'),
    subscriber = function subscriber() {};
section.subscribe(subscriber).unsubscribe(subscriber);
section.channels.forEach(function (channel) {
  return assert.notInclude(channel.subscribers, subscriber);
});
```

