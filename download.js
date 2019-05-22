const fs = require("fs");
const request = require("request");
const tar = require("tar");
const extract = require("extract-zip");
const lzma = require("lzma-native");
const ProgressBar = require("progress");
const system = require(__dirname + "/verify.js");
function error(text){
	console.error(`\x1b[1m\x1b[31mERROR! \x1b[0m\x1b[37m[ffmpeg-cli]\x1b[0m ${new Error(text)}`);
}
function output(text){
	return `\x1b[37m[ffmpeg-cli]\x1b[0m ${text}`
}
function decompressXZ(file) {
	return new Promise(resolve=>{
		let temp = fs.readFileSync(file);
		lzma.decompress(temp, (fin)=>{
			let inside = file.substring(0, file.lastIndexOf("."));
			fs.writeFileSync(inside, fin);
			let path;
			let t = tar.x({file: inside, 
				sync: true, 
				strict: true, 
				cwd: file.substring(0, file.lastIndexOf("/")), 
				onentry: (o)=>{
					try {
						let tmp = o.header.path;
						if (tmp) path = tmp.substring(0, tmp.indexOf("/"));
					} catch(e){}
				}
			});
			fs.unlinkSync(inside);
			resolve(`${__dirname}/ffmpeg/${path}`);
		});
	});
}
function decompressZip(file) {
	return new Promise(resolve=>{
		let dir = file.substring(0, file.lastIndexOf("."));
		extract(file, {dir: `${__dirname}/ffmpeg`}, e=>{
			if (!e) resolve(dir);
		});
	});
}

function rimraf(dir){
	let temp = fs.readdirSync(dir);
	for (let i = 0; i < temp.length; i++) {
		let file = fs.statSync(`${dir}/${temp[i]}`).isFile();
		if (file) {
			fs.unlinkSync(`${dir}/${temp[i]}`);
		} else rimraf(`${dir}/${temp[i]}`);
	}
	fs.rmdirSync(dir);
}

async function getPackage(url, type){
	if (url.indexOf("http") === -1) error("Unable to parse link");
	var finalName = url.substring(url.lastIndexOf("/")+1);
	var filePath = `${__dirname}/ffmpeg/${finalName}`;
	if (fs.existsSync(`${__dirname}/ffmpeg/${type}`)) rimraf(`${__dirname}/ffmpeg/${type}`);	
	if (!fs.existsSync(`${__dirname}/ffmpeg`)) fs.mkdirSync(`${__dirname}/ffmpeg`);
	var downloaded = await new Promise((resolve)=>{
		var file = request(url);
		file.on("error", ()=>resolve(false));
		file.pipe(fs.createWriteStream(filePath)).on("finish", ()=>resolve(true));
		file.on("response", (c)=>{
			var totalData = parseInt(c.headers['content-length'], 10);
			//chalk.white("[ffmpeg-cli]") + ' Downloading: [:bar] :percent :etas'
			var bar = new ProgressBar(output("Downloading: [:bar] :percent :etas"), {
			    complete: '\x1b[42m\x1b[1m \x1b[0m',
			    incomplete: '\x1b[35m.\x1b[0m',
			    width: 20,
			    total: totalData
			});
			file.on("data", (c)=>{
				bar.tick(c.length);
			});
		})
	});
	if (!downloaded) error("Unable to download files");
	console.log(output("Unzipping files..."));
	var temp;
	if (finalName.indexOf(".xz") !== -1) {
		temp = await decompressXZ(filePath);
	} else {
		temp = await decompressZip(filePath);
	}
	console.log(output("Unzipped files"));
	fs.unlinkSync(filePath);
	fs.renameSync(temp, `${__dirname}/ffmpeg/${type}`);
	console.log(output("FFmpeg downloaded!"));
}
if (process.argv.length !== 2) getPackage(process.argv[2], process.argv[3]);
else getPackage(system.url,`${process.platform}${process.arch}`);