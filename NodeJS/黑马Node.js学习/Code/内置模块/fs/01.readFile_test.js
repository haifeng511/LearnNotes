const fs = require('fs');

fs.readFile('./static/test.txt', 'utf-8', (err, data) => {
    if (err) {
        console.log('读取文件失败', err.message);  // 判断err是否为null来判断读取文件是否失败
        return;
    }

    console.log(data);
})