## Function知识点整理

[TOC]



### 1. 函数概述

#### 1.1 函数声明

##### function 命令

`function`命令声明的代码区块，就是一个函数。`function`命令后面是函数名，函数名后面是一对圆括号，里面是传入函数的参数。函数体放在大括号里面。

```js
function print(s) {
  console.log(s);
}
```

##### 函数表达式

除了用`function`命令声明函数，还可以采用变量赋值的写法。将一个匿名函数赋值给变量。这时，这个匿名函数又称函数表达式（Function Expression），因为赋值语句的等号右侧只能放表达式。采用函数表达式声明函数时，`function`命令后面不带有函数名。如果加上函数名，该函数名只在函数体内部有效，在函数体外部无效。

```js
var print = function(s) {
  console.log(s);
};
```

##### Function 构造函数

第三种声明函数的方式是`Function`构造函数。最后一个参数是函数体，前面的都是函数的参数

```
var add = new Function(
  'x',
  'y',
  'return x + y'
);

// 等同于
function add(x, y) {
  return x + y;
}
```

#### 1.2 函数的其他特性

##### 函数的重复声明

如果同一个函数被多次声明，后面的声明就会覆盖前面的声明。由于函数名的提升，前一次声明在任何时候都是无效的

```js
function f() {
  console.log(1);
}
f() // 2

function f() {
  console.log(2);
}
f() // 2
```

##### 第一等公民

JavaScript 语言将函数看作一种值，与其它值（数值、字符串、布尔值等等）地位相同。凡是可以使用值的地方，就能使用函数。

```js
function add(x, y) {
  return x + y;
}
// 将函数赋值给一个变量
var operator = add;
// 将函数作为参数和返回值
function a(op){
  return op;
}
a(add)(1, 1)
// 2
```

##### 函数名的提升

JavaScript 引擎将函数名视同变量名，所以采用`function`命令声明函数时，整个函数会像变量声明一样，被提升到代码头部

但是，如果采用赋值语句定义函数，JavaScript 就会报错。采用`function`命令和`var`赋值语句声明同一个函数，由于存在函数提升，最后会采用`var`赋值语句的定义。

```js
f();
function f() {}

f();
var f = function (){};
// TypeError: undefined is not a function

var f = function () {
  console.log('1');
}
function f() {
  console.log('2');
}
f() // 1
```

### 2. 函数的属性和方法

#### 2.1 函数的属性

##### name 属性

函数的`name`属性返回函数的名字。如果是通过变量赋值定义的函数，那么`name`属性返回变量名。

```js
function f1() {}
f1.name // "f1"
var f2 = function () {};
f2.name // "f2"
```

##### length 属性

函数的`length`属性返回函数预期传入的参数个数，即函数定义之中的参数个数。

```
function f(a, b) {}
f.length // 2
```

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真。如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了。

```javascript
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2

(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

#### 2.2 函数的方法

##### toString()

函数的`toString()`方法返回一个字符串，内容是函数的源码。

```
function f() {
  a();
  b();
  c();
}

