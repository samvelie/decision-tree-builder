app.controller('HomeController', ['TreeFactory', '$firebaseAuth', '$http', function(TreeFactory, $firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;

  self.treeArray = TreeFactory.userTrees;
  self.newTree = {};

  auth.$onAuthStateChanged(getTrees);

  // need to be able to add new trees. Eventually want this process to bring user to different view
  self.addTree = function(treeObject) {
    TreeFactory.addTree(treeObject);
    getTrees();
  };

  function getTrees(){
    TreeFactory.getUserTrees();
  }


}]);
