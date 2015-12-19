# ⚙ Aerobus

Pure ES2015, fluent, in-memory message bus implementing both [publish–subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and [request-response](https://en.wikipedia.org/wiki/Request%E2%80%93response) communication patterns to turn low-level platform events into high-level domain messages and loose [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) between software modules.

[![view on npm](http://img.shields.io/npm/v/aerobus.svg)](https://www.npmjs.org/package/aerobus)
[![npm module downloads](http://img.shields.io/npm/dt/aerobus.svg)](https://www.npmjs.org/package/aerobus)
[![build status](https://api.travis-ci.org/vladen/aerobus.svg?branch=master)](https://travis-ci.org/vladen/aerobus)

__Contents:__
* [Features](#features)
* [Installation](#installation)
* [Dependencies](#dependencies)
* [Usage](#usage)
* [Recipies](#recipies)
* [API documentation](https://github.com/vladen/aerobus/tree/master/doc)
* [Test cases](https://github.com/vladen/aerobus/tree/master/spec)

## Features
* Reliable fail-safe publications delivery and unified error handling
* Hierarchical channel model with support of channel activation/deactivation, publication bubbling, retention and dynamic forwarding, several delivery strategies
* Centralized monitoring of all internal activity via tracing
* Ease injection of custom logic through extensibility points

## Installation

```
$ npm install aerobus
```

## Dependencies

Since aerobus heavily uses ES6 features (Maps, Symbols, iterators, arrow functions, rest parameters, etc.), it depends on [core-js](https://github.com/zloirock/core-js) standard library when hosted in legacy environment and relies on [babeljs](babeljs.io) to transpile ES6 code into ES5.

The lib folder of this repository contains actual, ES5 compatible, transpiled (lib/aerobus.js) and minified (lib/aerobus.min.js) versions of library and tests (lib/aerobus.spec.js).

The src folder of this repository contains original, ES6 version of library (src/aerobus.js) and tests (src/aerobus.spec.js).

Npm package description file (package.json) targets ES5 environment and requires [core-js](https://github.com/zloirock/core-js) library entirely (with global namespace pullution) and transpiled (ES5 compatible) version of Aerobus.

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

> The [scripts section](https://github.com/vladen/aerobus/blob/master/package.json) of the package.json file contains set of build, lint and test scripts.

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

## Recipies

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
    subscriber // first subscriber
  , data => console.log('two', data) // second subscriber
  , (data, message) => console.log('three', data, message) // third subscriber
);
// => Channel {name: "test", ...
```

Publish some data to the test channel:
```js
channel.publish('hi');
// => one
// => two hi
// => three hi Message {data: "Hi", destination: "test", id: 1, ...
```

Switch channel to the 'shuffle' strategy and deliver every publication to a single randomly selected subscriber:
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

or two randomly selected subscribers:
```js
channel
    .shuffle(2)
    .publish('random 2');
// => one
// => three random 2 Message {data: "random 2", destination: "test", id: 5, ...
```

Switch channel to the 'cycle' strategy and deliver every publication to a single successive subscriber:
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

or two successive subscribers with overlap (step 1):
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

or unsubscribe all at once:
```js
channel.unsubscribe();
```

Subscribe to parent channel and handle publications made to descendant channels:
```js
channel.parent.subscribe((_, message) => console.log('Bubbled', message, message.route));
channel.publish('Hi');
// => Bubbled Message {data: "Hi", destination: "", ...} ["test", ""]
bus('test.child').publish('Hi');
// => Bubbled Message {data: "Hi", ...} ["test.child", "test", ""]
```

Reset parent channel to remove all subscribers and reset all channel settings to defaults:
```js
channel.parent.reset();
```

Specify subscriber's order and name to change its priority and then unsubsribe by this name:
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
channel.enable(false).publish();
```

Enable channel, unsubscribe all subscribers, subscribe some functions returning some values and publish providing additional callback. All values returned by the subscribers will be gathered in an array and passed to the callback provided:
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

Subscribe to several channels at once, then enable those channels and publish to all:
```js
bus('test1', 'test2')
    .subscribe((data, message) => console.log(data, message))
    .enable()
    .publish(42);
// => 42 Message {channel: Channel, data: 42, ...
// => 42 Message {channel: Channel, data: 42, ...
```

Forward publications made to a channel to other channels defined dynamically by a callback:
```js
bus('odd', 'even').subscribe(
    (_, message) => console.log(message.destination, message.data));
bus('sink')
    .forward(data => data % 2 ? 'odd' : 'even')
    .publish(1)
    .publish(2)
    .publish(3)
    .publish(4);
// => odd 1
// => even 2
// => odd 3
// => even 4
```

Extend all channels of a bus with custom method:
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

Clear the bus to remove all channels and reclaim memory:
```js
bus.clear();
```

Now, attempt to use deleted channel:
```js
channel.publish();
// => Uncaught Error: This instance of Aerobus.Channel object has been deleted.
```

Aerobus supports channel hierarchy with publications bubbling similar to [DOM events bubbling](http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-flow-bubbling). Hierarchical channel names are separated with delimiter (dot by default), which is configurable:
```js
aerobus(':').delimiter;
// => ":"
```

Every subscriber of every channel is notified within try block. This ensures that all subsequent subscribers will still be notified even if preceeding subscriber throws. To handle error thrown by a subscriber you may want to define the error callback. This callback is invoked asyncronously via [setImmediate](https://github.com/zloirock/core-js#setimmediate) and by default just re-throws the error:
```js
aerobus((error, message) => console.error('Handled', error, message))
    .root
    .subscribe(() => console.log('Before error'))
    .subscribe(() => {throw new Error('Oops!')})
    .subscribe(() => console.log('After error'))
    .publish('Hi');
// => Before error
// => After error
// => Handled Error: Oops!(…) Message {data: "Hi", destination: "", ...}
```

For effective debugging configure bus with trace function to see what's happening inside:
```js
var tracingBus = aerobus({ trace: (...args) => console.log(...args) });
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

Join all configuration settings into single more readable object literal:
```js
var configuredBus = aerobus({
    channel: {
        dump: () = > this.subscribe(
            (data, message) => console.log(this.name, data, message))
    }
  , delimiter: ':'
  , error: (error, message) => console.log(error, message)
  , trace: (...args) => console.log(...args)
});
```

See [API documentation](https://github.com/vladen/aerobus/tree/master/doc) and [Test cases](https://github.com/vladen/aerobus/tree/master/spec) for additional information and recepies.

> Happy coding!