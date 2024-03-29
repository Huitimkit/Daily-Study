## 2020-07-25

## 浏览器工作原理与实践

### 第二十一章 Chrome开发者⼯具：利⽤⽹络⾯板做性能分析

DOMContentLoaded 说明⻚⾯已经构建好DOM了，这意味着构建DOM所需要的HTML⽂件、JavaScript⽂件、CSS⽂件都已经下载完成了。

Load，说明浏览器已经加载了所有的资源（图像、样式表等）


#### ⽹络⾯板中的详细列表

- 单个资源的时间线

  ![single resource http request.png]()

  - 发起⼀个HTTP请求之后，浏览器⾸先查找缓存
  - 如果缓存没有命中，那么继续发起DNS请求获取IP地址，
  - 然后利⽤IP地址和服务器端建⽴TCP连接，
  - 再发送HTTP请求，等待服务器响应；
  - 不过，如果服务器响应头中包含了重定向的信息，那么整个流程就需要重新再⾛⼀遍。

![file timeline]()

- Queuing：当浏览器发起⼀个请求的时候，会有很多原因导致该请求不能被⽴即执⾏，⽽是需要排队等待。

  导致请求处于排队状态的原因有很多：
  - ⾸先，**⻚⾯中的资源是有优先级的**，⽐如CSS、HTML、JavaScript等都是⻚⾯中的核⼼⽂件，所以优先级最⾼；⽽图⽚、视频、⾳频这类资源就不是核⼼资源，优先级就⽐较低。通常当后者遇到前者时，就需要“让路”，进⼊待排队状态。
  - 其次，浏览器会为每个域名最多维护6个TCP连接，如果发起⼀个HTTP请求时，这6个TCP连接都处于忙碌状态，那么这个请求就会处于排队状态。
  - 最后，⽹络进程在为数据分配磁盘空间时，新的HTTP请求也需要短暂地等待磁盘分配结束。

  等待排队完成之后，就要进⼊发起连接的状态了。不过在发起连接之前，还有⼀些原因可能导致连接过程被推迟，这个推迟就表现在⾯板中的**Stalled上**，**它表⽰停滞的意思**。

  > 需要注意的是，如果你使⽤了代理服务器，还会增加⼀个Proxy Negotiation阶段，也就是代理协商阶段，它表⽰代理服务器连接协商所⽤的时间

- Initial connection/SSL阶段：也就是和服务器建⽴连接的阶段

  这包括了**建⽴TCP连接**所花费的时间；不过如果你使⽤了HTTPS协议，那么还需要⼀个额外的**SSL握⼿**时间，

- Request sent阶段

  和服务器建⽴好连接之后，⽹络进程会准备请求数据，并将其发送给⽹络。通常这个阶段⾮常快，因为只需要把浏览器缓冲区的数据发送出去就结束了，并不需要判断服务器是否接收到了，所以这个时间通常不到1毫秒。

- Waiting (TTFB)：数据发送出去了，接下来就是等待接收服务器第⼀个字节的数据，通常也称为“第⼀字节时间”。

  TTFB是反映服务端响应速度的重要指标，对服务器来说，TTFB 时间越短，就说明服务器响应越快。

- Content Download阶段：味着从第⼀字节时间到接收到全部响应数据所⽤的时

#### 优化时间线上耗时项

- 排队（Queuing）时间过久
  - **域名分⽚**技术：浏览器为每个域名最多维护6个连接，可以让1个站点下⾯的资源放在多个域名下⾯⽐如放到3个域名下⾯，这样就可以同时⽀持18个连接了。
  - **HTTP2**：HTTP2已经没有每个域名最多维护6个TCP连接的限制

- 第⼀字节时间（TTFB）时间过久

  原因：
  - 服务器⽣成⻚⾯数据的时间过久
  - ⽹络的原因。⽐如使⽤了低带宽的服务器，或者本来⽤的是电信的服务器，可联通的⽹络⽤⼾要来访问你的服务器，这样也会拖慢⽹速。
  - 发送请求头时带上了多余的⽤⼾信息。⽐如⼀些不必要的Cookie信息，服务器接收到这些Cookie信息之后可能需要对每⼀项都做处理，这样就加⼤了服务器的处理时⻓。

  解决方案：
  - 提⾼服务器的处理速度，⽐如通过增加各种缓存的技术；
  - 第⼆种⽹络问题，你可以使⽤CDN来缓存⼀些静态⽂件；
  - 第三种，你在发送请求时就去尽可能地减少⼀些不必要的Cookie数据信息。

- Content Download时间过久

  Content Download花费了⼤量时间，有可能是字节数太多的原因导致的。

  解决方案： 减少⽂件⼤⼩，⽐如压缩、去掉源码中不必要的注释等⽅法。

---

### 第二十二章 DOM树：JavaScript是如何影响DOM树构建的？

#### 什么是DOM

从⽹络传给渲染引擎的HTML⽂件字节流是⽆法直接被渲染引擎理解的，所以要将其转化为渲染引擎能够理解的内部结构，这个结构就是DOM。

在渲染引擎中，DOM有三个层⾯的作⽤：
- 从⻚⾯的视⻆来看，DOM是⽣成⻚⾯的基础数据结构。
- 从JavaScript脚本视⻆来看，DOM提供给JavaScript脚本操作的接⼝，通过这套接⼝，JavaScript可以对DOM结构进⾏访问，从⽽改变⽂档的结构、样式和内容。
- 从安全视⻆来看，DOM是⼀道安全防护线，⼀些不安全的内容在DOM解析阶段就被拒之⻔外了。

#### DOM树如何⽣成

在渲染引擎内部，有⼀个叫HTML解析器（HTMLParser）的模块，它的职责就是负责将HTML字节流转换为DOM结构。

**⽹络进程加载了多少数据，HTML解析器便解析多少数据**。

⽹络进程接收到响应头之后，会根据请求头中的content-type字段来判断⽂件的类型，⽐如content-type的值是“text/html”，那么浏览器就会判断这是⼀个HTML类型的⽂件，然后为该请求选择或者创建⼀个渲染进程。渲染进程准备好之后，⽹络进程和渲染进程之间会建⽴⼀个共享数据的管道，⽹络进程接收到数据后就往这个管道⾥⾯放，⽽渲染进程则从管道的另外⼀端不断地读取数据，并同时将读取的数据“喂”给HTML解析器。你可以把这个管道想象成⼀个“⽔管”，⽹络进程接收到的字节流像⽔⼀样倒进这个“⽔管”，⽽“⽔管”的另外⼀端是渲染进程的HTML解析器，它会动态接收字节流，并将其解析为DOM。

![byte to dom]()

- 第⼀个阶段，通过分词器将字节流转换为Token，分为Tag Token和⽂本Token，Tag Token⼜分StartTag 和 EndTag。
- 第⼆个和第三个阶段是同步进⾏的，需要将Token解析为DOM节点，并将DOM节点添加到DOM树中。

HTML解析器维护了⼀个Token栈结构，该Token栈主要⽤来计算节点之间的⽗⼦关系，在第⼀个阶段中⽣成的Token会被按照顺序压到这个栈中。具体的处理规则如下所⽰：
- 如果压⼊到栈中的是StartTag Token，HTML解析器会为该Token创建⼀个DOM节点，然后将该节点加⼊到DOM树中，它的⽗节点就是栈中相邻的那个元素⽣成的节点。
- 如果分词器解析出来是⽂本Token，那么会⽣成⼀个⽂本节点，然后将该节点加⼊到DOM树中，⽂本Token是不需要压⼊到栈中，它的⽗节点就是当前栈顶Token所对应的DOM节点。
- 如果分词器解析出来的是EndTag标签，⽐如是EndTag div，HTML解析器会查看Token栈顶的元素是否是StarTag div，如果是，就将StartTag div从栈中弹出，表⽰该div元素解析完成。

HTML解析器开始⼯作时，会默认创建了⼀个根为document的空DOM结构，再执行以上流程

#### JavaScript是如何影响DOM⽣成的

