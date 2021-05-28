## 2020-09-03

## Webpack

### webpack 基本配置

#### 拆分配置和 merge

项目在不同环境下，需要的 webpack config 参数可能不一样，可以通过不同环境，把相同的参数抽离到 webpack.common.js 中，再根据不同环境，定义例如开发环境 webpack.dev.js 和线上环境 webpack.prod.js，webpack.common.js 文件可以通过 webpack-merge 引入

#### 启动本地服务

开发环境通过 webpack-dev-server 启动本地服务

```js
devServer: {
    port: 8080,
    progress: true,  // 显示打包的进度条
    contentBase: distPath,  // 根目录
    open: true,  // 自动打开浏览器
    compress: true,  // 启动 gzip 压缩

    // 设置代理
    proxy: {
        // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
        '/api': 'http://localhost:3000',

        // 将本地 /api2/xxx 代理到 localhost:3000/xxx
        '/api2': {
            target: 'http://localhost:3000',
            pathRewrite: {
                '/api2': ''
            }
        }
    }
}
```

#### 处理 ES6

babel-loader

#### 处理样式

可能会用到几个 loader：style-loader、css-loader、postcss-loader，多个 loader 执行顺序是从右往左。

#### 处理图片

开发环境：file-loader

线上环境：url-loader

#### 模块化

### webpack 高级配置

- 多入口

  需要配置 entry，output 以及 plugins

- 抽离 css 文件

```js
const path = require("path");
const webpack = require("webpack");
const { smart } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpackCommonConf = require("./webpack.common.js");
const { srcPath, distPath } = require("./paths");

module.exports = smart(webpackCommonConf, {
  mode: "production",
  output: {
    // filename: 'bundle.[contentHash:8].js',  // 打包代码时，加上 hash 戳
    filename: "[name].[contentHash:8].js", // name 即多入口时 entry 的 key
    path: distPath,
    // publicPath: 'http://cdn.abc.com'  // 修改所有静态文件 url 的前缀（如 cdn 域名），这里暂时用不到
  },
  module: {
    rules: [
      // 图片 - 考虑 base64 编码的情况
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            // 小于 5kb 的图片用 base64 格式产出
            // 否则，依然延用 file-loader 的形式，产出 url 格式
            limit: 5 * 1024,

            // 打包到 img 目录下
            outputPath: "/img1/",

            // 设置图片的 cdn 地址（也可以统一在外面的 output 中设置，那将作用于所有静态资源）
            // publicPath: 'http://cdn.abc.com'
          },
        },
      },
      // 抽离 css
      {
        test: /\.css$/,
        loader: [
          MiniCssExtractPlugin.loader, // 注意，这里不再用 style-loader
          "css-loader",
          "postcss-loader",
        ],
      },
      // 抽离 less --> css
      {
        test: /\.less$/,
        loader: [
          MiniCssExtractPlugin.loader, // 注意，这里不再用 style-loader
          "css-loader",
          "less-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), // 会默认清空 output.path 文件夹
    new webpack.DefinePlugin({
      // window.ENV = 'production'
      ENV: JSON.stringify("production"),
    }),

    // 抽离 css 文件
    new MiniCssExtractPlugin({
      filename: "css/main.[contentHash:8].css",
    }),
  ],

  optimization: {
    // 压缩 css
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
});
```

- 抽离公共代码

`webpack.prod.js`

```js
optimization: {
    // 压缩 css
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],

    // 分割代码块
    splitChunks: {
        chunks: 'all',
        /**
         * initial 入口 chunk，对于异步导入的文件不处理
            async 异步 chunk，只对异步导入的文件处理
            all 全部 chunk
            */

        // 缓存分组
        cacheGroups: {
            // 第三方模块
            vendor: {
                name: 'vendor', // chunk 名称
                priority: 1, // 权限更高，优先抽离，重要！！！
                test: /node_modules/,
                minSize: 0,  // 大小限制
                minChunks: 1  // 最少复用过几次
            },

            // 公共的模块
            common: {
                name: 'common', // chunk 名称
                priority: 0, // 优先级
                minSize: 0,  // 公共模块的大小限制
                minChunks: 2  // 公共模块最少复用过几次
            }
        }
    }
}
```

