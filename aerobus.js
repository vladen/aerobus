/*
	Excerpt:
		var channel = bus('channel')
			.activate()
			.deactivate()
			.ensure()
			.memoize(count);
		channel
			.clear()
			.unsubscribe(subscriber1, subscriber2, subscriberN);
		var subscription = channel
			.subscribe(subscriber1, subscriber2, subscriberN)
			.activate()
			.after('channel' | date | interval)
			.async()
			.bind(this, parameter1, parameter2, parameterN)
			.deactivate()
			.debounce(interval)
			.delay(interval)
			.ensure()
			.filter(function predicate() {return false})
			.once()
			.skip(count)
			.take(count)
			.throttle(interval)
			.unless(function predicate() {return true})
			.until('channel' | date | interval);
		subscription
			.discard()
			.unsubscribe(subscriber1, subscriber2, subscriberN);
		var publication = channel
			.publish(parameter1, parameter2, parameterN)
			.activate()
			.after('channel' | date | interval)
			.async()
			.bind(this, parameter1, parameter2, parameterN)
			.deactivate()
			.debounce(interval)
			.delay(interval)
			.ensure()
			.filter(function predicate() {return false})
			.once()
			.skip(count)
			.take(count)
			.throttle(interval)
			.unless(function predicate() {return true})
			.until('channel' | date | interval);
		publication
			.discard()
			.trigger(parameter1, parameter2, parameterN);
*/

