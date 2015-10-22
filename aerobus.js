/*
	todo:
		onEnsure, onTrigger, onDispose
		envelope
		allow operations on multiple channels
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
	// workflow commands
	var DONE = 2, NEXT = 0, SKIP = 1;
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
			if (!arguments.length) return channel(ROOT);
			// todo: multiple channels wrapper
			if (1 < arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			var parent = null;
			if (name !== ROOT && name !== ERROR) {
				validateName(name);
				var index = name.indexOf(delimiter);
				parent = -1 === index ? channel(ROOT) : channel(name.substr(0, index));
			}
			return channels[name] || (channels[name] = createChannel(bus, name, parent));
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
			enabled = true, enablers = [], ensured = false, parameters = [];
		return Object.defineProperties(activity, {
			bus: {enumerable: true, value: bus},
			bind: {value: bind},
			binding: {enumerable: true, get: getBinding},
			disable: {value: disable},
			dispose: {value: dispose},
			disposed: {enumerable: true, get: getDisposed},
			enable: {value: enable},
			enabled: {enumerable: true, get: getEnabled},
			ensure: {value: ensure},
			ensured: {enumerable: true, get: getEnsured},
			parameters: {enumerable: true, get: getParameters},
			onDispose: {value: onDispose},
			onEnable: {value: onEnable}
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
			if (isNumber(index)) {
				if (collection.slots) collection.slots.push(index);
				else collection.slots = [index];
				index = collection[index] = undefined;
			}
			operation.disable();
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
		// ensures this activity will or will not perform all operations after it is enabled depending on truthy of value argument
		function ensure(value) {
			ensured = !!value;
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
		// returns true if this activity is ensured
		function getEnsured() {
			return ensured;
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
			if (disposed) throw new Error(MESSAGE_DISPOSED);
			disposers.push(callback);
			return activity;
		}
		// registers callback to be invoked when this ensured activity is enabled
		// if this activity is enabled, invokes value function immediately
		// if this activity is not ensured and disabled ignores callback
		function onEnable(callback) {
			if (getEnabled()) value();
			else if (!ensured) return activity;
			if (parent && !enablers.length) parent.onEnable(notify);
			enablers.push(value);
			return activity;
		}
	}
	// creates channel object
	function Channel(bus, name, parent) {
		var channel = Activity
			.call(this, bus, parent)
			.onDispose(function() {
				each(publications, 'dispose');
				each(subscriptions, 'dispose');
				preserves.length = publications.length = subscriptions.length = 0;
			}),
			preserves = [], preserving = 0, publications = [], subscriptions = [];
		return Object.defineProperties(channel, {
			name: {enumerable: true, value: name},
			preserve: {value: preserve},
			preserving: {enumerable: true, get: getPreserving},
			publications: {enumerable: true, get: getPublications},
			publish: {value: publish},
			subscribe: {value: subscribe},
			subscriptions: {enumerable: true, get: getSubscriptions},
			unsubscribe: {value: unsubscribe}
		});
		// removes all subscriptions and persisted publications from this channel
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
		// creates new deferred publication to this channel if no message passed
		// or publishes message immediately without creation of publication object
		function publish(message) {
			if (!arguments.length) return new Publication(channel);
			var envelope = new Envelope(channel, message);
			if (preserving) {
				preserves.push(envelope);
				if (preserving < preserves.length) preserves.shift();
			}
			each(channel.subscriptions, 'trigger', envelope);
			if (parent) parent.publish(envelope);
			return channel;
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
	// creates new envelope object
	/*
		publication 	-> new Envelope(operation, message)
		channel 		-> new Envelope(channel, envelope) | new Envelope(channel, message)
		subscription 	-> new Envelope(channel, envelope) | new Envelope(channel, message)
		error 			-> new Envelope(envelope, error)
	*/
	function Envelope() {
		var binding, channel, envelope = this, error, message, parameters = [];
		each(arguments, merge);
		if (message instanceof Envelope) {
			binding = activity.binding || message.binding;
			channel = message.channel;
			parameters = message.parameters.concat(activity.parameters);
			message = message.message;
		}
		else {
			binding = activity.binding || activity;
			channel = activity.channel || activity;
			parameters = activity.parameters;
			if (message === undefined) message = {};
		}
		return Object.defineProperties(this, {
			binding: {enumerable: true, value: binding},
			channel: {enumerable: true, value: channel},
			message: {enumerable: true, value: message, writable: true},
			invoke: {value: invoke},
			parameters: {enumerable: true, value: parameters}
		});
		// invokes callback applied with message and parameters
		function invoke(callback) {
			return callback.apply(binding, parameters.concat(message, envelope));
		}
		function merge(source) {
			if (source instanceof Channel) {
				if (source.binding) binding = source.binding

			}
			else if (source instanceof Publication || source instanceof Subscription) {
				
			}
			else if (source instanceof Envelope) {
				if (source.binding) binding = source.binding;
				if (source.channel) channel = source.channel;
				if (source.parameters) parameters = parameters.concat(source.parameters);
				merge(source.message);
			}
			else if (source instanceof Error) error = source;
			else if (source instanceof Object) {
				var keys = Object.keys(source);
				for (var i = keys.length - 1; i >= 0; i--) {
					var key = keys[i];
					message[key] = source[key];
				};
			}
		}
	}
	// creates new operation object, abstract base for publications and subscriptions
	function Operation(bus, channel, collection, proto) {
		var operation = Activity
			.call(operation, bus, channel)
			.dispose(function() {
				triggers.length = 0;
			}),
			index, triggers = [];
		return Object.defineProperties(operation, {
			after: {value: after},
			async: {value: async},
			channel: {enumerable: true, value: channel},
			debounce: {value: debounce},
			delay: {value: delay},
			discard: {value: discard},
			filter: {value: filter},
			map: {value: map},
			once: {value: once},
			persist: {value: persist},
			skip: {value: skip},
			take: {value: take},
			throttle: {value: throttle},
			trigger: {value: trigger},
			unless: {value: unless},
			until: {value: until}
		});
		// pospones this operation till condition happens
		// condition can be date, interval or channel
		// if replay is true, all publications delivered through this object are recorded
		// and replayed when condition happens
		function after(condition, replay) {
			var happened = false, timer, watcher;
			if (isString(condition)) watcher = bus(condition).subscribe(happen).once();
			else {
				if (isDate(condition)) condition = condition.valueOf() - Date.now();
				if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
				if (condition < 1) return operation;
				else timer = setTimeout(happen, condition);
			}
			if (replay) replay = [];
			return operation
				.persist()
				.dispose(function() {
					replay = undefined;
					clearTimeout(timer);
					if (watcher) watcher.dispose();
				})
				.trigger(function(envelope, proceed) {
					if (happened) proceed(NEXT);
					else if (replay) replay.push(proceed);
					else proceed(SKIP);
				});
			function happen() {
				happened = true;
				timer = watcher = undefined;
				if (replay) each(replay);
				replay = undefined;
			}
		}
		// turns this operation into asynchronous
		// asynchronous operation is invoked after all synchronous operations are complete
		function async() {
			var timer;
			return operation
				.persist()
				.dispose(function() {
					clearTimeout(timer);
				})
				.trigger(function(envelope, proceed) {
					timer = setImmediate(proceed);
				});
		}
		// performs this operation once within specified interval between invocation attempts
		// if defer is true this operation will be invoked at the end of interval
		// otherwise this operation will be invoked at the beginning of interval
		// interval must be positive number
		function debounce(interval, defer) {
			var timer;
			validateInterval(interval);
			return operation
				.persist()
				.dispose(function() {
					clearTimeout(timer);
				})
				.trigger(defer
					? function(envelope, proceed) {
						clearTimeout(timer);
						timer = setTimeout(function() {
							timer = undefined;
							proceed(NEXT);
						}, interval);
					}
					: function(envelope, proceed) {
						if (timer) clearTimeout(timer);
						else proceed(NEXT);
						timer = setTimeout(function() {
							timer = undefined;
						}, interval);
					});
		}
		// delays this operation for specified interval
		// interval must be positive number
		function delay(interval) {
			validateInterval(interval);
			var slots = [], timers = [];
			return persist()
				.dispose(function() {
					each(timers, clearTimeout);
					timers = undefined;
				})
				.trigger(function operate(envelope, proceed) {
					var index = slots.length ? slots.pop() : timers.length;
					timers[index] = setTimeout(function() {
						slots.push(index);
						proceed(NEXT);
					}, interval);
				});
		}
		// performs this operation only if callback returns trythy value
		function filter(callback) {
			validateCallback(callback);
			return operation
				.trigger(function(envelope, proceed) {
					proceed(apply(callback, envelope) ? NEXT : SKIP);
				});
		}
		// transforms published messages
		function map(callback) {
			validateCallback(callback);
			return operation
				.trigger(function(envelope, proceed) {
					envelope.data = invoke(callback, envelope);
					proceed(NEXT);
				});
		}
		// performs this operation only once
		function once() {
			return take(1);
		}
		// saves this operation to the corresponsing collection of parent channel
		function persist() {
			if (disposed || isNumber(index)) return operation;
			index = collection.slots ? collection.slots.pop() : collection.length++;
			collection[index] = operation;
			return operation;
		}
		// skips specified count of attempts to trigger this operation
		function skip(count) {
			validateCount(count);
			return operation
				.trigger(function(envelope, proceed) {
					proceed(--count < 0 ? NEXT : SKIP);
				});
		}
		// performs this operation only specified count of times then discards it
		function take(count) {
			validateCount(count);
			return operation
				.trigger(function(envelope, proceed) {
					proceed(--count === 0 ? DONE : NEXT);
				});
		}
		// performs this operation once within specified interval ignoring other attempts
		// interval must be positive number
		function throttle(interval) {
			validateInterval(interval);
			var timer;
			return operation
				.persist()
				.dispose(function() {
					clearTimeout(timer);
				})
				.trigger(function(envelope, proceed) {
					if (!timer) timer = setTimeout(function() {
						timer = undefined;
						proceed(NEXT);
					}, interval);
				});
		}
		// triggers registered operations on this object
		function trigger(message) {
			if (isFunction(data)) {
				if (disposed) throw new Error(MESSAGE_OPERATION);
				triggers.push(data);
				return operation;
			}
			var cursor = 0, done = false, envelope = new Envelope(operation, message), skip = false;
			return operation.ensure(function proceed(command) {
				done |= command & DONE;
				skip |= command & SKIP;
				if (skip) {
					if (done) dispose();
				}
				else {
					if (++cursor === triggers.length) {
						cursor = 0;
						skip = true;
					}
					triggers[cursor](envelope, proceed);
				}
			});
		}
		// perfoms this operation unless callback returns thruthy value then disposes it
		function unless(callback) {
			validatePredicate(predicate);
			return operation
				.trigger(function(envelope, proceed) {
					proceed(apply(callback, envelope) ? DONE | SKIP : NEXT);
				});
		}
		// performs this operation until specified condition happens
		// condition can be date, interval or channel name to wait for publication occurs
		function until(condition) {
			var timer, watcher;
			if (isString(condition)) watcher = bus(condition).subscribe(operation.dispose).once();
			else {
				if (isDate(condition)) condition = condition.valueOf() - Date.now();
				else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
				if (condition < 0) dispose();
				else timer = setTimeout(dispose, condition);
			}
			return operation
				.persist()
				.dispose(function() {
					clearTimeout(timer);
					if (watcher) watcher.dispose();
				});
		}
	}
	// creates publication object
	function Publication(bus, channel) {
		var publication = Operation
			.call(this, bus, channel, channel.publications)
			.trigger(function(envelope, proceed) {
				channel.publish(envelope);
				proceed(NEXT);
			});
		return Object.defineProperties(publication, {
			repeat: {value: repeat}
		});
		// repeats this publication every interval with optional message
		// interval must be positive number
		// if message is function, it will be invoked each time
		function repeat(interval, message) {
			validateInterval(interval);
			interval = setInterval(function() {
				publication.trigger(isFunction(message) ? message.apply(publication.binding, publication.parameters) : message);
			}, interval);
			return publication
				.persist()
				.dispose(function() {
					clearInterval(interval);
				});
		}
	}
	// creates object with subscription behavior
	function Subscription(bus, channel, subscribers) {
		var subscription = Operation
			.call(this, bus, channel, channel.subscriptions)
			.persist()
			.dispose(function() {
				subscribers.length = 0;
			})
			.trigger(function(envelope, proceed) {
				var cursor = -1;
				subscription.ensure(trigger);
				function trigger() {
					if (++cursor === subscribers.length) proceed(NEXT);
					else {
						try {
							envelope.invoke(subscribers[cursor]);
						} catch(e) {
							var error = bus.error;
							if (channel === error) throw e;
							error.trigger(new Envelope(envelope, {error: e}));
						}
						subscription.ensure(trigger);
					}
				}
			});
		return Object.defineProperties(subcription, {
			subscribers: {get: getSubscribers},
			unsubscribe: {value: unsubscribe}
		});
		// returns clone of subscribers array
		function getSubscribers() {
			return slice.call(subscribers);
		}
		// unsubscribes all specified subscribers from this subscription
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(arguments, remove);
			if (!subscribers.length) subscription.discard();
			function remove(subscriber) {
				var index = subscribers.indexOf(subscriber);
				if (-1 !== index) subscribers.splice(index, 1);
			}
		}
	}
	// exports message bus as singleton
	if ('object' === typeof module && module.exports) module.exports = create();
	else global.aerobus = create();
})(this);
