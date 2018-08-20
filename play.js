const fs = require('fs')

let result = fs.readFileSync('./cache/font_724028_rlcjmff5dlp.css')
console.log(result.toString('utf8'))