解析到<script>标签时，渲染引擎判断这是⼀段脚本，此时HTML解析器就会暂停DOM的解析，因为接下来的JavaScript可能要修改当前已经⽣成的DOM结构。

JavaScript⽂件的下载过程会阻塞DOM解析，⽽通常下载⼜是⾮常耗时的，会受到⽹络环境、JavaScript⽂件⼤⼩等因素的影响。

不过Chrome浏览器做了很多优化，其中⼀个主要的优化是预解析操作。当渲染引擎收到字节流之后，会开启⼀个预解析线程，⽤来分析HTML⽂件中包含的JavaScript、CSS等相关⽂件，解析到相关⽂件之后，预解析线程会提前下载这些⽂件。

相关策略规避：
- 使⽤CDN来加速JavaScript⽂件的加载
- 压缩JavaScript⽂件的体积。
- JavaScript脚本设置为异步加载，通过async 或 defer 来标记代码
    - 使⽤async标志的脚本⽂件⼀旦加载完成，会⽴即执⾏；
    - 使⽤了defer标记的脚本⽂件，需要等到DOMContentLoaded事件之后执⾏。

执⾏JavaScript之前，需要先解析JavaScript语句之上所有的CSS样式。所以如果代码⾥引⽤了外部的CSS⽂件，那么在执⾏JavaScript之前，还需要等待外部的CSS⽂件下载完成，并解析⽣成CSSOM对象之后，才能执⾏JavaScript脚本。

JavaScript会阻塞DOM⽣成，⽽样式⽂件⼜会阻塞JavaScript的执⾏

渲染引擎还有⼀个安全检查模块叫XSSAuditor，是⽤来检测词法安全的。在分词器解析出来Token之后，它会检测这些模块是否安全，⽐如是否引⽤了外部脚本，是否符合CSP规范，是否存在跨站点请求等。如果出现不符合规范的内容，XSSAuditor会对该脚本或者下载任务进⾏拦截。


### 第二十三章 DOM树：JavaScript是如何影响DOM树构建的？

```html
<html>
<head>
  <link href="theme.css" rel="stylesheet">
</head>
<body>
  <div>geekbang com</div>
</body>
</html>
```

![render pipeline]()

请求HTML数据和构建DOM中间有⼀段空闲时间，这个空闲时间有可能成为⻚⾯渲染的瓶颈。

当渲染进程接收HTML⽂件字节流时，会先开启⼀个预解析线程，如果遇到JavaScript⽂件或者CSS⽂件，那么预解析线程会提前下载这些数据。对于上⾯的代码，预解析线程会解析出来⼀个外部的theme.css⽂件，并发起theme.css的下载。

#### 那渲染流⽔线为什么需要CSSOM呢？

渲染引擎也是⽆法直接理解CSS⽂件内容的，所以需要将其解析成渲染引擎能够理解的结构，这个结构就是CSSOM。

CSSOM也具有两个作⽤：
- 第⼀个是提供给JavaScript操作样式表的能⼒，
- 第⼆个是为布局树的合成提供基础的样式信息

这个CSSOM体现在DOM中就是document.styleSheets

DOM和CSSOM都构建好之后，渲染引擎就会构造布局树：
- 布局树的结构基本上就是复制DOM树的结构，不同之处在于DOM树中那些不需要显⽰的元素会被过滤掉，如display:none属性的元素、head标签、script标签等。
- 复制好基本的布局树结构之后，渲染引擎会为对应的DOM元素选择对应的样式信息，这个过程就是样式计算。
- 样式计算完成之后，渲染引擎还需要计算布局树中每个元素对应的⼏何位置，这个过程就是计算布局。

在解析DOM的过程中，如果遇到了JavaScript脚本，那么需要先暂停DOM解析去执⾏JavaScript

因为JavaScript有修改CSSOM的能⼒，所以在执⾏JavaScript之前，还需要依赖CSSOM。也就是说CSS在部分情况下也会阻塞DOM的⽣成

```html
<html>
<head>
  <link href="theme.css" rel="stylesheet">
</head>
<body>
  <div>geekbang com</div>
  <script>
    console.log('time.geekbang.org')
  </script>
  <div>geekbang com</div>
</body>
</html>
```

![render pipeline2]()

```html
<html>
<head>
  <link href="theme.css" rel="stylesheet">
</head>
<body>
  <div>geekbang com</div>
  <script src='foo.js'></script>
  <div>geekbang com</div>
</body>
</html>
```

HTML预解析器识别出来了有CSS⽂件和JavaScript⽂件需要下载，这两个⽂件的下载过程是重叠的，所以下载时间按照最久的那个⽂件来算。

不管CSS⽂件和JavaScript⽂件谁先到达，都要先等到CSS⽂件下载完成并⽣成CSSOM，然后再执⾏JavaScript脚本，最后再继续构建DOM，构建布局树，绘制⻚⾯。

#### 影响⻚⾯展⽰的因素以及优化策略

渲染流⽔线影响到了⾸次⻚⾯展⽰的速度，⽽⾸次⻚⾯展⽰的速度⼜直接影响到了⽤⼾体验

为了缩短⽩屏时间，我们来挨个分析这个阶段的主要任务，包括了解析HTML、下载CSS、下载JavaScript、⽣成CSSOM、执⾏JavaScript、⽣成布局树、绘制⻚⾯⼀系列操作。

通常情况下的瓶颈主要体现在下载CSS⽂件、下载JavaScript⽂件和执⾏JavaScript。

所以要想缩短⽩屏时⻓，可以有以下策略：

- 通过内联JavaScript、内联CSS来移除这两种类型的⽂件下载，这样获取到HTML⽂件之后就可以直接开始渲染流程了。
- 但并不是所有的场合都适合内联，那么还可以尽量减少⽂件⼤⼩，⽐如通过webpack等⼯具移除⼀些不必要的注释，并压缩JavaScript⽂件。
- 还可以将⼀些不需要在解析HTML阶段使⽤的JavaScript标记上async或者defer。
- 对于⼤的CSS⽂件，可以通过媒体查询属性，将其拆分为多个不同⽤途的CSS⽂件，这样只有在特定的场景下才会加载特定的CSS⽂件。
---

### 第二十四章 分层和合成机制：为什么CSS动画⽐JavaScript⾼效？

#### 显⽰器是怎么显⽰图像的

每个显⽰器都有固定的刷新频率，通常是60HZ，也就是每秒更新60张图⽚

更新的图⽚都来⾃于显卡中⼀个叫前缓冲区的地⽅

显⽰器所做的任务很简单，就是每秒固定读取60次前缓冲区中的图像，并将读取的图像显⽰到显⽰器上。

`那么这⾥显卡做什么呢？`

显卡的职责就是合成新的图像，并将图像保存到后缓冲区中

⼀旦显卡把合成的图像写到后缓冲区，系统就会让后缓冲区和前缓冲区互换，这样就能保证显⽰器能读取到最新显卡合成的图像。

通常情况下，显卡的更新频率和显⽰器的刷新频率是⼀致的。但有时候，在⼀些复杂的场景中，显卡处理⼀张图⽚的速度会变慢，这样就会造成视觉上的卡顿。

#### 帧 VS 帧率

⼤多数设备屏幕的更新频率是60次/秒，这也就意味着正常情况下要实现流畅的动画效果，渲染引擎需要每秒更新60张图⽚到显卡的后缓冲区。

我们把渲染流⽔线⽣成的每⼀副图⽚称为⼀帧，把渲染流⽔线每秒更新了多少帧称为帧率，⽐如滚动过程中1秒更新了60帧，那么帧率就是60Hz（或者60FPS）。

Chrome对浏览器渲染⽅式做了⼤量的⼯作，其中最卓有成效的策略就是引⼊了分层和合成机制。

#### 如何⽣成⼀帧图像

任意⼀帧的⽣成⽅式，有重排、重绘和合成三种⽅式。

