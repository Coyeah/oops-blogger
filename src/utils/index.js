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

module.exports = {
  shortid,
  noop: () => {},
  log,
  error,
  promiser,
}