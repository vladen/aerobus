import {
    // Utility functions
      classOf
    , isFunction
    , isNothing
    , isObject
    , isSomething
    , isString
    , isNumber
    , noop
    // Error builders
    , errorSubscriberNotValid
    , errorNameNotValid
    , errorOrderNotValid
    // Standard APIs shortcuts
    , objectDefineProperties
    , objectDefineProperty
    // Well-known symbols
    , $PROTOTYPE
    , $CLASS
    // Class names
    , CLASS_AEROBUS_SUBSCRIBER
} from './utils.js';

// Internal representation of a subscriber as a set of related fields.
class Subscriber {
  // validates parameters and wraps to new instance of Subscriber class
  constructor(base, name, order) {
    let done, next;
    // if base is function, use it as subscriber without done callback implementation
    if (isFunction(base)) {
      done = noop;
      next = base;
    }
    // if base is instance of Subscriber class, just copy its fields
    else if (classOf(base) === CLASS_AEROBUS_SUBSCRIBER) {
      done = base.done;
      next = base.next;
      if (isNothing(name))
        name = base.name;
      if (isNothing(order))
        order = base.order;
    }
    // if base is object containing 'next' method
    else if (isObject(base) && isFunction(base.next)) {
      // wrap its 'next' method to the arrow function to preserve calling context
      next = (data, message) => base.next(data, message);
      // if object contains 'done' field
      if (isSomething(base.done))
        // and 'done' is a function
        if (isFunction(base.done)) {
          let disposed = false;
          // wrap its 'done' method to the arrow function to preserve calling context
          // and guarantee it is called once
          done = () => {
            if (disposed) return;
            disposed = true;
            base.done();
          };
        }
        // otherwise throw
        else throw errorSubscriberNotValid(base);
      // if object does not contain 'done' field, fake it
      else done = noop;
      // if name parameter is undefined and object contains 'name' field
      if (isNothing(name) && isSomething(base.name))
        // and 'name' is string
        if (isString(base.name))
          // use it as subscriber's name
          name = base.name;
        // otherwise throw
        else throw errorNameNotValid(base.name);
      // if order parameter is undefined and object contains 'order' field
      if (isNothing(order) && isSomething(base.order))
        // and 'order' is number
        if (isNumber(base.order))
          // use it as subscriber's order
          order = base.order;
        // otherwise throw
        else throw errorOrderNotValid(base.order);
    }
    // class of base is unexpected, throw
    else throw errorSubscriberNotValid(base);
    // if order is undefined, default it
    if (isNothing(order))
      order = 0;
    // define read-only fields on this object to keep parsed parameters
    objectDefineProperties(this, {
      base: { value: base }
    , done: { value: done }
    , next: { value: next }
    , order: { value: order }
    });
    // define read-only field on this object to keep parsed name if it is defined
    if (isSomething(name))
      objectDefineProperty(this, 'name', { value: name });
  }
}
// set the name of Subscriber class
objectDefineProperty(Subscriber[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SUBSCRIBER });

export default Subscriber;
