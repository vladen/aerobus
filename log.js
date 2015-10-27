(function(host, undefined) {
	var levels = ['log', 'info', 'warn', 'error'],
		standard = {
			prefix: '%c %s:%s:%s.%s %s %s: ',
			style: 'background-color:#000;color:#fff'
		};

	function create(source) {
		var enabled = false, log = logger('log'), options = {
			prefix: standard.prefix,
			source: source,
			style: standard.style
		};
		levels.forEach(function(level) {
			log[level] = logger(level);
		});
		log.create = function(source) {
			return create(options.source + '.' + source).enable(enabled);
		}
		log.disable = function() {
			enabled = false;
			return log;
		}
		log.enable = function(value) {
			enabled = (!arguments.length || !!value) && 'object' === typeof host.console && host.console.log instanceof Function;
			return log;
		};
		return log;
		function logger(level) {
			return function() {
				if (enabled) write.apply(undefined, [Array.prototype.slice.call(arguments), level, options]);
				return log;
			};
		}
	}

	function pad(value, count) {
		value = String(value);
		while (value.length < count) value = '0' + value;
		return value;
	}

	function write(args, level, options) {
		var now = new Date;
		(host.console[level] || host.console.log).apply(
			host.console,
			[
				options.prefix,
				options.style,
				pad(now.getHours(), 2),
				pad(now.getMinutes(), 2),
				pad(now.getSeconds(), 2),
				pad(now.getMilliseconds(), 3),
				options.source,
				level
			].concat(args));
	}

	if ('object' === typeof module && module.exports) module.exports = create;
	else host.log = create;
})(this);
