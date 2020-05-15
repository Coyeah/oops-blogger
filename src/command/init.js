const envCheck = require('../utils/check').env;
const envGenerate = require('../utils/generate').env;
const { log } = require('../utils');

module.exports = async () => {
  const hasExist = await envCheck();
  if (hasExist) log.warn('blogger 环境已被构建。');
  else {
    const isGenerate = await envGenerate();
    if (isGenerate) log.success('blogger 环境构建完成，开始你的记录之旅！');
    else log.error('blogger 环境构建失败，请重试！')
  }
} 