import Router from "koa-router";
import _path from "path";
import upath from "upath";
// import files from "fs/promises";
const files = require('fs').promises;
import fs from "fs";
import ejs from "ejs";

import uploadTemplate from "@root/view/upload.ejs";

export default class extends Router {
	constructor() {
		super();

		this.get("/", this.uploadGET);
		this.post("/", this.uploadPOST);

		
		// this.post("/", async (ctx: any, next: Function) => {
		// 	// console.log(ctx.request.files);
			
		// 	const { file } = ctx.request.files; // 获取上传文件
		// 	const reader = fs.createReadStream(file.path);// 创建可读流
		// 	let filePath = _path.join(ctx.state.path, `/${file.name}`);
		// 	console.log(filePath);
			
		// 	const upStream = fs.createWriteStream(filePath);// 创建可写流
		// 	reader.pipe(upStream);// 可读流通过管道写入可写流

		// 	ctx.body = "上传成功！";
		// 	next();
		// });
	}

	/**
	 * 请求页面
	 * @param { } ctx koa上下文
	 * @param { Function } next 下层回调
	 */
	async uploadGET(ctx: any, next: Function) {
		const url = `http://${ctx.state.ip}:${ctx.state.port}`;
		const basePath = (<string>ctx.query.path) ?? "/";
		const filePath = _path.join(ctx.state.path, basePath);
		console.log("??", filePath);
		
		const fileList = await files.readdir(filePath);
		console.log(_path.normalize(`I:\\local\\view\\user.ejs`));
		
		
		
		const Stats = await Promise.all([...fileList].map(async (filename: string) => {
			const filedir = _path.join(filePath, filename);
			const stats: any = await files.stat(filedir);
			stats.name = filename;
			stats.path = _path.join(basePath, filename);
			stats.basePath = _path.join(ctx.state.path, basePath, filename);
			stats.download = upath.normalize(_path.join(basePath, filename));
			stats.type = "image"
			return stats;
		}));
		
		const folder =  Stats.filter(item => item.isDirectory());
		const file =  Stats.filter(item => item.isFile());
		
		
		const html = ejs.render(uploadTemplate, { folder, file, url, basePath: upath.normalize(basePath) });
		ctx.body = html;
		next();
	}

	/**
	 * 上传文件
	 * @param { } ctx koa上下文
	 * @param { Function } next 下层回调
	 */
	async uploadPOST(ctx: any, next: Function) {
		console.log(upath.normalize(ctx.request.body.path));
		const basePath = upath.normalize(ctx.request.body.path ?? "/");
		console.log(ctx.request.body);
		
		
		const { file } = ctx.request.files; // 获取上传文件
		const reader = fs.createReadStream(file.path);// 创建可读流
		let filePath = _path.join(ctx.state.path, basePath, `/${file.name}`);
		console.log(filePath);
		
		const upStream = fs.createWriteStream(filePath);// 创建可写流
		reader.pipe(upStream);// 可读流通过管道写入可写流

		ctx.body = "上传成功！";
		next();
	}
}
