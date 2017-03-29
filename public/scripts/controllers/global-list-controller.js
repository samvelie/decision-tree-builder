app.controller('GlobalListController', ['GlobalFactory', function(GlobalFactory) {
  var self = this;

  self.message = "Hi!";
  self.globalTrees = GlobalFactory.freeTreeList;
  console.log('something');
}]);
