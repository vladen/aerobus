import {
    // Shared storage, getter and setter for all private assets
      getGear
    , setGear
    // Well-known symbols
    , $ITERATOR
    , $PROTOTYPE
    , $CLASS
    // Standard APIs shortcuts
    , objectDefineProperty
    // Class names
    , CLASS_AEROBUS_SECTION
} from './utils.js';
import Common from './common.js';
import SectionGear from './sectionGear.js';
import Iterator from './iterator.js';
// import Section from './section.js';

/**
 * Section class.
 * @alias Section
 * @extends Common
 * @property {Array} channels
 *  The array of channels this section relates.
 */
export class SectionBase extends Common {
  constructor(bus, resolver) {
    super();
    setGear(this, new SectionGear(bus, resolver));
  }
  get channels() {
    return [...getGear(this).resolver()];
  }
  when(parameters) {
    let gear = getGear(this)
      , bus = gear.bus
      , When = bus.When;
    return new When(bus, parameters, gear.channels);
  }
  /**
   * Returns an async iterator for this section.
   *  The iterator will iterate publications made to all related channels after the iteration start
   *  unless all channels are cleared or iterator is #done().
   * @alias Section#@@iterator
   * @returns {Iterator}
   *  The new instance of the Iterator class.
   */
  [$ITERATOR]() {
    return new Iterator(getGear(this).resolver());
  }
}
objectDefineProperty(SectionBase[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SECTION });

export default function subclassSection() {
  return class Section extends SectionBase {
    constructor(bus, binder) {
      super(bus, binder);
    }
  }
}

// export default {
//     SectionBase
// };
