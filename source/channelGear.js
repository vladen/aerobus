'use strict';

import { errorNameNotValid }
  from './errors';
import { CLASS_AEROBUS_MESSAGE }
  from './symbols';
import { classOf, finalize, getGear, isFunction, isArray, isNothing, isNumber, isString, mathMax, maxSafeInteger }
  from './utilites';

// Internal representation of a channel as a publication/subscription destination.
class ChannelGear {
  constructor(bus, name, parent, trace) {
    this.bubbles = bus.bubbles;
    this.bus = bus;
    this.enabled = true;
    this.name = name;
    if (parent)
      this.parent = getGear(parent);
    this.trace = trace;
    trace('create');
  }
  // determine enabled state
  get isEnabled() {
    let parent = this.parent;
    return this.enabled && (!parent || parent.isEnabled);
  }
  // set bubbling behavior based on verity of 'value' argument
  bubble(value) {
    value = !!value;
    this.trace('bubble', value);
    this.bubbles = value;
  }
  // clear all observers, retentions and subscriptions
  clear() {
    this.trace('clear');
    let error = this.bus.error
      , observers = this.observers
      , retentions = this.retentions
      , subscribers = this.subscribers;
    // clear retentions
    if (retentions)
      retentions.length = 0;
    // finalize and clear observers
    if (observers) {
      finalize(observers, error);
      delete this.observers;
    }
    // finalize and clear subscribers
    if (subscribers) {
      finalize(subscribers, error);
      delete this.subscribers;
    }
  }
  // switch to 'cycle' publication strategy or disable publication strategy depending on 'limit' argument
  cycle(strategy) {
    if (strategy) {
      this.trace('cycle', strategy.limit, strategy.step);
      this.strategy = strategy;
    }
    else {
      this.trace('cycle', 0, 0);
      delete this.strategy;
    }
  }
  // set enabled state based on verity of 'value' argument
  enable(value) {
    value = !!value;
    this.trace('enable', value);
    this.enabled = value;
  }
  // append forwarding rules
  forward(forwarding) {
    let collection = this.forwarders
      , forwarders = forwarding.forwarders;
    this.trace('forward', forwarders);
    if (collection)
      collection.push(...forwarders);
    else this.forwarders = forwarders.slice();
  }
  // append observer
  observe(observer) {
    let existing = this.observers;
    this.observers = existing
      ? existing.concat(observer)
      : [observer];
  }
  // publish a message
  publish(message, callback) {
    this.trace('publish', message);
    if (!this.isEnabled) return;
    let Message = this.bus.Message
      , observers = this.observers
      , skip = false;
    // if message is an instance of Message class
    message = classOf(message) === CLASS_AEROBUS_MESSAGE
      // then clone it and append this channel name to routes
      ? new Message(message.data, message.id, [this.name].concat(message.route))
      // otherwise create new instance of Message class
      : new Message(message, ++this.bus.id, [this.name]);
    // notify all observers with message
    if (observers)
      for (let i = -1, l = observers.length; ++i < l;) {
        let observer = observers[i];
        if (observer)
          observer.next(message);
      }

    if (!message.route.includes(this.name, 1)) {
      let forwarders = this.forwarders;
      if (forwarders) {
        let destinations = new Set;
        skip = true;
        for (let i = -1, l = forwarders.length; ++i < l;) {
          let forwarder = forwarders[i]
            , names = isFunction(forwarder)
              ? forwarder(message.data, message)
              : forwarder;
          if (isArray(names))
            for (let j = -1, m = names.length; ++j < m;) {
              let name = names[j];
              if (isNothing(name) || this.name === name)
                skip = false;
              else if (isString(name))
                destinations.add(name);
              else throw errorNameNotValid(name);
            }
          else if (isNothing(names) || this.name === names)
            skip = false;
          else if (isString(names))
            destinations.add(names);
          else throw errorNameNotValid(names);
        }
        for (let destination of destinations) {
          let result = getGear(this.bus.get(destination)).publish(message, callback);
          if (result === message.cancel)
            return result;
        }
      }
    }

    if (skip) return;

    let retentions = this.retentions;
    if (retentions) {
      retentions.push(message);
      if (retentions.length > retentions.limit)
        retentions.shift();
    }

    if (this.bubbles) {
      let parent = this.parent;
      if (parent) {
        let result = parent.publish(message, callback);
        if (result === message.cancel)
          return result;
      }
    }

    let subscribers = this.subscribers;
    if (!subscribers) return;
    let strategy = this.strategy;
    if (strategy)
      subscribers = strategy.select(subscribers);
    for (let i = -1, l = subscribers.length; ++i < l;) {
      let subscriber = subscribers[i];
      if (subscriber)
        try {
          let result = subscriber.next(message.data, message);
          if (result === message.cancel)
            return result;
          callback(result);
        }
        catch(error) {
          callback(error);
          setImmediate(() => this.bus.error(error, message));
        }
    }
  }

