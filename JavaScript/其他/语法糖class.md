# ES6语法糖class

[TOC]

## 1. 概念

**ES6 的语法糖class(类)，可以看作构造函数的另一种写法**

实例的属性除非显式定义在其本身（即定义在`this`对象上），否则都是定义在原型上（即定义在`class`上）

类的所有方法都定义在类的`prototype`属性上面，但是类中所有定义的方法是不可枚举的，这跟ES5行为不一致

**传统的构造函数创建实例：**

```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () { // 可枚举
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);
```

**使用类创建实例：**

```javascript
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() { // 不可枚举
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var p = new Point(1, 2);
```



**类和构造函数是相等的**

```javascript
class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true
```



## 2. 类中的一些特性

### 2.1 取值函数（getter）和存值函数（setter）

与 ES5 一样，在“类”的内部可以使用`get`和`set`关键字，对某个属性设置存值函数和取值函数，拦截该属性的存取行为。

```javascript
class MyClass {
  constructor() {
    // ...
  }
  get prop() {
    return 'getter';
  }
  set prop(value) {
    console.log('setter: '+value);
  }
}

let inst = new MyClass();

inst.prop = 123;
// setter: 123

inst.prop
// 'getter'
```

### 2.2 属性表达式

类的属性名，可以采用表达式，下面代码中，`Square`类的方法名`getArea`，是从表达式得到的

```javascript
let methodName = 'getArea';

class Square {
  constructor(length) {
    // ...
  }

  [methodName]() {
    // ...
  }
}
```

### 2.3 Class 表达式

类也可以使用表达式的形式定义，但是这个值只能在类内部有效，指代当前类

```javascript
const MyClass = class Me {
  getClassName() {
    return Me.name;
  }
};
let inst = new MyClass();
inst.getClassName() // Me
Me.name // ReferenceError: Me is not defined
```

### 2.4 this 的指向

类的方法内部如果含有`this`，它默认指向类的实例。但是如果把这个方法提取出来单独使用，`this`会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是`undefined`）

```javascript
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

解决方案1：在构造方法中绑定`this`

解决方案2：使用箭头函数，箭头函数内部的`this`总是指向定义时所在的对象

```javascript
class Logger {
  constructor() {
    this.printName = this.printName.bind(this); // 方案1
    // this.printName = () => this; // 方案2
  }

  // ...
}
```

## 3. 类的继承

### 3.1 ES5和ES6继承的区别

ES5 的继承机制，是先创造一个独立的子类的实例对象，然后再将父类的方法添加到这个对象上面，即“实例在前，继承在后”

ES6 的继承机制，则是先将父类的属性和方法，加到一个空的对象上面，然后再将该对象作为子类的实例，即“继承在前，实例在后”

所以，ES6 的继承必须先调用`super()`方法，因为这一步会生成一个继承父类的`this`对象，没有这一步就无法继承父类

从子类上获取父类：Object.getPrototypeOf(obj) obj是子类，方法的返回结果是父类

### 3.2 super 关键字

**super可以当做函数用，也可以当做对象使用**

1.`super`作为函数调用时，代表父类的构造函数

```javascript
class A {}

class B extends A {
  constructor() {
    super();
  }
}
```

2.`super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类，静态方法内部的`this`指向当前的子类，而不是子类的实例

```javascript
// 普通方法
class A {
  p() {
    return 2;
  }
}

class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2
  }
}


// 静态方法
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```

### 3.3 类的 prototype 属性和__proto__属性

ES5 中，每一个对象都有`__proto__`属性，指向对应的构造函数的`prototype`属性

Class 作为构造函数的语法糖，同时有`prototype`属性和`__proto__`属性，因此同时存在两条继承链。

（1）子类的`__proto__`属性，表示构造函数的继承，总是指向父类。

（2）子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性。

```javascript
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

### 3.4 实例的 __proto__ 属性

子类实例的`__proto__`属性的`__proto__`属性，指向父类实例的`__proto__`属性。也就是说，子类的原型的原型，是父类的原型。

```javascript
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // t
```