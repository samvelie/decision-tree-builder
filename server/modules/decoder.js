var admin = require("firebase-admin");
var pg = require('pg');
var config = require('../modules/database-config');

var pool = new pg.Pool(config);

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://decision-trees.firebaseio.com"
});

// runs to deal with all incoming requests
var tokenDecoder = function(req, res, next){
  if (req.headers.id_token) {
    console.log('req.headers.idtoken', req.headers.id_token);
    admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
      // Adding the decodedToken to the request so that downstream processes can use it
      req.decodedToken = decodedToken;
      var userEmail = req.decodedToken.email;
      //run query for user id, if successful do next
      pool.connect(function(err, client, done) { //attaching userID to every auth request
        client.query('SELECT id FROM users WHERE email=$1;', [userEmail], function(err, userQueryResult){
          done();
          if(err){
            console.log('error connecting to db on user query:', err);
            res.sendStatus(500);
          } else {
              pool.connect(function(err,client2,done) {
                if(userQueryResult.rowCount === 0) { //if user does not exist, add them to user list, keep id
                  client2.query('INSERT INTO users (email) VALUES ($1) RETURNING id;', [userEmail], function(err, result){
                    done();
                    if(err) {
                      console.log('error connecting to db on user add:', err);
                      res.sendStatus(500);
                    } else {
                      console.log('userId added and authenticated:', result.rows[0].id);
                      req.userId = userQueryResult.rows[0].id;
                      next();
                    }
                  });
                } else {
                  console.log('userId authenticated:', userQueryResult.rows[0].id);
                  req.userId = userQueryResult.rows[0].id;
                  next();
                }
              });
          }
        }); //end user select query
      });
    })
    .catch(function(error) {
      // If the id_token isn't right, you end up in this callback function
      // Here we are returning a forbidden error
      console.log('User token could not be verified');
      res.sendStatus(403);
    });
  } else {
    // Seems to be hit when chrome makes request for map files
    // Will also be hit when user does not send back an idToken in the header
    console.log('something went wrong decoding token', req.headers);
    res.sendStatus(403);
  }
};

module.exports = { token: tokenDecoder };
