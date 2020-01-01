const ProgressBar = require('progress');
const format = txt=>`\x1b[37m[ffmpeg-cli]\x1b[0m ${txt}`;
module.exports.error = txt=>console.error(`\x1b[1m\x1b[31mERROR! \x1b[0m\x1b[37m[ffmpeg-cli]\x1b[0m ${new Error(txt)}`);
module.exports.log = txt=>console.log(format(txt));
module.exports.bar = total=>(new ProgressBar(format('Downloading: [:bar] :percent :etas'), {
    complete: '\x1b[42m\x1b[1m \x1b[0m',
    incomplete: '\x1b[35m.\x1b[0m',
    width: 20,
    total: total
}));