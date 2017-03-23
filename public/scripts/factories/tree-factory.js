app.factory('TreeFactory', ['$firebaseAuth', '$http', '$routeParams', function($firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var userTrees = { list: [] };
  var nodeWithResponses = {}; //will contain 1 node's question and responses

  auth.$onAuthStateChanged(function(firebaseUser) {
  // if the user is logged in, firebaseUser will be some object (truthy),
  // if the user is not logged in, firebaseUser is null (falsey)
  // the first ! flips it and makes it just true or false
  // self.userIsLoggedIn = !!firebaseUser;

  // Check directly if firebaseUser is null
  userTrees.loggedIn = firebaseUser !== null;
  });

  auth.$onAuthStateChanged(getUserTrees);

  function getNodeWithResponses(treeId, nodeId) {
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/trees/' + treeId + '/' + nodeId,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          nodeWithResponses.node = response.data;
          getResponsesForNode(treeId, nodeId, idToken);
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
    }
  }

  function getResponsesForNode(treeId, thisNodeId, idToken) {
    $http({
      method: 'GET',
      url: '/trees/' + treeId + '/options/' + thisNodeId,
      headers: {
        id_token: idToken
      }
    }).then(function(response) {
        nodeWithResponses.responses = response.data;
        console.log(nodeWithResponses);
    });
  }

  function getUserTrees() {
    console.log('getting trees');
      // firebaseUser will be null if not logged in
      var firebaseUser = auth.$getAuth();
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
            userTrees.list = response.data;
            console.log('back from server with:', userTrees);

          });
        });
      } else {
        console.log('Not logged in or not authorized.');
      }
  }


  return {
    getUserTrees: getUserTrees,
    userTrees: userTrees,
    nodeWithResponses: nodeWithResponses,
    getNodeWithResponses: getNodeWithResponses
  };
}]);
