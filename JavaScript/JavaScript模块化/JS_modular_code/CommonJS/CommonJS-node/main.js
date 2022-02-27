/**
 * 使用require(xxx) xxx是路径 引入模块
 */

let module1 = require('./module/module1');
let module2 = require('./module/module2');
let module3 = require('./module/module3');

module1.m1();
module2();
module3.m3()

/**
 * 此时，只需要在main.js所在目录 打开命令行，输入node main.js 即可运行main.js的内容
 * 结果是：
    moudle1 m1()
    module2 m2()
    module3 m3()
 */