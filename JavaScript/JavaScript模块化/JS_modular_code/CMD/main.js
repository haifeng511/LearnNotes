define(function (require) {
    let m1 = require('./module/module1');
    let m2 = require('./module/module2');
    let m3 = require('./module/module3');
    m1.show();
    console.log('-----------------');
    m3.show();
  });


// 最后打印的结果：   

//  异步引入依赖模块1 and  the module1 show is function show() {
//     console.log('module1 show() and  the module1 data is ' + data)
//   }
//  module1 show() and  the module1 data is module1 data
//  -----------------
//  module3 show() and  the module2 data is module2 data