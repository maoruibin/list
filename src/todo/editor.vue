<template>
  <el-dialog
    :title="todo.title"
    @close="dismiss"
    :visible.sync="showTodoDetailDialog"
    width="60%">

    <el-row :gutter="20">

      <el-col :span="18">
        <div >
          <el-form class="grid-content bg-purple-light" ref="todo" :model="todo" label-width="80px" label-position="top">
            <el-form-item label="名称" size="medium">
              <el-input v-model="todo.title"></el-input>
            </el-form-item>
            <el-form-item label="详情备注" size="medium">
              <el-input type="textarea" v-model="todo.content"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>

          </el-form>

          <el-form v-show="showSubTodo" class="grid-content bg-purple-light" style="margin-top:10px;padding:0px;">
            <Todo
              :group="group"
              :user="user"
              :asSubTodo=true
              ref="childTodo"
              @appendGroup="appendGroup"
            />
          </el-form>

        </div>

      </el-col>

      <el-col :span="6">
        <div class="grid-content bg-purple-light dialogAction" >
          <span>操作</span>
          <div>
            <el-tooltip effect="dark" content="添加子 todo，用于更细粒度的事情规划。" placement="top-end">
              <el-button class="actionButton" size="medium" icon="el-icon-plus" plain @click="addSubTodo">添加子 Todo</el-button>
            </el-tooltip>

          </div>
           <div>
              <el-tooltip effect="dark" content="从主页列表中移除该事项，但不删除。" placement="bottom-end">
                <el-button class="actionButton" size="medium" icon="el-icon-goods" plain>归档该 Todo</el-button>
              </el-tooltip>
           </div>

           <div v-show="false">
                <el-button class="actionButton" size="medium" icon="el-icon-delete" plain>永久删除</el-button>
           </div>
        </div>

      </el-col>

    </el-row>
  </el-dialog>

</template>

<script>
import Todo from './todo.vue'


let host = process.env.API_HOST
let api_version = process.env.API_VERSION

export default{
  data(){
		return{
      showSubTodo:false
		}
	},
	props:{
		todo:{
			type: Object,
			required: true
		},

		group:{
			type: Object,
			required: true
		},
		user:{
			type: Object,
			required: true
		},

		filterTodos:{
			type: Array,
			required: true
		},

    showTodoDetailDialog:{
      type: Boolean,
      required: true
    }

	},
  components: {
		Todo
	},
  computed: {
    subTodoCount(){
      if(this.group.todos === undefined){
          return 0;
      }
      if(this.group.todos.results === undefined){
          return 0;
      }
      return this.group.todos.results.length;
    },
    subTodoCompletedCount(){
      if(this.group.todos === undefined){
          return 0;
      }
      if(this.group.todos.results === undefined){
          return 0;
      }

      return this.group.todos.results.filter(todo => todo.completed).length;
    }
  },
  mounted:function(){

  },
	methods:{
    fetchSubTodo(groupId) {
      const api = host+"/todos/api/"+api_version+"/todos/"+this.user.id+"/"+groupId
		  this.$http.get(api).then(response => {
        this.group.todos.results = response.body.results
        if(this.group.todos.results.length>0){
          this.showSubTodo = true;
        }
        this.$refs.childTodo.updateTodos(this.group.todos.results)
			}, response => {});
    },
    onSubmit() {
      console.log('submit!');
      const that = this

      // this.todo.subTodoCount = this.subTodoCount
      // this.todo.subCompletedCount = this.subTodoCompletedCount

      this.updateTodo(this.todo,function(){
        that.$emit('hideDialog')
        that.$message({
          type: 'success',
          message: '更新成功'
        });
      })
    },

    dismiss() {
      this.$emit('hideDialog')
      this.showSubTodo = false;
    },
    addSubTodo() {
      this.showSubTodo = !this.showSubTodo;
    },
    onCancel() {
      console.log('cancel!');
      this.showTodoDetailDialog = false;
    },

    updateTodo(todo,callback){
      var todoId = todo.objectId

      const api = host+"/todos/api/"+api_version+"/todos/"+todoId
      const config = {
          headers : {
              'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
          }
      }
      var formData = new FormData();

      this.checkAndAppend(formData,'title',todo.title)
      this.checkAndAppend(formData,'content',todo.content)
      this.checkAndAppend(formData,'groupId',todo.groupId)
      this.checkAndAppend(formData,'priority',todo.priority)
      this.checkAndAppend(formData,'completed',todo.completed)
      this.checkAndAppend(formData,'completedAt',todo.completedAt)
      this.checkAndAppend(formData,'onFile',todo.onFile)
      this.checkAndAppend(formData,'onFileAt',todo.onFileAt)

      if(todo.subTodoCount != undefined && todo.subTodoCount>0){
        formData.append('subTodoCount', todo.subTodoCount)
        formData.append('subTodoCompletedCount', todo.subCompletedCount)
      }

      this.$http.put(api, formData, config).then(response => {
          //编辑完的 todo 结果
          const editResult = response.body.entity;
          //更新当前的 todo
          this.filterTodos.splice(this.filterTodos.findIndex(todo => todo.objectId === todoId),1,editResult)
          // 将编辑完的结果回调回去
          callback(editResult)
        }, response => {});
    },
    checkAndAppend(formData,key,value){
      if(value != undefined){
        formData.append(key, value)
      }
    }
	}
}
</script>

<style lang="stylus" scoped>

		.bg-purple {
			 background: #eff1f3;
		 }
		 .bg-purple-light {
			 background: #eff1f3;
		 }
		 .grid-content {
			 border-radius: 4px;
			 min-height: 36px;
			 padding:10px;
		 }

		 .dialogAction{
 			 display: flex;
			 flex-direction: column;
			 align-items: flex-start;
       border:0px solid blue;
 		}
    .dialogAction >div{
      margin-top:10px;
      border:0px solid red;
      width:100%;
    }
    .actionButton{
      width:100%;
    }
		.subTodoItem{
			display:flex;
		}
</style>
