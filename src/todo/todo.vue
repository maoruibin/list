<template>
	<div class="child">

		<div v-show="!lastGroupAction" class="topAction">
			<span>{{group.name}}</span>
			<div class="actionArea">

				<i class="el-icon-plus" @click="showAddInput" style="margin-left:8dp;"></i>

				<el-dropdown trigger="click"  @command="handleCommand">
				      <span class="el-dropdown-link">
				        <i class="el-icon-more"></i>
				      </span>
				      <el-dropdown-menu slot="dropdown">
				        <el-dropdown-item command="e" >编辑</el-dropdown-item>
								<el-dropdown-item divided command="d">删除</el-dropdown-item>
				      </el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>

		<el-card shadow="always" v-show="showInput" style="margin-bottom:12px;">
		      <el-input
					v-model="input"
					clearable="true"
					autofocus="autofocus"
					@keyup.enter.native="addTodo"
					placeholder="请输入要做的事">
				</el-input>
				<div class="bottom clearfix">
           <el-button type="primary" size="small" plain @click="addTodo">确定</el-button>
					 <i class="el-icon-close" style="margin-left:12px;" @click="hideInput"></i>
        </div>
		</el-card>
		<!-- <section class="real-app">
			<div class="box" v-show="showInput">
				<input
				type="text"
				class="add-input"
				autofocus="autofocus"
				placeholder="请输入要做的事"
				@keyup.enter="addTodo"/>
			</div>
		</section> -->
		<Item
			:todo="todo"
			v-for="todo in filterTodos"
			:key="todo.objectId"
			@delete="deleteItem"
			@edit="editItem"
		/>

		<el-button style="margin-top:12px;" v-show="lastGroupAction" @click="addGroup" type="primary" plain>添加分组</el-button>
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
			// 过滤器
			filter:'all',
			input: '',
			// 显示添加 todo 的输入框
			showInput:false,
			lastGroupAction:this.group.name === 'addGroup'
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
					var flag = results[item].completed
					results[item].completed =  flag === "false" ? false : true;
					this.todos.unshift(results[item])
				}


			}, response => {});
  },
	computed: {
		filterTodos(){
			if(this.filter === 'all'){
				return this.todos
			}

			const completed = this.filter === 'completed'
			return this.todos.filter(todo => todo.completed)
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
			if(command === 'd'){
				this.showDeleteDialog()
			}else if(command === 'e'){
				this.$emit('edit',this.group)
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

		editItem(todo,isToggle){
			var objectId = todo.objectId
			console.log("update  "+todo.title+" objectId is "+objectId);
			const api = "http://"+host+"/todos/api/v1.0/todos/"+objectId
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

			this.$http.put(api, formData, config).then(response => {
					const editResult = response.body.entity;
					editResult.completed = editResult.completed === 'true'
					//正常更新
					if(!isToggle){
						this.todos.splice(this.todos.findIndex(todo => todo.objectId === objectId),1,editResult)
						return;
					}
					//先删除
					this.todos.splice(this.todos.findIndex(todo => todo.objectId === objectId),1)

					if(editResult.completed){
						//如果已完成则追加到末尾
						this.todos.push(editResult)
					}else{
						//如果未完成则追加到队头
						this.todos.unshift(editResult)
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
	.real-app {
    width: 100%;
    margin: 0 auto;
    box-shadow: 0 0 5px #666;
		border: 0px solid blue;
  }

	.box{
		display: flex
		flex-direction: row
		margin-bottom: 10px;
	}

  .add-input {
      position: relative;
      margin: 0;
      width: 100%;
      font-size: 18px;
      font-family: inherit;
      font-weight: inherit;
      line-height: 1.2em;
      border: 0;
      outline: none;
      color: inherit;
      box-sizing: border-box;
      font-smoothing: antialiased;
      padding: 10px 10px 10px 16px;
      border: none;
      box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  }

	.child{
		overflow:scroll;
		padding-left:16px;
		padding-right:16px;
		padding-bottom:16px;
		margin-right:10px;
	}
	.child > ul > li{
		height: 30px;
	}

	.topAction{
		width: 100%;
		line-height:40px;
		display: inline-block;
		border: 0px solid red;
	}
	.actionArea{
		float: right;
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
