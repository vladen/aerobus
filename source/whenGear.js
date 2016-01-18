import {
    // Utility functions
      classOf
    , noop
    , truthy
    // Class names
    , CLASS_FUNCTION
    , CLASS_STRING
    // Error builders
    , errorArgumentNotValid
    , errorDependencyNotValid
    // Shared storage, getter and setter for all private assets
    , getGear
} from './utils.js';
import Replay from './replay.js';

class WhenGear extends Replay {
  constructor(bus, parameters, targets) {
    super();
    this.condition = truthy;
    this.sources = [];
    this.targets = targets;
    for (let i = -1, l = parameters.length; ++i < l;) {
      let parameter = parameters[i];
      switch(classOf(parameter)) {
        case CLASS_FUNCTION:
          this.condition = parameter;
          break;
        case CLASS_STRING:
          this.sources.push(parameter);
          break;
        default:
          throw errorArgumentNotValid(parameter);
      }
    }
    switch (this.sources.length) {
      case 0: throw errorDependencyNotValid();
      case 1:
        this.observer = {
          done: noop
        , next: message => {
            if (this.condition(message)) this.replay(this.targets);
          }
        };
        (this.sources[0] = getGear(bus.get(this.sources[0]))).observe(this.observer);
        break;
      default:
        this.counters = new Map;
        this.observer = {
          done: noop
        , next: message => {
            if (!this.condition(message)) return;
            let destination = message.destination
              , counter = this.counters.get(destination) + 1;
            this.counters.set(destination, counter);
            for (let i = -1, l = this.counters.length; ++i < l;)
              if (this.counters[i] !== counter) return;
            this.replay(this.targets);
          }
        };
        for (let i = this.sources.length - 1; i >= 0; i--)
          (this.sources[i] = getGear(bus.get(this.sources[i]))).observe(this.observer);
        break;
    }
  }
  done() {
    for (let i = this.dependencies.length; i--;)
      this.dependencies[i].unobserve(this.observer);
  }
}

export default WhenGear;
