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
<dt><a href="#aerobus">`aerobus(parameters)`</a> ⇒ <code><a href="#bus">bus</a></code></dt>
<dd><p>Message bus factory. Creates and returns new message bus instance.</p>
</dd>
<dt><a href="#bus">`bus([...names])`</a> ⇒ <code><a href="#Channel">Channel</a></code> | <code><a href="#Section">Section</a></code></dt>
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
- isEnabled <code>Boolean</code> - True if this channel and all its ancestors are enabled; otherwise false.  
- name <code>String</code> - The name if this channel (empty string for root channel).  
- parent <code>[Channel](#Channel)</code> - The parent channel (not set for root and error channels).  
- retentions <code>Array</code> - The list of retentions of this channel.  
- subscriptions <code>Array</code> - The list of subscriptions to this channel.  


* [Channel](#Channel)
  * [`.@@iterator()`](#Channel+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.clear()`](#Channel+clear) ⇒ <code>[Channel](#Channel)</code>
  * [`.disable()`](#Channel+disable) ⇒ <code>[Channel](#Channel)</code>
  * [`.enable([value])`](#Channel+enable) ⇒ <code>[Channel](#Channel)</code>
  * [`.publish([data], [callback])`](#Channel+publish) ⇒ <code>[Channel](#Channel)</code>
  * [`.reset()`](#Channel+reset) ⇒ <code>[Channel](#Channel)</code>
  * [`.retain([limit])`](#Channel+retain) ⇒ <code>[Channel](#Channel)</code>
  * [`.subscribe([parameters])`](#Channel+subscribe) ⇒ <code>[Channel](#Channel)</code>
  * [`.toggle()`](#Channel+toggle) ⇒ <code>[Channel](#Channel)</code>
  * [`.unsubscribe([...subscribers])`](#Channel+unsubscribe) ⇒ <code>[Channel](#Channel)</code>

<a name="Channel+@@iterator"></a>
### `channel.@@iterator()` ⇒ <code>[Iterator](#Iterator)</code>
Returns async iterator for this channel.Async iterator returns Promise objects instead of immediate values.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Iterator](#Iterator)</code> - New instance of the Iterator class.  
<a name="Channel+clear"></a>
### `channel.clear()` ⇒ <code>[Channel](#Channel)</code>
Empties this channel. Removes all retentions and subscriptions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
<a name="Channel+disable"></a>
### `channel.disable()` ⇒ <code>[Channel](#Channel)</code>
Disables this channel.All subsequent publications to this and descendant channels will be ignored.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
<a name="Channel+enable"></a>
### `channel.enable([value])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables this channel depending on value.All subsequent publications to this channel will be delivered.Publications to descendant channels will be delivered only if the corresponding channel is enabled itself.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - - This channel.  
**Params**
- [value] <code>Boolean</code> - Optional value. When thruthy or omitted, the channel is enabled; otherwise disabled.

<a name="Channel+publish"></a>
### `channel.publish([data], [callback])` ⇒ <code>[Channel](#Channel)</code>
Publishes data to this channel.Propagates publication to ancestor channels then notifies own subscribers.If this channel is not standard "error" channel, subscribers are invoked within try blockand any error thrown by a subscriber will be published to standard "error" channel.Subsequent subscribers will still be notified even if preceeding subscriber throws.Error thrown by subscriber of standard "error" channel will be thrown.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [data] <code>Any</code> - Optional data to publish.
- [callback] <code>function</code> - Optional callback to invoke with array of values returned by all notified subscribers,from all channels this publication is delivered to. When provided, forces message bus to use request/response pattern instead of publish/subscribe.

<a name="Channel+reset"></a>
### `channel.reset()` ⇒ <code>[Channel](#Channel)</code>
Resets this channel.Removes all retentions and subscriptions, enables channel and sets retentions limit to 0.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+retain"></a>
### `channel.retain([limit])` ⇒ <code>[Channel](#Channel)</code>
Enables or disables retention policy for this channel.Retention is a publication persisted in a channel to notify future subscribers.Every new subscriber receives all the retentions right after its subscribtion.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [limit] <code>Number</code> - Optional number of latest retentions to persist.When omitted or truthy, the channel retains Number.MAX_SAFE_INTEGER of publications.When falsey, all retentions are removed and the channel stops retaining publications.Otherwise the channel retains at most provided limit of publications.

<a name="Channel+subscribe"></a>
### `channel.subscribe([parameters])` ⇒ <code>[Channel](#Channel)</code>
Subscribes all provided subscribers to this channel.If there are retained messages, notifies every subscriber with all retentions.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [parameters] <code>function</code> | <code>Number</code> - Subscriber functions to subscribe.Or numeric order of this subscription (0 by default). Subscribtions with greater order are invoked later.

**Example**  
```js
var bus = aerobus(), subscriber0 = (data, message) => {}, subscriber1 = () => {}, subscriber2 = () => {};bus.root.subscribe(2, subscriber0).subscribe(1, subscriber1, subscriber2);
```
<a name="Channel+toggle"></a>
### `channel.toggle()` ⇒ <code>[Channel](#Channel)</code>
Toggles state of this channel: enables when it is disabled and vice versa.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
<a name="Channel+unsubscribe"></a>
### `channel.unsubscribe([...subscribers])` ⇒ <code>[Channel](#Channel)</code>
Unsubscribes all provided subscribers from this channel.Without arguments unsubscribes all subscribers.

**Kind**: instance method of <code>[Channel](#Channel)</code>  
**Returns**: <code>[Channel](#Channel)</code> - This channel.  
**Params**
- [...subscribers] <code>function</code> - Subscribers to unsubscribe.

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
**Example**  
```js
bus.root[Symbol.iterator]().done();// => undefined
```
<a name="Iterator+next"></a>
### `iterator.next()` ⇒ <code>Object</code>
Advances iteration of this channel/section.

**Kind**: instance method of <code>[Iterator](#Iterator)</code>  
**Returns**: <code>Object</code> - - Object containing whether 'done' or 'value' properties. The 'done' property returns true if the iteration has been ended; otherwise the 'value' property returns a Promise resolving to the next message published to this channel/section.  
**Example**  
```js
var iterator = bus.root[Symbol.iterator]();iterator.next();// => Object {value: Promise}iterator.done();// => Unhandled promise rejection undefinediterator.next();// => Object {done: true}
```
<a name="Message"></a>
## Message
Message class.

**Kind**: global class  
**Properties**

- data <code>Any</code> - The published data.  
- channel <code>[Channel](#Channel)</code> - The channel this message is directed to.  
- channels <code>Array</code> - The array of channels this message traversed.  
- error <code>Error</code> - The error object if this message is reaction to an error thrown by a subscriber.  
- prior <code>[Message](#Message)</code> - The previous message published to a channel preceeding current in publication chain.  

<a name="Section"></a>
## Section
Section class.

**Kind**: global class  
**Properties**

- channels <code>Array</code> - The array of channels this section unites.  


* [Section](#Section)
  * [`.@@iterator()`](#Section+@@iterator) ⇒ <code>[Iterator](#Iterator)</code>
  * [`.clear()`](#Section+clear) ⇒ <code>[Section](#Section)</code>
  * [`.disable()`](#Section+disable) ⇒ <code>[Section](#Section)</code>
  * [`.enable()`](#Section+enable) ⇒ <code>[Section](#Section)</code>
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
<a name="Section+clear"></a>
### `section.clear()` ⇒ <code>[Section](#Section)</code>
Clears all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+disable"></a>
### `section.disable()` ⇒ <code>[Section](#Section)</code>
Disables all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+enable"></a>
### `section.enable()` ⇒ <code>[Section](#Section)</code>
Enables all united channels.

**Kind**: instance method of <code>[Section](#Section)</code>  
**Returns**: <code>[Section](#Section)</code> - This section.  
<a name="Section+publish"></a>
### `section.publish()` ⇒ <code>[Section](#Section)</code>
Publishes data to all united channels.

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
## `aerobus(parameters)` ⇒ <code>[bus](#bus)</code>
Message bus factory. Creates and returns new message bus instance.

**Kind**: global function  
**Returns**: <code>[bus](#bus)</code> - New instance of message bus.  
**Params**
- parameters <code>String</code> | <code>function</code> | <code>object</code> - The string delimiter of hierarchical channel names (dot by default).Or the trace function, useful for debugging purposes.Or the object with extesions for internal aerobus classes: channel, message and section.

<a name="bus"></a>
## `bus([...names])` ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
Message bus instance.Resolves channels or set of channels (sections) depending on arguments provided.After any channel is created, bus configuration is forbidden, 'delimiter' and 'trace' properties become read-only.After bus is cleared, it can be configured again, 'delimiter' and 'trace' properties become read-write.

**Kind**: global function  
**Returns**: <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code> - - Single channel or section joining several channels into one logical unit.  
**Params**
- [...names] <code>String</code> - Names of the channels to resolve. If not provided, returns the root channel.

**Properties**

- delimiter <code>String</code> - The configured delimiter string for hierarchical channel names, writable while bus is empty.  
- channels <code>Array</code> - The list of existing channels.  
- error <code>[Channel](#Channel)</code> - The error channel.  
- root <code>[Channel](#Channel)</code> - The root channel.  
- trace <code>function</code> - The configured trace function, writable while bus is empty.  

**Example**  
```js
bus(), subscriber = () => {};bus('test').subscribe(subscriber);bus('test1', 'test2').disable().subscribe(subscriber);
```

* [`bus([...names])`](#bus) ⇒ <code>[Channel](#Channel)</code> &#124; <code>[Section](#Section)</code>
  * [`.clear()`](#bus.clear) ⇒ <code>function</code>
  * [`.unsubscribe([...parameters])`](#bus.unsubscribe) ⇒ <code>function</code>

<a name="bus.clear"></a>
### `bus.clear()` ⇒ <code>function</code>
Empties this bus. Removes all existing channels and permits bus configuration via 'delimiter' and 'trace' properties.

**Kind**: static method of <code>[bus](#bus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**

**Example**  
```js
let bus = aerobus();bus.clear();
```
<a name="bus.unsubscribe"></a>
### `bus.unsubscribe([...parameters])` ⇒ <code>function</code>
Unsubscribes provided subscribers from all channels of this bus.

**Kind**: static method of <code>[bus](#bus)</code>  
**Returns**: <code>function</code> - This bus.  
**Params**
- [...parameters] <code>function</code> | <code>String</code> - Subscriber function or names to unsibscribe.If omitted, unsubscribes all subscribers from all channels.

