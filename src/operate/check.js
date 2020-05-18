const fs = require('fs');
const path = require('path');
const {
  noop,
  promiser
} = require('../utils/index');

const checkExist = async (path) => {
  if (!path) return false;
  let isExist = false;
  await promiser(fs.access, path).then(() => {
    isExist = true;
  }).catch(noop);
  return isExist;
}

const checkIsFolder = async (path) => {
  if (!path) return false;
  return await promiser(fs.stat, path)
    .then(stat => {
      return stat.isDirectory();
    })
    .catch(() => {
      return false;
    });
}

module.exports = {
  checkExist,
  checkIsFolder,
  env: async () => {
    const configPath = path.join(process.cwd(), '/.blogger/config.json');
    return await checkExist(configPath);
  },
  label: async (labelName) => {
    const labelPath = path.join(process.cwd(), `/${labelName}`);
    return await checkExist(labelPath);
  },
  blog: async (params = {}) => {}
}