- 懒加载

```js
setTimeout(() => {
  import("abc.js").then((res) => {
    // 通过default就可以获取对象
    console.log(res.default.message);
  });
}, 1500);
```

- 处理 JSX

配置 babel-loader

- 处理 vue

配置 vue-loader 即可

#### module、chunk、bundle 的区别

- module - 各个源码文件（如图片，css，js 以及第三方模块等等），webpack 中一切皆模块
- chunk - 多模块打包合成，如 entry，import(), splitChunk
- bundle - 最终输出的文件

#### webpack 性能优化

可以从两个方面进行：

- 优化打包构建的速度，提升开发体验和效率
- 优化产出代码，提高产品性能

#### 提升构建速度

- 优化 babel-loader：只要 ES6 代码没有改动的，就不会重新编译，从而提高打包速度
  ```js
  {
       test: /\.js$/,
       loader: ['babel-loader?cacheDirectory'], // 开启缓存
       include: srcPath, // 明确范围
       // include和exclude两者选一就可以了
  }
  ```
- IgnorePlugin: 忽略某些插件打包
- noParse：忽略某些插件的解析
- happyPack：多进程打包
  - JS 本身是单进程，可以开启多进程打包
  - 提高构建速度（特别是多核 CPU）
- ParallelUglifyPlugin：多进程压缩 JS

  - webpack 内置 uglify 工具压缩 js
  - JS 是单线程，开启多进程压缩更快
  - 和 happypack 同理

  ```js
  // 需要安装happypack和parallelUglifyplugin,
  // 同时修改module和plugins
  module: {
      rules: [
          // js
          {
              test: /\.js$/,
              // 把对 .js 文件的处理转交给 id 为 babel 的 HappyPack 实例
              use: ['happypack/loader?id=babel'],
              include: srcPath,
              // exclude: /node_modules/
          },
      ]
  },
  plugins: [
      // 忽略 moment 下的 /locale 目录
      new webpack.IgnorePlugin(/\.\/locale/, /moment/),

      // happyPack 开启多进程打包
      // 主要场景开发环境和线上环境
      new HappyPack({
          // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
          id: 'babel',
          // 如何处理 .js 文件，用法和 Loader 配置中一样
          loaders: ['babel-loader?cacheDirectory']
      }),

      // 使用 ParallelUglifyPlugin 并行压缩输出的 JS 代码
      // 主要使用场景是线上环境
      new ParallelUglifyPlugin({
          // 传递给 UglifyJS 的参数
          // （还是使用 UglifyJS 压缩，只不过帮助开启了多进程）
          uglifyJS: {
              output: {
                  beautify: false, // 最紧凑的输出
                  comments: false, // 删除所有的注释
              },
              compress: {
                  // 删除所有的 `console` 语句，可以兼容ie浏览器
                  drop_console: true,
                  // 内嵌定义了但是只用到一次的变量
                  collapse_vars: true,
                  // 提取出出现多次但是没有定义成变量去引用的静态值
                  reduce_vars: true,
              }
          }
      })
  ]
  ```

  关于开启多进程

  - 项目较大，打包较慢，开启多进程能提高速度
  - 项目较小，打包很快，开启多进程会降低速度（进程之前，需要开启，销毁，通讯，会造成额外的开销）

