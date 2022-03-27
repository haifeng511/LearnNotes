## Number、Math、BigInt知识点的整理 

[TOC]

### 1. Number

#### 1.1 Number定义和精度损失问题

Number在JavaScript中不管是整数还是小数，都是以64位浮点数进行存储，1 === 1.0 两者是同一个数

带来的问题：精度损失，浮点数进行比较和计算时可能会出错 例如：0.1 + 0.2 !== 0.3

根据国际标准 IEEE 754，JavaScript 浮点数的64个二进制位，从最左边开始，是这样组成的。

- 第1位：符号位，`0`表示正数，`1`表示负数
- 第2位到第12位（共11位）：指数部分
- 第13位到第64位（共52位）：小数部分（即有效数字）

符号位决定了一个数的正负，指数部分决定了数值的大小，小数部分决定了数值的精度。

如果指数部分的值在0到2047之间（不含两个端点），有效数字总是`1.xx...xx`的形式，其中`xx..xx`的部分保存在64位浮点数之中，最长可能为52位。因此，JavaScript 提供的有效数字最长为53个二进制位。

```
(-1)^符号位 * 1.xx...xx * 2^指数部分
```

上面公式是正常情况下（指数部分在0到2047之间），一个数在 JavaScript 内部实际的表示形式。

精度最多只能到**53个二进制位**，这意味着，绝对值小于2的53次方的整数

**解决方法：**

方法1：搜索网络上JavaScript版本的BigDecimal.js工具类、Math.js工具类、Decimal.js工具类

方法2：在知道小数位个数的情况下，通过将小数放大倍数到整型，最后再除以相应的倍数

```js
   0.1 + 0.2 ——> (0.1 * 10 + 0.2 * 10) / 10 // 0.3
```

**十进制和二进制的转换**

```js
// 十进制转二进制  十进制整数转换为二进制整数采用"除2取余，逆序排列"法。十进制小数转换成二进制小数采用"乘2取整，顺序排列"法
parseFloat(0.1).toString(2);
=> "0.0001100110011001100110011001100110011001100110011001101"

// 二进制转十进制 
parseInt(1100100,2)
=> 100
```

#### 1.2 特殊的Number

**最大值、最小值**

JavaScript 提供`Number`对象的`MAX_VALUE`和`MIN_VALUE`属性，返回可以表示的具体的最大值和最小值。

```js
Number.MAX_VALUE // 1.7976931348623157e+308
Number.MIN_VALUE // 5e-324
```

**正零和负零**

JavaScript 内部实际上存在2个`0`：一个是`+0`，一个是`-0`，区别就是64位浮点数表示法的符号位不同，它们是等价的，唯一有区别是当作分母的时候

```js
-0 === +0 // true
0 === -0 // true
0 === +0 // true
(1 / +0) === (1 / -0) // false
// 除以正零得到+Infinity，除以负零得到-Infinity，这两者是不相等的
```

**NaN: 非数字**

主要作用在字符串转数值出错的场合，`NaN`不等于任何值，包括它本身，NaN与任何数（包括它自己）的运算，得到的都是NaN，布尔值是false

**Infinity：无穷**

`Infinity`有正负之分，`Infinity`表示正的无穷，`-Infinity`表示负的无穷。

#### 1.3 Number的属性

- `Number.POSITIVE_INFINITY`：正的无限，指向`Infinity`。

- `Number.NEGATIVE_INFINITY`：负的无限，指向`-Infinity`。

- `Number.NaN`：表示非数值，指向`NaN`。

- `Number.MIN_VALUE`：表示最小的正数（即最接近0的正数，在64位浮点数体系中为`5e-324`），相应的，最接近0的负数为`-Number.MIN_VALUE`。

- `Number.MAX_SAFE_INTEGER`：表示能够精确表示的最大整数，即`9007199254740991`。

- `Number.MIN_SAFE_INTEGER`：表示能够精确表示的最小整数，即`-9007199254740991`。

