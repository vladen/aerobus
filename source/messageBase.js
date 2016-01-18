import {
    // Standard APIs shortcuts
      objectDefineProperties
    , objectCreate
    // Class names
    , CLASS_AEROBUS_MESSAGE
    // Well-known symbols
    , $CLASS
    , $PROTOTYPE
} from './utils.js';

/**
 * Message class.
 * @alias Message
 * @property {any} data
 *  The published data.
 * @property {string} destination
 *  The channel name this message is directed to.
 * @property {array} route
 *  The array of channel names this message has traversed.
 */
export class MessageBase {
  constructor(data, id, route) {
    objectDefineProperties(this, {
      data: { value: data, enumerable: true }
    , destination: { value: route[0], enumerable: true }
    , id: { value: id, enumerable: true }
    , route: { value: route, enumerable: true }
    });
  }
}
objectDefineProperties(MessageBase[$PROTOTYPE], {
  [$CLASS]: { value : CLASS_AEROBUS_MESSAGE }
, cancel: { value: objectCreate(null) }
});
export default function subclassMessage() {
  return class Message extends MessageBase {
    constructor(data, id, route) {
      super(data, id, route);
    }
  }
}
