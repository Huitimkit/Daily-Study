## 2020-09-07

## setState 是异步还是同步

首先，改变 state 的时候不能直接修改，需要使用不可变值，即要更新的时候再通过 setState 更新

setState 有可能是异步更新也有可能是同步更新

```js
this.setState(
  {
    count: this.state.count + 1,
  },
  () => {
    // 联想 Vue $nextTick - DOM
    console.log("count by callback", this.state.count); // 回调函数中可以拿到最新的 state
  }
);
console.log("count", this.state.count);
```

在同步更新 state 的值，不能拿到最新的值，只有在回调函数中可以拿到最新的 state

setTimeout 中 setState 是同步的

```js
setTimeout(() => {
  this.setState({
    count: this.state.count + 1,
  });
  console.log("count in setTimeout", this.state.count);
}, 0);
```

自己定义的 DOM 事件，setState 是同步的。再 componentDidMount 中

传入对象，会被合并（类似 Object.assign ）。执行结果只一次 +1

```js
this.setState({
  count: this.state.count + 1,
});
this.setState({
  count: this.state.count + 1,
});
this.setState({
  count: this.state.count + 1,
});
```

传入函数，不会被合并。执行结果是 +3

```js
this.setState((prevState, props) => {
  return {
    count: prevState.count + 1,
  };
});
this.setState((prevState, props) => {
  return {
    count: prevState.count + 1,
  };
});
this.setState((prevState, props) => {
  return {
    count: prevState.count + 1,
  };
});
```

### VDOM 渲染原理

Virtual DOM(虚拟 DOM)，是由普通的 JS 对象来描述 DOM 对象，因为不是真实的 DOM 对象，
所以叫 Virtual DOM

Vue 2.x 内部使用的 Virtual DOM 就是改造的 Snabbdom

Snabbdom 的核心仅提供最基本的功能，只导出了三个函数 init()、h()、thunk()

- init() 是一个高阶函数，返回 patch()
- h() 返回虚拟节点 VNode，这个函数我们在使用 Vue.js 的时候见过

```js
new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

- thunk() 是一种优化策略，可以在处理不可变数据时使用

Snabbdom 的核心

- 使用 h() 函数创建 JavaScript 对象(VNode)描述真实 DOM
- init() 设置模块，创建 patch()
- patch() 比较新旧两个 VNode
- 把变化的内容更新到真实 DOM 树上

如何比较是通过

- 对比新旧 VNode 是否相同节点(节点的 key 和 sel 相同)
- 如果不是相同节点，删除之前的内容，重新渲染
- 如果是相同节点，再判断新的 VNode 是否有 text，如果有并且和 oldVnode 的 text 不同，直接更
  新文本内容
- 如果新的 VNode 有 children，判断子节点是否有变化，判断子节点的过程使用的就是 diff 算法
- diff 过程只进行同层级比较

### 实现一个方法，将传入对象的下划线命名方式全部换为驼峰式(考虑递归的场景)。比如

```js
// before
const obj = {
 first_name: 'chen'
}
​
// after
const obj = {
 firstName: 'chen'
}
```

```js
function convert(obj) {
  const result = {}
  for(let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = key.replace(/_([a-z])/g, (p1, p2) => {
        console.log(p1)
        console.log(p2)
        return p2.toUpperCase()
      })
    
      if (typeof obj[key] === 'object' && obj[key] != null) {
        result[newKey] = convert(obj[key])
      } else {
        result[newKey] = obj[key]
      }
    }
  }
  return result
}
```

![](https://oaker.bid/javascript/solutions/object-key-to-camel-case.html)

### es6的模块管理 与 commonjs 的对比

它们有三个重大差异

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- CommonJS 模块的require()是同步加载模块，ES6 模块的import命令是异步加载，有一个独立的模块依赖的解析阶段。
![](https://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

### es6 Decorator

装饰器（Decorator）是一种与类（class）相关的语法，用来注释或修改类和类方法。

例如我们希望给每个类扩展打印log的功能，就写一个log的函数来装饰调用的类，这样在每次输出的时候就能打印相关的日志

但是装饰器只能用于类和类的方法，不能用于函数，因为存在函数提升。

### es6+ 新特性

新特性：模块 | 类 | 解构赋值 | promise | 构造器 |Proxy | Reflect | 箭头函数 | 模板字符串

### Base64 的原理？编码后比编码前是大了还是小了?

Base64编码之所以称为Base64，是因为其使用64个字符来对任意数据进行编码

Base64编码本质上是一种将二进制数据转成文本数据的方案。对于非二进制数据，是先将其转换成二进制形式，然后每连续6比特（2的6次方=64）计算其十进制值，根据该值在上面的索引表中找到对应的字符，最终得到一个文本字符串。

### 浅析DNS域名解析过程

![https://ask.qcloudimg.com/http-save/developer-news/6cnh99b9q4.jpeg?imageView2/2/w/1620](https://ask.qcloudimg.com/http-save/developer-news/6cnh99b9q4.jpeg?imageView2/2/w/1620)

- 第一步：检查浏览器缓存中是否缓存过该域名对应的IP地址
- 第二步：如果在浏览器缓存中没有找到IP，那么将继续查找本机系统是否缓存过IP
- 第三步：向本地域名解析服务系统发起域名解析的请求
- 第四步：向根域名解析服务器发起域名解析请求
- 第五步：根域名服务器返回gTLD域名解析服务器地址
- 第六步：向gTLD服务器发起解析请求
- 第七步：gTLD服务器接收请求并返回Name Server服务器
- 第八步：Name Server服务器返回IP地址给本地服务器
- 第九步：本地域名服务器缓存解析结果
- 第十步：返回解析结果给用户


[https://juejin.cn/post/6880722165982429197](https://juejin.cn/post/6880722165982429197)
[https://zhuanlan.zhihu.com/p/79350395](https://zhuanlan.zhihu.com/p/79350395)