app.controller('LoginController', ['TreeFactory', '$firebaseAuth', '$location', function(TreeFactory, $firebaseAuth, $location) {
  var auth = $firebaseAuth();
  var self = this;

  self.pageUrl = $location.$$url; //variable to hide/show the navbar

  self.loggedIn = TreeFactory.loggedIn;

  // This code runs whenever the user logs in
  self.logIn = function() {
    console.log('login clicked in navbar');
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      });
  };

  self.goToHQFromLogin = function () {
    console.log('going to HQ after login');
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
      $location.url('/hq');
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      });
  };

  self.startTreeEditor = function() {
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
      $location.url('/edit');
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
      });
  };

  self.viewGlobals = function() {
    $location.url('/global');
  };

  // This code runs when the user logs out
  self.logOut = function() {
    auth.$signOut().then(function() {
      TreeFactory.clearData();
      console.log('Logging the user out!');
      $location.url('/login');
    });
  };

}]);
