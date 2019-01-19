# ffmpeg-cli
[![Build Status](https://travis-ci.com/PotatoParser/ffmpeg-cli.svg?branch=master)](https://travis-ci.com/PotatoParser/ffmpeg-cli.svg?branch=master)

A simple way of implementing FFmpeg regardless of OS
```javascript
const ffmpeg = require("ffmpeg-cli");
ffmpeg.run("-version");
console.log(ffmpeg.runSync("-version"));
```
## Synchronous Commands
Returns the output from FFmpeg
```javascript
ffmpeg.runSync(commands);
// Ex: ffmpeg.runSync(`-i input.jpg -vf scale=320:240 output.png`);
```
## Asynchronous Commands
Returns a promise
```javascript
ffmpeg.run(commands);
ffmpeg.run(commands).catch((error)=>{...}); // Catch errors
ffmpeg.run(commands).then((result)=>{...}); // Only results
ffmpeg.run(commands).then((result)=>{...}).catch((error)=>{...}); // Catches when errors found
```
## Supported OS
+ MacOS ~ 64 bit
+ Linux ~ 32/64 bit
+ Windows ~ 32/64 bit

## FFmpeg Documentation
[FFmpeg's Official Documentation](https://www.ffmpeg.org/ffmpeg.html)
