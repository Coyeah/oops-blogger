const fs = require('fs');
const path = require('path');
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
  const rootPath = path.join(process.cwd(), '/.blogger');
  const configPath = path.join(rootPath, '/config.json');
  await promiser(fs.access, rootPath).catch(() => {
    fs.mkdirSync(rootPath);
  });
  const source = await require('../template/config').create(params);
  return await createFile(configPath, source);
}

const label = async (labelName) => {
  const labelPath = path.join(process.cwd(), `/${labelName}`);
  fs.mkdirSync(labelPath);
}

const blog = async (params) => {
  if (!params || !params.name) return false;
  const {
    title = require('./utils').formatBlogName(params.name)
  } = params;
  const targetPath = path.join(process.cwd(), `/_TEMPLATE/${title}.md`);
  const source = await require('../template/blog').create(params);
  return await createFile(targetPath, source);
}

module.exports = {
  env,
  label,
  blog,
}