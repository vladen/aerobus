'use strict';

import { errorArgumentNotValid }
  from './errors';
import { CLASS, CLASS_AEROBUS_SUBSCRIBER, CLASS_AEROBUS_UNSUBSCRIPTION, CLASS_FUNCTION, CLASS_OBJECT, CLASS_STRING, PROTOTYPE }
  from './symbols';
import { classOf, objectDefineProperties, objectDefineProperty }
  from './utilites';

// Internal representation of an unsubscription as a set of predicates to match subscribers with.
class Unsubscription {
  // parses parameters as predicates and wraps to the new instance of the Unsubscription class
  constructor(parameters) {
    let predicates = [];
    // iterate all parameters
    for (let i = -1, l = parameters.length; ++i < l;) {
      // depending on the class of the parameter
      let parameter = parameters[i];
      switch (classOf(parameter)) {
        // if parameter is an instance of the Subscriber class
        case CLASS_AEROBUS_SUBSCRIBER:
          // create predicate matching a subscriber with parameter
          predicates.push(subscriber => subscriber === parameter);
          break;
        // if parameter is a function or an object
        case CLASS_FUNCTION: case CLASS_OBJECT:
          // create predicate matching subscriber's base with parameter
          predicates.push(subscriber => subscriber.base === parameter);
          break;
        // if parameter is a string
        case CLASS_STRING:
          // create predicate matching subscriber's name with parameter
          predicates.push(subscriber => subscriber.name === parameter);
          break;
        // the class of the parameter is unexpected, throw
        default:
          throw errorArgumentNotValid(parameter);
      }
    }
    // define read-only fields on this object to keep arrays of original parameters and parsed predicates
    objectDefineProperties(this, {
      parameters: { value: parameters }
    , predicates: { value: predicates }
    });
  }
}

// set the name of the Unsubscription class
objectDefineProperty(Unsubscription[PROTOTYPE], CLASS, { value: CLASS_AEROBUS_UNSUBSCRIPTION });

export default Unsubscription;
