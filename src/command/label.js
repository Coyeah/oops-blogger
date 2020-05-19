const inquirer = require('inquirer');
const bloggerConfig = require('../template/config');
const labelCheck = require('../operate/check').label;
const labelGenerate = require('../operate/generate').label;
const {
  formatNames
} = require('../operate/utils');
const {
  log
} = require('../utils');

const {
  get,
  update
} = bloggerConfig;

module.exports = async (labelNames) => {
  const config = await get();

  if (labelNames.length !== 0) {
    for (let i = 0; i < labelNames.length; i++) {
      const labelName = labelNames[i];
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
    log.info(`请选择要删除的标签：`);
    await inquirer.prompt({
      type: 'checkbox',
      name: 'labels',
      choices: config.labels,
      pageSize: 10,
    }).then(answers => {
      const delLabels = answers.labels;
      if (delLabels.length === 0) {
      log.warn('暂无标签可被操作；');
      return;
      }
      config.labels = config.labels.filter(i => {
        return !delLabels.includes(i);
      });
      const text = formatNames.label(delLabels.toString());
      log.success(`${text}移除成功！`);
      log.success(`当前${text};`);
    }).catch(error => {
      if (error.isTtyError) {
        log.error('操作面板无法在当前工具正确展示；');
      } else {
        log.unknown();
      }
    });
  } else {
    log.warn(`暂无标签可被操作；`);
  }
  await update(config);
}