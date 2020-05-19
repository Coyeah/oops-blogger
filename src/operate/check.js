const fs = require('fs');
const { getLabelPath, configPath } = require('../common/paths');
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
    return await checkExist(configPath);
  },
  label: async (labelName) => {
    return await checkExist(getLabelPath(labelName));
  },
  blog: async (params = {}) => {}
}