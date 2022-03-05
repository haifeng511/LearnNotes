//  引入模块
import {foo, bar} from './module1'
import {DATA_ARR} from './module1'
import {fun1, fun2} from './module2'
import person from './module3'

// 使用引入模块内变量
foo()
bar()
console.log(DATA_ARR);
fun1()
fun2()

person.setName('JACK')
console.log(person.name);