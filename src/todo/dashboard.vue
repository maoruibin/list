<template>
  <div>
    <el-radio-group v-model="tabDay" style="margin-bottom: 20px;margin-top: 15px;">
     <el-radio-button label="today">今天</el-radio-button>
     <el-radio-button label="yesterday">昨天</el-radio-button>
     <el-radio-button label="lastDay">前天</el-radio-button>
     <el-radio-button label="lastWeek">一周内</el-radio-button>
   </el-radio-group>

    <el-tabs type="border-card">
      <el-tab-pane label="已完成">已完成</el-tab-pane>
      <el-tab-pane label="新添加">新添加</el-tab-pane>
      <el-tab-pane label="已归档">已归档</el-tab-pane>

    </el-tabs>
  </div>

</template>

<script>
  export default {
		data(){
			return{
				user:{},
        tabDay: 'today'
			}
		},
		mounted:function(){
      this.user = JSON.parse(localStorage.getItem("user"))
      if(!this.user){
        return
      }
      const apiTodosAll = host+"/todos/api/"+api_version+"/todos/list/"+this.user.id
      this.$http.get(apiTodosAll).then(response => {
          this.groupTodos = response.body.groupTodos
          this.groupForAppend.priority = this.groupTodos.length
          this.groupTodos.push(this.groupForAppend)
          console.log("len is "+this.groupTodos.length);
        }, response => {});

		},
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>



</style>
