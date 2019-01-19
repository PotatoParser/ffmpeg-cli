const fs = require("fs");
const request = require("request");
const decompress = require('decompress');
const decompressTarxz = require('decompress-tarxz');
const decompressUnzip = require('decompress-unzip');
const ProgressBar = require("progress");
const ora = require("ora");
const chalk = require("chalk");
const system = require(__dirname + "/verify.js");
function error(text){
	console.log(chalk.bold.red("ERROR! ") + chalk.white("[ffmpeg-cli]") + " " + new Error(text));
}
function output(text){
	return chalk.white("[ffmpeg-cli]") + " " + text;
}
async function getPackage(url, type){
	if (url.indexOf("http") === -1) 
		error("Unable to parse link");
	var finalName = url.substring(url.lastIndexOf("/")+1);
	var filePath = `${__dirname}/ffmpeg/${finalName}`;
	if (!fs.existsSync(`${__dirname}/ffmpeg`)) fs.mkdirSync(`${__dirname}/ffmpeg`);
	var downloaded = await new Promise((resolve)=>{
		var file = request(url);
		file.on("error", ()=>resolve(false));
		file.pipe(fs.createWriteStream(filePath)).on("finish", ()=>resolve(true));
		file.on("response", (c)=>{
			var totalData = parseInt(c.headers['content-length'], 10);
			var bar = new ProgressBar(chalk.white("[ffmpeg-cli]") + ' Downloading: [:bar] :percent :etas', {
		    complete: chalk.bgGreenBright(' '),
		    incomplete: chalk.magenta('.'),
		    width: 20,
		    total: totalData
		  });
			file.on("data", (c)=>{
				bar.tick(c.length);
			});
		})
	});
	if (!downloaded) error("Unable to download files");
	const spinner = ora({spinner: {interval: 80, frames: [output('Unzipping files'), output('Unzipping files.'), output('Unzipping files..'), output('Unzipping files...')]}}).start();
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
				plugins: [decompressUnzip()],
			}).then((file)=>resolve(file));
		});
	}
	spinner.stop();
	console.log(output("Unzipped file"));
	fs.unlinkSync(filePath);
	fs.renameSync(`${__dirname}/ffmpeg/${temp[0].path}`, `${__dirname}/ffmpeg/${type}`);
	console.log(output("FFmpeg downloaded!"));
}
if (process.argv.length !== 2) getPackage(process.argv[2], process.argv[3]);
else getPackage(system.url,`${process.platform}${process.arch}`);