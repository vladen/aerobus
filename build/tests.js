try {
  require('./modern/aerobus.tests.js')(
    require('./modern')
  , require('chai').assert);
} catch(error) {
  require('./legacy/aerobus.tests.js')(
    require('./legacy')
  , require('chai').assert);
}
