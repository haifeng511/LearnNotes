## Array知识点整理

[TOC]



### 1. 数组的定义

数组（array）是按次序排列的一组值。每个值的位置都有编号（从0开始），整个数组用方括号表示。本质上，数组属于一种特殊的对象。`typeof`运算符会返回数组的类型是`object`。

`Array`是 JavaScript 的原生对象，同时也是一个构造函数，可以用它生成新的数组。建议使用数组字面量的形式直接生成数组

```js
var arr = ['a', 'b', 'c']; // 建议方式

// 使用Array()函数创建数组
// 无参数时，返回一个空数组
new Array() // []

// 单个正整数参数，表示返回的新数组的长度
new Array(1) // [ empty ]
new Array(2) // [ empty x 2 ]

// 非正整数的数值作为参数，会报错
new Array(3.2) // RangeError: Invalid array length
new Array(-3) // RangeError: Invalid array length

// 单个非数值（比如字符串、布尔值、对象等）作为参数，
// 则该参数是返回的新数组的成员
new Array('abc') // ['abc']
new Array([1]) // [Array[1]]

// 多参数时，所有参数都是返回的新数组的成员
new Array(1, 2) // [1, 2]
new Array('a', 'b', 'c') // ['a', 'b', 'c']
```

### 2. 数组的扩展运算符

#### 2.1 扩展运算符含义

扩展运算符（spread）是三个点（`...`）。它好比 rest 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 、Set、字符串、Generator 函数、DOM 元素集

```javascript
console.log(...[1, 2, 3])
// 1 2 3
console.log(1, ...[2, 3, 4], 5)
// 1 2 3 4 5
[...document.querySelectorAll('div')]
// [<div>, <div>, <div>]
```

#### 2.2 扩展运算符应用

##### 复制数组

ES5 只能用变通方法来复制数组。

```javascript
const a1 = [1, 2];
const a2 = a1.concat();

a2[0] = 2;
a1 // [1, 2]
```

上面代码中，`a1`会返回原数组的克隆，再修改`a2`就不会对`a1`产生影响。

扩展运算符提供了复制数组的简便写法。

```javascript
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```

##### 合并数组

扩展运算符提供了数组合并的新写法。 两种方法都是浅拷贝

```javascript
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

##### 与解构赋值连用产生新数组

扩展运算符可以与解构赋值结合起来，用于生成数组。将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。

```javascript
// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
const [first, ...rest] = [];
first // undefined
rest  // []
```

##### 将实现了 Iterator 接口的对象转为数组

扩展运算符可以将字符串转为真正的数组。

```javascript
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

上面的写法，有一个重要的好处，那就是能够正确识别四个字节的 Unicode 字符

### 3. 类数组对象

#### 3.1 类数组对象的定义

“类似数组的对象”（array-like object）：一个对象的所有键名都是正整数或零，并且有`length`属性

类数组对象不具备数组的方法，**类数组本质上具备length属性**，但是length不是动态变化的

#### 3.2 常见的类数组对象：

函数的`arguments`对象，以及大多数 DOM 元素集，还有字符串

#### 3.3 类数组对象转真正的数组：

数组的`slice`方法可以将“类似数组的对象”变成真正的数组。

```js
var arr = Array.prototype.slice.call(arrayLike);
```

### 4. 数组的属性

数组的`length`属性，返回数组的成员数量。

清空数组的一个方法，也可以将数组的length置0

```js
['a', 'b', 'c'].length // 3

arr.length = 0;
arr // []
```

### 5. 数组的静态方法

#### Array.isArray()

`Array.isArray`方法返回一个布尔值，表示参数是否为数组。它可以弥补`typeof`运算符的不足。

```js
var arr = [1, 2, 3];

typeof arr // "object"
Array.isArray(arr) // true
```

#### Array.from()

将类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）转成真正的数组

`Array.from`还可以接受第二个参数，作用类似于数组的`map`方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

```javascript
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']

// 将数组中布尔值为false的成员转为0。
Array.from([1, , 2, , 3], (n) => n || 0)
// [1, 0, 2, 0, 3]
```

#### Array.of()

`Array.of()`方法用于将一组值，转换为数组。基本上可以用来替代`Array()`或`new Array()`，并且不存在由于参数不同而导致的重载。它的行为非常统一，总是返回参数值组成的数组。如果没有参数，就返回一个空数组。

```javascript
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```

### 6. 数组的实例方法

