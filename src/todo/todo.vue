<template>

<!-- subTodo asSubTodo groupItem-->
	<div :class="['groupItem',asSubTodo?'subTodo':'']">

		<div v-show="!isLastIndex" class="topAction" style="border:0px solid red;">
			<span>{{group.name}}</span>
			<div class="actionArea">

				<i :class="['topIconAction icon_normal ', showOnFileList || showOnCompleteList ? 'el-icon-arrow-left' : 'el-icon-plus']" @click="toogleAddOrReturn"></i>

				<el-dropdown trigger="click" v-show="!asSubTodo"  @command="handleCommand">
				      <span class="el-dropdown-link">
				        <i class="el-icon-more icon_normal"></i>

				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item command="editGroup"  v-show="!showOnFileList && !showOnCompleteList">编辑分组</el-dropdown-item>
								<el-dropdown-item command="onFileList" v-show="!isGroupEmpty && todosOnFileList.length != 0 && !showOnCompleteList" >查看已归档</el-dropdown-item>
								<el-dropdown-item command="onFileBatch" v-show="showOnCompleteList" >归档所有已完成事项</el-dropdown-item>

								<el-popover
								 placement="bottom"
								 v-model="onFileGroup"
								 width="160">
								 <p>归档后，分组将从主页列表移除，但不会被删除，是否继续归档？</p>
								 <div style="text-align: right; margin: 0;margin-right:12px;">
								   <el-button size="mini" type="text" @click="deleteDirect">直接删除</el-button>
								   <el-button type="primary" size="mini" @click="fileGroup">归档</el-button>
								 </div>

								  <el-dropdown-item
									slot="reference"
									v-show="!showOnFileList && !showOnCompleteList"
									divided>归档分组</el-dropdown-item>

								</el-popover>

								<el-dropdown-item divided command="deleteAll" v-show="showOnFileList & todosOnFileList.length != 0">删除清空已归档任务</el-dropdown-item>
				      </el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>

		<AddTodo
			@hideAddForm="hideAddForm"
			@addTodo="addTodo"
			:length="todos.length"
			:group="group"
			:user="user"
			ref="addForm"
			v-show="showInput" />

		<!-- dragHandleItem 指定拖动区域 -->
		<draggable class="dragList" :list="filterTodos" :options="{handle:'.dragHandleItem',ghostClass:'ghost',scroll: true,disabled:showOnFileList,animation: 150,group:{ name:'todoList'}}" @add="moveTo" @start="drag" @end="drop" >

				<Item
					v-for="(todo, index) in filterTodos"
					:todo="todo"
					:index="index"
					:isLastIndex="index == filterTodos.length -1"
					:key="todo.objectId"
					:asSubTodo="asSubTodo"
					@delete="deleteItem"
					@edit="editItem"
					@showTodoDetail="showTodoDetail"
					@toggleCompleted="toggleCompletedItem"
					@move="moveItem"
					@onFile="onFileItem"
				/>

	   </draggable>


		<div class="addGroup"  style="text-align:center;line-height:60px;" v-show="isLastIndex">
			<el-button  @click="addGroup" icon="el-icon-plus" plain>添加新分组</el-button>
		</div>


		<div class="emptyInfo" v-show="isGroupEmpty" style="">
			<span class="textDesc">{{this.showOnFileList?'还没归档任何内容':'还没有任何内容，点击右上角添加。'}}</span>
		</div>

		<div class="fileList" v-show="todosCompleteList.length != 0" style="margin-top:10px;text-align:left;">
			<span class="textDesc" @click="showOnCompleteList=!showOnCompleteList" style="cursor:pointer;font-size: 0.9em;">
				{{this.showOnCompleteList?'查看未完成':'查看已完成'}}
			</span>
		</div>
	</div>

