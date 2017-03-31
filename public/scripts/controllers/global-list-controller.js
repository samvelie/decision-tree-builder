app.controller('GlobalListController', ['GlobalFactory', function(GlobalFactory) {
  var self = this;

  GlobalFactory.getTreeList();
  self.globalTrees = GlobalFactory.freeTreeList;
  console.log('GlobalListController activated');
}]);
