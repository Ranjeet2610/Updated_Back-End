var Request = require("request");
var _ = require('lodash');


const Utils = require('../utils/utils.user');
var Users = require('../dao/user.dao');
var DB = require('../models/user.model');
var properties = require('../config/config');

// var Request = require("request");
var randtoken = require('rand-token') 
var refreshTokens = {} 
// var DB = require('../db/user')

const { hashSync, genSaltSync, compareSync } = require("bcryptjs");
const { sign } = require("jsonwebtoken");
const { forEachRight, result } = require("lodash");

/**
 * @author: Sopra Steria
 * @description:Create user function add new user in file also check from email id user already exist.
 * @param:req is request payload,res is reponse object and next for hanlled error
 * @return:return current user object or exist user object
 */

exports.createUser = function (req, res, next) {
      
if(req.body.userName == null || req.body.userName == undefined || req.body.password == null || req.body.password == undefined){
    return res.send({status:false, message:"Please Provide All Required Information"})
  }
  else{
     DB.user.findOne({userName:req.body.userName}).then((USER)=>{
        if(USER){
            return res.send({status:false, message:"username already exist"})

        }
        
        else{
            
                    DB.user.findOne({userName:req.body.userName}).then((user)=>{
                        if(!user){
                            var salt = genSaltSync(10);
                            var hash= hashSync(req.body.password, salt);
                                var user = new DB.user ({
                                    userName: req.body.userName,
                                    Name:req.body.Name,
                                    Commission:req.body.Commission,
                                    password: hash,
                                    passwordString:req.body.password,
                                    walletBalance:req.body.walletBalance,
                                    master:req.body.master,
                                    admin:req.body.admin,
                                    superadmin:req.body.superadmin,
                                    Master:req.body.Master,
                                    Admin:req.body.Admin,
                                    superAdmin:req.body.superAdmin              ,
                                    userType: 1,
                                    
                                })

                                var userSportsInfo = new DB.userSportsInfo({
                                    user: user,
                                    userName:req.body.userName,
                                    Commission:req.body.Commission
                                })
                                
                                var userChipsInfo = new DB.userChipsInfo({
                                    user: user,
                                    userName:req.body.userName,
                                })
                                
                                var account = new DB.account({
                                    userName:req.body.userName,
                                    accountHolderName: user,
                                    walletBalance:req.body.walletBalance,
                                    amountDepositedByMaster:req.body.walletBalance,
                                    userType: true,

                                })

                                userSportsInfo.save()
                                userChipsInfo.save()
                                
                                account.save()
                                user.save().then((saved)=>{
                                    if(!saved){
                                        return res.send({status:false, message:"Technical Error"})
                                    
                                    }
                                            return res.send({status:true,
                                                 message:"User Added Sucessfully",
                                                data:user})
                                 
                            });
                            
                         } 
                     });
                
            //  }); 
                  
           } 
       });
    }

 }







//  login based on the user email id and password
exports.login= function(req,res,next){
    const body = req.body;
Utils.getUserDetailsByEmail(body.userName).then(data=>{

if(data.blocked==true){

return res.json({ success:false,message :"user is blocked"})
}

const result = compareSync(body.password,data.password);
if(result){
    data.password = undefined;
    var refreshToken = randtoken.uid(528);
    var user = { 
        'username': data.userName,
        'id':data._id
      }
    const jsontoken = sign(user, "xyz1235",{
        expiresIn: "1h"
    });
    refreshTokens[refreshToken] = data.userName; 
    return res.json({
          success: 1,
          message :"login successfully",
          token: jsontoken,
          refreshToken: refreshToken,
          data:data

    });
} else {
    return res.json({
        success: 0,
        data :"invalid email or password"
    });
}
});

}
exports.getRefreshToken = (req,res,next)=>{
    var username = req.body.userName
    var refreshToken = req.body.refreshToken
    var id = req.body.id
    //console.log(refreshTokens);
    if((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == username)) {
      var user = {
        'username': username,
        'id':id
      }
      var token = sign(user, 'xyz1235', { expiresIn: '1h' })
      res.json({token:token})
    }
    else {
      res.send(401)
    }
}


/**
 * @author: Sopra Steria
 * @description:get User function get the User Details based on the User Email ID.
 * @param:req is request payload,res is reponse object and next for hanlled error
 * @return:return current user Details
 */
exports.getUserDetailsByEmail= function (req,res,next){
    Utils.getUserDetailsByEmail(req.body.email).then(data=>{
        res.json(data);
    });
}
/**
 * @author: Sopra Steria
 * @description:Get all users list .
 * @param:req is request payload,res is reponse object and next for hanlled error
 * @return:return all users list object
 */
exports.getUsers = function (req, res, next) {
    Utils.getAllusers().then(data=>{
        res.json(data);
    });
   
}

// get users for a specific master

exports.getMasterUsers = async function (req, res, next) {
   await Utils.getAllMasterusers(req.body.masterName).then(data=>{
        res.json(data);
    });
   
}

// get closed user for a specific master

exports.getMasterClosedUsers = function (req, res, next) {
    Utils.getAllMasterClosedusers(req.body.masterName).then(data=>{
        res.json(data);
    });
   
}

// get masters for a specific super master

exports.getAdminMasters = function (req, res, next) {
    Utils.getAllAdminMasters(req.body.adminName).then(data=>{
        res.json(data);
    });
   
}

// get closed masters for a specific master

exports.getAdminClosedMasters = function (req, res, next) {
    Utils.getAllAdminClosedMasters(req.body.adminName).then(data=>{
        res.json(data);
    });
   
}

// get admins for a specific superadmin

exports.getSuperAdminAdmins = function (req, res, next) {
    Utils.getAllSuperAdminAdmins(req.body.superadminName).then(data=>{
        res.json(data);
    });
   
}

// get closed admins for superAdmin

exports.getSuperAdminClosedAdmins = function (req, res, next) {
    Utils.getAllSuperAdminClosedAdmins(req.body.superadminName).then(data=>{
        res.json(data);
    });
   
}

//get all master list

exports.getMasters = function (req, res, next) {
    Utils.getAllMasters().then(data=>{
        res.json(data);
    });
   
}

