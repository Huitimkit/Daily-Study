## 2021-05-01

## Mysql

### MySQL介绍及索引介绍

索引是什么？

索引就是帮助MySQL高效获取数据的**数据结构**，类似一本书的目录

索引的作用：
- ⽅方便便查找---检索
- 索引查询内容---覆盖索引
- 排序



一般来说索引本身也很⼤大，不不可能全部存储在内存中，因此索引往往是存储在磁盘上的⽂文件中

常见索引：

- 聚集索引

- 覆盖索引

- 组合索引

- 前缀索引

- 唯⼀索引
- 等

>默认都是使⽤用B+树结构组织（多路路搜索树，并不不⼀一定是⼆二叉的）的索引



索引分类：

- 单列索引
  - 普通索引：MySQL中基本索引类型，没有什么限制，允许在定义索引的列中插入重复值和空值，纯粹为了查询数据更更快⼀点。 
  - 唯⼀索引：索引列列中的值必须是唯⼀的，但是允许为空值。
  - 主键索引：是⼀一种特殊的唯⼀索引，不允许有空值。
- 组合索引
  - 在表中的多个字段组合上创建的索引
  - 组合索引的使⽤用，需要遵循最左前缀原则
  - 建议使⽤用组合索引代替单列列索引（主键索引除外）

- 全⽂文索引：只能在CHAR,VARCHAR,TEXT类型字段上使⽤用全⽂文索引。优先级最⾼高 先执⾏行行 不不会执⾏行行其他索引
- 空间索引

#### 创建索引

单列列索引之普通索引

```mys
CREATE INDEX index_name ON table(column(length)) ;
ALTER TABLE table_name ADD INDEX index_name (column(length)) ;
```

单列列索引之唯⼀一索引

```mysq
CREATE UNIQUE INDEX index_name ON table(column(length)) ;
alter table table_name add unique index index_name(column);
```

单列列索引之全⽂文索引

```mys
CREATE FULLTEXT INDEX index_name ON table(column(length)) ;
alter table table_name add fulltext index_name(column)
```

组合索引

```mys
ALTER TABLE article ADD INDEX index_titme_time (title(50),time(10)) ;
```

删除索引

```my
DROP INDEX index_name ON table
```

查看索引

```mys
SHOW INDEX FROM table_name \G
```













































