const path = require('path');
const console = require('./console');
const rootDir = path.join(__dirname, '..');
const OS = 'darwin';//process.platform;
const BIT = 'x64';//process.arch;
if (!(BIT === 'x32' || BIT === 'x64')) console.error('CPU architecture not supported');
const allOS = {
	linux: {
		x32: {
			url: 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz',
			dir: rootDir + '/ffmpeg/ffmpeg-release-amd64-static',
			path: rootDir + '/ffmpeg/linuxx32/ffmpeg'
		},
		x64: {
			url: 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz',
			dir: rootDir + '/ffmpeg/ffmpeg-release-i686-static',
			path: rootDir + '/ffmpeg/linuxx64/ffmpeg'
		}
	},
	darwin: {
		x64: {
			url: 'https://evermeet.cx/ffmpeg/ffmpeg-4.3.1.zip',
			file: rootDir + '/ffmpeg/ffmpeg',
			path: rootDir + '/ffmpeg/darwinx64/ffmpeg'
		}
	},
	win32: {
		x64: {
			url: 'https://github.com/BtbN/FFmpeg-Builds/releases/download/autobuild-2020-09-26-14-24/ffmpeg-n4.3.1-18-g6d886b6586-win64-gpl-4.3.zip',
			dir: rootDir + '/ffmpeg/ffmpeg-n4.3.1-18-g6d886b6586-win64-gpl-4.3',
			path: rootDir + '/ffmpeg/win32x64/bin/ffmpeg.exe'
		}
	}
}
if (!allOS[OS]) console.error('OS not supporteds!');
if (!allOS[OS][BIT]) console.error('Invalid OS and CPU architecture!');

module.exports = Object.assign({}, allOS[OS][BIT]);
module.exports.typePath =  path.normalize(rootDir + '/ffmpeg/' + OS + BIT);
module.exports.zipPath = path.normalize(rootDir + '/ffmpeg/' + module.exports.url.substring(module.exports.url.lastIndexOf('/')+1));
module.exports.rootDir = rootDir;
module.exports.path = path.normalize(module.exports.path);
module.exports.pathDir = path.dirname(module.exports.path);