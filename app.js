(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com")

.filter('menuObjArrayFilter',function(){
    var newobjArray=[];
   return function(objArray,searchTerm)
   {
       var objArrayLength=objArray.length;
       for(var i=0;i<objArrayLength;i++)
       {
           if(objArray[i].description.indexOf(searchTerm)>=0)
           newobjArray.push(objArray[i]);
       }
       
      return newobjArray;
   };

});
NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;



  menu.foundItems = function (shortName) {
    var foundItems = MenuSearchService.getMatchedMenuItems(shortName);
  
    
  };

}


MenuSearchService.$inject = ['$http', 'ApiBasePath','$filter'];
function MenuSearchService($http, ApiBasePath,$filter) {
  var service = this;

 

  service.getMatchedMenuItems  = function (searchTerm) {
    return   $http({
      method: "GET",
      url: (ApiBasePath + "/menu_items.json")
   
    }).then(function (response) {
        console.log(response.data.menu_items);
     console.log( $filter('menuObjArrayFilter')( response.data.menu_items,searchTerm).length);
    }).catch(function (error) {
      console.log(error);
    })

 
  };

}

})();
