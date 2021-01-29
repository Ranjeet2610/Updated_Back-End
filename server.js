
var express = require('express');
var Request = require("request");
const cron = require("node-cron");

var Account = require('./controllers/account.controller');


var app = express();
//var log = require('morgan')('dev');
var bodyParser = require('body-parser');

var properties = require('./config/config');
var db = require('./config/db');
//auth routes
var authRoutes = require('./routers/user.routes');

//configure bodyparser
var bodyParserJSON = bodyParser.json();
var bodyParserURLEncoded = bodyParser.urlencoded({extended:true});

//initialise express router
var router = express.Router();

// call the database connectivity function
db();


//app.use(log);
app.use(bodyParserJSON);
app.use(bodyParserURLEncoded);

// Error handling
app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader("Access-Control-Allow-Credentials", "true");
     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,PATCH");
     res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization");
   next();
 } );



 app.get('/api', (req, res) => {
  return res.json({'hi': 'hello'});
});
console.log('test data in progress');
// use express router
app.use('/api',router);
authRoutes(router); 

// cron.schedule(" 02 04 * * *", function() {

//    Request.get({
//         "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
//         "url": "http://identitysso.betfair.com/api/keepAlive",
//     }, (error,response,body) => {
//         if(error) {
//             return console.log(error);
//         }
//         const bodyData = JSON.parse(body)
//         if(bodyData.status=="SUCCESS"){
//           console.log(bodyData);


//         }

//   });
//   console.log("running a task every 3 minute");
// });

// (" 0 08 * * *

cron.schedule(" 30 * * * *", function() {

  Request.get({
    "headers": {"content-type": "application/json" },
    "url": "http://65.1.37.38:4000/api/BetSettleMatchOdds",
}, (error,response,body) => {
    if(error) {
        return console.log(error);
    }
      console.log("bet settle begin");

});
 
});

cron.schedule(" 10 * * * *", function() {
  Request.get({
    "headers": {"content-type": "application/json" },
    "url": "http://65.1.37.38:4000/api/BetSettleFancyOdds",
}, (error,response,body) => {
    if(error) {
        return console.log(error);
    }
      console.log("bet settle begin");

});
 
});

cron.schedule("*/5 * * * * *", function() {
  Request.get({
    "headers": {"content-type": "application/json" },
    "url": "http://65.1.37.38:4000/api/storeFancyOddsCron",
}, (error,response,body) => {
    if(error) {
        return console.log(error);
    }
      console.log("Import data again");
  
})
})
// //call auth routing
app.listen(properties.PORT, (req, res) => {
    console.log(`Server is running on ${properties.PORT} port.`);
})