- 自动刷新：页面自动更新
- 热更新：更新部分代码，需要手动配置更新后的执行回调
- DllPlugin：动态链接库插件

  - 前端框架如 vue、react，体积大，构建慢
  - 较稳定，不常升级版本
  - 同一个版本只构建一次即可，不用每次都重新构建
  - webpack 已内置 DllPlugin 支持
  - DllPlugin-打包出 dll 文件
  - DllReferencePlugin-使用 dll 文件

  ```bash
  npm run dll
  # dll: webpack --config webpack.dll.js
  ```

  ```js
  const path = require("path");
  const DllPlugin = require("webpack/lib/DllPlugin");
  const { srcPath, distPath } = require("./paths");

  module.exports = {
    mode: "development",
    // JS 执行入口文件
    entry: {
      // 把 React 相关模块的放到一个单独的动态链接库
      react: ["react", "react-dom"],
    },
    output: {
      // 输出的动态链接库的文件名称，[name] 代表当前动态链接库的名称，
      // 也就是 entry 中配置的 react 和 polyfill
      filename: "[name].dll.js",
      // 输出的文件都放到 dist 目录下
      path: distPath,
      // 存放动态链接库的全局变量名称，例如对应 react 来说就是 _dll_react
      // 之所以在前面加上 _dll_ 是为了防止全局变量冲突
      library: "_dll_[name]",
    },
    plugins: [
      // 接入 DllPlugin
      new DllPlugin({
        // 动态链接库的全局变量名称，需要和 output.library 中保持一致
        // 该字段的值也就是输出的 manifest.json 文件 中 name 字段的值
        // 例如 react.manifest.json 中就有 "name": "_dll_react"
        name: "_dll_[name]",
        // 描述动态链接库的 manifest.json 文件输出时的文件名称
        path: path.join(distPath, "[name].manifest.json"),
      }),
    ],
  };
  ```

  ```js
  const path = require("path");
  const webpack = require("webpack");
  const { smart } = require("webpack-merge");
  const webpackCommonConf = require("./webpack.common.js");
  const { srcPath, distPath } = require("./paths");

  // 第一，引入 DllReferencePlugin
  const DllReferencePlugin = require("webpack/lib/DllReferencePlugin");

  module.exports = smart(webpackCommonConf, {
    mode: "development",
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: ["babel-loader"],
          include: srcPath,
          exclude: /node_modules/, // 第二，不要再转换 node_modules 的代码
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        // window.ENV = 'production'
        ENV: JSON.stringify("development"),
      }),
      // 第三，告诉 Webpack 使用了哪些动态链接库
      new DllReferencePlugin({
        // 描述 react 动态链接库的文件内容
        manifest: require(path.join(distPath, "react.manifest.json")),
      }),
    ],
    devServer: {
      port: 8080,
      progress: true, // 显示打包的进度条
      contentBase: distPath, // 根目录
      open: true, // 自动打开浏览器
      compress: true, // 启动 gzip 压缩

      // 设置代理
      proxy: {
        // 将本地 /api/xxx 代理到 localhost:3000/api/xxx
        "/api": "http://localhost:3000",

        // 将本地 /api2/xxx 代理到 localhost:3000/xxx
        "/api2": {
          target: "http://localhost:3000",
          pathRewrite: {
            "/api2": "",
          },
        },
      },
    },
  });
  ```

#### webpack 优化构建速度

可用于生产环境:

- 优化 babel-loader
- IgnorePlugin
- noParse
- happyPack
- ParallelUglifyPlugin

不可用于生产环境：

- 自动更新
- 热更新
- DllPlugin

#### webpack 性能优化-产出代码

原因：

- 打包出来的文件体积更小
- 合理分包，不重复加载模块
- 速度更快、内存使用更小

具体方式：

- 小图片 base64 编码
- bundle 加 hash
- 懒加载，针对大文件
- 提取公共代码
- IgnorePlugin
- 使用 CDN 加速
- 使用 production
- Scope Hosting

#### 使用 production

- 启动开启代码压缩
- Vue React 等会自动删掉调试代码（如开发环境中 warning）
- 启动 Tree-Shaking 即删除不使用的代码，是基于 ES6 Module 机制，commonjs 则不支持

#### ES6 Module 和 commonjs 区别

- ES6 Module 静态引入，编译时引入
- Commonjs 动态引入，执行时引入
- 只有 ES6 Module 才能静态分析，实现 Tree-Shaking

```js
let apiList = require("../config/api.js");

if (isDev) {
  // 可以动态引入，执行时引入
  apiList = require("../config/api_dev.js");
}
```