- **Number.EPSILON**

  它表示 1 与大于 1 的最小浮点数之间的差。

  对于 64 位浮点数来说，大于 1 的最小浮点数相当于二进制的`1.00..001`，小数点后面有连续 51 个零。这个值减去 1 之后，就等于 2 的 -52 次方。

  ```javascript
  Number.EPSILON === Math.pow(2, -52)
  // true
  Number.EPSILON
  // 2.220446049250313e-16
  ```

  `Number.EPSILON`可以用来设置“能够接受的误差范围”。比如，误差范围设为 2 的-50 次方（即`Number.EPSILON * Math.pow(2, 2)`），即如果两个浮点数的差小于这个值，我们就认为这两个浮点数相等。

  ```javascript
  function withinErrorMargin (left, right) {
    return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
  }
  
  0.1 + 0.2 === 0.3 // false
  withinErrorMargin(0.1 + 0.2, 0.3) // true
  ```

#### 1.4 Number()

`Number`对象是数值对应的包装对象，可以作为构造函数使用，也可以作为工具函数使用

作为构造函数时，它用于生成值为数值的对象，需要使用New关键字

```js
var n = new Number(1);
typeof n // "object"
```

作为工具函数时，它可以将任何类型的值转为数值。

```js
// 基本数据类型
// 数值：转换后还是原来的值
Number(324) // 324
// 字符串：如果可以被解析为数值，则转换为相应的数值
Number('324') // 324
// 字符串：如果不可以被解析为数值，返回 NaN,这里比parseFloat()严格，只要有一个字符无法转成数值就返回NaN
Number('324abc') // NaN
// 空字符串转为0
Number('') // 0
// 布尔值：true 转成 1，false 转成 0
Number(true) // 1
Number(false) // 0
// undefined：转成 NaN
Number(undefined) // NaN
// null：转成0
Number(null) // 0

// Number方法的参数是对象时，将返回NaN，除非是包含单个数值的数组。
Number({a: 1}) // NaN
Number([1, 2, 3]) // NaN
Number([5]) // 5
```

**Number()内部转换规则**

1.使用valueOf获取原始类型的值，如果是基本数据类型，则直接对该值使用Number函数

2.如果valueOf获取值是对象类型，则调用toString()方法，toString()方法获取的是基本数据类型，对该值使用Number函数

3.toString()方法获取的是对象则报错

#### 1.5 Number的实例方法

##### Number.prototype.toString()

将数值转成字符串，可接受一个参数，参数省略默认是转十进制，否则转参数指定进制

```js
(10).toString() // "10"
(10).toString(2) // "1010"
```

##### Number.prototype.toFixed()

将数字转换成指定位数的小数，返回小数对应字符串,由于浮点数的原因，小数5的四舍五入是不确定的，跟浮点数不是精确存储有关

```js
(10).toFixed(2) // "10.00"
10.005.toFixed(2) // "10.01"
(10.055).toFixed(2) // 10.05
(10.005).toFixed(2) // 10.01
```

##### Number.prototype.toExponential()

`toExponential`方法用于将一个数转为科学计数法形式，参数是小数点后有效数字的位数

```
(10).toExponential()  // "1e+1"
(10).toExponential(1) // "1.0e+1"
```

##### Number.prototype.toPrecision()

用于将一个数转为指定位数的有效数字，四舍五入时不可靠，跟浮点数不是精确存储有关

```
(12.34).toPrecision(1) // "1e+1"
(12.34).toPrecision(2) // "12"
(12.34).toPrecision(3) // "12.3"
(12.34).toPrecision(4) // "12.34"
```

##### Number.prototype.toLocaleString()

接受一个地区码作为参数，返回一个字符串，表示当前数字在该地区的当地书写形式。

```js
(123).toLocaleString('zh-Hans-CN-u-nu-hanidec')
// "一二三"
```

接受第二个参数配置对象，用来定制指定用途的返回字符串。该对象的`style`属性指定输出样式，默认值是`decimal`，表示输出十进制形式。如果值为`percent`，表示输出百分数。

```js
(123).toLocaleString('zh-Hans-CN', { style: 'percent' })
// "12,300%"
```

如果`style`属性的值为`currency`，则可以搭配`currency`属性，输出指定格式的货币字符串形式。

```js
(123).toLocaleString('zh-Hans-CN', { style: 'currency', currency: 'CNY' })
// "￥123.00"
```

#### 1.6 Number的全局方法

##### parseInt方法

用于将字符串转为整数，参数不是字符串会先转成字符串再转换，返回整数

注意点：头部有空格会去掉，遇到的字符不是数字就不再继续转换，第一个不是数字(数字前是正负号除外)返回NaN，以0x或0X开头转16进制，以0开头是10进制

可以有第二个参数，转成对应的进制