#### 6.1 对象的通用方法

##### valueOf()，toString()

`valueOf`、`toString`方法是一个所有对象都拥有的方法

数组的`valueOf`方法返回数组本身，数组的`toString`方法返回数组的字符串形式

```js
var arr = [1, 2, 3];
arr.valueOf() // [1, 2, 3]
arr.toString() // "1,2,3"
```

#### 6.2 操作数组的方法

操作数组的四个方法都会改变原数组，push、pop是操作末端，shift、unshift是操作开端，push,unshift是添加，返回结果是新数组长度，pop、shift是删除，返回的是删除的那个数据

##### push()，pop()

`push`方法用于在数组末端添加一个或多个元素，返回添加新元素后的数组长度。

`pop`方法用于删除数组最端后一个元素，并返回该元素。

两个方法都是操作数组末端，结果都会改变数组

```js
var arr = [];
arr.push(1) // 1
arr.push('a') // 2
arr.push(true, {}) // 4
arr // [1, 'a', true, {}]

var arr = ['a', 'b', 'c'];
arr.pop() // 'c'
arr // ['a', 'b']
```

##### shift()，unshift()

`shift()`方法用于删除数组的第一个元素，并返回该元素

`unshift()`方法用于在数组的第一个位置添加元素，并返回添加新元素后的数组长度

两个方法都是操作数据开端，结果会改变数组

```js
var a = ['a', 'b', 'c'];
a.shift() // 'a'
a // ['b', 'c']

var arr = [ 'c', 'd' ];
arr.unshift('a', 'b') // 4
arr // [ 'a', 'b', 'c', 'd' ]
```

#### 6.2 数组连接和合并

##### join()

`join()`方法以指定参数作为分隔符，将所有数组成员连接为一个字符串返回。如果不提供参数，默认用逗号分隔。

```js
var a = [1, 2, 3, 4];
a.join(' ') // '1 2 3 4'
a.join(' | ') // "1 | 2 | 3 | 4"
a.join() // "1,2,3,4"
```

##### concat()

`concat`方法用于多个数组的合并。它将新数组的成员，添加到原数组成员的后部，然后返回一个新数组，原数组不变。

`concat`方法返回当前数组的一个浅拷贝。所谓“浅拷贝”，指的是新数组拷贝的是对象的引用。改变原对象之后，新数组也会改变

```js
['hello'].concat(['world'])
// ["hello", "world"]
['hello'].concat(['world'], ['!'])
// ["hello", "world", "!"]
```

#### 6.3 数组反转和排序

##### reverse()

`reverse`方法用于颠倒排列数组元素，返回改变后的数组。注意，该方法将改变原数组。

```js
var a = ['a', 'b', 'c'];
a.reverse() // ["c", "b", "a"]
a // ["c", "b", "a"]
```

##### sort()

`sort`方法对数组成员进行排序，默认是按照字典顺序排序。排序后，原数组将被改变。

```js
['d', 'c', 'b', 'a'].sort()
// ['a', 'b', 'c', 'd']
[4, 3, 2, 1].sort()
// [1, 2, 3, 4]
[11, 101].sort()
// [101, 11]
```

如果想让`sort`方法按照自定义方式排序，可以传入一个函数作为参数。如果该函数的返回值大于`0`，表示第一个成员排在第二个成员后面；其他情况下，都是第一个元素排在第二个元素前面。

```js
[10111, 1101, 111].sort(function (a, b) {
  return a - b;
})
// [111, 1101, 10111]
```

#### 6.4 数组截取

##### slice()

`slice()`方法用于提取目标数组的一部分，返回一个新数组，原数组不变。

arr.slice(start, end); 它的第一个参数为起始位置（从0开始，会包括在返回的新数组之中），第二个参数为终止位置（但该位置的元素本身不包括在内）。如果省略第二个参数，则一直返回到原数组的最后一个成员。如果参数是负数表示倒数计算的位置

如果第一个参数大于等于数组长度，或者第二个参数小于第一个参数，则返回空数组。

```js
var a = ['a', 'b', 'c'];
a.slice(1) // ["b", "c"]
a.slice(1, 2) // ["b"]
a.slice() // ["a", "b", "c"]
a.slice(-2) // ["b", "c"]
a.slice(-2, -1) // ["b"]
```

`slice()`方法的一个重要应用，是将类似数组的对象转为真正的数组。

