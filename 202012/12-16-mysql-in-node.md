## 2020-12-16

## Node使用MySQL

### 查询数据的问题

```bash
SELECT * FROM products LEFT JOIN brand ON products.brand_id = brand.id;
```

通过上述查询语句查询出来的品牌信息，都在同一层级，但实际开发中，希望把品牌信息集合到json中

这个时候我们要用JSON_OBJECT， 将brand转成对象;

```bash
SELECT products.id as id, products.title as title, products.price as price, products.score as score,
  JSON_OBJECT('id', brand.id, 'name', brand.name, 'rank', brand.phoneRank, 'website', brand.website) as brand
FROM products LEFT JOIN brand ON products.brand_id = brand.id;
```

### 多对多转成数组

在多对多关系中，我们希望查询到的是一个数组：
- 比如一个学生的多门课程信息，应该是放到一个数组中的；
- 数组中存放的是课程信息的一个个对象；
- 这个时候我们要JSON_ARRAYAGG和JSON_OBJECT结合来使用；

```bash
SELECT stu.id, stu.name, stu.age,
  JSON_ARRAYAGG(JSON_OBJECT('id', cs.id, 'name', cs.name)) as courses
FROM students stu
LEFT JOIN students_select_courses ssc ON stu.id = ssc.student_id
LEFT JOIN courses cs ON ssc.course_id = cs.id
GROUP BY stu.id;
```

### 认识mysql2

在Node的代码中执行SQL语句来，可以借助于两个库：
- mysql：最早的Node连接MySQL的数据库驱动；
- mysql2：在mysql的基础之上，进行了很多的优化、改进；

mysql2兼容mysql的API，并且提供了一些附加功能：
- 更快/更好的性能；
- Prepared Statement（预编译语句）：
  - 提高性能：将创建的语句模块发送给MySQL，然后MySQL编译（解析、优化、转换）语句模块，并且存储它但是不执行，之后我们在真正执行时会给?提供实际的参数才会执行；就算多次执行，也只会编译一次，所以性能是更高的；
  - 防止SQL注入：之后传入的值不会像模块引擎那样就编译，那么一些SQL注入的内容不会被执行；or 1 = 1不会被执行；
- 支持Promise，所以我们可以使用async和await语法
- 等等....

#### 使用mysql2

安装mysql2
```bash
npm install mysql2
```

mysql2的使用过程如下：
- 第一步：创建连接（通过createConnection），并且获取连接对象；
- 第二步：执行SQL语句即可（通过query）；
```js
const mysql = require('mysql2')
// 创建连接
const connection = mysql.createConnection({
  host: 'localhost',
  database: 'databaseName',
  user: 'root',
  password: '123456'
})

// 执行SQL语句
connection.query('SELECT * FROM products', (err, results, fields) => {
  console.log(err)
  console.log(result)
  console.log(fields)
  connection.destroy()
})
```

#### Prepared Statement

Prepared Statement（预编译语句）：
- 提高性能：将创建的语句模块发送给MySQL，然后MySQL编译（解析、优化、转换）语句模块，并且存储它但是不执行，之后我们在真正执行时会给?提供实际的参数才会执行；就算多次执行，也只会编译一次，所以性能是更高的；
- 防止SQL注入：之后传入的值不会像模块引擎那样就编译，那么一些SQL注入的内容不会被执行；or 1 = 1不会被执行；
```js
const statement = 'SELECT * FROM products WHERE price > ? and brand = ?;';
connection.execute(statement, [1000, 'huawei'], (err, results) => {
  console.log(results)
})
```
>强调：如果再次执行该语句，它将会从LRU（Least Recently Used） Cache中获取获取，省略了编译statement的时间来提高性能。

#### Connection Pools

前面我们是创建了一个连接（connection），但是如果我们有多个请求的话，该连接很有可能正在被占用，那么我们是否需要每次一个请求都去创建一个新的连接呢？
- 事实上，mysql2给我们提供了连接池（connection pools）；
- 连接池可以在需要的时候自动创建连接，并且创建的连接不会被销毁，会放到连接池中，后续可以继续使用；
- 我们可以在创建连接池的时候设置LIMIT，也就是最大创建个数；

```js
const pool = mysql.createPool({
  host: 'localhost',
  database: 'databaseName',
  user: 'root',
  password: '12345678',
  connectionLimit: 5
})

const statement = `SELECT * FROM products WHERE price > ? and brand = ?;`;

pool.execute(statement, [1000, 'huawei'], (err, results) => {
  console.log(results);
})
```

#### Promise方式

目前在JavaScript开发中我们更习惯Promise和await、async的方式，mysql2同样是支持的：

```js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  database: 'databaseName',
  user: 'root',
  password: '12345678',
  connectionLimit: 5
})

const statement = `SELECT * FROM products WHERE price > ? and brand = ?;`;
pool.promise().execute(statement, [1000, 'huawei']).then(([results, fields]) => {
  console.log(results)
})
```

### 认识ORM

对象关系映射（英语：Object Relational Mapping，简称ORM，或O/RM，或O/R mapping），是一种程序设计的方案：
- 从效果上来讲，它提供了一个可在编程语言中，使用虚拟对象数据库的效果；
- 比如在Java开发中经常使用的ORM包括：Hibernate、MyBatis；

Node当中的ORM我们通常使用的是sequelize;
- Sequelize是用于Postgres，MySQL，MariaDB，SQLite和Microsoft SQL Server的基于Node.js 的ORM；
- 它支持非常多的功能；

如果我们希望将Sequelize和MySQL一起使用，那么我们需要先安装两个东西：
- mysql2：sequelize在操作mysql时使用的是mysql2；
- sequelize：使用它来让对象映射到表中；

```bash
npm install sequelize mysql2
```

#### Sequelize的使用

Sequelize的连接数据库：
- 第一步：创建一个Sequelize的对象，并且指定数据库、用户名、密码、数据库类型、主机地址等；
- 第二步：测试连接是否成功；

```js
const { Sequelize, DataTypes, Model, Op } = require('sequelize')

const sequelize = new Sequelize('database', 'user', 'password', {
  host: 'localhost',
  dialect: 'mysql'
})

sequelize.authenticate().then(() => {
  console.log('连接成功')
}).catch(err => {
  console.log('连接失败', err)
})
```

![sequelize]()
![sequelize2]()
![sequelize3]()