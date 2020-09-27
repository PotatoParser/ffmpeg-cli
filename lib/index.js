const cp = require('child_process');
const fs = require('fs');
const {
	__execpath
} = require('./system');
const console = require('./console');
const FFmpeg = {
	run: cmd => new Promise((resolve, reject) => {
		cp.exec(`"${__execpath}" ${cmd}`, {
			encoding: 'utf8'
		}, (err, output) => {
			if (err && err.code) reject(err);
			else resolve(output);
		});
	}),
	path: __execpath,
	runSync: cmd => cp.execSync(`"${__execpath}" ${cmd}`, {
		encoding: 'utf8'
	}),
	forceDownload: () => {
		try {
			cp.execSync(`node ${__dirname}/download.js`, {
				cwd: process.cwd(),
				stdio: 'inherit'
			});
			return true;
		} catch (e) {
			return false;
		}
	}
};

if (!fs.existsSync(__execpath)) {
	console.log('FFmpeg not detected, attempting to download...');

	// Check for possible corruption
	try {
		if (!FFmpeg.forceDownload() || !fs.existsSync(__execpath)) throw null;
		FFmpeg.runSync('-version');
		console.log(`FFmpeg verified at ${__execpath}`);
	} catch (e) {
		console.error('Unable to download FFmpeg! Try reinstalling OR FFmpeg.forceDownload()');
	}
}

module.exports = FFmpeg;
