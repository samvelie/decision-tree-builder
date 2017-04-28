var express = require('express');
var router = express.Router();
var pg = require('pg');
var pool = require('../modules/database-config');

// var pool = new pg.Pool(config);

//-------------TREE/TREE NAMES CRUD-------------//

//gets list of trees made by user
router.get('/', function(req, res) {
  var userId = req.userId;
  pool.connect(function(err, client, done) {
    client.query('SELECT * FROM trees WHERE creator_id=$1;', [userId], function(err, getTreesResult) {
      done();
      if(err) {
        console.log('error completing tree query:', err);
        res.sendStatus(500);
      } else {
        res.send(getTreesResult.rows);
      }
    });//end query for tree list
  });//end pool.connect
});//end router.get

//creates a tree connected to user
router.post('/', function(req, res) {
  var userId = req.userId;
  var treeName =req.body.treeName;
  pool.connect(function(err, client, done) {
    client.query('INSERT INTO trees (tree_name, creator_id) VALUES ($1, $2) RETURNING id, tree_name;', [treeName, userId], function(err, result) {
      done();
      if(err) {
        console.log('error adding tree to db; query error:', err);
        res.sendStatus(500);
      } else {
        res.send(result.rows);
      }
    });//end query for adding tree
  });//end pool.connect
});//end router.post

//reads specific tree
router.get('/tree/:treeId', function(req, res) {
  var userId = req.userId;
  var treeId = req.params.treeId;
  console.log('getting tree with id:', treeId);
  pool.connect(function(err, client, done) {
    client.query('SELECT * FROM trees WHERE creator_id=$1 AND id=$2;', [userId, treeId], function(err, result) {
      done();
      if(err) {
        console.log('error completing specific tree query:', err);
        res.sendStatus(500);
      } else {
        console.log('got tree');
        res.send(result.rows);
      }
    });//end query for tree list
  });//end pool.connect
});//end router.get for specific tree

