'use strict'

const program = require('commander');
const error = require('./utils/error');

// 定义当前版本
program
  .version(require('../package').version );

// 定义使用方法
program
  .usage('<command>');
  // 脚手架支持用户输入4种不同的命令,处理这4种命令的方法：
  // commander的具体使用方法在这里就不展开了，可以直接到官网https://github.com/tj/commander.js/去看详细的文档。
  
program
  .command('init')
  .description('构建 blogger 环境；')
  .action(error(require('./command/init')));

program
  .command('label')
  .arguments('[labelName...]')
  .description('新建/移除标签；支持批量新建；若无标签名称则为移除；')
  .action(error(require('./command/label')));
  
program
  .command('new')
  .arguments('<blogName>')
  .option('-l, --label', '指定标签')
  .description('新建博文；')
  .action(error(require('./command/new')));

// 处理参数和提供帮助信息
program.parse(process.argv);

if(!program.args.length){
  program.help();
}
