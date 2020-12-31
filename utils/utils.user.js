
var Users = require('../dao/user.dao');
var DB = require('../models/user.model');

/**
 * @author: Sopra Steria
 * @description:this method return all users list.
 * @param:NA
 * @return:return all users list array
 */
module.exports.getAllusers = () => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: false, superAdmin: false, Master: false, Admin: false }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// get all users for a specific master

module.exports.getAllMasterusers = async (masterName) => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: false, superAdmin: false, Master: false, Admin: false, master: masterName }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// masters closed users

module.exports.getAllMasterClosedusers = (masterName) => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: true, superAdmin: false, Master: false, Admin: false, master: masterName }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// get all masters for a specific admin

module.exports.getAllAdminMasters = (adminName) => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: false, superAdmin: false, Master: true, Admin: false, admin: adminName }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// get all blocked masters by supermaster

module.exports.getAllAdminClosedMasters = (adminName) => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: true, superAdmin: false, Master: true, Admin: false, admin: adminName }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}


//get all admins for a superadmins

module.exports.getAllSuperAdminAdmins = (superadminName) => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: false, superAdmin: false, Master: false, Admin: true, superadmin: superadminName }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// get all blocked admins

module.exports.getAllSuperAdminClosedAdmins = (superadminName) => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: true, superAdmin: false, Master: false, Admin: true, superadmin: superadminName }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

//get all Masters 
module.exports.getAllMasters = () => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: false, superAdmin: false, Master: true, Admin: false }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

//get all Admins

module.exports.getAllAdmins = () => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: false, superAdmin: false, Master: false, Admin: true }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}
//get all closed user list

module.exports.getBlockusersList = () => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: true, superAdmin: false, Master: false, Admin: false }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// get all closed master list

module.exports.getBlockmastersList = () => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: true, superAdmin: false, Master: true, Admin: false }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// get all admin list

module.exports.getBlockadminsList = () => {
    return new Promise((resolve, reject) => {
        Users.get({ blocked: true, superAdmin: false, Master: true, Admin: true }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}





/**
 * @author: Sopra Steria
 * @description:create user details as per ID .
 * @param:id is int value
 * @return:return user object based on id 
 */
module.exports.getUserdetailsById = (id) => {
    return new Promise((resolve, reject) => {
        Users.getByID({ _id: id }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

/**
 * @author: Sopra Steria
 * @description:create user details as per Email ID .
 * @param:emailId is String value
 * @return:return user object based on EmailId 
 */
module.exports.getUserDetailsByEmail = (username) => {
    return new Promise((resolve, reject) => {
        Users.getByID({ userName: username }, function (err, users) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(users);
            }
        })

    });
}

// user profit and loss calculated

module.exports.uniqueEventsID = (userName,D1,D2) => {

   
    return new Promise((resolve, reject) => {
        DB.betting.find({ clientName: userName, status: "settled" }).then((userProfitLoss) => {
            // console.log(D2)
            // console.log(D1)
            var filteruserProfitLoss =  userProfitLoss.filter((item)=> {
                let D3 = new Date(item.createdAt);
               
                if (D3.getTime() <= D2.getTime()  && D3.getTime() >= D1.getTime()){
                    return item
                }
                // filterItem=item
                
            })
            // console.log(filteruserProfitLoss)
            // const fobject1= {};
            

            const unique = [...new Set(filteruserProfitLoss.map(item => item.eventID))]
            resolve(unique);
        })
    })


}


module.exports.UserProfitLoss = async (userName, events) => {

    dataArray = [];
    // let profitevents =  new Promise((resolve,reject)=>{
    events.map((item, index) => {

        let data = findeventData(userName, item);
        dataArray.push(data);
        //resolve(dataArray.push(findeventData(userName,item)));  
    })


    // }).then(data=>{
    //     console.log(data)
    // });


    return dataArray
}
findeventData = async (userName, eventID) => {


    return await DB.betting.find({ clientName: userName, eventID: eventID, status: "settled" }).then(
        data => data


    )

}

module.exports.getMyprofile = async (userName) => {

    return new Promise((resolve, reject) => {
        DB.user.findOne({ userName: userName }).then((user) => {
            resolve(user);
        })
    })

}
    //

    // module.exports.getUserDetailsByEmail = (username)=>{
    //     return new Promise((resolve,reject)=>{
    //         Users.getByID({userName:username}, function(err, users) {
    //             if(err) {
    //                return reject(err);
    //             }
    //             else{
    //             return resolve(users);
    //             }
    //         })

    //     });
    //     }

    module.exports.calculateExposure = (bets, team1, team2) => {
        let loss = 0;
        let profit = 0;
        if(bets.length > 0){
            bets.map(bet => {
                if((bet.bettype === 'Back' && bet.selection === team1) || (bet.bettype === 'Lay' && bet.selection === team2)){
                    console.log('bet:',bet)
                    profit += parseFloat(bet.profit);
                    loss += parseFloat(bet.liability);
                }
            });
        }
        return {loss,profit};
    }