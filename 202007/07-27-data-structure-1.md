## 2020-07-27

## JavaScript 版数据结构与算法

重点关注：数据结构与算法的特点、应用场景、JS 实现、时间/空间复杂度

### 第 1 章 数据结构与算法简介

数据结构：计算机存储、组织数据的方式，就像锅碗瓢盆

算法：一系列解决问题的清晰指令，就像食谱

程序 = 数据结构 + 算法

数据结构为算法提供服务，算法围绕数据结构操作

常用数据结构：

- 栈、队列、链表（顺序）
- 集合、字典（无序）
- 树、堆、图

### 第 2 章 时间/空间复杂度计算

`时间复杂度是什么？`

- 一个函数，用大 O 表示，比如 O(1)、O(n)、O(logN)....
- 定性的描述该算法的运行时间，这里表示程序随着规模的变化，运行时间的时间趋势
  O(1) < O(logN) < O(√n) < O(n) < O(nlogN) < O(n^2) < O(2^n) < O(n!)

O(logN)时间复杂度例子：

```js
let i = 1;
while (i < n) {
  console.log(i);
  i *= 2;
}
```

`空间复杂度是什么？`

- 一个函数，用大 O 表示，比如 O(1)、O(n)、O(n^2)....
- 算法在运行过程中临时占用存储空间大小的量度

### 第 3 章 数据结构之“栈”

`3-1 栈简介`

一种后进先出的存储方式

Javascript 没有栈结构，通过 Array 来实现，Javascript Array 有 push 和 pop 方法

```js
const stack = [];
stack.push(1);
stack.push(2);
const item1 = stack.pop();
const item2 = stack.pop();
```

> vscode 调试小技巧，vscode 集成 nodejs 运行环境，可以在程序前面打断点，再按**F5**就可以自动从头执行程序

`3-2 什么场景下用栈`

- 需要**后进先出**的场景
- 比如：十进制转二进制、判断字符串的括号是否有效、函数调用堆栈

#### 场景一：十进制转二进制

```
 2 |     3 5        余数
  2 |    1 7 ------- 1  （低位）
   2 |     8 ------- 1
    2 |    4 ------- 0
     2 |   2 ------- 0
      2 |  1 ------- 0
           0 ------- 1  （高位）
```

- 后出来的余数反而要排在前面
- 把余数依次入栈，然后出栈，就可以实现余数倒序输出

#### 场景二：有效的括号

```
((((()))))   --- VALID
() () () ()  --- VALID
(((((()      --- INVALID
((()(())))   --- VALID
```

- 越靠后的左括号，对应的右括号越靠前
- 左括号入栈，右括号出栈，最后栈空了就是合法的

#### 场景三：函数的调用堆栈

```js
function greeting() {
  //[1] some code here
  sayHi();
  //[2] some code here
}

function sayHi() {
  return "hi";
}

// 调用 greeting 函数
greeting();

//[3] some code here
```

- 最后调用的函数，最先执行完
- JS 解释器使用栈来控制函数的调用顺序

`LeetCode: 20.有效的括号`

解题步骤

- 新建一个栈
- 扫描字符串，遇左括号入栈，遇到和栈顶括号类型匹配的右括号就出栈，类型不匹配直接判断为不合法
- 最后栈空了就合法，否则不合法

```js
/**
 * @param {string} s
 * @return {boolean}
 */
// 使用栈的后进先出思路
var isValid = function (s) {
  // 如果字符串长度为奇数则不可能完全闭合
  if (s.length % 2 === 1) {
    return false;
  }

  const stack = [];

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "(" || c === "{" || c === "[") {
      stack.push(c);
    } else {
      const t = stack[stack.length - 1];
      if (
        (t === "(" && c === ")") ||
        (t === "{" && c === "}") ||
        (t === "[" && c === "]")
      ) {
        stack.pop();
      } else {
        // 说明括号不能闭合，直接return false
        return false;
      }
    }
  }

  // 最后判断一下栈的长度是否为空
  return stack.length === 0;
};
```

`总结`

所有后进先出的场景都可以考虑使用栈来实现

### 第 4 章 数据结构之“队列”

`4-1 队列简介`

- 一个先进先出的数据结构
- Javascript 中没有队列，但可以用 Array 实现队列的所有功能

```js
const queue = [];
queue.push(1);
queue.push(2);
const item1 = queue.shift();
const item2 = queue.shift();
```

`4-2 什么场景用队列`

- 需要先进先出的场景

#### 场景一：食堂排队打饭

- 食堂只留一个窗口，学生排队打饭
- 先进先出，保证有序

#### 场景二：JS 异步中的人物队列

- JS 是单线程，无法同时处理异步中的并发任务
- 使用任务列队先后处理异步任务

#### 场景三：计算最近请求次数

- 有新请求就入队，3000ms 前发出的请求出队
- 队列的长度就是最近请求次数

```
输入： inputs = [[], [1], [100], [3001], [3002]]
输出： [null, 1, 2, 3, 3]
```

解题步骤：

- 有新请求就入队，3000ms 前发出的请求出队
- 队列的长度就是最近请求次数

```js
// 时间复杂度和空间复杂度都是O(n)
var RecentCounter = function () {
  this.q = [];
};

/**
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function (t) {
  this.q.push(t);
  while (this.q[0] < t - 3000) {
    this.q.shift();
  }
  return this.q.length;
};
```

### 第 5 章 数据结构之“链表”

`5-1 链表简介`

- 多个元素组成的列表
- 元素存储不连续，用 next 指针连在一起

```js
const a = { val: "a" };
const b = { val: "b" };
const c = { val: "c" };
const d = { val: "d" };

a.next = b;
b.next = c;
c.next = d;

// 遍历
let p = a;
while (p) {
  console.log(p.value);
  p = p.next;
}

// 插入
const e = { val: "e" };
c.next = e;
e.next = d;

// 删除
c.next = d;
```

`5-2 LeetCode：237.删除链表中的节点`

请编写一个函数，使其可以删除某个链表中给定的（非末尾）节点。传入函数的唯一参数为 要被删除的节点 。

现有一个链表 -- head = [4,5,1,9]，它可以表示为:

![https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/01/19/237_example.png](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2019/01/19/237_example.png)

示例 1：

```
输入：head = [4,5,1,9], node = 5
输出：[4,1,9]
解释：给定你链表中值为 5 的第二个节点，那么在调用了你的函数之后，该链表应变为 4 -> 1 -> 9.
```

解题步骤

- 将被删节点的值改为下个节点的值
- 删除下个节点

```js
// 时间和空间复杂度都是O(1)
var deleteNode = function (node) {
  node.val = node.next.val;
  node.next = nodex.next.next;
};
```

`5-3 LeetCode：206.反转链表`

反转一个单链表。

示例:

```
输入: 1->2->3->4->5->NULL
输出: 5->4->3->2->1->NULL
```

解题步骤

- 双指针一前一后遍历链表，第一个指针记录遍历的位置，第二个指针记录新的链表
- 反转双指针

> 也就是不断将相邻的元素不断进行对换

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function (head) {
  let p1 = head;
  let p2 = null;
  while (p1) {
    const tmp = p1.next;
    p1.next = p2;
    p2 = p1;
    p1 = tmp;
  }
  return p2;
};
```

`5-3 LeetCode：92.Reverse Linked List II`

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
let successor = null;
var reverseN = function (head, m) {
  if (m === 1) {
    successor = head.next;
    return head;
  }
  const last = reverseN(head.next, m - 1);
  head.next.next = head;
  head.next = successor;
  return last;
};
var reverseBetween = function (head, left, right) {
  if (left === 1) {
    return reverseN(head, right);
  }
  head.next = reverseBetween(head.next, left - 1, right - 1);
  return head;
};
```

`5-4 LeetCode：2. 两数相加`

解题步骤

- 新建一个空链表
- 遍历被相加的两个链表，模拟相加操作，将个位数追加到新链表上，将十位数留到下一位去相加

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function (l1, l2) {
  let l3 = new ListNode(0);
  let p1 = l1;
  let p2 = l2;
  let p3 = l3;
  let carry = 0;
  while (p1 || p2) {
    const v1 = p1 ? p1.val : 0;
    const v2 = p2 ? p2.val : 0;
    const val = v1 + v2 + carry;
    carry = Math.floor(val / 10);
    p3.next = new ListNode(val % 10);
    if (p1) p1 = p1.next;
    if (p2) p2 = p2.next;
    // 不断向前推进
    p3 = p3.next;
  }
  if (carry) {
    // 最高位
    p3.next = new ListNode(carry);
  }
  return l3.next;
};
```

`5-5 LeetCode：83. 删除排序链表中的重复元素`

解题步骤：

- 遍历链表，如果发现当前元素和下一个元素值相同，就删除下个元素值
- 遍历结束后，返回原链表的头部

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
// 时间和空间复制度都是O(n)
var deleteDuplicates = function (head) {
  let p = head;
  while (p && p.next) {
    if (p.val === p.next.val) {
      p.next = p.next.next;
    } else {
      p = p.next;
    }
  }
  return head;
};
```

