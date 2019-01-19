const cp = require("child_process");
const fs = require("fs");
const system = require(__dirname + "/verify.js");
if (!fs.existsSync(system.path)) cp.execSync(`node --no-warnings download.js ${system.url} ${process.platform}${process.arch}`, {cwd: process.cwd(), stdio: "inherit"});
class FFmpeg {
	static async run(cmd){
		var temp = await new Promise((resolve, reject)=>{
			var err = (data)=>{throw data;}
			cp.exec(`"${system.path}" ${cmd}`, {encoding: "utf8"}, (error, out)=>{
				if (error) resolve(error);
				else resolve(out);
			});
		});
		if (temp.code) throw temp;
		return temp;
	}
	static runSync(cmd){
		return cp.execSync(`"${system.path}" ${cmd}`, {encoding: "utf8"});
	}
}
try {
	FFmpeg.runSync("-version");
} catch(err) {
	cp.execSync(`node download.js ${system.url} ${process.platform}${process.arch}`, {cwd: process.cwd(), stdio: "inherit"});
}
module.exports = FFmpeg;