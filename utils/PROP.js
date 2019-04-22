/* object与properties文件互转 */

function stringify (obj) {
    return Object.keys(obj).reduce((total, curr) => {
        const item = `${curr} = ${obj[curr]}` // key和val用 = 连接
        return [...total, item]
    }, []).join(';\r\n') // 配置项之间用;换行连接
}

function parse (properties) {
    return properties.reduce((total, curr) => { // 字符串转为对象
        const keyVal = curr.split('=') // 用=分割key与val
        const key = keyVal[0].trim() // key去空格
        const val = keyVal[1].trim() // val去空格
        total[key] = val // 对应key与val
        return { ...total }
    }, {})
}

module.exports = { stringify, parse }