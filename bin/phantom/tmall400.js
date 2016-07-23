var webPage = require('webpage')
var fs = require('fs')
var system = require('system')
var _ = require('lodash')
var utils = require('./utils')

var config = require('./config/dir');

var shopUrl = system.args[1]
var cookie = system.args[2]

var shopId = shopUrl.match(/\d+/)[0];

var contentFile = function(fail){
  return config.shopMainCatDir(shopId+'.txt',fail)
}

console.log(shopUrl)
console.log(cookie)

if (cookie) {
  utils.parseCookieToPhantom(cookie).map(function (cookieOne) {
    phantom.addCookie(cookieOne)
  })
}

function createPage() {

  var p = webPage.create()
  p.settings.resourceTimeout = 2000
  p.settings.userAgent = utils.randomPCUserAgent()

  p.onConsoleMessage = function (message) {
    console.log('CONSOLE==>', JSON.stringify(message))
  }

  p.onError = function (e) {
    console.log('ERROR==>', e)
  }

  return p
}

var page = createPage();

page.open(shopUrl, function (status) {
  if(status === 'success'){

    //var rateUrl = page.evaluate(function(){
    //    var noRate = document.querySelector('.main-info a span');
    //
    //  var urlDom = document.getElementById('dsr-ratelink') ||
    //    document.querySelector('.rank-icon-v2.J_TGoldlog')
    //
    //  var url = urlDom.value  ? urlDom.value : urlDom.href;
    //
    //  url = 'https:' +  url.replace(/(http:)|(https:)/,'')
    //
    //  if(noRate && noRate.innerText === '尚未收到评价'){
    //    return '';
    //  }
    //  return url;
    //})


    var i = page.content.indexOf('服务电话')
    console.log('i:'+i);
    if(i!==-1){
      var includePhone = page.content.substr(i,150)
      console.log(includePhone)

      var phoneNumber = includePhone.match(/\d+/)


      if(phoneNumber){
        phoneNumber = phoneNumber[0]
      }
    }

    if (phoneNumber) {
      fs.write(contentFile(), shopId + ',' + phoneNumber);
      output(phoneNumber);
    } else {
      fs.write(contentFile(1), shopId + ',null');
      console.log('open===>ERROR phone null');
    }
    p.close()
    phantom.exit();

  }else{
    fs.write(contentFile(1),shopId+',fail 1');
    p.close()
    console.log('open===>ERROR fail 1');
    phantom.exit();
  }
})