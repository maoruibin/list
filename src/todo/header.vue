<template>
	<el-row style="border:0px solid red;margin-top:6px;">
		<el-col :span="6">
			<div class="grid-content left_top" style="border:0px solid black;">

				<el-dropdown class="titleItem" v-show="isSuperUser" show-timeout=100 @command="selectProject">
					<span class="el-dropdown-link" style="color:#ffffff;">
						{{project.name}}<i class="el-icon-arrow-down el-icon--right"></i>
					</span>

					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item
							v-for="project in projectList"
							:key="project.objectId"
							:command="project.objectId"
							>
							{{project.name}}
						</el-dropdown-item>
					</el-dropdown-menu>

				</el-dropdown>

			</div>
		</el-col>
		<el-col :span="12">
			<div class="grid-content center_title" style="border:0px solid black;">
				<span style="font-family: Tahoma;font-size:20px;">柳叶</span><span style="font-size:12px;">-Beta</span>
			</div>
		</el-col>
		<el-col :span="6"  >
			<div class="grid-content right_top" >
					<i
					class="headIcon el-icon-about"
					@click="showAboutApp"/>

					<el-tooltip effect="dark" content="欢迎大家来这里交流意见" placement="bottom">
						<i
						class="headIcon el-icon-fankuiyijian"
						@click="gotoOpinion"/>

					</el-tooltip>

					<i
						v-show="isSuperUser"
						class="headIcon el-icon-add"
						@click="addProject"/>

					<el-dropdown class="titleItem" @command="handleCommand" show-timeout=100>
						<span class="el-dropdown-link" style="color:#ffffff;">
							{{this.user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu v-show="this.user != null" slot="dropdown">
							<el-dropdown-item command="profile">个人信息</el-dropdown-item>
							<el-dropdown-item command="dashboard" v-show="isSuperUser">数据面板</el-dropdown-item>
							<el-dropdown-item command="logout">注销</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
			</div>
		</el-col>
	</el-row>


</template>
<script>
  export default {
		props:{
			project: {
				type: Object,
				required: true
			},
			user: {
				type: Object,
				required: true
			},
			settingLean: {
				type: Object,
				required: true
			},
			isSuperUser: {
				type: Boolean,
				required: true,
				default:false
			}
		},
		data(){
			return{
				projectList:[]
			}
		},
		mounted:function(){

		},

    methods: {
      showAboutApp() {
				console.log("showAbout")
				this.$emit('aboutAction')
			},
      gotoOpinion() {
				window.open('http://support.qq.com/products/30228');
			},
      updateProjectList(projectList) {
				console.log("updateProjectList size is "+projectList.length);
				this.projectList = projectList
			},
      appendProject(project) {
				console.log("add to list "+project.name);
				this.projectList.push(project)
			},
      addProject() {
				var last = this.projectList[this.projectList.length-1]
				var priority = 0
				if(last != undefined){
					priority = last.priority+1
				}

				console.log('priority '+priority);
				const project = {
					'priority':priority
				}

				this.$emit('addProject',project)
			},
      selectProject(id) {
				console.log('command is '+id);
				const that = this
				var project = this.projectList.find(function(item){
					return item.objectId === id
				})
				this.$emit('selectProject',project,function(result){
					if(result){
						that.project = result
					}
				})
			},
      handleCommand(command) {
				if(command === 'logout'){
					this.showLogoutDialog()
				}
				if(command === 'dashboard'){
					this.$emit('dashboard')
				}
				if(command === 'profile'){
					this.$emit('profile')
				}
      },
			showLogoutDialog(){
				this.$confirm('确定要注销当前用户吗?', '提示', {
          confirmButtonText: '注销',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					this.$emit('logout')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消'
          });
        });
			}
    }
  }
</script>
<style lang="stylus" scoped>
.el-col {
	border-radius: 0px;
}

.left_top {
	background: transparent;
	padding-left:12px;
}

.center_title {
	background: transparent;
	text-align: center;
}

.right_top {
	text-align: right;
	border:0px solid blue;
	display:flex;
	align-items:center;
	justify-content:flex-end;
}
.grid-content {
	border-radius: 0px;
}

.titleItem{
	vertical-align: middle;
	display: inline-block;
}

.headIcon{
	margin-right:10px;
	font-size:18px;
	border: 0px solid #000;
}

</style>
