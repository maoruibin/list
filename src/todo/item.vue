<template>

	<el-card shadow="hover" style="margin-bottom:12px;">
		<div :class="['item todo-item',todo.completed ? 'completed':'']">
			 <el-checkbox
			 id="checkBox"
			 v-on:change="toggleCompleted"
			 v-model="todo.completed">
		  </el-checkbox>

			 <span id="content">{{todo.title}}</span>

			 <el-dropdown trigger="click" id="action"  @command="handleCommand">
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
			}
		},
		data() {
		 return {
			 dialogVisible: false
		 };
	 	},
		methods: {
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
				return new Date(parseInt(nS)).toLocaleString().replace(/:\d{1,2}$/,' ');
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
    .toggle{
        text-align: center;
        width: 40px;
        height: 40px;
        line-height: 40px
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto 0;
        border: none;
        appearance: none;
        outline none
        padding-left 5px
        cursor pointer
        &:after{
            content: url('../assets/images/round.svg')
        }
        &:checked:after{
            content: url('../assets/images/done.svg')
        }
    }
    .destroy{
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        width: 40px;
        height: 40px;
        margin: auto 0;
        font-size: 30px;
        color: #cc9a9a;
        margin-bottom: 11px;
        transition: color 0.2s ease-out;
        background-color transparent
        appearance none
        border-width 0
        cursor pointer
        outline none
    }

		.item {
			display: flex;
			flex-direction:row;
			justify-content: space-between;
			align-items: flex-start;
			border: 0px solid #000777;
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
		}
</style>
