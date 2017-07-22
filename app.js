(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")
.filter('menuObjArrayFilter', menuObjArrayFilter  )
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
   var ddo = {
    templateUrl: 'template.html',
      scope: {
        items: '<',
        onRemove: '&'
      },
      controller: NarrowItDownController,
      controllerAs: 'menu',
      bindToController: true
    }

  return ddo
}


function menuObjArrayFilter() {
  
   return function(objArray,searchTerm)
   {
       var newobjArray=[];
       var objArrayLength=objArray.length;
       for(var i=0;i<objArrayLength;i++)
       {
           if(objArray[i].description.indexOf(searchTerm)>=0)
            {

             // console.log(objArray[i].description);
                newobjArray.push(objArray[i]);
            }
         
       }
       
      return newobjArray;
   };
}
NarrowItDownController.$inject = ['MenuSearchService','$filter'];
function NarrowItDownController(MenuSearchService,$filter) {
  var menu = this;
 
   menu.nothing=false;
   menu.searchTerm='';
 menu.foundItems=[];
  menu.find = function (searchTerm) {
    var p = MenuSearchService.getMatchedMenuItems(searchTerm);
    menu.nothing=false;
    p.then(function (response) {
       // console.log(response.data.menu_items);
      menu.foundItems=$filter('menuObjArrayFilter')( response.data.menu_items,searchTerm);
      if(menu.foundItems.length==0)menu.nothing=true;
    }).catch(function (error) {
      console.log(error);
    });
  };

  menu.removeItem=function (idx)
  {
    if(menu.foundItems.length>0)menu.foundItems.splice(idx,1);
  }

}


MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
  var service = this;

 

  service.getMatchedMenuItems  = function (searchTerm) {

   // console.log('searchTerm : ' + searchTerm );
    return   $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
   
    });

 
  };

}

})();