//get all admin list

exports.getAdmins = function (req, res, next) {
    Utils.getAllAdmins().then(data=>{
        res.json(data);
    });
   
}

//get all block users


exports.getBlockUsers = function (req, res, next) {
    Utils.getBlockusersList().then(data=>{
        res.json(data);
    });
   
}

//get all block masters
exports.getBlockMasters = function (req, res, next) {
    Utils.getBlockmastersList().then(data=>{
        res.json(data);
    });
   
} 

// get all block admins

exports.getBlockAdmins = function (req, res, next) {
    Utils.getBlockadminsList().then(data=>{
        res.json(data);
    });
   
} 
// lock user
exports.lockUser = (req,res) =>{

    DB.user.findOne({userName:req.body.userName}).then((updatedUser)=>{
        if (updatedUser.status == false) {
            updatedUser.status = true
        }
        else{
            updatedUser.status = false
        }

        updatedUser.save().then((saved)=>{
            if(saved){
                return res.send({Data:updatedUser})

            }
       })

    })
}
// lock user
exports.lockUnlockBetting = (req,res) =>{

    DB.user.findOne({userName:req.body.userName}).then((updatedUser)=>{
        if (updatedUser.enableBetting == false) {
            updatedUser.enableBetting = true
        }
        else{
            updatedUser.enableBetting = false
        }

        updatedUser.save().then((saved)=>{
            if(saved){
                return res.send({Data:updatedUser})

            }
       })

    })
}



//close user

exports.closeUser = (req,res)=>{
    try {
        DB.user.findOne({userName:req.body.userName}).then((user)=>{
            if(!user){
                return  res.send({status:false, message:"Technical Error"})
            }else{
                user.blocked = true
                user.save().then((saved)=>{
                    if(!saved){
                       return  res.send({status:false, message:"Technical Error"})

                    }else{
                       return  res.send({status:true, message:"User Blocked Successfully",data:user})

                    }
                })
            }
        })
    } catch (error) {
       return  res.send({status:false, message:"Technical Error"})

    }
}
// open user

exports.openUser = (req,res)=>{
    try {
        DB.user.findOne({userName:req.body.userName}).then((user)=>{
            if(!user){
                return  res.send({status:false, message:"Technical Error"})
            }else{
                user.blocked = false
                user.save().then((saved)=>{
                    if(!saved){
                       return  res.send({status:false, message:"Technical Error"})

                    }else{
                       return  res.send({status:true, message:"User unblocked Successfully",data:user})

                    }
                })
            }
        })
    } catch (error) {
       return  res.send({status:false, message:"Technical Error"})

    }
} 

//get all live sports

exports.getLiveSports = async (req,res) => {

    Request.post({
        "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
        "url": "https://api.betfair.com/exchange/betting/rest/v1.0/listEventTypes/",
        "body": JSON.stringify({
            
                "filter" : {}
            
        })
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        console.log(body)
        const bodyData = JSON.parse(body)
        return res.send({status:true, message:"live sports data", data:bodyData})
        
  });
    

}

//get live competitions by providing id, 1 for soccer 2 for tennis and 4 for cricket

exports.getLiveCompetitions = async (req,res) => {
    
    let EventTypeid= req.params
   
    if (EventTypeid){


        Request.post({
            "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
            "url": properties.BetFairAPIURL,
            "body": JSON.stringify(
                
                {
                    "params": {
                       "filter": {
                          "eventTypeIds": [EventTypeid]
                        //   "CompetitionID"
                       }
                    },
                    "jsonrpc": "2.0",
                    "method": "SportsAPING/v1.0/listCompetitions",
                    "id": 1
                 }
    
                
         )
        }, (error, response, body) => {
            if(error) {
                return console.log(error);
            }
            // console.log(body)
            const bodyData = JSON.parse(body)
            return res.send({status:true, message:"live sports competition", data:bodyData})
        });
        
    
        
    }

}

//get list events with time for a specific sport

exports.getLiveEvents = async (req,res) => {
    
    let EventTypeid= req.body.EventTypeid
    let competitionIds= req.body.competitionIds  
    if (competitionIds){


        Request.post({
            "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
            "url": properties.BetFairAPIURL,
            "body": JSON.stringify(
                
                {
                    "params": {
                       "filter": {
                        //   "eventTypeIds": [EventTypeid],
                        //   "eventIds": [eventIds],
                        "competitionIds": [competitionIds]
                       }
                    },
                    "jsonrpc": "2.0",
                    "method": "SportsAPING/v1.0/listEvents",
                    "id": 1
                 }
    
                
         )
        }, (error, response, body) => {
            if(error) {
                return console.log(error);
            }
            // console.log(body)
            const bodyData = JSON.parse(body)
            return res.send({status:true, message:"live sports events", data:bodyData})
        });
        
    }
 
    else
    {

    Request.post({
        "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
        "url": properties.BetFairAPIURL,
        "body": JSON.stringify(
            
            {
                "params": {
                   "filter": {
                      "eventTypeIds": [EventTypeid]
                   }
                },
                "jsonrpc": "2.0",
                "method": "SportsAPING/v1.0/listEvents",
                "id": 1
             }

            
     )
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        // console.log(body)
        const bodyData = JSON.parse(body)
        return res.send({status:true, message:"live sports events", data:bodyData})
    });
    

    }

}

//list market type and market odds

exports.listEventsDataById = async (req,res) =>{

    let eventIds= req.body.EventId
    Request.post({
        "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
        "url": properties.BetFairAPIURL,
        "body": JSON.stringify(
            
            [
                {
                    "jsonrpc": "2.0",
                    "method": "SportsAPING/v1.0/listMarketCatalogue",
                    "params": {
                        "filter": {
                            "eventIds": [eventIds],
                            // "marketIds": [marketIds]
                            
                        },
                        "maxResults": "200",
                        "marketProjection": [
                            // "COMPETITION",
                            // "EVENT",
                            // "EVENT_TYPE",
                            "RUNNER_DESCRIPTION",
                            // "RUNNER_METADATA",
                            "MARKET_START_TIME"
                        ]
                    },
                    "id": 1
                }
            ]
            
     )
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        const marketData = JSON.parse(body)
        marketIds = marketData[0].result[0].marketId
       
        Request.post({
            "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
            "url": properties.BetFairAPIURL,
            "body": JSON.stringify(
                
                [{
                    "jsonrpc": "2.0",
                    "method": "SportsAPING/v1.0/listMarketBook",
                    "params": {
                        "marketIds": [marketIds],
                        "priceProjection": {
                            "priceData": ["EX_BEST_OFFERS", "EX_TRADED"],
                            "virtualise": "true"
                        }
                    },
                    "id": 1
                }]
         )
        }, (error, response, body) => {
            if(error) {
                return console.log(error);
            }
            const oddsData = JSON.parse(body)
            return res.json(oddsData)
        });

    });
    


}

