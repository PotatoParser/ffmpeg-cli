const ffmpeg = require("./index");
ffmpeg.run("-version").catch((result)=>console.log(result)).then((result)=>console.log(result)); // Asynchronous
//console.log(ffmpeg.runSync("-version"));