`5-6 LeetCode：141. 环形链表`

有三种方式：

- 硬做：设置在某个时间范围之内，如果遍历链表都得不到结果，说明没有环，一般设置 1s 或 0.5
- 用 set 去重，遍历链表，把经过的地方都存到 set 中，每遍历到一个节点就判断 set 是否存在该节点，有就是有环，时间复杂度是 O(n),
- 快慢指针，时间复杂度 O(n)，即以下解法

解题思路：

- 两个人在圆形操场上的起点同时起跑，速度快的人一定会超过速度慢的人一圈。
- 用一快一慢两个指针遍历链表，如果指针能够相逢，那么链表就有圈。

解题步骤：

- 用一快一慢两个指针遍历链表，如果指针能够相逢，就返回 true
- 遍历结束后，还没有相逢就返回 false

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
// 时间和空间复杂度都是O(n)
var hasCycle = function (head) {
  let p1 = head;
  let p2 = head;
  while (p1 && p2 && p2.next) {
    p1 = p1.next;
    p2 = p2.next.next;
    if (p1 === p2) {
      return true;
    }
  }
  return false;
};
```

`5-7 前端与链表：JS 中的原型链`

简介：

- 原型链的本质是链表
- 原型链上的节点就是各种原型对象，比如：Function prototype、Object prototype....
- 原型链通过**proto**属性连接各种原型对象

- obj -> Object.prototype -> null
- func -> Function.prototype -> null
- arr -> Array.prototype -> null

知识点：

- 如果 A 沿着原型链能找到 B.prototype，那么 A instanceof B 为 true

```js
// instanceof 原理
const instanceOf = (A, B) => {
  let p = A;
  while (p) {
    if (p === B.prototype) {
      return true;
    }
    p = p.__proto__;
  }
  return false;
};
```

`5-8 前端与链表：使用链表指针获取 JSON 的节点值`

```js
const json = {
  a: { b: { c: 1 } },
  d: { e: 2 },
};

const path = ["a", "b", "c"];

let p = json;
path.forEach((k) => {
  p = p[k];
});

console.log(p);
```

`5-9 链表-章节总结`

- 链表的元素存储不是连续的，之间通过 next 指针连接
- Javascript 中没有链表，但可以用 Object 模拟链表
- 链表常用操作：修改 next，遍历链表
- JS 中的原型链也是一个链表
- 使用链表指针可以获取 JSON 的节点值

### 第 6 章 数据结构之“集合”

` 6-1 集合简介`

Set 对象是值的集合，并且可以按照插入的顺序迭代它的元素

- 集合是一种无序且唯一的数据结构
- ES6 中有集合，名为 Set
- 集合的常用操作：去重、判断某元素是否在集合中、求交集
  >

```js
// 去重
const arr = [1, 1, 2, 2];
const arr2 = [...new Set(arr)];

// 判断是否在集合中
const set = new Set(arr);
const has = set.has(3); // false

// 求交集
const set2 = new Set([2, 3]);
const set3 = new Set([...set].filter((item) => set2.has(item)));
```

```js
let mySet = new Set();

mySet.add(1); // Set [ 1 ]
mySet.add(5); // Set [ 1, 5 ]
mySet.add(5); // Set [ 1, 5 ]
mySet.add("some text"); // Set [ 1, 5, "some text" ]
let o = { a: 1, b: 2 };
mySet.add(o);

mySet.add({ a: 1, b: 2 }); // o 指向的是不同的对象，所以没问题

mySet.has(1); // true
mySet.has(3); // false
mySet.has(5); // true
mySet.has(Math.sqrt(25)); // true
mySet.has("Some Text".toLowerCase()); // true
mySet.has(o); // true

mySet.size; // 5

mySet.delete(5); // true,  从set中移除5
mySet.has(5); // false, 5已经被移除

mySet.size; // 4, 刚刚移除一个值

console.log(mySet);
// logs Set(4) [ 1, "some text", {…}, {…} ] in Firefox
// logs Set(4) { 1, "some text", {…}, {…} } in Chrome
```

```js
// 迭代整个set
// 按顺序输出：1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2}
for (let item of mySet) console.log(item);

// 按顺序输出：1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2}
for (let item of mySet.keys()) console.log(item);

// 按顺序输出：1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2}
for (let item of mySet.values()) console.log(item);

// 按顺序输出：1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2}
//(键与值相等)
for (let [key, value] of mySet.entries()) console.log(key);

// 使用 Array.from 转换Set为Array
var myArr = Array.from(mySet); // [1, "some text", {"a": 1, "b": 2}, {"a": 1, "b": 2}]

// 如果在HTML文档中工作，也可以：
mySet.add(document.body);
mySet.has(document.querySelector("body")); // true

// Set 和 Array互换
mySet2 = new Set([1, 2, 3, 4]);
mySet2.size; // 4
[...mySet2]; // [1,2,3,4]

// 可以通过如下代码模拟求交集
let intersection = new Set([...set1].filter((x) => set2.has(x)));

// 可以通过如下代码模拟求差集
let difference = new Set([...set1].filter((x) => !set2.has(x)));

// 用forEach迭代
mySet.forEach(function (value) {
  console.log(value);
});

// 1
// 2
// 3
// 4
```

`6-2 LeetCode：349. 两个数组的交集`

解题思路：

- 求交集切无序唯一
- 使用集合

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
// 时间复杂度是O(n * m) 空间复杂度O(m)
var intersection = function (nums1, nums2) {
  return [...new Set(nums1)].filter((n) => nums2.includes(n));
};
```

`6-3 前端与集合：使用 ES6 中 Set`

Set 操作

- 使用 Set 对象：new、add、delete、has、size
- 迭代 Set：多种迭代方法、Set 与 Array 互转、求交集/差集

```js
let mySet = new Set();

mySet.add(1); // Set{ 1 }
mySet.add(5); // Set{ 1, 5 }
mySet.add("some text"); // Set{ 1, 5, 'some text' }

let o = { a: 1, b: 2, c: 3 };
mySet.add(o); // Set{ 1, 5, 'some text', Object }
mySet.add({ a: 1, b: 2, c: 3 }); // Set{ 1, 5, 'some text', Object, Object }

mySet.delete(5); // Set{ 1, 'some text', Object, Object }

const has = mySet.has("some text");

// 集合的value和key一样
for (let item of mySet) console.log(item);

for (let item of mySet.keys()) console.log(item);

for (let item of mySet.values()) console.log(item);

for (let [key, value] of mySet.entries()) console.log(key, value);
// 1 1
// some text some text
// ....

// 集合转数组
const myArr = [...mySet];
const myArr2 = Array.from(mySet);

// 数组转集合
const mySet2 = new Set([1, 2, 3, 4]);

// 交集
const intersection = new Set([...mySet].filter((x) => mySets.has(x)));
// 差集
const difference = new Set([...mySet].filter((x) => !mySets.has(x)));
```

### 第 7 章 数据结构之“字典”

`7-1 字典简介`

- 与集合类似，字典也是一种存储唯一值的数据结构，但它是以键值对的形式来存储
- ES6 中有字典，名为 Map
- 字典的常用操作：键值对的增删改查
- 使用场景是用来查询和计数

```js
const m = new Map();

// 增(键， 值)
m.set("a", "aa");
m.set("b", "bb");

// 删
// m.delete('b')
// 删除所有键值对
// m.clear()

// 改
m.set("a", "aaa");

// 查询
// has 返回一个布尔值
// get 返回键对应的值，如果不存在，则返回undefined。
m.has("c"); // false
m.get("c"); // undefined

// 使用for...of迭代map
for (let [key, value] of m) {
  console.log(key + " = " + value);
}
// 将会显示两个log。一个是"a = aa"另一个是"b = bb"

for (let key of m.keys()) {
  console.log(key);
}
// 将会显示两个log。 一个是 "a" 另一个是 "b"

for (let value of m.values()) {
  console.log(value);
}
// 将会显示两个log。 一个是 "aa" 另一个是 "bb"

for (let [key, value] of m.entries()) {
  console.log(key + " = " + value);
}
// 将会显示两个log。 一个是 "a = aa" 另一个是 "b = bb"

// 使用forEach
m.forEach(function (value, key) {
  console.log(key + " = " + value);
});
```

