<template>

<!-- subTodo asSubTodo groupItem-->
	<div :class="['groupItem',asSubTodo?'subTodo':'']">

		<div v-show="!lastGroupAction" class="topAction">
			<span>{{group.name}}</span>
			<div class="actionArea">

				<i :class="['topIconAction', showOnFileList ? 'el-icon-arrow-left' : 'el-icon-plus']" @click="toogleAddOrReturn"></i>

				<el-dropdown trigger="click" v-show="!asSubTodo"  @command="handleCommand">
				      <span class="el-dropdown-link">
				        <i class="el-icon-more"></i>

				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item command="edit"  v-show="!showOnFileList">编辑分组</el-dropdown-item>
								<el-dropdown-item command="onFileBatch" v-show="hasCompletedTodo" >归档已完成 Todo</el-dropdown-item>
								<el-dropdown-item command="onFile">{{this.showOnFileList?'Todo 列表':'查看已归档 Todo'}}</el-dropdown-item>

								<el-dropdown-item divided command="delete"   v-show="!showOnFileList" >删除该分组</el-dropdown-item>
								<el-dropdown-item divided command="deleteAll" v-show="showOnFileList & todosOnFileList.length != 0">清空已归档</el-dropdown-item>
				      </el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>

		<el-card shadow="always" v-show="showInput" style="margin-bottom:12px;">
		      <el-input
					v-model="input"
					clearable = true
					autofocus = true
					@keyup.enter.native="addTodo"
					placeholder="请输入要做的事">
				</el-input>
				<div class="bottom clearfix">
           <el-button type="primary" size="small" plain @click="addTodo">确定</el-button>
					 <i class="el-icon-close" style="margin-left:12px;" @click="hideAddForm"></i>
        </div>
		</el-card>

		<!-- dragHandleItem 指定拖动区域 -->
		<draggable class="dragList" :list="filterTodos" :options="{handle:'.dragHandleItem',ghostClass:'ghost',scroll: true,disabled:showOnFileList,animation: 150,group:{ name:'todoList'}}" @add="moveTo" @start="drag" @end="drop" >

				<Item
					v-for="todo in filterTodos"
					:todo="todo"
					:key="todo.objectId"
					@delete="deleteItem"
					@edit="editItem"
					@showTodoDetail="showTodoDetail"
					@toggleCompleted="toggleCompletedItem"
					@move="moveItem"
					@onFile="onFileItem"
				/>

	   </draggable>


		<el-card shadow="never" style="margin-top:12px;" v-show="lastGroupAction">
    		<el-button  @click="addGroup" icon="el-icon-plus" plain>添加新分组</el-button>
    </el-card>

	</div>

</template>
<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
import draggable from 'vuedraggable'

