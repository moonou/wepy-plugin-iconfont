const path = require('path')
const fs = require('fs')
const http = require('http')

module.exports = class IconfontPlugin {
  constructor (props) {
    const config = {
      haveTag: true,
      dir: path.resolve(__dirname, './cache'),
      url: 'http://at.alicdn.com/t/'
    }

    if (!props.tag) {
      config.haveTag = false
      console.warn('🚧 wepy-plugin-iconfont需要无法获取 tag 配置')
    }
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

    this.setting = Object.assign({}, config, props)
  }
  getFile () {
    return `${this.setting.dir}/${this.setting.tag}.css`
  }
  getCssContent () {
    return fs.readFileSync(this.getFile()).toString('utf8')
  }
  downloadFile (call) {
    let fileStream = fs.createWriteStream(this.getFile())
    let request = http.get(`${this.setting.url}${this.setting.tag}.css`, (res) => {
      res.pipe(fileStream)
    })
    fileStream.on('close', call)
  }
  apply (op) {
    const next = () => {
      op.code += this.getCssContent()
      op.next()
    }
    if (/app\.wxss/.test(op.file) && this.setting.haveTag) {
      // console.log(op)
      if (!fs.existsSync(this.getFile())) {
        console.log('📦 文件不存在，需要下载样式')
        this.downloadFile(() => {
          console.log('📦 样式下载完成')
          next()
        })
      } else {
        next()
      }
    } else {
      op.next()
    }
  }
}
