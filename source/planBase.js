'use strict';

import Common
  from './common';
import PlanGear
  from './planGear';
import { CLASS, CLASS_AEROBUS_PLAN, PROTOTYPE }
  from './symbols';
import { getGear, objectDefineProperty, setGear }
  from './utilites';

export class PlanBase extends Common {
  constructor(bus, parameters, targets) {
    super();
    setGear(this, new PlanGear(bus, parameters, targets));
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

objectDefineProperty(PlanBase[PROTOTYPE], CLASS, { value: CLASS_AEROBUS_PLAN });

export default function subclassPlan() {
  return class Plan extends PlanBase {
    constructor(bus, parameters, target) {
      super(bus, parameters, target);
    }
  }
}
