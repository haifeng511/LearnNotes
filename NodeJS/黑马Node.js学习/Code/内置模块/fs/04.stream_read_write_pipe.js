let fs = require('fs')

// 创建一个可读流
let rs = fs.createReadStream('./static/song.mp3')
// 创建一个可写流
let ws = fs.createWriteStream('./static/song_copy2.mp3')

// pipe()可以将可读流中的内容，直接输出到可写流中
rs.pipe(ws)