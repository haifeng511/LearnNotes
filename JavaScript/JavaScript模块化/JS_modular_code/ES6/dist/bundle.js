(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _module = require('./module1');

var _module2 = require('./module2');

var _module3 = require('./module3');

var _module4 = _interopRequireDefault(_module3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 使用引入模块内变量
//  引入模块
(0, _module.foo)();
(0, _module.bar)();
console.log(_module.DATA_ARR);
(0, _module2.fun1)();
(0, _module2.fun2)();

_module4.default.setName('JACK');
console.log(_module4.default.name);
},{"./module1":2,"./module2":3,"./module3":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.foo = foo;
// 分别暴露
function foo() {
    console.log('module1 foo()');
}
var bar = exports.bar = function bar() {
    console.log('module1 bar()');
};
var DATA_ARR = exports.DATA_ARR = [1, 3, 5, 1];
},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 统一暴露
var data = 'module2 data';

function fun1() {
  console.log('module2 fun1() ' + data);
}

function fun2() {
  console.log('module2 fun2() ' + data);
}

exports.fun1 = fun1;
exports.fun2 = fun2;
},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// 默认暴露
exports.default = {
  name: 'Tom',
  setName: function setName(name) {
    this.name = name;
  }
};
},{}]},{},[1]);
