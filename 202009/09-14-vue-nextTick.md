## 2020-09-02


## 理解Vue.nextTick

### 一、什么是Vue.nextTick

官方定义：在下次DOM更新循环结束之后执行的延迟回调。在修改数据之后立即使用该方法，获取更新后的DOM。

简单理解：Vue.nextTick是基于事件循环机制，当页面中的数据发生改变了，就会把该任务放到一个异步队列中，只有在当前任务空闲时才会进行DOM渲染，当DOM渲染完成以后，该函数就会自动执行。

### 二、在created生命周期中进行DOM操作

在Vue生命周期中，只有在mounted生命周期中我们的HTML才渲染完成，因此在该生命周期中，我们就可以获取到页面中的DOM节点，但是如果我们在 created 生命周期中是访问不到DOM节点的。

在该生命周期中我们想要获取DOM节点的话,我们需要使用 this.$nextTick() 函数。

```html
<!DOCTYPE html>
<html>
<head>
  <title>vue.nextTick()方法的使用</title>
  <meta charset="utf-8">
  
</head>
<body>
  <div id="app">
    <template>
      <div ref="list">{{name}}</div>
    </template>
  </div>
  <script type="text/javascript" src="https://cn.vuejs.org/js/vue.js"></script>
  <script type="text/javascript">
    new Vue({
      el: '#app',
      data: {
        name: 'kongzhi111'
      },
      created() {
        console.log(this.$refs.list); // 打印undefined
        this.$nextTick(() => {
          console.log(this.$refs.list); // 打印出 "<div>kongzhi111</div>"
        });
      }
    })
  </script>
</body>
</html>
```

### 三、Vue.nextTick的调用方式

Vue.nextTick([callback, context]) 和 vm.$nextTick([callback]);

**Vue.nextTick([callback, context])**：该方法是全局方法，该方法可接收2个参数，分别为回调函数和执行回调函数的上下文环境。

**vm.$nextTick([callback])**: 该方法是实列方法，执行时自动绑定this到当前的实列上。

### 四、vm.$nextTick 与 setTimeout 的区别是什么？

nextTick 源码在 src/core/util/next-tick.js 里面，

在vue中使用了三种情况来延迟调用该函数：
- 首先我们会判断我们的设备是否支持Promise对象，如果支持的话，会使用 Promise.then 来做延迟调用函数。
- 如果设备不支持Promise对象，再判断是否支持 MutationObserver 对象，如果支持该对象，就使用MutationObserver来做延迟，
- 最后如果上面两种都不支持的话，我们会使用 setTimeout(() => {}, 0); setTimeout 来做延迟操作。

>在比较 nextTick 与 setTimeout 的区别，其实可以比较 promise 或 MutationObserver 对象 与 setTimeout的区别的了

扩展：

`理解Event Loop 的概念`

javascript是单线程的，所有的任务都会在主线程中执行的，当主线程中的任务都执行完成之后，系统会 "依次" 读取任务队列里面的事件，因此对应的异步任务进入主线程，开始执行。

异步任务队列又分为: macrotasks(宏任务) 和 microtasks(微任务)

macrotasks(宏任务): setTimeout、setInterval、setImmediate、I/O、UI rendering 等。

microtasks(微任务): Promise、process.nextTick、MutationObserver 等。

promise的then方法的函数会被推入到 microtasks(微任务) 队列中，而setTimeout函数会被推入到 macrotasks(宏任务) 任务队列中，在每一次事件循环中 macrotasks(宏任务) 只会提取一个执行，而 microtasks(微任务) 会一直提取，直到 microtasks(微任务)队列为空为止。

如果某个 microtasks(微任务) 被推入到执行中，那么当主线程任务执行完成后，会循环调用该队列任务中的下一个任务来执行，直到该任务队列到最后一个任务为止。而事件循环每次只会入栈一个 macrotasks(宏任务), 主线程执行完成该任务后又会循环检查 microtasks(微任务) 队列是否还有未执行的，直到所有的执行完成后，再执行 macrotasks(宏任务)。 依次循环，直到所有的异步任务完成为止。

### 五：理解 MutationObserver

MutationObserver的作用是监听DOM变动的接口，当DOM发生任何变动，MutationObserver会得到通知。

