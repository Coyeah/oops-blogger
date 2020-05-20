const inquirer = require('inquirer');
const {
  get,
  update
} = require('../template/config');
const labelCheck = require('../operate/check').label;
const labelGenerate = require('../operate/generate').label;
const {
  formatNames
} = require('../operate/utils');
const {
  log
} = require('../utils');
const error = require('../utils/error').inquirer;

const operateType = [{
  name: '新增标签',
  value: 1
}, {
  name: '删除标签',
  value: 0
}];

module.exports = async () => {
  let isAddLabel = true;
  await inquirer
    .prompt({
      type: 'list',
      name: 'type',
      message: '操作类型',
      choices: operateType,
    })
    .then(answers => isAddLabel = !!answers.type)
    .catch(error);

  const config = await get();
  if (isAddLabel) {
    let labels = [];
    await inquirer
      .prompt({
        type: 'input',
        name: 'labels',
        message: '标签名称（批量操作可用空格分割）'
      })
      .then(answers => labels = answers.labels.split(' ').filter(i => !!i))
      .catch(error);
    for (let i = 0, len = labels.length; i < labels.length; i++) {
      const labelName = labels[i];
      let text = formatNames.label(labelName);
      if (config) {
        if (config.labels.includes(labelName)) {
          log.warn(`${text}已存在；`);
        } else {
          config.labels.push(labelName);
          log.success(`${text}创建成功！`);
        }
      }
      const hasExist = await labelCheck(labelName);
      text = formatNames.folder(labelName)
      if (!hasExist) {
        await labelGenerate(labelName);
        log.success(`${text}创建成功！`);
      } else {
        log.warn(`${text}已存在；`);
      }
    }
  } else if (config && config.labels.length !== 0) {
    await inquirer
      .prompt({
        type: 'checkbox',
        name: 'labels',
        choices: config.labels,
        pageSize: 6,
      })
      .then(answers => {
        const delLabels = answers.labels;
        if (delLabels.length === 0) {
          log.warn('暂无标签可被操作；');
          return;
        }
        config.labels = config.labels.filter(i => !delLabels.includes(i));
        log.success(`${formatNames.label(delLabels.toString())}移除成功！`);
      })
      .catch(error);
  } else {
    log.warn(`暂无标签可被操作；`);
  }
  await update(config);
}