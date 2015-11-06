(function(root, factory) {

  if (typeof exports === 'object') module.exports = factory(root);
  else root.aerobus = factory(root);

} (this, (root, undefined) => {
  // error messages
  const MESSAGE_ARGUMENTS = 'Unexpected number of arguments',
        MESSAGE_CALLBACK = 'Callback must be function',
        MESSAGE_CHANNEL = 'Channel must be instance of channel class',
        MESSAGE_CONDITION = 'Condition must be channel name or date or function or interval',
        MESSAGE_COUNT = 'Count must be positive number',
        MESSAGE_DELIMITER = 'Delimiter must be string',
        MESSAGE_DISPOSED = 'Object has been disposed',
        MESSAGE_FORBIDDEN = 'Operation is forbidden',
        MESSAGE_INTERVAL = 'Interval must be positive number',
        MESSAGE_NAME = 'Name must be string',
        MESSAGE_OPERATION = 'Operation must be instance of publication or subscription  class',
        MESSAGE_STRATEGY = 'Strategy name must be one of the following: "broadcast", "cycle", "random".',
        MESSAGE_SUBSCRIBER = 'Subscriber must be function',
        MESSAGE_TRACE = 'Trace must be function';

  // standard settings
  const DELIMITER = '.', ERROR = 'error', ROOT = '';

  // continuation flags
  const CONTINUE = 0, FINISH = 2, SKIP = 1;

  const $disposed = Symbol('disposed');

  class Activity {
    constructor(bus, parent) {
      this[$bus] = bus;
      this[$disposed] = false;
      this[$disposers] = [];
      this[$enabled] = true;
      this[$enablers] = [];
      this[$ensured] = false;
      this[$parent] = parent;
      this[$triggers] = [];
    }
    get bus() {
      return this[$bus];
    }
    get disposed() {
      return this[$disposed];
    }
    get enabled() {
      return this[$enabled];
    }
    set enabled(value) {
      this[$enabled] = !!value;
    }
    get ensured() {
      return this[$ensured];
    }
    set ensured(value) {
      this[$ensured] = !!value;
    }
    // disposes this activity
    function dispose() {
      if (this[$disposed]) return this;
      bus.trace('dispose', activity);
      disposed = true;
      enabled = false;
      each(disposers);
      disposers.length = enablers.length = triggers.length = 0;
    }
    var disposed = false, disposers = [], enabled = true, enablers = [], ensured = false, triggers = [];
    var activity = $defineProperties(this, {
      bus: {enumerable: true, value: bus},
      disable: {value: disable},
      dispose: {value: dispose},
      disposed: {enumerable: true, get: getDisposed},
      enable: {value: enable},
      enabled: {enumerable: true, get: getEnabled},
      ensure: {value: ensure},
      ensured: {enumerable: true, get: getEnsured},
      id: {enumerable: true, value: identity(this)},
      onDispose: {value: onDispose},
      onEnable: {value: onEnable},
      onTrigger: {value: onTrigger},
      trigger: {value: trigger}
    });
    bus.trace('create', activity);
    return activity;
    // disables this activity
    function disable() {
      validateDisposable(activity);
      if (enabled) {
        bus.trace('disable', activity);
        enabled = false;
        notify();
      }
      return activity;
    }
    // disposes this activity
    function dispose() {
      if (!disposed) {
        bus.trace('dispose', activity);
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
        bus.trace('enable', activity);
        enabled = true;
        notify();
      }
      return activity;
    }
    function ensure() {
      validateDisposable(activity);
      if (!ensured) {
        bus.trace('ensure', activity);
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
      bus.trace('trigger', activity, message);
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
});