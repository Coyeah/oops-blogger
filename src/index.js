'use strict';

const yargs = require('yargs');

const cwd = process.cwd();

const argv = yargs
  .command('new [title]', 'Create a new blog.', yargs => {
    return yargs.positional('r', {
      alias: 'root',
      describe: 'custom file path.',
      type: 'string',
      default: '',
    }).positional('d', {
      alias: 'date',
      describe: 'date format',
      type: 'string',
      default: null,
    });
  })
  .help()
  .alias('help', 'h')
  .argv;

(async function () {
  if (argv._.includes('new')) {
    await require('./command/new')(argv);
  }
})();