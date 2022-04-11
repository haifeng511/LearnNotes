const fs = require('fs');

fs.writeFile('./static/write_test.txt', 'write test success!', 'utf-8', (err, data) => { 
    if (err) {
        console.log('写入文件失败', err.message);  // 判断err是否为null来判断写入文件是否失败
        return;
    }
    console.log('success!')
})