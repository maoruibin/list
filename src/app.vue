<template>
	<div id="app">
		<div id="cover"></div>

		<Login />

		<el-container>
			<Header/>
			<Container v-show="user"/>
			<el-footer>
				<div class="footer"style="margin-top:10px;">
					<span >
						Design by <a href="http://gudong.name/" target="_blank">咕咚</a>

						&nbsp;&nbsp;Thanks <a href="https://www.imooc.com/t/3083408" target="_blank">Jokcy</a>
					</span>
					<div>
						<a href="https://github.com/maoruibin/TodayTodo" target="_blank">source</a>
					</div>


				</div>

			</el-footer>
		</el-container>


	</div>


</template>

<script >
import Header from './todo/header.vue'
import Login from './todo/login.vue'
import Todo from './todo/todo.vue'
import Container from './todo/container.vue'
import Footer from './todo/footer.jsx'
	export default{
		data(){
			return{
				user:JSON.parse(localStorage.getItem("user"))
			}
		},
		components: {
			Login,
			Header,
			Footer,
			Todo,
			Container
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
		.footer span{
			color: #d3d7d4;
		}
		.footer a{
			text-decoration none;
			color: #fffffb;
		}
</style>
