const log = require('./log');

module.exports = {
  layout: (func) => async (...args) => {
    try {
      await func(...args);
    } catch (ex) {
      log.error(ex);
    }
  },
  inquirer: error => {
    if (error.isTtyError) {
      log.error('操作面板无法在当前工具正确展示；');
    } else {
      log.unknown();
    }
  }
}