// list market odds

exports.listMarketOdds = async (req,res) => {
    
        var marketIds= req.body.marketId
   
    if (marketIds){


        Request.post({
            "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
            "url": properties.BetFairAPIURL,
            "body": JSON.stringify(
                
                [{
                    "jsonrpc": "2.0",
                    "method": "SportsAPING/v1.0/listMarketBook",
                    "params": {
                        "marketIds": [marketIds],
                        "priceProjection": {
                            "priceData": ["EX_BEST_OFFERS", "EX_TRADED"],
                            "virtualise": "true"
                        }
                    },
                    "id": 1
                }]
         )
        }, (error, response, body) => {
            if(error) {
                return console.log(error);
            }
            const bodyData = JSON.parse(body)
            return res.send({status:true, message:"live market odds", data:bodyData})
        });
        
    
        
    }

}

// market types

exports.listMarketType = async (req,res) => {
    
    
    let eventIds= req.body.eventId
    

    Request.post({
        "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
        "url": properties.BetFairAPIURL,
        "body": JSON.stringify(
            
            [
                {
                    "jsonrpc": "2.0",
                    "method": "SportsAPING/v1.0/listMarketCatalogue",
                    "params": {
                        "filter": {
                            "eventIds": [eventIds],
                            // "marketIds": [marketIds]
                            
                        },
                        "maxResults": "200",
                        "marketProjection": [
                            // "COMPETITION",
                            // "EVENT",
                            // "EVENT_TYPE",
                            "RUNNER_DESCRIPTION",
                            // "RUNNER_METADATA",
                            "MARKET_START_TIME"
                        ]
                    },
                    "id": 1
                }
            ]
            
     )
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        const bodyData = JSON.parse(body)
        // var sortedObjs = _.sortBy(bodyData[0].result, 'marketId');
        // console.log(sortedObjs)
        return res.send({status:true, message:"live sports events", data:bodyData})
    });
    

}

// store event id of today and tommorow matches

exports.storeLiveEvents = async (req,res) => {

   await DB.event.deleteMany().then((done)=>{
        // console.log("events deleted")
    })
    
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 5)
  
    Request.post({
        "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
        "url": properties.BetFairAPIURL, 
        "body": JSON.stringify(
            
            {
                "params": {
                   "filter": {
                      "eventTypeIds": ["4"],

                    
                   },
                   
                },
                "jsonrpc": "2.0",
                "method": "SportsAPING/v1.0/listEvents",
                "id": 1
             }

            
     )
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        let eventsData = JSON.parse(body)
        // console.log(eventsData)
        eventsData.result.map((item,index)=>{
            // console.log(item.event.id + item.event.name + item.event.openDate)
        var event = new DB.event({
            eventId:item.event.id,
            eventName: item.event.name,
            OpenDate:item.event.openDate

        })

        event.save().then((saved)=>{
            if(saved){
                res.send({status:true, message:"events stored successfully"})
            }


        })

        })
    });
    
}
//change status of events

exports.ActiveLiveEvents = (req,res) =>{

      DB.event.findOne({eventId:req.body.eventId}).then((updatedEvent)=>{
          if (updatedEvent.active == false) {
            updatedEvent.active = true
          }
          else{
            updatedEvent.active = false
          }


          updatedEvent.save().then((saved)=>{
            return res.send({Data:updatedEvent})
     })

 })

}

// activated events for user 
exports.LiveEventsForUser = (req,res) =>{

    DB.event.find({active:true}).then((activeEvents)=>{

        return res.send({status:true ,message:"activated events", Data:activeEvents})
    })

}

// fetch marketType for match odds
exports.marketTypeData= (req,res) =>{
const fobject= {};

    DB.matchOdds.find({eventId:req.body.eventId}).then((marketType)=>{

        // console.log(marketType[0])
        //marketType[0].test = 12; 
        fobject.marketData = marketType[0]
        fobject.runners =[];
        // console.log(fobject)
        DB.matchRunner.find({marketId:marketType[0].marketId}).then((runnersData)=>{

            fobject.runners.push(runnersData)
            res.send({status:1,message:"market type and runners",data:fobject})
        })
    })


}
// fancy data

exports.fancyMarketTypeData= async (req,res) =>{
    
  
       await DB.FancyOdds.find({eventId:req.body.eventId}).then((marketType)=>{
    
            const fanceydata =[];
      var datafancy = marketType.map(async(item)=>{
        

                   let fobject= {};
             
                runnersData  = await DB.FancyRunner.find({marketId:item.marketId})
        
                    fobject.marketData = item
                    fobject.runners =runnersData;
    
                    return fobject;
         
            })


            Promise.all(datafancy).then(FancyData=>{

                // console.log(FancyData)

                res.send({status:1,message:"fancy market type and runners",data:FancyData})

            })
           

        })
    
    
    }


// store marketType

