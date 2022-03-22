# Node入门

[TOC]

## 请求的路由

需要查看HTTP请求，从中提取出请求的URL以及GET/POST参数，这些参数数据都会包含在request中，为了解析这些数据需要url和querystring模块。

```js
pathname = url.parse(request.url).pathname;
text = querystring.parse(postData).text;
```

```
                               url.parse(string).query
                                           |
           url.parse(string).pathname      |
                       |                   |
                       |                   |
                     ------ -------------------
http://localhost:8888/start?foo=bar&hello=world
                                ---       -----
                                 |          |
                                 |          |
              querystring(string)["foo"]    |
                                            |
                         querystring(string)["hello"]
```



## 阻塞与非阻塞

阻塞的例子：
代码中包含sleep(time)

在NodeJS是单线程的。当一个程序中出现阻塞时，其他的程序同样会等待。因此需要避免阻塞，多采用非阻塞方式操作，需要使用回调，通过将函数作为参数传递给其他需要花时间做处理的函数（比方说，休眠10秒，或者查询数据库，又或者是进行大量的计算）。

非阻塞实现：

使用一个新的Node.js模块，*child_process*，能够实现一个既简单又实用的非阻塞操作：*exec()*,*exec()*第二个参数使用了回调函数

```
exec("ls -lah", function (error, stdout, stderr) {
    content = stdout;
  });
```





## 参考资源

[node入门书籍](https://www.nodebeginner.org/index-zh-cn.html)

