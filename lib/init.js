const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const prompt = require('../prompt/init');
const PROP = require('../utils/PROP')
const showLogo = require('./showLogo')
const log = console.log

function init () {
    inquirer.prompt(prompt).then(answers => {
        const { hideWebViewTitle, hideOptionMenu, hideToolbar, app_id, frame } = answers
        const config = { hideWebViewTitle, hideOptionMenu, hideToolbar }
        const plugin = {
            app_id,
            version_name: '0.0.1',
            version_code: '001',
            type: 'html5',
            platform: '[ios,android]'
        }
        if (frame !== 'js') {
            plugin.frame = frame
        }
        if (!fs.existsSync(path.join(process.cwd(), '/config')) || !fs.statSync(path.join(process.cwd(), '/config')).isDirectory()) {
            fs.mkdirSync(path.join(process.cwd(), '/config'))
            log(chalk.green('✅  成功创建config目录'))
        } else {
            log(chalk.yellow('当前项目已存在敏行配置文件目录，无需创建'))
        }
        fs.writeFileSync(path.join(process.cwd(), '/config/plugin.properties'), PROP.stringify(plugin))
        fs.writeFileSync(path.join(process.cwd(), '/config/config.properties'), PROP.stringify(config))
        log(chalk.green('✅  已成功将当前项目初始化为敏行H5插件应用！'))
        showLogo()
    })
}

module.exports = init