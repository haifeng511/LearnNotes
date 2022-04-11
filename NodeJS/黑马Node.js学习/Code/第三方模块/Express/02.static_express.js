// 导入express
const express = require('express');
//  创建web服务器
const app = express();
app.use(express.static('public'))
// - 访问静态资源时，会根据托管顺序查找文件
// app.use(express.static('files'))
// - 可为静态资源访问路径添加前缀
// app.use('/public', express.static('public'))

// 启动服务器
app.listen(3000, () => {
    console.log('express server running at https://127.0.0.1:3000');

})