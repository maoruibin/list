<template>
	<el-card shadow="always" style="margin-bottom:12px;">
				<el-input
				v-model="todo.title"
				ref="inputForm"
				clearable = true
				autofocus = true
				@keyup.enter.native="addTodo"
				@keyup.esc.native="escInput"
				placeholder="请输入要做的事">
			</el-input>
			<div class="bottom">
				<AddTag
					:todo="todo"
					:allTags="allTags"
					:user="user"
					ref="addTag"/>
			</div>
			<div class="bottom">
				 <el-button  type="text" @click="addTodo" :disabled="inRequest">确定</el-button>
				 <i class="el-icon-close" style="margin-left:12px;color: #a8a8a8;" @click="hideAddForm"></i>
				 <i :class="['more', showMoreAction?'el-icon-arrow-up':'el-icon-arrow-down']"  @click="showMore"></i>
			</div>
			<div class="bottom" style="margin-top:24px;" v-show="showMoreAction">

				<el-checkbox
					v-model="insertEnd"
					style="font-size:0.5em;font-weight:340;color:#636363">
					追加至末尾
				</el-checkbox>
			</div>
	</el-card>
</template>

<script>
import AddTag from './addTag.vue'
let host = process.env.API_HOST
let api_version = process.env.API_VERSION



export default{
	props:{
		group: {
			type: Object,
			required: true
		},
		user: {
			type: Object,
			required: true
		},
		length: {
			type: Number,
			required: true,
			default:0
		},
		allTags:{
            type: Array,
			required: true
        }
	},
	components:{
		AddTag,
	},

	computed:{

	},
	data(){
		return{
			showMoreAction: false,
			insertEnd: false,
			inRequest: false,
			todo:{
				"title":"",
				"tags":[]
			}
		}
	},
	methods:{
		hideAddForm:function(){
			this.$emit('hideAddForm')
		},
		escInput:function(){
			this.$emit('hideAddForm')
		},
		showMore:function(){
			this.showMoreAction = !this.showMoreAction
		},
		focus:function(){
			this.$refs.inputForm.focus()
		},
		reset:function(){
			this.todo.title= ''
			this.todo.tags = []
			this.focus()
			this.inRequest = false
			this.insertEnd = false

		},
		// 添加一个 todo
		addTodo(){
			if(this.todo.title.length == 0){
				this.$message({
					type: 'info',
					message: '输入不能为空'
				});
				return
			}
			// 检查邮件是否已验证
			if(!this.user.emailVerified){
				this.$message({
					type: 'warning',
					message: '请及时激活你的邮箱。'
				})
			}

			const api = host+"/api/"+api_version+"/todos"
			var that = this
			//insertEnd
			//新增 todo 的排序 index 就是当前 todo 的大小
			var priority = this.length
			if(this.insertEnd){
					priority = 0;
			}
			console.log("priority is "+priority);
			var formData = new FormData();
			formData.append('title', this.todo.title.trim());
			formData.append('content', '');
			formData.append('groupId', this.group.objectId);
			formData.append('priority', priority);
			formData.append('completed', 'false');
			formData.append('onFile', 'false');
			formData.append('userId', this.user.objectId);

			// 格式化 tags
			let tagCount = this.todo.tags.length;
			if(tagCount > 0){
				let tagArray = ''
				for (var i=0;i<tagCount;i++){
					tagArray += this.todo.tags[i]['objectId']
					if(i<tagCount-1){
						tagArray += ','
					}
				}
				formData.append("tags", tagArray);
			}

			this.inRequest = true
			// POST /someUrl
			this.$http.post(api, formData).then(response => {
				this.$emit('addTodo',response.body.data,this.insertEnd)
				this.reset()
			}, response => {
				this.reset()
			});

		}
	}
}
</script>

<style lang="stylus" scoped>
.bottom {
	margin-top: 12px;
	line-height: 12px;
	border:0px solid red;
}

.more{
	border:0px solid black;
	text-align: center;
	line-height: 12px;
	float:right;
	margin-top:10px;
	cursor:pointer;
	color:#a8a8a8;
}

.el-checkbox__label{
	font-size:10px;
}



</style>
