const inquirer = require('inquirer');
const Grid = require("console-grid");
const {
  get,
  update
} = require('../template/config');
const blogScan = require('../operate/scan').blog;
// const error = require('../utils/error').inquirer;

const grid = new Grid();
// const operateType = [{
//   name: '未发布',
//   value: 0
// }, {
//   name: '发布',
//   value: 1
// }];

module.exports = async () => {
  let data = {
    columns: [{
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
      id: 'createAt',
      name: '创建时间',
      type: 'string',
    }],
  };

  let isPublished = false;
  // await inquirer
  //   .prompt({
  //     type: 'list',
  //     name: 'type',
  //     message: '查看博文类型',
  //     choices: operateType,
  //   })
  //   .then(answers => isPublished = !!answers.type)
  //   .catch(error);

  if (isPublished) {

  } else {
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
  }


  grid.render(data);
}