> JSON 和 Map 类似，它们的相同点：都是以键值对 key, value 的方式存储数据。Map 的 key 不仅可以是字符串，还可以是对象、数组。JSON 的 key 和 value 只支持 String(也可以存数值,但是数值存进去,取出来还是 String)，具体可以查看：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Map

`7-2 LeetCode：349. 两个数组的交集`

给定两个数组，编写一个函数来计算它们的交集。

示例 1：

```
输入：nums1 = [1,2,2,1], nums2 = [2,2]
输出：[2]
```

示例 2：

```
输入：nums1 = [4,9,5], nums2 = [9,4,9,8,4]
输出：[9,4]
```

用字典的映射关系来解题

- 求 nums1 和 nums2 都有的值
- 用字典建立一个映射关系，记录 nums 里有的值

```js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
// 时间复制度是O(n + m) 空间复杂度O(m)
var intersection = function (nums1, nums2) {
  const m = new Map();
  // 建立nums1的映射关系
  nums1.forEach((n) => {
    m.set(n, true);
  });

  const res = [];
  nums2.forEach((n) => {
    // 判断是否有交集
    if (m.get(n)) {
      res.push(n);
      m.delete(n);
    }
  });
  return res;
};
```

`7-3 LeetCode：20.有效的括号`

```js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  // 如果字符串长度为奇数则不可能完全闭合
  if (s.length % 2 === 1) {
    return false;
  }

  const stack = [];
  const map = new Map();
  map.set("(", ")");
  map.set("{", "}");
  map.set("[", "]");
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (map.has(c)) {
      stack.push(c);
    } else {
      const t = stack[stack.length - 1];
      if (map.get(t) === c) {
        stack.pop();
      } else {
        // 说明括号不能闭合，直接return false
        return false;
      }
    }
  }

  // 最后判断一下栈的长度是否为空
  return stack.length === 0;
};
```

`7-4 LeetCode：1. 两数之和`
给定一个整数数组 nums  和一个整数目标值 target，请你在该数组中找出 和为目标值 的那   两个   整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素不能使用两遍。

你可以按任意顺序返回答案。

示例 1：

```
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。
```

解题思路：

- 把 nums 想象成相亲者
- 把 target 想象成匹配条件

```js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
// 时间复杂度O(n), 空间复杂度O(n)
var twoSum = function (nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const n = nums[i];
    const n2 = target - n;
    if (map.has(n2)) {
      return [map.get(n2), i];
    } else {
      map.set(n, i);
    }
  }
};
```

`LeetCode 167. 两数之和 2- 输入有序数组`

给定一个已按照升序排列   的有序数组，找到两个数使得它们相加之和等于目标数。

函数应该返回这两个下标值 index1 和 index2，其中 index1  必须小于  index2。

说明:

返回的下标值（index1 和 index2）不是从零开始的。
你可以假设每个输入只对应唯一的答案，而且你不可以重复使用相同的元素。

示例:

```
输入: numbers = [2, 7, 11, 15], target = 9
输出: [1,2]
解释: 2 与 7 之和等于目标数 9 。因此 index1 = 1, index2 = 2 。
```

```js
/**
 * @param {number[]} numbers
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function (numbers, target) {
  // const map = new Map()
  // for (let i = 0; i < numbers.length; i++) {
  //     const n = numbers[i]
  //     const n2 = target - n
  //     if (map.has(n2)) {
  //         return [map.get(n2), i + 1]
  //     } else {
  //         map.set(n, i + 1)
  //     }
  // }

  // 由于输入数组是有序的，可以使用双指针时间复杂度O(n),空间复杂度是O(1)，比字典快
  let low = 0;
  let high = numbers.length - 1;
  while (low < high) {
    const sum = numbers[low] + numbers[high];
    if (sum === target) {
      return [low + 1, high + 1];
    } else if (sum < target) {
      low++;
    } else {
      high--;
    }
  }
  return [];
};
```

`LeetCode 653.两数之和 4 - 输入BST`

给定一个二叉搜索树和一个目标结果，如果 BST 中存在两个元素且它们的和等于给定的目标结果，则返回 true。

案例 1:

```
输入:
    5
   / \
  3   6
 / \   \
2   4   7

Target = 9

输出: True
```

解题思路：

- 由于二叉搜索树具有一定有序性，经过中序遍历之后，可以求出排好序的数组，再经过双指针就可以求出结果

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} k
 * @return {boolean}
 */
var findTarget = function (root, k) {
  const res = [];
  const inorder = (n) => {
    if (!n) {
      return;
    }

    inorder(n.left);
    res.push(n.val);
    inorder(n.right);
  };
  inorder(root);

  let low = 0;
  let high = res.length - 1;
  while (low < high) {
    const sum = res[low] + res[high];
    if (sum < k) {
      low++;
    } else if (sum > k) {
      high--;
    } else {
      return true;
    }
  }
  return false;
};
```

`LeetCode.15 三数之和`

给你一个包含 n 个整数的数组  nums，判断  nums  中是否存在三个元素 a，b，c ，使得  a + b + c = 0 ？请你找出所有和为 0 且不重复的三元组。

注意：答案中不可以包含重复的三元组。

示例 1：

```
输入：nums = [-1,0,1,2,-1,-4]
输出：[[-1,-1,2],[-1,0,1]]
```

方法一：还是用哈希表来记录目标值

```js
var threeSum = function (nums) {
  if (nums.length < 3) {
    return [];
  }

  const res = new Set();
  nums.sort();
  for (let i = 0; i < nums.length - 2; i++) {
    const n1 = nums[i];
    // 防重复
    if (i >= 1 && nums[i] == nums[i - 1]) {
      continue;
    }

    const map = {};
    for (let j = i + 1; j < nums.length; j++) {
      const n2 = nums[j];
      if (!map[n2]) {
        map[-n1 - n2] = 1;
      } else {
        res.add([n1, -n1 - n2, n2].join(","));
      }
    }
  }
  return [...res].map((n) => Array.from(n.split(","), (x) => x * 1));
};
```

方法二：用两个指针，一前一后进行滑动，判断是否有目标值

```js
var threeSum = function (nums) {
  if (nums.length < 3) {
    return [];
  }
  const res = [];
  nums.sort((a, b) => a - b);
  for (let i = 0; i < nums.length; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let l = i + 1;
    let r = nums.length - 1;
    while (l < r) {
      const sum = nums[i] + nums[l] + nums[r];
      if (sum < 0) {
        l += 1;
      } else if (sum > 0) {
        r -= 1;
      } else {
        res.push([nums[i], nums[l], nums[r]]);
        // 防止重复值
        while (l < r && nums[l] === nums[l + 1]) {
          l += 1;
        }
        l += 1;
        // 防止漏掉值
        r = nums.length - 1;
      }
    }
  }
  return res;
};
```

`7-5 LeetCode：3. 无重复字符的最长子串`

给定一个字符串，请你找出其中不含有重复字符的 最长子串 的长度。

解题思路

- 先找出所有的不包含重复字符串的子串
- 找出长度最大那个子串，返回其长度即可

```js
/**
 * @param {string} s
 * @return {number}
 */
