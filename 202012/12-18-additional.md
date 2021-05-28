## 2020-12-18

### 认识cookie

Cookie（复数形态Cookies），又称为“小甜饼”。类型为“小型文本文件，某些网站为了辨别用户身份而存储在用户本地终端（Client Side）上的数据。

浏览器会在特定的情况下携带上cookie来发送请求，我们可以通过cookie来获取一些信息；

Cookie总是保存在客户端中，按在客户端中的存储位置，Cookie可以分为内存Cookie和硬盘Cookie。
- 内存Cookie由浏览器维护，保存在内存中，浏览器关闭时Cookie就会消失，其存在时间是短暂的；
- 硬盘Cookie保存在硬盘中，有一个过期时间，用户手动清理或者过期时间到时，才会被清理；

判断一个cookie是内存cookie还是硬盘cookie
- 没有设置过期时间，默认情况下cookie是内存cookie，在关闭浏览器时会自动删除；
- 有设置过期时间，并且过期时间不为0或者负数的cookie，是硬盘cookie，需要手动或者到期时，才会删除；

#### cookie常见的属性

cookie的生命周期：

默认情况下的cookie是内存cookie，也称之为会话cookie，也就是在浏览器关闭时会自动被删除；

我们可以通过设置expires或者max-age来设置过期的时间；
- expires：设置的是Date.toUTCString()，设置格式是;expires=date-in-GMTString-format；
- max-age：设置过期的秒钟，;max-age=max-age-in-seconds (例如一年为60*60*24*365)；

cookie的作用域：（允许cookie发送给哪些URL）
- Domain：指定哪些主机可以接受cookie
  - 如果不指定，那么默认是origin，不包括子域名。
  - 如果指定Domain，则包含子域名。例如，如果设置Domain=mozilla.org，则Cookie 也包含在子域名中（如developer.mozilla.org）。

- Path：指定主机下哪些路径可以接受cookie
  - 例如，设置Path=/docs，则以下地址都会匹配：
    - /docs
    - /docs/Web/
    - /docs/Web/HTTP

#### 客户端设置cookie

js直接设置和获取cookie：
```js
document.cookie = 'name=test'
console.log(document.cookie)
```

这个cookie会在会话关闭时被删除掉（无设置过期时间）
```js
document.cookie = 'name=test'
document.cookie = 'age=18'
```

设置cookie，同时设置过期时间（默认单位是秒钟）
```js
document.cookie = 'name=test;max-age=10'
```

#### 服务器设置cookie

Koa中默认支持直接操作cookie
- /test请求中设置cookie
- /demo请求中获取cookie

```js
testRouter.get('/test', (ctx, next) => {
  ctx.cookies.set('name', 'test', { maxAge: 1000 * 1000 })
  ctx.body = 'cookie设置成功'
})

testRouter.get('/demo', (ctx, next) => {
  const value = ctx.cookies.get('name')
  ctx.body = '获取cookie成功' + value
})
```

#### Session是基于cookie实现机制

在koa中，我们可以借助于koa-session 来实现session认证：

```js
const KoaSession = require('koa-session')

const session = KoaSession({
  key: 'sessionid',   // cookie的key
  maxAge: 5 * 1000,   // 过期时间
  httpOnly: true,     // 不允许通过js获取cookie
  rolling: true,      // 每次响应时，刷新session的有效期
  signed: true        // 是否使用signed签名认证，防止数据被篡改
})

app.keys = ['test']
app.use(session)
```

```js
testRouter.get('/test', (ctx, next) => {
  ctx.session.user = {
    id: 110,
    name: 'test'
  }
  ctx.body = 'session 设置成功'
})

testRouter.get('/demo', (ctx, next) => {
  const user = ctx.session.user
  console.log(user)
  ctx.body = user
})
```

### 认识token

cookie和session的方式有很多的缺点：
- Cookie会被附加在每个HTTP请求中，所以无形中增加了流量（事实上某些请求是不需要的）；
- Cookie是明文传递的，所以存在安全性的问题；
- Cookie的大小限制是4KB，对于复杂的需求来说是不够的；
- 对于浏览器外的其他客户端（比如iOS、Android），必须手动的设置cookie和session；
- 对于分布式系统和服务器集群中如何可以保证其他系统也可以正确的解析session？

