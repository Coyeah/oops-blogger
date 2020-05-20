const fs = require('fs');
const promiser = require('../utils/promiser');
const {
  getLabelPath,
  templatePath
} = require('../common/paths');
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

const blog = async (path = templatePath) => {
  let list = [];
  // 若没有传入路径，默认 _template 下的博文；
  list = await promiser(fs.readdir, path)
    .then(fileList => fileList.map(item => item.split('.').shift()))
    .catch(() => []);
  return list;
}

module.exports = {
  label,
  blog,
}