// 时间复制度O(n), 空间复杂度O(m)m是字符串中不重复字符的个数
var lengthOfLongestSubstring = function (s) {
  const map = new Map();
  let res = 0;
  let l = 0;
  for (let r = 0; r < s.length; r++) {
    const c = s[r];
    if (map.has(c) && map.get(c) >= l) {
      l = map.get(c) + 1;
    }
    res = Math.max(res, r - l + 1);
    map.set(c, r);
  }
  return res;
};
```

`7-6 LeetCode：76. 最小覆盖子串`

解题思路

- 用双指针维护一个滑动窗口
- 移动右指针，找到包含 T 的子串，移动左指针，尽量减少包含 T 的子串的长度

```js
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
// 时间复杂度：O(m + n), m是t的长度，n是s的长度
// 空间复杂度：O(m)
var minWindow = function (s, t) {
  let l = 0;
  let r = 0;
  let res = "";
  const need = new Map();
  for (let c of t) {
    need.set(c, need.has(c) ? need.get(c) + 1 : 1);
  }
  let needType = need.size;
  while (r < s.length) {
    const c = s[r];
    if (need.has(c)) {
      need.set(c, need.get(c) - 1);
      if (need.get(c) === 0) needType -= 1;
    }
    while (needType === 0) {
      const newRes = s.substring(l, r + 1);
      if (!res || newRes.length < res.length) res = newRes;
      const c2 = s[l];
      if (need.has(c2)) {
        need.set(c2, need.get(c2) + 1);
        if (need.get(c2) === 1) needType += 1;
      }
      l += 1;
    }
    r += 1;
  }
  return res;
};
```

`LeetCode 239.滑动窗口最大值`

给你一个整数数组 nums，有一个大小为 k 的滑动窗口从数组的最左侧移动到数组的最右侧。你只可以看到在滑动窗口内的 k 个数字。滑动窗口每次只向右移动一位。

返回滑动窗口中的最大值。

示例 1：

输入：nums = [1,3,-1,-3,5,3,6,7], k = 3
输出：[3,3,5,5,6,7]
解释：
滑动窗口的位置 最大值

---

[1 3 -1] -3 5 3 6 7 3
1 [3 -1 -3] 5 3 6 7 3
1 3 [-1 -3 5] 3 6 7 5
1 3 -1 [-3 5 3] 6 7 5
1 3 -1 -3 [5 3 6] 7 6
1 3 -1 -3 5 [3 6 7] 7

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
// 双端队列 deque,始终保证slide存的是最大数的下标索引
var maxSlidingWindow = function (nums, k) {
  if (!nums.length) {
    return [];
  }

  const res = [];
  const slide = [];

  for (let i = 0; i < nums.length; i += 1) {
    if (i >= k && slide[0] <= i - k) {
      slide.shift();
    }
    while (slide.length && nums[slide[slide.length - 1]] <= nums[i]) {
      slide.pop();
    }

    slide.push(i);
    // 只有i = 2时才会开始执行
    if (i >= k - 1) {
      res.push(nums[slide[0]]);
    }
  }
  return res;
};
```

`450. 删除二叉搜索树中的节点`

给定一个二叉搜索树的根节点 root 和一个值 key，删除二叉搜索树中的  key  对应的节点，并保证二叉搜索树的性质不变。返回二叉搜索树（有可能被更新）的根节点的引用。

一般来说，删除节点可分为两个步骤：

首先找到需要删除的节点；
如果找到了，删除它。
说明： 要求算法时间复杂度为  O(h)，h 为树的高度。

示例:

```
root = [5,3,6,2,4,null,7]
key = 3

    5
   / \
  3   6
 / \   \
2   4   7

给定需要删除的节点值是 3，所以我们首先找到 3 这个节点，然后删除它。

一个正确的答案是 [5,4,6,2,null,null,7], 如下图所示。

    5
   / \
  4   6
 /     \
2       7

另一个正确答案是 [5,2,6,null,4,null,7]。

    5
   / \
  2   6
   \   \
    4   7

```

解题思路：[https://leetcode-cn.com/problems/delete-node-in-a-bst/solution/450-shan-chu-er-cha-sou-suo-shu-zhong-de-jie-dia-6/](https://leetcode-cn.com/problems/delete-node-in-a-bst/solution/450-shan-chu-er-cha-sou-suo-shu-zhong-de-jie-dia-6/)

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} key
 * @return {TreeNode}
 */
var deleteNode = function(root, key) {
  if (!root) { return null }

  if (key < root.val) {
    node.left = deleteNode(root.left, key)
  } else if (key > root.val) {
    node.right = deleteNode(root.right, key)
  } else {
    if (!root.left) {
      return root.right
    } else (!root.right) {
      return root.left
    } else {
      let node = root.right
      while(node.left) {
        node = node.left
      }
      node.left = root.left
      return root.right
    }
  }
  return root
}
```

Linked List 就是特殊化的 Tree

Tree 就是特殊化 Graph

### 第 8 章 数据结构之“树”

`8-1 树简介`

- 一种分层数据的抽象模型
- 前端工作中常见的树包括：DOM 树、级联选择、树形控件......
- JS 中没有树，但是可以用 Object 和 Array 构建树
  ```json
  {
    "value": "zhejiang",
    "label": "zhejiang",
    "children": [
      {
        "value": "hangzhou",
        "label": "hangzhou",
        "children": [
          {
            "value": "xihu",
            "label": "west lake"
          }
        ]
      }
    ]
  }
  ```
- 树的常用操作：深度/广度优先遍历、二叉树的先中后序遍历

`8-2 深度与广度优先遍历`

- 深度优先遍历：尽可能深的搜索树的分支

  ```
  // 序号表示遍历的顺序
  a(1)
   | -- b(2)
   |     | -- d(3)
   |     | -- e(4)
   | -- c(5)
         | -- f(6)
         | -- g(7)
  ```

  深度优先遍历算法口诀(depth-first-search)

  - 访问根节点
  - 对根节点的 children 挨个进行深度优先遍历（递归）
  - 就像看一本，按顺序看每一章，接着看每一个小节

  ```js
  const tree = {
    val: "a",
    children: [
      {
        val: "b",
        children: [
          {
            val: "d",
            children: [],
          },
          {
            val: "e",
            children: [],
          },
        ],
      },
      {
        val: "c",
        children: [
          {
            val: "f",
            children: [],
          },
          {
            val: "g",
            children: [],
          },
        ],
      },
    ],
  };

  const dfs = (root) => {
    console.log(root.val);
    root.children.forEach((child) => dfs(child));
  };

  const dfs2 = (root) => {
    const stack = [root];
    while (stack.length) {
      const n = stack.pop();
      console.log(n.val);
      for (let i = n.children.length - 1; i > 0; i--) {
        stack.push(n.children[i]);
      }
    }
  };

  dfs(tree); // a b d e c f g
  ```

- 广度优先遍历（breadth-first search）：先访问离根节点最近的节点
  先看一本书的目录，再深入了解每一小节

  ```
  // 序号表示遍历的顺序
  a(1)
   | -- b(2)
   |     | -- d(4)
   |     | -- e(5)
   | -- c(3)
         | -- f(6)
         | -- g(7)
  ```

  广度优先遍历算法口诀

  - 新建一个队列，把根节点入队
  - 把队头出队并访问
  - 把队头的 children 挨个入队
  - 重复第二、三步，直到队列为空

  ```js
  const tree = {
    val: "a",
    children: [
      {
        val: "b",
        children: [
          {
            val: "d",
            children: [],
          },
          {
            val: "e",
            children: [],
          },
        ],
      },
      {
        val: "c",
        children: [
          {
            val: "f",
            children: [],
          },
          {
            val: "g",
            children: [],
          },
        ],
      },
    ],
  };

  const bfs = (root) => {
    const q = [root];
    while (q.length > 0) {
      const n = q.shift();
      console.log(n.val);
      n.children.forEach((child) => {
        q.push(child);
      });
    }
  };

  bfs(tree); // a b c d e f g
  ```

  > 扩展：对于复杂的图或者状态集，还需要进行一个判重的判断，再遍历的时候需要把访问过的节点给记录下来，再加入访问队列的时候进行判重

`8-3 二叉树的先中后序遍历`

二叉树是什么？

- 树中每个节点最多只能有两个子节点
- 在 JS 中通常用 Object 来模拟二叉树

先序遍历算法口诀

- 访问根节点
- 对根节点的左子树进行先序遍历
- 对根节点的右子树进行先序遍历

```
        ❶
      /   \
     ❷     ❻
   /   \    \
  ❸     ❹    ❼
      /
     ❺
```

```js
const bt = {
  val: 1,
  left: {
    val: 2,
    left: {
      val: 4,
      left: null,
      right: null,
    },
    right: {
      val: 5,
      left: null,
      right: null,
    },
  },
  right: {
    val: 3,
    left: {
      val: 6,
      left: null,
      right: null,
    },
    right: {
      val: 7,
      left: null,
      right: null,
    },
  },
};

const preorder = (root) => {
  if (!root) return;
  console.log(root.val);
  preorder(root.left);
  preorder(root.right);
};

// 非递归版本
const preorder2 = (root) => {
  if (!root) return;
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    console.log(n.val);
    if (n.right) stack.push(n.right);
    if (n.left) stack.push(n.left);
  }
};

preorder(bt);
preorder2(bt);
```

中序遍历算法口诀

- 对根节点的左子树进行中序遍历
- 访问根节点
- 对根节点的右子树进行中序遍历

```
        ❺
      /   \
     ❷     ❻
   /   \    \
  ❶     ❹    ❼
      /
     ❸
```

```js
const inorder = (root) => {
  if (!root) return;
  inorder(root.left);
  console.log(root.val);
  inorder(root.right);
};

// 非递归版本
const inorder2 = (root) => {
  if (!root) return;
  const stack = [];
  let p = root;
  while (stack.length || p) {
    while (p) {
      stack.push(p);
      p = p.left;
    }
    const n = stack.pop();
    console.log(n.val);
    p = n.right;
  }
};

