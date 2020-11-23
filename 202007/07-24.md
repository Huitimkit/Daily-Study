## 2020-07-24

## Javascript设计模式

### 第二章 面向对象

`2.1搭建开发环境`

- 初始化npm环境

  ```bash
  npm init --y
  ```

- 安装webpack

  ```bash
  npm install webpack webpack-cli --save-dev
  ```

- 安装webpack-dev-server

  ```bash
  npm install webpack-dev-server html-webpack-plugin --save-dev
  ```

- 安装babel
  
  ```bash
  npm install babel-core babel-loader babel-polyfill babel-preset-es2015 babel-preset-latest --save-dev
  ```

目录结构：
```
---javascript-design-patterns
  |
  |-index.html
  |-webpack.dev.config.js
  |-.babelrc
  |-package.json
  |-src
    |-index.js
```

```json
// package.json
{
  "name": "javascript-design-patterns",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack-dev-server --config ./webpack.dev.config.js --mode development"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-polyfill": "^6.26.0",
    "babel-preset-es2015": "^6.24.1",
    "babel-preset-latest": "^6.24.1",
    "html-webpack-plugin": "^4.3.0",
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0"
  }
}
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Javascript Design Patterns</title>
</head>
<body>
  this is my Javascript Design Patterns Course.
</body>
</html>
```

```js
// webpack.dev.config.js
const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname,
    filename: './release/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './index.html'
    })
  ],
  devServer: {
    contentBase: path.join(__dirname, './release'), // 根目录
    open: true, // 是否自动打开浏览器
    port: 9000
  }
}
```

```babelrc
{
  "presets": ["es2015", "latest"],
  "plugins": []
}
```

```js
// index.js
class Person {
  constructor(name) {
    this.name = name
  }

  getName() {
    return this.name
  }
}

const p = new Person('John')
alert(p.getName())
```

`2.2什么是面向对象`

类是对一类事物的抽象

对象（实例）是某一类的具体描述

类的三要素：
- 继承，子类继承父类
- 封装，数据的权限和保密
- 多态，同一接口不同实现

继承可将公共方法抽离出来，提高复用，减少冗余
```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  
  eat() {
    alert(`${this.name} eat something`)
  }
  
  speak() {
  	alert(`My name is ${this.name}, I am ${this.age} years old`)
  }
}

class Student extends Person {
  constructor(name, age, number) {
    super(name, age)
    this.number = number
  }
  
  study() {
    alert(`My number is ${this.number}`)
  }
}

const xiaoming = new Student('xiaoming', 11, 'A1')
xiaoming.study()
xiaoming.eat()

const xiaohong = new Student('xiaohong', 11, 'A2')
xiaohong.study()
xiaohong.speak()
```

`封装`
- public 完全开放
- protected 对子类开放
- private 对自己开放

作用：
- 减少偶尔，不该外露的不外露
- 利于数据、接口的权限管理
（ES6尚不支持，是通过其它方式来实现，可以用typescript实现 ）

`多态`
- 同一接口，不同的表现
- 保持子类的开放性和灵活性

`jQuery的应用实例`
```js
class jQuery {
  constructor(selector) {
    const slice = Array.prototype.slice
    const dom = slice.call(document.querySelectorAll(selector))
    const len = dom ? dom.length : 0
    for (let i = 0; i < len; i++) {
      this[i] = dom[i]
    }
    this.length = len
    this.selector = selector
  }

  append(node) {
    // ...
  }

  addClass(name) {
    // ...
  }

  html(data) {
    // ...
  }
}

window.$ = function(selector) {
  return new jQuery(selector)
}

const $p = $('p')
console.log($p)
console.log($p.addClass)
```

`为什么使用面向对象`

- 程序执行：顺序、判断、循环---结构化
- 面向对象-数据结构化
- 对于计算机，结构化的才是最简单的
- 编程应该简答和抽象


`UML类图`

Unified Modeling Language统一建模语言

| 类 |
| :----- |
| + public公共属性A：类型<br> # proctected保护属性B：类型<br> - private私有属性C：类型
| + public公有方法A（参数1，参数2）：返回类型<br> # protected保护方法B（参数1， 参数2）：返回类型<br>- private私有方法C（参数1， 参数2）：返回类型 |


关系
- 泛化，表示继承
- 关联，表示引用
---

### 第三章 设计原则

`何为设计`

描述：
- 即按照哪一种思路或标准来实现功能
- 功能相同，可以有不同设计方案来实现
- 伴随着需求增加，设计的作用才能体现出来

《UNIX/LINUX设计哲学》

- 准则1：小即是美
- 准则2：让每个程序只做好一件事
- 准则3：快速建立原型（先满足基本功能使用，后面再升级，可以自己主动添加功能或者用户反馈新功能）
- 准则4：舍弃高效率而取可移植性
- 准则5：采用纯文本来存储数据
- 准则6：充分利用软件的杠杆效应
- 准则7：使用shell脚本来提高杠杆效应和可移植性
- 准则8：避免强制性的用户界面
- 准则9：让每个程序都称为过滤器

小准则：
- 小准则：允许用户定制环境
- 小准则：尽量使操作系统内核小而轻量化
- 小准则：使用小写字母并尽量简短
- 小准则：沉默是金（例如输出结果是数字，就不要输出字符串、文字）
- 小准则：各个部分之和大于整体
- 小准则：寻求90%的解决方案（行业28定律，花20%的成本，解决80%的问题）

