app.controller('HomeController', ['TreeFactory', '$firebaseAuth', '$http', function(TreeFactory, $firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;

  self.treeArray = TreeFactory.userTrees;
  self.newTree = {};

  auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      console.log('hq controller calling getTrees');
      getTrees();
    } else {
      console.log('Not logged in or not authorized.');
      self.secretData = "Log in to get some secret data.";
    }
  });

  // need to be able to add new trees. Eventually want this process to bring user to different view
  self.addTree = function(treeObject) {
    console.log('hq controller ask factory to add tree');
    TreeFactory.addTree(treeObject);
    // getTrees();
  };

  self.deleteTree = function(treeId) {
    TreeFactory.removeTree(treeId);
  }

  function getTrees(){
    console.log('in hq getTrees: asking factory to get trees');
    TreeFactory.getUserTrees();
  }


}]);
