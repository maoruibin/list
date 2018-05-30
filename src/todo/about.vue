<template>
  <el-dialog
  title="TodayTodo - 那些要做的以及想做的事情、计划"
  @close="dismiss"
  :visible.sync="showAboutDialog"
  width="50%">
  <div class="footer"style="text-align:center">
    <div >

    </div>

    <span >
      Design by <a href="http://gudong.name/" target="_blank">咕咚</a>
    </span>
    <div>
      Thanks <a href="https://www.imooc.com/t/3083408" target="_blank">Jokcy</a>
    </div>
    <div>
      <a href="https://leancloud.cn/" target="_blank">leancloud</a> &nbsp;&nbsp;<a href="http://element.eleme.io/#/" target="_blank">element</a> &nbsp;&nbsp;<a href="https://cn.vuejs.org/v2/guide/syntax.html" target="_blank">vue</a>
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
</style>
