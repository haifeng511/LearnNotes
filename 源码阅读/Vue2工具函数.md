## Vue2工具函数源码阅读笔记

[TOC]

### 1.起步

#### 1.1 如何查看源码

vue源码的github地址：https://github.com/vuejs/vue

Vue2工具函数源码目录在：vue/src/shared/util.js 

用`github1s`访问，速度更快：[github1s vue/vue/src/shared](https://link.juejin.cn/?target=https%2A%2F%2Fgithub1s.com%2Fvuejs%2Fvue%2Fblob%2Fdev%2Fsrc%2Fshared%2Futil.js)

因为源码中util.js使用了flow类型（未学）

Flow是JavaScript的类型检查器，Vue.js 的源码利用了Flow 做了静态类型检查，能立刻检测代码变化，在开发 JS 时提供快速不断地反馈

本文学习源码仓库中的[打包后的 dist/vue.js 14行到279行](https://github.com/vuejs/vue/blob/dev/dist/vue.js)

#### 1.2 需要的知识点

JS基本数据类型了解

闭包

原型

正则表达式

apply、bind

### 2.工具函数

#### 2.1 emptyObject

```js
  /* 
   	冻结一个空对象，Object.freeze()冻结的对象不能增、删、改属性
  */
  var emptyObject = Object.freeze({});
```

#### 2.2 isUndef 是否是未定义

```js
function isUndef (v) {
  return v === undefined || v === null
}
```

#### 2.2 isDef 是否是已经定义

`JavaScript`中假值有六个，分别是null、undefined、NaN、0、''、false

利用不是undefined，也不是null进行判断变量是否已经定义，而不是直接判断真假值

```js
function isDef (v) {
  return v !== undefined && v !== null
}
```

#### 2.4 isTrue 是否是 true

```js
function isTrue (v) {
  return v === true
}
```

#### 2.5 isFalse 是否是 false

```js
function isFalse (v) {
  return v === false
}
```

#### 2.6 isPrimitive 判断值是否是原始值

判断是否是字符串、或者数字、或者 **symbol**、或者布尔值。

```js
/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}
```

#### 2.7 isObject 判断是对象

 `typeof null` 是 'object'，所以不能使用typeof判断是否是对象，而是要不是null而且typeof的值是'object'

```js
/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}
```

#### 2.8 toRawType 转换成原始类型

`Object.prototype.toString()` 方法返回一个表示该对象类型的字符串

返回字符串例子：[object String]，因此返回类型需要进行截取，从下标8到小标-1（左闭右开），负数代表倒数位置

```js
/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

// 例子：
toRawType('') // 'String'
toRawType() // 'Undefined'
```

#### 2.9 isPlainObject 是否是纯对象

纯对象意味着不是数组也不是函数等对象，而是简单的对象

```js
/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}
// 例子：
isPlainObject([]) // false
isPlainObject({}) // true
```

#### 2.10 isRegExp 是否是正则表达式

```js
function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}
```

#### 2.11 isValidArrayIndex 是否是可用的数组索引值

数组可用的索引值是 0 ('0')、1 ('1') 、2 ('2') 这样的值，全局方法`isFinite()` 是用来判断是否是一个有限数值（不是NaN、Infinity这种）

将val值先转成String，再使用parseFloat，可以获得val的数值n，接着判断n大于0并且向下取整等于n本身说明是整数

isFinite()判断的值是val,是进行判断val是不是正常数值，如果不是正常数值会返回false，因为参数接受的是Number类型，所以会进行Number类型转换，'11#'这种类型的值不可以，会转换成NaN

总结：

isFinite（Number(val)）判断的是val是否是数值或者数值字符串，因为Number()函数会将null、''、false转成0，true转成1,所以这几个要规避

parseFloat(String(val))可以规避null、false、true、'',这几个值都会转成NaN，通过此方法获得val的数值n

通过是否大于0和向下取整是否等于本身来判断是否是正整数

```js
/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}
```

#### 2.12 isPromise 判断是否是 promise

判断是否定义了（不是null和undefined），val.then 和val.catch是否是函数

```js
function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
```

#### 2.12 toString 转字符串

转换成字符串。是数组或者对象并且对象的 `toString` 方法是 `Object.prototype.toString`，用 `JSON.stringify` 转换

JSON.stringify(val, null, 2)是将val值转成字符串，null代表所有属性都被转换，2是缩进使用的空白字符，用于美化输出，具体可查看[JSON.stringif() MDN介绍](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)

```
这里的_toString 是Object.prototype.toString，也就是说这个纯对象没有定义自己的toString()方法，_toString的值是'[object Object]'
Array是自己有定义toString()方法的，是返回数值元素的字符串，以逗号分割，例如:[1,2,2].toString()是'1,2,2'
而采用toString([1,2,2])之后是
'[
  1,
  2,
  2
]'
```

```js
/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}
```

#### 2.14 toNumber 转数字

使用parseFloat转换成数字，如果第一个字符不是数值转换失败依旧返回原始字符串，如果是前面的是数值后面是其他字符，则返回前面的数值，感觉存在弊端

```js
/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}
```

#### 2.15 makeMap 生成一个 map （对象）

传入一个以逗号分隔的字符串，生成一个 `map`(键值对)，并且返回一个函数检测 `key` 值在不在这个 `map` 中。第二个参数是小写选项。

这个方法应该是跟下面的方法isBuiltInTag 、isReservedAttribute 配合使用

```js
/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);  // 没有原型链的空对象
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

// 例子
let mapfunc = makeMap('a,b,c', true);
console.log(mapfunc('B')); // true
console.log(mapfunc('b')); // true
console.log(mapfunc('d')); // undefined
```

#### 2.16 isBuiltInTag 是否是内置的 tag

```js
/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

// 返回的函数，第二个参数不区分大小写
isBuiltInTag('slot') // true
isBuiltInTag('component') // true
isBuiltInTag('Slot') // true
isBuiltInTag('Component') // true
```

#### 2.17 isReservedAttribute 是否是保留的属性

```js
/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

isReservedAttribute('key') // true
isReservedAttribute('ref') // true
isReservedAttribute('slot') // true
isReservedAttribute('slot-scope') // true
isReservedAttribute('is') // true
isReservedAttribute('IS') // undefined
```

#### 2.18 remove 移除数组中的中一项

通过找到数组元素的位置，再使用splice方法进行移除，第一个参数是数组元素的下标，第二个参数是要移除的个数

```js
/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
```

`splice` 其实是一个很耗性能的方法，删除数组中的一项，其他元素都要移动位置。

[`axios InterceptorManager` 拦截器源码](https://github.com/axios/axios/blob/master/lib/core/InterceptorManager.js) 中，拦截器用数组存储的。但实际移除拦截器时，只是把拦截器置为 `null` 。而不是用`splice`移除。最后执行时为 `null` 的不执行

因为拦截器是用户自定义的，考虑到了数组元素很多的情况，在性能方面优化比较好，控制拦截器为null，而不是直接删除，移动位置

看如下 `axios` 拦截器代码示例：

```js
// 代码有删减
// 声明
this.handlers = [];

// 移除
if (this.handlers[id]) {
    this.handlers[id] = null;
}
// 循环调用，判断元素不为空的时候就执行
utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
```

#### 2.19 hasOwn 检测是否是自己的属性

```js
/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

// 例子：
// 原型相关的API
// Object.getPrototypeOf
// Object.setPrototypeOf
// Object.isPrototypeOf

// .call 则是函数里 this 显示指定以为第一个参数，并执行函数。

hasOwn({__proto__: { a: 1 }}, 'a') // false  __proto__ 是浏览器实现的原型写法但是目前在获取原型对象上是建议弃用的
hasOwn({ a: undefined }, 'a') // true
hasOwn({}, 'a') // false
hasOwn({}, 'hasOwnProperty') // false
hasOwn({}, 'toString') // false
// 是自己的本身拥有的属性，不是通过原型链向上查找的。
```

#### 2.20 cached 缓存

利用闭包特性，缓存数据，这地方不太懂，这个||的关系

```js
/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}
```

#### 2.21 camelize 连字符转小驼峰

连字符 - 转驼峰  on-click => onClick

```js
/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});
```

#### 2.22 capitalize 首字母转大写

首字母转大写，将首字母进行大写，再拼接剩下的字符

```js
/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});
```

#### 2.22 hyphenate 小驼峰转连字符

onClick => on-click

```js
/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});
```

#### 2.24 polyfillBind bind 的垫片

```js
/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;
```

简单来说就是兼容了老版本浏览器不支持原生的 `bind` 函数。同时兼容写法，对参数的多少做出了判断，使用`call`和`apply`实现，据说参数多适合用 `apply`，少用 `call` 性能更好。

#### 2.25 toArray 把类数组转成真正的数组

把类数组转换成数组，支持从哪个位置开始，默认从 0 开始

Array.form()方法也能实现将类数组转换成数组

```js
/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

// 例子：
function fn(){
  var arr1 = toArray(arguments);
  console.log(arr1); // [1, 2, 2, 4, 5]
  var arr2 = toArray(arguments, 2);
  console.log(arr2); // [2, 4, 5]
}
fn(1,2,2,4,5);
```

#### 2.26 extend 合并

接收两个对象，将_from对象中的属性，复制到to对象中，如果有重复的属性则使用form对象中的属性值

执行函数后，extend返回的对象和to对象是相等的

Object.assign(target, source)也是对象的合并，可合并多个对象，返回目标对象，是浅拷贝

```js
/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}
```

#### 2.27 toObject 数组转对象

```js
/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}
```

#### 2.28 noop 空函数

```js
/* eslint-disable no-unused-vars */
/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

// 初始化赋值
```

#### 2.29 no 一直返回 false

```js
/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };
/* eslint-enable no-unused-vars */
```

#### 2.20 identity 返回参数本身

```js
/**
 * Return the same value.
 */
var identity = function (_) { return _; };
```

#### 2.21 genStaticKeys 生成静态属性

```js
/**
 * Generate a string containing static keys from compiler modules.
 */
function genStaticKeys (modules) {
  return modules.reduce(function (keys, m) {
    return keys.concat(m.staticKeys || [])
  }, []).join(',')
}
```

#### 2.22 looseEqual 宽松相等

由于数组、对象等是引用类型，所以两个内容看起来相等，严格相等都是不相等。

```js
var a = {};
var b = {};
a === b; // false
a == b; // false
```

所以该函数是对数组、日期、对象进行递归比对。如果内容完全相等则宽松相等。

```js
/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a); // isObject判断了不是null和undefined
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) { // 判断数组内容是否相等
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) { // 判断日期内容是否相等
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) { // 判断两个内容的对象是否相等
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}
```

#### 2.22 looseIndexOf 宽松的 indexOf

该函数实现的是宽松相等。原生的 `indexOf` 是严格相等。

```js
/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}
```

#### 2.24 once 确保函数只执行一次

利用闭包特性，存储状态，无论函数怎么调用，只执行一次

```js
/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}
```

#### 2.25 生命周期等

```js
var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];
```

### 3. 参考资源

[若川源码共读Vue2工具函数](https://juejin.cn/post/7024276020731592741)

[GitHub本文学习内容地址](https://github.com/vuejs/vue/blob/dev/dist/vue.js)