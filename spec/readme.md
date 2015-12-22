# TOC
   - [aerobus](#aerobus)
   - [aerobus()](#aerobus)
     - [#bubbles](#aerobus-bubbles)
     - [#delimiter](#aerobus-delimiter)
   - [aerobus(@array)](#aerobusarray)
   - [aerobus(@boolean)](#aerobusboolean)
     - [@boolean](#aerobusboolean-boolean)
   - [aerobus(@date)](#aerobusdate)
   - [aerobus(@function)](#aerobusfunction)
     - [@function](#aerobusfunction-function)
   - [aerobus(@number)](#aerobusnumber)
   - [aerobus(@object)](#aerobusobject)
     - [@object.bubbles](#aerobusobject-objectbubbles)
     - [@object.delimiter](#aerobusobject-objectdelimiter)
     - [@object.error](#aerobusobject-objecterror)
     - [@object.trace](#aerobusobject-objecttrace)
     - [@object.channel](#aerobusobject-objectchannel)
     - [@object.message](#aerobusobject-objectmessage)
     - [@object.section](#aerobusobject-objectsection)
   - [aerobus(@string)](#aerobusstring)
     - [@string](#aerobusstring-string)
   - [aerobus(@boolean, @function, @string)](#aerobusboolean-function-string)
     - [@boolean](#aerobusboolean-function-string-boolean)
     - [@function](#aerobusboolean-function-string-function)
     - [@string](#aerobusboolean-function-string-string)
   - [Aerobus](#aerobus)
     - [is function](#aerobus-is-function)
     - [#()](#aerobus-)
     - [#("")](#aerobus-)
     - [#(@string)](#aerobus-string)
     - [#(...@strings)](#aerobus-strings)
     - [#(!@string)](#aerobus-string)
     - [#bubble()](#aerobus-bubble)
     - [#bubble(false)](#aerobus-bubblefalse)
     - [#bubbles](#aerobus-bubbles)
     - [#channels](#aerobus-channels)
     - [#clear()](#aerobus-clear)
     - [#create()](#aerobus-create)
     - [#delimiter](#aerobus-delimiter)
     - [#error](#aerobus-error)
     - [#root](#aerobus-root)
     - [#trace](#aerobus-trace)
     - [#unsubscribe()](#aerobus-unsubscribe)
     - [#unsubscribe(@function)](#aerobus-unsubscribefunction)
     - [#unsubscribe(...@functions)](#aerobus-unsubscribefunctions)
   - [Aerobus.Channel](#aerobuschannel)
     - [#bubble()](#aerobuschannel-bubble)
     - [#bubble(false)](#aerobuschannel-bubblefalse)
     - [#bubbles](#aerobuschannel-bubbles)
     - [#clear()](#aerobuschannel-clear)
     - [#enable()](#aerobuschannel-enable)
     - [#enable(false)](#aerobuschannel-enablefalse)
     - [#enable(true)](#aerobuschannel-enabletrue)
     - [#enabled](#aerobuschannel-enabled)
     - [#forward()](#aerobuschannel-forward)
     - [#forward(@function)](#aerobuschannel-forwardfunction)
     - [#forward(@string)](#aerobuschannel-forwardstring)
     - [#forward(@function, @string)](#aerobuschannel-forwardfunction-string)
     - [#forward(!(@function || @string))](#aerobuschannel-forwardfunction--string)
     - [#forwarders](#aerobuschannel-forwarders)
     - [#[Symbol.iterator]](#aerobuschannel-symboliterator)
     - [#[Symbol.iterator] ()](#aerobuschannel-symboliterator-)
     - [#name](#aerobuschannel-name)
     - [#parent](#aerobuschannel-parent)
     - [#publish()](#aerobuschannel-publish)
     - [#publish(@object)](#aerobuschannel-publishobject)
     - [#publish(@object, @function)](#aerobuschannel-publishobject-function)
     - [#reset()](#aerobuschannel-reset)
     - [#retain()](#aerobuschannel-retain)
     - [#retain(false)](#aerobuschannel-retainfalse)
     - [#retain(true)](#aerobuschannel-retaintrue)
     - [#retain(@number)](#aerobuschannel-retainnumber)
     - [#retentions](#aerobuschannel-retentions)
     - [#retentions.limit](#aerobuschannel-retentionslimit)
     - [#subscribe()](#aerobuschannel-subscribe)
     - [#subscribe(@function)](#aerobuschannel-subscribefunction)
     - [#subscribe(...@functions)](#aerobuschannel-subscribefunctions)
     - [#subscribe(@number, @function)](#aerobuschannel-subscribenumber-function)
     - [#subscribe(@number, ...@functions)](#aerobuschannel-subscribenumber-functions)
     - [#subscribe(@string, @function)](#aerobuschannel-subscribestring-function)
     - [#subscribe(@object)](#aerobuschannel-subscribeobject)
     - [#subscribers](#aerobuschannel-subscribers)
     - [#toggle()](#aerobuschannel-toggle)
     - [#unsubscribe()](#aerobuschannel-unsubscribe)
     - [#unsubscribe(@function)](#aerobuschannel-unsubscribefunction)
     - [#unsubscribe(...@functions)](#aerobuschannel-unsubscribefunctions)
     - [#unsubscribe(@string)](#aerobuschannel-unsubscribestring)
   - [Aerobus.Iterator](#aerobusiterator)
     - [#done()](#aerobusiterator-done)
     - [#next()](#aerobusiterator-next)
     - [#next().done](#aerobusiterator-nextdone)
     - [#next().value](#aerobusiterator-nextvalue)
   - [Aerobus.Message](#aerobusmessage)
     - [#cancel](#aerobusmessage-cancel)
     - [#data](#aerobusmessage-data)
     - [#destination](#aerobusmessage-destination)
     - [#route](#aerobusmessage-route)
   - [Aerobus.Section](#aerobussection)
     - [#channels](#aerobussection-channels)
     - [#clear()](#aerobussection-clear)
     - [#enable()](#aerobussection-enable)
     - [#enable(false)](#aerobussection-enablefalse)
     - [#forward(@string)](#aerobussection-forwardstring)
     - [#publish()](#aerobussection-publish)
     - [#publish(@object)](#aerobussection-publishobject)
     - [#subscribe()](#aerobussection-subscribe)
     - [#subscribe(@function)](#aerobussection-subscribefunction)
     - [#subscribe(@function0, @function1)](#aerobussection-subscribefunction0-function1)
     - [#toggle()](#aerobussection-toggle)
     - [#unsubscribe()](#aerobussection-unsubscribe)
     - [#unsubscribe(@function)](#aerobussection-unsubscribefunction)
<a name=""></a>
 
<a name="aerobus"></a>
# aerobus
is function.

```js
assert.isFunction(aerobus);
```

<a name="aerobus"></a>
# aerobus()
returns instance of Aerobus.

```js
assert.typeOf(aerobus(), 'Aerobus');
```

<a name="aerobus-bubbles"></a>
## #bubbles
is true.

```js
assert.isTrue(aerobus().bubbles);
```

<a name="aerobus-delimiter"></a>
## #delimiter
is ".".

```js
assert.strictEqual(aerobus().delimiter, '.');
```

<a name="aerobusarray"></a>
# aerobus(@array)
throws.

```js
assert.throw(function () {
  return aerobus([]);
});
```

<a name="aerobusboolean"></a>
# aerobus(@boolean)
returns instance of Aerobus.

```js
assert.typeOf(aerobus(false), 'Aerobus');
```

<a name="aerobusboolean-boolean"></a>
## @boolean
configures #bubbles.

```js
var bubbles = false,
    bus = aerobus(bubbles);
assert.strictEqual(bus.bubbles, bubbles);
```

<a name="aerobusdate"></a>
# aerobus(@date)
throws.

```js
assert.throw(function () {
  return aerobus(new Date());
});
```

<a name="aerobusfunction"></a>
# aerobus(@function)
returns instance of Aerobus.

```js
assert.typeOf(aerobus(function () {}), 'Aerobus');
```

<a name="aerobusfunction-function"></a>
## @function
configures #error.

```js
var error = function error() {},
    bus = aerobus(error);
assert.strictEqual(bus.error, error);
```

<a name="aerobusnumber"></a>
# aerobus(@number)
throws.

```js
assert.throw(function () {
  return aerobus(0);
});
```

<a name="aerobusobject"></a>
# aerobus(@object)
returns instance of Aerobus.

```js
assert.typeOf(aerobus({}), 'Aerobus');
```

<a name="aerobusobject-objectbubbles"></a>
## @object.bubbles
configures #bubbles.

```js
var bubbles = false,
    bus = aerobus({ bubbles: bubbles });
assert.strictEqual(bus.bubbles, bubbles);
```

<a name="aerobusobject-objectdelimiter"></a>
## @object.delimiter
must be not empty string.

```js
assert.throw(function () {
  return aerobus({ delimiter: '' });
});
assert.throw(function () {
  return aerobus({ delimiter: [] });
});
assert.throw(function () {
  return aerobus({ delimiter: false });
});
assert.throw(function () {
  return aerobus({ delimiter: true });
});
assert.throw(function () {
  return aerobus({ delimiter: new Date() });
});
assert.throw(function () {
  return aerobus({ delimiter: 0 });
});
assert.throw(function () {
  return aerobus({ delimiter: function delimiter() {} });
});
assert.throw(function () {
  return aerobus({ delimiter: {} });
});
```

configures #delimiter.

```js
var delimiter = ':',
    bus = aerobus({ delimiter: delimiter });
assert.strictEqual(bus.delimiter, delimiter);
```

<a name="aerobusobject-objecterror"></a>
## @object.error
must be a function.

```js
assert.throw(function () {
  return aerobus({ error: '' });
});
assert.throw(function () {
  return aerobus({ error: [] });
});
assert.throw(function () {
  return aerobus({ error: false });
});
assert.throw(function () {
  return aerobus({ error: true });
});
assert.throw(function () {
  return aerobus({ delimiter: new Date() });
});
assert.throw(function () {
  return aerobus({ delimiter: 0 });
});
assert.throw(function () {
  return aerobus({ error: {} });
});
```

configures #error.

```js
var error = function error() {},
    bus = aerobus({ error: error });
assert.strictEqual(bus.error, error);
```

<a name="aerobusobject-objecttrace"></a>
## @object.trace
must be a function.

```js
assert.throw(function () {
  return aerobus({ trace: '' });
});
assert.throw(function () {
  return aerobus({ trace: [] });
});
assert.throw(function () {
  return aerobus({ trace: false });
});
assert.throw(function () {
  return aerobus({ trace: true });
});
assert.throw(function () {
  return aerobus({ delimiter: new Date() });
});
assert.throw(function () {
  return aerobus({ delimiter: 0 });
});
assert.throw(function () {
  return aerobus({ trace: {} });
});
```

configures #trace.

```js
var trace = function trace() {},
    bus = aerobus({ trace: trace });
assert.strictEqual(bus.trace, trace);
```

<a name="aerobusobject-objectchannel"></a>
## @object.channel
extends Channel instances.

```js
var extension = function extension() {},
    bus = aerobus({
  channel: { extension: extension }
}),
    channels = [bus.root, bus('custom')];
channels.forEach(function (channel) {
  return assert.strictEqual(channel.extension, extension);
});
```

preserves standard members.

```js
var extensions = {
  bubble: null,
  bubbles: null,
  clear: null,
  enable: null,
  enabled: null,
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
    channels = [bus.root, bus('custom')];
Object.keys(extensions).forEach(function (key) {
  return channels.forEach(function (channel) {
    return assert.isNotNull(channel[key]);
  });
});
```

<a name="aerobusobject-objectmessage"></a>
## @object.message
extends Message instances.

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

preserves standard members.

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

<a name="aerobusobject-objectsection"></a>
## @object.section
extends Section instances.

```js
var extension = function extension() {},
    bus = aerobus({
  section: { extension: extension }
}),
    sections = [bus('', 'test'), bus('', 'test', 'parent.child')];
sections.forEach(function (section) {
  return assert.strictEqual(section.extension, extension);
});
```

preserves standard members.

```js
var extensions = {
  bubble: null,
  channels: null,
  clear: null,
  enable: null,
  publish: null,
  reset: null,
  retain: null,
  subscribe: null,
  toggle: null,
  unsubscribe: null
},
    bus = aerobus({ channel: extensions }),
    sections = [bus('', 'test'), bus('', 'test', 'parent.child')];
Object.keys(extensions).forEach(function (key) {
  return sections.forEach(function (section) {
    return assert.isNotNull(section[key]);
  });
});
```

<a name="aerobusstring"></a>
# aerobus(@string)
returns instance of Aerobus.

```js
assert.typeOf(aerobus(':'), 'Aerobus');
```

<a name="aerobusstring-string"></a>
## @string
configures #delimiter.

```js
var delimiter = ':',
    bus = aerobus(delimiter);
assert.strictEqual(bus.delimiter, delimiter);
```

throws if empty.

```js
assert.throw(function () {
  return aerobus('');
});
```

<a name="aerobusboolean-function-string"></a>
# aerobus(@boolean, @function, @string)
returns instance of Aerobus.

```js
assert.typeOf(aerobus(false, function () {}, ':'), 'Aerobus');
```

<a name="aerobusboolean-function-string-boolean"></a>
## @boolean
configures #bubbles.

```js
var bubbles = false,
    bus = aerobus(bubbles, function () {}, ':');
assert.strictEqual(bus.bubbles, bubbles);
```

<a name="aerobusboolean-function-string-function"></a>
## @function
configures #error.

```js
var error = function error() {},
    bus = aerobus(false, error, ':');
assert.strictEqual(bus.error, error);
```

<a name="aerobusboolean-function-string-string"></a>
## @string
configures #delimiter.

```js
var delimiter = ':',
    bus = aerobus(false, function () {}, delimiter);
assert.strictEqual(bus.delimiter, delimiter);
```

<a name="aerobus"></a>
# Aerobus
<a name="aerobus-"></a>
## #()
returns instance of Channel.

```js
var bus = aerobus();
assert.typeOf(bus(), 'Aerobus.Channel');
```

returns #root channel.

```js
var bus = aerobus(),
    channel = bus();
assert.strictEqual(channel, bus.root);
```

<a name="aerobus-"></a>
## #("")
returns instance of Channel.

```js
var bus = aerobus();
assert.typeOf(bus(''), 'Aerobus.Channel');
```

returns #root channel.

```js
var bus = aerobus(),
    channel = bus('');
assert.strictEqual(channel, bus.root);
```

<a name="aerobus-string"></a>
## #(@string)
returns instance of Channel.

```js
var bus = aerobus();
assert.typeOf(bus('test'), 'Aerobus.Channel');
```

Channel.#name gets @string.

```js
var bus = aerobus(),
    name = 'test';
assert.strictEqual(bus(name).name, name);
```

<a name="aerobus-strings"></a>
## #(...@strings)
returns instance of Section.

```js
assert.typeOf(aerobus()('test1', 'test2'), 'Aerobus.Section');
```

Section.#channels include all specified channels.

```js
var names = ['test1', 'test2'],
    section = aerobus().apply(undefined, names);
assert.strictEqual(section.channels[0].name, names[0]);
assert.strictEqual(section.channels[1].name, names[1]);
```

<a name="aerobus-string"></a>
## #(!@string)
throws.

```js
assert.throw(function () {
  return aerobus()([]);
});
assert.throw(function () {
  return aerobus()(true);
});
assert.throw(function () {
  return aerobus()(new Date());
});
assert.throw(function () {
  return aerobus()(42);
});
assert.throw(function () {
  return aerobus()({});
});
```

<a name="aerobus-bubble"></a>
## #bubble()
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.bubble(), bus);
```

sets #bubbles.

```js
var bus = aerobus(false);
bus.bubble();
assert.isTrue(bus.bubbles);
```

<a name="aerobus-bubblefalse"></a>
## #bubble(false)
clears #bubbles.

```js
var bus = aerobus();
bus.bubble(false);
assert.isFalse(bus.bubbles);
```

<a name="aerobus-bubbles"></a>
## #bubbles
is boolean.

```js
assert.isBoolean(aerobus().bubbles);
```

<a name="aerobus-channels"></a>
## #channels
is array.

```js
assert.isArray(aerobus().channels);
```

is empty by default.

```js
assert.strictEqual(aerobus().channels.length, 0);
```

contains root channel.

```js
var bus = aerobus(),
    channel = bus.root;
assert.include(bus.channels, channel);
```

contains custom channel.

```js
var bus = aerobus(),
    channel = bus('test');
assert.include(bus.channels, channel);
```

contains several channels.

```js
var bus = aerobus(),
    channel0 = bus.root,
    channel1 = bus('test'),
    channel2 = bus('parent.child');
assert.include(bus.channels, channel0);
assert.include(bus.channels, channel1);
assert.include(bus.channels, channel2);
```

<a name="aerobus-clear"></a>
## #clear()
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.clear(), bus);
```

empties #channels.

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

new instance of Channel is resolved for same name afterwards.

```js
var bus = aerobus(),
    channel0 = bus.root,
    channel1 = bus.error,
    channel2 = bus('test');
bus.clear();
assert.notStrictEqual(bus(channel0.name), channel0);
assert.notStrictEqual(bus(channel1.name), channel1);
assert.notStrictEqual(bus(channel2.name), channel2);
```

<a name="aerobus-create"></a>
## #create()
returns new Aerobus instance.

```js
assert.typeOf(aerobus().create(), 'Aerobus');
```

new Aerobus inherits #bubbles.

```js
var bubbles = false;
assert.strictEqual(aerobus(bubbles).create().bubbles, bubbles);
```

new Aerobus inherits #delimiter.

```js
var delimiter = ':';
assert.strictEqual(aerobus(delimiter).create().delimiter, delimiter);
```

new Aerobus inherits #error.

```js
var error = function error() {};
assert.strictEqual(aerobus(error).create().error, error);
```

new Aerobus inherits #trace.

```js
var trace = function trace() {};
assert.strictEqual(aerobus({ trace: trace }).create().trace, trace);
```

new Aerobus inherits channel extensions.

```js
var extension = function extension() {};
assert.strictEqual(aerobus({ channel: { extension: extension } }).create().root.extension, extension);
```

new Aerobus inherits message extensions.

```js
var extension = function extension() {},
    result = undefined,
    subscriber = function subscriber(_, message) {
  return result = message;
};
aerobus({ message: { extension: extension } }).create().root.subscribe(subscriber).publish();
assert.strictEqual(result.extension, extension);
```

new Aerobus inherits section extensions.

```js
var extension = function extension() {};
assert.strictEqual(aerobus({ section: { extension: extension } }).create()('test0', 'test1').extension, extension);
```

<a name="aerobus-delimiter"></a>
## #delimiter
is string.

```js
assert.isString(aerobus().delimiter);
```

is read-only.

```js
assert.throw(function () {
  return aerobus().delimiter = null;
});
```

<a name="aerobus-error"></a>
## #error
is a function.

```js
assert.isFunction(aerobus().error);
```

is read-only.

```js
assert.throw(function () {
  return aerobus().error = null;
});
```

is invoked with error thrown in subscriber.

```js
var result = undefined,
    error = new Error(),
    bus = aerobus({ error: function error(err) {
    return result = err;
  } });
bus.root.subscribe(function () {
  throw error;
}).publish();
setImmediate(function () {
  assert.strictEqual(result, error);
  done();
});
```

<a name="aerobus-root"></a>
## #root
is instance of Channel.

```js
assert.typeOf(aerobus().root, 'Aerobus.Channel');
```

is read-only.

```js
assert.throw(function () {
  return aerobus().root = null;
});
```

<a name="aerobus-trace"></a>
## #trace
is function.

```js
var bus = aerobus();
assert.isFunction(bus.trace);
```

is read-write.

```js
var trace = function trace() {},
    bus = aerobus();
bus.trace = trace;
assert.strictEqual(bus.trace, trace);
```

is invoked for channel.bubble() with arguments ("bubble", channel, true).

```js
var results = [],
    trace = function trace() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.bubble(true);
assert.strictEqual(results[0], 'bubble');
assert.strictEqual(results[1], bus.root);
assert.strictEqual(results[2], true);
```

is invoked for channel.bubble(false) with arguments ("bubble", channel, false).

```js
var results = [],
    trace = function trace() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.bubble(false);
assert.strictEqual(results[0], 'bubble');
assert.strictEqual(results[1], bus.root);
assert.strictEqual(results[2], false);
```

is invoked for channel.clear() with arguments ("clear", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.clear();
assert.strictEqual(results[0], 'clear');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.enable() with arguments ("enable", channel, true).

```js
var results = [],
    trace = function trace() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.enable();
assert.strictEqual(results[0], 'enable');
assert.strictEqual(results[1], bus.root);
assert.strictEqual(results[2], true);
```

is invoked for channel.enable(false) with arguments ("enable", channel, false).

```js
var results = [],
    trace = function trace() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.enable(false);
assert.strictEqual(results[0], 'enable');
assert.strictEqual(results[1], bus.root);
assert.strictEqual(results[2], false);
```

is invoked for channel.forward(@string) with arguments ("forward", channel, array) where array contains @string.

```js
var results = [],
    forwarder = 'test',
    trace = function trace() {
  for (var _len6 = arguments.length, args = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    args[_key6] = arguments[_key6];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.forward(forwarder);
assert.strictEqual(results[0], 'forward');
assert.strictEqual(results[1], bus.root);
assert.include(results[2], forwarder);
```

is invoked for channel.publish(@data) with arguments ("publish", channel, message) where message.data is @data.

```js
var data = {},
    results = [],
    trace = function trace() {
  for (var _len7 = arguments.length, args = Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
    args[_key7] = arguments[_key7];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.publish(data);
assert.strictEqual(results[0], 'publish');
assert.strictEqual(results[1], bus.root);
assert.typeOf(results[2], 'Aerobus.Message');
assert.strictEqual(results[2].data, data);
```

is invoked for channel.reset() with arguments ("reset", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len8 = arguments.length, args = Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
    args[_key8] = arguments[_key8];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.reset();
assert.strictEqual(results[0], 'reset');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.retain(@limit) with arguments ("retain", channel, @limit).

```js
var limit = 42,
    results = [],
    trace = function trace() {
  for (var _len9 = arguments.length, args = Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
    args[_key9] = arguments[_key9];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.retain(limit);
assert.strictEqual(results[0], 'retain');
assert.strictEqual(results[1], bus.root);
assert.strictEqual(results[2], limit);
```

is invoked for channel.subscribe(@function) with arguments ("subscribe", channel, array) where array contains Subscriber wrapping @function.

```js
var subscriber = function subscriber() {},
    results = [],
    trace = function trace() {
  for (var _len10 = arguments.length, args = Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
    args[_key10] = arguments[_key10];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.subscribe(subscriber);
assert.strictEqual(results[0], 'subscribe');
assert.strictEqual(results[1], bus.root);
assert.strictEqual(results[2][0].next, subscriber);
```

is invoked for channel.toggle() with arguments ("toggle", channel).

```js
var results = [],
    trace = function trace() {
  for (var _len11 = arguments.length, args = Array(_len11), _key11 = 0; _key11 < _len11; _key11++) {
    args[_key11] = arguments[_key11];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
bus.root.toggle();
assert.strictEqual(results[0], 'toggle');
assert.strictEqual(results[1], bus.root);
```

is invoked for channel.unsubscribe(@parameters) with arguments ("unsubscribe", channel, @parameters).

```js
var _bus$root;
var parameters = [function () {}],
    results = [],
    trace = function trace() {
  for (var _len12 = arguments.length, args = Array(_len12), _key12 = 0; _key12 < _len12; _key12++) {
    args[_key12] = arguments[_key12];
  }
  return results = args;
},
    bus = aerobus({ trace: trace });
(_bus$root = bus.root).unsubscribe.apply(_bus$root, parameters);
assert.strictEqual(results[0], 'unsubscribe');
assert.strictEqual(results[1], bus.root);
assert.includeMembers(results[2], parameters);
```

<a name="aerobus-unsubscribe"></a>
## #unsubscribe()
is fluent.

```js
var bus = aerobus(),
    subscriber = function subscriber() {};
assert.strictEqual(bus.unsubscribe(subscriber), bus);
```

clears #subscribers of all channels.

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
## #unsubscribe(@function)
removes @function from #subscribers of all channels.

```js
var bus = aerobus(),
    channel1 = bus('test1'),
    channel2 = bus('test2'),
    subscriber = function subscriber() {};
channel1.subscribe(subscriber);
channel2.subscribe(subscriber);
bus.unsubscribe(subscriber);
assert.notInclude(channel1.subscribers.map(function (existing) {
  return existing.next;
}), subscriber);
assert.notInclude(channel2.subscribers.map(function (existing) {
  return existing.next;
}), subscriber);
```

<a name="aerobus-unsubscribefunctions"></a>
## #unsubscribe(...@functions)
removes @functions from #subscribers of all channels.

```js
var bus = aerobus(),
    channel1 = bus('test1'),
    channel2 = bus('test2'),
    subscriber1 = function subscriber1() {},
    subscriber2 = function subscriber2() {};
channel1.subscribe(subscriber1, subscriber2);
channel2.subscribe(subscriber1, subscriber2);
bus.unsubscribe(subscriber1, subscriber2);
assert.notInclude(channel1.subscribers.map(function (existing) {
  return existing.next;
}), subscriber1);
assert.notInclude(channel1.subscribers.map(function (existing) {
  return existing.next;
}), subscriber2);
assert.notInclude(channel2.subscribers.map(function (existing) {
  return existing.next;
}), subscriber1);
assert.notInclude(channel2.subscribers.map(function (existing) {
  return existing.next;
}), subscriber2);
```

<a name="aerobuschannel"></a>
# Aerobus.Channel
<a name="aerobuschannel-bubble"></a>
## #bubble()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.bubble(), channel);
```

sets #bubbles.

```js
var channel = aerobus(false).root;
channel.bubble();
assert.isTrue(channel.bubbles);
```

<a name="aerobuschannel-bubblefalse"></a>
## #bubble(false)
clears #bubbles.

```js
var channel = aerobus().root;
channel.bubble(false);
assert.isFalse(channel.bubbles);
```

<a name="aerobuschannel-bubbles"></a>
## #bubbles
is boolean.

```js
assert.isTrue(aerobus().root.bubbles);
```

is inherited from parent bus.

```js
assert.isTrue(aerobus(true).root.bubbles);
assert.isFalse(aerobus(false).root.bubbles);
```

<a name="aerobuschannel-clear"></a>
## #clear()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.clear(), channel);
```

clears #retentions.

```js
var channel = aerobus().root;
channel.retain().publish().clear();
assert.strictEqual(channel.retentions.length, 0);
```

clears #subscribers.

```js
var channel = aerobus().root;
channel.subscribe(function () {}).clear();
assert.strictEqual(channel.subscribers.length, 0);
```

<a name="aerobuschannel-enable"></a>
## #enable()
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.root.enable(), bus.root);
```

sets #enabled.

```js
assert.isTrue(aerobus().root.enable(false).enable().enabled);
```

<a name="aerobuschannel-enablefalse"></a>
## #enable(false)
clears #enabled.

```js
assert.isFalse(aerobus().root.enable(false).enabled);
```

supresses publication to this channel.

```js
var result = false;
aerobus().root.subscribe(function () {
  return result = true;
}).enable(false).publish();
assert.isFalse(result);
```

supresses publication to descendant channel.

```js
var channel = aerobus()('parent.child'),
    result = false;
channel.subscribe(function () {
  return result = true;
}).parent.enable(false);
channel.publish();
assert.isFalse(result);
```

<a name="aerobuschannel-enabletrue"></a>
## #enable(true)
sets #enabled.

```js
assert.isTrue(aerobus().root.enable(false).enable(true).enabled);
```

resumes publication to this channel.

```js
var result = false;
aerobus().root.subscribe(function () {
  return result = true;
}).enable(false).enable(true).publish();
assert.isTrue(result);
```

resumes publication to descendant channel.

```js
var channel = aerobus()('parent.child'),
    result = false;
channel.subscribe(function () {
  return result = true;
}).parent.enable(false).enable(true);
channel.publish();
assert.isTrue(result);
```

<a name="aerobuschannel-enabled"></a>
## #enabled
is boolean.

```js
assert.isBoolean(aerobus().root.enabled);
```

is true by default.

```js
assert.isTrue(aerobus().root.enabled);
```

<a name="aerobuschannel-forward"></a>
## #forward()
throws.

```js
assert.throw(function () {
  return aerobus().root.forward();
});
```

<a name="aerobuschannel-forwardfunction"></a>
## #forward(@function)
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.root.forward(function () {}), bus.root);
```

adds @function to #forwarders.

```js
var bus = aerobus(),
    forwarder = function forwarder() {};
bus.root.forward(forwarder);
assert.include(bus.root.forwarders, forwarder);
```

forwards publications to channel defined by @function.

```js
var bus = aerobus(),
    result0 = undefined,
    result1 = undefined;
bus('0').subscribe(function (data) {
  return result0 = data;
});
bus('1').subscribe(function (data) {
  return result1 = data;
});
bus('test').forward(function (data) {
  return '' + data;
}).publish(0).publish(1);
assert.strictEqual(result0, 0);
assert.strictEqual(result1, 1);
```

forwards publications to multuple channels defined by @function.

```js
var bus = aerobus(),
    result0 = undefined,
    result1 = undefined,
    result2 = undefined;
bus('0').subscribe(function (data) {
  return result0 = data;
});
bus('1').subscribe(function (data) {
  return result1 = data;
});
bus('test').subscribe(function (data) {
  return result2 = data;
}).forward(function (data) {
  return ['0', '1', 'test'];
}).publish(true);
assert.isTrue(result0);
assert.isTrue(result1);
assert.isTrue(result2);
```

does not forward publication when @function returns null.

```js
var bus = aerobus(),
    result = undefined;
bus('test').subscribe(function (data) {
  return result = data;
}).forward(function () {
  return null;
}).publish(true);
assert.isTrue(result);
```

does not forward publication when @function returns undefined.

```js
var bus = aerobus(),
    result = undefined;
bus('test').subscribe(function (data) {
  return result = data;
}).forward(function () {}).publish(true);
assert.isTrue(result);
```

does not forward publication when @function returns #name of this channel.

```js
var bus = aerobus(),
    result = undefined;
bus('test').subscribe(function (data) {
  return result = data;
}).forward(function () {
  return 'test';
}).publish(true);
assert.isTrue(result);
```

stops forwarding publication when infinite forwarding loop is detected.

```js
var bus = aerobus(),
    notifications = 0;
bus('test0').forward(function () {
  return 'test1';
});
bus('test1').forward(function () {
  return 'test0';
}).subscribe(function () {
  return notifications++;
}).publish(true);
assert.strictEqual(notifications, 1);
```

<a name="aerobuschannel-forwardstring"></a>
## #forward(@string)
adds @string to #forwarders.

```js
var bus = aerobus(),
    forwarder = 'test';
bus.root.forward(forwarder);
assert.include(bus.root.forwarders, forwarder);
```

forwards publications to channel specified by @string.

```js
var bus = aerobus(),
    result = undefined;
bus('sink').subscribe(function (data) {
  return result = data;
});
bus('test').forward('sink').publish(true);
assert.isTrue(result);
```

<a name="aerobuschannel-forwardfunction-string"></a>
## #forward(@function, @string)
adds @function and @string to #forwarders.

```js
var _bus$root2;
var bus = aerobus(),
    forwarders = [function () {}, 'test'];
(_bus$root2 = bus.root).forward.apply(_bus$root2, forwarders);
assert.includeMembers(bus.root.forwarders, forwarders);
```

<a name="aerobuschannel-forwardfunction--string"></a>
## #forward(!(@function || @string))
throws.

```js
[new Array(), true, new Date(), 1, {}].forEach(function (value) {
  return assert.throw(function () {
    return aerobus().root.forward(value);
  });
});
```

<a name="aerobuschannel-forwarders"></a>
## #forwarders
is array.

```js
assert.isArray(aerobus().root.forwarders);
```

is empty by default.

```js
assert.strictEqual(aerobus().root.forwarders.length, 0);
```

<a name="aerobuschannel-symboliterator"></a>
## #[Symbol.iterator]
is function.

```js
assert.isFunction(aerobus().root[Symbol.iterator]);
```

<a name="aerobuschannel-symboliterator-"></a>
## #[Symbol.iterator] ()
is instance of Aerobus.Iterator.

```js
assert.typeOf(aerobus().root[Symbol.iterator](), 'Aerobus.Iterator');
```

<a name="aerobuschannel-name"></a>
## #name
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
## #parent
is instance of Channel for custom channel.

```js
assert.typeOf(aerobus()('test').parent, 'Aerobus.Channel');
```

is root channel for channel of first level.

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

is undefined for root channel.

```js
assert.isUndefined(aerobus().root.parent);
```

<a name="aerobuschannel-publish"></a>
## #publish()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.publish(), channel);
```

notifies own subscribers in subcription order .

```js
var results = [],
    subscriber0 = function subscriber0() {
  return results.push('first');
},
    subscriber1 = function subscriber1() {
  return results.push('second');
};
aerobus().root.subscribe(subscriber0, subscriber1).publish();
assert.strictEqual(results[0], 'first');
assert.strictEqual(results[1], 'second');
```

notifies ancestor subscribers before own if #bubbles is set.

```js
var channel = aerobus()('parent.child').bubble(true),
    results = [],
    ancestor = function ancestor() {
  return results.push('ancestor');
},
    parent = function parent() {
  return results.push('parent');
},
    self = function self() {
  return results.push('self');
};
channel.parent.parent.subscribe(ancestor);
channel.parent.subscribe(parent);
channel.subscribe(self);
channel.publish();
assert.strictEqual(results.length, 3);
assert.strictEqual(results[0], 'ancestor');
assert.strictEqual(results[1], 'parent');
assert.strictEqual(results[2], 'self');
```

does not notify ancestor subscribers if #bubbles is not set.

```js
var channel = aerobus()('parent.child').bubble(false),
    results = [],
    ancestor = function ancestor() {
  return results.push('ancestor');
},
    parent = function parent() {
  return results.push('parent');
},
    self = function self() {
  return results.push('self');
};
channel.parent.parent.subscribe(ancestor);
channel.parent.subscribe(parent);
channel.subscribe(self);
channel.publish();
assert.strictEqual(results.length, 1);
assert.strictEqual(results[0], 'self');
```

<a name="aerobuschannel-publishobject"></a>
## #publish(@object)
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

<a name="aerobuschannel-publishobject-function"></a>
## #publish(@object, @function)
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
}).publish({}, callback);
assert.include(results, result0);
assert.include(results, result1);
assert.include(results, result2);
```

<a name="aerobuschannel-reset"></a>
## #reset()
is be fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.reset(), channel);
```

sets #enabled.

```js
var channel = aerobus().root;
channel.enable(false).reset();
assert.isTrue(channel.enabled);
```

clears #forwarders.

```js
var channel = aerobus().root;
channel.forward('test').reset();
assert.strictEqual(channel.forwarders.length, 0);
```

clears #retentions.

```js
var channel = aerobus().root;
channel.retain().publish().reset();
assert.strictEqual(channel.retentions.length, 0);
```

resets #retentions.limit.

```js
var channel = aerobus().root;
channel.retain().publish().reset();
assert.strictEqual(channel.retentions.limit, 0);
```

clears #subscribers.

```js
var channel = aerobus().root;
channel.subscribe(function () {}).reset();
assert.strictEqual(channel.subscribers.length, 0);
```

<a name="aerobuschannel-retain"></a>
## #retain()
is fluent.

```js
var bus = aerobus();
assert.strictEqual(bus.root.retain(), bus.root);
```

sets #retentions.limit property to Number.MAX_SAFE_INTEGER.

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
## #retain(false)
sets #retentions.limit to 0.

```js
var channel = aerobus().root;
channel.retain(false);
assert.strictEqual(channel.retentions.limit, 0);
```

clears #retentions.

```js
var channel = aerobus().root,
    publication0 = {},
    publication1 = {};
channel.retain().publish(publication0).publish(publication1).retain(false);
assert.strictEqual(channel.retentions.length, 0);
```

<a name="aerobuschannel-retaintrue"></a>
## #retain(true)
sets #retentions.limit to Number.MAX_SAFE_INTEGER.

```js
var channel = aerobus().root;
channel.retain(true);
assert.strictEqual(channel.retentions.limit, Number.MAX_SAFE_INTEGER);
```

<a name="aerobuschannel-retainnumber"></a>
## #retain(@number)
sets #retentions.limit to @number.

```js
var limit = 42,
    channel = aerobus().root;
channel.retain(limit);
assert.strictEqual(channel.retentions.limit, limit);
```

<a name="aerobuschannel-retentions"></a>
## #retentions
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
## #retentions.limit
is number.

```js
assert.isNumber(aerobus().root.retentions.limit);
```

<a name="aerobuschannel-subscribe"></a>
## #subscribe()
throws.

```js
assert.throw(function () {
  return aerobus().root.subscribe();
});
```

<a name="aerobuschannel-subscribefunction"></a>
## #subscribe(@function)
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.subscribe(function () {}), channel);
```

adds new subscriber to #subscribers, Subscriber#next returns @function.

```js
var channel = aerobus().root,
    subscriber = function subscriber() {};
channel.subscribe(subscriber);
assert.strictEqual(channel.subscribers[0].next, subscriber);
```

<a name="aerobuschannel-subscribefunctions"></a>
## #subscribe(...@functions)
adds new subscribers to #subscribers, each Subscriber#next returns next element of @functions.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel.subscribe(subscriber0, subscriber1);
assert.strictEqual(channel.subscribers[0].next, subscriber0);
assert.strictEqual(channel.subscribers[1].next, subscriber1);
```

<a name="aerobuschannel-subscribenumber-function"></a>
## #subscribe(@number, @function)
adds new subscriber to #subscribers, Subscriber#order returns @number.

```js
var channel = aerobus().root,
    order = -1;
channel.subscribe(order, function () {});
assert.strictEqual(channel.subscribers[0].order, order);
```

adds new subscriber to #subscribers, logical position of Subscriber matches @number.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel.subscribe(2, subscriber0).subscribe(1, subscriber1);
assert.strictEqual(channel.subscribers[0].next, subscriber1);
assert.strictEqual(channel.subscribers[1].next, subscriber0);
```

<a name="aerobuschannel-subscribenumber-functions"></a>
## #subscribe(@number, ...@functions)
adds new subscribers to #subscribers, each Subscriber#order returns @number.

```js
var channel = aerobus().root,
    order = 1;
channel.subscribe(order, function () {}, function () {});
assert.strictEqual(channel.subscribers[0].order, order);
assert.strictEqual(channel.subscribers[1].order, order);
```

adds new subscribers to #subscribers, logical position of each Subscriber matches @number.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {},
    subscriber2 = function subscriber2() {};
channel.subscribe(subscriber0).subscribe(-1, subscriber1, subscriber2);
assert.strictEqual(channel.subscribers[0].next, subscriber1);
assert.strictEqual(channel.subscribers[1].next, subscriber2);
assert.strictEqual(channel.subscribers[2].next, subscriber0);
```

<a name="aerobuschannel-subscribestring-function"></a>
## #subscribe(@string, @function)
adds new subscriber to #subscribers, Subscriber#name returns @string.

```js
var channel = aerobus().root,
    name = 'test';
channel.subscribe(name, function () {});
assert.strictEqual(channel.subscribers[0].name, name);
```

<a name="aerobuschannel-subscribeobject"></a>
## #subscribe(@object)
adds new subscriber to #subscribers, Subscriber#done calls @object.done.

```js
var channel = aerobus().root,
    called = false,
    subscriber = {
  done: function done() {
    return called = true;
  },
  next: function next() {}
};
channel.subscribe(subscriber);
channel.subscribers[0].done();
assert.isTrue(called);
```

adds new subscriber to #subscribers, Subscriber#next calls @object.next.

```js
var channel = aerobus().root,
    called = false,
    subscriber = {
  done: function done() {},
  next: function next() {
    return called = true;
  }
};
channel.subscribe(subscriber);
channel.subscribers[0].next();
assert.isTrue(called);
```

adds new subscriber to #subscribers, Subscriber#name returns @object.name.

```js
var channel = aerobus().root,
    subscriber = {
  name: 'test',
  next: function next() {}
};
channel.subscribe(subscriber);
assert.strictEqual(channel.subscribers[0].name, subscriber.name);
```

adds new subscriber to #subscribers, Subscriber#order returns @object.order.

```js
var channel = aerobus().root,
    subscriber = {
  next: function next() {},
  order: 1
};
channel.subscribe(subscriber);
assert.strictEqual(channel.subscribers[0].order, subscriber.order);
```

throws if @object#done is not a function.

```js
[new Array(), true, new Date(), 1, {}, 'test'].forEach(function (value) {
  return assert.throw(function () {
    return aerobus().root.subscribe({
      done: value
    });
  });
});
```

throws if @object#name is not a string.

```js
[new Array(), true, new Date(), function () {}, 1, {}].forEach(function (value) {
  return assert.throw(function () {
    return aerobus().root.subscribe({
      name: value,
      next: function next() {}
    });
  });
});
```

throws if @object does not contain #next.

```js
assert.throw(function () {
  return aerobus().root.subscribe({});
});
```

throws if @object#next is not a function.

```js
[new Array(), true, new Date(), 1, {}, 'test'].forEach(function (value) {
  return assert.throw(function () {
    return aerobus().root.subscribe({
      next: value
    });
  });
});
```

throws if @object#order is not a number.

```js
[new Array(), true, new Date(), function () {}, {}, 'test'].forEach(function (value) {
  return assert.throw(function () {
    return aerobus().root.subscribe({
      next: function next() {},
      order: value
    });
  });
});
```

<a name="aerobuschannel-subscribers"></a>
## #subscribers
is array.

```js
assert.isArray(aerobus().root.subscribers);
```

is empty array by default.

```js
assert.strictEqual(aerobus().root.subscribers.length, 0);
```

<a name="aerobuschannel-toggle"></a>
## #toggle()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.toggle(), channel);
```

disables enabled channel.

```js
assert.isFalse(aerobus().root.enable(true).toggle().enabled);
```

enables disabled channel.

```js
assert.isTrue(aerobus().root.enable(false).toggle().enabled);
```

<a name="aerobuschannel-unsubscribe"></a>
## #unsubscribe()
is fluent.

```js
var channel = aerobus().root;
assert.strictEqual(channel.unsubscribe(), channel);
```

<a name="aerobuschannel-unsubscribefunction"></a>
## #unsubscribe(@function)
removes @function from #subscribers.

```js
var channel = aerobus().root,
    subscriber = function subscriber() {};
channel.subscribe(subscriber).unsubscribe(subscriber);
assert.notInclude(channel.subscribers.map(function (existing) {
  return existing.next;
}), subscriber);
assert.notInclude(channel.subscribers.map(function (existing) {
  return existing.next;
}), subscriber);
```

<a name="aerobuschannel-unsubscribefunctions"></a>
## #unsubscribe(...@functions)
removes all @functions from #subscribers.

```js
var channel = aerobus().root,
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel.subscribe(subscriber0, subscriber1).unsubscribe(subscriber0, subscriber1);
assert.notInclude(channel.subscribers.map(function (existing) {
  return existing.next;
}), subscriber0);
assert.notInclude(channel.subscribers.map(function (existing) {
  return existing.next;
}), subscriber1);
```

<a name="aerobuschannel-unsubscribestring"></a>
## #unsubscribe(@string)
removes all subscriptions name as @string from #subscribers.

```js
var channel = aerobus().root,
    name = 'test',
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
channel.subscribe(name, subscriber0).subscribe(subscriber1).unsubscribe(name);
assert.notInclude(channel.subscribers.map(function (existing) {
  return existing.next;
}), subscriber0);
assert.include(channel.subscribers.map(function (existing) {
  return existing.next;
}), subscriber1);
```

<a name="aerobusiterator"></a>
# Aerobus.Iterator
<a name="aerobusiterator-done"></a>
## #done()
rejects pending promise returned from iterator.

```js
var iterator = aerobus().root[Symbol.iterator]();
iterator.next().value.then(function () {}, done);
iterator.done();
```

<a name="aerobusiterator-next"></a>
## #next()
returns object.

```js
var iterator = aerobus().root[Symbol.iterator]();
assert.isObject(iterator.next());
```

<a name="aerobusiterator-nextdone"></a>
## #next().done
is undefined by default.

```js
var iterator = aerobus().root[Symbol.iterator]();
assert.isUndefined(iterator.next().done);
```

is true after iterator has been #done().

```js
var iterator = aerobus().root[Symbol.iterator]();
iterator.done();
assert.isTrue(iterator.next().done);
```

<a name="aerobusiterator-nextvalue"></a>
## #next().value
is Promise.

```js
assert.typeOf(aerobus().root[Symbol.iterator]().next().value, 'Promise');
```

is pending promise by default.

```js
var pending = {},
    result = undefined,
    iterator = aerobus().root[Symbol.iterator]();
Promise.race([iterator.next().value, Promise.resolve(pending)]).then(function (resolved) {
  return result = resolved;
});
setImmediate(function () {
  assert.strictEqual(result, pending);
  done();
});
```

resolves with message published earlier.

```js
var data = {},
    result = undefined,
    channel = aerobus().root,
    iterator = channel[Symbol.iterator]();
channel.publish(data);
iterator.next().value.then(function (resolved) {
  return result = resolved;
});
setImmediate(function () {
  assert.typeOf(result, 'Aerobus.Message');
  assert.strictEqual(result.data, data);
  done();
});
```

resolves with message published later.

```js
var data = {},
    result = undefined,
    channel = aerobus().root,
    iterator = channel[Symbol.iterator]();
iterator.next().value.then(function (message) {
  return result = message;
});
setImmediate(function () {
  assert.isUndefined(result);
  channel.publish(data);
});
setTimeout(function () {
  assert.typeOf(result, 'Aerobus.Message');
  assert.strictEqual(result.data, data);
  done();
}, 10);
```

ignores channel strategies.

```js
var result = 0,
    channel = aerobus().root;
channel.cycle(1);
channel[Symbol.iterator]().next().value.then(function (_) {
  return result++;
});
channel[Symbol.iterator]().next().value.then(function (_) {
  return result++;
});
channel.publish();
channel.shuffle(1);
channel[Symbol.iterator]().next().value.then(function (_) {
  return result++;
});
channel[Symbol.iterator]().next().value.then(function (_) {
  return result++;
});
channel.publish();
setImmediate(function () {
  assert.strictEqual(result, 4);
  done();
});
```

<a name="aerobusmessage"></a>
# Aerobus.Message
<a name="aerobusmessage-cancel"></a>
## #cancel
skips subsequent subscriber when returned from preceeding subscriber.

```js
var results = 0,
    canceller = function canceller(_, message) {
  return message.cancel;
},
    subscriber = function subscriber(_, message) {
  return results++;
};
aerobus().root.subscribe(canceller, subscriber).publish();
assert.strictEqual(results, 0);
```

skips subsequent subscriber when returned from subscriber of parent channel.

```js
var channel = aerobus()('test'),
    results = 0,
    canceller = function canceller(_, message) {
  return message.cancel;
},
    subscriber = function subscriber(_, message) {
  return results++;
};
channel.parent.subscribe(canceller);
channel.subscribe(subscriber).publish();
assert.strictEqual(results, 0);
```

<a name="aerobusmessage-data"></a>
## #data
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

<a name="aerobusmessage-destination"></a>
## #destination
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
## #route
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

<a name="aerobussection"></a>
# Aerobus.Section
<a name="aerobussection-channels"></a>
## #channels
is array.

```js
assert.isArray(aerobus()('test1', 'test2').channels);
```

contains all referenced #channels.

```js
var bus = aerobus(),
    channel0 = bus('test0'),
    channel1 = bus('test1'),
    section = bus('test0', 'test1');
assert.include(section.channels, channel0);
assert.include(section.channels, channel1);
```

<a name="aerobussection-clear"></a>
## #clear()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.clear(), section);
```

clears #subscribers of all #channels.

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

<a name="aerobussection-enable"></a>
## #enable()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.enable(), section);
```

sets #enabled for all #channels.

```js
var section = aerobus()('test1', 'test2');
section.enable(false).enable();
section.channels.forEach(function (channel) {
  return assert.isTrue(channel.enabled);
});
```

<a name="aerobussection-enablefalse"></a>
## #enable(false)
clears #enabled for all #channels.

```js
var section = aerobus()('test1', 'test2');
section.enable(false);
section.channels.forEach(function (channel) {
  return assert.isFalse(channel.enabled);
});
```

<a name="aerobussection-forwardstring"></a>
## #forward(@string)
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.forward(''), section);
```

adds @string to #forwarders of all #channels.

```js
var section = aerobus()('test1', 'test2'),
    forwarder = '';
section.forward(forwarder);
section.channels.forEach(function (channel) {
  return assert.include(channel.forwarders, forwarder);
});
```

<a name="aerobussection-publish"></a>
## #publish()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.publish(), section);
```

<a name="aerobussection-publishobject"></a>
## #publish(@object)
publishes @object to all #channels in order of channel reference.

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
## #subscribe()
throws.

```js
assert.throw(function () {
  return aerobus()('test1', 'test2').subscribe();
});
```

<a name="aerobussection-subscribefunction"></a>
## #subscribe(@function)
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.subscribe(function () {}), section);
```

adds @function to #subscribers of all #channels.

```js
var section = aerobus()('test1', 'test2'),
    subscriber = function subscriber() {};
section.subscribe(subscriber);
section.channels.forEach(function (channel) {
  return assert.include(channel.subscribers.map(function (existing) {
    return existing.next;
  }), subscriber);
});
```

<a name="aerobussection-subscribefunction0-function1"></a>
## #subscribe(@function0, @function1)
adds @function to #subscribers all #channels.

```js
var section = aerobus()('test1', 'test2'),
    subscriber0 = function subscriber0() {},
    subscriber1 = function subscriber1() {};
section.subscribe(subscriber0, subscriber1);
section.channels.forEach(function (channel) {
  assert.include(channel.subscribers.map(function (existing) {
    return existing.next;
  }), subscriber0);
  assert.include(channel.subscribers.map(function (existing) {
    return existing.next;
  }), subscriber1);
});
```

<a name="aerobussection-toggle"></a>
## #toggle()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.toggle(), section);
```

clears #enabled for all enabled #channels.

```js
var section = aerobus()('test1', 'test2');
section.enable(true).toggle();
section.channels.forEach(function (channel) {
  return assert.isFalse(channel.enabled);
});
```

sets #enabled for all disabled #channels.

```js
var section = aerobus()('test1', 'test2');
section.enable(false).toggle();
section.channels.forEach(function (channel) {
  return assert.isTrue(channel.enabled);
});
```

<a name="aerobussection-unsubscribe"></a>
## #unsubscribe()
is fluent.

```js
var section = aerobus()('test1', 'test2');
assert.strictEqual(section.unsubscribe(), section);
```

<a name="aerobussection-unsubscribefunction"></a>
## #unsubscribe(@function)
removes @function from #subscribers of all #channels.

```js
var section = aerobus()('test1', 'test2'),
    subscriber = function subscriber() {};
section.subscribe(subscriber).unsubscribe(subscriber);
section.channels.forEach(function (channel) {
  return assert.notInclude(channel.subscribers.map(function (existing) {
    return existing.next;
  }), subscriber);
});
```

