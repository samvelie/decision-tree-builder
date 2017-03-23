app.controller('TreeEditController', ['TreeFactory', '$firebaseAuth', '$http', '$routeParams', function(TreeFactory, $firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeObject = {};

  self.treeData = TreeFactory.treeWithNodes;

  console.log("$routeParams.id:", $routeParams.id);

  if(typeof $routeParams.id == 'undefined') {
    self.newTree = {treeName:''};
  } else {
    //run function to get tree name and nodes
    auth.$onAuthStateChanged(getTreeEditInfo);
  }

  function getTreeEditInfo() {
    var treeId = $routeParams.id;
    TreeFactory.getTreeWithNodes(treeId);
  }

  self.saveTreeName = function(idOrNew, nameOrObject) {
      console.log(idOrNew, nameOrObject);
      if (idOrNew ==='new') {
        console.log('saving new tree', nameOrObject);
        TreeFactory.addTree(nameOrObject);
      } else {
        treeObject.treeName = name;
        console.log('updating tree with id', idOrNew);
        TreeFactory.editUserTree(idOrNew, treeObject);
      }
  }


}]);
