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
<dt><a href="#aerobus">`aerobus(...parameters)`</a> ⇒ <code><a href="#bus">bus</a></code></dt>
<dd><p>Message bus factory. Creates and returns new message bus instance.</p>
</dd>
<dt><a href="#bus">`bus(...names)`</a> ⇒ <code>channel</code> | <code>section</code></dt>
<dd><p>Message bus instance.
Resolves channels or set of channels (sections) depending on arguments provided.
After any channel is created, bus configuration is forbidden, &#39;delimiter&#39; and &#39;trace&#39; properties become read-only.
After bus is cleared, it can be configured again, &#39;delimiter&#39; and &#39;trace&#39; properties become read-write.</p>
</dd>
</dl>
<a name="Channel"></a>
## Channel
Channel class.

**Kind**: global class  
**Properties**

- bus <code>[bus](#bus)</code> - The bus instance owning this channel.  
- isEnabled <code>boolean</code> - True if this channel and all its ancestors are enabled; otherwise false.  
- name <code>string</code> - The name if this channel (empty string for root channel).  
- parent <code>channel</code> - The parent channel (undefined for root and error channels).  
- retentions <code>array</code> - The list of retentions of this channel.  
- subscriptions <code>array</code> - The list of subscriptions to this channel.  


* [Channel](#Channel)
  * [`.@@iterator()`](#Channel+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.clear()`](#Channel+clear) ⇒ <code>[Channel](#Channel)</code>
  * [`.publish()`](#Channel+publish)
  * [`.reset()`](#Channel+reset) ⇒ <code>[Channel](#Channel)</code>
  * [`.retain(limit)`](#Channel+retain) ⇒ <code>[Channel](#Channel)</code>
  * [`.subscribe(parameters)`](#Channel+subscribe) ⇒ <code>[Channel](#Channel)</code>
  * [`.toggle()`](#Channel+toggle) ⇒ <code>[Channel](#Channel)</code>
  * [`.unsubscribe(...subscribers)`](#Channel+unsubscribe) ⇒ <code>[Channel](#Channel)</code>

<a name="Channel+@@iterator"></a>
### `channel.@@iterator()` ⇒ <code>[Iterator](#Iterator)</code>
Returns async iterator for this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Iterator](#Iterator)</code> - - New instance of the Iterator class.  
<a name="Channel+clear"></a>
### `channel.clear()` ⇒ <code>[Channel](#Channel)</code>
Empties this channel. Removes all retentions and subscriptions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
<a name="Channel+publish"></a>
### `channel.publish()`
**Kind**: instance method of <code>[Channel](#Channel)</code>  
<a name="Channel+reset"></a>
### `channel.reset()` ⇒ <code>[Channel](#Channel)</code>
Resets this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+retain"></a>
### `channel.retain(limit)` ⇒ <code>[Channel](#Channel)</code>
Enables or disables retention policy for this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- limit <code>number</code> - Optional number of latest retentions to persist.

<a name="Channel+subscribe"></a>
### `channel.subscribe(parameters)` ⇒ <code>[Channel](#Channel)</code>
Subscribes all provided subscribers to this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- parameters <code>function</code> | <code>number</code> - Subscriber functions to subscribe.

**Example**  
```js
var bus = aerobus(), subscriber0 = (data, message) => {}, subscriber1 = () => {}, subscriber2 = () => {};
```
<a name="Channel+toggle"></a>
### `channel.toggle()` ⇒ <code>[Channel](#Channel)</code>
Toggles state of this channel: enables if it is disabled and vice versa.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+unsubscribe"></a>
### `channel.unsubscribe(...subscribers)` ⇒ <code>[Channel](#Channel)</code>
Unsubscribes all provided subscribers from this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
**Params**
- ...subscribers <code>function</code> - Subscribers to unsubscribe.

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
**Example**  
```js
bus.root[Symbol.iterator]().done();
```
<a name="Iterator+next"></a>
### `iterator.next()` ⇒ <code>object</code>
Advances iteration of this channel/section.

**Kind**: instance method of <code>[Iterator](#Iterator)</code>  
**Returns**: <code>object</code> - Object containing whether 'done' or 'value' properties. The 'done' property returns true if the iteration has been ended; otherwise the 'value' property returns a Promise resolving to the next message published to this channel/section.  
**Example**  
```js
var iterator = bus.root[Symbol.iterator]();
```
<a name="Message"></a>
## Message
Message class.

**Kind**: global class  
**Properties**

- data <code>any</code> - The published data.  
- channel <code>channel</code> - The channel this message is directed to.  
- channels <code>array</code> - The array of channels this message traversed.  
- error <code>error</code> - The error object if this message is reaction to an exception in some subscriber.  

<a name="Section"></a>
## Section
Section class.

**Kind**: global class  
**Properties**

- channels <code>array</code> - The array of channels this section bounds.  


* [Section](#Section)
  * [`.@@iterator()`](#Section+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.clear()`](#Section+clear) ⇒ <code>[Section](#Section)</code>
  * [`.disable()`](#Section+disable) ⇒ <code>[Section](#Section)</code>
  * [`.enable()`](#Section+enable) ⇒ <code>[Section](#Section)</code>
  * [`.publish(data, callback)`](#Section+publish) ⇒ <code>[Section](#Section)</code>
  * [`.reset()`](#Section+reset) ⇒ <code>[Section](#Section)</code>
  * [`.subscribe(...parameters)`](#Section+subscribe) ⇒ <code>[Section](#Section)</code>
  * [`.toggle()`](#Section+toggle) ⇒ <code>[Section](#Section)</code>
  * [`.unsubscribe(...subcriptions)`](#Section+unsubscribe) ⇒ <code>[Section](#Section)</code>

<a name="Section+@@iterator"></a>
### `section.@@iterator()` ⇒ <code>[Iterator](#Iterator)</code>
Returns async iterator for this channel.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Iterator](#Iterator)</code> - - New instance of the Iterator class.  
<a name="Section+clear"></a>
### `section.clear()` ⇒ <code>[Section](#Section)</code>
Clears all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+disable"></a>
### `section.disable()` ⇒ <code>[Section](#Section)</code>
Disables all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+enable"></a>
### `section.enable()` ⇒ <code>[Section](#Section)</code>
Enables all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+publish"></a>
### `section.publish(data, callback)` ⇒ <code>[Section](#Section)</code>
Publishes data to all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
**Params**
- data <code>any</code> - The data to publish.
- callback <code>function</code> - The callback function which is invoked with array of responses of all notified sunscribers.

<a name="Section+reset"></a>
### `section.reset()` ⇒ <code>[Section](#Section)</code>
Resets all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+subscribe"></a>
### `section.subscribe(...parameters)` ⇒ <code>[Section](#Section)</code>
Subscribes all provided subscribers to all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
**Params**
- ...parameters <code>function</code> - Subscriber function to subscribe. Subscriber function may accept two arguments (data, message),

<a name="Section+toggle"></a>
### `section.toggle()` ⇒ <code>[Section](#Section)</code>
Toggles enabled state of all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+unsubscribe"></a>
### `section.unsubscribe(...subcriptions)` ⇒ <code>[Section](#Section)</code>
Unsubscribes all provided subscribers from all bound channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
**Params**
- ...subcriptions <code>function</code> - Subscribers to unsubscribe.

<a name="aerobus"></a>
## `aerobus(...parameters)` ⇒ <code>[bus](#bus)</code>
Message bus factory. Creates and returns new message bus instance.

**Kind**: global function  
**Returns**: <code>[bus](#bus)</code> - New instance of message bus.  
**Params**
- ...parameters <code>string</code> | <code>function</code> | <code>object</code> - The string delimiter of hierarchical channel names (dot by default).

**Example**  
```js
let bus = aerobus(':', console.log.bind(console), {
```
<a name="bus"></a>
## `bus(...names)` ⇒ <code>channel</code> &#124; <code>section</code>
Message bus instance.

**Kind**: global function  
**Returns**: <code>channel</code> &#124; <code>section</code> - - Single channel or section joining several channels into one logical unit.  
**Params**
- ...names <code>names</code> - Names of the channels to resolve. If not provided, returns the root channel.

**Properties**

- delimiter <code>string</code> - The configured delimiter string for hierarchical channel names, writable while bus is empty.  
- channels <code>array</code> - The list of existing channels.  
- error <code>channel</code> - The error channel.  
- root <code>channel</code> - The root channel.  
- trace <code>function</code> - The configured trace function, writable while bus is empty.  

**Example**  
```js
bus(), subscriber = () => {};
```

* [`bus(...names)`](#bus) ⇒ <code>channel</code> &#124; <code>section</code>
  * [`.clear()`](#bus.clear) ⇒ <code>function</code>
  * [`.unsubscribe(...subscribers)`](#bus.unsubscribe) ⇒

<a name="bus.clear"></a>
### `bus.clear()` ⇒ <code>function</code>
Empties this bus. Removes all existing channels and permits bus configuration via 'delimiter' and 'trace' properties.

**Kind**: static method of <code>[bus](#bus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**

**Example**  
```js
let bus = aerobus();
```
<a name="bus.unsubscribe"></a>
### `bus.unsubscribe(...subscribers)` ⇒
Unsubscribes provided subscribers from all channels of this bus.

**Kind**: static method of <code>[bus](#bus)</code>  
**Returns**: This bus.
**Params**
- ...subscribers <code>function</code> - Subscribers to unsibscribe.
