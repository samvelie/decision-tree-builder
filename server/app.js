var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var decoder = require('./modules/decoder');
var treeData = require('./routes/trees');
var freeData = require('./routes/freetrees');
var portDecision = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.sendFile(path.resolve('./public/views/index.html'));
});

app.use(express.static('public'));
app.use(bodyParser.json());

// public routes
app.use('/global', freeData);

// Decodes the token in the request header and attaches the decoded token to the request.
app.use(decoder.token);

/* Below is protected by authentication. */

// This is the route for your secretData. The request gets here after it has been authenticated.
app.use("/trees", treeData);

app.listen(portDecision, function(){
  console.log("Listening on port: ", portDecision);
});
