// module.exports = {
//   database: 'decisions',
//   host: 'localhost',
//   port: 5432,
//   max: 100, //this is the "bandaid" fix for server troubles
//   idleTimeoutMillis: 1500
// };


var url = require('url');
var pg = require('pg');

if(process.env.DATABASE_URL) {
 var params = url.parse(process.env.DATABASE_URL);
 var auth = params.auth.split(':');

 var config = {
   user: auth[0],
   password: auth[1],
   host: params.hostname,
   port: params.port,
   database: params.pathname.split('/')[1],
   ssl: true
 };
} else {
 var config = {
   database: 'decisions', // the name of the database
   host: 'localhost', // where is your database
   port: 5432, // the port number for your database
   max: 100, // how many connections at one time
   idleTimeoutMillis: 30000 // 30 seconds to try to connect
 };
}

module.exports = new pg.Pool(config);
