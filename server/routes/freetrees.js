var express = require('express');
var router = express.Router();
var pg = require('pg');
var pool = require('../modules/database-config');

// var pool = new pg.Pool(config);

//gets list of global trees
router.get('/', function(req, res) {
  var userId = req.userId;
  pool.connect(function(err, client, done) {
      client.query('SELECT * FROM trees WHERE public=TRUE;', function(err, result) {
       done();
       if(err) {
         console.log('error completing tree query:', err);
         res.sendStatus(500);
       } else {
         res.send(result.rows);
       }
      });//end query for tree list
  });//end pool.connect
});//end router.get

//gets all nodes and responses
router.get('/:treeId', function(req, res) {
  var treeId = req.params.treeId;
  pool.connect(function(err, client, done) {
      client.query('SELECT trees.tree_name, nodes.id AS "nodeId", nodes.content, options.id AS "optionId", options.response_text, options.from_node_id, options.to_node_id FROM trees LEFT OUTER JOIN nodes ON trees.id=nodes.tree_id LEFT OUTER JOIN options ON nodes.id=options.from_node_id WHERE trees.id=$1 AND trees.public=TRUE ORDER BY nodes.id;',
      [treeId],
      function(err, result) {
       done();
       if(err) {
         console.log('error completing tree query:', err);
         res.sendStatus(500);
       } else {
         res.send(result.rows);
       }
      });//end query for tree list
  });//end pool.connect
});//end router.get

module.exports = router;
