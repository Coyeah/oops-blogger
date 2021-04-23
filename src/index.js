'use strict';
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const { DATE_FORMAT_ENUM } = require('./utils/date');

const argv = yargs(hideBin(process.argv))
  .usage('Usage: blogger new [title] <options>')
  .group(['r', 'd', 'f'], '新建文章：')
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
  .help()
  .alias('help', 'h')
  .argv;

(async function () {
  if (argv._.includes('new')) {
    argv.title = typeof argv._[1] === 'undefined' ? void (0) : String(argv._[1]);
    await require('./command/new')(argv);
  }
})();