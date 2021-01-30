




// module.exports.getAllMasterClosedusers = (masterName) => {
//     return new Promise((resolve, reject) => {
//         Users.get({ blocked: true, superAdmin: false, Master: false, Admin: false, master: masterName }, function (err, users) {
//             if (err) {
//                 return reject(err);
//             }
//             else {
//                 return resolve(users);
//             }
//         })

//     });
// }


// cron.schedule(" * 8  * * *", function() {

//     Request.get({
//          "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
//          "url": "http://identitysso.betfair.com/api/keepAlive",
//      }, (error,response,body) => {
//          if(error) {
//              return console.log(error);
//          }
//          const bodyData = JSON.parse(body)
//          if(bodyData.status=="SUCCESS"){
//            console.log(bodyData);
 
 
//          }
 
//    });
//    // console.log("running a task every minute");
//  });
 
//  cron.schedule(" * 8  * * *", function() {
 
//    app.get('/api/BetSettleMatchOdds', (req, res) => {
//      return res.json({'hi': 'hello'});
//    });
  
//  });