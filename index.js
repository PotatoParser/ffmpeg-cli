const cp = require("child_process");
const fs = require("fs");
const system = require(__dirname + "/verify.js");
/*const OS = process.platform;
const BIT = process.arch;
if (!(BIT === "x32" || BIT === "x64")) console.error(new Error("CPU architecture not supported"));
const allOS = {
	linux: {
		x32: {
			url: "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz",
			path: __dirname + "/ffmpeg/linuxx32/ffmpeg"
		},
		x64: {
			url: "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz",
			path: __dirname + "/ffmpeg/linuxx64/ffmpeg"
		}
	},
	darwin: {
		x64: {
			url: "https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-latest-macos64-static.zip",
			path: __dirname + "/ffmpeg/darwinx64/bin/ffmpeg"
		}
	},
	win32: {
		x32: {
			url: "https://ffmpeg.zeranoe.com/builds/win32/static/ffmpeg-latest-win32-static.zip",
			path: __dirname + "/ffmpeg/win32x32/bin/ffmpeg.exe"
		},
		x64: {
			url: "https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-latest-win64-static.zip",
			path: __dirname + "/ffmpeg/win32x64/bin/ffmpeg.exe"
		}
	}
}
if (allOS[OS] === undefined) console.error(new Error("OS not supporteds!"));
if (allOS[OS][BIT] === undefined) console.error(new Error("Invalid OS and CPU architecture!"));*/

//if (!fs.existsSync(allOS[OS][BIT].path)) cp.execSync(`node --no-warnings download.js ${allOS[OS][BIT].url} ${OS}${BIT}`, {cwd: process.cwd(), stdio: "inherit"});
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