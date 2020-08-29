'use strict';

const yargs = require('yargs');

const cwd = process.cwd();

const argv = yargs
  .command('new [title]', 'Create a new blog.', yargs => {
    yargs.positional('r', {
      alias: 'root',
      describe: 'custom file path.',
      type: 'string',
      default: cwd,
    })
  })
  .help()
  .alias('help', 'h')
  .argv;

(async function () {
  if (argv._.includes('new')) {
    await require('./command/new')(argv);
  }
})();