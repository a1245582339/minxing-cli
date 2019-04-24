const figlet = require('figlet')
const chalk = require('chalk')

function showLogo () {
    figlet('MinXing', (_err, data) => {
        console.log(chalk.blue(data)) // 显示log
        console.log(chalk.blue('感谢使用敏行H5插件应用脚手架！'))
    })
}
module.exports = showLogo