app.controller('AuthViewController', ['TreeFactory', '$firebaseAuth', '$routeParams', function(TreeFactory, $firebaseAuth, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeId = $routeParams.id;

  var nodeIdOrder = []; //tracks node id journey for back button operation;

  self.tree = treeId;

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

  //on click of option
  self.getNextQuestion = function(previousNodeId, nextNodeId) {
    console.log('going from nodeId ' + previousNodeId + ' to ' + nextNodeId);
    nodeIdOrder.push(previousNodeId);

    TreeFactory.getNodeWithResponses(treeId, nextNodeId);
  };

  //tracks backwards on tree
  self.previousQuestion = function() {
    var previousNodeId = nodeIdOrder.pop();
    TreeFactory.getNodeWithResponses(treeId, previousNodeId);
  };
}]);
