## 2020-07-26

## Webpack 4.0

### 第 2 章 初识 Webpack

`Webpack 究竟是什么`

webpack 模块打包工具（Bundler:打包工具）

`搭建 Webpack环境`

node 的版本越新，更能提高 webpack 的打包效率，因为用了 node 的新的特性

不建议全局安装 webpack，可能会造成多个项目不同版本的 webpack 不能运行

```bash
npm install webpack webpack-cli -g
npm uninstall webpack webpack-cli
```

局部安装

```bash
npm install webpack webpack-cli -D
// 查看webpack版本
npx webpack -v
```

查看包是否存在

```bash
npm info webpack
```

`webpack 的配置文件`

可以配置 webpack.config.js 文件，webpack 会把它当成打包的配置文件

**\_\_dirname**原理是 Node 定义的全局变量，指的是当前**webpack.config.js**配置文件所在的目录

三种方式运行 webpack

- 全局安装 webpack
- 局部安装 npx webpack
- 配置 npm scripts: webpack

---

### 第 3 章 Webpack 核心概念

`什么是Loader`

Loader 实际就是对于 webpack 不能打包的文件而提供的一种打包方案

```js
module: {
  rules: [
    {
      test: /\.jpg$/,
      use: {
        loader: "file-loader",
      },
    },
  ];
}
```

`使用Loader打包静态资源（图片篇）`

```js
module: {
  rules: [
    {
      test: /\.(jpg|png|gif)$/i,
      use: {
        loader: "file-loader",
        options: {
          name: "[name]_[hash].[ext]",
          outputPath: "images/",
        },
      },
    },
  ];
}
```

还可以使用**url-loader**来打包图片，通过设置**limit**参数来设置是否把图片打包 base64 的图片

```js
module: {
  rules: [
    {
      test: /\.(jpg|png|gif)$/i,
      use: {
        loader: "url-loader",
        options: {
          name: "[name]_[hash].[ext]",
          outputPath: "images/",
          limit: 2024, // 超过2024就不打包成base64
        },
      },
    },
  ];
}
```

`使用Loader打包静态资源（样式篇）`

**css-loader**可以分析样式文件之间的关系

**style-loader**可以把打包好的样式文件挂载到 head

**sass-loader**可以编译 sass 文件，需要安装**sass-loader**、**node-sass**

**postcss-loader**可以使用各种插件来处理样式的转换，可以指定**postcss.config.js**配置文件

```postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer') // 需要安装autoprefixer插件
  ]
}
```

```js
module: {
  rules: [
    {
      test: /\.scss$/i,
      use: {
        loader: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
      },
    },
  ];
}
```

`使用plugins让打包更便捷`

```bash
npm install -D html-webpack-plugin
```

htmlWebpackPlugin 会在打包结束后，自动生成一个 html 文件，并把打包生成的 js 文件自动引入到这个 html 文件中

```bash
npm install -D clean-webpack-plugin
```

cleanWebpackPlugin 可以帮我们在打包之前，清空指定目录的文件

```js
plugins: [
  new HtmlWebpackPlugin({
    template: "src/index.html", // 指定模板文件
  }),
  new CleanWebpackPlugin("dist"), // 清空dist目录下的所有文件
];
```

`Entry和Output的基础配置`

```js
entry: {
  main: './src/index.js',
  sub: './src/index.js'
},
output: {
  publicPath: 'https://cdn.example.com/', // 配置静态资源的域名，如cdn
  filename: '[name].js',
  path: path.resolve(__dirname, 'dist')
}
```

`SourceMap的配置`

sourceMap 可以映射源文件和打包之后的文件的关系，方便错误提示

```js
// development最佳实践
devtool: "cheap-module-eval-source-map";
// productioni最佳实践
devtool: "cheap-module-source-map";
```

inline: 可以不生成单独.map 文件，直接打包到文件的内

cheap: 可以只映射到具体的某行但不映射到具体的列

eval：打包效率最高，只映射到具体的文件

module：不仅映射源文件，还需要映射第三方文件的错误