exports.storeMarketType = async (req,res)=>{

    await DB.matchOdds.deleteMany().then((done)=>{
        if(done){
            DB.FancyOdds.deleteMany().then((done)=>{
                if(done){
                    DB.matchRunner.deleteMany().then((done)=>{
                        if(done){
                            DB.FancyRunner.deleteMany().then((done)=>{
                               
            
                            })


                        }
                       
                    })

                }
               
           })
        }
       
    })
    




    DB.event.find().then((events)=>{
        if(!events){
            return  res.send({status:false, message:"no events stored"})
        }
        
        events.map((item,index)=>{

            let eventIds= item.eventId
            Request.post({
                "headers": { "X-Application" : properties.APPKey,"Accept" : "application/json", "X-Authentication" : properties.BetFairToken, "content-type": "application/json" },
                "url": properties.BetFairAPIURL,
                "body": JSON.stringify(
                    
                    [
                        {
                            "jsonrpc": "2.0",
                            "method": "SportsAPING/v1.0/listMarketCatalogue",
                            "params": {
                                "filter": {
                                    "eventIds": [eventIds],
                                    // "marketIds": [marketIds]
                                    
                                },
                                "maxResults": "200",
                                "marketProjection": [
                                    // "COMPETITION",
                                    // "EVENT",
                                    // "EVENT_TYPE",
                                    "RUNNER_DESCRIPTION",
                                    // "RUNNER_METADATA",
                                    "MARKET_START_TIME"
                                ]
                            },
                            "id": 1
                        }
                    ]
                    
             )
            }, (error, response, body) => {
                if(error) {
                    return console.log(error);
                }
                var bodyData = JSON.parse(body)
                                // console.log(bodyData)
                                // return res.json(bodyData)

               

                var matchOdds =  bodyData[0].result.filter((item)=> {
                    return item.marketName == "Match Odds";
                })
                // console.log(matchOdds + "lkjk")

                var fancyOdds =  bodyData[0].result.filter((item)=> {
                    // return item.marketName === "Over";
                    return item.marketName != "Match Odds";
                    // return item.marketName.includes("Over");
                })
                // console.log(fancyOdds)
                // return res.json(fancyOdds)

                // var sortedObjs = _.sortBy(fancyOdds, 'marketId').reverse().slice(0,5);
                // console.log(fancyOdds)

                matchOdds.map((item,index)=>{

                    
                    var matchOdds = new DB.matchOdds({
                        eventId: eventIds,
                        marketId:item.marketId,
                        marketName: item.marketName,
                        marketStartTime:item.marketStartTime
            
                    })
                   matchOdds.save()

                   item.runners.map((item1,index)=>{
            
                  var matchRunner = new DB.matchRunner({
                        marketId:item.marketId,
                        selectionId: item1.selectionId,
                        runnerName:item1.runnerName
            
                    })

                    matchRunner.save()

                   })
                   
                   

                })


                fancyOdds.map((item,index)=>{

                    var FancyOdds = new DB.FancyOdds({
                        eventId: eventIds,
                        marketId:item.marketId,
                        marketName: item.marketName,
                        marketStartTime:item.marketStartTime
            
                    })
            
                    FancyOdds.save()

                item.runners.map((item1,index)=>{
            
                    var FancyRunner = new DB.FancyRunner({
                          marketId:item.marketId,
                          selectionId: item1.selectionId,
                          runnerName:item1.runnerName
              
                      })
  
                      FancyRunner.save()
  
                     })

                }) 
            });
        })
        res.send({status:true, message:"events stored successfully"})

    })

}


//get DBliveEvents
exports.getDbliveEvents = async (req,res)=>{

   await DB.event.find().then((events)=>{
        if(!events){
            return  res.send({status:false, message:"no events stored"})
        }

else
 res.json(events)

})

}

// change password by supermaster master and admin

exports.changePassword = (req,res)=>{
    try {
        DB.user.findOne({userName:req.body.userName}).then((changeuser)=>{
            if(!changeuser){
                return res.send({status:false, message:"User Not Found"})

            }else{
                    var salt = genSaltSync(10);
                    var hash= hashSync(req.body.password, salt);
                    changeuser.password  = hash
                    changeuser.save().then((saved)=>{
                        if(!saved){
                            return res.send({status:false, message:"Not Updated Successfully"})

                        }else{
                            return res.send({status:true, message:"Updated Successfully"})
                        }
                    })
                

            }
        }).catch((error)=>{
            console.log("catch=========",error)
        })
    } catch (error) {
        console.log("try =========catch=========",error)

    }
}

//change password by user

exports.changePasswordByUser = (req,res)=>{
    try {
        DB.user.findOne({userName:req.body.userName}).then((changeuser)=>{
            if(!changeuser){
                return res.send({status:false, message:"User Not Found"})

            }
           var oldpassword = req.body.oldPassword
           var result = compareSync(oldpassword,changeuser.password);
            if(result){

                var salt = genSaltSync(10);
                var hash2= hashSync(req.body.newPassword, salt);
                changeuser.password  = hash2
                changeuser.save().then((saved)=>{
                        if(!saved){
                            return res.send({status:false, message:"Not Updated Successfully"})

                        }else{
                            return res.send({status:true, message:"Updated Successfully"})
                        }
                    })
                
            }



        }).catch((error)=>{
            console.log("catch=========",error)
        })
    } catch (error) {
        console.log("try =========catch=========",error)

    }
}


exports.lockMatchOdds = (req,res) =>{

    DB.matchOdds.findOne({marketId:req.body.marketId}).then((updatedMatchOdds)=>{
        if (updatedMatchOdds.isEnabled == true) {
            updatedMatchOdds.isEnabled = false
        }
        else{
            updatedMatchOdds.isEnabled = true
        }

        updatedMatchOdds.save().then((saved)=>{
            if(saved){
                return res.send({Data:updatedMatchOdds})

            }
       })

    })
}

// enable disable fancy market data

exports.enableFancyOdds = (req,res) =>{

    DB.FancyOdds.findOne({marketId:req.body.marketId}).then((updatedMatchOdds)=>{
        if (updatedMatchOdds.isEnabled == true) {
            updatedMatchOdds.isEnabled = false
        }
        else{
            updatedMatchOdds.isEnabled = true
        }

        updatedMatchOdds.save().then((saved)=>{
            if(saved){
                return res.send({Data:updatedMatchOdds})

            }
       })

    })
}

// is visible fancy market data

