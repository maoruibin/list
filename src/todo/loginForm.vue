<template>
  <el-dialog
  title="登录"
  @close="dismiss"
  :visible.sync="showLoginDialog"
  width="50%">

  <el-form ref="ruleForm" :model="user" :rules="rules"  label-width="80px">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="user.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" type="password"></el-input>
    </el-form-item>
    <el-form-item>
     <el-button type="primary" @click="submitFrom('ruleForm')">确定</el-button>
     <el-button @click="cancel">取消</el-button>
   </el-form-item>
    <el-form-item>
      <el-button type="text" @click="guestVisitor">访客模式登录</el-button>
   </el-form-item>
  </el-form>

</el-dialog>



</template>

<script>

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		props:{
      showLoginDialog:{
        type: Boolean,
        required: true
      },

		},
		computed:{

		},
		data(){
			return{
          user:{
            "username":'',
            "password":'',
          },
          rules:{
            username:[
              {required: true, message: '请输入用户名', trigger: 'blur'},
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ],
            password:[
              {required: true, message: '请输入密码', trigger: 'blur'},
              { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
            ],
          }
			}
		},
		methods:{
      guestVisitor(){
        this.user.username = 'guest@163.com'
        this.user.password = '666999'
        this.submitFrom('ruleForm')
      },
      submitFrom(formName){
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            that.loginByNet(function(user,msg){
              that.$emit('loginCallback',user,msg)
              that.dismiss()
            })
          } else {
            console.log('表单验证失败');
            return false;
          }
        });
      },
      loginByNet(callback){
        const api = host+"/users/api/"+api_version+"/login"
        var formData = new FormData();
        for (var key in this.user) {
          formData.append(key,this.user[key]);
        }
        this.$http.post(api, formData).then((response) => {
              callback(response.body.user,response.body.msg)
          }, (response) => {
              callback(null,response.body.msg)
          });
      },
      cancel(){
        this.dismiss();
      },
      dismiss() {
        // this.$emit('hideLoginDialog')
        this.showLoginDialog = false;
      },
		}
	}
</script>

<style lang="stylus" scoped>

</style>
