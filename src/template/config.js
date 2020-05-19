const fs = require('fs');
const moment = require('moment');
const { configPath, _configTemplatePath } = require('../common/paths');
const {
  log,
  promiser,
  noop
} = require('../utils');
const envCheck = require('../operate/check').env;

const get = async () => {
  const hasExist = await envCheck();
  let config = null;
  if (!hasExist) {
    log.warn('blogger 环境未构建，建议构建 blogger 环境；使用命令：\"blogger init\"');
    return null;
  }
  await promiser(
    fs.readFile,
    configPath,
    'utf8'
  ).then(result => {
    config = JSON.parse(result);
    if (!config.labels.includes(labelName)) {
      config.labels.push(labelName);
    }
  }).catch(noop);
  return config;
}

const update = async (config) => {
  if (!config) return;
  config.updatedAt = new moment().format('YYYY-MM-DD HH:mm:ss');
  await promiser(
    fs.writeFile,
    configPath,
    JSON.stringify(config),
    'utf8'
  ).then(noop).catch(() => {
    log.unknown();
  });
}

const create = async (params = {}) => {
  const name = process.cwd().split('/').pop();
  let source = '';
  await promiser(fs.readFile, _configTemplatePath, 'utf8')
    .then(result => {
      source = result;
    })
    .catch(err => {
      log.unknown();
      source = null;
    });
  if (!source) return null;
  const time = new moment().format('YYYY-MM-DD HH:mm:ss'); 
  source = source
    .replace(/<!--BLOGGER_CONFIG_NAME-->/g, name)
    .replace(/<!--BLOGGER_CONFIG_CREATEDAT-->/g, time);
  
  let sourceObj = JSON.parse(source);
  sourceObj = {
    ...sourceObj,
    name,
    createdAt: time,
    updatedAt: time,
    ...params
  }

  return JSON.stringify(sourceObj);
}

module.exports = {
  get,
  update,
  create,
}