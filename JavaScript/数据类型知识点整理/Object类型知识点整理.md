## Object类型知识点整理

[TOC]



### 1. Object概述

#### 1.1 对象的定义

对象是一组“键值对”（key-value）的集合，是一种无序的复合数据集合。

#### 1.2 创建一个Object对象

`var obj = new Object()`和`var obj = {}`，这两种方式都可以创建一个对象，一种是利用Object构造函数，一种是利用字面量的形式，这两种方式是等价的，或者说后者是前者的简写方式

**`Object(value)`与`new Object(value)`**

`Object(value)`与`new Object(value)`两者的语义是不同的，`Object(value)`表示将`value`转成一个对象，`new Object(value)`则表示新生成一个对象，它的值是`value`。



### 2. Object属性

#### 2.1 属性的表示

ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。属性名就是变量名, 属性值就是变量值

```javascript
let birth = '2000/01/01';
const Person = {
  name: '张三',
  //等同于birth: birth
  birth,
  // 等同于hello: function ()...
  hello() { console.log('我的名字是', this.name); }
};
```

#### 2.2 属性的操作

##### 读取和赋值

读取对象的属性和给对象赋值，有两种方法，一种是使用点运算符，还有一种是使用方括号运算符。

```js
var obj = {
  p: 'Hello World'
};
obj.p // "Hello World"
obj['p'] // "Hello World"

obj.foo = 'Hello';
obj['bar'] = 'World';
```

##### 属性查看

查看一个对象本身的所有属性，可以使用`Object.keys`方法。

```js
var obj = {
  key1: 1,
  key2: 2
};

Object.keys(obj);
// ['key1', 'key2']
```

##### 属性删除

`delete`命令用于删除对象的属性，删除成功后返回`true`。`delete`命令只能删除对象本身的属性，无法删除继承的属性	

```js
var obj = { p: 1 };
Object.keys(obj) // ["p"]

delete obj.p // true
obj.p // undefined
```

##### 属性是否存在

`in`运算符用于检查对象是否包含某个属性（注意，检查的是键名，不是键值），如果包含就返回`true`，否则返回`false`。它的左边是一个字符串，表示属性名，右边是一个对象。使用对象的`hasOwnProperty`方法可以判断是否为对象自身的属性,，in操作符不能判断是否是对象自身属性还是继承属性

```js
var obj = { p: 1 };
'p' in obj // true
'toString' in obj // true
```

##### 属性遍历

**（1）for...in**

`for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

```js
var obj = {a: 1, b: 2, c: 3};
for (var i in obj) {
  console.log('键名：', i);
  console.log('键值：', obj[i]);
}
```

**（2）Object.keys(obj)**

`Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

**（3）Object.getOwnPropertyNames(obj)**

`Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名。

**（4）Object.getOwnPropertySymbols(obj)**

`Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性的键名。

**（5）Reflect.ownKeys(obj)**

`Reflect.ownKeys`返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列

#### 2.3 Object的属性描述对象

Object的每个属性都有自己对应的属性描述对象，保存该属性的一些元信息。

属性描述对象提供6个元属性。

（1）`value`

`value`是该属性的属性值，默认为`undefined`。

（2）`writable`

`writable`是一个布尔值，表示属性值（value）是否可改变（即是否可写），默认为`true`。

（3）`enumerable`

`enumerable`是一个布尔值，表示该属性是否可遍历，默认为`true`。如果设为`false`，会使得某些操作（比如`for...in`循环、`Object.keys()`）跳过该属性。

如果一个属性的`enumerable`为`false`，下面四个操作不会取到该属性。

- `for...in`循环：只遍历对象**自身的和继承**的可枚举的属性。
- `Object.keys()`：返回对象**自身的**所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象**自身的**可枚举的属性。
- `Object.assign()`： 忽略`enumerable`为`false`的属性，只拷贝对象**自身的**可枚举的属性。

（4）`configurable`

`configurable`是一个布尔值，表示属性的可配置性，默认为`true`。如果设为`false`，将阻止某些操作改写属性描述对象，比如无法删除该属性，也不得改变各种元属性（`value`属性除外）。也就是说，`configurable`属性控制了属性描述对象的可写性。

（5）`get`

`get`是一个函数，表示该属性的取值函数（getter），默认为`undefined`。

（6）`set`

`set`是一个函数，表示该属性的存值函数（setter），默认为`undefined`。

### 3. Object的拷贝

可以通过`Object.defineProperty`方法来拷贝属性，包含存储器

