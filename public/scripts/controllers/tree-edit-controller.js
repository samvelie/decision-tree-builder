app.controller('TreeEditController', ['TreeFactory', '$firebaseAuth', '$http', '$routeParams', function(TreeFactory, $firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeId = $routeParams.id;

  var treeObject = {};
  self.newNode = {};

  self.treeData = TreeFactory.treeWithNodes;

  console.log("$routeParams.id:", $routeParams.id);

  if(typeof treeId == 'undefined') {
    console.log('treeID is UNDEFINED');
    self.newTree = {treeName:''};
  } else {
    console.log('treeID seems OK:', treeId);
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
        console.log('updating tree with id', idOrNew);
        console.log('name', nameOrObject);
        treeObject.treeName = nameOrObject;
        console.log('sending treeObject', treeObject);

        TreeFactory.editUserTree(idOrNew, treeObject);
      }
  };

  self.addNodeToTree = function(nodeObject) {
    console.log('treeditor addNodeToTree using:', nodeObject);
    treeId =  self.treeData.treeInfo[0].id;
    TreeFactory.addNode(nodeObject, treeId).then( function() {
      self.newNode.words = '';
    }
    );
  };

  self.deleteNode = function(nodeId) {
    console.log('treeditor deleteNode for id', nodeId);
    TreeFactory.removeNode(nodeId);
  }


}]);
