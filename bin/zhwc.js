#!/usr/bin/env node

const yargs = require('yargs');
const chalk = require('chalk');
const _ = require('lodash');
const ora = require('ora');
const { check } = require('../lib/check');
const { getVersion } = require('../lib/utils');
const { main } = require('../index');


const argv = yargs
  .version(getVersion())
  .usage('Usage: $0 <answerId>')
  // .option('config', {alias: 'c', describe: '指定配置文件路径', config: true})
  .option('number', {alias: 'n', describe: `需要统计多少条回答, 0 表示获取全部，默认：100`, default: 100, number: true})
  .option('path', {alias: 'p', describe: '图片存储路径，默认：当前命令执行路径', string: true})
  .option('words', {alias: 'w', describe: '词云最多显示多少个词语，默认：20', default: 20, number: true})
  // .demandOption('answerId', '知乎问题ID，打开想要分析的知乎问题，如：https://www.zhihu.com/question/26297181，最后的那一串数字即是 ID')
  .help()
  .argv;

check(argv);


const spinner = ora('开始获取数据').start();

main(argv).then(_ => {
  chalk.green('请查看图片');
}).catch(error => {
  console.error(error)
  process.exit(-1);
})

spinner.stop();