`五大设计原则 solid`
- S - 单一职责原则（Single）：
  一个程序只做好一件事，如果功能过于复杂就拆分开，每个部分保持独立
- O - 开放封闭原则（Open & close）：
  对扩展开放，对修改封闭，增加需求时，扩展新代码，而非修改已有代码，这是软件设计的终极目标
- L - 里氏置换原则：
  - 子类能覆盖父类
  - 父类能出现的地方，子类就能出现
  - JS中使用较少（弱类型&继承使用较少）
- I - 接口独立原则（Interface）：
  - 保持接口的单一独立，避免出现“胖接口”
  - JS中没有接口，使用较少
  - 类似于单一职责原则，这里更关注接口
- D - 依赖导致原则（Dependence）：
  - 面向接口编程，依赖于抽象而不依赖具体
  - 使用方只关注接口而不关注具体类的实现
  - JS中使用较少（没有接口 & 弱类型）

```js
function loadImg(src) {
  const promise = new Promise(function(resolve, reject) {
    const img = document.createElement('img')
    img.onload = function() {
      resolve(img)
    }
    img.onerror = function() {
      reject('图片加载失败')
    }
    img.src = src
  })
  return promise
}

const src = 'http://s1.8591.com.tw/img/index/logo.png'
const result = loadImg(src)
result.then(function(img) {
  alert(`image width: ${img.width}`)
  return img
}).then(function(img) {
  alert(`image height: ${img.height}`)
}).catch(function(error) {
  alert(error)
})
```

`从设计到模式`

分开理解，设计是设计，模式是模式，先了解设计后了解模式


`介绍23种设计模式`

设计模式的类型：
- 创建型（对象怎么创建）：
  - 工厂模式（工厂方法模式，抽象工厂模式，建造者模式）
  - 单例模式
  - 原型模式

- 结构型（需要多个对象解决问题）

  - 适配器模式
  - 装饰器模式
  - 代理模式
  - 外观模式
  - 桥接模式
  - 组合模式
  - 享元模式

- 行为型-1（涵盖日常开发行为）
  - 策略模式
  - 模板方法模式
  - 观察者模式
  - 迭代器模式
  - 职责连模式
  - 命令模式

- 行为型-2
  - 备忘录模式
  - 状态模式
  - 访问者模式
  - 中介者模式
  - 解释器模式


`例题`

- 打车服务

  - 每辆车都有车牌号和名称
  - 打车服务分快车和专车，快车每公里1元，专车每公里2元（快车和专车继承车类，都有车牌号和品牌）
  - 行程开始显示打车信息(行程与车是依赖关系)
  - 行程结束显示打车价格

```js
class Car {
  constructor(number, name) {
    this.number = number
    this.name = name
  }
}

class KuaiChe extends Car {
  constructor(number, name) {
    super(number, name)
    this.price = 1
  }
}

class Zhuanche extends Car {
  constructor(number, name) {
    super(number, name)
    this.price = 2
  }
}

class Trip {
  constructor(car) {
    this.car = car
  }

  start() {
    console.log(`the car number is ${this.car.number} and name is ${this.car.name}`)
  }

  end() {
    console.log(`the trip price is ${this.car.price * 5}`)
  }
}

const car = new KuaiChe(88888, '比亚迪·唐')
const trip = new Trip(car)
trip.start()
trip.end()
```

- 停车场停车
  - 某停车场，分3层，每层100车位
  - 每个车位都能监控到车辆的驶入和离开
  - 车辆进入前，显示每层的空余车位数量
  - 车辆进入时，摄像头可识别车牌号和时间
  - 车辆出来是，出口显示车牌号和停车时长

```js
// 车位
class Place {
  constructor() {
    this.empty = true
  }
  in() {
    this.empty = false
  }
  out() {
    this.empty = true
  }
}

// 层
class Floor {
  constructor(index, places) {
    this.index = index
    this.places = places || []
  }

  emptyPlaceNum() {
    let num = 0
    this.places.forEach(p => {
      if (p.empty) {
        num++
      }
    })
    return num
  }
}

class Car {
  constructor(num) {
    this.num = num
  }
}

// 摄像头
class Camera {
  shot(car) {
    return {
      num: car.num,
      inTime: Date.now()
    }
  }
}

// 显示屏
class Screen {
  show(car, inTime) {
    console.log(`OUT: car number: ${car.num}, parking time: ${Date.now() - inTime}`)
  }
}

// 停车场
class Park {
  constructor(floors) {
    this.floors = floors || []
    this.camera = new Camera()
    this.screen = new Screen()
    this.carList = {} // 存储摄像头拍摄返回的信息
  }

  in(car) {
    // 通过摄像头获取信息
    const info = this.camera.shot(car)
    // 停在某个停车位
    const i = parseInt(Math.random() * 100 % 100)
    const place = this.floors[0].places[i]
    place.in()
    info.place = place
    this.carList[car.num] = info
  }
  out(car) {
    const info = this.carList[car.num]
    const place = info.place
    place.out()
    this.screen.show(car, info.inTime)
    delete this.carList[car.num]
  }

  emptyNum() {
    return this.floors.map((floor, index) => {
      return `The ${index + 1} floor now have ${floor.emptyPlaceNum()} places` 
    }).join('\n')
  }
}

// 初始化
const floors = []
for(let i = 0; i < 3; i++) {
  const places = []
  for(let j = 0; j < 100; j++) {
    places[j] = new Place()
  }
  floors[i] = new Floor(i + 1, places)
}

const park = new Park(floors)

const car1 = new Car(100)
const car2 = new Car(200)
const car3 = new Car(300)

console.log('first in')
console.log(park.emptyNum())
park.in(car1)
console.log('second in')
console.log(park.emptyNum())
park.in(car2)
console.log('first out')
park.out(car1)
console.log('second out')
park.out(car2)
console.log('third in')
console.log(park.emptyNum())
park.in(car3)
console.log('third out')
park.out(car3)
```