不同的参数会影响打包的效率，不同参数可以组合使用

`使用WebpackDevServer提升开发效率`

三种方式可以监测文件变化：

- webpack --watch，缺点是不会再本地创建服务器，无法进行与服务器交互
- webpack-dev-server，可以启动本地服务器
  ```js
  // webpack.config.js devServer
  devServer: {
    contentBase: './dist',
    port: 8080, // 设置端口号
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      }
    }
  }
  ```
- 自己配置本地服务器

  ```js
  // 创建server.js
  const express = require("express");
  const webpack = require("webpack");
  const webpackDevMiddleware = require("webpack-dev-middleware");
  const config = require("./webpack.config.js");
  const complier = webpack(config); // 可以生成一个webpack的编译器
  const app = express();

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );

  app.list(3000, () => {
    console.log("server is running");
  });
  ```

`Hot Module Replacement`

通过配置 devServer 开启，可以只替换修改的模块文件

```js
const webpack = require('webpack')

module.exports = {
  ...
  devServer: {
    hot: true,
    hotOnly: true // 强制只有模块改变的时候才刷新页面
  },
  plugins: [
    ...
    new webpack.HotModuleReplacementPlugin()
  ]

  ...
}
```

`使用Babel处理ES6语法`

```bash
npm install -D babel-loader @babel/core @babel/preset-env
```

可以兼容低版本浏览器的使用新特性，但这种方式并不是很好，因为全局注入会污染环境，适合开发业务的时候使用

```bash
npm install -D @bable/polyfill
```

```js
rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        presets: [
          [
            "@babel/preset-env",
            {
              targets: {
                // 运行的环境
                chrome: "67",
              },
              useBuiltIns: "usage", // 只针对用到的ES6语法进行打包，可以减少打包之后的文件大小
            },
          ],
        ],
      },
    },
  },
];
```

如果开发的是一个类库，更好的选择是@babel/plugin-transform-runtime

```bash
npm install -D @babel/plugin-transform-runtime @babel/runtime-corejs2
```

```js
rules: [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: "babel-loader",
      options: {
        plugins: [
          [
            "@babel/plugin-transform-runtime",
            {
              corejs2: 2,
              helpers: true,
              regenerator: true,
              useESModules: false,
            },
          ],
        ],
      },
    },
  },
];
```

可以把上面的配置抽出来直接在**.babelrc**文件内配置即可

```json
{
  presets: [
    [
      '@babel/preset-env', {
        "targets": { // 运行的环境
          "chrome": '67'
        },
        "useBuiltIns": 'usage' // 只针对用到的ES6语法进行打包，可以减少打包之后的文件大小
      }
    ]
  ],
  "plugins": []
}
```

`配置react`

```bash
npm install -D @babel/preset-react
```

```json
{
  plugins: [
    [
      '@babel/preset-env', {
        "targets": { // 运行的环境
          "chrome": '67'
        },
        "useBuiltIns": 'usage' // 只针对用到的ES6语法进行打包，可以减少打包之后的文件大小
      }
    ],
    "@babel/preset-react"
  ]
}
```

babel 执行顺序是从下往上，从右往左

完整 webpack.config.js 配置

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");

