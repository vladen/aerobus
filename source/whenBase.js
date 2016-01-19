'use strict';

import Common
  from './common';
import { CLASS, CLASS_AEROBUS_WHEN, PROTOTYPE }
  from './symbols';
import { getGear, objectDefineProperty, setGear }
  from './utilites';
import WhenGear
  from './whenGear';

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
}

objectDefineProperty(WhenBase[PROTOTYPE], CLASS, { value: CLASS_AEROBUS_WHEN });

export default function subclassWhen() {
  return class When extends WhenBase {
    constructor(bus, parameters, target) {
      super(bus, parameters, target);
    }
  }
}
