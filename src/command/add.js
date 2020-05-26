const inquirer = require('inquirer');
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
  log,
  getUniqueId,
  getNowTime,
} = require('../utils');
const error = require('../utils/error').inquirer;

module.exports = async () => {
  const config = await get();
  if (!config) return;

  let name = null;
  await inquirer
    .prompt({
      type: 'input',
      name: 'name',
      message: '文章题目',
    })
    .then(answers => name = answers.name)
    .catch(error);
  if (!name) {
    log.error(`文章题目不可为空！`);
    return;
  }

  const title = formatBlogName(name);
  let text = formatNames.blog(name);
  if (!!config.blog[title] || await checkExist(getTemplateBlogPath(title))) {
    log.error(`${text}已存在；使用命令：\"blogger remove\" 移除已有博文；`);
    return;
  }

  let labels = [];
  await inquirer
    .prompt({
      type: 'checkbox',
      name: 'labels',
      message: '标签分类',
      choices: config.labels,
      pageSize: 10,
    })
    .then(answers => labels = answers.labels)
    .catch(error);

  const info = {
    id: getUniqueId(config.blog),
    name,
    title,
    labels,
    createdAt: getNowTime(),
  }
  const isGenerate = await blogGenerate(info);
  if (isGenerate) {
    config.blog[info.id] = info;
    await update(config);
    log.success(`${text}已生成；文件路径：${getTemplateBlogPath(title)}`);
  } else log.error(`${text}生成失败，请重试！`);
}
