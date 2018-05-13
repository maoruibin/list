const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
//分离 CSS 文件
const ExtractPlugin = require('extract-text-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const config =  {
	target: 'web',
	// 入口配置 也就是目标文件
	entry:path.join(__dirname,'src/index.js'),

	// 最终的输入文件
	output:{
		// 文件名称
		filename:'bundle.js',
		// 输入目录
		path:path.join(__dirname,'docs')
	},

	module: {

		rules: [
			// 为 webpack 指定 .vue 文件的转换工具
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
         test: /\\\\\\\\.css$/,
         loader: "style!css"
       },
       {
         test: /\\\\\\\\.(eot|woff|woff2|ttf)([\\\\\\\\?]?.*)$/,
         loader: "file"
       },
			{
				test: /\.(gif|jpg|jpeg|png|svg)$/,
				use: [
					{
						loader:'url-loader',
						options:{
							limit:1024,
							name:'[name]-bbb.[ext]'
						}

					}
				]
			},
			{
				test: /\.jsx$/,
				loader: 'babel-loader'
			}
		]
	},
	plugins:[
		new webpack.DefinePlugin({
			'process.env' : {
				NODE_ENV:isDev? '"development"' : '"production"'
			}
		}),
		new HTMLPlugin()
	]

}

if(isDev){
	config.module.rules.push({
			test: /\.styl$/,
			use:[
				'style-loader',
				'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						sourceMap: true,
					}
				},
				'stylus-loader'
			]
	})
	config.devtool = '#cheap-module-eval-source-map'
	config.devServer = {
		port:'8001',
		host:'0.0.0.0',
		overlay:{
			// webpack编译出现错误，则显示到网页上
			errors:true,
		},
		open:true
	}
}else{
	config.output.filename = '[name].[chunkhash:8].js'
	config.module.rules.push({
			test: /\.styl$/,
			use: ExtractPlugin.extract({
				fallback: 'style-loader',
				use:[
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
						}
					},
					'stylus-loader'
			]
		})
	})
	config.plugins.push(
		new ExtractPlugin('styles.[chunkhash:8].css'),
	)
}

module.exports = config