```js
import apiList from "../config/api.js";

if (isDev) {
  // 编译时报错，只能静态引入
  import apiList from "../config/api_dev.js";
}
```

#### Scope Hosting

如果没有开启 Scope Hosting，webpack 打包的时候把引用的文件都打包成多个函数，这样会导致文件体积较大，可读性差，执行时会创建较多的函数作用域导致性能消耗，开启 Scope Hosting 可以合并多个模块之间调用的代码，这样生成的文件体积小，可读性更好

```js
const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");

module.exports = {
  resolve: {
    // 针对npm第三方模块优先使用jsnext:main中指向的ES6模块化语法文件
    mainFields: ["jsnext:main", "browser", "main"],
  },
  plugins: [
    // 开启Scope Hosting
    new ModuleConcatenationPlugin(),
  ],
};
```

### Babel

#### babel 环境搭建和基本配置

- 环境搭建
- .babelrc 配置
- presets 和 plugins

```.babelrc
{
    "presets": [
        [
            "@babel/preset-env"
        ]
    ],
    "plugins": []
}
```

> @babel/preset-env 实际就是一系列插件的集合

#### babel-polyfill 是什么

- polyfill 是一些新语法或者低版本浏览器，提供的一些新特性的解决方案
- 主要 core-js 和 regenerator
- babel-polyfill 是以上两个库的集合
- Babel 7.4 之后已经弃用 babel-polyfill
- 推荐直接使用 core-js 和 regenerator

#### babel-polyfill 按需引入

由于 babel 只编译符合语法的规范的代码，对一些新 API 还需要配合@babel/polyfill 来提供兼容方法，同时需要 webpack 进行打包引入

按需引入配置

```.babelrc
{
    "presets": [
        [
            "@babel/preset-env",
            {
                "useBuildInt": "usage", // 按需引入
                "corejs": 3 // 配置corejs的版本
            }
        ]
    ],
    "plugins": []
}
```

#### babel-polyfill 的问题

- 会污染全局变量，通过挂载到 window 下，实现的 polyfill
- 做一个独立 web 系统则无大碍
- 做的是第三方系统，则可能会有问题

#### babel-runtime

babel-runtime 则可以解决全局污染的问题，需要配置.babelrc 的 plugins

```.babelrc
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 3,
        "helpers": true,
        "regenerator": true,
        "useESModules": false
      }
    ]
  ]
}
```

#### 前端为何要进行打包和构建

可以两个方面考虑：代码优化以及研发流程优化

代码优化：

- 体积更小（Tree-Shaking、压缩、合并），加载更快
- 编译高级语言和语法（TS、ES6+、模块化、scss）
- 兼容性和错误检查（polyfill、postcss、eslint）

研发流程优化：

- 统一、高效的开发环境
- 统一的构建流程和产出标准
- 集成公司构建规范（提测、上线等）

#### loader 和 plugin 区别

- loader 模块转换器，如 less -> css
- plugin 扩展插件，如 HtmlWebpackPlugin

#### 常见 loader 和 plugin

- https://www.webpackjs.com/loaders
- https://www.webpackjs.com/plugins

#### babel 和 webpack 的区别

- babel - JS 语法编译工具，不关心模块化
- webpack- 打包构建工具，是多个 loader，plugin 的集合
- 需要两者结合使用

#### 如何产出一个 lib

```js
output: {
  filename: 'lodash.js',
  path: distPath,
  // lib的全局变量名
  library: 'lodash'
}
```

#### babel-polyfill 和 babel-runtime 的区别

- babel-polyfill 会污染全局环境
- babel-runtime 不会污染全局
- 产出第三方库要用 babel-runtime

#### webpack 如何实现懒加载

- import()
- 结合 vue React 异步组件
- 结合 vue-router,react-router 异步加载路由

#### 为何 proxy 不能被 polyfill

- 没有兼容的方法来实现 proxy 的功能，Object.defineProperty 也无法实现
