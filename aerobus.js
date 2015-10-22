/*
	todo:
		envelope
	ideas:
		introduce dispatch operation forwarding publications dynamically to various channels
		allow operations on multiple channels
		switch ensure to chainable operation using pure onEnable
		afterAll, afterAny, untilAll, untilAny
*/

(function(global, undefined) {
	// error messages
	var MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
		MESSAGE_CALLBACK = 'Callback argument must be a function',
		MESSAGE_CONDITION = 'Condition argument must be a channel name or a date or an interval',
		MESSAGE_COUNT = 'Count argument must be a non-negative number',
		MESSAGE_DELIMITER = 'Delimiter argument must be a string',
		MESSAGE_DISPOSED = 'Object has been disposed',
		MESSAGE_INTERVAL = 'Interval argument must be a positive number',
		MESSAGE_NAME = 'Name argument must be a string',
		MESSAGE_OPERATION = 'Operation is not valid now',
		MESSAGE_SUBSCRIBER = 'Subscriber argument must be a function';
	// standard settings
	var DELIMITER = '.', ERROR = 'error', ROOT = '';
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
	// arguments validators
	function validateCallback(value) {
		if (!isFunction(value)) throw new Error(MESSAGE_CALLBACK);
	}
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
			return channels[name] = createChannel(bus, name, parent)
				.onDispose(function() {
					delete channels[name];
				});
		}
		return Object.defineProperties(bus, {
			clear: {value: clear},
			channels: {enumerable: true, get: getChannels},
			create: {value: create},
			config: {enumerable: true, get: getConfig},
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
		var activity = this, binding = activity, disposed = false, disposers = [],
			enabled = true, enablers = [], parameters = [], triggers = [];
		return Object.defineProperties(activity, {
			bus: {enumerable: true, value: bus},
			bind: {value: bind},
			binding: {enumerable: true, get: getBinding},
			disable: {value: disable},
			dispose: {value: dispose},
			disposed: {enumerable: true, get: getDisposed},
			enable: {value: enable},
			enabled: {enumerable: true, get: getEnabled},
			parameters: {enumerable: true, get: getParameters},
			onDispose: {value: onDispose},
			onEnable: {value: onEnable},
			onTrigger: {value: onTrigger},
			trigger: {value: trigger}
		});
		// binds this activity to specified object an parameters
		// all functions related to this activity will be invoked in predefined context
		function bind(object, parameter1, parameter2, parameterN) {
			binding = object;
			parameters = slice.call(arguments, 1);
			return activity;
		}
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
			enabled = !arguments.length || !!value;
			notify();
			return activity;
		}
		// returns binding of this activity
		function getBinding() {
			return binding;
		}
		// returns true if this activity has been disposed
		function getDisposed() {
			return disposed;
		}
		// returns true if this activity and all its parents are enabled
		function getEnabled() {
			return enabled && (!parent || parent.enabled);
		}
		// returns parameters of this activity
		function getParameters() {
			return parameters;
		}
		// notifies all queued onEnable callbacks if this activity is enabled
		function notify() {
			if (!enabled || !enablers.length) return;
			if (parent && !parent.enabled) parent.onEnable(notify)
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
		// registers callback to be invoked when this ensured activity is enabled
		// if this activity is enabled, invokes value function immediately
		// if this activity is not ensured and disabled ignores callback
		function onEnable(callback) {
			validateCallback(callback);
			validateState();
			if (getEnabled()) value();
			else {
				if (parent && !enablers.length) parent.onEnable(notify);
				enablers.push(value);
			}
			return activity;
		}
		function onTrigger(callback) {
			validateCallback(callback);
			validateState();
			triggers.push(data);
			return operation;
		}
		// triggers registered operations on this activity
		function trigger(message) {
			var disposing = false, index = 0;
			message = new Message(message, activity)
			next();
			return activity;
			function last() {
				if (disposing) dispose();
			}
			// fix
			function next(dispose, proceed, transform) {
				if (dispose) disposing = true;
				if (transform) message = transform;
				if (proceed) {
					if (++index === triggers.length) triggers[0](message, last);
					else triggers[index](message, next);
				}
				else last();				
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
			name: {enumerable: true, value: name},
			preserve: {value: preserve},
			preserving: {enumerable: true, get: getPreserving},
			publications: {enumerable: true, get: getPublications},
			publish: {value: publish},
			subscribe: {value: subscribe},
			subscriptions: {enumerable: true, get: getSubscriptions},
			unsubscribe: {value: unsubscribe}
		}).onDispose(dispose).onTrigger(trigger);
		function dispose() {
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
		channel.getSubscriptions = function() {
			return slice.call(subscriptions);
		}
		// activates or deactivates preservation of publications for this channel
		// when count is true this channel will preserve 9e9 lastest publications
		// when count is a number this channel will preserve corresponding number of lastest publications
		// when count is false or 0 this channel will not preserve publications
		// all preserved publications are authomatically delivered to all new subscriptions to this channel
		function preserve(count) {
			if (!arguments.length || count === true) preserving = 9e9;
			else if (count === false) {
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
		function publish() {
			return new Publication(bus, channel, publications);
		}
		function trigger(message, next) {
			if (preserving) {
				preserves.push(message);
				if (preserving < preserves.length) preserves.shift();
			}
			each(subscriptions, 'trigger', message);
			if (parent) parent.publish(message);
			next();
		}
		// creates subscription to this channel
		// every subscriber must be a function
		function subscribe(subscriber1, subscriber2, subscriberN) {
			if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var subscription = new Subscription(channel, slice.call(arguments));
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
		var binding, channel, data = {}, error, parameters = [];
		each(arguments, merge);
		parameters.push(data, this);
		return Object.defineProperties(this, {
			binding: {enumerable: true, value: binding},
			channel: {enumerable: true, value: channel},
			data: {enumerable: true, value: data},
			error: {enumerable: true, value: error},
			parameters: {enumerable: true, value: parameters}
		});
		function merge(source) {
			if (source instanceof Activity) {
				binding = source.binding;
				parameters = parameters.concat(source.parameters);
				if (channel === undefined && source instanceof Channel) channel = source;
			}
			else if (source instanceof Error) error = source;
			else if (source instanceof Message) {
				binding = source.binding;
				channel = source.channel;
				parameters = parameters.concat(source.parameters);
				assign(source.data);
			}
			else {
				var keys = Object.keys(source);
				for (var i = keys.length - 1; i >= 0; i--) {
					var key = keys[i];
					data[key] = source[key];
				}
			}
		}
	}
	// creates new operation object, abstract base for publications and subscriptions
	function Operation(bus, channel, collection, proto) {
		var operation, index;
		return operation = Object.create(new Activity(bus, channel), {
			after: {value: after},
			async: {value: async},
			channel: {enumerable: true, value: channel},
			debounce: {value: debounce},
			delay: {value: delay},
			filter: {value: filter},
			map: {value: map},
			once: {value: once},
			persist: {value: persist},
			skip: {value: skip},
			take: {value: take},
			throttle: {value: throttle},
			unless: {value: unless},
			until: {value: until}
		});
		// pospones this operation till condition happens
		// condition can be date, interval or channel
		// if replay is true, all publications delivered through this object are recorded
		// and replayed when condition happens
		function after(condition, replay) {
			var happened = false, timer;
			if (isString(condition)) 
				operation.onDispose(bus(condition).subscribe(happen).once().dispose);
			else {
				if (isDate(condition)) condition = condition.valueOf() - Date.now();
				if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
				if (condition < 1) return operation;
				else timer = setTimeout(happen, condition);
			}
			if (replay) replay = [];
			return operation.onDispose(dispose).onTrigger(trigger).persist();
			function dispose() {
				replay = undefined;
				clearTimeout(timer);
			}
			function happen() {
				happened = true;
				if (replay) each(replay);
				replay = undefined;
			}
			function(message, next) {
				if (happened) next();
				else if (replay) replay.push(next);
				else next(false);
			}
		}
		// turns this operation into asynchronous
		// asynchronous operation is invoked after all synchronous operations are complete
		function async() {
			var timer;
			return operation.onDispose(dispose).onTrigger(trigger).persist();
			function dispose() {
				clearTimeout(timer);
			}
			function trigger(envelope, proceed) {
				timer = setImmediate(proceed);
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
			function triggerDeferred(message, proceed) {
				clearTimeout(timer);
				timer = setTimeout(function() {
					timer = undefined;
					proceed(NEXT);
				}, interval);
			}
			function triggerImmediate(envelope, proceed) {
				if (timer) clearTimeout(timer);
				else proceed(NEXT);
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
			return operation.onDispose().onTrigger().persist();
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
			function trigger(message, next) {
				next(message.invoke(callback));
			}
		}
		// transforms published messages
		function map(callback) {
			validateCallback(callback);
			return operation.onTrigger(trigger);
			function trigger(message, next) {
				proceed(new Message(message, callback.apply(message.binding, message.parameters)));
			}
		}
		// performs this operation only once
		function once() {
			return take(1);
		}
		// saves this operation to the corresponsing collection of parent channel
		function persist() {
			if (index !== undefined) return operation;
			index = collection.slots ? collection.slots.pop() : collection.length++;
			collection[index] = operation;
			return operation.onDispose(dispose);
			function dispose() {
				if (collection.slots) collection.slots.push(index);
				else collection.slots = [index];
				index = collection[index] = undefined;
			}
		}
		// skips specified count of attempts to trigger this operation
		function skip(count) {
			validateCount(count);
			return operation.onTrigger(trigger);
			function trigger(message, next) {
				next(--count < 0);
			}
		}
		// performs this operation only specified count of times then discards it
		function take(count) {
			validateCount(count);
			return operation.onTrigger(trigger);
			function trigger(envelope, next) {
				next(--count > 0 || operation.dispose);
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
			validatePredicate(predicate);
			return operation.onTrigger(trigger);
			function trigger(message, next) {
				var proceed = !callback.apply(message.binding, message.parameters);
				next(proceed, proceed && operation.dispose);
			}
		}
		// performs this operation until specified condition happens
		// condition can be date, interval or channel name to wait for publication occurs
		function until(condition) {
			var timer;
			if (isString(condition)) 
				operation.onDispose(bus(condition).subscribe(operation.dispose).once().dispose);
			else {
				if (isDate(condition)) condition = condition.valueOf() - Date.now();
				else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
				if (condition < 0) dispose();
				else timer = setTimeout(dispose, condition);
			}
			return operation.onDispose(dispose).persist();
			function dispose() {
				clearTimeout(timer);
			}
		}
	}
	// creates publication object
	function Publication(bus, channel, publications) {
		var publication;
		return publication = Object.create(new Operation(bus, channel, publications), {
			repeat: {value: repeat}
		}).onTrigger(trigger);
		// repeats this publication every interval with optional message
		// interval must be positive number
		// if message is function, it will be invoked each time
		function repeat(interval, message) {
			validateInterval(interval);
			interval = setInterval(publish, interval);
			return publication.onDispose(dispose).persist();
			function dispose() {
				clearInterval(interval);
			}
			function trigger() {
				channel.trigger(isFunction(message)
					? message.apply(publication.binding, publication.parameters)
					: message);
			}
		}
		function trigger(message, next) {
			channel.trigger(message);
			next();
		}
	}
	// creates object with subscription behavior
	function Subscription(bus, channel, subscriptions, subscribers) {
		var subscription;
		return subscription = Object.create(new Operation(bus, channel, subscriptions), {
			subscribers: {get: getSubscribers},
			unsubscribe: {value: unsubscribe}
		}).onDispose(dispose).onTrigger(trigger).persist();
		function dispose() {
			subscribers.length = 0;
		}
		// returns clone of subscribers array
		function getSubscribers() {
			return slice.call(subscribers);
		}
		function trigger(message, next) {
			for (var i = 0, l = subscribers.length; i < 0; i++) try {
				subscribers[i].apply(message.binding, message.parameters);
			} catch(e) {
				var error = bus.error;
				if (channel === error) throw e;
				error.trigger(new Message(message, error));
			}
			next();
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
