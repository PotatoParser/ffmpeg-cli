const path = require('path');
const console = require('./console');
const rootDir = path.join(__dirname, '..', 'ffmpeg');
const OS = process.platform;
const BIT = process.arch;
if (!(BIT === 'x32' || BIT === 'x64')) console.error('CPU architecture not supported');
const allOS = {
	linux: {
		x32: {
			url: 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz',
			path: 'ffmpeg'
		},
		x64: {
			url: 'https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz',
			path: 'ffmpeg'
		}
	},
	darwin: {
		x64: {
			url: 'https://evermeet.cx/ffmpeg/getrelease/zip',
			path: 'ffmpeg'
		}
	},
	win32: {
		x64: {
			url: 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-git-essentials.zip',
			path: 'bin/ffmpeg.exe'
		}
	}
};
if (!allOS[OS]) console.error('OS not supported!');
if (!allOS[OS][BIT]) console.error('Invalid OS and CPU architecture!');

const dir = path.join(rootDir, OS + BIT);
const execPath = path.join(dir, allOS[OS][BIT].path);

Object.assign(module.exports, {
	__rootdir: rootDir,
	__sourceurl: allOS[OS][BIT].url,
	__dir: dir,
	__zippath: path.join(rootDir, path.basename(allOS[OS][BIT].url)),
	__execpath: execPath,
	__execdir: path.dirname(execPath)
});
