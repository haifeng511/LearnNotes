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