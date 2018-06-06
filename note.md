## UI 框架选型

* [iview/iview: A high quality UI Toolkit built on Vue\.js 2\.0](https://github.com/iview/iview)
* [vuetifyjs/vuetify: Material Component Framework for Vue\.js 2](https://github.com/vuetifyjs/vuetify)
* [Element \- A Desktop UI Toolkit for Web](http://element-cn.eleme.io/#/en-US/)
* [ElemeFE/mint\-ui: Mobile UI elements for Vue\.js](https://github.com/ElemeFE/mint-ui/)

## 布局技巧

[史上最全Html和CSS布局技巧\_慕课手记](https://www.imooc.com/article/2235)

## 一些 Vue 相关的技术文章

* 介绍 JSX 与 Vue 如何一起使用

[如何使用webpack在vue项目中写jsx语法 \- CSDN博客](https://blog.csdn.net/itkingone/article/details/77096895)

* Restful API 设计
[使用 Python 和 Flask 设计 RESTful API — Designing a RESTful API with Python and Flask 1\.0 documentation](http://www.pythondoc.com/flask-restful/first.html)

## Flask 教程
* [欢迎进入Flask大型教程项目！ — flask mega\-tutorial 1\.1documentation](http://www.pythondoc.com/flask-mega-tutorial/index.html)
* [欢迎使用 Flask — Flask 0\.10\.1 documentation](http://www.pythondoc.com/flask/index.html)
* [Flask进阶系列\(七\)–应用最佳实践 – 思诚之道](http://www.bjhee.com/flask-ad7.html)


* 使用 Vue-Resource 进行网络请求
[Vue\.js——vue\-resource全攻略 \- keepfool \- 博客园](http://www.cnblogs.com/keepfool/p/5657065.html)

* 父子组件通信 v-for and ref

* [vue2\.0父子组件间通信 \- 简书](https://www.jianshu.com/p/6389d424965f)
* [组件基础 — Vue\.js](https://cn.vuejs.org/v2/guide/components.html#logo)

* [JavaScript 时间与日期处理实战:你肯定被坑过 \- 最骚的就是你 \- 博客园](http://www.cnblogs.com/libin-1/p/6764747.html)

* https://www.cnblogs.com/xxcanghai/p/6124699.html  组件双向绑定
https://github.com/Zegendary/blog/issues/1
## 解决跨域问题

delete 一直失败，先设置了 flask 的 response，让所有的请求都支持跨域，具体通过参考
* [修改 Flask 的默认响应头实现跨域\(CORS\)支持 \| ZRONG's Blog](https://blog.zengrong.net/post/2615.html)
好文啊
但是还是提示删除失败，然后找 Vue 的原因，找到了。
* [javascript \- Request header field Access\-Control\-Allow\-Headers is not allowed by Access\-Control\-Allow\-Headers \- Stack Overflow](https://stackoverflow.com/questions/25727306/request-header-field-access-control-allow-headers-is-not-allowed-by-access-contr)

自定义 icon  https://blog.skl9.com/archives/312
https://blog.csdn.net/b376924098/article/details/78286880

## 技巧

filter 用法
```js
return this.todos.filter(todo => todo.completed)

//先删除
this.todos.splice(this.todos.findIndex(todo => todo.objectId === todoId),1)

if(editResult.completed){
  //如果已完成则追加到末尾
  this.todos.push(editResult)
}else{
  //如果未完成则追加到队头
  this.todos.unshift(editResult)
}

//打印对象
console.log("result is "+result+" and ---> "+JSON.stringify(item));

// 判断对象是不是 undi
const result = item === undefined
```

* 时间格式化
```javascript
getLocalTime(nS) {
  return new Date(nS).toLocaleString().replace(/:\d{1,2}$/,' ');
}
```

css 技巧
```
//顶部对其
vertical-align: top;

//文字居中
text-align: center;
line-height: 160px;
```

设置字体
```css
字重 也就是字体粗细 700 是粗体
font-weight: 400;
字体大小
font-size: 12px;
16px = 1em; 14px = 0.875em; 12px = 0.75em; 10px = 0.625em
````

## 布局参数
group padding 为 12dp
item bottom padding 为 8dp

## 样式
灰白字体颜色
color:#a8a8a8;
