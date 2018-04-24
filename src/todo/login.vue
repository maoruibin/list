<template>
  <div class="login_bk">
    <div class="container">
      <div v-if="inLoginMode">
        <form action="/server_url" method="post">
          <p><input v-model="username" type="text" placeholder="请输入账号"></p>
          <p><input v-model="password" type="password" placeholder="请输入密码"></p>
        </form>
      </div>
      <div v-else>
        <form action="/server_url" method="post">
          <p><input v-model="nickname" type="text" placeholder="请输入昵称"></p>
          <p><input v-model="email" type="text" placeholder="请输入邮箱"></p>
          <p><input v-model="password" type="password" placeholder="请输入密码"></p>
          <p><input v-model="password_again" type="password" placeholder="请确认密码"></p>
        </form>
      </div>
      <p>
        <button id="btn-submit" @click="login">登录</button>
        <button id="btn-regist" @click="register">注册</button>
      </p>
    </div>
  </div>

</template>
<script>
  export default{
    data(){
      return{
        username:'',
        password:'',
        nickname:'',
        email:'',
        password_again:'',
        inLoginMode:true
      }
    },
    created:function(){
      console.log("login create");
    },
    mounted:function(){
      console.log("login mounted");
    },
    methods:{
      test(){
        console.log("test");
      },
      login(event){
        if(!this.inLoginMode){
          this.inLoginMode = true;
          return
        }
        if (this.username.length < 6 || this.password.length < 6) {
            alert('格式不正确！');
            return;
        }
      },
      register(event){
        if(!this.inLoginMode){
          alert('注册账号');
          return
        }
        this.inLoginMode = false;
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
    }
</style>
