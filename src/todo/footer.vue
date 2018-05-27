<template>
  <div class="footer"style="margin-top:10px;">
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

</template>

<script>
  export default {
		data(){
			return{
				user:{}
			}
		},
		mounted:function(){

		},
    methods: {

    }
  }
</script>

<style lang="stylus" scoped>

  .footer span{
    color: #d3d7d4;
  }
  .footer a{
    text-decoration none;
    color: #fffffb;
  }

</style>