### 第四章 工厂模式

`介绍`

- 将new操作单独封装
- 遇到new时，就要考虑是否该使用工厂模式

```js
class Product {
  constructor(name) {
    this.name = name
  }
}

class Creator {
  create(name) {
    return new Product(name)
  }
}

const creator = new Creator()
const p = creator.create('product')
```

`使用场景`

- jQuery
- React.createElement
- Vue异步组件

`设计原则验证`

- 构造函数和创建者分离
- 符合开放封闭原则

### 第五章 单例模式

`介绍`
- 系统中被唯一使用
- 一个类只有一个实例

`示例`
- 购物车
- 登录框

```js
class SingleObject {
  login() {
    console.log('login...')
  }
}

SingleObject.getInstance = (function() {
  let instance = null
  return function() {
    if (!instance) {
      instance = new SingleObject()
    }
    return instance
  }
})()

const obj1 = SingleObject.getInstance()
const obj2 = SingleObject.getInstance()
console.log('obj1 === obj2', obj1 === obj2) // true

// 无法控制
const obj3 = new SingleObject()
console.log('obj1 === obj3', obj1 === obj3) // false
```

`经典使用场景`

```js
if (window.jQuery != null) {
  return window.jQuery
} else {
  // 初始化
}
```

`设计原则验证`

- 符合单一职责原则，只实例化唯一的对象
- 没法具体开放封闭原则，但是绝对不违反开放封闭原则

---
### 第六章 适配器模式

`介绍`
- 旧接口与使用者不兼容
- 中间加一个适配转换接口

```js
class Adaptee {
  specificRequest() {
    return '德国标准插头'
  }
}

class Target {
  constructor() {
    this.adaptee = new Adaptee()
  }
  request() {
    const info = this.adaptee.specificRequest()
    return `${info} --- 转换 --- 中国标准插头`
  }
}

const target = new Target()
console.log(target.request())
```

`示例`
- 封装旧接口

```js
// 自己封装的ajax,使用方法如下：
ajax({
  url: '/getData',
  type: 'Post',
  dataType: 'json',
}).done(function)

$.ajax({...})

// 需要进行多一层封装
const $ = {
  ajax: function(options) {
    return ajax(options)
  }
}
```

- vue computed

`设计原则验证`
- 将旧接口和使用者进行分离
- 符合开放封闭原则
---
### 第七章 装饰器模式

`介绍`

- 为对象添加新功能
- 不改变其原有的结构和功能

```js
class Circle {
  draw() {
    console.log('draw a circle')
  }
}

class Decorator {
  constructor(circle) {
    this.circle = circle
  }

  draw() {
    this.circle.draw()
    this.setRedBordered()
  }

  setRedBordered() {
    console.log('draw a red border')
  }
}

const circle = new Circle()
circle.draw()

const dec = new Decorator()
dec.draw()
```

`场景`

- ES7装饰器
- core-decorators

`ES7装饰器配置`

```bash
npm install babel-plugin-transform-decorators-legacy --save-dev
```

```babelrc
{
  plugins: ["transform-decorators-legacy"]
}
```

```js
@decorator
class A {}

// 等同于
class A {}
A = decorator(A) || A
```

```js
function mixins(list) {
  return function(target) {
    Object.assign(target.prototype, ...list)
  }
}

const Foo = {
  foo() {
    console.log('foo')
  }
}

@mixins(Foo)
class MyClass {}

const obj = new MyClass()
obj.foo()
```
`装饰类`

装饰类的时候，第一个参数表示类的函数本身，name和descriptor都是undefined

`装饰方法`

装饰类方法的时候，第一个参数表示类的原型(prototype), 第二个参数表示方法名, 第三个参数表示被装饰参数的属性

`@readonly`
```js
function readonly(target, name, descriptor) {
  // descriptor属性描述对象,原来的值如下
  // {
  //   value: specificFunction,
  //   enumerable: false,
  //   configurable: true,
  //   writable: true
  // }
  descriptor.writable = false
  return descriptor
}

class Person {
  constructor() {
    this.first = 'A'
    this.last = 'B'
  }

  @readonly
  name() {
    return `${this.first} - ${this.last}`
  }
}

const p = new Person()
p.name()
p.name = function() {} // 会报错
```

`@log`
```js
function log(target, name, descriptor) {
  const oldValue = descriptor.value
  descriptor.value = function() {
    console.log(`calling ${name} width `, arguments)
    return oldValue.apply(this, arguments)
  }
  return descriptor
}

class Math {
  @log
  add(a, b) {
    return a + b
  }
}

const math = new Math()
const result = math.add(2, 4)
console.log(result)
```

