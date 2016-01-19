try {
  require('./modern/aerobus.tests.js')(
    require('./modern')
  , require('chai').assert);
} catch(error) {
  console.log('Unable to test modern version:', error.message);
  require('./legacy/aerobus.tests.js')(
    require('./legacy')
  , require('chai').assert);
}