```js
Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 })
// ['a', 'b']
Array.prototype.slice.call(document.querySelectorAll("div"));
Array.prototype.slice.call(arguments);
```

##### splice()

`splice()`方法用于删除原数组的一部分成员，并可以在删除的位置添加新的数组成员，返回值是被删除的元素。注意，该方法会改变原数组。

arr.splice(start, count, addElement1, addElement2, ...);第一个参数是删除的起始位置（从0开始），第二个参数是被删除的元素个数。如果后面还有更多的参数，则表示这些就是要被插入数组的新元素。如果参数是负数表示倒数计算的位置

```js
var a = ['a', 'b', 'c', 'd', 'e', 'f'];
a.splice(4, 2) // ["e", "f"]
a // ["a", "b", "c", "d"]

var a = ['a', 'b', 'c', 'd', 'e', 'f'];
a.splice(4, 2, 1, 2) // ["e", "f"]
a // ["a", "b", "c", "d", 1, 2]
```

#### 6.5 数组的遍历

参数是一个函数，接受三个参数(累加的遍历是4的参数，参数也不一样)：当前值、当前位置、整个数组。可以接受第二个参数，绑定参数函数的`this`变量。方法并不会改变原数组对象

##### map()

`map()`方法将数组的所有成员依次传入参数函数，然后把每一次的执行结果组成一个新数组返回。该方法不改变数组

`map()`方法接受一个函数作为参数。该函数调用时，`map()`方法向它传入三个参数：当前成员、当前位置和数组本身。

```js
var numbers = [1, 2, 3];
numbers.map(function (n) {
  return n + 1;
});
// [2, 3, 4]
numbers
// [1, 2, 3]
```

`map()`方法还可以接受第二个参数，用来绑定回调函数内部的`this`变量

```js
var arr = ['a', 'b', 'c'];
[1, 2].map(function (e) {
  return this[e];
}, arr)
// ['b', 'c']
```

##### forEach()

`forEach()`方法也是对数组的所有成员依次执行参数函数。但是，`forEach()`方法不返回值，参数是一个函数，该函数同样接受三个参数：当前值、当前位置、整个数组。也可以接受第二个参数，绑定参数函数的`this`变量。

注意，`forEach()`方法无法中断执行，总是会将所有成员遍历完。如果希望符合某种条件时，就中断遍历，要使用`for`循环。

```js
function log(element, index, array) {
  console.log('[' + index + '] = ' + element);
}
[2, 5, 9].forEach(log);
// [0] = 2
// [1] = 5
// [2] = 9
```

##### filter()

`filter()`方法用于过滤数组成员，满足条件的成员组成一个新数组返回。该方法不会改变原数组，参数函数可以接受三个参数：当前成员，当前位置和整个数组。可以接受第二个参数，用来绑定参数函数内部的`this`变量。

```js
[1, 2, 3, 4, 5].filter(function (elem, index, arr) {
  return index % 2 === 0;
});
// [1, 3, 5]
```

##### some()，every()

返回一个布尔值，表示判断数组成员是否符合某种条件。

它们接受一个函数作为参数，所有数组成员依次执行该函数。该函数接受三个参数：当前成员、当前位置和整个数组，然后返回一个布尔值。

`some`方法是只要一个成员的返回值是`true`，则整个`some`方法的返回值就是`true`，否则返回`false`。

`every`方法是所有成员的返回值都是`true`，整个`every`方法才返回`true`，否则返回`false`。

`some`和`every`方法还可以接受第二个参数，用来绑定参数函数内部的`this`变量。

```js
var arr = [1, 2, 3, 4, 5];
arr.some(function (elem, index, arr) {
  return elem >= 3;
});
// true

var arr = [1, 2, 3, 4, 5];
arr.every(function (elem, index, arr) {
  return elem >= 3;
});
// false
```

##### reduce()，reduceRight()

`reduce()`方法和`reduceRight()`方法依次处理数组的每个成员，最终累计为一个值。它们的差别是，`reduce()`是从左到右处理（从第一个成员到最后一个成员），`reduceRight()`则是从右到左（从最后一个成员到第一个成员），其他完全一样。

`reduce()`方法和`reduceRight()`方法的第一个参数都是一个函数。该函数接受以下四个参数。

1. 累积变量。第一次执行时，默认为数组的第一个成员；以后每次执行时，都是上一轮的返回值。
2. 当前变量。第一次执行时，默认为数组的第二个成员；以后每次执行时，都是下一个成员。
3. 当前位置。一个整数，表示第二个参数（当前变量）的位置，默认为`1`。
4. 原数组。

