const fs = require('fs');
const path = require('path');
const check = require('../operate/check');
const envGenerate = require('../operate/generate').env;
const labelScan = require('../operate/scan').label;
const { log } = require('../utils');

const { checkExist, env: envCheck } = check;

module.exports = async () => {
  // 新建相关文件夹
  const templatePath = path.join(process.cwd(), '/_TEMPLATE'),  // 模版
    unpublishedPath = path.join(process.cwd(), '/_UNPUBLISHED');  // 未发布
  !await checkExist(templatePath) && fs.mkdirSync(templatePath);
  !await checkExist(unpublishedPath) && fs.mkdirSync(unpublishedPath);

  const hasExist = await envCheck();
  if (hasExist) log.warn('blogger 环境已被构建。');
  else {
    const initLabels = await labelScan();
    const isGenerate = await envGenerate({
      labels: initLabels
    });
    if (isGenerate) log.success('blogger 环境构建完成，开始你的记录之旅！');
    else log.error('blogger 环境构建失败，请重试！');
  }
} 