module.exports = {
  mode: "development", // 打包模式，development 开发模式不压缩文件， production 生产环境，压缩文件代码
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: "./dist",
    port: 8080,
    open: true,
    hot: true,
    hotOnly: true,
  },
  entry: {
    main: "./src/index.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.(jpg|png|gif)$/i,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            limit: 10240,
          },
        },
      },
      {
        test: /\.(eot|ttf|svg)$/,
        laoder: "file-loader",
      },
      {
        test: /\.css$/,
        loader: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

### 第 4 章 Webpack 进阶

`Tree Shaking`

可以按需打包文件，只打包有使用的模块，而且只支持 ES Module 的方式引入

development 模式是没有 tree shaking 功能，需要额外加其它配置才能起作用

配置 webpack.config.js

```js
optimization: {
  usedExports: true;
}
```

配置 package.json，sideEffects 属性，可以过滤某些模块不使用 tree shaking
```js
{
  "sideEffects": ["*.css"] // false 不过滤
}
```
production 模式会默认开启，不需要配置 optimization

`Develoment和Production模式的区分打包`

根据不同的打包环境，指定不同的配置文件如 webpack.dev.js 和 webpack.prod.js，对于相同配置可以抽到 webpack.common.js，但需要借助 webpack-merge 插件

```package.json
{
  "scripts": {
    "dev": "webpack-dev-server --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js"
  }
}
```

```bash
npm install -D webpack-merge
```

例如 webpack.dev.js

```js
const merge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

const devConfig = {
  // config
};

module.exports = merge(commonConfig, devConfig);
```

`Webpack和Code Splitting（代码分割）`

代码分割可以减少文件打包的大小，以及文件加载的大小

webpack 对于代码分割的实现方式有两种：

- 同步代码，可以在 webpack.config.js 中配置 optimization 属性
  ```js
  optimization: {
    splitChunks: {
      chunks: "all"; // 同步和异步都要代码分割，async只要异步代码分割
    }
  }
  ```
- 而对于异步加载的代码（import），webpack 无需自动做任何配置，webpack 会自动进行代码分割

optimization 配置了对两种方式的打包都有效果

`SplitChunksPlugin配置参数详解`
异步代码分割可以使用@babel/dynamic

`Lazy Loading懒加载，Chunk是什么`

懒加载实际上 ES 的实现，webpack 的能够识别通过 import 的语法，实现代码分割

```js
function getComponent() {
  // webpack可以识别魔法语法注释，自动打包
  return import(/* webpackChunkName: "loadash" */'lodash').then({ default: _ } => {
    const element = document.createElement('div')
    element.innerHTML = _.join(['hello', 'world'], '-')
    return element
  })
}

document.addEventListener('click', () => {
  getComponent().then(element => {
    document.body.appendChild(element)
  })
})
```

`使用 async 和 await`

```js
async function getComponent() {
  const { default: _ } = await import(
    /* webpackChunkName: "loadash" */ "lodash"
  );
  const element = document.createElement("div");
  element.innerHTML = _.join(["hello", "world"], "-");
  return element;
}

document.addEventListener("click", () => {
  getComponent().then((element) => {
    document.body.appendChild(element);
  });
});
```

`打包分析，Preloading, Prefetching`

`webpack-bundle-analysis`

chrome -> network -> 快捷键 ctrl+shift+p，输入 coverage，可以分析代码利用率

```js
function handleClick() {
  const dom = document.createElement("div");

  dom.innerHTML = "123";
  document.body.append(dom);
}
```

```js
document.addEventListener('click', () => {
  import(/* webpackPrefetch: true */ './click.js).then(({default: func}) => {
    func()
  })
})
```

Preload：会跟随系统主线程一起加载

Prefetch：是在主逻辑代码加载完空闲后加载（优选这种）

`CSS文件的代码分割`

需要用到两个插件

```bash
npm install -D mini-css-extract-plugin

npm install -D optimize-css-assets-plugin
```

`Webpack与浏览器缓存（Caching)`

可以配置文件输出的**contenthash**，只要源文件发生变化，打包就会生成新的哈希值

```js
  output: {
    filename: [name].[contenthash].js,
    chunkFilename: [name].[contenthash].js
  }
```

`Shimming 垫片`

```js
plugins: [
  new webpack.ProvidePlugin({
    $: "jquery",
    _: "lodash",
  }),
];
```

`环境变量的使用`

**webpack.dev.js**

```js
const webpack = require("webpack");
const commonConfig = require("./webpack.common.js");

const devConfig = {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: "./dist",
    open: true,
    port: 8080,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
    ],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
};

module.exports = devConfig;
```

**webpack.prod.js**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const commonConfig = require("./webpack.common.js");

const prodConfig = {
  mode: "production",
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 2,
            },
          },
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [new OptimizeCSSAssetsPlugin({})],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[name].chunk.css",
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    chunkFilename: "[name].[contenthash].js",
  },
};

