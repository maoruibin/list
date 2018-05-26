<template>
	<div id="app">
		<div id="cover"></div>

		<Login />

		<el-container>
			<el-header>
					<Header @dashboard="showDashboard"/>
			</el-header>

			<el-main >
				<Container v-show="!dashboard"/>
				<Dashboard v-show="dashboard" ref="dashboard"/>
		  </el-main>

			<el-footer>
				<Footer/>
			</el-footer>
		</el-container>


	</div>


</template>

<script >
import Header from './todo/header.vue'
import Login from './todo/login.vue'
import Todo from './todo/todo.vue'
import Dashboard from './todo/dashboard.vue'
import Container from './todo/container.vue'
import Footer from './todo/footer.vue'
	export default{
		data(){
			return{
				user:JSON.parse(localStorage.getItem("user")),
				dashboard:false
			}
		},
		components: {
			Login,
			Header,
			Footer,
			Todo,
			Dashboard,
			Container
		},
		methods:{
			showDashboard:function(){
				this.dashboard = !this.dashboard
				if(this.dashboard){
					console.log("刷新数据");
					this.$refs.dashboard.refresh()
				}

			}
		}
	}
</script>



<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>
    #app {
        position absolute
        left 0
        right 0
        top 0
        bottom 0
    }
    #cover {
        position absolute
        left 0
        right 0
        top 0
        bottom 0
        background-color #555
        opacity 0.0
        z-index -1
    }

</style>
