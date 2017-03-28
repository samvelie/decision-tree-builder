app.controller('NodeEditController', ['TreeFactory', '$firebaseAuth', '$routeParams', '$location', function(TreeFactory, $firebaseAuth, $routeParams, $location) {
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

  //add node (post)
  self.addNodeToResponse = function(content, fromResponseId) {
    console.log('content', content + ' fromResponseId ' + fromResponseId);
    //returns new question node id
    //edit new option with returned question node id -> to_id
    TreeFactory.addNode(content, thisTreeId, fromResponseId, thisNodeId);
  };

  //edit node question (put)
  self.updateNodeContent = function (nodeToUpdate) {
    console.log(nodeToUpdate);
    var followNodeId = nodeToUpdate.id;
    TreeFactory.editNode(nodeToUpdate);
    $location.url('/edit/' + thisTreeId + '/' + followNodeId);
  };



  //add options (post)
  self.addResponse = function(text) {
    TreeFactory.addResponse(text, thisTreeId, thisNodeId);
  };

  //edit options (put)


  //delete options (delete)
  self.deleteResponse = function(responseId) {
    TreeFactory.removeResponse(responseId, thisTreeId, thisNodeId);
  };




}]);