```js
parseInt('   81') // 81 
parseInt('8a') // 8
parseInt('.3') // NaN
parseInt('+1') // 1
parseInt('0x10') // 16
parseInt('1000', 2) // 8
```

##### parseFloat方法

用于将一个字符串转为浮点数，参数提前转字符串，如果字符串符合科学计数法，则会进行相应的转换，返回浮点数

注意：自动过滤前导空格，第一个不能转换则返回NaN，空字符串是转成NaN

**parseFloat方法和Number方法的区别**

```js
parseFloat(true)  // NaN
Number(true) // 1

parseFloat(null) // NaN
Number(null) // 0

parseFloat('') // NaN
Number('') // 0

parseFloat('123.45#') // 123.45
Number('123.45#') // NaN
```

##### isNaN方法

判断一个数值是否是NaN，参数是数值，如果不是数值则会先转换成数字，返回布尔值

```js
isNaN(NaN) // true
isNaN(123) // false
isNaN({}) // true
// 等同于
isNaN(Number({})) // true
```

**判断NaN更可靠的办法**

1. 使用isNaN判断类型

   ```js
   function myIsNaN(value) {
     return typeof value === 'number' && isNaN(value);
   }
   ```

2. 使用NaN不等于自身特点

   ```js
   function myIsNaN(value) {
     return value !== value;
   }
   ```

3. 使用Number.isNaN方法

   ```js
   Number.isNaN(NaN) // true
   Number.isNaN(15) // false
   Number.isNaN('15') // false
   ```

##### isFinite方法

`isFinite`方法返回一个布尔值，表示某个值是否为正常的数值。

```
isFinite(Infinity) // false
isFinite(-Infinity) // false
isFinite(NaN) // false
isFinite(undefined) // false
isFinite(null) // true
isFinite(-1) // true
```

除了`Infinity`、`-Infinity`、`NaN`和`undefined`这几个值会返回`false`，`isFinite`对于其他的数值都会返回`true`

#### 1.7 Number的静态方法

##### Number.isFinite()

检查一个数值是否为正常数值，如果参数的类型不是数值，则返回false

```js
Number.isFinite(15); // true
Number.isFinite(0.8); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite('foo'); // false
```

##### Number.isNaN()

检查一个值是否为`NaN`，参数类型不是`NaN`，`Number.isNaN`一律返回`false`

##### Number.parseInt()

跟全局中的parseInt()是一样的

##### Number.parseFloat() 

跟全局方法中的parseFloat是一样的

##### Number.isInteger()

判断一个数值是否为整数，avaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。所以**此方法不可靠**

```javascript
Number.isInteger(25) // true
Number.isInteger(25.0) // true
```

如果参数不是数值，`Number.isInteger`返回`false`。

```javascript
Number.isInteger() // false
Number.isInteger(null) // false
```

##### Number.isSafeInteger()

JavaScript 能够准确表示的整数范围在`-2^53`到`2^53`之间（不含两个端点），超过这个范围，无法精确表示这个值。ES6 引入了`Number.MAX_SAFE_INTEGER`和`Number.MIN_SAFE_INTEGER`这两个常量，用来表示这个范围的上下限。`Number.isSafeInteger()`则是用来判断一个整数是否落在这个范围之内。验证运算结果是否落在安全整数的范围内，不要只验证运算结果，而要同时验证参与运算的每个值。

```javascript
Number.isSafeInteger('a') // false
Number.isSafeInteger(null) // false
Number.isSafeInteger(NaN) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(-Infinity) // false
Number.isSafeInteger(3) // true
```

### 2. Math

#### 2.1 Math的静态属性

`Math`对象的静态属性，提供以下一些数学常数。

- `Math.E`：常数`e`。
- `Math.LN2`：2 的自然对数。
- `Math.LN10`：10 的自然对数。
- `Math.LOG2E`：以 2 为底的`e`的对数。
- `Math.LOG10E`：以 10 为底的`e`的对数。
- `Math.PI`：常数`π`。
- `Math.SQRT1_2`：0.5 的平方根。
- `Math.SQRT2`：2 的平方根。

#### 2.2 Math的静态方法

`Math`对象提供以下一些静态方法。

- `Math.abs()`：绝对值

  ```js
  Math.abs(1) // 1
  Math.abs(-1) // 1
  ```

- `Math.ceil()`：向上取整

- `Math.floor()`：向下取整

