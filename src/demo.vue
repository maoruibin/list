<template>
	<el-container>
		<el-header>

			<el-row :gutter="10">
			  <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
			  <el-col :span="16"><div class="grid-content bg-purple-light"></div></el-col>
			  <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
			</el-row>

		</el-header>
		<el-main>Main</el-main>
		<el-footer>Footer</el-footer>
	</el-container>
</template>

<script >
import Header from './todo/header.vue'
	export default{
		data(){
			return{
				user:JSON.parse(localStorage.getItem("user"))
			}
		},
		components: {
			Header
		}
	}
</script>

<!-- 设置scoped 表示当前组件下的id只在当前组件起作用，不会跟其他组件引起冲突 -->
<style lang="stylus" scoped>
.el-col {
	border-radius: 0px;
}
.bg-purple-dark {
	background: #99a9bf;
}
.bg-purple {
	background: #d3dce6;
}
.bg-purple-light {
	background: #e5e9f2;
}
.grid-content {
	border-radius: 0px;
	min-height: 60px;
}

.el-header {
	background-color: #455A64;
	color: #fff;
	border: 1px solid #f00;
	padding:0px;
}
.el-row{
	border: 1px solid #000;
}
.el-footer {
	background-color: #455A64;
	color: #fff;
	text-align: center;
	line-height: 56px;
}

.el-main {
	 background-color: #78909C;
	 color: #fff;
	 height:600px;
 }

body > .el-container {
    margin-bottom: 0px;

}


</style>
