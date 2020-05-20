const fs = require('fs');
const inquirer = require('inquirer');
const {
  get,
  update
} = require('../template/config');
const blogScan = require('../operate/scan').blog;
const {
  getTemplateBlogPath
} = require('../common/paths');
const {
  formatNames
} = require('../operate/utils');
const {
  log,
  promiser,
} = require('../utils');
const error = require('../utils/error').inquirer;

module.exports = async () => {
  const config = await get();
  const list = await blogScan();

  // 同步文件与配置
  let newBlog = {};
  const choises = Object.keys(config.blog).map(id => {
    const item = config.blog[id];
    if (list.includes(item.title)) {
      newBlog[id] = item;
      return {
        name: item.title,
        value: id
      };
    }
    return null
  }).filter(i => !!i);

  let ids = null;
  await inquirer
    .prompt([{
      type: "checkbox",
      name: 'list',
      message: '请选择博文',
      choices: choises,
      pageSize: 10
    }, {
      type: "confirm",
      name: "confirm",
      message: '确认删除操作',
    }])
    .then(({
      confirm,
      list
    }) => {
      if (confirm) {
        ids = list;
      }
    })
    .catch(error);

  if (!ids) return;
  for (let i = 0, len = ids.length; i < len; i++) {
    const id = ids[i];
    const text = formatNames.blog(newBlog[id].name)
    await promiser(fs.unlink, getTemplateBlogPath(newBlog[id].title))
      .then(() => {
        log.success(`${text}移除成功！`);
        delete newBlog[id];
      }).catch(() => {
        log.warn(`${text}移除失败，请重试！`);
      });
  }

  config.blog = newBlog;
  update(config);
}