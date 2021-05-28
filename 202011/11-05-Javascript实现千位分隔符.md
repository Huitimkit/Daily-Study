## 2020-11-5


## JavaScript实现千位分隔符

### 方法一

思路：
- 把数组转字符串，判断是否有小数
  - 有小数，根据小数点，分割整数部分以及小数部分，处理不同的部分
  - 无小数，即整数部分，倒序数组，每三位数追加一个逗号，最后反转

```js
function numformat(num) {
  const arr = num.toString().split('.')
  const int = arr[0].split('').reverse()
  const res = []
  for(let i = 0; i < int.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      res.push(',')
    }
    res.push(int[i])
  }
  const str = res.reverse().join('')
  return arr[1] ? str + '.' + arr[1] : str
}
```

### 方法二

使用JS自带的函数 toLocaleString

```js
const a = 123456789
const b = 1234.56789
console.log(a.toLocaleString()) // 123,456,789
console.log(b.toLocaleString()) // 1,234.568
```

>需要注意的是，如果小数点超过三位，会四舍五入只留下三位

### 方法三

使用正则

```js
function numformat(num) {
  return num.toString().replace(/\d+/, function(n) {
    return n.replace(/(\d)(?=(\d{3})+$)/g, function($1) {
      return $1 + ','
    })
  })
}
```