//updates a tree name
router.put('/:id', function(req, res) {
  var treeId = req.params.id;
  var treeName = req.body.treeName;
  pool.connect(function(err, client, done) {
    client.query('UPDATE trees SET tree_name=$1 WHERE id=$2;',
    [treeName, treeId], function(err, result) {
      done();
      if(err) {
        console.log('error updating tree in db; query error:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end query for updating tree
  });//end pool.connect
});

//changes a tree's public status
router.put('/flip/:treeId', function(req, res) {
  var treeId = req.params.treeId;
  var userId = req.userId; //for security
  pool.connect(function(err, client, done) {
    client.query('UPDATE trees SET public = NOT public WHERE trees.id=$1 AND trees.creator_id=$2;',
    [treeId, userId], function(err, result) {
      done();
      if(err) {
        console.log('error updating tree in db; query error:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end query for updating tree public status
  });//end pool.connect
});

//deletes specific tree and all connected nodes and options
router.delete('/tree/:treeId', function(req, res) {
  var userId = req.userId;
  var treeId = req.params.treeId;
  console.log('deleting tree with id:', treeId);
  pool.connect(function(err, client, done) {
    client.query('DELETE FROM trees WHERE creator_id=$1 AND id=$2;', [userId, treeId], function(err, result) {
      done();
      if(err) {
        console.log('error completing tree delete query:', err);
        res.sendStatus(500);
      } else {
        console.log('deleted tree');
        res.sendStatus(200);
      }
    });//end query for tree list
  });//end pool.connect
});//end router.get

//-------------NODES CRUD-------------//

//adds node to tree
router.post('/nodes/:treeId', function(req, res) {
  var treeId = req.params.treeId;
  var nodeContent = req.body.content;
  console.log('adding this content object:', nodeContent);
  pool.connect(function(err, client, done) {
    client.query('INSERT INTO nodes (content, tree_id) VALUES ($1, $2) RETURNING id;',
    [nodeContent, treeId],
    function(err, result) {
      done();
      if(err) {
        console.log('error with node add query:', err);
        res.sendStatus(500);
      } else {
        res.send(result.rows);
      }
    });//end client.query for adding node
  });//end pool.connect
});//end router.post for nodes

//gets list of nodes associated with tree id
router.get('/nodes/:treeId', function(req, res) {
  var userId = req.userId; //ensures nodes are only grabbed for trees made by this user
  var treeId = req.params.treeId;
  pool.connect(function(err, client, done) {
    client.query('SELECT nodes.id, nodes.tree_id, content FROM nodes JOIN trees ON nodes.tree_id = trees.id WHERE trees.creator_id=$1 AND tree_id=$2;',
    [userId, treeId],
    function(err, getNodesResult) {
      done();
      if(err) {
        console.log('error completing node query:', err);
        res.sendStatus(500);
      } else {
        res.send(getNodesResult.rows);
      }
    });//end client.query for selecting nodes
  });//end pool.connect
});//end router.get for node questions

//gets the presumed starting question node given specific tree
router.get('/starting/:id', function(req,res) {
  var treeId = req.params.id;

  pool.connect(function(err, client, done) {
    client.query('SELECT * FROM nodes INNER JOIN (SELECT MIN(id) AS minid FROM nodes WHERE tree_id=$1)mini ON nodes.id=mini.minid;',
    [treeId],
    function(err, startingQuestionResult) {
      done();
      if(err) {
        console.log('error completing 1st node query on tree:', err);
        res.sendStatus(500);
      } else {
        console.log('startingQuestionResult', startingQuestionResult.rows);
        res.send(startingQuestionResult.rows);
      }
    });//end client.query for selecting first question
  });//end pool.connect
});//end router.get for starting question

//getting specific question node
router.get('/:id/:nodeId', function(req,res) {
  var treeId = req.params.id; //not currently necessary, leaving here in case auth does not protect
  var nodeId = req.params.nodeId;

  pool.connect(function(err, client, done) {
    client.query('SELECT * FROM nodes WHERE nodes.id = $1;',
    [nodeId],
    function(err, nodeResult) {
      done();
      if(err) {
        console.log('error completing query for node:', err);
        res.sendStatus(500);
      } else {
        res.send(nodeResult.rows);
      }
    });//end client.query for getting question
  });//end pool.connect
});//end router.get for question

//updates node
router.put('/nodes/:nodeId', function(req,res) {
  var nodeId = req.params.nodeId;
  var updatedContent = req.body.content;

  pool.connect(function(err, client, done) {
    client.query('UPDATE nodes SET content=$1 WHERE id=$2;',
    [updatedContent, nodeId],
    function(err, result) {
      done();
      if(err) {
        console.log('error updating node in db; query error:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end query for updating node
  });//end pool.connect
});

//removes node
router.delete('/nodes/:nodeId', function(req, res) {
  var nodeId = req.params.nodeId;
  console.log('deleting this node:', nodeId);
  pool.connect(function(err, client, done) {
    client.query('DELETE FROM nodes WHERE id=$1 RETURNING tree_id;',
    [nodeId],
    function(err, result) {
      done();
      if(err) {
        console.log('error with node delete query:', err);
        res.sendStatus(500);
      } else {
        res.send(result.rows);
      }
    });//end client.query for deleting node
  });//end pool.connect
});//end router.delete for nodes

//-------------OPTIONS/RESPONSES CRUD-------------//

//adding an option to a node
router.post('/:nodeId/options', function(req, res) {
  var nodeId = req.params.nodeId;
  var responseObject = req.body;
  console.log('adding this option:', responseObject);
  console.log('on this node:', nodeId);
  pool.connect(function(err, client, done) {
    client.query('INSERT INTO options (response_text, from_node_id) VALUES ($1, $2);',
    [responseObject.text, nodeId],
    function(err, result) {
      done();
      if(err) {
        console.log('error with option add query:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end client.query for adding option
  });//end pool.connect
});//end router.post for options

//getting options given specific node & getting follow up nodes if an option has a "to_node_id"
router.get('/:id/options/:nodeId', function(req,res) {
  var treeId = req.params.id; //not currently necessary, leaving here in case auth does not protect
  var nodeId = req.params.nodeId;

  pool.connect(function(err, client, done) {
    client.query('SELECT * FROM options WHERE from_node_id = $1 ORDER BY to_node_id;',
    [nodeId],
    function(err, optionsResult) {
      done();
      if(err) {
        console.log('error completing query for options on node:', err);
        res.sendStatus(500);
      } else {
        console.log('checking for followUpNodes on', optionsResult.rows);

        var sqlCounter = 0; //this counter determines that the database will be queried again if > 0
        var pgQueryString = 'nodes.id=$1'; // if sqlCounter>1, this string will look like nodes.id=$1 OR nodes.id=$2...
        var nodeIdArray = [];

        for (var i = 0; i < optionsResult.rows.length; i++) {
          if (optionsResult.rows[i].to_node_id) { //checks for to_node_id on each returned row
            sqlCounter ++;
            nodeIdArray.push(optionsResult.rows[i].to_node_id);
            if(sqlCounter>1) {
              pgQueryString += ' OR nodes.id=$' + sqlCounter;
            }
          }
        }

        console.log(nodeIdArray);
        if(sqlCounter>0) {
          pool.connect(function(err, client, done) {
            client.query('SELECT * FROM nodes WHERE ' + pgQueryString + ' ORDER BY nodes.id;',
            nodeIdArray,
            function(err, followUpNodesResult) {
              done();
              if(err) {
                console.log('error completing query for follow up nodes on options:', err);
                res.sendStatus(500);
              } else {
                console.log('got followUpNodes');

                //when nodeIdArray has duplicate values, the database only returns one element matching that value. This if check ensures the sent array is the same length as the needed length for displaying all options
                if (nodeIdArray.length !== followUpNodesResult.rows.length) {
                  var sendTheseFollowUpNodes = [];
                  for (var j = 0; j < nodeIdArray.length; j++) {
                    for (var k = 0; k < followUpNodesResult.rows.length; k++) {
                      if (followUpNodesResult.rows[k].id==nodeIdArray[j]) {
                        sendTheseFollowUpNodes.push(followUpNodesResult.rows[k]);
                      }
                    }
                  }
                  res.send([optionsResult.rows, sendTheseFollowUpNodes]);
                } else { res.send([optionsResult.rows, followUpNodesResult.rows]);}

              }
            }); //end client.query for getting follow up nodes
          }); //end pool.connect for nodes
        } else {
          res.send([optionsResult.rows]);
        }
      }
    });//end client.query for getting options
  });//end pool.connect
});//end router.get for options

//updating an option's response_text
router.put('/options/:optionId', function(req,res) {
  var updatedText = req.body.response_text;
  var optionId = req.params.optionId;
  console.log('In put with', updatedText);
  pool.connect(function(err, client, done) {
    client.query('UPDATE options SET response_text=$1 WHERE id=$2;',
    [updatedText, optionId],
    function(err, result) {
      done();
      if(err) {
        console.log('error updating option in db; query error:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end query for updating option text
  });//end pool.connect
});

//updating an option with the "to" node
router.put('/options/:optionId/:toNodeId', function(req,res) {
  var optionId = req.params.optionId;
  var toNodeId = req.params.toNodeId;
  console.log('updating ' + optionId + ' with toNodeId ' + toNodeId);
  pool.connect(function(err, client, done) {
    client.query('UPDATE options SET to_node_id=$1 WHERE id=$2;',
    [toNodeId, optionId],
    function(err, result) {
      done();
      if(err) {
        console.log('error updating option in db; query error:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end query for updating option
  });//end pool.connect
});// end router.put for adding to_node_id to option

//removes option
router.delete('/options/:optionId', function(req,res) {
  var optionId = req.params.optionId;
  console.log('deleting option with id:', optionId);
  pool.connect(function(err, client, done) {
    client.query('DELETE FROM options WHERE id=$1;',
    [optionId],
    function(err, result) {
      done();
      if(err) {
        console.log('error with option delete query:', err);
        res.sendStatus(500);
      } else {
        res.sendStatus(200);
      }
    });//end client.query for deleting option
  });//end pool.connect
}); //end router.delete on option



module.exports = router;
