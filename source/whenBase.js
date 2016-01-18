import {
    // Shared storage, getter and setter for all private assets
      setGear
    , getGear
    // Well-known symbols
    // , $ITERATOR
    , $PROTOTYPE
    , $CLASS
    // Standard APIs shortcuts
    , objectDefineProperty
    // Class names
    , CLASS_AEROBUS_WHEN
} from './utils.js';
import Common from './common.js';
// import Iterator from './iterator.js';
import WhenGear from './whenGear.js';

export class WhenBase extends Common {
  constructor(bus, parameters, targets) {
    super();
    setGear(this, new WhenGear(bus, parameters, targets));
  }
  get condition() {
    return getGear(this).condition;
  }
  get sources() {
    return [...getGear(this).sources];
  }
  get targets() {
    return [...getGear(this).targets];
  }
  done() {
    getGear(this).done();
    return this;
  }
  /*
  [$ITERATOR]() {
    return new Iterator(getGear(this).targets);
  }
  */
}
objectDefineProperty(WhenBase[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_WHEN });

export default function subclassWhen() {
  return class When extends WhenBase {
    constructor(bus, parameters, target) {
      super(bus, parameters, target);
    }
  }
}

// export default {
//     When
// };
