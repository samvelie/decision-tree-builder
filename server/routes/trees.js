var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

//gets list of trees made by user
router.get("/", function(req, res) {
  var userId = req.userId;
  pg.connect(connectionString, function(err, client, done) {
      client.query('SELECT * FROM trees WHERE creator_id=$1;', [userId], function(err, getTreesResult) {
       done();
       if(err) {
         console.log('error completing tree query:', err);
         res.sendStatus(500);
       } else {
         res.send(getTreesResult.rows);
       }
      });//end query for tree list
  });//end pg.connect
});//end router.get

//gets specific tree
router.get("/tree/:treeId", function(req, res) {
  var userId = req.userId;
  var treeId = req.params.treeId;
  pg.connect(connectionString, function(err, client, done) {
      client.query('SELECT * FROM trees WHERE creator_id=$1 AND id=$2;', [userId, treeId], function(err, result) {
       done();
       if(err) {
         console.log('error completing specific tree query:', err);
         res.sendStatus(500);
       } else {
         res.send(result.rows);
       }
      });//end query for tree list
  });//end pg.connect
});//end router.get

//creates a tree connected to user
router.post("/", function(req, res) {
  var userId = req.userId;
  var treeName =req.body.treeName;
  pg.connect(connectionString, function(err, client, done) {
      client.query('INSERT INTO trees (tree_name, creator_id) VALUES ($1, $2);', [treeName, userId], function(err, result) {
       done();
       if(err) {
         console.log('error adding tree to db; query error:', err);
         res.sendStatus(500);
       } else {
         res.sendStatus(200);
       }
     });//end query for adding tree
  });//end pg.connect
});//end router.post

//edits a tree name
router.put("/:id", function(req, res) {
  var treeId = req.params.id;
  var treeName = req.body.treeName;
  pg.connect(connectionString, function(err, client, done) {
       client.query('UPDATE trees SET tree_name=$1 WHERE id=$2;', [treeName, treeId], function(err, result) {
       done();
       if(err) {
         console.log('error updating tree in db; query error:', err);
         res.sendStatus(500);
       } else {
         res.sendStatus(200);
       }
     });//end query for adding tree
  });//end pg.connect
});

//gets list of nodes associated with tree id
router.get("/nodes/:treeId", function(req, res) {
  var userId = req.userId; //ensures nodes are only grabbed for trees made by this user
  var treeId = req.params.treeId;
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT nodes.id, nodes.tree_id, content, tree_end FROM nodes JOIN trees ON nodes.tree_id = trees.id WHERE trees.creator_id=$1 AND tree_id=$2;',
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
  });//end pg.connect
});//end router.get for node questions

//starting question node getter for specific tree
router.get("/starting/:id", function(req,res) {
  var treeId = req.params.id;

  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM nodes INNER JOIN (SELECT MIN(id) AS minid FROM nodes WHERE tree_id=$1)mini ON nodes.id=mini.minid;',
    [treeId],
    function(err, startingQuestionResult) {
      done();
      if(err) {
        console.log('error completing 1st node query on tree:', err);
        res.sendStatus(500);
      } else {
        res.send(startingQuestionResult.rows);
      }
    });//end client.query for selecting first question
  });//end pg.connect
});//end router.get for starting question

//getting options for specific node
router.get("/:id/options/:nodeId", function(req,res) {
  var treeId = req.params.id; //not currently necessary, leaving here in case auth does not protect
  var nodeId = req.params.nodeId;

  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM options WHERE from_node_id = $1;',
    [nodeId],
    function(err, optionsResult) {
      done();
      if(err) {
        console.log('error completing query for options on node:', err);
        res.sendStatus(500);
      } else {
        res.send(optionsResult.rows);
      }
    });//end client.query for getting options
  });//end pg.connect
});//end router.get for options

//getting specific question node
router.get("/:id/:nodeId", function(req,res) {
  var treeId = req.params.id; //not currently necessary, leaving here in case auth does not protect
  var nodeId = req.params.nodeId;

  pg.connect(connectionString, function(err, client, done) {
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
  });//end pg.connect
});//end router.get for question

module.exports = router;
