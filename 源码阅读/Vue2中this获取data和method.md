# Vue2中this获取data和method实现机制

## 调试步骤

1. 在HTML中添加一下代码，启动服务，自己采用VSCode中的Live Server插件打开

```
<script src="https://unpkg.com/vue@2.6.14/dist/vue.js"></script>
<script>
    const vm = new Vue({
        data: {
            name: 'testname',
        },
        methods: {
            sayName(){
                console.log(this.name);
            }
        },
    });
    console.log(vm.name);
    console.log(vm.sayName());
</script>
```

2. 浏览器打开调试，`source` 面板，在例子中`const vm = new Vue({`打上断点

3. F11进入Vue构造函数，继续在`this._init(options)`处打上断点，F11进入函数

4. 在`initState(vm)`函数打上断点，F8直接跳到`initState(vm)`处，F11进入函数

5. 在 `initMethods` 和`initData(vm)`处打上断点， F11先进入`initMethods`函数

6. 看完`initMethods`函数后，直接F8回到`initData(vm)`函数）

**小技巧：**

按`alt`键，把鼠标移到方法名上，可以看到函数定义的地方，点击可以跳转



## 各阶段内容

### Vue构造函数

在Vue构造函数中，`if (!(this instanceof Vue)){}` 判断是不是用了 `new` 关键词调用构造函数，如果不是则警告

```js
function Vue (options) {
    if (!(this instanceof Vue)
    ) {
        warn('Vue is a constructor and should be called with the `new` keyword');
    }
    this._init(options);
}
```

### _init初始化函数

做了很多初始化的事情，比如初始化生命周期，初始化状态等，代码看一小部分

```js
function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
    // 中间省略	 
      vm._self = vm;
      initLifecycle(vm); // 初始化生命周期
      initEvents(vm);
      initRender(vm);
      callHook(vm, 'beforeCreate'); // beforeCreate生命周期
      initInjections(vm); // resolve injections before data/props
      //  初始化状态
      initState(vm);
      initProvide(vm); // resolve provide after data/props
      callHook(vm, 'created'); // created生命周期，这里已经初始化完了状态，可以访问到data、method
    };
}
```

### initState初始化状态函数

获取vm实例上的options，并对opts数据进行初始化

- 如果有props，则初始化props

- 如果有methods，则初始化方法

- 如果有data，则初始化data

- 如果有computed，则初始化计算属性

- 如果有watch，并且不是则nativeWatch，初始化watch

```js
function initState (vm) {
    vm._watchers = [];
    var opts = vm.$options;
    if (opts.props) { initProps(vm, opts.props); }
    // 有传入 methods，初始化方法
    if (opts.methods) { initMethods(vm, opts.methods); }
    // 有传入 data，初始化 data
    if (opts.data) {
      initData(vm);
    } else {
      observe(vm._data = {}, true /* asRootData */);
    }
    if (opts.computed) { initComputed(vm, opts.computed); }
    if (opts.watch && opts.watch !== nativeWatch) {
      initWatch(vm, opts.watch);
    }
}
```

### initMethods 初始化方法

遍历传入的methods对象，并且使用bind绑定函数的this指向为vm（Vue实例对象），所以通过this可以访问函数

具体的流程：

以下内容是针对methods的每一项遍历，并进行如下判断

- 判断方法是否是函数，如果不是函数则警告

- 判断方法是否和props冲突，如果冲突则警告

- 判断方法是否在vm实例上存在，并且方法名保留_、$，如果是则警告

```js
function initMethods (vm, methods) {
    var props = vm.$options.props;
    for (var key in methods) {
      {
         // 判断方法是否是函数 
        if (typeof methods[key] !== 'function') {
          warn(
            "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
            "Did you reference the function correctly?",
            vm
          );
        }
          // 判断方法是否和props冲突
        if (props && hasOwn(props, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a prop."),
            vm
          );
        }
          // 判断方法是否在vm实例上存在，并且方法名保留_、$
        if ((key in vm) && isReserved(key)) {
          warn(
            "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
            "Avoid defining component methods that start with _ or $."
          );
        }
      }
      // method是函数，通过bind绑定函数的this指向为vm  
      vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
    }
}
```

### bind 绑定this

bind返回一个函数，如果存在bind函数则使用原生的函数绑定this，如果不存在则采用call、apply方式绑定this，进行兼容性处理

```js
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

### initData 初始化data

先获取data对象，如果data是函数，则使用getData()函数获取对象，如果不是则直接获取data，将data赋值给_data进行备用

遍历data对象，并针对每一项data数据进行判断

具体的流程：

以下内容是针对data的每一项遍历，并进行如下判断

- 判断data是否和methods冲突，如果冲突则警告

- 判断data是否和props冲突，如果冲突则警告

- 判断data是否不是内部私有的保留属性，如果不是（无_、$符号），则进行代理，代理到`_data`上
- 检测data，变成响应式数据

```js
function initData (vm) {
    var data = vm.$options.data;
    // 这里是多个赋值，赋值语句的执行顺序是从右到左    
    data = vm._data = typeof data === 'function'
      ? getData(data, vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
      warn(
        'data functions should return an object:\n' +
        'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var methods = vm.$options.methods;
    var i = keys.length;
    while (i--) {
      var key = keys[i];
      {
        // 判断data是否和methods冲突  
        if (methods && hasOwn(methods, key)) {
          warn(
            ("Method \"" + key + "\" has already been defined as a data property."),
            vm
          );
        }
      }
       // 判断data是否和props冲突
      if (props && hasOwn(props, key)) {
        warn(
          "The data property \"" + key + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else if (!isReserved(key)) {
         // 判断data是否不是内部私有的保留属性，如果不是（无_、$符号），则进行代理，代理到`_data`上
        proxy(vm, "_data", key);
      }
    }
    // observe data 检测数据
    observe(data, true /* asRootData */);
}
```

### proxy 代理

` proxy(vm, "_data", key)`将`this.xxx` 代理访问的 `this._data.xxx`

用 `Object.defineProperty` 定义vm对象的key属性

```js
function noop (a, b, c) {}
var sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
};

function proxy (target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter () {
      return this[sourceKey][key]
    };
    sharedPropertyDefinition.set = function proxySetter (val) {
      this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
}
```



## 总结

能够通过this访问data和method的原因：

`methods`里的方法通过 `bind` 指定了`this`为 new Vue的实例(`vm`)

data里的属性经过代理会存储在new Vue的实例（`vm`）上的 `_data`对象中，访问 `this.xxx`，实际上是访问`Object.defineProperty`代理后的 `this._data.xxx`