inorder(bt);
inorder2(bt);
```

后序遍历算法口诀

- 对根节点的左子树进行后序遍历
- 对根节点的右子树进行后序遍历
- 访问根节点

```
        ❼
      /   \
     ❹     ❻
   /   \    \
  ❶     ❸    ❺
      /
     ❷
```

```js
const postorder = (root) => {
  if (!root) return;
  postorder(root.left);
  postorder(root.right);
  console.log(root.val);
};

// 非递归版
const postorder2 = (root) => {
  if (!root) return;
  const outputStack = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop();
    outputStack.push(n);
    if (n.left) stack.push(n.left);
    if (n.right) stack.push(n.right);
  }

  while (outputStack.length) {
    const n = outputStack.pop();
    console.log(n.val);
  }
};

postorder(bt);
postorder2(bt);
```

> 小技巧：如果记不住先中后序遍历的顺序，实际上先中后序遍历对应是根节点在遍历中的位置

`8-4 LeetCode：104. 二叉树的最大深度（深度优先遍历）`
给定一个二叉树，找出其最大深度。

二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。

说明: 叶子节点是指没有子节点的节点。

示例：
给定二叉树 [3,9,20,null,null,15,7]，

```
    3
   / \
  9  20
    /  \
   15   7
```

返回它的最大深度  3 。

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
// 时间复杂度O(n), 空间复杂度O(logn)
var maxDepth = function (root) {
  let res = 0;
  const dfs = (n, l) => {
    if (!n) {
      return;
    }
    if (!n.left && !n.right) {
      res = Math.max(res, l);
    }
    dfs(n.left, l + 1);
    dfs(n.right, l + 1);
  };
  dfs(root, 1);
  return res;
};

var maxDepth = function (root) {
  return !root ? 0 : 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
};
```

`8-5 LeetCode：111. 二叉树的最小深度（广度优先遍历）`

给定一个二叉树，找出其最小深度。

最小深度是从根节点到最近叶子节点的最短路径上的节点数量。

说明：叶子节点是指没有子节点的节点。

```示例1
    ❸
  /   \
 ❾     ⓴
     /   \
    ⓯     ❼
```

```示例1
输入：root = [3,9,20,null,null,15,7]
输出：2
```

```示例2
输入：root = [2,null,3,null,4,null,5,null,6]
输出：5
```

> 提示：
> 树中节点数的范围在 [0, 105] 内
> -1000 <= Node.val <= 1000

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function (root) {
  if (!root) {
    return 0;
  }
  const q = [[root, 1]];
  while (q.length) {
    const [n, l] = q.shift();
    if (!n.left && !n.right) {
      return l;
    }
    if (n.left) q.push([n.left, l + 1]);
    if (n.right) q.push([n.right, l + 1]);
  }
};
```

`8-6 LeetCode：102. 二叉树的层序遍历（广度优先遍历）`

给你一个二叉树，请你返回其按 层序遍历 得到的节点值。 （即逐层地，从左到右访问所有节点）。

示例：二叉树：[3,9,20,null,null,15,7],

```示例1
    ❸
  /   \
 ❾     ⓴
     /   \
    ⓯     ❼
```

返回其层次遍历结果：

```result
[
  [3],
  [9,20],
  [15,7]
]
```

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {number[][]}
 */
var levelOrder = function (root) {
  if (!root) return [];
  const q = [[root, 0]];
  const res = [];
  while (q.length) {
    const [n, l] = q.shift();
    if (!res[l]) {
      res.push([n.val]);
    } else {
      res[l].push(n.val);
    }
    if (n.left) q.push([n.left, l + 1]);
    if (n.right) q.push([n.right, l + 1]);
  }
  return res;
};
```

```js
// 方法二：通过广度优先遍历，获取同一层级的节点batch process
// 时间和空间复杂度都是O(n)
var levelOrder = function (root) {
  if (!root) return [];
  const q = [root];
  const res = [];
  while (q.length) {
    let len = q.length;
    res.push([]);
    while (len--) {
      const n = q.shift();
      res[res.length - 1].push(n.val);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
  }
  return res;
};
```

```js
// 方法三：DFS深度优先遍历
var levelOrder = function (root) {
  const res = [];
  const dfs = (n, l) => {
    if (!n) {
      return;
    }
    if (!res[l]) {
      res.push([n.val]);
    } else {
      res[l].push(n.val);
    }

    if (n.left) dfs(n.left, l + 1);
    if (n.right) dfs(n.right, l + 1);
  };
  dfs(root, 0);
  return res;
};
```

`LeetCode 94. 二叉树的中序遍历`

`8-7 LeetCode：112. 路径总和（深度优先遍历）`

给定一个二叉树和一个目标和，判断该树中是否存在根节点到叶子节点的路径，这条路径上所有节点值相加等于目标和。

说明:  叶子节点是指没有子节点的节点。

示例: 
给定如下二叉树，以及目标和 **sum = 22**，

```
       5
      / \
     4   8
    /   / \
   11  13  4
  /  \      \
 7    2      1
```

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {number} sum
 * @return {boolean}
 */
// 时间复杂度O(n) 空间复杂度最差O(n) 好的情况O(logn)
var hasPathSum = function (root, sum) {
  if (!root) return false;
  let res = false;
  const dfs = (n, s) => {
    if (!n.left && !n.right && s === sum) {
      res = true;
    }
    if (n.left) dfs(n.left, s + n.left.val);
    if (n.right) dfs(n.right, s + n.right.val);
  };
  dfs(root, root.val);
  return res;
};
```

`8-8 前端与树：遍历JSON的所有节点值`

```js
const json = {
  a: { b: { c: 1 } },
  d: [1, 2],
};

const dfs = (n, path) => {
  console.log(n, path);
  Object.keys(n).forEach((k) => {
    dfs(n[k], path.concat(k));
  });
};

dfs(json, []);
```

作用：有时候后端返回到前端的数据并不规范，可以通过深度优先遍历进行删改，从而达到前端想要的数据

`扩展：二叉搜索树（Binary Search Tree BST）`

二叉搜索树表示，树的节点具有一定的有序性，便于查找，空树也算是二叉搜索树

- 左子树上所有的节点的值均小于它的根节点的值
- 右子树上所有的节点的值均大于它的根节点的值
- Recursively，左、右子树也分别为二叉查找树

搜索的时候更加有效率，O(logn)

当二叉树退化成线性的链，可以重现打乱，进行排序，就可以变成其他类型的树

`LeetCode 98. 验证二叉搜索树`
给定一个二叉树，判断其是否是一个有效的二叉搜索树。

假设一个二叉搜索树具有如下特征：

- 节点的左子树只包含小于当前节点的数。
- 节点的右子树只包含大于当前节点的数。
- 所有左子树和右子树自身必须也是二叉搜索树。

示例 1:

```
输入:
    2
   / \
  1   3
输出: true
```

方法一：通过中序遍历，最后数组是应该升序的数组，说明就是二叉搜索树

```js
var isValidBST = function (root) {
  const stack = [];
  let p = root;
  let inorder = -Infinity;
  while (stack.length || p) {
    while (p) {
      stack.push(p);
      p = p.left;
    }
    const n = stack.pop();
    if (n.val <= inorder) {
      return false;
    }
    inorder = n.val;
    p = n.right;
  }

  return true;
};
```

方法二：通过递归判断

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isValidBST = function (root) {
  const isValid = (n, min, max) => {
    if (!n) {
      return true;
    }

    if (min !== undefined && n.val <= min) {
      return false;
    }

    if (max !== undefined && n.val >= max) {
      return false;
    }

    return isValid(n.left, min, n.val) && isValid(n.right, n.val, max);
  };

  return isValid(root);
};
```

`LeetCode 235. 二叉搜索树的最近公共祖先`

给定一个二叉搜索树, 找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

例如，给定如下二叉搜索树:  root = [6,2,8,0,4,7,9,null,null,3,5]

![https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/binarysearchtree_improved.png](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/14/binarysearchtree_improved.png)

示例 1:

```
输入: root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
输出: 6
解释: 节点 2 和节点 8 的最近公共祖先是 6。
```

