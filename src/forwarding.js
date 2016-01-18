import {
    // Utility functions
      classOf
    // Standard APIs shortcuts
    , objectDefineProperty
    // Well-known symbols
    , $PROTOTYPE
    , $CLASS
    // Class names
    , CLASS_AEROBUS_FORWARDING
    , CLASS_FUNCTION
    , CLASS_STRING
    // Error builders
    , errorArgumentNotValid
    , errorForwarderNotValid
} from './utils.js';
// Internal representation of a forwarding as a rule set.
class Forwarding {
  // parses parameters as forwarding rules and wraps to new instance of Forwarding class
  constructor(parameters) {
    let forwarders = [];
    // iterate all parameters
    for (let i = -1, l = parameters.length; ++i < l;) {
      let parameter = parameters[i];
      // depending on class of parameter
      switch (classOf(parameter)) {
        // if parameter is instance of Forwarding class
        case CLASS_AEROBUS_FORWARDING:
          // just copy its rules
          forwarders.push(...parameter.forwarders);
          break;
        // if parameter is function or string
        case CLASS_FUNCTION: case CLASS_STRING:
          // append it to rules
          forwarders.push(parameter);
          break;
        // class of parameter is unexpected, throw
        default:
          throw errorArgumentNotValid(parameter);
      }
    }
    // if no forwarding rules found, throw
    if (!forwarders.length)
      throw errorForwarderNotValid();
    // define read-only field on this object to keep array of rules
    objectDefineProperty(this, 'forwarders', { value: forwarders });
  }
}
// set the name of Forwarding class
objectDefineProperty(Forwarding[$PROTOTYPE], $CLASS, { value: CLASS_AEROBUS_FORWARDING });

export default Forwarding;
