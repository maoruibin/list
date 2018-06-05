<template>
  <el-dialog
  title="个人信息"
  :visible.sync="showProfile"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  width="50%">

  <el-form ref="ruleForm" :model="user" label-width="60px">
    <el-form-item label="昵称" prop="nickname">
    <el-col :span="16" :gutter="20" style="border:0px solid red;">
      <el-input v-model="user.nickname" disabled></el-input>
    </el-col>
    <el-col :span="8">
      <el-button style="border:0px solid red;float:right" @click="showEditNick">编辑</el-button>
    </el-col>

    </el-form-item>
    <el-form-item label="邮箱" prop="email" :error="emailCheck">
      <el-col :span="16" :gutter="20" style="border:0px solid red;">
        <el-input v-model="emailInput" disabled></el-input>
      </el-col>

      <el-col :span="8">
        <el-button style="border:0px solid red;float:right" @click="showEditNick" >{{user.emailVerified?'修改':'去邮箱查看'}}</el-button>
      </el-col>

    </el-form-item>


  </el-form>

</el-dialog>


</template>

<script>

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		props:{
      showProfile:{
        type: Boolean,
        required: true
      },
			user:{
				type: Object,
				required: true
			},
      settingLean: {
				type: Object,
				required: true
			},
		},
		computed:{
      emailCheck(){
        if(!this.user.emailVerified){
          return ""
        }else{
          return ""
        }
      },
      emailInput(){
        if(this.user.emailVerified){
          return this.user.email
        }else{
          return this.user.email+"(尚未激活)"
        }
      }
		},
		data(){
			return{

			}
		},
		methods:{
      showEditNick(){
        this.$message({
          type: 'warning',
          message: '还在开发中...'
        });
      }
		}
	}
</script>

<style lang="stylus" scoped>

</style>
