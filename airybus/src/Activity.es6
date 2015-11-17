// creates new activity class (abstract base for channels, publications and subscriptions)
'use strict';


import {BUS, ENABLED, PARENT} from "symbols"; 
import {validateDisposable} from "validators";


class Activity {
  constructor(bus, parent) {
    this[ENABLED] = true;
    this[PARENT] = parent;
    bus.trace('create', this);
  }
  get isEnabled() {
    return this[ENABLED] && (!this[PARENT] || this[PARENT].enabled);
  } 
  // disables this activity
  disable() {
    validateDisposable(this);
    if (this[ENABLED]) {
      this[BUS].trace('disable', this);
      this[ENABLED] = false;
    }
    return this;
  }  
  // enables this activity
  enable(enable = true) {
    if (!enable) this.disable();
    validateDisposable(this);
    if (!this[ENABLED]) {
      this[BUS].trace('enable', this);
      this[ENABLED] = true;
    }
    return this;
  }
}

export default Activity