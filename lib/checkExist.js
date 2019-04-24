const fs = require('fs');
const path = require('path');

async function checkExist () {
    const res = await Promise.all([fs.existsSync(path.join(process.cwd(), '/config/plugin.properties')), fs.existsSync(path.join(process.cwd(), '/config/config.properties'))])
    return res.reduce((total, curr) => {
        return total && curr
    }, true)
}

module.exports = checkExist