const fs = require('fs');
const path = require('path');
const promiser = require('../utils/promiser');
const checkIsFolder = require('../operate/check').checkIsFolder;

const isLabelFolder = (name) => !(/^(\.|_)/g.test(name));

const label = async () => {
  const list = await promiser(fs.readdir, process.cwd())
    .then(fileList => fileList.filter(isLabelFolder))
    .catch(() => []);
  let result = [];
  for (let i = 0, len = list.length; i < len; i++) {
    const item = list[i];
    if (await checkIsFolder(path.join(process.cwd(), item))) {
      result.push(item);
    }
  }
  return result;
}

module.exports = {
  label,
}