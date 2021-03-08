## 2020-07-28

### 第11章 进阶算法之“搜索排序”

#### 排序和搜索简介

简介：
- 排序：把某个乱序的数组变成升序或者降序的数组
- 搜索：找出数组中某个元素的下标

JS中的排序和搜索：
- JS中的排序：数组的sort方法
- JS中的搜索：数组的indexOf方法

排序算法：
- 冒泡排序
- 选择排序
- 插入排序
- 归并排序
- 快速排序
- 等等

搜索算法：
- 顺序搜索
- 二分搜索
- 等等

#### JavaScript 实现：冒泡排序

冒泡排序的思路
- 比较所有相邻元素，如果第一个比第二个大，则交换他们
- 一轮下来，可以保证最后一个数是最大的
- 执行n - 1轮，就可以完成排序

```js
Array.prototype.bubbleSort = function() {
  // this指向当前数组
  // this.length - 1可以防止数组越界
  for (let i = 0; i < this.length - 1; i+=1) {
    for (let j = 0; j < this.length - 1 - i; j+=1) {
      if (this[j] > this[j + 1]) {
        const temp = this[j]
        this[j] = this[j + 1]
        this[j + 1] = temp
      }
    }
  }
}

const arr = [5, 4, 3, 2, 1]
arr.bubbleSort()
```

冒泡排序时间复杂度
- 两个嵌套循环
- 时间复杂度：O(n^2)

####  JavaScript 实现：选择排序

选择排序的思路：
- 找到数组中的最小值，选中它并将其放置在第一位
- 接着找到第二小的值，选中它并将其放置在第二位
- 以此类推，执行n - 1轮

```js
Array.prototype.selectionSort = function() {
  for (let i = 0; i < this.length - 1; i+=1) {
    let indexMin = i
    for (let j = i; j < this.length; j+=1) {
      if (this[indexMin] > this[j]) {
        indexMin = j
      }
    }
    if (indexMin != i) {
      const temp = this[i]
      this[i] = this[indexMin]
      this[indexMin] = temp
    }
  }
}
```

选择排序时间复杂度
- 两个嵌套循环
- 时间复杂度：O(n^2)

冒泡排序和选择排序的性能比较差，实际工作很少用到

####  JavaScript 实现：插入排序

插入排序的思路：每次把i的元素插到合适的位置
- 从第二个数开始往前比
- 比它大就往后排
- 以此类推进行到最后一个数

```js
Array.prototype.insertSort = function() {
  for(let i = 1; i < this.length; i+=1) {
    const temp = this[i]
    let j = i
    while(j > 0) {
      if (this[j - 1] > temp) {
        this[j] = this[j - 1]
      } else {
        break
      }
      j -= 1
    }
    this[j] = temp
  }
}
```
插入排序时间复杂度
- 两个嵌套循环
- 时间复杂度：O(n^2)

一些小的数组排序，插入排序会优于冒泡和选择排序

####  JavaScript 实现：归并排序

归并排序的思路：
- 分：把数组分割成两半，再递归地对子数组进行“分”操作，直到分成一个个单独的数
- 合：把两个数合并为有序数组，再对有序数组进行合并，直到全部子数组合并为一个完整数组

```js
Array.prototype.mergeSort = function() {
  const rec = (arr) => {
    if (arr.length === 1) { return arr }
    // 地板除
    const mid = Math.floor(arr.length / 2)
    const left = arr.slice(0, mid)
    const right = arr.slice(mid, arr.length)
    const orderLeft = rec(left)
    const orderRight = rec(right)

    const res = []
    while(orderLeft.length || orderRight.length) {
      if (orderLeft.length && orderRight.length) {
        res.push(orderLeft[0] < orderRight[0] ? orderLeft.shift() : orderRight.shift())
      } else if (orderLeft.length) {
        res.push(orderLeft.shift())
      } else if (orderRight.length) {
        res.push(orderRight.shift())
      }
    }

    return res
  }
  const res = rec(this)
  res.forEach((v, i) => { this[i] = v })
}
```

归并排序时间复杂度
- 分的时间复杂度是O(logn)(二分操作的时间复杂度基本是O(logn))
- 合的时间复杂度是O(n)
- 时间复杂度：O(n * logn)

