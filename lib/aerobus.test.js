'use strict';

(function (global, factory) {
	if (typeof define === "function" && define.amd) {
		define(['chai', './aerobus'], factory);
	} else if (typeof exports !== "undefined") {
		factory(require('chai'), require('./aerobus'));
	} else {
		var mod = {
			exports: {}
		};
		factory(global.chai, global.aerobus);
		global.aerobusTest = mod.exports;
	}
})(this, function (_chai, _aerobus) {
	var _aerobus2 = _interopRequireDefault(_aerobus);

	function _interopRequireDefault(obj) {
		return obj && obj.__esModule ? obj : {
			default: obj
		};
	}

	var data = {},
	    delimiter = '.',
	    trace = function trace() {},
	    strategy = 'cycle' | 'random' | 'default';

	describe('aerobus', function () {
		it('should be a function', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.isFunction(bus);
		});
		it('should be equal delimiter', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.delimiter, delimiter);
		});
		it('change delimeter should not throw', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.ok(bus.delimiter = delimiter);
		});
		it('should be equal trace', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.trace, trace);
		});
		it('change trace should not throw', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.ok(bus.trace = trace);
		});
		it('root should return Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(Object.classof(bus.root), 'Channel');
		});
		it('change delimeter should throw because bus already is not empty', function () {
			_chai.assert.throw(function () {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				bus.root;
				bus.delimiter = delimiter;
			});
		});
		it('change trace should throw because bus already is not empty', function () {
			_chai.assert.throw(function () {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				bus.root;
				bus.trace = trace;
			});
		});
		it('root parent should return undefined', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.isUndefined(bus.root.parent);
		});
		it('root isEnabled should return true default', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.ok(bus.root.isEnabled);
		});
		it('root disable should return root Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.root.disable(), bus.root);
		});
		it('root isEnabled should return false after disable', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.disable();

			_chai.assert.notOk(bus.root.isEnabled);
		});
		it('root enable(false) should return root Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.root.enable(false), bus.root);
		});
		it('root isEnabled should return false after enable(false)', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.enable(false);

			_chai.assert.notOk(bus.root.isEnabled);
		});
		it('root enable(true) should return root Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.root.enable(true), bus.root);
		});
		it('root isEnabled should return true after enable(true)', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.enable(true);

			_chai.assert.ok(bus.root.isEnabled);
		});
		it('error should return Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(Object.classof(bus.error), 'Channel');
		});
		it('error parent should return undefined', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.isUndefined(bus.error.parent);
		});
		it('bus(test) should return custom Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(Object.classof(bus('test')), 'Channel');
		});
		it('test name should be test', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus('test').name, 'test');
		});
		it('test parent should return root Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus('test').parent, bus.root);
		});
		it('bus(\'parent.child\').parent.name should return \'parent\' value', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus('parent.child').parent.name, 'parent');
		});

		var invocations = 0,
		    subscriber = function subscriber(message) {
			invocations++;
		};

		it('bus.root.subscribe(subscriber) should return root Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.root.subscribe(subscriber), bus.root);
		});
		it('bus.root.subscribers should return array containing subscriber', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.subscribe(subscriber);

			_chai.assert.notOk(bus.root.subscribers.indexOf(subscriber) === -1);
		});
		it('bus.root.publish(data) should return root Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.subscribe(subscriber);

			_chai.assert.strictEqual(bus.root.publish(data), bus.root);
		});
		it('subscriber should be invoked', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			invocations = 0;
			bus.root.subscribe(subscriber);
			bus.root.publish(data);

			_chai.assert.strictEqual(invocations, 1);
		});
		it('bus.root.unsubscribe(subscriber) should return root Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.subscribe(subscriber);

			_chai.assert.strictEqual(bus.root.unsubscribe(subscriber), bus.root);
		});
		it('bus.root.subscribers should return array/iterator not containing subscriber', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.subscribe(subscriber);
			bus.root.unsubscribe(subscriber);

			_chai.assert.ok(bus.root.subscribers.indexOf(subscriber) === -1);
		});
		it('bus(\'test1\', \'test2\') should return Section object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');

			_chai.assert.strictEqual(Object.classof(section), 'Section');
		});
		it('section channels should return array of Channel objects', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2'),
			    channels = section.channels;

			_chai.assert.strictEqual(channels[0], bus('test1'));

			_chai.assert.strictEqual(channels[1], bus('test2'));
		});
		it('section disable should return section object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');

			_chai.assert.strictEqual(section.disable(), section);
		});
		it('section channels isEnabled should return false after disable', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			section.disable();

			_chai.assert.notOk(bus('test1').isEnabled);

			_chai.assert.notOk(bus('test2').isEnabled);
		});
		it('section enable(false) should return section object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');

			_chai.assert.strictEqual(section.enable(false), section);
		});
		it('section channels isEnabled should return false after enable(false)', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			section.enable(false);

			_chai.assert.notOk(bus('test1').isEnabled);

			_chai.assert.notOk(bus('test2').isEnabled);
		});
		it('section enable(true) should return section object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');

			_chai.assert.strictEqual(section.enable(true), section);
		});
		it('section channels isEnabled should return true after enable(true)', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			section.enable(true);

			_chai.assert.ok(bus('test1').isEnabled);

			_chai.assert.ok(bus('test2').isEnabled);
		});
		it('section subscribe should return section object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');

			_chai.assert.strictEqual(section.subscribe(subscriber), section);
		});
		it('section channels should return array/iterator containing subscriber', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			section.subscribe(subscriber);

			_chai.assert.notOk(bus('test1').subscribers.indexOf(subscriber) === -1);

			_chai.assert.notOk(bus('test2').subscribers.indexOf(subscriber) === -1);
		});
		it('section publish should return section object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			invocations = 0;
			section.subscribe(subscriber);

			_chai.assert.strictEqual(section.publish(data), section);
		});
		it('subscriber should be invoked twice', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			invocations = 0;
			section.subscribe(subscriber);
			section.publish(data);

			_chai.assert.strictEqual(invocations, 2);
		});
		it('bus.unsubscribe should return bus function', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			section.subscribe(subscriber);

			_chai.assert.strictEqual(bus.unsubscribe(subscriber), bus);
		});
		it('channels should return array not containing subscriber', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace),
			    section = bus('test1', 'test2');
			section.subscribe(subscriber);
			bus.unsubscribe(subscriber);

			_chai.assert.ok(bus('test1').subscribers.indexOf(subscriber) === -1);

			_chai.assert.ok(bus('test2').subscribers.indexOf(subscriber) === -1);
		});

		var invocations1 = 0,
		    invocations2 = 0,
		    subscriber1 = function subscriber1(message) {
			return invocations1++;
		},
		    subscriber2 = function subscriber2(message) {
			return invocations2++;
		};

		it('subscribe for same subscribers should return Channel object', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.root.subscribe(subscriber1, subscriber2), bus.root);
		});
		it('bus channels should return array of channels', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus('test1', 'test2', 'test3');
			bus('test4');

			_chai.assert.includeMembers(bus.channels, [bus('root'), bus('test1'), bus('test2'), bus('test3'), bus('test4')]);
		});
		it('channel clear shoud clear subscribers', function () {
			var bus = (0, _aerobus2.default)(delimiter, trace);
			bus.root.subscribe(subscriber1, subscriber2);

			_chai.assert.strictEqual(bus.clear(), bus);

			_chai.assert.includeMembers(bus.channels, []);
		});
		it('retentions should work', function () {
			invocations = 0;
			var bus = (0, _aerobus2.default)(delimiter, trace);

			_chai.assert.strictEqual(bus.root.retain(1), bus.root);

			_chai.assert.strictEqual(bus.root.retaining, 1);

			bus.root.publish(data);
			bus.root.subscribe(subscriber);

			_chai.assert.strictEqual(invocations, 1);
		});
		describe('extend', function () {
			it('extend should work with Channel', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace, {
					Channel: {
						newMethod: function newMethod() {
							return 'test';
						}
					}
				});

				_chai.assert.strictEqual(bus.root.newMethod(), 'test');
			});
			it('extend should work with Section', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace, {
					Section: {
						newField: 'test'
					}
				});
				var section = bus('test1', 'test2');

				_chai.assert.strictEqual(section.newField, 'test');
			});
			it('extend should work independently', function () {
				var bus1 = (0, _aerobus2.default)(delimiter, trace, {
					Channel: {
						newField: 'test1'
					}
				});
				var bus2 = (0, _aerobus2.default)(delimiter, trace, {
					Channel: {
						newField: 'test2'
					}
				});
				var bus3 = (0, _aerobus2.default)();

				_chai.assert.strictEqual(bus1.root.newField, 'test1');

				_chai.assert.strictEqual(bus1('test1', 'test2').newField, undefined);

				_chai.assert.strictEqual(bus2.root.newField, 'test2');

				_chai.assert.strictEqual(bus3.root.newField, undefined);
			});
			it('extend should not redefine own properties', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace, {
					Section: {
						publish: 'test'
					}
				});

				_chai.assert.notOk(bus.root.publish({}) === 'test');
			});
			it('extend should recognize parameters', function () {
				var bus = (0, _aerobus2.default)({
					Channel: {
						newField: 'test'
					}
				}, delimiter);

				_chai.assert.strictEqual(bus.delimiter, delimiter);

				_chai.assert.strictEqual(bus.root.newField, 'test');
			});
		});
		describe('iteration', function () {
			it('Symbol.iterator property should return object conforming extended iterator iterface', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				var iterator = bus.root[Symbol.iterator]();

				_chai.assert.isFunction(iterator.next);

				_chai.assert.isFunction(iterator.done);
			});
			it('iterator next should return promise in pending state before publish', function (done) {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				var iterator = bus.root[Symbol.iterator]();
				var promise = iterator.next().value;
				var marker = {};
				Promise.race([promise, Promise.resolve(marker)]).then(function (value) {
					_chai.assert.strictEqual(value, marker);

					done();
				});
			});
			it('publish should resolve promise', function (done) {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				var iterator = bus.root[Symbol.iterator]();
				var promise = iterator.next().value;
				var marker1 = {},
				    marker2 = {};
				bus.root.publish(marker1);
				Promise.race([promise, Promise.resolve(marker2)]).then(function (value) {
					_chai.assert.strictEqual(value, marker1);

					done();
				});
			});
			it('publish shoud remaining for next promises', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				var iterator = bus.root[Symbol.iterator]();
				var marker1 = {},
				    marker2 = {};
				bus.root.publish(marker1);
				var promise = iterator.next().value;
				Promise.race([promise, Promise.resolve(marker2)]).then(function (value) {
					_chai.assert.strictEqual(value, marker1);

					done();
				});
			});
			it('done should end iteraion', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				var iterator = bus.root[Symbol.iterator]();
				iterator.done();
				var next = iterator.next();

				_chai.assert.strictEqual(next.done, true);

				_chai.assert.isUndefined(next.value);
			});
			it('iterator should work with Section', function (done) {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				var iterator = bus('test1', 'test2')[Symbol.iterator]();

				_chai.assert.isFunction(iterator.next);

				_chai.assert.isFunction(iterator.done);

				var marker1 = {},
				    marker2 = {},
				    marker3 = {},
				    marker4 = {},
				    marker5 = {};
				var promise = iterator.next().value;
				var assert1 = Promise.race([promise, Promise.resolve(marker1)]).then(function (value) {
					_chai.assert.strictEqual(value, marker1);
				});
				bus('test1').publish(marker2);
				var assert2 = Promise.race([promise, Promise.resolve(marker1)]).then(function (value) {
					_chai.assert.strictEqual(value, marker2);
				});
				promise = iterator.next().value;
				var assert3 = Promise.race([promise, Promise.resolve(marker1)]).then(function (value) {
					_chai.assert.strictEqual(value, marker1);
				});
				bus('test2').publish(marker3);
				var assert4 = Promise.race([promise, Promise.resolve(marker1)]).then(function (value) {
					_chai.assert.strictEqual(value, marker3);
				});
				bus('test1').publish(marker4);
				bus('test2').publish(marker5);
				promise = iterator.next().value;
				var assert5 = Promise.race([promise, Promise.resolve(marker1)]).then(function (value) {
					_chai.assert.strictEqual(value, marker4);
				});
				promise = iterator.next().value;
				var assert6 = Promise.race([promise, Promise.resolve(marker1)]).then(function (value) {
					_chai.assert.strictEqual(value, marker5);
				});
				promise = iterator.next().value;
				var assert7 = Promise.race([promise, Promise.resolve(marker1)]).then(function (value) {
					_chai.assert.strictEqual(value, marker1);
				});
				iterator.done();
				var next = iterator.next();

				_chai.assert.strictEqual(next.done, true);

				_chai.assert.isUndefined(next.value);

				Promise.all([assert1, assert2, assert3, assert4, assert5, assert6, assert7]).then(function () {
					return done();
				});
			});
		});
		describe('errors', function () {
			var invocations = 0,
			    testError = new Error('test'),
			    catcher = function catcher(error) {
				++invocations;
			},
			    thrower = function thrower() {
				throw testError;
			};

			it('should be thrown', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace),
				    publish = function publish() {
					return bus.root.publish(1);
				};

				bus.root.subscribe(thrower);

				_chai.assert.throws(publish, Error, 'test');
			});
			it('channel should not catch other channels publications', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace);
				bus.error.subscribe(catcher);
				bus.root.publish(2);

				_chai.assert.strictEqual(invocations, 0);
			});
			it('channel should catch publications', function () {
				var bus = (0, _aerobus2.default)(delimiter, trace),
				    publish = function publish() {
					return bus.error.publish(3);
				};

				bus.error.subscribe(thrower);

				_chai.assert.throws(publish, Error, 'test');
			});
		});
	});
});
