## 爬虫功能模块合集

> bin/index 入口


### example

> npm i web-reptile

```
//test.js

var phantom = require('web-reptile')

var process = phantom('pageCapture',['http://www.baidu.com'])

process.onSuccess((imgPath)=>{
  console.log(imgPath)
})

```

### License

GPL