```
var extend = function (to, from) {
  for (var property in from) {
    if (!from.hasOwnProperty(property)) continue;
    Object.defineProperty(
      to,
      property,
      Object.getOwnPropertyDescriptor(from, property)
    );
  }

  return to;
}

extend({}, { get a(){ return 1 } })
// { get a(){ return 1 } })
```

上面代码中，`hasOwnProperty`那一行用来过滤掉继承的属性，否则可能会报错，因为`Object.getOwnPropertyDescriptor`读不到继承属性的属性描述对象。

### 4. Object静态方法

Object对象自身的方法，也就是直接定义在Object身上的方法，例如：Object.print = function (o) { console.log(o) };

#### 4.1 对象属性的方法

##### Object.getOwnPropertyDescriptor()

`Object.getOwnPropertyDescriptor()`方法可以获取属性描述对象。它的第一个参数是目标对象，第二个参数是一个字符串，对应目标对象的某个属性名。只能用于自身属性，不能用于继承属性

```js
var obj = { p: 'a' };

Object.getOwnPropertyDescriptor(obj, 'p')
// Object { value: "a",
//   writable: true,
//   enumerable: true,
//   configurable: true
// }
```

##### Object.getOwnPropertyDescriptors()

S2017 引入了`Object.getOwnPropertyDescriptors()`方法，返回指定对象所有自身属性（非继承属性）的描述对象。

```javascript
const obj = {
  foo: 123,
  get bar() { return 'abc' }
};

Object.getOwnPropertyDescriptors(obj)
// { foo:
//    { value: 123,
//      writable: true,
//      enumerable: true,
//      configurable: true },
//   bar:
//    { get: [Function: get bar],
//      set: undefined,
//      enumerable: true,
//      configurable: true } }
```

`Object.getOwnPropertyDescriptors()`方法配合`Object.defineProperties()`方法，就可以实现正确拷贝。

```javascript
const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }
```

`Object.getOwnPropertyDescriptors()`方法的另一个用处，是配合`Object.create()`方法，将对象属性克隆到一个新对象。这属于浅拷贝。

```javascript
const clone = Object.create(Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj));
```

##### Object.defineProperty()

通过描述对象，定义某个属性。

接受三个参数，依次如下。

- object：属性所在的对象
- propertyName：字符串，表示属性名
- attributesObject：属性描述对象

```js
var obj = Object.defineProperty({}, 'p', {
  value: 123,
  writable: false,
  enumerable: true,
  configurable: false
});

obj.p // 123
```

##### Object.defineProperties()

一次定义或修改多个属性

```js
var obj = Object.defineProperties({}, {
  p1: { value: 123, enumerable: true },
  p2: { value: 'abc', enumerable: true },
  p3: { get: function () { return this.p1 + this.p2 },
    enumerable:true,
    configurable:true
  }
});

obj.p1 // 123
obj.p2 // "abc"
obj.p3 // "123abc"
```

**Object.defineProperty()和Object.defineProperties()参数里面的属性描述对象，writable、configurable、enumerable这三个属性的默认值都为false，直接定义的话这三个属性的值是true**

##### Object.getOwnPropertyNames()

方法参数是一个对象，返回一个数组，成员是参数对象自身的全部属性的属性名，**不管该属性是否可遍历**。

`Object.keys`只返回对象自身的**可遍历属性**的全部属性名。

```js
var obj = Object.defineProperties({}, {
  p1: { value: 1, enumerable: true },
  p2: { value: 2, enumerable: false }
});
Object.getOwnPropertyNames(obj)
// ["p1", "p2"]
```

#### 4.2 控制对象状态的方法

##### Object.preventExtensions()

防止对象扩展，可以使得一个对象无法再添加新的属性。

```js
var obj = new Object();
Object.preventExtensions(obj);
Object.defineProperty(obj, 'p', {
  value: 'hello'
});
// TypeError: Cannot define property:p, object is not extensible.
obj.p = 1;
obj.p // undefined
```

##### Object.isExtensible()

判断对象是否可扩展，用于检查一个对象是否使用了`Object.preventExtensions`方法

```js
var obj = new Object();	
Object.isExtensible(obj) // true
Object.preventExtensions(obj);
Object.isExtensible(obj) // false
```

##### Object.seal()

禁止对象配置，使得一个对象既无法添加新属性，也无法删除旧属性。实质是把属性描述对象的`configurable`属性设为`false`

