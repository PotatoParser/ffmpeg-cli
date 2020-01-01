const fs = require('fs');
const request = require('request');
const tar = require('tar');
const extract = require('extract-zip');
const lzma = require('lzma-native');
const system = require('./system');
const console = require('./console');

function decompressXZ(file) {
	return new Promise(resolve=>{
		let temp = fs.readFileSync(file);
		lzma.decompress(temp, (fin)=>{
			let inside = file.substring(0, file.lastIndexOf('.'));
			fs.writeFileSync(inside, fin);
			let path;
			let t = tar.x({file: inside, 
				sync: true, 
				strict: true, 
				cwd: file.substring(0, file.lastIndexOf('/')), 
				onentry: (o)=>{
					let tmp = o.header.path;
					if (tmp) path = tmp.substring(0, tmp.indexOf('/'));
				}
			});
			fs.unlinkSync(inside);
			resolve(`${system.rootDir}/ffmpeg/${path}`);
		});
	});
}
function decompressZip(file) {
	return new Promise(resolve=>{
		let dir = file.substring(0, file.lastIndexOf('.'));
		extract(file, {dir: `${system.rootDir}/ffmpeg`}, e=>{
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

function forceRename(oldPath, newPath, max = 0) {
	try {
		Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, max*100);
		fs.renameSync(oldPath, newPath);
	} catch(e) {
		if (max < 10) forceRename(oldPath, newPath, ++max);
		else throw console.error('Unable to rename FFmpeg folder');
	}
}

async function getPackage(){
	if (fs.existsSync(system.typePath)) rimraf(system.typePath);	
	if (!fs.existsSync(`${system.rootDir}/ffmpeg`)) fs.mkdirSync(`${system.rootDir}/ffmpeg`);
	var downloaded = await new Promise(resolve=>{
		let file = request(system.url);
		file.on('error', ()=>resolve(false));
		file.pipe(fs.createWriteStream(system.zipPath)).on('finish', ()=>resolve(true));
		file.on('response', (c)=>{
			let bar = console.bar(parseInt(c.headers['content-length'], 10));
			file.on('data', c=>bar.tick(c.length));
		});
	});
	if (!downloaded) console.error('Unable to download files');
	console.log('Unzipping files...');
	var temp = (system.zipPath.indexOf('.xz') !== -1) ? await decompressXZ(system.zipPath) : await decompressZip(system.zipPath);

	console.log('Unzipped files');
	fs.unlinkSync(system.zipPath);
	forceRename(temp, system.typePath);

	console.log('FFmpeg downloaded!');
}

getPackage();