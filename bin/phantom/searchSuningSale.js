/**
 * Created by zyg on 16/6/23.
 */
var webPage = require('webpage');
var utils = require('./utils');
var config = require('./config/dir');

var system = require('system');
var fs = require('fs');

var shopHref = String(system.args[1]);

var createPage = utils.createPageFn('pc')


var shopSortSaleHref = shopHref.replace(/index\.html/,'') + 'search.html?keyword=&sortField=totalCount-desc'

var page = createPage();

//拦截图片加载
page.onResourceRequested = function (reqD, netR) {
  if(/(\.jpg)|(\.png)/.test(reqD.url)){
    netR.abort()
  }
}

var list = function () {

  var liArr = document.querySelectorAll('.sf-search-product > ul > li');

  var all = [].map.call(liArr, function (li) {

    var sale = li.querySelector('.sf-saleInfo .sf-salenum-wrap span');
    var comment = li.querySelector('.sf-saleInfo > a');

    var saleNum = -1
    var commentNum = -1

    if(sale && comment){

      saleNum = parseInt(sale.innerText)
      commentNum = comment.innerText.split('：')[1]

    }

    return [saleNum,commentNum]
  })

  return all;
}

page.open(shopSortSaleHref, function (s) {
  if(s==='success'){

    var l = page.evaluate(list)

    output(JSON.stringify(l));

    page.close()
    phantom.exit();

  }else{
    console.log('open===>ERROR open fail');
    page.close()
    phantom.exit();
  }
})