只是禁止新增或删除属性，并不影响修改某个属性的值，因为属性的可写性由`writable`决定。

```js
var obj = { p: 'hello' };
Object.seal(obj);
delete obj.p;
obj.p // "hello"
obj.x = 'world';
obj.x // undefined

var obj = { p: 'a' };
Object.seal(obj);
obj.p = 'b';
obj.p // 'b'
```

##### Object.isSealed()

用于检查一个对象是否使用了`Object.seal`方法，这时，`Object.isExtensible`方法也返回`false`。

```js
var obj = { p: 'a' };
Object.seal(obj);
Object.isSealed(obj) // true
Object.isExtensible(obj) // false
```

##### Object.freeze()

冻结对象，使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上**变成了常量**。

```js
var obj = {
  p: 'hello'
};
Object.freeze(obj);
obj.p = 'world';
obj.p // "hello"
obj.t = 'hello';
obj.t // undefined
delete obj.p // false
obj.p // "hello"
```

##### Object.isFrozen()

检查一个对象是否使用了`Object.freeze`方法。使用`Object.freeze`方法以后，`Object.isSealed`将会返回`true`，`Object.isExtensible`返回`false`。

```js
var obj = {
  p: 'hello'
};
Object.freeze(obj);
Object.isFrozen(obj) // true
Object.isSealed(obj) // true
Object.isExtensible(obj) // false
```

**上面的三个方法锁定对象的可写性有一个漏洞：可以通过改变原型对象，来为对象增加属性。**

```js
var obj = new Object();
Object.preventExtensions(obj);

var proto = Object.getPrototypeOf(obj);
proto.t = 'hello';
obj.t
// hello
```

#### 4.3 原型链相关方法

##### Object.create()

`Object.create()`方法创建一个新对象，第一个参数是新创建对象的原型对象，第二个参数可选，也是一个对象，该传入对象的自有可枚举属性(即其自身定义的属性，而不是其原型链上的枚举属性)将为新创建的对象添加指定的属性值和对应的属性描述符。方法返回值为带着指定原型对象和属性的新对象

```js
const person = {
  isHuman: false,
  printIntroduction: function() {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};
const me = Object.create(person);
me.name = 'Matthew'; // "name" is a property set on "me", but not on "person"
me.isHuman = true; // inherited properties can be overwritten

```

##### Object.setPrototypeOf()

`Object.setPrototypeOf`方法的作用与`__proto__`相同，用来设置一个对象的原型对象（prototype），返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法。

```javascript
// 格式
Object.setPrototypeOf(object, prototype)

let proto = {};
let obj = { x: 10 };
Object.setPrototypeOf(obj, proto);

proto.y = 20;
proto.z = 40;

obj.x // 10
obj.y // 20
obj.z // 40
```

##### Object.getPrototypeOf()

读取一个对象的原型对象

```javascript
Object.getPrototypeOf(obj);
// 等同于 Object.getPrototypeOf(Number(1))
Object.getPrototypeOf(1)
// Number {[[PrimitiveValue]]: 0}
Object.getPrototypeOf(1) === Number.prototype // true
```

##### __proto__属性

`__proto__`属性（前后各两个下划线），用来读取或设置当前对象的原型对象（prototype）。目前，所有浏览器（包括 IE11）都部署了这个属性。无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的`Object.setPrototypeOf()`（写操作）、`Object.getPrototypeOf()`（读操作）、`Object.create()`（生成操作）代替。实现上，`__proto__`调用的是`Object.prototype.__proto__`

```javascript
// es5 的写法
const obj = {
  method: function() { ... }
};
obj.__proto__ = someOtherObj;

// es6 的写法
var obj = Object.create(someOtherObj);
obj.method = function() { ... };
```



#### 4.4 其他方法

##### Object.keys()

`Object.keys`方法的参数是一个对象，返回一个数组。该数组的成员都是该对象自身的（而不是继承的）**可遍历属性名**

```js
var a = ['Hello', 'World'];
Object.keys(a) // ["0", "1"]
Object.getOwnPropertyNames(a) // ["0", "1", "length"]
```

##### Object.values()

`Object.values`方法返回一个数组，成员是参数**对象自身的（不含继承的）所有可遍历**属性的键值。

```javascript
const obj = { foo: 'bar', baz: 42 };
Object.values(obj)
// ["bar", 42]
```

##### Object.entries() 

`Object.entries()`方法返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

```javascript
const obj = { foo: 'bar', baz: 42 };
Object.entries(obj)
// [ ["foo", "bar"], ["baz", 42] ]
```