在目前的前后端分离的开发过程中，使用token来进行身份验证的是最多的情况：
- token可以翻译为令牌；
- 也就是在验证了用户账号和密码正确的情况，给用户颁发一个令牌；
- 这个令牌作为后续用户访问一些接口或者资源的凭证；
- 我们可以根据这个凭证来判断用户是否有权限来访问；

token的使用应该分成两个重要的步骤：
- 生成token：登录的时候，颁发token；
- 验证token：访问某些资源或者接口时，验证token；

#### JWT实现Token机制

JWT生成的Token由三部分组成：
- header
  - alg：采用的加密算法，默认是HMAC SHA256（HS256），采用同一个密钥进行加密和解密；
  - typ：JWT，固定值，通常都写成JWT即可；
  - 会通过base64Url算法进行编码；

- payload
  - 携带的数据，比如我们可以将用户的id和name放到payload中；
  - 默认也会携带iat（issued at），令牌的签发时间；
  - 我们也可以设置过期时间：exp（expiration time）；
  - 会通过base64Url算法进行编码

- signature
  - 设置一个secretKey，通过将前两个的结果合并后进行HMACSHA256的算法；
  - HMACSHA256(base64Url(header)+.+base64Url(payload), secretKey);
  - 但是如果secretKey暴露是一件非常危险的事情，因为之后就可以模拟颁发token，也可以解密token；

![jwt]()

#### Token的使用

在真实开发中，我们可以直接使用一个库来完成： jsonwebtoken；

```js
testRouter.get('/test', (ctx, next) => {
  const user = { id: 110, name: 'why'}
  const token = jwt.sign(user, 'aaa', { expiresIn: 10 })
  ctx.body = token
})

testRouter.get('/demo', (ctx, next) => {
  try {
    const authorization = ctx.header.authorization
    const token = authorization.replace('Bearer', '')
    const result = jwt.verify(token, 'aaa')
    ctx.body = result
  } catch(e) {
    console.log(e)
    ctx.body = e.message
  }
})
```

### 非对称加密

HS256加密算法一单密钥暴露就是非常危险的事情：
- 比如在分布式系统中，每一个子系统都需要获取到密钥；
- 那么拿到这个密钥后这个子系统既可以发布另外，也可以验证令牌；
- 但是对于一些资源服务器来说，它们只需要有验证令牌的能力就可以了；

这个时候我们可以使用非对称加密，RS256：
- 私钥（private key）：用于发布令牌；
- 公钥（public key）：用于验证令牌；

可以使用openssl来生成一对私钥和公钥：
- Mac直接使用terminal终端即可；
- Windows默认的cmd终端是不能直接使用的，建议直接使用git bash终端；

```bash
openssl

> genrsa -out private.key 1024
> rsa -in private.key -pubout -out public.key
```

#### 使用公钥和私钥签发和验证签名

```js
testRouter.get('/test', (ctx, next) => {
  const user = { id: 110, name: 'why' }

  console.log(process.cwd())
  const privateKey = fs.readFileSync('src/sharekeys/private.key')
  const token = jwt.sign(user, privateKey, { expiresIn: 10, algorithm: 'RS256' })
  ctx.body = token
})

testRouter.get('/demo', (ctx, next) => {
  try {
    const authorization = ctx.headers.authorization
    const token = authorization.replace('Bearer ', '')
    const publicKey = fs.readFileSync(path.join(__dirname, './sharekeys/public.key'))
    const result = jwt.verify(token, publicKey, { algorithms: ['RS256'] })
    ctx.body = result
  } catch(e) {
    console.log(e)
    ctx.body = 'token 过期了，请重新登录'
  }
})
```

#### 派发令牌和验证令牌

```js
async login(ctx, next) {
  const { id, name } = ctx.request.body.user

  // 颁发令牌
  const token = jwt.sign({ id, name }, PRIVATE_KEY, { algorithm: 'RS256', expiresIn: 60 * 60 * 24 })
  ctx.body = { id, name, token }
}
```

```js
const verifyAuth = async (ctx, next) => {
  console.log('验证授权middleware')
  // 取出header中的token
  const authorization = ctx.headers.authorization
  const token = authorization.replace('Bearer ', '')

  // 验证token
  const result = jwt.verify(token, PUBLIC_KEY)
  ctx.user = result
  await next()
}
```