- `Math.trunc()` : 去除小数部分，只返回整数

  ```js
  Math.ceil(3.2) // 4
  Math.ceil(-3.2) // -3
  
  Math.floor(3.2) // 3
  Math.floor(-3.2) // -4
  // 返回一个数的整数部分 
  x < 0 ? Math.ceil(x) : Math.floor(x);
  
  // 获取整数部分
  Math.trunc(4.1) // 4
  Math.trunc(4.9) // 4
  Math.trunc(-4.1) // -4
  Math.trunc(-4.9) // -4
  // 对于非数值，Math.trunc内部使用Number方法将其先转为数值。
  Math.trunc('123.456') // 123
  Math.trunc(true) //1
  Math.trunc(false) // 0
  ```

- `Math.max()`：最大值

- `Math.min()`：最小值

  `Math.max`方法返回参数之中最大的那个值，`Math.min`返回最小的那个值。如果参数为空, `Math.min`返回`Infinity`, `Math.max`返回`-Infinity`。

  ```js
  Math.max(2, -1, 5) // 5
  Math.min(2, -1, 5) // -1
  Math.min() // Infinity
  Math.max() // -Infinity
  ```

- `Math.pow()`：幂运算

  Math.pow方法返回以第一个参数为底数、第二个参数为指数的幂运算值。

  ```js
  // 等同于 2 ** 2
  Math.pow(2, 2) // 4
  ```

- `Math.sqrt()`：平方根

  Math.sqrt方法返回参数值的平方根。如果参数是一个负值，则返回NaN

  ```js
  Math.sqrt(4) // 2
  Math.sqrt(-4) // NaN
  ```

- `Math.round()`：四舍五入

  ```js
  Math.round(0.1) // 0
  Math.round(0.5) // 1
  Math.round(0.6) // 1
  // 等同于
  Math.floor(x + 0.5)
  // 处理负数
  Math.round(-1.1) // -1
  Math.round(-1.5) // -1
  Math.round(-1.6) // -2
  ```

- `Math.random()`：随机数

  `Math.random()`返回0到1之间的一个伪随机数，可能等于0，但是一定小于1。

  ```js
  // 任意范围的随机数生成函数如下。
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  getRandomArbitrary(1.5, 6.5)
  ```


  ### 3.BigInt

  #### 3.1 Bigint类型由来和表示

  JavaScript 所有数字都保存成 64 位浮点数，这给数值的表示带来了两大限制。一是数值的精度只能到 53 个二进制位（相当于 16 个十进制位），大于这个范围的整数，JavaScript 是无法精确表示，这使得 JavaScript 不适合进行科学和金融方面的精确计算。二是大于或等于2的1024次方的数值，JavaScript 无法表示，会返回`Infinity`。

  BigInt 只用来表示整数，没有位数的限制，任何位数的整数都可以精确表示。

  为了与 Number 类型区别，BigInt 类型的数据必须添加后缀`n`。

  #### 3.2 BigInt()

   可以用它生成 BigInt 类型的数值。转换规则基本与`Number()`一致，将其他类型的值转为 BigInt。必须要有参数，参数必须要能正常转为数值，否则报错

  #### 3.3 BigInt的实例方法和静态方法

  BigInt 继承了 Object 对象的两个实例方法。

  - `BigInt.prototype.toString()`
  - `BigInt.prototype.valueOf()`

  它还继承了 Number 对象的一个实例方法。

  - `BigInt.prototype.toLocaleString()`

  此外，还提供了三个静态方法。

  `BigInt.asUintN(width, BigInt)`： 给定的 BigInt 转为 0 到 2width - 1 之间对应的值。
  `BigInt.asIntN(width, BigInt)`：给定的 BigInt 转为 -2width - 1 到 2width - 1 - 1 之间对应的值。
  `BigInt.parseInt(string[, radix])`：近似于`Number.parseInt()`，将一个字符串转换成指定进制的 BigInt。

  #### 3.4 BigInt转成其他类型

  可以使用`Boolean()`、`Number()`和`String()`这三个方法，将 BigInt 可以转为布尔值、数值和字符串类型。

  ```javascript
  Boolean(0n) // false
  Boolean(1n) // true
  Number(1n)  // 1
  String(1n)  // "1"
  ```

  上面代码中，注意最后一个例子，转为字符串时后缀`n`会消失。

  另外，取反运算符（`!`）也可以将 BigInt 转为布尔值。

  ```javascript
  !0n // true
  !1n // false
  ```