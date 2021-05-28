## 2020-09-08

### 实现以下的cache方案

实际上就是利用闭包和高阶函数实现函数的缓存：

```js
const memorize = function(fn) {
  const cache = {}
  return function(...args) {
    const _args = JSON.stringify(args)
    return cache[_args] || (cache[_args] = fn.apply(fn, args))
  }
}

const add = function(a, b){
  return a + b
}

const reader = memorize(add)
reader(a, b)
```

### JavaScript深入之new的模拟实现

```js
function objectFactory() {
  const obj = new Object()
  Contructor = [].shift.call(arguments)
  obj.__proto__ = Contructor.prototype
  const ret = Contructor.apply(obj, arguments)
  return typeof ret === 'object' ? ret : obj
}
```

实现功能：
- 用new Object() 的方式新建了一个对象 obj
- 取出第一个参数，就是我们要传入的构造函数。此外因为 shift 会修改原数组，所以 arguments 会被去除第一个参数
- 将 obj 的原型指向构造函数，这样 obj 就可以访问到构造函数原型中的属性
- 使用 apply，改变构造函数 this 的指向到新建的对象，这样 obj 就可以访问到构造函数中的属性
- 如果构造函数有返回值，则直接发返回构造函数的对象，否则返回新创建的对象

[https://github.com/mqyqingfeng/Blog/issues/13](https://github.com/mqyqingfeng/Blog/issues/13)