由于是二叉搜索树，已经排好序，只需要递归判断左右子树即可

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  if (p.val < root.val && q.val < root.val) {
    return lowestCommonAncestor(root.left, p, q);
  }

  if (p.val > root.val && q.val > root.val) {
    return lowestCommonAncestor(root.right, p, q);
  }

  return root;
};
```

非递归版本

```js
var lowestCommonAncestor = function (root, p, q) {
  let pointer = root;
  while (pointer) {
    if (p.val < pointer.val && q.val < pointer.val) {
      pointer = pointer.left;
    } else if (p.val > pointer.val && q.val > pointer.val) {
      pointer = pointer.right;
    } else {
      return pointer;
    }
  }
};
```

`LeetCode 236. 二叉树的最近公共祖先`

给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。

百度百科中最近公共祖先的定义为：“对于有根树 T 的两个结点 p、q，最近公共祖先表示为一个结点 x，满足 x 是 p、q 的祖先且 x 的深度尽可能大（一个节点也可以是它自己的祖先）。”

例如，给定如下二叉树:  root = [3,5,1,6,2,0,8,null,null,7,4]

![https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/15/binarytree.png](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2018/12/15/binarytree.png)

示例 1:

```
输入: root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
输出: 3
解释: 节点 5 和节点 1 的最近公共祖先是节点 3。
```

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function (root, p, q) {
  if (!root || root == p || root == q) {
    return root;
  }

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  return !left ? right : !right ? left : root;
};
```

#### 617. 合并二叉树

给定两个二叉树，想象当你将它们中的一个覆盖到另一个上时，两个二叉树的一些节点便会重叠。

你需要将他们合并为一个新的二叉树。合并的规则是如果两个节点重叠，那么将他们的值相加作为节点合并后的新值，否则不为  NULL 的节点将直接作为新二叉树的节点。

示例  1:

```
输入:
	Tree 1                     Tree 2
          1                         2
         / \                       / \
        3   2                     1   3
       /                           \   \
      5                             4   7
输出:
合并后的树:
	     3
	    / \
	   4   5
	  / \   \
	 5   4   7

```

深度遍历二叉树

```js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} root1
 * @param {TreeNode} root2
 * @return {TreeNode}
 */
var mergeTrees = function (root1, root2) {
  // 如果root1为null，则直接返回root2
  if (!root1) {
    return root2;
  }
  if (!root2) {
    return root1;
  }

  const node = new TreeNode(root1.val + root2.val);
  node.left = mergeTrees(root1.left, root2.left);
  node.right = mergeTrees(root2.right, root2.right);
  return node;
};
```

广度便利了

### 第 9 章 数据结构之“图”

`9-1` 图简介

- 图是网络结构的抽象模型，是一组由边连接的节点
- 图可以表示任何二元关系，比如道路、航班等
- JS 中没有图，但是可以用 Object 和 Array 构建图
- 图的表示法：邻接矩阵、邻接表、关联矩阵...

```示例
Ⓐ ---→ Ⓑ ---→ Ⓒ
 ↖    ↙      ↙
    Ⓓ ←--- Ⓔ
```

图的表示法：邻接矩阵

```
    A B C D E
A | 0 1 0 0 0 |
B | 0 0 1 1 0 |
C | 0 0 0 0 1 |
D | 1 0 0 0 0 |
E | 0 0 0 1 0 |
```

图的表示法：邻接表

```
{
  A: ['B'],
  B: ['C', 'D'],
  C: ['E'],
  D: ['A'],
  E: ['D'],
}
```

图的常用操作

- 深度优先遍历
- 广度优先遍历

`9-2 图的深度广度优先遍历`

- 深度优先遍历：尽可能深的搜索图的分支
- 广度优先遍历：先访问离根节点最近的节点

深度优先遍历算法口诀

- 访问根节点
- 对根节点的**没访问过的相邻节点（避免造成死循环）**挨个进行深度优先遍历，

```js
const graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3],
};

const visited = new Set();
const dfs = (n) => {
  console.log(n);
  visited.add(n);
  graph[n].forEach((c) => {
    if (!visited.has(c)) dfs(c);
  });
};

dfs(2);
```

广度优先遍历算法口诀

- 新建一个队列，把根节点入队
- 把队头出队并访问
- 把队头的没访问过的相邻节点入队
- 重复二、三步，直到队列为空

```js
const graph = {
  0: [1, 2],
  1: [2],
  2: [0, 3],
  3: [3],
};

const visited = new Set();
visited.add(2);
const q = [2];
while (q.length) {
  const n = q.shift();
  console.log(n);
  graph[n].forEach((c) => {
    if (!visited.has(c)) {
      q.push(c);
      visited.add(c);
    }
  });
}
```

`9-3 LeetCode：65. 有效数字`

验证给定的字符串是否可以解释为十进制数字。

例如:

```
"0" => true
" 0.1 " => true
"abc" => false
"1 a" => false
"2e10" => true
" -90e3   " => true
" 1e" => false
"e3" => false
" 6e-1" => true
" 99e2.5 " => false
"53.5e93" => true
" --6 " => false
"-+3" => false
"95a54e53" => false
```

说明:  我们有意将问题陈述地比较模糊。在实现代码之前，你应当事先思考所有可能的情况。这里给出一份可能存在于有效十进制数字中的字符列表：

- 数字 0-9
- 指数 - "e"
- 正/负号 - "+"/"-"
- 小数点 - "."
  当然，在输入中，这些字符的上下文也很重要。

解题步骤：

- 构建一个表示状态的图
- 遍历字符串，并沿着图走，如果到了某个节点无路可走就返回 false
- 遍历结束，如果走到 3、5、6，就返回 true，否则返回 false

