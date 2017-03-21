var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

//gets list of trees made by user
router.get("/", function(req, res) {
  var userId = req.decodedToken.userId;
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

//posts a tree connected to user
router.post("/", function(req, res) {
  var userId = req.decodedToken.userId;
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

//gets list of nodes associated with tree id
router.get("/:id", function(req, res) {
  var userId = req.decodedToken.userId; //ensures nodes are only grabbed for trees made by this user
  var treeId = req.params.id;
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT nodes.id, content, tree_end FROM nodes JOIN trees ON nodes.tree_id = trees.id WHERE trees.creator_id=$1 AND tree_id=$2;',
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

module.exports = router;
