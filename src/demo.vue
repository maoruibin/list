<template>
	<div>
		<el-container>
			<Header/>
			<Container/>
			<el-footer><span  @click="dialogVisible = true"> Design by 咕咚</span></el-footer>
		</el-container>



		<el-dialog
		  title="提示"
		  :visible.sync="dialogVisible"
		  width="30%"
		  :before-close="handleClose">
		  <span>这是一段信息</span>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
		  </span>
		</el-dialog>


	</div>

</template>

<script >
import Header from './todo/header.vue'
import Container from './todo/container.vue'
import Footer from './todo/footer.vue'
import FooterJsx from './todo/footer.jsx'
	export default{
		data(){
			return{
				user:JSON.parse(localStorage.getItem("user")),
				dialogVisible: false
			}
		},
		components: {
			Header,
			Container,
			Footer,
			FooterJsx
		},
		mounted:function(){

		},
		methods: {

    }
	}
</script>

<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>

</style>
