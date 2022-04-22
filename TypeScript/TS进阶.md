# TypeScript进阶内容

## 1. 接口

接口是定义对象的另外一种方式

赋值时，变量的参数必须符合接口定义的参数，不能缺少、增加属性

### 1.1 接口中的属性

接口中有一般属性、可选属性、只读属性、任意属性

只读的约束存在于第一次给对象赋值的时候，而不是第一次给只读属性赋值的时候

一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集。一个接口中只能定义一个任意属性。如果接口中有多个类型的属性，则可以在任意属性中使用联合类型

```ts
interface Person {
  name: string; // 一般属性
  readonly age: number; // 只读属性
  gender?: string // 可选属性
  [propName: string]: any;   // 任意属性
}
```

### 1.2 鸭式辨型法

鸭式辨型法，即具有鸭子特征的认为它就是鸭子，也就是通过制定规则来判定对象是否实现这个接口

```ts
interface LabeledValue {
  label: string;
}
function printLabel(labeledObj: LabeledValue) {
  console.log(labeledObj.label);
}
let myObj = { size: 10, label: "Size 10 Object" };
printLabel(myObj); // OK 因为都具有label属性，所以被认定为两个相同,采用鸭式辨型法绕开多余的类型检查
printLabel({ size: 10, label: "Size 10 Object" }); // Error 在参数里写对象就相当于是直接给labeledObj赋值，这个对象有严格的类型定义，所以不能多参或少参
```

## 2. 类

### 2.1 类的简单介绍

- 类（Class）：定义了一件事物的抽象特点，包含它的属性和方法
- 对象（Object）：类的实例，通过 `new` 生成
- 面向对象（OOP）的三大特性：封装、继承、多态
- 封装（Encapsulation）：将对数据的操作细节隐藏起来，只暴露对外的接口。外界调用端不需要（也不可能）知道细节，就能通过对外提供的接口来访问该对象，同时也保证了外界无法任意更改对象内部的数据
- 继承（Inheritance）：子类继承父类，子类除了拥有父类的所有特性外，还有一些更具体的特性
- 多态（Polymorphism）：由继承而产生了相关的不同的类，对同一个方法可以有不同的响应。比如 `Cat` 和 `Dog` 都继承自 `Animal`，但是分别实现了自己的 `eat` 方法。此时针对某一个实例，我们无需了解它是 `Cat` 还是 `Dog`，就可以直接调用 `eat` 方法，程序会自动判断出来应该如何执行 `eat`
- 存取器（getter & setter）：用以改变属性的读取和赋值行为
- 修饰符（Modifiers）：修饰符是一些关键字，用于限定成员或类型的性质。比如 `public` 表示公有属性或方法
- 抽象类（Abstract Class）：抽象类是供其他类继承的基类，抽象类不允许被实例化。抽象类中的抽象方法必须在子类中被实现
- 接口（Interfaces）：不同类之间公有的属性或方法，可以抽象成一个接口。接口可以被类实现（implements）。一个类只能继承自另一个类，但是可以实现多个接口

### 2.2 ES6 中类的用法

使用 `class` 定义类，使用 `constructor` 定义构造函数

通过 `new` 生成新实例的时候，会自动调用构造函数

使用 `extends` 关键字实现继承，子类中使用 `super` 关键字来调用父类的构造函数和方法

使用 getter 和 setter 可以改变属性的赋值和读取行为

使用 `static` 修饰符修饰的方法称为静态方法，它们不需要实例化，而是直接通过类来调用

### 2.3 TypeScript 中类的用法

#### 2.3.1 public private 和 protected

TypeScript 可以使用三种访问修饰符（Access Modifiers），分别是 `public`、`private` 和 `protected`。

- `public` 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 `public` 的
- `private` 修饰的属性或方法是私有的，不能在声明它的类的外部访问
- `protected` 修饰的属性或方法是受保护的，它和 `private` 类似，区别是它在子类中也是允许被访问的

#### 2.3.2 抽象类

`abstract` 用于定义抽象类和其中的抽象方法

抽象类是不允许被实例化。抽象类中的抽象方法必须被子类实现

## 3. 泛型

### 3.1 泛型了解

#### 3.1.1 泛型定义

泛型（Generics）是指在定义函数、接口或类的时候，不预先指定具体的类型，而在使用的时候再指定类型的一种特性

