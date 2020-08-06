'use strict';

const yargs = require('yargs');

const cwd = process.cwd();

const argv = yargs
  .command('new [title]', 'create a new blog.', yargs => {
    yargs.positional('r', {
      alias: 'root',
      describe: 'custom file path.',
      type: 'string',
      default: cwd,
    })
  })
  .argv;

if (argv._.includes('new')) {
  require('./command/new')(argv);
}