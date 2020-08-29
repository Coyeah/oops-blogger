'use strict';

const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

module.exports = (argv) => {
  const {
    title,
    root
  } = argv;
  const nowDate = require('moment')().format('YYYY-MM-DD HH:mm:ss');
  let questionList = [{
    type: 'input',
    name: 'title',
    message: '题目',
  }, {
    type: 'input',
    name: 'date',
    message: '创建时间',
    default: nowDate
  }];
  if (title) questionList.shift();

  inquirer
    .prompt(questionList)
    .then(answer => {
      answer.title = answer.title || title || '新建文章';
      answer.date = answer.date || nowDate;

      try {
        fs.readFileSync(path.resolve(process.cwd(), `${answer.title}.md`));
        console.info(chalk.redBright('[blogger]'), `${answer.title}.md 已存在！`);
        return;
      } catch (ex) {}

      const location = path.join(__dirname, '../template/article.md');
      const targetLocation = path.join(root, `${answer.title.replace(/\s/g, '-')}.md`);
      let template = fs.readFileSync(location, 'utf-8');

      Object.keys(answer).map(key => {
        template = template.replace(`<!-- ${key} -->`, answer[key]);
      });

      fs.writeFileSync(targetLocation, template);

      console.log('\n');
      console.info(chalk.greenBright('[blogger]'), `${answer.title} 新建成功！`);
      console.log('\n');
    })
    .catch(error => {
      if (error.isTtyError) {
        console.info(chalk.redBright('[blogger]'), 'render error, please change CMD!');
      } else {
        console.info(chalk.redBright('[blogger]'), 'something is error!');
        console.info(error);
      }
    });

}