# axios工具函数

[TOC]



## 1. 前言

axios工具函数GitHub地址：https://github.com/axios/axios/blob/master/lib/utils.js

本文查看的版本是0.26.1

因为`axios`可以运行在浏览器和`node`环境中，所以内部会用到`nodejs`相关的知识，工具函数也有很多很多判断是否是Node.js中类的函数

## 2. 工具函数

### 2.1 初始定义

在看具体的函数之前，先看最开始定义的方法和变量

#### toString 

`Object.prototype.toString()` 方法返回一个表示该对象类型的字符串，将次函数赋值给变量toString,通过toString.call(thing)可以 获取对象的类型。返回字符串例子：[object String]，因此返回类型需要进行截取，从下标8到小标-1（左闭右开），负数代表倒数位置，最后转小写字符

#### kindOf 

`kindOf`是定义的一个立即执行函数，类型的小写字符串

分析：1.最外层是(fenction)(obj)，是立即执行函数的形式，传入一个空对象，原型为null

2.外层的函数里面是返回是一个函数，也就是闭包形式，cache在缓存中

3.通过toString.call(thing)获取thing的类型字符串str

4.如果cache对象中存在str，则直接取cache[str] 的值，否则将str进行截取，转小写字符，将结果存在cache对象中，并返回结果

例如：

传入的是thing是new Date)(),则执行后的cache对象是{ '[object Date]': 'date' }，返回的结果是： 'date' （这里是第一次的结果）

第二次传入new Array()，则执行后的cache对象是{ '[object Date]': 'date', '[object Array]': 'array' }，返回结果是'array' 

第三次传入new Array()，则执行后的cache对象是{ '[object Date]': 'date', '[object Array]': 'array' }，返回结果是'array' 

#### kindOfTest 

`kindOfTest`函数传入一个类型字符串，将此类型串转小写字母，也是一个闭包，返回结果是isKindOf函数

通过isKindOf传入thing进行判断该类型字符串是否是传入的类型字符串

例如：下文中的  isArrayBuffer = kindOfTest('ArrayBuffer')  ，这里isArrayBuffer值 是isKindOf函数，如果要判断一个对象是否是ArrayBuffer，需要传入thing参数，也就是调用ArrayBuffer(thing)

```js
// toString是获取对象类型的函数
var toString = Object.prototype.toString;

// kindOf用于获取类型的小写字母结果
// eslint-disable-next-line func-names
var kindOf = (function(cache) {
  // eslint-disable-next-line func-names
  return function(thing) {
    var str = toString.call(thing);
    return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
  };
})(Object.create(null));

// 判断是否是该类型 
function kindOfTest(type) {
  type = type.toLowerCase();
  return function isKindOf(thing) {
    return kindOf(thing) === type;
  };
}
```

### 2.2 协议

#### supportedProtocols 

```js
/**
 * Array with axios supported protocols.
 * 支持的协议数组
 */
var supportedProtocols = [ 'http:', 'https:', 'file:' ];

```

#### getProtocol 

```js

/**
 * Returns URL protocol passed as param if is not undefined or null,
 * otherwise just returns 'http:'
 * 获取协议，默认返回'http:'
 * @param {String} protocol The String value of URL protocol
 * @returns {String} Protocol if the value is not undefined or null
 */
function getProtocol(protocol) {
  return protocol || 'http:';
}

```

### 2.3 一般对象判断

#### isArray 

也可使用toString.call(val) === '[object Array]'进行判断

```js
/**
 * Determine if a value is an Array
 * 判断是否是数组
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return Array.isArray(val);
}
```

#### isUndefined 

```js


/**
 * Determine if a value is undefined
 * 判断是否是undefined
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}
```

#### isString

```js
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}
```

#### isNumber

```js
/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}
```

#### isObject

因为typeof null 的值是Object，所以判断是否是对象要排除null

````js

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}
````

#### isPlainObject

这里的纯对象是指： 用`{}`或`new Object()`创建的对象

这里跟Vue2中纯对象判断的不同，多了原型的判断

```js
/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (kindOf(val) !== 'object') {
    return false;
  }
// 原型的判断
  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}
```

#### isDate

也可使用toString.call(val) === '[object Date]'进行判断

```js
/**
 * Determine if a value is a Date
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
var isDate = kindOfTest('Date');
```

#### isFunction

```js
/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}
```

### 2.4 Node.js中类型判断

#### isBuffer 

Buffer类是专门创建存放二进制数据的缓存区

***这里因为对于Node了解比较少，不太懂为什么要进行这么多的判断，等Node.js知识补充后再调整***

```js
/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}
```

#### isArrayBuffer

