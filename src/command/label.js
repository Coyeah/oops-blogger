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
  log,
  getUniqueId,
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
  let labelNameMap = {};
  const labels = Object.keys(config.labels).map(key => {
    const name = config.labels[key].name;
    labelNameMap[name] = key;
    return {
      name,
      value: key,
    };
  });
  if (isAddLabel) {
    let labelList = [];
    await inquirer
      .prompt({
        type: 'input',
        name: 'labels',
        message: '标签名称（批量操作可用空格分割）'
      })
      .then(answers => labelList = answers.labels.split(' ').filter(i => !!i))
      .catch(error);
    for (let i = 0, len = labelList.length; i < len; i++) {
      const labelName = labelList[i];
      const id = getUniqueId(config.labels);
      let text = formatNames.label(labelName);
      if (config) {
        if (!!labelNameMap[labelName]) {
          log.warn(`${text}已存在；`);
        } else {
          log.success(`${text}创建成功！`);
          config.labels[id] = {
            name: labelName,
            id,
          };
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
        choices: labels,
        pageSize: 6,
      })
      .then(answers => {
        const delLabels = answers.labels;
        if (delLabels.length === 0) {
          log.warn('暂无标签可被操作；');
          return;
        }
        delLabels.map(key => {
          delete config.labels[key];
        });
        log.success(`${formatNames.label(delLabels.toString())}移除成功！`);
      })
      .catch(error);
  } else {
    log.warn(`暂无标签可被操作；`);
  }
  await update(config);
}