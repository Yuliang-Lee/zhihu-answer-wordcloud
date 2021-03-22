'use strict';
const fs = require('fs');
const chalk = require('chalk');


/**
 * 命令行参数检查
 * @param {Object} conf - 参数对象
 */
exports.check = function(conf) {
  if (!conf._.length || typeof conf._[0] !== 'number') {
    console.log(chalk.red('缺少问题 ID'));
    process.exit(1);
  }
  if (conf.number && (typeof conf.number !== 'number' || conf.number < 0)) {
    console.log(chalk.red('统计回答数不能小于 0！'));
    process.exit(1);
  }

  if (conf.words && (typeof conf.words !== 'number' || conf.words < 0)) {
    console.log(chalk.red('统计词云词数不能小于 0！'));
    process.exit(1);
  }

  if (conf.path) {
    try {
      fs.accessSync(conf.path, fs.constants.R_OK | fs.constants.F_OK);
    } catch (err) {
      console.log(chalk.red(`文件 ${conf.path} 不存在！`));
      process.exit(1);
    }
  }
}
;
