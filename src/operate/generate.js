const fs = require('fs');
const { bloggerPath, configPath, getLabelPath, getTemplateBlogPath } = require('../common/paths');
const {
  promiser
} = require('../utils/index');

const createFile = async (path, source) => {
  let isDone = false;
  await promiser(fs.writeFile, path, source, 'utf8').then(() => {
    isDone = true;
  }).catch((err) => {
    console.log(err);
  });
  return isDone;
}

const env = async (params = {}) => {
  await promiser(fs.access, bloggerPath).catch(() => {
    fs.mkdirSync(bloggerPath);
  });
  const source = await require('../template/config').create(params);
  return await createFile(configPath, source);
}

const label = async (labelName) => {
  const labelPath = getLabelPath(labelName);
  fs.mkdirSync(labelPath);
}

const blog = async (params) => {
  if (!params || !params.name) return false;
  const {
    title = require('./utils').formatBlogName(params.name)
  } = params;
  const targetPath = getTemplateBlogPath(title);
  const source = await require('../template/blog').create(params);
  return await createFile(targetPath, source);
}

module.exports = {
  env,
  label,
  blog,
}