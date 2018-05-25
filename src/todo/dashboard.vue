<template>
  <div style="background-color:#f5f5f5;">
    <el-radio-group v-model="tabDay" style="margin-bottom: 20px;margin-top: 15px;">
     <el-radio-button label="today">今天</el-radio-button>
     <el-radio-button label="yesterday">昨天</el-radio-button>
     <el-radio-button label="lastDay">前天</el-radio-button>
     <el-radio-button label="lastWeek">一周内</el-radio-button>
   </el-radio-group>

    <el-tabs type="border-card" style="background-color:#f5f5f5;">
      <el-tab-pane label="已完成">
        <Item
          v-for="todo in completedList"
          :todo="todo"
          title="dashboard"
          onlyShow="true"
          :showAction="false"
          :key="todo.objectId"
        />
      </el-tab-pane>
      <el-tab-pane label="新添加">
        <Item
          v-for="todo in createdList"
          :todo="todo"
          :showAction="false"
          :key="todo.objectId"
        />
      </el-tab-pane>
      <el-tab-pane label="已归档">
        <Item
          v-for="todo in onFileList"
          :todo="todo"
          :showAction="false"
          :key="todo.objectId"
        />
      </el-tab-pane>

    </el-tabs>
  </div>

</template>

<script>
  import Item from './item.vue'
  let host = process.env.API_HOST
  let api_version = process.env.API_VERSION
  export default {
		data(){
			return{
				user:{},
        tabDay: 'today',
        completedList:[],
        createdList:[],
        onFileList:[]
			}
		},
    components:{
  		Item
  	},

		mounted:function(){
      console.log("dashboard mount");

      this.user = JSON.parse(localStorage.getItem("user"))
      if(!this.user){
        return
      }
      const apiTodosAll = host+"/todos/api/"+api_version+"/todos/time/"+this.user.id+"/"+this.tabDay
      this.$http.get(apiTodosAll).then(response => {

          this.completedList = response.body.todos.completed
          this.createdList = response.body.todos.created
          this.onFileList = response.body.todos.onFile
          console.log("created len is "+response.body.todos.created.length);
        }, response => {});

		},
    methods: {

      fetchByDay:function(){

      },
    }
  }
</script>

<style lang="stylus" scoped>



</style>
