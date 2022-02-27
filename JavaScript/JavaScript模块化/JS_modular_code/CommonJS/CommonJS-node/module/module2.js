/**
 * 使用export.xxx = value 定义和暴露
 */

// 这里的话是导出一个匿名函数，所以使用的时候直接用module2()
module.exports = function (){
    console.log('module2 m2()');
}