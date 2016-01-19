## Classes
<dl>
<dt><a href="#Channel">Channel</a> ⇐ <code><a href="#Common">Common</a></code></dt>
<dd><p>Channel class.</p>
</dd>
<dt><a href="#Common">Common</a></dt>
<dd><p>Common public api for channels and sections.</p>
</dd>
<dt><a href="#Message">Message</a></dt>
<dd><p>Message class.</p>
</dd>
<dt><a href="#Section">Section</a> ⇐ <code><a href="#Common">Common</a></code></dt>
<dd><p>Section class.</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#Aerobus">Aerobus([...names])</a> ⇒ <code><a href="#Channel">Channel</a></code> | <code><a href="#Section">Section</a></code></dt>
<dd><p>A message bus instance.
 Depending on arguments provided resolves channels and sets of channels (sections).</p>
</dd>
</dl>
<a name="Aerobus"></a>
## Aerobus([...names]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
A message bus instance. Depending on arguments provided resolves channels and sets of channels (sections).

**Kind**: global function  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - Resolved channel or section.  
**Throws**:

- If any name is not a string.

**Params**
- [...names] <code>string</code> - The channel names to resolve. If not provided resolves the root channel. If one provided, resolves corresponding channel. Otherwise resolves section joining several channels into one logical unit.

**Properties**

