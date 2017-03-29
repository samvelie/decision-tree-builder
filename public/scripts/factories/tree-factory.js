app.factory('TreeFactory', ['$firebaseAuth', '$http', '$routeParams', function($firebaseAuth, $http, $routeParams) {
  var auth = $firebaseAuth();
  var userTrees = { list: [] };
  var treeWithNodes = {}; //will contain 1 tree with its question nodes
  var nodeWithResponses = {}; //will contain 1 question node with response options and follow up questions if they exist

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
  /**
    * @function sends new node data to server, updates current node with results
    * @param {String} nodeContent text content for this node
    * @param {String} treeId DB id for this tree
  **/
  function addNode(nodeContent, treeId, fromResponseId, currentNodeId) {
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
              updateResponse(fromResponseId, toNodeId, treeId, currentNodeId);

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

  //gets "starting" node for display
  function getStartingNodeWithResponses(treeId) {
    var firebaseUser = auth.$getAuth();
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
          nodeWithResponses.node = response.data;
          var startingQuestion = response.data[0];
          nodeWithResponses.starting = startingQuestion; // for tree viewer "back button" logic
          getResponsesForNode(treeId, startingQuestion.id, idToken);
        });
      });
    } else {
      console.log('Not logged in or not authorized.');
    }
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

  //getting the requested node's responses
  function getResponsesForNode(treeId, thisNodeId, idToken) {
    console.log('getResponsesForNode running');
    $http({
      method: 'GET',
      url: '/trees/' + treeId + '/options/' + thisNodeId,
      headers: {
        id_token: idToken
      }
    }).then(function(response) {
        nodeWithResponses.responses = response.data[0];
        nodeWithResponses.followUpQuestions = response.data[1];
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

  //edits a node's content
  function editNode(nodeObject) {
    var nodeId = nodeObject.id;
    var treeId = nodeObject.tree_id;
    console.log('editNode running with:', nodeObject);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'PUT',
          url: '/trees/nodes/' + nodeId,
          data: nodeObject,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log(response.data);
          // getTreeWithNodes(treeId);
          // getNodeWithResponses(treeId, nodeId);
        });
      });
    } else {
      console.log('Can not post to database when not logged in.');
    }
  }

  //update a response with the "to_node_id"
  function updateResponse(responseId, toNodeId, treeId, currentNodeId) {
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
            console.log('response option updated:', response);
            getNodeWithResponses(treeId, currentNodeId);
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
    getStartingNodeWithResponses: getStartingNodeWithResponses,
    getNodeWithResponses: getNodeWithResponses,
    nodeWithResponses: nodeWithResponses,
    editUserTree: editUserTree,
    editNode: editNode,
    removeTree: removeTree,
    removeNode: removeNode,
    removeResponse: removeResponse
  };
}]);
