const fs = require('fs');
const path = require('path');
const config = require('../template/config');
const promiser = require('./promiser');
const { noop } = require('./index');

const { create: createConfig } = config; 

const createFile = async (path, source) => {
  let isDone = false;
  await promiser(fs.writeFile, path, source, 'utf8').then(() => {
    isDone = true;
  }).catch(noop);
  return isDone;
}

const env = async () => {
  const rootPath = path.join(process.cwd(), '/.blogger');
  const configPath = path.join(rootPath, '/config.json');
  await promiser(fs.access, rootPath).catch(() => {
    fs.mkdirSync(rootPath);
  });
  const source = await createConfig();
  return await createFile(configPath, source);
}

const label = async (labelName) => {
  const labelPath = path.join(process.cwd(), `/${labelName}`);
  fs.mkdirSync(labelPath);
}

module.exports = {
  env,
  label,
}