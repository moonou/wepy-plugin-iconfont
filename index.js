const path = require('path')
const fs = require('fs')
const http = require('http')

function getCssContent (file) {
  return fs.readFileSync(file).toString('utf8')
}

/**
 * download file to local
 * @param {String} url file URI
 * @param {String} file local path for save
 * @param {Funciton} call callback function
 */
function downloadFile (url, file, call) {
  let fileStream = fs.createWriteStream(file)
  let request = http.get(url, (res) => {
    res.pipe(fileStream)
  })
  fileStream.on('close', call)
}

module.exports = function IconfontPlugin (options) {
  if (!options || !options.tag) {
    console.log('🚧 ', '没有检测到iconfont tag，将跳过iconfont注入')

    return function () {}
  }

  return function () {
    const config = {
      dir: path.resolve(__dirname, './cache'),
      url: 'http://at.alicdn.com/t/'
    }

    // init environment
    if (fs.existsSync(config.dir)) {
      // clear .css files
      fs.readdirSync(config.dir).forEach((entry) => {
          let entry_path = path.join(config.dir, entry);
          if (fs.lstatSync(entry_path).isDirectory()) {
            rimraf(entry_path);
          } else {
            fs.unlinkSync(entry_path);
          }
      })
    } else {
      fs.mkdirSync(config.dir)
    }

    const filePath = `${config.dir}/${options.tag}.css`
    const fileUrl = `${config.url}${options.tag}.css`

    this.register('output-file', function ({ filename, code, encoding }) {
      if (/app\.wxss/.test(filename)) {
        return new Promise((resolve, reject) => {
          const next = () => {
            resolve({
              code: code + getCssContent(filePath),
              filename,
              encoding
            })
          }
          if (!fs.existsSync(filePath)) {
            downloadFile(fileUrl, filePath, () => {
              console.log('📦 ', 'iconfont 已经注入到 app.wxss')
              next()
            })
          } else {
            next()
          }
        })
      }

      return Promise.resolve({
        filename,
        code,
        encoding
      })
    })
  }
}
