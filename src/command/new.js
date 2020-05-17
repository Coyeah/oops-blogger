const inquirer = require('inquirer');
const blogGenerate = require('../operate/generate').blog;
const {
  log
} = require('../utils');

module.exports = async (blogName, command, labels) => {
  const config = await require('../template/config').get();
  if (!config) return;
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

  const isGenerate = await blogGenerate({
    name: blogName,
    labels
  });
  if (isGenerate) log.success(`博文 [ ${blogName} ] 已生成；`);
  else log.error(`博文[ ${blogName} ]生成失败，请重试！`);

}