# ⚙ Aerobus

Pure ES2015, fluent in-memory message bus implementing both [publish–subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and [request-response](https://en.wikipedia.org/wiki/Request%E2%80%93response) communication patterns to turn low-level platform events into high-level domain messages and loose [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) between software modules.

[![view on npm](http://img.shields.io/npm/v/aerobus.svg)](https://www.npmjs.org/package/aerobus)
[![npm module downloads](http://img.shields.io/npm/dt/aerobus.svg)](https://www.npmjs.org/package/aerobus)
[![build status](https://api.travis-ci.org/vladen/aerobus.svg?branch=master)](https://travis-ci.org/vladen/aerobus)

__Contents:__
* [Excerpt](#excerpt)
* [Installation](#installation)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [API documentation](https://github.com/vladen/aerobus/tree/master/doc)
* [Test case specifications](https://github.com/vladen/aerobus/tree/master/spec)

## Excerpt

Create new instance of the message bus:
```js
var bus = aerobus();
```

Create new communication channel named 'test':
```js
var channel = bus('test');
```

Subscribe several subscribers to the test channel:
```js
var subscriber = () => console.log('one');
channel.subscribe(
    subscriber
  , data => console.log('two', data)
  , (data, message) => console.log('three', data, message));
```

Publish some data to the test channel:
```js
channel.publish('hi');
// => one
// =>  two hi
// =>  three hi Message {data: "Hi", destination: "test", id: 1, ...
```

Shuffle channel and deliver every publication to one random subscriber:
```js
channel
    .shuffle()
    .publish('random 1');
// => two random 1
channel.publish('random 1');
// => one
channel.publish('random 1');
// => three random 1 Message {data: "random 1", destination: "test", id: 4, ...
```

or two random subscribers:
```js
channel
    .shuffle(2)
    .publish('random 2');
// => one
// => three random 2 Message {data: "random 2", destination: "test", id: 5, ...
```

Cycle channel and deliver every publication to one next subscriber:
```js
channel
    .cycle()
    .publish('next 1');
// => one
channel.publish('next 1');
// => two next 1
channel.publish('next 1');
// => three next 1 Message {data: "next 1", destination: "test", id: 8, ...
channel.publish('next 1');
// => one
```

or two next subscribers with step 1:
```js
channel
    .cycle(2, 1)
    .publish('next 2');
// => one
// => two next 2
channel.publish('next 2');
// => two next 2
// => three next 2 Message {data: "next 2", destination: "test", id: 11, ...
channel.publish('next 2');
// => three next 2 Message {data: "next 2", destination: "test", id: 12, ...
// => one
```

Unsubscribe one subscriber from channel:
```js
channel.unsubscribe(subscriber);
```

or unsubscribe all subscribers:
```js
channel.unsubscribe();
```

or reset the channel to remove all subscribers and set everything to defaults:
```js
channel.reset();
```

Specify subscriber's order to change its priority and name to unsubsribe by this name:
```js
channel
    .subscribe(2, () => console.log('one'))
    .subscribe('name', () => console.log('two'))
    .publish();
// => two
// => one
channel
    .unsubscribe('name')
    .publish();
// => one
```

Disable channel and ignore subsequent publication:
```js
channel.disable().publish();
```

Enable channel, unsubscribe all subscribers, subscribe some functions returning values, publish a message and collect return values from all notified subscribers to array passed to the provided callback function:
```js
channel
    .enable()
    .unsubscribe()
    .subscribe(() => 'one', () => 'two')
    .publish({}, responses => console.log(responses));
// => ["one", "two"]
```

Retain latest publication and deliver it to all subsequent subscribers when they are subscribed:
```js
channel
    .retain(1)
    .publish([1, 2, 3])
    .subscribe(data => console.log(data));
// => [1, 2, 3]
channel.subscribe(data => console.log(data));
// => [1, 2, 3]
```

Subscribe to parent channel and collect all publications made to descendant channels:
```js
bus('parent')
    .subscribe(data => console.log('parent', data));
bus('parent.child1')
    .publish(1);
bus('parent.child2')
    .publish(2);
// => parent 1
// => parent 2
```

Subscribe to several channels at once, then enable those channels and publish to all:
```js
bus('test1', 'test2')
    .subscribe((data, message) => console.log(data, message))
    .enable()
    .publish(42);
// => 42 Message {channel: Channel, data: 42, ...
// => 42 Message {channel: Channel, data: 42, ...
```

Extend all channel instances with custom method:
```js
var extendedBus = aerobus({
    channel: {
        dump: function() {
            return this.subscribe((data, message) => console.log(this.name, data, message));
        }
    }
});
extendedBus('some.channel')
    .dump()
    .publish('Hi');
// => some.channel Hi Message {channel: Channel, data: "Hi", 
```

Attach trace function to see what's happening inside:
```js
var tracingBus = aerobus((...args) => console.log(...args));
tracingBus('test1', 'test2')
    .enable()
    .subscribe(() => {})
    .publish(42)
    .unsubscribe();
// => create Channel {name: "", ...
// => create Channel {name: "test1", ...
// => create Channel {name: "test2", ...
// => enable Channel {name: "test1", ...} true
// => enable Channel {name: "test2", ...} true
// => subscribe Channel {name: "test1", ...} [function]
// => subscribe Channel {name: "test2", ...} [function]
// => publish Channel {name: "test1", ...} Message {data: 42, destination: "test1", id: 1, ...}
// => publish Channel {name: ""} Message {data: 42, destination: "", id: 1, ...}
// => publish Channel {name: "test2", ...} Message {data: 42, destination: "test2", id: 2, ...}
// => publish Channel {name: ""} Message {data: 42, destination: "", id: 2, ...}
// => unsubscribe Channel {name: "test1", parent: Channel, ...} []
// => unsubscribe Channel {name: "test2", parent: Channel, ...} []
```

Clear the bus to remove all channels and reclaim memory:
```js
bus.clear();
```

Now, attempt to use deleted channel will throw error:
```js
channel.publish();
// => Uncaught Error: This instance of Aerobus.Channel object has been deleted.
```

## Installation

```
$ npm install aerobus
```

## Dependencies

Since aerobus heavily uses ES6 features (Maps, Symbols, iterators, arrow functions, rest parameters, etc.), it requires [core-js](https://github.com/zloirock/core-js) standard library for legacy environments and relies on [babeljs](babeljs.io) to transpile ES6 code into ES5.

## Usage

NodeJs:
```js
var aerobus = require('aerobus');
var bus = aerobus();
```

Browser:
```html
<script src="lib/aerobus.js"></script>
<script>
    var bus = aerobus();
</script>
```

> The [scripts section](https://github.com/vladen/aerobus/blob/master/package.json) of the package.json file contains the full set of build, lint and test scripts.

Build both the library and tests, minify the library:
```
$ npm run build
```

Run tests:
```
$ npm run test
```

Run [eslint](http://eslint.org/) for both the library and tests:
```
$ npm run lint
```

Run jsdoc and specs generators:
```
$ npm run doc
```

> Index.html (located in the repository root folder) can be used for running tests in browser as well as playing with library in the developer console.