![](https://pic.leetcode-cn.com/0683d701f2948a2bd8c235867c21a3aed5977691f129ecf34d681d43d57e339c-DFA.jpg)

```js
/**
 * @param {string} s
 * @return {boolean}
 */
// 时间复杂度O(n), 空间复杂度O(1)
var isNumber = function (s) {
  const graph = {
    0: { digit: 6, blank: 0, sign: 1, ".": 2 },
    1: { digit: 6, ".": 2 },
    2: { digit: 3 },
    3: { digit: 3, e: 4 },
    4: { digit: 5, sign: 7 },
    5: { digit: 5 },
    6: { digit: 6, ".": 3, e: 4 },
    7: { digit: 5 },
  };
  let state = 0;
  for (let c of s.trim()) {
    if (c >= "0" && c <= "9") {
      c = "digit";
    } else if (c === " ") {
      c = "blank";
    } else if (c === "+" || c === "-") {
      c = "sign";
    }
    state = graph[state][c];
    if (state === undefined) {
      return false;
    }
  }

  if (state === 3 || state === 5 || state === 6) {
    return true;
  }
  return false;
};
```

`9-4 LeetCode：417. 太平洋大西洋水流问题`

给定一个 m x n 的非负整数矩阵来表示一片大陆上各个单元格的高度。“太平洋”处于大陆的左边界和上边界，而“大西洋”处于大陆的右边界和下边界。

规定水流只能按照上、下、左、右四个方向流动，且只能从高到低或者在同等高度上流动。

请找出那些水流既可以流动到“太平洋”，又能流动到“大西洋”的陆地单元的坐标。

提示：

1. 输出坐标的顺序不重要

2. m 和 n 都小于 150

```
给定下面的 5x5 矩阵:

  太平洋 ~   ~   ~   ~   ~
       ~  1   2   2   3  (5) *
       ~  3   2   3  (4) (4) *
       ~  2   4  (5)  3   1  *
       ~ (6) (7)  1   4   5  *
       ~ (5)  1   1   2   4  *
          *   *   *   *   * 大西洋

返回:

[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]] (上图中带括号的单元).

```

解题思路：

- 把矩阵想象成图
- 从海岸线逆流而上遍历图，所到之处就是可以流到某个大洋的坐标

解题步骤：

- 新建两个矩阵，分别记录能流到两个大洋的坐标
- 从海岸线，多管齐下，同时深度优先遍历图，过程中填充上述矩阵

```js
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var pacificAtlantic = function (matrix) {
  if (!matrix || !matrix[0]) return [];
  const m = matrix.length;
  const n = matrix[0].length;
  const flow1 = Array.from({ length: m }, () => new Array(n).fill(false));
  const flow2 = Array.from({ length: m }, () => new Array(n).fill(false));

  const dfs = (r, c, flow) => {
    flow[r][c] = true;
    [
      [r - 1, c],
      [r + 1, c],
      [r, c - 1],
      [r, c + 1],
    ].forEach(([nr, nc]) => {
      if (
        // 保证在范围内
        nr >= 0 &&
        nr < m &&
        nc >= 0 &&
        nc < n &&
        // 防止死循环
        !flow[nr][nc] &&
        // 保证逆流而上
        matrix[nr][nc] >= matrix[r][c]
      ) {
        dfs(nr, nc, flow);
      }
    });
  };

  // 沿着海岸线逆流而上
  for (let r = 0; r < m; r += 1) {
    dfs(r, 0, flow1);
    dfs(r, n - 1, flow2);
  }

  for (let c = 0; c < n; c += 1) {
    dfs(0, c, flow1);
    dfs(m - 1, c, flow2);
  }

  // 收集能流到两个大洋的坐标
  const res = [];
  for (let r = 0; r < m; r += 1) {
    for (let c = 0; c < n; c += 1) {
      if (flow1[r][c] && flow2[r][c]) {
        res.push([r, c]);
      }
    }
  }
  return res;
};
```

`9-5 LeetCode：133. 克隆图`

给你无向 连通 图中一个节点的引用，请你返回该图的 深拷贝（克隆）。

图中的每个节点都包含它的值 val（int） 和其邻居的列表（list[Node]）。

```
class Node {
    public int val;
    public List<Node> neighbors;
}
```

测试用例格式：

简单起见，每个节点的值都和它的索引相同。例如，第一个节点值为 1（val = 1），第二个节点值为 2（val = 2），以此类推。该图在测试用例中使用邻接列表表示。

邻接列表 是用于表示有限图的无序列表的集合。每个列表都描述了图中节点的邻居集。

给定节点将始终是图中的第一个节点（值为 1）。你必须将   给定节点的拷贝   作为对克隆图的引用返回。



示例 1：
![](https://assets.leetcode-cn.com/aliyun-lc-upload/uploads/2020/02/01/133_clone_graph_question.png)

```
输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
输出：[[2,4],[1,3],[2,4],[1,3]]
解释：
图中有 4 个节点。
节点 1 的值是 1，它有两个邻居：节点 2 和 4 。
节点 2 的值是 2，它有两个邻居：节点 1 和 3 。
节点 3 的值是 3，它有两个邻居：节点 2 和 4 。
节点 4 的值是 4，它有两个邻居：节点 1 和 3 。
```

示例 2：

```
输入：adjList = [[]]
输出：[[]]
解释：输入包含一个空列表。该图仅仅只有一个值为 1 的节点，它没有任何邻居。
```

示例 3：

```
输入：adjList = []
输出：[]
解释：这个图是空的，它不含任何节点。
```

示例 4：

```
输入：adjList = [[2],[1]]
输出：[[2],[1]]
```

解题思路：

- 拷贝所有的节点
- 拷贝所有的边

解题步骤：

- 利用深度或广度优先遍历所有节点
- 拷贝所有的节点，存储起来
- 将拷贝的节点，按照原图的链接方法进行链接

```js
/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {Node} node
 * @return {Node}
 */
// 深度遍历版
var cloneGraph = function (node) {
  if (!node) {
    return;
  }
  const visited = new Map();
  const dfs = (n) => {
    const nCopy = new Node(n.val);
    visited
      .set(
        n,
        nCopy
      )(n.neighbors || [])
      .forEach((ne) => {
        if (!visited.has(ne)) {
          dfs(ne);
        }
        nCopy.neighbors.push(new Node(ne.val));
      });
  };
  dfs(node);
  return visited.get(node);
};

// 广度遍历版
var cloneGraph = function (node) {
  if (!node) {
    return;
  }
  const q = [node];
  const visited = new Map();
  visited.set(node, new Node(node.val));
  while (q.length) {
    const n = q
      .shift()(n.neighbors || [])
      .forEach((ne) => {
        if (!visited.has(ne)) {
          q.push(ne);
          visited.set(ne, new Node(ne.val));
        }
        visited.get(n).neighbors.push(visited.get(ne));
      });
  }
  return visited.get(node);
};

// 两个版本的时间和空间复杂度都是O(n)
```

### 第 10 章 堆

#### 堆是什么？

- 堆是一种特殊的**完全二叉树**
- 所有的节点都大于等于（最大堆）或小于等于（最小堆）他的子节点

```
       ❻
     /   \
    ❺     ❸
  /   \  /
 ❹    ❷  ❶
```

`JS中的堆`

- JS 中通常用数组表示堆
- 左侧子节点的位置是当前节点索引 _ 2 + 1，即 2 _ index + 1
- 右侧子节点的位置是当前节点索引 _ 2 + 1，即 2 _ index + 2
- 父节点的位置（index - 1）/ 2

```
      ❶(0)
    /   \
   ❸(1)  ❻(2)
  / \    /
 ❺(3)❾(4)❽(5)

const arr = [1, 3, 6, 5, 9, 8]
```

`第K个最大元素`

找第 K 个最大元素（最小元素）直接就可以用堆的算法

- 构建一个最小堆，并将元素一次插入堆中
- 当堆的容量超过 K，就删除堆顶
- 插入结束后，堆顶就是第 K 个最大元素

#### Javascript 实现：最小堆类

实现步骤：

- 在类里，声明一个数组，用来装元素
- 主要方法：插入、删除堆顶、获取堆顶、获取堆大小

插入：

- 将值插入堆的底部，即数组的尾部
- 然后上移：将这个值和它的父节点进行交换，直到父节点小于等于这个插入的值（因为最小堆的父节点小于子节点）
- 大小为 K 的堆中插入元素的时间复杂度为 O(logk)

删除堆顶:

- 用数组尾部元素替换堆顶（直接删除堆顶会破坏堆结构）
- 然后下移：将新堆顶和它的子节点进行交换，知道子节点大于等于这个新的堆顶
- 大小为 k 的堆中删除堆顶的时间复杂度为 O(logk)

获取堆顶元素和堆的大小

- 返回头部元素
- 返回数组长度

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }
  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }
  getParentIndex(i) {
    // return Math.floor((i - 2) / 2)
    // 二进制右移一位就是除2的商
    return (i - 1) >> 1;
  }
  getLeftIndex(i) {
    return 2 * i + 1;
  }
  getRightIndex(i) {
    return 2 * i + 2;
  }
  shiftUp(index) {
    if (index == 0) return;
    const parentIndex = this.getParentIndex(index);
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swap(parentIndex, index);
      this.shiftUp(parentIndex);
    }
  }
  shiftDown(index) {
    const leftIndex = this.getLeftIndex(index);
    const rightIndex = this.getRightIndex(index);
    if (this.heap[leftIndex] < this.heap[index]) {
      this.swap(leftIndex, index);
      this.shiftDown(leftIndex);
    }
    if (this.heap[rightIndex] < this.heap[index]) {
      this.swap(rightIndex, index);
      this.shiftDown(rightIndex);
    }
  }
  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }
  // 删除堆顶元素
  pop() {
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
}
```

#### LeetCode: 215.数组中的第 K 个最大元素

在未排序的数组中找到第 k 个最大的元素。请注意，你需要找的是数组排序后的第 k 个最大的元素，而不是第 k 个不同的元素。

示例 1:

```
输入: [3,2,1,5,6,4] 和 k = 2
输出: 5
```

示例 2:

```
输入: [3,2,3,1,2,4,5,5,6] 和 k = 4
输出: 4
```

解题思路：

- 看到“第 K 个最大元素”
- 考虑选择使用最小堆

解题步骤：

- 构建一个最小堆，并依次把数组的值插入堆中
- 当堆的容量超过 K，就删除堆顶
- 插入结束后，堆顶就是第 K 个最大元素

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }
  // 对换位置
  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }
  // 获取父节点索引
  getParentIndex(i) {
    return (i - 1) >> 1;
  }

  // 获取左节点
  getLeftIndex(i) {
    return 2 * i + 1;
  }

  // 获取右节点
  getRightIndex(i) {
    return 2 * i + 2;
  }

  // 进行上移操作，直至堆顶为最小值
  shiftUp(index) {
    if (index == 0) {
      return;
    }
    // 父节点索引
    const pIndex = this.getParentIndex(index);
    if (this.heap[pIndex] > this.heap[index]) {
      this.swap(pIndex, index);
      this.shiftUp(pIndex);
    }
  }

  // 下移操作，直至堆顶为最小值
  shiftDown(index) {
    const lIndex = this.getLeftIndex(index);
    const rIndex = this.getRightIndex(index);
    if (this.heap[lIndex] < this.heap[index]) {
      this.swap(lIndex, index);
      this.shiftDown(lIndex);
    }

    if (this.heap[rIndex] < this.heap[index]) {
      this.swap(rIndex, index);
      this.shiftDown(rIndex);
    }
  }
  // 插入
  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }
  // 弹出堆顶
  pop() {
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }
  // 获取堆顶
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
}

/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function (nums, k) {
  const h = new MinHeap();
  nums.forEach((n) => {
    h.insert(n);
    if (h.size() > k) {
      h.pop();
    }
  });

  return h.peek();
};
// 时间复杂度是O(nlogk) 空间复杂度O(k)
```

