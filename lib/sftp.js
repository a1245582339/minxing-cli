const client = require('scp2')
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const prompt = require('../prompt/sftp');
const showLogo = require('./showLogo')
const log = console.log

async function getConfig () {
    let config
    if (fs.existsSync(path.join(process.cwd(), '/.vscode/sftp.json'))) {
        config = JSON.parse(fs.readFileSync(path.join(process.cwd(), '/.vscode/sftp.json')).toString('utf-8'))
        if (!config.localPath) {
            config.localPath = (await inquirer.prompt({
                type: 'input',
                message: '请输入需要上传的文件夹路径',
                name: 'localPath',
                validate: (val) => {
                    if (val) {
                        return true
                    } else {
                        return '请输入需要上传的文件夹路径'
                    }
                }
            })).localPath
            fs.writeFileSync(path.join(process.cwd(), '/.vscode/sftp.json'), JSON.stringify(config))
        }
    } else {
        log(chalk.yellow('未找到当前项目根目录下 .vscode/sftp.json 配置文件，请选择配置'))
        config = { ...(await inquirer.prompt(prompt)), "protocol": "sftp" }
        if (!fs.existsSync(path.join(process.cwd(), '/.vscode')) || !fs.statSync(path.join(process.cwd(), '/.vscode')).isDirectory()) {
            fs.mkdirSync(path.join(process.cwd(), '/.vscode'))
            log(chalk.green('✅  成功创建.vscode文件夹'))
        }
        fs.writeFileSync(path.join(process.cwd(), '/.vscode/sftp.json'), JSON.stringify(config))
        log(chalk.green('✅  成功创建sftp配置文件'))
    }
    return {
        ...config,
        path: config.remotePath
    }
}

async function sftp () {
    const config = await getConfig ()
    if (!fs.existsSync(path.join(process.cwd(), config.localPath))) {
        log(chalk.red(`❗  未发现当前目录下 ${config.localPath} 文件夹，请检查后再试`))
        return false
    }
    
    const spinner = ora({ text: '上传中...', color: 'yellow' }).start();
    client.scp(path.join(process.cwd(), config.localPath), config, function (err) {
        if (err) {
            spinner.stop()
            log(chalk.red('❗  上传失败，请检查sftp配置文件'))
        } else {
            spinner.stop()
            log(chalk.green('✅  上传成功'))
            showLogo()
        }
    })
}
module.exports = sftp