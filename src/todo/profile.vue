<template>
  <el-dialog
  title="个人信息"
  :visible.sync="showProfile"
  :before-close="handleClose"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  width="50%">

  <el-form ref="ruleForm" :model="user" label-width="120px">
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
        <el-button style="border:0px solid red;float:right" @click="showEmailAction" >{{user.emailVerified?'修改':'重新发送激活邮件'}}</el-button>
      </el-col>

    </el-form-item>

    <el-form-item label="每日情况汇报">
      <el-tooltip effect="dark" content="开启后，每晚9点将会发送今日完成情况到注册邮箱" placement="bottom">
          <el-switch v-model="settingLean.emailEveryDayEnable" @change="emailEveryDay"></el-switch>
      </el-tooltip>

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
        required: false
      },
			user:{
				type: Object,
				required: false,
        default:{
          'nickname':''
        }
			},
      settingLean: {
				type: Object,
				required: false,
        default:{}
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
      },

		},
		data(){
			return{

			}
		},
		methods:{
      handleClose(){
        this.$emit("close");
      },
      showEmailAction(){
        const that = this
        if(this.user.emailVerified){
          this.$message({
            type: 'warning',
            message: '还在开发中...'
          });
        }else{
          //发送验证邮件
          const api = host+"/api/"+api_version+"/users/requestEmailVerify"
          var formData = new FormData();
          for (var key in this.user) {
            formData.append(key,this.user[key]);
          }
          this.$http.post(api, formData).then((response) => {
            this.$message({
              type: 'success',
              message: '已发送，请前往邮箱验证'
            });
            this.handleClose()
            }, (response) => {
              this.$message({
                type: 'warning',
                message: '发送邮箱验证失败，请检查你的邮箱地址是否正确。'
              });
              this.handleClose()
            });
        }
      },
      emailEveryDay(value){
        const that = this
        this.updateSettingByNet(function(setting,msg){
          if(setting != null){
            localStorage.setItem("settingLean",JSON.stringify(setting));
            that.$emit("settingChange",setting);
            that.$message({
              type: 'success',
              message: value?'已开启通知':'已关闭通知'
            });
          }else{
            that.$message({
              type: 'warning',
              message: '设置失败 '+msg
            });
          }
        })

      },
      updateSettingByNet(callback){
        const api = host+"/api/"+api_version+"/users/setting"
        var formData = new FormData();
        for (var key in this.settingLean) {
          formData.append(key,this.settingLean[key]);
        }
        this.$http.post(api, formData).then((response) => {
              callback(response.body.data,response.body.msg)
          }, (response) => {
              callback(null,response.body.msg)
          });
      },
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
