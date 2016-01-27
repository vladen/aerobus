'use strict';

import { errorArgumentNotValid, errorObservableNotValid }
  from './errors';
import Replay
  from './replay';
import { CLASS_FUNCTION, CLASS_STRING }
  from './symbols';
import { classOf, getGear, noop, truthy }
  from './utilites';

class PlanGear extends Replay {
  constructor(bus, parameters, targets) {
    super();
    this.condition = truthy;
    this.observables = [];
    this.targets = targets;
    for (let i = -1, l = parameters.length; ++i < l;) {
      let parameter = parameters[i];
      switch(classOf(parameter)) {
        case CLASS_FUNCTION:
          this.condition = parameter;
          break;
        case CLASS_STRING:
          this.observables.push(parameter);
          break;
        default:
          throw errorArgumentNotValid(parameter);
      }
    }
    switch (this.observables.length) {
      case 0:
        throw errorObservableNotValid();
      case 1:
        this.observer = {
          done: noop
        , next: message => {
            if (this.condition(message)) this.replay(this.targets);
          }
        };
        break;
      default:
        this.counters = new Map;
        this.observer = {
          done: noop
        , next: message => {
            if (!this.condition(message)) return;
            let counters = this.counters
              , destination = message.destination
              , counter = counters.get(destination) || 0
              , observables = this.observables
              ;
            counters.set(destination, counter + 1);
            if (counters.size < observables.length) return;
            for (let i = -1, l = observables.length; ++i < l;) {
              let name = observables[i].name;
              counter = counters.get(name) - 1;
              if (counter) counters.set(name, counter);
              else counters.delete(name);
            }
            this.replay(this.targets);
          }
        };
        break;
    }
    for (let i = -1, l = this.observables.length; ++i < l;) {
      let observable = getGear(bus.get(this.observables[i]));
      observable.observe(this.observer);
      this.observables[i] = observable;
    }
  }
  done() {
    for (let i = this.observables.length; i--;)
      this.observables[i].unobserve(this.observer);
  }
}

export default PlanGear;
