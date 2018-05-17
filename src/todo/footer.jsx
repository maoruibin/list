import '../assets/styles/footer.styl'

export default{
	data(){
		return{
			author:'咕咚'
		}
	},
	render(){
		return(
			<div id="footer">
				<span> Design By <a href="http://gudong.name/" target="_blank">{this.author}</a></span>
				<div style="color:#ccc;">Thanks <a href="https://www.imooc.com/t/3083408" target="_blank">Jokcy</a></div>

			</div>
		)
	}
}