#### JavaScript 实现：快速排序

快速排序的思路：
- 分区：从数组中任意选择一个“基准”,所有比基准小的元素放在基准前面，比基准大的元素放在基准的后面
- 递归：递归地对基准前后的子数组进行分区

```js
Array.prototype.quickSort = function() {
  const rec = (arr) => {
    if (arr.length === 1) {
      return arr
    }
    const left = []
    const right = []
    const mid = arr[0]
    for (let i = 1; i < arr.length; i+=1) {
      if (arr[i] < mid) {
        left.push(arr[i])
      } else {
        right.push(arr[i])
      }
    }
    return [...rec(left), mid, ...rec(right)]
  }
  const res = rec(this)
  res.forEach((v, i) => { this[i] = v })
}
```

快速排序时间复杂度
- 递归地时间复杂度是O(logn)
- 分区的操作的时间复杂度是O(n)
- 时间复杂度：O(n * logn)

>排序后的数组如何判断是否一定是有序的呢，可以遍历数组比较相邻两个数

#### JavaScript 实现：顺序搜索

顺序搜索的思路
- 遍历数组
- 找到跟目标值相等的元素，就返回下标
- 遍历结束后，如果没有搜到目标值，就返回-1

```js
Array.prototype.sequentialSearch = function(item) {
  for (let i = 0; i < this.length; i+=1) {
    if (this[i] === item) {
      return i
    }
  }
  return -1
}
```

顺序搜索时间复杂度
- 遍历数组是一个循环操作
- 时间复杂度：O(n)

####  JavaScript 实现：二分搜索

二分搜索的思路
- 从数组的中间元素开始，如果中间元素正好是目标值，则搜索结束
- 如果目标值大于或者小于中间元素，则在大于或小于中间元素的那一半数组中搜索

使用场景：
- Sorted(单调递增或单调递减)
- Bounded(存在上下界)
- Accessible by index(能够通过索引访问)

```js
Array.prototype.binarySearch = function(item) {
  // 二分搜索，是搜排序的数组，如果数组乱序，需要先排序
  let low = 0
  let high = this.length - 1
  while(low <= high) {
    let mid = Math.floor((low + high) / 2)
    let element = this[mid]
    if (element < item) {
      low = mid + 1
    } else if (element > item) {
      high = mid - 1
    } else {
      return mid
    }
  }
  return -1
}
```

二分搜索时间复杂度
- 每一次比较都使搜索范围缩小一半
- 时间复杂度：O(logn)

`33. 搜索旋转排序数组`

升序排列的整数数组 nums 在预先未知的某个点上进行了旋转（例如， [0,1,2,4,5,6,7] 经旋转后可能变为 [4,5,6,7,0,1,2] ）。

请你在数组中搜索 target ，如果数组中存在这个目标值，则返回它的索引，否则返回 -1 。

示例 1：
```
输入：nums = [4,5,6,7,0,1,2], target = 0
输出：4
```
示例 2：
```
输入：nums = [4,5,6,7,0,1,2], target = 3
输出：-1
```
示例 3：
```
输入：nums = [1], target = 0
输出：-1
```

```js
// 时间复杂度要求O(logn),所以很容易想到二分搜索
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
  const len = nums.length
  if (len === 0) {
    return -1
  }

  if (len === 1) {
    return nums[0] === target ? 0 : -1
  }

  let l = 0
  let r = len - 1

  while(l <= r) {
    const mid = Math.ceil((l + r) / 2)
    if (nums[mid] === target) {
      return mid
    }
    if (nums[0] < nums[mid]) {
      if (nums[0] <= target && target < nums[mid]) {
        r = mid - 1
      } else {
        l = mid + 1
      }
    } else {
      if (nums[mid] < target && target <= nums[len - 1]) {
        l = mid + 1
      } else {
        r = mid - 1
      }
    }
  }
  return -1
}
```

#### LeetCode：21. 合并两个有序链表

将两个升序链表合并为一个新的 升序 链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。 

示例：

```
输入：1->2->4, 1->3->4
输出：1->1->2->3->4->4
```

解题思路：
- 与归并排序中的合并两个有序数组很相似
- 将数组替换成链表就能解此题