##### Object.fromEntries()

`Object.fromEntries()`方法是`Object.entries()`的逆操作，用于将一个键值对数组转为对象。将map转为对象, 配合URLSearchParams对象，将查询字符串转为对象。

```javascript
Object.fromEntries([
  ['foo', 'bar'],
  ['baz', 42]
])
// { foo: "bar", baz: 42 }

// 将map转为对象
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);
Object.fromEntries(entries)
// { foo: "bar", baz: 42 }

// 配合URLSearchParams对象，将查询字符串转为对象。
Object.fromEntries(new URLSearchParams('foo=bar&baz=qux'))
// { foo: "bar", baz: "qux" }
```

##### Object.is()

ES5 比较两个值是否相等，只有两个运算符：相等运算符（`==`）和严格相等运算符（`===`）。它们都有缺点，前者会自动转换数据类型，后者的`NaN`不等于自身，以及`+0`等于`-0`。Object.is()与严格比较运算符（===）的行为基本一致，不同之处只有两个：一是`+0`不等于`-0`，二是`NaN`等于自身。

```javascript
Object.is('foo', 'foo')
// true
Object.is({}, {})
// false
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

##### Object.assign() 

`Object.assign()`方法用于对象的合并，将源对象（source）的所有**可枚举属性**，复制到目标对象（target）。第一个参数是目标对象，后面的参数都是源对象。是浅拷贝，只复制值

```javascript
const target = { a: 1 };
const source1 = { b: 2 };
const source2 = { c: 3 };
Object.assign(target, source1, source2);
target // {a:1, b:2, c:3}
```

### 5. Object实例方法

定义在`Object`原型对象`Object.prototype`上的方法。它可以被`Object`实例直接使用，例如：Object.prototype.print = function () {
console.log(this); };

#### 5.1 对象属性的实例方法

##### propertyIsEnumerable()

Object.prototype.propertyIsEnumerable方法返回一个布尔值，用来判断某个属性是否可遍历。注意，这个方法只能用于判断对象自身的属性，对于继承的属性一律返回`false`。

```js
var obj = {};
obj.p = 123;
obj.propertyIsEnumerable('p') // true
obj.propertyIsEnumerable('toString') // false toString()是继承的属性
```

##### hasOwnProperty()

`Object.prototype.hasOwnProperty`方法接受一个字符串作为参数，返回一个布尔值，表示该实例对象自身是否具有该属性，不包含继承属性

```js
var obj = {
  p: 123
};
obj.hasOwnProperty('p') // true
obj.hasOwnProperty('toString') // false toString是继承属性
```

#### 5.2 其他实例方法

##### valueOf()

`valueOf`方法的作用是返回一个对象的“值”，默认情况下返回对象本身。

```js
var obj = new Object();
obj.valueOf() === obj // true
```

##### toString()

`toString`方法的作用是返回一个对象的字符串形式，默认情况下返回类型字符串。

```
var o1 = new Object();
o1.toString() // "[object Object]"
```

数组、字符串、函数、Date 对象都分别部署了自定义的`toString`方法，覆盖了`Object.prototype.toString`方法。利用此方法可以判断数据类型

```js
[1, 2, 3].toString() // "1,2,3"
'123'.toString() // "123"

(function () {
  return 123;
}).toString()
// "function () {
//   return 123;
// }"

(new Date()).toString()
// "Tue May 10 2016 09:11:31 GMT+0800 (CST)"

Object.prototype.toString.call(2) // "[object Number]"
Object.prototype.toString.call('') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(Math) // "[object Math]"
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call([]) // "[object Array]"
```

##### toLocaleString()

`Object.prototype.toLocaleString`方法与`toString`的返回结果相同，也是返回一个值的字符串形式，`toLocaleString()`方法返回本地的字符串形式。

目前，主要有三个对象自定义了`toLocaleString`方法。

- Array.prototype.toLocaleString()
- Number.prototype.toLocaleString()
- Date.prototype.toLocaleString()

举例来说，日期的实例对象的`toString`和`toLocaleString`返回值就不一样，而且`toLocaleString`的返回值跟用户设定的所在地域相关。

```js
var obj = {};
obj.toString(obj) // "[object Object]"
obj.toLocaleString(obj) // "[object Object]"
var date = new Date();
date.toString() // "Tue Jan 01 2018 12:01:33 GMT+0800 (CST)"
date.toLocaleString() // "1/01/2018, 12:01:33 PM"
```