通常渲染路径越⻓，⽣成图像花费的时间就越多：
- ⽐如**重排**，它需要重新根据CSSOM和DOM来计算布局树，这样⽣成⼀幅图⽚时，会让整个渲染流⽔线的每个阶段都执⾏⼀遍，如果布局复杂的话，就很难保证渲染的效率了。
- **重绘**因为没有了重新布局的阶段，操作效率稍微⾼点，但是依然需要重新计算绘制信息，并触发绘制操作之后的⼀系列操作。
- **合成**操作的路径就显得⾮常短了，并不需要触发布局和绘制两个阶段，如果采⽤了GPU，那么合成的效率会⾮常⾼。

#### 分层和合成

将素材分解为多个图层的操作就称为分层，最后将这些图层合并到⼀起的操作就称为合成。所以，分层和合成通常是⼀起使⽤的。

- 分层体现在⽣成布局树之后，渲染引擎会根据布局树的特点将其转换为层树（Layer Tree），层树是渲染流⽔线后续流程的基础结构。
- 层树中的每个节点都对应着⼀个图层，下⼀步的绘制阶段就依赖于层树中的节点
- 绘制阶段其实并不是真正地绘出图⽚，⽽是将绘制指令组合成⼀个列表
- 有了绘制列表之后，就需要进⼊光栅化阶段了，光栅化就是按照绘制列表中的指令⽣成图⽚
- 每⼀个图层都对应⼀张图⽚，合成线程有了这些图⽚之后，会将这些图⽚合成为“⼀张”图⽚，并最终将⽣成的图⽚发送到后缓冲区。

合成操作是在合成线程上完成的，这也就意味着在执⾏合成操作时，是不会影响到主线程执⾏的

#### 分块

如果说分层是从宏观上提升了渲染效率，那么分块则是从微观层⾯提升了渲染效率。

⻚⾯的内容都要⽐屏幕⼤得多，显⽰⼀个⻚⾯时，如果等待所有的图层都⽣成完毕，再进⾏合成的话，会产⽣⼀些不必要的开销，也会让合成图⽚的时间变得更久。

**合成线程会将每个图层分割为⼤⼩固定的图块，然后优先绘制靠近视⼝的图块，这样就可以⼤⼤加速⻚⾯的显⽰速度**。

>即使只绘制那些优先级最⾼的图块，也要耗费不少的时间，因为涉及到⼀个很关键的因素⸺纹理上传

#### 如何利⽤分层技术优化代码

```css
.box {
  will-change: transform, opacity;
}
```

这段代码就是提前告诉渲染引擎box元素将要做⼏何变换和透明度变换操作，这时候渲染引擎会将该元素单独实现⼀帧，等这些变换发⽣时，渲染引擎会通过合成线程直接去处理变换，这些变换并没有涉及到主线程，这样就⼤⼤提升了渲染的效率。这也是CSS动画⽐JavaScript动画⾼效的原因。

但是凡事都有两⾯性，每当渲染引擎为⼀个元素准备⼀个独⽴层的时候，它占⽤的内存也会⼤⼤增加，因为从层树开始，后续每个阶段都会多⼀个层结构，这些都需要额外的内存，所以你需要恰当地使⽤ will-change。

### 第二十五章 ⻚⾯性能：如何系统地优化⻚⾯？

通常⼀个⻚⾯有三个阶段：**加载阶段、交互阶段和关闭阶段**
- 加载阶段，是指从发出请求到渲染出完整⻚⾯的过程，影响到这个阶段的主要因素有⽹络和JavaScript脚本。
- 交互阶段，主要是从⻚⾯加载完成到⽤⼾交互的整合过程，影响到这个阶段的主要因素是JavaScript脚本。
- 关闭阶段，主要是⽤⼾发出关闭指令后⻚⾯所做的⼀些清理操作。

#### 加载阶段

并⾮所有的资源都会阻塞⻚⾯的⾸次绘制，⽐如图⽚、⾳频、视频等⽂件就不会阻塞⻚⾯的⾸次渲染

JavaScript、⾸次请求的HTML资源⽂件、CSS⽂件是会阻塞⾸次渲染

**能阻塞⽹⻚⾸次渲染的资源称为关键资源**
- 第⼀个是关键资源个数。关键资源个数越多，⾸次⻚⾯的加载时间就会越⻓。
- 第⼆个是关键资源⼤⼩。通常情况下，所有关键资源的内容越⼩，其整个资源的下载时间也就越短，那么阻塞渲染的时间也就越短。
- 第三个是请求关键资源需要多少个RTT（Round Trip Time）。

什么是RTT？

当使⽤TCP协议传输⼀个⽂件时，⽐如这个⽂件⼤⼩是0.1M，由于TCP的特性，这个数据并不是⼀次传输到服务端的，⽽是需要拆分成⼀个个数据包来
回多次进⾏传输的。RTT就是这⾥的往返时延。它是⽹络中⼀个重要的性能指标，表⽰从发送端发送数据开始，到发送端收到来⾃接收端的确认，总共经历的时延。通常1个HTTP的数据包在14KB左右，所以1个0.1M的⻚⾯就需要拆分成8个包来传输了，也就是说需要8个RTT。

由于渲染引擎有⼀个预解析的线程，在接收到HTML数据之后，**预解析线程会快速扫描HTML数据中的关键资源，⼀旦扫描到了，会⽴⻢发起请求**，你可以认为JavaScript和CSS是同时发起请求的，所以它们的请求是重叠的，那么计算它们的RTT时，只需要计算体积最⼤的那个数据就可以了。

**总的优化原则就是减少关键资源个数，降低关键资源⼤⼩，降低关键资源的RTT次数。**
- 减少关键资源的个数
  - ⼀种⽅式是可以将JavaScript和CSS改成内联的形式，⽐如上图的JavaScript和CSS，若都改成内联模式，那么关键资源的个数就由3个减少到了1个。
  - 另⼀种⽅式，如果JavaScript代码没有DOM或者CSSOM的操作，则可以改成sync或者defer属性；同样对于CSS，如果不是在构建⻚⾯之前加载的，则可以添加媒体取消阻⽌显现的标志。当JavaScript标签加上了sync或者defer、CSSlink 属性之前加上了取消阻⽌显现的标志后，它们就变成了⾮关键资源了。
- 减少关键资源的⼤⼩
  - 可以压缩CSS和JavaScript资源，移除HTML、CSS、JavaScript⽂件中⼀些注释内容，也可以通过前⾯讲的取消CSS或者JavaScript中关键资源的⽅式。
- 减少关键资源RTT的次数，可以通过减少关键资源的个数和减少关键资源的⼤⼩搭配来实现。除此之外，还可以使⽤CDN来减少每次RTT时⻓。

#### 交互阶段

谈交互阶段的优化，其实就是在谈渲染进程渲染帧的速度，因为在交互阶段，帧的渲染速度决定了交互的流畅度。

和加载阶段的渲染流⽔线有⼀些不同的地⽅是，在交互阶段没有了加载关键资源和构建DOM、CSSOM流程，通常是由JavaScript触发交互动画的。

![render stage]()

⼀个⼤的原则就是让单个帧的⽣成速度变快。
- 减少JavaScript脚本执⾏时间
  - ⼀种是将⼀次执⾏的函数分解为多个任务，使得每次的执⾏时间不要过久。
  - 另⼀种是采⽤Web Workers。你可以把Web Workers当作主线程之外的⼀个线程，在Web Workers中是可以执⾏JavaScript脚本的，不过Web Workers中没有DOM、CSSOM环境，这意味着在Web Workers中是⽆法通过JavaScript来访问DOM的，所以我们可以把⼀些和DOM操作⽆关且耗时的任务放到WebWorkers中去执⾏。

- 避免强制同步布局：
  所谓强制同步布局，是指JavaScript强制将计算样式和布局操作提前到当前的任务中

- 避免布局抖动：
  所谓布局抖动，是指在⼀次JavaScript执⾏过程中，多次执⾏强制布局和抖动操作

- 合理利⽤CSS合成动画：
  合成动画是直接在合成线程上执⾏的，这和在主线程上执⾏的布局、绘制等操作不同，如果主线程被JavaScript或者⼀些布局任务占⽤，CSS动画依然能继续执⾏。

