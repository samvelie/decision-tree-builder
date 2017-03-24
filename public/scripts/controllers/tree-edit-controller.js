app.controller('TreeEditController', ['TreeFactory', '$firebaseAuth', '$http', '$routeParams', function(TreeFactory, $firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeId = $routeParams.id;

  var treeObject = {};
  self.newNode = {};

  self.treeData = TreeFactory.treeWithNodes;

  console.log("$routeParams.id:", $routeParams.id);

  if(typeof treeId == 'undefined') {
    self.newTree = {treeName:''};
  } else {
      getTreeEditInfo(treeId);

  }

  function getTreeEditInfo(treeId) {
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

  self.addNodeToTree = function(nodeObject) {
    treeId =  self.treeData.treeInfo[0].id;
    TreeFactory.addNode(nodeObject, treeId);
    getTreeEditInfo(treeId);
  }


}]);
