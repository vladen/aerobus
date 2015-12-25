## Classes
<dl>
<dt><a href="#Channel">Channel</a></dt>
<dd><p>Channel class.</p>
</dd>
<dt><a href="#Iterator">Iterator</a></dt>
<dd><p>Iterator class.</p>
</dd>
<dt><a href="#Message">Message</a></dt>
<dd><p>Message class.</p>
</dd>
<dt><a href="#Section">Section</a></dt>
<dd><p>Section class.</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#Aerobus">`Aerobus([...names])`</a> ⇒ <code><a href="#Channel">Channel</a></code> | <code><a href="#Section">Section</a></code></dt>
<dd><p>Message bus instance.
 Resolves channels and sections (sets of channels) depending on arguments provided.</p>
</dd>
<dt><a href="#aerobus">`aerobus(parameters)`</a> ⇒ <code><a href="#Aerobus">Aerobus</a></code></dt>
<dd><p>Message bus factory.
 Creates and returns new message bus instance.</p>
</dd>
</dl>
<a name="Aerobus"></a>
## `Aerobus([...names])` ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Message bus instance. Resolves channels and sections (sets of channels) depending on arguments provided.

**Kind**: global function  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - Resolved channel or section.  
**Throws**:

- If any name is not a string.

**Params**
- [...names] <code>string</code> - The channel names to resolve. If not provided resolves the root channel.  If one provided, resolves corresponding channel. Otherwise resolves section joining several channels into one logical unit.

**Properties**

