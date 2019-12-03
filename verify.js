const OS = process.platform;
const BIT = process.arch;
function error(text){
	console.error(`\x1b[1m\x1b[31mERROR! \x1b[0m\x1b[37m[ffmpeg-cli]\x1b[0m ${new Error(text)}`);
}
if (!(BIT === "x32" || BIT === "x64")) error("CPU architecture not supported");
const allOS = {
	linux: {
		x32: {
			url: "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz",
			path: __dirname + "/ffmpeg/linuxx32/ffmpeg"
		},
		x64: {
			url: "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-i686-static.tar.xz",
			path: __dirname + "/ffmpeg/linuxx64/ffmpeg"
		}
	},
	darwin: {
		x64: {
			url: "https://ffmpeg.zeranoe.com/builds/macos64/static/ffmpeg-latest-macos64-static.zip",
			path: __dirname + "/ffmpeg/ffmpeg-latest-macos64-static/bin/ffmpeg"
		}
	},
	win32: {
		x32: {
			url: "https://ffmpeg.zeranoe.com/builds/win32/static/ffmpeg-latest-win32-static.zip",
			path: __dirname + "/ffmpeg/ffmpeg-latest-win32-static/bin/ffmpeg.exe"
		},
		x64: {
			url: "https://ffmpeg.zeranoe.com/builds/win64/static/ffmpeg-latest-win64-static.zip",
			path: __dirname + "/ffmpeg/ffmpeg-latest-win64-static/bin/ffmpeg.exe"
		}
	}
}
if (allOS[OS] === undefined) error("OS not supporteds!");
if (allOS[OS][BIT] === undefined) error("Invalid OS and CPU architecture!");
module.exports = allOS[OS][BIT];