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
<dt><a href="#aerobus">`aerobus(delimiter, trace, extensions)`</a> ⇒ <code><a href="#bus">bus</a></code></dt>
<dd><p>Message bus factory. Creates and returns new message bus.</p>
</dd>
<dt><a href="#bus">`bus(...names)`</a> ⇒ <code>channel</code> | <code>section</code></dt>
<dd><p>Message bus instance.
Resolves channels or sections (set of channels) depending on arguments.
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
  * [`.reset()`](#Channel+reset) ⇒ <code>[Channel](#Channel)</code>
  * [`.retain(limit)`](#Channel+retain) ⇒ <code>[Channel](#Channel)</code>
  * [`.subscribe(...subscriptions)`](#Channel+subscribe) ⇒ <code>[Channel](#Channel)</code>
  * [`.toggle()`](#Channel+toggle) ⇒ <code>[Channel](#Channel)</code>
  * [`.unsubscribe(...subscriptions)`](#Channel+unsubscribe) ⇒ <code>[Channel](#Channel)</code>

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
<a name="Channel+reset"></a>
### `channel.reset()` ⇒ <code>[Channel](#Channel)</code>
Resets this channel.Removes all retentions and subscriptions, enables channel and sets retentions limit to 0.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+retain"></a>
### `channel.retain(limit)` ⇒ <code>[Channel](#Channel)</code>
Enables or disables retention policy for this channel.Retention is a publication persisted in a channel for future subscriptions.Every new subscription receives all the retentions right after subscribe.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- limit <code>number</code> - Optional number of latest retentions to persist.When omitted or truthy, the channel will retain Number.MAX_SAFE_INTEGER of publications.When falsey, all retentions are removed and the channel stops retaining messages.Otherwise the channel will retain at most provided limit of messages.

<a name="Channel+subscribe"></a>
### `channel.subscribe(...subscriptions)` ⇒ <code>[Channel](#Channel)</code>
Subscribes all provided subscriptions to this channel.If there are retained messages, notifies all the subscriptions provided with all this messages.If no arguments specified, does nothing.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- ...subscriptions <code>function</code> - Subscriptions to subscribe.

<a name="Channel+toggle"></a>
### `channel.toggle()` ⇒ <code>[Channel](#Channel)</code>
Toggles state of this channel: enables if it is disabled and vice versa.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+unsubscribe"></a>
### `channel.unsubscribe(...subscriptions)` ⇒ <code>[Channel](#Channel)</code>
Unsubscribes all provided subscriptions from this channel.If no arguments specified, unsubscribes all subscriptions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
**Params**
- ...subscriptions <code>function</code> - Subscriptions to unsubscribe.

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
bus.root[Symbol.iterator]().done();// => undefined
```
<a name="Iterator+next"></a>
### `iterator.next()` ⇒ <code>object</code>
Advances iteration of this channel/section.

**Kind**: instance method of <code>[Iterator](#Iterator)</code>  
**Returns**: <code>object</code> - Object containing whether 'done' or 'value' properties. The 'done' property returns true if the iteration has been ended; otherwise the 'value' property returns a Promise resolving to the next message published to this channel/section.  
**Example**  
```js
var iterator = bus.root[Symbol.iterator]();iterator.next();// => Object {value: Promise}iterator.done();// => Unhandled promise rejection undefinediterator.next();// => Object {done: true}
```
<a name="Message"></a>
## Message
Message class.

**Kind**: global class  
**Properties**

- data <code>any</code> - The published data.  
- channel <code>channel</code> - The channel this message was initially published to.  
- error <code>error</code> - The error object if this message is a reaction to an exception in some subscription.  

<a name="Section"></a>
## Section
Section class.

**Kind**: global class  
**Properties**

- channels <code>array</code> - The list of channels this section refers.  


* [Section](#Section)
  * [`.@@iterator()`](#Section+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.clear()`](#Section+clear) ⇒ <code>[Section](#Section)</code>
  * [`.disable()`](#Section+disable) ⇒ <code>[Section](#Section)</code>
  * [`.enable()`](#Section+enable) ⇒ <code>[Section](#Section)</code>
  * [`.publish(data, callback)`](#Section+publish) ⇒ <code>[Section](#Section)</code>
  * [`.reset()`](#Section+reset) ⇒ <code>[Section](#Section)</code>
  * [`.subscribe(...subcriptions)`](#Section+subscribe) ⇒ <code>[Section](#Section)</code>
  * [`.toggle()`](#Section+toggle) ⇒ <code>[Section](#Section)</code>
  * [`.unsubscribe(...subcriptions)`](#Section+unsubscribe) ⇒ <code>[Section](#Section)</code>

<a name="Section+@@iterator"></a>
### `section.@@iterator()` ⇒ <code>[Iterator](#Iterator)</code>
Returns async iterator for this channel.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Iterator](#Iterator)</code> - - New instance of the Iterator class.  
<a name="Section+clear"></a>
### `section.clear()` ⇒ <code>[Section](#Section)</code>
Clears all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+disable"></a>
### `section.disable()` ⇒ <code>[Section](#Section)</code>
Disables all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+enable"></a>
### `section.enable()` ⇒ <code>[Section](#Section)</code>
Enables all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+publish"></a>
### `section.publish(data, callback)` ⇒ <code>[Section](#Section)</code>
Publishes data to all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
**Params**
- data <code>any</code> - The data to publish.
- callback <code>function</code> - The callback function which will be called with responses of all notified sunscriptions collected to array.

<a name="Section+reset"></a>
### `section.reset()` ⇒ <code>[Section](#Section)</code>
Resets all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+subscribe"></a>
### `section.subscribe(...subcriptions)` ⇒ <code>[Section](#Section)</code>
Subscribes all provided subscriptions to all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
**Params**
- ...subcriptions <code>function</code> - Subscriptions to subscribe.

<a name="Section+toggle"></a>
### `section.toggle()` ⇒ <code>[Section](#Section)</code>
Toggles enabled state of all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
<a name="Section+unsubscribe"></a>
### `section.unsubscribe(...subcriptions)` ⇒ <code>[Section](#Section)</code>
Unsubscribes all provided subscriptions from all referred channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - - This section.  
**Params**
- ...subcriptions <code>function</code> - Subscriptions to unsubscribe.

<a name="aerobus"></a>
## `aerobus(delimiter, trace, extensions)` ⇒ <code>[bus](#bus)</code>
Message bus factory. Creates and returns new message bus.

**Kind**: global function  
**Returns**: <code>[bus](#bus)</code> - New instance of message bus.  
**Params**
- delimiter <code>string</code> - The string delimiter of hierarchical channel names (dot by default).
- trace <code>function</code> - The function consuming trace information, useful for debugging purposes.
- extensions <code>object</code> - The object with extesions of internal classes: channel, message and section.

**Example**  
```js
var bus = aerobus(':', console.log.bind(console), { channel: {test: () => 'test'}, message: {test: () => 'test'}, section: {test: () => 'test'}});bus('channel');// => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", ...bus('channel1', 'channel2'); // returns a section// => SectionExtended {Symbol(Symbol.toStringTag): "Aerobus.Section", ...
```
<a name="bus"></a>
## `bus(...names)` ⇒ <code>channel</code> &#124; <code>section</code>
Message bus instance.Resolves channels or sections (set of channels) depending on arguments.After any channel is created, bus configuration is forbidden, 'delimiter' and 'trace' properties become read-only.After bus is cleared, it can be configured again, 'delimiter' and 'trace' properties become read-write.

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
bus();// => Channel {name: "", Symbol(Symbol.toStringTag): "Aerobus.Channel"}bus('test');// => Channel {name: "test", parent: Channel, Symbol(Symbol.toStringTag): "Aerobus.Channel"}bus('test1', 'test2');// => Section {Symbol(Symbol.toStringTag): "Aerobus.Section"}
```

* [`bus(...names)`](#bus) ⇒ <code>channel</code> &#124; <code>section</code>
  * [`.clear()`](#bus.clear) ⇒ <code>function</code>
  * [`.unsubscribe(...subscriptions)`](#bus.unsubscribe) ⇒

<a name="bus.clear"></a>
### `bus.clear()` ⇒ <code>function</code>
Empties this bus. Removes all existing channels and permits bus configuration via 'delimiter' and 'trace' properties.

**Kind**: static method of <code>[bus](#bus)</code>  
**Returns**: <code>function</code> - This message bus.  
**Params**

**Example**  
```js
bus.clear();// => function bus() { ...
```
<a name="bus.unsubscribe"></a>
### `bus.unsubscribe(...subscriptions)` ⇒
Unsubscribes provided subscriptions from all channels of this bus.

**Kind**: static method of <code>[bus](#bus)</code>  
**Returns**: This message bus.  
**Params**
- ...subscriptions <code>function</code> - Subscriptions to unsibscribe.