解题步骤：
- 新建一个新链表，作为返回结果
- 用指针遍历两个有序链表，并比较两个链表的当前节点，较小者先接入新链表，并将指针后移一步
- 链表遍历结束，返回新链表

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
// 时间复杂度O(m + n) 空间复杂度O(1)
var mergeTwoLists = function(l1, l2) {
  const res = new ListNode(0)
  let p = res
  let p1 = l1
  let p2 = l2
  while(p1 && p2) {
    if (p1.val < p2.val) {
      p.next = p1
      p1 = p1.next
    } else {
      p.next = p2
      p2 = p2.next
    }
    p = p.next
  }
  if (p1) {
    p.next = p1
  }
  if (p2) {
    p.next = p2
  }
  return res.next
}
```

#### LeetCode：374. 猜数字大小

猜数字游戏的规则如下：

- 每轮游戏，我都会从 1 到 n 随机选择一个数字。 请你猜选出的是哪个数字。
- 如果你猜错了，我会告诉你，你猜测的数字比我选出的数字是大了还是小了。

你可以通过调用一个预先定义好的接口 int guess(int num) 来获取猜测结果，返回值一共有 3 种可能的情况（-1，1 或 0）：

- -1：我选出的数字比你猜的数字小 pick < num
- 1：我选出的数字比你猜的数字大 pick > num
- 0：我选出的数字和你猜的数字一样。恭喜！你猜对了！pick == num

示例 1：
```
输入：n = 10, pick = 6
输出：6
```

解题思路：
- 这不就是二分搜索
- 调用guess函数，来判断中间元素是否是目标值

解题步骤：
- 从数组中间元素开始，如果中间元素正好是目标值，则搜索过程结束
- 如果目标值大于或者小于中间元素，则在数组大于或小于中间元素的那一半中查找

```js
/** 
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	            -1 if num is lower than the guess number
 *			             1 if num is higher than the guess number
 *                       otherwise return 0
 * var guess = function(num) {}
 */

/**
 * @param {number} n
 * @return {number}
 */
// 时间复杂度O(logn), 没有线性增长的变量，所以空间复杂度O(1)
var guessNumber = function(n) {
  let low = 1
  let high = n
  while(low <= high) {
    let mid = Math.floor((low + high) / 2)
    let res = guess(mid)
    if (res === 0) {
      return mid
    } else if (res === 1) {
      low = mid + 1
    } else {
      high = mid - 1
    }
  }
};
```


#### 744. 寻找比目标字母大的最小字母

给你一个排序后的字符列表 letters ，列表中只包含小写英文字母。另给出一个目标字母 target，请你寻找在这一有序列表里比目标字母大的最小字母。

在比较时，字母是依序循环出现的。举个例子：

如果目标字母 target = 'z' 并且字符列表为 letters = ['a', 'b']，则答案返回 'a'

示例：
```
输入:
letters = ["c", "f", "j"]
target = "a"
输出: "c"

输入:
letters = ["c", "f", "j"]
target = "c"
输出: "f"

输入:
letters = ["c", "f", "j"]
target = "d"
输出: "f"

输入:
letters = ["c", "f", "j"]
target = "g"
输出: "j"

输入:
letters = ["c", "f", "j"]
target = "j"
输出: "c"

输入:
letters = ["c", "f", "j"]
target = "k"
输出: "c"
```

```js
/**
 * @param {character[]} letters
 * @param {character} target
 * @return {character}
 */
var nextGreatestLetter = function(letters, target) {
  // 线性扫描
  // for(let c of letters) {
  //   if (c > target) {
  //     return c
  //   }
  // }
  // return letters[0]

  // 二分查找
  let low = 0
  let high = letters.length - 1
  let res = letters[0]
  while(low <= high) {
    const mid = Math.floor((low + high) / 2)
    if (letters[mid] > target) {
      res = letters[mid]
      high = mid - 1
    } else {
      low = mid + 1
    }
  }
  return res
};
```


### 算法设计思想之“分而治之”

#### 简介

- 分而治之是算法设计中的一种方法
- 它将一个问题分成多个和原问题相似的小问题，递归解决小问题，再将结果合并以解决原来的问题

场景：
- 归并排序
- 快速排序

#### LeetCode：226. 翻转二叉树

翻转一棵二叉树。

示例：

输入：

```
     4
   /   \
  2     7
 / \   / \
