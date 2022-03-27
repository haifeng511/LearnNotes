## String类型知识点整理

[TOC]



### 1. String概念

String是字符串，一般用单引号或双引号

String是类数组对象，有数值键[0,1,2]和length属性，可以像数组那样取值，具备遍历器接口，可以`for...of`循环遍历

### 2. String()

#### 2.1 String()用途

String()可以当做构造函数，创建一个字符串对象，也可以进行类型转换 ，将其他类型转成String类型

```js
new String('abc')
// String {0: "a", 1: "b", 2: "c", length: 3}

(new String('abc'))[1] // "b"

String(true) // "true"
String(5) // "5"
```

#### 2.2 String类型转换规则

- **数值**：转为相应的字符串。
- **字符串**：转换后还是原来的值。
- **布尔值**：`true`转为字符串`"true"`，`false`转为字符串`"false"`。
- **undefined**：转为字符串`"undefined"`。
- **null**：转为字符串`"null"`。
- `String`方法的参数如果是对象，返回一个类型字符串；如果是数组，返回该数组的字符串形式。

```js
String(123) // "123"
String('abc') // "abc"
String(true) // "true"
String(undefined) // "undefined"
String(null) // "null"
String({a: 1}) // "[object Object]"
String([1, 2, 3]) // "1,2,3"
```

**String()方法背后转换规则**

1.先调用toString()方法，看得到的值是否是基本数据类型，如果是对该值使用String函数

2.toString()方法返回的值是对象，调用其valueOf()方法，获取其值，如果值是基本数据类型，对值使用String函数

3.如果valueOf返回值是对象，则报错

#### 2.3 自动转换成String类型

字符串的自动转换，主要发生在字符串的加法运算时。当一个值为字符串，另一个值为非字符串，则后者转为字符串。

```js
'5' + 1 // '51'
'5' + true // "5true"
'5' + {} // "5[object Object]"
```

### 3. String的实例属性

#### String.prototype.length

字符串实例的`length`属性返回字符串的长度。

```
'abc'.length // 3
```

### 4. String的实例方法

#### 4.1 字符串获取字符和字符转Unicode

##### String.prototype.charAt()

`charAt`方法返回指定位置的字符，参数是从`0`开始编号的位置。此方法可以用数组下标替代，若参数为负数或大于字符串长度则返回空字符串

```js
var s = new String('abc');
s.charAt(1) // "b"

'abc'.charAt(1) // "b"
'abc'[1] // "b"
```

##### String.prototype.charCodeAt()

`charCodeAt()`方法返回字符串指定位置的 Unicode 码点（十进制表示），相当于`String.fromCharCode()`的逆操作。如果参数为负数，或大于等于字符串的长度，`charCodeAt`返回`NaN`

```js
'abc'.charCodeAt(1) // 98
```

#### 4.2 字符串连接和填充

##### String.prototype.concat()

`concat`方法用于连接两个字符串，返回一个新字符串，不改变原字符串。可以接受多个参数，如果参数不是字符串则会转换成字符串

```js
var s1 = 'abc';
var s2 = 'def';

s1.concat(s2) // "abcdef"
s1 // "abc"
```

##### String.prototype.repeat()

`repeat`方法返回一个新字符串，表示将原字符串重复`n`次。

```javascript
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""
```

参数如果是小数，会被取整，如果是负数或者`Infinity`，会报错，参数NaN等同于0，如果是字符串则会被转成数字

```javascript
'na'.repeat(2.9) // "nana"
```

##### String.prototype.padStart()，padEnd()

ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。`padStart()`用于头部补全，`padEnd()`用于尾部补全。`padStart()`和`padEnd()`一共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。如果省略第二个长度，则会使用空格补充

```javascript
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
```

#### 4.3 字符串比较和大小写转换

##### String.prototype.localeCompare()

`localeCompare`方法用于比较两个字符串。它返回一个整数

如果小于0，表示第一个字符串小于第二个字符串；如果等于0，表示两者相等；如果大于0，表示第一个字符串大于第二个字符串。

该方法的最大特点，就是会考虑自然语言的顺序。举例来说，正常情况下，大写的英文字母小于小写字母。例如字母`B`小于字母`a`。因为 JavaScript 采用的是 Unicode 码点比较，`B`的码点是66，而`a`的码点是97。但是，`localeCompare`方法会考虑自然语言的排序情况，将`B`排在`a`的前面。

