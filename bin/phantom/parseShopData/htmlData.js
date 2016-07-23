//运行于evaluate中
//返回结果
/**
 * [
 * {
 *   name:'name1',
 *   children:[{
 *     href
 *     text
 *   }]
 * }
 * ]
 * @returns {Array}
 */
module.exports = function(){

  var list = [];

  var menuSelector = [
    '.menu-item-index-0',
    '.menu-item-index-1',
    '.menu-item-index-2',
  ];

  menuSelector.forEach(function (s) {
    var menuDOM = document.querySelector(s)

    if(menuDOM){

      var menuObj = {
        name:menuDOM.childNodes[0].nodeValue.trim(),
        children:[].map.call(menuDOM.querySelectorAll('.sub-menu-item a'),function(a){
          return {
            href:a.href,
            text:a.innerText.trim()
          }
        })
      }

      list.push(menuObj)
    }
  })

  return list.map(function (menuOne) {
    return menuOne.children.map(function(linkObj){
      return linkObj.href
    })
  }).reduce(function (init,links) {
    return init.concat(links)
  },[])
}