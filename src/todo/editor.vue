<template>
  <el-dialog
    :title="todo.title"
    :visible.sync="showTodoDetailDialog"
    width="60%">

    <el-row :gutter="20">

      <el-col :span="18">
        <div class="grid-content bg-purple-light">
          <el-form ref="todo" :model="todo" label-width="80px" label-position="top">
            <el-form-item label="名称" size="medium">
              <el-input v-model="todo.title"></el-input>
            </el-form-item>
            <el-form-item label="详情备注" size="medium">
              <el-input type="textarea" v-model="todo.content"></el-input>
            </el-form-item>

            <el-form-item size="medium">

              <Todo
          			:group="group"
          			:user="user"
          			:asSubTodo=true
          			ref="childTodo"
          			@appendGroup="appendGroup"
          		/>

            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">更新</el-button>
              <el-button @click="onCancel">取消</el-button>
            </el-form-item>
          </el-form>
        </div>

      </el-col>

      <el-col :span="6">
        <div class="grid-content bg-purple-light dialogAction">
          <span>操作</span>
          <div style="margin-top:10px;">
               <el-button size="medium" icon="el-icon-plus" type="success" plain>添加子项</el-button>
          </div>
           <div style="margin-top:10px;">
                <el-button size="medium" icon="el-icon-goods" type="success" plain>归档该项</el-button>
           </div>
           <div style="margin-top:10px;">
                <el-button size="medium" icon="el-icon-delete" type="danger" plain>永久删除</el-button>
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
  mounted:function(){

  },
	methods:{
    fetchSubTodo(groupId) {
      const api = host+"/todos/api/"+api_version+"/todos/"+this.user.id+"/"+groupId
		  this.$http.get(api).then(response => {

        this.group.todos.results = response.body.results
        this.$refs.childTodo.updateTodos(this.group.todos.results)
        console.log("result is "+this.group.todos.results.length);
				// this.todosOnFileList = response.body.resultsOnFile;
			}, response => {});
    },
    onSubmit() {
      console.log('submit!');
      const that = this
      this.updateTodo(this.todo,function(){
        that.showTodoDetailDialog = false;
        that.$message({
          type: 'success',
          message: '更新成功'
        });
      })
    },
    onCancel() {
      console.log('cancel!');
      this.showTodoDetailDialog = false;
    },
    addSubTodo() {
      console.log('addSubTodo!');
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
			 background: #d3dce6;
		 }
		 .bg-purple-light {
			 background: #e5e9f2;
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
 		}
		.subTodoItem{
			display:flex;
		}
</style>
