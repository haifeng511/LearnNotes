# TypeScript基础

## 1. TypeScript简介

### 什么是 TypeScript

> Typed JavaScript at Any Scale.
> 添加了类型系统的 JavaScript，适用于任何规模的项目。

 TypeScript 的两个最重要的特性——类型系统、适用于任何规模

类型系统按照「类型检查的时机」来分类，可以分为动态类型和静态类型。

动态类型是指在运行时才会进行类型检查，这种语言的类型错误往往会导致运行时错误。JavaScript 是一门解释型语言[4]，没有编译阶段，所以它是动态类型

静态类型是指编译阶段就能确定每个变量的类型，这种语言的类型错误往往会导致语法错误。TypeScript 在运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查，所以 TypeScript 是静态类型

类型系统按照「是否允许隐式类型转换」来分类，可以分为强类型和弱类型

TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性，所以它们都是弱类型

Python 是强类型需要进行强制类型转换

**总结：**

- TypeScript 是添加了类型系统的 JavaScript，适用于任何规模的项目。
- TypeScript 是一门静态类型、弱类型的语言。
- TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性。
- TypeScript 可以编译为 JavaScript，然后运行在浏览器、Node.js 等任何能运行 JavaScript 的环境中。
- TypeScript 拥有很多编译选项，类型检查的严格程度由你决定。
- TypeScript 可以和 JavaScript 共存，这意味着 JavaScript 项目能够渐进式的迁移到 TypeScript。
- TypeScript 增强了编辑器（IDE）的功能，提供了代码补全、接口提示、跳转到定义、代码重构等能力。
- TypeScript 拥有活跃的社区，大多数常用的第三方库都提供了类型声明。
- TypeScript 与标准同步发展，符合最新的 ECMAScript 标准（stage 3）

## 2. TSC - TS编译器

- npm install -g typescript 安装ts编译器，执行成功之后可使用tsc命令
- 运行成功时，会在编译的`ts`文件下产生一个`js`文件；否则，报相关的错误
  - 错误时仍旧生成`JS`文件 -> `tsc --noEmitOnError  xxx.ts`
- 类型抹除：编译出来的`js`文件，会将TS的独有的代码删除
- 降级：TS会默认对`ECMAScript 2015`及以上的代码进行降级，默认转化为`ES3`
  - `tsc --target es2015 xxx.ts`指定版本
- TS赋予了用户调整代码检查的颗粒度
  - `"strict": true` 严格模式
  - `noImplicitAny: true` 当隐式类型被推断为`any`时，会抛出一个错误
  - `strictNullChecks: true` 选项会让我们更明确的处理 null 和 undefined，也会让我们免于忧虑是否忘记处理 null 和 undefine

## 3. 数据类型

### 3.1 基础原始类型

```ts
let str: string = "jimmy";
let num: number = 24;
let bool: boolean = false;
let u: undefined = undefined;
let n: null = null;
let obj: object = {x: 1};
let big: bigint = 100n;
let sym: symbol = Symbol("me"); 

let myName: string = 'Tom';
let myAge: number = 25;
// 模板字符串
let sentence: string = `Hello, my name is ${myName}`
```

#### 3.1.1 number、string、boolean、symbol、bigint

number是数值型

string是字符串类型，也可使用模板字符串

boolean是布尔值

symbol是独一无二的值

bigint是无位数限制的整数，数据后面要加上n

#### 3.1.2 null、undefined

`undefined` 和 `null` 是所有类型的子类型。也就是说 `undefined` 类型的变量，可以赋值给 `number` 类型的变量。而 `void` 类型的变量不能赋值给 `number` 类型的变量

如果在tsconfig.json指定了`"strictNullChecks":true` ，`null` 和 `undefined` 只能赋值给 `void` 和它们各自的类型

#### 3.1.3 object

object是对象类型

### 3.2 数组和函数

#### 3.2.1 Array

**数组声明**

第一种方式在元素类型后面接上 `[]`，表示由此类型元素组成的一个数组：

```ts
let list: number[] = [1, 2, 3];
```

第二种方式是使用数组泛型，`Array<元素类型>`：

```ts
let list: Array<number> = [1, 2, 3];
```

**类数组**

用接口定义类数组，常用的类数组都有自己的接口定义，如 `IArguments`, `NodeList`, `HTMLCollection` 等

