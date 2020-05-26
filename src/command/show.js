const inquirer = require('inquirer');
const Grid = require("console-grid");
const {
  get,
  update
} = require('../template/config');
const blogScan = require('../operate/scan').blog;
const error = require('../utils/error').inquirer;

const grid = new Grid();
const operateType = [{
  name: '标签分类',
  value: 0
}, {
  name: '文章（未发布）',
  value: 1
// }, {
//   name: '文章（已发布）',
//   value: 2
}];
const initialBlogColumns = [{
  id: "name",
  name: "博文名称",
  type: "string",
  maxWidth: 30
}, {
  id: "id",
  name: "ID",
  type: "string",
}, {
  id: "labels",
  name: "标签分类",
  type: "string",
  maxWidth: 30
}, {
  id: 'createdAt',
  name: '创建时间',
  type: 'string',
}];
const initialLabelColumns = [{
  id: "name",
  name: "标签名称",
  type: "string",
  maxWidth: 30
}, {
  id: "id",
  name: "ID",
  type: "string",
}];

module.exports = async () => {
  let data = {
    columns: initialBlogColumns,
  };
  let showType = 1;
  await inquirer
    .prompt({
      type: 'list',
      name: 'type',
      message: '查看内容',
      choices: operateType,
    })
    .then(answers => showType = answers.type)
    .catch(error);

  if (showType === 1) {
    const config = await get();
    const list = await blogScan();

    // 同步文件与配置
    let newBlog = {};
    const rows = Object.keys(config.blog).map(id => {
      const item = config.blog[id];
      if (list.includes(item.title)) {
        newBlog[id] = item;
        return item;
      }
      return null
    }).filter(i => !!i);

    config.blog = newBlog;
    update(config);

    data.rows = rows;
  } else if (showType === 2) {

  } else {
    data.columns = initialLabelColumns;
  }


  grid.render(data);
}