- 避免频繁的垃圾回收

  JavaScript使⽤了⾃动垃圾回收机制，如果在⼀些函数中频繁创建临时对象，那么垃圾回收器也会频繁地去执⾏垃圾回收策略。这样当垃圾回收操作发⽣时，就会占⽤主线程，从⽽影响到其他任务的执⾏，严重的话还会让⽤⼾产⽣掉帧、不流畅的感觉。

### 第二十六章 虚拟DOM：虚拟DOM和实际的DOM有何不同？

#### 什么是虚拟DOM

虚拟DOM解决了什么问题：
- 将⻚⾯改变的内容应⽤到虚拟DOM上，⽽不是直接应⽤到DOM上。
- 变化被应⽤到虚拟DOM上时，虚拟DOM并不急着去渲染⻚⾯，⽽仅仅是调整虚拟DOM的内部状态，这样操作虚拟DOM的代价就变得⾮常轻了。
- 在虚拟DOM收集到⾜够的改变时，再把这些变化⼀次性应⽤到真实的DOM上。

最开始的时候，⽐较两个虚拟DOM的过程是在⼀个递归函数⾥执⾏的，其核⼼算法是reconciliation。

React团队重写了reconciliation算法，新的算法称为Fiber reconciler，之前⽼的算法称为Stack reconciler。

协程的另外⼀个称呼就是Fiber，，所谓的Fiber reconciler相信你也很清楚了，就是在执⾏算法的过程中出让主线程，这样就解决了Stack reconciler函数占⽤时间过久的问题。

#### 1. 双缓存

使⽤双缓存，可以让你先将计算的中间结果存放在另⼀个缓冲区中，等全部的计算结束，该缓冲区已经存储了完整的图形之后，再将该缓冲区的图形数据⼀次性复制到显⽰缓冲区，这样就使得整个图像的输出⾮常
稳定。

在这⾥，你可以把虚拟DOM看成是DOM的⼀个buffer，和图形显⽰⼀样，它会在完成⼀次完整的操作之后，再把结果应⽤到DOM上

#### 2. MVC模式

![mvc]()

MVC的整体结构⽐较简单，由模型、视图和控制器组成，其**核⼼思想就是将数据和视图分离**，也就是说视图和模型之间是不允许直接通信的，它们之间的通信都是通过控制器来完成的。

---
### 第二十七章 渐进式⽹⻚应⽤（PWA）：它究竟解决了Web应⽤的哪些问题？

浏览器的三⼤进化路线：
- 第⼀个是应⽤程序Web化；
- 第⼆个是Web应⽤移动化；
- 第三个是Web操作系统化；

PWA，全称是Progressive Web App，翻译过来就是渐进式⽹⻚应⽤。根据字⾯意思，它就是“渐进式+Web应⽤”。

“渐进式”需要从下⾯两个⽅⾯来理解：
- 站在Web应⽤开发者来说，PWA提供了⼀个渐进式的过渡⽅案，让普通站点逐步过渡到Web应⽤。采取渐进式可以降低站点改造的代价，使得站点逐步⽀持各项新技术，⽽不是⼀步到位。
- 站在技术⻆度来说，PWA技术也是⼀个渐进式的演化过程，在技术层⾯会⼀点点演进，⽐如逐渐提供更好的设备特性⽀持，**不断优化更加流畅的动画效果，不断让⻚⾯的加载速度变得更快，不断实现本地应⽤的特性**。

PWA的定义就是：它是⼀套理念，渐进式增强Web的优势，并通过技术⼿段渐进式缩短和本地应⽤或者⼩程序的距离。

#### Web应⽤ VS 本地应⽤

Web⻚⾯到底缺少什么：
- ⾸先，Web应⽤缺少离线使⽤能⼒，在离线或者在弱⽹环境下基本上是⽆法使⽤的。⽽⽤⼾需要的是沉浸式的体验，在离线或者弱⽹环境下能够流畅地使⽤是⽤⼾对⼀个应⽤的基本要求。
- 其次，Web应⽤还缺少了消息推送的能⼒，因为作为⼀个App⼚商，需要有将消息送达到应⽤的能⼒。
- 最后，Web应⽤缺少⼀级⼊⼝，也就是将Web应⽤安装到桌⾯，在需要的时候直接从桌⾯打开Web应⽤，⽽不是每次都需要通过浏览器来打开。

**针对以上Web缺陷，PWA提出了两种解决⽅案：通过引⼊Service Worker来试着解决离线存储和消息推送的问题，通过引⼊manifest.json来解决⼀级⼊⼝的问题**。

#### 什么是Service Worker

在2014年的时候，标准委员会就提出了Service Worker的概念，它的主要思想是**在⻚⾯和⽹络之间增加⼀个拦截器，⽤来缓存和拦截请求**。整体结构如下图所⽰：

![service worker]()

在没有安装Service Worker之前，WebApp都是直接通过⽹络模块来请求资源的。安装了Service Worker模块之后，WebApp请求资源时，会先通过Service Worker，让它判断是返回Service Worker 缓存的资源还是重新去⽹络请求资源。⼀切的控制权都交由Service Worker来处理。

#### Service Worker的设计思路

- 架构

  为了避免JavaScript过多占⽤⻚⾯主线程时⻓的情况，浏览器实现了Web Worker的功能。**Web Worker的⽬的是让JavaScript能够运⾏在⻚⾯主线程之外**，不过由于Web Worker中是没有当前⻚⾯的DOM环境的，所以在**Web Worker中只能执⾏⼀些和DOM⽆关的JavaScript脚本，并通过postMessage⽅法将执⾏的结果返回给主线程**。所以说在Chrome中， Web Worker其实就是在渲染进程中开启的⼀个新线程，它的⽣命周期是和⻚⾯关联的。

  “让其运⾏在主线程之外”就是Service Worker来⾃Web Worker的⼀个核⼼思想。不过Web Worker是临时的，每次JavaScript脚本执⾏完成之后都会退出，执⾏结果也不能保存下来，如果下次还有同样的操作，就还得重新来⼀遍。所以Service Worker需要在Web Worker的基础之上加上储存功能。

  另外，由于Service Worker还需要会为多个⻚⾯提供服务，所以还不能把Service Worker和单个⻚⾯绑定起来。在⽬前的Chrome架构中，Service Worker是运⾏在浏览器进程中的，因为浏览器进程⽣命周期是最⻓的，所以在浏览器的⽣命周期内，能够为所有的⻚⾯提供服务。

- 消息推送

  消息推送也是基于Service Worker来实现的。

- 安全

  HTTP采⽤的是明⽂传输信息，存在被窃听、被篡改和被劫持的⻛险，在项⽬中使⽤HTTP来传输数据⽆疑是“裸奔”。所以在设计之初，就考虑对Service Worker采⽤HTTPS协议，因为采⽤HTTPS 的通信数据都是经过加密的，即便拦截了数据，也⽆法破解数据内容，⽽且HTTPS还有校验机制，通信双⽅很容易知道数据是否被篡改。

  所以要使站点⽀持Service Worker，⾸先必要的⼀步就是要将站点升级到HTTPS。

  Service Worker还需要同时⽀持Web⻚⾯默认的安全策略、储⼊同源策略、内容安全策略（CSP）等。

### 第二十八章 WebComponent：像搭积⽊⼀样构建Web应⽤

**对内⾼内聚，对外低耦合**。对内各个元素彼此紧密结合、相互依赖，对外和其他组件的联系最少且接⼝简单。

#### 阻碍前端组件化的因素

- CSS的全局属性会阻碍组件化
- DOM也是阻碍组件化的⼀个因素，在⻚⾯中只有⼀个DOM，任何地⽅都可以直接读取和修改DOM

#### WebComponent组件化开发

WebComponent给出了解决思路，它提供了对局部视图封装能⼒，可以让DOM、CSSOM和JavaScript运⾏在局部环境中，这样就使得局部的CSS和DOM不会影响到全局。

WebComponent是⼀套技术的组合，具体涉及到了**Custom elements（⾃定义元素）**、**Shadow DOM（影⼦DOM）**和**HTML templates（HTML模板）**。

