// creates operation class, abstract base for publications and subscriptions

'use strict';


import Message from "Message";
import Activity from "Activity";

import {validateInterval} from "../auxiliaryModules/validators";
import {CONTINUE, SKIP} from "../auxiliaryModules/standatdConstants";
import {MESSAGE_ARGUMENTS, MESSAGE_CONDITION} from "../auxiliaryModules/errorMessages";
import {_setTimeout, _clearTimeout, _setImmediate} from "../auxiliaryModules/shortcuts";
import {isString, isDate, isNumber, isFunction, isChannel, isUndefined, isDefined, each} from "../auxiliaryModules/helpFunctions";


const BUS = Symbol('bus')
  , CHANNELS = Symbol('channels');


export default class Operation extends Activity {
  constructor(bus, channels) {
    //TODO: Verify the equivalence of the results to the old version
    //return Activity.call(operation, bus).onDispose(dispose);
    super(bus).onDispose(this.dispose);

    this[BUS] = bus;
    this[CHANNELS] = channels;
    this[CHANNELS].indexes = {};
  }  
  // pospones this operation until condition happens then replays all preceeding publications
  // condition can be date, function, interval or channel name
  after(condition) {
    if (1 !== arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    let happened = false,
      predicate, recordings, timer;
    if (isString(condition)) this.onDispose(this[BUS](condition).subscribe(happen).once().dispose);
    else if (isFunction(condition)) predicate = condition;
    else {
      if (isDate(condition)) condition = condition.valueOf() - Date.now();
      else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
      if (condition > 0) timer = _setTimeout(happen, condition);
      else happened = true;
    }
    return happened ? this : this.onDispose(dispose).onTrigger(trigger);

    dispose() {
      _clearTimeout(timer);
      predicate = recordings = undefined;
    }

    happen() {
      happened = true;
      _setImmediate(each(recordings));
      dispose();
    }

    trigger(message, next) {
      if (predicate && predicate()) happen();
      if (happened) next();
      else recordings ? recordings.push(next) : (recordings = [next]);
    }
  }
  // pospones this operation until all conditions happen then replays all preceeding publications
  // condition can be date, function, interval or channel name
  afterAll(condition1, condition2, conditionN) {
    if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    let pending = 0
      , operation = this
      , predicates, recordings, timers;
    if (1 < arguments.length) each(arguments, setup);
    else if (isArray(condition1)) each(condition1, setup);
    else setup(condition1);
    return pending ? operation.onDispose(dispose).onTrigger(trigger) : operation;

    dispose() {
      each(timers, _clearTimeout);
      predicates = recordings = timers = undefined;
    }

    happen() {
      if (--pending) return false;
      each(recordings);
      dispose();
      return true;
    }

    setup(condition) {
      if (isString(condition)) operation.onDispose(operation[BUS](condition).subscribe(happen).once().dispose);
      else if (isFunction(condition)) predicates ? predicates.push(condition) : predicates = [condition];
      else {
        if (isDate(condition)) condition = condition.valueOf() - Date.now();
        else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
        if (condition < 0) return;
        let timer = _setTimeout(happen, condition);
        timers ? timers.push(timer) : (timers = [timer]);
      }
      pending++;
    }

    trigger(message, next) {
      if (predicates)
        for (let i = 0, l = predicates.length; i < l; i++) {
          let predicate = predicates[i];
          if (!predicate || !predicate()) continue;
          if (happen()) break;
          predicates[i] = undefined;
        }
      if (pending) recordings ? recordings.push(next) : (recordings = [next]);
      else next();
    }
  }
  // pospones this operation until any of conditions happen then replays all preceeding publications
  // condition can be date, function, interval or channel name
  afterAny(condition1, condition2, conditionN) {
    if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    let pending = true
      , operation = this
      , predicates, recordings, subscriptions, timers;
    if (1 < arguments.length) each(arguments, setup);
    else if (isArray(condition1)) each(condition1, setup);
    else setup(condition1);
    return pending ? operation.onDispose(dispose).onTrigger(trigger) : operation;

    dispose() {
      each(subscriptions, 'dispose');
      each(timers, _clearTimeout);
      predicates = recordings = subscriptions = timers = undefined;
    }

    happen() {
      pending = false;
      each(recordings);
      dispose();
    }

    setup(condition) {
      if (isString(condition)) {
        let subscription = operation[BUS](condition).subscribe(happen).once();
        subscriptions ? subscriptions.push(subscription) : (subscriptions = [subscription]);
      } else if (isFunction(condition)) predicates ? predicates.push(condition) : (predicates = [condition]);
      else {
        if (isDate(condition)) condition = condition.valueOf() - Date.now();
        else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
        if (condition < 0) {
          pending = false;
          return false;
        }
        let timer = _setTimeout(happen, condition);
        timers ? timers.push(timer) : (timers = [timer]);
      }
    }

    trigger(message, next) {
      if (predicates)
        for (let i = -1, l = predicates.length; i < l; i++) {
          let predicate = predicates[i];
          if (!predicate || !predicate()) continue;
          happen();
          break;
        }
      if (pending) recordings ? recordings.push(next) : (recordings = [next]);
      else next();
    }
  }
  // attaches this operation to channel
  attach(channel) {
    if (!isChannel(channel)) throw new Error(MESSAGE_CHANNEL);
    let channels = this[CHANNELS]
      , index = channels.indexes[channel.name];
    if (isUndefined(index)) {
      this[BUS].trace('attach', this, channel);
      channels.indexes[channel.name] = channels.length;
      channels.push(channel);
      channel.attach(this);
    }
    return this;
  }
  // performs this operation until condition happen
  // condition can be date, function, interval or channel name
  before(condition) {
    if (1 !== arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    let predicate, timer, operation = this;
    if (isString(condition)) operation.onDispose(bus(condition).subscribe(operation.dispose).once().dispose);
    else if (isFunction(condition)) predicate = condition;
    else {
      if (isDate(condition)) condition = condition.valueOf() - Date.now();
      else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
      if (condition < 0) return operation.dispose();
      timer = _setTimeout(operation.dispose, condition);
    }
    return operation.onDispose(dispose).onTrigger(trigger);

    dispose() {
      _clearTimeout(timer);
      predicate = timer = undefined;
    }

    trigger(message, next) {
      if (predicate && predicate()) operation.dispose();
      else next();
    }
  }

  beforeAll(condition1, condition2, conditionN) {
    if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    let pending = 0
      , operation = this
      , predicates, timers;
    if (1 < arguments.length) each(arguments, setup);
    else if (isArray(condition1)) each(condition1, setup);
    else setup(condition1);
    return pending ? operation.onDispose(dispose).onTrigger(trigger) : operation.dispose();

    dispose() {
      each(timers, _clearTimeout);
      predicates = timers = undefined;
    }

    happen() {
      if (pending--) return false;
      operation.dispose();
      return true;
    }

    setup(condition) {
      if (isString(condition)) operation.onDispose(operation[BUS](condition).subscribe(happen).once().dispose);
      else if (isFunction(condition)) predicates ? predicates.push(condition) : (predicates = [condition]);
      else {
        if (isDate(condition)) condition = condition.valueOf() - Date.now();
        else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
        if (condition < 0) return;
        let timer = _setTimeout(happen, condition);
        timers ? timers.push(timer) : (timers = [timer]);
      }
      pending++;
    }

    trigger(message, next) {
      if (predicates)
        for (let i = -1, l = predicates.length; i < l; i++) {
          let predicate = predicates[i];
          if (!predicate || !predicate()) continue;
          if (happen()) return;
          predicates[i] = undefined;
        }
      next();
    }
  }

  beforeAny(condition1, condition2, conditionN) {
    if (!arguments.length) throw new Error(MESSAGE_ARGUMENTS);
    let pending = false
      , operation = this
      , predicates, subscriptions, timers;
    if (1 < arguments.length) each(arguments, setup);
    else if (isArray(condition1)) each(condition1, setup);
    else setup(condition1);
    return pending ? operation.onDispose(dispose).onTrigger(trigger) : operation.dispose();

    dispose() {
      each(subscriptions, 'dispose');
      each(timers, _clearTimeout);
      predicates = timers = undefined;
    }

    setup(condition) {
      if (isString(condition)) {
        var subscription = operation[BUS](condition).subscribe(operation.dispose).once();
        subscriptions ? subscriptions.push(subscription) : (subscriptions = [subscription]);
      } else if (isFunction(condition)) predicates ? predicates.push(condition) : (predicates = [condition]);
      else {
        if (isDate(condition)) condition = condition.valueOf() - Date.now();
        else if (!isNumber(condition)) throw new TypeError(MESSAGE_CONDITION);
        if (condition < 0) return;
        var timer = _setTimeout(operation.dispose, condition);
        timers ? timers.push(timer) : (timers = [timer]);
      }
      pending = true;
    }

    trigger(message, next) {
      if (predicates)
        for (var i = -1, l = predicates.length; i < l; i++)
          if (predicates[i]) return operation.dispose();
      next();
    }
  }
  // performs this operation once within specified interval between invocation attempts
  // if postpone is true this operation will be invoked at the end of interval
  // otherwise this operation will be invoked at the beginning of interval
  // interval must be positive number
  debounce(interval, postpone) {
    let timer;
    validateInterval(interval);
    return this.onDispose(dispose).onTrigger(postpone ? triggerPostponed : triggerImmediate);

    dispose() {
      _clearTimeout(timer);
    }

    triggerImmediate(message, next) {
      if (timer) _clearTimeout(timer);
      else next();
      timer = _setTimeout(function() {
        timer = undefined;
      }, interval);
    }

    triggerPostponed(message, next) {
      _clearTimeout(timer);
      timer = _setTimeout(function() {
        timer = undefined;
        next();
      }, interval);
    }
  }
  // delays this operation for specified interval
  // interval must be positive number
  delay(interval) {
    validateInterval(interval);
    let slots = [],
      timers = [];
    this.onDispose(dispose).onTrigger(trigger);
    return this;

    dispose() {
      each(timers, _clearTimeout);
      timers = undefined;
    }

    trigger(message, next) {
      let index = slots.length ? slots.pop() : timers.length;
      timers[index] = _setTimeout(function() {
        slots.push(index);
        next();
      }, interval);
    }
  }

  detach(channel) {
    if (!isChannel(channel)) throw new Error(MESSAGE_CHANNEL);
    let channels = this[CHANNELS]
      , index = channels.indexes[channel.name];
    if (isDefined(index)) {
      this[BUS].trace('detach', this, channel);
      channels.splice(index, 1);
      delete channels.indexes[channel.name];
      channel.detach(this);
      if (!channels.length) this.dispose();
    }
    return this;
  }

  dispose() {
    each(this[CHANNELS], 'detach', this);
  }
  // performs this operation only if callback returns trythy value
  filter(callback) {
    validateCallback(callback);
    return this.onTrigger(trigger);

    trigger(message, next) {
      next(callback(message.data, message) ? CONTINUE : SKIP);
    }
  }
  // returns list of channels this operation attached to
  getChannels() {
    return _ArraySlice.call(this[CHANNELS]);
  }
  // transforms messages being published
  map(callback) {
    validateCallback(callback);
    return this.onTrigger(trigger);

    trigger(message, next) {
      next(new Message(message, callback(message.data, message)));
    }
  }
  // performs this operation only once
  once() {
    return this.take(1);
  }
  // skips specified count of attempts to trigger this operation
  skip(count) {
    validateCount(count);
    return this.onTrigger(trigger);

    trigger(message, next) {
      next(--count < 0 ? CONTINUE : SKIP);
    }
  }
  // performs this operation only specified count of times then discards it
  take(count) {
    validateCount(count);
    return this.onTrigger(trigger);

    trigger(message, next) {
      next(--count < 1 ? FINISH : CONTINUE);
    }
  }
  // performs this operation once within specified interval ignoring other attempts
  // interval must be positive number
  throttle(interval) {
    validateInterval(interval);
    let timer;
    return this.onDispose(dispose).onTrigger(trigger);

    dispose() {
      _clearTimeout(timer);
    }

    trigger(message, next) {
      if (!timer) timer = _setTimeout(function() {
        timer = undefined;
        next();
      }, interval);
    }
  }
}
