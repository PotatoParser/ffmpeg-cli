const ffmpeg = require("./index");
console.log(__dirname);
ffmpeg.run("-version").catch((result)=>console.log(result)).then((result)=>console.log(result)); // Asynchronous
ffmpeg.run("error").then((result)=>console.log(result)).catch((result)=>console.log("Test ERROR")); // Asynchronous
console.log(ffmpeg.runSync("-version"));
