/**
 * Created by zyg on 16/5/16.
 */
var webPage = require('webpage');
var utils = require('./utils');
var config = require('./config/dir');

var system = require('system');
var fs = require('fs');

var level = String(system.args[1]);
var cat = system.args[2];
var cookie = system.args[3];

//默认爬取淘宝
var shopFrom = parseInt(level) === 4 ? 'suning' : 'taobao'

var fromTaobao = shopFrom === 'taobao'
var fromSuning = shopFrom === 'suning'

if (shopFrom === 'taobao' && cookie) {
  utils.parseCookieToPhantom(cookie).map(function (cookieOne) {
    phantom.addCookie(cookieOne);
  });
}

console.log('level:'+level+':'+(typeof level));
console.log('cat:'+cat+':'+(typeof cat));

if(cat.indexOf('_') !== -1){
  cat = cat.split('_').map(function (code) {
    return String.fromCharCode(parseInt('0x'+code))
  }).join('')
}


var url = shopFrom === 'taobao' ?
  utils.createSearchShopUrl(level,cat):
  utils.createSuningSearchUrl(cat);


var cities = [
  //直辖市
  '北京',

  '上海',
  //量大的省
  '浙江',

  '福建',

  '广东',

  '江苏,湖南,山东',

  //少数
  '广西,内蒙古,西藏,新疆,宁夏',

  //其它
  '河北,安徽,天津,重庆,甘肃,贵州,海南,河南,湖北,江西,陕西,云南,四川',

  '澳门,香港,台湾,内蒙古,青海,山西,黑龙江,辽宁,吉林'
]

//init city;
var currentCity = '';

var createPage = utils.createPageFn('pc')

var st = Date.now();

function taobaoList() {
  var shopCount = document.querySelector('.filter .shop-count b');
  var total = document.querySelector('.items + .total');
  var current = document.querySelector('.items .item.active .num');

  var noResult = document.querySelector('#shopsearch-noresult');

  var totalPage = 0;
  var currentPage = 0;
  var shopCountNumber = 0;

  if (!noResult || (noResult && noResult.style && noResult.style.display !== 'none' && noResult.innerHTML !== '')) {
    return _callPhantom('noResult' + (noResult ? noResult.style.display:'null'));
  }

  if (shopCount) {

    shopCountNumber = parseInt(shopCount.innerText);

    if (shopCountNumber > 20 && total && current) {
      totalPage = parseInt(total.innerText.match(/\d+/)[0]);
      currentPage = parseInt(current.innerText);
    }

  } else {

    return _callPhantom('noNumber' + (!!shopCount) + (!!total) + (!!current));
  }

  [].map.call(document.querySelectorAll('textarea.ks-datalazyload'), function (textarea) {
    var html = textarea.value;
    var div = document.createElement('div');
    textarea.parentNode.appendChild(div);
    div.innerHTML = html;
  });

  requestAnimationFrame(function () {

    var liArr = document.querySelectorAll('#list-container > li');

    if (liArr.length > 0) {

      var sellersArr = [].map.call(liArr, function (li) {

        var shopNameDom = li.querySelector('.shop-name');

        if (shopNameDom) {

          var uid = shopNameDom.getAttribute('trace-uid');
          var shopHref = shopNameDom.href;
          var shopName = shopNameDom.innerText.trim();
          var wangwang = li.querySelector('.shop-info-list > a').innerText.trim();
          var mainCat = li.querySelector('.main-cat a').innerText;

          //console.log(shopName,li.querySelector('.pro-sale-num').innerHTML);
          //console.log(shopName,li.querySelector('.info-sale').innerHTML);
          //console.log(shopName,li.querySelector('.info-sum').innerHTML);

          var sale = li.querySelector('.info-sale em');
          sale = sale ? sale.innerText.trim() : 0;
          var sum = li.querySelector('.info-sum em');
          sum = sum ? sum.innerText.trim() : 0;

          return {
            uid: uid,
            shopHref: shopHref,
            shopName: shopName,
            wangwang: wangwang,
            mainCat: mainCat,
            sale: sale,
            sum: sum,
          }
        } else {
          return {
            shopNameDom: false
          }
        }
      });


      _callPhantom({
        list: sellersArr,
        totalShops: shopCountNumber,
        end: currentPage >= totalPage || totalPage === 0,
      });
    } else {
      _callPhantom('noSellers');
    }
  });
}

