<template>
	<el-card shadow="always" style="margin-bottom:12px;">
				<el-input
				v-model="input"
				ref="inputForm"
				clearable = true
				autofocus = true
				@keyup.enter.native="addTodo"
				@keyup.esc.native="escInput"
				placeholder="请输入要做的事">
			</el-input>
			<div class="bottom">
				 <el-button type="primary" size="small" plain @click="addTodo" :disabled="inRequest">确定</el-button>
				 <i class="el-icon-close" style="margin-left:12px;color: #a8a8a8;" @click="hideAddForm"></i>
				 <i :class="['more', showMoreAction?'el-icon-arrow-up':'el-icon-arrow-down']"  @click="showMore"></i>
			</div>
			<div class="bottom" style="margin-top:24px;" v-show="showMoreAction">

				<el-checkbox
					v-model="insertEnd"
					style="font-size:0.5em;font-weight:340;color:#636363">
					追加 todo 到列表末尾
				</el-checkbox>
			</div>
	</el-card>
</template>

<script>

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
			}
		},
		computed:{

		},
		data(){
			return{
				input: '',
				showMoreAction: false,
				insertEnd: false,
				inRequest: false,
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
				this.input= ''
				this.focus()
				this.inRequest = false
				this.insertEnd = false

			},
			// 添加一个 todo
			addTodo(){
				if(this.input.length == 0){
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
				formData.append('title', this.input.trim());
				formData.append('content', '');
				formData.append('groupId', this.group.objectId);
				formData.append('priority', priority);
				formData.append('completed', 'false');
				formData.append('onFile', 'false');
				formData.append('userId', this.user.objectId);

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
