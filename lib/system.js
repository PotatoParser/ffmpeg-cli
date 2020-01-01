const path = require('path');
const console = require('./console');
const rootDir = path.join(...path.dirname(module.parent.filename).split(path.sep), '..');
const OS = process.platform;
const BIT = process.arch;
if (!(BIT === 'x32' || BIT === 'x64')) error('CPU architecture not supported');
const allOS = {
	linux: {
		x32: {
			url: 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz',
			path: rootDir + '/ffmpeg/linuxx32/ffmpeg'
		},
		x64: {
			url: 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz',
			path: rootDir + '/ffmpeg/linuxx64/ffmpeg'
		}
	},
	darwin: {
		x64: {
			url: 'https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-latest-macos64-static.zip',
			path: rootDir + '/ffmpeg/darwinx64/bin/ffmpeg'
		}
	},
	win32: {
		x32: {
			url: 'https://ffmpeg.zeranoe.com/builds/win32/static/ffmpeg-latest-win32-static.zip',
			path: rootDir + '/ffmpeg/win32x32/bin/ffmpeg.exe'
		},
		x64: {
			url: 'https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-latest-win64-static.zip',
			path: rootDir + '/ffmpeg/win32x64/bin/ffmpeg.exe'
		}
	}
}
if (allOS[OS] === undefined) error('OS not supporteds!');
if (allOS[OS][BIT] === undefined) error('Invalid OS and CPU architecture!');
module.exports = Object.assign({}, allOS[OS][BIT]);
module.exports.typePath =  path.normalize(rootDir + '/ffmpeg/' + OS + BIT);
module.exports.zipPath = path.normalize(rootDir + '/ffmpeg/' + module.exports.url.substring(module.exports.url.lastIndexOf('/')+1));
module.exports.rootDir = rootDir;