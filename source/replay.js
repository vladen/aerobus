'use strict';

import { getGear }
  from './utilites';

// Internal representation of a replay as a recording of operations over channel/section.
class Replay {
  constructor() {
    this.recordings = [];
  }
  bubble(value) {
    this.recordings.push(['bubble', value]);
  }
  clear() {
    this.recordings.push(['clear']);
  }
  enable(value = true) {
    this.recordings.push(['enable', value]);
  }
  forward(forwarding) {
    this.recordings.push(['forward', forwarding]);
  }
  publish(data, callback) {
    this.recordings.push(['publish', data, callback]);
  }
  replay(targets) {
    let recordings = this.recordings;
    for (let i = -1, l = recordings.length; ++i < l;) {
      let [method, ...parameters] = recordings[i];
      for (let j = -1, m = targets.length; ++j < m;)
        getGear(targets[j])[method](...parameters);
    }
  }
  reset() {
    this.recordings.push(['reset']);
  }
  retain(limit) {
    this.recordings.push(['retain', limit]);
  }
  subscribe(subscription) {
    this.recordings.push(['subscribe', subscription]);
  }
  toggle() {
    this.recordings.push(['toggle']);
  }
  unsubscribe(unsubscription) {
    this.recordings.push(['unsubscribe', unsubscription]);
  }
  cycle(strategy) {
    this.recordings.push(['cycle', strategy]);
  }
  shuffle(strategy) {
    this.recordings.push(['shuffle', strategy]);
  }
}

export default Replay;
