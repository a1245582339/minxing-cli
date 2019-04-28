/* 创建sftp的问答 */

module.exports = [
    {
        type: 'input',
        message: '请输入服务器IP',
        name: 'host',
        validate: (val) => {
            if (val) {
                return true
            } else {
                return '请输入服务器IP'
            }
        }
    },
    {
        type: 'number',
        message: '请输入服务器端口号',
        name: 'port',
        default: 22,
        validate: (val) => {
            if (val) {
                return true
            } else {
                return '请输入服务器端口号'
            }
        }
    },
    {
        type: 'input',
        message: '请输入服务器用户名',
        name: 'username',
        default: 'root',
        validate: (val) => {
            if (val) {
                return true
            } else {
                return '请输入服务器用户名'
            }
        }
    },
    {
        type: 'password',
        message: '请输入服务器密码',
        name: 'password',
        validate: (val) => {
            if (val) {
                return true
            } else {
                return '请输入服务器密码'
            }
        }
    },
    {
        type: 'input',
        message: '请输入服务器目标路径',
        name: 'remotePath',
        default: '/dist',
        validate: (val) => {
            if (val) {
                return true
            } else {
                return '请输入服务器目标路径'
            }
        }
    },
    {
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
    }
  ]