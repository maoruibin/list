<template>
	<div id="todoContainer">

    <Todo
    v-for="group in groups"
    :key="group.objectId"
    :group="group"
    :user="user"
    />

  </div>
</template>

<script >
import Todo from './todo.vue'


// let host = '0.0.0.0:3000'
let host = 'waishuo.leanapp.cn'

export default{
	data(){
		return{
      groups:[],
			user:{}
		}
	},
	components: {
		Todo
	},
  methods:{
    addGroup:function(event){
      this.groups.push({"name":"临时"})
    }
  },
  mounted:function(){
    this.user = JSON.parse(localStorage.getItem("user"))
    if(!this.user){
      return
    }
    const apiGroup = "http://"+host+"/todos/api/v1.0/group/"+this.user.id
    this.$http.get(apiGroup).then(response => {
        this.groups = response.body.results
        console.log("len is "+this.groups.length);
      }, response => {});

    },
}
</script>


<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>
    #todoContainer {
      width: 100%;
      height: 500px;
      padding:10px;
      white-space: nowrap;
      overflow: hidden;
      overflow-x: auto;
      -webkit-backface-visibility: hidden;
      -webkit-perspective: 1000;
      -webkit-overflow-scrolling: touch; /* 2 */
      text-align: justify; /* 3 */
      &::-webkit-scrollbar {
          display: block;
      }
    }

    #todoContainer > div {
      width: 30%;
      height: 480px;
      background-color: #eff1f3;
      border:1px solid #ccc;
      border-radius:6px;
      display: inline-block;
    }


</style>
