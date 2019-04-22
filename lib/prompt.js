const inquirer = require('inquirer');
const prompt = require('./lib/prompt')
inquirer.prompt(prompt)
  .then(answers => {
    console.log('！！！！！！！' + JSON.stringify(answers))
  });

module.exports = [
    {
        type: 'list',
        message: '请选择Vue脚手架版本:',
        name: 'cli_version',
        choices: ['2.x', '3.x'],
        default: '2.x',
        filter: (ver) => {
            return ver.split('.')[0]
        }
    }, {
        type: 'confirm',
        message: '是否引入敏行JS API',
        name: 'mxapi',
        default: true,
    }, {
        type: 'confirm',
        message: '是否使用eslint',
        name: 'eslint',
        default: true,
    }, {
        type: 'list',
        message: '使用哪个UI组件库',
        name: 'ui',
        choices: [new inquirer.Separator('---管理端---'), 'iview', 'element UI', new inquirer.Separator('---移动端---'),  'mint UI', 'vant UI'],
    },
    
  ]