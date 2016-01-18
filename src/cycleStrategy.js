import {
    // Standard APIs shortcuts
      objectDefineProperties
    , objectDefineProperty
    // Utility functions
    , isNumber
    , mathMin
    // Well-known symbols
    , $PROTOTYPE
    , $CLASS
    // Class names
    , CLASS_AEROBUS_STRATEGY_CYCLE
} from './utils.js';

class CycleStrategy {
  constructor(limit, step) {
    objectDefineProperties(this, {
      cursor: { value: 0, writable: true }
    , limit: { value: limit }
    , name: { value: 'cycle' }
    , step: { value: step }
    });
  }
  static create(limit, step) {
    // normalize limit setting
    limit = isNumber(limit)
      ? limit > 0 ? limit : 0
      : limit ? 1 : 0;
    // use broadcast strategy if limit is zero
    if (!limit)
      return null;
    // otherwise normalize step setting
    step = isNumber(step) && 0 < step
      ? step
      : limit;
    // and return cycle strategy instance
    return new CycleStrategy(limit, step);
  }
  select(subscribers) {
    let length = subscribers.length;
    // return empty array if no subsribers are present
    if (!length)
      return [];
    // otherwise compute number of subscribers to select
    let count = mathMin(this.limit, length)
      , i = this.cursor
      , selected = Array(count);
    // select next range of subscribers
    while (count-- > 0)
      selected.push(subscribers[i++ % length]);
    // advance cursor
    this.cursor += this.step;
    // return selected subscribers
    return selected;
  }
}
objectDefineProperty(CycleStrategy[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_STRATEGY_CYCLE });

export default CycleStrategy;
