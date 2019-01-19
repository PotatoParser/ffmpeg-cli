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
if (process.argv.length !== 2) getPackage(process.argv[2], process.argv[3]);