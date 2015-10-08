var assert = require('chai').assert;
var bus = require('../aerobus.js');

var interval = 10, notStrings = [[], false, new Date, null, 1, {}, undefined];

function cleanup() {
	bus.clear();
}

function falsey() {return false}

function noop() {}
function noop1() {}
function noop2() {}

function truthy() {return true}

function watch(done) {
	var invocations = 0, parameters;
	function getInvocations() {
		return invocations;
	}
	function getParameters() {
		return parameters;
	}
	function subscriber() {
		parameters = Array.prototype.slice.call(arguments);
		invocations++;
		if (done instanceof Function) done();
	}
	return Object.defineProperties(subscriber, {
		invocations: {get: getInvocations},
		parameters: {get: getParameters}
	});
}

describe('Bus', function() {
	afterEach(cleanup);
	this.slow(10);
	this.timeout(1000);

	it('is a function', function() {
		assert.isFunction(bus);
	});
	it('is empty initially', function() {
		assert.strictEqual(bus.channels, 0);
	});
	it('throws if the argument is not a string', function() {
		notStrings.forEach(function(name){
			assert.throw(function() {
				bus(name);
			});
		});
	});
	it('throws if more than one argument is passed', function() {
		assert.throw(function() {
			bus(1, 2);
		});
	});
	it('creates a channel', function() {
		bus();
		assert.strictEqual(bus.channels, 1);
	});
	it('creates the channels hierarchy', function() {
		bus('1.2');
		assert.strictEqual(bus.channels, 3);
	});
	it('returns the same channel for the same name', function() {
		assert.strictEqual(bus('test'), bus('test'));
	});

	describe('property', function() {
		describe('channels', function() {
			it('is a number', function() {
				assert.isNumber(bus.channels);
			});
			it('is sealed', function() {
				bus.channels = 1;
				assert.strictEqual(bus.channels, 0);
			});
		});
		describe('error', function() {
			it('is an object', function() {
				assert.isObject(bus.error);
			});
			it('gets the error channel', function() {
				assert.strictEqual(bus.error, bus('error'));
			});
		});
		describe('root', function() {
			it('is an object', function() {
				assert.isObject(bus.root);
			});
			it('gets the root channel', function() {
				assert.strictEqual(bus.root, bus());
				assert.strictEqual(bus.root, bus(''));
			});
		});
	});

	describe('method', function() {
		describe('clear', function() {
			it('is a function', function() {
				assert.isFunction(bus.clear);
			});
			it('is fluent', function() {
				assert.strictEqual(bus.clear(), bus);
			});
			it('removes all channels', function() {
				bus('1.2.3');
				bus.clear();
				assert.strictEqual(bus.channels, 0);
			});
		});
		describe('create', function() {
			it('is a function', function() {
				assert.isFunction(bus.create);
			});
			it('creates new bus', function() {
				assert.notStrictEqual(bus, bus.create());
			});
		});
		describe('unsubscribe', function() {
			it('is a function', function() {
				assert.isFunction(bus.unsubscribe);
			});
			it('is fluent', function() {
				assert.strictEqual(bus.unsubscribe(), bus);
			});
			it('removes all subscribers from all channels', function() {
				var channel1 = bus('1'), channel2 = bus('2');
				channel1.subscribe(noop);
				channel2.subscribe(noop);
				bus.unsubscribe();
				assert.strictEqual(channel1.subscriptions, 0);
				assert.strictEqual(channel2.subscriptions, 0);
			});
			it('removes one subscriber from all channels', function() {
				var channel1 = bus('1'), channel2 = bus('2');
				channel1.subscribe(noop, noop1);
				channel2.subscribe(noop, noop1);
				bus.unsubscribe(noop);
				assert.strictEqual(channel1.subscriptions, 1);
				assert.strictEqual(channel2.subscriptions, 1);
			});
			it('removes two subscribers from all channels', function() {
				var channel1 = bus('1'), channel2 = bus('2');
				channel1.subscribe(noop, noop1, noop2);
				channel2.subscribe(noop, noop1, noop2);
				bus.unsubscribe(noop, noop1);
				assert.strictEqual(channel1.subscriptions, 1);
				assert.strictEqual(channel2.subscriptions, 1);
			});
		});
	});
});