#### 3.1.2 简单例子

 `T` 代表 **Type**，在定义泛型时通常用作第一个类型变量名称。但实际上 `T` 可以用任何有效名称代替。除了 `T` 之外，以下是常见泛型变量代表的意思：

- K（Key）：表示对象中的键类型；
- V（Value）：表示对象中的值类型；
- E（Element）：表示元素类型

```ts
function createArray<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
createArray<string>(3, 'x'); // ['x', 'x', 'x']
```

#### 3.1.3 多类型参数

定义泛型的时候，可以一次定义多个类型参数：

```ts
function swap<T, U>(tuple: [T, U]): [U, T] {
    return [tuple[1], tuple[0]];
}

swap([7, 'seven']); // ['seven', 7]
```

#### 3.1.4 泛型约束

泛型约束是限制T的类型，简单来说就是定义一个类型，然后让 T 实现这个接口

```ts
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}
```

#### 3.1.5 泛型接口

在使用泛型接口的时候，需要定义泛型的类型

```ts
interface CreateArrayFunc<T> {
    (length: number, value: T): Array<T>;
}

let createArray: CreateArrayFunc<any>; // 这里定义泛型的类型
createArray = function<T>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}

createArray(3, 'x'); // ['x', 'x', 'x']
```

#### 3.1.6 泛型类

与泛型接口一样，在使用泛型类时，需要定义泛型的类型

