var system = require('system')
var fs = require('fs');
var utils = require('./utils')
var config = require('./config/dir');

var shopUrl = system.args[1]
var type = system.args[2]
var libs = system.args[3]

var customLibDir = './customLib/'

if(libs){
  libs = libs.split(',')
}else{
  libs = [];
}


var libsFn = libs.map(function (path) {
  return require(customLibDir+path)
})


if(type !== 'm' && type !== 'pc'){
  type = 'm'
}

console.log(shopUrl)
console.log(type)
console.log(libs)

var createPage = utils.createPageFn(type);

var page = createPage();

//page.clipRect = {
//  left: 0,
//  top: 0,
//  width: page.viewportSize.width,
//  height: page.viewportSize.height,
//}

page.open(shopUrl, function (status) {
  if (status === 'success') {

    setTimeout(function () {

      page.evaluate(function () {
        console.log('evaluate start');
      })

      libsFn.forEach(function (fn) {
        page.evaluate(fn)
      })

    },1000);

  } else {
    console.log('open===>ERROR:open fail');
    page.close();
    phantom.exit();
  }
});

page.onCallback = function (doneLib) {

  libs = libs.filter(function (lib) {
    return !new RegExp(doneLib).test(lib)
  })

  //所有js跑完
  if(libs.length === 0){
    var imgPath = config.uiTestDir('page_' + Date.now() + '.jpeg');
    page.render(imgPath, {
      format: 'jpeg',
      quality: 95
    })

    console.log('open===>SUCCESS' + imgPath);
    page.close()
    phantom.exit();
  }
}