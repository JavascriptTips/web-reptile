var system = require('system')
var fs = require('fs');
var utils = require('./utils')
var config = require('./config/dir');

var shopUrl = system.args[1]
var cookie = system.args[2]
var isTestURL = system.args[3]

window.__DEV__ = isTestURL;

console.log(shopUrl)
console.log(cookie)

if (cookie) {
  utils.parseCookieToPhantom(cookie).map(function (cookieOne) {
    phantom.addCookie(cookieOne)
  })
}
var urlParse = utils.urlParse(shopUrl)

var createPage = utils.createPageFn('m');

var page = createPage();
page.viewportSize = {
  width: 320,
  height: 570,
}
page.clipRect = {
  left: 0,
  top: 0,
  width: page.viewportSize.width,
  height: page.viewportSize.height,
}

var finalPageViewUrl = ''
var itemUrl = '';

if(isTestURL || __DEV__) {
  page.onResourceReceived = function (response) {
    var jsonPage
    if (response.url.indexOf("mtop.geb.view.getpageview") > 0 && response.stage === "end") {
      finalPageViewUrl = response.url;
      if (finalPageViewUrl) {
        jsonPage = createPage()
        console.log('pageView:',finalPageViewUrl);
        jsonPage.open(finalPageViewUrl, function (s) {
          fs.write('anything/catContent.json', jsonPage.content);
          jsonPage.close();
        })
      }
    }else if(response.url.indexOf('com.taobao.search.api.getshopitemlist') > 0 && response.stage==='end'){
      itemUrl = response.url;
      if (itemUrl) {
        jsonPage = createPage()
        console.log('itemUrl:',itemUrl);

        jsonPage.open(itemUrl, function (s) {
          fs.write('anything/shopitemlist.json', jsonPage.content);
          jsonPage.close();
        })
      }
    }
  }
}

page.open(shopUrl, function (status) {
  if (status === 'success') {

    page.injectJs(
      './libs/offset.js'
    );
    page.evaluate(function () {

      [].map.call(document.querySelectorAll('a'),function(a){
        if(a.innerText === '关闭'){
          a.click();
        }
      });
      //var searchBox = document.querySelector('#J_open_search');
      //if(searchBox){
      //  searchBox.remove();
      //}
      var tmall = /\.m\.tmall\./.test(location.href);
      var list = /#list/.test(location.href);
      var activityPage = /weapp\/view_page/.test(location.href);

      var maxSt = 3000;

      var menuDom = document.querySelector('.tm-btm-menu.J_btmMenuCtn.tm-mdv');
      if (menuDom) {
        menuDom.style.top = '522px'
      }

      var bottom = document.getElementById('bottom');
      if (bottom) {
        bottom.remove();
      }

      var allDiv = document.querySelectorAll('div');
      if (allDiv && allDiv.length > 0) {
        allDiv[allDiv.length - 1].remove();
      }

      //蜜汁数字，总之tmall和淘宝的开始的图片不太一样。
      var initImgNum = list ? 0:
        (tmall || activityPage)? 6 : 9; //7=首页6个最原始的+至少一个元素

      //检测分类页的渲染
      if(list){
        var listSi = setInterval(function(){

          var items = document.querySelectorAll('#js-goods-list-items li');
          if(items && items.length > 0){

            console.log('items:'+items.length);

            if(items[0].innerText.trim() === '未找到符合的宝贝'){
              initImgNum = 0
              _callPhantom([]);
            }else{
              initImgNum = items.length > 5 ? 5:items.length;
            }
            clearInterval(listSi);
          }else{
            console.log('items:');
            initImgNum = 0;
          }
          setTimeout(function () {
            clearInterval(listSi);
          },maxSt-50)
        },100)
      }

      var si = setInterval(function () {
        var imgs = document.querySelectorAll('img');
        imgs = [].filter.call(imgs,function(img){
          return !/^data:image|(.gif$)/.test(img.src)
        });

        var allComplete = imgs.length >= initImgNum;
        var count = 0
        var firstScreen = [];

        imgs.map(function (img) {
          if (!img.mdOffsetTop) {
            img.mdOffsetTop = parseInt(offset(img).top);
          }

          firstScreen.push(img.src);

          if (allComplete && img.mdOffsetTop < 570) {
            allComplete = img.complete
            count++;

            firstScreen.push(img.src);
          }
        });
        allComplete = allComplete && !!count;

        console.log('allComplete:'+imgs.length+'-'+allComplete+'-'+count);

        if (allComplete) {
          clearInterval(si);
          setTimeout(function () {
            _callPhantom(firstScreen);
          },150);
        }
      }, 150);

      //最多等待2秒
      setTimeout(function () {
        clearInterval(si);
        _callPhantom();
      },maxSt)
    });

  } else {
    console.log('open===>ERROR:open fail');
    page.close();
    phantom.exit();
  }
});

var called = false;
page.onCallback = function(firstScreen){

  if(called){
    return;
  }
  called=true;

  if(isTestURL){
    fs.write('anything/fs.json',JSON.stringify(firstScreen,null,2));
  }

  if(!firstScreen){

    console.log('open===>ERROR:img load');
    page.close();
    phantom.exit();

  }else{
    var imgPath = config.renderDir(urlParse.shop_id + '_' + Date.now() + '.jpeg');
    page.render(imgPath, {
      format: 'jpeg',
      quality: 95
    });

    console.log('open===>SUCCESS' + imgPath);
    page.close();
    phantom.exit();
  }
};