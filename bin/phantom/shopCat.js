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

    var rateUrl = page.evaluate(function(){
      var noRate = document.querySelector('.main-info a span');

      var urlDom = document.getElementById('dsr-ratelink') ||
        document.querySelector('.rank-icon-v2.J_TGoldlog')

      var url = urlDom.value  ? urlDom.value : urlDom.href;

      url = 'https:' +  url.replace(/(http:)|(https:)/,'')

      if(noRate && noRate.innerText === '尚未收到评价'){
        return '';
      }
      return url;
    })

    page.close();

    if(rateUrl){
      var p = createPage();
      console.log('rateUrl:',rateUrl);
      p.open(rateUrl,function(s){

          if (s === 'success') {

            p.evaluate(function () {
              var _callPhantom = callPhantom;
              setTimeout(function () {
                var link = document.querySelector('.info-block-first li a');
                if (link) {
                  _callPhantom(link.innerText)
                }else{
                  _callPhantom('')
                }
              },1500);
            })

            p.onCallback = function(cat) {
              if (cat) {
                fs.write(contentFile(), shopId + ',' + cat);
                output(cat);
              } else {
                fs.write(contentFile(1), shopId + ',null');
                console.log('open===>ERROR cat null');
              }
              p.close()
              phantom.exit();
            }
          } else {
            fs.write(contentFile(1), shopId + ',fail 2');
            console.log('open===>ERROR fail 2');
            p.close()
            phantom.exit();
          }
      })
    }else{
      fs.write(contentFile(1),shopId+',fail null');
      console.log('open===>ERROR rateUrl null');
      phantom.exit();
    }
  }else{
    fs.write(contentFile(1),shopId+',fail 1');
    console.log('open===>ERROR fail 1');
    phantom.exit();
  }
})