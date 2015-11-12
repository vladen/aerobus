/*
  let bus = aerobus(console.log.bind(console));
  ideas:
    dispose channel when it becomes empty
    channel.forward -
      static - accepts channel name 
      dynamic - accepts callback resolving channel name
    channel.zip
      zips publications from several channels and combine them via callback passing as array
      triggers combined publication to self
    buffer, distinct(untilChanged), randomize/reduce/sort until finished, whilst? operators
    subscription/publication strategies: cycle | random | serial | parallel
    delay/debounce/throttle/repeat may accept dynamic intervals (callback)
    subscriptions priority + cancellation via 'return false'
    named subscriptions/publications
    request - reponse pattern on promises
    plugable persistence with expiration
*/

'use strict';

//TODO: ADD Aerobus class
