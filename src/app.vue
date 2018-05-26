<template>
	<div id="app">
		<el-dialog
			:title="todo.title"
			:visible.sync="showTodoDetailDialog"
			width="60%">

			<el-row :gutter="20">

			  <el-col :span="18">
					<div class="grid-content bg-purple-light">
						<el-form ref="todo" :model="todo" label-width="80px" label-position="top">
						  <el-form-item label="名称" size="medium">
						    <el-input v-model="todo.title"></el-input>
						  </el-form-item>
							<el-form-item label="详情备注" size="medium">
								<el-input type="textarea" v-model="todo.content"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="onSubmit">更新</el-button>
								<el-button @click="onCancel">取消</el-button>
							</el-form-item>
						</el-form>
					</div>

				</el-col>

			  <el-col :span="6">
					<div class="grid-content bg-purple-light dialogAction">
						<span>操作</span>
						<div style="margin-top:10px;">
								 <el-button size="medium" icon="el-icon-plus" type="success" plain>添加子项</el-button>
						</div>
						 <div style="margin-top:10px;">
							 		<el-button size="medium" icon="el-icon-goods" type="success" plain>归档该项</el-button>
						 </div>
						 <div style="margin-top:10px;">
							 		<el-button size="medium" icon="el-icon-delete" type="danger" plain>永久删除</el-button>
						 </div>
					</div>

				</el-col>

			</el-row>



		</el-dialog>

		<div id="cover"></div>

		<Login />

		<el-container>
			<el-header>
					<Header @dashboard="showDashboard"/>
			</el-header>

			<el-main >
				<Container v-show="!dashboard" @showTodoDetail="showTodoDetail"/>
				<Dashboard v-show="dashboard" ref="dashboard"/>
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
import Todo from './todo/todo.vue'
import Dashboard from './todo/dashboard.vue'
import Container from './todo/container.vue'
import Footer from './todo/footer.vue'
let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		data(){
			return{
				user:JSON.parse(localStorage.getItem("user")),
				dashboard:false,
				todo:{},
				filterTodos:[],
				showTodoDetailDialog: false
			}
		},
		components: {
			Login,
			Header,
			Footer,
			Todo,
			Dashboard,
			Container
		},
		methods:{
			showTodoDetail(todo,filterTodos){
				console.log("filterTodos len is  "+filterTodos.length);
				this.todo = todo;
				this.filterTodos = filterTodos;
				this.showTodoDetailDialog = true;
			},
			onSubmit() {
        console.log('submit!');
				const that = this
				this.updateTodo(this.todo,function(){
					that.showTodoDetailDialog = false;
					that.$message({
						type: 'success',
						message: '更新成功'
					});
				})
      },
			onCancel() {
        console.log('cancel!');
				this.showTodoDetailDialog = false;
      },

			showDashboard:function(){
				this.dashboard = !this.dashboard
				if(this.dashboard){
					console.log("刷新数据");
					this.$refs.dashboard.refresh()
				}
			},
			updateTodo(todo,callback){
				var todoId = todo.objectId
				const api = host+"/todos/api/"+api_version+"/todos/"+todoId
				const config = {
						headers : {
								'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
						}
				}
				var formData = new FormData();

				this.checkAndAppend(formData,'title',todo.title)
				this.checkAndAppend(formData,'content',todo.content)
				this.checkAndAppend(formData,'groupId',todo.groupId)
				this.checkAndAppend(formData,'priority',todo.priority)
				this.checkAndAppend(formData,'completed',todo.completed)
				this.checkAndAppend(formData,'completedAt',todo.completedAt)
				this.checkAndAppend(formData,'onFile',todo.onFile)
				this.checkAndAppend(formData,'onFileAt',todo.onFileAt)


				this.$http.put(api, formData, config).then(response => {
						//编辑完的 todo 结果
						const editResult = response.body.entity;
						//更新当前的 todo
						this.filterTodos.splice(this.filterTodos.findIndex(todo => todo.objectId === todoId),1,editResult)
						// 将编辑完的结果回调回去
						callback(editResult)
					}, response => {});
			},
			checkAndAppend(formData,key,value){
				if(value != undefined){
					formData.append(key, value)
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
		.dialogContentContainer{
			 display: flex;
		}



		.bg-purple {
			 background: #d3dce6;
		 }
		 .bg-purple-light {
			 background: #e5e9f2;
		 }
		 .grid-content {
			 border-radius: 4px;
			 min-height: 36px;
			 padding:10px;
		 }

		 .dialogAction{
 			 display: flex;
			 flex-direction: column;
			 align-items: flex-start;
 		}

</style>
