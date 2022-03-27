

### Node.js定义和特性

定义：Node.js 是一个开源和跨平台的 JavaScript 运行时环境，在浏览器之外运行 V8 JavaScript 引擎（Google Chrome 的内核）

特性：

1. 单线程进行
2. 异步，库使用非阻塞范式编写的
3. 大量库，具备很多库和工具
4. 使用JavaScript，无需再次学习新的语言



### Node.js 异步编程的基础：

异步编程和回调
定时器
Promise
异步和等待
闭包
事件循环



### Node.js和浏览器的区别：

浏览器是与 DOM 或其他 Web 平台 API（如 Cookies）进行交互，Node.js不是

Node.js 使用 CommonJS 模块系统(require)，浏览器使用ES Modules 标准(import)



### V8JavaScript引擎

V8 是驱动 Google Chrome 的 JavaScript 引擎的名称。 这是在使用 Chrome 浏览时获取我们的 JavaScript 并执行它的东西。

V8 提供了 JavaScript 执行的运行时环境。 DOM 和其他 Web 平台 API 由浏览器提供

JavaScript 通常被认为是一门解释型语言，但是现代的 JavaScript 引擎不再只是解释 JavaScript，它们会编译它。JavaScript 由 V8 在内部使用即时 (JIT) 编译以加快执行速度



### 退出Node.js

1. 当在控制台中运行程序时，可以用 `ctrl-C` 关闭它,

2. 以编程方式退出 Node.js 程序：`process.exit()`

当 Node.js 运行此行时，进程立即被强制终止。这意味着任何待处理的回调、任何仍在发送的网络请求、任何文件系统访问、或者正在写入 `stdout` 或 `stderr` 的进程，所有这些都将立即被非正常地终止，这种情况并不好。

当服务开启之后想要关闭，应该使用向命令发送 SIGTERM 信号，并使用进程信号句柄处理它。

```
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})
```

`SIGKILL` 是告诉进程立即终止的信号，理想情况下会像 `process.exit()` 一样。

`SIGTERM` 是告诉进程正常终止的信号。 这是从 `upstart` 或 `supervisord` 等进程管理器发出的信号。



### Node.js中的REPL

Node.js REPL(Read Eval Print Loop:交互式解释器) 表示一个电脑的环境

Node 自带了交互式解释器，可以执行以下任务：

- 读取 - 读取用户输入，解析输入的 Javascript 数据结构并存储在内存中。
- 执行 - 执行输入的数据结构
- 打印 - 输出结果
- 循环 - 循环操作以上步骤直到用户两次按下 ctrl-c 按钮退出。

`node` 命令是用来运行 Node.js 脚本的命令,如果省略文件名，则在 REPL 模式中使用它，此时，REPL将会等待输入。

在编写代码时，如果按下 `tab` 键，则 REPL 会尝试自动补全所写的内容，以匹配已定义或预定义的变量。

尝试输入 JavaScript 类的名称，例如 `Number`，添加一个点号并按下 `tab`。REPL 会打印可以在该类上访问的所有属性和方法

通过输入 `global.` 并按下 `tab`，可以检查可以访问的全局变量：

如果在某些代码之后输入 `_`，则会打印最后一次操作的结果

REPL 有一些特殊的命令，所有这些命令都以点号 `.` 开头。它们是：

- `.help`: 显示点命令的帮助。
- `.editor`: 启用编辑器模式，可以轻松地编写多行 JavaScript 代码。当处于此模式时，按下 ctrl-D 可以运行编写的代码。
- `.break`: 当输入多行的表达式时，输入 `.break` 命令可以中止进一步的输入。相当于按下 ctrl-C。
- `.clear`: 将 REPL 上下文重置为空对象，并清除当前正在输入的任何多行的表达式。
- `.load`: 加载 JavaScript 文件（相对于当前工作目录）。
- `.save`: 将在 REPL 会话中输入的所有内容保存到文件（需指定文件名）。
- `.exit`: 退出 REPL（相当于按下两次 ctrl-C）。

如果 REPL 能判断出是否正在输入多行的语句，则无需调用 `.editor`。



### Node.js模块导出

第一种方式是将对象赋值给 `module.exports`（这是模块系统提供的对象），这会使文件只导出该对象，公开了此对象

```js
JSconst car = {  brand: 'Ford',  model: 'Fiesta'}
module.exports = car
//在另一个文件中
const car = require('./car')
```

第二种方式是将要导出的对象添加为 `exports` 的属性。这种方式可以导出多个对象、函数或数据，公开的对象的属性

```js
JSconst car = {  brand: 'Ford',  model: 'Fiesta'}
exports.car = car
```



### npm包管理器

npm install <package-name>

- `--save` 安装并添加条目到 `package.json` 文件的 dependencies。
- `--save-dev` 安装并添加条目到 `package.json` 文件的 devDependencies。

区别主要是，`devDependencies` 通常是开发的工具（例如测试的库），而 `dependencies` 则是与生产环境中的应用程序相关。



`package.json` 文件

`package.json` 文件是项目的清单，是 `npm` 和 `yarn` 存储所有已安装软件包的名称和版本的地方

部分内容：

- `version` 表明了当前的版本。
- `name` 设置了应用程序/软件包的名称。
- `description` 是应用程序/软件包的简短描述。
- `main` 设置了应用程序的入口点。
- `private` 如果设置为 `true`，则可以防止应用程序/软件包被意外地发布到 `npm`。
- `scripts` 定义了一组可以运行的 node 脚本。
- `dependencies` 设置了作为依赖安装的 `npm` 软件包的列表。
- `devDependencies` 设置了作为开发依赖安装的 `npm` 软件包的列表。
- `engines` 设置了此软件包/应用程序在哪个版本的 Node.js 上运行。
- `browserslist` 用于告知要支持哪些浏览器（及其版本）。

 在 package.json 中，可以使用 semver 表示法设置要升级到的版本（补丁版本或次版本），例如：

- 如果写入的是 `〜0.13.0`，则只更新补丁版本：即 `0.13.1` 可以，但 `0.14.0` 不可以。
- 如果写入的是 `^0.13.0`，则要更新补丁版本和次版本：即 `0.13.1`、`0.14.0`、依此类推。
- 如果写入的是 `0.13.0`，则始终使用确切的版本



`package-lock.json` 会固化当前安装的每个软件包的版本，当运行 `npm install`时，`npm` 会使用这些确切的版本