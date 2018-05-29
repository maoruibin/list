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

		<About
			v-show="isShowAboutDialog"
			@hideAboutDialog="hideAboutDialog"
			:showAboutDialog="isShowAboutDialog"/>

		<div id="cover"/>

		<Login />

		<el-container>
			<el-header>
					<Header
					ref="header"
					:project="currentProject"
					:user="user"
					:isSuperUser="isSuperUser"
					@addProject="showAddProjectDialog"
					@selectProject="selectProject"
					@aboutAction="showAbout"
					@dashboard="showDashboard"/>
			</el-header>

			<el-main >
					<Container
						v-show="!dashboard"
						:user="user"
						:setting="setting"
						ref="container"
						@showTodoDetail="showTodoDetail"/>

					<Dashboard
						v-show="dashboard"
						:user="user"
						ref="dashboard"/>
			</el-main>


		</el-container>


	</div>


</template>

<script >
import Header from './todo/header.vue'
import Login from './todo/login.vue'

import Editor from './todo/editor.vue'
import About from './todo/about.vue'
import Dashboard from './todo/dashboard.vue'
import Container from './todo/container.vue'
import Footer from './todo/footer.vue'

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		data(){
			return{
				user:{},
				currentProject:{},
				setting:{},
				dashboard:false,
				isSuperUser:false,
				todo:{},
				group:{
					"name":"添加子列表",
					"objectId":"",
					"projectId":"",
					"todos":{
						"results":[],
						"resultsOnFile":[]
					}
				},
				filterTodos:[],
				projectList:[],
				showTodoDetailDialog: false,
				isShowAboutDialog: false,
			}
		},
		mounted:function(){
			this.user = JSON.parse(localStorage.getItem("user"))
			this.isSuperUser = this.user.id === '5ae33e0d9f5454003f0e1ced'

			this.setting = JSON.parse(localStorage.getItem("setting"))
			if(this.setting === null || this.setting.currentProject === undefined){
				this.setting = {
					'currentProject':{
						"name":'',
						"objectId":'',
						"priority":-1
					}
				}
			}
			console.log("mounted  current apge is "+this.setting.currentProject.name);

			const apiProjectAll = host+"/todos/api/"+api_version+"/project/"+this.user.id
			this.$http.get(apiProjectAll).then(response => {
					this.projectList = response.body.results

					if(this.setting.currentProject.objectId === ''){
						this.setting.currentProject = this.projectList[0];
						localStorage.setItem("setting",JSON.stringify(this.setting));
					}
					this.currentProject = this.setting.currentProject
					this.$refs.header.updateProjectList(this.projectList)
					this.$refs.container.fetchProjectTodos(this.currentProject,function(res){

					})
				}, response => {
					this.$message.error('加载数据出了点问题，请重试。('+response.status+"-"+response.statusText+")");
				});

		},



		components: {
			Login,
			Header,
			Footer,
			Editor,
			About,
			Dashboard,
			Container
		},
		methods:{
			showAbout(){
				this.isShowAboutDialog = true
			},
			selectProject(project,callback){
				// 设置成功后才保存
				const that = this
				this.$refs.container.fetchProjectTodos(project,function(res){
					if(res>0){
						that.currentProject = project
						callback(project)
						that.setting.currentProject = project
						localStorage.setItem("setting",JSON.stringify(that.setting));
					}else{
						callback(null)
					}
				})
			},
			showAddProjectDialog(project){
				let that = this
				this.$prompt('', '添加项目', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						inputValue: '',
						inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}/,
						inputErrorMessage: '格式不正确'
					}).then(({ value }) => {
						project.name = value
						that.addProject(project,function(result){
							that.$refs.header.appendProject(result)
						})

					}).catch(() => {

					});
			},

			addProject(project,callback){
				console.log("name is "+project.name+" pri "+project.priority);
				const apiHost = host+"/todos/api/"+api_version+"/project"
				const config = {
						headers : {
								'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
						}
				}
				var formData = new FormData();

				this.checkAndAppend(formData,'name',project.name)
				this.checkAndAppend(formData,'priority',project.priority)
				this.checkAndAppend(formData,'userId',this.user.id)

				this.$http.post(apiHost, formData, config).then(response => {
						callback(response.body.entity)
					}, response => {
						this.$message.error('添加失败，请重试。('+response.status+"-"+response.statusText+")");
					});
			},
			checkAndAppend(formData,key,value){
				if(value != undefined){
					formData.append(key, value)
				}
			},

			showTodoDetail(todo,filterTodos){
				console.log("filterTodos len is  "+filterTodos.length);
				this.todo = todo;
				this.group.objectId = this.todo.objectId
				this.filterTodos = filterTodos;
				this.showTodoDetailDialog = true;
				// user id 5afdb50f67f356003864b9cb group id 5afe3b7a9f54543b319f4908
				// 5afdb50f67f356003864b9cb   5afe3b7a9f54543b319f4908
				console.log("user id "+this.user.id+" group id "+this.group.objectId+" todo id "+this.todo.objectId);
				if(todo.hasSubTodo){
					this.$refs.editor.fetchSubTodo(this.group.objectId)
				}
			},

			hideDialog:function(){
				this.showTodoDetailDialog = false;
			},
			hideAboutDialog:function(){
				this.isShowAboutDialog = false;
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
