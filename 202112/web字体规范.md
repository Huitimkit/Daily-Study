# web字体规范



### 前言

对于设计稿的解析中，肯定是有些设计稿有特殊的字体，而这些字体可能只有设计师才有，或者只有前端拓展了系统字库才能显示器正确效果。但对于前端页面的终极使用者，他们可能系统没有这些字体，那么对于这些特殊字体究竟该如何处理？ 本文通过与设计，产品，前端的统一沟通，达成共识如下。请各个前端 按照这个原则去对应的解析实现设计ui效果。

### 界限划定

首先我们的前提是针对常规正文，大篇幅文本的字体，而非标题、活动页、特效页的部分特殊字。对于前者我们是用css代码限定font-family,或者webfont解决实现;对于后者通过切图实现。 其中特别说明：Open Sans 的中文字体在 Mac 上效果不错，微软雅黑的中文字体在 Windows 上效果不错。

### 一 解决方案–具体规范

#### 自带字体（推荐）

用户系统中自带的字体，不需要任何特殊支持的，这类也被成为web安全字体。这部分设计师可以大胆去采用，但是一个项目中的正文也是建议控制在一种常规字体，建议body里定义默认正文字体列表，而不是每个部分都需要单独查看字体定义字体。css约定了五种都会支持的字体，另外不同系统也会支持不同的字体，汇总如下表格。

| 字体种类                | 字体列表                                                     |
| :---------------------- | :----------------------------------------------------------- |
| css约定字体（英文字体） | （5类非五个）serif”、”sans-serif”、”cursive”、”fantasy”、”monospace” |
| windows自带中文字体     | 黑体，宋体，新宋体，仿宋，楷体，微软雅黑体                   |
| mac自带中文字体         | 华文细黑，黑体-简，苹方-简                                   |

**注意事项**：特别的针对font-family说明下，font-family属性是多种字体的名称，作为一个”应变”制度，以确保浏览器/操作系统之间的最大兼容性。如果浏览器不支持的第一个字体，它尝试下一个的字体。你想要的字体类型如果浏览器找不到，它会从通用的字体类型中找到与你相似的.代码语法如下： `body{font-family:"Source Sans Pro", "Helvetica Neue", Helvetica, Arial, sans-serif;}`

### @font-face实现webfont（不推荐）

1. @font-face 介绍 @font-face是css中的一个功能模块，用于实现网页字体多样性(设计者可随意指定字体，不需要考虑浏览者电脑上是否安装)。主要是把自己定义的Web字体嵌入到你的网页中，随着@font-face模块的出现，我们在Web的开发中使用字体不怕只能使用Web安全字体。语法具体兼容见下图（数据统计来自于can i use）：Internet Explorer 9, Firefox, Opera,Chrome, 和 Safari支持@font-face 规则.但是, Internet Explorer 9 只支持 .eot 类型的字体, Firefox, Chrome, Safari, 和 Opera 支持 .ttf 与.otf 两种类型字体.注意： Internet Explorer 8 及更早IE版本不支持@font-face 规则.

