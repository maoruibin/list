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
				<div>
				<span>Selected: {{ selectGroup.name }}</span>
				</div>

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
// let host = '0.0.0.0:3000'
let host = 'waishuo.leanapp.cn'
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

	created:function(){
		this.selectGroup = '这周'
	},

	mounted:function(){
		//获取分组信息
		const apiGroup = "http://"+host+"/todos/api/v1/group"
    this.$http.get(apiGroup).then(response => {
	    this.groups = response.body.results
			this.selectGroup = this.groups[0]
		  }, response => {});


    },
	computed: {
		filterTodos(){

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
			const api = "http://"+host+"/todos/api/v1.0/todos"
			console.log("title is "+e.target.value.trim());
			var formData = new FormData();
			formData.append('title', e.target.value.trim());
			formData.append('content', e.target.value.trim());
			formData.append('groupId', this.selectGroup);
			formData.append('priority', '0');
			formData.append('completed', false);

			// POST /someUrl
		  this.$http.post(api, formData).then(response => {
		    // get body data
				this.todos.unshift(response.body.todo)

				e.target.value = ''
		  }, response => {
		    // error callback
		  });

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
