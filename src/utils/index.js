const log = require('./log');
const error = require('./error');
const promiser = require('./promiser');

module.exports = {
  noop: () => {},
  log,
  error,
  promiser,
}