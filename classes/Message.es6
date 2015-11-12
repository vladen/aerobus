// creates message class
'use strict';

import {_ObjectCreate, _ObjectKeys} from "../auxiliaryModules/shortcuts";
import {isChannel, isUndefined, isFunction, isError, isMessage, isPublication, isSubscription} from "../auxiliaryModules/helpFunctions";


const DATA = Symbol('data')
    , CHANNEL = Symbol('channel')
    , HEADERS = Symbol('headers')
    , ERROR = Symbol('error')


export default class Message() {
  constructor() {
      this[DATA] = _ObjectCreate(null);
      this[CHANNEL] = _ObjectCreate(null);
      this[HEADERS] = _ObjectCreate(null);

      each(arguments, this.use);
  }
  use(argument) {
    let channel = this[CHANNEL]
      , headers = this[HEADERS]
      , data = this[DATA]
      , error = this[ERROR];

    if (isChannel(argument)) {
      if (isUndefined(channel)) channel = argument.name;
      if (argument.ensured) headers.ensured = true;
      return;
    }

    if (isFunction(argument)) data = argument();
    else if (isError(argument)) error = argument;
    else if (isMessage(argument)) {
      if (isUndefined(channel)) channel = argument.channel;
      data = argument.data;
      error = argument.error;
      _ObjectKeys(argument.headers).forEach(function(key) {
          headers[key] = argument.headers[key];
      });
      return;
    }

    if (isPublication(argument) || isSubscription(argument)) {
      if (argument.ensured) headers.ensured = true;
    } else data = argument;
  }
}