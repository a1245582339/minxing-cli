const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const figlet = require('figlet');
const chalk = require('chalk');
const ora = require('ora');
const log = console.log

function getPackVersion () {
    // 获取旧的版本配置文件
    const content = fs.readFileSync(path.join(__dirname, './config/plugin.properties')).toString('utf-8').split(';\r\n'); // 读取文件并转为utf-9
    const plugin = content.reduce((total, curr) => { // 字符串转为对象
        const keyVal = curr.split('=') // 用=分割key与val
        const key = keyVal[0].trim() // key去空格
        const val = keyVal[1].trim() // val去空格
        total[key] = val // 对应key与val
        return { ...total }
    }, {})
    return plugin
}

function addVersion (plugin) { // 增加版本号
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

function objToStr (plugin) { // 版本号对象转回字符串形式
    return Object.keys(plugin).reduce((total, curr) => {
        const item = `${curr} = ${plugin[curr]}` // key和val用 = 连接
        return [...total, item]
    }, []).join(';\r\n') // 配置项之间用;换行连接
}

function delOldZip () { // 删除旧的zip包
    const files = fs.readdirSync('./')
    const oldReg = new RegExp(`^(${newPluginObj.app_id}\\[version)(\\d{3,})(\\]\\.zip)$`) // 查找以app_id+[version开头并以]+.zip结尾的文件名
    const oldZips = files.filter(item => oldReg.test(item)) // 找到所有匹配的包
    if (oldZips.length) { // 如果有
        log(chalk.yellow(`发现当前目录下有${oldZips.length}个插件应用包，即将删除...`))
        oldZips.forEach(item => fs.unlinkSync(item)) // 全都删掉
        log(chalk.green('✅  删除成功'))
    } else {
        log(chalk.yellow('✅  未发现当前目录存在插件应用包'))
    }
}

const newPluginObj = addVersion(getPackVersion()) // 获取旧配置文件并增加版本号，拿到新的版本对象

const plugin = objToStr(newPluginObj) // 转换为新的plugin配置文件字符串
const config = fs.readFileSync(path.join(__dirname, './config/config.properties')) // 拿到config文件

fs.writeFileSync(path.join(__dirname, './config/plugin.properties'), plugin) // 将新的plugin覆盖到原位置
fs.writeFileSync(path.join(__dirname, './dist/plugin.properties'), plugin) // 将新的plugin放到dist中
fs.writeFileSync(path.join(__dirname, './dist/www/config.properties'), config) // 将config放到dist/www中
log(chalk.green('✅  已将新的配置文件存放至dist文件夹内'))
delOldZip()

const output = fs.createWriteStream(path.join(__dirname, `/${newPluginObj.app_id}[version${newPluginObj.version_code}].zip`)); // 使用appid与当前的版本号重命名
const archive = archiver('zip', {
    zlib: { level: 9 } // 压缩级别9
});
archive.pipe(output) // 将输出目录连接到archive
archive.directory('dist/', false); // 读取要压缩的文件夹dist
const spinner = ora({ text: '压缩中...', color: 'yellow' }).start(); // 开始loading
archive.finalize(); // 压缩完成
setTimeout(() => {
    spinner.stop() // loading结束
    log(chalk.green('✅  压缩完成'))
    figlet('MinXing', (_err, data) => {
        log(chalk.blue(data)) // 显示log
        log(chalk.blue('感谢使用敏行打包工具！'))
    })
}, 500)