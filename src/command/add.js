const inquirer = require('inquirer');
const uuidv4 = require('uuid').v4;
const blogGenerate = require('../operate/generate').blog;
const {
  formatBlogName,
  formatNames
} = require('../operate/utils');
const {
  getTemplateBlogPath
} = require('../common/paths');
const checkExist = require('../operate/check').checkExist;
const {
  get,
  update
} = require('../template/config');
const {
  log
} = require('../utils');

module.exports = async (blogName, command, labels) => {
  const config = await get();
  if (!config) return;

  const title = formatBlogName(blogName);
  let text = formatNames.blog(blogName);
  if (!!config.blog[title] || await checkExist(getTemplateBlogPath(title))) {
    log.error(`${text}已存在；使用命令：\"blogger remove [blogName/id]\" 移除已有博文；`);
    return;
  }

  if (labels) {
    labels = labels.filter(label => config.labels.includes(label));
    if (labels.length === 0) labels = void(0);
  }

  if (!labels) {
    await inquirer.prompt({
      type: 'checkbox',
      name: 'labels',
      choices: config.labels,
      pageSize: 10,
    }).then(answers => {
      labels = answers.labels;
    }).catch(error => {
      if (error.isTtyError) {
        log.error('操作面板无法在当前工具正确展示；');
      } else {
        log.unknown();
      }
    });
  }

  const info = {
    id: uuidv4(),
    name: blogName,
    title,
    labels,
  }
  const isGenerate = await blogGenerate(info);
  if (isGenerate) {
    config.blog[title] = info;
    await update(config);
    log.success(`${text}已生成；`);
  } else log.error(`${text}生成失败，请重试！`);
}