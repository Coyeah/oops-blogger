const moment = require('moment');
const log = require('./log');
const error = require('./error');
const promiser = require('./promiser');

function shortid () {
  const date = String(Date.now());
  let id = '';
  while(id.length < 6) {
    let random = Math.floor(Math.random() * 13);
    random = Math.abs((random + random - 8) % 13); 
    id += date[random];
  }
  return id;
}

function getUniqueId(map = {}) {
  let id = shortid();
  while (true) {
    if (!map[id]) break;
    else {
      id = shortid();
    }
  }
  return id
}

module.exports = {
  shortid,
  getUniqueId,
  noop: () => {},
  log,
  error,
  promiser,
  getNowTime: () => new moment().format('YYYY-MM-DD HH:mm:ss'),
}