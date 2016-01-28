'use strict';

import Common
  from './common';
import SectionGear
  from './sectionGear';
import { CLASS, CLASS_AEROBUS_SECTION, PROTOTYPE }
  from './symbols';
import { getGear, objectDefineProperty, setGear }
  from './utilites';

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
  when(...parameters) {
    let gear = getGear(this)
      , bus = gear.bus
      , Plan = bus.Plan;
    return new Plan(bus, parameters, this.channels);
  }
}

objectDefineProperty(SectionBase[PROTOTYPE], CLASS, { value: CLASS_AEROBUS_SECTION });

export default function subclassSection() {
  return class Section extends SectionBase {
    constructor(bus, binder) {
      super(bus, binder);
    }
  }
}