</template>
<script>
import Item from './item.vue'
import Tabs from './tabs.vue'
import AddTodo from './addTodo.vue'
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
		index:{
			type: Number,
			required: false,
			default: 0
		},
		isLastIndex:{
			type: Boolean,
			default: false
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
			todosCompleteList:[],
			// 已归档 todo 集合
			todosOnFileList:[],
			// 过滤器
			filter:'all',
			// 显示添加 todo 的输入框
			showInput:false,
			onFileGroup: false,
			showFirstTip:true,
			// 是否展示已归档列表
			showOnFileList:false,
			// 是否展示已完成列表
			showOnCompleteList:false,
			moveDialogVisible: false
		}
	},

	components:{
		Item,
		Tabs,
		AddTodo,
		draggable
	},

	created:function(){

	},

	mounted:function(){
		if(!this.isLastIndex){
			this.todos = this.group.todos.results;
			this.todosOnFileList = this.group.todos.resultsOnFile;
			this.todosCompleteList = this.group.todos.resultsComplete;
		}
  },
	computed: {
		// 分组中包含的 item 是否为空
		isGroupEmpty(){
			if(this.isLastIndex){
				return false;
			}
			if(this.showInput){
				return false
			}
			return this.filterTodos.length == 0;
		},
		filterTodos(){
			if(this.showOnCompleteList){
				return this.todosCompleteList
			}else if(this.showOnFileList){
				return this.todosOnFileList
			}else{
				return this.todos
			}
		},
	},
	methods: {
		addTodo:function(todo,appendEnd){
			if(appendEnd){
				this.todos.push(todo)
			}else{
				this.todos.unshift(todo)
			}
			this.$emit('todoChange','add')
		},
		getCount(){
			return this.todos.length;
		},
		getCompletedCount(){
			return this.todos.filter(todo => todo.completed).length;
		},
		updateTodos:function(todos){
			this.todos = todos;
		},
		// 清空所有已存在的 todo
		clearTodos:function(todos){
			this.todos = [];
		},
		drag:function(){
			this.hideAddForm()
		},
		// 移动到另一个 group 触发
		moveTo:function(e){
			this.updateTodosBatch(function(msg){
					console.log("move --> "+msg);
			})
		},
		drop:function(e){
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
			if(this.showOnCompleteList){
				this.showOnCompleteList = !this.showOnCompleteList
				return;
			}

			if(this.showOnFileList){
				this.showOnFileList = !this.showOnFileList
				return;
			}

			this.showInput = !this.showInput
			this.$emit('hideOtherInput',this.group)
			// 自动聚焦
			if(this.showInput){
				this.$refs.addForm.focus()
			}
		},

		hideAddForm:function(){
			this.showInput = false
		},

		showAddForm:function(){
			this.showInput = true
		},

		checkAndHideGroupInputForm:function(triggleGroupId){
			if(this.group.objectId != triggleGroupId){
					this.hideAddForm()
			}
		},
		handleCommand:function(command){
			if(command === 'editGroup'){
				this.$emit('editGroup',this.group)
			}else if(command === 'deleteAll'){
				this.showDelteFileListDialog(this.todosOnFileList)
			}else if(command === 'onFileBatch'){
				this.showOnFileBatchDialog()
			}else if(command === 'onFileList'){
				this.showOnFileList = !this.showOnFileList
			}
		},
		deleteDirect(){
			this.showDeleteDialog()
		},
		// 归档分组
		fileGroup(){
			this.group.onFileAt = Number(new Date())
			this.group.onFile = true;
			this.$emit('onFileGroup',this.group)
		},
		// 提示将会归档所有已完成项目
		showOnFileBatchDialog(){
			const that = this
			this.$confirm('此操作将归档该分组下所有已完成 Todo 项，归档后你可以在已归档列表中找到他们, 是否继续?', '提示', {
								confirmButtonText: '批量归档',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								console.log("that.todos "+that.todos.length);
								that.todos.forEach(function(item){

									item.onFileAt = Number(new Date())
									item.onFile = true

									if(item.completed){
										that.fileItem(item,false)
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

		moveItem(todo){
				this.moveDialogVisible = true
		},
		showTodoDetail(todo){
			this.hideAddForm();
			this.$emit('showTodoDetail',todo,this.filterTodos)
		},

		onFileItem(todo){
			this.fileItem(todo,true)
		},
		fileItem(todo,showToast){
			const that = this
			this.updateTodo(todo,function(result){
				var todoId = result.objectId;
				if(result.onFile){
					that.todos.splice(that.todos.findIndex(todo => todo.objectId === todoId),1)
					that.todosOnFileList.push(result)

					if(showToast){
						that.$message({
							type: 'success',
							message: '已归档'
						});
					}

				}else{
					that.todosOnFileList.splice(that.todosOnFileList.findIndex(todo => todo.objectId === todoId),1)
					that.todos.push(result)
					if(showToast){
						that.$message({
							type: 'success',
							message: '已还原'
						});
					}
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
			for(var key in todo) {
				if(!(todo[key] instanceof Object) && todo[key] != undefined){
					console.log("update "+key+" to "+todo[key]);
					formData.append(key, todo[key]);
				}
			}

			this.$http.put(api, formData, config).then(response => {
					//更新当前的 todo
					this.filterTodos.splice(this.filterTodos.findIndex(todo => todo.objectId === todoId),1,response.body.entity)
					// 将编辑完的结果回调回去
					callback(response.body.entity)
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
				// new Date().toUTCString()
				todo.completedAt = Number(new Date())
			}else{
				todo.completedAt = 0
			}

			const that = this
			this.updateTodo(todo,function(result){
					that.$emit('todoChange','toggle')
					var todoId = result.objectId;
					if(result.completed){
						that.$message({
							type: 'success',
							message: '完成任务 '+todo.title
						});
						that.todos.splice(that.todos.findIndex(todo => todo.objectId === todoId),1)
						that.todosCompleteList.push(result)
					}else{
						that.todosCompleteList.splice(that.todosCompleteList.findIndex(todo => todo.objectId === todoId),1)
						that.todos.push(result)
						that.$message({
							type: 'success',
							message: '已还原'
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
				that.$emit('todoChange','delete')
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
		border: 0px solid blue;
	}

	@media only screen and (max-width: 479px){
		.groupItem {
			width: 80%;
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
			border: 0px solid blue;
		}
	}

	.subTodo{
		width: 96%;
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
		font-size:1.2em;
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

	.dragList{
     min-height: 10px;
	}

</style>
