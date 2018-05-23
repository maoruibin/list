<template>
	<el-main >
		<draggable class="dragList" :list="groupTodos" :options="{handle:'.topAction',ghostClass:'ghost',scroll: true,animation: 150,group:{ name:'groupList'}}"  @start="drag" @end="drop" >

	    <Todo
		    v-for="group in groupTodos"
		    :key="group.objectId"
		    :group="group"
		    :user="user"
				@delete="deleteGroup"
				@edit="showEditGroupDialog"
				@appendGroup="appendGroup"
	    />

		</draggable>

  </el-main>

</template>

<script >
import Todo from './todo.vue'
import draggable from 'vuedraggable'

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

export default{
	data(){
		return{
      groupTodos:[],
			user:{},
			groupForAppend:{
				'name':'appendGroup',
				'objectId':'10000001'
			}
		}
	},
	components: {
		Todo,
		draggable
	},
  methods:{
		drag:function(){
			console.log('drag');
		},
		drop:function(e){
			console.log('drop');
			const that = this;
			var len = this.groupTodos.length
			//优先级最低 0 最高为 size-1
			this.groupTodos.forEach(function(group, index, array){
					group.priority = index
					// 不是最后一个
					if(index<len-1){
						console.log("更新 "+group.name);
						that.updateGroup(group,function(result){})
					}else{
						console.log("无需更新 "+group.name);
					}

			})
			this.groupTodos.forEach(function(group, index, array){
					console.log(group.name+" primary is "+group.priority);
			})
		},
    appendGroup:function(event){
			this.showAddGroupDialog();
    },

		showAddGroupDialog(){
			this.$prompt('', '请输入分组名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9]{1,6}/,
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
					const group = {
						'name':value,
						'priority':this.groupForAppend.priority
					}

					this.addNewGroup(group,this.user.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加'
          });
        });
		},

		showEditGroupDialog(group){
			this.$prompt('', '编辑分组', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: group.name,
          inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9]{1,6}/,
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
					group.name = value
					this.editGroup(group)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加'
          });
        });
		},

		addNewGroup(group,userId){
			const api = host+"/todos/api/"+api_version+"/group"
			var formData = new FormData();
			formData.append('name', group.name);
			formData.append('priority', group.priority);
			formData.append('userId', userId);

			// POST /someUrl
		  this.$http.post(api, formData).then(response => {
				this.groupTodos.splice(this.groupTodos.length-1,0,response.body.entity)
				this.$message({
					type: 'success',
					message: '插入新分组成功'
				});
		  }, response => {

		  });
		},
		// 更新 group
		updateGroup(group,callback){
			const api = host+"/todos/api/"+api_version+"/group/edit"
			var formData = new FormData();
			formData.append('name', group.name);
			formData.append('objectId', group.objectId);
			formData.append('priority', group.priority);

		  this.$http.post(api, formData).then(response => {
				this.groupTodos.splice(this.groupTodos.findIndex(item => item.objectId === group.objectId),1,response.body.entity)
				callback(response.body.entity)
		  }, response => {

		  });
		},
		editGroup(group){
			const that = this
			this.updateGroup(group,function(){
				that.$message({
					type: 'success',
					message: '更新分组成功'
				});
			})
		},
		deleteGroup(objectId){
			console.log("del group objectId is "+objectId)
			const api = host+"/todos/api/"+api_version+"/group/"+objectId
			const config =
				{
				    headers : {
				        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				}

			this.$http.delete(api,config).then(response => {
					console.log("result is "+response.body.result);
					this.groupTodos.splice(this.groupTodos.findIndex(group => group.objectId === objectId),1)

					this.$message({
						type: 'success',
						message: '删除成功!'
					});

				}, response => {});
		}
  },
  mounted:function(){
    this.user = JSON.parse(localStorage.getItem("user"))
    if(!this.user){
      return
    }
    const apiTodosAll = host+"/todos/api/"+api_version+"/todos/all/"+this.user.id
    this.$http.get(apiTodosAll).then(response => {
        this.groupTodos = response.body.groupTodos
				this.groupForAppend.priority = this.groupTodos.length
				this.groupTodos.push(this.groupForAppend)
        console.log("len is "+this.groupTodos.length);
      }, response => {});

    },
}
</script>


<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>

.dragList{
	 min-height: 10px;
}

</style>
