/**
 * Created by zyg on 16/7/11.
 */
var system = require('system')
var fs = require('fs')
var utils = require('./utils')
var config = require('./config/dir');

var resemblesJs = './libs/resemble.js'

var img1 = system.args[1]
var img2 = system.args[2]

var pageFn = utils.createPageFn('m')

var page = pageFn()

var urlFn = function (img1, img2) {
  return 'http://localhost:3002/index/blank?img1=' + img1 + '&img2=' + img2
}

if(utils.check.isUrl(img1) && utils.check.isUrl(img2)) {

  page.setContent('<img id="img1" src="'+img1+'" /><img id="img2" src="'+img2+'" />')
  page.injectJs(resemblesJs)
  page.evaluate(function () {

    var img1 = document.querySelector('#img1');
    var img2 = document.querySelector('#img2');

    var body = document.querySelector('body')

    resemble(img1).compareTo(img2).onComplete(function (data) {
      console.log(JSON.stringify(data))

      _callPhantom(data.rawMisMatchPercentage.toFixed(2))
    })
  })

  page.onCallback = function (misMatch) {
    output(misMatch)
  }
}else{
  outputError('img1,img2 isnt valid url')
}