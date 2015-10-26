/*
	var bus = aerobus(console.log.bind(console, '%s %s #%i %O'));

	ideas:
		dispose channel when it isn't needed anymore
		channel.forward - 
			static - accepts channel name 
			dynamic - accepts callback resolving channel name
		channel.zip
			zips publications from several channels and combine them via callback passing as array
			triggers combined publication to self

		subscriptions priority
		publication cancellation via 'return false'
		buffer, distinct(untilChanged), randomize/reduce/sort until finished, whilst? operators
		request - reponse pattern
		subscription.subscribe method
		after operator is not consistent with multichannel subscriptions
		multichannel subscriptions are not consistent with other multichannel operations
			multichannel subscriptions implies logical OR
			multichannel publication implies logical AND
			multichannel enable/disable implies logical AND
			after implies logical AND

		subscription/publication/multichannel strategies: cycle | random | serial | parallel | waterfall
*/

(function(host, undefined) {
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
	var create = Object.create, defineProperties = Object.defineProperties, defineProperty = Object.defineProperty, keys = Object.keys,
		isArray = Array.isArray, map = Array.prototype.map, slice = Array.prototype.slice,
		// todo: use process.nextTick in node env: https://github.com/caolan/async/blob/master/lib/async.js#L190
		setImmediate = host.setImmediate, setTimeout = host.setTimeout;
	// polyfill for setImmediate
	if (!setImmediate) setImmediate = function(handler) {
		return setTimeout(handler, 0);
	};
	// invokes handler for each item of collection (array or enumerable object)
	// handler can be function or name of item's method
	function each(collection, handler, parameters) {
		var invoker;
		if (1 === arguments.length) invoker = invokeSelf;
		else if (isString(handler)) invoker = invokeProperty;
		else if (isArray(handler)) {
			invoker = invokeSelf;
			parameters = handler;
		}
		else invoker = handler;
		if (isNumber(collection.length)) eachItem();
		else eachKey();
		function invokeProperty(item) {
			item[handler].apply(item, slice.call(arguments, 1));
		}
		function invokeSelf(item) {
			item.apply(undefined, slice.call(arguments, 1));
		}
		function eachItem() {
			for (var i = 0, l = collection.length; i < l; i++) {
				var item = collection[i];
				if (isDefined(item)) invoker.apply(undefined, [item].concat(parameters));
			}
		}
		function eachKey() {
			for (var key in collection) {
				var item = collection[key];
				if (isDefined(item)) invoker.apply(undefined, [item].concat(parameters));
			}
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
	// utility functions
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
	function validateDisposable(value) {
		if (value.disposed) throw new Error(MESSAGE_DISPOSED);
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
	function aerobus(delimiter, trace) {
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
			if (1 < arguments.length) return new Domain(bus, map.call(arguments, function(name) {
				return bus(name);
			}));
			var channel = channels[name];
			if (channel) return channel;
			var parent;
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
		trace('create', 'bus', id, bus);
		return defineProperties(bus, {
			clear: {value: clear},
			channels: {enumerable: true, get: getChannels},
			create: {value: aerobus},
			delimiter: {enumerable: true, get: getDelimiter, set: setDelimiter},
			error: {enumerable: true, get: getError},
			id: {enumerable: true, get: getId},
			root: {enumerable: true, get: getRoot},
			trace: {get: getTrace, set: setTrace},
			unsubscribe: {value: unsubscribe}
		});
		// empties this bus
		function clear() {
			each(channels, 'dispose');
			init();
			return bus;
		}
		// returns array of all existing channels
		function getChannels() {
			return keys(channels).map(function(key) {
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
			channels = create(null);
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
		// unsubscribes all specified subscribes from all channels of this bus
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(channels, 'unsubscribe', slice.call(arguments));
			return bus;
		}
	}
	// creates new activity object, abstract base for channels, publications and subscriptions
	function Activity(bus, parent, type) {
		var activity = this, disposed = false, disposers = [], enabled = true,
			enablers = [], ensured = false, id = ++identity, triggers = [];
		bus.trace('create', type, id, activity);
		return defineProperties(activity, {
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
			trigger: {value: trigger},
			type: {enumerable: true, get: getType}
		});
		// disables this activity
		function disable(value) {
			validateDisposable(activity);
			value = !arguments.length || !!value;
			if (enabled) {
				bus.trace('disable', type, id, activity);
				enabled = false;
				notify();
			}
			return activity;
		}
		// disposes this activity
		function dispose() {
			if (!disposed) {
				bus.trace('dispose', type, id, activity);
				disposed = true;
				enabled = false;
				each(disposers);
				disposers.length = enablers.length = triggers.length = 0;
			}
			return activity;
		}
		// enables this activity
		function enable() {
			validateDisposable(activity);
			if (!enabled) {
				bus.trace('enable', type, id, activity);
				enabled = true;
				notify();
			}
			return activity;
		}
		function ensure() {
			validateDisposable(activity);
			if (!ensured) {
				bus.trace('ensure', type, id, activity);
				ensured = true;
			}
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
			return ensured  && (!parent || parent.ensured);
		}
		// returns identity of this activity
		function getId() {
			return id;
		}
		// returns type string of this activity
		function getType() {
			return type;
		}
		function notify() {
			if (!enabled) return;
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
			if (disposed) callback();
			else disposers.push(callback);
			return activity;
		}
		// registers callback to be invoked once when this activity is enabled
		// callback must be a function
		function onEnable(callback) {
			validateDisposable(activity);
			validateCallback(callback);
			if (getEnabled()) callback();
			else {
				if (!enablers.length && parent) parent.onEnable(notify);
				enablers.push(callback);
			}
			return activity;
		}
		// registers callback to be invoked when this activity is triggered
		// callback must be a function
		// fix: unstable trigger may fail others
		function onTrigger(callback) {
			validateDisposable(activity);
			validateCallback(callback);
			triggers.push(callback);
			return activity;
		}
		// triggers registered operations on this activity
		function trigger(data) {
			validateDisposable(activity);
			var message = new Message(data, activity);
			bus.trace('trigger', type, id, activity, message);
			if (getEnabled()) initiate();
			else if (message.ensured) {
				if (!enablers.length && parent) parent.onEnable(initiate);
				enablers.push(initiate);
			}
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
	}
	// creates channel object
	function Channel(bus, name, parent) {
		var channel = Activity.call(this, bus, parent, 'channel'), preserves = [], preserving = 0, publications = [], subscriptions = [];
		// todo: extract utility class for hybrid collection support
		publications.indexes = create(null);
		publications.slots = [];
		subscriptions.indexes = create(null);
		subscriptions.slots = [];
		if (parent) defineProperty(channel, 'parent', {enumerable: true, get: getParent});
		return defineProperties(channel, {
			attach: {value: attach},
			detach: {value: detach},
			name: {enumerable: true, value: name},
			preserve: {value: preserve},
			preserving: {enumerable: true, get: getPreserving},
			publications: {enumerable: true, get: getPublications},
			publish: {value: publish},
			subscribe: {value: subscribe},
			subscriptions: {enumerable: true, get: getSubscriptions},
			toString: {value: toString},
			unsubscribe: {value: unsubscribe}
		}).onDispose(dispose).onTrigger(trigger);
		// attaches operation to this channel
		function attach(operation) {
			var collection, index, slots;
			if (isPublication(operation)) collection = publications;
			else if (isSubscription(operation)) collection = subscriptions;
			else throw new Error(MESSAGE_OPERATION);
			index = collection.indexes[operation.id];
			if (isUndefined(index)) {
				slots = collection.slots;
				index = collection.indexes[operation.id] = slots.length
					? slots.pop()
					: collection.length++;
				collection[index] = operation;
				operation.attach(channel);
				if (preserving && isSubscription(operation)) setImmediate(deliver);
			}
			return channel;
			function deliver() {
				each(preserves, operation.trigger);
			}
		}
		// detaches operation from this channel
		function detach(operation) {
			var collection, index;
			if (isPublication(operation)) collection = publications;
			else if (isSubscription(operation)) collection = subscriptions;
			else throw new Error(MESSAGE_OPERATION);
			index = collection.indexes[operation.id];
			if (isDefined(index)) {
				collection.slots.push(index);
				collection[index] = undefined;
				delete collection.indexes[operation.id];
				operation.detach(channel);
			}
			return channel;
		}
		function dispose() {
			each(publications, detach);
			each(subscriptions, detach);
		}
		// returns parent object of this activity
		function getParent() {
			return parent;
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
				preserves.length = 0;
			}
			else {
				validateCount(count);
				preserving = count;
				preserves.splice(0, preserves.length - preserving);
			}
			bus.trace('preserve', 'channel', channel.id, channel, count);
			return channel;
		}
		// publishes data to this channel immediately or creates new publication if no data present
		function publish(data) {
			return arguments.length
				? channel.trigger(data)
				: new Publication(bus).attach(channel);
		}
		function toString() {
			return channel.type + ' #' + channel.id + ' ' + channel.name;
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
			return new Subscription(bus, slice.call(arguments)).attach(channel);
		}
		// unsubscribes all subscribers from all subscriptions to this channel
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(subscriptions, 'unsubscribe', slice.call(arguments));
			return channel;
		}
	}
	function Domain(bus, channels) {
		var domain = this;
		return defineProperties(domain, {
			disable: {value: disable},
			enable: {value: enable},
			ensure: {value: ensure},
			preserve: {value: preserve},
			publish: {value: publish},
			subscribe: {value: subscribe},
			unsubscribe: {value: unsubscribe}
		});
		function disable() {
			each(channels, 'disable');
			return domain;
		}
		function enable(value) {
			each(channels, 'enable', value);
			return domain;
		}
		function ensure(value) {
			each(channels, 'ensure', value);
			return domain;
		}
		function preserve(count) {
			each(channels, 'preserve', count);
			return domain;
		}
		// creates new publication to all channels in this domain
		function publish(data) {
			if (arguments.length) {
				each(channels, 'trigger', data);
				return domain;
			}
			else {
				var publication = new Publication(bus);
				each(channels, 'attach', publication);
				return publication;
			}
		}
		// creates subscription to all channels in this domain
		// every subscriber must be a function
		function subscribe(subscriber1, subscriber2, subscriberN) {
			if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var subscription = new Subscription(bus, slice.call(arguments));
			each(channels, 'attach', subscription);
			return subscription;
		}
		// unsubscribes all subscribers from all channels in this domain
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(channels, 'unsubscribe', slice.call(arguments));
			return domain;
		}
	}
	// creates new message object
	function Message() {
		var data, destination, ensured = false, error, origin;
		each(arguments, use);
		if (error) defineProperty(this, 'error', {enumerable: true, value: error});
		return defineProperties(this, {
			data: {enumerable: true, value: data},
			destination: {enumerable: true, value: destination},
			ensured: {enumerable: true, value: ensured},
			origin: {enumerable: true, value: origin}
		});
		function use(argument) {
			if (isChannel(argument)) {
				destination = argument.name;
				if (argument.ensured) ensured = true;
				if (isUndefined(origin)) origin = argument.name;
			}
			else if (isFunction(argument)) data = argument();
			else if (isError(argument)) error = argument;
			else if (isMessage(argument)) {
				destination = argument.destination;
				data = argument.data;
				error = argument.error;
				origin = argument.origin;
			}
			else if (isPublication(argument) || isSubscription(argument)) {
				if (argument.ensured) ensured = true;
			}
			else data = argument;
		}
	}
	// creates new operation object, abstract base for publications and subscriptions
	function Operation(bus, channels, type) {
		var operation = Activity.call(this, bus, undefined, type);
		return defineProperties(operation, {
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
		}).onDispose(dispose);
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
			if (-1 === channels.indexOf(channel)) {
				bus.trace('attach', operation.type, operation.id, operation, channel);
				channels.push(channel);
				channel.attach(operation);
			}
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
			operation.onDispose(dispose).onTrigger(trigger);
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
			var index = channels.indexOf(channel);
			if (-1 !== index) {
				bus.trace('detach', operation.type, operation.id, operation, channel);
				channels.splice(index, 1);
				channel.detach(operation);
				if (!channels.length) operation.dispose();
			}
			return operation;
		}
		function dispose() {
			each(channels, 'detach', operation);
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
				next(--count < 1 ? FINISH : CONTINUE);
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
	function Publication(bus) {
		var channels = [], publication = Operation.call(this, bus, channels, 'publication');
		return defineProperties(publication, {
			data: {enumerable: true, get: getData},
			repeat: {value: repeat}
		}).onTrigger(trigger);
		// returns data bound to this publication
		function getData() {
			return data;
		}
		// repeats this publication every interval with optional message
		// interval must be positive number
		// if message is function, it will be invoked each time
		function repeat(data, interval) {
			if (1 === arguments.length) interval = data;
			validateInterval(interval);
			interval = setInterval(trigger, interval);
			return publication.onDispose(dispose);
			function dispose() {
				clearInterval(interval);
			}
			function trigger() {
				publication.trigger(data);
			}
		}
		function trigger(message, next) {
			each(channels, 'trigger', message);
			next();
		}
	}
	// creates object with subscription behavior
	function Subscription(bus, subscribers) {
		each(subscribers, validateSubscriber);
		var channels = [], subscription = Operation.call(this, bus, channels, 'subscription');
		return defineProperties(subscription, {
			subscribers: {enumerable: true, get: getSubscribers},
			unsubscribe: {value: unsubscribe}
		}).onDispose(dispose).onTrigger(trigger);
		function dispose() {
			subscribers.length = 0;
		}
		// returns clone of subscribers array
		function getSubscribers() {
			return slice.call(subscribers);
		}
		function trigger(message, next) {
			each(subscribers, deliver);
			next();
			function deliver(subscriber) {
				if (ERROR === message.destination) subscriber(message.error, message);
				else try {
					subscriber(message.data, message);
				} catch(error) {
					bus.error.trigger(new Message(message, error));
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
	if ('object' === typeof module && module.exports) module.exports = aerobus;
	else host.aerobus = aerobus;
})(this);
