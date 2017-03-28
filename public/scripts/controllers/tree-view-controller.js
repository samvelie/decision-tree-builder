app.controller('TreeViewController', ['TreeFactory', '$firebaseAuth', '$routeParams', function(TreeFactory, $firebaseAuth, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeId = $routeParams.id;

  var nodeIdOrder = []; //tracks node id journey for back button operation;

  self.tree = treeId; //for testing

  self.nodeInfo = TreeFactory.nodeWithResponses;


  auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      console.log('tree view controller calling getStartingQuestion');
      getStartingQuestion(treeId);
    } else {
      console.log('Not logged in or not authorized.');
    }
  });

  function getStartingQuestion(treeId) {
    TreeFactory.getStartingNodeWithResponses(treeId);
  }

  //this below code needs to be functionalized and moved to the factory


  //on click of option
  self.getNextQuestion = function(previousNodeId, nextNodeId) {
    console.log('going from nodeId ' + previousNodeId + ' to ' + nextNodeId);
    nodeIdOrder.push(previousNodeId);

    TreeFactory.getNodeWithResponses(treeId, nextNodeId);
  };

  //if I want, update "current node" value with the node that was previously on when the next question is clicked, to allow to go backwards
  self.previousQuestion = function() {
    var previousNodeId = nodeIdOrder.pop();
    TreeFactory.getNodeWithResponses(treeId, previousNodeId);
  };
}]);
