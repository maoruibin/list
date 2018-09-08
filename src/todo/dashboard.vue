<template>
  <div style="background-color:#f5f5f5;">
    <el-radio-group v-model="tabDay" @change="changeHandler" style="margin-bottom: 0px;margin-top: 15px;margin-left: 15px;">
     <el-radio-button label="today">今天</el-radio-button>
     <el-radio-button label="yesterday">昨天</el-radio-button>
     <el-radio-button label="lastDay">前天</el-radio-button>
     <el-radio-button label="lastWeek">一周内</el-radio-button>
   </el-radio-group>

   <div class="content" style="margin-left: 15px;margin-right: 15px;margin-bottom: 15px;">
     <div
       class="normalLoading"
       v-show="loadingTodos">
       <i class="el-icon-loading"></i>
       <span>加载中</span>
     </div>

     <el-tabs
      type="border-card"
      v-show="!loadingTodos"
      style="background-color:#f5f5f5;">

      <el-tab-pane :label="completed">
        <Item
          v-for="todo in completedList"
          :todo="todo"
          title="dashboard"
          onlyShow="true"
          v-show="!isCompletedEmpty"
          :showAction="false"
          :key="todo.objectId"
        />
        <div class="emptyInfo" v-show="isCompletedEmpty">
    			<span class="textDesc">{{formatDay}}还没完成任何事项</span>
    		</div>

      </el-tab-pane>

       <el-tab-pane :label="created">
         <Item
           v-for="todo in createdList"
           :todo="todo"
           v-show="!isCreatedEmpty"
           :showAction="false"
           :key="todo.objectId"
         />
         <div class="emptyInfo" v-show="isCreatedEmpty">
          <span class="textDesc">{{formatDay}}还没创建任何事项</span>
        </div>
       </el-tab-pane>
       <el-tab-pane :label="onFiled">
         <Item
           v-for="todo in onFileList"
           :todo="todo"
           v-show="!isOnFiledEmpty"
           :showAction="false"
           :key="todo.objectId"
         />
         <div class="emptyInfo" v-show="isOnFiledEmpty">
          <span class="textDesc">{{formatDay}}还没归档任何事项</span>
        </div>
        </el-tab-pane>

     </el-tabs>
   </div>

  </div>

</template>

<script>
  import Item from './item.vue'
  let host = process.env.API_HOST
  let api_version = process.env.API_VERSION
  export default {
		data(){
			return{
        tabDay: 'today',
        completed: '已完成',
        created: '新添加',
        onFiled: '已归档',
        completedList:[],
        createdList:[],
        onFileList:[],
        loadingTodos:false,
        isCompletedEmpty:false,
        isCreatedEmpty:false,
        isOnFiledEmpty:false,
			}
		},
    props:{
      user:{
  			type: Object,
  			required: true
  		}
    },
    components:{
  		Item
  	},
    computed:{
      formatDay(){
        if(this.tabDay == "today"){
          return "今天"
        }else if(this.tabDay == "yesterday"){
          return "昨天"
        }else if(this.tabDay == "lastDay"){
          return "前天"
        }else if(this.tabDay == "lastWeek"){
          return "前一周"
        }else{
          return "今天"
        }
      }
    },

		mounted:function(){
      console.log("dashboard mount");
		},
    methods: {
      changeHandler(value) {
        this.reset()
        console.log('改变之后的值是:' + value)
        this.fetchDay(value)
      },
      refresh:function(){
          this.fetchDay('today')
      },
      reset(){
        this.isCompletedEmpty = false;
        this.isCreatedEmpty = false;
        this.isOnFiledEmpty = false;
      },
      fetchDay(day){
        this.loadingTodos = true;
        const apiTodosAll = host+"/api/"+api_version+"/todos/time/"+this.user.objectId+"/"+day
        this.$http.get(apiTodosAll).then(response => {
            this.loadingTodos = false;
            this.completedList = response.body.data.todos.completed
            this.createdList = response.body.data.todos.created
            this.onFileList = response.body.data.todos.onFile

            this.isCompletedEmpty = this.completedList.length == 0
            this.isCreatedEmpty = this.createdList.length == 0
            this.isOnFiledEmpty = this.onFileList.length == 0
            console.log(day+" onFile的 todo 数量 "+response.body.todos.onFile.length);
          }, response => {
            this.loadingTodos = false;
          });
      }
    }
  }
</script>

<style lang="stylus" scoped>



</style>
