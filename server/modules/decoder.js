var admin = require("firebase-admin");
var pg = require('pg');
var connectionString = require('../modules/database-config');

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://decision-trees.firebaseio.com"
});

/* This is where the magic happens. We pull the id_token off of the request,
verify it against our firebase service account private_key.
Then we add the decodedToken */
var tokenDecoder = function(req, res, next){
  if (req.headers.id_token) {
    admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
      // Adding the decodedToken to the request so that downstream processes can use it
      req.decodedToken = decodedToken;
      //run query for user id, if successful do next
      pg.connect(connectionString, function(err, client, done){ //attaching userID to every auth request
        var userEmail = req.decodedToken.email;
        client.query('SELECT id FROM users WHERE email=$1;', [userEmail], function(err, userQueryResult){
          done();
          if(err){
            console.log('error connecting to db on user query:', err);
            res.sendStatus(500);
          } else {
              pg.connect(connectionString, function(err,client,done) {
                if(userQueryResult.rowCount === 0) { //if user does not exist
                  client.query('INSERT INTO users (email) VALUES ($1) RETURNING id;', [userEmail], function(err, result){
                    done();
                    if(err) {
                      console.log('error connecting to db on user add:', err);
                      res.sendStatus(500);
                    } else {
                      console.log('userId added and authenticated:', result.rows[0].id);
                      req.decodedToken.userId = userQueryResult.rows[0].id;
                    }
                  });
                } else {
                  console.log('userId authenticated:', userQueryResult.rows[0].id);
                  req.decodedToken.userId = userQueryResult.rows[0].id;
                }
              });
            next();
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
    res.sendStatus(403);
  }
};

module.exports = { token: tokenDecoder };
