#!/usr/bin/env node
const program = require('commander');
const chalk = require('chalk');
const checkExist = require('./lib/checkExist')
const init = require('./lib/init')
const packet = require('./lib/packet')
const log = console.log

program
  .version('0.0.1')
  .option('-i, init', 'Add init')
  .option('-p, packet', 'Add packet')
  .parse(process.argv);
 
if (program.init) {
  checkExist().then(exist => {
    if (exist) {
      log(chalk.red('❗ 已存在敏行配置文件，创建失败！'))
    } else {
      init()
    }
  })
}
if (program.packet) {
  checkExist().then(exist => {
    if (exist) {
      packet()
    } else {
      log(chalk.red('❗ 不是有效的敏行目录，打包失败！'))
    }
  })
}