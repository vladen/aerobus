try {
  module.exports = require('./modern');
}
catch(error) {
  module.exports = require('./legacy');
}
