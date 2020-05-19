const fs = require('fs');
const promiser = require('../utils/promiser');
const getLabelPath = require('../common/paths').getLabelPath;
const checkIsFolder = require('../operate/check').checkIsFolder;

const isLabelFolder = (name) => !(/^(\.|_)/g.test(name));

const label = async () => {
  const list = await promiser(fs.readdir, process.cwd())
    .then(fileList => fileList.filter(isLabelFolder))
    .catch(() => []);
  let result = [];
  for (let i = 0, len = list.length; i < len; i++) {
    const labelName = list[i];
    if (await checkIsFolder(getLabelPath(labelName))) {
      result.push(labelName);
    }
  }
  return result;
}

module.exports = {
  label,
}