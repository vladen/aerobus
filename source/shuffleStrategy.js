import {
    // Standard APIs shortcuts
      objectDefineProperties
    , objectDefineProperty
    , isNumber
    , mathMin
    , mathFloor
    , mathRandom
    // Class names
    , CLASS_AEROBUS_STRATEGY_SHUFFLE
    // Well-known symbols
    , $PROTOTYPE
    , $CLASS
} from './utils.js';

class ShuffleStrategy {
  constructor(limit) {
    objectDefineProperties(this, {
      limit: { value: limit }
    , name: { value: 'shuffle' }
    });
  }
  static create(limit) {
    // normalize limit setting
    limit = isNumber(limit)
      ? limit > 0 ? limit : 0
      : limit ? 1 : 0;
    // use broadcast strategy if limit is zero
    if (!limit)
      return null;
    // otherwise return shuffle strategy instance
    return new ShuffleStrategy(limit);
  }
  select(subscribers) {
    // return empty array if no subsribers are present
    let length = subscribers.length;
    if (!length)
      return [];
    // else compute number of subscribers to select
    let count = mathMin(this.limit, length)
      , selected = Array(count);
    // randomly select computed number of unique subscribers
    do {
      let candidate = subscribers[mathFloor(mathRandom() * length)];
      if (!selected.includes(candidate))
        selected[--count] = candidate;
    }
    while (count > 0);
    // return selected subscribers
    return selected;
  }
}
objectDefineProperty(ShuffleStrategy[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_STRATEGY_SHUFFLE });

export default ShuffleStrategy;