```js
/**
 * Determine if a value is an ArrayBuffer
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
var isArrayBuffer = kindOfTest('ArrayBuffer');`
```

#### isArrayBufferView

````js
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (isArrayBuffer(val.buffer));
  }
  return result;
}
````

#### isFile

```js
/**
 * Determine if a value is a File
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFile = kindOfTest('File');
```

#### isBlob

```js
/**
 * Determine if a value is a Blob
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
var isBlob = kindOfTest('Blob');
```

#### isFileList

```js
/**
 * Determine if a value is a FileList
 *
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
var isFileList = kindOfTest('FileList');
```

#### isStream

```js
/**
 * Determine if a value is a Stream
 * 判断流
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}
```

### 2.5 其他类型判断

#### isFormData

```js
/**
 * Determine if a value is a FormData
 * 判断是否是FormData
 * @param {Object} thing The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(thing) {
  var pattern = '[object FormData]';
  return thing && (
    (typeof FormData === 'function' && thing instanceof FormData) ||
    toString.call(thing) === pattern ||
    (isFunction(thing.toString) && thing.toString() === pattern)
  );
}
```

#### isURLSearchParams

**`URLSearchParams`** 接口定义了一些实用的方法来处理 URL 的查询字符串，可查看MDN地址：https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams

URL查询字符串形式：paramsString = "q=URLUtils.searchParams&topic=api"

通过new URLSearchParams(paramsString)构造函数可以创建一个URLSearchParams

```js
/**
 * Determine if a value is a URLSearchParams object
 * @function
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
var isURLSearchParams = kindOfTest('URLSearchParams');
```

### 2.6 其他工具

#### trim

trim用于清除头尾的空格，新增方法可以只去除头部和尾部空格 trimStart()，trimEnd()

```js
/**
 * Trim excess whitespace off the beginning and end of a string
 * 清除空格
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

```

#### isStandardBrowserEnv

判断是否是标准环境

```js
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}
```

#### forEach

遍历对象或数组

forEach和for...in...以及for...of...都可进行遍历

```js
/**
 * 用函数进行数组和对象的遍历
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * 如果是数组，回调将会调用value, index, 和整个数组
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * 如果是对象，回调将会调用value, key, 和整个对象
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
   // 如果值不存在，无需处理
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

   // 如果不是对象类型，强制转成数组类型
  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
     // 是数组，for循环执行回调fn  
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // 是对象，for循环执行回调fn 
    // Iterate over object keys
    for (var key in obj) {
       // 只遍历可枚举属性
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}
```

#### merge

合并对象

```js
/**
 * 合并每个对象的属性，参数是一个个对象
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * 包含相同的键，参数会被后面的替换
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    // 如果不是纯对象，则递归
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
       // 纯对象，直接合并
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      // 如果是数组，返回原数组
      result[key] = val.slice();
    } else {
      // 其他值，直接合并
      result[key] = val;
    }
  }

  // 循环遍历每一个形参对象
  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}
```

#### extend

扩展属性

```js
/**
 * 通过可变地向对象a添加对象b的属性来扩展对象a。
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

```

***bind函数***

```js
module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};
```

#### stripBOM

删除UTF-8编码中BOM

所谓 BOM，全称是Byte Order Mark，它是一个Unicode字符，通常出现在文本的开头，用来标识字节序。UTF-8主要的优点是可以兼容ASCII，但如果使用BOM的话，这个好处就荡然无存了

***暂时没用到过***

```js
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}
```

#### inherits

将原型方法从一个构造函数继承到另一个构造函数

```js
/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 */

function inherits(constructor, superConstructor, props, descriptors) {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors);
  constructor.prototype.constructor = constructor;
  props && Object.assign(constructor.prototype, props);
}
```

#### toFlatObject

深度原型链对象解析为平面对象，也就是说不嵌套

```js
/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object 源对象
 * @param {Object} [destObj] 结果对象
 * @param {Function} [filter] 过滤
 * @returns {Object}
 */

function toFlatObject(sourceObj, destObj, filter) {
  var props;
  var i;
  var prop;
  var merged = {};

  destObj = destObj || {};

  do {
    // 获取源对象自身的属性数组
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      // 如果该属性没有添加，则添加，并标记已经添加
      if (!merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    // 查找源对象的原型并赋值给sourceObj
    sourceObj = Object.getPrototypeOf(sourceObj);
   // 如果原型存在 并且 （过滤函数不存在或者过滤函数返回值为真）并且 sourceObj不是纯对象 则继续进入循环
  } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);

  return destObj;
}

```

#### endsWith

判断字符串是否以指定字符结尾，ES6也有**endsWith**方法

```js
/*
 * determines whether a string ends with the characters of a specified string
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 * @returns {boolean}
 */
function endsWith(str, searchString, position) {
  str = String(str);
  if (position === undefined || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  var lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
}

```

#### toArray

类数组转数组，也可使用Array.form()

```js
/**
 * Returns new array from array like object
 * @param {*} [thing]
 * @returns {Array}
 */
function toArray(thing) {
  if (!thing) return null;
  var i = thing.length;
  if (isUndefined(i)) return null;
  var arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
}
```

#### isTypedArray

是否是类数组

这里也是使用了闭包，typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array)  是外面 的形参TypedArray

TypedArray的MDN文档地址：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypedArray

```js
// eslint-disable-next-line func-names
var isTypedArray = (function(TypedArray) {
  // eslint-disable-next-line func-names
  return function(thing) {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== 'undefined' && Object.getPrototypeOf(Uint8Array));

```



## 3. 小技巧

开源项目一般能在根目录下的`README.md`文件或`CONTRIBUTING.md`中找到贡献指南。贡献指南中说明了参与贡献代码的一些注意事项，比如：代码风格、代码提交注释格式、开发、调试等

在每一个`github`项目中的`url`里直接加上`1s`,就能在网页版`vscode`中查看源码，并且加载速度会更快例如：https://github1s.com/axios/axios/blob/HEAD/README.md