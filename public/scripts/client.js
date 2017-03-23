var app = angular.module('treeApp', ['firebase', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

  //routes
  $routeProvider
      .when ('/', {
        templateUrl:'/views/login-view.html',
        controller: 'LoginController',
        controllerAs: 'lc'
      })
      .when ('/hq', {
        templateUrl: '/views/hq-view.html',
        controller: 'HomeController',
        controllerAs: 'hc'
      })
      .when ('/edit/:id?', {
          templateUrl: '/views/tree-editor.html',
          controller: 'TreeEditController',
          controllerAs: 'tec'
      })
      .when ('/view/:id', {
          templateUrl: '/views/tree-viewer.html',
          controller: 'TreeViewController',
          controllerAs: 'tvc'
      })
      .when ('/edit/:treeId/:nodeId', {
          templateUrl: '/views/node-editor.html',
          controller: 'NodeEditController',
          controllerAs: 'nec'
      })
      .otherwise ( {
          redirectTo: 'hq'
      });
}]);
