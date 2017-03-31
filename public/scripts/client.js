var app = angular.module('treeApp', ['firebase', 'ngRoute', 'xeditable']);

app.run(function(editableOptions, editableThemes) {
  editableThemes.bs3.buttonsClass = 'btn-sm';
  editableThemes.bs3.inputClass = 'input-md';
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});

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
      .otherwise ( {
          redirectTo: 'login'
      });
}]);
