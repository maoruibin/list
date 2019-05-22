<template>
  <el-dialog
  title="柳叶 - 有条有理每一天"
  @close="dismiss"
  :visible.sync="showAboutDialog"
  width="50%">
  <div class="footer" style="text-align:center">


    <span >
      Design by <a href="http://gudong.name/" target="_blank">咕咚</a>
    </span>
    <div>
      Thanks <a href="https://www.imooc.com/t/3083408" target="_blank">Jokcy</a>
    </div>
    <div>
      <a href="https://leancloud.cn/" target="_blank">leancloud</a> &nbsp;&nbsp;<a href="http://element.eleme.io/#/" target="_blank">element</a> &nbsp;&nbsp;<a href="https://cn.vuejs.org/v2/guide/syntax.html" target="_blank">vue</a>
    </div>
    <br>
    <div>
      <a class="bottom" href="https://github.com/maoruibin/liuye" target="_blank">开放 Api</a>
      &nbsp;&nbsp;
      <a class="bottom" href="https://github.com/maoruibin/liuye/issue" target="_blank">意见反馈</a>
      <!-- http://support.qq.com/products/30228 -->
    </div>
  </div>


</el-dialog>



</template>

<script>

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		props:{
      showAboutDialog:{
        type: Boolean,
        required: true
      },

		},
		computed:{

		},
		data(){
			return{
				dialogVisible: false
			}
		},
		methods:{
      dismiss() {
        this.$emit('hideAboutDialog')
        this.dialogVisible = false;
      },
		}
	}
</script>

<style lang="stylus" scoped>

  .footer span{
    color: #636363;
  }
  .footer a{
    text-decoration none;
    color: #409EFF;
  }

  .bottom{
    font-size:10px;
  }
</style>
