app.controller('LoginController', function($firebaseAuth, $http, $routeParams, $location) {
  var auth = $firebaseAuth();
  var self = this;

  // This code runs whenever the user logs in
  self.logIn = function(){
    console.log('login clicked');
  auth.$signInWithPopup("google").then(function(firebaseUser) {
    console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    $location.url('/hq');
  }).catch(function(error) {
    console.log("Authentication failed: ", error);
  });
  };


});
