/*
	ideas:
		introduce dispatch operation forwarding publications dynamically to various channels
		allow operations on multiple channels
		switch ensure to chainable operation using pure onEnable
*/

(function(global, undefined) {
	// error messages
	var MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
		MESSAGE_CALLBACK = 'Callback must be function',
		MESSAGE_CHANNEL = 'Channel must be instance of channel class',
		MESSAGE_CONDITION = 'Condition must be channel name or date or interval',
		MESSAGE_COUNT = 'Count must be positive number',
		MESSAGE_DELIMITER = 'Delimiter must be string',
		MESSAGE_DISPOSED = 'Object has been disposed',
		MESSAGE_FORBIDDEN = 'Operation is forbidden',
		MESSAGE_INTERVAL = 'Interval must be positive number',
		MESSAGE_NAME = 'Name must be string',
		MESSAGE_OPERATION = 'Operation must be instance of publication or subscription  class',
		MESSAGE_SUBSCRIBER = 'Subscriber must be function',
		MESSAGE_TRACE = 'Trace must be function';
	// standard settings
	var DELIMITER = '.', ERROR = 'error', ROOT = '';
	// continuation flags
	var BREAK = 3, CONTINUE = 0, FINISH = 2, SKIP = 1;
	// shared variables
	var identity = 0;
	// shortcuts to native utility methods
	var map = Array.prototype.map, setImmediate = global.setImmediate, slice = Array.prototype.slice;
	// polyfill for setImmediate
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
				if (isDefined(item) && false === invoker.apply(undefined, [item].concat(parameters))) break;
			}
		}
		function keys() {
			for (var key in collection) {
				var item = collection[key];
				if (isDefined(item) && false === invoker.apply(undefined, [item].concat(parameters))) break;
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
	function isChannel(value) {
		return value instanceof Channel;
	}
	function isDate(value) {
		return value instanceof Date;
	}
	function isDefined(value) {
		return value !== undefined;
	}
	function isError(value) {
		return value instanceof Error;
	}
	function isFunction(value) {
		return value instanceof Function;
	}
	function isMessage(value) {
		return value instanceof Message;
	}
	function isNumber(value) {
		return 'number' === typeof value || value instanceof Number;
	}
	function isPublication(value) {
		return value instanceof Publication;
	}
	function isString(value) {
		return 'string' === typeof value || value instanceof String;
	}
	function isSubscription(value) {
		return value instanceof Subscription;
	}
	function isUndefined(value) {
		return value === undefined;
	}
	// fake function
	function noop() {}
	// arguments validators
	function validateCallback(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_CALLBACK);
	}
	function validateCount(value) {
		if (!isNumber(value) || value < 1) throw new Error(MESSAGE_COUNT);
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
	function validateSubscriber(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_SUBSCRIBER);
	}
	function validateTrace(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_TRACE);
	}
	// creates new bus object
	function create(delimiter, trace) {
		var channels, configurable, id = ++identity;
		if (!arguments.length) {
			delimiter = DELIMITER;
			trace = noop;
		}
		else if (isFunction(delimiter)) {
			trace = delimiter;
			delimiter = DELIMITER;
		}
		else {
			validateDelimiter(delimiter);
			if (isDefined(trace)) validateTrace(trace);
			else trace = noop;
		}
		// creates new channel or returns existing one
		// name must be a string
		function bus(name) {
			if (!arguments.length) return bus(ROOT);
			// todo: multiple channels wrapper
			if (1 < arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var channel = channels[name];
			if (channel) return channel;
			var parent = null;
			if (name !== ROOT && name !== ERROR) {
				validateName(name);
				var index = name.indexOf(delimiter);
				parent = -1 === index
					? bus(ROOT)
					: bus(name.substr(0, index));
			}
			configurable = false;
			channel = channels[name] = new Channel(bus, name, parent).onDispose(dispose);
			return channel;
			function dispose() {
				delete channels[name];
			}
		}
		init();
		Object.defineProperties(bus, {
			clear: {value: clear},
			channels: {enumerable: true, get: getChannels},
			create: {value: create},
			delimiter: {enumerable: true, get: getDelimiter, set: setDelimiter},
			error: {enumerable: true, get: getError},
			id: {enumerable: true, get: getId},
			root: {enumerable: true, get: getRoot},
			trace: {get: getTrace, set: setTrace},
			toString: {value: toString},
			unsubscribe: {value: unsubscribe}
		});
		trace('create', 'bus', bus);
		return bus;
		// empties this bus
		function clear() {
			each(channels, 'clear');
			init();
			return bus;
		}
		// returns array of all existing channels
		function getChannels() {
			return Object.keys(channels).map(function(key) {
				return channels[key];
			});
		}
		// returns delimiter string
		function getDelimiter() {
			return delimiter;
		}
		// returns error channel
		function getError() {
			return bus(ERROR);
		}
		// returns identity of this bus
		function getId() {
			return id;
		}
		// returns root channel
		function getRoot() {
			return bus(ROOT);
		}
		// returns trace function
		function getTrace() {
			return trace;
		}
		function init() {
			channels = Object.create(null);
			configurable = true;
		}
		// sets delimiter string if this bus is empty
		// otherwise throws error
		function setDelimiter(value) {
			if (!configurable) throw new Error(MESSAGE_FORBIDDEN);
			validateDelimiter(delimiter);
			delimiter = value;
		}
		// sets trace function if this bus is empty
		// otherwise throws error
		function setTrace(value) {
			if (!configurable) throw new Error(MESSAGE_FORBIDDEN);
			validateTrace(value);
			trace = value;
		}
		// returns string representation of this bus
		function toString() {
			return 'bus #' + id;
		}
		// unsubscribes all specified subscribes from all channels of this bus
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(channels, 'unsubscribe', slice.call(arguments));
			return bus;
		}
	}
	// creates new activity object, abstract base for channels, publications and subscriptions
	function Activity(bus, parent) {
		var activity, disposed = false, disposers = [],
			enabled = true, enablers = [], ensured = false,
			id = ++identity, triggers = [];
		return activity = Object.defineProperties(this, {
			bus: {enumerable: true, value: bus},
			disable: {value: disable},
			dispose: {value: dispose},
			disposed: {enumerable: true, get: getDisposed},
			enable: {value: enable},
			enabled: {enumerable: true, get: getEnabled},
			ensure: {value: ensure},
			ensured: {enumerable: true, get: getEnsured},
			id: {enumerable: true, get: getId},
			onDispose: {value: onDispose},
			onEnable: {value: onEnable},
			onTrigger: {value: onTrigger},
			trigger: {value: trigger}
		});
		// disables this activity
		function disable(value) {
			enabled = arguments.length && !value;
			return activity;
		}
		// disposes this activity
		function dispose() {
			if (disposed) return activity;
			disposed = true;
			enabled = false;
			each(disposers);
			disposers.length = triggers.length = 0;
			return activity;
		}
		// enables or disables this activity depending on truthy of value argument
		function enable(value) {
			validateState();
			enabled = !arguments.length || !!value;
			notify();
			return activity;
		}
		function ensure(value) {
			validateState();
			ensured = !arguments.length || !!value;
			return activity;
		}
		// returns true if this activity has been disposed
		function getDisposed() {
			return disposed;
		}
		// returns true if this activity and all its parents are enabled
		function getEnabled() {
			return enabled && (!parent || parent.enabled);
		}
		// returns true if this activity is ensured
		function getEnsured() {
			return ensured;
		}
		// returns identity of this activity
		function getId() {
			return id;
		}
		// notifies all queued onEnable callbacks if this activity is enabled
		function notify() {
			if (!enabled || !enabled.length) return;
			if (parent && !parent.enabled) parent.onEnable(notify);
			else {
				each(enablers);
				enablers.length = 0;
			}
		}
		// registers callback to be invoked when this activity is being disposed
		// throws error if this activity was alredy disposed
		// callback must be a function
		function onDispose(callback) {
			validateCallback(callback);
			validateState();
			disposers.push(callback);
			return activity;
		}
		// registers callback to be invoked once when this activity is enabled
		// if this activity is already enabled, callback is invoked immediately
		// callback must be a function
		function onEnable(callback) {
			validateCallback(callback);
			validateState();
			if (getEnabled()) callback();
			else {
				if (parent && !enablers.length) parent.onEnable(notify);
				enablers.push(callback);
			}
			return activity;
		}
		// registers callback to be invoked when this activity is triggered
		// callback must be a function
		// fix: unstable trigger may fail others
		function onTrigger(callback) {
			validateCallback(callback);
			validateState();
			triggers.push(callback);
			return activity;
		}
		// triggers registered operations on this activity
		function trigger(message) {
			message = new Message(message, activity);
			if (message.ensured) onEnable(initiate);
			else if (getEnabled()) initiate();
			return activity;
			function initiate() {
				var index = 1, finishing = false;
				next();
				return activity;
				function next(state) {
					if (disposed) return;
					if (state & SKIP) index = 0;
					if (state & FINISH) finishing = true;
					if (isMessage(state)) message = state;
					if (index > 0) triggers[index >= triggers.length ? index = 0 : index++](message, next);
					else if (finishing) dispose();
				}
			}
		}
		function validateState() {
			if (disposed) throw new Error(MESSAGE_DISPOSED);
		}
	}
	// creates channel object
	function Channel(bus, name, parent) {
		var channel = Object.defineProperties(Activity.call(this, bus, parent), {
				name: {enumerable: true, value: name},
				preserve: {value: preserve},
				preserving: {enumerable: true, get: getPreserving},
				publications: {enumerable: true, get: getPublications},
				publish: {value: publish},
				toString: {value: toString},
				subscribe: {value: subscribe},
				subscriptions: {enumerable: true, get: getSubscriptions},
				unsubscribe: {value: unsubscribe}
			}).onDispose(dispose).onTrigger(trigger),
			preserves = [], preserving = 0, publications = [], subscriptions = [];
		publications.indexes = Object.create(null);
		publications.slots = [];
		subscriptions.indexes = Object.create(null);
		subscriptions.slots = [];
		bus.trace('create', 'channel', channel);
		return channel;
		// attaches operation to this channel
		function attach(operation) {
			var collection, index, slots;
			if (isPublication(operation)) collection = publications;
			else if (isSubscription(operation)) collection = subscriptions;
			else throw new Error(MESSAGE_OPERATION);
			index = collection.indexes[operation.id];
			if (isUndefined(index)) {
				slots = collection.slots;
				index = slots.length ? slots.pop() : collection.length++;
				collection[index] = operation;
				operation.attach(channel);
			}
			return channel;
		}
		// detaches operation from this channel
		function detach(operation) {
			var collection, index, slots;
			if (isPublication(operation)) collection = publications;
			else if (isSubscription(operation)) collection = subscriptions;
			else throw new Error(MESSAGE_OPERATION);
			index = collection.indexes[operation.id];
			if (isDefined(index)) {
				collection.slots.push(index);
				collection[index] = undefined;
				operation.detach(channel);
			}
			// todo: dispose if channel does not have preserves, publications and subscriptions and not customized (ensured, disabled)
			return channel;
		}
		function dispose() {
			bus.trace('dispose', 'channel', channel);
			each(publications, detach);
			each(subscriptions, detach);
		}
		function getPreserving() {
			return preserving;
		}
		function getPublications() {
			return slice.call(publications);
		}
		function getSubscriptions() {
			return slice.call(subscriptions);
		}
		// activates or deactivates preservation of publications for this channel
		// when count is true this channel will preserve 9e9 lastest publications
		// when count is a number this channel will preserve corresponding number of lastest publications
		// when count is false or 0 this channel will not preserve publications
		// all preserved publications are authomatically delivered to all new subscriptions to this channel
		function preserve(count) {
			if (!arguments.length || count === true) preserving = 9e9;
			else if (!count) {
				preserving = 0;
				preserves.length = false;
			}
			else {
				validateCount(count);
				preserving = count;
				preserves.splice(0, preserves.length - preserving);
			}
			return channel;
		}
		// creates new publication to this channel
		function publish(data) {
			return attach(new Publication(bus, data));
		}
		function trigger(message, next) {
			if (preserving) {
				preserves.push(message);
				if (preserving < preserves.length) preserves.shift();
			}
			each(subscriptions, 'trigger', message);
			if (parent) parent.trigger(message);
			next();
		}
		// creates subscription to this channel
		// every subscriber must be a function
		function subscribe(subscriber1, subscriber2, subscriberN) {
			if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var subscription = attach(new Subscription(bus, slice.call(arguments)));
			if (preserving) setImmediate(function() {
				each(preserves, subscription.trigger);
			});
			return subscription;
		}
		// returns string representation of this channel
		function toString() {
			return 'channel #' + channel.id + ', "' + name + '"';
		}
		// unsubscribes all subscribers from all subscriptions to this channel
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(subscriptions, 'unsubscribe', slice.call(arguments));
			return channel;
		}
	}
	// creates new message object
	function Message() {
		var data, channel, ensured, error, message = this;
		each(arguments, use);
		return Object.defineProperties(message, {
			channel: {enumerable: true, value: channel},
			data: {enumerable: true, value: data},
			ensured: {enumerable: true, value: ensured},
			error: {enumerable: true, value: error}
		});
		function use(argument) {
			if (isFunction(argument)) data = argument();
			else if (isActivity(argument)) {
				if (argument.ensured) ensured = true;
				if (isChannel(argument)) {
					if (isUndefined(channel)) channel = argument;
				}
			}
			else if (isError(argument)) error = argument;
			else if (isMessage(argument)) {
				channel = argument.channel;
				data = argument.data;
				error = argument.error;
			}
			else data = argument;
		}
	}
	// creates new operation object, abstract base for publications and subscriptions
	function Operation(bus, channels) {
		var operation = Object.create(Activity.call(this, bus), {
				after: {value: after},
				attach: {value: attach},
				channels: {enumerable: true, get: getChannels},
				debounce: {value: debounce},
				delay: {value: delay},
				detach: {value: detach},
				filter: {value: filter},
				map: {value: map},
				once: {value: once},
				skip: {value: skip},
				take: {value: take},
				throttle: {value: throttle},
				unless: {value: unless},
				until: {value: until}
			});
		return operation;
		// pospones this operation till all conditions happen
		// condition can be date, interval or channel
		function after(condition1, condition2, conditionN) {
			// todo: use ensure state for recording
			var count = 0, recordings = [];
			each(arguments, setup);
			return operation.onDispose(dispose).onTrigger(trigger);
			function dispose() {
				recordings = undefined;
			}
			function react() {
				if (--count) return;
				if (operation.ensured) each(recordings);
				recordings = undefined;
			}
			function setup(condition) {
				if (isString(condition)) operation.onDispose(bus(condition).subscribe(react).once().dispose);
				else {
					if (isDate(condition)) return condition = condition.valueOf() - Date.now();
					else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
					if (condition < 0) return;
					var timer = setTimeout(react, condition);
					operation.onDispose(function() {
						clearTimeout(timer);
					});
				}
				count++;
			}
			function trigger(message, next) {
				if (!count) next();
				else if (operation.ensured) recordings.push(next);
			}
		}
		function attach(channel) {
			if (!isChannel(channel)) throw new Error(MESSAGE_CHANNEL);
			if (-1 === channels.indexOf(channel.name)) channels.push(channel.attach(operation));
			return operation;
		}
		// performs this operation once within specified interval between invocation attempts
		// if defer is true this operation will be invoked at the end of interval
		// otherwise this operation will be invoked at the beginning of interval
		// interval must be positive number
		function debounce(interval, defer) {
			var timer;
			validateInterval(interval);
			return operation.onDispose(dispose).onTrigger(defer
				? triggerDeferred
				: triggerImmediate);
			function dispose() {
				clearTimeout(timer);
			}
			function triggerDeferred(message, next) {
				clearTimeout(timer);
				timer = setTimeout(function() {
					timer = undefined;
					next();
				}, interval);
			}
			function triggerImmediate(message, next) {
				if (timer) clearTimeout(timer);
				else next();
				timer = setTimeout(function() {
					timer = undefined;
				}, interval);
			}
		}
		// delays this operation for specified interval
		// interval must be positive number
		function delay(interval) {
			validateInterval(interval);
			var slots = [], timers = [];
			activity.onDispose(dispose).onTrigger(trigger);
			return operation;
			function dispose() {
				each(timers, clearTimeout);
				timers = undefined;
			}
			function trigger(message, next) {
				var index = slots.length ? slots.pop() : timers.length;
				timers[index] = setTimeout(function() {
					slots.push(index);
					next();
				}, interval);
			}
		}
		function detach(channel) {
			if (!isChannel(channel)) throw new Error(MESSAGE_CHANNEL);
			var index = channels.indexOf(channel.name);
			if (-1 !== index) {
				channel.detach(operation);
				channels.splice(index, 1);
				if (!channels.length) operation.dispose();
			}
			return operation;
		}
		// performs this operation only if callback returns trythy value
		function filter(callback) {
			validateCallback(callback);
			return operation.onTrigger(trigger);
			function trigger(message, next, skip) {
				next(callback(message.data, message) ? CONTINUE : SKIP);
			}
		}
		// returns list of channels this operation attached to
		function getChannels() {
			return slice.call(channels);
		}
		// transforms messages being published
		function map(callback) {
			validateCallback(callback);
			return operation.onTrigger(trigger);
			function trigger(message, next) {
				next(new Message(message, callback(message.data, message)));
			}
		}
		// performs this operation only once
		function once() {
			return take(1);
		}
		// skips specified count of attempts to trigger this operation
		function skip(count) {
			validateCount(count);
			return operation.onTrigger(trigger);
			function trigger(message, next) {
				next(--count < 0 ? CONTINUE : SKIP);
			}
		}
		// performs this operation only specified count of times then discards it
		function take(count) {
			validateCount(count);
			return operation.onTrigger(trigger);
			function trigger(message, next) {
				next(--count < 0 ? FINISH : CONTINUE);
			}
		}
		// performs this operation once within specified interval ignoring other attempts
		// interval must be positive number
		function throttle(interval) {
			validateInterval(interval);
			var timer;
			return operation.onDispose(dispose).onTrigger(trigger).persist();
			function dispose() {
				clearTimeout(timer);
			}
			function trigger(message, next) {
				if (!timer) timer = setTimeout(function() {
					timer = undefined;
					next();
				}, interval);
			}
		}
		// perfoms this operation unless callback returns thruthy value then disposes it
		function unless(callback) {
			validateCallback(callback);
			return operation.onTrigger(trigger);
			function trigger(message, next) {
				next(callback(message.data, message) ? BREAK : CONTINUE);
			}
		}
		// performs this operation until all conditions happen
		// a condition can be date, interval or channel name to wait until a publication occurs
		function until(condition1, condition2, conditionN) {
			if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var count = 0;
			each(arguments, setup);
			return count === 0 ? operation.dispose() : operation.persist();
			function await(channel) {
				count++;
				operation.onDispose(bus(channel).subscribe(react).once().dispose);
			}
			function defer(interval) {
				if (interval < 0) return;
				count++;
				var timer = setTimeout(react, interval);
				operation.onDispose(dispose);
				function dispose() {
					clearTimeout(timer);
				}
			}
			function react() {
				if (count-- === 0) operation.dispose();
			}
			function setup(condition) {
				if (isString(condition)) return await(condition);
				if (isDate(condition)) return defer(condition.valueOf() - Date.now());
				if (isNumber(condition)) return defer(condition);
				throw new TypeError(MESSAGE_CONDITION);
			}
		}
	}
	// creates publication object
	function Publication(bus, data) {
		var channels = [],
			message = new Message(data),
			publication = Object.defineProperties(Operation.call(this, bus, channels), {
				data: {enumerable: true, get: getData},
				repeat: {value: repeat},
				toString: {value: toString}
			}).onDispose(dispose).onTrigger(trigger);
		bus.trace('create', 'publication', publication);
		return publication;
		function dispose() {
			bus.trace('dispose', 'publication', publication);
		}
		// returns data bound to this publication
		function getData() {
			return data;
		}
		// repeats this publication every interval with optional message
		// interval must be positive number
		// if message is function, it will be invoked each time
		function repeat(interval) {
			validateInterval(interval);
			interval = setInterval(trigger, interval);
			return operation.onDispose(dispose);
			function dispose() {
				clearInterval(interval);
			}
			function trigger() {
				operation.trigger(message);
			}
		}
		// returns string representation of this subscription
		function toString() {
			return 'publication #' + operation.id + ' (' + channels.join(', ') + ')';
		}
		function trigger(message, next) {
			bus.trace('trigger', 'publication', publication);
			each(channels, 'trigger', message);
			next();
		}
	}
	// creates object with subscription behavior
	function Subscription(bus, subscribers) {
		var channels = [],
			subscription = Object.create(Operation.call(this, bus, channels), {
				subscribers: {enumerable: true, get: getSubscribers},
				toString: {value: toString},
				unsubscribe: {value: unsubscribe}
			}).onDispose(dispose).onTrigger(trigger);
		bus.trace('create', 'subscription', subscription);
		return subscription;
		function dispose() {
			bus.trace('dispose', 'subscription', subscription);
			subscribers.length = 0;
		}
		// returns clone of subscribers array
		function getSubscribers() {
			return slice.call(subscribers);
		}
		// returns string representation of this subscription
		function toString() {
			return 'subscription #' + operation.id + ' (' + channels.join(', ') + ')';
		}
		function trigger(message, next) {
			bus.trace('trigger', 'subscription', subscription);
			each(subscribers, notify);
			next();
			function notify(subscriber) {
				try {
					message.apply(subscriber);
				} catch(e) {
					var error = bus.error;
					if (channel === error) throw e;
					error.trigger(new Message(message, e));
				}
			}
		}
		// unsubscribes all specified subscribers from this subscription
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(arguments, function(subscriber) {
				var index = subscribers.indexOf(subscriber);
				if (-1 !== index) subscribers.splice(index, 1);
			});
			if (!subscribers.length) operation.dispose();
		}
	}
	// exports message bus as singleton
	if ('object' === typeof module && module.exports) module.exports = create();
	else global.aerobus = create();
})(this);
