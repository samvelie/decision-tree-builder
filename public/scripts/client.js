var app = angular.module('treeApp', ['firebase', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

  //routes
  $routeProvider
      .when ('/home', {
        templateUrl: '/views/hq-view.html',
        controller: 'HomeController',
        controllerAs: 'hc'
      })
      .when ('/edit/:id', {
          templateUrl: '/views/tree-editor.html',
          controller: 'TreeEditController',
          controllerAs: 'tec'
      })
      .when ('/view/:id', {
          templateUrl: '/views/tree-viewer.html',
          controller: 'TreeViewController',
          controllerAs: 'tvc'
      })
      .otherwise ( {
          redirectTo: '/home'
      });
}]);
