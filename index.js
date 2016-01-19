try {
  module.exports = require('./modern');
}
catch {
  module.exports = require('./legacy');
}
