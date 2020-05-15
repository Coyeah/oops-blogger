const log = require('./log');

module.exports = (func) => async (...args) => {
  try {
    await func(...args);
  } catch (ex) {
    log.error(ex);
  }
}