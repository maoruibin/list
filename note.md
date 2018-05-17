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

* Flask 教程
[欢迎进入Flask大型教程项目！ — flask mega\-tutorial 1\.1 documentation](http://www.pythondoc.com/flask-mega-tutorial/index.html)

[欢迎使用 Flask — Flask 0\.10\.1 documentation](http://www.pythondoc.com/flask/index.html)

* 使用 Vue-Resource 进行网络请求

[Vue\.js——vue\-resource全攻略 \- keepfool \- 博客园](http://www.cnblogs.com/keepfool/p/5657065.html)

## 解决跨域问题

delete 一直失败，先设置了 flask 的 response，让所有的请求都支持跨域，具体通过参考
* [修改 Flask 的默认响应头实现跨域\(CORS\)支持 \| ZRONG's Blog](https://blog.zengrong.net/post/2615.html)
好文啊
但是还是提示删除失败，然后找 Vue 的原因，找到了。
* [javascript \- Request header field Access\-Control\-Allow\-Headers is not allowed by Access\-Control\-Allow\-Headers \- Stack Overflow](https://stackoverflow.com/questions/25727306/request-header-field-access-control-allow-headers-is-not-allowed-by-access-contr)

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

```