`设计原则验证`
- 将现有对象和装饰器进行分离，两者独立存在
- 符合开放封闭原则
---
### 第八章 代理模式

`介绍`
- 使用者无权访问目标对象
- 中间加代理、通过代理做授权和控制

`示例`
- 科学上网
- 明星经纪人

```js
class ReadImg {
  constructor(fileName) {
    this.fileName = fileName
    this.loadFromDisk()
  }

  display() {
    console.log('display...', fileName)
  }

  loadFromDisk() {
    console.log('load...', fileName)
  }
}

class ProxyImg {
  constructor(fileName) {
    this.readImg = new ReadImg(fileName)
  }

  display() {
    this.readImg.display()
  }
}

const proxy = new ProxyImg('1.png')
proxy.display()
```
`场景`
- 网页事件代理
  ```js
  var div1 = document.getElementById('div1')
  div1.addEventListener('click', function(e) {
    const target = e.target
    if (e.nodeName === 'A') {
      console.log(target.innerHTML)
    }
  })
  ```
- $.proxy
  ```js
  $('#div').click(function() {
    setTimeout($.proxy(function() {
      $(this).css('background-color', 'yellow')
    }, this), 1000)
  })
  ```
- ES6 Proxy
  ```js
  // 明星
  const star = {
    name: '周杰伦',
    age: 35,
    phone: 'star: 18888888888'
  }

  const agent = new Proxy(star, {
    get: function(target, key) {
      if (key === 'phone') {
        return 'agent: 16666666666'
      }
      if (key === 'price') {
        return 120000
      }
      return target[key]
    },
    set: function(target, key, val) {
      if (key === 'customPrice') {
        if (val < 90000) {
          throw new Error('money no enough')
        } else {
          target[key] = val
          return true
        }
      }
      target[key] = val
    }
  })

  console.log(agent.name)
  console.log(agent.age)
  console.log(agent.phone)
  console.log(agent.price)

  agent.customPrice = 150000
  console.log(agent.customPrice)
  ```

`设计原则验证`
- 代理类和目标类分离，隔离开目标类和使用者
- 符合开放封闭原则

`代理模式 vs 适配器模式 vs 装饰器模式`
- 适配器模式：提供一个不同的接口（如不同版本的插头，想使用旧接口，但需要经过一层转换），
- 代理模式： 提供一模一样的接口，显示原有功能，但是经过限制或阉割之后的
- 装饰器模式：扩展功能，原有功能不变且可以直接使用

### 第九章 外观模式

`介绍`
- 为子系统中的一组接口提供了一个高层接口
- 使用者使用这个高层接口

`示例`

去医院看病，接待员去挂号、门诊、划价、取药

业务上情况比较多，例如一个系统提供了很多接口，如果有多个使用者调用这些接口，就可能会比较乱，系统可以提供高层接口（Facade）来调用这些接口，使用者直接调用高层接口就可以了。

```js
function bindEvent(elem, event, selector, fn) {
  if (fn == null) {
    fn = selector
    selector = null
  }
  // do something
}

bindEvent(elem, 'click', '#div1', fn)
bindEvent(elem, 'click', fn)
```

`设计原则验证`
- 不符合单一职责原则和开放封闭原则，因此谨慎使用，不可滥用
---
### 第十章 观察者模式

`介绍`
- 发布 & 订阅
- 一对多也可以一对一

`示例`

点咖啡，点好之后坐等被叫

```js
// 主题，保存状态，状态变化之后触发所有观察者对象
class Subject {
  constructor() {
    this.state = 0
    this.observers = []
  }

  getState() {
    return this.state
  }
  setState(state) {
    this.state = state
    this.notifyAllObservers()
  }
  // 触发所有观察者对象
  notifyAllObservers() {
    this.observers.forEach(observer => {
      observer.update()
    })
  }
  // 添加新的观察者对象
  attach(observer) {
    this.observers.push(observer)
  }
}

class Observer {
  constructor(name, subject) {
    this.name = name
    this.subject = subject
    this.subject.attach(this)
  }

  update() {
    console.log(`${this.name} observer have update: ${this.subject.getState()}`)
  }
}

const s = new Subject()
const o1 = new Observer('o1', s)
const o2 = new Observer('o2', s)
const o3 = new Observer('o3', s)

s.setState(1)
s.setState(2)
s.setState(3)
```

`场景`
- 网页事件绑定
  ```html
  <button id="btn1">btn</button>
  <script>
    $('#btn1').click(function() {
      console.log(1)
    })
    $('#btn1').click(function() {
      console.log(2)
    })
    $('#btn1').click(function() {
      console.log(3)
    })
  </script>
  ```
- Promise
- jQuery callbacks
  ```js
  const callbacks = $.Callbacks() // 注意大小写
  callbacks.add(function(info) {
    console.log('fn1', info)
  })
  callbacks.add(function(info) {
    console.log('fn2', info)
  })
  callbacks.add(function(info) {
    console.log('fn3', info)
  })
  callbacks.fire('gogogo')
  callbacks.fire('fire')
  ```
- nodejs自定义事件
  ```js
  const EventEmitter = require('events').EventEmitter
  const emitter = new EventEmitter()

  emitter.on('some', info => {
    console.log('fn1', info)
  })
  emitter.on('some', info => {
    console.log('fn2', info)
  })

  emitter.emit('some', 'event emitter')
  ```

