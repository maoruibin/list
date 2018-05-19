<template>
	<div>

		<div v-show="!lastGroupAction" class="topAction">
			<span>{{group.name}}</span>
			<div class="actionArea">

				<i class="el-icon-plus" @click="showAddInput"></i>

				<el-dropdown trigger="click"  @command="handleCommand">
				      <span class="el-dropdown-link">
				        <i class="el-icon-more"></i>
				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item command="edit" >编辑分组</el-dropdown-item>
				        <el-dropdown-item command="onFile">{{this.showOnFileList?'正常列表':'已归档列表'}}</el-dropdown-item>
								<el-dropdown-item divided command="delete">删除分组</el-dropdown-item>
				      </el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>

		<el-card shadow="always" v-show="showInput" style="margin-bottom:12px;">
		      <el-input
					v-model="input"
					clearable = true
					autofocus="autofocus"
					@keyup.enter.native="addTodo"
					placeholder="请输入要做的事">
				</el-input>
				<div class="bottom clearfix">
           <el-button type="primary" size="small" plain @click="addTodo">确定</el-button>
					 <i class="el-icon-close" style="margin-left:12px;" @click="hideInput"></i>
        </div>
		</el-card>


		<Item
			v-for="todo in filterTodos"
			:todo="todo"
			:key="todo.objectId"
			@delete="deleteItem"
			@edit="editItem"
			@move="moveItem"
			@onFile="onFileItem"
		/>


		<el-card shadow="never" style="margin-top:12px;" v-show="lastGroupAction">
    		<el-button  @click="addGroup" icon="el-icon-plus" plain>添加新分组</el-button>
    </el-card>


	</div>

</template>
<script>
import Item from './item.vue'
import Tabs from './tabs.vue'

