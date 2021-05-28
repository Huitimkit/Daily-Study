## 2020-09-05

## 项目设计

### React 实现 Todo List

- state数据结构设计
- 组件设计（拆分、组合）和组件通讯

`state数据结构设计`
- 用数据描述所有的内容
- 数据要结构化，易于程序操作（遍历、查找）
- 数据要可扩展，以便新增新的功能

`组件设计的思路和要点`
- 从功能上拆分层次
- 尽量让组件原子化
- 容器组件（只管理数据）和UI组件（只显示视图）

`index.js`
```js
import React from 'react'
import List from './List'
import InputItem from './InputItem'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [
                {
                    id: 1,
                    title: '标题1',
                    completed: false
                },
                {
                    id: 2,
                    title: '标题2',
                    completed: false
                },
                {
                    id: 3,
                    title: '标题3',
                    completed: false
                }
            ]
        }
    }
    render() {
        return <div>
            <InputItem addItem={this.addItem}/>
            <List
                list={this.state.list}
                deleteItem={this.deleteItem}
                toggleCompleted={this.toggleCompleted}
            />
        </div>
    }
    // 新增一项
    addItem = (title) => {
        const list = this.state.list
        this.setState({
            // 使用 concat 返回不可变值
            list: list.concat({
                id: Math.random().toString().slice(-5), // id 累加
                title,
                completed: false
            })
        })
    }
    // 删除一项
    deleteItem = (id) => {
        this.setState({
            // 使用 filter 返回不可变值
            list: this.state.list.filter(item => item.id !== id)
        })
    }
    // 切换完成状态
    toggleCompleted = (id) => {
        this.setState({
            // 使用 map 返回不可变值
            list: this.state.list.map(item => {
                const completed = item.id === id
                    ? !item.completed
                    : item.completed // 切换完成状态
                // 返回新对象
                return {
                    ...item,
                    completed
                }
            })
        })
    }
}

export default App
```

`List.js`
```js
import React from 'react'
import ListItem from './ListItem'

function List({ list = [], deleteItem, toggleCompleted }) {
    return <div>
        {list.map(item => <ListItem
            item={item}
            key={item.id}
            deleteItem={deleteItem}
            toggleCompleted={toggleCompleted}
        />)}
    </div>
}

export default List
```

`ListItem.js`
```js
import React from 'react'
import CheckBox from './UI/CheckBox'

class ListItem extends React.Component {
    render() {
        const { item } = this.props

        return <div style={{ marginTop: '10px' }}>
            <CheckBox onChange={this.completedChangeHandler}/>
            <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                {item.title}
            </span>
            <button onClick={this.deleteHandler}>删除</button>
        </div>
    }
    completedChangeHandler = (checked) => {
        console.log('checked', checked)
        const { item, toggleCompleted } = this.props
        toggleCompleted(item.id)
    }
    deleteHandler = () => {
        const { item, deleteItem } = this.props
        deleteItem(item.id)
    }
}

export default ListItem
```

`CheckBox.js`
```js
import React from 'react'

class CheckBox extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: false
        }
    }
    render() {
        return <input type="checkbox" checked={this.state.checked} onChange={this.onCheckboxChange}/>
    }
    onCheckboxChange = () => {
        const newVal = !this.state.checked
        this.setState({
            checked: newVal
        })

        // 传给父组件
        this.props.onChange(newVal)
    }
}

export default CheckBox
```

`InputItem.js`
```js
import React from 'react'
import Input from './UI/Input'

class InputItem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ''
        }
    }
    render() {
        return <div>
            <Input value={this.state.title} onChange={this.changeHandler}/>
            <button onClick={this.clickHandler}>新增</button>
        </div>
    }
    changeHandler = (newTitle) => {
        this.setState({
            title: newTitle
        })
    }
    clickHandler = () => {
        const { addItem } = this.props
        addItem(this.state.title)

        this.setState({
            title: ''
        })
    }
}

export default InputItem
```

`input.js`
```js
import React from 'react'

class Input extends React.Component {
    render() {
        return <input value={this.props.value} onChange={this.onChange}/>
    }
    onChange = (e) => {
        // 传给父组件
        const newVal = e.target.value
        this.props.onChange(newVal)
    }
}

export default Input
```

### Vue实现购物车

data数据结构设计和组件设计原则同React相似

`App.vue`
```vue
<template>
  <div id="app">
    <h1>Shopping Cart Example</h1>
    <hr>
    <h2>Products</h2>
    <ProductList/>
    <hr>
    <ShoppingCart/>
  </div>
</template>

<script>
import ProductList from './ProductList.vue'
import ShoppingCart from './ShoppingCart.vue'

export default {
  components: { ProductList, ShoppingCart }
}
</script>
```

`ProductList.vue`
```vue
<template>
  <ul>
    <li
      v-for="product in products"
      :key="product.id">
      {{ product.title }} - {{ product.price | currency }}

      （inventory: {{product.inventory}}）<!-- 这里可以自己加一下显示库存 -->
      <br>
      <button
        :disabled="!product.inventory"
        @click="addProductToCart(product)">
        Add to cart
      </button>
    </li>
  </ul>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  computed: mapState({
    // 获取所有商品
    products: state => state.products.all
  }),
  methods: mapActions('cart', [
    // 添加商品到购物车
    'addProductToCart'
  ]),
  created () {
    // 加载所有商品
    this.$store.dispatch('products/getAllProducts')
  }
}
</script>

```
`ShoppingCart.vue`
```vue
<template>
  <div class="cart">
    <h2>Your Cart</h2>
    <p v-show="!products.length"><i>Please add some products to cart.</i></p>
    <ul>
      <li
        v-for="product in products"
        :key="product.id">
        {{ product.title }} - {{ product.price | currency }} x {{ product.quantity }}
      </li>
    </ul>
    <p>Total: {{ total | currency }}</p>
    <p><button :disabled="!products.length" @click="checkout(products)">Checkout</button></p>
    <p v-show="checkoutStatus">Checkout {{ checkoutStatus }}.</p>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      // 结账的状态
      checkoutStatus: state => state.cart.checkoutStatus
    }),
    ...mapGetters('cart', {
      products: 'cartProducts', // 购物车的商品
      total: 'cartTotalPrice' // 购物车商品的总价格
    })
  },
  methods: {
    // 结账
    checkout (products) {
      this.$store.dispatch('cart/checkout', products)
    }
  }
}
</script>
```


