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
Resolves channels and sets of channels (sections) depending on arguments provided.</p>
</dd>
<dt><a href="#aerobus">`aerobus(parameters)`</a> ⇒ <code><a href="#Aerobus">Aerobus</a></code></dt>
<dd><p>Message bus factory. Creates and returns new message bus instance.</p>
</dd>
</dl>
<a name="Aerobus"></a>
## `Aerobus([...names])` ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Message bus instance.Resolves channels and sets of channels (sections) depending on arguments provided.

**Kind**: global function  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - Single channel or section joining several channels into one logical unit.  
**Params**
- [...names] <code>String</code> - The channel names to resolve. If not provided resolves the root channel.

**Properties**

- bubbles <code>Boolean</code> - Gets the bubbling state of this bus.  
- delimiter <code>String</code> - Gets the configured delimiter string used to split hierarchical channel names.  
- channels <code>Array</code> - Gets the list of existing channels.  
- error <code>[Channel](#Channel)</code> - Gets the configured error callback.  
- root <code>[Channel](#Channel)</code> - Gets the root channel.  
- trace <code>function</code> - Gets or sets the trace callback.  


* [`Aerobus([...names])`](#Aerobus) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [`.clear()`](#Aerobus+clear) ⇒ <code>function</code>
  * [`.create([...modifiers])`](#Aerobus+create) ⇒ <code>function</code>
  * [`.unsubscribe([...parameters])`](#Aerobus+unsubscribe) ⇒ <code>function</code>

<a name="Aerobus+clear"></a>
### `aerobus.clear()` ⇒ <code>function</code>
Empties this bus removing all existing channels.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**

**Example**  
```js
let bus = aerobus();bus.clear();
```
<a name="Aerobus+create"></a>
### `aerobus.create([...modifiers])` ⇒ <code>function</code>
Creates new bus instance which inherits settings from this instance.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - New message bus instance.  
**Params**
- [...modifiers] <code>Any</code> - The alternate options to configure new message bus with.

<a name="Aerobus+unsubscribe"></a>
### `aerobus.unsubscribe([...parameters])` ⇒ <code>function</code>
Unsubscribes provided subscribers from all channels of this bus.

**Kind**: instance method of <code>[Aerobus](#Aerobus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**
- [...parameters] <code>function</code> | <code>String</code> - Subscriber function or names to unsibscribe.If omitted, unsubscribes all subscribers from all channels.

<a name="Channel"></a>
## Channel
Channel class.

**Kind**: global class  
**Properties**

- bubbles <code>Boolean</code> - Gets the bubbling state if this channel.  
- bus <code>bus</code> - Gets the bus instance owning this channel.  
- enabled <code>Boolean</code> - Gets the enabled state of this channel.  
- name <code>String</code> - Gets the name if this channel (empty string for root channel).  
- parent <code>[Channel](#Channel)</code> - Gets the parent channel (undefined for root channel).  
- retentions <code>Array</code> - Gets the list of retentions kept by this channel.  
- subscribers <code>Array</code> - Gets the list of subscribers to this channel.  


* [Channel](#Channel)
  * [`.@@iterator()`](#Channel+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.bubble([value])`](#Channel+bubble) ⇒ <code>[Channel](#Channel)</code>
  * [`.clear()`](#Channel+clear) ⇒ <code>[Channel](#Channel)</code>
  * [`.cycle([limit], [step])`](#Channel+cycle) ⇒ <code>[Channel](#Channel)</code>
  * [`.enable([value])`](#Channel+enable) ⇒ <code>[Channel](#Channel)</code>
  * [`.publish([data], [callback])`](#Channel+publish) ⇒ <code>[Channel](#Channel)</code>
  * [`.reset()`](#Channel+reset) ⇒ <code>[Channel](#Channel)</code>
  * [`.retain([limit])`](#Channel+retain) ⇒ <code>[Channel](#Channel)</code>
  * [`.shuffle([limit])`](#Channel+shuffle) ⇒ <code>[Channel](#Channel)</code>
  * [`.subscribe([parameters])`](#Channel+subscribe) ⇒ <code>[Channel](#Channel)</code>
  * [`.toggle()`](#Channel+toggle) ⇒ <code>[Channel](#Channel)</code>
  * [`.unsubscribe([parameters])`](#Channel+unsubscribe) ⇒ <code>[Channel](#Channel)</code>

<a name="Channel+@@iterator"></a>
### `channel.@@iterator()` ⇒ <code>[Iterator](#Iterator)</code>
Returns async iterator for this channel.Async iterator returns promises resolving to messages being published.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Iterator](#Iterator)</code> - New instance of the Iterator class.  
<a name="Channel+bubble"></a>
### `channel.bubble([value])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables publications bubbling for this channel depending on value.If bubbling is enabled, a channel first delivers each publication to the parent channeland then notifies own subscribers.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
**Params**
- [value] <code>Boolean</code> - When thruthy or omitted, the channel bubbles; otherwise not.

<a name="Channel+clear"></a>
### `channel.clear()` ⇒ <code>[Channel](#Channel)</code>
Empties this channel.Removes all #retentions and #subscriptions. Keeps @enabled and @bubbles settings.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
<a name="Channel+cycle"></a>
### `channel.cycle([limit], [step])` ⇒ <code>[Channel](#Channel)</code>
Switches this channel to use 'cycle' delivery strategy.Every publication will be delivered to provided number of subscribers in rotation.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [limit] <code>Number</code> <code> = 1</code> - The limit of subsequent subscribers receiving next publication.
- [step] <code>Number</code> <code> = 1</code> - The number of subsequent subscribers step after next publication.If step is less than number, subscribers selected for a publication delivery will overlap.

<a name="Channel+enable"></a>
### `channel.enable([value])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables this channel depending on value.Disabled channel supresses all publications.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
**Params**
- [value] <code>Boolean</code> - When thruthy or omitted, the channel enables; otherwise disables.

<a name="Channel+publish"></a>
### `channel.publish([data], [callback])` ⇒ <code>[Channel](#Channel)</code>
Publishes message to this channel.Propagates publication to ancestor channels then notifies own subscribers using try block.Any error thrown by a subscriber will be forwarded to the @bus.error callback.Subsequent subscribers will still be notified even if preceeding subscriber throws.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [data] <code>Any</code> - The data to publish.
- [callback] <code>function</code> - The callback to invoke after publication has been delivered.Callback is invoked with array of values returned by all notified subscribersof all channels this publication was delivered to.When provided, forces message bus to use request/response pattern instead of publish/subscribe.

<a name="Channel+reset"></a>
### `channel.reset()` ⇒ <code>[Channel](#Channel)</code>
Resets this channel.Removes all #retentions and #subscriptions, sets #bubbles, sets #enabled and resets #retentions.limit to 0.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+retain"></a>
### `channel.retain([limit])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables retention policy for this channel.Retention is a publication persisted in the channeland used to notify future subscribers right after their subscription.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [limit] <code>Number</code> - Number of retentions to persist (LIFO).When omitted or truthy, the channel retains all publications.When falsey, all retentions are removed and the channel stops retaining publications.Otherwise the channel retains at most provided limit of publications.

<a name="Channel+shuffle"></a>
### `channel.shuffle([limit])` ⇒ <code>[Channel](#Channel)</code>
Switches this channel to use 'shuffle' delivery strategy.Every publication will be delivered to provided number of random subscribers.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [limit] <code>Number</code> <code> = 1</code> - The limit of random subscribers receiving next publication.

<a name="Channel+subscribe"></a>
### `channel.subscribe([parameters])` ⇒ <code>[Channel](#Channel)</code>
Subscribes all provided subscribers to this channel.If there are retained messages, every subscriber will be notified with all retentions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [parameters] <code>function</code> | <code>Number</code> | <code>Object</code> | <code>String</code> - Subscriber function to subscribe.Or numeric order for all provided subscribers (0 by default).Subscribers with greater order are invoked later.Or object implemeting observer interface containing "next" and "done" methods.The "next" method is invoked for each publication being delivered with single argument - published message.The "done" method ends publications delivery and unsubscribes observer from this channel.Or string name for all provided subscribers.All named subscribers can be unsubscribed at once by their name.

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
- [parameters] <code>function</code> | <code>String</code> - Subscriber function to unsubscribe.Or string name of subscribers to unsubscribe.

<a name="Iterator"></a>
## Iterator
Iterator class.

**Kind**: global class  

* [Iterator](#Iterator)
  * [`.done()`](#Iterator+done)
  * [`.next()`](#Iterator+next) ⇒ <code>Object</code>

<a name="Iterator+done"></a>
### `iterator.done()`
Ends iteration of this channel/section and closes the iterator.

**Kind**: instance method of <code>[Iterator](#Iterator)</code>  
<a name="Iterator+next"></a>
### `iterator.next()` ⇒ <code>Object</code>
Produces next message published to this channel/section.

**Kind**: instance method of <code>[Iterator](#Iterator)</code>  
**Returns**: <code>Object</code> - - Object containing whether 'done' or 'value' properties.The 'done' property returns true if the iteration has been ended;otherwise the 'value' property returns a Promise resolving to the next message published to this channel/section.  
<a name="Message"></a>
## Message
Message class.

**Kind**: global class  
**Properties**

- data <code>Any</code> - The published data.  
- destination <code>String</code> - The channel name this message is directed to.  
- route <code>Array</code> - The array of channel names this message has traversed.  

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
Message bus factory. Creates and returns new message bus instance.

**Kind**: global function  
**Returns**: <code>[Aerobus](#Aerobus)</code> - New instance of message bus.  
**Params**
- parameters <code>String</code> | <code>function</code> | <code>object</code> - The string delimiter of hierarchical channel names (dot by default).Or the trace function, useful for debugging purposes.Or the object with extesions for internal aerobus classes: channel, message and section.