它和事件类似，但有所不同，事件是同步的，当DOM发生变动时，事件会立刻处理，但是 MutationObserver 则是异步的，它不会立即处理，而是等页面上所有的DOM完成后，会执行一次，如果页面上要操作100次DOM的话，如果是事件的话会监听100次DOM，但是我们的 MutationObserver 只会执行一次，它是等待所有的DOM操作完成后，再执行。

```html
<!DOCTYPE html>
<html>
<head>
  <title>MutationObserver</title>
  <meta charset="utf-8">
</head>
<body>
  <div id="app">
    <ul>
      <li>kongzhi111</li>
    </ul>
  </div>
  <script type="text/javascript">
    // 兼容不同浏览器
    var MutationObserver = window.MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver;
    // 检测浏览器是否支持该属性
    var observeMutationSupport = !!MutationObserver;
    var list = document.querySelector('ul');
    var Observer = new MutationObserver(function(mutations, instance) {
      console.log(mutations);  // 打印mutations 如下图对应的
      console.log(instance);   // 打印instance 如下图对于的
      mutations.forEach(function(mutation){
        console.log(mutation); // 打印mutation
      });
    });
    // observe() 该方法是要观察DOM节点的变动的。该方法接收2个参数，第一个参数是要观察的DOM元素，第二个是要观察的变动类型。
    // observer.observe(dom, options);
    // ptions 类型有如下：
    // childList: 子节点的变动。
    // attributes: 属性的变动。
    // characterData: 节点内容或节点文本的变动。
    // subtree: 所有后代节点的变动。
    Observer.observe(list, {
      childList: true, // 子节点的变动
      subtree: true // 所有后代节点的变动
    });
    var li = document.createElement('li');
    var textNode = document.createTextNode('kongzhi');
    li.appendChild(textNode);
    list.appendChild(li);
  </script>
</body>
</html>
```

需要观察哪一种变动类型，需要在options对象中指定为true即可; 但是如果设置subtree的变动，必须同时指定childList, attributes, 和 characterData 中的一种或多种。

### 六、nextTick源码分析

vue源码在 vue/src/core/util/next-tick.js 中。源码如下：

```js
import { noop } from 'shared/util'
import { handleError } from './error'
import { isIE, isIOS, isNative } from './env'
export let isUsingMicroTask = false
// 用来存储所有需要执行的回调函数
const callbacks = []
// 该变量的作用是表示状态，判断是否有正在执行的回调函数。
let pending = false
// 该函数的作用是用来执行callbacks里面存储的所有回调函数。
function flushCallbacks () {
  /*
   设置 pending 为 false, 说明该 函数已经被推入到任务队列或主线程中。需要等待当前
   栈执行完毕后再执行。
  */
  pending = false
  // 拷贝一个callbacks函数数组的副本
  const copies = callbacks.slice(0)
  // 把函数数组清空
  callbacks.length = 0
  for (let i = 0; i < copies.length; i++) {
    // 循环该函数数组，依次执行。
    copies[i]()
  }
}
//  timerFunc 函数被推送到任务队列中去则不需要重复推送
let timerFunc;
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  const p = Promise.resolve()
  timerFunc = () => {
    p.then(flushCallbacks)
    if (isIOS) setTimeout(noop)
  }
  isUsingMicroTask = true
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  // MutationObserver构造函数, 并且把flushCallbacks函数当做callback的回调, 然后我们会创建一个文本节点, 之后会使用MutationObserver对象的observe来监听该文本节点, 如果文本节点的内容有任何变动的话，它就会触发 flushCallbacks 回调函数。
  // 在该代码内有一个 timerFunc 函数, 如果我们触发该函数, 会导致文本节点的数据发生改变，进而触发MutationObserver构造函数。
  let counter = 1
  const observer = new MutationObserver(flushCallbacks)
  const textNode = document.createTextNode(String(counter))
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    counter = (counter + 1) % 2
    textNode.data = String(counter)
  }
  isUsingMicroTask = true
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  timerFunc = () => {
    // 会判断设备是否支持 setImmediate, 我们上面分析过, 他属于 macrotasks(宏任务)的
    setImmediate(flushCallbacks)
  }
} else {
  // Fallback to setTimeout.(使用setTimeout 做降级处理)
  timerFunc = () => {
    setTimeout(flushCallbacks, 0)
  }
}

// nextTick 函数接收2个参数，cb 是一个回调函数, ctx 是一个上下文。 首先会把它存入callbacks函数数组里面去, 在函数内部会判断cb是否是一个函数，如果是一个函数，就调用执行该函数，当然它会在callbacks函数数组遍历的时候才会被执行。其次 如果cb不是一个函数的话, 那么会判断是否有_resolve值, 有该值就使用Promise.then() 这样的方式来调用。比如: this.$nextTick().then(cb) 这样的使用方式。因此在下面的if语句内会判断赋值给_resolve：
export function nextTick (cb?: Function, ctx?: Object) {
  let _resolve
  // 1.将传入的 flushSchedulerQueue 方法添加到回调数组
  callbacks.push(() => {
    if (cb) {
      try {
        cb.call(ctx)
      } catch (e) {
        handleError(e, ctx, 'nextTick')
      }
    } else if (_resolve) {
      _resolve(ctx)
    }
  })
  if (!pending) {
    pending = true
    // 此方法会根据浏览器兼容性，选用不同的异步策略
    timerFunc()
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => {
      _resolve = resolve
    })
  }
}
```

 nextTick 是Vue中的一个全局函数, 在Vue里面会有一个Watcher, 它用于观察数据的变化, 然后更新DOM, 但是在Vue中并不是每次数据改变都会触发更新DOM的, 而是将这些操作都缓存到一个队列中, 在一个事件循环结束后, 会刷新队列, 会统一执行DOM的更新操作。

 在Vue中使用的是Object.defineProperty来监听每个对象属性数据变化的, 当监听到数据发生变化的时候, 我们需要把该消息通知到所有的订阅者, 也就是Dep, 那么Dep则会调用它管理的所有的Watch对象，因此会调用Watch对象中的update方法, 我们可以看下源码中的update的实现。源码在 vue/src/core/observer/watcher.js 中如下代码:

 ```js
 update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true
  } else if (this.sync) {
    // 同步执行渲染视图
    this.run()
  } else {
    // 异步推送到观察者队列中
    queueWatcher(this)
  }
}
 ```