(function(global, undefined) {
	// error messages
	var MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
		MESSAGE_CONDITION = 'Condition argument must be a channel name or a date or an interval',
		MESSAGE_COUNT = 'Count argument must be a non-negative number',
		MESSAGE_DELIMITER = 'Delimiter argument must be a string',
		MESSAGE_INTERVAL = 'Interval argument must be a positive number',
		MESSAGE_NAME = 'Name argument must be a string',
		MESSAGE_PREDICATE = 'Predicate argument must be a function',
		MESSAGE_SUBSCRIBER = 'Subscriber argument must be a function';
	// standard settings
	var standard = {
		delimiter: '.',
		error: 'error',
		root: ''
	};
	// shortcuts to native methods
	var map = Array.prototype.map, setImmediate = global.setImmediate, slice = Array.prototype.slice;
	// async polyfill
	if (!setImmediate) setImmediate = function(handler) {
		return setTimeout(handler, 0);
	};
	// invokes handler for each item of collection (array or enumerable object)
	// handler can be function or name of item's method
	function each(collection, handler, parameters) {
		var invoker;
		if (1 === arguments.length) invoker = self;
		else if (isString(handler)) invoker = property;
		else if (Array.isArray(handler)) {
			invoker = self;
			parameters = handler;
		}
		else invoker = handler;
		if (isNumber(collection.length)) items();
		else keys();
		function items() {
			for (var i = 0, l = collection.length; i < l; i++) {
				var item = collection[i];
				if (item !== undefined) invoker.apply(undefined, [item].concat(parameters));
			}
		}
		function keys() {
			for (var key in collection) {
				var item = collection[key];
				if (item !== undefined) invoker.apply(undefined, [item].concat(parameters));
			}
		}
		function property(item) {
			item[handler].apply(item, slice.call(arguments, 1));
		}
		function self(item) {
			item.apply(undefined, slice.call(arguments, 1));
		}
	}
	// type checkers
	function isDate(value) {
		return value instanceof Date;
	}
	function isFunction(value) {
		return value instanceof Function;
	}
	function isNumber(value) {
		return 'number' === typeof value || value instanceof Number;
	}
	function isString(value) {
		return 'string' === typeof value || value instanceof String;
	}
	// arguments validators
	function validateCount(value) {
		if (!isNumber(value) || value < 0) throw new Error(MESSAGE_COUNT);
		return value;
	}
	function validateDelimiter(value) {
		if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
		return value;
	}
	function validateInterval(value) {
		if (!isNumber(value) || value < 1) throw new Error(MESSAGE_INTERVAL);
		return value;
	}
	function validateName(value) {
		if (!isString(value)) throw new Error(MESSAGE_NAME);
		return value;
	}
	function validatePredicate(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_PREDICATE);
		return value;
	}
	function validateSubscriber(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_SUBSCRIBER);
		return value;
	}
	// creates base object for channel, publication or subscription
	// with abstract activation behavior
	function createActivity(bus, parent) {
		var active = true, observers;
		return createActivityApi({
			activate: activate,
			api: {},
			bus: bus,
			deactivate: deactivate,
			ensured: false,
			isActive: isActive,
			onActivate: onActivate
		});
		// activates this object
		function activate() {
			active = true;
			notify();
		}
		// deactivates this object
		function deactivate() {
			active = false;
		}
		// returns true if this object and all its parent are active
		function isActive() {
			return active && (!parent || parent.isActive());
		}
		// notifies all activation observers once
		function notify() {
			if (!observers || !active) return;
			if (!parent || parent.isActive()) {
				each(observers);
				observers = undefined;
			}
			else parent.onActivate(notify);
		}
		// registers activation observer to be notified when this object activates
		// or invokes observer immediately if this object is already active
		function onActivate(observer) {
			if (isActive()) observer();
			else if (observers) observers.push(observer);
			else {
				observers = [observer];
				if (parent) parent.onActivate(notify);
			}
		}
	}
	// creates object exposing public activity api
	function createActivityApi(activity) {
		function activate() {
			activity.activate();
			return activity.api;
		}
		function deactivate() {
			activity.deactivate();
			return activity.api;
		}
		function ensure() {
			activity.ensured = true;
			return activity.api;
		}
		function getActive() {
			return activity.isActive();
		}
		function getEnsured() {
			return activity.ensured;
		}
		function setActive(value) {
			value ? activity.activate() : activity.deactivate();
		}
		function setEnsured() {
			activity.ensured = true;
		}
		Object.defineProperties(activity.api, {
			activate: {value: activate},
			active: {enumerable: true, get: getActive, set: setActive},
			bus: {enumerable: true, value: activity.bus.api},
			deactivate: {value: deactivate},
			ensure: {value: ensure},
			ensured: {enumerable: true, get: getEnsured, set: setEnsured}
		});
		return activity;
	}
	// creates message bus object with specified delimiter of channel names hierarchy
	// if no delimiter passed uses standard one
	function createBus(delimiter) {
		var bus = {
			channel: channel,
			channels: Object.create(null),
			delimiter: delimiter ? validateDelimiter(delimiter) : standard.delimiter,
			error: error,
			root: root
		};
		return createBusApi(bus);
		// creates new channel object for specified name or returns existing one
		// channel name must be a string
		function channel(name) {
			var channels = bus.channels, result;
			if (!arguments.length) name = standard.root;
			if (name === standard.root || name === standard.error) {
				result = bus.channels[name];
				if (result) return result;
				return channels[name] = createChannel(bus, name, null);
			}
			if (1 < arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			result = channels[validateName(name)];
			if (result) return result;
			var index = name.indexOf(bus.delimiter);
			var parent = -1 === index ? channel() : channel(name.substr(0, index));
			return channels[name] = createChannel(bus, name, parent);
		}
		// returns error channel
		function error() {
			return channel(standard.error);
		}
		// returns root channel
		function root() {
			return channel(standard.root);
		}
	}
	// creates object exposing public message bus api
	function createBusApi(bus) {
		// removes all channels from this bus
		function clear() {
			each(bus.channels, 'clear');
			bus.channels = Object.create(null);
			return bus.api;
		}
		// creates new bus object
		function create(delimiter) {
			return createBus(delimiter).api;
		}
		// returns names of all existing channels
		function getChannels() {
			return Object.keys(bus.channels).length;
		}
		// returns error channel
		function getError() {
			return bus.error().api;
		}
		// returns root channel
		function getRoot() {
			return bus.root().api;
		}
		// unsubscribes all specified subscribes from all channels of this bus
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(bus.channels, 'unsubscribe', slice.call(arguments));
			return bus.api;
		}
		// public api of bus is function resolving channels
		bus.api = function(name) {
			return bus.channel.apply(bus, arguments).api;
		};
		Object.defineProperties(bus.api, {
			channel: {value: bus.channel},
			clear: {value: clear},
			channels: {enumerable: true, get: getChannels},
			create: {value: create},
			delimiter: {enumerable: true, value: bus.delimiter},
			error: {enumerable: true, get: getError},
			root: {enumerable: true, get: getRoot},
			unsubscribe: {value: unsubscribe}
		});
		return bus;
	}
	// creates object with channel nehavior
	function createChannel(bus, name, parent) {
		var channel = createActivity(bus, parent);
		channel.clear = clear;
		channel.memoizations = [];
		channel.memoizations.limit = 9e9;
		channel.memoized = false;
		channel.name = name;
		channel.parent = parent;
		channel.publications = [];
		channel.publish = publish;
		channel.subscribe = subscribe;
		channel.subscriptions = [];
		channel.trigger = trigger;
		channel.unsubscribe = unsubscribe;
		return createChannelApi(channel);
		// removes all subscriptions and persisted publications from this channel
		function clear() {
			each(channel.publications, 'dispose');
			each(channel.subscriptions, 'dispose');
			channel.memoizations.length = channel.publications.length = channel.subscriptions.length = 0;
		}
		// creates publication to this channel
		function publish() {
			return createPublication(channel, slice.call(arguments));
		}
		// creates subscription to this channel
		function subscribe() {
			if (0 === arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var subscription = createSubscription(channel, map.call(arguments, validateSubscriber));
			if (channel.memoizations.length) setImmediate(deliver);
			return subscription;
			function deliver() {
				each(channel.memoizations, function(memoization) {
					subscription.trigger.apply(undefined, memoization);
				});
			}
		}
		// triggers publication to this channel
		function trigger(params, sure, binding) {
			if (channel.memoized) {
				var memoizations = channel.memoizations;
				memoizations.push([params, true, binding]);
				if (memoizations.length > memoizations.limit) memoizations.shift();
			}
			each(channel.subscriptions, 'trigger', [params, sure || channel.ensured, binding]);
			if (parent) parent.trigger(params, sure, binding);
		}
		// unsubscribes all speciified subscribers from all subscriptions to this channel
		function unsubscribe() {
			each(channel.subscriptions, 'unsubscribe', slice.call(arguments));
		}
	}
	// creates object exposing public channel api
	function createChannelApi(channel) {
		// removes all subcriptions and persisted publications from this channel
		function clear() {
			channel.clear();
			return channel.api;
		}
		// computes number of items in specified collection
		function count(collection) {
			var result = 0;
			each(collection, increment);
			return result;
			function increment() {
				result++;
			}
		}
		// returns true if this channel is memoized
		function getMemoized() {
			return channel.memoized;
		}
		// returns number of persisted publications to this channel
		function getPublications() {
			return count(channel.publications);
		}
		// returns number of persisted to this channel
		function getSubscriptions() {
			return count(channel.subscriptions);
		}
		// starts memoization of all publications to this channel
		// every new subscription to this channel will receive all memoized publications
		function memoize(count) {
			if (0 < arguments.length) {
				validateCount(count);
				var memoizations = channel.memoizations;
				memoizations.limit = count;
				memoizations.splice(0, memoizations.length - count);
			}
			channel.memoized = true;
			return channel.api;
		}
		// creates publication to this channel with specified predefined parameters
		function publish(parameter1, parameter2, parameterN) {
			return channel.publish.apply(channel, arguments).api;
		}
		// creates subscription to this channel with specified subscribers
		// every subscriber must be a function 
		function subscribe(subscriber1, subscriber2, subscriberN) {
			return channel.subscribe.apply(channel, arguments).api;
		}
		// unsubscribes all specified subscribers from all subscriptions of this channel
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			channel.unsubscribe.apply(channel, arguments);
			return channel.api;
		}
		Object.defineProperties(channel.api, {
			clear: {value: clear},
			memoize: {value: memoize},
			memoized: {enumerable: true, get: getMemoized},
			name: {enumerable: true, value: channel.name},
			parent: {value: channel.parent ? channel.parent.api : null},
			publications: {enumerable: true, get: getPublications},
			publish: {value: publish},
			subscribe: {value: subscribe},
			subscriptions: {enumerable: true, get: getSubscriptions},
			unsubscribe: {value: unsubscribe}
		});
		return channel;
	}
	// creates base object for publication or subscription with abstract operation behavior
	function createOperation(channel, collection, parameters) {
		var index, operation = createActivity(channel.bus, channel);
		operation.channel = channel;
		operation.dispose = dispose;
		operation.disposers = [];
		operation.operators = [];
		operation.parameters = parameters;
		operation.persist = persist;
		operation.trigger = trigger;
		return createOperationApi(operation);
		// destroys this object:
		// removes from parent channel, deactivates, invokes registered disposers, erases state
		function dispose() {
			if (isNumber(index)) {
				if (collection.slots) collection.slots.push(index);
				else collection.slots = [index];
				index = collection[index] = undefined;
			}
			operation.deactivate();
			each(operation.disposers);
			operation.disposers.length = operation.operators.length = operation.parameters.length = 0;
		}
		// saves this object to corresponsing collection of parent channel
		function persist() {
			if (isNumber(index)) return;
			if (collection.slots) index = collection.slots.pop();
			else index = collection.length++;
			collection[index] = operation;
		}
		// triggers registered operations on this object
		function trigger(params, sure, binding) {
			if (operation.ensured) sure = true;
			if (!operation.isActive() && !sure) return;
			if (operation.binding !== undefined) binding = operation.binding;
			params = operation.parameters.concat(params);
			var cursor = 0, disposing, operators = operation.operators;
			operation.onActivate(next);
			function end() {
				if (disposing) operation.dispose();
			}
			function next(proceed, terminate) {
				if (true === terminate) disposing = true;
				if (false === proceed) end();
				else {
					++cursor;
					if (cursor === operators.length) operators[0].call(binding, end, params, sure);
					else operators[cursor].call(binding, next, params, sure);
				}
			}
		}
	}
	// creates object exposing public operation api
	function createOperationApi(operation) {
		// pospones this operation till specified condition happens
		// condition can be date, interval or channel name to wait for publication occurs
		// if replay is true, all publications delivered to this operation are collected
		// and replayed when condition happens
		function after(condition, replay) {
			var happened = false, timer, watcher;
			if (isString(condition)) watcher = operation.bus.channel(condition).subscribe(happen).once();
			else {
				if (isDate(condition)) condition = condition.valueOf() - Date.now();
				if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
				if (condition < 1) return operation.api;
				else timer = setTimeout(happen, condition);
			}
			if (replay) replay = [];
			operation.disposers.push(dispose);
			operation.operators.push(operate);
			operation.persist();
			return operation.api;
			function dispose() {
				replay = undefined;
				clearTimeout(timer);
				if (watcher) watcher.dispose();
			}
			function happen() {
				happened = true;
				timer = watcher = undefined;
				if (replay) each(replay);
				replay = undefined;
			}
			function operate(next) {
				if (happened) next(true);
				else if (replay) replay.push(next);
				else next(false);
			}
		}
		// turns this operation into asynchronous
		// asynchronous operation is invoked after all synchronous operations are complete
		function async() {
			var timer;
			operation.disposers.push(dispose);
			operation.operators.push(operate);
			operation.persist();
			return operation.api;
			function dispose() {
				clearTimeout(timer);
			}
			function operate(next) {
				setImmediate(next);
			}
		}
		// binds this operation to specified object an parameters
		// all predicates and subscribers related to this operation will be invoked in predefined context
		function bind(binding, parameter1, parameter2, parameterN) {
			operation.binding = binding;
			var params = operation.parameters;
			params.push.apply(params, slice.call(arguments, 1));
			return operation.api;
		}
		// performs this operation once within specified interval between invocation attempts
		// if later is true this operation will be invoked at the end of interval
		// otherwise this operation will be invoked at the beginning of interval
		// interval must be positive number
		function debounce(interval, later) {
			validateInterval(interval);
			var timer;
			operation.disposers.push(dispose);
			operation.operators.push(later ? future : immediate);
			operation.persist();
			return operation.api;
			function dispose() {
				clearTimeout(timer);
			}
			function future(next) {
				clearTimeout(timer);
				timer = setTimeout(debounced, interval);
				function debounced() {
					timer = undefined;
					next(true);
				}
			}
			function immediate(next) {
				if (timer) clearTimeout(timer);
				else next(true);
				timer = setTimeout(debounced, interval);
				function debounced() {
					timer = undefined;
				}
			}
		}
		// delays this operation for specified interval
		// interval must be positive number
		function delay(interval) {
			validateInterval(interval);
			var slots = [], timers = [];
			operation.disposers.push(dispose);
			operation.operators.push(operate);
			operation.persist();
			return operation.api;
			function dispose() {
				each(timers, clearTimeout);
				timers = undefined;
			}
			function operate(next) {
				var index = slots.length ? slots.pop() : timers.length;
				timers[index] = setTimeout(delayed, interval);
				function delayed() {
					slots.push(index);
					next();
				}
			}
		}
		// discards this operation and disposes it
		function discard() {
			operation.dispose();
			return operation.api;
		}
		// appends dynamic (function) parameters to this operation
		// each parameter function is invoked in context of current binding and with all previously gathered parameters
		function dynamic(parameter1, parameter2, parameterN) {
			var parameters = slice.call(arguments);
			operation.operators.push(operate);
			return operation.api;
			function operate(next, params) {
				each(parameters, compute);
				next(true);
				function compute(parameter) {
					params.push(isFunction(parameter) ? parameter.apply(this, params) : parameter);
				}
			}
		}
		// performs this operation only if specified predicate returns trythy value
		function filter(predicate) {
			validatePredicate(predicate);
			operation.operators.push(operate);
			return operation.api;
			function operate(next, params) {
				next(predicate.apply(operation.binding, params));
			}
		}
		// returns binding of this operation
		function getBinding() {
			return operation.binding;
		}
		// returns array of predefined parameters of this operation
		function getParameters() {
			return operation.parameters;
		}
		// performs this operation only once
		function once() {
			return take(1);
		}
		// saves this operation into corresponding collection of parent channel
		function persist() {
			operation.persist();
			return operation;
		}
		// sets binding of this operation
		function setBinding(value) {
			operation.binding = value;
		}
		// skips specified count of attempts to perform this operation
		function skip(count) {
			validateCount(count);
			operation.operators.push(operate);
			return operation.api;
			function operate(next) {
				next(--count < 0);
			}
		}
		// performs this operation only specified count of times then discards it
		function take(count) {
			validateCount(count);
			operation.operators.push(operate);
			return operation.api;
			function operate(next) {
				if (--count < 0) next(false);
				else next(true, count === 0);
			}
		}
		// performs this operation once within specified interval ignoring other attempts
		// interval must be positive number
		function throttle(interval) {
			validateInterval(interval);
			var timer;
			operation.disposers.push(dispose);
			operation.operators.push(operate);
			operation.persist();
			return operation.api;
			function dispose() {
				clearTimeout(timer);
			}
			function operate(next) {
				if (!timer) timer = setTimeout(throttled, interval);
				function throttled() {
					timer = undefined;
					next(true);
				}
			}
		}
		// perfoms this operation if predicate returns thruthy value
		// otherwise discards it
		function unless(predicate) {
			validatePredicate(predicate);
			operation.operators.push(operate);
			return operation.api;
			function operate(next, params) {
				var terminate = predicate.apply(operation.binding, params);
				next(!terminate, terminate);
			}
		}
		// performs this operation until specified condition happens
		// condition can be date, interval or channel name to wait for publication occurs
		function until(condition) {
			var timer, watcher;
			if (isString(condition)) watcher = operation.bus.channel(condition).subscribe(operation.dispose);
			else {
				if (isDate(condition)) condition = condition.valueOf() - Date.now();
				else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
				if (condition < 0) return discard();
				timer = setTimeout(operation.dispose, condition);
			}
			operation.persist();
			operation.disposers.push(dispose);
			return operation.api;
			function dispose() {
				clearTimeout(timer);
				if (watcher) watcher.dispose();
			}
		}
		Object.defineProperties(operation.api, {
			after: {value: after},
			async: {value: async},
			bind: {value: bind},
			binding: {enumerable: true, get: getBinding, set: setBinding},
			channel: {enumerable: true, value: operation.channel.api},
			debounce: {value: debounce},
			delay: {value: delay},
			discard: {value: discard},
			dynamic: {value: dynamic},
			filter: {value: filter},
			once: {value: once},
			parameters: {enumerable: true, get: getParameters},
			persist: {value: persist},
			skip: {value: skip},
			take: {value: take},
			throttle: {value: throttle},
			unless: {value: unless},
			until: {value: until}
		});
		return operation;
	}
	// creates object with publication behavior
	function createPublication(channel, parameters) {
		var publication = createOperation(channel, channel.publications, parameters);
		publication.operators.push(operate);
		return createPublicationApi(publication);
		// delivers publication to parent channel
		function operate(next, params) {
			channel.trigger(params, publication.ensured, this);
			next();
		}
	}
	// creates object exposing public publication api
	function createPublicationApi(publication) {
		// repeats this publication every specified interval
		// interval must be positive number
		function repeat(interval) {
			validateInterval(interval);
			publication.persist();
			var repeater = setInterval(operate, interval);
			publication.disposers.push(dispose);
			return publication.api;
			function dispose() {
				clearInterval(repeater);
			}
			function operate() {
				publication.trigger([]);
			}
		}
		// triggers this publication with specified parameters
		function trigger(parameter1, parameter2, parameterN) {
			publication.trigger(slice.call(arguments), publication.ensured, this);
			return publication.api;
		}
		Object.defineProperties(publication.api, {
			repeat: {value: repeat},
			trigger: {value: trigger}
		});
		return publication;
	}
	// creates object with subscription behavior
	function createSubscription(channel, subscribers) {
		var subscription = createOperation(channel, channel.subscriptions, []);
		subscription.disposers.push(dispose);
		subscription.operators.push(operate);
		subscription.persist();
		subscription.subscribers = subscribers;
		subscription.unsubscribe = unsubscribe;
		return createSubscriptionApi(subscription);
		// disposes core state of this object
		function dispose() {
			subscribers.length = 0;
		}
		// delivers publication to all related subscribers
		function operate(next, params, sure) {
			var binding = this, cursor = 0;
			proceed();
			function proceed() {
				if (cursor === subscribers.length) next();
				else if (subscription.isActive()) try {
					subscribers[cursor++].apply(binding, params);
				} catch(e) {
					var error = channel.bus.error();
					if (channel === error) throw e;
					error.trigger([e, subscription], true);
				}
				else if (sure) subscription.onActivate(proceed);
				else next();
			}
		}
		// unsubscribes all specified subscribers from this subscription
		function unsubscribe() {
			if (!arguments.length) return subscription.dispose();
			each(arguments, remove);
			if (!subscribers.length) subscription.dispose();
			function remove(subscriber) {
				var index = subscribers.indexOf(subscriber);
				if (-1 !== index) subscribers.splice(index, 1);
			}
		}
	}
	// creates object exposing public subscription api
	function createSubscriptionApi(subscription) {
		// returns number of subscribers in this sunscription
		function getSubscribers() {
			return subscription.subscribers.length;
		}
		// unsubscribes all specified subscribers from this subscription
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			subscription.unsubscribe.apply(subscription, arguments);
			return subscription.api;
		}
		Object.defineProperties(subscription.api, {
			subscribers: {get: getSubscribers},
			unsubscribe: {value: unsubscribe}
		});
		return subscription;
	}
	// exports message bus as singleton
	if ('object' === typeof module && module.exports) module.exports = createBus().api;
	else global.bus = createBus().api;
})(new Function('return this')());