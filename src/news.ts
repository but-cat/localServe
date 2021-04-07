import Router from "koa-router";

export default class extends Router {
	constructor() {
		super();

		this.get("/", ({ body }, next: Function) => {
			// ctx.router available
			body = "根目录";
		});

		this.get("/start", ({ body }, next) => {
			// ctx.router available
			body = "start";
			// next();
		});

		this.all("/websocket", this.websocket)
	}

	async websocket(ctx: any, next: Function) {
		const ws = await ctx.ws();
		ws.on('open', () => {
			ws.send('something');
		});

		ws.on('message', (data: any) => {
			console.log(data);
			ws.send('hello there')
		});
		// return ws.send('hello there');
		setInterval(()=>{
			ws.send('hello there');
		}, 1000);
	}
}
