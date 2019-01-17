const cp = require("child_process");
const OS = process.platform;
const BIT = process.arch;
if (!(BIT === "x32" || BIT === "x64")) console.error(new Error("CPU architecture not supported"));
const allOS = {
	linux: {
		x32: __dirname + "/ffmpeg/linux32/ffmpeg",
		x64: __dirname + "/ffmpeg/linux64/ffmpeg"
	},
	darwin: {
		x64: __dirname + "/ffmpeg/mac64/bin/ffmpeg",
	},
	win32: {
		x32: __dirname + "/ffmpeg/win32/bin/ffmpeg",
		x64: __dirname + "/ffmpeg/win64/bin/ffmpeg"
	}
}
if (allOS[OS] === undefined) console.error(new Error("OS not supporteds!"));
if (allOS[OS][BIT] === undefined) console.error(new Error("Invalid OS and CPU architecture!"));
module.exports = class FFMPEG {
	static async run(cmd){
		var temp = await new Promise((resolve, reject)=>{
			var err = (data)=>{throw data;}
			cp.exec(`"${allOS[OS][BIT]}" ${cmd}`, {encoding: "utf8"}, (error, out)=>{
				if (error) resolve(error);
				else resolve(out);
			});
		});
		if (temp.code) throw temp;
		return temp;
	}
	static runSync(cmd){
		return cp.execSync(`"${allOS[OS][BIT]}" ${cmd}`, {encoding: "utf8"});
	}
}