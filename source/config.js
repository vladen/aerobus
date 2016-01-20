'use strict';

import { errorArgumentNotValid, errorChannelExtensionNotValid, errorDelimiterNotValid, errorErrorNotValid, errorMessageExtensionNotValid, errorPlanExtensionNotValid, errorSectionExtensionNotValid, errorTraceNotValid }
  from './errors';
import { CLASS_BOOLEAN, CLASS_FUNCTION, CLASS_OBJECT, CLASS_STRING } 
  from './symbols';
import { classOf, isFunction, isObject, isSomething, isString, objectAssign, objectFreeze, objectCreate, objectDefineProperties, noop }
  from './utilites';

export default class Config {
  constructor(options) {
    this.bubbles = true;
    this.channel = {};
    this.delimiter = '.';
    this.error = error => {
      throw error;
    };
    this.message = {};
    this.plan = {};
    this.section = {};
    this.trace = noop;
      // iterate options
    for (let i = -1, l = options.length; ++i < l;) {
      let option = options[i];
      // depending on class of option
      switch(classOf(option)) {
        // use boolean as 'bubbles' setting
        case CLASS_BOOLEAN:
          this.bubbles = option;
          break;
        // use function as 'error' setting
        case CLASS_FUNCTION:
          this.error = option;
          break;
        // parse object members
        case CLASS_OBJECT:
          let { bubbles, channel, delimiter, error, message, plan, section, trace } = option;
          // use 'bubbles' field if defined
          if (isSomething(bubbles)) this.bubbles = !!bubbles;
          // use 'delimiter' string if defined
          if (isSomething(delimiter))
            if (isString(delimiter) && delimiter.length) this.delimiter = delimiter;
            else throw errorDelimiterNotValid(delimiter);
          // use 'error' function if defined
          if (isSomething(error))
            if (isFunction(error)) this.error = error;
            else throw errorErrorNotValid(error);
          // use 'trace' function if defined
          if (isSomething(trace))
            if (isFunction(trace)) this.trace = trace;
            else throw errorTraceNotValid(trace);
          // use 'channel' if defined to extend Channel instances
          if (isSomething(channel))
            if (isObject(channel)) objectAssign(this.channel, channel);
            else throw errorChannelExtensionNotValid(channel);
          // use 'message' if defined to extend Message instances
          if (isSomething(message))
            if (isObject(message)) objectAssign(this.message, message);
            else throw errorMessageExtensionNotValid(message);
          // use 'plan' if defined to extend Plan instances
          if (isSomething(plan))
            if (isObject(plan)) objectAssign(this.plan, plan);
            else throw errorPlanExtensionNotValid(plan);
          // use 'section' if defined to extend Section instances
          if (isSomething(section))
            if (isObject(section)) objectAssign(this.section, section);
            else throw errorSectionExtensionNotValid(section);
          break;
        // use string as 'delimiter' setting
        case CLASS_STRING:
          if (option.length) this.delimiter = option;
          else throw errorDelimiterNotValid(option);
          break;
        // class of option is unexpected, throw
        default:
          throw errorArgumentNotValid(option);
      }
    }
    objectDefineProperties(this, {
      bubbles: { value: this.bubbles }
    , channel: { value: objectFreeze(this.channel) }
    , delimiter: { value: this.delimiter }
    , error: { value: this.error }
    , message: { value: objectFreeze(this.message) }
    , plan: { value: objectFreeze(this.plan) }
    , section: { value: objectFreeze(this.section) }
    , trace: { value: this.trace }
    });
  }
  override(options) {
    let overriden = objectCreate(this);
    // iterate all overrides and then with config used to setup this instance.
    for (let i = -1, l = options.length; ++i < l;) {
      let option = options[i];
      // depending on class of override
      switch(classOf(option)) {
        // use boolean to override 'bubbles' setting
        case CLASS_BOOLEAN:
          overriden.bubbles = option;
          break;
        // use function to override 'error' setting
        case CLASS_FUNCTION:
          overriden.error = option;
          break;
        // use object to override all settings
        case CLASS_OBJECT:
          objectAssign(overriden, option);
          break;
        // use string to override 'delimiter' setting
        case CLASS_STRING:
          if (option.length) overriden.delimiter = option;
          else throw errorDelimiterNotValid(option);
          break;
        // class of override is unexpected, throw
        default:
          throw errorArgumentNotValid(option);
      }
    }
    return overriden;
  }
}
