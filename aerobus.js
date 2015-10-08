(function(global, undefined) {
	"use strict";
	var MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
		MESSAGE_CONDITION = 'Condition argument must be a channel name or a date or an interval',
		MESSAGE_COUNT = 'Count argument must be a non-negative number',
		MESSAGE_DELIMITER = 'Delimiter argument must be a string',
		MESSAGE_ERROR = 'Error argument must be a string',
		MESSAGE_INTERVAL = 'Interval argument must be a positive number',
		MESSAGE_NAME = 'Name argument must be a string',
		MESSAGE_PREDICATE = 'Predicate argument must be a function',
		MESSAGE_SUBSCRIBER = 'Subscriber argument must be a function';
	var standard = {
		delimiter: '.',
		error: 'error'
	};

	var clearImmediate = global.clearImmediate, setImmediate = global.setImmediate,
		map = Array.prototype.map, slice = Array.prototype.slice;

	function bind(handler) {
		var params = slice.call(arguments, 1);
		if (isFunction(handler)) return function() {
			return handler.apply(undefined, params);
		};
		return function(value) {
			return value[handler].apply(undefined, params);
		};
	}

	function each(collection, handler) {
		var invoker = 1 === arguments.length ? invokeSelf : invokeHandler;
		if (isFunction(collection.forEach)) collection.forEach(invoker);
		else if (isNumber(collection.length)) for (var i = 0, l = collection.length; i < l; i++) invoker(collection[i], i);
		else for (var key in collection) invoker(collection[key], key);
		function invokeHandler(item) {
			if (item) handler(item);
		}
		function invokeSelf(item) {
			if (item) item();
		}
	}

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

	function tie(handler, params) {
		if (isFunction(handler)) return function() {
			return handler.apply(undefined, params);
		};
		return function(value) {
			return value[handler].apply(undefined, params);
		};
	}

	function validateCount(value) {
		if (!isNumber(value) || value < 0) throw new Error(MESSAGE_COUNT);
		return value;
	}
	function validateDelimiter(value) {
		if (!isString(value)) throw new Error(MESSAGE_DELIMITER);
		return value;
	}
	function validateError(value, delimiter) {
		if (!isString(value) || -1 !== value.indexOf(delimiter)) throw new Error(MESSAGE_ERROR);
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

	function createActivity(bus, parent) {
		var active = true, activators;
		return createActivityApi({
			activate: activate,
			bus: bus,
			deactivate: deactivate,
			isActive: isActive,
			onActivate: onActivate
		});
		function activate() {
			active = true;
			trigger();
		}
		function deactivate() {
			active = false;
		}
		function isActive() {
			return active && (!parent || parent.isActive());
		}
		function onActivate(activator) {
			if (isActive()) activator();
			else if (activators)  activators.push(activator);
			else {
				activators = [activator];
				if (parent) parent.onActivate(trigger);
			}
		}
		function trigger() {
			if (!activators || !active) return;
			if (!parent || parent.isActive()) {
				each(activators);
				activators = undefined;
			}
			else parent.onActivate(trigger);
		}
	}

	function createActivityApi(activity) {
		function activate() {
			activity.activate();
			return activity.api;
		}
		function deactivate() {
			activity.deactivate();
			return activity.api;
		}
		function getActive() {
			return activity.isActive();
		}
		function setActive(value) {
			value ? activity.activate() : activity.deactivate();
		}
		activity.api = Object.defineProperties({}, {
			activate: {value: activate},
			active: {enumerable: true, get: getActive, set: setActive},
			bus: {enumerable: true, value: activity.bus.api},
			deactivate: {value: deactivate}
		});
		return activity;
	}

	function createBus(delimiter, error) {
		var bus, root = '';
		delimiter = delimiter ? validateDelimiter(delimiter) : standard.delimiter;
		error = error ? validateError(error, bus.delimiter) : standard.error;
		return createBusApi(bus = {
			channel: getChannel,
			channels: Object.create(null),
			delimiter: delimiter,
			error: getErrorChannel,
			root: getRootChannel
		});
		function getChannel(name) {
			if (1 < arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			if (!arguments.length || name === root) return bus.root();
			if (name === error) return bus.error();
			validateName(name);
			var channels = bus.channels, channel = channels[name];
			if (channel) return channel;
			var index = name.indexOf(delimiter);
			var parent = -1 === index ? bus.root() : bus.channel(name.substr(0, index));
			return channels[name] = createChannel(bus, name, parent);
		}
		function getErrorChannel() {
			return bus.channels[error] || (bus.channels[error] = createChannel(bus, error, null));
		}
		function getRootChannel() {
			return bus.channels[root] || (bus.channels[root] = createChannel(bus, root, null));
		}
	}

	function createBusApi(bus) {
		function clear() {
			each(bus.channels, bind('clear'));
			bus.channels = Object.create(null);
			return bus.api;
		}
		function create(delimiter, error) {
			return createBus(delimiter, error).api;
		}
		function getChannels() {
			return Object.keys(bus.channels).length;
		}
		function getError() {
			return bus.error().api;
		}
		function getRoot() {
			return bus.root().api;
		}
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			each(bus.channels, tie('unsubscribe', arguments));
			return bus.api;
		}
		bus.api = function(name) {
			return bus.channel.apply(bus, arguments).api;
		};
		Object.defineProperties(bus.api, {
			channel: {value: bus.channel},
			clear: {value: clear},
			delimiter: {enumerable: true, value: bus.delimiter},
			channels: {enumerable: true, get: getChannels},
			create: {value: create},
			error: {enumerable: true, get: getError},
			root: {enumerable: true, get: getRoot},
			unsubscribe: {value: unsubscribe}
		});
		return bus;
	}

	function createChannel(bus, name, parent) {
		var channel = createActivity(bus, parent);
		channel.clear = clear;
		channel.name = name;
		channel.parent = parent;
		channel.publications = [];
		channel.publish = publish;
		channel.subscribe = subscribe;
		channel.subscriptions = [];
		channel.trigger = trigger;
		channel.unsubscribe = unsubscribe;
		return createChannelApi(channel);
		function clear() {
			var dispose = bind('dispose');
			each(channel.publications, dispose);
			each(channel.subscriptions, dispose);
			channel.publications.length = channel.subscriptions.length = 0;
		}
		function publish() {
			return createPublication(channel, slice.call(arguments));
		}
		function subscribe() {
			if (0 === arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			return createSubscription(channel, map.call(arguments, validateSubscriber));
		}
		function trigger(params) {
			each(channel.subscriptions, bind('trigger', params));
			if (parent) parent.trigger(params);
		}
		function unsubscribe() {
			each(channel.subscriptions, tie('unsubscribe', arguments));
		}
	}

	function createChannelApi(channel) {
		function clear() {
			channel.clear();
			return channel;
		}
		function count(collection) {
			var result = 0;
			each(collection, increment);
			return result;
			function increment() {
				result++;
			}
		}
		function getPublications() {
			return count(channel.publications);
		}
		function getSubscriptions() {
			return count(channel.subscriptions);
		}
		function publish(parameter1, parameter2, parameterN) {
			return channel.publish.apply(channel, arguments).api;
		}
		function subscribe(subscriber1, subscriber2, subscriberN) {
			return channel.subscribe.apply(channel, arguments).api;
		}
		function unsubscribe(subscriber1, subscriber2, subscriberN) {
			channel.unsubscribe.apply(channel, arguments);
			return channel;
		}
		Object.defineProperties(channel.api, {
			clear: {value: clear},
			name: {enumerable: true, value: channel.name},
			parent: {value: channel.parent ? channel.parent.api : null},
			publications: {get: getPublications},
			publish: {value: publish},
			subscribe: {value: subscribe},
			subscriptions: {get: getSubscriptions},
			unsubscribe: {value: unsubscribe}
		});
		return channel;
	}

	function createOperation(channel, collection) {
		var index, operation = createActivity(channel.bus, channel);
		operation.channel = channel;
		operation.dispose = dispose;
		operation.disposers = [];
		operation.handlers = [];
		operation.persist = persist;
		operation.trigger = trigger;
		return createOperationApi(operation);
		function dispose() {
			if (isNumber(index)) {
				if (collection.slots) collection.slots.push(index);
				else collection.slots = [index];
				index = collection[index] = undefined;
			}
			operation.deactivate();
			each(operation.disposers);
			operation.disposers.length = operation.handlers.length = 0;
		}
		function persist() {
			if (isNumber(index)) return;
			if (collection.slots) index = collection.slots.pop();
			else index = collection.length++;
			collection[index] = operation;
		}
		function trigger(params) {
			if (!operation.isActive()) return;
			var cursor = 0, disposing, handlers = operation.handlers;
			for (var i = params.length - 1; i >= 0; i--) {
				var param = params[i];
				if (isFunction(param)) params[i] = param.call(operation);
			}
			next(true);
			function end() {
				if (disposing) operation.dispose();
			}
			function next(proceed, terminate) {
				if (true === terminate) disposing = true;
				if (false === proceed) end();
				else {
					++cursor;
					if (cursor === handlers.length) handlers[0].call(operation, end, params);
					else handlers[cursor].call(operation, next, params);
				}
			}
		}
	}

	function createOperationApi(operation) {
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
			operation.handlers.push(handle);
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
			function handle(next) {
				if (happened) next(true);
				else if (replay) replay.push(next);
				else next(false);
			}
		}
		function debounce(interval, later) {
			validateInterval(interval);
			var timer;
			operation.disposers.push(dispose);
			operation.handlers.push(later ? future : immediate);
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
		function delay(interval) {
			validateInterval(interval);
			var slots = [], timers = [];
			operation.disposers.push(dispose);
			operation.handlers.push(handle);
			operation.persist();
			return operation.api;
			function dispose() {
				each(timers, clearTimeout);
				timers = undefined;
			}
			function handle(next) {
				var index = slots.length ? slots.pop() : timers.length;
				timers[index] = setTimeout(delayed, interval);
				function delayed() {
					slots.push(index);
					next();
				}
			}
		}
		function discard() {
			operation.dispose();
			return operation.api;
		}
		function filter(predicate) {
			validatePredicate(predicate);
			operation.handlers.push(handle);
			return operation.api;
			function handle(next, params) {
				next(predicate.apply(operation, params));
			}
		}
		function once() {
			return take(1);
		}
		function skip(count) {
			validateCount(count);
			operation.handlers.push(handle);
			return operation.api;
			function handle(next) {
				next(--count < 0);
			}
		}
		function take(count) {
			validateCount(count);
			operation.handlers.push(handle);
			return operation.api;
			function handle(next) {
				if (--count < 0) next(false);
				else next(true, count === 0);
			}
		}
		function throttle(interval) {
			validateInterval(interval);
			var timer;
			operation.disposers.push(dispose);
			operation.handlers.push(handle);
			operation.persist();
			return operation.api;
			function dispose() {
				clearTimeout(timer);
			}
			function handle(next) {
				if (!timer) timer = setTimeout(throttled, interval);
				function throttled() {
					timer = undefined;
					next(true);
				}
			}
		}
		function unless(predicate) {
			validatePredicate(predicate);
			operation.handlers.push(handle);
			return operation.api;
			function handle(next, params) {
				var terminate = predicate.apply(operation, params);
				next(!terminate, terminate);
			}
		}
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
			channel: {enumerable: true, value: operation.channel.api},
			debounce: {value: debounce},
			delay: {value: delay},
			discard: {value: discard},
			filter: {value: filter},
			once: {value: once},
			skip: {value: skip},
			take: {value: take},
			throttle: {value: throttle},
			unless: {value: unless},
			until: {value: until}
		});
		return operation;
	}

	function createPublication(channel, parameters) {
		var publication = createOperation(channel, channel.publications);
		publication.disposers.push(dispose);
		publication.parameters = parameters;
		publication.sticked = false;
		publication.timer = setImmediate(trigger);
		publication.handlers.push(handle);
		return createPublicationApi(publication);
		function dispose() {
			parameters.length = 0;
			clearTimeout(publication.timer);
		}
		function handle(next, params) {
			if (publication.records) publication.records.push(params);
			channel.trigger(params);
			next();
		}
		function trigger() {
			publication.trigger(publication.parameters);
		}
	}

	function createPublicationApi(publication) {
		function getParameters() {
			return publication.parameters;
		}
		function getSticked() {
			return publication.sticked;
		}
		function getTrigger() {
			clearImmediate(publication.timer);
			return trigger;
		}
		function record() {
			if (!publication.recordings) publication.recordings = [];
			return publication.api;
		}
		function repeat(interval) {
			validateInterval(interval);
			clearImmediate(publication.timer);
			publication.persist();
			var repeater = setInterval(function() {
				publication.trigger(publication.parameters);
			}, interval);
			publication.dispose = function() {
				clearInterval(repeater);
			};
			return publication.api;
		}
		function replay(sync) {
			if (publication.recordings) sync ? proceed() : setImmediate(proceed);
			return publication.api;
			function proceed() {
				each(publication.recordings, publication.trigger);
			}
		}
		function stick() {
			if (publication.sticked) return;
			publication.sticked = true;
			publication.persist();
			return publication.api;
		}
		function trigger(parameter1, parameter2, parameterN) {
			var params = publication.parameters;
			publication.trigger(params.concat.apply(params, arguments));
			return publication.api;
		}
		Object.defineProperties(publication.api, {
			parameters: {enumerable: true, get: getParameters},
			record: {value: record},
			repeat: {value: repeat},
			replay: {value: replay},
			stick: {value: stick},
			sticked: {enumerable: true, get: getSticked},
			trigger: {get: getTrigger}
		});
		return publication;
	}

	function createSubscription(channel, subscribers) {
		var subscription = createOperation(channel, channel.subscriptions);
		subscription.disposers.push(dispose);
		subscription.persist(dispose);
		subscription.subscribers = subscribers;
		subscription.handlers.push(handle);
		subscription.unsubscribe = unsubscribe;
		replay();
		return createSubscriptionApi(subscription);
		function dispose() {
			subscribers.length = 0;
		}
		function handle(next, params) {
			each(subscribers, attempt);
			next();
			function attempt(subscriber) {
				try {
					subscriber.apply(subscription, params);
				} catch(e) {
					var error = channel.bus.error();
					if (channel === error) throw e;
					error.trigger([e, subscription], true);
				}
			}
		}
		function replay() {
			var publications = channel.publications, recordings = [];
			each(publications, collect);
			if (recordings.length) setImmediate(trigger);
			function collect(publication) {
				if (publication.recordings) recordings.push.apply(recordings, publication.recordings);
			}
			function trigger() {
				each(recordings, subscription.trigger);
			}
		}
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

	function createSubscriptionApi(subscription) {
		function getSubscribers() {
			return subscription.subscribers.length;
		}
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

	function setImmediatePolyfill() {
		var busy = false, handle = 1, tasks = {};
		function canUseNextTick() {
			return Object.prototype.toString.call(global.process) === '[object process]';
		}
		function canUsePostMessage() {
			if (!global.postMessage || global.importScripts) return false;
			var result = true;
			var handler = global.onmessage;
			global.onmessage = function() {
				result = false;
			};
			global.postMessage('', '*');
			global.onmessage = handler;
			return result;
		}
		function run(handle) {
			if (busy) setTimeout(bind(run, handle), 0);
			else {
				var task = tasks[handle];
				if (!task) return;
				busy = true;
				try {
					task();
				}
				finally {
					clearImmediate(handle);
					busy = false;
				}
			}
		}
		if (canUseNextTick()) {
			setImmediate = function(handler) {
				tasks[handle++] = handler;
				process.nextTick(bind(run, handle));
				return handle;
			};
		} 
		else if (canUsePostMessage()) {
			var prefix = "setImmediate$" + Math.random() + "$";
			var listener = function(event) {
				if (event.source !== global || !isString(event.data) || event.data.indexOf(prefix) !== 0) return;
				run(+event.data.slice(prefix.length));
			};
			if (global.addEventListener) global.addEventListener("message", listener, false);
			else global.attachEvent("onmessage", listener);
			setImmediate = function(handler) {
				tasks[handle++] = handler;
				global.postMessage(prefix + handle, "*");
				return handle;
			};
		} 
		else if (global.MessageChannel) {
			var messageChannel = new MessageChannel();
			messageChannel.port1.onmessage = function(event) {
				run(event.data);
			};
			setImmediate = function(handler) {
				tasks[handle++] = handler;
				messageChannel.port2.postMessage(handle);
				return handle;
			};
		}
		else setImmediate = function(handler) {
			tasks[handle++] = handler;
			setTimeout(bind(run, handle), 0);
			return handle;
		};
		clearImmediate = function(handle) {
			delete tasks[handle];
		};
	}

	if (!isFunction(setImmediate)) setImmediatePolyfill();

	if ('object' === typeof module && module.exports) module.exports = createBus().api;
	else global.bus = createBus().api;
})(new Function("return this")());