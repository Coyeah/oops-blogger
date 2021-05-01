'use strict';
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { DATE_FORMAT_ENUM } = require('./utils/date');

const CWD = process.cwd();
const argv = yargs(hideBin(process.argv))
  .usage('Usage: blogger new [title] <options>')
  .group(['r', 'd', 'f'], '新建文章：')
  .group(['r', 's', 'e'], '浏览文章：')
  .option('r', {
    alias: 'root',
    describe: '相对路径',
    type: 'string',
    default: './',
  })
  .option('d', {
    alias: 'date',
    describe: '时间格式',
    type: 'string',
    choices: Object.values(DATE_FORMAT_ENUM),
  })
  .option('f', {
    alias: 'file',
    describe: '构建单个文件',
    type: 'boolean',
    default: false,
  })
  .option('s', {
    alias: 'size',
    describe: '单页条目数量',
    type: 'number',
    default: 15,
  })
  .option('e', {
    alias: 'edit',
    describe: '打开选中文章',
    type: 'boolean',
    default: false,
  })
  .help()
  .alias('help', 'h')
  .argv;

(async function () {
  argv.CWD = CWD;
  if (argv._.includes('new')) {
    argv.title = typeof argv._[1] === 'undefined' ? void (0) : String(argv._[1]);
    await require('./command/new')(argv);
  } else if (argv._.includes('list')) {
    await require('./command/list')(argv);
  }
})();