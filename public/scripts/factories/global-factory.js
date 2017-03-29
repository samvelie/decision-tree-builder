app.factory('GlobalFactory', ['$http', function($http) {
  var globalTrees ={};
  var freeTreeComplete = {};

  getTreeList();

  function getTreeList() {
    $http({
      method: 'GET',
      url: '/global'
    }).then(function(response) {
      console.log(response.data);
      globalTrees.list = response.data;
    });
  }

  function getFreeTreeForView(treeId) {
    $http({
      method: 'GET',
      url: '/global/' + treeId
    }).then(function(response) {
      console.log('info for treeId' + treeId + ': ' + response.data);

    });
  }

  return {
    getTreeList: getTreeList,
    freeTreeList: globalTrees,
    getFreeTreeForView: getFreeTreeForView,
    freeTreeNodesAndResponses: freeTreeComplete
  };
}]);
