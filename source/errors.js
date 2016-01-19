'use strict';

import { classOf } from './utilites';

// error builders
export const errorArgumentNotValid = value =>
  new TypeError(`Argument of type "${classOf(value)}" is not expected.`);
export const errorCallbackNotValid = value =>
  new TypeError(`Callback expected to be a function, not "${classOf(value)}".`);
export const errorChannelExtensionNotValid = value =>
  new TypeError(`Channel class extensions expected to be an object, not "${value}".`);
export const errorDelimiterNotValid = value =>
  new TypeError(`Delimiter expected to be not empty string, not "${value}".`);
export const errorDependencyNotValid = () =>
  new TypeError(`Dependency expected to be a channel name.`);
export const errorErrorNotValid = value =>
  new TypeError(`Error expected to be a function, not "${classOf(value)}".`);
export const errorForwarderNotValid = () =>
  new TypeError(`Forwarder expected to be a function or a channel name.`);
export const errorGearNotFound = value =>
  new Error(`This instance of "${classOf(value)}"" has been deleted.`);
export const errorMessageExtensionNotValid = value =>
  new TypeError(`Message class extensions expected to be an object, not "${value}".`);
export const errorNameNotValid = value =>
  new TypeError(`Name expected to be a string, not "${classOf(value)}".`);
export const errorOrderNotValid = value =>
  new TypeError(`Order expected to be a number, not "${classOf(value)}".`);
export const errorSectionExtensionNotValid = value =>
  new TypeError(`Section class extensions expected to be an object, not "${value}".`);
export const errorSubscriberNotValid = () =>
  new TypeError(`Subscriber expected to be a function or an object having "next" and optional "done" methods.`);
export const errorTraceNotValid = value =>
  new TypeError(`Trace expected to be a function, not "${classOf(value)}".`);
export const errorWhenExtensionNotValid = value =>
  new TypeError(`When class extensions expected to be an object, not "${value}".`);
  