app.controller('TreeViewController', ['TreeFactory', '$firebaseAuth', '$routeParams', function(TreeFactory, $firebaseAuth, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeId = $routeParams.id;

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
  self.getNextQuestion = function(nextNodeId) {
    console.log('going to nodeId', nextNodeId);
    TreeFactory.getNodeWithResponses(treeId, nextNodeId);
  };

}]);