f.toString()
// function f() {
//  a();
//  b();
//  c();
// }
```

### 3. 函数作用域

#### 3.1 函数作用域的定义

JavaScript 只有两种作用域：一种是全局作用域，变量在整个程序中一直存在，所有地方都可以读取；另一种是函数作用域，变量只在函数内部存在。ES6 又新增了块级作用域，对于`var`命令来说，局部变量只能在函数内部声明，在其他区块中声明，一律都是全局变量

#### 3.2 函数内部的变量提升

与全局作用域一样，函数作用域内部也会产生“变量提升”现象。`var`命令声明的变量，不管在什么位置，变量声明都会被提升到函数体的头部。

```js
function foo(x) {
  if (x > 100) {
    var tmp = x - 100;
  }
}
// 等同于
function foo(x) {
  var tmp;
  if (x > 100) {
    tmp = x - 100;
  };
}
```

#### 3.3 函数本身的作用域

函数本身也是一个值，也有自己的作用域。它的作用域与变量一样，就是其**声明时所在的作用域**，与其运行时所在的作用域无关。

```js
var a = 1;
var x = function () {
  console.log(a);
};
function f() {
  var a = 2;
  x();
}
f() // 1
```

### 4. 函数参数

#### 参数省略

函数参数不是必需的，JavaScript 允许省略靠后的参数。

```js
function f(a, b) {
  return a;
}
f(1, 2, 3) // 1
f(1) // 1
f() // undefined
f.length // 2
```

#### 参数传递

函数参数如果是原始类型的值（数值、字符串、布尔值），传递方式是传值传递（passes by value）。这意味着，在函数体内修改参数值，不会影响到函数外部。

```js
var p = 2;
function f(p) {
  p = 3;
}
f(p);
p // 2
```

如果函数参数是复合类型的值（数组、对象、其他函数），传递方式是传址传递（pass by reference）。也就是说，传入函数的原始值的地址，因此在函数内部修改参数，将会影响到原始值。

```js
var obj = { p: 1 };
function f(o) {
  o.p = 2;
}
f(obj);
obj.p // 2
```

#### 同名参数

如果有同名的参数，则取最后出现的那个值。

```js
function f(a, a) {
  console.log(a);
}
f(1, 2) // 2
```

#### arguments 对象

`arguments`对象包含了函数运行时的所有参数，`arguments[0]`就是第一个参数，`arguments[1]`就是第二个参数，以此类推。这个对象只有在函数体内部，才可以使用。修改`arguments`对象不会影响到实际的函数参数。通过`arguments`对象的`length`属性，可以判断函数调用时到底带几个参数。

```js
var f = function (one) {
  console.log(arguments[0]);
  console.log(arguments[1]);
  console.log(arguments[2]);
}
f(1, 2, 3)
// 1
// 2
// 3
```

#### 参数默认值

ES6 之前，不能直接为函数的参数指定默认值，只能采用变通的方法。ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。

参数变量是默认声明的，所以不能用`let`或`const`再次声明。使用参数默认值时，函数不能有同名参数。

通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。

```javascript
// es5写法
function log(x, y) {
  y = y || 'World';
  console.log(x, y);
}

// es6写法
function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World

// 参数默认值位置
function f(x = 1, y) {
  return [x, y];
}
f() // [1, undefined]
f(2) // [2, undefined]
f(, 1) // 报错
f(undefined, 1) // [1, 1]
```

参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。参数`p`的默认值是`x + 1`。这时，每次调用函数`foo`，都会重新计算`x + 1`，而不是默认`p`等于 100。

```javascript
let x = 99;
function foo(p = x + 1) {
  console.log(p);
}
foo() // 100
x = 100;
foo() // 101
```

#### 参数默认值解构赋值

```javascript
// 写法一
function m1({x = 0, y = 0} = {}) {
  return [x, y];
}

// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  return [x, y];
}
```

上面两种写法都对函数的参数设定了默认值，区别是写法一函数参数的默认值是空对象，但是设置了对象解构赋值的默认值；写法二函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构赋值的默认值。

```javascript
// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x 和 y 都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x 有值，y 无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x 和 y 都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}) // [0, 0]
m2({z: 3}) // [undefined, undefined]
```

#### 参数默认值作用域

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（context）。等到初始化结束，这个作用域就会消失。

```javascript
var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2
```

上面代码中，参数`y`的默认值等于变量`x`。调用函数`f`时，参数形成一个单独的作用域。在这个作用域里面，默认值变量`x`指向第一个参数`x`，而不是全局变量`x`，所以输出是`2`。

```javascript
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

上面代码中，函数`f`调用时，参数`y = x`形成一个单独的作用域。这个作用域里面，变量`x`本身没有定义，所以指向外层的全局变量`x`。函数调用时，函数体内部的局部变量`x`影响不到默认值变量`x`

#### rest 参数

ES6 引入 rest 参数（形式为`...变量名`），用于获取函数的多余参数，这样就不需要使用`arguments`对象了。rest 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

```javascript
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10
```

rest 参数代替`arguments`变量的例子。

```javascript
// arguments变量的写法
function sortNumbers() {
  return Array.from(arguments).sort();
}

// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```

### 5. 函数高阶

#### 5.1 闭包

把闭包简单理解成“定义在一个函数内部的函数”。闭包的最大用处有两个，一个是可以读取外层函数内部的变量，另一个就是让这些变量始终保持在内存中，即闭包可以使得它诞生环境一直存在。

