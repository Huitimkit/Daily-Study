## 2020-09-03

## React

### 基础语法

```jsx
import React from "react";
import "./style.css";
import List from "../List";

class JSXBaseDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "双越",
      imgUrl: "https://img1.mukewang.com/5a9fc8070001a82402060220-140-140.jpg",
      flag: true,
    };
  }
  render() {
    // // 获取变量 插值
    // const pElem = <p>{this.state.name}</p>
    // return pElem

    // // 表达式
    // const exprElem = <p>{this.state.flag ? 'yes' : 'no'}</p>
    // return exprElem

    // // 子元素
    // const imgElem = <div>
    //     <p>我的头像</p>
    //     <img src="xxxx.png"/>
    //     <img src={this.state.imgUrl}/>
    // </div>
    // return imgElem

    // // class
    // const classElem = <p className="title">设置 css class</p>
    // return classElem

    // // style
    // const styleData = { fontSize: '30px',  color: 'blue' }
    // const styleElem = <p style={styleData}>设置 style</p>
    // // 内联写法，注意 {{ 和 }}
    // // const styleElem = <p style={{ fontSize: '30px',  color: 'blue' }}>设置 style</p>
    // return styleElem

    // 原生 html
    const rawHtml = "<span>富文本内容<i>斜体</i><b>加粗</b></span>";
    const rawHtmlData = {
      __html: rawHtml, // 注意，必须是这种格式
    };
    const rawHtmlElem = (
      <div>
        <p dangerouslySetInnerHTML={rawHtmlData}></p>
        <p>{rawHtml}</p>
      </div>
    );
    return rawHtmlElem;

    // // 加载组件
    // const componentElem = <div>
    //     <p>JSX 中加载一个组件</p>
    //     <hr/>
    //     <List/>
    // </div>
    // return componentElem
  }
}

export default JSXBaseDemo;
```

#### 列表

```jsx
import React from "react";

class ListDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          id: "id-1",
          title: "标题1",
        },
        {
          id: "id-2",
          title: "标题2",
        },
        {
          id: "id-3",
          title: "标题3",
        },
      ],
    };
  }
  render() {
    return (
      <ul>
        {
          /* vue v-for */
          this.state.list.map((item, index) => {
            // 这里的 key 和 Vue 的 key 类似，必填，不能是 index 或 random
            return (
              <li key={item.id}>
                index {index}; id {item.id}; title {item.title}
              </li>
            );
          })
        }
      </ul>
    );
  }
}

export default ListDemo;
```

#### 条件

```jsx
import React from "react";
import "./style.css";

class ConditionDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "black",
    };
  }
  render() {
    const blackBtn = <button className="btn-black">black btn</button>;
    const whiteBtn = <button className="btn-white">white btn</button>;

    // // if else
    // if (this.state.theme === 'black') {
    //     return blackBtn
    // } else {
    //     return whiteBtn
    // }

    // // 三元运算符
    // return <div>
    //     { this.state.theme === 'black' ? blackBtn : whiteBtn }
    // </div>

    // &&
    return <div>{this.state.theme === "black" && blackBtn}</div>;
  }
}

export default ConditionDemo;
```

#### 事件

