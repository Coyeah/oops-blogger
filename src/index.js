'use strict';

const argv = require('yargs')
  .command('new [title]', 'Create a new blog.',
    yargs =>
      yargs.positional('r', {
        alias: 'root',
        describe: 'custom file path',
        type: 'string',
        default: '',
      }).positional('d', {
        alias: 'date',
        describe: 'date format',
        type: 'string',
        default: null,
      }).positional('f', {
        alias: 'file',
        default: 'write in a file',
        type: 'boolean',
        default: false,
      })
  )
  .help()
  .alias('help', 'h')
  .argv;

(async function () {
  if (argv._.includes('new')) {
    await require('./command/new')(argv);
  }
})();