- bubbles <code>boolean</code> - Gets the bubbling state of this bus.  
- delimiter <code>string</code> - Gets the delimiter string used to split hierarchical channel names.  
- channels <code>array</code> - Gets the list of existing channels.  
- error <code>[Channel](#Channel)</code> - Gets the error callback.  
- root <code>[Channel](#Channel)</code> - Gets the root channel.  
- trace <code>function</code> - Gets or sets the trace callback.  


* [`Aerobus([...names])`](#Aerobus) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [`.bubble(value)`](#Aerobus+bubble) ⇒ <code>function</code>
  * [`.clear()`](#Aerobus+clear) ⇒ <code>function</code>
  * [`.create([...overrides])`](#Aerobus+create) ⇒ <code>function</code>
  * [`.unsubscribe([...parameters])`](#Aerobus+unsubscribe) ⇒ <code>function</code>

<a name="Aerobus+bubble"></a>
### `aerobus.bubble(value)` ⇒ <code>function</code>
Enables or disables publication bubbling for this bus depending on value. Every newly created chanel will inherit this setting.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**
- value <code>boolean</code> <code> = true</code> - Truthy value to enable bubbling or falsey to disable.

<a name="Aerobus+clear"></a>
### `aerobus.clear()` ⇒ <code>function</code>
Empties this bus clearing and removing all existing channels.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**

<a name="Aerobus+create"></a>
### `aerobus.create([...overrides])` ⇒ <code>function</code>
Creates new bus instance which inherits settings from this instance.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - New message bus instance.  
**Params**
- [...overrides] <code>any</code> - The overrides of settings being inherited.

<a name="Aerobus+unsubscribe"></a>
### `aerobus.unsubscribe([...parameters])` ⇒ <code>function</code>
Unsubscribes provided subscribers or names from all channels of this bus.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**
- [...parameters] <code>function</code> | <code>string</code> | <code>Subscriber</code> - Subscribers and/or subscriber names to unsibscribe. If omitted, unsubscribes all subscribers from all channels.

<a name="Channel"></a>
## Channel
Channel class.

**Kind**: global class  
**Properties**

- bubbles <code>boolean</code> - Gets the bubbling state if this channel.  
- bus <code>[Aerobus](#Aerobus)</code> - Gets the bus instance owning this channel.  
- enabled <code>boolean</code> - Gets the enabled state of this channel.  
- name <code>string</code> - Gets the name if this channel (empty string for root channel).  
- parent <code>[Channel](#Channel)</code> - Gets the parent channel (undefined for root channel).  
- retentions <code>array</code> - Gets the list of retentions kept by this channel.  
- subscribers <code>array</code> - Gets the list of subscribers to this channel.  


* [Channel](#Channel)
  * [`.@@iterator()`](#Channel+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.bubble([value])`](#Channel+bubble) ⇒ <code>[Channel](#Channel)</code>
  * [`.clear()`](#Channel+clear) ⇒ <code>[Channel](#Channel)</code>
  * [`.cycle([limit], [step])`](#Channel+cycle) ⇒ <code>[Channel](#Channel)</code>
  * [`.enable([value])`](#Channel+enable) ⇒ <code>[Channel](#Channel)</code>
  * [`.forward([parameters])`](#Channel+forward) ⇒ <code>[Channel](#Channel)</code>
  * [`.publish([data], [callback])`](#Channel+publish) ⇒ <code>[Channel](#Channel)</code>
  * [`.reset()`](#Channel+reset) ⇒ <code>[Channel](#Channel)</code>
  * [`.retain([limit])`](#Channel+retain) ⇒ <code>[Channel](#Channel)</code>
  * [`.shuffle([limit])`](#Channel+shuffle) ⇒ <code>[Channel](#Channel)</code>
  * [`.subscribe([parameters])`](#Channel+subscribe) ⇒ <code>[Channel](#Channel)</code>
  * [`.toggle()`](#Channel+toggle) ⇒ <code>[Channel](#Channel)</code>
  * [`.unsubscribe([parameters])`](#Channel+unsubscribe) ⇒ <code>[Channel](#Channel)</code>

<a name="Channel+@@iterator"></a>
### `channel.@@iterator()` ⇒ <code>[Iterator](#Iterator)</code>
Returns async iterator for this channel. Async iterator returns promises resolving to messages being published.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Iterator](#Iterator)</code> - New instance of the Iterator class.  
<a name="Channel+bubble"></a>
### `channel.bubble([value])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables publications bubbling for this channel depending on value. If bubbling is enabled, the channel first delivers each publication to the parent channel and only then notifies own subscribers.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
**Params**
- [value] <code>boolean</code> - When thruthy or omitted, the channel bubbles publications; otherwise not.

<a name="Channel+clear"></a>
### `channel.clear()` ⇒ <code>[Channel](#Channel)</code>
Empties this channel. Removes all #retentions and #subscribers. Keeps #forwarders, #enabled and #bubbles settings.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+cycle"></a>
### `channel.cycle([limit], [step])` ⇒ <code>[Channel](#Channel)</code>
Switches this channel to use 'cycle' delivery strategy. Every publication will be delivered to the provided number of subscribers in rotation manner.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [limit] <code>number</code> <code> = 1</code> - The limit of subsequent subscribers receiving next publication.
- [step] <code>number</code> <code> = 1</code> - The number of subsequent subscribers to step over after next publication. If step is less than number, subscribers selected for a publication delivery will overlap.

<a name="Channel+enable"></a>
### `channel.enable([value])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables this channel depending on provided value. Disabled channel supresses all future publications.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [value] <code>boolean</code> - When thruthy or omitted, the channel enables; otherwise disables.

<a name="Channel+forward"></a>
### `channel.forward([parameters])` ⇒ <code>[Channel](#Channel)</code>
Adds provided forwarders to this channel. Forwarded message is not published to this channel unless any of forwarders resolves false/null/undefined value or explicit name of this channel. To eliminate infinite forwarding, channel will not forward any publication which already have traversed this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Throws**:

- If any forwarder has value other than false/function/null/string/undefined.

**Params**
- [parameters] <code>function</code> | <code>string</code> - The function resolving destination channel name or array of names.And/or string name of channel to forward publications to.

<a name="Channel+publish"></a>
### `channel.publish([data], [callback])` ⇒ <code>[Channel](#Channel)</code>
Publishes message to this channel. Bubbles publication to ancestor channels, then notifies own subscribers within try block. Any error thrown by a subscriber will be forwarded to the #bus.error callback. Subsequent subscribers will still be notified even if preceeding subscriber throws.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Throws**:

- If callback is not a function.

**Params**
- [data] <code>any</code> - The data to publish.
- [callback] <code>function</code> - The callback to invoke after publication has been delivered. This callback receives single argument: array of results returned from all notified subscribers of all channels this publication was delivered to. When provided, forces message bus to use request/response pattern instead of publish/subscribe one.

<a name="Channel+reset"></a>
### `channel.reset()` ⇒ <code>[Channel](#Channel)</code>
Resets this channel. Removes all #retentions and #subscriptions, sets #bubbles, sets #enabled and resets #retentions.limit.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+retain"></a>
### `channel.retain([limit])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables retention policy for this channel. Retention is a publication persisted in the channel and used to notify future subscribers right after their subscription.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [limit] <code>number</code> - Number of retentions to persist (LIFO). When omitted or truthy, the channel retains all publications. When falsey, all retentions are removed and the channel stops retaining publications. Otherwise the channel retains at most provided limit of publications.

<a name="Channel+shuffle"></a>
### `channel.shuffle([limit])` ⇒ <code>[Channel](#Channel)</code>
Switches this channel to use 'shuffle' delivery strategy. Every publication will be delivered to provided number of random subscribers.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [limit] <code>number</code> <code> = 1</code> - The limit of random subscribers receiving next publication.

<a name="Channel+subscribe"></a>
### `channel.subscribe([parameters])` ⇒ <code>[Channel](#Channel)</code>
Subscribes all provided subscribers to this channel. If there are retained messages, every subscriber will be notified with all retentions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [parameters] <code>function</code> | <code>number</code> | <code>object</code> | <code>string</code> - Subscriber functions to subscribe; and/or object implemeting observer interface containing "next" and "done" methods. and/or numeric order for all provided subscribers (0 by default); and/or string name for all provided subscribers. Subscribers with greater order are invoked later. All named subscribers can be unsubscribed at once by their name. The "next" method of observer object is invoked for each publication being delivered with single argument: published message. The "done" method of observer object is invoked when observer has bee unsubscribed from this channel.

<a name="Channel+toggle"></a>
### `channel.toggle()` ⇒ <code>[Channel](#Channel)</code>
Enables this channel if it is disabled; otherwise disables it.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+unsubscribe"></a>
### `channel.unsubscribe([parameters])` ⇒ <code>[Channel](#Channel)</code>
Unsubscribes all subscribers or provided subscribers or subscribers with provided names from this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [parameters] <code>function</code> | <code>string</code> | <code>Subscriber</code> - Subscribers and/or subscriber names to unsubscribe.

<a name="Iterator"></a>
## Iterator
Iterator class.

**Kind**: global class  

* [Iterator](#Iterator)
  * [`.done()`](#Iterator+done)
  * [`.next()`](#Iterator+next) ⇒ <code>object</code>

<a name="Iterator+done"></a>
### `iterator.done()`
Ends iteration of this channel/section and closes the iterator.

**Kind**: instance method of <code>[Iterator](#Iterator)</code>  
<a name="Iterator+next"></a>
### `iterator.next()` ⇒ <code>object</code>
Produces next message has been published or going to be published to this channel/section.

**Kind**: instance method of <code>[Iterator](#Iterator)</code>  
**Returns**: <code>object</code> - Object containing whether 'done' or 'value' properties. The 'value' property returns a Promise resolving to the next message. The 'done' property returns true if the iteration has been ended with #done method call or owning bus/channel/section clearance/reseting.  
<a name="Message"></a>
## Message
Message class.

**Kind**: global class  
**Properties**

- data <code>any</code> - The published data.  
- destination <code>string</code> - The channel name this message is directed to.  
- route <code>array</code> - The array of channel names this message has traversed.  

<a name="Section"></a>
## Section
Section class.

**Kind**: global class  
**Properties**

- channels <code>Array</code> - The array of channels this section unites.  


* [Section](#Section)
  * [`.@@iterator()`](#Section+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.bubble(value)`](#Section+bubble) ⇒ <code>[Section](#Section)</code>
  * [`.clear()`](#Section+clear) ⇒ <code>[Section](#Section)</code>
  * [`.enable(value)`](#Section+enable) ⇒ <code>[Section](#Section)</code>
  * [`.publish()`](#Section+publish) ⇒ <code>[Section](#Section)</code>
  * [`.reset()`](#Section+reset) ⇒ <code>[Section](#Section)</code>
  * [`.retain()`](#Section+retain) ⇒ <code>[Section](#Section)</code>
  * [`.subscribe()`](#Section+subscribe) ⇒ <code>[Section](#Section)</code>
  * [`.toggle()`](#Section+toggle) ⇒ <code>[Section](#Section)</code>
  * [`.unsubscribe()`](#Section+unsubscribe) ⇒ <code>[Section](#Section)</code>

<a name="Section+@@iterator"></a>
### `section.@@iterator()` ⇒ <code>[Iterator](#Iterator)</code>
Returns async iterator for this section. The iterator will iterate publications to all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Iterator](#Iterator)</code> - New instance of the Iterator class.  
<a name="Section+bubble"></a>
### `section.bubble(value)` ⇒ <code>[Section](#Section)</code>
Configures bubbling for all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
**Params**
- value <code>Boolean</code> - Truthy value to set channels bubbling; falsey to clear.

<a name="Section+clear"></a>
### `section.clear()` ⇒ <code>[Section](#Section)</code>
Clears all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+enable"></a>
### `section.enable(value)` ⇒ <code>[Section](#Section)</code>
Enables or disabled all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
**Params**
- value <code>Boolean</code> - Truthy value to enable channels; falsey to disable.

<a name="Section+publish"></a>
### `section.publish()` ⇒ <code>[Section](#Section)</code>
Publishes message to all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+reset"></a>
### `section.reset()` ⇒ <code>[Section](#Section)</code>
Resets all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+retain"></a>
### `section.retain()` ⇒ <code>[Section](#Section)</code>
Enables or disables retention policy for all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+subscribe"></a>
### `section.subscribe()` ⇒ <code>[Section](#Section)</code>
Subscribes all provided subscribers to all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+toggle"></a>
### `section.toggle()` ⇒ <code>[Section](#Section)</code>
Toggles enabled state of all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+unsubscribe"></a>
### `section.unsubscribe()` ⇒ <code>[Section](#Section)</code>
Unsubscribes all provided subscribers from all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="aerobus"></a>
## `aerobus(parameters)` ⇒ <code>[Aerobus](#Aerobus)</code>
Message bus factory. Creates and returns new message bus instance.

**Kind**: global function  
**Returns**: <code>[Aerobus](#Aerobus)</code> - New instance of Aerobus class wrapped to function resolving channels and sections and exposing some additional API members.  
**Throws**:

- If any option is of unsupported type (boolean, function, object, string); or option object contains non-string or empty "delimiter" property; or option object contains non-function "error" property; or option object contains non-function "trace" property; or option object contains non-object "channel" property; or option object contains non-object "message" property; or option object contains non-object "section" property. or option string is empty.

**Params**
- parameters <code>String</code> | <code>function</code> | <code>object</code> - The boolean value defining default bubbling behavior; and/or the string delimiter of hierarchical channel names (dot by default); and/or the error callback, invoked asynchronously with (error, message) arguments when any subscriber throws; and/or the object literal with settings to configure (bubbles, delimiter, error, trace) and extesions for internal classes: channel, message and section.