1   3 6   9
```

输出：

```
     4
   /   \
  7     2
 / \   / \
9   6 3   1
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
 * @return {TreeNode}
 */
// 时间复杂度O(n)，空间复杂度O(n)
var invertTree = function(root) {
  if (!root) { return null }
  return {
    val: root.val,
    left: invertTree(root.right),
    right: invertTree(root.left)
  }
};
```


#### LeetCode：100. 相同的树

给定两个二叉树，编写一个函数来检验它们是否相同。

如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。

示例 1:
```
输入:       1         1
          / \       / \
         2   3     2   3

        [1,2,3],   [1,2,3]

输出: true
```

示例 2:
```
输入:      1          1
          /           \
         2             2

        [1,2],     [1,null,2]

输出: false
```

示例 3:

```
输入:       1         1
          / \       / \
         2   1     1   2

        [1,2,1],   [1,1,2]

输出: false
```

解题思路：
- 两个数：根节点的值相同，左子树相同，右子树相同
- 符合“**分、解、合**”特性
- 考虑选择分而治之

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
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    if (!p && !q) { return true }
    if (p && q && p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)) {
        return true
    }
    return false    
};
```

#### LeetCode：101. 对称二叉树

给定一个二叉树，检查它是否是镜像对称的。

例如，二叉树 [1,2,2,3,4,4,3] 是对称的。
```
    1
   / \
  2   2
 / \ / \
3  4 4  3
```

但是下面这个 [1,2,2,null,3,null,3] 则不是镜像对称的:
```
    1
   / \
  2   2
   \   \
   3    3
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
 * @return {boolean}
 */
 // 时间和空间复杂度都是O(n)
var isSymmetric = function(root) {
    if (!root) { return true }
    const rec = (l, r) => {
        if (!l && !r) { return true }
        if (l && r && l.val === r.val && rec(l.left, r.right) && rec(l.right, r.left)) {
            return true
        } else {
            return false
        }
    }
    return rec(root.left, root.right)
};
```


### 算法设计思想之“动态规划” Dynamic Programming

Dynamic Programming，不是动态编程，而是动态递推

动态规划：
- 递归 + 记忆化 -> 递推
- 状态定义：opt[n], dp[n], fib[n]
- 状态转移方程：opt[n] = best_of(opt[n - 1], opt[n - 2], ...)
- 最优子结构：最优子结构推导出最优解法

#### 简介
- 动态规划是算法设计中的一种方法
- 它将一个问题分解为相互重叠的子问题，通过反复求解子问题，来解决原问题

例如：
- 斐波那契数列
```
0 1 1 2 3 5 8 13 21 .....
F(n) = F(n-1) + F(n-2)

反复执行：从2执行到n，执行上述公式
```

斐波那契数列时间复杂度最差是O(2^n)，比较好是O(n)，最好是O(logn)

```js
function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n -2)
}
// 时间复杂度是O(2^n)
```

递归+记忆化优化代码
```js
const memo = []
function fib(n) {
  if (n <= 1) {
    return n
  } else {
    if (!memo[n]) {
      memo[n] = fib(n - 1) + fib(n - 1)
    }
    return memo[n]
  }
}
// 时间复杂度可以优化为O(n)
```

递归 + 记忆化 -> 递推（自下而上）

```
// 反着递推
递推公式： F[n] = F[n - 1] + F[n - 2]

F[0] = 0
F[1] = 1
// 从2开始递推
for(let i = 2; i < n; i++) {
  F[i] = F[i - 1] + F[i - 2]
}
```

DP VS 回溯 VS 贪心
- 回溯（递归） - 重复计算，有些问题没有最优子结构，就只能穷举，回溯解决的问题就是要递归，穷举所有的可能，而且穷举的可能不存在重复计算
- 贪心 - 永远局部最优，
- DP - 记录局部最优子结构/多种记录值（集上面两种算法的大成，可能由上面两种算法转化成DP）

#### LeetCode：70. 爬楼梯

假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？

注意：给定 n 是一个正整数。

示例 1：

