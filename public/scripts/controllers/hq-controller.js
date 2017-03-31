app.controller('HomeController', ['TreeFactory', '$firebaseAuth', '$http', function(TreeFactory, $firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;

  self.treeArray = TreeFactory.userTrees;
  self.newTree = {};
  self.loggedIn = TreeFactory.loggedIn;

  //this $onAuthStateChanged helps maintain the page data on reloads, rather than just calling getTrees by itself
  auth.$onAuthStateChanged(function(firebaseUser) {
    if(firebaseUser) {
      console.log('hq controller calling getTrees');
      getTrees();
    } else {
      console.log('Not logged in or not authorized.');
      getTrees();
    }
  });

  // need to be able to add new trees. Eventually want this process to bring user to different view
  self.addTree = function(treeObject) {
    console.log('hq controller ask factory to add tree');
    TreeFactory.addTree(treeObject);
  };

  // deleteTree will delete a tree and all connected nodes and options based on the SQL cascade delete design
  self.deleteTree = function(treeId) {
    TreeFactory.removeTree(treeId);
  };

  self.makePublic = function(treeId) {
    console.log('ng change working on', treeId);
    TreeFactory.toggleTreeStatus(treeId);
  }

  function getTrees(){
    console.log('in hq getTrees: asking factory to get trees');
    TreeFactory.getUserTrees();
  }


}]);
