<template>

	<el-card shadow="hover" body-style="padding:10px" class="cardContainer">
		<div :class="['item todo-item',todo.completed && showAction ? 'completed':'']">
			 <el-checkbox
			 id="checkBox"
			 class="dragHandleItem"
			 v-show="showAction"
			 v-on:change="toggleCompleted"
			 v-model="todo.completed">
		  </el-checkbox>

			<div id="content">
				<span >{{todo.title}}</span>
			</div>


			 <el-dropdown trigger="click" v-show="showAction" class="dragHandleItem"  @command="handleCommand">
						 <span class="el-dropdown-link">
							 <i class="el-icon-more"></i>
						 </span>
						 <el-dropdown-menu slot="dropdown" style="margin-top:-8px;">
							 <el-dropdown-item v-show="!todo.onFile" command="e">编辑条目</el-dropdown-item>

							 <!-- <el-dropdown-item  command="move">移动</el-dropdown-item> -->
							 <el-dropdown-item command="onFile">{{todo.onFile?'还原条目':'归档条目'}}</el-dropdown-item>
							 <el-dropdown-item divided v-show="todo.onFile" command="d">彻底删除</el-dropdown-item>
						 </el-dropdown-menu>
			 </el-dropdown>

		 </div>
		 <div class="time" v-show="todo.completed">
			 完成于 {{getLocalTime(todo.completedAt)}}
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

			showAction:{
	      type: Boolean,
	      default: true
	    },
			title:''
		},
		// https://cn.vuejs.org/v2/guide/components-props.html
		data() {
		 return {
			 dialogVisible: false,
			 shadowValue:"always"
		 };
	 	},
		methods: {
			getShadowValue:function(){
				return "always"
			},
			handleCommand:function(command){

				if(command === 'd'){
					this.showDeleteDialog()
				}else if(command === 'e'){
					this.showEditDialog()
				}else if(command === 'move'){
					this.showMoveDialog()
				}else if(command === 'onFile'){
					this.$emit('onFile',this.todo)
				}
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
            span{
                color: #d9d9d9;
                text-decoration: line-through;
            }
        }
    }

		.cardContainer{
			margin-bottom:8px;
			border: 0px solid #000777;
		}

		.item {
			display: flex;
			flex-direction:row;
			justify-content: space-between;
			align-items: flex-start;
			border: 0px solid #000000;
		}

		.item >span{
      text-align: left;
    }

		#checkBox{
			flex-grow: 0;

		}
		#content{
			flex-grow: 1;
			text-align: left;
			word-break:normal;
      width:auto;
      display:block;
      white-space:pre-wrap;
      word-wrap : break-word ;
      overflow: hidden ;
			padding-left:8px;
			padding-right:8px;
		}
		el-dropdown{
			flex-grow: 0;
		}
		.time{
			font-size: 4px;
			color: #ccc;
			margin-top:4px;
			padding-left:8px;
			padding-right:8px;
		}
		.dragHandleItem{
			cursor: move;
  		cursor: -webkit-grabbing;
		}
</style>