`设计原则验证`
- 主题和观察者分离，不是主动触发而是被动监听，两者解耦
- 符合开放封闭原则
---
### 第十一章 迭代器模式

`介绍`
- 顺序访问一个集合
- 使用者无需知道集合的内部结构（封装）



```js
class Iterator {
  constructor(container) {
    this.list = container.list 
    this.index = 0
  }
  next() {
    if (this.hasNext()) {
      return this.list[this.index++]
    }
    return null
  }

  hasNext() {
    if (this.index >= this.list.length) {
      return false
    }
    return true
  }
}

class Container {
  constructor(list) {
    this.list = list
  }
  getIterator() {
    return new Iterator(this)
  }
}

const container = new Container([1, 2, 3, 4, 5, 6, 7, 8])
const iterator = container.getIterator(container)
while(iterator.hasNext()) {
  console.log(iterator.next())
}
```

`场景`
- jQuery each
  ```js
  const arr = [1, 2, 3]
  const nodeList = document.getElementByTagName('a')
  const $a = $('a')

  function each(data) {
    const $data = $(data)
    $data.each((key, item) => {
      console.log(key, item)
    })
  }

  each(arr)
  each(nodeList)
  each($a)

  // arr.forEach((item) => {
  //   console.log(item)
  // })

  // let i = 0; len = nodeList.length
  // for (i < len; i++) {
  //   console.log(nodeList[i])
  // }

  // $a.each(function(key, item) {
  //   console.log(key, item)
  // })
  ```
- ES6 Iterator

  - ES6语法中，有序集合的数据类型已经有很多（Array Map Set String TypeArray arguments NodeList）
  - 需要有一个统一的遍历接口来遍历所有数据类型（注意，object不是有序结合，可以用Map代替）
  - 以上数据类型，都有[Symbol.iterator]属性
  - 属性值是函数，执行函数返回一个迭代器
  - 这个迭代器就有next方法，可顺序迭代子元素
  - 可运行Array.prototype[Symbol.iterator]来测试

  ```js
  Array.prototype[Symbol.iterator]
  // f value() { [native code] }
  Array.prototype[Symbol.iterator]()
  // Array Iterator{}
  Array.prototype[Symbol.iterator]().next()
  // { value: undefined, done: true } 
  // done判断是否还可以遍历
  ```
  ES6 Iterator

  ```js
  // function each(data) {
  //   const iterator = data[Symbol.iterator]()

  //   let item = { done: false }
  //   while(!item.done) {
  //     item = iterator.next()
  //     if (!item.done) {
  //       console.log(item.value)
  //     }
  //   }
  // }

  // 带有Symbol.iterator属性的集合可以直接用for...of遍历
  function each(data) {
    for (let item of data) {
      console.log(item)
    }
  }

  const arr = [1, 2, 3]
  const nodeList = document.getElementsByTagName('p')
  const m = new Map()
  m.set('a', 100)
  m.set('b', 200)

  each(arr)
  each(nodeList)
  each(m)
  ```

`ES6 Iterator 与 Generator`
- Iterator的价值不限于上述几种类型的遍历
- 还有Generator函数的使用
- 即返回的数据符合Iterator接口的要求，即可使用Iterator语法，这就是迭代器模式

```js
// generator
function* helloworldGenerator() {
  yield 'hello'
  yield 'world'
  return 'ending'
}

const hw = helloworldGenerator()
hw[Symbol.iterator]
// f [Symbol.iterator]() { [native code] }
// 可以看到Generator函数返回的结果，也实现了Iterator接口
// 可以调用next() 方法，也可以用 for...of 遍历
// 但是 Generator 使用场景已经不多了
```
`设计原则验证`
- 迭代器对象和目标对象分离
- 迭代器将使用者与目标对象隔离开
- 符合开放封闭原则
---

### 第十二章 状态模式

`介绍`
- 一个对象有状态
- 每次状态变化都会触发一个逻辑
- 不能总是用 if...else 来控制

`示例`
- 红绿灯变化

```js
// 状态
class State {
  constructor(color) {
    this.color = color
  }
  handle(context) {
    console.log(`turn light to ${this.color}`)
    context.setState(this)
  }
}

// 主体
class Context {
  constructor() {
    this.state = null
  }
  getState() {
    return this.state
  }

  setState(state) {
    this.state = state
  }
}

const context = new Context()
const red = new State('red')
const green = new State('green')
const yellow = new State('yellow')

red.handle(context)
console.log(context.getState())
green.handle(context)
console.log(context.getState())
yellow.handle(context)
console.log(context.getState())
```