module.exports = prodConfig;
```

**webpack.common.js**

```js
const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const AddAssetHtmlWebpackPlugin = require("add-asset-html-webpack-plugin");
const webpack = require("webpack");
const devConfig = require("./webpack.dev.js");
const prodConfig = require("./webpack.prod.js");

const makePlugins = (configs) => {
  const plugins = [
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname, "../"),
    }),
  ];
  Object.keys(configs.entry).forEach((item) => {
    plugins.push(
      new HtmlWebpackPlugin({
        template: "src/index.html",
        filename: `${item}.html`,
        chunks: ["runtime", "vendors", item],
      })
    );
  });
  const files = fs.readdirSync(path.resolve(__dirname, "../dll"));
  files.forEach((file) => {
    if (/.*\.dll.js/.test(file)) {
      plugins.push(
        new AddAssetHtmlWebpackPlugin({
          filepath: path.resolve(__dirname, "../dll", file),
        })
      );
    }
    if (/.*\.manifest.json/.test(file)) {
      plugins.push(
        new webpack.DllReferencePlugin({
          manifest: path.resolve(__dirname, "../dll", file),
        })
      );
    }
  });
  return plugins;
};

const configs = {
  entry: {
    index: "./src/index.js",
    list: "./src/list.js",
    detail: "./src/detail.js",
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, "../src"),
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: "url-loader",
          options: {
            name: "[name]_[hash].[ext]",
            outputPath: "images/",
            limit: 10240,
          },
        },
      },
      {
        test: /\.(eot|ttf|svg)$/,
        use: {
          loader: "file-loader",
        },
      },
    ],
  },
  optimization: {
    runtimeChunk: {
      name: "runtime",
    },
    usedExports: true,
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          name: "vendors",
        },
      },
    },
  },
  performance: false,
  output: {
    path: path.resolve(__dirname, "../dist"),
  },
};

configs.plugins = makePlugins(configs);

module.exports = (env) => {
  if (env && env.production) {
    return merge(config, prodConfig);
  } else {
    return merge(config, devConfig);
  }
};
```

```bash
"script": {
  "build": "webpack --env.production --config webpack.common.js"
}
```

### 第 5 章 Webpack 实战配置案例讲解

`Library的打包`

**webpack.config.js**

```js
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  externals: "lodash", // 打包的时候，如果库引用了第三方的库，打包的时候可以忽略
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "library.js", // 文件名
    library: "library", // 使用库的文件名
    libraryTarget: "umd", // this, window, global
  },
};
```

配置**umd**几乎支持所有的引用方式

```
// es6
import library from 'library'

// cmd
const library = require('library')

// amd
require(['library'], function(library) {

})

<script src="library"></script>
```

`Progressive Web Application`

```bash
npm install workbox-webpack-plugin --save
```

```js
plugins: [
  new WorkboxPlugin.generateSW({
    clientsClaim: true,
    skipWaiting: true,
  }),
];
```

注册**server-worker**

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("service-worker registed");
      })
      .catch((err) => {
        console.log("service-worker register error");
      });
  });
}
```

`Typescript 的打包配置`

```bash
npm install ts-loader typescript --save-dev
```

```js
module: {
  rules: [
    {
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    },
  ];
}
```

创建**tsconfig.json**

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "module": "es6",
    "target": "es5", // 打包成的文件类型
    "allowJs": true
  }
}
```

`使用 WebpackDevServer 实现请求转发`

```js
devServer: {
  proxy: {
    '/react/api': {
      target: 'http://www.dell-lee.com',
      secure: false,
      changeOrigin: true,
      pathRewrite: {
        'header.json': 'demo.json'
      }
    }
  }
}
```

`WebpackDevServer 解决单页面应用路由问题`

配置 historyApiFallback: true

上线之前，需要跟后端沟通好，配置本地开发时的一些转发，线上才可以生效

`EsLint 在 Webpack 中的配置`

规范约束
第一种方式

```bash
npm install eslint --save
# 初始化
npx eslint --init

