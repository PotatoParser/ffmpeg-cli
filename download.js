const request = require("request");
const decompress = require('decompress');
const decompressTarxz = require('decompress-tarxz');
async function getPackage(url, type){
	console.log("Downloading FFmpeg...");
	var finalName = url.substring(url.lastIndexOf("/")+1);
	var filePath = `${__dirname}/ffmpeg/${finalName}`;
	await request(url).pipe(fs.createWriteStream(filePath));
	console.log("Unzipping files...");
	await decompress(filePath, 'ffmpeg', {plugins: [decompressTarxz()], map: file =>{
		file.path = type; return file;
	}});
	fs.unlinkSync(filePath);
	console.log("Download complete!");
}
if (process.argv.length !== 2) getPackage(process.argv[2], process.argv[3]);