```jsx
import React from "react";

class EventDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "zhangsan",
      list: [
        {
          id: "id-1",
          title: "标题1",
        },
        {
          id: "id-2",
          title: "标题2",
        },
        {
          id: "id-3",
          title: "标题3",
        },
      ],
    };

    // 修改方法的 this 指向
    this.clickHandler1 = this.clickHandler1.bind(this);
  }
  render() {
    // // this - 使用 bind
    // return <p onClick={this.clickHandler1}>
    //     {this.state.name}
    // </p>

    // // this - 使用静态方法
    // return <p onClick={this.clickHandler2}>
    //     clickHandler2 {this.state.name}
    // </p>

    // // event
    // return <a href="https://imooc.com/" onClick={this.clickHandler3}>
    //     click me
    // </a>

    // 传递参数 - 用 bind(this, a, b)
    return (
      <ul>
        {this.state.list.map((item, index) => {
          return (
            <li
              key={item.id}
              onClick={this.clickHandler4.bind(this, item.id, item.title)}
            >
              index {index}; title {item.title}
            </li>
          );
        })}
      </ul>
    );
  }
  clickHandler1() {
    // console.log('this....', this) // this 默认是 undefined
    this.setState({
      name: "lisi",
    });
  }
  // 静态方法，this 指向当前实例
  clickHandler2 = () => {
    this.setState({
      name: "lisi",
    });
  };
  // 获取 event
  clickHandler3 = (event) => {
    event.preventDefault(); // 阻止默认行为
    event.stopPropagation(); // 阻止冒泡
    console.log("target", event.target); // 指向当前元素，即当前元素触发
    console.log("current target", event.currentTarget); // 指向当前元素，假象！！！

    // 注意，event 其实是 React 封装的。可以看 __proto__.constructor 是 SyntheticEvent 组合事件
    console.log("event", event); // 不是原生的 Event ，原生的 MouseEvent
    console.log("event.__proto__.constructor", event.__proto__.constructor);

    // 原生 event 如下。其 __proto__.constructor 是 MouseEvent
    console.log("nativeEvent", event.nativeEvent);
    console.log("nativeEvent target", event.nativeEvent.target); // 指向当前元素，即当前元素触发
    console.log("nativeEvent current target", event.nativeEvent.currentTarget); // 指向 document ！！！

    // 1. event 是 SyntheticEvent ，模拟出来 DOM 事件所有能力
    // 2. event.nativeEvent 是原生事件对象
    // 3. 所有的事件，都被挂载到 document 上
    // 4. 和 DOM 事件不一样，和 Vue 事件也不一样
  };
  // 传递参数
  clickHandler4(id, title, event) {
    console.log(id, title);
    console.log("event", event); // 最后追加一个参数，即可接收 event
  }
}

export default EventDemo;
```

#### 表单

```jsx
import React from "react";

class FormDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "双越",
      info: "个人信息",
      city: "beijing",
      flag: true,
      gender: "male",
    };
  }
  render() {
    // // 受控组件（非受控组件，后面再讲）
    // return <div>
    //     <p>{this.state.name}</p>
    //     <label htmlFor="inputName">姓名：</label> {/* 用 htmlFor 代替 for */}
    //     <input id="inputName" value={this.state.name} onChange={this.onInputChange}/>
    // </div>

    // textarea - 使用 value
    return (
      <div>
        <textarea value={this.state.info} onChange={this.onTextareaChange} />
        <p>{this.state.info}</p>
      </div>
    );

    // // select - 使用 value
    // return <div>
    //     <select value={this.state.city} onChange={this.onSelectChange}>
    //         <option value="beijing">北京</option>
    //         <option value="shanghai">上海</option>
    //         <option value="shenzhen">深圳</option>
    //     </select>
    //     <p>{this.state.city}</p>
    // </div>

    // // checkbox
    // return <div>
    //     <input type="checkbox" checked={this.state.flag} onChange={this.onCheckboxChange}/>
    //     <p>{this.state.flag.toString()}</p>
    // </div>

    // // radio
    // return <div>
    //     male <input type="radio" name="gender" value="male" checked={this.state.gender === 'male'} onChange={this.onRadioChange}/>
    //     female <input type="radio" name="gender" value="female" checked={this.state.gender === 'female'} onChange={this.onRadioChange}/>
    //     <p>{this.state.gender}</p>
    // </div>

    // 非受控组件 - 后面再讲
  }
  onInputChange = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  onTextareaChange = (e) => {
    this.setState({
      info: e.target.value,
    });
  };
  onSelectChange = (e) => {
    this.setState({
      city: e.target.value,
    });
  };
  onCheckboxChange = () => {
    this.setState({
      flag: !this.state.flag,
    });
  };
  onRadioChange = (e) => {
    this.setState({
      gender: e.target.value,
    });
  };
}

export default FormDemo;
```