#### LeetCode: 347.前 K 个高频元素

给定一个非空的整数数组，返回其中出现频率前 k 高的元素。

示例 1:

```
输入: nums = [1,1,1,2,2,3], k = 2
输出: [1,2]
```

示例 2:

```
输入: nums = [1], k = 1
输出: [1]
```

提示：

- 你可以假设给定的  k  总是合理的，且 1 ≤ k ≤ 数组中不相同的元素的个数。
- 你的算法的时间复杂度必须优于 O(n log n) , n  是数组的大小。
- 题目数据保证答案唯一，换句话说，数组中前 k 个高频元素的集合是唯一的。
- 你可以按任意顺序返回答案。

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }
  // 对换位置
  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }
  // 获取父节点索引
  getParentIndex(i) {
    return (i - 1) >> 1;
  }

  // 获取左节点
  getLeftIndex(i) {
    return 2 * i + 1;
  }

  // 获取右节点
  getRightIndex(i) {
    return 2 * i + 2;
  }

  // 进行上移操作，直至堆顶为最小值
  shiftUp(index) {
    if (index == 0) {
      return;
    }
    // 父节点索引
    const pIndex = this.getParentIndex(index);
    if (this.heap[pIndex] && this.heap[pIndex].value > this.heap[index].value) {
      this.swap(pIndex, index);
      this.shiftUp(pIndex);
    }
  }

  // 下移操作，直至堆顶为最小值
  shiftDown(index) {
    const lIndex = this.getLeftIndex(index);
    const rIndex = this.getRightIndex(index);
    if (this.heap[lIndex] && this.heap[lIndex].value < this.heap[index].value) {
      this.swap(lIndex, index);
      this.shiftDown(lIndex);
    }

    if (this.heap[rIndex] && this.heap[rIndex].value < this.heap[index].value) {
      this.swap(rIndex, index);
      this.shiftDown(rIndex);
    }
  }
  // 插入
  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }
  // 弹出堆顶
  pop() {
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }
  // 获取堆顶
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
}
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
// 时间复杂度O(nlogk) 空间复杂度O(n)
var topKFrequent = function (nums, k) {
  const map = new Map();
  nums.forEach((n) => {
    map.set(n, map.has(n) ? map.get(n) + 1 : 1);
  });

  const h = new MinHeap();
  map.forEach((value, key) => {
    h.insert({ value, key });
    if (h.size() > k) {
      h.pop();
    }
  });

  return h.heap.map((v) => v.key);
};
```

#### LeetCode: 23.合并 K 个升序链表

给你一个链表数组，每个链表都已经按升序排列。

请你将所有链表合并到一个升序链表中，返回合并后的链表。

示例 1：

```
输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
  1->4->5,
  1->3->4,
  2->6
]
将它们合并到一个有序链表中得到。
1->1->2->3->4->4->5->6

```

示例 2：

```
输入：lists = []
输出：[]
```

示例 3：

```
输入：lists = [[]]
输出：[]
```

提示：

- **k == lists.length**
- **0 <= k <= 10^4**
- **0 <= lists[i].length <= 500**
- **-10^4 <= lists[i][j] <= 10^4**
- **lists[i]** 按 升序 排列
- **lists[i].length** 的总和不超过 10^4

解题思路：

- 新链表的下一个节点一定是 k 个链表头中的最小节点
- 考虑选择使用最小堆

解题步骤：

- 构建一个最小堆，并依次把链表头插入堆中
- 弹出堆顶接着输出链表，并将堆顶所在的链表的新链表头插入堆中
- 等堆元素全部弹出，合并工作就完成了

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }
  // 对换位置
  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }
  // 获取父节点索引
  getParentIndex(i) {
    return (i - 1) >> 1;
  }

  // 获取左节点
  getLeftIndex(i) {
    return 2 * i + 1;
  }

  // 获取右节点
  getRightIndex(i) {
    return 2 * i + 2;
  }

  // 进行上移操作，直至堆顶为最小值
  shiftUp(index) {
    if (index == 0) {
      return;
    }
    // 父节点索引
    const pIndex = this.getParentIndex(index);
    if (this.heap[pIndex] && this.heap[pIndex].val > this.heap[index].val) {
      this.swap(pIndex, index);
      this.shiftUp(pIndex);
    }
  }

  // 下移操作，直至堆顶为最小值
  shiftDown(index) {
    const lIndex = this.getLeftIndex(index);
    const rIndex = this.getRightIndex(index);
    if (this.heap[lIndex] && this.heap[lIndex].val < this.heap[index].val) {
      this.swap(lIndex, index);
      this.shiftDown(lIndex);
    }

    if (this.heap[rIndex] && this.heap[rIndex].val < this.heap[index].val) {
      this.swap(rIndex, index);
      this.shiftDown(rIndex);
    }
  }
  // 插入
  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }
  // 弹出堆顶
  pop() {
    if (this.size() === 1) return this.heap.shift();
    const top = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
    return top;
  }
  // 获取堆顶
  peek() {
    return this.heap[0];
  }
  size() {
    return this.heap.length;
  }
}

/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function (lists) {
  const h = new MinHeap();
  const res = new ListNode(0);
  let p = res;
  lists.forEach((l) => {
    if (l) h.insert(l);
  });

  while (h.size()) {
    const n = h.pop();
    p.next = n;
    p = p.next;
    if (n.next) h.insert(n.next);
  }
  return res.next;
};
```

#### Leetcode 703. 数据流中的第 K 大元素

设计一个找到数据流中第 k 大元素的类（class）。注意是排序后的第 k 大元素，不是第 k 个不同的元素。

请实现 KthLargest  类：

KthLargest(int k, int[] nums) 使用整数 k 和整数流 nums 初始化对象。
int add(int val) 将 val 插入数据流 nums 后，返回当前数据流中第 k 大的元素。

示例：

```
输入：
["KthLargest", "add", "add", "add", "add", "add"]
[[3, [4, 5, 8, 2]], [3], [5], [10], [9], [4]]
输出：
[null, 4, 5, 5, 8, 8]

解释：
KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3);   // return 4
kthLargest.add(5);   // return 5
kthLargest.add(10);  // return 5
kthLargest.add(9);   // return 8
kthLargest.add(4);   // return 8
```

```js
class MinHeap {
  constructor() {
    this.heap = [];
  }

  swap(i1, i2) {
    const temp = this.heap[i1];
    this.heap[i1] = this.heap[i2];
    this.heap[i2] = temp;
  }

  getParentIndex(i) {
    return (i - 1) >> 1;
  }

  getLeftIndex(i) {
    return 2 * i + 1;
  }

  getRightIndex(i) {
    return 2 * i + 2;
  }

  shiftUp(index) {
    if (this.heap.length === 0) return;
    const parentIndex = this.getParentIndex(index);
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swap(parentIndex, index);
      this.shiftUp(parentIndex);
    }
  }

  shiftDown(index) {
    const leftIndex = this.getLeftIndex(index);
    const rightIndex = this.getRightIndex(index);

    if (this.heap[index] > this.heap[leftIndex]) {
      this.swap(index, leftIndex);
      this.shiftDown(leftIndex);
    }

    if (this.heap[index] > this.heap[rightIndex]) {
      this.swap(index, rightIndex);
      this.shiftDown(rightIndex);
    }
  }

  insert(value) {
    this.heap.push(value);
    this.shiftUp(this.heap.length - 1);
  }

  pop() {
    this.heap[0] = this.heap.pop();
    this.shiftDown(0);
  }

  peek() {
    return this.heap[0];
  }

  size() {
    return this.heap.length;
  }
}

/**
 * @param {number} k
 * @param {number[]} nums
 */
var KthLargest = function (k, nums) {
  this.h = new MinHeap();
  this.k = k;
  nums.forEach((n) => {
    this.add(n);
  });
};

/**
 * @param {number} val
 * @return {number}
 */
KthLargest.prototype.add = function (val) {
  this.h.insert(val);
  if (this.h.size() > this.k) {
    this.h.pop();
  }
  return this.h.peek();
};

/**
 * Your KthLargest object will be instantiated and called as such:
 * var obj = new KthLargest(k, nums)
 * var param_1 = obj.add(val)
 */
```

# ❶ ❷ ❸ ❹ ❺ ❻ ❼ ❽ ❾ ❿ ⓫ ⓬ ⓭ ⓮ ⓯ ⓰ ⓱ ⓲ ⓳ ⓴

# ⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿

# ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ

# ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ

# ↑、↓、←、→、↗、↘、↖、↙
