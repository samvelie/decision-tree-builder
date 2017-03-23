app.controller('LoginController', function($firebaseAuth, $location) {
  var auth = $firebaseAuth();
  var self = this;
  var loggedIn = false; //default false

  // This code runs whenever the user logs in
  self.logIn = function() {
    console.log('login clicked');
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
      loggedIn = true;
      $location.url('/hq');
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      });
  };

  self.startTreeEditor = function() {
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
      loggedIn = true;
      $location.url('/edit');
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      });
  };

  // This code runs when the user logs out
  self.logOut = function() {
    auth.$signOut().then(function(){
      console.log('Logging the user out!');
      loggedIn = false;
    });
  };

});
