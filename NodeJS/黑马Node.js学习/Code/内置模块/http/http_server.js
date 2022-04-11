const http = require('http');
const server = http.createServer();

// 监听客户端请求
server.on('request', (req, res) => {

    const url = req.url
    console.log('请求的地址：' + url);
    // 设置默认的响应内容为 404 Not found
    let content = '<h1>404 Not found!</h1>'
    // 判断用户请求的是否为 / 或 /index.html 首页
    // 判断用户请求的是否为 /about.html 关于页面
    if (url === '/' || url === '/index.html') {
        content = '<h1>首页</h1>'
    } else if (url === '/about.html') {
        content = '<h1>关于页面</h1>'
    }
    // 设置 Content-Type 响应头，解决中文乱码的问题
    res.setHeader('Content-Type', 'text/html;charset=utf-8');
    // 发送内容到客户端
    res.end(content)

});

// 启动服务器
server.listen(8088, () => {
    console.log('server running at http://127.0.0.1:8088')
})