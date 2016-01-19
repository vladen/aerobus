try {
  module.exports = require('./build/modern');
}
catch(error) {
  module.exports = require('./build/legacy');
}
