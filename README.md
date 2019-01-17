# ffmpeg-cli
A simple way of implementing FFmpeg regardless of OS
```javascript
const ffmpeg = require("ffmpeg-cli");
ffmpeg.run("-version"); // Asynchronous
ffmpeg.run("-version", (error, result)=>{});
console.log(ffmpeg.runSync("-version"));
```
## Asynchronous Commands
Returns a promise
```javascript
ffmpeg.run("-version");
ffmpeg.run("-version").catch((error)=>{...}); // Catch errors
ffmpeg.run("-version").then((result)=>{...}); // Only results
ffmpeg.run("-version").then((result)=>{...}).catch((error)=>{...}); // Catches when errors found
```
## Supported OS
+ MacOS ~ 64 bit
+ Linux ~ 32/64 bit
+ Windows ~ 32/64 bit

## FFmpeg Documentation
[FFmpeg's Official Documentation](https://www.ffmpeg.org/ffmpeg.html)