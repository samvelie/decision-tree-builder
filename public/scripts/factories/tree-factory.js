app.factory('TreeFactory', ['$firebaseAuth', '$http', '$routeParams', function($firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var userTrees = { list: [] };
  var treeWithNodes = { //will contain 1 tree with its question nodes
    treeInfo: [],
    nodeInfo: []
    };
  var nodeWithResponses = {}; //will contain 1 question node with response options

  auth.$onAuthStateChanged(function(firebaseUser) {

  // Check directly if firebaseUser is null
  userTrees.loggedIn = firebaseUser !== null;
  });

  //add a user tree
  function addTree(treeObject) {
    console.log('addTree running with', treeObject);
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
          console.log('Factory tree added: ', response.data);
          treeWithNodes.treeInfo= response.data;
          // now update our trees array to share with the controller(s)
          getUserTrees();
        });
      });
    } else {
      console.log('Can not post to database when not logged in.');
    }
  }

  //add a node to tree
  function addNode(nodeContent, treeId, fromResponseId) {
    console.log('addNode running with ' + nodeContent + ' on treeId: ' + treeId);
    var firebaseUser = auth.$getAuth();
    var nodeObject = {content: nodeContent};
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'POST',
          url: '/trees/nodes/' + treeId,
          data: nodeObject,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
            console.log('node created', response.data);
            if (fromResponseId) {
              //update option that was connected
              console.log('fromResponseId passed as', fromResponseId);
              var toNodeId =  response.data[0].id;
              updateResponse(fromResponseId, toNodeId);
              //use nodeId that was returned to pass to url
            } else {
              getTreeWithNodes(treeId);
            }

        });
      });
    } else {
      console.log('Can not post to database when not logged in.');
    }
  }

  //add a response to a node
  function addResponse(responseText, treeId, nodeId) {
    console.log('addResponse running with: ' + responseText + ' on nodeId ' + nodeId + ' on treeId ' + treeId);
    var responseObject = {text: responseText};
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'POST',
          url: '/trees/' + nodeId + '/options',
          data: responseObject,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
            console.log('option on node created', response.data);
            getNodeWithResponses(treeId, nodeId);
        });
      });
    } else {
      console.log('Can not post to database when not logged in.');
    }
  }

  //get trees for "My Trees"
  function getUserTrees() {
    console.log('getUserTrees running');
      var firebaseUser = auth.$getAuth();
      if(firebaseUser) {
        firebaseUser.getToken().then(function(idToken){
          $http({
            method: 'GET',
            url: '/trees',
            headers: {
              id_token: idToken
            }
          }).then(function(response){
              console.log('factory got trees: ', response.data);
              userTrees.list = response.data;
          });
        });
      } else {
        console.log('Not logged in or not authorized.');
      }
  }

  //gets a specific tree and its connected nodes
  function getTreeWithNodes(treeId) {
    console.log('getTreeWithNodes running with', treeId);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/trees/tree/' + treeId,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
            console.log('getTreeWithNodes back with', response.data);
            treeWithNodes.treeInfo = response.data;
            getNodesForTree(treeId, idToken);
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
    }
  }

  //getting that tree's nodes above
  function getNodesForTree(treeId, idToken) {
    console.log('getNodesForTree running');
    $http({
      method: 'GET',
      url: '/trees/nodes/' + treeId,
      headers: {
        id_token: idToken
      }
    }).then(function(response) {
        treeWithNodes.nodeInfo = response.data;
        console.log('getNodesForTree back with', treeWithNodes);
    });
  }

  //gets a specific node and its connected responses
  function getNodeWithResponses(treeId, nodeId) {
    console.log('getNodeWithResponses running');
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

  //getting that node's responses above
  function getResponsesForNode(treeId, thisNodeId, idToken) {
    console.log('getResponsesForNode running');
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

  //edit a user tree
  function editUserTree(treeId, treeObject) {
    console.log('editUserTree running with', treeObject);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'PUT',
          url: '/trees/' + treeId,
          data: treeObject,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log(response.data);
          //now make sure we have current info on DOM
          getTreeWithNodes(treeId);
        });
      });
    } else {
      console.log('Can not post to database when not logged in.');
    }
  }

  //update a response with the "to_node_id"
  function updateResponse(responseId, toNodeId) {
    console.log('updating responseId ' + responseId + ' with toNodeId ' + toNodeId);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'PUT',
          url: '/trees/options/' + responseId + '/' + toNodeId,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
            console.log('response updated');
        });
      });
    }
  }

  //delete a user tree
  function removeTree(treeId) {
    console.log('removeTree running to delete', treeId);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'DELETE',
          url: '/trees/tree/' + treeId,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
            console.log('tree deleted', response);
            getUserTrees();
        });
      });
    }
  }

  //delete a node
  function removeNode(nodeId) {
    console.log('removeNode running to delete ' + nodeId);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'DELETE',
          url: '/trees/nodes/' + nodeId,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
            console.log('node deleted from tree', response.data[0].tree_id);
            treeId = response.data[0].tree_id;
            getTreeWithNodes(treeId);
        });
      });
    }
  }

  //delete an option
  function removeResponse(responseId, treeId, nodeId) {
    console.log('removeResponse running to delete responseId: ' + responseId + ' on nodeId ' + nodeId + ' in treeId ' + treeId);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'DELETE',
          url: '/trees/options/' + responseId,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
            console.log('response option deleted', response.data);
            getNodeWithResponses(treeId, nodeId);
        });
      });
    }
  }

  return {
    addTree: addTree,
    addNode: addNode,
    addResponse: addResponse,
    getUserTrees: getUserTrees,
    userTrees: userTrees,
    getTreeWithNodes: getTreeWithNodes,
    treeWithNodes: treeWithNodes,
    getNodeWithResponses: getNodeWithResponses,
    nodeWithResponses: nodeWithResponses,
    editUserTree: editUserTree,
    removeTree: removeTree,
    removeNode: removeNode,
    removeResponse: removeResponse
  };
}]);
