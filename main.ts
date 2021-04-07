import minimist from "minimist";
import apps from "./src/index";
import internalIp from "internal-ip";

const Options = minimist(process.argv.slice(2));

const app =  + async function() {
	return new apps({
		ip: await internalIp.v4(),
		...Options
	});
}()

// console.log("所有用户环境的对象:", process.env);
// console.log(`当前工作目录是: ${process.cwd()}`);
// console.log(`命令行选项: ${process.execArgv}`);
// console.log(`命令行选项: ${process.argv}`);
// console.log(`Node.js 进程的可执行文件的绝对路径: ${process.execPath}`);
