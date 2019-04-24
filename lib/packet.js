const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const chalk = require('chalk');
const ora = require('ora');
const PROP = require('../utils/PROP')
const showLogo = require('./showLogo')
const log = console.log

function addVersion(plugin) { // 增加版本号
    const { version_name } = plugin // 取出当前版本号
    log(`旧版版本号：${chalk.yellow(version_name)}`)
    let newVersionArr = version_name.split('.') // 用.分割
    for (let i = newVersionArr.length - 1; i >= 0; i--) { // 增一，逢9进位
        if (newVersionArr[i] - 0 === 9) {
            newVersionArr[i] = 0
        } else {
            newVersionArr[i]++
            break
        }
    }
    plugin.version_name = newVersionArr.join('.') // name用.连接
    plugin.version_code = newVersionArr.join('') // code直接连接
    log(`新版版本号：${chalk.yellow(plugin.version_name)}`)
    return plugin
}

function delOldZip(newPlugin) { // 删除旧的zip包
    const files = fs.readdirSync(process.cwd())
    const oldReg = new RegExp(`^(${newPlugin.app_id}\\[version)(\\d{3,})(\\]\\.zip)$`) // 查找以app_id+[version开头并以]+.zip结尾的文件名
    const oldZips = files.filter(item => oldReg.test(item)) // 找到所有匹配的包
    if (oldZips.length) { // 如果有
        log(chalk.yellow(`发现当前目录下有${oldZips.length}个插件应用包，即将删除...`))
        oldZips.forEach(item => fs.unlinkSync(item)) // 全都删掉
        log(chalk.green('✅  删除成功'))
    } else {
        log(chalk.yellow('✅  未发现当前目录存在插件应用包'))
    }
}

function packet() {
    const oldPlugin = PROP.parse(fs.readFileSync(path.join(process.cwd(), './config/plugin.properties')))
    const newPlugin = addVersion(oldPlugin)
    const config = fs.readFileSync(path.join(process.cwd(), './config/config.properties'))

    try {
        fs.writeFileSync(path.join(process.cwd(), './dist/plugin.properties'), PROP.stringify(newPlugin)) // 将新的plugin放到dist中
        fs.writeFileSync(path.join(process.cwd(), './dist/www/config.properties'), config) // 将config放到dist/www中
        fs.writeFileSync(path.join(process.cwd(), './config/plugin.properties'), PROP.stringify(newPlugin)) // 将新的plugin覆盖到原位置
    } catch (err) {
        log(chalk.red('❗ 未找到当前目录下dist/www目录，写入敏行配置文件失败'))
        return false
    }

    log(chalk.green('✅  已将新的配置文件存放至dist文件夹内'))
    delOldZip(newPlugin)
    const output = fs.createWriteStream(path.join(process.cwd(), `/${newPlugin.app_id}[version${newPlugin.version_code}].zip`)); // 使用appid与当前的版本号重命名
    const archive = archiver('zip', {
        zlib: { level: 9 } // 压缩级别9
    });
    archive.pipe(output) // 将输出目录连接到archive
    archive.directory(path.join(process.cwd(), '/dist/'), false); // 读取要压缩的文件夹dist
    const spinner = ora({ text: '压缩中...', color: 'yellow' }).start(); // 开始loading
    archive.finalize(); // 压缩完成
    setTimeout(() => {
        spinner.stop() // loading结束
        log(chalk.green('✅  压缩完成'))
        showLogo()
    }, 500)
}
module.exports = packet

