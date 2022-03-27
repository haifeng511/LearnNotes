## null, undefined 和布尔值知识点整理

[TOC]



### 1. Null和Undefined

`null`表示空值，即该处的值现在为空 	

`undefined`表示“未定义”

相同点：布尔值都是false，在==判断下是相等的

不同点：typeof 类型判断不同，null是object，undefined是undefined

### 2. Boolean

#### 2.1 布尔值定义

布尔值代表“真”和“假”两个状态。“真”用关键字`true`表示，“假”用关键字`false`表示。布尔值只有这两个值。布尔值往往用于程序流程的控制

下列运算符会返回布尔值：

- 前置逻辑运算符： `!` (Not)
- 相等运算符：`===`，`!==`，`==`，`!=`
- 比较运算符：`>`，`>=`，`<`，`<=`

#### 2.2 布尔值转换规则

除了下面六个值被转为`false`，其他值都视为`true`。

- `undefined`
- `null`
- `false`
- `0`
- `NaN`
- `""`或`''`（空字符串）

```js
Boolean(undefined) // false
Boolean(null) // false
Boolean(0) // false
Boolean(NaN) // false
Boolean('') // false
Boolean({}) // true
Boolean([]) // true
Boolean(new Boolean(false)) // true
```

#### 2.3 自动转换布尔值

如果 JavaScript 预期某个位置应该是布尔值，会将该位置上现有的值自动转为布尔值,例如`if`语句的条件部分

将表达式转换成布尔值，内部也是调用了Boolean()函数

```js
// 写法一
expression ? true : false

// 写法二
!! expression
```