let host = process.env.API_HOST
let api_version = process.env.API_VERSION
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

		asSubTodo: {
			type: Boolean,
			required: false,
			default: false
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

			lastGroupAction:this.group.name === 'appendGroup',
			moveDialogVisible: false
		}
	},

	components:{
		Item,
		Tabs,
		draggable
	},

	created:function(){

	},

	mounted:function(){
		if(!this.lastGroupAction){
			this.todos = this.group.todos.results;
			this.todosOnFileList = this.group.todos.resultsOnFile;
		}
  },
	computed: {
		filterTodos(){
			if(this.showOnFileList){
				return this.todosOnFileList
			}else{
				return this.todos
			}
		},
		// 列表是否包含已完成 todo
		hasCompletedTodo(){
			if(this.showOnFileList){
				return false
			}else{
				let item = this.todos.find(function(item){
					return item.completed
				})
				// 说明有已完成的 todo
				return item != undefined
			}
		}

	},
	methods: {
		updateTodos:function(todos){
			this.todos = todos;
		},
		drag:function(){
			console.log('drag');
		},
		// 移动到另一个 group 触发
		moveTo:function(e){
			console.log('拖动到另一组完成');
			this.updateTodosBatch(function(msg){
					console.log("move --> "+msg);
			})
		},
		drop:function(e){
			console.log('同一组内拖动完成');

			this.updateTodosBatch(function(msg){
					console.log("drop --> "+msg);
			})
		},
		updateTodosBatch:function(callback){
			const that = this;
			var len = this.todos.length
			//优先级最低 0 最高为 size-1
			var updateList = []
			this.todos.forEach(function(todo, index, array){
					todo.priority = len-index-1
					todo.groupId = that.group.objectId

					var updateItem = {objectId:todo.objectId,groupId:todo.groupId,priority:todo.priority}
					updateList.push(updateItem)
			})

			const api = host+"/todos/api/"+api_version+"/todos/batchUpdate"
			const config = {
					headers : {
							'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
					}
			}
			var formData = new FormData();
			formData.append('list', JSON.stringify(updateList));

			this.$http.put(api, formData, config).then(response => {
					//编辑完的 todo 结果
					const msg = response.body.msg;
					// 将编辑完的结果回调回去
					callback(msg)
				}, response => {});

		},
		showPriority:function(){
			this.todos.forEach(function(todo, index, array){
					console.log(index+" ---> perority "+todo.priority)
					console.log(index+" ---> groupId "+todo.groupId)
			})
		},
		toogleAddOrReturn:function(){
			console.log("group "+JSON.stringify(this.group));

			if(this.showOnFileList){
				this.showOnFileList = !this.showOnFileList
			}else{
				this.showInput = !this.showInput
				this.$emit('hideOtherInput',this.group)
			}
		},
		hideAddForm:function(){
			this.showInput = false

		},
		checkAndHideGroupInputForm:function(triggleGroupId){
			if(this.group.objectId != triggleGroupId){
					this.showInput = false
			}
		},
		handleCommand:function(command){
			if(command === 'delete'){
				this.showDeleteDialog()
			}else if(command === 'edit'){
				this.$emit('edit',this.group)
			}else if(command === 'onFile'){
				this.showOnFileList = !this.showOnFileList
			}else if(command === 'deleteAll'){
				this.showDelteFileListDialog(this.todosOnFileList)
			}else if(command === 'onFileBatch'){
				this.showOnFileBatchDialog()
			}
		},
		// 提示将会归档所有已完成项目
		showOnFileBatchDialog(){
			const that = this
			this.$confirm('此操作将归档所有已完成 Todo，归档后你可以在已归档列表中找到他们, 是否继续?', '提示', {
								confirmButtonText: '归档已完成 Todo',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								that.todos.forEach(function(todo, index, array){
									if(todo.completed){
											that.onFileItemPure(todo,function(value){})
									}
								})
								that.$message({
									type: 'success',
									message: '已将所有已完成 Todo 归档'
								});
							}).catch(() => {});
		},

		showDelteFileListDialog(onFileList){
			const that = this
			this.$confirm('此操作将永久删除已归档的所有 Todo, 是否继续?', '提示', {
								confirmButtonText: '删除已归档',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								onFileList.forEach(function(todo, index, array){
									that.deleteTodoCallback(todo,function(){
											that.todosOnFileList.splice(that.todosOnFileList.findIndex(item => item.objectId === todo.objectId),1)
									})
								})
								that.$message({
			            type: 'success',
			            message: '已删除所有已归档 Todo'
			          });
							}).catch(() => {});
		},

		deleteTodoCallback(todo,callback){
			const objectId = todo.objectId
			const api = host+"/todos/api/"+api_version+"/todos/"+objectId
			const config =
				{
						headers : {
								'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
						}
				}
			this.$http.delete(api,config).then(response => {
						callback(todo)
			}, response => {});
		},

		deleteGroup:function(){
			console.log('delete real');
			//传递给父组件让其执行删除
			this.$emit('delete',this.group.objectId)
		},
		addGroup:function(){
			this.$emit('appendGroup')
		},
		showDeleteDialog:function(){
			this.$confirm('此操作将永久删除该分组以及分组下的 Todos, 是否继续?', '提示', {
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
		  const api = host+"/todos/api/"+api_version+"/todos"
			var that = this
			//新增 todo 的排序 index 就是当前 todo 的大小
			var todoSize = this.todos.length
			var formData = new FormData();
			formData.append('title', this.input.trim());
			formData.append('content', '');
			formData.append('groupId', this.group.objectId);
			formData.append('priority', todoSize);
			formData.append('completed', 'false');
			formData.append('onFile', 'false');
			formData.append('userId', this.user.id);

			// POST /someUrl
		  this.$http.post(api, formData).then(response => {
				this.todos.unshift(response.body.entity)
				this.input= ''
		  }, response => {

		  });

		},
		moveItem(todo){
				this.moveDialogVisible = true
		},
		showTodoDetail(todo){
			this.$emit('showTodoDetail',todo,this.filterTodos)
		},
		onFileItem(todo){
				const that = this
				const todoId = todo.objectId
				todo.onFile = !todo.onFile
				if(todo.onFile){
					todo.onFileAt = new Date().toUTCString()
				}else{
					todo.onFileAt = 0
				}
				this.updateTodo(todo,function(result){
					if(result.onFile){
						that.todos.splice(that.todos.findIndex(todo => todo.objectId === todoId),1)
						that.todosOnFileList.push(result)
						that.$message({
							type: 'success',
							message: '已归档'
						});
					}else{
						that.todosOnFileList.splice(that.todosOnFileList.findIndex(todo => todo.objectId === todoId),1)
						that.todos.push(result)
						that.$message({
							type: 'success',
							message: '已还原'
						});
					}
				})
		},

		editItem(todo){
			const that = this
			this.updateTodo(todo,function(result){
				that.$message({
					type: 'success',
					message: '更新成功'
				});
			})
		},
		// todo 要编辑的 todo
		// isToggle 是不是编辑完成状态 默认为 false
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
			console.log("todo.onFileAt is "+todo.onFileAt+" type is "+typeof(todo.onFileAt));


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
		},
		// todo 要编辑的 todo
		toggleCompletedItem(todo){

			if(todo.completed){
				todo.completedAt = new Date().toUTCString()
			}else{
				todo.completedAt = 0
			}

			const that = this
			this.updateTodo(todo,function(result){
					if(result.completed){
						that.$message({
							type: 'success',
							message: '完成任务 '+todo.title
						});
					}
			})
		},
		deleteItem(todo){
			const that = this
			this.deleteTodoCallback(todo,function(){
				that.filterTodos.splice(that.filterTodos.findIndex(item => item.objectId === todo.objectId),1)
				that.$message({
					type: 'success',
					message: '删除成功!'
				});
			})
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
	.groupItem {
		width: 20%;
		height:auto;
		max-height: 500px;
		background-color: #eff1f3;
		border-radius:6px;
		display: inline-block;
		vertical-align: top;
		overflow:scroll;
		padding-left:12px;
		padding-right:12px;
		padding-bottom:12px;
		margin-right:12px;
	}

	.subTodo{
		width: 100%;
	}

	.topAction{
		width: 100%;
		line-height:42px;
		display: inline-block;
		border: 0px solid red;
		cursor: move;
		cursor: -webkit-grabbing;
	}

	.topAction > span{
		font-size:16px;
		font-weight:540;
	}

	.actionArea{
		float: right;
		border: 0px solid blue;
	}

	.actionArea > .topIconAction{
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

	.dragList{
     min-height: 10px;
	}

</style>
