<template>
	<div class="child">

		<div v-show="!lastGroupAction" class="topAction">
			<span>{{group.name}}</span>
			<div class="actionArea">


				<i class="el-icon-plus" @click="showAddInput"></i>

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

		<section class="real-app">
			<div class="box" v-show="showInput">
				<input
				type="text"
				class="add-input"
				autofocus="autofocus"
				placeholder="请输入要做的事"
				@keyup.enter="addTodo"/>
			</div>
		</section>
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
				for(var item in response.body.results){
					var flag = response.body.results[item].completed
					response.body.results[item].completed =  flag === "false" ? false : true;
					this.todos.unshift(response.body.results[item])
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
		addTodo(e){
		  const api = "http://"+host+"/todos/api/v1.0/todos"
			var that = this


			var formData = new FormData();
			formData.append('title', e.target.value.trim());
			formData.append('content', e.target.value.trim());
			formData.append('groupId', this.group.objectId);
			formData.append('priority', '0');
			formData.append('completed', 'false');
			formData.append('userId', this.user.id);

			// POST /someUrl
		  this.$http.post(api, formData).then(response => {
				var flag = response.body.entity.completed
				response.body.entity.completed =  flag === "false" ? false : true;
				this.todos.unshift(response.body.entity)
				e.target.value= ''
		  }, response => {

		  });

		},

		editItem(todo){
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
			formData.append('completed', todo.completed == true ? 'true' : 'false');

			this.$http.put(api, formData, config).then(response => {
					console.log("result is "+response.body.entity);
					this.todos.splice(this.todos.findIndex(todo => todo.objectId === objectId),1,response.body.entity)
					this.$message({
            type: 'success',
            message: '编辑成功!'
          });
				}, response => {});
		},
		deleteItem(objectId){
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

</style>