describe('Channel', function() {
	afterEach(cleanup);
	this.slow(10);
	this.timeout(1000);
	afterEach(function() {
		bus.clear();
	});

	if('is empty initially', function() {
		assert.strictEqual(bus.root.publications, 0);
		assert.strictEqual(bus.root.subscriptions, 0);
	});

	describe('property', function() {
		describe('active', function() {
			it('is a boolean', function() {
				assert.isBoolean(bus.root.active);
			});
			it('is set initially', function() {
				assert.isTrue(bus.root.active);
			});
			it('is inherited from the parent channel', function() {
				var channel = bus('test');
				channel.parent.active = false;
				assert.isFalse(channel.active);
				channel.parent.active = true;
				assert.isTrue(channel.active);
			});
			it('is not sealed', function() {
				bus.root.active = false;
				assert.isFalse(bus.root.active);
			});
		});
		describe('bus', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.bus);
			});
			it('gets parent bus', function() {
				assert.strictEqual(bus.error.bus, bus);
				assert.strictEqual(bus.root.bus, bus);
				assert.strictEqual(bus('test').bus, bus);
				var newBus = bus.create();
				assert.strictEqual(newBus.error.bus, newBus);
				assert.strictEqual(newBus.root.bus, newBus);
				assert.strictEqual(newBus('test').bus, newBus);
			});
			it('is sealed', function() {
				var value = bus.root.bus;
				bus.root.bus = null;
				assert.strictEqual(bus.root.bus, value);
			});
		});
		describe('name', function() {
			it('is a string', function() {
				assert.isString(bus.root.name);
			});
			it('is empty for root channel', function() {
				assert.strictEqual(bus.root.name, '');
			});
			it('is "error" for error channel', function() {
				assert.strictEqual(bus.root.name, '');
			});
			it('is custom for custom channel', function() {
				assert.strictEqual(bus('test').name, 'test');
			});
			it('is sealed', function() {
				var name = bus.root.name;
				bus.root.name = 'test';
				assert.strictEqual(bus.root.name, name);
			});
		});
		describe('parent', function() {
			it('is null for the root channel', function() {
				assert.isNull(bus.root.parent);
			});
			it('is null for the error channel', function() {
				assert.isNull(bus.error.parent);
			});
			it('is an object for non root channel', function() {
				assert.isObject(bus('test').parent);
			});
			it('is parent channel for custom channel', function() {
				assert.strictEqual(bus('1.2').parent, bus('1'));
			});
			it('is sealed', function() {
				var value = bus.error.parent;
				bus.error.parent = bus.root;
				assert.strictEqual(bus.error.parent, value);
			});
		});
	});

	describe('method', function() {
		describe('activate', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.activate);
			});
			it('is fluent', function() {
				assert.strictEqual(bus.root.activate(), bus.root);
			});
			it('enables the channel', function() {
				var subscription = watch();
				bus.root.subscribe(subscription);
				bus.root.active = false;
				bus.root.publish().trigger();
				bus.root.activate();
				bus.root.publish().trigger();
				assert.strictEqual(subscription.invocations, 1);
			});
			it('sets active property', function() {
				bus.root.active = false;
				bus.root.activate();
				assert.isTrue(bus.root.active);
			});
		});
		describe('deactivate', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.deactivate);
			});
			it('is fluent', function() {
				assert.strictEqual(bus.root.deactivate(), bus.root);
			});
			it('disables the channel', function() {
				var subscription = watch();
				bus.root.subscribe(subscription);
				bus.root.deactivate();
				bus.root.publish().trigger();
				assert.strictEqual(subscription.invocations, 0);
			});
			it('resets active property', function() {
				bus.root.deactivate();
				assert.isFalse(bus.root.active);
			});
		});
		describe('publish', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish);
			});
			it('creates non-persistent publication', function() {
				var publication = bus.root.publish();
				assert.isObject(publication);
				assert.strictEqual(bus.root.publications, 0);
			});
		});
		describe('subscribe', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.subscribe);
			});
			it('throws without arguments', function() {
				assert.throw(function() {
					bus.root.subscribe();
				});
			});
			it('creates persistent subscription', function() {
				var subscription = bus.root.subscribe(noop);
				assert.isObject(subscription);
				assert.strictEqual(bus.root.subscriptions, 1);
			});
			it('keeps all subscribers passed in the list of subscribers', function() {
				var subscription = bus.root.subscribe(noop, noop1, noop2);
				assert.strictEqual(subscription.subscribers, 3);
			});
		});
		describe('unsubscribe', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.unsubscribe);
			});
			it('removes all subscribers', function() {
				bus.root.subscribe(noop, noop1);
				bus.root.unsubscribe();
				assert.strictEqual(bus.root.subscriptions, 0);
			});
			it('removes one subscriber', function() {
				bus.root.subscribe(noop, noop1);
				bus.root.unsubscribe(noop1);
				assert.strictEqual(bus.root.subscriptions, 1);
			});
			it('removes two subscribers', function() {
				bus.root.subscribe(noop, noop1, noop2);
				bus.root.unsubscribe(noop1, noop2);
				assert.strictEqual(bus.root.subscriptions, 1);
			});
		});
	});
});

