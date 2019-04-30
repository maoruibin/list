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
           label-position="top"
           style="">
            <el-form-item label="名称" size="medium" style="">
              <el-input style="border:0px solid red;" v-model="todo.title"></el-input>
            </el-form-item>

            <el-form-item label="标签" size="medium">
              <div >
                <el-tag
                  :key="tag"
                  size="medium"
                  v-for="tag in todo.tags"
                  :color="tag.color"
                  closable
                  style="color:#FFFFFF;"
                  :disable-transitions="false"
                  @close="handleClose(tag)">
                  {{tag.name}}
                </el-tag>

                <el-autocomplete
                 popper-class="tag-autocomplete"
                 v-if="inputTagVisible"
                 v-show="!isTagsOverCount"
                 v-model="inputTag.name"
                 ref="saveTagInput"
                 @keyup.enter.native="handleInputTagConfirm"
                 :fetch-suggestions="querySearch"
                 style="width:80px;"
                 @select="handleSelect">

                  <template slot-scope="{ item }">

                    <span class="itemTagName" :style="{'color': item.color}">{{ item.name }}</span>

                  </template>

               </el-autocomplete>

                <el-button v-else v-show="!isTagsOverCount" class="button-new-tag" size="small" @click="showInputTag">+ 添加</el-button>
              </div>

            </el-form-item>

            <el-form-item label="详情备注" size="medium" >
                  <el-input 
                    type="textarea"
                    v-if="inputContentVisible"
                    autofocus=true
                    ref="backup"
                    @blur="showInputContent"
                    @keyup.esc.native="showInputContent"
                    :autosize="{ minRows: 3, maxRows: 15}"
                    style="line-height: 1;"
                    v-model="todo.content"/>

                  <el-row :gutter="20"
                    style="border:1px #dddede solid; border-radius: 4px;margin-left:4px;margin-right:4px;padding-top:6px;"
                    v-show="!inputContentVisible">
                  <div
                      class="grid-content bg-purple"
                      style="line-height: 20px;border:0px #ffffff solid;color:#636363;font-weight:400;"
                      @click="showInputContent"
                      v-html="todo.content != undefined && todo.content.length != 0 ? mdToHtml(todo.content): '点击添加描述' "/>

               </el-row>
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
            style="margin-top:10px;padding:0px;display:none;">
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
// import Vue from 'vue'
import Todo from './todo.vue'

// import { VueShowdown } from 'vue-showdown'
// Vue.component('VueShowdown', VueShowdown)

