const path = require('path');

module.exports = {
  templatePath: path.join(process.cwd(), '/_TEMPLATE'),
  unpublishedPath: path.join(process.cwd(), '/_UNPUBLISHED'),
  imagesPath: path.join(process.cwd(), '/_IMAGES'),
  bloggerPath: path.join(process.cwd(), '/.blogger'),
  configPath: path.join(process.cwd(), '/.blogger/config.json'),

  getTemplateBlogPath: title => path.join(process.cwd(), `/_TEMPLATE/${title}.md`),
  getLabelPath: labelName => path.join(process.cwd(), `/${labelName}`),

  _blogTemplatePath: path.join(__dirname, '../template/blog.template.md'),
  _configTemplatePath: path.join(__dirname, '../template/config.template.json'),
}