```js
'apple'.localeCompare('banana') // -1
'apple'.localeCompare('apple') // 0

'B' > 'a' // false
'B'.localeCompare('a') // 1  表示`B`较大。
```

##### String.prototype.toLowerCase()，String.prototype.toUpperCase()

`toLowerCase`方法用于将一个字符串全部转为小写，`toUpperCase`则是全部转为大写。它们都返回一个新字符串，不改变原字符串。

```js
'Hello World'.toLowerCase()
// "hello world"

'Hello World'.toUpperCase()
// "HELLO WORLD"
```

#### 4.4 字符串裁剪和分隔

##### String.prototype.slice()

`slice()`方法用于从原字符串取出子字符串并返回，不改变原字符串。

它的第一个参数是子字符串的开始位置，第二个参数是子字符串的结束位置（不含该位置）。

如果省略第二个参数，则表示子字符串一直到原字符串结束。

如果参数是负值，表示从结尾开始倒数计算的位置，即该负值加上字符串长度。

如果第一个参数大于第二个参数（正数情况下），`slice()`方法返回一个空字符串

```js
'JavaScript'.slice(0, 4) // "Java"
'JavaScript'.slice(4) // "Script"
'JavaScript'.slice(-6) // "Script"
'JavaScript'.slice(0, -6) // "Java"
'JavaScript'.slice(2, 1) // ""
```

##### String.prototype.substring()

`substring`方法用于从原字符串取出子字符串并返回，不改变原字符串，跟`slice`方法很相像。

它的第一个参数表示子字符串的开始位置，第二个位置表示结束位置（返回结果不含该位置）。

如果省略第二个参数，则表示子字符串一直到原字符串的结束。

**如果第一个参数大于第二个参数，`substring`方法会自动更换两个参数的位置。**

**如果参数是负数，`substring`方法会自动将负数转为0。**

加粗的两点是跟slice不同的点

```js
'JavaScript'.substring(0, 4) // "Java"
'JavaScript'.substring(4) // "Script"
'JavaScript'.substring(10, 4) // "Script"
// 等同于
'JavaScript'.substring(4, 10) // "Script"
'JavaScript'.substring(-3) // "JavaScript"
'JavaScript'.substring(4, -3) // "Java"
```

由于这些规则违反直觉，因此**不建议使用`substring`方法，应该优先使用`slice`**。

##### String.prototype.substr()

`substr`方法用于从原字符串取出子字符串并返回，不改变原字符串，跟`slice`和`substring`方法的作用相同。

`substr`方法的第一个参数是子字符串的开始位置（从0开始计算），**第二个参数是子字符串的长度**。(这个是跟slice不同的地方)

如果省略第二个参数，则表示子字符串一直到原字符串的结束。

如果第一个参数是负数，表示倒数计算的字符位置。**如果第二个参数是负数，将被自动转为0，因此会返回空字符串**。

```
'JavaScript'.substr(4, 6) // "Script"
'JavaScript'.substr(4) // "Script"
'JavaScript'.substr(-6) // "Script"
'JavaScript'.substr(4, -1) // ""
```

##### String.prototype.split()

`split`方法按照给定规则分割字符串，返回一个由分割出来的子字符串组成的数组。

如果分割规则为空字符串，则返回数组的成员是原字符串的每一个字符。

如果省略参数，则返回数组的唯一成员就是原字符串。

如果满足分割规则的地方没有字符，返回数组中该位置是一个空字符串

`split`方法还可以接受第二个参数，限定返回数组的最大成员数。

```js
'a|b|c'.split('|') // ["a", "b", "c"]
'a|b|c'.split('') // ["a", "|", "b", "|", "c"]
'a|b|c'.split() // ["a|b|c"]

// 如果满足分割规则的地方没有字符，返回数组中该位置是一个空字符串
'a|b|c'.split('|') // ["a", "b", "c"]
'|b|c'.split('|') // ["", "b", "c"]
'a|b|'.split('|') // ["a", "b", ""]

'a|b|c'.split('|', 0) // []
'a|b|c'.split('|', 1) // ["a"]
'a|b|c'.split('|', 2) // ["a", "b"]
'a|b|c'.split('|', 3) // ["a", "b", "c"]
'a|b|c'.split('|', 4) // ["a", "b", "c"]
```

#### 4.5 字符串查找

##### String.prototype.indexOf()，String.prototype.lastIndexOf()