exports.visibleFancyOdds = (req,res) =>{

    DB.FancyOdds.findOne({marketId:req.body.marketId}).then((updatedMatchOdds)=>{
        if (updatedMatchOdds.isVisible == true) {
            updatedMatchOdds.isVisible = false
        }
        else{
            updatedMatchOdds.isVisible = true
        }

        updatedMatchOdds.save().then((saved)=>{
            if(saved){
                return res.send({Data:updatedMatchOdds})

            }
       })

    })
}
// is visible fancy runners
exports.visibleFancyRunners = (req,res) =>{

    DB.FancyRunner.findOne({marketId:req.body.marketId,selectionId:req.body.selectionId}).then((updatedMatchOdds)=>{
        if (updatedMatchOdds.isRunnersVisible == true) {
            updatedMatchOdds.isRunnersVisible = false
        }
        else{
            updatedMatchOdds.isRunnersVisible = true
        }

        updatedMatchOdds.save().then((saved)=>{
            if(saved){
                return res.send({Data:updatedMatchOdds})

            }
       })

    })
}



// admin and profit and loss
exports.adminUpDown = async(req,res)=>{

    masters = await Utils.getAllAdminMasters(req.body.adminName);
        const User = [];


      masters.map((item,index)=>{
        User.push( Utils.getAllMasterusers(item.userName));
              });

      Promise.all(User).then((Data)=>{
            
        let bettingData = []

        var mergedData = [].concat.apply([], Data);
        // console.log(mergedData)

        mergedData.map((item,index)=>{
            bettingData.push(DB.betting.find({clientName:item.userName,status:"open"}));
        })

        Promise.all(bettingData).then(data=>{

            var profit5=0;
            var loss5=0;
            var profitLoss5=0;

        // console.log(data) 

        var mergedBettingData= [].concat.apply([], data);


            var mergedBetting= [].concat.apply([], mergedBettingData);

            // console.log(mergedBettingData)

            mergedBetting.map((item,index)=>{
                // console.log(item)
                profit5 = profit5 + item.profit,
                loss5 = loss5 + item.liability
                // console.log(item.P_L)
                // console.log(-item.liability)


               })
               
               profitLoss5 = profit5 - loss5
                //  console.log(profitLoss5)

            return res.json({up:profit5,down:loss5,overAllPL:profitLoss5})





        })
    })

}

// super admin profit and loss

exports.superAdminUpDown = async(req,res)=>{

    masters = await Utils.getAllMasters();
        const User = [];


      masters.map((item,index)=>{
        User.push( Utils.getAllMasterusers(item.userName));
              });

      Promise.all(User).then((Data)=>{
            
        let bettingData = []

        var mergedData = [].concat.apply([], Data);
        // console.log(mergedData)

        mergedData.map((item,index)=>{
            bettingData.push(DB.betting.find({clientName:item.userName,status:"open"}));
        })

        Promise.all(bettingData).then(data=>{

            var profit5=0;
            var loss5=0;
            var profitLoss5=0;

        // console.log(data) 

        var mergedBettingData= [].concat.apply([], data);


            var mergedBetting= [].concat.apply([], mergedBettingData);

            // console.log(mergedBettingData)

            mergedBetting.map((item,index)=>{
                // console.log(item)
                profit5 = profit5 + item.profit,
                loss5 = loss5 + item.liability
                // console.log(item.P_L)
                // console.log(-item.liability)


               })
               
               profitLoss5 = profit5 - loss5
                //  console.log(profitLoss5)

            return res.json({up:profit5,down:loss5,overAllPL:profitLoss5})

        })

    

    })

}

//  userPL section for master
// remaining work to add cricket tennis soccer and fancy
exports.userPL = async (req,res)=>{
  
    try{

        masters = await Utils.getAllMasterusers(req.body.masterName);

      Promise.all(masters).then((Data)=>{
            
        let cricketData = []
        // let fancyData = []
        // let soccerData = []
        // let tennisData = []


        var mergedData = [].concat.apply([], Data);
        mergedData.map((item,index)=>{
            // add sports id
            cricketData.push(DB.betting.find({clientName:item.userName,status:"settled"}));
            // cricketData.push(DB.betting.find({clientName:item.userName,status:"settled",marketType:"Fancy"}));
        })

        Promise.all(cricketData).then(data=>{
            // console.log(data)
            // console.log(data)
            var merged = [].concat.apply([], data);


            const uniqueUserName = [...new Set(merged.map(item => item.clientName))]

          let MarketDATA = [];

          uniqueUserName.map((item,index)=>{

                MarketDATA.push(merged.filter((merged)=> {
                    return merged.clientName == item;
                }));

            })

            Promise.all(MarketDATA).then(DATA=>{
                // console.log(DATA)



                let finalobject = [];


                DATA.map((item)=>{
                let object = {};
                    var profit2=0;
                   var loss2=0;
                   var fancyprofit=0;
                   var fancyloss=0;

               item.map((childItem)=>{
                   if(childItem.marketType=="Fancy"){
                    fancyprofit = fancyprofit + childItem.profit,
                    fancyloss = fancyloss + childItem.liability

                    //    console.log(childItem.profit)
                    //    console.log(childItem.liability)


                   }
                profit2 = profit2 + childItem.profit,
                loss2 = loss2 + childItem.liability

               })
               object.userName = item[0].clientName
               object.fancyProfitLoss = fancyprofit - fancyloss
               object.ProfitLoss = profit2 - loss2
                 finalobject.push(object)
  
                 })
                return res.json(finalobject)   
   

             })      

            })

        })      
    
   
}

catch(error){
    console.log(error)

}

}

// supermaster section user profit and loss

