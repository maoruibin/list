<template>
	<div id="app">

		<Login
			v-show="isShowLoginDialog"
			:showLogin="isShowLoginDialog"
			@callback="loginCallback"
			@showRegister="showRegister"
			@hideLoginDialog="hideLogin"/>

		<Register
			v-show="isShowRegisterDialog"
			:showRegister="isShowRegisterDialog"
			@callback="registCallback"
			@showLogin="showLogin"
			@hideRegisterDialog="hideRegister"/>

		<Profile
			v-show="isShowProfileDialog"
			:showProfile="isShowProfileDialog"
			:user="user"
			@settingChange="settingChange"
			@close="isShowProfileDialog = false"
			:settingLean="settingLean"
			/>
		<Editor
			v-show="isShowEditorDialog"
			:todo="todo"
			:user="user"
			:group="group"
			ref="editor"
			:showTodoDetailDialog="isShowEditorDialog"
			:todos="filterTodos"
			@on-todos-change="onTodosChange"
			@hideEditor="hideEditor"/>

		<About
			v-show="isShowAboutDialog"
			@hideAboutDialog="hideAboutDialog"
			:showAboutDialog="isShowAboutDialog"/>


		<el-container>

			<el-header height="46px">
					<Header
					ref="header"
					:project="currentProject"
					:user="user"
					:settingLean="settingLean"
					:isSuperUser="isSuperUser"
					@logout="logout"
					@addProject="showAddProjectDialog"
					@selectProject="selectProject"
					@aboutAction="showAbout"
					@profile="showProfileDialog"
					@dashboard="showDashboard"/>
			</el-header>

			<el-main v-show="!isShowLoginDialog && !isShowRegisterDialog">
				 <!-- 路由出口 -->
				 <!-- 路由匹配到的组件将渲染在这里 -->
				 <!-- <router-view></router-view> -->
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
import Register from './todo/register.vue'

import Editor from './todo/editor.vue'

import Dashboard from './todo/dashboard.vue'
import Container from './todo/container.vue'
import Footer from './todo/footer.vue'
import Profile from './todo/profile.vue'
import About from './todo/about.vue'

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		data(){
			return{
				user:{},
				currentProject:{},
				setting:{},
				settingLean:{},
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
				isShowEditorDialog: false,
				isShowAboutDialog: false,
				isShowLoginDialog: false,
				isShowRegisterDialog: false,
				isShowProfileDialog: false,
			}
		},
		mounted:function(){
			this.user = JSON.parse(localStorage.getItem("user"))
			if(this.user == null){
				this.isShowLoginDialog = true
				this.user = {
					'nickname':''
				}
				return;
			}
			this.settingLean = JSON.parse(localStorage.getItem("settingLean"))
			this.fetchUserTodos(this.user)
			this.checkEmailVertify(this.user);
			// this.$router.push('/dashboard')
		},

		components: {
			Login,
			Register,
			Header,
			Profile,
			Footer,
			Editor,
			About,
			Dashboard,
			Container
		},
		methods:{
			showAcviteEmailPoint(email){
				this.$notify({
					title: '激活提示',
					type: 'warning',
					message: '您的注册邮箱('+email+')尚未激活，请前往验证。',
					position: 'bottom-right',
					duration: 0
				});
			},
			checkEmailVertify(user){
				if(user.emailVerified){
					return
				}
				//如果用户未激活邮箱则请求一次服务器检查最新的用户信息
				const api = host+"/api/"+api_version+"/users/"+this.user['objectId']

				this.$http.get(api).then((response) => {
						this.user = response.body.data
						if(this.user.emailVerified){
							return
						}
						this.showAcviteEmailPoint(user.email)
					}, (response) => {});
			},
			settingChange(setting){
				this.settingLean = setting
			},
			onTodosChange(val){
				console.log("todo 发生了变化");
				this.filterTodos=val;
			},
			logout(){
				localStorage.removeItem('user');
				localStorage.removeItem('setting');
				localStorage.removeItem('settingLean');
				this.user = null
				this.setting = null
				this.isShowLoginDialog = true

				this.$message({
					type: 'success',
					message: '注销成功!'
				});

			},
			hideLogin(){
				this.isShowLoginDialog = false
			},
			hideRegister(){
				this.isShowRegisterDialog = false
			},
			showRegister(){
				this.isShowRegisterDialog = true
			},
			showLogin(){
				this.isShowLoginDialog = true
				this.hideRegister();
			},
			fetchUserTodos(user){
				this.isSuperUser = user.objectId === '5ae33e0d9f5454003f0e1ced'
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

				const apiProjectAll = host+"/api/"+api_version+"/projects/"+user.objectId
				this.$http.get(apiProjectAll).then(response => {
						this.projectList = response.body.data

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
			registCallback(user,setting,msg){
				const that = this
				this.callback(user,setting,msg,function(res){
					if(res<0){
						that.isShowRegisterDialog = true;
					}
				})
				this.$message({
					type: 'success',
					duration: 6000,
					message: '注册成功，请前往邮箱激活邮件。',
				});
			},

			loginCallback(user,setting,msg){
				const that = this
				if(!user.emailVerified){
					this.showAcviteEmailPoint(user.email)
				}

				this.callback(user,setting,msg,function(res){
					if(res<0){
							that.isShowLoginDialog = true;
					}
				})
			},
			callback(user,setting,msg,callback){
				if(user != null){
					this.user = user;
					this.fetchUserTodos(user)
					localStorage.setItem("user",JSON.stringify(user))
					localStorage.setItem("settingLean",JSON.stringify(setting))
					callback(1)
					this.isShowLoginDialog = false;
					this.isShowRegisterDialog = false;
					this.$message({
						type: 'success',
						message: msg
					});
				}else{
					this.$message({
						type: 'warning',
						message: msg
					});
					callback(-1)
				}
			},

			showAbout(){
				this.isShowAboutDialog = true
			},
			showProfileDialog(){
				this.isShowProfileDialog = true
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
				const apiHost = host+"/api/"+api_version+"/projects"
				const config = {
						headers : {
								'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
						}
				}
				var formData = new FormData();

				this.checkAndAppend(formData,'name',project.name)
				this.checkAndAppend(formData,'priority',project.priority)
				this.checkAndAppend(formData,'userId',this.user.objectId)

				this.$http.post(apiHost, formData, config).then(response => {
						callback(response.body.data)
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
				this.isShowEditorDialog = true;
				console.log("user id "+this.user.objectId+" group id "+this.group.objectId+" todo id "+this.todo.objectId);
				if(todo.hasSubTodo){
					this.$refs.editor.fetchSubTodo(this.group.objectId)
				}
			},

			hideEditor:function(){
				this.isShowEditorDialog = false;
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
