/*
	todo:
		1. allow publishing message argument only instead of arbitrary arguments list
			1.1. allow specify binding for publication and subscription (or remove bindings completely)
			1.2. allow mapping of payload
			1.3. allow immediate publication
		2. shorthand .publish(data, true) for immediate publishing without .trigger call
		3. allow operations on multiple channels
		4. introduce trace channel to attach logging to
*/

(function(global, undefined) {
	// error messages
	var MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
		MESSAGE_CALLBACK = 'Callback argument must be a function',
		MESSAGE_CONDITION = 'Condition argument must be a channel name or a date or an interval',
		MESSAGE_COUNT = 'Count argument must be a non-negative number',
		MESSAGE_DELIMITER = 'Delimiter argument must be a string',
		MESSAGE_INTERVAL = 'Interval argument must be a positive number',
		MESSAGE_NAME = 'Name argument must be a string',
		MESSAGE_SUBSCRIBER = 'Subscriber argument must be a function';
	// standard settings
	var standard = {
		debug: 'debug',
		delimiter: '.',
		error: 'error',
		root: ''
	};
	// shortcuts to native methods
	var map = Array.prototype.map, setImmediate = global.setImmediate, slice = Array.prototype.slice;
	// setImmediate polyfill
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
	function isDefined(value) {
		return value !== undefined;
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
	function merge() {
		var target = Object.create(null);
		for (var i = 0, il = arguments.length; i < il; i++) {
			var source = arguments[i];
			if (source === undefined || source === null) continue;
			var keys = Object.keys(source);
			for (var j = keys.length - 1; j >= 0; j--) {
				var key = keys[j];
				target[key] = source[key];
			}
		}
		return target;
	}
	// arguments validators
	function validateCount(value) {
		if (!isNumber(value) || value < 0) throw new Error(MESSAGE_COUNT);
	}
	function validateDelimiter(value) {
		if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
	}
	function validateInterval(value) {
		if (!isNumber(value) || value < 1) throw new Error(MESSAGE_INTERVAL);
	}
	function validateName(value) {
		if (!isString(value)) throw new Error(MESSAGE_NAME);
	}
	function validateCallback(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_PREDICATE);
	}
	function validateSubscriber(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_SUBSCRIBER);
	}
	// creates base object for channel, publication or subscription
	// with abstract activation behavior
	function createActivity(bus, parent) {
		var activity = {
			bus: bus,
			enabled: true,
			ensured: false,
			invoke: invoke,
			notify: notify,
			parent: parent,
			verify: verify
		}, operators = [];
		return createActivityApi(activity);
		// if this activity is enabled, invokes operator immediately
		// if this activity is ensured, queues operator to be invoked once after activity is enabled
		// otherwise does not invoke operator
		function invoke(operator) {
			if (verify()) operator();
			else if (activity.ensured) {
				operators.push(operator);
				if (!operators.length && parent) parent.invoke(notify);
			}
		}
		// notifies all pending operators when this activity is enabled
		function notify() {
			if (!enabled() || !operators.length) return;
			if (!parent || parent.enabled()) {
				each(operators);
				operators.length = 0;
			}
			else parent.proceed(notify);
		}
		// returns true if this activity and all its parents are enabled
		function verify() {
			return activity.enabled && (!parent || parent.verify());
		}
	}
	// creates object exposing public activity api
	function createActivityApi(activity) {
		activity.api = Object.defineProperties({}, {
			bus: {enumerable: true, value: activity.bus.api},
			disable: {value: disable},
			enable: {value: enable},
			enabled: {enumerable: true, get: getEnabled, set: setEnabled},
			ensure: {value: ensure},
			ensured: {enumerable: true, get: getEnsured, set: setEnsured}
		});
		return activity;
		// disables this activity
		function disable() {
			activity.enabled = false;
			return activity.api;
		}
		// enables this activity
		function enable(value) {
			var enabled = !arguments.length || !!value;
			if (activity.enabled === enabled) return;
			activity.enabled = enabled;
			if (enabled) activity.notify();
			return activity.api;
		}
		// ensures this activity will invoke all operations after it is enabled
		function ensure(value) {
			activity.ensured = !arguments.length || !!value;
			return activity.api;
		}
		// returns true if this activity and all its parent are enabled
		function getEnabled() {
			return activity.enabled && (!activity.parent || activity.parent.);
		}
		// returns true if this activity is ensured
		function getEnsured() {
			return activity.ensured;
		}
		// enables or disables this activity
		function setEnabled(value) {
			enable(value);
		}
		// ensures this activity will or will not perform all operations after it is enabled
		function setEnsured(value) {
			ensure(value);
		}
	}
	// creates message bus object with specified delimiter of channel names hierarchy
	// if no delimiter passed uses standard one
	function createBus(delimiter) {
		if (0 === arguments.length) delimiter = standard.delimiter;
		else validateDelimiter(delimiter);
		// creates new channel object for specified name or returns existing one
		// channel name must be a string
		function bus(name) {
			if (!arguments.length) return channel(standard.root);
			if (1 < arguments.length) throw new Error(MESSAGE_ARGUMENTS); // todo: multiple channels
			var parent = null;
			if (name !== standard.root && name !== standard.error && name !== standard.trace) {
				validateName(name);
				var index = name.indexOf(delimiter);
				parent = -1 === index
					? channel(standard.root)
					: channel(name.substr(0, index));
			}
			return channels[name] || (channels[name] = createChannel(bus, name, parent));
		}
		// public api of the bus is a function resolving a channel
		bus.api = function(name) {
			return bus(name).api;
		};
		bus.channels = Object.create(null);
		bus.delimiter = delimiter;
		return createBusApi(bus);
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
		// returns debug channel
		function getDebug() {
			return bus(standard.debug).api;
		}
		// returns delimiter string
		function getDelimiter() {
			return bus.delimiter;
		}
		// returns array of all existing channels
		function getChannels() {
			return Object.keys(bus.channels).map(function(key) {
				return bus.channels[key].api;
			});
		}
		// returns error channel
		function getError() {
			return bus(standard.error).api;
		}
		// returns root channel
		function getRoot() {
			return bus(standard.root).api;
		}
		// unsubscribes all specified subscribes from all channels of this bus
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(bus.channels, 'unsubscribe', slice.call(arguments));
			return bus.api;
		}
		Object.defineProperties(bus.api, {
			clear: {value: clear},
			channels: {enumerable: true, get: getChannels},
			create: {value: create},
			debug: {enumerable: true, get: getDebug},
			delimiter: {enumerable: true, value: bus.delimiter},
			error: {enumerable: true, get: getError},
			root: {enumerable: true, get: getRoot},
			unsubscribe: {value: unsubscribe}
		});
		return bus;
	}
	// creates object with channel nehavior
	function createChannel(bus, name, parent) {
		var channel = createActivity(bus, parent),
			preserved = false, preserves = [], publications = [], subscriptions = [];
		// removes all subscriptions and persisted publications from this channel
		channel.clear = function() {
			each(channel.publications, 'dispose');
			each(channel.subscriptions, 'dispose');
			channel.memoizations.length = channel.publications.length = channel.subscriptions.length = 0;
		}
		channel.isPreserved = function() {
			return preserved;
		}
		preserve: preserve
		channel.name = name;
		if (parent) channel.parent = parent;
		// creates publication to this channel
		channel.publish = function(data, now) {
			if (now) {

				return;
			}
			return createPublication(channel, data);
		}
		// creates subscription to this channel
		channel.subscribe = function(subscribers) {
			var subscription = createSubscription(channel, subscribers);
			if (channel.preserves.length) setImmediate(function() {
				each(channel.preserves, subscription.trigger);
			});
			return subscription;
		}
		// triggers publication to this channel
		channel.trigger = function(message) {
			if (channel.preserved) {
				var preserves = channel.preserves;
				preserves.push([params, true, binding]);
				// fix: memoizations.push(merge(message, {ensure: true}));
				if (preserves.limit && preserves.length > preserves.limit) preserves.shift();
			}
			if (channel.ensured) message.ensured = true;
			each(channel.subscriptions, 'trigger', message);
			if (parent) parent.trigger(message);
		}
		// unsubscribes all speciified subscribers from all subscriptions to this channel
		channel.unsubscribe = function(subscribers) {
			each(channel.subscriptions, 'unsubscribe', subscribers);
		}
		return createChannelApi(channel);
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
		function getPreserved() {
			return channel.preserved;
		}
		// returns number of persisted publications to this channel
		function getPublications() {
			return count(channel.publications);
		}
		// returns number of persisted to this channel
		function getSubscriptions() {
			return count(channel.subscriptions);
		}
		// stops memoization of this channel if count is false
		// starts memoization of this channel if count is true or non-negative number
		// limits number of memoized publications to count if count is positive
		// every new subscription will receive all memoized publications for sure
		function preserve(count) {
			if (!arguments.length) count = true;
			switch (count) {
				case true:
					channel.preserve = true;
					break;
				case false:
					channel.preserve = 0;
					channel.preserves.length = false;
					break;
				default:
					validateCount(count);
					channel.preserve = true;
					var preserves = channel.preserves;
					preserves.limit = count;
					preserves.splice(0, preserves.length - count);
					break;
			}
			return channel.api;
		}
		// creates publication to this channel with or without data
		function publish(data) {
			return channel.publish.apply(channel, data).api;
		}
		// creates subscription to this channel with specified subscribers
		// every subscriber must be a function
		function subscribe(subscriber1, subscriber2, subscriberN) {
			if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var subscribers = slice.call(arguments);
			subscribers.forEach(validateSubscriber);
			return channel.subscribe(subscribers).api;
		}
		// unsubscribes all specified subscribers from all subscriptions of this channel
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			var subscribers = slice.call(arguments);
			channel.unsubscribe(subscribers);
			return channel.api;
		}
		Object.defineProperties(channel.api, {
			clear: {value: clear},
			name: {enumerable: true, value: channel.name},
			parent: {value: channel.parent ? channel.parent.api : null},
			preserve: {value: preserve},
			preserved: {enumerable: true, get: getPreserved},
			publications: {enumerable: true, get: getPublications},
			publish: {value: publish},
			subscribe: {value: subscribe},
			subscriptions: {enumerable: true, get: getSubscriptions},
			unsubscribe: {value: unsubscribe}
		});
		return channel;
	}
	// creates base object for publication or subscription with abstract operation behavior
	function createOperation(bus, channel, collection, proto) {
		var index, operation = createActivity(bus, channel, merge(proto, {
			binding: undefined,
			channel: channel,
			dispose: dispose,
			disposers: [],
			operators: [],
			parameters: [],
			persist: persist,
			trigger: trigger
		}));
		return createOperationApi(operation);
		// destroys this object:
		// removes from parent channel, deactivates, invokes registered disposers, erases state
		function dispose() {
			if (isNumber(index)) {
				if (collection.slots) collection.slots.push(index);
				else collection.slots = [index];
				index = collection[index] = undefined;
			}
			operation.disable();
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
		function trigger(message) {
			var cursor = 0, disposing = false;
			if (operation.binding) message.binding = operation.binding;
			if (operation.ensured) message.ensured = true;
			message.parameters = message.parameters
				? operation.parameters
				: message.parameters.concat(operation.parameters);
			operation.invoke(next);
			function end() {
				if (disposing) operation.dispose();
			}
			function next(proceed, terminate) {
				if (true === terminate) disposing = true;
				if (false === proceed) end();
				else {
					var operators = operation.operators;
					if (++cursor === operators.length) operators[0](message, end);
					else operators[cursor](message, next);
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
			if (isString(condition)) watcher = operation.bus.channel(condition).subscribe([happen]);
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
				if (watcher) watcher.dispose();
				timer = watcher = undefined;
				if (replay) each(replay);
				replay = undefined;
			}
			function operate(message, next) {
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
			function operate(message, next) {
				setImmediate(next);
			}
		}
		// binds this operation to specified object an parameters
		// all predicates and subscribers related to this operation will be invoked in predefined context
		function bind(binding, parameter1, parameter2, parameterN) {
			operation.binding = binding;
			operation.parameters = slice.call(arguments, 1);
			return operation.api;
		}
		// performs this operation once within specified interval between invocation attempts
		// if defer is true this operation will be invoked at the end of interval
		// otherwise this operation will be invoked at the beginning of interval
		// interval must be positive number
		function debounce(interval, defer) {
			var timer;
			validateInterval(interval);
			operation.disposers.push(dispose);
			operation.operators.push(defer ? deferred : immediate);
			operation.persist();
			return operation.api;
			function dispose() {
				clearTimeout(timer);
			}
			function deferred(message, next) {
				clearTimeout(timer);
				timer = setTimeout(debounced, interval);
				function debounced() {
					timer = undefined;
					next(true);
				}
			}
			function immediate(message, next) {
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
			function operate(message, next) {
				var index = slots.length
					? slots.pop()
					: timers.length;
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
		// performs dynamic transformation of the published message
		function map(callback) {
			validateCallback(predicate);
			operation.operators.push(operate);
			return operation.api;
			function operate(message, next) {
				message.data = callback.apply(message.binding, message.parameters.concat(message.data, message));
				next(true);
			}
		}
		// performs this operation only if specified predicate returns trythy value
		function filter(callback) {
			validateCallback(predicate);
			operation.operators.push(operate);
			return operation.api;
			function operate(message, next) {
				next(callback.apply(message.binding, message.parameters.concat(message.data, message)););
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
			return operation.api;
		}
		// sets binding for this operation
		function setBinding(value) {
			operation.binding = value;
		}
		// skips specified count of attempts to perform this operation
		function skip(count) {
			validateCount(count);
			operation.operators.push(operate);
			return operation.api;
			function operate(message, next) {
				next(--count < 0);
			}
		}
		// performs this operation only specified count of times then discards it
		function take(count) {
			validateCount(count);
			operation.operators.push(operate);
			return operation.api;
			function operate(message, next) {
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
			function operate(message, next) {
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
			function operate(message, next) {
				var terminate = predicate.apply(message.binding, message.parameters.concat(message.data, message));
				next(!terminate, terminate);
			}
		}
		// performs this operation until specified condition happens
		// condition can be date, interval or channel name to wait for publication occurs
		function until(condition) {
			var timer, watcher;
			if (isString(condition)) watcher = operation.bus.channel(condition).subscribe([operation.dispose]);
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
			filter: {value: filter},
			map: {value: map},
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
	function createPublication(channel, data) {
		var publication = createOperation(channel, channel.publications);
		publication.operators.push(operate);
		return createPublicationApi(publication);
		// delivers publication to parent channel
		function operate(next, params) {
		// fix: function operate(message, next) {
			channel.trigger(params, publication.ensured, this);
			// fix: channel.trigger(message);
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
				// fix: publication.trigger({data: publication.data, channel: publication.channel, ensured: publication.ensured});
			}
		}
		// triggers this publication with specified parameters
		function trigger(parameter1, parameter2, parameterN) {
		// fix: function trigger(data) {
			// fix: validateData(data);
			publication.trigger(slice.call(arguments), publication.ensured, this);
			// fix: publication.trigger({data: merge(data, publication.data), ensured: publication.ensured});
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
		var subscription = createOperation(channel, channel.subscriptions, {
			subscribers: subscribers,
			unsubscribe: unsubscribe
		});
		subscription.disposers.push(dispose);
		subscription.operators.push(operate);
		subscription.persist();
		return createSubscriptionApi(subscription);
		// disposes core state of this object
		function dispose() {
			subscribers.length = 0;
		}
		// delivers publication to all related subscribers
		function operate(next, params, sure) {
		// fix: function operate(message, next) {
			var binding = this, cursor = 0;
			proceed();
			function proceed() {
				if (cursor === subscribers.length) next();
				else if (subscription.isActive()) try {
					subscribers[cursor++].apply(binding, params);
					// subscribers[cursor++](message.data, message);
				} catch(e) {
					var error = channel.bus.error();
					if (channel === error) throw e;
					error.trigger([e, subscription.api], true);
					// fix: message.error = e; error.trigger(message);
				}
				// fix: else if (message.ensured) subscription.onActivate(proceed);
				else if (sure) subscription.onActivate(proceed);
				else next();
			}
		}
		// unsubscribes all specified subscribers from this subscription
		function unsubscribe(subscribers) {
			if (subscribers.length) each(subscribers, function(subscriber) {
				var index = subscription.subscribers.indexOf(subscriber);
				if (-1 !== index) subscription.subscribers.splice(index, 1);
			});
			if (!subscription.subscribers.length) subscription.dispose();
		}
	}
	// creates object exposing public subscription api
	function createSubscriptionApi(subscription) {
		// returns number of subscribers in this sunscription
		function getSubscribers() {
			return subscription.subscribers.length;
		}
		// fix: function trigger(data) { subscription.trigger({data: merge(data), }); return subscription.api;}
		// unsubscribes all specified subscribers from this subscription
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			subscription.unsubscribe.apply(subscription, arguments);
			return subscription.api;
		}
		// todo: trigger method
		Object.defineProperties(subscription.api, {
			subscribers: {get: getSubscribers},
			unsubscribe: {value: unsubscribe}
		});
		return subscription;
	}
	// exports message bus as singleton
	if ('object' === typeof module && module.exports) module.exports = createBus().api;
	else global.bus = createBus().api;
})(this);
