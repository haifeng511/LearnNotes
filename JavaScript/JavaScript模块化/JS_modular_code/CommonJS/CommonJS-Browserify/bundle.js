(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./module/module1":2,"./module/module2":3,"./module/module3":4}],2:[function(require,module,exports){
/**
 * 使用module.exports = value 定义和暴露
 */

// 这里导出的是一个对象，对象里面包含一个foo()函数，所以使用的时候是module.foo()
// 注意这里module单词不要写错，exports是带有s的
module.exports = {
    m1() {
      console.log('moudle1 m1()')
    }
  }
},{}],3:[function(require,module,exports){
/**
 * 使用export.xxx = value 定义和暴露
 */

// 这里的话是导出一个匿名函数，所以使用的时候直接用module2()
module.exports = function (){
    console.log('module2 m2()');
}
},{}],4:[function(require,module,exports){
/**
 * 使用export.xxx = value 定义和暴露
 */

// 这里的话导出了m3这个函数变量，所以使用的时候用module.m3()
exports.m3 = function (){
    console.log('module3 m3()');
}
},{}]},{},[1]);
