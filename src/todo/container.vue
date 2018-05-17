<template>
	<div id="todoContainer">

    <Todo
    v-for="group in groups"
    :key="group.objectId"
    :group="group"
    :user="user"
		@delete="deleteGroup"
		@edit="showEditGroupDialog"
		@actionGroup="addGroup"
    />

  </div>
</template>

<script >
import Todo from './todo.vue'


// let host = '0.0.0.0:3000'
let host = 'waishuo.leanapp.cn'

export default{
	data(){
		return{
      groups:[],
			user:{}
		}
	},
	components: {
		Todo
	},
  methods:{
    addGroup:function(event){
			this.showAddGroupDialog();
    },

		showAddGroupDialog(){
			this.$prompt('', '请输入分组名', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /[\u4e00-\u9fa5_a-zA-Z0-9]{1,6}/,
          inputErrorMessage: '格式不正确'
        }).then(({ value }) => {
					this.addNewGroup(value,this.user.id)
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
					this.editGroup(group.objectId,value)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消添加'
          });
        });
		},

		addNewGroup(name,userId){
			const api = "http://"+host+"/todos/api/v1.0/group"
			var formData = new FormData();
			formData.append('name', name);
			formData.append('userId', userId);

			// POST /someUrl
		  this.$http.post(api, formData).then(response => {
				this.groups.splice(this.groups.length-1,0,response.body.entity)
				this.$message({
					type: 'success',
					message: '插入新分组成功'
				});
		  }, response => {

		  });
		},

		editGroup(groupId,name){
			const api = "http://"+host+"/todos/api/v1.0/group/edit"
			var formData = new FormData();
			formData.append('name', name);
			formData.append('groupId', groupId);

			// POST /someUrl
		  this.$http.post(api, formData).then(response => {
				this.groups.splice(this.groups.findIndex(group => group.objectId === groupId),1,response.body.entity)
				this.$message({
					type: 'success',
					message: '更新分组成功'
				});
		  }, response => {

		  });
		},

		deleteGroup(objectId){
			console.log("del group objectId is "+objectId)
			const api = "http://"+host+"/todos/api/v1.0/group/"+objectId
			const config =
				{
				    headers : {
				        'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
				    }
				}

			this.$http.delete(api,config).then(response => {
					console.log("result is "+response.body.result);
					this.groups.splice(this.groups.findIndex(group => group.objectId === objectId),1)

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
    const apiGroup = "http://"+host+"/todos/api/v1.0/group/"+this.user.id
    this.$http.get(apiGroup).then(response => {
        this.groups = response.body.results
				this.groups.push({"name":"addGroup"})
        console.log("len is "+this.groups.length);
      }, response => {});

    },
}
</script>


<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>
    #todoContainer {
      width: 100%;
      height: 500px;
      padding:10px;
      white-space: nowrap;
      overflow: hidden;
      overflow-x: auto;
      -webkit-backface-visibility: hidden;
      -webkit-perspective: 1000;
      -webkit-overflow-scrolling: touch; /* 2 */
      text-align: justify; /* 3 */
      &::-webkit-scrollbar {
          display: block;
      }
    }

    #todoContainer > div {
      width: 20%;
      height: 500px;
      background-color: #eff1f3;
      border:1px solid #ccc;
      border-radius:6px;
      display: inline-block;
    }


</style>
