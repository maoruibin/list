<template>
	<el-row :gutter="20"  style="border:0px solid #000;">
		<el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
		<el-col :span="16" style="border:0px solid #f00;">
			<div class="grid-content bg-purple" style="margin-top:8px;color:#ffffff;text-align:center;">TodayTodo - 那些要做的，以及想做的事</div>
		</el-col>
		<el-col :span="4">
			<div class="grid-content bg-purple">
				<el-dropdown style="float:right;margin-top:8px;" @command="handleCommand">
				  <span class="el-dropdown-link" style="color:#ffffff;">
				    {{this.user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
				  </span>
				  <el-dropdown-menu v-show="this.user != null" slot="dropdown">
				    <el-dropdown-item command="info">个人信息</el-dropdown-item>
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

	.el-row {
    margin-top: 10px;
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {

  }
  .bg-purple {

  }
  .bg-purple-light {

  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;

  }
</style>