exports.adminUserPL = async (req,res) =>{

    try{
            masters = await Utils.getAllAdminMasters(req.body.adminName);
            const Users = [];
    
    
          masters.map((item,index)=>{
                Users.push( Utils.getAllMasterusers(item.userName));
                  });
    
          Promise.all(Users).then((Data)=>{
                
            let bettingData = []
            var mergedData = [].concat.apply([], Data);
            mergedData.map((item,index)=>{
                bettingData.push(DB.betting.find({clientName:item.userName,status:"settled"}));
            })
    
            Promise.all(bettingData).then(data=>{
                // console.log(data)
    
                var merged = [].concat.apply([], data);
    
    
                const unique = [...new Set(merged.map(item => item.clientName))]
    
              let MarketDATA = [];
    
                unique.map((item,index)=>{
    
                    MarketDATA.push(merged.filter((merged)=> {
                        return merged.clientName == item;
                    }));
    
                })
                const finaloriginal = [];
                Promise.all(MarketDATA).then(DATA=>{
    
    
                    const finalobject = [];
            //  console.log(DATA)
            //  return res.json(DATA)
              masterData = DATA.map(async(item)=>{
                    let object = {};
                   
                        var profit2=0;
                       var loss2=0;
                       var fancyprofit=0;
                       var fancyloss=0;
                  item.map((childItem)=>{

                    if(childItem.marketType=="Fancy"){
                        fancyprofit = fancyprofit + childItem.profit,
                        fancyloss = fancyloss + childItem.liability
    
                        //    console.log(childItem.profit)
                        //    console.log(childItem.liability)
    
    
                       }

                    profit2 = profit2 + childItem.profit,
                    loss2 = loss2 + childItem.liability
    
                   })
                //    object.data =item;
                   object.userName = item[0].clientName
                   master = await Utils.getMyprofile(item[0].clientName);
                   object.master = master.master
                   object.fancyProfitLoss = fancyprofit - fancyloss
                   object.ProfitLoss = profit2 - loss2
          
                    return object
                     })
                     finaloriginal.push(finalobject);

                      Promise.all(masterData).then(finalData=>{

                        var mergedfinalData = [].concat.apply([], finalData);
                        // console.log(mergedfinalData)
                        // return res.json(mergedfinalData)
                        const masterProfitLoss = [];

                           const uniquemaster = [...new Set(mergedfinalData.map(item => item.master))]
              
                        uniquemaster.map((item,index)=>{
              
                            masterProfitLoss.push(mergedfinalData.filter((mergedfinalData)=> {
                                  return mergedfinalData.master == item;
                              }));

                              
                              Promise.all(masterProfitLoss).then(finalmasterarray=>{
                                                         
                                // console.log(finalmasterarray)

                             
                                const masterArray = [];
                                
                                finalmasterarray.map((item,index)=>{

                                    let  masterProfitloss = {};
                                    // console.log(item)
                                    var masterPL = 0;
                                    var masterfancyPL = 0;
                                    item.map((childitem)=>{
                                        masterfancyPL = masterfancyPL + childitem.fancyProfitLoss
                                        masterPL = masterPL + childitem.ProfitLoss

                                    })

                                    masterProfitloss.master = item[0].master
                                    masterProfitloss.profitLoss = masterPL
                                    masterProfitloss.fancyPL = masterfancyPL


                                    // return item.master: masterPL
                                    masterArray.push(masterProfitloss);

                                })  
                              
                                // console.log(masterArray)
                        return res.json({userPL:mergedfinalData,masterPL:masterArray})
                            
                            })
                          })                        
                
                    })
                       
    
                 })      
    
                })
    
            })      
        
       
    }
    
    catch(error){
    
        console.log(error)
    
    
    }
    
    }
    // get user info
    exports.getMyprofile =(req,res) => {
        DB.user.findOne({userName:req.body.userName}).then((USER)=>{
            return res.json(USER);
        })
    }

    // update user info

        exports.updateMyprofile =(req,res) => {
            DB.user.findOne({userName:req.body.userName}).then((USER)=>{

                USER.Name= req.body.Name,
                USER.sessionCommission= req.body.sessionCommission
                
                if(req.body.Commission){
                    USER.Commission= req.body.Commission

                }


            USER.save().then((saved)=>{
                if(saved){
                    return res.send({Data:saved})
    
                }
           })
    
        })

   
        
    }
    // get user sports info

    exports.userSportsInfo =(req,res) => {
        DB.userSportsInfo.findOne({user:req.body.id}).then((userInfo)=>{
            return res.json(userInfo);
        })
    }

    // get user chips info
    exports.userChipsInfo =(req,res) => {
        DB.userChipsInfo.findOne({user:req.body.id}).then((userInfo)=>{
            return res.json(userInfo);
        })
    }
    // update get user sports info
    
    exports.updateUserSportsInfo =(req,res) => {
        DB.userSportsInfo.findOne({user:req.body.id}).then((userInfo)=>{

            userInfo.cricketmaxStacks=req.body.cricketmaxStacks,
            userInfo.cricketminStacks= req.body.cricketminStacks,
            userInfo.cricketmaxProfit= req.body.cricketmaxProfit,
            userInfo.cricketmaxLoss= req.body.cricketmaxLoss,
            userInfo.cricketPreInplayProfit= req.body.cricketPreInplayProfit,
            userInfo.cricketPreInplayStack= req.body.cricketPreInplayStack,
            userInfo.cricketmaxOdds= req.body.cricketmaxOdds,
            userInfo.cricketminOdds= req.body.cricketminOdds,
            userInfo.fancymaxStacks= req.body.fancymaxStacks,
            userInfo.fancyminStacks= req.body.fancyminStacks,
            userInfo.fancymaxProfit= req.body.fancymaxProfit

            userInfo.save().then((saved)=>{
                if(saved){
                    return res.send({Data:saved})
    
                }
           })

        })
    }

    // update chips info
    exports.updateUserChipsInfo =(req,res) => {
        DB.userChipsInfo.findOne({user:req.body.id}).then((userInfo)=>{

            userInfo.chipName1=req.body.chipName1,
            userInfo.chipName2= req.body.chipName2,
            userInfo.chipName3= req.body.chipName3,
            userInfo.chipName4= req.body.chipName4,
            userInfo.chipName5= req.body.chipName5,
            userInfo.chipvalue1= req.body.chipvalue1,
            userInfo.chipvalue2= req.body.chipvalue2,
            userInfo.chipvalue3= req.body.chipvalue3,
            userInfo.chipvalue4= req.body.chipvalue4,
            userInfo.chipvalue5= req.body.chipvalue5,
            
            userInfo.save().then((saved)=>{
                if(saved){
                    return res.send({Data:saved})
    
                }
           })

        })
    }
    // set sportsinfo value
    exports.setUserSportsInfo =(req,res) => {
      
           
            var userSportsInfo = new DB.userSportsInfo({
            cricketmaxStacks: req.body.cricketmaxStacks,
            cricketminStacks: req.body.cricketminStacks,
            cricketmaxProfit: req.body.cricketmaxProfit,
            cricketmaxLoss:req.body.cricketmaxLoss,
            user:req.body.id,
            cricketPreInplayProfit: req.body.cricketPreInplayProfit,
            cricketPreInplayStack: req.body.cricketPreInplayStack,
            cricketmaxOdds: req.body.cricketmaxOdds,
            cricketminOdds: req.body.cricketminOdds,
            fancymaxStacks: req.body.fancymaxStacks,
            fancyminStacks: req.body.fancyminStacks,
            fancymaxProfit: req.body.fancymaxProfit
        
        })
       
            userSportsInfo.save().then((saved)=>{

            return res.json(saved)
         })
    }




    // superadmin userPL section

    exports.superAdminUserPL = async (req,res) =>{

        try{
                masters = await Utils.getAllMasters();
                const Users = [];
        
        
              masters.map((item,index)=>{
                    Users.push( Utils.getAllMasterusers(item.userName));
                      });
        
              Promise.all(Users).then((Data)=>{
                    
                let bettingData = []
                var mergedData = [].concat.apply([], Data);
                mergedData.map((item,index)=>{
                    bettingData.push(DB.betting.find({clientName:item.userName,status:"settled"}));
                })
        
                Promise.all(bettingData).then(data=>{
        
                    var merged = [].concat.apply([], data);
        
        
                    const unique = [...new Set(merged.map(item => item.clientName))]
        
                  let MarketDATA = [];
        
                    unique.map((item,index)=>{
        
                        MarketDATA.push(merged.filter((merged)=> {
                            return merged.clientName == item;
                        }));
        
                    })
                    const finaloriginal = [];
                    Promise.all(MarketDATA).then(DATA=>{
        
        
                        const finalobject = [];
                 
        
              var masterData=  DATA.map(async(item)=>{
                        let object = {};
                       
                            var profit2=0;
                           var loss2=0;
                           var fancyprofit=0;
                           var fancyloss=0;
                       item.map((childItem)=>{
                        if(childItem.marketType=="Fancy"){
                            fancyprofit = fancyprofit + childItem.profit,
                            fancyloss = fancyloss + childItem.liability
        
        
                           }

                        profit2 = profit2 + childItem.profit,
                        loss2 = loss2 + childItem.liability
        
                       })
                    //    object.data =item;
                       object.userName = item[0].clientName
                       var master = await Utils.getMyprofile(item[0].clientName);
                       object.master = master.master
                       admin = await Utils.getMyprofile(master.master);
                       object.admin =  admin.admin
                       object.fancyProfitLoss = fancyprofit - fancyloss
                       object.ProfitLoss = profit2 - loss2

                    
            
          
                        return object
                         })
   
    
    
                         Promise.all(masterData).then(finalData=>{
    
                            var mergedfinalData = [].concat.apply([], finalData);
  
                    
                     
                           const masterProfitLoss = [];

                           const uniquemaster = [...new Set(mergedfinalData.map(item => item.admin))]
              
                        uniquemaster.map((item,index)=>{
              
                            masterProfitLoss.push(mergedfinalData.filter((mergedfinalData)=> {
                                  return mergedfinalData.admin == item;
                              }));

                              
                              Promise.all(masterProfitLoss).then(finalmasterarray=>{
                             
                                const masterArray = [];
                                
                                finalmasterarray.map((item,index)=>{

                                    let  masterProfitloss = {};
                                    var masterPL = 0;
                                    var fancyPL = 0;
                                    item.map((childitem)=>{
                                        masterPL = masterPL + childitem.ProfitLoss
                                        fancyPL = fancyPL + childitem.fancyProfitLoss


                                    })

                                    masterProfitloss.admin = item[0].admin
                                    masterProfitloss.profitLoss = masterPL
                                    masterProfitloss.fancyprofitLoss = fancyPL


                                    // return item.master: masterPL
                                    masterArray.push(masterProfitloss);

                                })
                              
                        return res.json({userPL:mergedfinalData,adminPL:masterArray})
                            
                            })
                          })     

                         })
        
                     })      
        
                    })
        
                })      
            
           
        }
        
        catch(error){
        
            console.log(error)
        
        
        }
        
        }
        
   //code added by shreesh
    exports.addNews = function (req, res, next) {
        var news = new DB.news({
            newsTitle: req.body.newsTitle,
            active: req.body.active,
            newsID: req.body.newsID
        })
        news.save().then((result) => {
            return res.status(200).json({ status: 'Success', message: 'News added successfully', "data":result});
        }).catch ((err)=> {
            return res.status(500).json({ success: false, error: err }).end('');
        });
    }

    //code added by shreesh
    exports.getNews = function (req, res, next) {
        DB.news.find({}).sort( { _id: -1 } ).then((result) => {
            return res.status(200).json({ status: 'Success', message: 'News list retreived successfully', "data":result});
        }).catch ((err)=> {
            return res.status(500).json({ success: false, error: err }).end('');
        });
    }

    //code added by shreesh
    exports.updateNews = function (req, res, next) {
        DB.news.updateOne({_id:req.params.id},{ $set: req.body }).then((result) => {
            return res.status(200).json({ status: 'Success', message: 'News updated successfully', "data":result});
        }).catch ((err)=> {
            return res.status(500).json({ success: false, error: err }).end('');
        });
    }

    //code added by shreesh
    exports.deleteNews = function (req, res, next) {
        DB.news.remove({_id:req.params.id}).then((result) => {
            return res.status(200).json({ status: 'Success', message: 'News deleted successfully', "data":result});
        }).catch ((err)=> {
            return res.status(500).json({ success: false, error: err }).end('');
        });
    }

    //code added by shreesh
    exports.getLiveCricketScore = async (req, res) => {
        var options = {
            method: 'GET',
            url: properties.rapid_api_cricket_url,
            qs: { seriesid: properties.seriesid, matchid: properties.matchid },
            headers: {
                'x-rapidapi-host': properties.rapidapi_host,
                'x-rapidapi-key': properties.rapidapi_key,
                useQueryString: properties.useQueryString
            }
        };

        Request(options, function (error, response, body) {
            if (error) {
                return res.status(500).json({ success: false, error: error }).end('');
            } else {
                return res.status(200).json({ status: 'Success', message: 'Live Cricket Score', "data": JSON.parse(body) });
            }


        });
    }

    //code added by shreesh
    exports.updateAdminWalletbalance = async (req, res) => {
        DB.user.updateOne({_id:'5f5b5e1bbb772d1bf877f474'},{ $set: {walletBalance:req.body.funds }}).then((result) => {
            return res.status(200).json({ status: 'Success', message: 'Admin Wallet Balance updated successfully', "data":result});
        }).catch ((err)=> {
            return res.status(500).json({ success: false, error: err }).end('');
        });
    }

    //Code by Harry
    exports.getAllBetting = async (req, res) => {
        try {
            let eventID = req.query.event_id;
            if(!eventID){
                return  res.send({status:false, message:"Kindly share the event id for getting the data"});
            }
            
            DB.betting.aggregate([
                { 
                    "$match": { "eventID": parseInt(eventID) } 
                },
                {
                  $lookup: {
                    from: "users", 
                    localField: "userid",
                    foreignField: "_id",
                    as: "userInfo"
                  }
                }, {
                    $lookup: {
                        from: "users", 
                        localField: "userInfo.master",
                        foreignField: "userName",
                        as: "userInfos"
                    }
                }, {
                    $addFields: 
                    {
                        "userInfo.superAdmin":"$userInfos.admin",
                        "userInfo.admin":"$userInfo.master"
                    }
                    }
                
                , {
                    $project: {
                        "__v": 0,
                        "userInfo._id": 0,
                        "userInfo.__v": 0,
                        "userInfo.createdAt":0,
                        "userInfo.status":0,
                        "userInfo.walletBalance":0,
                        "userInfo.exposure":0,
                        "userInfo.profitLossChips":0,
                        "userInfo.creditLimit":0,
                        "userInfo.creditGiven":0,
                        "userInfo.freeChips":0,
                        "userInfo.enableBetting":0,
                        "userInfo.blocked": 0,
                        "userInfo.Commission":0,
                        "userInfo.sessionCommission":0,
                        "userInfo.ref":0,
                        "userInfo.userSportsInfo":0,
                        "userInfo.completedCasinoGame":0,
                        "userInfo.winCasinoGame":0,
                        "userInfo.userName":0,
                        "userInfo.Name":0,
                        "userInfo.password":0,
                        "userInfo.passwordString":0,
                        "userInfo.Master": 0,
                        "userInfo.Admin":0,
                        "userInfo.master":0,
                        "userInfos":0
                                   
                    }
                }
              ]).then(results => {
                    return res.status(200).json({ status: 'Success', "data": results});
              });

        } catch (err) {
            return res.status(500).json({ success: false, message: 'Something went wrong', error: err }).end('');
        }
    }
    exports.getAllMasterandSupermaster = async (req, res) => {
        try {
            DB.user.find({}, 'Master master Admin admin superAdmin superadmin').then(result =>{
                return res.status(200).json({ status: 'Success', "data":result});
            });
        } catch (err) {
            return res.status(500).json({ success: false, message: 'Something went wrong', error: err }).end('');
        }
    }
    exports.getBettingBasedOnMaster = async (req, res) => {
        try {
            let master = req.query.master;
            let eventId = req.query.event_id;
            if(!master || !eventId){
                return  res.send({status:false, message:"Kindly check the data"});
            }
            DB.user.aggregate([
                {
                    $match: {"master": master}
                },
                {
                    $lookup: {
                        from: 'bettings',
                        localField: "_id",
                        foreignField: "userid",
                        as: "bettingData"
                    }
                },
                {
                    $project: {
                        userName:1,
                        Name:1,
                        bettingData: {
                            $filter: {
                                input: '$bettingData',
                                as: "dt",
                                cond: {
                                    $eq:["$$dt.eventID", parseInt(eventId)]
                                }
                            }
                        }
                    }
                }
            ]).then(result => {
                return res.status(200).json({ status: 'Success', "data":result});
            })
           
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Something went wrong', error: error }).end('');
        }

    }
    // Is suspend the fancy odds && is ball running fancy
    exports.suspendOrIsBallRunningFancyOdds = (req, res) =>{
        let marketId = req.body.marketId;
        let type = req.body.type;
        
        if(!marketId || !type){
            return  res.send({status:false, message:"Kindly check the data"});
        }
        DB.FancyOdds.find({marketId: marketId}).then((result)=>{
            result = result[0];
            if(type == 'suspend'){
                if(result.isBallRunning == true){
                    return  res.send({status:false, message:"Sorry! Bull is running"});
                }
                if (result.isSuspended == true) {

                    result.isSuspended = false
                    
                }
                else{
                    result.isSuspended = true;
                }
            } else if( type == 'runningBall') {
                if(result.isSuspended == true){
                    return  res.send({status:false, message:"Sorry! It is suspended"});
                }
                if (result.isBallRunning == true) {
                    result.isBallRunning = false
                }
                else{
                    result.isBallRunning = true;
                }
            }
            
            DB.FancyOdds.updateOne({marketId: marketId}, { $set : result}).then((saved)=>{
                if(saved){
                    return res.send({data: result})
    
                }
           })
    
        })
    }

    exports.allsuspendAndIsballrunning = (req, res) => {
        let eventId = req.body.eventId;
        let type = req.body.type;
        let value = req.body.value;
        if(!eventId || !type) {
            return  res.status(400).json({status: false, message: "Kindly check the body parameters"});
        }
        let filter = '';
        let updates = '';
        if(type == 'suspend'){
            filter = {eventId: eventId, isBallRunning: false};
            updates = { $set: { "isSuspended" : value } };
        } else if( type == 'runningBall') {
            filter = {eventId: eventId, isSuspended: false};
            updates = { $set: { "isBallRunning" : value } };
        }
        DB.FancyOdds.updateMany(filter,updates).then((result)=>{   
            return res.status(200).json({status: true, message: "Data has been updated successfully"});
        });
    }
    
    