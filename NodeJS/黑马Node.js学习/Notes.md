## 黑马Node.js学习笔记

[TOC]



## 1. 初识Node.js

### 1.1 Node.js可以做什么？

- 基于 [Express 框架 ](http://www.expressjs.com.cn/)，可以快速构建 Web 应用
- 基于 [Electron 框架 ](https://electronjs.org/)，可以构建跨平台的桌面应用
- 基于 [restify 框架 ](http://restify.com/)，可以快速构建 API 接口项目
- 读写和操作数据库、创建实用的命令行工具辅助前端开发、etc…

### 1.2 Node.js和浏览器中的JavaScript运行环境

#### Node.js

Node.js是一个基于 Chrome V8 引擎 的 JavaScript 运行时环境。

浏览器是JavaScript的前端运行环境，Node.js是JavaScript的后端运行环境

Node.js中无法调用DOM、BOM等浏览器内置的API，但是可以调用fs、path等Node.js内置的API

浏览器内置了DOM、BOM这样的API函数，所以，浏览器中的JavaScript才可以调用他们

![image-20220410155204400](Notes.assets/image-20220410155204400.png)

#### 浏览器

V8引擎负责解析和执行JavaScript代码

内置API是由运行环境提供的特殊结构只能再所属的运行环境被调用，所以DOM、BOM不能被Node.js使用

![image-20220410155130201](Notes.assets/image-20220410155130201.png)



## 2. Node.js内置API模块

Node.js内置的API模块需要先使用require('xxx')进行导入再使用

### 2.1 fs文件系统模块

#### 介绍

fs模块是Node.js官方提供的，用来操作文件内容的模块

读取文件有同步和异步两种方式，实际上用异步得的比较多，例如：`fs.readFile()` 异步读取文件和 `fs.readFileSync()` 同步读取文件，两种方法都会在返回数据之前将文件的全部内容读取到内存中，因此如果是大文件，更好的选择是使用流读取文件

同步文件系统会阻塞程序的执行，也就是除非操作完毕，否则不会向下执行代码

异步文件系统不会阻塞程序的执行，而是在操作完成时，通过回调函数将结果返回

#### 常用方法

##### 读取简单文件

**语法格式：**

```js
fs.readFile(path[, options], callback)
```

- path：文件路径

- options：配置选项，若是字符串则指定编码格式
  encoding：编码格式
  flag：打开方式

- callback：回调函数
  err：错误信息
  data：读取的数据，如果未指定编码格式则返回一个 Buffer

**示例代码：**

```js
const fs = require('fs');

fs.readFile('./static/test.text', 'utf-8', (err, data) => {
    if (err) {
        console.log('读取文件失败', err);  // 判断err是否为null来判断读取文件是否失败
        return;
    }

    console.log(data);
})
```

##### 写入简单文件

**语法格式：**

```js
fs.writeFile(file, data[, options], callback)
```

- `file`：文件路径
- `data`：写入内容
- `options`：配置选项，包含 `encoding, mode, flag`；若是字符串则指定编码格式
- `callback`：回调函数

**示例代码:**

```js
const fs = require('fs');

fs.writeFile('./static/write_test.text', 'write test success!', 'utf-8', (err, data) => { 
    if (err) {
        console.log('写入文件失败', err.message);  // 判断err是否为null来判断写入文件是否失败
        return;
    }
    console.log('success!')
})
```

##### 读取和写入流文件

简单文件读取的方式会一次性读取文件内容到内存中，若文件较大，会占用过多内存影响系统性能，且读取速度慢
大文件适合用流式文件读取，它会分多次将文件读取到内存中

**语法：**

通过fs.createReadStream创建一个可读流rs，fs.createWriteStream创建一个可写流ws

通过给可读流rs绑定data事件，进行文件内容读取，利用可写流的write方法，写入数据

更简单的方法，通过管道pipe方法，一遍读入数据，一边写入数据

**示例代码：**

```js
let fs = require('fs')

// 创建一个可读流
let rs = fs.createReadStream('./static/song.mp3')
// 创建一个可写流
let ws = fs.createWriteStream('./static/song_copy1.mp3')

// 监听流的开启和关闭
// 这几个监听不是必须的
rs.once('open', function () {
    console.log('可读流打开了~~')
})

rs.once('close', function () {
    console.log('可读流关闭了~~')
    //数据读取完毕，关闭可写流
    ws.end()
})

ws.once('open', function () {
    console.log('可写流打开了~~')
})

ws.once('close', function () {
    console.log('可写流关闭了~~')
})

//读取一个可读流中的数据，要为可读流绑定一个data事件，data事件绑定完毕自动开始读取数据
rs.on('data', function (data) {
    console.log(data)
    //将读取到的数据写入到可写流中
    ws.write(data)
})

// 更简单的方法
// pipe()可以将可读流中的内容，直接输出到可写流中
rs.pipe(ws)
```

##### 动态路径拼接

- 在使用 fs 模块操作文件时，如果提供的操作路径是以 `./` 或 `../` 开头的相对路径时，容易出现路径动态拼接错误的问题
- 原因：代码在运行的时候，会以执行 node 命令时所处的目录，动态拼接出被操作文件的完整路径
- 解决方案：在使用 fs 模块操作文件时，直接提供完整的路径，从而防止路径动态拼接的问题
- `__dirname` 获取文件所处的绝对路径

**示例代码：**

```js
const fs = require('fs');

//  注意，这里static前面的/不要省略
fs.readFile(__dirname + '/static/test.text', 'utf-8', (err, data) => {
    if (err) {
        console.log('读取文件失败', err.message);  // 判断err是否为null来判断读取文件是否失败
        return;
    }

    console.log(data);
})
```

### 2.2 path模块

#### 介绍

path模块是官方提供的用来处理路径的模块

#### 常用方法

##### 拼接路径

使用path.join()方法，可以传入多个入参，./ ../这样的入参也是支持的

设计路径拼接的操作，优先使用path.join()方法，而不是直接字符串进行拼接

**示例代码：**

```js
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

```

##### 获取路径里的文件名

使用 `path.basename()` 方法，可以获取路径中的最后一部分，从而获取路径中的文件名

**语法格式：**

```js
path.basename(path[, ext])
```

- path: 文件路径
- ext: 文件扩展名

**示例代码：**

```js
const path = require('path')

// 定义文件的存放路径
const fpath = '/a/b/c/index.html'

const fullName = path.basename(fpath)
console.log(fullName) // index.html

const nameWithoutExt = path.basename(fpath, '.html')
console.log(nameWithoutExt) // index
```

##### 获取路径里文件的扩展名

通过extname()方法获取文件的扩展名，参数是文件的存放路径

**示例代码：**

```js
const path = require('path')

const fpath = '/a/b/c/index.html'

const fext = path.extname(fpath)
console.log(fext) // .html
```

### 2.3 http模块

#### 服务器概念

**客户端和服务器**

客户端：在网络节点种，负责消费资源的电脑

服务器：对外提供网络资源的电脑

**http模块介绍**

http模块是Node.js官方提供的，用来创建web服务器的模块，通过http模块提供的createServer()方法，可以很方便的把一台普通电脑变成一台web服务器，从而对外提供Web资源服务

**IP地址**

IP地址是互联网上每台计算机的唯一地址

**域名**

IP地址能够唯一标记网络上的计算机，但是IP地址是长串数字，不直观，于是采用字符型地址方案，也就是域名网址

**域名服务器**

IP地址和域名是一一对应的关系，存放在域名服务器种

**端口号**

每个web服务中都对应一个唯一的端口号，客户端发来网络请求，通过端口号可以被准确交给对应的web服务器，实际应用种，URL种80端口可以被省略

####  创建web服务器

1. 导入模块
2. 创建web服务器实例
3. 为服务器绑定request实例，监听客户端的请求
4. 启动服务器

**实例代码**

```js
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
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // 发送内容到客户端
    res.end(content)

});

// 启动服务器
server.listen(8088, () => {
    console.log('server running at http://127.0.0.1:8088')
})
```



## 3.  模块化

### 3.1 Node.js中的模块化

#### 模块分类

node.js中的模块有三大类：

内置模块：由Node.js官方提供的，例如：fs

自定义模块：用户创建的每个.js文件都是自定义模块

第三方模块：由第三方开发的模块，使用前需下载

#### 加载模块

模块三大类,都可以使用require()方法进行加载，使用require方法加载其他模块是，会执行被加载模块中的代码

```js
const fs = require('fs'); // 加载内置模块
const custom = require('./custom.js'); // 加载自定义模块custom
const moment = require('moment'); // 加载第三方模块moment
```

#### 模块作用域

在自定义模块中定义的变量、方法等成员，只能在当前模块内被访问

好处：防止全局变量污染的问题

#### 向外共享模块作用域的成员

**module.exports对象**

在自定义模块中，使用module.exports对象，将模块内的成员共享出去

外界使用require()导入自定义模块是，得到的是module.exports所指向的对象

使用require()方法导入模块，导入的结果，永远**以module.exports最后指向的对象为准**

Node.js提供了exports对象，默认情况下，exports对象和module.exports是指向同一个对象，最终还是以module.exports对象为准

### 3.2 CommonJS 模块化规范

- 每个模块内部，`module` 变量代表当前模块
- `module` 变量是一个对象，`module.exports` 是对外的接口
- 加载某个模块即加载该模块的 `module.exports` 属性

### 3.3 npm和包

搜索包地址：https://www.npmjs.com/

下载包地址：https://registry.npmjs.org/

#### 包的语义化版本规范

包的版本是以“点分十进制”形式进行定义的，总共有三位数字，例如：2.24.0

第一位数字代表大版本

第二位数字代表功能版本

第三位数字代表Bug修复版本

只要前面的版本号增长了，后面的版本号归零

在使用npm下载包时，通过@跟上版本号，下载指定版本的包

#### 发布和删除包

切换官方源，需要切换到npm包官方下载地址 https://registry.npmjs.org/

在终端执行npm login命令，输入用户名、邮箱、密码等登录npm账号，如果没有需要进行注册（https://www.npmjs.com/）

把终端切换到包的根目录，运行npm  publish命令，即可将包发布到npm上，注意包不能相同

删除包，运行 npm publish 包名 --force命令

### 3.4 模块加载机制

模块第一次加载后会被缓存，即多次调用 `require()` 不会导致模块的代码被执行多次，提高模块加载效率。

#### 内置模块加载

内置模块加载优先级最高。

#### 自定义模块加载

加载自定义模块时，路径要以 `./` 或 `../` 开头，否则会作为内置模块或第三方模块加载。

导入自定义模块时，若省略文件扩展名，则 Node.js 会按顺序尝试加载文件：

- 按确切的文件名加载
- 补全 `.js` 扩展名加载
- 补全 `.json` 扩展名加载
- 补全 `.node` 扩展名加载
- 报错

#### 第三方模块加载

- 若导入第三方模块， Node.js 会从**当前模块的父目录**开始，尝试从 `/node_modules` 文件夹中加载第三方模块。
- 如果没有找到对应的第三方模块，则移动到再**上一层父目录**中，进行加载，直到**文件系统的根目录**。

例如，假设在 `C:\Users\project\foo.js` 文件里调用了 `require('tools')`，则 Node.js 会按以下顺序查找：

- `C:\Users\project\node_modules\tools`
- `C:\Users\node_modules\tools`
- `C:\node_modules\tools`

#### 目录作为模块加载

当把目录作为模块标识符进行加载的时候，有三种加载方式：

- 在被加载的目录下查找 `package.json` 的文件，并寻找 `main` 属性，作为 `require()` 加载的入口
- 如果没有 `package.json` 文件，或者 `main` 入口不存在或无法解析，则 Node.js 将会试图加载目录下的 `index.js` 文件。
- 若失败则报错

## 4. 第三方API模块

### 4.1 Express

Express是基于Node.js平台，快速、方法、极简的Web的开发框架

安装express：npm i express

#### Express创建基本服务器

**实现步骤**

1. 导入express

2. 创建web服务器

3. 监听客户请求

4. 启动服务器

```js
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
```

#### 托管静态资源

- 通过 `express.static()` 方法可创建静态资源服务器，向外开放访问静态资源。
- Express 在指定的静态目录中查找文件，并对外提供资源的访问路径，存放静态文件的目录名不会出现在 URL 中
- 访问静态资源时，会根据托管顺序查找文件
- 可为静态资源访问路径添加前缀

```js
app.use(express.static('public'))
app.use(express.static('files'))
app.use('/public', express.static('public'))

/*
可直接访问 public, files 目录下的静态资源
http://localhost:3000/images/bg.jpg
http://localhost:3000/css/style.css
http://localhost:3000/js/login.js

通过带有 /public 前缀的地址访问 public 目录下的文件
http://localhost:8080/public/images/logo.png
```

#### 模块化路由

**步骤：**

1. 创建路由模块对应的js文件
2. 调用express.Router()函数创建路由对象
3. 向路由对象上挂载具体的路由
4. 使用module.exports向外共享路由
5. 使用app.use()函数注册路由模块

**示例代码：**

```js
// ——————————自定义路由——————————————————
// 导入
const express = require('express');
// 创建路由对象
const router = express.Router();

// 挂载获取用户列表的路由
router.get('/user/list', (req, res) => {
    res.send('Get user list success')
});

// 挂载添加用户的路由
router.post('/user/add', (req, res) => {
    res.send('Add new user success')
});

//  向外导出路由对象
module.exports = router; 

// ——————————使用路由——————————————————
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
```

#### 中间件

- 中间件是指流程的中间处理环节
- 服务器收到请求后，可先调用中间件进行预处理
- 中间件是一个函数，包含 `req, res, next` 三个参数，`next()` 参数把流转关系交给下一个中间件或路由

**中间件注意事项**

- 在注册路由之前注册中间件（**错误级别中间件需要注册在所有路由之后**）
- 中间件可连续调用多个
- 别忘记调用 `next()` 函数
- `next()` 函数后别写代码
- 多个中间件共享 `req`、 `res`对象

**全局中间件和局部中间件**

使用app.use()注册的中间件是全局中间件

```js
const express = require('express')
const app = express()

// 定义第一个全局中间件
app.use((req, res, next) => {
  console.log('调用了第1个全局中间件')
  next()
})
// 定义第二个全局中间件
app.use((req, res, next) => {
  console.log('调用了第2个全局中间件')
  next()
})

app.get('/user', (req, res) => {
  res.send('User page.')
})

app.listen(80, () => {
  console.log('http://127.0.0.1')
})
```

在挂载中定义的中间件是局部中间件

```js
const express = require('express')
const app = express()

// 定义中间件函数
const mw1 = (req, res, next) => {
  console.log('调用了第一个局部生效的中间件')
  next()
}

const mw2 = (req, res, next) => {
  console.log('调用了第二个局部生效的中间件')
  next()
}

// 两种定义局部中间件的方式
app.get('/hello', mw2, mw1, (req, res) => res.send('hello page.'))
app.get('/about', [mw1, mw2], (req, res) => res.send('about page.'))

app.get('/user', (req, res) => res.send('User page.'))

app.listen(80, function () {
  console.log('Express server running at http://127.0.0.1')
})
```

**中间件的分类**

1. 应用级别的中间件

- 通过 `app.use()` 或 `app.get()` 或 `app.post()` ，绑定到 `app` 实例上的中间件

2. 路由级别的中间件

- 绑定到 `express.Router()` 实例上的中间件，叫做路由级别的中间件。用法和应用级别中间件没有区别。应用级别中间件是绑定到 `app` 实例上，路由级别中间件绑定到 `router` 实例上。

```js
const app = express()
const router = express.Router()

router.use(function (req, res, next) {
  console.log(1)
  next()
})

app.use('/', router)
```

3. 错误级别的中间件

- 用来捕获整个项目中发生的异常错误，从而防止项目异常崩溃的问题
- 错误级别中间件的处理函数中，必须有 4 个形参，形参顺序从前到后分别是 `(err, req, res, next)` 。
- 错误级别的中间件必须注册在所有路由之后

```js
const express = require('express')
const app = express()

app.get('/', (req, res) => {
  throw new Error('服务器内部发生了错误！')
  res.send('Home page.')
})

// 定义错误级别的中间件，捕获整个项目的异常错误，从而防止程序的崩溃
app.use((err, req, res, next) => {
  console.log('发生了错误！' + err.message)
  res.send('Error：' + err.message)
})

app.listen(80, function () {
  console.log('Express server running at http://127.0.0.1')
})
```

4. Express 内置中间件

自 Express 4.16.0 版本开始，Express 内置了 3 个常用的中间件，极大的提高了 Express 项目的开发效率和体验：

- `express.static` 快速托管静态资源的内置中间件，例如： HTML 文件、图片、CSS 样式等（无兼容性）
- `express.json` 解析 JSON 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）
- `express.urlencoded` 解析 URL-encoded 格式的请求体数据（有兼容性，仅在 4.16.0+ 版本中可用）

```js
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
```

5. 第三方中间件

- 需要使用npm install安装中间件
- 使用require()导入中间件
- 调用app.use()注册和使用中间件

### 4.2 CORS

#### CORS预备知识

**什么是跨域？**

当一个请求url的**协议、域名、端口**三者之间任意一个与当前页面url不同即为跨域

**跨域的解决方案：**

1. CORS 主流方案，推荐使用
2. JSONP 有缺陷，只支持GET请求

**CORS介绍**

CORS （Cross-Origin Resource Sharing，跨域资源共享）由一系列 HTTP 响应头组成，这些 HTTP 响应头决定浏览器是否阻止前端 JS 代码跨域获取资源

浏览器的同源安全策略默认会阻止网页“跨域”获取资源。但如果接口服务器配置了 CORS 相关的 HTTP 响应头，就可以解除浏览器端的跨域访问限制

**CORS局限性**

- CORS 主要在服务器端进行配置。客户端浏览器**无须做任何额外的配置**，即可请求开启了 CORS 的接口。

- CORS 在浏览器中有兼容性。只有支持 XMLHttpRequest Level2 的浏览器，才能正常访问开启了 CORS 的服务端接口（例如：IE10+、Chrome4+、FireFox3.5+）。

#### CORS响应头部

**Access-Control-Allow-Origin**

origin 参数的值指定了允许访问该资源的外域 URL

如果指定了 Access-Control-Allow-Origin 字段的值为通配符 *****，表示允许来自任何域的请求

**Access-Control-Allow-Headers**

默认情况下，CORS 仅支持客户端向服务器发送如下的 9 个请求头：

Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width 、Content-Type （值仅限于 text/plain、multipart/form-data、application/x-www-form-urlencoded 三者之一）

如果客户端向服务器发送了额外的请求头信息，则需要在服务器端，通过 Access-Control-Allow-Headers 对额外的请求头进行声明，否则这次请求会失败！

**Access-Control-Allow-Methods**

默认情况下，CORS 仅支持客户端发起 GET、POST、HEAD 请求。

如果客户端希望通过 PUT、DELETE 等方式请求服务器的资源，则需要在服务器端，通过 Access-Control-Alow-Methods来指明实际请求所允许使用的 HTTP 方法。

如果设置*，代表允许所有的HTTP方法

#### CORS请求分类

**简单请求**

- 请求方式：GET、POST、HEAD 三者之一
- HTTP 头部信息不超过以下几种字段：无自定义头部字段、Accept、Accept-Language、Content-Language、DPR、Downlink、Save-Data、Viewport-Width、Width 、Content-Type（只有三个值 application/x-www-formurlencoded、multipart/form-data、text/plain）

**预检请求**

- 请求方式为 GET、POST、HEAD 之外的请求 Method 类型

- 请求头中包含自定义头部字段

- 向服务器发送了 application/json 格式的数据

在浏览器与服务器正式通信之前，浏览器会先发送 OPTION 请求进行预检，以获知服务器是否允许该实际请求，所以这一次的 OPTION 请求称为“预检请求”。服务器成功响应预检请求后，才会发送真正的请求，并且携带真实数据。

**区别：**

简单请求的特点：客户端与服务器之间只会发生一次请求
预检请求的特点：客户端与服务器之间会发生两次请求，OPTION 预检请求成功之后，才会发起真正的请求

#### CORS使用



### 4.3 JSONP

#### JSONP 的概念与特点

**概念：**浏览器端通过 <script> 标签的 src 属性，请求服务器上的数据，同时，服务器返回一个函数的调用。这种请求数据的方式叫做 JSONP。

**特点：**

- JSONP 不属于真正的 Ajax 请求，因为它没有使用 XMLHttpRequest 这个对象。

- JSONP 仅支持 GET 请求，不支持 POST、PUT、DELETE 等请求。

**注意事项：**

如果项目中已经配置了 CORS 跨域资源共享，为了**防止冲突**，必须在配置 CORS 中间件之前声明 JSONP 的接口。否则 JSONP 接口会被处理成开启了 CORS 的接口

#### JSONP代码实现

```js
app.get( '/api/jsonp', (req,res) =>{
    // 1．获取客户端发送过来的回调函数的名字
    const funcName = req. query.callback1
    // 2．得到要通过JSONP形式发送给客户端的数据
    const data = { name: 'zs ', age: 22 }
	// 3．根据前两步得到的数据，拼接出一个函数调用的字符串
	const scriptStr = `${funcName}( ${JSON.stringify(data)})`;
	// 4．把上一步拼接得到的字符串，响应给客户端的<script>标签进行解析执行
	res.send(scriptStr);
})
```

### 4.4 mysql

**简单的增删改查操作**

1. 导入mysql模块
2. 建立连接
3. 写sql语句
4. 启动、执行

**示例代码：**

```js
// 导入mysql模块
const mysql = require('mysql')

// 建立数据库连接
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'test',
});

//  增 删 改 查sql ? 表示占位符
const query_sql = 'select * from user';
const add_sql = 'insert into user(username,password) values(?, ?)';
const del_sql = 'delete from user where id = ?';
const upd_sql = 'update user set username=?, password=? where id=?';
// 数据对象的每个属性和数据表的字段一一对应
const add_sql2 = 'insert into user set ?';
const upd_sql2 = 'update user set ? where id=?';

// 查询
db.query(query_sql, (err, results) => {
    if (err) return console.log(err.message)
    console.log(results)
})

// 增加
const user = { name: 'add', password: '123' };
const user2 = { username: 'add2', password: '123' };
// 使用数组的形式为占位符指定具体的值
db.query(add_sql, [user.name, user.password], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('插入数据成功');
    }
});
db.query(add_sql2, user2, (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('插入数据成功2');
    }
});

// 修改
const upd_user = { id: 5, name: 'upd', password: '123' };
const upd_user2 = { id: 6, username: 'upd2', password: '123' };
db.query(upd_sql, [upd_user.name, upd_user.password, upd_user.id], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('修改数据成功');
    }
});
// 注意这里要传入第一个参数修改的对象，第二个参数是id
db.query(upd_sql2, [upd_user2, upd_user2.id], (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('修改数据成功2');
    }
});

// 删除
db.query(del_sql, 7, (err, results) => {
    if (err) return console.log(err.message);
    if (results.affectedRows === 1) {
        console.log('删除数据成功');
    }
});
```

## 5. 其他内容

### 5.1 Web开发模式

#### 服务端渲染

服务器发送给客户端的 HTML 页面，是在服务器通过字符串的拼接动态生成的。因此客户端不需要使用 Ajax 额外请求页面的数据。

```js
app.get('/index.html', (req, res) => {
  const user = { name: 'Bruce', age: 29 }
  const html = `<h1>username:${user.name}, age:${user.age}</h1>`
  res.send(html)
})
```

优点：

- 前端耗时短。浏览器只需直接渲染页面，无需额外请求数据。
- 有利于 SEO。服务器响应的是完整的 HTML 页面内容，有利于爬虫爬取信息。

缺点：

- 占用服务器资源。服务器需要完成页面内容的拼接，若请求比较多，会对服务器造成一定访问压力。
- 不利于前后端分离，开发效率低。

#### 前后端分离

前后端分离的开发模式，依赖于 Ajax 技术的广泛应用。后端只负责提供 API 接口，前端使用 Ajax 调用接口。

优点：

- 开发体验好。前端专业页面开发，后端专注接口开发。
- 用户体验好。页面局部刷新，无需重新请求页面。
- 减轻服务器的渲染压力。页面最终在浏览器里生成。

缺点：

- 不利于 SEO。完整的 HTML 页面在浏览器拼接完成，因此爬虫无法爬取页面的有效信息。Vue、React 等框架的 SSR（server side render）技术能解决 SEO 问题。

#### 如何选择

- 企业级网站，主要功能是展示，没有复杂交互，且需要良好的 SEO，可考虑服务端渲染
- 后台管理项目，交互性强，无需考虑 SEO，可使用前后端分离
- 为同时兼顾首页渲染速度和前后端分离开发效率，可采用首屏服务器端渲染+其他页面前后端分离的开发模式



### 5.2 身份认证

#### Session认证机制

服务端渲染推荐使用 Session 认证机制

##### Session 工作原理

![image-20220411154922159](Notes.assets/image-20220411154922159.png)

##### Express 中使用 Session 认证

1. **安装 express-session 中间件**

```bash
npm install express-session
```

2. **配置中间件**

```js
const session = require('express-session')
app.use(
  session({
    secret: 'Bruce', // secret 的值为任意字符串
    resave: false,
    saveUninitalized: true,
  })
)
```

3. **向 session 中存数据**

中间件配置成功后，可通过 `req.session` 访问 session 对象，存储用户信息

```js
app.post('/api/login', (req, res) => {
  req.session.user = req.body
  req.session.isLogin = true

  res.send({ status: 0, msg: 'login done' })
})
```

4. **从 session 取数据**

```js
app.get('/api/username', (req, res) => {
  if (!req.session.isLogin) {
    return res.send({ status: 1, msg: 'fail' })
  }
  res.send({ status: 0, msg: 'success', username: req.session.user.username })
})
```

5. **清空 session**

```js
app.post('/api/logout', (req, res) => {
  // 清空当前客户端的session信息
  req.session.destroy()
  res.send({ status: 0, msg: 'logout done' })
})
```

#### JWT认证机制

前后端分离推荐使用 JWT（JSON Web Token）认证机制，是目前最流行的跨域认证解决方案

##### JWT 工作原理

###### Session 认证的局限性

- Session 认证机制需要配合 Cookie 才能实现。由于 Cookie 默认不支持跨域访问，所以，当涉及到前端跨域请求后端接口的时候，需要做很多额外的配置，才能实现跨域 Session 认证。
- 当前端请求后端接口不存在跨域问题的时候，推荐使用 Session 身份认证机制。
- 当前端需要跨域请求后端接口的时候，不推荐使用 Session 身份认证机制，推荐使用 JWT 认证机制

###### JWT 工作原理图

用户的信息通过 Token 字符串的形式，保存在客户端浏览器中。服务器通过还原 Token 字符串的形式来认证用户的身份。

![image-20220411154958555](Notes.assets/image-20220411154958555.png)

###### JWT 组成部分

- Header、Payload、Signature
- Payload 是真正的用户信息，加密后的字符串
- Header 和 Signature 是安全性相关部分，保证 Token 安全性
- 三者使用 `.` 分隔

```text
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInVzZXJuYW1lIjoiQnJ1Y2UiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiaGVsbG8iLCJlbWFpbCI6InNjdXRAcXEuY29tIiwidXNlcl9waWMiOiIiLCJpYXQiOjE2NDE4NjU3MzEsImV4cCI6MTY0MTkwMTczMX0.bmqzAkNSZgD8IZxRGGyVlVwGl7EGMtWitvjGD-a5U5c
```

###### JWT 使用方式

- 客户端会把 JWT 存储在 localStorage 或 sessionStorage 中
- 此后客户端与服务端通信需要携带 JWT 进行身份认证，将 JWT 存在 HTTP 请求头 Authorization 字段中
- 加上 Bearer 前缀

```text
Authorization: Bearer <token>
```

##### Express 使用 JWT

1. **安装**

- jsonwebtoken 用于生成 JWT 字符串
- express-jwt 用于将 JWT 字符串解析还原成 JSON 对象

```bash
npm install jsonwebtoken express-jwt
```

2. **定义 secret 密钥**

- 为保证 JWT 字符串的安全性，防止其在网络传输过程中被破解，需定义用于加密和解密的 secret 密钥
- 生成 JWT 字符串时，使用密钥加密信息，得到加密好的 JWT 字符串
- 把 JWT 字符串解析还原成 JSON 对象时，使用密钥解密

```js
const jwt = require('jsonwebtoken')
const expressJWT = require('express-jwt')

// 密钥为任意字符串
const secretKey = 'abcd'
```

3. **生成 JWT 字符串**

```js
app.post('/api/login', (req, res) => {
  ...
  res.send({
    status: 200,
    message: '登录成功',
    // jwt.sign() 生成 JWT 字符串
    // 参数：用户信息对象、加密密钥、配置对象-token有效期
    // 尽量不保存敏感信息，因此只有用户名，没有密码
    token: jwt.sign({username: userInfo.username}, secretKey, {expiresIn: '10h'})
  })
})
```

4. **JWT 字符串还原为 JSON 对象**

- 客户端访问有权限的接口时，需通过请求头的 `Authorization` 字段，将 Token 字符串发送到服务器进行身份认证
- 服务器可以通过 express-jwt 中间件将客户端发送过来的 Token 解析还原成 JSON 对象

```js
// unless({ path: [/^\/api\//] }) 指定哪些接口无需访问权限
app.use(expressJWT({ secret: secretKey }).unless({ path: [/^\/api\//] }))
```

5. **获取用户信息**

- 当 express-jwt 中间件配置成功后，即可在那些有权限的接口中，使用 `req.user` 对象，来访问从 JWT 字符串中解析出来的用户信息

```js
app.get('/admin/getinfo', (req, res) => {
  console.log(req.user)
  res.send({
    status: 200,
    message: '获取信息成功',
    data: req.user,
  })
})
```

6. **捕获解析 JWT 失败后产生的错误**

- 当使用 express-jwt 解析 Token 字符串时，如果客户端发送过来的 Token 字符串过期或不合法，会产生一个解析失败的错误，影响项目的正常运行
- 通过 Express 的错误中间件，捕获这个错误并进行相关的处理

```js
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.send({ status: 401, message: 'Invalid token' })
  }
  res.send({ status: 500, message: 'Unknown error' })
})
```