```html
<!DOCTYPE html>
<html>
<body>
  <!--
  ⼀：定义模板
  ⼆：定义内部CSS样式
  三：定义JavaScript⾏为
  -->
  <template id="geekbang-t">
    <style>
    p {
      background-color: brown;
      color: cornsilk
    }
    div {
      width: 200px;
      background-color: bisque;
      border: 3px solid chocolate;
      border-radius: 10px;
    }
    </style>
    <div>
      <p>time.geekbang.org</p>
      <p>time1.geekbang.org</p>
    </div>
    <script>
    function foo() {
      console.log('inner log')
    }
    </script>
  </template>
  <script>
  class GeekBang extends HTMLElement {
    constructor() {
      super()
      //获取组件模板
      const content = document.querySelector('#geekbang-t').content
      //创建影⼦DOM节点
      const shadowDOM = this.attachShadow({ mode: 'open' })
      //将模板添加到影⼦DOM上
      shadowDOM.appendChild(content.cloneNode(true))
    }
  }
  customElements.define('geek-bang', GeekBang)
  </script>
  <geek-bang></geek-bang>
  <div>
    <p>time.geekbang.org</p>
    <p>time1.geekbang.org</p>
  </div>
  <geek-bang></geek-bang>
</body>
</html>
```
要使⽤WebComponent，通常要实现下⾯三个步骤：
- ⾸先，使⽤template属性来创建模板。利⽤DOM可以查找到模板的内容，但是模板元素是不会被渲染到⻚⾯上的
- 其次，我们需要创建⼀个GeekBang的类。
  - 1. 查找模板内容；
  - 2. 创建影⼦DOM；
  - 3. 再将模板添加到影⼦DOM上。

  影⼦DOM的作⽤是将模板中的内容与全局DOM和CSS进⾏隔离，这样我们就可以实现元素和样式的私有化了。你可以把影⼦DOM看成是⼀个作⽤域，其内部的样式和元素是不会影响到全局的样式和元素的，⽽在全局环境下，要访问影⼦DOM内部的样式或者元素也是需要通过约定好的接⼝的。

  通过影⼦DOM，我们就实现了CSS和元素的封装，在创建好封装影⼦DOM的类之后，我们就可以使⽤customElements.define来⾃定义元素了

影子DOM：
- 影⼦DOM内部的样式是不会影响到全局CSSOM的
- 使⽤DOM接⼝也是⽆法直接查询到影⼦DOM内部元素的
- 影⼦DOM的JavaScript脚本是不会被隔离的，⽐如在影⼦DOM定义的JavaScript函数依然可以被外部访问

#### 浏览器如何实现影⼦DOM

![shadow dom]()

从图中可以看出，**我们使⽤了两次geek-bang属性，那么就会⽣成两个影⼦DOM，并且每个影⼦DOM都有⼀个shadow root的根节点**，我们可以将要展⽰的样式或者元素添加到影⼦DOM的根节点上，**每个影⼦DOM你都可以看成是⼀个独⽴的DOM，它有⾃⼰的样式、⾃⼰的属性，内部样式不会影响到外部样式，外部样式也不会影响到内部样式**。

---
### 第二十九章 HTTP1：HTTP性能优化

#### 超⽂本传输协议HTTP/0.9

HTTP/0.9是于1991年提出的，主要⽤于学术交流，需求很简单⸺⽤来在⽹络之间传递HTML超⽂本的内容，所以被称为超⽂本传输协议。

HTTP/0.9的实现有以下三个特点：
- 第⼀个是只有⼀个请求⾏，并没有HTTP请求头和请求体
- 第⼆个是服务器也没有返回头信息
- 第三个是返回的⽂件内容是以ASCII字符流来传输的，因为都是HTML格式的⽂件，所以使⽤ASCII字节码来传输是最合适的

#### 被浏览器推动的HTTP/1.0

万维⽹的⾼速发展带来了很多新的需求，⽽HTTP/0.9已经不能适⽤新兴⽹络的发展，所以这时就需要⼀个新的协议来⽀撑新兴⽹络。

**⽀持多种类型的⽂件下载是HTTP/1.0的⼀个核⼼诉求**

`那么该如何实现多种类型⽂件的下载呢？`

HTTP/1.0引⼊了请求头和响应头，它们都是以为Key-Value形式保存的，在HTTP发送请求时，会带上请求头信息，服务器返回数据时，会先返回响应头信息。

HTTP/1.0的⽅案是通过请求头和响应头来进⾏协商，在发起请求时候会通过HTTP请求头告诉服务器它期待服务器返回什么类型的⽂件、采取什么形式的压缩、提供什么语⾔的⽂件以及⽂件的具体编码

```
accept: text/html
accept-encoding: gzip, deflate, br
accept-Charset: ISO-8859-1,utf-8
accept-language: zh-CN,zh
```
http 1.0支持一下特性：
- 支持多种不同类型的数据
- 引入状态码
- Cache缓存机制
- 用户代理

#### 缝缝补补的HTTP/1.1

- 1. 改进持久连接

  HTTP/1.0每进⾏⼀次HTTP通信，都需要经历建⽴TCP连接、传输HTTP数据和断开TCP连接三个阶段

  **HTTP/1.1中增加了持久连接的⽅法，它的特点是在⼀个TCP连接上可以传输多个HTTP请求，只要浏览器或者服务器没有明确断开连接，那么该TCP连接会⼀直保持**。

  持久连接在HTTP/1.1中是默认开启的

- 2. 不成熟的HTTP管线化

  持久连接虽然能减少TCP的建⽴和断开次数，但是它需要等待前⾯的请求返回之后，才能进⾏下⼀次请求。如果TCP通道中的某个请求因为某些原因没有及时返回，那么就会阻塞后⾯的所有请求，这就是著名的**队头阻塞的问题**。

  HTTP/1.1中的管线化是指将多个HTTP请求整批提交给服务器的技术，虽然可以整批发送请求，不过服务器依然需要根据请求顺序来回复浏览器的请求。

- 3. 提供虚拟主机的⽀持

  HTTP/1.1的请求头中增加了Host字段，⽤来表⽰当前的域名地址，这样服务器就可以根据不同的Host值做不同的处理。

- 4. 对动态⽣成的内容提供了完美⽀持

  HTTP/1.1通过引⼊Chunk transfer机制来解决动态⽣成的内容，服务器会将数据分割成若⼲个任意⼤⼩的数据块，每个数据块发送时会附上上个数据块的⻓度，最后使⽤⼀个零⻓度的块作为发送数据完成的标志。

- 5. 客⼾端Cookie、安全机制
---
### 第三十章 HTTP2：如何提升⽹络速度？

HTTP/1.1为⽹络效率做了⼤量的优化，最核⼼的有如下三种⽅式：
- 1. 增加了持久连接；
- 2. 浏览器为每个域名最多同时维护6个TCP持久连接；
- 3. 使⽤CDN的实现域名分⽚机制。

但是HTTP/1.1对带宽的利⽤率却并不理想

带宽是指每秒最⼤能发送或者接收的字节数。我们把每秒能发送的最⼤字节数称为上⾏带宽，每秒能够接收的最⼤字节数称为下⾏带宽。

HTTP/1.1对带宽的利⽤率不理想，之所以会出现这个问题，主要是由以下三个原因导致的：
- 第⼀个原因，TCP的慢启动。
- 第⼆个原因，同时开启了多条TCP连接，那么这些连接会竞争固定的带宽。
- 第三个原因，HTTP/1.1队头阻塞的问题。

#### HTTP/2的多路复⽤

慢启动和TCP连接之间相互竞争带宽是由于TCP本⾝的机制导致的，⽽队头阻塞是由于HTTP/1.1的机制导致的。

HTTP/2的思路就是⼀个域名只使⽤⼀个TCP⻓连接来传输数据，这样整个⻚⾯资源的下载过程只需要⼀次慢启动，同时也避免了多个TCP连接竞争带宽所带来的问题。

