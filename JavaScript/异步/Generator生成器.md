

# Generator生成器知识点总结

[TOC]

## 1. Generator的概念

Generator 函数是一个状态机，封装了多个内部状态。

执行 Generator 函数会返回一个遍历器对象，可以依次遍历 Generator 函数内部的每一个状态

**形式上的特征：**

function关键字和函数名之间有一个*，星号的位置不固定，一般紧跟function

函数体内部使用yield（产出）表达式，定义不同的状态

**Genarator函数定义和调用**

调用 Generator 函数，返回一个遍历器对象，代表 Generator 函数的内部指针。以后，每次调用遍历器对象的`next`方法，就会返回一个有着`value`和`done`两个属性的对象。`value`属性表示当前的内部状态的值，是`yield`表达式后面那个表达式的值；`done`属性是一个布尔值，表示是否遍历结束

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();

hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```



## 2. yield 表达式和yield* 表达式

`yield`表达式就是暂停标志

**遍历器next方法的运行逻辑**

遍历器对象的`next`方法遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值，下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式或者遇到`return`语句为止（函数为止），`return`语句跟着的表达式是返回对象的`value`属性值

**yield表达式使用注意点：**

`yield`表达式只能用在 Generator 函数里面，用在其他地方都会报错

```javascript
(function (){
  yield 1;
})()
// SyntaxError: Unexpected number
```

`yield`表达式如果用在另一个表达式之中，必须放在圆括号里面

```javascript
console.log('Hello' + (yield 123)); // OK
```

`yield`表达式用作函数参数或放在赋值表达式的右边，可以不加括号。

```javascript
function* demo() {
  foo(yield 'a', yield 'b'); // OK
  let input = yield; // OK
}
```

**yield*表达式**

ES6 提供了`yield*`表达式，用来在一个 Generator 函数里面执行另一个 Generator 函数。任何数据结构只要有 Iterator 接口，就可以被`yield*`遍历

```javascript
function* foo() {
  yield 'a';
  yield 'b';
}
function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```

## 3. Generator 函数与 Iterator 接口的关系

**Generator 函数是Iterator 接口的遍历器生成函数，调用Generator 函数会生成一个遍历器对象**

把 Generator 赋值给对象的`Symbol.iterator`属性，从而使得该对象具有 Iterator 接口

```javascript
var myIterable = {};
myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};

[...myIterable] // [1, 2, 3]
```
对象的`Symbol.iterator`属性等于调用Generator函数的返回

```javascript
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true
```

上面代码中，`gen`是一个 Generator 函数，调用它会生成一个遍历器对象`g`。它的`Symbol.iterator`属性，也是一个遍历器对象生成函数，执行后返回它自己



## 4. next方法的参数

`yield`表达式本身没有返回值，或者说总是返回`undefined`。`next`方法可以带一个参数，该参数就会被当作上一个`yield`表达式的返回值

通过`next`方法的参数，向 Generator 函数内部输入值的例子。

```javascript
function* dataConsumer() {
  console.log('Started');
  console.log(`1. ${yield}`);
  console.log(`2. ${yield}`);
  console.log(`3. ${yield 3}`);
  return 'result';
}

let genObj = dataConsumer();
genObj.next();
// Started
genObj.next('a')
// 1. a
genObj.next('b')
// 2. b
```



## 5. Iterator 对象作为参数

`for...of`循环、扩展运算符（`...`）、解构赋值和`Array.from`方法内部调用的，都是遍历器接口。它们都可以将 Generator 函数返回的 Iterator 对象，作为参数

`next`方法的返回对象的`done`属性为`true`，`for...of`循环就会中止，且不包含该返回对象，所以下方只会输出1,2

```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```



## 6. 使用Generator 函数遍历对象的方法

**1.通过 Generator 函数为对象增加遍历器**

```javascript
function* objectEntries(obj) {
  let propKeys = Reflect.ownKeys(obj);

  for (let propKey of propKeys) {
    yield [propKey, obj[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

for (let [key, value] of objectEntries(jane)) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

**2.将 Generator 函数加到对象的`Symbol.iterator`属性上面**

```javascript
function* objectEntries() {
  let propKeys = Object.keys(this);

  for (let propKey of propKeys) {
    yield [propKey, this[propKey]];
  }
}

let jane = { first: 'Jane', last: 'Doe' };

jane[Symbol.iterator] = objectEntries;

for (let [key, value] of jane) {
  console.log(`${key}: ${value}`);
}
// first: Jane
// last: Doe
```

