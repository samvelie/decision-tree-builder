var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert("./server/firebase-service-account.json"),
  databaseURL: "https://sigma-test-run.firebaseio.com" // replace this line with your URL
});

/* This is where the magic happens. We pull the idtoken off of the request,
verify it against our private_key, and then we return the decodedToken */
var tokenDecoder = function(req, res, next){
  admin.auth().verifyIdToken(req.headers.id_token).then(function(decodedToken) {
    /* Whatever you do in here is protected by your authorization.
    WARNING: So far you are returning secret data to ANYONE who is logged in
    there is still more work to be done if you want to implement roles
    You can use the decodedToken and some logic to do that. */
    req.decodedToken = decodedToken;
    next();
  })
  .catch(function(error) {
    // If the id_token isn't right, you end up in this callback function
    // Here we are simply returning a string response, but a forbidden error may be better
    res.send(403);
  });
}

module.exports = { token: tokenDecoder };