HTTP/2需要实现资源的并⾏请求，也就是任何时候都可以将请求发送给服务器，⽽并不需要等待其他请求的完成，然后服务器也可以随时返回处理好的请求资源给浏览器。

HTTP/2的解决⽅案可以总结为：⼀个域名只使⽤⼀个TCP⻓连接和消除队头阻塞问题

![multiplexing]()

从图中你会发现每个请求都有⼀个对应的ID，如stream1表⽰index.html的请求，stream2表⽰foo.css的请求。这样在浏览器端，就可以随时将请求发送给服务器了。

服务器端接收到这些请求后，会根据⾃⼰的喜好来决定优先返回哪些内容，⽐如服务器可能早就缓存好了index.html和bar.js的响应头信息，那么当接收到请求的时候就可以⽴即把index.html和bar.js的响应头信息返回给浏览器，然后再将index.html和bar.js的响应体数据返回给浏览器。之所以可以随意发送，是因为每份数据都有对应的ID，浏览器接收到之后，会筛选出相同ID的内容，将其拼接为完整的HTTP响应数据。

HTTP/2使⽤了多路复⽤技术，可以将请求分成⼀帧⼀帧的数据去传输，这样带来了⼀个额外的好处，就是当收到⼀个优先级⾼的请求时，⽐如接收到JavaScript或者CSS关键资源的请求，服务器可以暂停之前的请求来优先处理关键资源的请求。


#### 多路复⽤的实现

![http2 multiplexing]()

TTP/2添加了⼀个⼆进制分帧层：
- ⾸先，浏览器准备好请求数据，包括了请求⾏、请求头等信息，如果是POST⽅法，那么还要有请求体。
- 这些数据经过⼆进制分帧层处理之后，会被转换为⼀个个带有请求ID编号的帧，通过协议栈将这些帧发送给服务器。
- 服务器接收到所有帧之后，会将所有相同ID的帧合并为⼀条完整的请求信息。
- 然后服务器处理该条请求，并将处理的响应⾏、响应头和响应体分别发送⾄⼆进制分帧层。
- 同样，⼆进制分帧层会将这些响应数据转换为⼀个个带有请求ID编号的帧，经过协议栈发送给浏览器。
- 浏览器接收到响应帧之后，会根据ID编号将帧的数据提交给对应的请求。

#### HTTP/2其他特性

- 1.可以设置请求的优先级
- 2. 服务器推送
- 3. 头部压缩
---
### 第三十一章 HTTP3：甩掉TCP、TLS的包袱，构建⾼效⽹络

HTTP/2到底有什么缺陷： 
- TCP的队头阻塞

  如果在数据传输的过程中，有⼀个数据因为⽹络故障或者其他原因⽽丢包了，那么整个TCP的连接就会处于暂停状态，需要等待丢失的数据包被重新传输过来。

  在TCP传输过程中，由于单个数据包的丢失⽽造成的阻塞称为TCP上的队头阻塞

- TCP建⽴连接的延时

  ⽹络延迟⼜称为RTT（Round Trip Time）。我们把从浏览器发送⼀个数据包到服务器，再从服务器返回数据包到浏览器的整个往返时间称为RTT（如下图）。RTT是反映⽹络性能的⼀个重要指标。

  使⽤HTTPS的话，还需要使⽤TLS协议进⾏安全传输，⽽使⽤TLS也需要⼀个握⼿过程，这样就需要有两个握⼿延迟过程。
  - 在建⽴TCP连接的时候，需要和服务器进⾏三次握⼿来确认连接成功，也就是说需要在消耗完1.5个RTT之后才能进⾏数据传输
  - 进⾏TLS连接，TLS有两个版本⸺TLS1.2和TLS1.3，每个版本建⽴连接所花的时间不同，⼤致是需要1〜2个RTT

- TCP协议僵化

  TCP协议存在队头阻塞和建⽴连接延迟等缺点，通过改进TCP协议来解决这些问题是非常困难的。

  主要原因：
  - 中间设备的僵化

    如果我们在客⼾端升级了TCP协议，但是当新协议的数据包经过这些中间设备时，它们可能不理解包的内容，于是这些数据就会被丢弃掉

  - 操作系统也是导致TCP协议僵化的另外⼀个原因

    TCP协议都是通过操作系统内核来实现的，应⽤程序只能使⽤不能修改。通常操作系统的更新都滞后于软件的更新，因此要想⾃由地更新内核中的TCP协议也是⾮常困难的。

#### QUIC协议

HTTP/3选择了⼀个折衷的⽅法⸺UDP协议，基于UDP实现了类似于 TCP的多路数据流、传输可靠性等功能，我们把这套功能称为QUIC协议。

![http2 vs http3]()

HTTP/3中的QUIC协议集合了以下⼏点功能：
- 实现了类似TCP的流量控制、传输可靠性的功能。

  虽然UDP不提供可靠性的传输，但QUIC在UDP的基础之上增加了⼀层来保证数据可靠性传输。它提供了数据包重传、拥塞控制以及其他⼀些TCP中存在的特性。

- 集成了TLS加密功能。

  ⽬前QUIC使⽤的是TLS1.3，相较于早期版本TLS1.3有更多的优点，其中最重要的⼀点是减少了握⼿所花费的RTT个数。

- 实现了HTTP/2中的多路复⽤功能。

  和TCP不同，QUIC实现了在同⼀物理连接上可以有多个独⽴的逻辑数据流（如下图）。实现了数据流的单独传输，就解决了TCP中队头阻塞的问题。

  ![quic]()

- 实现了快速握⼿功能

#### HTTP/3的挑战

- 第⼀，从⽬前的情况来看，服务器和浏览器端都没有对HTTP/3提供⽐较完整的⽀持。Chrome虽然在数年前就开始⽀持Google版本的QUIC，但是这个版本的QUIC和官⽅的QUIC存在着⾮常⼤的差异。
- 第⼆，部署HTTP/3也存在着⾮常⼤的问题。因为系统内核对UDP的优化远远没有达到TCP的优化程度，这也是阻碍QUIC的⼀个重要原因。
- 第三，中间设备僵化的问题。这些设备对UDP的优化程度远远低于TCP，据统计使⽤QUIC协议时，⼤约有3%〜7%的丢包率。

---
### 第三十二章 同源策略：为什么XMLHttpRequest不能跨域请求资源？

⻚⾯中最基础、最核⼼的安全策略：**同源策略（Same-origin policy）**

#### 什么是同源策略

**如果两个URL的协议、域名和端⼝都相同，我们就称这两个URL同源**。

```
https://time.geekbang.org/?category=1
https://time.geekbang.org/?category=0
```

浏览器默认两个相同的源之间是可以相互访问资源和操作DOM的。两个不同的源之间若想要相互访问资源或者操作DOM，那么会有⼀套基础的安全策略的制约，我们把这称为同源策略。

同源策略主要表现在DOM、Web数据和⽹络这三个层⾯:

- DOM层⾯。同源策略限制了来⾃不同源的JavaScript脚本对当前DOM对象读和写的操作。

  ```js
  let pdom = opener.document
  pdom.body.style.display = "none"
  ```

  对象opener就是指向第⼀个⻚⾯的window对象，我们可以通过操作opener来控制第⼀个⻚⾯中的DOM

- 数据层⾯。同源策略限制了不同源的站点读取当前站点的Cookie、IndexDB、LocalStorage等数据。
- ⽹络层⾯。同源策略限制了通过XMLHttpRequest等⽅式将站点的数据发送给不同源的站点。

#### 安全和便利性的权衡

- ⻚⾯中可以嵌⼊第三⽅资源

  嵌入第三方资源，可能会引起XSS攻击，为了解决XSS攻击，浏览器中引入了内容安全策略，称为CSP。CSP的核⼼思想是让服务器决定浏览器能够加载哪些资源，让服务器决定浏览器是否能够执⾏内联JavaScript代码。通过这些⼿段就可以⼤⼤减少XSS攻击。

