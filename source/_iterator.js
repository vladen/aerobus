import {
    // Shared storage, getter and setter for all private assets
      getGear
    , setGear
    // Standard APIs shortcuts
    , objectDefineProperty
    // Well-known symbols
    , $PROTOTYPE
    , $CLASS
    // Class names
    , CLASS_AEROBUS_ITERATOR
} from './utils.js';
import IteratorGear from './iteratorGear.js';

/**
 * Iterator class.
 */
class Iterator {
  constructor(observables) {
    setGear(this, new IteratorGear(observables));
  }

  /**
   * Ends iteration of this channel/section and closes the iterator.
   */
  done() {
    getGear(this).done();
  }

  /**
   * Produces next message has been published or going to be published to this channel/section.
   * @returns {object}
   *  Object containing whether 'done' or 'value' properties.
   *  The 'value' property returns a Promise resolving to the next message.
   *  The 'done' property returns true if the iteration has been ended with #done method call
   *  or owning bus/channel/section clearance/reseting.
   */
  next() {
    return getGear(this).next();
  }
}
objectDefineProperty(Iterator[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_ITERATOR });

export default Iterator;
