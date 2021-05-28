## 2020-12-11

## Express框架

Express整个框架的核心就是中间件，理解了中间件其他一切都非常简单！

### Express安装

express的使用过程有两种方式：
- 方式一：通过express提供的脚手架，直接创建一个应用的骨架；
- 方式二：从零搭建自己的express应用结构；

方式一：安装express-generator

```bash
# 安装脚手架
npm install -g express-generator
# 创建项目
express express-demo
# 安装依赖
npm install
# 启动项目
node bin/www
```

方式二：从零搭建自己的express应用结构；

```bash
npm init -y
```

### Express的基本使用

```js
const express = require('express')

const app = express()

app.get('/home', (req, res) => {
  res.end('hello home')
})

app.post('/login', (req, res) => {
  res.end('hello login')
})

app.listen(8000, () => {
  console.log('sever start')
})
```

### 认识中间件

Express是一个路由和中间件的Web框架，它本身的功能非常少：Express应用程序本质上是一系列中间件函数的调用；

中间件是什么呢？
- 中间件的本质是传递给express的一个回调函数；
- 这个回调函数接受三个参数：
  - 请求对象（request对象）；
  - 响应对象（response对象）；
  - next函数（在express中定义的用于执行下一个中间件的函数）；

中间件中可以执行哪些任务呢？
- 执行任何代码；
- 更改请求（request）和响应（response）对象；
- 结束请求-响应周期（返回数据）；
- 调用栈中的下一个中间件；

如果当前中间件功能没有结束请求-响应周期，则必须调用next()将控制权传递给下一个中间件功能，否则，请求将被挂起。

```js
const express = require('express')
const app = express()

app.get('/home', function(req, res, next) {
  next()
})

app.listen(8000, () => {
  console.log('sever start')
})
```

#### 应用中间件– 自己编写

如何将一个中间件应用到我们的应用程序中呢？
- express主要提供了两种方式：app/router.use和app/router.methods；
- 可以是app，也可以是router
- methods指的是常用的请求方式，比如： app.get或app.post等；methods的方式本质是use的特殊情况

#### 应用中间件– body解析

并非所有的中间件都需要我们从零去编写：
- express有内置一些帮助我们完成对request解析的中间件；
- registry仓库中也有很多可以辅助我们开发的中间件；

在客户端发送post请求时，会将数据放到body中：客户端可以通过json的方式传递，也可以通过form表单的方式传递；

#### 编写解析request body中间件

```js
app.use((req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    req.on('data', (data) => {
      const userInfo = JSON.parse(data.toString())
      req.body = userInfo
    })
    req.on('end', () => {
      next()
    })
  } else {
    next()
  }
})

app.post('/login', (req, res, next) => {
  console.log(req.body)
  res.end('login success')
})
```

#### 应用中间件– express提供

事实上我们可以使用expres内置的中间件或者使用body-parser来完成：

```js
app.use(express.json())

app.post('/login', (req, res, next) => {
  console.log(req.body)
  res.end('login success')
})
```

如果我们解析的是application/x-www-form-urlencoded：

```js
app.use(express.json())
app.use(express.urlencode({extended: true}))
app.post('/login', (req, res, next) => {
  console.log(req.body)
  res.end('login success')
})
```

#### 应用中间件– 第三方中间件

如果我们希望将请求日志记录下来，那么可以使用express官网开发的第三方库：morgan

需要单独安装
```js
const loggerWriter = fs.createWriteStream('./log/access.log', {
  flags: 'a+'
})

app.use(morgan('combined', {stream: loggerWriter}))
```

上传文件，我们可以使用express提供的multer来完成
```js
const upload = multer({
  dest: 'uploads/'
})

app.post('upload', upload.single('file'), (req, res, next) => {
  console.log(req.file.buffer)
  res.end('文件上传成功')
})
```

```js
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, 'upload/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({
  storage
})

app.post('/upload', upload.single('file'), (req, res, next) => {
  console.log(req.file.buffer)
  res.end('upload success')
})
```

#### multer解析form-data

借助于multer帮助我们解析一些form-data中的普通数据，那么我们可以使用any

```js
app.use(upload.any())

app.use('/login', (req, res, next) => {
  console.log(req.body)
})
```

### 客户端发送请求的方式

客户端传递到服务器参数的方法常见的是5种：
- 方式一：通过get请求中的URL的params；
- 方式二：通过get请求中的URL的query；
- 方式三：通过post请求中的body的json格式（中间件中已经使用过）；
- 方式四：通过post请求中的body的x-www-form-urlencoded格式（中间件使用过）；
- 方式五：通过post请求中的form-data格式（中间件中使用过）；

#### 传递参数params和query

请求地址：
```
http://localhost:8000/login/abc/why
```

```js
app.use('/login/:id/:name', (req, res, next) => {
  console.log(req.params)
  res.json('request success')
})
```

请求地址：
```
http://localhost:8000/login?username=why&password=123
```

```js
app.use('/login', (req, res, next) => {
  console.log(req.query)
  res.json('request success')
})
```

#### 响应数据

end方法：类似于http中response.end方法，用法一致的

json方法：json方法中可以传入很多的类型：object、array、string、boolean、number、null等，它们会被转换成json格式返回；

status方法：用于设置状态码

更多响应的方式：[https://www.expressjs.com.cn/4x/api.html#res](https://www.expressjs.com.cn/4x/api.html#res)

### Express的路由

可以使用express.Router来创建一个路由处理程序
- 一个Router实例拥有完整的中间件和路由系统
- 因此，它也被称为迷你应用程序（mini-app）

```js
const userRouter = express.Router()

userRouter.get('/', (req, res, next) => {
  res.end('用户列表')
})

userRouter.post('/', (req, res, next) => {
  res.end('创建用户')
})

userRouter.delete('/', (req, res, next) => {
  res.end('删除用户')
})

app.use('/users', userRouter)
```


### 静态资源服务器

部署静态资源我们可以选择很多方式：Node也可以作为静态资源服务器，并且express给我们提供了方便部署静态资源的方法；

```js
const express = require('express')

const app = express()

// 指定静态资源的目录
app.use(express.static('./build'))

app.listen(8000, () => {
  console.log('server start')
})
```

服务端的错误处理

```js
app.use((err, req, res, next) => {
  const message = err.message
  switch(message) {
    case 'USER DOES NOT EXISTS':
      res.status(400).json({message})
  }

  res.status(500)
})
```
