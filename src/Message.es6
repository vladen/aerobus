// creates message class
'use strict';

import {DATA , CHANNEL, HEADERS, ERROR} from "symbols"; 
import {isChannel, isUndefined, isFunction, isError, isMessage, isPublication, isSubscription} from "utilites";


const _ObjectKeys = Object.keys;


function use(message, argument) {
  let channel = message[CHANNEL]
    , headers = message[HEADERS]
    , data = message[DATA]
    , error = message[ERROR];

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

export default class Message() {
  constructor(...arguments) {
      this[DATA] = new Map;
      this[CHANNEL] = new Map;
      this[HEADERS] = new Map;

      for(let argument of arguments) use(this, argument);
  }
}