```
输入： 2
输出： 2
解释： 有两种方法可以爬到楼顶。
1.  1 阶 + 1 阶
2.  2 阶
```
示例 2：
```
输入： 3
输出： 3
解释： 有三种方法可以爬到楼顶。
1.  1 阶 + 1 阶 + 1 阶
2.  1 阶 + 2 阶
3.  2 阶 + 1 阶
```

解题思路：
- 爬到第n阶可以在第n-1阶爬1阶，或者第n-2阶爬2阶
- F(n) = F(n-1) + F(n-2)

解题步骤：
- 定义子问题：F(n) = F(n-1) + F(n-2)
- 反复执行：从2循环到n，执行上述公式

```js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
  // n是最小值只能为1
  if (n < 2) { return 1 }  
  // dp为[1, 1]是因为2阶的爬梯方式只有两种
  const dp = [1, 1]
  for (let i = 2; i <= n; i+=1) {
    dp[i] = dp[i - 1] + dp[i - 2]
  }
  return dp[n]
};
// 时间复杂度和空间复杂度都是O(n)


var climbStairs = function(n) {
  if (n < 2) { return 1 }
  let dp0 = 1
  let dp1 = 1
  for (let i = 2; i <= n; i+=1) {
    const temp = dp0
    dp0 = dp1
    dp1 = dp1 + temp
  }
  return dp1
}
// 时间复杂度O(n), 空间复杂度O(1)
```

#### LeetCode：198. 打家劫舍

你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。

给定一个代表每个房屋存放金额的非负整数数组，计算你 不触动警报装置的情况下 ，一夜之内能够偷窃到的最高金额。

 

示例 1
```
输入：[1,2,3,1]
输出：4
解释：偷窃 1 号房屋 (金额 = 1) ，然后偷窃 3 号房屋 (金额 = 3)。
     偷窃到的最高金额 = 1 + 3 = 4 。
```
示例 2
```
输入：[2,7,9,3,1]
输出：12
解释：偷窃 1 号房屋 (金额 = 2), 偷窃 3 号房屋 (金额 = 9)，接着偷窃 5 号房屋 (金额 = 1)。
     偷窃到的最高金额 = 2 + 9 + 1 = 12 。
```

解题思路：
- f(k)=从前k个房屋中能偷窃到最大金额数
- Ak=第k个房屋的钱数
- f(k)=max(f(k - 2) + Ak, f(k - 1))

```js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if (!nums.length) { return 0 }
    let dp0 = 0
    let dp1 = nums[0]
    for(let i = 2; i <= nums.length; i+=1) {
        const dp2 = Math.max(dp0 + nums[i - 1], dp1)
        dp0 = dp1
        dp1 = dp2
    }
    return dp1
};
// 时间复杂度O(n),空间复杂度O(1)
```

#### 120. 三角形最小路径和

给定一个三角形 triangle ，找出自顶向下的最小路径和。

每一步只能移动到下一行中相邻的结点上。相邻的结点 在这里指的是 下标 与 上一层结点下标 相同或者等于 上一层结点下标 + 1 的两个结点。也就是说，如果正位于当前行的下标 i ，那么下一步可以移动到下一行的下标 i 或 i + 1 。

 

示例 1：
```
输入：triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
输出：11
解释：如下面简图所示：
   2
  3 4
 6 5 7
4 1 8 3
自顶向下的最小路径和为 11（即，2 + 3 + 5 + 1 = 11）。
```

```js
var minimumTotal = function(triangle) {
  const min = triangle[triangle.length - 1]
  for(let i = triangle.length - 2; i >= 0; i--) {
    for(let j = 0; j < triangle[i].length; j++) {
      min[j] = triangle[i][j] + Math.min(min[j], min[j + 1])
      console.log(min)
    }
  }
  return min[0]
}
```

### 第14章 算法设计思想之“贪心算法”

#### 贪心算法简介

- 贪心算法是算法设计中的一种方法， 又称贪婪算法：在对问题求解时，总是做出在当前看来是最好的选择
- 期盼通过每个阶段的局部最优选择，从而达到全局的最优
- 结果并不一定是最优

`使用Greedy的场景`

简单地说， 问题能够分解成子问题来解决，子问题的最优解能递推到最终问题的最优解（子问题的最优解可遇不可求）。这种子问题最优解成为最优子结构

