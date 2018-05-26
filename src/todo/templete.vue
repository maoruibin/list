<template>
	<div class="helper">

	</div>
</template>

<script>
import Item from './item.vue'

let host = process.env.API_HOST
let api_version = process.env.API_VERSION

	export default{
		props:{
			filter:{
				type: String,
				required: true
			},

			todos:{
				type: Array,
				required: true
			},
		},
		computed:{

		},
		data(){
			return{
				states:['all','active','completed']
			}
		},
		methods:{

		}
	}
</script>

<style lang="stylus" scoped>

</style>
