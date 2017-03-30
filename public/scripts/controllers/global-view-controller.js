app.controller('GlobalViewController', ['GlobalFactory', '$routeParams', function(GlobalFactory, $routeParams) {
  var self = this;
  var treeId = $routeParams.id;

  self.nodeIndex = 0; 

  self.message = "Global Viewer!";

  GlobalFactory.getFreeTreeForView(treeId);

  self.fullTree = GlobalFactory.freeTreeNodesAndResponses;

  function setDisplay(toNodeId) {
    self.nodeIndex = toNodeId
  }




}]);
