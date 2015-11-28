# ⚙ Aerobus

Pure ES2015, fluent in-memory message bus implementing both [publish–subscribe](https://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) and [request-response](https://en.wikipedia.org/wiki/Request%E2%80%93response) communication patterns to turn low-level platform events into high-level domain messages and loose [coupling](https://en.wikipedia.org/wiki/Coupling_(computer_programming)) between software modules.

Complete (_not yet :|_) api documentation is [here](https://github.com/vladen/aerobus/tree/master/doc).

## Excerpt

Create new instance of the message bus:
```js
var bus = aerobus();
```

Create new communication channel named 'test':
```js
var channel = bus('test');
```

Subscribe several subscriptions to the test channel:
```js
channel.subscribe((data, message) => {}, (data, message) => {});
```

Publish some data to the test channel:
```js
channel.publish({});
```

Disable test channel and ignore subsequent publication:
```js
channel.disable().publish({});
```

Enable test channel, unsubscribe all existing subscriptions, subscribe a function returning some value, publish data and specify callback to be invoked with responses from all notified subscriptions collected to array:
```js
channel.enable().unsubscribe().subscribe(() => 'test').publish(data, responses => {});
```

Subscribe to several channels at once, the publish to those channels:
```js
bus('test1', 'test2').subscribe((data, message) => {}).publish({});
```

## Installation

```
$ npm install aerobus
```

## Dependencies

Since aerobus heavily uses ES6 features (Maps, Symbols, iterators, arrow functions, rest parameters, etc.), it depends on [core-js](https://github.com/zloirock/core-js) standard library and uses [babeljs](babeljs.io) to transpile ES6 code into ES5.

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

> Npm scripts contain the corresponsing set of build, lint and test scripts.

Compile both the library and tests:
```
$ npm run compile
```

Compile and run tests:
```
$ npm run test
```

Run [eslint](http://eslint.org/):
```
$ npm run lint
```

> File index.html (located in the repository root) can be used to run tests in browser as well as play with library in the developer console.