`场景`
- 有限状态机：有限个状态、以及在这些状态之间的变化，如交通信号灯、收藏与取消收藏，可以使用第三方库，如javascript-state-machine
- 实现简单的Promise: Promise有三个装，pending, fullfilled, rejected,可以pending到fullfilled,可以pending到rejected，状态不可逆向变化。
  - Promise是一个class
  - Promise需要传入一个函数
  - 函数需要传入resolve和reject两个函数
  - Promise还要有then方法

  ```js
  import StateMachine from 'javascript-state-machine'

  const fsm = new StateMachine({
    init: 'pending',
    transitions: [
      {
        name: 'resolve',
        from: 'pending',
        to: 'fullfilled'
      },
      {
        name: 'reject',
        from: 'pending',
        to: 'rejected'
      }
    ],
    methods: {
      onResolve: function(data) {
        // data为fsm.resolve(xxx)传进来的参数
        data.successList.forEach(fn => fn())
      },
      onReject: function(data) {
        data.failList.forEach(fn => fn())
      }
    }
  })

  class MyPromise {
    constructor(fn) {
      this.successList = []
      this.failList = []

      fn(() => {
        fsm.resolve(this)
      },() => {
        fsm.reject(this)
      })
    }

    then(successFn, failFn) {
      this.successList.push(successFn)
      this.failList.push(failFn)
    }
  }

  function loadImg(src) {
    const promise = new MyPromise(function(resolve, reject) {
      const img = new Image()
      img.onload = function() {
        resolve()
      }
      img.onerror = function() {
        reject()
      }
      img.src = src
    })
    return promise
  }

  const src = 'https://s1.8591.com.tw/img/index/logo.png'
  const result = loadImg(src)
  result.then(function() {
    console.log('ok1')
  }, function() {
    console.log('fail1')
  })

  result.then(function() {
    console.log('ok2')
  }, function() {
    console.log('fail2')
  })
  ```

`设计原则验证`
- 将状态对象和主题对象分离，状态的变化逻辑单独处理
- 符合开放封闭原则
---

### 第十三章 其他设计模式

#### 原型模式

`用意`

如果new一个对象实例开销很大，就可以考虑通过原型模式来clone一个新的对象。

clone自己，生成一个新对象。Java默认有clone接口，不用自己实现。

JS中的应用是Object.create，基于一个原型创建对象

```js
const prototype = {
  getName: function() {
    return this.firstName + ' ' + this.lastName
  },
  say: function() {
    alert('hello')
  }
}

const x = Object.create(prototype)
x.firstName = 'A'
x.lastName = 'B'
alert(x.getName())
x.say()

const y = Object.create(prototype)
y.firstName = 'D'
y.lastName = 'D'
alert(y.getName())
y.say()
```

`对比JS中的原型prototype`
- prototype可以理解为ES6 class的一种底层原理
- 而class是实现面向对象的基础，并不是服务于某个模式
- 若干年后ES6全面普及，大家可能会忽略掉prototype
- 但Object.create却会长久存在，因为是一种原型模式的实现

#### 桥接模式

`介绍`
- 用于把抽象化和实现化解耦
- 使得二者可以独立变化

`示例`

画图，画三角形和圆形，并分别填充不同颜色

```js
class Color {
  constructor(name) {
    this.name = name
  }
}

class Shape {
  constructor(name, color) {
    this.name = name
    this.color = color
  }
  draw() {
    console.log(`${this.color.name} ${this.name}`)
  }
}
const red = new Color('red')
const yellow = new Color('yellow')
const circle = new Shape('circle', red)
circle.draw()
const triangle = new Shape('triangle', yellow)
triangle.draw()
```

`设计原则验证`
- 抽象和实现分离、解耦    
- 符合开放封闭原则

#### 组合模式

`介绍`
- 生成树形结构，表示“整体-部分”关系
- 让整体和部分都具有一致的操作方式

`示例`
- 文件夹
- 虚拟Dom中的vnode，但数据类型比较简单
> 整体和单个节点的操作是一致的，整体和单个节点的数据结构也保持一致

`设计原则验证`
- 将整体和单个节点的操作抽象出来
- 符合开放封闭原则

#### 享元模式（共享元数据）

`介绍`
- 共享内存（主要考虑内存，而非效率）
- 相同的数据，共享使用
- 场景访问页面，服务器只有一份或者页面中要给很多子元素绑定事件，可以绑定到父元素中

`设计原则验证`
- 将相同的部分抽象出来
- 符合开放封闭原则

#### 策略模式

`介绍`
- 不同策略分开处理
- 避免出现大量 if...else或 switch...case

`示例`

不同身份的用户购买，打折

```js
class OrdinaryUser {
  buy() {
    console.log('ordinary user')
  }
}

class MemberUser {
  buy() {
    console.log('member user')
  }
}
class VipUser {
  buy() {
    console.log('vip user')
  }
}

const u1 = new OrdinaryUser()
u1.buy()
const u2 = new MemberUser()
u2.buy()
const u3 = new VipUser()
u3.buy()
```

`设计原则验证`
- 不同策略，分开处理，而不是混合在一起
- 符合开放封闭原则

#### 模板方法模式

对业务上有特殊顺序执行的程序给封装到一个函数中。

```js
class Action {
  handle() {
    handle1()
    handle2()
    handle3()
  }

  handle1() {
    console.log('handle1')
  }
  handle2() {
    console.log('handle2')
  }
  handle3() {
    console.log('handle3')
  }
}
```

#### 职责链模式

`介绍`
- 一步操作可能分为多个职责角色完成
- 把这些角色都分开，然后用一个链串起来
- 将发起者和各个处理进行隔离

