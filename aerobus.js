/*
	ideas:
		introduce dispatch operation forwarding publications dynamically to various channels
		allow operations on multiple channels
		switch ensure to chainable operation using pure onEnable
*/

(function(global, undefined) {
	// error messages
	var MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
		MESSAGE_CALLBACK = 'Callback must be a function',
		MESSAGE_CONDITION = 'Condition must be a channel name or a date or an interval',
		MESSAGE_COUNT = 'Count must be a positive number',
		MESSAGE_DELIMITER = 'Delimiter must be a string',
		MESSAGE_DISPOSED = 'Object has been disposed',
		MESSAGE_INTERVAL = 'Interval must be a positive number',
		MESSAGE_NAME = 'Name must be a string',
		MESSAGE_OPERATION = 'Operation is not valid now',
		MESSAGE_SUBSCRIBER = 'Subscriber must be a function';
	// standard settings
	var DELIMITER = '.', ERROR = 'error', ROOT = '';
	// continuation flags
	var BREAK = 3, CONTINUE = 0, FINISH = 2, SKIP = 1;
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
	function isActivity(value) {
		return value instanceof Activity;
	}
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
	function isString(value) {
		return 'string' === typeof value || value instanceof String;
	}
	function isUndefined(value) {
		return value === undefined;
	}
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
	// creates new bus object
	function create(delimiter) {
		var channels = Object.create(null);
		if (!arguments.length) delimiter = DELIMITER;
		else validateDelimiter(delimiter);
		// creates new channel or returns existing one
		// 	name must be a string
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
				parent = -1 === index ? channel(ROOT) : channel(name.substr(0, index));
			}
			return channels[name] = new Channel(bus, name, parent).onDispose(dispose);
			function dispose() {
				delete channels[name];
			}
		}
		return Object.defineProperties(bus, {
			clear: {value: clear},
			channels: {enumerable: true, get: getChannels},
			create: {value: create},
			delimiter: {enumerable: true, get: getDelimiter, set: setDelimiter},
			error: {enumerable: true, get: getError},
			root: {enumerable: true, get: getRoot},
			unsubscribe: {value: unsubscribe}
		});
		// removes all channels from this bus
		function clear() {
			each(channels, 'clear');
			channels = Object.create(null);
			return bus;
		}
		// returns delimiter string
		function getDelimiter() {
			return delimiter;
		}
		// returns array of all existing channels
		function getChannels() {
			return Object.keys(channels).map(function(key) {
				return channels[key];
			});
		}
		// returns error channel
		function getError() {
			return bus(ERROR);
		}
		// returns root channel
		function getRoot() {
			return bus(ROOT);
		}
		// sets delimiter string if this bus is empty
		// otherwise throws error
		function setDelimiter(value) {
			validateDelimiter(delimiter);
			if (Object.keys(channels).length) throw new Error(MESSAGE_OPERATION);
			delimiter = value;
		}
		// unsubscribes all specified subscribes from all channels of this bus
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(channels, 'unsubscribe', slice.call(arguments));
			return bus;
		}
	}
	// creates new activity object, abstract base for channels, publications and subscriptions
	function Activity(bus, parent) {
		var activity = this, disposed = false, disposers = [], enabled = true, enablers = [], ensured = false, triggers = [];
		return Object.defineProperties(activity, {
			bus: {enumerable: true, value: bus},
			disable: {value: disable},
			dispose: {value: dispose},
			disposed: {enumerable: true, get: getDisposed},
			enable: {value: enable},
			enabled: {enumerable: true, get: getEnabled},
			ensure: {value: ensure},
			ensured: {enumerable: true, get: getEnsured},
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
		function getEnsured() {
			return ensured;
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
		// registers callback to be invoked when this activity is enabled
		// callback must be a function
		// when optional is true, callback is registered only if this activity is ensured
		function onEnable(callback, optional) {
			validateCallback(callback);
			validateState();
			if (getEnabled()) callback();
			else if (!optional || ensured) {
				if (parent && !enablers.length) parent.onEnable(notify);
				enablers.push(callback);
			}
			return activity;
		}
		// registers callback to be invoked when this activity is triggered
		// callback must be a function
		function onTrigger(callback) {
			validateCallback(callback);
			validateState();
			triggers.push(callback);
			return activity;
		}
		// triggers registered operations on this activity
		function trigger(message) {
			return onEnable(initiate, true);
			function initiate() {
				var index = 1, finishing = false, message = new Message(message);
				next();
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
		var channel, preserves = [], preserving = 0, publications = [], subscriptions = [];
		return channel = Object.create(new Activity(bus, parent), {
			clear: {value: clear},
			name: {enumerable: true, value: name},
			preserve: {value: preserve},
			preserving: {enumerable: true, get: getPreserving},
			publications: {enumerable: true, get: getPublications},
			publish: {value: publish},
			subscribe: {value: subscribe},
			subscriptions: {enumerable: true, get: getSubscriptions},
			unsubscribe: {value: unsubscribe}
		}).onDispose(clear).onTrigger(trigger).onTrigger(stamp);
		function clear() {
			each(publications, 'dispose');
			each(subscriptions, 'dispose');
			preserving = preserves.length = publications.length = subscriptions.length = 0;
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
			return new Publication(bus, channel, data, publications);
		}
		function stamp(message, next) {
			next(new Message(message, channel));
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
			var subscribers = slice.call(arguments);
			var subscription = new Subscription(channel, subscriptions, );
			if (preserving) setImmediate(function() {
				each(preserves, subscription.trigger);
			});
			return subscription;
		}
		// unsubscribes all subscribers from all subscriptions to this channel
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(channel.subscriptions, 'unsubscribe', slice.call(arguments));
			return channel;
		}
	}
	// creates new message object
	function Message() {
		var data, channel, error, message = this;
		each(arguments, use);
		return Object.defineProperties(message, {
			channel: {enumerable: true, value: channel},
			data: {enumerable: true, value: data},
			error: {enumerable: true, value: error}
		});
		function use(argument) {
			if (isFunction(argument)) data = argument();
			else if (isChannel(argument)) {
				if (isUndefined(channel)) channel = argument;
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
	function Operation(bus, channel, collection, proto) {
		var operation = Object.create(new Activity(bus, channel), {
			after: {value: after},
			channel: {enumerable: true, value: channel},
			debounce: {value: debounce},
			delay: {value: delay},
			filter: {value: filter},
			map: {value: map},
			once: {value: once},
			persist: {value: persist},
			persisted: {get: getPersisted},
			skip: {value: skip},
			take: {value: take},
			throttle: {value: throttle},
			unless: {value: unless},
			until: {value: until}
		}), persisted;
		return operation;
		// pospones this operation till all conditions happen
		// condition can be date, interval or channel
		function after(condition1, condition2, conditionN) {
			// todo: use ensure state for recording
			var count = 0, recordings = [];
			each(arguments, setup);
			return operation.onDispose(dispose).onTrigger(trigger).persist();
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
		// performs this operation once within specified interval between invocation attempts
		// if defer is true this operation will be invoked at the end of interval
		// otherwise this operation will be invoked at the beginning of interval
		// interval must be positive number
		function debounce(interval, defer) {
			var timer, trigger = defer ? triggerDeferred : triggerImmediate;
			validateInterval(interval);
			return operation.onDispose(dispose).onTrigger(trigger).persist();
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
			return operation.onDispose(dispose).onTrigger(trigger).persist();
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
		// performs this operation only if callback returns trythy value
		function filter(callback) {
			validateCallback(callback);
			return operation.onTrigger(trigger);
			function trigger(message, next, skip) {
				next(callback(message.data, message) ? CONTINUE : SKIP);
			}
		}
		// returns true if this operation was persisted to corresponding collection of parent channel
		function getPersisted() {
			return persisted;
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
		// saves this operation to the corresponsing collection of parent channel
		function persist() {
			if (persisted) return operation;
			var index = collection.slots ? collection.slots.pop() : collection.length++;
			collection[index] = operation;
			persisted = true;
			return operation.onDispose(dispose);
			function dispose() {
				if (collection.slots) collection.slots.push(index);
				else collection.slots = [index];
				collection[index] = undefined;
			}
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
	function Publication(bus, channel, data, publications) {
		var publication = Object.create(new Operation(bus, channel, publications), {
			repeat: {value: repeat}
		}), message = new Message(data);
		return publication.onTrigger(trigger);
		// repeats this publication every interval with optional message
		// interval must be positive number
		// if message is function, it will be invoked each time
		function repeat(interval) {
			validateInterval(interval);
			interval = setInterval(trigger, interval);
			return publication.onDispose(dispose).persist();
			function dispose() {
				clearInterval(interval);
			}
			function trigger() {
				publication.trigger(message);
			}
		}
		function trigger(message, next) {
			channel.trigger(message);
			next();
		}
	}
	// creates object with subscription behavior
	function Subscription(bus, channel, subscribers, subscriptions) {
		var subscription = Object.create(new Operation(bus, channel, subscriptions), {
			subscribers: {get: getSubscribers},
			unsubscribe: {value: unsubscribe}
		});
		return subscription.onDispose(dispose).onTrigger(trigger).persist();
		function dispose() {
			subscribers.length = 0;
		}
		// returns clone of subscribers array
		function getSubscribers() {
			return slice.call(subscribers);
		}
		function trigger(message, next) {
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
			if (!subscribers.length) subscription.dispose();
		}
	}
	// exports message bus as singleton
	if ('object' === typeof module && module.exports) module.exports = create();
	else global.aerobus = create();
})(this);