Vue中它默认是使用异步执行DOM更新的。当异步执行update的时候，它默认会调用 queueWatcher 函数。

queueWatcher 函数代码如下: (源码在: vue/src/core/observer/scheduler.js) 中。
 ```js
 export function queueWatcher (watcher: Watcher) {
  const id = watcher.id
  if (has[id] == null) {
    has[id] = true
    if (!flushing) {
      // 将当前 Watcher 添加到异步队列
      queue.push(watcher)
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      let i = queue.length - 1
      while (i > index && queue[i].id > watcher.id) {
        i--
      }
      queue.splice(i + 1, 0, watcher)
    }
    // queue the flush
    if (!waiting) {
      waiting = true

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue()
        return
      }
      // 6. 执行异步队列，并传入回调
      nextTick(flushSchedulerQueue)
    }
  }
}
 ```

```js
// 更新视图的具体方法
function flushSchedulerQueue() {
  let watcher, id;
  // 排序，先渲染父节点，再渲染子节点
  // 这样可以避免不必要的子节点渲染，如：父节点中 v-if 为 false 的子节点，就不用渲染了
  queue.sort((a, b) => a.id - b.id);
  // 遍历所有 Watcher 进行批量更新。
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    // 更新 DOM
    watcher.run();
  }
}
```

![nextTick-2]()


总结：
- Data 对象：Vue 中的 data 方法中返回的对象。
- Dep 对象：每一个 Data 属性都会创建一个 Dep，用来搜集所有使用到这个 Data 的 Watcher 对象。
- Watcher 对象：主要用于渲染 DOM。

>Vue 在调用 Watcher 更新视图时，并不会直接进行更新，而是把需要更新的 Watcher 加入到 Queue 队列里，然后把具体的更新方法 flushSchedulerQueue 传给 nextTick 进行调用。

流程：
- 修改 Vue 中的 Data 时，就会触发所有和这个 Data 相关的 Watcher 进行更新。
- 首先，会将所有的 Watcher 加入队列 Queue。
- 然后，调用 nextTick 方法，执行异步任务。
- 在异步任务的回调中，对 Queue 中的 Watcher 进行排序，然后执行对应的 DOM 更新。

 参考：
 - https://www.cnblogs.com/tugenhua0707/p/11756584.html
 - https://segmentfault.com/a/1190000023649590