// 导入express
const express = require('express');

//  创建web服务器
const app = express();

// 导入路由模块
const userRouter = require('./router/user.js')

// 注册路由模块
app.use(userRouter);

// 注册路由模块 并添加统一访问前缀api
// app.use('/api',userRouter);

// 启动服务器
app.listen(3000, () => {
    console.log('express server running at https://127.0.0.1:3000');

})