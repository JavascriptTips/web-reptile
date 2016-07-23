/**
 * Created by zyg on 16/5/21.
 */
var serverDirPre = '/data/web-reptile/data/';

//var system = require('system')
//
//window.__DEV__ = system.env.NODE_ENV !== 'production';
//
//var dirPre;
//
//if(__DEV__){
//  dirPre = localDirPre;
//}else{
//  dirPre = serverDirPre;
//}

module.exports = {

  shopIndexDir:function(file,fail){
    if(fail){
      return dirPre+'index/fail/'+file
    }
    return dirPre+'index/'+file
  },
  //卖家数量
  shopCatDir:function(file,fail){
    if(fail){
      return dirPre+'cat/fail/'+file
    }
    return dirPre+'cat/'+file
  },
  shopSuningDir:function(file,fail){
    if(fail){
      return dirPre+'su_cat/fail/'+file
    }
    return dirPre+'su_cat/'+file
  },
  //店铺类目
  shopMainCatDir:function(file,fail){
    if(fail){
      return dirPre+'main-cat/fail/'+file
    }
    return dirPre+'main-cat/'+file
  },
  renderDir:function(file){
    return dirPre + 'render/'+file
  }
}