```ts
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

#### 3.1.7 泛型参数的默认类型

当使用泛型时没有在代码中直接指定类型参数，从实际值参数中也无法推测出时，这个默认类型就会起作用。

```ts
function createArray<T = string>(length: number, value: T): Array<T> {
    let result: T[] = [];
    for (let i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
```

### 3.2 泛型工具

**相关基础知识**

typeof

typeof 的主要用途是在类型上下文中获取变量或者属性的类型

```ts
interface Person {
  name: string;
  age: number;
}
const sem: Person = { name: "semlinker", age: 30 };
type Sem = typeof sem; // type Sem = Person
```

keyof

用于获取某种类型的所有键，其返回类型是联合类型

```ts
interface Person {
  name: string;
  age: number;
}

type K1 = keyof Person; // "name" | "age"
type K2 = keyof Person[]; // "length" | "toString" | "pop" | "push" | "concat" | "join" 
type K3 = keyof { [x: string]: Person };  // string | number
```

in

in用来遍历枚举类型

```ts
type Keys = "a" | "b" | "c"

type Obj =  {
  [p in Keys]: any
} // -> { a: any, b: any, c: any }
```

infer

在条件类型语句中，可以用 `infer` 声明一个类型变量并且对它进行使用。

```js
type ReturnType<T> = T extends (
  ...args: any[]
) => infer R ? R : any;
```

以上代码中 `infer R` 就是声明一个变量来承载传入函数签名的返回值类型，简单说就是用它取到函数返回值的类型方便之后使用。

extends

泛型约束

```ts
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}
```

索引类型

在对象中获取一些属性的值，然后建立对应的集合。

```js
let person = {
    name: 'musion',
    age: 35
}

function getValues(person: any, keys: string[]) {
    return keys.map(key => person[key])
}

console.log(getValues(person, ['name', 'age'])) // ['musion', 35]
console.log(getValues(person, ['gender'])) // [undefined]
```

映射类型

根据旧的类型创造出新的类型

比如我们定义一个接口

```js
interface TestInterface{
    name:string,
    age:number
}
```

我们把上面定义的接口里面的属性全部变成可选

```js
// 我们可以通过+/-来指定添加还是删除

type OptionalTestInterface<T> = {
  [p in keyof T]+?:T[p]
}

type newTestInterface = OptionalTestInterface<TestInterface>
// type newTestInterface = {
//    name?:string,
//    age?:number
// }
```

比如我们再加上只读

```js
type OptionalTestInterface<T> = {
 +readonly [p in keyof T]+?:T[p]
}

type newTestInterface = OptionalTestInterface<TestInterface>
// type newTestInterface = {
//   readonly name?:string,
//   readonly age?:number
// }
```

#### Partial

Partial<T> 将类型的属性变成可选

```js
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

在以上代码中，首先通过 `keyof T` 拿到 `T` 的所有属性名，然后使用 `in` 进行遍历，将值赋给 `P`，最后通过 `T[P]` 取得相应的属性值的类。中间的 `?` 号，用于将所有属性变为可选。但是 Partial<T> 有个局限性，就是只支持处理第一层的属性，如果是多层需要自己实现

```js
type NewUserInfo = Partial<UserInfo>;
const xiaoming: NewUserInfo = {
    name: 'xiaoming'
}
```

这个  NewUserInfo 就相当于

```js
interface NewUserInfo {
    id?: string;
    name?: string;
}
```

多层可选实现:

```ts
type DeepPartial<T> = {
     // 如果是 object，则递归类型
    [U in keyof T]?: T[U] extends object
      ? DeepPartial<T[U]>
      : T[U]
};

type PartialedWindow = DeepPartial<T>; // 现在T上所有属性都变成了可选啦

```

#### Required

Required将类型的属性变成必选，其中 `-?` 是代表移除 `?`

```js
type Required<T> = { 
    [P in keyof T]-?: T[P] 
};
```

#### Readonly

Readonly<T> 的作用是将某个类型所有属性变为只读属性，也就意味着这些属性不能被重新赋值。

```js
type Readonly<T> = {
 readonly [P in keyof T]: T[P];
};

```

举例

```js
interface Todo {
 title: string;
}

const todo: Readonly<Todo> = {
 title: "Delete inactive users"
};

todo.title = "Hello"; // Error: cannot reassign a readonly property
```

#### Pick

Pick 从某个类型中挑出一些属性出来

```js
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
```

举例说明

```js
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

// todo中只有title和completed属性，没有description属性，如果添加会报错
const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

#### Record

`Record<K extends keyof any, T>` 的作用是将 `K` 中所有的属性的值转化为 `T` 类型

```
type Record<K extends keyof any, T> = {
    [P in K]: T;
};
```

```ts
interface PageInfo {
  title: string;
}

type Page = "home" | "about" | "contact";

const x: Record<Page, PageInfo> = {
  about: { title: "about" },
  contact: { title: "contact" },
  home: { title: "home" },
};
```

#### ReturnType

用来得到一个函数的返回值类型

定义

```js
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```

`infer`在这里用于提取函数类型的返回值类型。`ReturnType<T>` 只是将 infer R 从参数位置移动到返回值位置，因此此时 R 即是表示待推断的返回值类型。

举例说明

```js
type Func = (value: number) => string;
const foo: ReturnType<Func> = "1";
```

`ReturnType`获取到 `Func` 的返回值类型为 `string`，所以，`foo` 也就只能被赋值为字符串了。

#### Exclude

`Exclude<T, U>` 的作用是将某个类型中属于另一个的类型移除掉

定义

```js
type Exclude<T, U> = T extends U ? never : T;
```

如果 `T` 能赋值给 `U` 类型的话，那么就会返回 `never` 类型，否则返回 `T` 类型。最终实现的效果就是将 `T` 中某些属于 `U` 的类型移除掉。

举例说明

```js
type T0 = Exclude<"a" | "b" | "c", "a">; // "b" | "c"
type T1 = Exclude<"a" | "b" | "c", "a" | "b">; // "c"
type T2 = Exclude<string | number | (() => void), Function>; // string | number
```

#### Extract

`Extract<T, U>` 的作用是从 `T` 中提取出 `U`

定义

```js
type Extract<T, U> = T extends U ? T : never;
```

举例说明

```js
type T0 = Extract<"a" | "b" | "c", "a" | "f">; // "a"
type T1 = Extract<string | number | (() => void), Function>; // () =>void
```

#### Omit

`Omit<T, K extends keyof any>` 的作用是使用 `T` 类型中除了 `K` 类型的所有属性，来构造一个新的类型

定义

```js
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

举例说明

```js
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};
```

#### NonNullable

`NonNullable<T>` 的作用是用来过滤类型中的 `null` 及 `undefined` 类型。

定义

```js
type NonNullable<T> = T extendsnull | undefined ? never : T;
```

举例说明

```js
type T0 = NonNullable<string | number | undefined>; // string | number
type T1 = NonNullable<string[] | null | undefined>; // string[]
```

#### Parameters

`Parameters<T>` 的作用是用于获得函数的参数类型组成的元组类型。

定义

```js
type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any
? P : never;
```

举例说明

```js
type A = Parameters<() =>void>; // []
type B = Parameters<typeofArray.isArray>; // [any]
type C = Parameters<typeofparseInt>; // [string, (number | undefined)?]
type D = Parameters<typeofMath.max>; // number[]
```

## 4. tsconfig.json

### 4.1 tsconfig.json介绍

tsconfig.json 是 TypeScript 项目的配置文件。如果一个目录下存在一个 tsconfig.json 文件，那么往往意味着这个目录就是 TypeScript 项目的根目录。

tsconfig.json 包含 TypeScript 编译的相关配置，通过更改编译配置项，我们可以让 TypeScript 编译出 ES6、ES5、node 的代码。

### 4.2 tsconfig.json 重要字段

- files - 设置要编译的文件的名称；
- include - 设置需要进行编译的文件，支持路径模式匹配；
- exclude - 设置无需进行编译的文件，支持路径模式匹配；
- compilerOptions - 设置与编译流程相关的选项。

### 4.3 compilerOptions 选项

```js
{
  "compilerOptions": {
  
    /* 基本选项 */
    "target": "es5",                       // 指定 ECMAScript 目标版本: 'ES3' (default), 'ES5', 'ES6'/'ES2015', 'ES2016', 'ES2017', or 'ESNEXT'
    "module": "commonjs",                  // 指定使用模块: 'commonjs', 'amd', 'system', 'umd' or 'es2015'
    "lib": [],                             // 指定要包含在编译中的库文件
    "allowJs": true,                       // 允许编译 javascript 文件
    "checkJs": true,                       // 报告 javascript 文件中的错误
    "jsx": "preserve",                     // 指定 jsx 代码的生成: 'preserve', 'react-native', or 'react'
    "declaration": true,                   // 生成相应的 '.d.ts' 文件
    "sourceMap": true,                     // 生成相应的 '.map' 文件
    "outFile": "./",                       // 将输出文件合并为一个文件
    "outDir": "./",                        // 指定输出目录
    "rootDir": "./",                       // 用来控制输出目录结构 --outDir.
    "removeComments": true,                // 删除编译后的所有的注释
    "noEmit": true,                        // 不生成输出文件
    "importHelpers": true,                 // 从 tslib 导入辅助工具函数
    "isolatedModules": true,               // 将每个文件做为单独的模块 （与 'ts.transpileModule' 类似）.

    /* 严格的类型检查选项 */
    "strict": true,                        // 启用所有严格类型检查选项
    "noImplicitAny": true,                 // 在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true,              // 启用严格的 null 检查
    "noImplicitThis": true,                // 当 this 表达式值为 any 类型的时候，生成一个错误
    "alwaysStrict": true,                  // 以严格模式检查每个模块，并在每个文件里加入 'use strict'

    /* 额外的检查 */
    "noUnusedLocals": true,                // 有未使用的变量时，抛出错误
    "noUnusedParameters": true,            // 有未使用的参数时，抛出错误
    "noImplicitReturns": true,             // 并不是所有函数里的代码都有返回值时，抛出错误
    "noFallthroughCasesInSwitch": true,    // 报告 switch 语句的 fallthrough 错误。（即，不允许 switch 的 case 语句贯穿）

    /* 模块解析选项 */
    "moduleResolution": "node",            // 选择模块解析策略： 'node' (Node.js) or 'classic' (TypeScript pre-1.6)
    "baseUrl": "./",                       // 用于解析非相对模块名称的基目录
    "paths": {},                           // 模块名到基于 baseUrl 的路径映射的列表
    "rootDirs": [],                        // 根文件夹列表，其组合内容表示项目运行时的结构内容
    "typeRoots": [],                       // 包含类型声明的文件列表
    "types": [],                           // 需要包含的类型声明文件名列表
    "allowSyntheticDefaultImports": true,  // 允许从没有设置默认导出的模块中默认导入。

    /* Source Map Options */
    "sourceRoot": "./",                    // 指定调试器应该找到 TypeScript 文件而不是源文件的位置
    "mapRoot": "./",                       // 指定调试器应该找到映射文件而不是生成文件的位置
    "inlineSourceMap": true,               // 生成单个 soucemaps 文件，而不是将 sourcemaps 生成不同的文件
    "inlineSources": true,                 // 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性

    /* 其他选项 */
    "experimentalDecorators": true,        // 启用装饰器
    "emitDecoratorMetadata": true          // 为装饰器提供元数据的支持
  }
}

```