# 检查src目录
npx eslint src
```

第二种在编辑器安装插件

第三种安装 eslint-loader，会影响打包速度

```bash
npm install eslint-loader --save-dev
```

```js
  overlay: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  }
```

`webpack 性能优化`

提升 Webpack 打包速度的方法

- 跟上技术的迭代（node, npm, yarn)
- 在尽可能少的模块上应用 Loader
- Plugin 尽可能精简并确保可靠
- resolve 参数合理配置

```
resolve: {
  extensions: ['js', 'jsx'],
  mainFiles: ['index', 'child']
}
```

- 使用 DLLPlugin 提高打包速度

  第三方模块在第一次打包的时候已经分析好，再次打包可以不用再分析

- 控制包文件大小

- thread-loader, parallel-webpack, happypack 多进程打包

- 合理使用 sourceMap

- 结合 stats 分析打包结果

- 开发环境内存编译

- 开发环境无用插件剔除

`多页面打包配置`

### 第 6 章 Webpack 底层原理及脚手架工具分析

`如何编写一个 Loader`

loader 可以处理模块，可以减少对业务代码的影响，例如要加监控，就可以编写一个 loader，处理源代码的时候替换原来的代码，加载监控程序

**webpack.config.js**

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: path.resolve(__dirname, "./loader/replaceLoader.js"),
            options: {
              name: "galaxy",
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

**replaceLoader.js**，loader 函数不能用箭头函数，因为会影响 this 的指向

```js
module.exports = function (source) {
  return source.replace("world", this.query.name);
};
```

`如何编写一个 Plugin`

开启 node 调试

package.json

```
"script": {
  "debug": "node --inspect --inspect-brk node_modules/webpack/bin/webpack.js"
}
```

webpack 插件的一定是一个类

```js
class CopyrightWebpackPlugin {
  constructor(options) {
    console.log("copyright-webpack-plugin init");
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      "CopyrightWebpackPlugin",
      (compilation, cb) => {
        compilation.assets["copyright.txt"] = {
          source: function () {
            return "copyright by dell lee";
          },
          size: function () {
            return 21;
          },
        };
        cb();
      }
    );
  }
}

module.exports = CopyrightWebpackPlugin;
```

`Bundler 源码编写（模块分析）`

bundler.js

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const babel = require("@babel/core");

const moduleAnalyser = (filename) => {
  const content = fs.readFileSync(filename, "utf-8");
  const ast = parser.parse(content, {
    sourceType: "module",
  });
  const dependencies = {};
  traverse(ast, {
    ImportDeclaration({ node }) {
      const dirname = path.dirname(filename);
      const newFile = "./" + path.join(dirname, node.source.value);
      dependencies[node.source.value] = newFile;
    },
  });
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["@babel/preset-env"],
  });
  return {
    filename,
    dependencies,
    code,
  };
};

const makeDependenciesGraph = (entry) => {
  const entryModule = moduleAnalyser(entry);
  const graphArray = [entryModule];
  for (let i = 0; i < graphArray.length; i++) {
    const item = graphArray[i];
    const { dependencies } = item;
    if (dependencies) {
      for (let j in dependencies) {
        graphArray.push(moduleAnalyser(dependencies[j]));
      }
    }
  }
  const graph = {};
  graphArray.forEach((item) => {
    graph[item.filename] = {
      dependencies: item.dependencies,
      code: item.code,
    };
  });
  return graph;
};

const generateCode = (entry) => {
  const graph = JSON.stringify(makeDependenciesGraph(entry));
  return `
		(function(graph){
			function require(module) { 
				function localRequire(relativePath) {
					return require(graph[module].dependencies[relativePath]);
				}
				var exports = {};
				(function(require, exports, code){
					eval(code)
				})(localRequire, exports, graph[module].code);
				return exports;
			};
			require('${entry}')
		})(${graph});
	`;
};

const code = generateCode("./src/index.js");
console.log(code);
```

### 第 7 章 Create-React-App 和 Vue-Cli 3.0 脚手架工具配置分析

`通过 CreateReactApp 深入学习 Webpack 配置`

`Vue CLI 3 的配置方法及课程总结`
