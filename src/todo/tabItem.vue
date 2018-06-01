<template>
  <el-tab-pane :label="label">
    <Item
      v-for="todo in todos"
      :todo="todo"
      title="dashboard"
      onlyShow="true"
      :showAction="false"
      :key="todo.objectId"
    />
  </el-tab-pane>

</template>

<script>
import Item from './item.vue'

	export default{
		props:{
			todos:{
				type: Array,
				required: true
			},
			label:{
				type: String,
				required: true
			},
		},
		computed:{

		},
    mounted:function(){
      console.log("tabs tabs mount");
		},
    components:{
      Item
    },
		data(){
			return{

			}
		},
		methods:{

		}
	}
</script>

<style lang="stylus" scoped>

</style>
