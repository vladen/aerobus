## Classes
<dl>
<dt><a href="#Channel">Channel</a></dt>
<dd><p>Channel class.</p>
</dd>
</dl>
## Functions
<dl>
<dt><a href="#aerobus">`aerobus(delimiter, trace, extensions)`</a> ⇒ <code>function</code></dt>
<dd><p>Creates new message bus. A message bus is a function returning channel or section (set of channels).</p>
</dd>
</dl>
<a name="Channel"></a>
## Channel
Channel class.

**Kind**: global class  

* [Channel](#Channel)
  * [`.$ITERATOR()`](#Channel+$ITERATOR) ⇒ <code>iterator</code>
  * [`.bus`](#Channel+bus) ⇒ <code>function</code>
  * [`.clear()`](#Channel+clear) ⇒ <code>channel</code>
  * [`.isEnabled`](#Channel+isEnabled) ⇒ <code>boolean</code>
  * [`.name`](#Channel+name) ⇒ <code>string</code>
  * [`.parent`](#Channel+parent) ⇒ <code>channel</code>
  * [`.reset()`](#Channel+reset) ⇒ <code>channel</code>
  * [`.retain(limit)`](#Channel+retain) ⇒ <code>channel</code>
  * [`.retentions`](#Channel+retentions) ⇒ <code>array</code>
  * [`.subscribe(...subscriptions)`](#Channel+subscribe) ⇒ <code>channel</code>
  * [`.subscriptions`](#Channel+subscriptions) ⇒ <code>array</code>
  * [`.toggle()`](#Channel+toggle) ⇒ <code>channel</code>
  * [`.unsubscribe(...subscriptions)`](#Channel+unsubscribe) ⇒ <code>channel</code>

<a name="Channel+$ITERATOR"></a>
### `channel.$ITERATOR()` ⇒ <code>iterator</code>
Returns async iterator for this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
<a name="Channel+bus"></a>
### `channel.bus` ⇒ <code>function</code>
Returns the bus instance owning this channel.

**Kind**: instance property of <code>[Channel](#Channel)</code>  
<a name="Channel+clear"></a>
### `channel.clear()` ⇒ <code>channel</code>
Empties this channel removing all the retentions/subscriptions. The enabled status and retentions limit setting are kept.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>channel</code> - This channel.  
<a name="Channel+isEnabled"></a>
### `channel.isEnabled` ⇒ <code>boolean</code>
Returns true if this channel is enabled; otherwise false.

**Kind**: instance property of <code>[Channel](#Channel)</code>  
<a name="Channel+name"></a>
### `channel.name` ⇒ <code>string</code>
Returns the name if this channel (empty string for root channel).

**Kind**: instance property of <code>[Channel](#Channel)</code>  
<a name="Channel+parent"></a>
### `channel.parent` ⇒ <code>channel</code>
Returns the parent channel (undefined for root and error channels).

**Kind**: instance property of <code>[Channel](#Channel)</code>  
<a name="Channel+reset"></a>
### `channel.reset()` ⇒ <code>channel</code>
Resets this channel enabling it, removing all the retentions/subscriptions and setting retentions limit to 0.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>channel</code> - This channel.  
<a name="Channel+retain"></a>
### `channel.retain(limit)` ⇒ <code>channel</code>
Enables or disables retention policy for this channel.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>channel</code> - This channel.  
**Params**
- limit <code>number</code> - Optional number of latest retentions to persist. If not provided or truthy, the channel will retain Number.MAX_SAFE_INTEGER of publications. When falsey, all retentions are removed and the channel stops retaining messages. Otherwise the channel will retain at most limit messages.

<a name="Channel+retentions"></a>
### `channel.retentions` ⇒ <code>array</code>
Returns clone of retentions array of this channel. Retention is a publication persisted in a channel for future subscriptions. Every new subscription receives all the retentions right after subscribe.

**Kind**: instance property of <code>[Channel](#Channel)</code>  
<a name="Channel+subscribe"></a>
### `channel.subscribe(...subscriptions)` ⇒ <code>channel</code>
Subscribes all provided subscriptions to this channel. If no arguments specified, does nothing. If there are retentions in this channel, notifies all the subscriptions provided with all retained messages.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>channel</code> - This channel.  
**Params**
- ...subscriptions <code>function</code> - Subscriptions to subscribe.

<a name="Channel+subscriptions"></a>
### `channel.subscriptions` ⇒ <code>array</code>
Returns clone of subscriptions array of this channels.

**Kind**: instance property of <code>[Channel](#Channel)</code>  
<a name="Channel+toggle"></a>
### `channel.toggle()` ⇒ <code>channel</code>
Toggles enabled status of this channel. Enables the channel when it is disabled and vice versa.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>channel</code> - This channel.  
<a name="Channel+unsubscribe"></a>
### `channel.unsubscribe(...subscriptions)` ⇒ <code>channel</code>
Unsubscribes all provided subscriptions from this channel. If no arguments specified, unsubscribes all subscriptions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>channel</code> - This channel.  
**Params**
- ...subscriptions <code>function</code> - Subscriptions to unsubscribe.

<a name="aerobus"></a>
## `aerobus(delimiter, trace, extensions)` ⇒ <code>function</code>
Creates new message bus. A message bus is a function returning channel or section (set of channels).

**Kind**: global function  
**Returns**: <code>function</code> - New instance of message bus.  
**Params**
- delimiter <code>string</code> - String delimiter of hierarchical channel names (dot by default).
- trace <code>function</code> - Function consuming trace information, useful for debugging purposes.
- extensions <code>object</code> - Object containing sets of extesions for standard aerobus classes: channel, message and section.

**Example**  
```js
var bus = aerobus(':', console.log.bind(console), { channel: {test: () => 'test'}, message: {test: () => 'test'}, section: {test: () => 'test'}});bus('channel');// => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", ...bus('channel1', 'channel2'); // returns a section// => SectionExtended {Symbol(Symbol.toStringTag): "Aerobus.Section", ...
```

* [`aerobus(delimiter, trace, extensions)`](#aerobus) ⇒ <code>function</code>
  * [`~bus(...names)`](#aerobus..bus) ⇒ <code>channel</code> &#124; <code>section</code>
  * [`~clear()`](#aerobus..clear) ⇒ <code>function</code>
  * [`~getChannels()`](#aerobus..getChannels) ⇒ <code>array</code>
  * [`~getDelimiter()`](#aerobus..getDelimiter) ⇒
  * [`~getError()`](#aerobus..getError) ⇒
  * [`~getRoot()`](#aerobus..getRoot) ⇒
  * [`~getTrace()`](#aerobus..getTrace) ⇒
  * [`~setDelimiter(value)`](#aerobus..setDelimiter) ⇒
  * [`~setTrace(value)`](#aerobus..setTrace) ⇒
  * [`~unsubscribe(...subscriptions)`](#aerobus..unsubscribe) ⇒

<a name="aerobus..bus"></a>
### `aerobus~bus(...names)` ⇒ <code>channel</code> &#124; <code>section</code>
The message bus instance. Exposed as function returned from aerobus call. Resolves channels or sections (set of channels) depending on the argument number. As message bus creates any channel, its configuration throught 'delimiter' and 'trace' properties becomes forbidden.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: <code>channel</code> &#124; <code>section</code> - Single channel or section joining several channels into one logical unit.  
**Params**
- ...names <code>names</code> - Names of the channels to resolve. If not provided, returns the root channel.

**Example**  
```js
bus();// => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", Symbol(name): "" ...bus('test');// => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", Symbol(name): "test" ...bus('test1', 'test2');// => SectionExtended {Symbol(Symbol.toStringTag): "Aerobus.Section", Symbol(channels): Array[2] ...
```
<a name="aerobus..clear"></a>
### `aerobus~clear()` ⇒ <code>function</code>
Empties message bus removing all existing channels and permitting bus configuration through 'delimiter' and 'trace' properties.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: <code>function</code> - This message bus.  
**Params**

**Example**  
```js
bus.clear();// => function bus() { ...
```
<a name="aerobus..getChannels"></a>
### `aerobus~getChannels()` ⇒ <code>array</code>
Exposed as readonly 'channels' property of the message bus. Gets array of existing channels.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: <code>array</code> - List of existing channels.  
**Params**

**Example**  
```js
bus.channels;// => [ChannelExtended, ...]
```
<a name="aerobus..getDelimiter"></a>
### `aerobus~getDelimiter()` ⇒
Exposed as readable 'delimiter' property of this message bus. Gets the configured hierarchical channel name delimiter string.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: The delimiter string.  
**Params**

**Example**  
```js
bus.delimiter;// => '.'
```
<a name="aerobus..getError"></a>
### `aerobus~getError()` ⇒
Exposed as 'error' property of this message bus. Resolves error channel.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: The error channel.  
**Params**

**Example**  
```js
bus.error;// => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", ...
```
<a name="aerobus..getRoot"></a>
### `aerobus~getRoot()` ⇒
Exposed as 'root' property of this message bus. Resolves root channel.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: The root channel.  
**Params**

**Example**  
```js
bus.root;// => ChannelExtended {Symbol(Symbol.toStringTag): "Aerobus.Channel", ...
```
<a name="aerobus..getTrace"></a>
### `aerobus~getTrace()` ⇒
Exposed as 'trace' property of this message bus. Gets the configured trace function.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: The trace function.  
**Params**

**Example**  
```js
bus.trace;// => function () { ...
```
<a name="aerobus..setDelimiter"></a>
### `aerobus~setDelimiter(value)` ⇒
Exposed as writable 'delimiter' property of this message bus. Sets delimiter string for hierarchical channel names. If the message bus is not empty (contains channels), throws error.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: This message bus.  
**Params**
- value <code>string</code> - The delimiter to use for splitting a channel name.

<a name="aerobus..setTrace"></a>
### `aerobus~setTrace(value)` ⇒
Sets trace function for this message bus. If the message bus is not empty (contains channels), throws error.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: This message bus.  
**Params**
- value <code>function</code> - The function to use for trace.

<a name="aerobus..unsubscribe"></a>
### `aerobus~unsubscribe(...subscriptions)` ⇒
Unsubscribes provided subscriptions from all the channels.

**Kind**: inner method of <code>[aerobus](#aerobus)</code>  
**Returns**: This message bus.  
**Params**
- ...subscriptions <code>function</code> - Subscriptions to unsibscribe.

