## 2021-08-16

## Nginx

Nginx 是一个 高性能的代理服务器，能够反向代理 HTTP、 HTTPS、SMTP、 POP3、 IMAP ，也可以作为一个负载均衡器和 HTTP 缓存。同时，它还是一个免费的、开源的、高性能的 HTTP 服务器。

Nginx 以其高性能、稳定性、丰富的特性、以及简单配置和低资源消耗而著称。

与传统的服务器不同，Nginx 不依赖线程来处理请求。 相反，它使用了一个更具可扩展性的事件驱动（异步）体系结构。这种体系结构使用较小的内存量，但更重要的是，内存的使用量在有负载的时候更加可预测。

### 安装/卸载

推荐 Mac 电脑上内置 homebrew 工具安装
```bash
# 安装
brew install nginx

# 卸载
brew uninstall nginx
```

### 启动

```bash
sudo service nginx start
# 或
sudo nginx

# 查看状态
sudo service nginx status

# 停止nginx
sudo nginx -s stop
# 或
sudo brew services stop nginx

# 热启动
sudo nginx -s reload

# 强制停止nginx
sudo pkill -9 nginx
```

### nginx配置结构

![nginx配置结构](https://dn-simplecloud.shiyanlou.com/uid/276733/1517307303225.png)

```
Main
├── Events
└── Http
    ├── Server
    │    └── Location
    └── Server
```

Main 就是我们的配置文件，配置文件中的 events{...} 对应 Events，http{...} 对应 Http。

在 nginx.conf，为了方便维护我们 server 相关配置，不会让某一个配置文件过于庞大。通常是将所有的虚拟主机配置文件（也就是 server 配置块的内容）存放在 /etc/nginx/conf.d/ 或者 /etc/nginx/sites-enabled/ 目录中，在主配置文件中已经默认声明了会读取这两个文件夹下所有 *.conf 文件。

### server 和 location


#### 💡server 配置块

一个典型、完整的静态 Web 服务器还会包含多个 server 配置块。

```conf
# 虚拟主机的配置
server {
    # 侦听 80 端口，分别配置了 IPv4 和 IPv6
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    # 定义服务器的默认网站根目录位置
    root /usr/share/nginx/html;

    # 定义主页的文件名
    index index.html index.htm;

    # 定义虚拟服务器的名称
    server_name localhost;

    # location 块
    location / {
        try_files $uri $uri/ =404;
    }
}
```

在配置文件中可以看到，如果我们想修改 Server 的端口为 8080，那么就可以修改 listen 80 为 listen 8080。访问网站的时候应该是 网站:8080，其中 :8080 表示访问 8080 端口。如果是 80 端口，可以省略不写。

如果我们想更改网站文件存放的位置，修改 root 就可以了。

>各个指令都是以分号结尾的！！！



#### 💡location 配置块

其中 location 用于匹配请求的 URI。

URI 表示的是访问路径，除域名和协议以外的内容，比如说我访问了 https://www.lanqiao.cn/louplus/linux，https:// 是协议，www.lanqiao.cn 是域名，/louplus/linux 是 URI。

location 匹配的方式有多种：

- 精准匹配
- 忽略大小写的正则匹配
- 大小写敏感的正则匹配
- 前半部分匹配
 
其语法如下：

```conf
location [ = | ~ | ~* | ^~ ] pattern {
#    ......
#    ......
}
```

其中各个符号的含义：

- `=`：用于精准匹配，想请求的 URI 与 pattern 表达式完全匹配的时候才会执行 location 中的操作
- `~`：用于区分大小写的正则匹配；
- `~*`：用于不区分大小写的正则匹配；
- `^~`：用于匹配 URI 的前半部分；

```conf
location = / {
    # [ 配置 A ]
}

location / {
    # [ 配置 B ]
}

location /documents/ {
    # [ 配置 C ]
}

location ^~ /images/ {
    # [ 配置 D ]
}

location ~* \.(gif|jpg|jpeg)$ {
    # [ 配置 E ]
}
```

- 当访问 www.shiyanlou.com 时，请求访问的是 /，所以将与配置 A 匹配；
- 当访问 www.shiyanlou.com/test.html 时，请求将与配置 B 匹配；
- 当访问 www.shiyanlou.com/documents/document.html 时，请求将匹配配置 C;
- 当访问 www.shiyanlou.com/images/1.gif 请求将匹配配置 D；
- 当访问 www.shiyanlou.com/docs/1.jpg 请求将匹配配置 E。

当一个 URI 能够同时配被多 location 匹配的时候，则按顺序被第一个 location 所匹配。

在 location 中处理请求的方式有很多，如上文中的 try_files $uri $uri/ =404;，它是一种特别常用的写法。

我们来分析一下 try_files $uri $uri/ =404;。这里假设我定义的 root 为 /usr/share/nginx/html/，访问的 URI 是 /hello/shiyanlou。

- 第一步：当 URI 被匹配后，会先查找 /usr/share/nginx/html//hello/shiyanlou 这个文件是否存在，如果存在则返回，不存在进入下一步。
- 第二步：查找 /usr/share/nginx/html//hello/shiyanlou/ 目录是否存在，如果存在，按 index 指定的文件名进行查找，比如 index.html，如果存在则返回，不存在就进入下一步。
- 第三步：返回 404 Not Found。