const ffmpeg = require("./index");
ffmpeg.run("-version"); // Asynchronous
ffmpeg.run("-version", (error, result)=>{});
console.log(ffmpeg.runSync("-version"));