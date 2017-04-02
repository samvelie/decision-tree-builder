app.controller('NodeEditController', ['TreeFactory', '$firebaseAuth', '$routeParams', '$location', function(TreeFactory, $firebaseAuth, $routeParams, $location) {
  var auth = $firebaseAuth();
  var self = this;

  var thisTreeId = $routeParams.treeId;
  var thisNodeId = $routeParams.nodeId;
  self.nodeInfo = TreeFactory.nodeWithResponses;
  self.treeNodes = TreeFactory.treeWithNodes;

  //display for the question node being edited

  //get node
  //get options
  auth.$onAuthStateChanged(getNodeEditInfo);
  auth.$onAuthStateChanged(getAllNodesForTree);

  function getNodeEditInfo() {
    TreeFactory.getNodeWithResponses(thisTreeId, thisNodeId);
  }

  function getAllNodesForTree() {
    TreeFactory.getTreeWithNodes(thisTreeId);
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
  };

  self.followNode = function (followNodeId) {
    $location.url('/edit/' + thisTreeId + '/' + followNodeId);
  }

  //add options (post)
  self.addResponse = function(text) {
    TreeFactory.addResponse(text, thisTreeId, thisNodeId);
    self.newResponse = '';
  };

  //edit options (put)
  self.editResponseText = function(response) {
    console.log('editing:', response);
    TreeFactory.editResponseText(response, thisTreeId);
  };

  //delete options (delete)
  self.deleteResponse = function(responseId) {
    TreeFactory.removeResponse(responseId, thisTreeId, thisNodeId);
  };

  //select existing node
  self.selectExistingNode = function (selectedNodeId, responseId) {
    TreeFactory.updateResponse(responseId, selectedNodeId, thisTreeId, thisNodeId);
  };


}]);