```ts
interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}
```

#### 3.2.2 函数

**函数声明**

函数参数和函数返回值指定参数类型
```ts
function sum(x: number, y: number): number {
    return x + y;
}
```

 **函数表达式**

```ts
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};
```

**用接口定义函数类型**

采用函数表达式接口定义函数的方式时，对等号左侧进行类型限制，可以保证以后对函数名赋值时保证参数个数、参数类型、返回值类型不变

```ts
interface SearchFunc{
  (source: string, subString: string): boolean;
}
```

**可选参数**

可选参数采用在属性名后面紧跟一个?，可选参数后面不允许再出现必需参数

```ts
function buildName(firstName: string, lastName?: string) {
    if (lastName) {
        return firstName + ' ' + lastName;
    } else {
        return firstName;
    }
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```

**参数默认值**

默认值直接在参数声明之后直接赋值，跟js是一样的

```ts
function buildName(firstName: string, lastName: string = 'Cat') {
    return firstName + ' ' + lastName;
}
let tomcat = buildName('Tom', 'Cat');
let tom = buildName('Tom');
```
**剩余参数**

剩余参数采用...接收，跟js是一样的

```ts
function push(array: any[], ...items: any[]) {
    items.forEach(function(item) {
        array.push(item);
    });
}
let a = [];
push(a, 1, 2, 3);
```

**匿名函数**

当 TypeScript 知道一个匿名函数将被怎样调用的时候，匿名函数的参数会被自动的指定类型。尽管参数 s 并没有添加类型注解，但 TypeScript 根据 forEach 函数的类型，以及传入的数组的类型，最后推断出了 s 的类型，这个过程被称为上下文推断（contextual typing）

```ts
// No type annotations here, but TypeScript can spot the bug
const names = ["Alice", "Bob", "Eve"];
 
// Contextual typing for function
names.forEach(function (s) {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
 
// Contextual typing also applies to arrow functions
names.forEach((s) => {
  console.log(s.toUppercase());
  // Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
});
```

**重载**

重载允许一个函数接受不同数量或类型的参数时，作出不同的处理

下方代码，重复定义了多次函数 `reverse`，前几次都是函数定义，最后一次是函数实现

注意：TypeScript 会优先从最前面的函数定义开始匹配，所以多个函数定义如果有包含关系，需要优先把精确的定义写在前面

```ts
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string | void {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    } else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
```

### 3.3 特殊类型

#### 3.3.1 void

`void`表示没有任何类型，和其他类型是平等关系，不能直接赋值。只能为它赋予`null`和`undefined`（在`strictNullChecks`未指定为true时），一般用于函数没有返回值时声明。

有意思的是：方法没有返回值将得到`undefined`，但是我们需要定义成`void`类型，而不是`undefined`类型

```ts
function fun(): undefined {
  console.log("this is TypeScript");
};
fun(); // Error

function alertName(): void {
    alert('My name is Tom');
}
```

#### 3.3.2 never

表示值永远不存在的值类型

两种情况：函数执行抛出异常、函数进入死循环

使用 never 避免出现新增了联合类型没有对应的实现，目的就是写出类型绝对安全的代码

```ts
// 异常
function err(msg: string): never { // OK
  throw new Error(msg); 
}

// 死循环
function loopForever(): never { // OK
  while (true) {};
}
```

#### 3.3.3 any

在 TypeScript 中，任何类型都可以被归为 any 类型。这让 any 类型成为了类型系统的顶级类型.

如果是一个普通类型，在赋值过程中改变类型是不被允许的，但如果是 `any` 类型，则允许被赋值为任意类型，在any上访问任何属性都是允许的,也允许调用任何方法.

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型

#### 3.3.4 unknown

`unknown`与`any`一样，所有类型都可以分配给`unknown`:

```
let notSure: unknown = 4;
notSure = "maybe a string instead"; // OK
notSure = false; // OK
```

`unknown`与`any`的最大区别是： 任何类型的值可以赋值给`any`，同时`any`类型的值也可以赋值给任何类型。`unknown` 任何类型的值都可以赋值给它，但它只能赋值给`unknown`和`any`

### 3.4 内置对象类型

#### 3.4.1  ECMAScript 的内置对象

ECMAScript 标准提供的内置对象有：

