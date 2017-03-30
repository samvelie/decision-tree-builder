app.controller('LoginController', ['TreeFactory', '$firebaseAuth', '$location', function(TreeFactory, $firebaseAuth, $location) {
  var auth = $firebaseAuth();
  var self = this;

  self.pageUrl = $location.$$url; //variable to hide/show the navbar
  console.log(self.pageUrl);

  //want to set a variable, accessible by all views that indicates the user is logged in, so the login/logout buttons appear dynamically
  //may need to bring in the factory dependency for this

  self.loggedIn = TreeFactory.loggedIn;

  // This code runs whenever the user logs in
  self.logIn = function() {
    console.log('login clicked');
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
      console.log('Logging the user out!');
      $location.url('/login');
    });
  };

}]);
