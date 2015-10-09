(function(global, undefined) {
	var MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
		MESSAGE_CONDITION = 'Condition argument must be a channel name or a date or an interval',
		MESSAGE_COUNT = 'Count argument must be a non-negative number',
		MESSAGE_DELIMITER = 'Delimiter argument must be a string',
		MESSAGE_INTERVAL = 'Interval argument must be a positive number',
		MESSAGE_NAME = 'Name argument must be a string',
		MESSAGE_PREDICATE = 'Predicate argument must be a function',
		MESSAGE_SUBSCRIBER = 'Subscriber argument must be a function';
	var standard = {
		delimiter: '.',
		error: 'error',
		root: ''
	};

	var map = Array.prototype.map, setImmediate = global.setImmediate, slice = Array.prototype.slice;

	if (!setImmediate) setImmediate = function(handler) {
		return setTimeout(handler, 0);
	};

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

	function createActivity(bus, parent) {
		var active = true, activators;
		return createActivityApi({
			activate: activate,
			api: {},
			bus: bus,
			deactivate: deactivate,
			isActive: isActive,
			onActivate: onActivate
		});
		function activate() {
			active = true;
			notify();
		}
		function deactivate() {
			active = false;
		}
		function isActive() {
			return active && (!parent || parent.isActive());
		}
		function notify() {
			if (!activators || !active) return;
			if (!parent || parent.isActive()) {
				each(activators);
				activators = undefined;
			}
			else parent.onActivate(notify);
		}
		function onActivate(activator) {
			if (isActive()) activator();
			else if (activators)  activators.push(activator);
			else {
				activators = [activator];
				if (parent) parent.onActivate(notify);
			}
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
		Object.defineProperties(activity.api, {
			activate: {value: activate},
			active: {enumerable: true, get: getActive, set: setActive},
			bus: {enumerable: true, value: activity.bus.api},
			deactivate: {value: deactivate}
		});
		return activity;
	}

	function createBus(delimiter) {
		var bus = {
			channel: channel,
			channels: Object.create(null),
			delimiter: delimiter ? validateDelimiter(delimiter) : standard.delimiter,
			error: error,
			root: root
		};
		return createBusApi(bus);
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
		function error() {
			return channel(standard.error);
		}
		function root() {
			return channel(standard.root);
		}
	}

	function createBusApi(bus) {
		function clear() {
			each(bus.channels, 'clear');
			bus.channels = Object.create(null);
			return bus.api;
		}
		function create(delimiter) {
			return createBus(delimiter).api;
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
			each(bus.channels, 'unsubscribe', slice.call(arguments));
			return bus.api;
		}
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

	function createChannel(bus, name, parent) {
		var channel = createActivity(bus, parent);
		channel.clear = clear;
		channel.ensured = false;
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
			each(channel.publications, 'dispose');
			each(channel.subscriptions, 'dispose');
			channel.publications.length = channel.subscriptions.length = 0;
		}
		function publish() {
			return createPublication(channel, slice.call(arguments));
		}
		function subscribe() {
			if (0 === arguments.length) throw new Error(MESSAGE_ARGUMENTS);
			return createSubscription(channel, map.call(arguments, validateSubscriber));
		}
		function trigger(params, sure) {
			each(channel.subscriptions, 'trigger', [params, sure]);
			if (parent) parent.trigger(params, sure);
		}
		function unsubscribe() {
			each(channel.subscriptions, 'unsubscribe', slice.call(arguments));
		}
	}

	function createChannelApi(channel) {
		function clear() {
			channel.clear();
			return channel.api;
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
			return channel.api;
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
		function trigger(params, sure) {
			if (!operation.isActive() && !sure) return;
			var cursor = 0, disposing, handlers = operation.handlers;
			for (var i = params.length - 1; i >= 0; i--) {
				var param = params[i];
				if (isFunction(param)) params[i] = param.call(operation);
			}
			operation.onActivate(next);
			function end() {
				if (disposing) operation.dispose();
			}
			function next(proceed, terminate) {
				if (true === terminate) disposing = true;
				if (false === proceed) end();
				else {
					++cursor;
					if (cursor === handlers.length) handlers[0].call(operation, end, params, sure);
					else handlers[cursor].call(operation, next, params, sure);
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
		function async() {
			var timer;
			operation.disposers.push(dispose);
			operation.handlers.push(handle);
			operation.persist();
			return operation.api;
			function dispose() {
				clearTimeout(timer);
			}
			function handle(next) {
				setImmediate(next);
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
		function persist() {
			operation.persist();
			return operation;
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
			async: {value: async},
			channel: {enumerable: true, value: operation.channel.api},
			debounce: {value: debounce},
			delay: {value: delay},
			discard: {value: discard},
			filter: {value: filter},
			once: {value: once},
			persist: {value: persist},
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
		publication.ensured = false;
		publication.handlers.push(handle);
		publication.parameters = parameters;
		publication.recorded = false;
		publication.recordings = [];
		publication.sticked = false;
		return createPublicationApi(publication);
		function dispose() {
			publication.recordings.length = publication.parameters.length = 0;
		}
		function handle(next, params) {
			if (publication.recorded) publication.recordings.push(params);
			channel.trigger(params, publication.ensured);
			next();
		}
	}

	function createPublicationApi(publication) {
		function ensure() {
			publication.ensured = true;
			return publication.api;
		}
		function getEnsured() {
			return publication.ensured;
		}
		function getParameters() {
			return publication.parameters;
		}
		function getRecorded() {
			return publication.recorded;
		}
		function getSticked() {
			return publication.sticked;
		}
		function getTrigger() {
			return trigger;
		}
		function record() {
			publication.recorded = true;
			return publication.api;
		}
		function repeat(interval) {
			validateInterval(interval);
			publication.persist();
			var repeater = setInterval(invoke, interval);
			publication.disposers.push(dispose);
			return publication.api;
			function dispose() {
				clearInterval(repeater);
			}
			function invoke() {
				publication.trigger(publication.parameters, publication.ensured);
			}
		}
		function replay(sync) {
			each(publication.recordings, publication.trigger, [publication.ensured]);
			return publication.api;
		}
		function stick() {
			if (publication.sticked) return;
			publication.recorded = publication.sticked = true;
			publication.persist();
			return publication.api;
		}
		function trigger(parameter1, parameter2, parameterN) {
			var params = publication.parameters;
			publication.trigger(params.concat.apply(params, arguments), publication.ensured);
			return publication.api;
		}
		Object.defineProperties(publication.api, {
			ensure: {value: ensure},
			ensured: {enumerable: true, get: getEnsured},
			parameters: {enumerable: true, get: getParameters},
			record: {value: record},
			recorded: {enumerable: true, get: getRecorded},
			repeat: {value: repeat},
			replay: {value: replay},
			sticked: {enumerable: true, get: getSticked},
			stick: {value: stick},
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
		function handle(next, params, sure) {
			var cursor = 0;
			proceed();
			function proceed() {
				if (cursor === subscribers.length) next();
				else if (subscription.isActive()) try {
					subscribers[cursor++].apply(subscription, params);
				} catch(e) {
					var error = channel.bus.error();
					if (channel === error) throw e;
					error.trigger([e, subscription], true);
				}
				else if (sure) subscription.onActivate(proceed);
				else next();
			}
		}
		function replay() {
			var publications = channel.publications, recordings = [];
			each(publications, collect);
			if (recordings.length) setImmediate(trigger);
			function collect(publication) {
				if (publication.sticked) recordings.push.apply(recordings, publication.recordings);
			}
			function trigger() {
				each(recordings, subscription.trigger, [true]);
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

	if ('object' === typeof module && module.exports) module.exports = createBus().api;
	else global.bus = createBus().api;
})(new Function("return this")());