```js
function createIncrementor(start) {
  return function () {
    return start++;
  };
}
var inc = createIncrementor(5);
inc() // 5
inc() // 6
inc() // 7
```

#### 5.2 立即调用的函数表达式（IIFE）

函数定义后立即调用的解决方法，就是不要让`function`出现在行首，让引擎将其理解成一个表达式。最简单的处理，就是将其放在一个圆括号里面。函数当作表达式时，函数可以定义后直接加圆括号调用。

```js
(function(){ /* code */ }());
// 或者
(function(){ /* code */ })();

var f = function f(){ return 1}();
f // 1
```

#### 5.3. 箭头函数

ES6 允许使用“箭头”（`=>`）定义函数。

如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。

如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用`return`语句返回。

```javascript
var f = v => v;

// 等同于
var f = function (v) {
  return v;
};
```

箭头函数有几个使用注意点。

（1）箭头函数没有自己的`this`对象，箭头函数内部的`this`就是定义时上层作用域中的`this`。普通函数来说，内部的`this`指向函数运行时所在的对象。箭头函数内部的`this`指向是固定的 ，普通函数的`this`指向是可变的。

（2）不可以当作构造函数，也就是说，不可以对箭头函数使用`new`命令，否则会抛出一个错误。

（3）不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

（4）不可以使用`yield`命令，因此箭头函数不能用作 Generator 函数。

#### 5.4 函数柯里化

柯里化（currying），意思是将多参数的函数转换成单参数的形式

参考来源：https://juejin.cn/post/6864378349512065038

##### 参数定长的柯里化

假设存在一个原函数`fn`，`fn`接受三个参数`a`, `b`, `c`，那么函数`fn`最多被柯里化三次（**有效地绑定参数算一次**）。

```javascript
function fn(a, b, c) {
  return a + b + c
}
var c1 = curry(fn, 1);
var c2 = curry(c1, 2);
var c3 = curry(c2, 3);
c3(); // 6
// 再次柯里化也没有意义，原函数只需要三个参数
var c4 = curry(c3, 4);
c4();
```

也就是说，我们可以通过柯里化缓存的参数数量，来判断是否到达了执行时机。那么我们就得到了一个柯里化的通用模式。

```javascript
function curry(fn) {
  // 获取原函数的参数长度
  const argLen = fn.length;
  // 保存预置参数
  const presetArgs = [].slice.call(arguments, 1)
  // 返回一个新函数
  return function() {
    // 新函数调用时会继续传参
    const restArgs = [].slice.call(arguments)
    const allArgs = [...presetArgs, ...restArgs]
    if (allArgs.length >= argLen) {
      // 如果参数够了，就执行原函数
      return fn.apply(this, allArgs)
    } else {
      // 否则继续柯里化
      return curry.call(null, fn, ...allArgs)
    }
  }
}
```

这样一来，我们的写法就可以支持以下形式。

```javascript
function fn(a, b, c) {
  return a + b + c;
}
var curried = curry(fn);
curried(1, 2, 3); // 6
curried(1, 2)(3); // 6
curried(1)(2, 3); // 6
curried(1)(2)(3); // 6
curried(7)(8)(9); // 24
```



##### 参数不定长的柯里化

要支持参数不定长的场景，已经柯里化的函数在执行完毕时不能返回一个值，只能返回一个函数；同时要让JS引擎在解析得到的这个结果时，能求出我们预期的值。通过重写`toString`，就可以巧妙地实现我们的需求了。

```javascript
function curry(fn) {
  // 保存预置参数
  const presetArgs = [].slice.call(arguments, 1)
  // 返回一个新函数
  function curried () {
    // 新函数调用时会继续传参
    const restArgs = [].slice.call(arguments)
    const allArgs = [...presetArgs, ...restArgs]
    return curry.call(null, fn, ...allArgs)
  }
  // 重写toString
  curried.toString = function() {
    return fn.apply(null, presetArgs)
  }
  return curried;
}
复制代码
```

这样一来，魔性的`add`用法就都被支持了。

```javascript
function dynamicAdd() {
  return [...arguments].reduce((prev, curr) => {
    return prev + curr
  }, 0)
}
var add = curry(dynamicAdd);
add(1)(2)(3)(4) // 10
add(1, 2)(3, 4)(5, 6) // 21
```




