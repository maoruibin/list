<template>
	<div id="app">
		<div id="cover"></div>

		<Login />
		<Header/>
		<div v-if="user != null">
				<Todo/>
				<Footer/>
		</div>

	</div>
</template>

<script >
import Header from './todo/header.vue'
import Login from './todo/login.vue'
import Todo from './todo/todo.vue'
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
			Todo
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
        opacity 0.5
        z-index -1
    }
</style>
