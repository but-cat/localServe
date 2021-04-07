import Koa from "koa";
// import http from "http";
// import https from "https";
import koaBody from "koa-body";
import Router from "koa-router";
// import websocket from 'koa-easy-ws';
import serve from "koa-static";

import fs from "fs";
import _path from "path";

import UpLoad from "./upload";

export default class extends Koa {
	public router: Router = new Router();

	constructor({ port = 3900, path = process.cwd(), ip }: any) {
		super();

		this.use(async (ctx, next)=>{
			ctx.state = { ip, port, path };
			await next();
		});

		this.use(async (ctx, next) => {
			console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
			await next();
		});

		this.use(koaBody({
			multipart: true,
			formidable: {
				// uploadDir: _path.join(path ?? process.cwd(), 'upload/'),
				maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认20M
			}
		}));

		// const posts = new Posts();
		const upload = new UpLoad();

		this.router.use("/$upload", upload.routes(), upload.allowedMethods());
		this.use(this.router.routes()).use(this.router.allowedMethods());

		this.use(serve(path ?? process.cwd()));

		const url = `http://${ip}:${port}`;
		console.log("启动 server 服务, 请访问: ", url);
		this.listen(port);
	}

}