  reset() {
    this.trace('reset');
    let error = this.bus.error
      , observers = this.observers
      , subscribers = this.subscribers;
    // reset all properties
    this.enabled = true;
    delete this.forwarders;
    delete this.observers;
    delete this.plans;
    delete this.retentions;
    delete this.strategy;
    delete this.subscribers;
    delete this.subscriptions;
    // finalize observers
    if (observers)
      finalize(observers, error);
    // finalize subscribers
    if (subscribers)
      finalize(subscribers, error);
  }
  // enable or disable retention policy depending on 'limit' argument
  retain(limit) {
    // normalize limit setting
    limit = isNumber(limit)
      ? mathMax(limit, 0)
      : limit
        ? maxSafeInteger
        : 0;
    this.trace('retain', limit);
    // if limit is greater than zero, enable policy
    if (limit) {
      let collection = this.retentions;
      // if policy is already enabled
      if (collection) {
        // trim retentions to limit
        if (collection.length > limit)
          collection = this.retentions = collection.slice(collection.length - limit);
        // set new limit
        collection.limit = limit;
      }
      // or enable policy
      else {
        this.retentions = [];
        this.retentions.limit = limit;
      }
    }
    // otherwise delete retentions collection to disable policy
    else delete this.retentions;
  }
  // switch to 'shuffle' publication strategy or disable publication strategy depending on 'limit' argument
  shuffle(strategy) {
    this.trace('shuffle', strategy.limit);
    if (strategy) this.strategy = strategy;
    else delete this.strategy;
  }

  subscribe(subscription) {
    this.trace('subscribe', subscription.parameters);

    let collection = this.subscribers
      , retentions = this.retentions
      , subscribers = subscription.subscribers;

    if (collection)
      for (let i = -1, l = subscribers.length; ++i < l;) {
        let subscriber = subscribers[i]
          , last = collection.length - 1;

        if (collection[last].order <= subscriber.order)
          collection.push(subscriber);
        else {
          while (last > 0 && collection[last] > subscriber.order)
            last--;
          collection.splice(last, 0, subscriber);
        }
      }
    else this.subscribers = subscribers.slice();

    if (retentions)
      for (let i = -1, l = subscribers.length; ++i < l;) {
        let subscriber = subscribers[i];
        for (let j = -1, m = retentions.length; ++j < m;) {
          let retention = retentions[j];
          try {
            subscriber.next(retention.data, retention);
          }
          catch(error) {
            setImmediate(() => this.bus.error(error, retention));
          }
        }
      }
  }

  toggle() {
    this.trace('toggle');
    this.enabled = !this.enabled;
  }

  unobserve(observer) {
    let existing = this.observers
      , excepted = [];
    if (existing)
      for (let j = existing.length; --j;) {
        let candidate = existing[j];
        if (observer === candidate) existing[j] = null;
        else excepted.push(observer);
      }
    if (excepted.length) this.observers = excepted;
    else delete this.observers;
  }

  unsubscribe(unsubscription) {
    this.trace('unsubscribe', unsubscription.parameters);
    let collection = this.subscribers
      , predicates = unsubscription.predicates;
    if (!collection)
      return;

    if (predicates.length) {
      let unsubscribed = 0;
      for (let i = collection.length; i--;) {
        let subscriber = collection[i];
        if (subscriber) for (let j = predicates.length; j--;)
          if (predicates[j](subscriber)) {
            collection[i] = null;
            unsubscribed++;
            try {
              subscriber.done();
            }
            catch (error) {
              setImmediate(() => this.bus.error(error));
            }
            break;
          }
      }

      if (unsubscribed < collection.length) {
        let subscribers = [];
        for (let i = collection.length; i--;) {
          let subscriber = collection[i];
          if (subscriber) subscribers.push(subscriber);
        }
        this.subscribers = subscribers;
      }
      else delete this.subscribers;
    }
    else {
      for (let i = collection.length; i--;)
        try {
          collection[i].done();
        }
        catch (error) {
          setImmediate(() => this.bus.error(error));
        }
      delete this.subscribers;
    }
  }
}

export default ChannelGear;
