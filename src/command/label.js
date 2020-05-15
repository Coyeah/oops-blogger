const inquirer = require('inquirer');
const bloggerConfig = require('../template/config');
const labelCheck = require('../utils/check').label;
const labelGenerate = require('../utils/generate').label;
const {
  log
} = require('../utils');

module.exports = async (labelNames) => {
  const config = await bloggerConfig.get();
  if (labelNames.length !== 0) {
    for (let i = 0; i < labelNames.length; i++) {
      const labelName = labelNames[i];
      if (config.labels.includes(labelName)) {
        log.warn(`标签 [ ${labelName} ] 已存在；`);
      } else {
        config.labels.push(labelName);
        log.success(`标签 [ ${labelName} ] 创建成功！`);
      }
      const hasExist = await labelCheck(labelName);
      if (!hasExist) {
        await labelGenerate(labelName);
        log.success(`文件夹 [ ${labelName} ] 创建成功！`);
      }
    }
  } else if (config.labels.length !== 0) {
    await inquirer.prompt({
      type: 'checkbox',
      name: 'labels',
      choices: config.labels,
      pageSize: 10,
    }).then(answers => {
      const delLabels = answers.labels;
      config.labels = config.labels.filter(i => {
        return !delLabels.includes(i);
      });
      log.success(`标签 [ ${delLabels.toString()} ] 移除成功！`);
      log.success(`当前标签 [ ${config.labels.toString()} ];`);
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
  await bloggerConfig.updated(config);
}