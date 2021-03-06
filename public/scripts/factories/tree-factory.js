app.factory('TreeFactory', ['$firebaseAuth', '$http', 'GlobalFactory', function($firebaseAuth, $http, GlobalFactory) {
  var auth = $firebaseAuth();
  var userTrees = { list: [] };
  var loggedIn = {}; //holds a value of true or false
  var treeWithNodes = {}; //will contain 1 tree with its question nodes
  var nodeWithResponses = {}; //will contain 1 question node with response options and follow up questions if they exist


  auth.$onAuthStateChanged(function(firebaseUser) {

    // Check directly if firebaseUser is null
    loggedIn.value = firebaseUser !== null;
    if (loggedIn.value) {
      console.log('user is logged in');
    } else {
      clearData();
    }
  });

  function clearData() {
    console.log('clearing data');
    userTrees = { list: [] };
    treeWithNodes = {};
    nodeWithResponses = {};
  }

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
      clearData();
      console.log('Cannot modify database when not logged in.');
    }
  }

  //add a node to tree
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
      console.log('Cannot modify database when not logged in.');
      clearData();
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
      console.log('Cannot modify database when not logged in.');
      clearData();
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
      clearData();
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
      clearData();
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
      clearData();
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
      clearData();
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
      if (response.data.length>1) {
        nodeWithResponses.followUpQuestions = response.data[1];
      } else {
        nodeWithResponses.followUpQuestions = [];
      }
      console.log('back with nodeWithResponses', nodeWithResponses);
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
          GlobalFactory.getTreeList();
        });
      });
    } else {
      console.log('Cannot modify database when not logged in.');
      clearData();
    }
  }

  //toggles public status on treeId
  function toggleTreeStatus(treeId) {
    console.log('flipping tree status on', treeId);

    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'PUT',
          url: '/trees/flip/' + treeId,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log(response.data);
          //now make sure we have current info on DOM
          getUserTrees();
          GlobalFactory.getTreeList();
        });
      });
    } else {
      console.log('Cannot modify database when not logged in.');
      clearData();
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
      console.log('Cannot modify database when not logged in.');
      clearData();
    }
  }

  //
  function editResponseText(responseObject, treeId) {
    var responseId = responseObject.id;
    var nodeId = responseObject.from_node_id;
    console.log('editResponseText running with:', responseObject);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'PUT',
          url: '/trees/options/' + responseId,
          data: responseObject,
          headers: {
            id_token: idToken
          }
        }).then(function(response){
          console.log(response.data);
          getNodeWithResponses(treeId, nodeId);
        });
      });
    } else {
      console.log('Cannot modify database when not logged in.');
      clearData();
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
          GlobalFactory.getTreeList();
        });
      });
    } else {
      console.log('Cannot modify database when not logged in.');
      clearData();
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
    } else {
      console.log('Cannot modify database when not logged in.');
      clearData();
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
    } else {
      console.log('Cannot modify database when not logged in.');
      clearData();
    }
  }

  return {
    loggedIn: loggedIn,
    clearData: clearData,
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
    toggleTreeStatus: toggleTreeStatus,
    editResponseText: editResponseText,
    updateResponse: updateResponse,
    editNode: editNode,
    removeTree: removeTree,
    removeNode: removeNode,
    removeResponse: removeResponse
  };
}]);
