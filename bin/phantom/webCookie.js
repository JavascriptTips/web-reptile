var webPage = require('webpage');
var fs = require('fs');
var system = require('system')
var cookies = [];

var utils = require('./utils');

//var dynamicCookieL = require('./libs/dynamicCookieL');
var dynamicCookieLPc = require('./libs/dynamicCookieLPc');

var cookieType = system.args[1]
var initCookie = parseInt(system.args[2])
var noDynamic = system.args[3]

//var initCookieTxt = './' + cookieType + '/cookie.txt'
//var outputCookieTxt = './' + cookieType + '/cookie' + (index % 5) + '.txt'

//if (!fs.exists(initCookieTxt)) {
//  fs.touch(initCookieTxt)
//}

function random(arr) {
  return arr[parseInt(Math.random() * arr.length)]
}

//使用旧的cookie,_tb_token不会变
if (initCookie) {

  utils.parseCookieToPhantom(initCookie).map(function (ci) {
    if (ci.name === 'l' && !noDynamic && cookieType === 'pc' ) {
      ci.value = dynamicCookieLPc();
    }
    phantom.addCookie(ci)
  })
}


function pcShopIndex() {
  var arr = [
    'https://www.taobao.com',
    'https://suning.tmall.com/shop',
    'https://handuyishe.tmall.com'
  ];
  return random(arr)
}

function randomPcUserAgent() {
  var arr = [
    'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.91 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
    'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36 SE 2.X MetaSr 1.0',
  ];

  return random(arr)
};


function mShopIndex() {
  var arr = [
    'https://m.taobao.com',
    'https://suning.m.tmall.com/',
    'https://handuyishe.m.tmall.com',
    'https://suning.m.tmall.com/',
    'https://handuyishe.m.tmall.com',
    'https://suning.m.tmall.com/',
    'https://handuyishe.m.tmall.com',
  ];

  return random(arr)
}

function mUserAgent() {
  var arr = [
    'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 4 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
  ];
  return random(arr)
}

var urlFn;
var userAgentFn;
var createPage = utils.createPageFn(cookieType);

if (cookieType === 'm') {
  urlFn = mShopIndex;
  userAgentFn = mUserAgent;
} else if (cookieType === 'pc') {
  urlFn = pcShopIndex;
  userAgentFn = randomPcUserAgent
}


function auto(count) {

  var page = createPage();

  var url = urlFn();
  console.log('open url:' + url);

  page.onInitialized = function () {
    page.evaluate(function () {
      window.zyg_callPhantom = callPhantom;
      callPhantom = undefined

      delete window.callPhantom;
      delete window.webdriver;

      window.ontouchstart=true
    })
  }

  page.onCallback = function (cookie) {

    if(cookieType === 'pc' && !noDynamic) {
      cookie = utils.replaceCookieValue(cookie, 'l', dynamicCookieLPc())
    }

    //page.render('a.jpg')
    //fs.write('./' + cookieType + '/cookie' + (count % 5) + '.txt', cookie);
    //fs.write('./' + cookieType + '/cookie.txt', cookie)

    output(cookie);

    page.close();
    phantom.exit();
  }

  page.open(url, function (s) {
    if(s==='success') {

      setTimeout(function () {

        //page.render(cookieType + 'i.jpg');

        page.evaluate(function () {
          setTimeout(function () {
            zyg_callPhantom(document.cookie)
          }, 1000)
        });
      }, 1000);
    }else{
      outputError('open===>ERROR:open fail');
    }
  });
}

console.log('Cookie Start');
auto();
