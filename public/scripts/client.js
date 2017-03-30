var app = angular.module('treeApp', ['firebase', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {

  //routes
  $routeProvider
      .when ('/login', {
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
          controller: 'LoginController',
          controllerAs: 'lc'
      })
      .when ('/edit/:treeId/:nodeId', {
          templateUrl: '/views/node-editor.html',
          controller: 'NodeEditController',
          controllerAs: 'nec'
      })
      .when ('/global', {
          templateUrl: '/views/global-list-view.html',
          controller: 'GlobalListController',
          controllerAs: 'glc'
      })
      .when ('/global/:id', {
          templateUrl: '/views/templates/global-viewer.html',
          controller: 'GlobalViewController',
          controllerAs: 'gvc'
      })
      .otherwise ( {
          redirectTo: 'login'
      });
}]);
