app.controller('TreeEditController', ['TreeFactory', '$firebaseAuth', '$http', '$routeParams', function(TreeFactory, $firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeObject = {};

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

  self.saveTreeName = function(idOrNew, name) {
      console.log(idOrNew);
      if (idOrNew==='new') {
        console.log('saving new tree', self.newTree);
        TreeFactory.addTree(self.newTree);
      } else {
        treeObject.treeName = name;
        console.log('updating tree with id', idOrNew);
        TreeFactory.editUserTree(idOrNew, treeObject);
      }
  }


}]);
