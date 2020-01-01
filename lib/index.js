const cp = require('child_process');
const fs = require('fs');
const system = require('./system');
const console = require('./console');
const path = require('path');
const FFmpeg = {
	run: cmd=>{
		return new Promise((resolve, reject)=>{
			cp.exec(`"${system.path}" ${cmd}`, {encoding: 'utf8'}, (err, output)=>{
				if(err && err.code) reject(err);
				else resolve(output);
			});
		});
	},
	path: system.path,
	runSync: cmd=>cp.execSync(`"${system.path}" ${cmd}`, {encoding: 'utf8'}),
	forceDownload: ()=>{
		try {
			cp.execSync(`node ${__dirname}/download.js`, {cwd: process.cwd(), stdio: 'inherit'});
			return true;
		} catch(e) {
			return false;
		}
	}
}

if (!fs.existsSync(system.path)) {
	console.log('FFmpeg not detected, attempting to download...');
	// Check for possible corruption
	try {
		if (!FFmpeg.forceDownload() || !fs.existsSync(system.path)) throw null;
		FFmpeg.runSync('-version');
		console.log('FFmpeg verified at ' + system.path);
	} catch(e) {
		console.error('Unable to download FFmpeg! Try reinstalling OR FFmpeg.forceDownload()');
	}
}

module.exports = FFmpeg;