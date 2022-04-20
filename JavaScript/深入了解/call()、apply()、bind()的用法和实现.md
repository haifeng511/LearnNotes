## call()、apply()、bind()的用法与实现



### 用法

call()、apply()、bind() 都是用来重定义 this 这个对象的

bind 返回的是一个新的函数，你必须调用它（后面加括号）才会被执行

call()、apply()、bind() 这三个函数的第一个参数都是 this 的指向对象，第二个参数有差别

call参数是直接放进去的，第二第三第 n 个参数全都用逗号分隔

apply的所有参数都必须放在一个数组里面传进去

bind 除了返回是函数以外，它 的参数和 call 一样

```js
var name = '小王', age = 17;
var obj = {
    name: '小张',
    objAge: this.age,
    myFun: function (from, to) { 
        console.log(this.age + '岁的' + this.name + '，来自' + from + ',去往' + to);
    }
}

var db = {
    name: '小李',
    age: 18
}


obj.myFun.call(db, '成都', '上海');             // 18岁的小李，来自成都,去往上海
obj.myFun.apply(db, ['成都', '上海']);          // 18岁的小李，来自成都,去往上海
obj.myFun.bind(db, '成都', '上海')();           // 18岁的小李，来自成都,去往上海
obj.myFun.bind(db, ['成都', '上海'])();         // 18岁的小李，来自成都,上海,去往undefined
```

### 实现

#### call()

举个例子：

```
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

注意两点：

1. call 改变了 this 的指向，指向到 foo
2. bar 函数执行了

当调用 call 的时候，把 foo 对象改造成如下：

```
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```

这个时候 this 就指向了 foo，

但是这样却给 foo 对象本身添加了一个属性，

需要用delete 再删除它

模拟的步骤可以分为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

注意：

**this 参数可以传 null，当为 null 的时候，视为指向 window**

**函数是可以有返回值的**

```js
Function.prototype.call2 = function (context) {
    context = context === null ? window : context;
    context.fn = this;

    let args = [];
    for (let i = 1, len = arguments.length; i < len; i++) {
        args.push(arguments[i])
    }
    // 采用扩展运算符传递参数
    let result = context.fn(...args);

    delete context.fn
    return result;
}

```

测试：

```js
var value = 2;
var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call2(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```

#### apply()

代码实现：

```js
Function.prototype.apply2 = function (context, arr) {
    context = context === null ? window : Object(context);
    context.fn = this;

    let result;
    if (!arr) {
        result = context.fn();
    }
    else {
        let args = [];
        for (let i = 0, len = arr.length; i < len; i++) {
            args.push(arr[i])
        }
        result = context.fn(...args);
    }

    delete context.fn
    return result;
}
```

测试：

```js
var value = 2;
var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.apply2(null) // 2
console.log(bar.apply2(obj, ['kevin1', 19]));
// 1
// Object {
//    value: 1,
//    name: 'kevin1',
//    age: 19
// }
```





