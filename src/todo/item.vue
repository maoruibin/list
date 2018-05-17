<template>
	<!-- <div :class="['todo-item',todo.completed ? 'completed':'']">
		<input
		 type="checkbox"
		 class="toggle"
		 v-on:change="toggleCompleted"
		 v-model="todo.completed"
		>

		<label>{{todo.title}}</label>


		<button
			class="destroy"
			@click="deleteTodo"
		/>
	</div> -->
	<el-card shadow="hover" style="margin-bottom:12px;">
		<div :class="['bottom clearfix todo-item',todo.completed ? 'completed':'']">
			 <el-checkbox
			 v-on:change="toggleCompleted"
			 v-model="todo.completed">
		  </el-checkbox>

			 <span>{{todo.title}}</span>


			 <el-dropdown trigger="click" class="button"  @command="handleCommand">
						 <span class="el-dropdown-link">
							 <i class="el-icon-more"></i>
						 </span>
						 <el-dropdown-menu slot="dropdown">
							 <el-dropdown-item command="e" >编辑</el-dropdown-item>
							 <el-dropdown-item divided command="d">删除</el-dropdown-item>
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
			}
		},
		methods: {
			handleCommand:function(command){
				if(command === 'd'){
					this.showDeleteDialog()
				}else if(command === 'e'){
					this.showEditDialog()
				}
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
				this.$emit('edit',this.todo)
			}
		}
	}
</script>

<style lang="stylus" scoped>
    .todo-item{
        span{
            white-space: pre-line;
            word-break: break-all;
            line-height: 1.2;
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
		.clearfix:before,
		.clearfix:after {
				display: table;
				content: "";
		}

		.clearfix:after {
				clear: both
		}

		.bottom {
			line-height: 12px;
		}

		.button {
			padding: 0;
			float: right;
		}
</style>
