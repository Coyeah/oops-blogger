'use strict';
const chalk = require('chalk');

const defaultConfig = {
  info: 'blueBright',
  success: 'greenBright',
  warn: 'yellowBright',
  error: 'redBright',
};
let log = {};
Object.keys(defaultConfig).map(key => {
  log[key] = function (...args) {
    console.log(
      chalk[defaultConfig[key]](`[ ${key.toLocaleUpperCase()} ]`),
      ...args
    );
  }
});

module.exports = {
  ...log,
  unknown: () => log.error('未知错误，请重新操作。')
};