<template>

  <div :class="['login_bk',hasLogin ? '':'login']">
    <div class="container">
      <div v-if="inLoginMode" class="inputForm">
        <form @submit.prevent="submitLogin" >
          <p>用户名：<input v-model="user.username" type="text" placeholder="请输入账号"></p>
          <p>密&nbsp;&nbsp;&nbsp;码：<input v-model="user.password" type="password" placeholder="请输入密码"></p>
          <p><input class="action" type="submit" value="登录"/></p>
          <p class="error">{{msg}}</p>
          <p class="userChoise"><a href="#" @click="guestLogin">游客模式访问</a></p>
          </br>
          <p class="userChoise">还没有账号，<a href="#" @click="showRegister">去注册</a></p>


        </form>


      </div>
      <div v-else class="inputForm">
        <form @submit.prevent="submitRegister" >
          <p>昵称：<input v-model="user.nickname" type="text" placeholder="请输入昵称"></p>
          <p>邮箱：<input v-model="user.email" type="text" placeholder="请输入邮箱"></p>
          <p>密码：<input v-model="user.password" type="password" placeholder="请输入密码"></p>
          <p>确认：<input v-model="user.password_again" type="password" placeholder="请确认密码"></p>
          <p><input class="action" type="submit" value="注册"/></p>
          <p class="error">{{msg}}</p>
          <p class="userChoise">已有账号，<a href="#" @click="showLogin">直接登录</a></p>

        </form>
      </div>
    </div>
  </div>

</template>
<script>
  let host = process.env.API_HOST
  let api_version = process.env.API_VERSION
  export default{
    data(){
      return{
        inLoginMode:true,
        hasLogin:false,
        msg:"",
        user: {
            username: '',
            password: '',
            nickname: '',
            email: '',
            password_again: '',
        }
      }
    },
    created:function(){
      console.log("login create");
    },
    mounted:function(){
      console.log("login mounted");
      this.hasLogin = JSON.parse(localStorage.getItem("user")) != null
    },
    methods:{
      test(){
        console.log("test");
      },
      showRegister(){
        this.msg = ''
        this.inLoginMode = false;
      },
      guestLogin(){
        this.user.username = 'guest@163.com'
        this.user.password = '666999'
        this.submitLogin()
      },
      showLogin(){
        this.msg = ''
        this.inLoginMode = true;
      },
      submitLogin(event){
        if (this.user.username.length < 6 || this.user.password.length < 6) {
            this.msg = '格式不正确！'
            return;
        }
        const api = host+"/users/api/"+api_version+"/login"
        // var formData = JSON.stringify(this.user);
        var formData = new FormData();
        for (var key in this.user) {
          formData.append(key,this.user[key]);
        }
        this.$http.post(api, formData).then((response) => {
              // success callback
              this.msg = response.body.msg
              localStorage.setItem("user",JSON.stringify(response.body.user))
              this.hasLogin = true
              location.reload()
          }, (response) => {
              // error callback
              this.msg = response.body.error
          });
      },
      submitRegister(event){
        if (
           this.user.nickname.length <= 0 ||
           this.user.email.length <=0 ||
           this.user.password.length <=0 ||
           this.user.password_again.length <=0) {
            this.msg = '输入不能为空'
            return;
        }
        if( this.user.password.length <6){
          this.msg = '密码不能少于6位'
          return;
        }
        if( this.user.password != this.user.password_again){
          this.msg = '两次输入的密码不一致'
          return;
        }
        var emailReg=/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
        if(!emailReg.test(this.user.email)){
            this.msg = '请检查邮件格式'
            return;
      　}
        this.user.username = this.user.email
        const api = host+"/users/api/"+api_version+"/users"
        var formData = new FormData();
        for (var key in this.user) {
          formData.append(key,this.user[key]);
        }
        this.$http.post(api, formData).then((response) => {
              this.msg = response.body.msg
              localStorage.setItem("user",JSON.stringify(this.user))
              this.hasLogin = true
              location.reload()
          }, (response) => {
              this.msg = response.body.error
          });
      }
    }
  }
</script>
<style lang="stylus" scoped>
    .login_bk{
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      z-index 1
      background-color: #000;
      opacity: 0.7;
      display: none;
      &.login{
          display:block
      }
    }
    .container{
      width: 600px;
      height: 400px;
      position: fixed;
      left: 50%;
      top: 50%;
      margin-left: -300px;
      margin-top: -200px;
      background-color: #fff;
      border:0px solid blue;
    }
    .error{
      color: red;
    }
    .userChoise{
      color: #3e4145;
      fontSize:12px;
    }
    .inputForm{
      position absolute
      left 0
      right 0
      top 0
      bottom 0
    }
    form{
      border:0px solid red;
      width:300px;
      height:200px;
      position: inherit;
      left: 50%;
      top: 50%;
      margin-left: -150px;
      margin-top: -100px;
    }
    input{
      width:200px;

    }
    .action{
      width:60px;
      height:40px;
    }
</style>
