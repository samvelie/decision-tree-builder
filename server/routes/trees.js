var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

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

module.exports = router;
