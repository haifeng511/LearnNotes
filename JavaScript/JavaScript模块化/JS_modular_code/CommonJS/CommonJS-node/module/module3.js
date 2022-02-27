/**
 * 使用export.xxx = value 定义和暴露
 */

// 这里的话导出了m3这个函数变量，所以使用的时候用module.m3()
exports.m3 = function (){
    console.log('module3 m3()');
}