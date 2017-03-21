app.controller('HomeController', function($firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var self = this;

  // This code runs whenever the user logs in
  self.logIn = function(){
    auth.$signInWithPopup('google').then(function(firebaseUser) {
      console.log('Firebase Authenticated as: ', firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log('Authentication failed: ', error);
    });
  };

  auth.$onAuthStateChanged(function(firebaseUser) {
  // if the user is logged in, firebaseUser will be some object (truthy),
  // if the user is not logged in, firebaseUser is null (falsey)
  self.userIsLoggedIn = firebaseUser !== null;
  });

  // This code runs whenever the user changes authentication states
  // e.g. whevenever the user logs in or logs out
  // this is where we put most of our logic so that we don't duplicate
  // the same things in the login and the logout code
  auth.$onAuthStateChanged(function(firebaseUser) {
    // firebaseUser will be null if not logged in
    if(firebaseUser) {
      // This is where we make our call to our server
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/trees',
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          self.secretData = response.data;
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
      self.secretData = 'Log in to get your decision trees.';
    }
  });

  // need to be able to add new trees. Eventually want this process to bring user to different view
  self.addTree = function(treeObject) {
    var firebaseUser = auth.$getAuth();

    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'POST',
          url: '/trees',
          data: treeObject,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log(response.data);
        });
      });
    } else {
      console.log('Can not post to database when not logged in.');
    }
  };

  // This code runs when the user logs out
  self.logOut = function() {
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
    });
  };
});
