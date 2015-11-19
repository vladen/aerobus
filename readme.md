# ~ Aerobus ~

Description here


## Contents

  + [Installation](#installation)
  + [Usage](#usage)
  + [Building](#building)
  + [Linting](#linting)
  + [Testing](#testing)
  + [Api](#api)    

## Installation

```
$ npm i core-js
$ npm i aerobus(not yet)
```

## Usage

```js
require('core-js');
var aerobus = require('aerobus');
```

## Building

```
$ npm install
$ npm run build
```

Produces set of files on the 'lib' folder:

* aerobus.js - ES5 version of library for legacy browser or nodejs
* aerobus.es6.js - ES6 version of library for both modern browser and nodejs environments
* aerobus.test.js - ES5 version of tests legacy browser or nodejs
* aerobus.test.es6.js - ES6 version of tests for both modern browser and nodejs environments

Other options:

```
$ npm run compile               # compile all
$ npm run compile-flow          # ES6 library only
$ npm run compile-flow-compat   # ES5 library compatible only
$ npm run compile-test          # ES6 tests only
$ npm run compile-test-compat   # ES5 tests compatible only
```

## Linting

```
$ npm run lint                  # lint both library and tests
$ npm run lint-flow             # lint library only
$ npm run lint-test             # lint tests only
```

## Testing

```
$ npm run test
```
Additional options:

* open index.html page in any legacy browser

> _Serve this pages from web server, not file system._


## API
