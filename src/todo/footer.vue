<template>
  <div class="footer"style="margin-top:10px;">
    <span >
      Design by <a href="http://gudong.name/" target="_blank">咕咚</a>

      &nbsp;&nbsp;Thanks <a href="https://www.imooc.com/t/3083408" target="_blank">Jokcy</a>
    </span>
    <div>
      <a href="https://github.com/maoruibin/TodayTodo" target="_blank">source</a>
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
