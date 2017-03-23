app.controller('HomeController', ['TreeFactory', '$firebaseAuth', '$http', function(TreeFactory, $firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;

  self.treeArray = TreeFactory.userTrees;

  // need to be able to add new trees. Eventually want this process to bring user to different view
  self.addTree = function(treeObject) {
    //replace with TreeFactory call

    // var firebaseUser = auth.$getAuth();
    //
    // if(firebaseUser) {
    //   firebaseUser.getToken().then(function(idToken){
    //     $http({
    //       method: 'POST',
    //       url: '/trees',
    //       data: treeObject,
    //       headers: {
    //         id_token: idToken
    //       }
    //     }).then(function(response){
    //       console.log(response.data);
    //     });
    //   });
    // } else {
    //   console.log('Can not post to database when not logged in.');
    // }
  };

}]);
