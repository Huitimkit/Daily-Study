## 2021-09-01

## linux常见目录解释

理论上所有Linux发布版本应该都会遵守文件系统层次结构标准（Filesystem Hierachy Standard, FHS），常见目录架构如下：

- `/bin`,`/sbin`
```
/bin：主要放置普通用户可以操作的指令
/sbin：放置系统管理员可以操作的指令
常见路径分别是：/usr/bin,/usr/sbin
```

- `/boot`
```
/boot：主要放置开机相关的引导程序文件
```

- `/dev`
```
/dev：放置device设备文件，包括鼠标键盘灯
```

- `/etc`
```
/etc：系统范围内的配置文件
```

- `/home`,`root`
```
/home：用户的家目录，包含保存的文件、个人设置等
/root：超级用户的家目录
```

- `/lib`, `/lib64`
```
主要为系统函式库和核心函式库，若是 64 位则放在 /lib64。
常见路径分别是：/usr/lib, /usr/lib64
```


- `/proc`
```
虚拟文件系统，将内核与进程状态归档为文本文件
```

- `/sys`
```
与 /proc 类似，但主要针对硬体相关参数
```

- `/usr`
```
/usr 全名为 unix software resource 缩写，放置系统相关程序、服务（注意不是 user 的缩写喔！）
```
- `/var`
```
全名为 variable，放置一些变量或日志
```
- `/tmp`
```
全名为 temporary，放置缓存文件或临时文件
```

- `/media`, `/mnt`
```
可临时挂载的文件目录， /mnt 为管理员/使用者手动挂上（mount）的目录
```

- `/opt`
```
全名为 optional，通常为第三方厂商程序放置的目录
```

- `/run`
```
放置系统正在运行的服务程序
```


- `/srv`
```
通常是放置开发的服务（service），如：网站服务 www 等
```

## mac/linux查找软件安装、配置路径

可参考三种方式：

### 1.whereis或which

```bash
# mac具体用法
which nginx
# 会输出安装路径
/usr/local/bin/nginx
```

### 2.find / -nanme {keywords}

有时候需要查找某个配置文件所在目录
```bash
sudo find / -name redis.conf
```

### 3./usr/local/Cellar

mac 上通过homebrew安装的应用都会放在这个路径下



[https://zh.wikipedia.org/zh/%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%E5%B1%82%E6%AC%A1%E7%BB%93%E6%9E%84%E6%A0%87%E5%87%86](https://zh.wikipedia.org/zh/%E6%96%87%E4%BB%B6%E7%B3%BB%E7%BB%9F%E5%B1%82%E6%AC%A1%E7%BB%93%E6%9E%84%E6%A0%87%E5%87%86)