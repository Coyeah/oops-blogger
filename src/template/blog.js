const fs = require('fs');
const path = require('path');
const moment = require('moment');
const {
  log,
  promiser,
} = require('../utils');

const create = async (params = {}) => {
  const templatePath = path.join(__dirname, '../template/blog.template.md');
  const {
    name = 'my blog', labels = []
  } = params;
  let source = '';
  await promiser(fs.readFile, templatePath, 'utf8')
    .then(result => {
      source = result;
    })
    .catch(err => {
      log.unknown();
      source = null;
    });
  if (!source) return null;
  const time = new moment().format('YYYY-MM-DD HH:mm:ss');
  return source
    .replace(/<!--BLOG_NAME-->/g, name)
    .replace(/<!--BLOG_CREATED_AT-->/g, time)
    .replace(/labels: <!--BLOG_LABELS-->;\n/g, labels.length === 0 ? '' : `labels: ${labels.join('、')};\n`);
}

module.exports = {
  create,
}