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



  //add options (post)
  self.addResponse = function(text) {
    TreeFactory.addResponse(text, thisTreeId, thisNodeId);
  };

  //edit options (put)

  //delete options (delete)
  self.deleteResponse = function(responseId) {
    TreeFactory.removeResponse(responseId, thisTreeId, thisNodeId);
  };
  
  //add node (post)
  self.addNodeToResponse = function(content, fromResponseId) {
    console.log('content', content + ' fromResponseId ' + fromResponseId);
    //return new question node id
    //pass "from" option id in function
    //edit new option with returned question node id -> to_id
    TreeFactory.addNode(content, thisTreeId, fromResponseId);
  };


}]);
