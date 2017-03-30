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

      for (var j = 0; j < nodeInfoArray.length-1; j++) {
        console.log(nodeInfoArray[j].nodeId);
        if(nodeInfoArray[j].nodeId==nodeInfoArray[j+1].nodeId) {
          nodeInfoArray.splice(j,1);
        }
      }

      for (var k = 0; k < nodeInfoArray.length; k++) {
        nodeInfoArray[k].options = [];
      }


      for (var l = 0; l < response.data.length; l++) {
           for (var m = 0; m < nodeInfoArray.length; m++) {
             if (nodeInfoArray[m].nodeId==response.data[l].from_node_id) {
               nodeInfoArray[m].options.push({
                 optionId: response.data[l].optionId,
                 text: response.data[l].response_text,
                 fromId: response.data[l].from_node_id,
                 toId: response.data[l].to_node_id
               });
             }
           }

      }


        console.log(nodeInfoArray);

        freeTreeComplete.nodeInfo = nodeInfoArray;


    });
  }

  return {
    getTreeList: getTreeList,
    freeTreeList: globalTrees,
    getFreeTreeForView: getFreeTreeForView,
    freeTreeNodesAndResponses: freeTreeComplete
  };
}]);
