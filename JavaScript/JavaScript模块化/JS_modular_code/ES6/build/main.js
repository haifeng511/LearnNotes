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