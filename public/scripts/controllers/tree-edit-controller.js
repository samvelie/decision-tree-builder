app.controller('TreeEditController', ['TreeFactory', '$firebaseAuth', '$http', '$routeParams', function(TreeFactory, $firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  self.treeData = TreeFactory.treeWithNodes;

  console.log("$routeParams.id:", $routeParams.id);

  if(typeof $routeParams.id == 'undefined') {
    self.newTree = 'Enter New Tree';
  } else {
    //run function to get tree name and nodes
    auth.$onAuthStateChanged(getTreeEditInfo);
  }

function getTreeEditInfo() {
  var treeId = $routeParams.id;
  TreeFactory.getTreeWithNodes(treeId);
}



}]);