![img](https://ask.qcloudimg.com/http-save/yehe-2894745/qmjm94vlhr.png?imageView2/2/w/1620)

1.  @font-face文件 由于网页中使用的字体类型，也是各浏览器对字体类型有不同的支持规格。 字体格式类型主要有几个大分类：TrueType、Embedded Open Type 、OpenType、WOFF 、SVG。  TrueType（.ttf）：Windows和Mac系统最常用的字体格式，其最大的特点就是它是由一种数学模式来进行定义的基于轮廓技术的字体，这使得它们比基于矢量的字体更容易处理，保证了屏幕与打印输出的一致性。同时，这类字体和矢量字体一样可以随意缩放、旋转而不必担心会出现锯齿。   Embedded Open Type(.eot)：EOT是嵌入式字体，是微软开发的技术。允许OpenType字体用@font-face嵌入到网页并下载至浏览器渲染，存储在临时安装文件夹下。   OpenType(.otf)：OpenType是微软和Adobe共同开发的字体，微软的IE浏览器全部采用这种字体。致力于替代TrueType字体。   WOFF–WebOpen Font Format (.woff)：WOFF（Web开发字体格式）是一种专门为了Web而设计的字体格式标准，实际上是对于TrueType/OpenType等字体格式的封装，每个字体文件中含有字体以及针对字体的元数据（Metadata），字体文件被压缩，以便于网络传输。   SVG：SVG是由W3C制定的开放标准的图形格式。SVG字体就是使用SVG技术来呈现字体，还有一种gzip压缩格式的SVG字体。
2.  补充浏览器对字体文件的支持情况    浏览器 支持类型     IE6,7,8 仅支持 Embedded OpenType(.eot) 格式   Firefox 3.5 支持 TrueType、OpenType(.ttf, .otf) 格式   Firefox 3.6 支持 TrueType、OpenType(.ttf, .otf) 及 WOFF 格式   Chrome,Safari,Opera 支持 TrueType、OpenType(.ttf, .otf) 及 SVG Font(.svg) 格式
3.  字体文件：找到系统中的字体文件，提供给前端，最好是ttf格式的。一般路径如下：`C:\Windows\Fonts`；mac系统下字体路径`/System/Library/Fonts`。 根据.ttf可以生成另外几种格式，推荐转换站点：http://www.font2web.com/， 转换之后会生成一个压缩包，包括了上面的几种格式。
4.  前端的语法 @font-face { font-family: myFirstFont; src: url('Sansation_Light.ttf'),    url('Sansation_Light.eot'); /* IE9 */ }  //京东的自定义字体： @font-face { font-family: iconfont; src: url(//misc.360buyimg.com/mtd/pc/index/gb/images/iconfont.eot); src: url(//misc.360buyimg.com/mtd/pc/index/gb/images/iconfont.eot#iefix) format('embedded-opentype'),url(//misc.360buyimg.com/mtd/pc/index/gb/images/iconfont.woff) format('woff'),url(//misc.360buyimg.com/mtd/pc/index/gb/images/iconfont.ttf) format('truetype'),url(//misc.360buyimg.com/mtd/pc/index/gb/images/iconfont.svg#iconfont) format('svg') }

### 二 其他站点信息采集

- 为了更好的理解这方面，我们采集了以下项目的字体规定情况（无一例外，正文字体都是继承来自body定义的font-family）.

| 站点       | 字体列表                                                     |
| :--------- | :----------------------------------------------------------- |
| 百度pc     | arial,”Hiragino Sans GB”,”Microsoft Yahei”,”微软雅黑”,”宋体”,Tahoma,Arial,Helvetica,STHeiti |
| 百度手机   | Arial,Helvetica,sans-serif                                   |
| 天猫手机   | Helvetica,sans-serif                                         |
| 天猫pc     | tahoma, arial, 宋体                                          |
| 京东pc     | Microsoft YaHei,tahoma,arial,Hiragino Sans GB,\5b8b\4f53,sans-serif |
| 京东手机   | Microsoft YaHei”,Arial,Helvetica,sans-serif                  |
| 蘑菇街pc   | tahoma,arial,sans-serif                                      |
| 蘑菇街手机 | Arial                                                        |
| 微信       | -apple-system-font,Helvetica Neue,PingFang SC,Hiragino Sans GB,Microsoft YaHei,sans-serif |
| 知乎       | ‘Helvetica Neue’,Helvetica,’PingFang SC’,’Hiragino Sans GB’,’Microsoft YaHei’,Arial,sans-serif |

- 综上最终推荐参考字体： pc端： “Microsoft Yahei”,”微软雅黑”,”宋体”,Tahoma,Arial,Helvetica,STHeiti 手机端：Arial,Helvetica,sans-serif

### 三 参考文档

本文档参考w3c，菜鸟教程，知乎回帖，csdn博客等文档。

### 四 其他

- 版权问题，设计以及其他相关部门可以使用的字体如下,避免不必要的版权问题。（参考设计梳理）

1. 系统内置字体，windows、mac系统下的内置的字体，
2. 开源字体：思源黑体，文鼎开放黑体等
3. 可免费商用的字体，站酷高端黑、站酷快乐体、方正黑体等。
4. 已购买版权的字体：方正正黑简体、方正正大黑简体、方正尚酷简体