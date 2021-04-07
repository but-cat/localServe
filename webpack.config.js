//创建webpack.config.js
const path = require('path');
const webpack = require('webpack');
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPkgPlugin = require('webpack-pkg-plugin').WebpackPkgPlugin;
const nodeExternals = require('webpack-node-externals');
const pkg = require('./package.json');

module.exports = {
	entry: './main.ts',
	output: {
		filename: 'index.js',																				// 输出文件名
		path: __dirname + '/build'																			// 输出文件路径
	},
	target: 'node',
	devtool: 'source-map',
	plugins: [
		new WebpackPkgPlugin({
			// Default params:
			targets: [
				'host',
				// "node10-linux-x64",
				// "node10-macos-x64",
				// "node10-win-x64"
			], // array of targets (--targets option)
			output: `/`, // Path for dir with executables inside your output folder (--out-path)
			// assets: ["views/**/*"],
		})
	],
	module: {
		rules: [
			{
				test: /\.css$/,																				// 正则表达式，表示.css后缀的文件
				use: ['style-loader', 'css-loader']															// 针对css文件使用的loader，注意有先后顺序，数组项越靠后越先执行
			},
			{
				test: /\.(png|jpg|jpeg|gif)$/,
				use: [
					{
						loader: "url-loader",
						options: {
							limit: 50000   //表示低于50000字节（50K）的图片会以 base64编码
							// outputPath:"./assets/image",
							// name:[name].[hash:5].[ext],
							// pulbicPath:"./dist/asset/images"
						}
					}
				]
			},
			{
				test: /\.xml$/,
				use: 'raw-loader',
				exclude: /node_modules/
			},
			{
				test: /\.html$/,
				use: 'raw-loader',
				exclude: /node_modules/
			},
			{
				test: /\.ejs$/,
				use: 'raw-loader',
				exclude: /node_modules/
			},
			{
				test: /\.ts?$/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							// 指定特定的ts编译配置，为了区分脚本的ts配置
							configFile: path.resolve(__dirname, './tsconfig.json'),
						},
					},
				],
				exclude: /node_modules/,
			},
			{
				test: /\.js$/,																				// 匹配JS文件  
				use: 'babel-loader',
				exclude: /node_modules/																		// 排除node_modules目录
			},
		]
	},
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx"],
		alias: {
			"@": __dirname + "/src",
			"@root": __dirname,
		},
	},
	externals: [nodeExternals()],																			// 解决 require is not a function 问题
}