var showdown  = require('showdown')
let converter = new showdown.Converter()

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
      loadingSubTodo: false,
      nowTime:'',
      inputTagVisible: false,
      inputContentVisible: false,
      // 是否已经点击了保存按钮
      hasSaveData: false,
      
      allTags:[],
      inputTag: {
        "name":"",
        "color":'#4D4F4E'
      },
      predefineColors: [
          '#f44336',
          '#9C27B0',
          '#3F51B5',
          '#2196F3',
          '#009688',
          '#4CAF50',
          '#FFEB3B',
          '#FF9800',
          '#FF5722',
          '#795548',
          '#607D8B'
        ]
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
    // tag 数量是否超过三个
    isTagsOverCount(){
			return this.todo.tags.length >= 3;
		}
  },
  mounted:function(){
    var hour = new Date().getHours();
    var min = new Date().getMinutes();
    var res = parseInt(min/15)
    var resLeft = min%15
    min = res * 15
    if(resLeft>=8){
      min+=15
    }
    if(min<10){
      min = '0'+min
    }
    this.nowTime = hour+":"+min
    this.fetchAllTags();

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
    
    urlify(text) {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.replace(urlRegex, function(url) {
          return '<a target="_blank" href="' + url + '">' + url + '</a>';
      })
    },

    mdToHtml(text) {
      return converter.makeHtml(text);
    },

    querySearch(queryString, cb) {
        var allTags = this.allTags;
        var results = queryString ? allTags.filter(this.createFilter(queryString)) : allTags;
        // 调用 callback 返回建议列表的数据
        cb(results);
    },

    createFilter(queryString) {
        return (item) => {
          return (item.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },

    // tag 被删除
    handleClose(tag) {
        this.todo.tags.splice(this.todo.tags.indexOf(tag), 1);

        this.updateTodo(this.todo)
    },
    showInputTag() {
        this.inputTagVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

    showInputContent() {
        this.inputContentVisible = !this.inputContentVisible;
        if(this.inputContentVisible){
          // this.$refs.backup.focus();

        }
    },

    handleSelect(item) {
      this.todo.tags.push(item);
      this.inputTagVisible = false;
      this.inputContentVisible = false;
      this.inputTag.name = '';
      const that = this
      this.updateTodo(this.todo,function(result){
        that.checkTagCountAndPoint();
      })
    },
    
    checkTagCountAndPoint(){
      if(this.todo.tags.length == 3){
        this.$message({
          type: 'warning',
          message: "不能继续添加标签了，标签不能多于三个"
        });
      }
    },
    
    //生成从minNum到maxNum的随机数
    randomNum(minNum,maxNum){ 
        switch(arguments.length){ 
            case 1: 
                return parseInt(Math.random()*minNum+1,10); 
            break; 
            case 2: 
                return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
            break; 
                default: 
                    return 0; 
                break; 
        } 
    },
    
    handleInputTagConfirm() {
      this.inputTag.userId = this.user.objectId;
      //随机选一个颜色
      this.inputTag.color = this.predefineColors[this.randomNum(0,this.predefineColors.length-1)];
      const that = this;
      this.createTags(this.inputTag,function(result,msg){
        if(result != undefined){
          that.todo.tags.push(result);
          that.allTags.push(result);
          that.inputTagVisible = false;
          that.inputContentVisible = false;
          that.inputTag.name = '';
          that.checkTagCountAndPoint();
          that.updateTodo(that.todo)
        }else{
          that.$message({
            type: 'fail',
            message: msg
          });
        }
      });
    },

    fetchAllTags(){
      this.user = JSON.parse(localStorage.getItem("user"))
      const apiTagsAll = host+"/api/"+api_version+"/tags/"+this.user.objectId
      this.$http.get(apiTagsAll).then(response => {
          this.allTags = response.body.data
          this.allTags.forEach(function(item){
            item.value = item.name
          })

        }, response => {

        });
    },

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
				todo.onFileAt = Number(new Date())
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

    createTags(tag,callback){
      const api = host+"/api/"+api_version+"/tags"
      const config = {
          headers : {
              'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
          }
      }
      //拼装参数
      var formData = new FormData();
      for(var key in tag) {
        if(tag[key] != undefined){
          console.log("create tag "+key+" to "+tag[key]);
          formData.append(key, tag[key]);
        }
      }

      this.$http.post(api,formData,config).then(response => {
            callback(response.body.data)
      }, response => {
        callback(null,response.body.msg)
      });
    },


    deleteTodoCallback(todo,callback){
      const objectId = todo.objectId
      const api = host+"/api/"+api_version+"/todos/"+objectId
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
      const api = host+"/api/"+api_version+"/todos/groups/"+this.user.objectId+"/"+groupId
      this.loadingSubTodo = true
		  this.$http.get(api).then(response => {
        this.loadingSubTodo = false
        this.group.todos.results = response.body.data.results
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
      this.hasSaveData = true
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

        // that.$emit('hideEditor')
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

      this.inputTagVisible = false;
      this.inputContentVisible = false;
      this.inputTag.name = '';
    },

    updateTodo(todo,callback){
      var todoId = todo.objectId

      const api = host+"/api/"+api_version+"/todos/"+todoId
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

      // 格式化 tags
      let tagCount = todo.tags.length;
      if(tagCount > 0){
        let tagArray = ''
        for (var i=0;i<tagCount;i++){
            tagArray += todo.tags[i]['objectId']
            if(i<tagCount-1){
              tagArray += ','
            }
        }
        formData.append("tags", tagArray);
      }


      this.$http.put(api, formData, config).then(response => {
          //编辑完的 todo 结果
          const editResult = response.body.data;
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
    /* begin tag */

    .input-new-tag {
      width: 90px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    /* end tag */

		.bg-purple {
			 background: #eff1f3;
		 }
		 .bg-purple-light {
			 background: #eff1f3;
		 }
		 .grid-content {
			 border-radius: 4px;
       border: 0px red solid;
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
    .el-form-item {
      border:0px solid blue;
      padding-bottom:0px;
    }

    .tag-autocomplete {
      li {
        line-height: normal;
        padding: 7px;

        .itemTagName {
          text-overflow: ellipsis;
          overflow: hidden;
          font-size: 12px;
          color: #b4b4b4;
        }

        .highlighted .itemTagName {
          color: #ddd;
        }
      }
    }
</style>