#### setState

- 不可变值，即不能提前修改 state 的属性值，需要改变时再修改即在 setState 方法中完成
- 可能是异步更新
- 可能会被合并

```jsx
import React from "react";

// 函数组件（后面会讲），默认没有 state
class StateDemo extends React.Component {
  constructor(props) {
    super(props);

    // 第一，state 要在构造函数中定义
    this.state = {
      count: 0,
    };
  }
  render() {
    return (
      <div>
        <p>{this.state.count}</p>
        <button onClick={this.increase}>累加</button>
      </div>
    );
  }
  increase = () => {
    // // 第二，不要直接修改 state ，使用不可变值 ----------------------------
    // // this.state.count++ // 错误
    // this.setState({
    //     count: this.state.count + 1 // SCU
    // })
    // 操作数组、对象的的常用形式

    // 第三，setState 可能是异步更新（有可能是同步更新） ----------------------------

    // this.setState({
    //     count: this.state.count + 1
    // }, () => {
    //     // 联想 Vue $nextTick - DOM
    //     console.log('count by callback', this.state.count) // 回调函数中可以拿到最新的 state
    // })
    // console.log('count', this.state.count) // 同步的，拿不到最新值

    // // setTimeout 中 setState 是同步的
    // setTimeout(() => {
    //     this.setState({
    //         count: this.state.count + 1
    //     })
    //     console.log('count in setTimeout', this.state.count)
    // }, 0)

    // 自己定义的 DOM 事件，setState 是同步的。在 componentDidMount 中

    // 第四，state 异步更新的话，更新前会被合并 ----------------------------

    // // 传入对象，会被合并（类似 Object.assign ）。执行结果只一次 +1
    // this.setState({
    //     count: this.state.count + 1
    // })
    // this.setState({
    //     count: this.state.count + 1
    // })
    // this.setState({
    //     count: this.state.count + 1
    // })

    // 传入函数，不会被合并。执行结果是 +3
    this.setState((prevState, props) => {
      return {
        count: prevState.count + 1,
      };
    });
    this.setState((prevState, props) => {
      return {
        count: prevState.count + 1,
      };
    });
    this.setState((prevState, props) => {
      return {
        count: prevState.count + 1,
      };
    });
  };
  // bodyClickHandler = () => {
  //     this.setState({
  //         count: this.state.count + 1
  //     })
  //     console.log('count in body event', this.state.count)
  // }
  // componentDidMount() {
  //     // 自己定义的 DOM 事件，setState 是同步的
  //     document.body.addEventListener('click', this.bodyClickHandler)
  // }
  // componentWillUnmount() {
  //     // 及时销毁自定义 DOM 事件
  //     document.body.removeEventListener('click', this.bodyClickHandler)
  //     // clearTimeout
  // }
}

export default StateDemo;

// -------------------------- 我是分割线 -----------------------------

// // 不可变值（函数式编程，纯函数） - 数组
// const list5Copy = this.state.list5.slice()
// list5Copy.splice(2, 0, 'a') // 中间插入/删除
// this.setState({
//     list1: this.state.list1.concat(100), // 追加
//     list2: [...this.state.list2, 100], // 追加
//     list3: this.state.list3.slice(0, 3), // 截取
//     list4: this.state.list4.filter(item => item > 100), // 筛选
//     list5: list5Copy // 其他操作
// })
// // 注意，不能直接对 this.state.list 进行 push pop splice 等，这样违反不可变值

// // 不可变值 - 对象
// this.setState({
//     obj1: Object.assign({}, this.state.obj1, {a: 100}),
//     obj2: {...this.state.obj2, a: 100}
// })
// // 注意，不能直接对 this.state.obj 进行属性设置，这样违反不可变值
```

```jsx

```

#### 组件生命周期

