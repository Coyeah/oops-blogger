const fs = require('fs');
const {
  _blogTemplatePath
} = require('../common/paths');
const {
  log,
  promiser,
} = require('../utils');

const formatText = text => `<!--${text}-->`;
const markReg = /<!--BLOGGER_MARK_ANNOTATE-->(.|\n)*/g;
const getMarkText = text => `<!--BLOGGER_MARK_ANNOTATE-->\n${String(text)}`;

const create = async (params = {}) => {
  let source = '',
    name = params.name || 'My blog';
  await promiser(fs.readFile, _blogTemplatePath, 'utf8')
    .then(result => {
      source = result;
    })
    .catch(err => {
      log.unknown();
      source = null;
    });
  if (!source) return null;
  return source
    .replace(/<!--BLOG_NAME-->/g, name)
    .replace(markReg, convertSource(params));
}

const AnnotateEnum = {
  name: '文章名称',
  labels: '标签分类',
  createdAt: '创建时间',
  publishedAt: '发布时间',
  updatedAt: '最后修改时间'
}

function convertSource(params = {}, isAnnotate = false) {
  let list = [];
  Object.keys(params).map(key => {
    const name = AnnotateEnum[key];
    if (!name) return;
    list.push({
      name,
      value: params[key]
    })
  });
  const target = list.map(item => {
    let text = '';
    if (typeof item === 'object') {
      const {
        name,
        value
      } = item;
      text = `${String(name)}: ${String(value)};`
    } else {
      text = String(item);
    }
    return isAnnotate ? formatText(text) : text;
  }).join('\n') + '\n';
  return getMarkText(target);
}

module.exports = {
  create,
  convertSource,
}