`Boolean`、`Error`、`Date`、`RegExp` 等。

我们可以在 TypeScript 中将变量定义为这些类型

##### Number、String、Boolean、Symbol

Number、String、Boolean、Symbol 类型，后者是相应原始类型（ number、string、boolean、symbol）的`包装对象`

从类型兼容性上看，原始类型兼容对应的对象类型，反过来对象类型不兼容对应的原始类型

不要使用对象类型来注解值的类型，因为这没有任何意义

```ts
let num: number;
let Num: Number;
Num = num; // ok
num = Num; // ts(2322)报错  Number类型赋值给number
```

#####  object、Object 和 {}

小 object 代表的是所有非原始类型，也就是说我们不能把 number、string、boolean、symbol等 原始类型赋值给 object。在严格模式下，`null` 和 `undefined` 类型也不能赋给 object

大Object 代表所有拥有 toString、hasOwnProperty 方法的类型，所以所有原始类型、非原始类型都可以赋给 Object。同样，在严格模式下，null 和 undefined 类型也不能赋给 Object

{}空对象类型和大 Object 一样，也是表示原始类型和非原始类型的集合，并且在严格模式下，null 和 undefined 也不能赋给 {} 

**总结：**{}、大 Object 是比小 object 更宽泛的类型（least specific），{} 和大 Object 可以互相代替，用来表示原始类型（null、undefined 除外）和非原始类型；而小 object 则表示非原始类型

```ts
let lowerCaseObject: object;
lowerCaseObject = 1; // ts(2322)
lowerCaseObject = 'a'; // ts(2322)
lowerCaseObject = true; // ts(2322)
lowerCaseObject = null; // ts(2322)
lowerCaseObject = undefined; // ts(2322)
lowerCaseObject = {}; // ok

let upperCaseObject: Object;
upperCaseObject = 1; // ok
upperCaseObject = 'a'; // ok
upperCaseObject = true; // ok
upperCaseObject = null; // ts(2322)
upperCaseObject = undefined; // ts(2322)
upperCaseObject = {}; // ok


let ObjectLiteral: {};
ObjectLiteral = 1; // ok
ObjectLiteral = 'a'; // ok
ObjectLiteral = true; // ok
ObjectLiteral = null; // ts(2322)
ObjectLiteral = undefined; // ts(2322)
ObjectLiteral = {}; // ok
```

#### 3.4.2 DOM 和 BOM 的内置对象

`Document`、`HTMLElement`、`Event`、`NodeList` 等。

TypeScript 中会经常用到这些类型：

```ts
let body: HTMLElement = document.body;
let allDiv: NodeList = document.querySelectorAll('div');
document.addEventListener('click', function(e: MouseEvent) {
  // Do something
```

#### 3.4.3 TypeScript 核心库的定义文件

