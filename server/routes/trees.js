var express = require('express');
var router = express.Router();
var pg = require('pg');
var connectionString = require('../modules/database-config');

router.get("/", function(req, res) {
  pg.connect(connectionString, function(err, client, done) {
      var userId = req.decodedToken.userId;
      client.query('SELECT * FROM trees WHERE creator_id=$1;', [userId], function(err, getTreesResult) {
       done();
       if(err) {
         console.log('error completing user query task:', err);
         res.sendStatus(500);
       } else {
         res.send(getTreesResult.rows);
       }
      });//end query for tree list
  });//end pg.connect
});//end router.get

module.exports = router;