- bubbles <code>boolean</code> - Gets the bubbling state of this bus.  
- delimiter <code>string</code> - Gets the delimiter string used to split hierarchical channel names.  
- channels <code>array</code> - Gets the list of existing channels.  
- error <code>[Channel](#Channel)</code> - Gets the error callback.  
- root <code>[Channel](#Channel)</code> - Gets the root channel.  
- trace <code>function</code> - Gets or sets the trace callback.  


* [Aerobus([...names])](#Aerobus) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.bubble(value)](#Aerobus+bubble) ⇒ <code>function</code>
  * [.clear()](#Aerobus+clear) ⇒ <code>function</code>
  * [.create([...overrides])](#Aerobus+create) ⇒ <code>function</code>
  * [.unsubscribe([...parameters])](#Aerobus+unsubscribe) ⇒ <code>function</code>

<a name="Aerobus+bubble"></a>
### aerobus.bubble(value) ⇒ <code>function</code>
Enables or disables publication bubbling for this bus depending on value. Every newly created chanel will inherit this setting.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**
- value <code>boolean</code> <code> = true</code> - Truthy value to enable bubbling or falsey to disable.

<a name="Aerobus+clear"></a>
### aerobus.clear() ⇒ <code>function</code>
Empties this bus clearing and removing all existing channels.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**

<a name="Aerobus+create"></a>
### aerobus.create([...overrides]) ⇒ <code>function</code>
Creates new bus instance which inherits settings from this instance.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - New message bus instance.  
**Params**
- [...overrides] <code>any</code> - The overrides of settings being inherited.

<a name="Aerobus+unsubscribe"></a>
### aerobus.unsubscribe([...parameters]) ⇒ <code>function</code>
Unsubscribes provided subscribers or names from all channels of this bus.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**
- [...parameters] <code>function</code> | <code>string</code> | <code>Subscriber</code> - Subscribers and/or subscriber names to unsibscribe. If omitted, unsubscribes all subscribers from all channels.

<a name="Channel"></a>
## Channel ⇐ <code>[Common](#Common)</code>
Channel class.

**Kind**: global class  
**Extends:** <code>[Common](#Common)</code>  
**Properties**

- bubbles <code>boolean</code> - Gets the bubbling state if this channel.  
- bus <code>[Aerobus](#Aerobus)</code> - Gets the bus instance owning this channel.  
- enabled <code>boolean</code> - Gets the enabled state of this channel.  
- name <code>string</code> - Gets the name if this channel (empty string for root channel).  
- parent <code>[Channel](#Channel)</code> - Gets the parent channel (undefined for root channel).  
- retentions <code>array</code> - Gets the list of retentions kept by this channel.  
- subscribers <code>array</code> - Gets the list of subscribers to this channel.  


* [Channel](#Channel) ⇐ <code>[Common](#Common)</code>
  * [.bubble([value])](#Common+bubble) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.clear()](#Common+clear) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.cycle([limit], [step])](#Common+cycle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.enable([value])](#Common+enable) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.forward([parameters])](#Common+forward) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.publish([data], [callback])](#Common+publish) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.reset()](#Common+reset) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.retain([limit])](#Common+retain) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.shuffle([limit])](#Common+shuffle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.subscribe([parameters])](#Common+subscribe) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.toggle()](#Common+toggle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.unsubscribe([parameters])](#Common+unsubscribe) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>

<a name="Common+bubble"></a>
### channel.bubble([value]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Depending on value enables or disables publications bubbling for the related channel(s). If bubbling is enabled, the channel first delivers each publication to the parent channel and only then notifies own subscribers.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [value] <code>boolean</code> - Omit or pass thruthy value to enable bubbling; falsey to disable.

<a name="Common+clear"></a>
### channel.clear() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Empties related channel(s). Removes all #retentions and #subscribers. Keeps #forwarders as well as #enabled and #bubbles settings.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+cycle"></a>
### channel.cycle([limit], [step]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Switches related channel(s) to use 'cycle' delivery strategy. Every publication will be delivered to the provided number of subscribers in rotation manner.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> <code> = 1</code> - The number of subsequent subscribers receiving next publication.
- [step] <code>number</code> - The number of subsequent subscribers to step over after each publication. If step is less than limit, selected subscribers will overlap.

<a name="Common+enable"></a>
### channel.enable([value]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Depending on provided value enables or disables related channel(s). Disabled channel supresses all future publications.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [value] <code>boolean</code> - Omit or pass truthy value to enable; falsey to disable.

<a name="Common+forward"></a>
### channel.forward([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Adds provided forwarders to the related channel(s). Forwarded message is not published to the channel unless any of forwarders resolves false/null/undefined value or explicit name of this channel. To eliminate infinite forwarding, channel will not forward any publication which already have traversed this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If any forwarder has value other than false/function/null/string/undefined. If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>string</code> - The name of destination channel; and/or the function resolving destination channel's name/array of names;

<a name="Common+publish"></a>
### channel.publish([data], [callback]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Publishes message to the related channel(s). Bubbles publication to ancestor channels, then notifies own subscribers within try block. Any error thrown by a subscriber will be forwarded to the #bus.error callback. Subsequent subscribers are still notified even if preceeding subscriber throws.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If callback is defined but is not a function. If this object has been deleted.

**Params**
- [data] <code>any</code> - The data to publish.
- [callback] <code>function</code> - Optional callback to invoke after publication has been delivered with single argument: array of results returned from all notified subscribers of all channels this publication was delivered to. When provided, forces message bus to use request/response pattern instead of publish/subscribe.

<a name="Common+reset"></a>
### channel.reset() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Resets related channel(s). Removes all #retentions and #subscriptions. Sets #bubbles and #enabled, resets #retentions.limit.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+retain"></a>
### channel.retain([limit]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Enables or disables retention policy for the related channel(s). Retention is a publication persisted in a channel and used to notify future subscribers right after their subscription.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> - Number of retentions to persist (FIFO - first in, first out). When omitted or truthy, the channel retains all publications. When falsey, all retentions are removed and the channel stops retaining publications. Otherwise the channel retains at most provided limit of publications.

<a name="Common+shuffle"></a>
### channel.shuffle([limit]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Switches related channel(s) to use 'shuffle' delivery strategy. Every publication will be delivered to the provided number of randomly selected subscribers in each related channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> <code> = 1</code> - The number of randomly selected subscribers per channel receiving next publication.

<a name="Common+subscribe"></a>
### channel.subscribe([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Subscribes all provided subscribers to the related channel(s). If there are messages retained in a channel, every subscriber will be immediately notified with all retentions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>number</code> | <code>object</code> | <code>string</code> - Subscriber function; and/or numeric order for all provided subscribers/observers (0 by default); and/or iterator/observer object implemeting "next" and optional "done" methods; and/or string name for all provided subscribers/observers. Subscribers with greater order are invoked later. All named subscribers can be unsubscribed at once by their name. The "next" method of an iterator/observer object is invoked for each publication being delivered with one argument: published message. The optional "done" method of an iterator/observer object is invoked once when it is being unsubscribed from the related channel(s).

<a name="Common+toggle"></a>
### channel.toggle() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Toggles the enabled state of the related channel(s). Disables the enabled channel and vice versa.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+unsubscribe"></a>
### channel.unsubscribe([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Unsubscribes provided subscribers/names or all subscribers from the related channel(s).

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>string</code> | <code>Subscriber</code> - Subscribers and/or subscriber names to unsubscribe. If not specified, unsubscribes all subscribers.

<a name="Common"></a>
## Common
Common public api for channels and sections.

**Kind**: global class  

* [Common](#Common)
  * [.bubble([value])](#Common+bubble) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.clear()](#Common+clear) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.cycle([limit], [step])](#Common+cycle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.enable([value])](#Common+enable) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.forward([parameters])](#Common+forward) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.publish([data], [callback])](#Common+publish) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.reset()](#Common+reset) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.retain([limit])](#Common+retain) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.shuffle([limit])](#Common+shuffle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.subscribe([parameters])](#Common+subscribe) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.toggle()](#Common+toggle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.unsubscribe([parameters])](#Common+unsubscribe) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>

<a name="Common+bubble"></a>
### common.bubble([value]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Depending on value enables or disables publications bubbling for the related channel(s). If bubbling is enabled, the channel first delivers each publication to the parent channel and only then notifies own subscribers.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [value] <code>boolean</code> - Omit or pass thruthy value to enable bubbling; falsey to disable.

<a name="Common+clear"></a>
### common.clear() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Empties related channel(s). Removes all #retentions and #subscribers. Keeps #forwarders as well as #enabled and #bubbles settings.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+cycle"></a>
### common.cycle([limit], [step]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Switches related channel(s) to use 'cycle' delivery strategy. Every publication will be delivered to the provided number of subscribers in rotation manner.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> <code> = 1</code> - The number of subsequent subscribers receiving next publication.
- [step] <code>number</code> - The number of subsequent subscribers to step over after each publication. If step is less than limit, selected subscribers will overlap.

<a name="Common+enable"></a>
### common.enable([value]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Depending on provided value enables or disables related channel(s). Disabled channel supresses all future publications.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [value] <code>boolean</code> - Omit or pass truthy value to enable; falsey to disable.

<a name="Common+forward"></a>
### common.forward([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Adds provided forwarders to the related channel(s). Forwarded message is not published to the channel unless any of forwarders resolves false/null/undefined value or explicit name of this channel. To eliminate infinite forwarding, channel will not forward any publication which already have traversed this channel.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If any forwarder has value other than false/function/null/string/undefined. If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>string</code> - The name of destination channel; and/or the function resolving destination channel's name/array of names;

<a name="Common+publish"></a>
### common.publish([data], [callback]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Publishes message to the related channel(s). Bubbles publication to ancestor channels, then notifies own subscribers within try block. Any error thrown by a subscriber will be forwarded to the #bus.error callback. Subsequent subscribers are still notified even if preceeding subscriber throws.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If callback is defined but is not a function. If this object has been deleted.

**Params**
- [data] <code>any</code> - The data to publish.
- [callback] <code>function</code> - Optional callback to invoke after publication has been delivered with single argument: array of results returned from all notified subscribers of all channels this publication was delivered to. When provided, forces message bus to use request/response pattern instead of publish/subscribe.

<a name="Common+reset"></a>
### common.reset() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Resets related channel(s). Removes all #retentions and #subscriptions. Sets #bubbles and #enabled, resets #retentions.limit.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+retain"></a>
### common.retain([limit]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Enables or disables retention policy for the related channel(s). Retention is a publication persisted in a channel and used to notify future subscribers right after their subscription.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> - Number of retentions to persist (FIFO - first in, first out). When omitted or truthy, the channel retains all publications. When falsey, all retentions are removed and the channel stops retaining publications. Otherwise the channel retains at most provided limit of publications.

<a name="Common+shuffle"></a>
### common.shuffle([limit]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Switches related channel(s) to use 'shuffle' delivery strategy. Every publication will be delivered to the provided number of randomly selected subscribers in each related channel.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> <code> = 1</code> - The number of randomly selected subscribers per channel receiving next publication.

<a name="Common+subscribe"></a>
### common.subscribe([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Subscribes all provided subscribers to the related channel(s). If there are messages retained in a channel, every subscriber will be immediately notified with all retentions.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>number</code> | <code>object</code> | <code>string</code> - Subscriber function; and/or numeric order for all provided subscribers/observers (0 by default); and/or iterator/observer object implemeting "next" and optional "done" methods; and/or string name for all provided subscribers/observers. Subscribers with greater order are invoked later. All named subscribers can be unsubscribed at once by their name. The "next" method of an iterator/observer object is invoked for each publication being delivered with one argument: published message. The optional "done" method of an iterator/observer object is invoked once when it is being unsubscribed from the related channel(s).

<a name="Common+toggle"></a>
### common.toggle() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Toggles the enabled state of the related channel(s). Disables the enabled channel and vice versa.

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+unsubscribe"></a>
### common.unsubscribe([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Unsubscribes provided subscribers/names or all subscribers from the related channel(s).

**Kind**: instance method of <code>[Common](#Common)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>string</code> | <code>Subscriber</code> - Subscribers and/or subscriber names to unsubscribe. If not specified, unsubscribes all subscribers.

<a name="Message"></a>
## Message
Message class.

**Kind**: global class  
**Properties**

- data <code>any</code> - The published data.  
- destination <code>string</code> - The channel name this message is directed to.  
- route <code>array</code> - The array of channel names this message has traversed.  

<a name="Section"></a>
## Section ⇐ <code>[Common](#Common)</code>
Section class.

**Kind**: global class  
**Extends:** <code>[Common](#Common)</code>  
**Properties**

- channels <code>Array</code> - The array of channels this section relates.  


* [Section](#Section) ⇐ <code>[Common](#Common)</code>
  * [.bubble([value])](#Common+bubble) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.clear()](#Common+clear) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.cycle([limit], [step])](#Common+cycle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.enable([value])](#Common+enable) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.forward([parameters])](#Common+forward) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.publish([data], [callback])](#Common+publish) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.reset()](#Common+reset) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.retain([limit])](#Common+retain) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.shuffle([limit])](#Common+shuffle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.subscribe([parameters])](#Common+subscribe) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.toggle()](#Common+toggle) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [.unsubscribe([parameters])](#Common+unsubscribe) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>

<a name="Common+bubble"></a>
### section.bubble([value]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Depending on value enables or disables publications bubbling for the related channel(s). If bubbling is enabled, the channel first delivers each publication to the parent channel and only then notifies own subscribers.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [value] <code>boolean</code> - Omit or pass thruthy value to enable bubbling; falsey to disable.

<a name="Common+clear"></a>
### section.clear() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Empties related channel(s). Removes all #retentions and #subscribers. Keeps #forwarders as well as #enabled and #bubbles settings.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+cycle"></a>
### section.cycle([limit], [step]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Switches related channel(s) to use 'cycle' delivery strategy. Every publication will be delivered to the provided number of subscribers in rotation manner.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> <code> = 1</code> - The number of subsequent subscribers receiving next publication.
- [step] <code>number</code> - The number of subsequent subscribers to step over after each publication. If step is less than limit, selected subscribers will overlap.

<a name="Common+enable"></a>
### section.enable([value]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Depending on provided value enables or disables related channel(s). Disabled channel supresses all future publications.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [value] <code>boolean</code> - Omit or pass truthy value to enable; falsey to disable.

<a name="Common+forward"></a>
### section.forward([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Adds provided forwarders to the related channel(s). Forwarded message is not published to the channel unless any of forwarders resolves false/null/undefined value or explicit name of this channel. To eliminate infinite forwarding, channel will not forward any publication which already have traversed this channel.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If any forwarder has value other than false/function/null/string/undefined. If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>string</code> - The name of destination channel; and/or the function resolving destination channel's name/array of names;

<a name="Common+publish"></a>
### section.publish([data], [callback]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Publishes message to the related channel(s). Bubbles publication to ancestor channels, then notifies own subscribers within try block. Any error thrown by a subscriber will be forwarded to the #bus.error callback. Subsequent subscribers are still notified even if preceeding subscriber throws.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If callback is defined but is not a function. If this object has been deleted.

**Params**
- [data] <code>any</code> - The data to publish.
- [callback] <code>function</code> - Optional callback to invoke after publication has been delivered with single argument: array of results returned from all notified subscribers of all channels this publication was delivered to. When provided, forces message bus to use request/response pattern instead of publish/subscribe.

<a name="Common+reset"></a>
### section.reset() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Resets related channel(s). Removes all #retentions and #subscriptions. Sets #bubbles and #enabled, resets #retentions.limit.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+retain"></a>
### section.retain([limit]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Enables or disables retention policy for the related channel(s). Retention is a publication persisted in a channel and used to notify future subscribers right after their subscription.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> - Number of retentions to persist (FIFO - first in, first out). When omitted or truthy, the channel retains all publications. When falsey, all retentions are removed and the channel stops retaining publications. Otherwise the channel retains at most provided limit of publications.

<a name="Common+shuffle"></a>
### section.shuffle([limit]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Switches related channel(s) to use 'shuffle' delivery strategy. Every publication will be delivered to the provided number of randomly selected subscribers in each related channel.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [limit] <code>number</code> <code> = 1</code> - The number of randomly selected subscribers per channel receiving next publication.

<a name="Common+subscribe"></a>
### section.subscribe([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Subscribes all provided subscribers to the related channel(s). If there are messages retained in a channel, every subscriber will be immediately notified with all retentions.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>number</code> | <code>object</code> | <code>string</code> - Subscriber function; and/or numeric order for all provided subscribers/observers (0 by default); and/or iterator/observer object implemeting "next" and optional "done" methods; and/or string name for all provided subscribers/observers. Subscribers with greater order are invoked later. All named subscribers can be unsubscribed at once by their name. The "next" method of an iterator/observer object is invoked for each publication being delivered with one argument: published message. The optional "done" method of an iterator/observer object is invoked once when it is being unsubscribed from the related channel(s).

<a name="Common+toggle"></a>
### section.toggle() ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Toggles the enabled state of the related channel(s). Disables the enabled channel and vice versa.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

<a name="Common+unsubscribe"></a>
### section.unsubscribe([parameters]) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Unsubscribes provided subscribers/names or all subscribers from the related channel(s).

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - This object.  
**Throws**:

- If this object has been deleted.

**Params**
- [parameters] <code>function</code> | <code>string</code> | <code>Subscriber</code> - Subscribers and/or subscriber names to unsubscribe. If not specified, unsubscribes all subscribers.

