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

			<span>Selected: {{ selectGroup }}</span>
			

			<Item
				:todo="todo"
				v-for="todo in filterTodos"
				:key="todo.id"
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
		const apiGroup = "http://waishuo.leanapp.cn/todos/api/v1/group"
        this.$http.get(apiGroup).then(response => {

		    this.groups = response.body.results
		    
		  }, response => {
		    
		});
    },
	computed: {
		filterTodos(){
			if(this.selectGroup.length == 0){
				return
			}
			const apiTodoByGroup = "http://waishuo.leanapp.cn/todos/api/v1/todo/"+this.selectGroup
	        this.$http.get(apiTodoByGroup).then(response => {

				this.todos = response.body.results
			    console.log(this.selectGroup+"  --> size is "+this.todos.length)
			  }, response => {
			    
			});
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
			const api = "http://waishuo.leanapp.cn/todos/api/v1/todo"
			const params = {
				'content': e.target.value.trim(),
				'groupId': this.selectGroup
			}
			var vm = this
			vm.$http.post(api,params)
				.then((response) =>{
					vm.todos.unshift(response.data.results)
					e.target.value = ''
				})
			// this.todos.unshift({
			// 	id:id++,
			// 	content:e.target.value.trim(),
			// 	completed:false
			// })
			
		},

		deleteItem(id){
			console.log("current id is "+id)
			this.todos.splice(this.todos.findIndex(todo => todo.id === id),1)
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