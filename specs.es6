let data = {}, delimiter = '.', trace = (...args) => {}, strategy = 'cycle' | 'random' | 'default' // == '' | undefined

let bus = aerobus(delimiter, trace) // should return bus function

bus /// should be a function

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
bus.root.retentions //should return undefined

bus.channels // should return array/iterator of Channel objects

bus.clear() // should return bus function
bus.channels // should return empty array/iterator