describe('Publication', function() {
	afterEach(cleanup);
	this.slow(50);
	this.timeout(2000);

	it('is deferred initially', function(done) {
		var subscription = watch();
		bus.root.subscribe(subscription);
		bus.root.publish();
		assert.strictEqual(subscription.invocations, 0);
		setTimeout(function() {
			assert.strictEqual(subscription.invocations, 1);
			done();
		}, interval);
	});

	it('is not persisted initially', function() {
		bus.root.publish();
		assert.strictEqual(bus.root.publications, 0);
	});
	it('replaces function parameter with its result', function() {
		var subscriber = watch();
		bus.root.subscribe(subscriber);
		bus.root.publish(function() {return true}).trigger();
		assert.isTrue(subscriber.parameters[0]);
	});

	describe('property', function() {
		describe('active', function() {
			it('is a boolean', function() {
				assert.isBoolean(bus.root.publish().active);
			});
			it('is set initially', function() {
				assert.isTrue(bus.root.publish().active);
			});
			it('is not sealed', function() {
				var publication = bus.root.publish();
				publication.active = false;
				assert.isFalse(publication.active);
			});
		});
		describe('bus', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().bus);
			});
			it('gets the parent bus', function() {
				assert.strictEqual(bus.root.publish().bus, bus);
				var newBus = bus.create();
				assert.strictEqual(newBus.root.publish().bus, newBus);
			});
			it('is sealed', function() {
				var publication = bus.root.publish(), value = publication.bus;
				publication.bus = null;
				assert.strictEqual(publication.bus, value);
			});
		});
		describe('channel', function() {
			it('is an object', function() {
				assert.isObject(bus.root.publish().channel);
			});
			it('gets the parent channel', function() {
				assert.strictEqual(bus.root.publish().channel, bus.root);
			});
			it('is sealed', function() {
				var publication = bus.root.publish(), value = publication.channel;
				publication.channel = null;
				assert.strictEqual(publication.channel, value);
			});
		});
		describe('trigger', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().trigger);
			});
			it('applies passed parameters to the subscription', function() {
				var parameters = [1, 2, 3], subscriber = watch(),
					trigger = bus.root.publish().trigger;
				bus.root.subscribe(subscriber);
				trigger.apply(null, parameters);
				assert.includeMembers(subscriber.parameters, parameters);
			});
			it('publishes immediately', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().trigger();
				assert.strictEqual(subscriber.invocations, 1);
			});
			it('appends passed parameters to the existing ones', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish(1).trigger(2, 3);
				assert.include(subscriber.parameters, 1, 2, 3);
			});
			it('is sealed', function() {
				var publication = bus.root.publish(), trigger = publication.trigger;
				publication.trigger = noop;
				assert.strictEqual(publication.trigger, trigger);
			});
		});
		describe('parameters', function() {
			it('is an array', function() {
				assert.isArray(bus.root.publish().parameters);
			});
			it('gets the published parameters', function() {
				var parameters = [[], new Date, false, 1, null, {}, true, undefined],
					publication = bus.root.publish.apply(bus.root, parameters);
				assert.includeMembers(publication.parameters, parameters);
			});
			it('publishes new parameter', function() {
				var publication = bus.root.publish(1), subscriber = watch();
				bus.root.subscribe(subscriber);
				publication.parameters.push(2);
				publication.trigger();
				assert.includeMembers(subscriber.parameters, [1, 2]);
			});
			it('is sealed', function() {
				var publication = bus.root.publish(), value = publication.parameters;
				publication.parameters = null;
				assert.strictEqual(publication.parameters, value);
			});
		});
	});

	describe('method', function() {
		describe('activate', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().activate);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.activate(), publication);
			});
			it('enables the publication', function() {
				var publication = bus.root.publish(), subscription = watch();
				bus.root.subscribe(subscription);
				publication.active = false;
				publication.trigger();
				publication.activate();
				publication.trigger();
				assert.strictEqual(subscription.invocations, 1);
			});
			it('sets active property', function() {
				var publication = bus.root.publish();
				publication.active = false;
				publication.activate();
				assert.isTrue(publication.active);
			});
		});
		describe('after', function() {
			this.slow(200);
			it('is a function', function() {
				assert.isFunction(bus.root.publish().after);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.after(0), publication);
			});
			it('triggers immediately if the date is current or in the past', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().after(new Date()).trigger();
				bus.root.publish().after(new Date(0)).trigger();
				assert.strictEqual(subscriber.invocations, 2);
			});
			it('does not trigger if the date is in the future', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().after(new Date(Date.now() + interval)).trigger();
				assert.strictEqual(subscriber.invocations, 0);
			});
			it('triggers after the future date occurs', function(done) {
				var subscriber = watch(),
					trigger = bus.root.publish().after(new Date(Date.now() + interval)).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 0);
					trigger();
					assert.strictEqual(subscriber.invocations, 1);
					done();
				}, interval);
			});
			it('replays after the future date occurs', function(done) {
				var parameter = 'test', subscriber = watch(),
					trigger = bus.root.publish().after(new Date(Date.now() + interval), true).trigger;
				bus.root.subscribe(subscriber);
				trigger(parameter);
				assert.strictEqual(subscriber.invocations, 0);
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 1);
					assert.include(subscriber.parameters, parameter);
					done();
				}, interval);
			});
			it('triggers if the interval is zero or negative', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().after(0).trigger();
				bus.root.publish().after(-1).trigger();
				assert.strictEqual(subscriber.invocations, 2);
			});
			it('does not trigger if the interval is positive', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().after(new Date(Date.now() + interval)).trigger();
				assert.strictEqual(subscriber.invocations, 0);
			});
			it('triggers after the positive interval elapses', function(done) {
				var subscriber = watch(),
					trigger = bus.root.publish().after(interval).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				setTimeout(function() {
					trigger();
					assert.strictEqual(subscriber.invocations, 1);
					done();
				}, interval);
			});
			it('replays after the positive interval elapses', function(done) {
				var parameter = 'test', subscriber = watch(),
					trigger = bus.root.publish().after(interval, true).trigger;
				bus.root.subscribe(subscriber);
				trigger(parameter);
				assert.strictEqual(subscriber.invocations, 0);
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 1);
					assert.include(subscriber.parameters, parameter);
					done();
				}, interval);
			});
		});
		describe('deactivate', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().deactivate);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.deactivate(), publication);
			});
			it('disables the publication', function() {
				var publication = bus.root.publish(), subscription = watch();
				bus.root.subscribe(subscription);
				publication.deactivate().trigger();
				assert.strictEqual(subscription.invocations, 0);
			});
			it('resets active property', function() {
				var publication = bus.root.publish();
				publication.deactivate();
				assert.isFalse(publication.active);
			});
		});
		describe('debounce', function() {
			this.slow(250);
			it('is a function', function() {
				assert.isFunction(bus.root.publish().debounce);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.debounce(1), publication);
			});
			it('triggers once sooner until the idle interval elapsed', function(done) {
				var subscriber = watch(), trigger = bus.root.publish().debounce(interval).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				trigger();
				assert.strictEqual(subscriber.invocations, 1);
				setTimeout(function() {
					trigger();
				}, interval / 2);
				setTimeout(function() {
					trigger();
				}, interval);
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 1);
					done();
				}, interval * 2);
			});
			it('triggers once later until the idle interval elapsed', function(done) {
				var subscriber = watch(), trigger = bus.root.publish().debounce(interval, true).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				trigger();
				assert.strictEqual(subscriber.invocations, 0);
				setTimeout(function() {
					trigger();
					trigger();
				}, interval);
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 1);
					done();
				}, interval * 2);
			});
		});
		describe('delay', function() {
			this.slow(200);
			it('is a function', function() {
				assert.isFunction(bus.root.publish().delay);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.delay(1), publication);
			});
			it('triggers after the interval elapses', function(done) {
				var subscriber = watch(), trigger = bus.root.publish().delay(interval).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				trigger();
				assert.strictEqual(subscriber.invocations, 0);
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 2);
					done();
				}, interval);
			});
		});
		describe('discard', function() {
			this.slow(250);
			it('is a function', function() {
				assert.isFunction(bus.root.publish().discard);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.discard(), publication);
			});
			it('discards deferred publishing', function(done) {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().discard();
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 0);
					done();
				}, 0);
			});
			it('discards instant publishing', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().discard().trigger();
				assert.strictEqual(subscriber.invocations, 0);
			});
			it('discards future publishing', function(done) {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().after(interval).discard();
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 0);
					done();
				}, 2 * interval);
			});
			it('discards repeating publishing', function(done) {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().repeat(interval).discard();
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 0);
					done();
				}, 2 * interval);
			});
		});
		describe('filter', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().filter);
			});
			it('does not trigger if the predicate returns false', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().filter(falsey).trigger();
				assert.strictEqual(subscriber.invocations, 0);
			});
			it('triggers if the predicate returns true', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().filter(truthy).trigger();
				assert.strictEqual(subscriber.invocations, 1);
			});
		});
		describe('repeat', function() {
			this.slow(500);
			it('is a function', function() {
				assert.isFunction(bus.root.publish().repeat);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.repeat(1), publication);
			});
			it('repeats the publication', function(done) {
				var subscriber = watch(function() {
					if (subscriber.invocations === 2) done();
				});
				bus.root.subscribe(subscriber);
				bus.root.publish().repeat(interval);
			});
		});
		describe('skip', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().skip);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.skip(0), publication);
			});
			it('throws if the argument is negative', function() {
				assert.throw(function() {
					bus.root.publish().skip(-1);
				});
			});
			it('skips the first publication', function() {
				var subscriber = watch(), trigger = bus.root.publish().skip(1).trigger;
				bus.root.subscribe(subscriber);
				trigger(1);
				trigger(2);
				assert.strictEqual(subscriber.invocations, 1);
				assert.include(subscriber.parameters, 2);
			});
		});
		describe('take', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().take);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.take(0), publication);
			});
			it('throws if the argument is negative', function() {
				assert.throw(function() {
					bus.root.publish().skip(-1);
				});
			});
			it('takes the first publication only', function() {
				var subscriber = watch(), trigger = bus.root.publish().take(1).trigger;
				bus.root.subscribe(subscriber);
				trigger(1);
				trigger(2);
				assert.strictEqual(subscriber.invocations, 1);
				assert.include(subscriber.parameters, 1);
			});
		});
		describe('throttle', function() {
			this.slow(350);
			it('is a function', function() {
				assert.isFunction(bus.root.publish().throttle);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.throttle(1), publication);
			});
			it('triggers once within the interval', function(done) {
				var subscriber = watch(), trigger = bus.root.publish().throttle(interval).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				trigger();
				assert.strictEqual(subscriber.invocations, 0);
				setTimeout(function() {
					trigger();
				}, interval / 2);
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 1);
					trigger();
				}, interval);
				setTimeout(function() {
					assert.strictEqual(subscriber.invocations, 2);
					done();
				}, interval * 3);
			});
		});
		describe('unless', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.publish().unless);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.unless(truthy), publication);
			});
			it('does not trigger if the predicate returns true', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().unless(truthy).trigger();
				assert.strictEqual(subscriber.invocations, 0);
			});
			it('triggers if the predicate returns false', function() {
				var subscriber = watch();
				bus.root.subscribe(subscriber);
				bus.root.publish().unless(falsey).trigger();
				assert.strictEqual(subscriber.invocations, 1);
			});
		});
		describe('until', function() {
			this.slow(200);
			it('is a function', function() {
				assert.isFunction(bus.root.publish().until);
			});
			it('is fluent', function() {
				var publication = bus.root.publish();
				assert.strictEqual(publication.until(0), publication);
			});
			it('triggers before but does not publish after the date', function(done) {
				var subscriber = watch(),
					trigger = bus.root.publish().until(new Date(Date.now() + interval)).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				assert.strictEqual(subscriber.invocations, 1);
				setTimeout(function() {
					trigger();
					assert.strictEqual(subscriber.invocations, 1);
					done();
				}, interval);
			});
			it('triggers before but does not publish after the interval', function(done) {
				var subscriber = watch(), trigger = bus.root.publish().until(interval).trigger;
				bus.root.subscribe(subscriber);
				trigger();
				assert.strictEqual(subscriber.invocations, 1);
				setTimeout(function() {
					trigger();
					assert.strictEqual(subscriber.invocations, 1);
					done();
				}, interval);
			});
			it('triggers before but does not publish after publication to the channel', function() {
				var channel1 = bus('1'), channel2 = bus('2'), subscriber = watch(),
					trigger = channel1.publish().until('2').trigger;
				channel1.subscribe(subscriber);
				trigger();
				assert.strictEqual(subscriber.invocations, 1);
				channel2.publish().trigger();
				trigger();
				assert.strictEqual(subscriber.invocations, 1);
			});
		});
	});
});

