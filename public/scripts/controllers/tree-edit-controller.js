app.controller('TreeEditController', function($firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var treeId = $routeParams.id;

  var firebaseUser = auth.$getAuth();

  if(firebaseUser) {
    firebaseUser.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/trees/' + treeId,
        headers: {
          id_token: idToken
        }
      }).then(function(response){
        self.treeNodes = response.data;
      });
    });
  } else {
    console.log('Not logged in or not authorized.');
  }




});
