'use strict';

import factoryTests from './factory.js';
import instanceTests from './instance.js';
import channelTests from './channel.js';
import messageTests from './message.js';
import sectionTests from './section.js';

export default (aerobus, assert) => {
  factoryTests(aerobus, assert);
  instanceTests(aerobus, assert);
  channelTests(aerobus, assert);
  messageTests(aerobus, assert);
  sectionTests(aerobus, assert);
};