![http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/](http://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)

#### 父子组件通讯

```jsx
/**
 * @description 演示 props 和事件
 * @author 双越老师
 */

import React from "react";
import PropTypes from "prop-types";

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
    };
  }
  render() {
    return (
      <div>
        <input value={this.state.title} onChange={this.onTitleChange} />
        <button onClick={this.onSubmit}>提交</button>
      </div>
    );
  }
  onTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };
  onSubmit = () => {
    const { submitTitle } = this.props;
    submitTitle(this.state.title); // 'abc'

    this.setState({
      title: "",
    });
  };
}
// props 类型检查
Input.propTypes = {
  submitTitle: PropTypes.func.isRequired,
};

class List extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { list } = this.props;

    return (
      <ul>
        {list.map((item, index) => {
          return (
            <li key={item.id}>
              <span>{item.title}</span>
            </li>
          );
        })}
      </ul>
    );
  }
}
// props 类型检查
List.propTypes = {
  list: PropTypes.arrayOf(PropTypes.object).isRequired,
};

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <p>
        {this.props.text}
        {this.props.length}
      </p>
    );
  }
  componentDidUpdate() {
    console.log("footer did update");
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.text !== this.props.text ||
      nextProps.length !== this.props.length
    ) {
      return true; // 可以渲染
    }
    return false; // 不重复渲染
  }

  // React 默认：父组件有更新，子组件则无条件也更新！！！
  // 性能优化对于 React 更加重要！
  // SCU 一定要每次都用吗？—— 需要的时候才优化
}

class TodoListDemo extends React.Component {
  constructor(props) {
    super(props);
    // 状态（数据）提升
    this.state = {
      list: [
        {
          id: "id-1",
          title: "标题1",
        },
        {
          id: "id-2",
          title: "标题2",
        },
        {
          id: "id-3",
          title: "标题3",
        },
      ],
      footerInfo: "底部文字",
    };
  }
  render() {
    return (
      <div>
        <Input submitTitle={this.onSubmitTitle} />
        <List list={this.state.list} />
        <Footer text={this.state.footerInfo} length={this.state.list.length} />
      </div>
    );
  }
  onSubmitTitle = (title) => {
    this.setState({
      list: this.state.list.concat({
        id: `id-${Date.now()}`,
        title,
      }),
    });
  };
}

export default TodoListDemo;
```

### 高级特性

#### 函数组件

- 纯函数，输入 props，输出 jsx
- 没有实例，没有生命周期，没有 state
- 不能扩展其它方法

```js
function List(props) {
  const { list } = this.props;

  return (
    <ul>
      {list.map((item, i) => {
        return <li key="item.id">{item.title}</li>;
      })}
    </ul>
  );
}
```

#### 非受控组件

```jsx
import React from "react";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "双越",
      flag: true,
    };
    this.nameInputRef = React.createRef(); // 创建 ref
    this.fileInputRef = React.createRef();
  }
  render() {
    // // input defaultValue
    // return <div>
    //     {/* 使用 defaultValue 而不是 value ，使用 ref */}
    //     <input defaultValue={this.state.name} ref={this.nameInputRef}/>
    //     {/* state 并不会随着改变 */}
    //     <span>state.name: {this.state.name}</span>
    //     <br/>
    //     <button onClick={this.alertName}>alert name</button>
    // </div>

    // // checkbox defaultChecked
    // return <div>
    //     <input
    //         type="checkbox"
    //         defaultChecked={this.state.flag}
    //     />
    // </div>

    // file
    return (
      <div>
        <input type="file" ref={this.fileInputRef} />
        <button onClick={this.alertFile}>alert file</button>
      </div>
    );
  }
  alertName = () => {
    const elem = this.nameInputRef.current; // 通过 ref 获取 DOM 节点
    alert(elem.value); // 不是 this.state.name
  };
  alertFile = () => {
    const elem = this.fileInputRef.current; // 通过 ref 获取 DOM 节点
    alert(elem.files[0].name);
  };
}

export default App;
```

非受控组件使用场景

- 必须手动操作 DOM 元素，setState 实现不了
- 文件上传<input type="file">
- 某些富文本编辑器，需要传入 DOM 元素
- 优先使用受控组件，符合 React 设计原则
- 必须操作 DOM 时，再使用非受控组件

#### portals

使用场景

- 组件会默认按照既定层级渲染
- portals 可以让组件渲染到父组件以外
- overflow: hidden
- 父组件 z-index 值太小
- fixed 需要放在 body 第一层级

```jsx
import React from "react";
import ReactDOM from "react-dom";
import "./style.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    // // 正常渲染
    // return <div className="modal">
    //     {this.props.children} {/* vue slot */}
    // </div>

    // 使用 Portals 渲染到 body 上。
    // fixed 元素要放在 body 上，有更好的浏览器兼容性。
    return ReactDOM.createPortal(
      <div className="modal">{this.props.children}</div>,
      document.body // DOM 节点
    );
  }
}

export default App;
```

#### context

使用场景

- 公共信息的传递（如主题、语言）

```jsx
import React from "react";

// 创建 Context 填入默认值（任何一个 js 变量）
const ThemeContext = React.createContext("light");

// 底层组件 - 函数是组件
function ThemeLink(props) {
  // const theme = this.context // 会报错。函数式组件没有实例，即没有 this

  // 函数式组件可以使用 Consumer
  return (
    <ThemeContext.Consumer>
      {(value) => <p>link's theme is {value}</p>}
    </ThemeContext.Consumer>
  );
}

// 底层组件 - class 组件
class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // static contextType = ThemeContext // 也可以用 ThemedButton.contextType = ThemeContext
  render() {
    const theme = this.context; // React 会往上找到最近的 theme Provider，然后使用它的值。
    return (
      <div>
        <p>button's theme is {theme}</p>
      </div>
    );
  }
}
ThemedButton.contextType = ThemeContext; // 指定 contextType 读取当前的 theme context。

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar(props) {
  return (
    <div>
      <ThemedButton />
      <ThemeLink />
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: "light",
    };
  }
  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <Toolbar />
        <hr />
        <button onClick={this.changeTheme}>change theme</button>
      </ThemeContext.Provider>
    );
  }
  changeTheme = () => {
    this.setState({
      theme: this.state.theme === "light" ? "dark" : "light",
    });
  };
}

export default App;
```

#### 异步组件

- import()
- React.lazy()
- React.Suspense()

```jsx
import React from "react";

const ContextDemo = React.lazy(() => import("./ContextDemo"));

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <p>引入一个动态组件</p>
        <hr />
        <React.Suspense fallback={<div>Loading...</div>}>
          <ContextDemo />
        </React.Suspense>
      </div>
    );

    // 1. 强制刷新，可看到 loading （看不到就限制一下 chrome 网速）
    // 2. 看 network 的 js 加载
  }
}

export default App;
```

#### 性能优化

- shouldComponentUpdate(SCU)，默认返回 true
- PureComponent 和 React.memo
- 不可以变值 immutalble.js

SCU 总结

- 默认返回 true，即 React 默认重新渲染所有子组件
- 必须配合“不可变值”一起使用
- 可先不用 SCU，有性能问题时再考虑使用

PureComponent 和 memo

- PurcComponent，在 SCU 中实现了浅比较
- memo，函数组件中的 PureComponent
- 浅比较适用大部分情况（尽量不做深度比较）

```jsx
// 在定义组件的时候继承React.PureComponnent
class List extends React.PureComponent {
  constructor(props) {
    super(props);
  }
}
```

```js
function MyComponent(props) {}

function areEqual(prevProps, nextProps) {
  /*
    如果把nextProps传入render方法返回的结果与将
    prevProps传入render方法的返回结果一致则返回true，
    否则返回false
  */
}

export default React.memo(MyComponent, areEqual);
```

immutable.js

- 彻底拥抱“不可变值”
- 基于共享数据（不是深拷贝），速度好

```js
const map1 = Immutable.map({ a: 1, b: 2, c: 3 });
const map2 = map1.set("b", 50);
map1.get("b"); // 2
map2.get("b"); // 50
```

#### 组件公共逻辑抽离

- mixin，已被 react 启用
- 高阶组件 HOC
- Render Props

```jsx
import React from "react";

// 高阶组件
const withMouse = (Component) => {
  class withMouseComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = { x: 0, y: 0 };
    }

    handleMouseMove = (event) => {
      this.setState({
        x: event.clientX,
        y: event.clientY,
      });
    };

    render() {
      return (
        <div style={{ height: "500px" }} onMouseMove={this.handleMouseMove}>
          {/* 1. 透传所有 props 2. 增加 mouse 属性 */}
          <Component {...this.props} mouse={this.state} />
        </div>
      );
    }
  }
  return withMouseComponent;
};

const App = (props) => {
  const a = props.a;
  const { x, y } = props.mouse; // 接收 mouse 属性
  return (
    <div style={{ height: "500px" }}>
      <h1>
        The mouse position is ({x}, {y})
      </h1>
      <p>{a}</p>
    </div>
  );
};

export default withMouse(App); // 返回高阶函数
```

render props

```jsx
import React from "react";
import PropTypes from "prop-types";

class Mouse extends React.Component {
  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div style={{ height: "500px" }} onMouseMove={this.handleMouseMove}>
        {/* 将当前 state 作为 props ，传递给 render （render 是一个函数组件） */}
        {this.props.render(this.state)}
      </div>
    );
  }
}
Mouse.propTypes = {
  render: PropTypes.func.isRequired, // 必须接收一个 render 属性，而且是函数
};

const App = (props) => (
  <div style={{ height: "500px" }}>
    <p>{props.a}</p>
    <Mouse
      render={
        /* render 是一个函数组件 */
        ({ x, y }) => (
          <h1>
            The mouse position is ({x}, {y})
          </h1>
        )
      }
    />
  </div>
);

/**
 * 即，定义了 Mouse 组件，只有获取 x y 的能力。
 * 至于 Mouse 组件如何渲染，App 说了算，通过 render prop 的方式告诉 Mouse 。
 */

export default App;
```

### redux

#### 单项数据流概述

- dispatch(action)
- reducer -> newState
- subscibe 触发通知

### react 原理

#### 函数式编程

- 一种编程范式，概念比较多
- 纯函数
- 不可变值

#### vdom 和 diff

- h 函数
- vnode 数据结构
- patch 函数

#### JSX 本质是什么

通过是 React.createElement 生成 vnode 节点，React.createElement 方法可以接受三个以上的函数，第一参数可以接受标签名或者组件名，第二个参数接受的是一些属性值，包括 style，等等，第三个可以是数组也可以是多个参数，表示包含的子组件

- React.createElement 即 h 函数，返回 vnode
- 第一个参数，可能是组件，也可能是 html tag
- 区分组件和 html tag，首字母必须大写（React 规定）

#### React 合成事件

- 所有事件挂载到 document 上
- event 不是原生的，是 SynthneticEvent 合成事件对象，模拟出 DOM 事件所有能力，event.nativeEvent 才是原生的事件对象
- 和 Vue 事件不同，和 DOM 事件不同

为何要合成事件机制

- 更好的兼容性和跨平台
- 挂载到 document 上，减少内存消耗，避免频繁解绑
- 方便事件的统一管理（如事务机制）

#### setState 和 batchUpdate

核心要点

- setState 主流程
- batchUpdate 机制
- transaction（事务）机制

setState 主流程
![https://user-gold-cdn.xitu.io/2020/4/8/17155603ee2fa1bb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/4/8/17155603ee2fa1bb?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

setState 异步还是同步？

- setState 无所谓异步还是同步
- 主要看是否能命中 batchUpdate 机制
- 判断 isBatchUpdate

哪些能命中 batchUpdate 机制

- 生命周期（和它调用的函数）
- React 中注册的事件（和它调用的函数）
- React 可以管理的入口

哪些不能命中 batchUpdate 机制

- setTimeout、setInterval 等（和它调用的函数）
- 自定义 DOM 事件（和它调用的函数）
- React 管不到的入口

transaction 事务机制
![https://user-gold-cdn.xitu.io/2020/4/8/17155603f38e84d5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1](https://user-gold-cdn.xitu.io/2020/4/8/17155603f38e84d5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

`Fiber如何优化性能`

更新的两个阶段

- 上述 patch 被拆分为两个阶段：
- reconciliation 阶段-执行 diff 算法，纯 JS 计算
- commit 阶段-将 diff 结果渲染 DOM

可能存在的性能问题

- JS 是单线程，且和 DOM 渲染共用一个线程
- 当组件足够复杂，组件更新时计算和渲染都压力大
- 同时再有 DOM 操作（动画、鼠标拖拽等），将卡顿

解决方案 Fiber

- 将 reconciliation 阶段进行任务拆分（commit 无法拆分）
- DOM 需要渲染时暂停，空闲时间恢复
- window.requestIdleRequest 可以判断是否渲染暂停，有兼容性问题，没有这个 api 则照常执行，会卡顿

#### React 真题

组件之间如何通讯？

- 父子组件 props
- 自定义事件
- Redux 和 Context

JSX 本质是什么？

- createElement
- 执行返回 vnode

Context 是什么，如何应用

- 父组件，向其下所有子孙组件传递信息
- 如一些简单的公共信息：主题色，语言等
- 复杂公共信息，请用 redux

shouldComponentUpdate 用途

- 性能优化
- 配合“不可变值”一起使用，否则会出错

redux 单项数据流

setState 场景题

什么是纯函数

- 返回一个新值，没有副作用（不会“偷偷”修改其它值）
- 重点：不可变值
- 如 arr1 = arr.slice()

React 生命周期

- 单个组件生命周期
- 父子组件生命周期
- 注意 SCU

React 发起 ajax 应该放在哪个生命周期

- 同 Vue
- componentDidMount

渲染列表，为何使用 key

- 同 vue，必须用 key，且不能是 index 和 random
- diff 算法中通过 tag 和 key 来判断，是否是 sameState
- 减少渲染次数，提升渲染性能

函数组件和 class 组件的区别

- 纯函数，输入 props，输出 JSX
- 没有实例，没有生命周期，没有 state
- 不能扩展其他方法

什么是受控组件？

- 表单的值，受 state 控制
- 需要自行监听 onChange，更新 state
- 对比非受控组件

何时使用异步组件

- 同 Vue
- 加载大组件
- 路由懒加载

多个组件有公共逻辑，如何抽离

- 高阶组件
- Render Props
- mixin 已被 React 废弃

Redux 如何进行异步请求

- 使用异步 action
- 使用 redux-thunk

react-router 如何配置懒加载

```jsx
import { Browser as Router, Route, Switch } from 'react-route-dom'
import React, { Suspense, lazy } from 'react'

const Home = lazy(() => import('./routes/home'))
const About = lazy(() => import('./routes/about'))

const App = () => {
  <Router>
    <Suspense fallback={<div>loading...</div>}>
      <Switch>
        <Router exact path="/" component={Home}>
        <Router path="/about" component={About}>
      </Switch>
    </Suspense>
  </Router>
}
```

PureComponent 有何区别

- 实现浅比较 shouldComponentUpdate
- 优化性能
- 但要结合不可变值使用

React 事件和 DOM 事件的区别

- 所有事件都挂载到 document 上
- event 不是原生的，是 SyntheticEvent 合成事件对象
- dispatchEvent

React 性能优化

- 渲染列表时加 KEY
- 自定义事件、DOM 事件及时销毁
- 合理使用异步组件
- 减少函数 bind this 的次数
- 合理使用 SCU PureComponent 和 memo
- 合理使用 Immutable.js
- 前端通用性能优化，如图片懒加载
- 使用 SSR

React 和 Vue 的区别

- React 使用 JSX 拥抱 JS，Vue 使用模板拥抱 html
- React 函数式编程，Vue 声明式编程
- React 更多需要功能需要自己开发，Vue 封装的更方便
- 具体选择，结合团队业务来选
