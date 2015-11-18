require('babel-core/register');
let utilities = require('../src/utilities');

let assert = require('chai').assert;
let aerobus = require('../src/Bus').default;


let data = {}, delimiter = '.', trace = (...args) => {}, strategy = 'cycle' | 'random' | 'default' // == '' | undefined


describe('airybus', function() {
	this.slow(10);
	this.timeout(1000);
	
	let bus = function(){};
	it('should be a function', function() {
		bus = aerobus(delimiter, trace);		
		assert.isFunction(bus);
	});


	it('should be equal delimiter', function() {
		assert.strictEqual(bus.delimiter, delimiter);
	});
	it('change delimeter should not throw', function() {
		assert.ok(bus.delimiter = delimiter);
	});

	it('should be equal trace', function() {
		assert.strictEqual(bus.trace, trace);
	});
	it('change trace should not throw', function() {
		assert.ok(bus.trace = trace);
	});


	it('root should return Channel object', function() {
		assert.ok(utilities.isChannel(bus.root));
	});
	it('change delimeter should throw because bus already is not empty', function() {
		assert.throw(function() {
			bus.delimiter = delimiter;
		});
	});
	it('change trace should throw because bus already is not empty', function() {
		assert.throw(function() {
			bus.trace = trace;
		});
	});
	it('root parent should return undefined', function() {
		assert.ok(utilities.isUndefined(bus.root.parent));
	});


	it('root isEnabled should return true', function() {
		assert.ok(bus.root.isEnabled);
	});
	it('root disable should return root Channel object', function() {
		assert.strictEqual(bus.root.disable(), bus.root);
	});
	it('root isEnabled should return false', function() {
		assert.notOk(bus.root.isEnabled);
	});
	it('root enable(false) should return root Channel object', function() {
		assert.strictEqual(bus.root.enable(false), bus.root);
	});
	it('root isEnabled should return false', function() {
		assert.notOk(bus.root.isEnabled);
	});
	it('root enable(true) should return root Channel object', function() {
		assert.strictEqual(bus.root.enable(true), bus.root);
	});
	it('root isEnabled should return true', function() {
		assert.ok(bus.root.isEnabled);
	});


	it('error should return Channel object', function() {
		assert.ok(utilities.isChannel(bus.error));
	});
	it('error parent should return undefined', function() {
		assert.ok(utilities.isUndefined(bus.error.parent));
	});


	it('bus(test) should return custom Channel object', function() {
		assert.ok(utilities.isChannel(bus('test')));
	});
	it('test name should be test', function() {
		assert.strictEqual(bus('test').name, 'test');
	});
	it('test parent should return root Channel object', function() {
		assert.strictEqual(bus('test').parent, bus.root);
	});
	it('bus(\'parent.child\').parent.name should return \'parent\' value', function() {
		assert.strictEqual(bus('parent.child').parent.name, 'parent');
	});


	let invocations = 0, subscriber = message => invocations++;
	it('bus.root.subscribe(subscriber) should return root Channel object', function() {
		assert.strictEqual(bus.root.subscribe(subscriber), bus.root);
	}); 
	it('bus.root.subscribers should return array containing subscriber', function() {
		assert.notOk(bus.root.subscribers.indexOf(subscriber) === -1);
	});

	it('bus.root.publish(data) should return root Channel object', function() {
		assert.strictEqual(bus.root.publish(data), bus.root);
	});  
	it('subscriber should be invoked', function() {
		assert.strictEqual(invocations, 1);
	});  

	it('bus.root.unsubscribe(subscriber) should return root Channel object', function() {
		assert.strictEqual(bus.root.unsubscribe(subscriber), bus.root);
	});  
	it('bus.root.subscribers should return array/iterator not containing subscriber', function() {
		assert.ok(bus.root.subscribers.indexOf(subscriber) === -1);
	});  


	let domain;
	it('bus(\'test1\', \'test2\') should return Domain object', function() {
		domain = bus('test1', 'test2');
		assert.ok(utilities.isDomain(domain));
	});
	it('domain channels should return array of Channel objects', function() {
		let channels = domain.channels;
		assert.strictEqual(channels[0], bus('test1'));
		assert.strictEqual(channels[1], bus('test2'));
	});

	it('Domain disable should return Domain object', function() {
		assert.strictEqual(domain.disable(), domain);
	});
	it('Domain channels isEnabled should return false', function() {
		assert.notOk(bus('test1').isEnabled);
		assert.notOk(bus('test2').isEnabled);
	});
	it('Domain enable(false) should return Domain object', function() {
		assert.strictEqual(domain.enable(false), domain);
	});
	it('Domain channels isEnabled should return false', function() {
		assert.notOk(bus('test1').isEnabled);
		assert.notOk(bus('test2').isEnabled);
	});
	it('Domain enable(true) should return Domain object', function() {
		assert.strictEqual(domain.enable(true), domain);
	});
	it('Domain channels isEnabled should return true', function() {
		assert.ok(bus('test1').isEnabled);
		assert.ok(bus('test2').isEnabled);
	});

	it('domain subscribe should return Domain object', function() {
		assert.strictEqual(domain.subscribe(subscriber), domain);
	});
	it('Domain channels should return array/iterator containing subscriber', function() {
		assert.notOk(bus('test1').subscribers.indexOf(subscriber) === -1);
		assert.notOk(bus('test2').subscribers.indexOf(subscriber) === -1);
	});

	it('domain publish should return Domain object', function() {
		invocations = 0;
		assert.strictEqual(domain.publish(data), domain);
	});
	it('subscriber should be invoked twice', function() {
		assert.strictEqual(invocations, 2);
	});
	it('Domain channels should return array/iterator containing subscriber_2', function() {
		assert.notOk(bus('test1').subscribers.indexOf(subscriber) === -1);
		assert.notOk(bus('test2').subscribers.indexOf(subscriber) === -1);
	});
	it('bus.unsubscribe should return bus function', function() {
		assert.strictEqual(bus.unsubscribe(subscriber), bus);
	});
	it('channels should return array not containing subscriber', function() {
		assert.ok(bus('test1').subscribers.indexOf(subscriber) === -1);
		assert.ok(bus('test2').subscribers.indexOf(subscriber) === -1);
	});	

	it('test', function() {
		bus.clear();
		assert.strictEqual(domain.publish(data), domain);
	});


	let invocations1 = 0, invocations2 = 0, subscriber1 = message => invocations1++, subscriber2 = message => invocations1++
});
