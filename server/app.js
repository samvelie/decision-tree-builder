var admin = require("firebase-admin");
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// Static files
app.use(express.static('public'));

app.use(bodyParser.json());

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://sigma-test-run.firebaseio.com" // replace this line with your URL
});

// This is the route for your secretData
app.get("/privateData", function(req, res){

  /* This is where the magic happens. We pull the idtoken off of the request,
  verify it against our private_key, and then we return the decodedToken */

  admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    /* Whatever you do in here is protected by your authorization.
    WARNING: So far you are returning secret data to ANYONE who is logged in
    there is still more work to be done if you want to implement roles
    You can use the decodedToken and some logic to do that. */

    console.log(decodedToken); // Here you can see the information firebase gives you about the user
    res.send("Secret DATA!!! You got it!!! Great work " + decodedToken.name + "!!!");
  })
  .catch(function(error) {
    // If the id_token isn't right, you end up in this callback function
    // Here we are simply returning a string response, but a forbidden error may be better
    res.send("No secret data for you!");
  });

});

var portDecision = process.env.PORT || 5000;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
