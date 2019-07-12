# 简介
`wepy-plugin-iconfont`是在wepy环境中的插件。在使用wepy开发微信小程序时，可以用它方便的引入[iconfont](http://iconfont.cn/)。

# 使用
## 安装
``` bash
npm install wepy-plugin-iconfont
```
or
``` bash
yarn add wepy-plugin-iconfont
```

## 配置
下面的使用方式时在wepy@2环境下，如果你使用wepy@1，请使用[1.x 文档](https://github.com/moonou/wepy-plugin-iconfont/blob/v1/README.md)

首先需要找到iconfont链接中的tag。在这段iconfont的css地址中`//at.alicdn.com/t/font_964045_4hbvi55v0tg.css`，`font_964045_4hbvi55v0tg`需要在配置文件中使用。具体内容根据iconfont中的路径为准。

wepy.config.js
``` javascript
const IconfontPlugin = require('wepy-plugin-iconfont')

module.exports = {
  plugins: {
    'iconfont': {
      tag: 'font_964045_4hbvi55v0tg' // 上面步骤提取的值
    }
  }
}
```

## 模板语法
在`*.wpy`文件中可以使用iconfont的Font class模式使用iconfont，假如在iconfont中的class name为`icon-user`，那么在模板语法中可以这样使用
``` html
<i class="iconfont icon-user" />
```