let id = 0
// let host = '0.0.0.0:3000'
let host = 'waishuo.leanapp.cn'
export default{
	props: {
		group: {
			type: Object,
			required: true
		},
		user: {
			type: Object,
			required: true
		},
	},
	data(){
		return{
			// 容纳 TODO 的集合
			todos:[],
			// 已完成 todo 集合
			todosComplete:[],
			// 已归档 todo 集合
			todosOnFileList:[],
			// 过滤器
			filter:'all',
			input: '',
			// 显示添加 todo 的输入框
			showInput:false,
			// 是否展示已完成列表
			showOnFileList:false,
			lastGroupAction:this.group.name === 'addGroup',
			moveDialogVisible: false
		}
	},

	components:{
		Item,
		Tabs
	},

	created:function(){

	},

	mounted:function(){
		const api = "http://"+host+"/todos/api/v1.0/todos/"+this.user.id+"/"+this.group.objectId
		this.$http.get(api).then(response => {
				const results = response.body.results;
				for(var item in results){
					results[item].completed = false
					this.todos.push(results[item])
				}

				const resultsComplete = response.body.resultsComplete;
				for(var index in resultsComplete){
					resultsComplete[index].completed = true
					this.todosComplete.push(resultsComplete[index])
				}
				for(var index in this.todosComplete){
					this.todos.push(this.todosComplete[index])
				}

				this.todos = this.todos.filter(todo => {
					if(todo.onFile){
						return false;
					}
					return true;
				})

				this.todosOnFileList = response.body.resultsOnFile;

			}, response => {});
  },
	computed: {
		filterTodos(){
			if(this.showOnFileList){
				return this.todosOnFileList
			}else{
				return this.todos
			}
		}
	},
	methods: {
		showAddInput:function(event){
			this.showInput = !this.showInput
		},
		hideInput:function(event){
			this.showInput = false
		},
		handleCommand:function(command){
			if(command === 'delete'){
				this.showDeleteDialog()
			}else if(command === 'edit'){
				this.$emit('edit',this.group)
			}else if(command === 'onFile'){
				this.showOnFileList = !this.showOnFileList
			}
		},
		deleteGroup:function(){
			console.log('delete real');
			//传递给父组件让其执行删除
			this.$emit('delete',this.group.objectId)
		},
		addGroup:function(){
			this.$emit('actionGroup')
		},
		showDeleteDialog:function(){
			this.$confirm('此操作将永久删除该分组, 是否继续?', '提示', {
			          confirmButtonText: '删除',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).then(() => {
								this.deleteGroup()
			        }).catch(() => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });
			        });
		},
		// 添加一个 todo
		addTodo(){
			if(this.input.length == 0){
				this.$message({
					type: 'info',
					message: '输入不能为空'
				});
				return
			}
		  const api = "http://"+host+"/todos/api/v1.0/todos"
			var that = this

			var formData = new FormData();
			formData.append('title', this.input.trim());
			formData.append('content', this.input.trim());
			formData.append('groupId', this.group.objectId);
			formData.append('priority', '0');
			formData.append('completed', 'false');
			formData.append('userId', this.user.id);

			// POST /someUrl
		  this.$http.post(api, formData).then(response => {
				var flag = response.body.entity.completed
				response.body.entity.completed =  flag === "false" ? false : true;
				this.todos.unshift(response.body.entity)
				this.input= ''
		  }, response => {

		  });

		},
		moveItem(todo){
			this.moveDialogVisible = true
		},
		onFileItem(todo){
			var todoId = todo.objectId
			const api = "http://"+host+"/todos/api/v1.0/todos/onFile/"+todoId
			const config = {
					headers : {
							'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
					}
			}
			var formData = new FormData();
			var flag = todo.onFile == 'true'

			formData.append('onFile', !flag);
			formData.append('onFileAt', new Date().getTime());

			this.$http.put(api, formData, config).then(response => {
					const result = response.body.entity
					if(result.onFile === 'true'){
						this.todos.splice(this.todos.findIndex(todo => todo.objectId === todoId),1)
						this.todosOnFileList.push(result)
						this.$message({
							type: 'success',
							message: '已归档'
						});
					}else{
						this.todosOnFileList.splice(this.todosOnFileList.findIndex(todo => todo.objectId === todoId),1)
						this.todos.push(result)
						this.$message({
							type: 'success',
							message: '已还原'
						});
					}





				}, response => {});


		},
		// todo 要编辑的 todo
		// isToggle 是不是编辑完成状态 默认为 false
		editItem(todo,isToggle){
			var todoId = todo.objectId
			const api = "http://"+host+"/todos/api/v1.0/todos/"+todoId
			const config = {
					headers : {
							'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
					}
			}
			var formData = new FormData();
			formData.append('title', todo.title);
			formData.append('content', todo.content);
			formData.append('groupId', todo.groupId);
			formData.append('priority', todo.priority);
			formData.append('completed', todo.completed);
			if(isToggle){
				formData.append('completedAt', new Date().getTime());
			}

			this.$http.put(api, formData, config).then(response => {
					const editResult = response.body.entity;
					editResult.completed = editResult.completed === 'true'

					this.todos.splice(this.todos.findIndex(todo => todo.objectId === todoId),1,editResult)

					if(isToggle){
						this.$message({
							type: 'success',
							message: '完成任务 '+editResult.title
						});
					}

				}, response => {});
		},
		deleteItem(todo){
			const objectId = todo.objectId
			console.log("current objectId is "+objectId)

			const api = "http://"+host+"/todos/api/v1.0/todos/"+objectId
			const config =
				{
				    headers : {
				        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				}
			this.$http.delete(api,config).then(response => {
					console.log("result is "+response.body.result);
					this.todos.splice(this.todos.findIndex(todo => todo.objectId === objectId),1)
					this.$message({
            type: 'success',
            message: '删除成功!'
          });
				}, response => {});
		},

		toggleFilter(state){
			console.log("current status is "+state)
			this.filter = state
		},
		clearAll(){
			this.todos = this.todos.filter(todo => !todo.completed)
		}
	}
}
</script>

<style lang="stylus" scoped>

	.topAction{
		width: 100%;
		line-height:40px;
		display: inline-block;
		border: 0px solid red;
	}
	.actionArea{
		float: right;
		border: 0px solid blue;
	}

	.actionArea > .el-icon-plus{
		border: 0px solid black;
		padding-right:8px;
	}
	.actionArea > span{
		color:#000000;
		cursor:pointer;
	}

	.bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

	.clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }

</style>
