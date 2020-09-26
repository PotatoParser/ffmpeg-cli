const fs = require('fs');
const { https } = require('follow-redirects');
const tar = require('tar');
const AdmZip = require('adm-zip');
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
	let zip = AdmZip(file);
	console.log(require('util').inspect(zip.getEntries().map(i => i.name)));
	zip.extractAllTo(`${system.rootDir}/ffmpeg`, true);
	return file.substring(0, file.lastIndexOf('.'));
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

async function getPackage(){
	if (fs.existsSync(system.typePath)) rimraf(system.typePath);	
	if (!fs.existsSync(`${system.rootDir}/ffmpeg`)) fs.mkdirSync(`${system.rootDir}/ffmpeg`);
	var downloaded = await new Promise(resolve=>{
		https.get(system.url, {headers: {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'}}, res => {
			res.on('error', ()=>resolve(false));
			res.pipe(fs.createWriteStream(system.zipPath)).on('finish', ()=>resolve(true));
			let bar = console.bar(parseInt(res.headers['content-length'], 10));
			res.on('data', c=>bar.tick(c.length));
		});
	});
	if (!downloaded) console.error('Unable to download files');
	console.log('Unzipping files...');
	var temp = (system.zipPath.indexOf('.xz') !== -1) ? await decompressXZ(system.zipPath) : decompressZip(system.zipPath);

	console.log('Unzipped files');
	fs.unlinkSync(system.zipPath);

	if (system.file) {
		console.log('Moving files');
		fs.mkdirSync(system.typePath);
		fs.renameSync(system.file, system.path);
	} else {
		console.log('Renaming files');
		fs.renameSync(system.dir, system.typePath);
	}

	console.log('Applying chmod');
	fs.readdirSync(system.pathDir, { withFileTypes: true }).forEach(f => {
		if (!f.isDirectory()) {
			console.log(`${system.pathDir}/${f.name}`);
			fs.chmodSync(`${system.pathDir}/${f.name}`, '777');
		}
	});

	console.log('FFmpeg downloaded!');
}

getPackage();