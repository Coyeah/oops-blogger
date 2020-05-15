const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {
  log,
  promiser,
  noop
} = require('../utils');
const envCheck = require('../utils/check').env;

const get = async () => {
  const hasExist = await envCheck();
  const configPath = path.join(process.cwd(), '/.blogger/config.json');
  let config = null;
  if (!hasExist) {
    log.warn('blogger 环境未构建，建议构建 blogger 环境；使用命令：\"blogger init\"');
    return config;
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

const updated = async (config) => {
  if (!config) return;
  config.updatedAt = new moment().format('YYYY-MM-DD HH:mm:ss');
  await promiser(
    fs.writeFile,
    path.join(process.cwd(), '/.blogger/config.json'),
    JSON.stringify(config),
    'utf8'
  ).then(noop).catch(() => {
    log.unknown();
  });
}

const create = async () => {
  const templatePath = path.join(__dirname, '../template/config.template.json');
  const name = process.cwd().split('/').pop();
  let source = '';
  await promiser(fs.readFile, templatePath, 'utf8')
    .then(result => {
      source = result;
    })
    .catch(err => {
      log.unknown();
      source = null;
    });
  if (!source) return null;
  return source
    .replace(/<!--BLOGGER_CONFIG_NAME-->/g, name)
    .replace(/<!--BLOGGER_CONFIG_CREATEDAT-->/g, new moment().format('YYYY-MM-DD HH:mm:ss'));
}

module.exports = {
  get,
  updated,
  create,
}