- 跨域资源共享和跨⽂档消息机制

  如果需要对不同域发起请求，可以引入跨域资源共享(CORS)CORS），使⽤该机制可以进⾏跨域访问控制，从⽽使跨域数据传输得以安全进⾏。

  两个⻚⾯不是同源的，则⽆法相互操纵DOM。不过在实际应⽤中，经常需要两个不同源的DOM之间进⾏通信，于是浏览器中⼜引⼊了跨⽂档消息机制，可以通过window.postMessage的JavaScript接⼝来和不同源的DOM进⾏通信。
---

### 第三十三章 跨站脚本攻击（XSS）：为什么Cookie中有HttpOnly属性？

#### 什么是XSS攻击

XSS全称是Cross Site Scripting，为了与“CSS”区分开来，故简称XSS，翻译过来就是“跨站脚本”。

XSS攻击是指⿊客往HTML⽂件中或者DOM中注⼊恶意脚本，从⽽在⽤⼾浏览⻚⾯时利⽤注⼊的恶意脚本对⽤⼾实施攻击的⼀种⼿段。

恶意脚本都能做哪些事情：
- **窃取Cookie信息**，可以通过“document.cookie”获取Cookie信息，然后通过XMLHttpRequest或者Fetch加上CORS功能将数据发送给恶意服务器；恶意服务器拿到⽤⼾的Cookie信息之后，就可以在其他电脑上模拟⽤⼾的登录，然后进⾏转账等操作。
- **监听⽤⼾⾏为**，恶意JavaScript可以使⽤“addEventListener”接⼝来监听键盘事件，⽐如可以获取⽤⼾输⼊的信⽤卡等信息，将其发送到恶意服务器。⿊客掌握了这些信息之后，⼜可以做很多违法的事情。
- **修改DOM**，伪造假的登录窗⼝，⽤来欺骗⽤⼾输⼊⽤⼾名和密码等信息。
- **在⻚⾯内⽣成浮窗⼴告**

#### 恶意脚本是怎么注⼊的

- 存储型XSS攻击
- 反射型XSS攻击
- 基于DOM的XSS攻击，基于DOM的XSS攻击是不牵涉到⻚⾯Web服务器的。具体来讲，⿊客通过各种⼿段将恶意脚本注⼊⽤⼾的⻚⾯中，⽐如通过⽹络劫持在⻚⾯传输过程中修改HTML⻚⾯的内容

#### 如何阻⽌XSS攻击

- 服务器对输⼊脚本进⾏过滤或转码
- 充分利⽤CSP
- 使⽤HttpOnly属性，使⽤HttpOnly标记的Cookie只能使⽤在HTTP请求过程中，所以⽆法通过JavaScript来读取这段Cookie。

### 第三十四章 CSRF攻击：陌⽣链接不要随便点

#### 什么是CSRF攻击

CSRF英⽂全称是Cross-site request forgery，所以⼜称为“跨站请求伪造”，是指⿊客引诱⽤⼾打开⿊客的⽹站，在⿊客的⽹站中，利⽤⽤⼾的登录状态发起的跨站请求。简单来讲，CSRF攻击就是⿊客利⽤了⽤⼾的登录状态，并通过第三⽅的站点来做⼀些坏事。

- 自动发起GET请求
- ⾃动发起POST请求
- 引诱⽤⼾点击链接

和XSS不同的是，CSRF攻击不需要将恶意代码注⼊⽤⼾的⻚⾯，仅仅是利⽤服务器的漏洞和⽤⼾的登录状态来实施攻击。

#### 如何防⽌CSRF攻击

CSRF攻击的三个必要条件：
- ⽬标站点⼀定要有CSRF漏洞
- ⽤⼾要登录过⽬标站点，并且在浏览器上保持有该站点的登录状态
- 需要⽤⼾打开⼀个第三⽅站点，可以是⿊客的站点，也可以是⼀些论坛

