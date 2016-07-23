/**
 * Created by zyg on 16/5/16.
 */
var _ = require('lodash');
var webPage = require('webpage');
var system = require('system')
var fs =require('fs')

var flag = require('./config/flag')

window.__DEV__ = system.env.NODE_ENV !== 'production' && system.env.NODE_ENV !== 'product';

var LEVEL_TMALL = '0';
var LEVEL_GOLD = '2';
var LEVEL_GRAND = '3';

var phantomDir = './services/phantom/'

window.output  = function(str){
  if(typeof str !== 'string'){
    str = String(str)
  }
  console.log(flag.successFlag+str)
}
window.outputError = function(str){
  if(typeof str !== 'string'){
    str = String(str)
  }
  console.log(flag.errorFlag+str)
}

module.exports = {

  LEVEL_TMALL:LEVEL_TMALL,
  LEVEL_GOLD:LEVEL_GOLD,
  LEVEL_GRAND:LEVEL_GRAND,

  check:{

    isEmpty : function(){
      if(arguments[0] === "") return true;
      else return false;
    },

    isEmail : function(){
      // var reg = /\w@\w*\.\w/;
      var reg = /^([a-z0-9A-Z]+[-|\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\.)+[a-zA-Z]{2,}$/g;
      if(reg.test(arguments[0])) return true;
      else return false;
    },

    isPhone : function(){
      var reg = /^0{0,1}(13[0-9]|14[0-9]|15[0-9]||17[0-9]|18[0-9])[0-9]{8}$/g;
      if(reg.test(arguments[0])) return true;
      else return false;
    },

    isZipCode : function(){
      var reg = /^[1-9]\d{5}$/g;
      if(reg.test(arguments[0])) return true;
      else return false;
    },

    isChinese : function(){
      // console.log(arguments[0]);
      var reg = /^[\u4e00-\u9fa5]+$/;
      if(reg.test(arguments[0])) return true;
      else return false;
    },

    isUrl: function(){
      var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
      var arg = arguments[0].replace(rtrim, "");
      // var reg = /^((https?|ftp|file|ssh):\/\/)*(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/g;
      var reg = /^((https?|ftp|file|ssh|taobao|meidian):\/\/)*([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
      if(reg.test(arg)) return true;
      else return false;
    },

    isNumber: function(){
      if(/^[1-9]+[0-9]*$/.test(arguments[0])) return true;
      else return false;
    },

    isMp4Url: function (url) {
      if(!url){
        url = '';
      }
      var format = 'mp4';
      var fr = (url.length - format.length) === url.lastIndexOf(format);

      return url && this.isUrl(url) && fr;
    },
    isTaobaoMp4Url: function (url) {
      var reg = /video\.taobao/;
      return reg.test(url) && this.isMp4Url(url);
    }
  },

  randomPCUserAgent: function () {
    var arr = [
      'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.91 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36 SE 2.X MetaSr 1.0'
    ];

    return arr[parseInt(Math.random() * arr.length)];
  },

  randomUserAgent: function () {
    var arr = [
      'Mozilla/5.0 (Linux; Android 5.1.1; Nexus 6 Build/LYZ28E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.23 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 4.4.4; en-us; Nexus 4 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2307.2 Mobile Safari/537.36',
      'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.76 Mobile Safari/537.36',
      'Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
      'Mozilla/5.0 (iPad; CPU OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1',
    ];

    return arr[parseInt(Math.random() * arr.length)];
  },

  createSuningCountUrl: function (url,startCount) {
    return url + '&cp=' + (startCount/10)
  },

  createSearchCountUrl: function (url, startCount) {
    return url + '&s=' + startCount;
  },

  createSuningSearchUrl: function (cat) {
    var u = 'http://search.suning.com/shop/search.do?app=shopsearch&keyword='+encodeURIComponent(cat)+'&st=1'

    return u;
  },
  createSearchShopUrl: function (isb,cat,city) {
    var urlPre = false;

    if(!city){
      city = ''
    }

    switch (isb) {
      case LEVEL_TMALL:
        urlPre = 'https://shopsearch.taobao.com/search?app=shopsearch&q='+encodeURIComponent(cat)+'&loc='+encodeURIComponent(city)+'&isb=1&shop_type=&ratesum=&goodrate=';
        break;
      case LEVEL_GOLD:
        urlPre = 'https://shopsearch.taobao.com/search?app=shopsearch&goodrate=&sort=credit-desc&isb=0&ratesum='+encodeURIComponent('11,')+'&q='+encodeURIComponent(cat)+'&loc='+encodeURIComponent(city);
        break;
      case LEVEL_GRAND:
        urlPre = 'https://shopsearch.taobao.com/search?app=shopsearch&goodrate=&sort=credit-desc&isb=0&ratesum='+encodeURIComponent('11,')+'&q='+encodeURIComponent(cat)+'&&loc='+encodeURIComponent(city);
        break;
    }
    return urlPre;
  },

  /**
   * 解析cookie字符串
   * @param cookie
   * @returns {*}
   */
  parseCookieToPhantom: function (cookie) {
    return cookie.split(';').map(function (kvStr) {
      return kvStr.trim()
    }).map(function (kvStr) {
      return kvStr.split('=');
    }).reduce(function (pre, next) {
      var cookieTmp = {
        "expires": Date.now() + 3600 * 1000,
        "name": next[0],
        "value": next[1],
        'domain': ".tmall.com",
        'secure': false
      };
      return pre.concat(cookieTmp).concat(_.assign({}, cookieTmp, {
        'domain': '.taobao.com'
      }));
    }, []);
  },
  replaceCookieValue: function replaceCookieValue(cookie, key, v) {
    return cookie.split(';').map(function (kvStr) {
      return kvStr.trim().split('=')
    }).map(function (kvArr) {
      if (kvArr[0] === key) {
        kvArr[1] = v;
      }
      return kvArr.join('=')
    }).join(';')
  },
  urlParse: function (url) {
    return url.substr(url.indexOf('?') + 1).split('&').map(function (kvStr) {
      return kvStr.split('=')
    }).reduce(function (pre, next) {
      pre[next[0]] = decodeURIComponent(next[1]);
      return pre;
    }, {});
  },

  createPageFn: function createPageFn(type) {
    var viewportSize;
    var randomUserAgentFn;

    if (type === 'm') {
      viewportSize = {
        width: 640,
        height: 1200
      }
      randomUserAgentFn = this.randomUserAgent;
    } else if (type === 'pc') {
      viewportSize = {}
      randomUserAgentFn = this.randomPCUserAgent;
    }

    return function () {
      var p = webPage.create()
      p.viewportSize = viewportSize;

      p.settings.resourceTimeout = 5000
      p.settings.userAgent = randomUserAgentFn()
      p.customHeaders = {
        'Accept': 'text\/html,application\/xhtml+xml,application\/xml;q=0.9,image\/webp,*\/*;q=0.8',
        'Accept-language': 'zh-CN,zh;q=0.8,en-US;q=0.6,en;q=0.4',
        'Cache-control': 'no-cache',
        'Pragma': 'no-cache',
        'Upgrade-insecure-requests': '1',
      }

      if (__DEV__) {
        p.onConsoleMessage = function (message) {
          console.log('CONSOLE==>', JSON.stringify(message))
        }
      }
      p.onError = function (e, trace) {
        console.log('open===>JS_ERROR:' + JSON.stringify(e) + JSON.stringify(trace));
      }
      p.onInitialized = function () {

        p.evaluate(function () {
          window.zyg_callPhantom = callPhantom;
          window._callPhantom = callPhantom;
          callPhantom = undefined

          delete window.callPhantom;
          delete window.webdriver;

          window.ontouchstart=true
        })
      }
      p.onResourceRequested = function (reqD,netWorkR) {
        if(/aplus\/index\.js$/.test(reqD.url)){
          try{
            netWorkR.changeUrl('http://127.0.0.1:9500/tb_xss/aplus1.5.1.js')
          }catch(e){
            console.log(e);
          }
        }
      }


      return p
    }
  }
};