贪心算法与动态规划的不同在于，它对每个子问题的解决方案都做出选择，不能回退。动态规划则会保存以前的运算结果，并根据以前的结果对当前进行选择，有回退功能。


####  LeetCode：455. 分饼干

假设你是一位很棒的家长，想要给你的孩子们一些小饼干。但是，每个孩子最多只能给一块饼干。

对每个孩子 i，都有一个胃口值 g[i]，这是能让孩子们满足胃口的饼干的最小尺寸；并且每块饼干 j，都有一个尺寸 s[j] 。如果 s[j] >= g[i]，我们可以将这个饼干 j 分配给孩子 i ，这个孩子会得到满足。你的目标是尽可能满足越多数量的孩子，并输出这个最大数值。

示例 1:
```
输入: g = [1,2,3], s = [1,1]
输出: 1
解释: 
你有三个孩子和两块小饼干，3个孩子的胃口值分别是：1,2,3。
虽然你有两块小饼干，由于他们的尺寸都是1，你只能让胃口值是1的孩子满足。
所以你应该输出1。
```

示例 2:
```
输入: g = [1,2], s = [1,2,3]
输出: 2
解释: 
你有两个孩子和三块小饼干，2个孩子的胃口值分别是1,2。
你拥有的饼干数量和尺寸都足以让所有孩子满足。
所以你应该输出2.
```

解题思路：
- 局部最优：既能满足孩子，还消耗最小
- 先将“较小的饼干”分给“胃口最小”的孩子

解题步骤：
- 对饼干数组和胃口数组升序排序
- 遍历饼干数组，找到满足第一个孩子的饼干
- 然后继续遍历饼干数组，找到满足第二，第三，......n个孩子的饼干

```js
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
 // 时间复杂度是O(nlogn), 空间复杂度是O(1)
var findContentChildren = function(g, s) {
  const sortFn = (a, b) => {
    return a - b
  }
  // sort时间复杂度是O(nlogn)
  g.sort(sortFn)
  s.sort(sortFn)
  let i = 0;
  // O(n)
  s.forEach(n => {
    if (n >= g[i]) {
      i+=1
    }
  })
  return i
}
```


#### LeetCode：122. 买卖股票的最佳时机 II（最公正是动态规划）

给定一个数组，它的第 i 个元素是一支给定股票第 i 天的价格。

设计一个算法来计算你所能获取的最大利润。你可以尽可能地完成更多的交易（多次买卖一支股票）。

注意：你不能同时参与多笔交易（你必须在再次购买前出售掉之前的股票）。


示例 1:
```
输入: [7,1,5,3,6,4]
输出: 7
解释: 在第 2 天（股票价格 = 1）的时候买入，在第 3 天（股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     随后，在第 4 天（股票价格 = 3）的时候买入，在第 5 天（股票价格 = 6）的时候卖出, 这笔交易所能获得利润 = 6-3 = 3 。
```
示例 2:
```
输入: [1,2,3,4,5]
输出: 4
解释: 在第 1 天（股票价格 = 1）的时候买入，在第 5 天 （股票价格 = 5）的时候卖出, 这笔交易所能获得利润 = 5-1 = 4 。
     注意你不能在第 1 天和第 2 天接连购买股票，之后再将它们卖出。
     因为这样属于同时参与了多笔交易，你必须在再次购买前出售掉之前的股票。
```
示例 3:
```
输入: [7,6,4,3,1]
输出: 0
解释: 在这种情况下, 没有交易完成, 所以最大利润为 0。
```

解题思路
- 前提：上帝视角，知道未来的价格
- 局部最优：见好就收，见差就不动，不做任何交易

解题步骤：
- 新建一个变量，用来统计总利润
- 遍历价格数组，如果当前价格比昨天高，就在昨天买，今天卖，否则不交易
- 遍历结束后，返回所有利润之和

```js
/**
 * @param {number[]} prices
 * @return {number}
 */
// 方法一：dfs深度优先遍历股票的买卖情况O(2^n)
// 方法二：贪心算法
var maxProfit = function(prices) {
    let profit = 0;
    for(let i = 1; i < prices.length; i+=1) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1]
        }
    }
    return profit
};
// 方法三：动态规划
```

### 算法设计思想之“回溯算法”