```js
// 模拟请假审批
class Action {
  constructor(name) {
    this.name = name
    this.nextAction = null
  }

  setNextAction(action) {
    this.nextAction = action
  }

  handle() {
    console.log(`${this.name} 审批`)
    if (this.nextAction != null) {
      this.nextAction.handle()
    }
  }
}

const a1 = new Action('组长')
const a2 = new Action('经理')
const a3 = new Action('总监')
a1.nextAction(a2)
a2.nextAction(a3)
a1.handle()
```

`设计原则验证`
- 发起者于各个矗立着进行隔离
- 符合开放封闭原则

#### 命令模式

`介绍`
- 执行命令时，发布者和执行者分开
- 中间加入命令对象，作为中转站

```js
class Receiver {
  exec() {
    console.log('执行')
  }
}

class Command {
  constructor(receiver) {
    this.receiver = receiver
  }
  cmd() {
    console.log('触发命令')
    this.receiver.exec()
  }
}

class Invoker {
  constructor(command) {
    this.command = command
  }
  invoke() {
    console.log('开始')
    this.command.cmd()
  }
}

const soldier = new Receiver()
const trumpeter = new Command(soldier)
const general = new Invoker(trumpter)
general.invoke()
```

`设计原则验证`
- 命令对象与执行对象分开，解耦
- 符合开放封闭原则

#### 备忘录模式

`介绍`
- 随时记录一个对象状态变化
- 随时可以恢复之前的某个状态（如撤销功能）

```js
// 备忘类
class Momento {
  constructor(content) {
    this.content = content
  }
  getContent() {
    return this.content
  }
}

// 备忘列表
class CareTaker {
  constructor() {
    this.list = []
  }
  add(momento) {
    this.list.push(momento)
  }
  get(index) {
    return this.list[index]
  }
}

// 编辑器
class Editor {
  constructor() {
    this.content = null
  }

  setContent(content) {
    this.content = content
  }

  getContent() {
    return this.content
  }

  saveContentToMomento() {
    return new Momento(this.content)
  }

  getContentFromMomento(momento) {
    this.content = momento.getContent
  }
}

const editor = new Editor()
const careTaker = new CareTaker()
editor.setContent('111')
editor.setContent('222')
careTaker.add(editor.saveContentToMomento())
editor.setContent('333')
careTaker.add(editor.saveContentToMomento())
editor.setContent('444')

console.log(editor.getContent())
editor.getContentFromMomento(careTaker.get(1))
console.log(editor.getContent())
editor.getContentFromMomento(careTaker.get(0))
console.log(editor.getContent())
```

`设计原则验证`
- 状态对象与使用者分开、解耦
- 符合开放封闭原则


#### 中介者模式
```js
class A {
  constructor() {
    this.number = 0
  }
  setNumber(num, m) {
    this.number = num
    if (m) {
      m.setB()
    }
  }
}

class B {
  constructor() {
    this.number = 0
  }
  setNumber(num, m) {
    this.number = num
    if (m) {
      m.setA()
    }
  }
}
class Mediator {
  constructor(a, b) {
    this.a = a
    this.b = b
  } 
  setA() {
    const number = this.b.number
    this.a.setNumber(number / 100)
  }
  setB() {
    const number = this.a.number
    this.b.setNumber(number * 100)
  }
}

const a = new A()
const b = new B()
const m = new Mediator(a, b)
a.setNumber(100, m)
console.log(a.number, b.number)
b.setNumber(100, m)
console.log(a.number, b.number)

```

`设计原则验证`
- 状各关联对象通过中介者隔离
- 符合开放封闭原则

#### 访问者模式

`介绍`
- 将数据操作和数据结构进行分离
- 使用场景不多

#### 解释器模式

`介绍`
- 描述语言语法如何定义，如何解释和编译
- 用于专业场景

### 综合应用

`使用jQuery做一个模拟购物车的示例`

功能包括：
- 显示购物列表
- 加入购物车
- 从购物车删除

设计模式使用：
- 工厂模式、单例模式
- 装饰器模式、观察者模式
- 状态模式、模板方法模式、代理模式

安装**http-server**

```bash
npm install http-server -g
```

在src目录下新建demo文件夹，在demo文件夹新建api，在api文件夹创建list.json
```json
[
  {
    "id": 1,
    "name": "javascript 设计模式1",
    "price": 149,
    "discount": 1
  },
  {
    "id": 2,
    "name": "javascript 设计模式2",
    "price": 299,
    "discount": 0
  }
]
```

在api文件夹下启动8880端口的服务
```bash
http-server -p 8880
```

修改webpack.dev.config.js的devServer，配置代理

```js
devServer: {
  contentBase: path.join(__dirname, './release'), // 根目录
  open: true, // 是否自动打开浏览器
  port: 9000,
  proxy: {
    '/api/*': {
      target: 'http://localhost:8880'
    }
  }
}
```

文件目录结构
```
|-- index.html
|-- src
    |-- demo
        |-- api
            |-- list.json // 模拟后端数据
        |-- config
            |-- config.js // 请求路径
        |-- List
            |-- CreateItem.js // 使用工厂模式创建数据信息，代理模式处理数据折扣信息
            |-- Item.js // 处理后端数据
            |-- List.js // 购物车列表
        |-- ShoppingCart
            |-- GetCart.js // 使用单例模式创建购物车实例
            |-- ShoppingCart.js // 购物车
        |-- utils
            |-- log.js // 装饰器，统一处理日志记录
        |-- App.js
    |-- index.js
```

