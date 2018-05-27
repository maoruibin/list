<template>
	<el-row :gutter="10">
		<el-col :span="6">
			<div class="grid-content left_top">
				<span style="font-family: Tahoma;font-size:large;">TodayTodo</span><span style="font-size:x-small;">-Beta</span>
			</div>
		</el-col>
		<el-col :span="12">
			<div class="grid-content center_title">
				<span>那些要做的以及想做的事情、计划</span>
			</div>
		</el-col>
		<el-col :span="6">
			<div class="grid-content right_top">

					<el-dropdown class="titleItem" @command="handleCommand" show-timeout=100>
						<span class="el-dropdown-link" style="color:#ffffff;">
							{{this.user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
						</span>
						<el-dropdown-menu v-show="this.user != null" slot="dropdown">
							<el-dropdown-item command="info">个人信息</el-dropdown-item>
							<el-dropdown-item command="dashboard">数据面板</el-dropdown-item>
							<el-dropdown-item command="logout">注销</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
			</div>
		</el-col>
	</el-row>


</template>
<script>
  export default {
		data(){
			return{
				user:{}
			}
		},
		mounted:function(){
	    this.user = JSON.parse(localStorage.getItem("user"))
	    if(!this.user){
	      return
	    }
		},

    methods: {
      handleCommand(command) {
				if(command === 'logout'){
					this.showLogoutDialog()
				}
				if(command === 'dashboard'){
					this.$emit('dashboard')
				}
      },
			showLogoutDialog(){
				this.$confirm('确定要注销当前用户吗?', '提示', {
          confirmButtonText: '注销',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
					localStorage.removeItem('user');
					location.reload();

          this.$message({
            type: 'success',
            message: '注销成功!'
          });
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
	padding-right: 12px;
}
.grid-content {
	border-radius: 0px;
	min-height: 56px;
	line-height: 56px;
}

.titleItem{
	vertical-align: middle;
	display: inline-block;
}


.el-row{
	border: 0px solid #000;
}

</style>