function suningList(){

  var shopCount = document.querySelector('#search-path .r strong')
  var total = document.querySelector('.search-page .page-more')
  var current = document.querySelector('.search-page .cur')


  var totalPage = 0;
  var currentPage = 0;
  var shopCountNumber = 0;

  var noResult = document.querySelector('.store-no-result');
  if (noResult) {
    return _callPhantom('noResult' + (noResult ? noResult.style.display:'null'));
  }

  if (shopCount) {

    shopCountNumber = parseInt(shopCount.innerText);

    if (shopCountNumber > 10 && total && current) {
      totalPage = parseInt(total.innerText.match(/\d+/)[0]);
      currentPage = parseInt(current.innerText);
    }

  } else {

    return _callPhantom('noNumber' + (!!shopCount) + (!!total) + (!!current));
  }

  //[].map.call(document.querySelectorAll('textarea.ks-datalazyload'), function (textarea) {
  //  var html = textarea.value;
  //  var div = document.createElement('div');
  //  textarea.parentNode.appendChild(div);
  //  div.innerHTML = html;
  //});

  requestAnimationFrame(function () {

    var liArr = document.querySelectorAll('.store-box > ul > li');

    if (liArr.length > 0) {

      var sellersArr = [].map.call(liArr, function (li) {

        var shopNameDom = li.querySelector('dl a');

        if (shopNameDom) {

          var shopName = shopNameDom.innerText.trim();
          var shopHref = li.querySelector('.store-logo a').href
          var loc = li.querySelectorAll('dl dd')[0].innerText.trim().split('：')[1]
          var mainCat = li.querySelectorAll('dl dd')[1].innerText.trim().split('：')[1]

          //var sale = li.querySelector('.info-sale em');
          //sale = sale ? sale.innerText.trim() : 0;
          //var sum = li.querySelector('.info-sum em');
          //sum = sum ? sum.innerText.trim() : 0;

          return {
            shopName: shopName,
            shopHref: shopHref,
            mainCat: mainCat,
            loc:loc,
          }
        } else {
          return {
            shopNameDom: false
          }
        }
      });


      _callPhantom({
        list: sellersArr,
        totalShops: shopCountNumber,
        end: currentPage >= totalPage || totalPage === 0,
      });
    } else {
      _callPhantom('noSellers');
    }
  });
}

//查看商店数量,小于2000 or 1000 则一次
function shopNumber(basicUrl,callback){

  var page = createPage();

  page.open(basicUrl, function (s) {
    if(s==='success'){

      setTimeout(function () {

        var n = page.evaluate(function () {
          var shopCount;

          if(location.href.indexOf('taobao.com') !== -1) {
            shopCount = document.querySelector('.filter .shop-count b');
          }else if(location.href.indexOf('suning.com') !== -1){
            shopCount = document.querySelector('#search-path .r strong')
          }

          var shopCountNumber = 0;
          if (shopCount) {

            shopCountNumber = parseInt(shopCount.innerText);
          }
          return shopCountNumber;
        })

        page.close();

        callback(parseInt(n));
      },1000)
    }else{
      page.close();
      phantom.exit();
    }
  })
}

function queryList(){

  if(fromTaobao){
    return taobaoList
  }else if(fromSuning){
    return suningList
  }
}

