'use strict';

import CycleStrategy
  from './cycleStrategy';
import { errorCallbackNotValid }
  from './errors';
import Forwarding
  from './forwarding';
import ShuffleStrategy
  from './shuffleStrategy';
import Subscription
  from './subscription';
import Unsubscription
  from './unsubscription';
import { getGear, isFunction, isSomething, noop, maxSafeInteger }
  from './utilites';

/**
 * Common public api for channels and sections.
 */
class Common {
  /**
   * Depending on value enables or disables publications bubbling for the related channel(s).
   *  If bubbling is enabled, the channel first delivers each publication to the parent channel
   *  and only then notifies own subscribers.
   * @param {boolean} [value]
   *  Omit or pass thruthy value to enable bubbling; falsey to disable.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  bubble(value = true) {
    getGear(this).bubble(value);
    return this;
  }

  /**
   * Empties related channel(s).
   *  Removes all #retentions and #subscribers.
   *  Keeps #forwarders as well as #enabled and #bubbles settings.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  clear() {
    getGear(this).clear();
    return this;
  }

  /**
   * Switches related channel(s) to use 'cycle' delivery strategy.
   *  Every publication will be delivered to the provided number of subscribers in rotation manner.
   * @param {number} [limit=1]
   *  The number of subsequent subscribers receiving next publication.
   * @param {number} [step]
   *  The number of subsequent subscribers to step over after each publication.
   *  If step is less than limit, selected subscribers will overlap.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  cycle(limit = 1, step) {
    getGear(this).cycle(CycleStrategy.create(limit, step));
    return this;
  }

  /**
   * Depending on provided value enables or disables related channel(s).
   *  Disabled channel supresses all future publications.
   * @param {boolean} [value]
   *  Omit or pass truthy value to enable; falsey to disable.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  enable(value = true) {
    getGear(this).enable(value);
    return this;
  }

  /**
   * Adds provided forwarders to the related channel(s).
   *  Forwarded message is not published to the channel
   *  unless any of forwarders resolves false/null/undefined value
   *  or explicit name of this channel.
   *  To eliminate infinite forwarding, channel will not forward any publication
   *  which already have traversed this channel.
   * @param {...function|string} [parameters]
   *  The name of destination channel;
   *  and/or the function resolving destination channel's name/array of names;
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If any forwarder has value other than false/function/null/string/undefined.
   *  If this object has been deleted.
   */
  forward(...parameters) {
    getGear(this).forward(new Forwarding(parameters));
    return this;
  }

  /**
   * Publishes message to the related channel(s).
   *  Bubbles publication to ancestor channels,
   *  then notifies own subscribers within try block.
   *  Any error thrown by a subscriber will be forwarded to the #bus.error callback.
   *  Subsequent subscribers are still notified even if preceeding subscriber throws.
   * @param {any} [data]
   *  The data to publish.
   * @param {function} [callback]
   *  Optional callback to invoke after publication has been delivered with single argument:
   *  array of results returned from all notified subscribers of all channels this publication was delivered to.
   *  When provided, forces message bus to use request/response pattern instead of publish/subscribe.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If callback is defined but is not a function.
   *  If this object has been deleted.
   */
  publish(data, callback) {
    if (isSomething(callback)) {
      if (!isFunction(callback))
        throw errorCallbackNotValid(callback);
      let results = [];
      getGear(this).publish(data, result => results.push(result));
      callback(results);
    }
    else getGear(this).publish(data, noop);
    return this;
  }

  /**
   * Resets related channel(s).
   *  Removes all #retentions and #subscriptions.
   *  Sets #bubbles and #enabled, resets #retentions.limit.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  reset() {
    getGear(this).reset();
    return this;
  }

  /**
   * Enables or disables retention policy for the related channel(s).
   *  Retention is a publication persisted in a channel
   *  and used to notify future subscribers right after their subscription.
   * @param {number} [limit]
   *  Number of retentions to persist (FIFO - first in, first out).
   *  When omitted or truthy, the channel retains all publications.
   *  When falsey, all retentions are removed and the channel stops retaining publications.
   *  Otherwise the channel retains at most provided limit of publications.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  retain(limit = maxSafeInteger) {
    getGear(this).retain(limit);
    return this;
  }

  /**
   * Switches related channel(s) to use 'shuffle' delivery strategy.
   *  Every publication will be delivered to the provided number of randomly selected subscribers
   *  in each related channel.
   * @param {number} [limit=1]
   *  The number of randomly selected subscribers per channel receiving next publication.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  shuffle(limit = 1) {
    getGear(this).shuffle(ShuffleStrategy.create(limit));
    return this;
  }

  /**
   * Subscribes all provided subscribers to the related channel(s).
   *  If there are messages retained in a channel,
   *  every subscriber will be immediately notified with all retentions.
   * @param {...function|number|object|string} [parameters]
   *  Subscriber function;
   *  and/or numeric order for all provided subscribers/observers (0 by default);
   *  and/or iterator/observer object implemeting "next" and optional "done" methods;
   *  and/or string name for all provided subscribers/observers.
   *  Subscribers with greater order are invoked later.
   *  All named subscribers can be unsubscribed at once by their name.
   *  The "next" method of an iterator/observer object is invoked
   *  for each publication being delivered with one argument: published message.
   *  The optional "done" method of an iterator/observer object is invoked
   *  once when it is being unsubscribed from the related channel(s).
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  subscribe(...parameters) {
    getGear(this).subscribe(new Subscription(parameters));
    return this;
  }

  /**
   * Toggles the enabled state of the related channel(s).
   *  Disables the enabled channel and vice versa.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  toggle() {
    getGear(this).toggle();
    return this;
  }

  /**
   * Unsubscribes provided subscribers/names or all subscribers from the related channel(s).
   * @param {...function|string|Subscriber} [parameters]
   *  Subscribers and/or subscriber names to unsubscribe.
   *  If not specified, unsubscribes all subscribers.
   * @returns {Channel|Section}
   *  This object.
   * @throws
   *  If this object has been deleted.
   */
  unsubscribe(...parameters) {
    getGear(this).unsubscribe(new Unsubscription(parameters));
    return this;
  }
}

export default Common;
