import {
    // Utility functions
      classOf
    , objectDefineProperties
    , objectDefineProperty
    // Class names
    , CLASS_FUNCTION
    , CLASS_OBJECT
    , CLASS_AEROBUS_SUBSCRIBER
    , CLASS_AEROBUS_SUBSCRIPTION
    , CLASS_NUMBER
    , CLASS_STRING
    // Error builders
    , errorArgumentNotValid
    , errorSubscriberNotValid
    // Well-known symbols
    , $PROTOTYPE
    , $CLASS
} from './utils.js';
import Subscriber from './subscriber.js';
// Internal representation of a subscription as a set of subscribers.
class Subscription {
  // parses parameters as subscribers and wraps to the new instance of the Subscription class
  constructor(parameters) {
    let builders = []
      , name
      , order;
    // iterate all parameters
    for (let i = -1, l = parameters.length; ++i < l;) {
      let parameter = parameters[i];
      // depending on the class of the parameter
      switch (classOf(parameter)) {
        // if parameter is a function, an object or an instance of the Subscriber class
        case CLASS_FUNCTION: case CLASS_OBJECT: case CLASS_AEROBUS_SUBSCRIBER:
          // create deferred builder to call it after all common parameters are parsed
          builders.push(() => new Subscriber(parameter, name, order));
          break;
        // if parameter is a number, use it as the common order
        case CLASS_NUMBER:
          order = parameter;
          break;
        // if parameter is a number, use it as the common name
        case CLASS_STRING:
          name = parameter;
          break;
        // the class of the parameter is unexpected, throw
        default:
          throw errorArgumentNotValid(parameter);
      }
    }
    // if no builder has been created, throw
    if (!builders.length)
      throw errorSubscriberNotValid();
    // define read-only fields on this object to keep arrays of original parameters and parsed subscribers
    objectDefineProperties(this, {
      parameters: { value: parameters }
    , subscribers: { value: builders.map(builder => builder()) }
    });
  }
}
// set the name of the Subscription class
objectDefineProperty(Subscription[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_SUBSCRIPTION });

export default Subscription;
