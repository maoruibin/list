<template>
  <el-dialog
  title="注册新账号"
  :show-close="false"
  :close-on-click-modal="false"
  :close-on-press-escape="false"
  :visible.sync="showRegister"
  width="50%">

  <el-form ref="ruleForm" :model="user" :rules="rules"  label-width="120px">
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="user.nickname"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="user.email"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="user.password" type="password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="passwordAgain">
      <el-input v-model="user.passwordAgain" type="password"></el-input>
    </el-form-item>
    <el-form-item>
     <el-button type="primary" @click="submitFrom('ruleForm')">确定</el-button>
     <el-button @click="cancel">取消</el-button>
   </el-form-item>
    <el-form-item>
      <el-button type="text" @click="login">已有账号，去登录</el-button>
   </el-form-item>
  </el-form>

</el-dialog>



</template>

<script>

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		props:{
      showRegister:{
        type:Boolean,
        required:true
      }
		},
		computed:{

		},
		data(){
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.user.passwordAgain !== '') {
            this.$refs.ruleForm.validateField('passwordAgain');
          }
          callback();
        }
      };

      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.user.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

			return{
          dialogVisible: false,
          user:{
            "username":'',
            "email":'',
            "password":'',
            "passwordAgain":'',
            "nickname":'',
          },
          rules:{
            nickname:[
              {required: true, message: '请输入昵称', trigger: 'blur'},
              { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
            ],
            email:[
              {required: true, message: '请输入邮箱地址', trigger: 'blur'},
              { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
            ],
            password: [
              { validator: validatePass, trigger: 'blur' }
            ],
            passwordAgain: [
               { validator: validatePass2, trigger: 'blur' }
            ],
          }
			}
		},
		methods:{
      login(){
        this.$emit('showLogin')
      },
      submitFrom(formName){
        const that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log('表单验证成功');
            that.registerByNet(function(user,setting,msg){
              that.$emit('callback',user,setting,msg)
            })
          } else {
            console.log('表单验证失败');
            return false;
          }
        });
      },
      registerByNet(callback){
        this.user.username = this.user.email
        const api = host+"/users/api/"+api_version+"/users"
        var formData = new FormData();
        for (var key in this.user) {
          formData.append(key,this.user[key]);
        }
        this.$http.post(api, formData).then((response) => {
              callback(response.body.user,response.body.setting,response.body.msg)
          }, (response) => {
              callback(null,null,response.body.msg)
          });

      },
      cancel(){
        this.$emit('showLogin')
      }
		}
	}
</script>

<style lang="stylus" scoped>

</style>