describe('subscription', function() {
	afterEach(cleanup);
	this.slow(50);
	this.timeout(2000);

	it('is persisted initially', function() {
		bus.root.subscribe(noop);
		assert.strictEqual(bus.root.subscriptions, 1);
	});
	it('forwards error thrown by the subscriber to the error channel', function() {
		var error = new Error, subscriber = watch();
		bus.error.subscribe(subscriber);
		bus.root.subscribe(function() {throw error});
		bus.root.publish().trigger();
		assert.strictEqual(subscriber.invocations, 1);
		assert.include(subscriber.parameters, error);
	});

	describe('property', function() {
		describe('active', function() {
			it('is a boolean', function() {
				assert.isBoolean(bus.root.subscribe(noop).active);
			});
			it('is set initially', function() {
				assert.isTrue(bus.root.subscribe(noop).active);
			});
			it('is not sealed', function() {
				var subscription = bus.root.subscribe(noop);
				subscription.active = false;
				assert.isFalse(subscription.active);
			});
		});
		describe('bus', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.subscribe(noop).bus);
			});
			it('gets the parent bus', function() {
				assert.strictEqual(bus.root.subscribe(noop).bus, bus);
				var newBus = bus.create();
				assert.strictEqual(newBus.root.subscribe(noop).bus, newBus);
			});
			it('is sealed', function() {
				var subscription = bus.root.subscribe(noop), value = subscription.bus;
				subscription.bus = null;
				assert.strictEqual(subscription.bus, value);
			});
		});
		describe('channel', function() {
			it('is an object', function() {
				assert.isObject(bus.root.subscribe(noop).channel);
			});
			it('gets the parent channel', function() {
				assert.strictEqual(bus.root.subscribe(noop).channel, bus.root);
			});
			it('is sealed', function() {
				var subscription = bus.root.subscribe(noop), value = subscription.channel;
				subscription.channel = null;
				assert.strictEqual(subscription.channel, value);
			});
		});
	});
	describe('method', function() {
		describe('unsubscribe', function() {
			it('is a function', function() {
				assert.isFunction(bus.root.subscribe(noop).unsubscribe);
			});
			it('is fluent', function() {
				var subscription = bus.root.subscribe(noop);
				assert.strictEqual(subscription.unsubscribe(), subscription);
			});
			it('removes all subscribers', function() {
				var subscription = bus.root.subscribe(noop, noop1);
				subscription.unsubscribe();
				assert.strictEqual(subscription.subscribers, 0);
			});
			it('removes one subscriber', function() {
				var subscription = bus.root.subscribe(noop, noop1);
				subscription.unsubscribe(noop1);
				assert.strictEqual(subscription.subscribers, 1);
			});
			it('removes two subscribers', function() {
				var subscription = bus.root.subscribe(noop, noop1, noop2);
				subscription.unsubscribe(noop1, noop2);
				assert.strictEqual(subscription.subscribers, 1);
			});
		});
	});
});