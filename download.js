const fs = require("fs");
const request = require("request");
const decompress = require('decompress');
const decompressTarxz = require('decompress-tarxz');
const decompressUnzip = require('decompress-unzip');
const chalk = require("chalk");
async function getPackage(url, type){
	console.log(chalk.black.bgGreenBright("Downloading FFmpeg..."));
	var finalName = url.substring(url.lastIndexOf("/")+1);
	var filePath = `${__dirname}/ffmpeg/${finalName}`;
	if (!fs.existsSync(`${__dirname}/ffmpeg`)) fs.mkdirSync(`${__dirname}/ffmpeg`);
	await new Promise((resolve)=>{
		request(url).pipe(fs.createWriteStream(filePath)).on("finish", ()=>resolve());
	});
	console.log(chalk.black.bgGreenBright("Unzipping files..."));
	var temp;
	if (finalName.indexOf(".xz") !== -1) {
		temp = await new Promise((resolve)=>{
			decompress(filePath, 'ffmpeg', {
				plugins: [decompressTarxz()]
			}).then((file)=>resolve(file));
		});
	} else {
		temp = await new Promise((resolve)=>{
			decompress(filePath, 'ffmpeg', {
				plugins: [decompressUnzip()]
			}).then((file)=>resolve(file));
		});
	}
	fs.unlinkSync(filePath);
	fs.renameSync(`${__dirname}/ffmpeg/${temp[0].path}`, `${__dirname}/ffmpeg/${type}`);
	console.log(chalk.black.bgGreenBright("Download complete!"));
}
const OS = process.platform;
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
if (allOS[OS][BIT] === undefined) console.error(new Error("Invalid OS and CPU architecture!"));
if (process.argv.length !== 2) getPackage(process.argv[2], process.argv[3]);
else getPackage(allOS[OS][BIT].url,`${OS}${BIT}`);