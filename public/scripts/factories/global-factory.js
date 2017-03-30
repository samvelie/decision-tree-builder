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
      console.log('info for treeId' + treeId + ': ');
      // freeTreeComplete.data = response.data;
      var treeName = response.data[0].tree_name;
      freeTreeComplete.name = treeName;
      var nodeInfoArray = [];
      var nodeResponsesArray = [];

      for (var i = 0; i < response.data.length; i++) {
        nodeInfoArray.push({
          nodeId: response.data[i].nodeId,
          content: response.data[i].content,
          tree_end: response.data[i].tree_end
        });
        }

      for (var i = 0; i < nodeInfoArray.length-1; i++) {
        console.log(nodeInfoArray[i].nodeId);
        if(nodeInfoArray[i].nodeId==nodeInfoArray[i+1].nodeId) {
          nodeInfoArray.splice(i,1);
        }
      }

      for (var i = 0; i < nodeInfoArray.length; i++) {
        nodeInfoArray[i].options = [];
      }


      for (var i = 0; i < response.data.length; i++) {
           for (var j = 0; j < nodeInfoArray.length; j++) {
             if (nodeInfoArray[j].nodeId==response.data[i].from_node_id) {
               nodeInfoArray[j].options.push({
                 optionId: response.data[i].optionId,
                 text: response.data[i].response_text,
                 fromId: response.data[i].from_node_id,
                 toId: response.data[i].to_node_id
               })
             }
           }

      }


        console.log(nodeInfoArray);
        // console.log(nodeResponsesArray);

        freeTreeComplete.nodeInfo = nodeInfoArray;
        // freeTreeComplete.responseInfo = nodeResponsesArray;

    });
  }

  return {
    getTreeList: getTreeList,
    freeTreeList: globalTrees,
    getFreeTreeForView: getFreeTreeForView,
    freeTreeNodesAndResponses: freeTreeComplete
  };
}]);
