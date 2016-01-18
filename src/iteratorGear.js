import { getGear } from './utils.js';
// represents iterator internally as an observer of several channels
class IteratorGear {
  // create new instance of iterator and attach it to all the observables provided
  constructor(observables) {
    this.disposed = false;
    this.messages = [];
    this.rejects = [];
    this.resolves = [];
    // implement observer interface with reference count to guarantee the done method is invoked once
    let count = 0
      , observer = {
          done: () => {
            // if reference count is less than iterable count, await
            if (++count < observables.length) return;
            // otherwise mark this iterator as done
            this.disposed = true;
            // and reject all pending promises
            this.rejects.forEach(reject => reject());
          }
        , next: message => {
            // if there are pending promises, resolve first of them
            if (this.resolves.length) this.resolves.shift()(message);
            // otherwise keep message to resolve it later
            else this.messages.push(message);
          }
        };
    // create disposer implementation to detach observer from all the observables
    this.disposer = () => {
      for (let i = observables.length; i--;)
        getGear(observables[i]).unobserve(observer);
    };
    // attach new observer to all observables
    for (let i = observables.length; i--;)
      getGear(observables[i]).observe(observer);
  }
  // stop iteration
  done() {
    // avoid repetitive calls
    if (this.disposed)
      return;
    this.disposed = true;
    // reject all pending promises
    let rejects = this.rejects;
    for (let i = rejects.length; i--;)
      rejects[i]();
    // invoke disposer implementation
    this.disposer();
  }
  // iterate to the next message, already published or expected to be published
  next() {
    // check if iteration has been compelete
    if (this.disposed)
      return {done: true };
    // if there is a published message
    if (this.messages.length)
      // return resolved promise
      return { value: Promise.resolve(this.messages.shift()) };
    // otherwise return pending promise
    return { value: new Promise((resolve, reject) => {
      this.rejects.push(reject);
      this.resolves.push(resolve);
    }) };
  }
}

export default IteratorGear;
