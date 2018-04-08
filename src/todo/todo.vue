<template>
	<div>
		<section class="real-app">
			<div class="box">
				<input
				type="text"
				class="add-input"
				autofocus="autofocus"
				placeholder="今日要做什么"
				@keyup.enter="addTodo"/>

				<select
				class="select-group"
				v-model="selectGroup">
				  	<option
				  		v-for="item in groups"
				  		v-bind:value="item.objectId"
				  		@click="changeGroup(item.objectId)"
				  		>
				  		{{item.name}}
					</option>
				</select>

			</div>

			<Item
				:todo="todo"
				v-for="todo in filterTodos"
				:key="todo.objectId"
				@delete="deleteItem"
			/>
			<Tabs
				:filter="filter"
				:todos="todos"
				@toggle="toggleFilter"
				@clear="clearAll"
			/>
		</section>
	</div>


</template>
<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
let id = 0
let host = '0.0.0.0:3000'
export default{
	data(){
		return{
			// 容纳 TODO 的集合
			todos:[],
			// 过滤器
			filter:'all',
			groups:[],
			selectGroup:''
		}
	},

	components:{
		Item,
		Tabs
	},
	mounted:function(){
		//获取分组信息
		const apiGroup = "http://"+host+"/todos/api/v1/group"
        this.$http.get(apiGroup).then(response => {

		    this.groups = response.body.results

		  }, response => {

		});
    },
	computed: {
		filterTodos(){
			//
			// const apiTodoByGroup = "http://waishuo.leanapp.cn/todos/api/v1/todo/"+this.selectGroup
	    // this.$http.get(apiTodoByGroup).then(response => {
			//
			// this.todos = response.body.results
			//     console.log(this.selectGroup+"  --> size is "+this.todos.length)
			//   }, response => {
			//
			// });
			if(this.filter === 'all'){
				return this.todos
			}

			const completed = this.filter === 'completed'

			return this.todos.filter(todo => completed === todo.completed)
		}
	},
	methods: {
		// 添加一个 todo
		addTodo(e){
			const api = "http://"+host+"/todos/api/v1/todo"
			const params = {
				'content': e.target.value.trim(),
				'groupId': this.selectGroup,
				'title': e.target.value.trim(),
				'priority': 0,
				'completed': 0
			}
			console.log("params is "+params)
			var vm = this
			vm.$http(
				api,
				'post',
				params,
				{
          'Access-Control-Allow-Origin': '*',

        },
				{emulateJSON: true}
			)
				.then((response) =>{
					vm.todos.unshift(response.data.results)
					e.target.value = ''
			})

		},

		deleteItem(objectId){
			console.log("current objectId is "+objectId)
			this.todos.splice(this.todos.findIndex(todo => todo.objectId === objectId),1)
		},

		toggleFilter(state){
			console.log("current status is "+state)
			this.filter = state
		},
		clearAll(){
			this.todos = this.todos.filter(todo => !todo.completed)
		},
		changeGroup(id){
			console.log(id)
		}
	}
}
</script>

<style lang="stylus" scoped>
	.real-app {
        width 600px
        margin 0 auto
        box-shadow 0 0 5px #666
    }

	.box{
		display: flex
		flex-direction: row
	}

    .add-input {
        position: relative;
        margin: 0;
        width: 80%;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        box-sizing: border-box;
        font-smoothing: antialiased;
        padding: 16px 16px 16px 36px;
        border: none;
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }
    .select-group{
    	position: relative;
        margin: 0;
        width: 20%;
        background-color:#ffffff;
        font-size: 24px;
        font-family: inherit;
        font-weight: inherit;
        line-height: 1.4em;
        border: 0;
        outline: none;
        color: inherit;
        box-sizing: border-box;
        font-smoothing: antialiased;
        padding: 16px 16px 16px 36px;
        border: none;
        box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
    }
</style>
