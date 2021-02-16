var Request = require("request");
var _ = require('lodash');
const rps = require('request-promise');


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
if (data == null) {
    return res.json({
        success: 0,
        data :"This user does not exist"
    });
}
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
    let query = {userName:body.userName};
    let updatedToken = {$set:{token:jsontoken}};
    DB.user.updateOne(query, updatedToken).then((result)=>{
        return res.json({
            success: 1,
            message :"login successfully",
            token: jsontoken,
            refreshToken: refreshToken,
            data:data
  
      });
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
       return res.send({status:false, message:"Technical Error"})

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

    Request.get({
        "headers": { "content-type": "application/json" },
        "url": "http://142.93.36.1/api/v1/fetch_data?Action=listEventTypes",
        "body": JSON.stringify({
            
                "filter" : {}
            
        })
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        //console.log(body)
        const bodyData = JSON.parse(body)
        return res.send({status:true, message:"live sports data", data:bodyData})
        
  });
    

}

//get live competitions by providing id, 1 for soccer 2 for tennis and 4 for cricket

exports.getLiveCompetitions = async (req,res) => {
    let EventTypeid= req.params
    if (EventTypeid){
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": "http://142.93.36.1/api/v1/fetch_data?Action=listCompetitions",
            "qs": {"EventTypeID": EventTypeid}
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
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 5)
    let EventTypeid= req.body.EventTypeid
    let competitionIds= req.body.competitionIds  
    
    if (competitionIds){
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": "http://142.93.36.1/api/v1/fetch_data?Action=listEvents",
            "qs": {"EventTypeID": EventTypeid, "CompetitionID": competitionIds}
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
        let data = await getEventID(EventTypeid);
         return res.send({status:true, message:"live sports events", data:data});
    }

}

//list market type and market odds

exports.listEventsDataById = async (req,res) =>{
    let eventIds= req.body.EventId
    Request.get({"headers": { "content-type": "application/json" },
    "url": "http://142.93.36.1/api/v1/fetch_data?Action=listMarketTypes",
    "qs": {"EventID": eventIds}
    },(error, response, body) => {
        if(error) {
            return console.log(error);
        }
        const marketData = JSON.parse(body);
        let marketIds = '';
        if(marketData[0].marketName == "Match Odds"){
            marketIds = marketData[0].marketId;
        } else if (marketData[1].marketName == "Match Odds") {
            marketIds = marketData[1].marketId;
        }
        
       
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": "http://142.93.36.1/api/v1/listMarketBookOdds",
            "qs": {"market_id": marketIds}
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
        Request.get({
            "headers": { "content-type": "application/json" },
            "url": "http://142.93.36.1/api/v1/listMarketBookOdds",
            "qs": {"market_id": marketIds}
        }, (error, response, body) => {
            if(error) {
                return console.log(error);
            }
            //console.log(body)
            const bodyData = JSON.parse(body)
            return res.send({status:true, message:"live market odd", data:bodyData})
        });
    }
}

// market types

exports.listMarketType = async (req,res) => {
    let eventIds= req.body.eventId
    Request.get({"headers": { "content-type": "application/json" },
    "url": "http://142.93.36.1/api/v1/fetch_data?Action=listMarketTypes",
    "qs": {"EventID": eventIds}
    }, (error, response, body) => {
        if(error) {
            return console.log(error);
        }
        const bodyData = JSON.parse(body)
       let data = bodyData.filter(e => e.marketName == "Match Odds")
        // var sortedObjs = _.sortBy(bodyData[0].result, 'marketId');
        // console.log(sortedObjs)
        return res.send({status:true, message:"live sports events", data: data})
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
  
    let data = await getEventID(4);
    data.map((item,index)=>{
        // console.log(item.event.id + item.event.name + item.event.openDate)
    var event = new DB.event({
        eventId:item.event.id,
        eventName: item.event.name,
        OpenDate:item.event.openDate

    })

    event.save();

    });
    res.send({status:true, message:"events stored successfully"})
    
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
        if(marketType[0] == undefined){
            return res.send({status:1,message:"market type and runners",data:[]})
           }
   
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
    // DB.event.findOne({eventId: req.body.eventId}).then(eventData => {
    //     updateScoreCard(eventData.eventName);
    // })    
    DB.FancyOdds.find({eventId: req.body.eventId}).then(FancyData => {
        let marketIds = []; 
        FancyData.map(e=> marketIds.push(e.marketId));
        let eventId = req.body.eventId;
        let options = {
            "headers": { "content-type": "application/json" },
            "url": "http://142.93.36.1/api/v1/listMarketBookSession",
            "qs": {"match_id": eventId},
            json: true
        }
        Request(options, function (error, response, body) {
            if (error) {
               return res.status(500).json({ success: false, error: error }).end('');
            } else {
                if(body.message == undefined){
                    body.map(e => {
                        let query = {$set: {LayPrice: e.LayPrice1, LaySize: e.LaySize1, BackPrice: e.BackPrice1, BackSize: e.BackSize1, status: e.GameStatus}};
                        let filter = {eventId: req.body.eventId, marketId: e.SelectionId};
                        DB.FancyOdds.updateOne(filter, query).then((result)=>{   
                            //console.log("successfully updated")
                        });
                        marketIds = marketIds.filter(d => {return d !=e.SelectionId});
                    });
                    let cond = {marketId: {$in: marketIds}, status: {$ne: "CLOSED"}};
                    let updateDs = {$set: {status: "CLOSED"}};
                    DB.FancyOdds.updateMany(cond, updateDs).then((result)=>{   
                        //console.log("successfully updated")
                    });
                }
           }
        });
    });
       
    await DB.FancyOdds.find({eventId:req.body.eventId, status: {$ne: "CLOSED"}}).then((marketType)=>{
    var datafancy = marketType.map(async(item)=>{
        let fobject= {};
        runnersData  = await DB.FancyRunner.find({marketId:item.marketId})
        fobject.marketData = item
        fobject.runners =runnersData;
        return fobject;
        
      });
      Promise.all(datafancy).then(FancyData=>{
        res.send({status:1, message:"fancy market type and runners",data:FancyData})
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
        for(let i = 0; i<events.length; i++){
            let eventIds= events[i].eventId;
            let options = {
                "headers": { "content-type": "application/json" },
                "url": "http://142.93.36.1/api/v1/fetch_data?Action=listMarketTypes",
                "qs": {"EventID": eventIds},
                json: true
            }
            rps(options).then(body => {
                let data = body.filter(e => e.marketName == "Match Odds");
                data.map((item,index)=>{
                    let matchOddsObj = {
                        eventId: eventIds,
                        marketId:item.marketId,
                        marketName: item.marketName,
                        marketStartTime:item.marketStartTime
                    }
                    let matchOdds = new DB.matchOdds(matchOddsObj);
                   matchOdds.save(function(err,result){ 
                    if (err){ 
                        console.log(err); 
                    } 
                    else{ 
                        console.log(result) 
                    } 
                    }) 

                   item.runners.map((item1,index)=>{
                    var matchRunner = new DB.matchRunner({
                        marketId:item.marketId,
                        selectionId: item1.selectionId,
                        runnerName:item1.runnerName
                    })
                    matchRunner.save(function(err,result){ 
                        if (err){ 
                            console.log(err); 
                        } 
                        else{ 
                            console.log(result) 
                        } 
                    }) 
                   })
                })

                

        }).catch(function (err) {
            console.log(err.message);

        });
        let option1 = {
            "headers": { "content-type": "application/json" },
            "url": "http://142.93.36.1/api/v1/listMarketBookSession",
            "qs": {"match_id": eventIds},
            json: true
        }
        rps(option1).then(body => {
            if(body.message == undefined){
                body.map((item,index)=>{
                    var FancyOdds = new DB.FancyOdds({
                        eventId: eventIds,
                        marketId:item.SelectionId,
                        marketName: item.RunnerName,
                        LayPrice: item.LayPrice1,
                        LaySize: item.LaySize1,
                        BackPrice: item.BackPrice1,
                        BackSize: item.BackSize1,
                        status: item.GameStatus
                    })
                    FancyOdds.save(function(err,result){ 
                        if (err){ 
                            console.log(err); 
                        } 
                        else{ 
                            console.log(result) 
                        } 
                    }) 
                    var FancyRunner = new DB.FancyRunner({
                          marketId:item.SelectionId,
                          selectionId: item.SelectionId,
                          runnerName:item.RunnerName,
                      })
                      FancyRunner.save(function(err,result){ 
                        if (err){ 
                            console.log(err); 
                        } 
                        else{ 
                            console.log(result) 
                        } 
                    }) 

                })
            }
        }).catch(function (err) {
            console.log(err.message)
        });
        
        if(i == events.length-1){
            res.send({status:true, message:"events stored successfully"})
        }
    }

    }).catch(function (err) {
        return err;

     });

}

exports.storeFancyOddsCron = (req, res) => {
    DB.event.find().then((events)=>{
        if(!events){
            return  res.send({status:false, message:"no events stored"})
        }
        for(let i = 0; i<events.length; i++){
            let eventIds= events[i].eventId;
            let options = {
                "headers": { "content-type": "application/json" },
                "url": "http://142.93.36.1/api/v1/listMarketBookSession",
                "qs": {"match_id": eventIds},
                json: true
            }
            
            rps(options).then(body => {
                if(body.message == undefined){
                    body.map((item,index)=>{
                        DB.FancyOdds.find({eventId: eventIds, marketId:item.SelectionId}, function(err, data){
                            if(err){
                                console.log(err);
                            }
                            if(data.length >0){
                                let cond = {eventId: eventIds,marketId:item.SelectionId};
                                let updateVal = {
                                    marketName: item.RunnerName,
                                    LayPrice: item.LayPrice1,
                                    LaySize: item.LaySize1,
                                    BackPrice: item.BackPrice1,
                                    BackSize: item.BackSize1,
                                    status: item.GameStatus
                                }
                                DB.FancyOdds.update(cond, updateVal);
                            } else{
                                var FancyOdds = new DB.FancyOdds({
                                    eventId: eventIds,
                                    marketId:item.SelectionId,
                                    marketName: item.RunnerName,
                                    LayPrice: item.LayPrice1,
                                    LaySize: item.LaySize1,
                                    BackPrice: item.BackPrice1,
                                    BackSize: item.BackSize1,
                                    status: item.GameStatus
                                })
                                FancyOdds.save(function(err,result){ 
                                    if (err){ 
                                        console.log(err); 
                                    } 
                                    else{ 
                                        console.log(result) 
                                    } 
                                }) 
                                var FancyRunner = new DB.FancyRunner({
                                      marketId:item.SelectionId,
                                      selectionId: item.SelectionId,
                                      runnerName:item.RunnerName,
                                  })
                                  FancyRunner.save(function(err,result){ 
                                    if (err){ 
                                        console.log(err); 
                                    } 
                                    else{ 
                                        console.log(result) 
                                    } 
                                }) 
                            }
                        });
                        
                    })
                }
            }).catch(function (err) {
                console.log(err.message)
            });

            if(i == events.length-1){
                res.send({status:true, message:"events stored successfully"})
            }
        }
    })
}



//get DBliveEvents
exports.getDbliveEvents = async (req,res)=>{
   await DB.event.find().then((events)=>{
        if(!events){
            return  res.send({status:false, message:"no events stored"})
        }
    res.json(events);
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
                    });
            }
        }).catch((error)=>{
            console.log("catch=========",error)
        })
    } catch (error) {
        console.log("try =========catch=========",error);
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

    exports.getBettingBasedOnSuperMaster = (req, res) => {
        let admin = req.query.superMaster;
        let eventId = req.query.event_id;
        if(!admin || !eventId) {
            return  res.send({status:false, message:"Kindly check the data"});
        }
        DB.user.find({admin:admin}).select('userName -_id').then(data =>{
            let d = [];
            data.map(e => d.push(e.userName));
            DB.user.aggregate([
                {
                    $match: {"master":{$in:d}}
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
                        master:1,
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

        })
        

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
    
    

async function getEventID(EventTypeID) {
    let compsData = await getCompitions(EventTypeID);
    let eventID = [];
    for(let i=0;i<compsData.length;i++){
        let compID = compsData[i].competition.id;
        let dts =await dataSet(EventTypeID, compID);
        eventID.push(...dts);
        if(i == compsData.length-1){
        return eventID;
        }
    }
}

async function getCompitions(EventTypeID){
        let options = {
            "headers": { "content-type": "application/json" },
            "url": "http://142.93.36.1/api/v1/fetch_data?Action=listCompetitions",
            "qs": {"EventTypeID": EventTypeID},
            json: true
        };
         return rps(options).then(body => {
           return body;
    });
}

async function dataSet(EventTypeID, compID){
    let options = {"headers": { "content-type": "application/json" },
    "url": "http://142.93.36.1/api/v1/fetch_data?Action=listEvents",
    "qs": {"EventTypeID": EventTypeID, "CompetitionID": compID},
    json:true
}
    return rps(options).then(body => {
        return body;

}).catch(function (err) {
   return err;
});
}
  
// function getAllMatch(matchName, callback){
//     var options = {
//         method: 'GET',
//         url: properties.rapid_api_All_match,
//         headers: {
//             'x-rapidapi-host': properties.rapidapi_host,
//             'x-rapidapi-key': properties.rapidapi_key,
//             useQueryString: properties.useQueryString
//         },
//         json:true
//     };
//     Request(options, function (error, response, body) {
//         if (error) {
//             console.log(error);
//         } else {
//             let d = ''
//             if (body != undefined) {
//                 body.matchList.matches.filter(e => {
//                     if(e.series.name.indexOf(matchName) != -1){
//                         let winningTeam = '';
//                         if(e.status == 'COMPLETED'){
//                             winningTeam = e.currentMatchState.split('win')[0]
//                         }
//                         d = {
//                             seriesid: e.series.id,
//                             matchid: e.id,
//                             status: e.status,
//                             winningTeam: winningTeam
//                         }
//                     }
//                 });
//             }
//             callback(d);
//         }
//     });
// }

// function getCricektScore (match_id, callback){
//     var options = {
//         method: 'GET',
//         url: properties.rapid_api_cricket_url,
//         qs: match_id,
//         headers: {
//             'x-rapidapi-host': properties.rapidapi_host,
//             'x-rapidapi-key': properties.rapidapi_key,
//             useQueryString: properties.useQueryString
//         },
//         json: true
//     };

//     Request(options, function (error, response, body) {
//         if (error) {
//             console.log(error);
//         } else {
//             if(body.fullScorecard!= undefined){
//                 //console.log(body)
//                 callback(body.fullScorecard.innings[0]);
//             }
//             else
//             callback(undefined)
//         }


//     }); 
// }
  
  
// getAllMatch('India v England', function(data) {
//     getCricektScore(data, score =>{
//         if(score != undefined){
//             let overSplit = score.over.split('.');
//             if(overSplit[1] == 0){
//                 var Scorequery = {matchName: 'India v England'};
//                 let Scoreupdate = {$set: {matchName: 'India v England',winner:data.winningTeam, status:data.status, runningTeam: score.name, runs: score.run, overs: score.over, wickets: score.wicket}};
//                 let options = { upsert: true, new: true, setDefaultsOnInsert: true };
//                 DB.scoreCard.findOne(Scorequery, function(error, resultSet){
//                     if(resultSet != null){
//                         let overWicket = score.wicket - resultSet.wickets;
//                         let overRun = score.run - resultSet.runs;
//                         Scoreupdate = {$set: {matchName: 'India v England',winner:data.winningTeam,overWicket:overWicket, overRun:overRun, status:data.status, runningTeam: score.name, runs: score.run, overs: score.over, wickets: score.wicket}};
//                     }
//                     DB.scoreCard.update(Scorequery, Scoreupdate, options, function(error, result) {
//                         if (error)
//                         console.log(error);
//                     });
//                     score.batsmen.map(e => {
//                         let batsmenQuery = {matchName:'India v England', "batsmen.id": { "$eq": e.id }},
//                         isOut = 'not out';
//                         if (e.howOut != 'not out' && e.howOut != '') {
//                             isOut = 'out' ;
//                         }
//                         let batsmenInsertQuery = {matchName:'India v England'};
//                         let batsmeninset = {$push:{"batsmen":{id: e.id, name: e.name, run: e.runs, four: e.fours, six: e.sixes, isOut: isOut, fallOfWicket: e.fallOfWicket}}};
//                         DB.scoreCard.findOne(batsmenQuery).then(batsmn => {
//                             if (batsmn!= null){
//                                 batsmn.batsmen.map(d => {
//                                     let batmsnQuery = {matchName:'India v England', "batsmen.id": { "$eq": e.id }};
//                                     let batsmenUpdate = {$set:{"batsmen.$.name": e.name, "batsmen.$.run": e.runs, "batsmen.$.four": e.fours, "batsmen.$.six": e.sixes, "batsmen.$.isOut": isOut, "batsmen.$.fallOfWicket": e.fallOfWicket}};
//                                     DB.scoreCard.updateOne(batmsnQuery, batsmenUpdate, function(error, result) {
//                                         if (error){
//                                             console.log(error)
//                                         };
//                                     });
//                                     if(d.fallOfWicket != null){
//                                         let fwr = d.fallOfWicket.split("-");
//                                         let UpdatedVal = {$push:{fallOfWicket:[{wicket: fwr[0], run:fwr[1]}]}};
//                                     if (batsmn.fallOfWicket.length <= 0) {
//                                         DB.scoreCard.update(batsmenInsertQuery, UpdatedVal, function(error, result) {
//                                             if (error)
//                                             console.log(error);
//                                         });
//                                     } else {
//                                         let queryOffwt = {matchName:'India v England', "fallOfWicket.wicket": { "$ne": fwr[0] }};
//                                         DB.scoreCard.update(queryOffwt, UpdatedVal, function(error, result) {
//                                             if (error)
//                                             console.log(error);
//                                         });

//                                     }
//                                 }
//                                 })

//                             } else {
//                                 if(e.howOut != 'not out' && e.howOut != ''){
//                                     let fwr = e.fallOfWicket.split("-");
//                                     let UpdatedVal = {$push:{fallOfWicket:[{wicket: fwr[0], run:fwr[1]}]}};
//                                     DB.scoreCard.update(batsmenInsertQuery, UpdatedVal, function(error, result) {
//                                         if (error)
//                                         console.log(error);
//                                     });
//                                 }
//                                 DB.scoreCard.update(batsmenInsertQuery, batsmeninset, function(error, result) {
//                                     if (error){
//                                         console.log(error)
//                                     };
//                                 });
//                             }
//                         })
                    
//                     });
//                     score.bowlers.map(e => {
//                         let bowlersQuery = {matchName:'India v England', "bowlers.id": { "$eq": e.id }},
//                         bowlersInsertQuery = {matchName:'India v England'},
//                         bowlersInsert = {$push:{"bowlers":[{id: e.id, name: e.name, wickets: e.wickets}]}};
//                         DB.scoreCard.findOne(bowlersQuery).then(bowlersData => {
//                             if (bowlersData!= null){
//                                 bowlersData.bowlers.map(d => {
//                                     let bowlQuery = {matchName:'India v England', "bowlers.id": { "$eq": e.id }},
//                                     bowlersUpdateData = {$set:{"bowlers.$.name": e.name, "bowlers.$.wickets": e.wickets}};
//                                     DB.scoreCard.update(bowlQuery, bowlersUpdateData, function(error, result) {
//                                         if (error){
//                                             console.log(error)
//                                         };
//                                     });
//                                 })

//                             } else {
//                                 DB.scoreCard.update(bowlersInsertQuery, bowlersInsert, function(error, result) {
//                                     if (error){
//                                         console.log(error)
//                                     };
//                                 });
//                             }
//                         })
//                     });
//                 });
//             }
//         }
        
//     })
// });
//DB.scoreCard.findOne({eventId: 0,'batsmen.name':{'$eq':'Rohit Sharma'}}).then(eventData => {console.log(eventData) })
// function updateScoreCard (eventName){
//     getAllMatch(eventName, function(data) {
//         getCricektScore(data, score =>{
//             if(score != undefined){
//                 let overSplit = score.over.split('.');
//                 if(overSplit[1] == 0){
//                     var Scorequery = {matchName: eventName};
//                     let Scoreupdate = {$set: {matchName: eventName,winner:data.winningTeam, status:data.status, runningTeam: score.name, runs: score.run, overs: score.over, wickets: score.wicket}};
//                     let options = { upsert: true, new: true, setDefaultsOnInsert: true };
//                     DB.scoreCard.findOne(Scorequery, function(error, resultSet){
//                         if(resultSet != null){
//                             let overWicket = score.wicket - resultSet.wickets;
//                             let overRun = score.run - resultSet.runs;
//                             Scoreupdate = {$set: {matchName: eventName,winner:data.winningTeam,overWicket:overWicket, overRun:overRun, status:data.status, runningTeam: score.name, runs: score.run, overs: score.over, wickets: score.wicket}};
//                         }
//                         DB.scoreCard.update(Scorequery, Scoreupdate, options, function(error, result) {
//                             if (error)
//                             console.log(error);
//                         });
//                         score.batsmen.map(e => {
//                             let batsmenQuery = {matchName:eventName, "batsmen.id": { "$eq": e.id }},
//                             isOut = 'not out';
//                             if (e.howOut != 'not out' && e.howOut != '') {
//                                 isOut = 'out' ;
//                             }
//                             let batsmenInsertQuery = {matchName:eventName};
//                             let batsmeninset = {$push:{"batsmen":{id: e.id, name: e.name, run: e.runs, four: e.fours, six: e.sixes, isOut: isOut, fallOfWicket: e.fallOfWicket}}};
//                             DB.scoreCard.findOne(batsmenQuery).then(batsmn => {
//                                 if (batsmn!= null){
//                                     batsmn.batsmen.map(d => {
//                                         let batmsnQuery = {matchName:eventName, "batsmen.id": { "$eq": e.id }};
//                                         let batsmenUpdate = {$set:{"batsmen.$.name": e.name, "batsmen.$.run": e.runs, "batsmen.$.four": e.fours, "batsmen.$.six": e.sixes, "batsmen.$.isOut": isOut, "batsmen.$.fallOfWicket": e.fallOfWicket}};
//                                         DB.scoreCard.updateOne(batmsnQuery, batsmenUpdate, function(error, result) {
//                                             if (error){
//                                                 console.log(error)
//                                             };
//                                         });
//                                         if(d.fallOfWicket != null){
//                                             let fwr = d.fallOfWicket.split("-");
//                                             let UpdatedVal = {$push:{fallOfWicket:[{wicket: fwr[0], run:fwr[1]}]}};
//                                         if (batsmn.fallOfWicket.length <= 0) {
//                                             DB.scoreCard.update(batsmenInsertQuery, UpdatedVal, function(error, result) {
//                                                 if (error)
//                                                 console.log(error);
//                                             });
//                                         } else {
//                                             let queryOffwt = {matchName:eventName, "fallOfWicket.wicket": { "$ne": fwr[0] }};
//                                             DB.scoreCard.update(queryOffwt, UpdatedVal, function(error, result) {
//                                                 if (error)
//                                                 console.log(error);
//                                             });
    
//                                         }
//                                     }
//                                     })
    
//                                 } else {
//                                     if(e.howOut != 'not out' && e.howOut != ''){
//                                         let fwr = e.fallOfWicket.split("-");
//                                         let UpdatedVal = {$push:{fallOfWicket:[{wicket: fwr[0], run:fwr[1]}]}};
//                                         DB.scoreCard.update(batsmenInsertQuery, UpdatedVal, function(error, result) {
//                                             if (error)
//                                             console.log(error);
//                                         });
//                                     }
//                                     DB.scoreCard.update(batsmenInsertQuery, batsmeninset, function(error, result) {
//                                         if (error){
//                                             console.log(error)
//                                         };
//                                     });
//                                 }
//                             })
                        
//                         });
//                         score.bowlers.map(e => {
//                             let bowlersQuery = {matchName:eventName, "bowlers.id": { "$eq": e.id }},
//                             bowlersInsertQuery = {matchName:eventName},
//                             bowlersInsert = {$push:{"bowlers":[{id: e.id, name: e.name, wickets: e.wickets}]}};
//                             DB.scoreCard.findOne(bowlersQuery).then(bowlersData => {
//                                 if (bowlersData!= null){
//                                     bowlersData.bowlers.map(d => {
//                                         let bowlQuery = {matchName:eventName, "bowlers.id": { "$eq": e.id }},
//                                         bowlersUpdateData = {$set:{"bowlers.$.name": e.name, "bowlers.$.wickets": e.wickets}};
//                                         DB.scoreCard.update(bowlQuery, bowlersUpdateData, function(error, result) {
//                                             if (error){
//                                                 console.log(error)
//                                             };
//                                         });
//                                     })
    
//                                 } else {
//                                     DB.scoreCard.update(bowlersInsertQuery, bowlersInsert, function(error, result) {
//                                         if (error){
//                                             console.log(error)
//                                         };
//                                     });
//                                 }
//                             })
//                         });
//                     });
//                 }
//             }
            
//         })
//     });
// }

exports.getBettedFancyOdds = async (req, res) => {
    try {
        let eventId = req.query.eventId;
        let type = req.query.type;
        if(!eventId || !type){
            return res.send({status: false, message: 'Kindly provide the valid eventId'});
        }
        DB.betting.distinct('marketID',{eventID: eventId, settled: {"$ne":'settled'}, marketType:{"$eq":type}}).then(data => {
            DB.FancyOdds.find({marketId: {"$in":data},"status": "CLOSED"}).then(fancyData => {
                return res.send({status: 200, message:'Fancy list has been fatched in data', data: fancyData});
            })
        })
    } catch (error) {
        return res.send({status:false, message:"Technical Error"});
    }
}

exports.getuserbasedOnAdmin = async (req, res) => {
    try {
        let adminUserName = req.query.userName;
        if(!adminUserName) {
            return res.send({status: false, message: 'Kindly provide the name'});
        }
        DB.user.distinct('userName',{admin: adminUserName}).then(data => {
            DB.user.find({master: {'$in': data}}).then (userData =>{
                return res.send({status: 200, message:'Fancy list has been fatched in data', data: userData});
            });
        });
    } catch (error) {
        return res.send({status:false, message:"Technical Error"});
    }
    
}

exports.dumpNonBettingFancy = async (req, res) => {
    try {
        DB.betting.distinct('selectionID', {marketType: {'$eq': 'Fancy'}}).then(data => {
            DB.FancyOdds.distinct('marketId',{marketId: {'$nin': data}}).then(userData => {
                DB.FancyOdds.deleteMany({marketId: {'$in': userData}, status: 'CLOSED'}).then(result => {
                    return res.send({status: 200});
                })
            })
        })
    } catch (error) {
        return res.send({status:false, message:"Technical Error"});
    }
    
}
exports.getUserInfo = async (req, res) => {
    try {
        let userName = req.query.userName;
        DB.user.findOne({userName: userName}, {walletBalance:1, exposure: 1, userName: 1}).then(user =>{
            if(user != null){
                return res.send({status: 200, message:'Fancy list has been fatched in data', data: user});
            }
            else{
                return res.send({status: 200, message:'Fancy list has been fatched in data', data: []});
            }
        })
    } catch (error) {
        return res.send({status:false, message:"Technical Error"});
    }
}