const fs = require('fs');
const inquirer = require('inquirer');
const {
  get,
  update
} = require('../template/config');
const {
  getTemplateBlogPath
} = require('../common/paths');
const {
  checkExist
} = require('../operate/check');
const {
  log,
  promiser,
  noop,
} = require('../utils');
const {
  formatNames
} = require('../operate/utils');
const error = require('../utils/error').inquirer;

module.exports = async (id) => {
  const config = await get();
  if (!id) {
    const choises = Object.keys(config.blog).map(id => {
      const item = config.blog[id];
      return {
        name: item.title,
        value: id
      }
    }).filter(i => !!i);

    await inquirer
      .prompt({
        type: "list",
        name: 'target',
        message: '请选择博文',
        choices: choises,
        pageSize: 10
      })
      .then(answers => id = answers.target)
      .catch(error);
  }

  const target = config.blog[id];
  const text = formatNames.blog(target.name);
  const targetPath = getTemplateBlogPath(target.title);
  // delete config.blog[id];

  if (!await checkExist(targetPath)) {
    log.error(`${text}文件不存在；`)
    update(config);
    return;
  }

  await promiser(
    fs.readFile,
    targetPath,
    'utf8'
  ).then(result => {
    console.log(result)
  }).catch(noop);

  update(config);
}