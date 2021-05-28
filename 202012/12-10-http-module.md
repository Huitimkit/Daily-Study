## 2020-12-10

## HTTP模块

### Web服务器

什么是Web服务器？

当应用程序（客户端）需要某一个资源时，可以向一个台服务器，通过Http请求获取到这个源；提供资源的这个服务器，就是一个Web服务器；

![request]()

>目前有很多开源的Web服务器：Nginx、Apache（静态）、Apache Tomcat（静态、动态）、Node.js

Node提供http模块，可以手动创建一个本地的服务器：
```js
const http = require('http')
const HTTP_PORT = 8000
const server = http.createServer((req, res) => {
  res.send('hello world')
})

server.list(HTTP_PORT, () => {
  console.log(`server start on ${HTTP_PORT}`)
})
```

**http.createServer会返回服务器的对象**，底层直接用的是**new Server**
```js
function createServer(opts, requestListener) {
  return new Server(opts, requestListener)
}
```

因此可以直接使用**Server**直接创建对象

```js
const server2 = new http.Server((req, res) => {
  res.end('hello server2')
})

server2.listen(9000, () => {
  console.log('服务器启动成功')
})
```
创建Server时会传入一个回调函数，这个回调函数在被调用时会传入两个参数：
- req：request请求对象，包含请求相关的信息；
- res：response响应对象，包含我们要发送给客户端的信息；

### 监听主机和端口号

Server通过listen方法来开启服务器，并且在某一个主机和端口上监听网络请求：
- 也就是当我们通过ip:port的方式发送到我们监听的Web服务器上时；
- 我们就可以对其进行相关的处理；

listen函数有三个参数：
- 端口port: 可以不传, 系统会默认分配端, 后续项目中我们会写入到环境变量中；
- 主机host: 通常可以传入localhost、ip地址127.0.0.1、或者ip地址0.0.0.0，默认是0.0.0.0；
  - localhost：本质上是一个域名，通常情况下会被解析成127.0.0.1；
  - 127.0.0.1：回环地址（Loop Back Address），表达的意思其实是我们主机自己发出去的包，直接被自己接收；
    - 正常的数据库包经常应用层- 传输层- 网络层- 数据链路层- 物理层；
    - 而回环地址，是在网络层直接就被获取到了，是不会经常数据链路层和物理层的；
    - 比如我们监听127.0.0.1时，在同一个网段下的主机中，通过ip地址是不能访问的；
  - 0.0.0.0
    - 监听IPV4上所有的地址，再根据端口找到不同的应用程序；
    - 比如我们监听0.0.0.0时，在同一个网段下的主机中，通过ip地址是可以访问的；
- 回调函数：服务器启动成功时的回调函数；

### request对象

在向服务器发送请求时，我们会携带很多信息，比如：
- 本次请求的URL，服务器需要根据不同的URL进行不同的处理；
- 本次请求的请求方式，比如GET、POST请求传入的参数和处理的方式是不同的；
- 本次请求的headers中也会携带一些信息，比如客户端信息、接受数据的格式、支持的编码格式等；
- 等等...

```js
const server = http.createServer((req, res) => {
  console.log(req.url)
  console.log(req.method)
  console.log(req.headers)

  res.end('hello world')
})
```

#### URL的处理

客户端在发送请求时，会请求不同的数据，那么会传入不同的请求地址：
```
http://localhost:8000/login；
http://localhost:8000/products;
```

服务器端需要根据不同的请求地址，作出不同的响应：

```js
const server = http.createServer((req, res) => {
  const url = req.url

  if (url === '/login') {
    res.end('welcome back')
  } else if (url === '/products') {
    res.end('products')
  } else {
    res.end('error message')
  }
})
```

#### URL的解析

```
http://localhost:8000/login?name=why&password=123;
```

使用内置url模块

```js
const parseInfo = url.parse(req.url)
console.log(parseInfo)
```

获取query信息
```js
const { pathname, query } = url.parse(req.url)
const queryObj = qs.parse(query)
console.log(queryObj.name)
console.log(queryObj.password)
```

### Method的处理

在Restful规范（设计风格）中，我们对于数据的增删改查应该通过不同的请求方式：
- GET：查询数据；
- POST：新建数据；
- PATCH：更新数据；
- DELETE：删除数据；

通过判断不同的请求方式进行不同的处理
- 比如创建一个用户：
- 请求接口为/users；
- 请求方式为POST请求；
- 携带数据username和password；

