var fs = require('fs')
var _ = require('lodash')
var utils = require('./utils')
var config = require('./config/dir');

var parseShopData = require('./parseShopData')
var system = require('system')

var shopUrl = system.args[1]
var cookie = system.args[2]
var saveFileArg = system.args[3];

if (cookie) {
  utils.parseCookieToPhantom(cookie).map(function (cookieOne) {
    phantom.addCookie(cookieOne)
  })
}

var urlParse = utils.urlParse(shopUrl)

var htmlFile = config.shopIndexDir(urlParse.shop_id+'/index.html');

function pageViewFile(fix,e) {
  var contentDir = config.shopIndexDir(urlParse.shop_id+'/',e);
  return contentDir + 'pageView' + fix + '.json'
}

function saveFile(content,isFail){
  if(saveFileArg || 1){
    fs.write(pageViewFile(0, isFail), content)
  }
}

var createPage = utils.createPageFn('m');

var page = createPage()

var pageViewUrlArr = []
var finalPageViewUrl = ''

var count = 0
var pageViewOpened = false;


page.onResourceReceived = function (response) {
  if (
    !pageViewOpened
    && response.stage == "end"
    && response.url.indexOf("mtop.geb.view.getpageview") > 0
  ) {
    console.log('pageview:', response.url)

    if (response.url.indexOf('login.taobao.com') === -1
        && response.url.indexOf('pass.tmall.com') === -1
    ) {

      pageViewUrlArr.push(response.url)
      finalPageViewUrl = response.url

      if (finalPageViewUrl) {
        pageViewOpened = true;

        var jsonPage = createPage()
        jsonPage.open(finalPageViewUrl, function (s) {

          var htmlJson = page.evaluate(parseShopData.htmlData)

          if (s === 'success') {
            if (jsonPage.content.indexOf('调用成功') !== -1) {

              saveFile(jsonPage.content);
              try {
                var viewDatJson = parseShopData.viewJsonData(jsonPage.content)

                viewDatJson = viewDatJson.concat(htmlJson);

                console.log('open===>SUCCESS' + JSON.stringify(viewDatJson))
              } catch (e) {
                console.log(e);
                console.log('open===>ERROR:PARSE_ERROR')
              }
            } else {
              console.log('open===>ERROR:ILLEGAL');

              saveFile(jsonPage.content, 'fail');
            }
          } else {
            console.log('open===>ERROR:JSON_FAIL');
          }
          jsonPage.close();
          page.close();
          phantom.exit()
        })
      }
    }
  }
}

page.open(shopUrl, function (status) {
  fs.write(htmlFile, page.content)

  if (status === 'success') {
    setTimeout(function () {

      //console.log('pageViewUrl:',finalPageViewUrl);
      //if(finalPageViewUrl){
      //  var jsonPage = createPage()
      //  jsonPage.open(finalPageViewUrl, function (s) {
      //    if(s === 'success') {
      //      if (jsonPage.content.indexOf('调用成功') !== -1) {
      //
      //        saveFile(jsonPage.content);
      //        try{
      //          var viewDatJson = parseShopData.viewJsonData(jsonPage.content)
      //          output(JSON.stringify(viewDatJson))
      //        }catch(e){
      //          console.log(e);
      //          console.log('open===>ERROR:PARSE_ERROR')
      //        }
      //      }else{
      //        console.log('open===>ERROR:ILLEGAL');
      //
      //        saveFile(jsonPage.content,'fail');
      //      }
      //    }else{
      //      console.log('open===>ERROR:JSON_FAIL');
      //    }
      //    jsonPage.close();
      //    page.close();
      //    phantom.exit()
      //  })
      //}else{
      //  console.log('open===>ERROR:NO_JSON')
      //  page.close();
      //  phantom.exit()
      //}
      if(finalPageViewUrl){
        console.log('finalPageViewUrl:'+finalPageViewUrl);
      }else{
        console.log('open===>ERROR:NO_JSON,2000')
        page.close();
        phantom.exit()
      }
    },2000)
  } else {
    console.log('open===>ERROR:HTML_FAIL')
    phantom.exit()
  }
})