app.controller('TreeViewController', function($firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var self = this;

  var firebaseUser = auth.$getAuth();

  var treeId = $routeParams.id;

  self.tree = treeId; //for testing

  self.optionDisplay= [];

  //this below code needs to be functionalized and moved to the factory
  if(firebaseUser) {
    firebaseUser.getToken().then(function(idToken) {
      $http({
        method: 'GET',
        url: '/trees/starting/' + treeId,
        headers: {
          id_token: idToken
        }
      }).then(function(response) {
        console.log('initial question data', response.data);
        self.questionDisplay = response.data;
        var startingQuestionId = response.data[0].id;
        getOptions(treeId, startingQuestionId, idToken);
      });
    });
  } else {
    console.log('Not logged in or not authorized.');
  }


  function getOptions(treeId, thisNodeId, idToken) {
    console.log('getOptions running in Tree Viewer');
    $http({
      method: 'GET',
      url: '/trees/' + treeId + '/options/' + thisNodeId,
      headers: {
        id_token: idToken
      }
    }).then(function(response) {
        self.optionDisplay = response.data;
    });
  }

  //on click of option
  self.getNextQuestion = function(nextNodeId) {
    console.log('going to nodeId', nextNodeId);

    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken) {
        $http({
          method: 'GET',
          url: '/trees/' + treeId + '/' + nextNodeId,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log('initial question data', response.data);
          self.questionDisplay = response.data;
          var startingQuestionId = response.data[0].id;
          getOptions(treeId, startingQuestionId, idToken);
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
    }
  };


});