#### 创建用户接口

需要判断接口是/users，并且请求方式是POST方法去获取传入的数据

获取这种body携带的数据，我们需要通过监听req的data事件来获取

```js
req.setEncoding('utf-8')

req.on('data', (data) => {
  const { username, password } = JSON.parse(data)
  console.log(username, password)
})

req.on('end', () => {
  console.log('end')
})

res.end('create user success')
```

### header属性

客户端会默认传递过来一些信息：
```js
{
  'content-type': 'application/json',
  'user-agent': 'PostmanRuntime/7.26.5',
  accept: '*/*',
  'postman-token': '',
  host: 'localhost:8000',
  'accept-encoding': 'gzip, deflate, br',
  connection: 'keep-alive',
  'connection-length': '48'
}
```

content-type是这次请求携带的数据类型：
- application/json 表示一个json类型
- text/plain 表示文本类型
- application/xml 表示xml类型
- multipart/form-data 表示上传文件

content-length: 文件的大小和长度

keep-alive:
- http是基于TCP协议的，但是通常在进行一次请求和响应结束后会立刻中断
- 在http1.0中，如果想要继续保持连接：
  - 浏览器需要在请求头中添加connection: keep-alive；
  - 服务器需要在响应头中添加connection: keey-alive；
  - 当客户端再次放请求时，就会使用同一个连接，直接一方中断连接；
- 在http1.1中，所有连接默认是connection: keep-alive的；
  - 不同的Web服务器会有不同的保持keep-alive的时间；
  - Node中默认是5s中；

accept-encoding：告知服务器，客户端支持的文件压缩格式，比如js文件可以使用gzip编码，对应.gz文件；

accept：告知服务器，客户端可接受文件的格式类型；

user-agent：客户端相关的信息；

### 返回响应结果

给客户端响应的结果数据，可以通过两种方式：
- Write方法：这种方式是直接写出数据，但是并没有关闭流；
- end方法：这种方式是写出最后的数据，并且写出后会关闭流；

```js
res.write('hello world')
res.write('hello response')
res.end('message end')
```

>如果我们没有调用end和close，客户端将会一直等待结果：所以客户端在发送网络请求时，都会设置超时时间。

### 返回状态码

Http状态码（Http Status Code）是用来表示Http响应状态的数字代码：

- Http状态码非常多，可以根据不同的情况，给客户端返回不同的状态码；
- 常见的状态码是下面这些（后续项目中，也会用到其中的状态码）；

设置状态码常见的有两种方式：
```js
res.statusCode = 400
res.writeHead(200)
```

### 响应头文件

返回头部信息，主要有两种方式：
- res.setHeader：一次写入一个头部信息
- res.writeHead：同时写入header和status

```js
res.setHeader('content-type', 'application/json;charset=utf8')
res.writeHead(200, {
  'content-type': 'application/json;charset=utf8'
})
```
>默认客户端接收到的是字符串，客户端会按照自己默认的方式进行处理；

### http请求

axios库可以在浏览器中使用，也可以在Node中使用
- 在浏览器中，axios使用的是封装xhr
- 在Node中，使用的是http内置模块

### 文件上传

```js
// 图片文件必须设置为二进制的
req.setEncoding('binary')

// 获取content-type中boundary的值
var boundary = req.headers['content-type'].split(';')[1].replace('boundary=', '')

// 记录当前数据的信息
const fileSize = req.headers['content-length']
let curSize = 0
let body = ''

// 监听当前的数据
req.on('data', (data) => {
  curSize += data.length
  res.write(`文件上传进度：${curSize/fileSize * 100}%\n`)
  body += data
})

// 数据结构
req.on('end', () => {
  // 切割数据
  const payload = qs.parse(body, '\r\n', ':')
  // 获取最后的类型（image/png）
  const fileType = payload['Content-type'].substring(1)
  // 获取要截取的长度
  const fileTypePosition = body.indexOf(fileType) + fileType.length
  let binaryData = body.substring(fileTypePosition)
  binaryData = binaryData.replace(/^\s\s*/, '')
  
  const finalData = binaryData.substring(0, binary.indexOf('--' + boundary + '--'))
  fs.writeFile('./boo.png', finalData, 'binary', (err) => {
    console.log(err)
    res.end('文件上传完成')
  })
})
```