[TypeScript 核心库的定义文件](https://github.com/Microsoft/TypeScript/tree/master/src/lib)中定义了所有浏览器环境需要用到的类型，并且是预置在 TypeScript 中的。

当你在使用一些常用的方法的时候，TypeScript 实际上已经帮你做了很多类型判断的工作了

### 3.5 复杂类型

#### 3.5.1 元组 Tuple

**定义**

元组类型允许表示一个已知元素数量和类型的数组，各元素的类型不必相同。适合用于多值返回

```ts
let x: [string, number]; 
// 类型必须匹配且个数必须为2

x = ['hello', 10]; // OK 
x = ['hello', 10,10]; // Error 
x = [10, 'hello']; // Error
```

**解构赋值**

可以使用下标形式访问元组中的数据，也可以使用解构赋值形式

```ts
let employee: [number, string] = [1, "Semlinker"];
let [id, username] = employee;
console.log(`id: ${id}`); // id: 1
console.log(`username: ${username}`); // username: Semlinker
console.log(`id: ${employee[0]}`); // id: 1
console.log(`username: ${employee[1]}`); //username: Semlinker
```

**可选元素**

通过在元组类型后面添加?声明元组类型的可选元素

```ts
let optionalTuple: [string, boolean?]; // 包含一个必须的字符串属性和一个可选布尔属性
optionalTuple = ["Semlinker", true];
console.log(`optionalTuple : ${optionalTuple}`); //optionalTuple : Semlinker,true
optionalTuple = ["Kakuqo"];
console.log(`optionalTuple : ${optionalTuple}`); //optionalTuple : Kakuqo
```

**剩余元素**

元组类型里最后一个元素可以是剩余元素，形式为 `...X`，这里 `X` 是数组类型

```ts
type RestTupleType = [number, ...string[]]; //表示带有一个 number 元素和任意数量string 类型元素的元组类型
let restTuple: RestTupleType = [666, "Semlinker", "Kakuqo", "Lolo"];
console.log(restTuple[0]); // 666 
console.log(restTuple[1]); //Semlinker
console.log(restTuple[2]); //Kakuqo
console.log(restTuple[3]); //Lolo
console.log(restTuple[4]); //undefined
```

**只读元组类型**

元组类型加上 `readonly` 关键字前缀，以使其成为只读元组，只能进行读取操作，其他操作会报错

```ts
const point: readonly [number, number] = [10, 20];
```

#### 3.5.2 联合类型

联合类型表示取值可以为多种类型中的一种，使用 `|` 分隔每个类型。联合类型通常与 `null` 或 `undefined` 一起使用

当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，我们只能访问此联合类型的所有类型中**共有的属性或方法**

```ts
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven'; // OK
myFavoriteNumber = 7; // OK

const sayHello = (name: string | undefined) => {
  /* ... */
};
```

#### 3.5.3 类型别名

类型别名用来给一个类型起个新名字。类型别名常用于联合类型。

```js
type Message = string | string[];
let greet = (message: Message) => {
  // ...
};
```

#### 3.5.4 交叉类型

将多个类型合并为一个类型，包含了所需的所有类型的特性，使用`&`定义交叉类型

主要作用是将多个接口类型合并成一个类型，等同接口继承的效果

```ts
 type IntersectionType = { id: number; name: string; } & { age: number };
  const mixed: IntersectionType = {
    id: 1,
    name: 'name',
    age: 18
  }
```

#### 3.5.5 字面量类型

目前，TypeScript 支持 3 种字面量类型：字符串字面量类型、数字字面量类型、布尔字面量类型，对应的字符串字面量、数字字面量、布尔字面量分别拥有与其值一样的字面量类型

类型别名与字符串字面量类型都是使用 type 进行定义:

type Direction = 'up' | 'down';

```ts
interface Config {
    size: 'small' | 'big';
    isEnable:  true | false;
    margin: 0 | 2 | 4;
}
```

size 属性为字符串字面量类型 'small' | 'big'，isEnable 属性为布尔字面量类型 true | false（布尔字面量只包含 true 和 false，true | false 的组合跟直接使用 boolean 没有区别），margin 属性为数字字面量类型 0 | 2 | 4

#### 3.5.6 枚举类型

枚举（Enum）类型用于取值被限定在一定范围内的场景，比如一周只能有七天，颜色限定为红绿蓝等

**数字枚举**

枚举成员会被赋值为从 `0` 开始递增的数字，同时也会对枚举值到枚举名进行反向映射：

```ts
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days["Sun"] === 0); // true
console.log(Days["Mon"] === 1); // true
console.log(Days["Tue"] === 2); // true
console.log(Days["Sat"] === 6); // true

console.log(Days[0] === "Sun"); // true
console.log(Days[1] === "Mon"); // true
console.log(Days[2] === "Tue"); // true
console.log(Days[6] === "Sat"); // true
```

**字符串枚举**

```ts
enum Direction {
  NORTH = "NORTH",
  SOUTH = "SOUTH",
  EAST = "EAST",
  WEST = "WEST",
}
```

**常量枚举**

使用 `const` 关键字修饰的枚举，常量枚举会使用内联语法，不会为枚举类型编译生成任何 JavaScript

```typescript
const enum Direction {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

let dir: Direction = Direction.NORTH;
复制代码
```

以上代码对应的 ES5 代码如下：

```javascript
"use strict";
var dir = 0 /* NORTH */;
```

**异构枚举**

异构枚举的成员值是数字和字符串的混合

```ts
enum Enum {
  A,
  B,
  C = "C",
  D = "D",
  E = 8,
  F,
}
```

## 4. 类型拓展

### 4.1 类型推断

在很多情况下，TypeScript 会根据上下文环境自动推断出变量的类型，无须我们再写明类型注解。 这种基于赋值表达式推断类型的能力称之为`类型推断`

在 TypeScript 中，具有初始化值的变量、有默认值的函数参数、函数返回的类型都可以根据上下文推断出来

如果定义的时候没有赋值，不管之后有没有赋值，都会被推断成 `any` 类型而完全不被类型检查

```ts
 /** 根据参数的类型，推断出返回值的类型也是 number */
  function add1(a: number, b: number) {
    return a + b;
  }
  const x1= add1(1, 1); // 推断出 x1 的类型也是 number
  
  /** 推断参数 b 的类型是数字或者 undefined，返回值的类型也是数字 */
  function add2(a: number, b = 1) {
    return a + b;
  }
  const x2 = add2(1);
  const x3 = add2(1, '1'); 
// ts(2345) Argument of type "1" is not assignable to parameter of type 'number | undefined


// 定义时未赋值
let myFavoriteNumber;
myFavoriteNumber = 'seven';
myFavoriteNumber = 7;
```

### 4.2 类型断言

类型断言只会影响 TypeScript 编译时的类型，类型断言语句在编译结果中会被删除，类型断言并非是类型转换，不会影响变量的类型

**语法**

可使用尖括号语法（<类型>变量）和as语法（变量 as 类型）进行类型断言

但是尖括号格式会与react中JSX产生语法冲突，因此最好的方式还是使用as

```ts
// 尖括号 语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;

// as 语法
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

// 这里如果不使用as进行类型断言，会报错，在 TypeScript 看来，greaterThan2 的类型既可能是数字，也可能是 undefined
const arrayNumber: number[] = [1, 2, 3, 4];
const greaterThan2: number = arrayNumber.find(num => num > 2) as number;
```

**非空断言**

后缀表达式操作符 `!` 可以用于断言操作对象是非 null 和非 undefined 类型

```ts
let mayNullOrUndefinedOrString: null | undefined | string;
mayNullOrUndefinedOrString!.toString(); // ok 注意这里有个后缀！
mayNullOrUndefinedOrString.toString(); // 报错 ts(2531)
```

**确定赋值断言**

在实例属性和变量声明后面放置一个 `!` 号，从而告诉 TypeScript 该属性会被明确地赋值

```ts
let x!: number;
initialize();
console.log(2 * x); // Ok

function initialize() {
  x = 10;
}
```

**类型断言的限制**

若 `A` 兼容 `B`，那么 `A` 能够被断言为 `B`，`B` 也能被断言为 `A`。并不是任何一个类型都能被断言为另外一个类型

- 联合类型可以被断言为其中一个类型
- 父类可以被断言为子类
- 任何类型都可以被断言为 any
- any 可以被断言为任何类型

### 4.3 类型拓宽和缩小

**类型拓宽**

let 或 var 定义的变量、函数的形参、对象的非只读属性，如果满足指定了初始值且未显式添加类型注解的条件，那么它们推断出来的类型就是指定的初始值字面量类型拓宽后的类型，这就是字面量类型拓宽

```ts
  let str = 'this is string'; // 类型是 string
  let strFun = (str = 'this is string') => str; // 类型是 (str?: string) => string;
  const specifiedStr = 'this is string'; // 类型是 'this is string'  常量不可变，类型没有拓宽
  let str2 = specifiedStr; // 类型是 'string'
  let strFun2 = (str = specifiedStr) => str; // 类型是 (str?: string) => string;
```

**类型缩小**

通过某些操作将变量的类型由一个较为宽泛的集合缩小到相对较小、较明确的集合

```ts
 let func = (anything: any) => {
    if (typeof anything === 'string') {
      return anything; // 类型是 string 
    } else if (typeof anything === 'number') {
      return anything; // 类型是 number
    }
    return null;
  };
```

## 5. 类型守卫

类型保护（类型守卫）是可执行运行时检查的一种表达式，用于确保该类型在一定的范围内

### 5.1 in 关键字

```ts
 if ("privileges" in emp) {
    console.log("Privileges: " + emp.privileges);
  }
```

### 5.2 typeof 关键字 

```js
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
      return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
      return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

### 5.3 instanceof 关键字

```ts
if (padder instanceof SpaceRepeatingPadder) {
  // padder的类型收窄为 'SpaceRepeatingPadder'
}
```

### 5.4 自定义类型保护

```ts
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}
```

