app.controller('GlobalViewController', ['GlobalFactory', '$routeParams', function(GlobalFactory, $routeParams) {
  var self = this;
  var treeId = $routeParams.id;

  self.indexPath = [];

  self.nodeIndex = 0; //starting index will be 0 as SQL query returns sorted by node id (smallest node id is what I use as starting)

  GlobalFactory.getFreeTreeForView(treeId);

  self.fullTree = GlobalFactory.freeTreeNodesAndResponses;

  self.setDisplay= function(toNodeId) {
    self.indexPath.push(self.nodeIndex);
    for(var i = 0; i < self.fullTree.nodeInfo.length; i ++) {
        if(self.fullTree.nodeInfo[i].nodeId === toNodeId) {
            self.nodeIndex= i;

        }
    }
  };

  self.goBack = function() {
    self.nodeIndex = self.indexPath.pop();
  }


}]);