function query(basicUrl,cat, city, startCount, result,callback) {

  var gap = fromTaobao ? 20 : 10;

  startCount = startCount < 0 ? 0 : startCount + gap;

  var finalUrl = fromTaobao ?
    utils.createSearchCountUrl(basicUrl, startCount) :
    utils.createSuningCountUrl(basicUrl,startCount);

  console.log('query result:'+result.length);

  if(fromTaobao) {
    fs.write(config.shopCatDir(cat + city.slice(0, 2) + '.json'), JSON.stringify(result));
  }else{
    fs.write(config.shopSuningDir(cat + city.slice(0, 2) + '.json'), JSON.stringify(result));
  }

  var lastResult = result[result.length - 1];
  if (lastResult.end) {

    console.log('end');

    //防止连续end
    lastResult.end = false;

    callback(result);

    return;
  }


  var cost = (Date.now() - st) / 1000;

  console.log(cat, city, startCount, '耗时:' + cost + '秒');
  console.log('finalUrl url:', finalUrl);

  var page = createPage();

  page.onCallback = function (backResult) {


    var isNoCode = /noResult/.test(backResult) || /noNumber/.test(backResult) || /noSellers/.test(backResult);

    if (typeof backResult === 'string') {
      console.log(backResult, isNoCode);
    }
    //异常
    if (!backResult) {
      console.log('no list');

      result.push({
        startCount: startCount,
        value: false,
        end: false,
        status: status,
      });

      page.close();
      callback();
    }
    //没有内容
    else if (backResult && isNoCode) {

      console.log(backResult);

      if(/noResult/.test(backResult)){
        page.render(config.renderDir(cat+'/noCode' + cat + city.slice(0,2) + '.jpg'));
      }

      result.push({
        startCount: startCount,
        value: [],
        end: false,
        status: status,
      });

      page.close();
      callback();
    }
    //有内容啦
    else {
      console.log('still');

      if (!result[0].totalShops) {
        result[0].totalShops = backResult.totalShops;
      }

      result.push({
        startCount: startCount,
        value: backResult.list,
        end: backResult.end,
        status: status,
      });

      page.close();
      //结束啦
      query(basicUrl,cat, city, startCount, result,callback);
    }
  };

  page.open(finalUrl, function (status) {
    console.log('open:', status);
    if (status === 'success') {

      setTimeout(function () {

        var list = page.evaluate(queryList());

      }, 500);

    } else {

      result.push({
        startCount: startCount,
        value: [],
        status: status,
      });

      page.close();
      query(basicUrl,cat, city, startCount, result,callback);
    }
  });
}

console.log('start url:'+url);


function startMultiQuery(queryResult,cities,createUrl,end){

  function task(i){
    if(i<cities.length){
      var city = cities[i];

      var basicUrl = createUrl(level,queryResult[0].cat,city);

      query(basicUrl,queryResult[0].cat,city,-1,queryResult,function(){
        task(++i);
      })
    }else{
      end()
    }
  }

  task(0)
}

shopNumber(url, function (shopNumber) {

  var queryResult = [{
    startCount: 0,
    cat: cat,
    city: '',
    totalShops: shopNumber,
    end:false
  }];

  console.log('cat:'+shopNumber+'家')

  if(isNaN(shopNumber) || shopNumber === 0){

    if(fromTaobao){
      fs.write(config.shopCatDir(cat + '.json'), JSON.stringify(queryResult));
    }else{
      fs.write(config.shopSuningDir(cat + '.json'), JSON.stringify(queryResult));
    }

    console.log('shopNumber null');
    phantom.exit();
  }else if(fromTaobao){

    if(shopNumber <= 2000){
      startMultiQuery(queryResult,[''],utils.createSearchShopUrl, function () {
        console.log('once done');
        phantom.exit();
      })
    }else{

      startMultiQuery(queryResult,cities,utils.createSearchShopUrl, function () {
        console.log('multi cities done');
        phantom.exit();
      })
    }
  }else if(fromSuning){
    startMultiQuery(queryResult,[''], function (_, cat, _2) {
      return utils.createSuningSearchUrl(cat)
    }, function () {
      console.log('suning once done');
      phantom.exit();
    })
  }
});