```js
[1, 2, 3, 4, 5].reduce(function (a, b) {
  console.log(a, b);
  return a + b;
})
// 1 2
// 3 3
// 6 4
// 10 5
//最后结果：15

[1, 2, 3, 4, 5].reduce(function (
  a,   // 累积变量，必须
  b,   // 当前变量，必须
  i,   // 当前位置，可选
  arr  // 原数组，可选
) {
  // ... ...	
```

##### entries()，keys() 和 values()

ES6 提供三个新的方法——`entries()`，`keys()`和`values()`——用于遍历数组。它们都返回一个遍历器对象（详见《Iterator》一章），可以用`for...of`循环进行遍历，唯一的区别是`keys()`是对键名的遍历、`values()`是对键值的遍历，`entries()`是对键值对的遍历。

```javascript
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

// 如果不使用for...of循环，可以手动调用遍历器对象的next方法，进行遍历。
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```

#### 6.6 数组的查找

##### indexOf()，lastIndexOf()

`indexOf`方法返回给定元素在数组中第一次出现的位置，如果没有出现则返回`-1`。`indexOf`方法还可以接受第二个参数，表示搜索的开始位置。

`lastIndexOf`方法返回给定元素在数组中最后一次出现的位置，如果没有出现则返回`-1`。

这两个方法不能搜索NaN，因为函数内部是使用===，NaN不等于自身

```js
var a = ['a', 'b', 'c'];
a.indexOf('b') // 1
['a', 'b', 'c'].indexOf('a', 1) // -1

var a = [2, 5, 9, 2];
a.lastIndexOf(2) // 3
```

##### find() 和 findIndex() 

`find`方法，用于找出第一个符合条件的数组成员，参数是一个回调函数，回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。

`findIndex`方法的用法与`find`方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回`-1`。

这两个方法都可以发现`NaN`，弥补了数组的`indexOf`方法的不足。都可以接受第二个参数，用来绑定回调函数的`this`对象。

```javascript
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10

[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) // 
```

##### includes()

`Array.prototype.includes`方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的`includes`方法类似。ES2016 引入了该方法。

第二个参数表示搜索的起始位置，默认为`0`。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为`-4`，但数组长度为`3`），则会重置为从`0`开始。

```javascript
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```

#### 6.7 数组的其他方法

##### flat()，flatMap() 

`Array.prototype.flat()`用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。

`flat()`默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将`flat()`方法的参数写成一个整数，表示想要拉平的层数，默认为1。

```javascript
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]
[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]
[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]
// 如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。
[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]
```

`flatMap()`方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`），然后对返回值组成的数组执行`flat()`方法。该方法返回一个新数组，不改变原数组。`flatMap()`只能展开一层数组。`flatMap()`方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组。还可以有第二个参数，用来绑定遍历函数里面的`this`。

```javascript
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```

##### at()

JavaScript 不支持数组的负索引，如果要引用数组的最后一个成员，不能写成`arr[-1]`，只能使用`arr[arr.length - 1]`。这是因为方括号运算符`[]`在 JavaScript 语言里面，不仅用于数组，还用于对象。对于对象来说，方括号里面就是键名。由于 JavaScript 的数组是特殊的对象，所以方括号里面的负数无法再有其他语义了，

因此，数组实例增加了`at()`方法，接受一个整数作为参数，返回对应位置的成员，支持负索引。这个方法不仅可用于数组，也可用于字符串和类型数组（TypedArray）。

```javascript
const arr = [5, 12, 8, 130, 44];
arr.at(2) // 8
arr.at(-2) // 130
```

##### fill()

`fill`方法使用给定值，填充一个数组。数组中已有的元素，会被全部抹去。

`fill`方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

如果填充的是对象，则是浅拷贝，是内存地址，如果原对象改变则数组值改变

```javascript
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```

##### copyWithin()

数组实例的`copyWithin()`方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

```javascript
Array.prototype.copyWithin(target, start = 0, end = this.length)
```

它接受三个参数。

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

这三个参数都应该是数值，如果不是，会自动转为数值。

```javascript
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]  将从 3 号位直到数组结束的成员（4 和 5），复制到从 0 号位开始的位置，结果覆盖了原来的 1 和 2。
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]
// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]
```