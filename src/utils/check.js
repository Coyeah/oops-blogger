const fs = require('fs');
const path = require('path');
const promiser = require('./promiser');
const { noop } = require('./index');

const checkExist = async (path) => {
  if (!path) return false;
  let isExist = false;
  await promiser(fs.access, path).then(() => {
    isExist = true;
  }).catch(noop);
  return isExist;
}

module.exports = {
  env: async () => {
    const configPath = path.join(process.cwd(), '/.blogger/config.json');
    return await checkExist(configPath);
  },
  label: async (labelName) => {
    const labelPath = path.join(process.cwd(), `/${labelName}`);
    return await checkExist(labelPath);
  }
}