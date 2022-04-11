const path = require('path')
const fs = require('fs')

// 注意 ../ 抵达上一级目录
// ./ 会被忽略 是当前目录
const pathStr = path.join('/a', '/b/c', '../../', './d', 'e')
console.log(pathStr) // \a\d\e

//  这里可以加上./  在最后结果会被忽略，./是当前目录
fs.readFile(path.join(__dirname, './static/test.txt'), 'utf-8', (err, dataStr) => {
    if (err) {
        return console.log(err.message)
    }
    console.log(dataStr)
})
