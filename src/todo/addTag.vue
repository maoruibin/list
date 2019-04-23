<!-- 模板 -->
<template>
<div>
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
                 size="small"
                 @keyup.enter.native="handleInputTagConfirm"
                 :fetch-suggestions="querySearch"
                 style="width:80px;"
                 @select="handleSelect">

                  <template slot-scope="{ item }">

                    <span class="itemTagName" :style="{'color': item.color}">{{ item.name }}</span>

                  </template>

               </el-autocomplete>

                <el-button v-else v-show="!isTagsOverCount" type="text" class="button-new-tag" size="small" @click="showInputTag">+ 标签</el-button>
</div>
</template>

<!-- 逻辑 -->
<script>
let host = process.env.API_HOST
let api_version = process.env.API_VERSION
export default{
    data(){
        return{
            inputTagVisible: false,
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
        user:{
			type: Object,
			required: true
        },
        allTags:{
            type: Array,
			required: true
        }
    },
    mounted:function(){
        
    },
    computed: {
        // tag 数量是否超过三个
        isTagsOverCount(){
            return this.todo.tags.length >= 3;
        }
    },
    methods: {
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
        handleSelect(item) {
            this.todo.tags.push(item);
            this.inputTagVisible = false;
            this.inputTag.name = '';
            console.log(item)
        },
        // tag 被删除
        handleClose(tag) {
            this.todo.tags.splice(this.todo.tags.indexOf(tag), 1);
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
                    that.inputTag.name = '';
                }else{
                that.$message({
                    type: 'fail',
                    message: msg
                });
                }
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
                formData.append(key, tag[key]);
                }
            }

            this.$http.post(api,formData,config).then(response => {
                    callback(response.body.data)
            }, response => {
                callback(null,response.body.msg)
            });
        },

        showInputTag() {
            this.inputTagVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
                
    },
}

</script>
<!-- 样式 -->
<style lang="stylus" scoped>
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