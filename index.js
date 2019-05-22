const cp = require("child_process");
const fs = require("fs");
const system = require(__dirname + "/verify.js");
if (!fs.existsSync(system.path)) cp.execSync(`node --no-warnings ${__dirname}/download.js ${system.url} ${process.platform}${process.arch}`, {cwd: process.cwd(), stdio: "inherit"});

const FFmpeg = {
	run: async(cmd)=>{
		var temp = await new Promise((resolve, reject)=>{
			var err = (data)=>{throw data;}
			cp.exec(`"${system.path}" ${cmd}`, {encoding: "utf8"}, (error, out)=>{
				if (error) resolve(error);
				else resolve(out);
			});
		});
		if (temp.code) throw temp;
		return temp;
	},
	path: `${system.path}`,
	runSync: (cmd)=>{
		return cp.execSync(`"${system.path}" ${cmd}`, {encoding: "utf8"});
	}
}
// Check for possible corruption
try {
	FFmpeg.runSync("-version");
} catch(err) {
	cp.execSync(`node --no-warnings ${__dirname}/download.js ${system.url} ${process.platform}${process.arch}`, {cwd: process.cwd(), stdio: "inherit"});
}
module.exports = FFmpeg;