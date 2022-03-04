//定义没有依赖的模块：
define(function (require, exports, module) {
    //内部变量数据
    let data = 'module1 data'
    //内部函数
    function show() {
      console.log('module1 show() and  the module1 data is ' + data)
    }
  
    //向外暴露
    exports.show = show
  })