要让服务器避免遭受到CSRF攻击，通常有以下⼏种途径：
- 充分利⽤好Cookie 的 SameSite 属性

  Cookie正是浏览器和服务器之间维护登录状态的⼀个关键数据，要防⽌CSRF攻击，我们最好能实现从第三⽅站点发送请求时禁⽌Cookie的发送：
  - 如果是从第三⽅站点发起的请求，那么需要浏览器禁⽌发送某些关键Cookie数据到服务器
  - 如果是同⼀个站点发起的请求，那么就需要保证Cookie数据正常发送

  在HTTP响应头中，通过set-cookie字段设置Cookie时，可以带上SameSite选项

  **SameSite选项通常有Strict、Lax和None三个值：**
  - Strict最为严格。如果SameSite的值是Strict，那么浏览器会完全禁⽌第三⽅ Cookie。简⾔之，如果你从极客时间的⻚⾯中访问InfoQ的资源，⽽InfoQ的某些Cookie设置了SameSite = Strict的话，那么这些Cookie是不会被发送到InfoQ的服务器上的。只有你从InfoQ的站点去请求InfoQ的资源时，才会带上这些Cookie。
  - Lax相对宽松⼀点。在跨站点的情况下，从第三⽅站点的链接打开和从第三⽅站点提交Get⽅式的表单这两种⽅式都会携带Cookie。但如果在第三⽅站点中使⽤Post⽅法，或者通过img、iframe等标签加载的URL，这些场景都不会携带Cookie。
  - ⽽如果使⽤None的话，在任何情况下都会发送Cookie数据。

  关于SameSite的具体使⽤⽅式，你可以参考这个链接：[https://web.dev/samesite-cookies-explained](https://web.dev/samesite-cookies-explained)

- 验证请求的来源站点

  Referer是HTTP请求头中的⼀个字段，记录了该HTTP请求的来源地址

  虽然可以通过Referer告诉服务器HTTP请求的来源，但是有⼀些场景是不适合将来源URL暴露给服务器的，因此浏览器提供给开发者⼀个选项，可以不⽤上传Referer值

  但在服务器端验证请求头中的Referer并不是太可靠，因此标准委员会⼜制定了Origin属性，在⼀些重要的场合，⽐如通过XMLHttpRequest、Fecth发起跨站请求或者通过Post⽅法发送请求时，都会带上Origin属性

  因此，服务器的策略是优先判断Origin，如果请求头中没有包含Origin属性，再根据实际情况判断是否使⽤Referer值。

- CSRF Token

  第⼀步，在浏览器向服务器发起请求时，服务器⽣成⼀个CSRF Token。然后将该字符串植⼊到返回的⻚⾯中。

  第⼆步，在浏览器端如果要发起转账的请求，那么需要带上⻚⾯中的CSRF Token，然后服务器会验证该Token是否合法。如果是从第三⽅站点发出的请求，那么将⽆法获取到CSRF Token的值，所以即使发出了请求，服务器也会因为CSRF Token不正确⽽拒绝请求。

---
### 第三十五章 安全沙箱：⻚⾯和系统之间的隔离墙

#### 安全视⻆下的多进程架构

浏览器被划分为浏览器内核和渲染内核两个核⼼模块，其中浏览器内核是由⽹络进程、浏览器主进程和GPU进程组成的，渲染内核就是渲染进程

![browser core and render process]()

**所有的⽹络资源都是通过浏览器内核来下载的，下载后的资源会通过IPC将其提交给渲染进程（浏览器内核和渲染进程之间都是通过IPC来通信的）。然后渲染进程会对这些资源进⾏解析、绘制等操作，最终⽣成⼀幅图⽚。但是渲染进程并不负责将图⽚显⽰到界⾯上，⽽是将最终⽣成的图⽚提交给浏览器内核模块，由浏览器内核模块负责显⽰这张图⽚**。


#### 安全沙箱

因为⽹络资源的内容存在着各种可能性，所以浏览器会默认所有的⽹络资源都是不可信的，都是不安全的。

我们需要在渲染进程和操作系统之间建⼀道墙，即便渲染进程由于存在漏洞被⿊客攻击，但由于这道墙，⿊客就获取不到渲染进程之外的任何操作权限。将渲染进程和操作系统隔离的这道墙就是我们要聊的安全沙箱。

#### 安全沙箱如何影响各个模块功能

- 持久存储
- ⽹络访问
- ⽤⼾交互

#### 站点隔离（Site Isolation）

所谓站点隔离是指Chrome将同⼀站点（包含了相同根域名和相同协议的地址）中相互关联的⻚⾯放到同⼀个渲染进程中执⾏。

⽬前所有操作系统都⾯临着两个A级漏洞⸺**幽灵（Spectre）和熔毁（Meltdown）**，这两个漏洞是由处理器架构导致的，很难修补，⿊客通过这两个漏洞可以直接⼊侵到进程的内部，如果⼊侵的进程没有安全沙箱的保护，那么⿊客还可以发起对操作系统的攻击。

因此Chrome⼏年前就开始重构代码，将标签级的渲染进程重构为iframe级的渲染进程，然后严格按照同⼀站点的策略来分配渲染进程，这就是Chrome中的站点隔离。

--- 
### 第三十六章 HTTPS：让数据传输更安全

将HTTP数据提交给TCP层之后，数据会经过⽤⼾电脑、WiFi路由器、运营商和⽬标服务器，在这中间的每个环节中，数据都有可能被窃取或篡改。⽐如⽤⼾电脑被⿊客安装了恶意软件，那么恶意软件就能抓取和篡改所发出的HTTP请求的内容。或者⽤⼾⼀不⼩⼼连接上了WiFi钓⻥路由器，那么数据也都能被⿊客抓取或篡改。

#### 在HTTP协议栈中引⼊安全层

从HTTP协议栈层⾯来看，我们可以在TCP和HTTP之间插⼊⼀个安全层，所有经过安全层的数据都会被加密或者解密

![http vs https]()

安全层有两个主要的职责：对发起HTTP请求的数据进⾏加密操作和对接收到HTTP的内容进⾏解密操作。

#### 使⽤对称加密

所谓对称加密是指加密和解密都使⽤的是相同的密钥。

要在两台电脑上加解密同⼀个⽂件，我们⾄少需要知道加解密⽅式和密钥，因此，在HTTPS发送数据之前，浏览器和服务器之间需要协商加密⽅式和密钥，过程如下所⽰：

![https]()
- 浏览器发送它所⽀持的加密套件列表和⼀个随机数client-random，这⾥的加密套件是指加密的⽅法，加密套件列表就是指浏览器能⽀持多少种加密⽅法列表。
- 服务器会从加密套件列表中选取⼀个加密套件，然后还会⽣成⼀个随机数service-random，并将servicerandom和加密套件列表返回给浏览器。
- 最后浏览器和服务器分别返回确认消息。


这样浏览器端和服务器端都有相同的client-random和service-random了，然后它们再使⽤相同的⽅法将client-random和service-random混合起来⽣成⼀个密钥master secret，有了密钥master secret和加密套件之后，双⽅就可以进⾏数据的加密传输了。

虽然这个版本能够很好地⼯作，但是其中传输client-random和service-random的过程却是明⽂的，这意味着⿊客也可以拿到协商的加密套件和双⽅的随机数，由于利⽤随机数合成密钥的算法是公开的，所以⿊客拿到随机数之后，也可以合成密钥，这样数据依然可以被破解，那么⿊客也就可以使⽤密钥来伪造或篡改数据了。

#### 使⽤⾮对称加密

⾮对称加密算法有A、B两把密钥，如果你⽤A密钥来加密，那么只能使⽤B密钥来解密；反过来，如果你要B密钥来加密，那么只能⽤A密钥来解密。

在HTTPS中，服务器会将其中的⼀个密钥通过明⽂的形式发送给浏览器，我们把这个密钥称为公钥，服务器⾃⼰留下的那个密钥称为私钥。顾名思义，公钥是每个⼈都能获取到的，⽽私钥只有服务器才能知道，不对任何⼈公开
![https 2]()
- ⾸先浏览器还是发送加密套件列表给服务器。
- 然后服务器会选择⼀个加密套件，不过和对称加密不同的是，使⽤⾮对称加密时服务器上需要有⽤于浏览器加密的公钥和服务器解密HTTP数据的私钥，由于公钥是给浏览器加密使⽤的，因此服务器会将加密套件和公钥⼀道发送给浏览器。
- 最后就是浏览器和服务器返回确认消息。

这种⽅式依然存在两个严重的问题：
- 第⼀个是⾮对称加密的效率太低
- 第⼆个是⽆法保证服务器发送给浏览器的数据安全。虽然浏览器端可以使⽤公钥来加密，但是服务器端只能采⽤私钥来加密，私钥加密只有公钥能解密，但⿊客也是可以获取得到公钥的，这样就不能保证服务器端数据的安全了。

#### 对称加密和⾮对称加密搭配使⽤

在传输数据阶段依然使⽤对称加密，但是对称加密的密钥我们采⽤⾮对称加密来传输。

![http3]()

- ⾸先浏览器向服务器发送对称加密套件列表、⾮对称加密套件列表和随机数client-random；
- 服务器保存随机数client-random，选择对称加密和⾮对称加密的套件，然后⽣成随机数servicerandom，向浏览器发送选择的加密套件、service-random和公钥；
- 浏览器保存公钥，并利⽤client-random和service-random计算出来pre-master，然后利⽤公钥对premaster加密，并向服务器发送加密后的数据；
- 最后服务器拿出⾃⼰的私钥，解密出pre-master数据，并返回确认消息。

pre-master是经过公钥加密之后传输的，所以⿊客⽆法获取到pre-master，这样⿊客就⽆法⽣成密钥，也就保证了⿊客⽆法破解传输过程中的数据了。

#### 添加数字证书

对称和⾮对称混合⽅式，⽅式依然存在着问题，⽐如我要打开极客时间的官⽹，但是⿊客通过DNS劫持将极客时间官⽹的IP地址替换成了⿊客的IP地址，这样我访问的其实是⿊客的服务器了，⿊客就可以在⾃⼰的服务器上实现公钥和私钥，⽽对浏览器来说，它完全不知道现在访问的是个⿊客的站点。

所以我们还需要服务器向浏览器提供证明“我就是我”

需要使⽤权威机构颁发的证书，这个权威机构称为**CA（Certificate Authority）**，颁发的证书就称为**数字证书（Digital Certificate)**。

数字证书有两个作⽤：
- 通过数字证书向浏览器证明服务器的⾝份
- 数字证书⾥⾯包含了服务器公钥

![https with dc]()
- 服务器没有直接返回公钥给浏览器，⽽是返回了数字证书，⽽公钥正是包含在数字证书中的
- 在浏览器端多了⼀个证书验证的操作，验证了证书之后，才继续后续流程

#### 浏览器如何验证数字证书

有了CA签名过的数字证书，当浏览器向极客时间服务器发出请求时，服务器会返回数字证书给浏览器。

浏览器接收到数字证书之后，会对数字证书进⾏验证。⾸先浏览器读取证书中相关的明⽂信息，采⽤CA签名时相同的Hash函数来计算并得到信息摘要A；然后再利⽤对应 CA 的公钥解密签名数据，得到信息摘要B；对⽐信息摘要A和信息摘要B，如果⼀致，则可以确认证书是合法的，即证明了这个服务器是极客时间的；同时浏览器还会验证证书相关的域名信息、有效时间等信息。

这时候相当于验证了CA是谁，但是这个CA可能⽐较⼩众，浏览器不知道该不该信任它，然后浏览器会继续查找给这个CA颁发证书的CA，再以同样的⽅式验证它上级CA的可靠性。通常情况下，操作系统中会内置信任的顶级 CA 的证书信息（包含公钥），如果这个CA链中没有找到浏览器内置的顶级的CA，证书也会被判定⾮法。

在申请和使⽤证书的过程中，还需要注意以下三点：
- 申请数字证书是不需要提供私钥的，要确保私钥永远只能由服务器掌握；
- 数字证书最核⼼的是CA使⽤它的私钥⽣成的数字签名；
- 内置 CA 对应的证书称为根证书，根证书是最权威的机构，它们⾃⼰为⾃⼰签名，我们把这称为⾃签名证书。