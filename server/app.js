var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');

app.use(express.static('public'));
app.use(bodyParser.json());

// Decodes the token in the request header and attaches the decoded token to the request.
app.use(decoder.token);

// This is the route for your secretData. The request gets here after it has been authenticated.
app.get("/privateData", function(req, res){
  console.log(req.decodedToken); // Here you can see the information firebase gives you about the user
  res.send("Secret DATA!!! You got it!!! Great work " + req.decodedToken.name + "!!!");
});

var portDecision = process.env.PORT || 5000;

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
