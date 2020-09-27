const {
	__rootdir,
	__dir,
	__sourceurl,
	__zippath,
	__execpath,
	__execdir
} = require('./system');
const console = require('./console');

const fs = require('fs');
const path = require('path');

const {
	https
} = require('follow-redirects');
const tar = require('tar');
const AdmZip = require('adm-zip');
const lzma = require('lzma-native');

// Const debug = new require('console').Console(process.stdout, process.stderr);

function decompressXZ(file) {
	return new Promise(resolve => {
		const temp = fs.readFileSync(file);
		lzma.decompress(temp, fin => {
			const inside = file.substring(0, file.lastIndexOf('.'));
			fs.writeFileSync(inside, fin);
			let extractPath;
			tar.x({
				file: inside,
				sync: true,
				strict: true,
				cwd: file.substring(0, file.lastIndexOf('/')),
				onentry: o => {
					const tmp = o.header.path;
					if (tmp) extractPath = tmp.substring(0, tmp.indexOf('/'));
				}
			});
			fs.unlinkSync(inside);
			resolve(path.join(__rootdir, extractPath));
		});
	});
}
function decompressZip(file) {
	const zip = new AdmZip(file);
	zip.extractAllTo(__rootdir, true);
	return path.join(__rootdir, zip.getEntries()[0].entryName);
}

function rimraf(dir) {
	const temp = fs.readdirSync(dir);
	for (let i = 0; i < temp.length; i++) {
		const file = fs.statSync(`${dir}/${temp[i]}`).isFile();
		if (file) fs.unlinkSync(`${dir}/${temp[i]}`);
		 else rimraf(`${dir}/${temp[i]}`);
	}
	fs.rmdirSync(dir);
}

(async function() {
	if (fs.existsSync(__dir)) rimraf(__dir);
	if (!fs.existsSync(__rootdir)) fs.mkdirSync(__rootdir);
	const downloaded = await new Promise(resolve => {
		https.get(__sourceurl, {
			headers: {
				'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
			}
		}, res => {
			res.on('error', () => resolve(false));
			res.pipe(fs.createWriteStream(__zippath)).on('finish', () => resolve(true));
			const bar = console.bar(parseInt(res.headers['content-length']));
			res.on('data', c => bar.tick(c.length));
		});
	});
	if (!downloaded) console.error('Unable to download files');
	console.log('Unzipping files...');
	const dest = __zippath.includes('.xz') ? await decompressXZ(__zippath) : decompressZip(__zippath);

	console.log('Unzipped files');
	fs.unlinkSync(__zippath);


	if (fs.lstatSync(dest).isDirectory()) {
		console.log('Renaming files');
		fs.renameSync(dest, __dir);
	} else {
		console.log('Moving files');
		fs.mkdirSync(__dir, {
			recursive: true
		});
		fs.renameSync(dest, __execpath);
	}

	console.log('Applying chmod');
	fs.readdirSync(__execdir, {
		withFileTypes: true
	}).forEach(f => {
		if (!f.isDirectory()) {
			const execFile = path.join(__execdir, f.name);
			console.log(execFile);
			fs.chmodSync(execFile, '777');
		}
	});

	console.log('FFmpeg downloaded!');
}());
