<template>
  <el-dialog
    :title="todo.title"
    @close="dismiss"
    :close-on-press-escape="false"
    :visible.sync="showTodoDetailDialog"
    width="60%">

    <el-row :gutter="20">

      <el-col :span="18">
        <div >
          <el-form class="grid-content bg-purple-light"
           ref="todo"
           :model="todo"
           @submit.native.prevent
           label-width="80px"
           label-position="top">
            <el-form-item label="名称" size="medium">
              <el-input v-model="todo.title"></el-input>
            </el-form-item>
            <el-form-item label="详情备注" size="medium">
              <el-input type="textarea" v-model="todo.content"></el-input>
            </el-form-item>

            <el-form-item size="medium" style="margin-bottom:4px;" >
              <el-button style="float:right;border:0px solid red;"
               @click="onSubmit(false)"
               :disabled="updatingData">保 存</el-button>
            </el-form-item>

          </el-form>

          <el-form
            class="grid-content bg-purple-light"
            @submit.native.prevent
            style="margin-top:10px;padding:0px;">
            <div
              class="normalLoading"
              v-show="loadingSubTodo">
              <i class="el-icon-loading"></i>
              <span>加载中</span>
            </div>

            <Todo
              v-show="!loadingSubTodo"
              :group="group"
              :user="user"
              :asSubTodo=true
              @todoChange="todoChange"
              ref="childTodo"
            />

          </el-form>

        </div>

      </el-col>

      <el-col :span="6">
        <div class="grid-content bg-purple-light dialogAction" >
          <span style="margin-top:10px;">操作</span>
           <div style="margin-bottom:10px;">

             <el-popover
              placement="bottom"
              width="160"
              v-model="onFilePoint">
              <p>归档后，todo 将从列表中被移除，并不会被直接删除，是否继续归档？</p>
              <div style="text-align: right; margin: 0;margin-right:6px;">
                <el-button size="mini" type="text" @click="showDeleteDialog">直接删除</el-button>
                <el-button type="primary" size="mini"  @click="onFileItem">归档</el-button>
              </div>
              <el-button slot="reference" class="actionButton" size="medium" icon="el-icon-goods" plain>归档该 Todo</el-button>
            </el-popover>

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
      subTodos:this.todos,
      hasSubTodo:false,
      onFilePoint:false,
      // 正在更新数据
      updatingData:false,
      loadingSubTodo: false
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

		todos:{
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

  },
  mounted:function(){

  },
  watch: {
    todos(val) {
      console.log("filter change ");
      this.subTodos = val;//新增result的watch，监听变更并同步到myResult上
    },
    subTodos(val){
        //xxcanghai 小小沧海 博客园
        this.$emit("on-todos-change",val);//③组件内对myResult变更后向外部发送事件通知
    }
  },
	methods:{
    //status todo 发生的更改类型
    todoChange(status){
      const that = this
      setTimeout(function(){
        that.onSubmit(true);
      },100)
    },
    onFileItem(){
      const that = this
      this.onFileItemCallback(that.todo,function(res){
          that.dismiss()
          if(res>0){
            that.$message({
              type: 'success',
              message: '已归档 '+that.todo.title
            });
          }
      })
    },
    onFileItemCallback(todo,callback){
				const that = this
				const todoId = todo.objectId
				todo.onFile = !todo.onFile
				todo.onFileAt = new Date().toUTCString()
				this.updateTodo(todo,function(result){
					that.subTodos.splice(that.subTodos.findIndex(todo => todo.objectId === todoId),1)
          callback(1)
				})
		},

    showDeleteDialog(){
      const that = this
      this.$confirm('此操作将永久删除该 Todo, 是否继续?', '提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                that.deleteTodoCallback(this.todo,function(result){
                  that.dismiss()
                  if(result){
                    that.subTodos.splice(that.subTodos.findIndex(item => item.objectId === that.todo.objectId),1)
            				that.$message({
            					type: 'success',
            					message: '已删除 '+that.todo.title
            				});
                  }else{
                    that.$message({
            					type: 'warn',
            					message: '删除失败!'
            				});
                  }
                })
              }).catch(() => {

      });
    },

    deleteTodoCallback(todo,callback){
      const objectId = todo.objectId
      const api = host+"/todos/api/"+api_version+"/todos/"+objectId
      const config =
        {
            headers : {
                'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
            }
        }
      this.$http.delete(api,config).then(response => {
            callback(todo)
      }, response => {
        callback()
      });
    },


    fetchSubTodo(groupId) {
      const api = host+"/todos/api/"+api_version+"/todos/"+this.user.objectId+"/"+groupId
      this.loadingSubTodo = true
		  this.$http.get(api).then(response => {
        this.loadingSubTodo = false
        this.group.todos.results = response.body.results
        console.log("subTodo size "+this.group.todos.results.length);
        if(this.group.todos.results.length>0){
          this.hasSubTodo = true;
        }
        this.$refs.childTodo.updateTodos(this.group.todos.results)
			}, response => {
        this.loadingSubTodo = false
      });
    },
    //更新 todo 信息
    //quite 是否显示回调结果
    onSubmit(quite) {
      console.log("quite -> "+quite);
      const that = this
      this.todo.subTodoCount = that.$refs.childTodo.getCount();
      this.todo.subTodoCompletedCount = that.$refs.childTodo.getCompletedCount();
      if(!quite){
        this.updatingData = true;
      }
      this.updateTodo(this.todo,function(result,response){
        that.updatingData = false;
        if(quite){
          return;
        }

        that.$emit('hideEditor')
        if(response === undefined){
          that.$message({
            type: 'success',
            message: '更新成功'
          });
        }else{
          that.$message({
            type: 'warn',
            message: '更新失败 '+response.statusText
          });
        }
      })
    },
    dismiss() {
      this.$emit('hideEditor')
      this.hasSubTodo = false;
      this.onFilePoint = false;
      this.$refs.childTodo.clearTodos()
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

      for(var key in todo) {
        if(!(todo[key] instanceof Object) && todo[key] != undefined){
          console.log("update "+key+" to "+todo[key]);
          formData.append(key, todo[key]);
        }
      }

      this.$http.put(api, formData, config).then(response => {
          //编辑完的 todo 结果
          const editResult = response.body.entity;
          //更新当前的 todo
          this.subTodos.splice(this.subTodos.findIndex(todo => todo.objectId === todoId),1,editResult)
          // 将编辑完的结果回调回去
          callback(editResult)
        }, response => {
          callback(null,response)
        });
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
			 padding-left:10px;
			 padding-right:10px;
			 padding-bottom:10px;
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
    
    .normalLoading >i{
      text-align:center;
    }
    .normalLoading >span{
      text-align:center;
    }
</style>
