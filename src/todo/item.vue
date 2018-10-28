<template>

	<el-card shadow="hover" body-style="padding:10px" :class="['cardContainer',isLastIndex?'lastItemContainer':'']">
		<div :class="['item todo-item',todo.completed && showAction ? 'completed':'']">
			 <el-checkbox
			 id="checkBox"
			 class="dragHandleItem"
			 v-show="showAction"
			 v-on:change="toggleCompleted"
			 v-model="todo.completed">
		  </el-checkbox>

			<div class="dragHandleItem itemCenter">
				<span class="content" @click="showDetail">{{todo.title}}</span>

				<transition name="el-fade-in">
					<!-- todo.completed -->
					<div class="centerElement smallInfo" v-show="false">
		 			 完成于 {{getLocalTime(todo.completedAt)}}
		 		 </div>
       </transition>

			 <span class="centerElement smallInfo primaryInfo" v-show="todo.expectedStartTime && todo.expectedEndTime">
				{{todo.expectedStartTime}}-{{todo.expectedEndTime}}
			</span>


			<el-tag class="statusIcon smallInfo" :key="tag.objectId" v-for="tag in todo.tags" size="mini" :color="tag.color" style="color:#FFFFFF;">
				{{tag.name}}
			</el-tag>

			<i
				class="statusIcon el-icon-document"
				v-show="todo.content != undefined && todo.content.length != 0"
			 	@click="showDetail"></i>

				<i :class="['statusIcon el-icon-circle-check-outline',todo.hasCompletedSubTodo?'statusCompleted':'']" style="margin-left:2px;" v-show="todo.hasSubTodo" ></i>

				<span :class="['statusIcon smallInfo',todo.hasCompletedSubTodo?'statusCompleted':'']" v-show="todo.hasSubTodo">{{todo.subTodoCompletedCount}}/{{todo.subTodoCount}}</span>
			</div>

			 <el-dropdown trigger="click" v-show="showAction" class="dragHandleItem"  @command="handleCommand">
						 <span class="el-dropdown-link">
							 <i class="el-icon-more icon_normal"></i>
						 </span>
						 <el-dropdown-menu slot="dropdown" style="margin-top:-8px;">
							 <el-dropdown-item v-show="asSubTodo" command="e">编辑名称</el-dropdown-item>

							 <!-- <el-dropdown-item  command="move">移动</el-dropdown-item> -->
							 <el-popover
							  placement="bottom"
							  width="160"
							  v-model="onFilePoint">
							  <p>归档后，todo 将从列表中被移除，并不会被直接删除，是否继续归档？</p>
							  <div style="text-align: right; margin: 0;margin-right:12px;">
							    <el-button size="mini" type="text" @click="deleteDirect">直接删除</el-button>
							    <el-button type="primary" size="mini" @click="onFileItem">归档</el-button>
								</div>

								<el-dropdown-item slot="reference" v-show="!todo.onFile && !asSubTodo">归档条目</el-dropdown-item>
							</el-popover>

							 <el-dropdown-item v-show="todo.onFile || asSubTodo" command="d">删除条目</el-dropdown-item>
						 </el-dropdown-menu>
			 </el-dropdown>

		 </div>

	</el-card>
</template>
<script>
	export default{
		props: {
			todo: {
				type: Object,
				required: true
			},
			index:{
	      type: Number,
	      default: 0,
				required: false,
	    },
			isLastIndex:{
	      type: Boolean,
	      default: false
	    },
			showAction:{
	      type: Boolean,
	      default: true
	    },
			asSubTodo: {
				type: Boolean,
				required: false,
				default: false
			},
			title:''
		},
		// https://cn.vuejs.org/v2/guide/components-props.html
		data() {
		 return {
			 dialogVisible: false,
			 onFilePoint: false,
			 shadowValue:"always"
		 };
	 	},
		methods: {
			// 直接删除
			deleteDirect:function(){
				this.$emit('delete',this.todo)
			},
			handleCommand:function(command){
				if(command === 'd'){
					this.showDeleteDialog()
				}else if(command === 'e'){
					this.showEditDialog()
				}else if(command === 'move'){
					this.showMoveDialog()
				}
			},
			onFileItem(){
				this.todo.onFileAt = Number(new Date())
				this.todo.onFile = true;
				this.$emit('onFile',this.todo)
			},
			// 显示 todo 详情
			showDetail(){
				this.$emit('showTodoDetail',this.todo)
			},
			getLocalTime(nS) {
				return new Date(nS).toLocaleString().replace(/:\d{1,2}$/,' ');
			},

			showDeleteDialog(){

				this.$confirm('此操作将永久删除该 Todo, 是否继续?', '提示', {
									confirmButtonText: '删除',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									this.$emit('delete',this.todo)
								}).catch(() => {
									this.$message({
										type: 'info',
										message: '已取消删除'
								 });
				});
			},
			showMoveDialog(){
				this.$emit('move',this.todo)
			},
			showEditDialog(){
				console.log("showAction is "+this.showAction);
				this.$prompt('', '编辑', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						inputValue: this.todo.title,
						inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9]{1,20}/,
						inputErrorMessage: '格式不正确'
					}).then(({ value }) => {
						this.todo.title = value
						this.$emit('edit',this.todo)
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消编辑'
						});
					});
			},

			toggleCompleted(event){
				console.log("this toggleCompleted todo ----> "+this.todo.completed);
				this.$emit('toggleCompleted',this.todo)
			}
		}
	}
</script>

<style lang="stylus" scoped>

    .todo-item{
        span{
            transition: color 0.4s;
        }
        &.completed{
            .content{
                color: #d9d9d9;
                text-decoration: line-through;
            }
						.centerElement{
							color: #d9d9d9;
							text-decoration: line-through;
						}
        }
    }

		.cardContainer{
			margin-bottom:8px;
			border: 0px solid #000777;
		}
		/* 如果是最后一行则去掉 bottom padding */
		.lastItemContainer{
			margin-bottom:0px;
		}

		.item {
			display: flex;
			flex-direction:row;
			justify-content: space-between;
			align-items: flex-start;
			border: 0px solid #000000;
		}

		#checkBox{
			flex-grow: 0;

		}
		.itemCenter{
			flex-grow: 1;
			padding-left:8px;
			padding-right:8px;
			border: 0px solid orange;
		}

		el-dropdown{
			flex-grow: 0;
		}
		.centerElement{
			color: #d9d9d9;
			margin-top:6px;
		}
		.statusIcon{
			margin-top:6px;
			color: #a8a8a8;
		}

		.statusCompleted{
			color: #67C23A;
		}

		.primaryInfo{
		  color:#4e947c;
		}

		.dragHandleItem{
			cursor: move;
  		cursor: -webkit-grabbing;
			border: 0px solid #f00000;
		}
</style>
