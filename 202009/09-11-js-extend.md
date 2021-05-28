## 2020-09-11

## JavaScript 实现继承的方式

JavaScript实现继承的方式
- 原型链继承
- 构造函数继承
- 组合继承
- 寄生组合式继承
- extends继承

### 原型链继承

```js
function Animal() {
  this.name = 'animal'
  this.type = ['pig', 'cat']
}

Animal.prototype.greet = function(sound) {
  console.log(sound)
}

function Dog() {
  this.name = 'dog'
}

Dog.prototype = new Animal()

var dog = new Dog()
console.log(dog.name) // dog
console.log(dog.type) // ['pig', 'cat']
dog.greeting('旺旺') // 汪汪
```

原理：

在实例化一个类时，新创建的对象复制了父类的构造函数内的属性与方法并且将原型**__proto__**指向了父类的原型对象，这样就拥有了父类的原型对象上的属性与方法。

缺点一：引用缺陷
```js
dog.type.push('dog')

var dog2 = new Dog()
console.log(dog2.type) // ["dog", "cat", "dog"]
```

通过dog实例对象修改继承自Animal中的数组type(引用类型)时，另外一个新创建的实例dog2也会受到影响。

缺点二：无法为不同的实例初始化继承来的属性

```js
function Animal(color) {  
  this.color = color
}
...


Dog.prototype = new Animal('白色')
...

console.log(dog.color); // "白色"
console.log(do2.color); // "白色"

```
无法为不同dog赋值不同的颜色，所有dog只能同一种颜色

### 构造函数继承

```js
// 声明父类
function Animal(color) {
  this.name = 'animal';
  this.type = ['pig','cat'];
  this.color = color;
}

// 添加共有方法
Animal.prototype.greet = function(sound) {
  console.log(sound);
}

// 声明子类
function Dog(color) {
  Animal.apply(this, arguments)
}

var dog = new Dog('白色');
var dog2 = new Dog('黑色');

dog.type.push('dog');
console.log(dog.color);  // "白色"
console.log(dog.type);  // ["pig", "cat", "dog"]

console.log(dog2.color);  // "黑色"
console.log(dog2.type);  // ["pig", "cat"]
```

缺点是：无法获取父类的共有方法，也就是通过原型**prototype**绑定的方法

```js
dog.greet();  // Uncaught TypeError: dog.greet is not a function
```

### 组合继承

组合继承其实就是将原型继承和构造函数继承组合在一起

```js
function Animal(color) {
  this.name = 'animal'
  this.type = ['pig', 'cat']
  this.color = color
}

Animal.prototype.greeting = function(sound) {
  console.log(sound)
}

function Dog(color) {
  Animal.apply(this, arguments)
}

Dog.prototype = new Animal()

var dog = new Dog('白色')
var dog2 = new Dog('黑色')

dog.type.push('dog');   
console.log(dog.color); // "白色"
console.log(dog.type);  // ["pig", "cat", "dog"]
dog.greet('汪汪');  // "汪汪"

console.log(dog2.type); // ["pig", "cat"]
console.log(dog2.color);  // "黑色"
```

组合继承唯一的小缺点是需要调用两次父类的构造函数。

### 原型式继承

就是ES5 Object.create的模拟实现，将传入的对象作为创建的对象的原型。

缺点：包含引用类型的属性值始终都会共享相应的值，这点跟原型链继承一样。

```js
function createObj(o) {
  function F() {}
  F.prototype = o
  return new F()
}
```

```js
var person = {
    name: 'kevin',
    friends: ['daisy', 'kelly']
}

var person1 = createObj(person);
var person2 = createObj(person);

person1.name = 'person1';
console.log(person2.name); // kevin

person1.firends.push('taylor');
console.log(person2.friends); // ["daisy", "kelly", "taylor"]
```
注意：修改person1.name的值，person2.name的值并未发生改变，并不是因为person1和person2有独立的 name 值，而是因为person1.name = 'person1'，给person1添加了 name 值，并非修改了原型上的 name 值。

### 寄生组合式继承

寄生组合式继承强化的部分就是在组合继承的基础上减少一次多余的调用父类的构造函数

```js
function Animal(color) {
  this.name = 'animal'
  this.type = ['pig', 'cat']
  this.color = color
}

Animal.prototype.greeting = function(sound) {
  console.log(sound)
}

function Dog(color) {
  Animal.apply(this, arguments)
}

Dog.prototype = Object.create(Animal.prototype)
Dog.prototype.contructor = Dog
// 扩展方法
Dog.prototype.getName = function(){
  console.log(this.name)
}

var dog = new Dog('白色')
var dog2 = new Dog('黑色')

dog.type.push('dog');   
console.log(dog.color); // "白色"
console.log(dog.type);  // ["pig", "cat", "dog"]
dog.greet('汪汪');  // "汪汪"

console.log(dog2.type); // ["pig", "cat"]
console.log(dog2.color);  // "黑色"
```

使用Object.create()进行一次浅拷贝，将父类原型上的方法拷贝后赋给Dog.prototype，这样子类上就能拥有了父类的共有方法，可以少一次调用父类的构造函数。


Object.create()的浅拷贝的作用类式下面的函数：

```js
function create(obj) {
  function F() {};
  F.prototype = obj;
  return new F();
}
```

### extends继承

Class和extends是在ES6中新增的，Class用来创建一个类，extends用来实现继承：

```js
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  constructor(name) {
    super(name); // 调用超类构造函数并传入name参数
  }

  speak() {
    console.log(`${this.name} barks.`);
  }
}

var d = new Dog('Mitzie');
d.speak();// 'Mitzie barks.'
```
