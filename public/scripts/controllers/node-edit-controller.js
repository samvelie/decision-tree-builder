app.controller('NodeEditController', ['TreeFactory', '$firebaseAuth', '$http', '$routeParams', function(TreeFactory, $firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var thisTreeId = $routeParams.treeId;
  var thisNodeId = $routeParams.nodeId;
  self.nodeInfo = TreeFactory.nodeWithResponses;

  //display for the question node being edited

  //get node
  //get options
  auth.$onAuthStateChanged(getNodeEditInfo);

  function getNodeEditInfo() {
    TreeFactory.getNodeWithResponses(thisTreeId, thisNodeId);
  }



  //edit node question (put)
  //edit options (put)
  //add options (post)
  //add node (post)
      //return new question node id
			//edit new option with returned question node id -> to_id

}]);