`indexOf`方法用于确定一个字符串在另一个字符串中**第一次出现的位置**，返回结果是匹配开始的位置。如果返回`-1`，就表示不匹配。

`indexOf`方法还可以接受第二个参数，表示从该位置开始向后匹配。

`lastIndexOf`方法的用法跟`indexOf`方法一致，主要的区别是**`lastIndexOf`从尾部开始匹配，`indexOf`则是从头部开始匹配**。

另外，`lastIndexOf`的第二个参数表示从该位置起向前匹配。

```
'hello world'.indexOf('o') // 4
'JavaScript'.indexOf('script') // -1
'hello world'.indexOf('o', 6) // 7
'hello world'.lastIndexOf('o') // 7
'hello world'.lastIndexOf('o', 6) // 4
```

##### String.prototype.includes(), startsWith(), endsWith()

- **includes()**：返回布尔值，表示是否找到了参数字符串。
- **startsWith()**：返回布尔值，表示参数字符串是否在原字符串的头部。
- **endsWith()**：返回布尔值，表示参数字符串是否在原字符串的尾部。

```javascript
let s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
```

这三个方法都支持第二个参数，表示开始搜索的位置。

```javascript
let s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
```

使用第二个参数`n`时，`endsWith`是针对前`n`个字符，而includes、startsWith对从第`n`个位置直到字符串结束

#### 4.6 字符串去掉空格

##### String.prototype.trim()

`trim`方法用于去除字符串两端的空格，返回一个新字符串，不改变原字符串。

该方法去除的不仅是空格，还包括制表符（`\t`、`\v`）、换行符（`\n`）和回车符（`\r`）。

```js
'  hello world  '.trim()
// "hello world"
'\r\nabc \t'.trim() // 'abc'
```

##### String.prototype.trimStart()，trimEnd()

[ES2019](https://github.com/tc39/proposal-string-left-right-trim) 对字符串实例新增了`trimStart()`和`trimEnd()`这两个方法。它们的行为与`trim()`一致，`trimStart()`消除字符串头部的空格，`trimEnd()`消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。

```javascript
const s = '  abc  ';
s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"
```

#### 4.7 字符串匹配和替换

##### String.prototype.match()

`match`方法用于确定原字符串是否匹配某个子字符串

**返回一个数组，成员为匹配的第一个字符串**。如果没有找到匹配，则返回`null`。

返回的数组还有`index`属性和`input`属性，分别表示匹配字符串开始的位置和原始字符串。

```js
'cat, bat, sat, fat'.match('at') // ["at"]
'cat, bat, sat, fat'.match('xt') // null
var matches = 'cat, bat, sat, fat'.match('at');
matches.index // 1
matches.input // "cat, bat, sat, fat"
```

##### String.prototype.matchAll()

`matchAll()`方法返回一个正则表达式在当前字符串的所有匹配

##### String.prototype.search()

`search`方法的用法基本等同于`match`，但是**返回值为匹配的第一个位置**。如果没有找到匹配，则返回`-1`。

```js
'cat, bat, sat, fat'.search('at') // 1
```

`search`方法还可以使用正则表达式作为参数

##### String.prototype.replace()

`replace`方法用于替换匹配的子字符串，一般情况下只替换第一个匹配（除非使用带有`g`修饰符的正则表达式）。

```js
'aaa'.replace('a', 'b') // "baa"
```

##### String.prototype.replaceAll()

ES2021引入了`replaceAll()`方法，可以一次性替换所有匹配。

```javascript
'aabbcc'.replaceAll('b', '_')
// 'aa__cc'
```

它的用法与`replace()`相同，返回一个新字符串，不会改变原字符串。

```javascript
String.prototype.replaceAll(searchValue, replacement)
```

上面代码中，`searchValue`是搜索模式，可以是一个字符串，也可以是一个全局的正则表达式（带有`g`修饰符）。

如果`searchValue`是一个不带有`g`修饰符的正则表达式，`replaceAll()`会报错



### 5. String的静态方法

#### String.fromCharCode() 

`String`对象提供的静态方法（即定义在对象本身，而不是定义在对象实例的方法），主要是`String.fromCharCode()`。该方法的参数是一个或多个数值，代表 Unicode 码点，返回值是这些码点组成的字符串。

```js
String.fromCharCode() // ""
String.fromCharCode(97) // "a"
String.fromCharCode(104, 101, 108, 108, 111)
// "hello"
```

