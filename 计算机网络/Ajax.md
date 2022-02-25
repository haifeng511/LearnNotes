# AJAX

[TOC]

## 1. 概述

AJAX是异步的JavaScript和XML（Asynchronous JavaScript And XML）

它使用 XMLHttpRequest 对象与服务器通信，可以使用JSON，XML，HTML和text文本等格式发送和接收数据，可以在不重新刷新页面的情况下与服务端通信，交换数据或更新页面

现在服务器返回的都是 JSON 格式的数据，XML 格式已经过时了，但是 AJAX 这个名字已经成了一个通用名词，字面含义已经消失了

**优点：**

在不重新加载页面的情况下发送请求给服务器

接受并使用从服务器发来的数据，更新部分页面

**缺点：**

没有浏览历史不能回退

存在跨域问题（AJAX 只能向**同源网址（协议、域名、端口都相同）**发出 HTTP 请求，如果发出跨域请求，就会报错）

SEO（搜索引擎优化）不友好



## 2. AJAX的步骤

1. 创建 XMLHttpRequest 实例
2. 设置请求信息
3. 发送请求
4. 接收服务器传回的数据
5. 更新网页数据



## 3. AJAX的简单使用

### 3.1 创建 XMLHttpRequest 实例

XMLHttpRequest本身是一个构造函数，可以使用new命令生成实例，它没有任何参数

```javascript
var xhr = new XMLHttpRequest();
```



### 3.2 设置请求的信息

当创建实例之后，可以使用open方法指定HTTP连接的信息

如果对使用过`open()`方法的 AJAX 请求，再次使用这个方法，等同于调用`abort()`，即终止请求

open()方法一共可以接受五个参数

```
void open(
   string method,
   string url,
   optional boolean async,
   optional string user,
   optional string password
);
```

- `method`：表示 HTTP 动词方法，比如`GET`、`POST`、`PUT`、`DELETE`、`HEAD`等。
- `url`: 表示请求发送目标 URL
- `async`: 布尔值，表示请求是否为异步，默认为`true`，开启异步，JavaScript不会在此语句阻塞，用户能不在服务器响应下与页面进行交互。如果设为`false`，则`send()`方法只有等到收到服务器返回了结果，才会进行下一步操作。该参数可选。由于同步 AJAX 请求会造成浏览器失去响应，许多浏览器已经禁止在主线程使用，只允许 Worker 里面使用。所以，这个参数轻易不应该设为`false`。
- `user`：表示用于认证的用户名，默认为空字符串。该参数可选。
- `password`：表示用于认证的密码，默认为空字符串。该参数可选。

```javascript
xhr.open('GET', 'http://www.example.org/some.file', true);
```



可以设置请求头信息，一般不设置

如果是POST请求，需要设置请求的MIME类型（媒体类型），例如：在调用 send() 方法获取表单数据前要有下面这个

```
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
```

发送表单数据的例子，使用FormData发送表单数据

```javascript
var formData = new FormData();

formData.append('username', '张三');
formData.append('email', 'zhangsan@example.com');
formData.append('birthDate', 1940);

var xhr = new XMLHttpRequest();
xhr.open('POST', '/register');
xhr.send(formData);
```



### 3.3 发送请求

通过send发送请求给服务器，方法的参数可以是任何你想发送给服务器的内容

它的参数是可选的，如果不带参数，就表示 HTTP 请求只有一个 URL，没有数据体，典型例子就是 GET 请求；如果带有参数，就表示除了头信息，还带有包含具体数据的信息体，典型例子就是 POST 请求

如果是 POST 请求的话，发送表单数据时应该用服务器可以解析的格式，像查询语句：

```
"name=value&anothername="+encodeURIComponent(myVar)+"&so=on"
```

或者其他格式, 类似 `multipart/form-data`，JSON，XML等



### 3.4 接收服务器返回的数据并处理

**XMLHttpRequest.readyState返回一个整数，表示实例对象的当前状态**。该属性只读。它可能返回以下值。

0，表示 XMLHttpRequest 实例已经生成，但是实例的open()方法还没有被调用。
1，表示open()方法已经调用，但是实例的send()方法还没有调用，仍然可以使用实例的setRequestHeader()方法，设定 HTTP 请求的头信息。
2，表示实例的send()方法已经调用，并且服务器返回的头信息和状态码已经收到。
3，表示正在接收服务器传来的数据体（body 部分）。这时，如果实例的responseType属性等于text或者空字符串，responseText属性就会包含已经收到的部分信息。
4，表示服务器返回的数据已经完全接收，或者本次接收已经失败。
通信过程中，每当实例对象发生状态变化，它的readyState属性的值就会改变。这个值每一次变化，都会触发readyStateChange事件

**XMLHttpRequest.onreadystatechange属性指向一个监听函数**。readystatechange事件发生时（实例的readyState属性变化），就会执行这个属性。

另外，如果使用实例的abort()方法，终止 XMLHttpRequest 请求，也会造成readyState属性变化，导致调用XMLHttpRequest.onreadystatechange属性

**XMLHttpRequest.onload：load 事件（请求成功完成）的监听函数**。进行请求成功之后的数据处理

**XMLHttpRequest.onerror：error 事件（请求失败）的监听函数** 请求失败时，进行请求失败的数据处理

**小结：**

1.方法一：使用onreadystatechange监听函数，监听对象的状态，当readyState的状态值是4代表返回数据接收，或接收失败

判断响应状态码，如果是200表示成功，接着便可以通过response属性获取返回值

2.方法二：使用onload监听，实现请求成功的数据处理，使用onerror进行请求失败的事件处理



### 3.5 XMLHttpRequest对象简单用法的完整例子

```javascript
var xhr = new XMLHttpRequest();

xhr.onreadystatechange = function(){
  // 通信成功时，状态值为4
  if (xhr.readyState === 4){
      // 检查响应码 200 OK 判断AJAX有没有成功
    if (xhr.status === 200){
      console.log(xhr.response);
    } else {
      console.error(xhr.status);
    }
  }
};

xhr.onerror = function (e) {
  console.error(xhr.statusText);
};

xhr.open('GET', '/endpoint', true);
xhr.send(null);
```



## 参考资源

[MDN中AJAX新手入门](https://developer.mozilla.org/zh-CN/docs/Web/Guide/AJAX/Getting_Started)

[MDN中XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)

[网道XMLHttpRequest](https://wangdoc.com/javascript/bom/xmlhttprequest.html)