<template>
	<div id="app">
		<Editor
			v-show="showTodoDetailDialog"
			:todo="todo"
			:user="user"
			:group="group"
			ref="editor"
			:showTodoDetailDialog="showTodoDetailDialog"
			@hideDialog="hideDialog"
			:filterTodos="filterTodos"/>

		<div id="cover"/>

		<Login />

		<el-container>
			<el-header>
					<Header @dashboard="showDashboard"/>
			</el-header>

<el-main >
		<Container
			v-show="!dashboard"
			:user="user"
			@showTodoDetail="showTodoDetail"/>

		<Dashboard
			v-show="dashboard"
			ref="dashboard"/>
</el-main>

			<el-footer>
					<Footer/>
			</el-footer>
		</el-container>


	</div>


</template>

<script >
import Header from './todo/header.vue'
import Login from './todo/login.vue'

import Editor from './todo/editor.vue'
import Dashboard from './todo/dashboard.vue'
import Container from './todo/container.vue'
import Footer from './todo/footer.vue'
let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		data(){
			return{
				user:{},
				dashboard:false,
				todo:{},
				group:{
					"name":"添加子列表",
					"objectId":"",
					"todos":{
						"results":[],
						"resultsOnFile":[]
					}
				},
				filterTodos:[],
				showTodoDetailDialog: false
			}
		},
		beforeMount:function(){
			this.user = JSON.parse(localStorage.getItem("user"))
		},
		components: {
			Login,
			Header,
			Footer,
			Editor,
			Dashboard,
			Container
		},
		methods:{
			showTodoDetail(todo,filterTodos){
				console.log("filterTodos len is  "+filterTodos.length);
				this.todo = todo;
				this.group.objectId = this.todo.objectId
				this.filterTodos = filterTodos;
				this.showTodoDetailDialog = true;
				// user id 5afdb50f67f356003864b9cb group id 5afe3b7a9f54543b319f4908
				// 5afdb50f67f356003864b9cb   5afe3b7a9f54543b319f4908
				console.log("user id "+this.user.id+" group id "+this.group.objectId);
				this.$refs.editor.fetchSubTodo(this.group.objectId)
			},

			hideDialog:function(){
				this.showTodoDetailDialog = false;
			},
			
			showDashboard:function(){
				this.dashboard = !this.dashboard
				if(this.dashboard){
					console.log("刷新数据");
					this.$refs.dashboard.refresh()
				}
			}

		}
	}
</script>



<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>
    #app {
        position absolute
        left 0
        right 0
        top 0
        bottom 0
    }
    #cover {
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        background-color #555
        opacity 0.0
        z-index -1
    }




</style>
