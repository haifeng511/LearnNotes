/**
 * index.js webpack入口文件
 * 
 * webpack能够处理js和json文件，不能直接处理css/img文件
 * 生产环境和开发环境将ES6模块化编译成浏览器能识别的模块化
 * 生产环境比开发环境的代码更加简洁，内容进行压缩处理过
 * 
 * 运行指令：
 * 开发环境：webpack ./src/index.js -o ./build/ --mode=development  
 * 在build文件夹下会产生main.js  是浏览器可运行的js文件
 * 可使用node ./build/main.js 运行,也可新建index.html 引用打包后的main.js
 * main.js文件是未进行处理的
 * 
 * 生产环境：webpack ./src/index.js -o ./build --mode=production
 * 在build文件夹下阐释main.js 内容是经过压缩和处理的
 * (()=>{"use strict";const e=JSON.parse('{"name":"haifeng","age":23}');console.log(e),console.log(3)})();
 * 
 */

import data from './data.json'
console.log(data);

function add(x,y){
    return x+y;
}

console.log(add(1,2));

