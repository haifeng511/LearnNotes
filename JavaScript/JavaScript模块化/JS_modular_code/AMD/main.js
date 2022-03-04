(function () {
    //配置
    requirejs.config({
      //基本路径
      baseUrl: "./",
      //模块标识名与模块路径映射
      paths: {
        'jquery': 'lib/jquery-1.10.1',
        "module1": "module/module1",
        "module2": "module/module2",
      }
    })
    
    //引入使用模块
    requirejs( ['module2'], function(module2) {
        module2.getMsg()
    })
  })()