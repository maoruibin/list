<template>
	<div id="app">
    <Login
			v-show="isShowLoginDialog"
			:showLogin="isShowLoginDialog"
			@callback="loginCallback"
			@showRegister="showRegister"
			@hideLoginDialog="hideLogin"/>

		<Register
			v-show="isShowRegisterDialog"
			:showRegister="isShowRegisterDialog"
			@callback="registCallback"
			@showLogin="showLogin"
			@hideRegisterDialog="hideRegister"/>

		<Profile
			v-show="isShowProfileDialog"
			:showProfile="isShowProfileDialog"
			:user="user"
			@settingChange="settingChange"
			@close="isShowProfileDialog = false"
			:settingLean="settingLean"
			/>

		<About
			v-show="isShowAboutDialog"
			@hideAboutDialog="hideAboutDialog"
			:showAboutDialog="isShowAboutDialog"/>


		<el-container>

			<el-header>
					<Header
					ref="header"
					:project="currentProject"
					:user="user"
					:settingLean="settingLean"
					:isSuperUser="isSuperUser"
					@logout="logout"
					@addProject="showAddProjectDialog"
					@selectProject="selectProject"
					@aboutAction="showAbout"
					@profile="showProfileDialog"
					@dashboard="showDashboard"/>
			</el-header>

			<el-main>
				 <router-view></router-view>
			</el-main>
		</el-container>
	</div>
</template>

<script>
import Header from './todo/header.vue'
import Login from './todo/login.vue'
import Register from './todo/register.vue'
import Profile from './todo/profile.vue'
import About from './todo/about.vue'
import Dashboard from './todo/dashboard.vue'

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

export default{
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
  components: {
    Login,
    Register,
    Header,
    Profile,
    About,
    Dashboard
  },
	computed:{

	},
	data(){
		return{
			flag:false,
		}
	},
	methods:{

	}
}
</script>

<style lang="stylus" scoped>

</style>
