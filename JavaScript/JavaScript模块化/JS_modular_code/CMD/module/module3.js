// 定义有依赖的模块：
define(function (require, exports, module) {
    //引入依赖模块(同步)
    let module2 = require('./module2')
  
    function show() {
      console.log('module3 show() and  the module2 data is ' + module2.data)
    }
  
    exports.show = show
    //引入依赖模块(异步)
    require.async('./module1', function (m1) {
      console.log('异步引入依赖模块1 and  the module1 show is ' + m1.show)
    })
  })