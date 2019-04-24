#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const checkExist = require('./lib/checkExist')
const init = require('./lib/init')
const log = console.log

program
  .version('0.0.1')
  .option('-i, init', 'Add init')
  .option('-p, packet', 'Add packet')
  .parse(process.argv);
 
if (program.init) {
  checkExist().then(exist => {
    console.log('exist', exist)
    if (exist) {
      log(chalk.red('❗ 已存在敏行配置文件，创建失败！'))
    } else {
      init()
    }
  })
}
if (program.packet) {
  if (!checkExist()) {
    console.log('不是有效目录')
  }
}