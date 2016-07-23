/**
 * Created by zyg on 16/5/20.
 */
var _ = require('lodash');

function parseData(data){

  //var clickUrl = [],
  //  imagesUrl = [],
  //  itemIds = [],
  //  textPicImageUrl = [],
  //  textPicContentUrl = []
  //
  //var urlArr = [clickUrl,imagesUrl,itemIds,textPicImageUrl,textPicContentUrl]
  //
  //var clickUrlReg = /clickUrl/,
  //  imagesUrlReg = /imageUrl/,
  //  itemIdsReg = /itemIds/,
  //  textPic_image_urlReg = /textPic_image_url/,
  //  textPic_content_urlReg = /textPic_content_url/
  //
  //var regArr = [clickUrlReg,imagesUrlReg,itemIdsReg,textPic_image_urlReg,textPic_content_urlReg]

  //_.map(data,function(v,k){
  //  regArr.forEach(function (reg, i) {
  //    if(reg.test(k)){
  //      urlArr[i] = urlArr[i].concat(v)
  //    }
  //  })
  //})

  //return {
  //  clickUrl:clickUrl,
  //  imagesUrl:imagesUrl,
  //  itemIds:itemIds,
  //  textPicImageUrl:textPicImageUrl,
  //  textPicContentUrl:textPicContentUrl,
  //};
  var urlReg = /\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;
  var imageReg = /(\.jpg|\.png|\.gif)$/

  function getUrls(data,urls){

    if(_.isObject(data)){
      return _.map(data,function(v) {
        return getUrls(v,urls);
      });

    }else{
      if(urlReg.test(data) && !imageReg.test(data)){
        urls.push(data);
      }
    }
  }

  var urls = [];

  getUrls(data,urls);


  return urls;
}

/*
 * 过滤无用数据
 */
function unfold(data){
  //过滤无用的变量
  var privateReg = /^_/;

  var newData = {}

  _.map(data,function(v,k){
    if(!privateReg.test(k)){
      newData[k] = v;
    }
  })

  return newData;
}

function clearJsonpCode(viewJsonData){

  var bracketsLeftIndex = viewJsonData.indexOf('(');
  var bracketsRightIndex = viewJsonData.lastIndexOf(')')

  viewJsonData = viewJsonData.substring(bracketsLeftIndex+1,bracketsRightIndex)

  return JSON.parse(viewJsonData);
}

module.exports = function(viewJsonData){

  var data = clearJsonpCode(viewJsonData)
  var urlArr = parseData(data.data.data);

  return urlArr;
}