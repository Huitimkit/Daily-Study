## 2021-08-17

## linux常用命令

### 1、ls - list

列出当前目录的内容

```bash
# 列出目录所有文件，包含以.开始的隐藏文件
ls -a 

# 列出除.及..的其它文件
ls -A 

# 反序排列
ls -r 

# 以文件修改时间排序
ls -t 

# 以文件大小排序
ls -S 

# 以易读大小显示
ls -h 

# 除了文件名之外，还将文件的权限、所有者、文件大小等信息详细列出来
ls -l 
```

### 2、cd - change directory

切换当前目录

```bash
#进入要目录
cd /

#进入 "home" 目录
cd ~

#进入上一次工作路径
cd -

#把上个命令的参数作为cd参数使用。
cd !$
```


### 3、pwd - Print Working Directory

查看当前工作目录路径

```bash
# 查看当前路径
pwd

# 查看软连接的实际路径
pwd -P
```


### 4、mkdir - Make Directory

新建一个新目录，可用选项：
- -m: 对新建目录设置存取权限，也可以用 chmod 命令设置;
- -p: 可以是一个路径名称。此时若路径中的某些目录尚不存在,加上此选项后，系统将自动建立好那些尚不在的目录，即一次可以建立多个目录。

```bash
# 当前工作目录下创建名为 t的文件夹
mkdir t

# 在 tmp 目录下创建路径为 test/t1/t 的目录，若不存在，则创建：
mkdir -p /tmp/test/t1/t
```

### 5、rm - Remove

删除一个目录中的一个或多个文件或目录，如果没有使用 -r 选项，则 rm 不会删除目录。如果使用 rm 来删除文件，通常仍可以将该文件恢复原状。

```bash
# 删除任何 .log 文件，删除前逐一询问确认：
rm -i *.log

# 删除 test 子目录及子目录中所有档案删除，并且不用一一确认：
rm -rf test

# 删除以 -f 开头的文件
rm -- -f*
```

### 6、rmdir - Remove Directory

从一个目录中删除一个或多个子目录项，删除某目录时也必须具有对其父目录的写权限。

注意：不能删除非空目录

```bash
# 当 parent 子目录被删除后使它也成为空目录的话，则顺便一并删除
rmdir -p parent/child/child11
```

### 7、mv - Move

移动文件或修改文件名

```bash
# 将文件 test.log 重命名为 test1.txt
mv test.log test1.txt

# 将文件 log1.txt,log2.txt,log3.txt 移动到根的 test3 目录中
mv log1.txt log2.txt log3.txt /test3

# 将文件 file1 改名为 file2，如果 file2 已经存在，则询问是否覆盖
mv -i log1.txt log2.txt

# 移动当前文件夹下的所有文件到上一级目录
mv * ../
```

### 8、cp - Copy

将源文件复制至目标文件，或将多个源文件复制至目标目录。

参数：
- -i 提示
- -r 复制目录及目录内所有项目
- -a 复制的文件与原文件时间一样

### 9、cat - Concatenate and Print Files

用于在标准输出（监控器或屏幕）上查看文件内容

```bash
# 一次显示整个文件
cat filename

# 从键盘创建一个文件
cat > filename

# 合并为一个文件
cat file1 file2 > file
```

### 10、more

功能类似于 cat, more 会以一页一页的显示方便使用者逐页阅读，而最基本的指令就是按空白键（space）就往下一页显示，按 b 键就会往回（back）一页显示。

参数：
- +n      从笫 n 行开始显示
- -n       定义屏幕大小为n行
- +/pattern 在每个档案显示前搜寻该字串（pattern），然后从该字串前两行之后开始显示 
- -c       从顶部清屏，然后显示
- -d       提示“Press space to continue，’q’ to quit（按空格键继续，按q键退出）”，禁用响铃功能
- -l        忽略Ctrl+l（换页）字符
- -p       通过清除窗口而不是滚屏来对文件进行换页，与-c选项相似
- -s       把连续的多个空行显示为一行
- -u       把文件内容中的下画线去掉

常用操作命令：
- Enter    向下 n 行，需要定义。默认为 1 行
- Ctrl+F   向下滚动一屏
- 空格键  向下滚动一屏
- Ctrl+B  返回上一屏
- =       输出当前行的行号
- :f     输出文件名和当前行的行号
- V      调用vi编辑器
- !命令   调用Shell，并执行命令
- q       退出more

```bash
# 从第3行起的内容
more +3 text.txt

# 列出目录详细信息，每次显示5行
ls -l | more -5
```