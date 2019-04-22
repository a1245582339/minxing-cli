#!/usr/bin/env node
const program = require('commander');
const checkExist = require('./lib/checkExist')
program
  .version('0.0.1')
  .option('-i, init', 'Add init')
  .option('-p, packet', 'Add packet')
  .parse(process.argv);
 
if (program.init) {
  if (checkExist()) {
    console.log('已存在')
  } else {
    
  }
}
if (program.packet) {
  if (!checkExist()) {
    console.log('不是有效目录')
  }
}