#### 简介
- 回溯算法是一种渐进式寻找并构建问题解决方式的策略
- 回溯算法会先从一个可能的动作开始解决问题，如果不行，就回溯并选择另一个动作，直至将问题解决

什么问题适合用回溯算法解决？
- 有很多出路
- 这些路里，有死路（不符合题目要求），有出路（符合题目要求）
- 通常需要递归来模拟所有的路

#### LeetCode：46. 全排列

给定一个 没有重复 数字的序列，返回其所有可能的全排列。

示例:
```
输入: [1,2,3]
输出:
[
  [1,2,3],
  [1,3,2],
  [2,1,3],
  [2,3,1],
  [3,1,2],
  [3,2,1]
]
```
解题步骤：
- 用递归模拟出所有的情况
- 遇到包含重复元素的情况，就回溯
- 收集所有到达递归终点的情况，并返回


```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
 // 时间复杂度是O(n!) = 1 * 2 * ....* n 每次循环都少一次
 // 空间复杂度O(n)
var permute = function(nums) {
  const res = [];
  const backtrack = (path) => {
    if (path.length === nums.length) {
      res.push(path)
    }
    nums.forEach(n => {
      if (path.includes(n)) { return }
      backtrack(path.concat(n))
    })
  }
  backtrack([])
  return res;
};
```

#### LeetCode：78. 子集

给定一组不含重复元素的整数数组 nums，返回该数组所有可能的子集（幂集）。

说明：解集不能包含重复的子集。

示例:
```
输入: nums = [1,2,3]
输出:
[
  [3],
  [1],
  [2],
  [1,2,3],
  [1,3],
  [2,3],
  [1,2],
  []
]
```

解题思路：
- 要求：1.要求所有子集，2、没有重复元素
- 有出路，有死路

解题步骤：
- 用递归模拟出所有情况
- 保证接的数字都是后面的数字
- 收集所有的到达递归终点的情况

```js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
// 时间复杂度O(2^N) 空间复杂度O(n)
var subsets = function(nums) {
  const res = [];
  const backtrack = (path, l, start) => {
    if (path.length === l) {
      res.push(path)
      return
    }
    for(let i = start; i < nums.length; i+=1) {
      backtrack(path.concat(nums[i]), l, i + 1)
    }
  }
  // 子集的长度有可能是0到n
  for(let i = 0; i <= nums.length; i+=1) {
    backtrack([], i, 0)
  }
  return res
};
```

#### LeetCode：225. 用队列实现栈

使用队列实现栈的下列操作：

- push(x) -- 元素 x 入栈
- pop() -- 移除栈顶元素
- top() -- 获取栈顶元素
- empty() -- 返回栈是否为空

注意:

- 你只能使用队列的基本操作-- 也就是 push to back, peek/pop from front, size, 和 is empty 这些操作是合法的。
- 你所使用的语言也许不支持队列。 你可以使用 list 或者 deque（双端队列）来模拟一个队列 , 只要是标准的队列操作即可。
- 你可以假设所有操作都是有效的（例如, 对一个空的栈不会调用 pop 或者 top 操作）。

解题思路：两个队列
```
创建两个队列queue1和queue2，queue2用来入队，再把queue1的元素遍历插入queue2，再把queue2遍历插回queue1，这样就能保证队顶即为栈顶元素
```

```js
/**
 * Initialize your data structure here.
 */
// 队列只能用push(), shift()
var MyStack = function() {
    this.queue1 = []
    this.queue2 = []
};

/**
 * Push element x onto stack. 
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function(x) {
    this.queue2.push(x)
    while(this.queue1.length) {
        this.queue2.push(this.queue1.shift())
    }
    while(this.queue2.length) {
        this.queue1.push(this.queue2.shift())
    }
};

/**
 * Removes the element on top of the stack and returns that element.
 * @return {number}
 */
MyStack.prototype.pop = function() {
    return this.queue1.shift()
};

/**
 * Get the top element.
 * @return {number}
 */
MyStack.prototype.top = function() {
    return this.queue1[0]
};

/**
 * Returns whether the stack is empty.
 * @return {boolean}
 */
MyStack.prototype.empty = function() {
    return this.queue1.length === 0
};

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */
```