`index.html`
```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Javascript Design Patterns</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

`index.js`app初始化

```js
import App from './demo/App.js'

const app = new App('app')
app.init()
```

`config.js`

```js
export const GET_LIST = '/api/list.json'
```

`CreateItem.js`
```js
import Item from './Item'

function createDiscount(itemData) {
  // 用代理做折扣显示
  return new Proxy(itemData, {
    get: function(target, key) {
      if (key === 'name') {
        return `${target[key]} 【折扣】`
      }
      if (key === 'price') {
        return target[key] * 0.88
      }
      return target[key]
    }
  })
}

// 工厂函数
export default function(list, itemData) {
  if (itemData.discount) {
    itemData = createDiscount(itemData)
  }
  return new Item(list, itemData)
}
```

`Item.js`
```js
import $ from 'jquery'
import getCart from '../ShoppingCart/GetCart'
import StateMachine from 'javascript-state-machine'
import { log } from '../utils/log'

export default class Item {
  constructor(list, data) {
    this.$el = $('<div>')
    this.list = list
    this.data = data
    this.cart = getCart()
  }

  initContent() {
    const data = this.data
    const $el = this.$el
    $el.append(`<p>名称：${data.name}</p>`)
    $el.append(`<p>价格：${data.price}</p>`)
  }

  initBtn() {
    const $el = this.$el
    const $btn = $('<button>')
    const _this = this
    const fsm = new StateMachine({
      init: '加入购物车',
      transitions: [
        {
          name: 'addToCart',
          from: '加入购物车',
          to: '从购物车删除'
        },
        {
          name: 'deleteFromCart',
          from: '从购物车删除',
          to: '加入购物车'
        }
      ],
      methods: {
        onAddToCart: function() {
          _this.addToCartHandle()
          updateText()
        },
        onDeleteFromCart: function() {
          _this.deleteFromCartHandle()
          updateText()
        }
      }
    })

    function updateText() {
      $btn.text(fsm.state)
    }

    $btn.click(() => {
      if (fsm.is('加入购物车')) {
        // 添加购物车
        fsm.addToCart()
      } else {
        // 删除购物车
        fsm.deleteFromCart()
      }
    })
    updateText()
    $el.append($btn)
  }
  
  @log('add')
  addToCartHandle() {
    this.cart.add(this.data)
  }

  @log('del')
  deleteFromCartHandle(){
    this.cart.del(this.data.id)
  }

  render() {
    this.list.$el.append(this.$el)
  }

  init() {
    this.initContent()
    this.initBtn()
    this.render()
  }
}
```

`List.js`
```js
import $ from 'jquery'
import { GET_LIST } from '../config/config'
import createItem from './CreateItem'

export default class List {
  constructor(app) {
    this.app = app
    this.$el = $('<div>')
  }

  // 加载数据
  loadData() {
    return fetch(GET_LIST).then(result => {
      return result.json()
    })
  }

  initItemList(data) {
    data.forEach(itemData => {
      const item = createItem(this, itemData)
      item.init()
    })
  }

  // 渲染
  render() {
    this.app.$el.append(this.$el)
  }

  // 初始化
  init() {
    this.loadData().then(data => {
      this.initItemList(data)
    }).then(() => {
      this.render()
    })
  }
}
```

`GetCart.js`生成购物车缓存实例对象
```js
class Cart {
  constructor() {
    this.list = []
  }

  add(data) {
    this.list.push(data)
  }

  del(id) {
    this.list = this.list.filter(item => {
      if (item.id === id) {
        return false
      }
      return true
    })
  }

  getList() {
    return this.list.map(item => {
      return item.name
    }).join('\n')
  }
}

// 返回单例，购物车只有一个
const getCart = (function() {
  let cart
  return function() {
    if (!cart) {
      cart = new Cart()
    }
    return cart
  }
})()

export default getCart
```

`ShoppingCart.js`购物车
```js
import $ from 'jquery'
import getCart from './GetCart'

export default class ShoppingCart {
  constructor(app) {
    this.$el = $('<div>').css({
      'padding-bottom': '30px',
      'border-bottom': '1px solid #ccc'
    })
    this.app = app
    this.cart = getCart()
  }

  initBtn() {
    const $btn = $('<button>è´­ç‰©è½¦</button>')
    $btn.click(() => {
      this.showCart()
    })
    this.$el.append($btn)
  }

  showCart() {
    alert(this.cart.getList())
  }

  render() {
    this.app.$el.append(this.$el)
  }

  init() {
    this.initBtn()
    this.render()
  }
}
```

`log.js`日志装饰器

```js
export function log(type) {
  return function(target, name, descriptor) {
    const oldValue = descriptor.value
    descriptor.value = function() {
      // 统一打印日志
      console.log(`日志上报 ${type}`)
      // 调用原来的函数
      return oldValue.apply(this, arguments)
    }
    return descriptor
  }
}
```

`App.js`
```js
import $ from 'jquery'
import ShoppingCart from './ShoppingCart/ShoppingCart'
import List from './List/List'

export default class App {
  constructor(id) {
    this.$el = $('#' + id)
  }

  initShoppingCart() {
    const shoppingCart = new ShoppingCart(this)
    shoppingCart.init()
  }

  initList() {
    const list = new List(this)
    list.init()
  }

  init() {
    this.initShoppingCart()
    this.initList()
  }
}
```


