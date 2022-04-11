// 导入express
const express = require('express');
//  创建web服务器
const app = express();


// 监听客户端的 GET 和 POST 请求，并向客户端响应具体的内容
// https://127.0.0.1:8088/user
app.get('/user', (req, res) => {
    res.send({ name: 'zs', age: 20, gender: '男' })
})
// https://127.0.0.1:8088/user
app.post('/user', (req, res) => {
    res.send('请求成功')
})

// https://127.0.0.1:8088?name='Alice'&age=18
app.get('/', (req, res) => {
    // 通过 req.query 可以获取到客户端发送过来的查询参数
    console.log(req.query)
    res.send(req.query)
})

// 这里的 :id 是一个动态的参数
// https://127.0.0.1:8088/'username'
app.get('/user/:ids/:username', (req, res) => {
    // req.params 是动态匹配到的 URL 参数，默认是一个空对象
    console.log(req.params)
    res.send(req.params)
})

// 启动服务器
app.listen(8088, () => { 
    console.log('express server running at https://127.0.0.1:8088');

})