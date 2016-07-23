var system = require('system')
var fs = require('fs');
var utils = require('./utils')
var config = require('./config/dir');

var shopUrl = system.args[1]
var cookie = system.args[2]
var type = system.args[3]

if(type !== 'm' && type !== 'pc'){
  type = 'm'
}

console.log(shopUrl)
console.log(cookie)
console.log(type)

if (cookie) {
  utils.parseCookieToPhantom(cookie).map(function (cookieOne) {
    phantom.addCookie(cookieOne)
  })
}
var urlParse = utils.urlParse(shopUrl)

var createPage = utils.createPageFn(type);

var page = createPage();

page.clipRect = {
  left: 0,
  top: 0,
  width: page.viewportSize.width,
  height: page.viewportSize.height,
}

page.open(shopUrl, function (status) {
  if (status === 'success') {

    setTimeout(function () {

      var imgPath = config.renderDir('page_' + Date.now() + '.jpeg');
      page.render(imgPath, {
        format: 'jpeg',
        quality: 95
      });

      console.log('open===>SUCCESS' + imgPath);
      page.close();
      phantom.exit();
    },2000);

  } else {
    console.log('open===>ERROR:open fail');
    page.close();
    phantom.exit();
  }
});