const ffmpeg = require("./index");
decompress('temp.tar.xz', 'dist', {plugins: [decompressTarxz()], map: file =>{file.path = `oof-${file.path}`; return file;}}).then(() => {console.log('Files decompressed');});
ffmpeg.run("-version").catch((result)=>console.log(result)).then((result)=>console.log(result)); // Asynchronous
ffmpeg.run("error").then((result)=>console.log(result)).catch((result)=>console.log("Test ERROR")); // Asynchronous
console.log(ffmpeg.runSync("-version"));