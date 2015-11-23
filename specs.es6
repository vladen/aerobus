let data = {}, delimiter = '.', trace = (...args) => {}, strategy = 'cycle' | 'random' | 'default' // == '' | undefined

let bus = aerobus(delimiter, trace) // should return bus function

bus // should be a function

bus.delimiter // should be equal delimiter
bus.delimiter = delimiter  // should not throw

bus.trace // should be equal trace
bus.trace = trace  // should not throw

bus.root // should return Channel object
bus.delimiter = delimiter  // should throw because bus already is not empty
bus.root.parent // should return undefined
bus.trace = trace  // should throw because bus already is not empty

bus.root.isEnabled // should return true
bus.root.disable() // should return root Channel object
bus.root.isEnabled // should return false
bus.root.enable(false) // should return root Channel object
bus.root.isEnabled // should return false
bus.root.enable(true) // should return root Channel object
bus.root.isEnabled // should return true

bus.error // should return Channel object
bus.error.parent // should return undefined

bus('test') // should return custom Channel object
bus('test').name // should return value 'test'
bus('test').parent // should return root Channel object
bus('parent.child').parent.name // should return 'parent' value

let invocations = 0, subscriber = message => invocations++
bus.root.subscribe(subscriber) // should return root Channel object
bus.root.subscribers // should return array/iterator containing subscriber

bus.root.publish(data) // should return root Channel object
subscriber // should be invoked

bus.root.unsubscribe(subscriber) // should return root Channel object
bus.root.subscribers // should return array/iterator not containing subscriber

bus('test1', 'test2') // should return Domain object
bus('test1', 'test2').channels // should return array of test1 and test2 Channel objects

bus('test1', 'test2').disable() // should return Domain object
bus('test1').isEnabled // should return false
bus('test2').isEnabled // should return false
bus('test1', 'test2').enable(false) // should return Domain object
bus('test1').isEnabled // should return false
bus('test2').isEnabled // should return false
bus('test1', 'test2').enable(true) // should return Domain object
bus('test1').isEnabled // should return true
bus('test2').isEnabled // should return true

bus('test1', 'test2').subscribe(subscriber) // should return Domain object
bus('test1').subscribers // should return array/iterator containing subscriber
bus('test2').subscribers // should return array/iterator containing subscriber

bus('test1', 'test2').publish(data) // should return Domain object
subscriber // should be invoked twice
bus.unsubscribe(subscriber) // should return bus function
bus('test1').subscribers // should return array/iterator not containing subscriber
bus('test2').subscribers // should return array/iterator not containing subscriber

let invocations1 = 0, invocations2 = 0, subscriber1 = message => invocations1++, subscriber2 = message => invocations1++

bus.root.subscribe(subscriber1, subscriber2) // should return root Channel object
bus.root.publish(data, 'cycle') // should return root Channel object
subscriber1 // should be invoked
bus.root.publish(data) // should return root Channel object
subscriber2 // should be invoked

bus.root.subscribe(subscriber1, subscriber2) // should return root Channel object
bus.root.publish(data, 'random') // should return root Channel object
subscriber1 | subscriber2 // should be invoked
bus.root.publish(data, 'random') // should return root Channel object
subscriber1 | subscriber2 // should be invoked

bus.root.clear() // should return root Channel object
bus.root.subscribers // should return empty array/iterator

bus.channels // should return array/iterator of Channel objects

bus.clear() // should return bus function
bus.channels // should return empty array/iterator

bus.root.retentions //should return empty array
bus.root.retain(1) //should return root Channel object
bus.root.publish(data)
bus.root.subscribe(subscriber)
subscriber // should be invoked with data

// # extension

// option 1:

aerobus.extend('Channel', {
  newMethod: () => {}
}) // should return aerobus function, each object Channel class instantiated afterwards shoud contain newMethod member

aerobus.extend('Message', {
  newField: 'test'
}) // should return aerobus function, each object of Message class instantiated afterwards shoud contain newField member

// option 2:

let bus = aerobus(delimiter, trace, {
  Channel: {
    newMethod1: () => {},
    newMethod2: () => {}
  },
  Message: {
    newMethod1: () => {},
    newMethod2: () => {}
  }
}) // should return bus function using provided delimiter/trace, constructing Channel, Message objects extended with newMethod1, newMethod2

// since delimiter expected to be a string, trace - a function and extensions - an object
// its possible to simplify bus construction syntax and omit any argument guessing intent by provided arguments type analyses:

let bus = aerobus({
  Channel: {
    newMethod1: () => {},
    newMethod2: () => {}
  },
  Message: {
    newMethod1: () => {},
    newMethod2: () => {}
  }
}) // should return bus function using default delimiter/trace, constructing Channel, Message objects extended with newMethod1, newMethod2

let bus = aerobus(delimiter, {
  Channel: {
    newMethod1: () => {},
    newMethod2: () => {}
  },
  Message: {
    newMethod1: () => {},
    newMethod2: () => {}
  }
}) // should return bus function using provided delimiter/default trace with Channel, Message classes extended with newMethod1, newMethod2

let bus = aerobus({
  Channel: {
    newMethod1: () => {},
    newMethod2: () => {}
  },
  Message: {
    newMethod1: () => {},
    newMethod2: () => {}
  }
}, trace, delimiter) // should return bus function using provided delimiter/trace with Channel, Message classes extended with newMethod1, newMethod2

// # iteration

bus.root[Symbol.iterator] // should be a function that returns an object confirming to the iterator protocol (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols)
bus.root[Symbol.iterator]() // should create subscription to this channel and return object providing the following API:
// done = () => void 0; // ends iteration and unsubscribes all supporting subscriptions,
//    rejects all pending iterations with undefined (Promise.reject())
// next = () => { value: Promise<message> } // returns object containing a Promise in one of these states:
//    pending (if no publications has been accumulated) 
//    resolved (if there are accumulated publications)
// since iteration has to be sequential, iterator should accumulate publications ans circulate them to subscequent iterations
// each call to the iterators's next method should resolve to next published message redarless of whether it has been already received or expected to be received in the future

let iterator = bus.root[Symbol.iterator]();
let promise = iterator.next().value // returned promise should be in pending state
bus.root.publish('test1') // the promise should resolve
bus.root.publish('test2')
promise = iterator.next().value // returned promise should be in resolved state
promise = iterator.next().value // returned promise should be in pending state
iterator.done() // should unsubscribe all the subscriptions used to support iteration, promise should reject to undefined
iterator.next().done // should be true
iterator.next().value // should be undefined
