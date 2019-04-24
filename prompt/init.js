/* init时的问答 */

module.exports = [
    {
        type: 'confirm',
        message: '是否隐藏原生头部',
        name: 'hideWebViewTitle',
        default: false,
    }, {
        type: 'confirm',
        message: '是否隐藏工具菜单',
        name: 'hideOptionMenu',
        default: true,
    }, {
        type: 'confirm',
        message: '是否隐藏工具栏',
        name: 'hideToolbar',
        default: true,
    }, {
        type: 'input',
        message: '请输入app_id',
        name: 'app_id',
        validate: (val) => {
            if (val) {
                return true
            } else {
                return '请输入app_id'
            }
        }
    }, {
        type: 'list',
        message: '请选择要使用的框架',
        name: 'frame',
        choices: ['vue', 'react', { name: '原生js', value: 'js' }],
        default: 'vue'
    }
  ]