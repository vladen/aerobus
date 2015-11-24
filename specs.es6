// # construction

let delimiter = '.', trace = (...args) => {}, bus = aerobus(delimiter, trace)

typeof bus === 'function' // is true

bus.delimiter === delimiter // is true
bus.delimiter = delimiter // does not throw

bus.trace === trace // is true
bus.trace = trace  // does not throw

// # well-known channels

bus.root // is an object, instance of Channel class

bus.delimiter = delimiter // throws since bus already contains at least one channel
bus.trace = trace  // throws

bus.root.name === '' // is true
bus.root.parent // is undefined

// # enabling/disabling of channels

bus.root.isEnabled // is true
bus.root.disable() === bus.root // is true
bus.root.isEnabled // is false
bus.root.enable(false) === bus.root // is true
bus.root.isEnabled // is false
bus.root.enable(true) === bus.root // is true
bus.root.isEnabled // is true

bus.error // is an object, instance of Channel class
bus.error.parent // is undefined

bus('test') // is an object, instance of Channel class
bus('test').name === 'test' // is true
bus('test').parent === bus.root // is true
bus('parent.child').parent.name === 'parent' // is true

let invocations = 0, subscriber = message => invocations++
bus.root.subscribe(subscriber) === bus.root // is true
Array.isArray(bus.root.subscribers) // is true
bus.root.subscribers.indexOf(subscriber) > -1 // is true

bus.root.publish(data) === bus.root // is true
invocations === 1 // is true

bus.root.unsubscribe(subscriber) === bus.root // is true
bus.root.subscribers.indexOf(subscriber) === -1 // is true

bus('test1', 'test2') // is an object, instance of Section class
Array.isArray(bus('test1', 'test2').channels) // is true
bus('test1', 'test2').channels[0].name === 'test1' // is true
bus('test1', 'test2').channels[1].name === 'test2' // is true

bus('test1', 'test2').disable() // is an object, instance of Section class
bus('test1').isEnabled // is false
bus('test2').isEnabled // is false
bus('test1', 'test2').enable(false) // is an object, instance of Section class
bus('test1').isEnabled // is false
bus('test2').isEnabled // is false
bus('test1', 'test2').enable(true) // is an object, instance of Section class
bus('test1').isEnabled // is true
bus('test2').isEnabled // is true

bus('test1', 'test2').subscribe(subscriber) // is an object, instance of Section class
bus('test1').subscribers.indexOf(subscriber) > -1 // is true
bus('test2').subscribers.indexOf(subscriber) > -1 // is true

bus('test1', 'test2').publish(data) // is an object, instance of Section class
invocations === 3 // is true
bus.unsubscribe(subscriber) === bus // is true
bus('test1').subscribers.indexOf(subscriber) === -1 // is true
bus('test2').subscribers.indexOf(subscriber) === -1 // is true

let invocations1 = 0, invocations2 = 0, subscriber1 = message => invocations1++, subscriber2 = message => invocations1++

bus.root.subscribe(subscriber1, subscriber2) === bus.root // is true
// bus.root.publish(data, 'cycle') // should return root Channel object
// subscriber1 // should be invoked
bus.root.publish(data) === bus.root // is true
invocations1 === 1 // is true
invocations2 === 1 // is true

/*
bus.root.subscribe(subscriber1, subscriber2) // should return root Channel object
bus.root.publish(data, 'random') // should return root Channel object
subscriber1 | subscriber2 // should be invoked
bus.root.publish(data, 'random') // should return root Channel object
subscriber1 | subscriber2 // should be invoked
*/

bus.root.clear() === bus.root // is true
bus.root.subscribers.length === 0 // is true

Array.isArray(bus.channels) // is true

bus.clear() === bus // is true
bus.channels.length === 0 // is true

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

let iterator = bus.root[Symbol.iterator]() // should return object conforming extended iterator iterface (contains done/next functions)
let promise = iterator.next().value // should return a promise in pending state
bus.root.publish(1) // the promise should resolve
bus.root.publish(2)
promise = iterator.next().value // should return a promise in resolved state with value 2
promise = iterator.next().value // should return a promise in pending state
iterator.done() // should unsubscribe all the subscriptions used to support iteration, the promise should reject to undefined
iterator.next().done // should be true
iterator.next().value // should be undefined

iterator = bus('test1', 'test2')[Symbol.iterator]() // should return object conforming extended iterator iterface (contains done/next functions)
promise = iterator.next().value // should return a promise in pending state
bus('test1').publish(1) // the promise should resolve
promise = iterator.next().value // should return a promise in pending state
bus('test2').publish(2) // the promise should resolve
bus('test1').publish(3)
bus('test2').publish(4)
promise = iterator.next().value // should return a promise in resolved state with value 3
promise = iterator.next().value // should return a promise in resolved state with value 4
promise = iterator.next().value // should return a promise in pending state
iterator.done() // should unsubscribe all the subscriptions used to support iteration, the promise should reject to undefined
iterator.next().done // should be true
iterator.next().value // should be undefined

// # errors

let testError = new Error('test'), catcher = error => {}, thrower = () => { throw testError }
bus.root.subscribe(thrower)
bus.root.publish(1) // testError should be thrown

bus.error.subscribe(catcher)
bus.root.publish(2) // catcher should not be invoked with testError, no error should be thrown
bus.error.subscribe(thrower)
bus.error.publish(3) // testError should be thrown
