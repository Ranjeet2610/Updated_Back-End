var properties = require('../config/config');


const Utils = require('../utils/utils.user');
var Users = require('../dao/user.dao');
var DB = require('../models/user.model');

var Request = require("request");
const { Db } = require('mongodb');


//credit account of user

exports.creditAmountByMaster = (req, res) => {
    try {

        DB.user.findOneAndUpdate({ _id: req.body.userid }, { $inc: { walletBalance: req.body.fillAmount, freeChips: req.body.fillAmount } }, { new: true, upsert: true }).then((userUpdated) => {
            if (userUpdated) {
                DB.user.findOneAndUpdate({ userName: userUpdated.master }, { $inc: { walletBalance: -req.body.fillAmount, freeChips: -req.body.fillAmount } }, { new: true, upsert: true }).then((masterUpdated) => {
                    if (masterUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var deposit = new DB.deposit({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    depositedBy: masterUpdated,
                                    depositedByName: masterUpdated.userName,
                                    amount: req.body.fillAmount,
                                    balance: userUpdated.walletBalance

                                })

                                deposit.save()
                                userAccount.depositTransaction.push(deposit)
                                userAccount.walletBalance = parseInt(userAccount.walletBalance) + parseInt(req.body.fillAmount)
                                userAccount.amountDepositedByMaster = parseInt(userAccount.amountDepositedByMaster) + parseInt(req.body.fillAmount)
                                userAccount.lastDepositDate = new Date()
                                userAccount.save().then((usersaved) => {
                                    if (usersaved) {
                                        DB.account.findOne({ userName: userUpdated.master }).then((masterAccount) => {
                                            var withdraw = new DB.withdraw({
                                                userName: masterUpdated.userName,
                                                accountHolderName: masterUpdated,
                                                withdrawIn: userUpdated,
                                                withdrawInName: userUpdated.userName,
                                                amount: req.body.fillAmount,
                                                balance: masterUpdated.walletBalance


                                            })

                                            withdraw.save()
                                            masterAccount.withdrawTransaction.push(withdraw)
                                            masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) - parseInt(req.body.fillAmount)
                                            masterUpdated.creditGiven = parseInt(masterUpdated.creditGiven) + parseInt(req.body.fillAmount)
                                            userAccount.lastWithdrawDate = new Date()
                                            masterUpdated.save()
                                            masterAccount.save().then((mastersaved) => {
                                                if (mastersaved) {
                                                    return res.send({ status: true, message: "Wallet Updated" })

                                                }
                                            })

                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        return res.send({ status: false, message: "Technical Error11" })

                    }
                })

            } else {
                return res.send({ status: false, message: "Technical Error" })

            }
        })
    } catch (error) {

    }
}

// amount deposited by admin

exports.creditAmountByAdmin = (req, res) => {
    try {

        DB.user.findOneAndUpdate({ _id: req.body.userid }, { $inc: { walletBalance: req.body.fillAmount, freeChips: req.body.fillAmount } }, { new: true, upsert: true }).then((userUpdated) => {
            if (userUpdated) {
                DB.user.findOneAndUpdate({ userName: userUpdated.admin }, { $inc: { walletBalance: -req.body.fillAmount, freeChips: -req.body.fillAmount } }, { new: true, upsert: true }).then((adminUpdated) => {
                    if (adminUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var deposit = new DB.deposit({
                                    userName: userUpdated.userName,
                                    depositedBy: adminUpdated,
                                    depositedByName: adminUpdated.userName,
                                    accountHolderName: userUpdated,
                                    amount: req.body.fillAmount,
                                    balance: userUpdated.walletBalance


                                })
                                deposit.save()
                                userAccount.depositTransaction.push(deposit)
                                userAccount.walletBalance = parseInt(userAccount.walletBalance) + parseInt(req.body.fillAmount)
                                userAccount.amountDepositedByMaster = parseInt(userAccount.amountDepositedByMaster) + parseInt(req.body.fillAmount)
                                userAccount.lastDepositDate = new Date()
                                userAccount.save().then((usersaved) => {
                                    if (usersaved) {
                                        DB.account.findOne({ userName: userUpdated.admin }).then((adminAccount) => {
                                            var withdraw = new DB.withdraw({
                                                userName: adminUpdated.userName,
                                                accountHolderName: adminUpdated,
                                                withdrawIn: userUpdated,
                                                withdrawInName: userUpdated.userName,
                                                amount: req.body.fillAmount,
                                                balance: adminUpdated.walletBalance


                                            })

                                            withdraw.save()
                                            adminAccount.withdrawTransaction.push(withdraw)
                                            adminAccount.lastWithdrawDate = new Date()
                                            adminAccount.walletBalance = parseInt(adminUpdated.walletBalance) - parseInt(req.body.fillAmount)
                                            adminUpdated.creditGiven = parseInt(adminUpdated.creditGiven) + parseInt(req.body.fillAmount)
                                            adminUpdated.save()
                                            adminAccount.save().then((adminsaved) => {
                                                if (adminsaved) {
                                                    return res.send({ status: true, message: "Wallet Updated" })

                                                }
                                            })

                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        return res.send({ status: false, message: "Technical Error1" })

                    }
                })

            } else {
                return res.send({ status: false, message: "Technical Error2" })

            }
        })
    } catch (error) {

    }
}

// amount deposited by superadmin

exports.creditAmountBySuperAdmin = (req, res) => {
    try {

        DB.user.findOneAndUpdate({ _id: req.body.userid }, { $inc: { walletBalance: req.body.fillAmount, freeChips: req.body.fillAmount } }, { new: true, upsert: true }).then((userUpdated) => {
            if (userUpdated) {
                DB.user.findOneAndUpdate({ userName: userUpdated.superadmin }, { $inc: { walletBalance: -req.body.fillAmount, freeChips: -req.body.fillAmount } }, { new: true, upsert: true }).then((superadminUpdated) => {
                    if (superadminUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var deposit = new DB.deposit({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    depositedBy: superadminUpdated,
                                    depositedByName: superadminUpdated.userName,
                                    amount: req.body.fillAmount,
                                    balance: userUpdated.walletBalance

                                })
                                deposit.save()
                                userAccount.depositTransaction.push(deposit)
                                userAccount.walletBalance = parseInt(userAccount.walletBalance) + parseInt(req.body.fillAmount)
                                userAccount.amountDepositedByMaster = parseInt(userAccount.amountDepositedByMaster) + parseInt(req.body.fillAmount)
                                userAccount.lastDepositDate = new Date()
                                userAccount.save().then((usersaved) => {
                                    if (usersaved) {
                                        DB.account.findOne({ userName: userUpdated.superadmin }).then((superadminAccount) => {
                                            var withdraw = new DB.withdraw({
                                                userName: superadminUpdated.userName,
                                                accountHolderName: superadminUpdated,
                                                withdrawIn: userUpdated,
                                                withdrawInName: userUpdated.userName,
                                                amount: req.body.fillAmount,
                                                balance: superadminUpdated.walletBalance


                                            })

                                            withdraw.save()
                                            superadminAccount.withdrawTransaction.push(withdraw)
                                            superadminAccount.lastWithdrawDate = new Date()
                                            superadminUpdated.creditGiven = parseInt(superadminUpdated.creditGiven) + parseInt(req.body.fillAmount)
                                            superadminAccount.walletBalance = parseInt(superadminUpdated.walletBalance) - parseInt(req.body.fillAmount)
                                            superadminUpdated.save()
                                            superadminAccount.save().then((superadminsaved) => {
                                                if (superadminsaved) {
                                                    return res.send({ status: true, message: "Wallet Updated" })

                                                }
                                            })

                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        return res.send({ status: false, message: "Technical Error1" })

                    }
                })

            } else {
                return res.send({ status: false, message: "Technical Error2" })

            }
        })
    } catch (error) {

    }
}

// get all the deposit statements

exports.getAllDeposit = async (req, res) => {
    try {
        var deposit = await DB.deposit.find()
        //    console.log(deposit)
        if (deposit) {
            return res.send({ status: true, message: "", data: deposit })

        } else {
            return res.send({ status: false, message: "", })

        }
    } catch (error) {

    }
}

// withdraw amount by master

exports.debitAmountByMaster = (req, res) => {
    try {
        DB.user.findOneAndUpdate({ _id: req.body.userid }, { $inc: { walletBalance: -req.body.fillAmount, freeChips: -req.body.fillAmount } }, { new: true, upsert: true }).then((userUpdated) => {
            if (userUpdated) {
                DB.user.findOneAndUpdate({ userName: userUpdated.master }, { $inc: { walletBalance: req.body.fillAmount, freeChips: req.body.fillAmount } }, { new: true, upsert: true }).then((masterUpdated) => {
                    if (masterUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var withdraw = new DB.withdraw({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    withdrawIn: masterUpdated,
                                    withdrawInName: masterUpdated.userName,
                                    amount: req.body.fillAmount,
                                    balance: userUpdated.walletBalance


                                })

                                withdraw.save()
                                userAccount.withdrawTransaction.push(withdraw)
                                userAccount.walletBalance = parseInt(userAccount.walletBalance) - parseInt(req.body.fillAmount)
                                userAccount.amountwithdraw = parseInt(userAccount.amountwithdraw) + parseInt(req.body.fillAmount)
                                userAccount.lastWithdrawDate = new Date()
                                userAccount.save().then((usersaved) => {
                                    if (usersaved) {
                                        DB.account.findOne({ userName: userUpdated.master }).then((masterAccount) => {
                                            var deposit = new DB.deposit({
                                                userName: masterUpdated.userName,
                                                accountHolderName: masterUpdated,
                                                depositedBy: userUpdated,
                                                depositedByName: userUpdated.userName,
                                                amount: req.body.fillAmount,
                                                balance: masterUpdated.walletBalance


                                            })
                                            deposit.save()
                                            masterAccount.lastDepositDate = new Date()
                                            masterAccount.depositTransaction.push(deposit)
                                            masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) + parseInt(req.body.fillAmount)
                                            masterUpdated.creditGiven = parseInt(masterUpdated.creditGiven) + parseInt(req.body.fillAmount)
                                            masterUpdated.save()
                                            masterAccount.save().then((mastersaved) => {
                                                if (mastersaved) {
                                                    return res.send({ status: true, message: "Wallet Updated" })

                                                }
                                            })

                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        return res.send({ status: false, message: "Technical Error" })

                    }
                })

            } else {
                return res.send({ status: false, message: "Technical Error" })

            }
        })
    } catch (error) {

    }
}

// withdraw amount by admin

exports.debitAmountByAdmin = (req, res) => {
    try {
        DB.user.findOneAndUpdate({ _id: req.body.userid }, { $inc: { walletBalance: -req.body.fillAmount, freeChips: -req.body.fillAmount } }, { new: true, upsert: true }).then((userUpdated) => {
            if (userUpdated) {
                DB.user.findOneAndUpdate({ userName: userUpdated.admin }, { $inc: { walletBalance: req.body.fillAmount, freeChips: req.body.fillAmount } }, { new: true, upsert: true }).then((adminUpdated) => {
                    if (adminUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var withdraw = new DB.withdraw({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    withdrawIn: adminUpdated,
                                    withdrawInName: adminUpdated.userName,
                                    amount: req.body.fillAmount,
                                    balance: userUpdated.walletBalance


                                })

                                withdraw.save()

                                userAccount.withdrawTransaction.push(withdraw)
                                userAccount.walletBalance = parseInt(userAccount.walletBalance) - parseInt(req.body.fillAmount)
                                userAccount.amountwithdraw = parseInt(userAccount.amountwithdraw) + parseInt(req.body.fillAmount)
                                userAccount.lastWithdrawDate = new Date()
                                userAccount.save().then((usersaved) => {
                                    if (usersaved) {
                                        DB.account.findOne({ userName: userUpdated.admin }).then((adminAccount) => {
                                            var deposit = new DB.deposit({
                                                userName: adminUpdated.userName,
                                                accountHolderName: adminUpdated,
                                                depositedBy: userUpdated,
                                                depositedByName: userUpdated.userName,
                                                amount: req.body.fillAmount,
                                                balance: adminUpdated.walletBalance


                                            })
                                            deposit.save()
                                            adminAccount.lastDepositDate = new Date()
                                            adminAccount.depositTransaction.push(deposit)
                                            adminAccount.walletBalance = parseInt(adminUpdated.walletBalance) + parseInt(req.body.fillAmount)
                                            adminUpdated.creditGiven = parseInt(adminUpdated.creditGiven) + parseInt(req.body.fillAmount)
                                            adminUpdated.save()
                                            adminAccount.save().then((adminsaved) => {
                                                if (adminsaved) {
                                                    return res.send({ status: true, message: "Wallet Updated" })

                                                }
                                            })

                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        return res.send({ status: false, message: "Technical Error11" })

                    }
                })

            } else {
                return res.send({ status: false, message: "Technical Error" })

            }
        })
    } catch (error) {

    }
}

// withdraw amount by superadmin

exports.debitAmountBySuperAdmin = (req, res) => {
    try {
        DB.user.findOneAndUpdate({ _id: req.body.userid }, { $inc: { walletBalance: -req.body.fillAmount, freeChips: -req.body.fillAmount } }, { new: true, upsert: true }).then((userUpdated) => {
            if (userUpdated) {
                DB.user.findOneAndUpdate({ userName: userUpdated.superadmin }, { $inc: { walletBalance: req.body.fillAmount, freeChips: req.body.fillAmount } }, { new: true, upsert: true }).then((superadminUpdated) => {
                    if (superadminUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var withdraw = new DB.withdraw({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    withdrawIn: superadminUpdated,
                                    withdrawInName: superadminUpdated.userName,
                                    amount: req.body.fillAmount,
                                    balance: userUpdated.walletBalance

                                })

                                withdraw.save()
                                userAccount.withdrawTransaction.push(withdraw)
                                userAccount.walletBalance = parseInt(userAccount.walletBalance) - parseInt(req.body.fillAmount)
                                userAccount.amountwithdraw = parseInt(userAccount.amountwithdraw) + parseInt(req.body.fillAmount)
                                userAccount.lastWithdrawDate = new Date()
                                userAccount.save().then((usersaved) => {
                                    if (usersaved) {
                                        DB.account.findOne({ userName: userUpdated.superadmin }).then((superadminAccount) => {
                                            var deposit = new DB.deposit({
                                                userName: superadminUpdated.userName,
                                                accountHolderName: superadminUpdated,
                                                depositedBy: userUpdated,
                                                depositedByName: userUpdated.userName,
                                                amount: req.body.fillAmount,
                                                balance: superadminUpdated.walletBalance


                                            })
                                            deposit.save()
                                            superadminAccount.depositTransaction.push(deposit)
                                            superadminAccount.lastwithdrawDate = new Date()
                                            superadminAccount.walletBalance = parseInt(superadminUpdated.walletBalance) + parseInt(req.body.fillAmount)
                                            superadminUpdated.creditGiven = parseInt(superadminUpdated.creditGiven) - parseInt(req.body.fillAmount)
                                            superadminUpdated.save()
                                            superadminAccount.save().then((superadminsaved) => {
                                                if (superadminsaved) {
                                                    return res.send({ status: true, message: "Wallet Updated" })

                                                }
                                            })

                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        return res.send({ status: false, message: "Technical Error11" })

                    }
                })

            } else {
                return res.send({ status: false, message: "Technical Error" })

            }
        })
    } catch (error) {

    }
}

// get all withdraw statements

exports.getAllWithdraw = async (req, res) => {
    try {
        var withdraw = await DB.withdraw.find()
        //    console.log(withdraw)
        if (withdraw) {
            return res.send({ status: true, message: "", data: withdraw })

        } else {
            return res.send({ status: false, message: "", })

        }
    } catch (error) {

    }
}

// get all account statements

exports.getAllAccountStament = async (req, res) => {
    var statements = await DB.account.find()
        .populate()
        .exec(function (err, usersDocuments) {
            return res.send({ status: true, message: "", data: usersDocuments })
        });



}
// account statements for a particular user

exports.getAccountStament = async (req, res) => {
    // User.find()
    // .populate('comments posts') // multiple path names in one requires mongoose >= 3.6
    // .exec(function(err, usersDocuments) {
    //     // handle err
    //     // usersDocuments formatted as desired
    // });
    var statements = await DB.account.findOne({ userName: req.body.userName })
        .populate('depositTransaction withdrawTransaction') // multiple path names in one requires mongoose >= 3.6
        .exec(function (err, usersDocuments) {
            return res.send({ status: true, message: "", data: usersDocuments })
        });

}


//place bet

exports.placeBet = (req, res) => {
    if (req.body.description) {
        // DB.betting.deleteMany({clientName:req.body.userName}).then((data) => {
        //     console.log(data);
        // });
        // DB.user.findOne({userName:req.body.userName}).then((user) => {
        //     console.log('user:',user);
        //     user.exposure = 0;
        //     user.walletBalance = 7200;
        //     user.save().then((updatedUser) => {
        //         console.log('updatedUser:',updatedUser);
        //     })
        // })
        let team1 = JSON.parse(req.body.description).name.split(' v ')[0];
        let team2 = JSON.parse(req.body.description).name.split(' v ')[1];

        DB.user.findOne({userName:req.body.userName}).then((user) => {
            if(user){
                let ProfitLoss = 0;
                if(req.body.bettype === 'Back'){
                    ProfitLoss = req.body.profit;
                }else{
                    ProfitLoss = req.body.loss;
                }
                // console.log(user.exposure);
                DB.betting.find({clientName:req.body.userName, eventID: req.body.eventID}).then((bets) => {
                    let exp1 = Utils.calculateExposure(bets, team1, team2, '');
                    let exp2 = Utils.calculateExposure(bets, team2, team1, '');
                    let exp3 = Utils.calculateExposure(bets, team1, team2, 'The Draw');
                    if(exp3.loss !== null && exp3.profit !== null){
                        let exposures = [exp1.loss-exp2.profit+exp3.loss, exp1.loss-exp3.profit+exp2.loss, 
                            exp2.loss-exp1.profit+exp3.loss, exp2.loss-exp3.profit+exp1.loss,
                            exp3.loss-exp1.profit+exp2.loss, exp3.loss-exp2.profit+exp1.loss];
                        user.exposure = parseFloat(user.exposure) - parseFloat(Utils.findTheGreatest([exposures]));
                    }else{
                        if(exp1.loss - exp2.profit >= exp2.loss - exp1.profit){
                            user.exposure = parseFloat(user.exposure) - parseFloat(exp1.loss - exp2.profit);
                        }else{
                            user.exposure = parseFloat(user.exposure) - parseFloat(exp2.loss - exp1.profit);
                        }
                    }
                    // console.log('1:exp1:',exp1.loss-exp2.profit,' exp2:',exp2.loss-exp1.profit, ' user.exposure:', user.exposure);
                    var betting = new DB.betting ({
                        clientName: req.body.userName,
                        userid: user,
                        IP:req.body.IP,
                        device:req.body.device,
                        marketType:req.body.marketType,     
                        description:req.body.description,
                        selection: req.body.selection,
                        selectionID:req.body.selectionID,
                        eventID:req.body.eventID,
                        marketID:req.body.marketID,
                        odds:req.body.odds,
                        stack:req.body.stack,
                        status:req.body.status,
                        bettype:req.body.bettype,
                        P_L:ProfitLoss,
                        profit:req.body.profit,
                        liability:req.body.loss
                    })
                    // console.log(betting)
                    betting.save().then((saved)=>{
                        if(!saved){
                            return res.send({status:false, message:"Technical Error"})
                        }
                        DB.betting.find({clientName:req.body.userName, eventID:req.body.eventID}).then((bets) => {
                            let exp1 = Utils.calculateExposure(bets, team1, team2,'');
                            let exp2 = Utils.calculateExposure(bets, team2, team1,'');
                            let exp3 = Utils.calculateExposure(bets, team1, team2, 'The Draw');
                            if(exp3.loss !== null && exp3.profit !== null){
                                let exposures = [exp1.loss-exp2.profit+exp3.loss, exp1.loss-exp3.profit+exp2.loss, 
                                exp2.loss-exp1.profit+exp3.loss, exp2.loss-exp3.profit+exp1.loss,
                                exp3.loss-exp1.profit+exp2.loss, exp3.loss-exp2.profit+exp1.loss];
                                user.exposure = parseFloat(user.exposure) - parseFloat(Utils.findTheGreatest([exposures]));
                            }else{
                                if(exp1.loss - exp2.profit >= exp2.loss - exp1.profit){
                                    user.exposure = parseFloat(user.exposure) + parseFloat(exp1.loss - exp2.profit);
                                }else{
                                    user.exposure = parseFloat(user.exposure) + parseFloat(exp2.loss - exp1.profit);
                                }
                            }
                            // console.log('2:exp1:',exp1.loss-exp2.profit,' exp2:',exp2.loss-exp1.profit, ' user.exposure:', user.exposure);
                            user.walletBalance = parseFloat(user.freeChips) - parseFloat(user.exposure);
                            user.save().then((updatedUser)=>{
                                return res.send({status:true,message:"Bet place successfully",data:updatedUser,bettingData:saved});
                            });
                        })
                    });
                });
            }
        })
    }

    // DB.betting.find({clientName: req.body.userName,eventID: req.body.eventID}).then((bets) => {
    //     console.log('bets:',bets);
    // }) 

    //     DB.user.findOne({userName:req.body.userName}).then((user)=>{
    //           if(user){


    //               if(req.body.bettype=="Back"){

    //                 ProfitLoss = req.body.profit;
    //         } else{

    //                 ProfitLoss = req.body.loss;        
    //      }    


    //        }   
    //    }) 

}

//   place fancy bet

exports.placeFancyBet = (req, res) => {

    DB.user.findOne({ userName: req.body.userName }).then((user) => {
        if (user) {

            let ProfitLoss = 0;

            if (req.body.bettype == "Back") {

                ProfitLoss = req.body.profit;
            } else {

                ProfitLoss = req.body.loss;
            }

            var betting = new DB.betting({
                clientName: req.body.userName,
                userid: user,
                IP: req.body.IP,
                marketType: req.body.marketType,
                description: req.body.description,
                selection: req.body.selection,
                selectionID: req.body.selectionID,
                eventID: req.body.eventID,
                marketID: req.body.marketID,
                odds: req.body.odds,
                stack: req.body.stack,
                status: req.body.status,
                bettype: req.body.bettype,
                P_L: ProfitLoss,
                profit: req.body.profit,
                liability: req.body.loss

            })
            betting.save().then((saved) => {
                if (!saved) {
                    return res.send({ status: false, message: "Technical Error" })
                }
                DB.user.findOne({ userName: req.body.userName }).then((user) => {
                    user.walletBalance = parseFloat(user.walletBalance) - parseFloat(req.body.loss)
                    user.exposure = parseFloat(user.exposure) + parseFloat(req.body.loss)
                    user.save().then((updatedUser) => {
                        return res.send({
                            status: true,
                            message: "fancy bet place successfully",
                            data: updatedUser, bettingData: saved
                        })

                    })
                })
            })
        }
    })

}


// get open user bet history

exports.getUserOpenBetHistory = async (req, res) => {
    try {

        username = req.body.userName
        eventid = req.body.eventId

        if (eventid) {
            await DB.betting.find({ clientName: username, eventID: eventid, status: "open" }).then((betdata) => {
                if (betdata) {

                    return res.send({ status: true, message: "", data: betdata })
                }

            })

        }
        else {

            await DB.betting.find({ clientName: username, status: "open" }).then((betdata) => {
                if (betdata) {

                    return res.send({ status: true, message: "", data: betdata })
                }

            })

        }


    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}

//   get master section open bet history

exports.getMasterSectionOpenBetHistory = async (req, res) => {
    try {

        masterName = req.body.masterName
        Betstatus = req.body.Betstatus

        // 
        masters = await Utils.getAllMasterusers(req.body.masterName);

        Promise.all(masters).then((Data) => {

            let cricketData = []
            // let fancyData = []
            // let soccerData = []
            // let tennisData = []


            var mergedData = [].concat.apply([], Data);
            mergedData.map((item, index) => {
                // add sports id
                cricketData.push(DB.betting.find({ clientName: item.userName, status: Betstatus }));
                // cricketData.push(DB.betting.find({clientName:item.userName,status:"settled",marketType:"Fancy"}));
            })

            Promise.all(cricketData).then(data => {
                console.log(data)
                // console.log(data)
                var merged = [].concat.apply([], data);


                return res.send({ data: merged })

            })
        })





    }
    catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}
// get admin section bet history
exports.getAdminSectionOpenBetHistory = async (req, res) => {
    try {

        adminName = req.body.adminName
        Betstatus = req.body.Betstatus




        masters = await Utils.getAllAdminMasters(req.body.adminName);
        const Users = [];


        masters.map((item, index) => {
            Users.push(Utils.getAllMasterusers(item.userName));
        });

        Promise.all(Users).then((Data) => {
            // 


            let cricketData = []
            // let fancyData = []
            // let soccerData = []
            // let tennisData = []


            var mergedData = [].concat.apply([], Data);
            mergedData.map((item, index) => {
                // add sports id
                cricketData.push(DB.betting.find({ clientName: item.userName, status: Betstatus }));
                // cricketData.push(DB.betting.find({clientName:item.userName,status:"settled",marketType:"Fancy"}));
            })

            Promise.all(cricketData).then(data => {
                //   console.log(data)
                // console.log(data)
                var merged = [].concat.apply([], data);

                return res.send({ data: merged })

            })
        })


    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}

// get super admin open bet history
exports.getSuperAdminSectionOpenBetHistory = async (req, res) => {
    try {

        superAdmin = req.body.superAdmin
        Betstatus = req.body.Betstatus

        masters = await Utils.getAllMasters();
        const Users = [];


        masters.map((item, index) => {
            Users.push(Utils.getAllMasterusers(item.userName));
        });



        Promise.all(Users).then((Data) => {
            // 


            let cricketData = []
            // let fancyData = []
            // let soccerData = []
            // let tennisData = []


            var mergedData = [].concat.apply([], Data);
            mergedData.map((item, index) => {
                // add sports id
                cricketData.push(DB.betting.find({ clientName: item.userName, status: Betstatus }));
                // cricketData.push(DB.betting.find({clientName:item.userName,status:"settled",marketType:"Fancy"}));
            })

            Promise.all(cricketData).then(data => {

                var merged = [].concat.apply([], data);

                return res.send({ data: merged })

            })
        })





    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}


//get fancy open bet history
exports.getUserOpenfancyBetHistory = async (req, res) => {
    try {

        username = req.body.userName

        await DB.betting.find({ clientName: username, status: "open", marketType: "Fancy" }).then((betdata) => {
            if (betdata) {

                return res.send({ status: true, message: "", data: betdata })
            }

        })


    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}

exports.getUserOpenfancyBetHistoryfront = async (req, res) => {
    try {

        username = req.body.userName
        eventid = req.body.eventId

        await DB.betting.find({ clientName: username, eventID: eventid, status: "open", marketType: "Fancy" }).then((betdata) => {
            if (betdata) {

                return res.send({ status: true, message: "", data: betdata })
            }

        })


    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}
// get master all users open bet history

exports.getMasterOpenBetHistory = async (req, res) => {
    try {

        masterName = req.body.masterName
        selectionid = req.body.selectionid

        if (selectionid) {
            // 
            masters = await Utils.getAllMasterusers(req.body.masterName);

            Promise.all(masters).then((Data) => {

                let cricketData = []
                // let fancyData = []
                // let soccerData = []
                // let tennisData = []


                var mergedData = [].concat.apply([], Data);
                mergedData.map((item, index) => {
                    // add sports id
                    cricketData.push(DB.betting.find({ clientName: item.userName, status: "open", selectionID: selectionid }));
                    // cricketData.push(DB.betting.find({clientName:item.userName,status:"settled",marketType:"Fancy"}));
                })

                Promise.all(cricketData).then(data => {
                    console.log(data)
                    // console.log(data)
                    var merged = [].concat.apply([], data);
                    var profit = 0;
                    var loss = 0;
                    merged.map((item, index) => {
                        profit = profit + item.P_L;
                        loss = loss + item.liability;
                    })
                    return res.send({ Data: profit, loss })

                })
            })


        }
        else {

            await DB.betting.find({ clientName: username, status: "open" }).then((betdata) => {
                if (betdata) {

                    return res.send({ status: true, message: "", data: betdata })
                }

            })

        }


    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}
//   get admin users open bet history
exports.getAdminOpenBetHistory = async (req, res) => {
    try {

        adminName = req.body.adminName
        selectionid = req.body.selectionid

        if (selectionid) {

            masters = await Utils.getAllAdminMasters(req.body.adminName);
            const Users = [];


            masters.map((item, index) => {
                Users.push(Utils.getAllMasterusers(item.userName));
            });

            Promise.all(Users).then((Data) => {
                // 


                let cricketData = []
                // let fancyData = []
                // let soccerData = []
                // let tennisData = []


                var mergedData = [].concat.apply([], Data);
                mergedData.map((item, index) => {
                    // add sports id
                    cricketData.push(DB.betting.find({ clientName: item.userName, status: "open", selectionID: selectionid }));
                    // cricketData.push(DB.betting.find({clientName:item.userName,status:"settled",marketType:"Fancy"}));
                })

                Promise.all(cricketData).then(data => {
                    //   console.log(data)
                    // console.log(data)
                    var merged = [].concat.apply([], data);
                    var profit = 0;
                    var loss = 0;
                    merged.map((item, index) => {
                        profit = profit + item.P_L;
                        loss = loss + item.liability;
                    })
                    return res.send({ Data: profit, loss })

                })
            })


        }
        else {

            await DB.betting.find({ clientName: username, status: "open" }).then((betdata) => {
                if (betdata) {

                    return res.send({ status: true, message: "", data: betdata })
                }

            })

        }


    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}
// get superadmin open bet history
exports.getsuperAdminOpenBetHistory = async (req, res) => {
    try {

        selectionid = req.body.selectionid

        if (selectionid) {
            masters = await Utils.getAllMasters();
            const Users = [];


            masters.map((item, index) => {
                Users.push(Utils.getAllMasterusers(item.userName));
            });



            Promise.all(Users).then((Data) => {
                // 


                let cricketData = []
                // let fancyData = []
                // let soccerData = []
                // let tennisData = []


                var mergedData = [].concat.apply([], Data);
                mergedData.map((item, index) => {
                    // add sports id
                    cricketData.push(DB.betting.find({ clientName: item.userName, status: "open", selectionID: selectionid }));
                    // cricketData.push(DB.betting.find({clientName:item.userName,status:"settled",marketType:"Fancy"}));
                })

                Promise.all(cricketData).then(data => {
                    //   console.log(data)
                    // console.log(data)
                    var merged = [].concat.apply([], data);
                    var profit = 0;
                    var loss = 0;
                    merged.map((item, index) => {
                        profit = profit + item.P_L;
                        loss = loss + item.liability;
                    })
                    return res.send({ Data: profit, loss })

                })
            })


        }
        else {

            await DB.betting.find({ clientName: username, status: "open" }).then((betdata) => {
                if (betdata) {

                    return res.send({ status: true, message: "", data: betdata })
                }

            })

        }


    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}

//get all users open bet history

exports.getallUserOpenBetHistory = async (req, res) => {
    try {
        Betstatus = req.body.Betstatus
        await DB.betting.find({ status: Betstatus }).then((betdata) => {
            if (betdata) {

                return res.send({ status: true, message: "", data: betdata })
            }

            else {


                return res.send({ status: false, message: "technical error", })

            }
        })

    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}

// get user settle bet history

exports.getUserSettledBetHistory = async (req, res) => {
    try {
        await DB.betting.find({ clientName: req.body.userName, status: "settled" }).then((betdata) => {
            if (betdata) {

                return res.send({ status: true, message: "", data: betdata })
            }

            else {


                return res.send({ status: false, message: "technical error", })

            }
        })

    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}

// get all users settled bet history

exports.getallUserSettledBetHistory = async (req, res) => {
    try {
        await DB.betting.find({ status: "settled" }).then((betdata) => {
            if (betdata) {

                return res.send({ status: true, message: "", data: betdata })
            }

            else {


                return res.send({ status: false, message: "technical error", })

            }
        })

    } catch (error) {

        return res.send({ status: false, message: "technical error2", })


    }
}

// get total user profit and loss for open bets clicking on bets button

exports.getUserProfitAndLoss = (req, res) => {

    try {
        DB.betting.find({ clientName: req.body.userName, eventID: req.body.eventId, status: "open" }).then((userProfitLoss) => {
            profit1 = 0; loss = 0;
            userProfitLoss.map((item, index) => {
                profit1 = profit1 + item.P_L,
                    loss = loss + item.liability
                //  console.log(profit1);
            })
            PL = profit1 - loss;
            { }

            return res.json({ status: true, Data: { PL, userProfitLoss } })

        })
    }

    catch (error) {
        console.log("try =========catch=========", error)

    }

}


//   bet settle for match odds

// exports.BetSettleMatchOdds = (req, res) => {
//     DB.matchOdds.find().then((marketType) => {
//         // console.log(marketType)
//         marketType.map((item, index) => {
//             //  console.log(item.marketId)
//             var marketIds = item.marketId
//             // console.log(marketIds)

//             if (marketIds) {
//                 Request.get({
//                     "headers": { "content-type": "application/json" },
//                     "url": "http://142.93.36.1/api/v1/listMarketBookOdds",
//                     "qs": { "market_id": marketIds }
//                 }, (error, response, body) => {
//                     if (error) {
//                         return console.log(error);
//                     }
//                     const oddsData = JSON.parse(body)
//                     if ((oddsData[0] !== undefined)) {
//                         if (oddsData[0].status === "CLOSED") {

//                             // console.log(oddsData[0].runners[0].selectionId,oddsData[0].runners[0].status)
//                             oddsData[0].runners.map((item1, index) => {
//                                 // console.log(item1.selectionId,item1.status)
//                                 if (item1.status === "INACTIVE") {
//                                     const winnerSelectionId = item1.selectionId
//                                     //    console.log(item1.selectionId,item1.status,winnerSelectionId )


//                                     DB.betting.find({ status: "open", marketID: marketIds }).then((openBets) => {

//                                         openBets.map((item3, index) => {

//                                             // return res.json(openBets)

//                                             if (item3.selectionID === winnerSelectionId && item3.bettype === "Back") {
//                                                 // profit and update the status settled


//                                                 DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: item3.profit, profitLossChips: item3.profit, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
//                                                     if (userUpdated) {
//                                                         // userUpdated.exposure = parseFloat(userUpdated.exposure) - parseFloat(item3.liability)
//                                                         DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
//                                                             if (userAccount) {
//                                                                 var deposit = new DB.deposit({
//                                                                     userName: userUpdated.userName,
//                                                                     accountHolderName: userUpdated,
//                                                                     amount: item3.profit,
//                                                                     balance: userUpdated.walletBalance


//                                                                 })

//                                                                 deposit.save()
//                                                                 userAccount.depositTransaction.push(deposit)
//                                                                 userAccount.walletBalance = parseFloat(userAccount.walletBalance) + parseFloat(item3.profit)
//                                                                 lastDepositDate = new Date()
//                                                                 userAccount.save()
//                                                                 userUpdated.save().then((saved) => {

//                                                                     item3.profit = item3.P_L;
//                                                                     item3.liability = 0;
//                                                                     item3.status = "settled";
//                                                                     item3.save()


//                                                                 })

//                                                             }

//                                                         })
//                                                     }

//                                                 })


//                                             } else if (item3.selectionID === winnerSelectionId && item3.bettype === "Lay") {
//                                                 // loss and update the status settled


//                                                 DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: -item3.liability, profitLossChips: -item3.liability, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
//                                                     if (userUpdated) {
//                                                         // userUpdated.exposure = parseFloat(userUpdated.exposure) - parseFloat(item3.liability) 
//                                                         DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
//                                                             if (userAccount) {
//                                                                 var withdraw = new DB.withdraw({
//                                                                     userName: userUpdated.userName,
//                                                                     accountHolderName: userUpdated,
//                                                                     amount: item3.liability,
//                                                                     balance: userUpdated.walletBalance

//                                                                 })

//                                                                 withdraw.save()
//                                                                 userAccount.withdrawTransaction.push(withdraw)
//                                                                 userAccount.walletBalance = parseFloat(userAccount.walletBalance) - parseFloat(req.body.fillAmount)
//                                                                 userAccount.lastWithdrawDate = new Date()
//                                                                 userAccount.save()
//                                                                 userUpdated.save().then((saved) => {

//                                                                     item3.P_L = item3.liability;
//                                                                     item3.profit = 0;
//                                                                     item3.status = "settled"
//                                                                     item3.save()

//                                                                 })

//                                                             }
//                                                         })
//                                                     }
//                                                 })


//                                             }

//                                             else if (item3.selectionID !== winnerSelectionId && item3.bettype === "Lay") {
//                                                 // profit and update the status settled


//                                                 DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: item3.profit, profitLossChips: item3.profit, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
//                                                     if (userUpdated) {
//                                                         // userUpdated.exposure = parseFloat(userUpdated.exposure) - parseFloat(item3.liability) 
//                                                         DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
//                                                             if (userAccount) {
//                                                                 var deposit = new DB.deposit({
//                                                                     userName: userUpdated.userName,
//                                                                     accountHolderName: userUpdated,
//                                                                     amount: item3.profit,
//                                                                     balance: userUpdated.walletBalance

//                                                                 })

//                                                                 deposit.save()
//                                                                 userAccount.depositTransaction.push(deposit)
//                                                                 userAccount.walletBalance = parseFloat(userAccount.walletBalance) + parseFloat(item3.profit)
//                                                                 lastDepositDate = new Date()
//                                                                 userAccount.save()
//                                                                 userUpdated.save().then((saved) => {
//                                                                     item3.profit = item3.P_L;
//                                                                     item3.P_L = item3.liability;
//                                                                     item3.liability = 0;
//                                                                     item3.status = "settled"
//                                                                     item3.save()


//                                                                 })

//                                                             }
//                                                         })
//                                                     }
//                                                 })
//                                             } else {
//                                                 // loss and update the status settled and then save it
//                                                 DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: -item3.liability, profitLossChips: -item3.liability, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
//                                                     if (userUpdated) {
//                                                         // userUpdated.exposure = parseFloat(userUpdated.exposure) - parseFloat(item3.liability) 
//                                                         DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
//                                                             if (userAccount) {
//                                                                 var withdraw = new DB.withdraw({
//                                                                     userName: userUpdated.userName,
//                                                                     accountHolderName: userUpdated,
//                                                                     amount: item3.liability,
//                                                                     balance: userUpdated.walletBalance

//                                                                 })

//                                                                 withdraw.save()
//                                                                 userAccount.withdrawTransaction.push(withdraw)
//                                                                 userAccount.walletBalance = parseFloat(userAccount.walletBalance) - parseFloat(req.body.fillAmount)
//                                                                 userAccount.lastWithdrawDate = new Date()
//                                                                 userAccount.save()
//                                                                 userUpdated.save().then((saved) => {

//                                                                     item3.profit = 0;
//                                                                     item3.status = "settled";
//                                                                     item3.save()

//                                                                 })

//                                                             }

//                                                         })
//                                                     }
//                                                 })
//                                             }

//                                         })

//                                     })

//                                 }

//                             })

//                         }
//                     }

//                 })

//             }

//         })

//     })

// }

exports.matchOddsBetSettlement = async (req, res) => {
    let winnerSelectionId = req.body.selectionId;
    let winnerTeam = req.body.winnerTeam;
    let _eventId = req.body.eventId;
    let marketId = req.body.marketId;
    if(!winnerSelectionId || !marketId) {
        res.send({status:false, message:"Kindly share the selectionid or marketId"});
    }
    let settleQuery = {eventId: _eventId};
    let updatedvals = {$set: {settledValue: winnerSelectionId, settlementStatus: 'settled', winnerTeam: winnerTeam}};
    DB.event.updateOne(settleQuery, updatedvals).then(data => {
    });
    DB.betting.find({ status: "open", marketID: marketId }).then((openBets) => {
        openBets.map((item3, index) => {
            if (item3.selectionID == winnerSelectionId && item3.bettype === "Back") {
                DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: item3.profit, profitLossChips: item3.profit, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                    if (userUpdated) {
                        userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability);
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var withdraw = new DB.withdraw({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    amount: item3.liability,
                                    balance: userUpdated.walletBalance

                                })

                                withdraw.save()
                                userAccount.withdrawTransaction.push(withdraw)
                                userAccount.lastWithdrawDate = new Date()
                                userAccount.save()
                                userUpdated.save().then((saved) => {

                                    item3.P_L = item3.liability;
                                    item3.profit = 0;
                                    item3.status = "settled"
                                    item3.save()

                                })

                            }
                        })
                    }
                })
            } else if (item3.selectionID == winnerSelectionId && item3.bettype === "Lay") {
                DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { profitLossChips: -item3.liability, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                    if (userUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var withdraw = new DB.withdraw({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    amount: item3.liability,
                                    balance: userUpdated.walletBalance

                                })

                                withdraw.save()
                                userAccount.withdrawTransaction.push(withdraw)
                                userAccount.lastWithdrawDate = new Date()
                                userAccount.save()
                                userUpdated.save().then((saved) => {

                                    item3.P_L = item3.liability;
                                    item3.profit = 0;
                                    item3.status = "settled"
                                    item3.save()

                                })

                            }
                        })
                    }
                })
            } else if (item3.selectionID != winnerSelectionId && item3.bettype === "Lay") {
                DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: item3.profit, profitLossChips: item3.profit, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                    if (userUpdated) {
                        userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability)
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var deposit = new DB.deposit({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    amount: item3.profit,
                                    balance: userUpdated.walletBalance

                                })

                                deposit.save()
                                userAccount.depositTransaction.push(deposit)
                                lastDepositDate = new Date()
                                userAccount.save()
                                userUpdated.save().then((saved) => {
                                    item3.profit = item3.P_L;
                                    item3.P_L = item3.liability;
                                    item3.liability = 0;
                                    item3.status = "settled"
                                    item3.save()


                                })

                            }
                        })
                    }
                })
            } else {
                DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { profitLossChips: -item3.liability, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                    if (userUpdated) {
                        DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                            if (userAccount) {
                                var withdraw = new DB.withdraw({
                                    userName: userUpdated.userName,
                                    accountHolderName: userUpdated,
                                    amount: item3.liability,
                                    balance: userUpdated.walletBalance

                                })

                                withdraw.save()
                                userAccount.withdrawTransaction.push(withdraw)
                                userAccount.lastWithdrawDate = new Date()
                                userAccount.save()
                                userUpdated.save().then((saved) => {

                                    item3.profit = 0;
                                    item3.status = "settled";
                                    item3.save()

                                })

                            }

                        })
                    }
                })
            }
        })
        return res.status(200).json({status: true, message: "Match odds has been settled"});
    })
}

// bet settle for fancy odds

// exports.BetSettleFancyOdds = (req, res) => {
//     DB.FancyOdds.find({status: "CLOSED"}).then((marketType) => {
//         let marketData = marketType;
//         importFancyOddsData();
//         marketData.map((item, index) => {
//             let odsyTypeData = fancyOddsStringCalc(item.marketName);
//             if(odsyTypeData != 'Manual'){
//                 let scoreQuery = {eventId: item.eventId};
//                 if (odsyTypeData[0] == 'BOUNDARIES'){
//                     scoreQuery = {eventId: item.eventId, "batsmen.name":{'$eq':odsyTypeData[1]}};
//                 } else if (odsyTypeData[0] == 'FALL OF') {
//                     scoreQuery = {eventId: item.eventId, "fallOfWicket.wicket":{'$eq':odsyTypeData[1]}};
//                 } else if (odsyTypeData[0] == 'ONLY') {
//                     scoreQuery = {eventId: item.eventId, overs: odsyTypeData[1]};
//                 } else if(odsyTypeData[0] == 'OVER RUN') {
//                     scoreQuery = {eventId: item.eventId, overs: odsyTypeData[1]};
//                 }
//             DB.betting.find({ status: "open", marketID: item.marketId, selectionID: item.marketId }).then((openBets) => {
//                 openBets.map((item3, index) => {
//                     if (item3.bettype === "Back") {
//                         DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: item3.profit, profitLossChips: item3.profit, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
//                             if (userUpdated) {
//                                 DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
//                                     if (userAccount) {
//                                         var deposit = new DB.deposit({
//                                             userName: userUpdated.userName,
//                                             accountHolderName: userUpdated,
//                                             amount: item3.profit,
//                                             balance: userUpdated.walletBalance
//                                             })

//                                             deposit.save()
//                                             userAccount.depositTransaction.push(deposit);
//                                             userUpdated.exposure = parseFloat(userUpdated.exposure) + parseFloat(item3.stack);
//                                             DB.scoreCard.findOne(scoreQuery).then(scoreData => {
//                                                 if(scoreData != null){
//                                                     if (odsyTypeData[0] == 'BOUNDARIES'){
//                                                         for(var i = 0; i < scoreData.batsmen.length; i++){
//                                                             if(scoreData.batsmen[i].name == odsyTypeData[1]){
//                                                                 if (item3.odds <= scoreData.batsmen[i].four + scoreData.batsmen[i].six) {
//                                                                     userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.P_L)+ parseFloat(item3.stack);
//                                                                 }
//                                                                 break;
//                                                             }
//                                                         }
//                                                     } else if (odsyTypeData[0] == 'FALL OF') {
//                                                         for(var i = 0; i < scoreData.fallOfWicket; i++){
//                                                             if(scoreData.fallOfWicket[i].wicket == odsyTypeData[1]){
//                                                                 if (item3.odds <= scoreData.batsmen[i].run) {
//                                                                     userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.P_L)+ parseFloat(item3.stack);
//                                                                 }
//                                                                 break;
//                                                             }
//                                                         }
//                                                     } else if (odsyTypeData[0] == 'ONLY') {
//                                                         if(scoreData.overs == odsyTypeData[1]){
//                                                             if (item3.odds <= scoreData.overRun) {
//                                                                 userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.P_L)+ parseFloat(item3.stack);
//                                                             }
//                                                         }
//                                                     } else if(odsyTypeData[0] == 'OVER RUN') {
//                                                         if(scoreData.overs == odsyTypeData[1]){
//                                                             if (item3.odds <= scoreData.runs) {
//                                                                 userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.P_L)+ parseFloat(item3.stack);
//                                                             }
                                                           
//                                                         }
//                                                     } else if(odsyTypeData[0] == 'RUN'){
//                                                         for(var i = 0; i < scoreData.batsmen.length; i++){
//                                                             if(scoreData.batsmen[i].name == odsyTypeData[1]){
//                                                                 if (item3.odds <= scoreData.batsmen[i].run) {
//                                                                     userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.P_L)+ parseFloat(item3.stack);
//                                                                 }
//                                                                 break;
//                                                             }
//                                                         }
//                                                     }
//                                                 }
//                                             })
//                                             lastDepositDate = new Date()
//                                             userAccount.save()
//                                             userUpdated.save().then((saved) => {
//                                                 item3.profit = item3.P_L;
//                                                 item3.liability = 0;
//                                                 item3.status = "settled";
//                                                 item3.sattlementType = "automatic";
//                                                 item3.save()
//                                             })
//                                     }
//                                 })
//                             }
//                         })
//                     } else if (item3.bettype === "Lay") {
//                                 DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: -item3.liability, profitLossChips: -item3.liability, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
//                                     if (userUpdated) {
//                                         DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
//                                             if (userAccount) {
//                                                 var withdraw = new DB.withdraw({
//                                                     userName: userUpdated.userName,
//                                                     accountHolderName: userUpdated,
//                                                     amount: item3.liability,
//                                                     balance: userUpdated.walletBalance
//                                                 })

//                                             withdraw.save()
//                                             userAccount.withdrawTransaction.push(withdraw)
//                                             userUpdated.exposure = parseFloat(userUpdated.exposure)+ parseFloat(item3.stack);
//                                             DB.scoreCard.findOne(scoreQuery).then(scoreData => {
//                                                 if(scoreData != null){
//                                                     if (odsyTypeData[0] == 'BOUNDARIES'){
//                                                         for(var i = 0; i < scoreData.batsmen.length; i++){
//                                                             if(scoreData.batsmen[i].name == odsyTypeData[1]){
//                                                                 if (item3.odds > scoreData.batsmen[i].four + scoreData.batsmen[i].six) {
//                                                                     userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability)+ parseFloat(item3.stack);
//                                                                 }
//                                                                 break;
//                                                             }
//                                                         }
//                                                     } else if (odsyTypeData[0] == 'FALL OF') {
//                                                         for(var i = 0; i < scoreData.fallOfWicket; i++){
//                                                             if(scoreData.fallOfWicket[i].wicket == odsyTypeData[1]){
//                                                                 if (item3.odds > scoreData.batsmen[i].run) {
//                                                                     userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability)+ parseFloat(item3.stack);
//                                                                 }
//                                                                 break;
//                                                             }
//                                                         }
//                                                     } else if (odsyTypeData[0] == 'ONLY') {
//                                                         if(scoreData.overs == odsyTypeData[1]){
//                                                             if (item3.odds > scoreData.overRun) {
//                                                                 userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability)+ parseFloat(item3.stack);
//                                                             }
//                                                         }
//                                                     } else if(odsyTypeData[0] == 'OVER RUN') {
//                                                         if(scoreData.overs == odsyTypeData[1]){
//                                                             if (item3.odds > scoreData.runs) {
//                                                                 userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability)+ parseFloat(item3.stack);
//                                                             }
//                                                         }
//                                                     } else if(odsyTypeData[0] == 'RUN'){
//                                                         for(var i = 0; i < scoreData.batsmen.length; i++){
//                                                             if(scoreData.batsmen[i].name == odsyTypeData[1]){
//                                                                 if (item3.odds > scoreData.batsmen[i].run) {
//                                                                     userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability)+ parseFloat(item3.stack);
//                                                                 }
//                                                                 break;
//                                                             }
//                                                         }
//                                                     }
//                                                 }
//                                             })
//                                             userAccount.lastWithdrawDate = new Date()
//                                             userAccount.save()
//                                             userUpdated.save().then((saved) => {
//                                                 item3.P_L = item3.liability;
//                                                 item3.profit = 0;
//                                                 item3.status = "settled"
//                                                 item3.save()
//                                             })

//                                         }
//                                     })
//                                 }
//                             })
//                         } else { }
//                     })
//                 })
//             }
//             })
//     })
// }



exports.fancyOddsBetSettlement = async (req, res) => {
    let selectionId = req.body.selectionId;
    let result = req.body.result;
    if(!selectionId || !result){
        res.send({status:false, message:"Kindly share the selectionid or result"});
    }
    let settleQuery = {marketId: selectionId};
    let updatedvals = {$set: {settledValue: result, settlementStatus: 'settled'}};
    DB.FancyOdds.updateOne(settleQuery, updatedvals).then(data => {
    });
    //importFancyOddsData();
    DB.betting.find({ status: "open", selectionID: selectionId }).then((openBets) => {
        openBets.map((item3, index) => {
            if (item3.bettype === "Back") {
                if(item3.odds <= result) {
                    DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: item3.profit, profitLossChips: item3.profit, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                        if (userUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.liability);
                                    var deposit = new DB.deposit({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        amount: item3.profit,
                                        balance: userUpdated.walletBalance
                                    })
                                        deposit.save()
                                        userAccount.depositTransaction.push(deposit);
                                        lastDepositDate = new Date()
                                        userAccount.save()
                                        userUpdated.save().then((saved) => {
                                            item3.profit = item3.P_L;
                                            item3.liability = 0;
                                            item3.status = "settled";
                                            item3.save()
                                        })
                                }
                            })
                        }
                    })
                } else {
                    DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { profitLossChips: -item3.profit, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                        if (userUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var deposit = new DB.deposit({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        amount: item3.profit,
                                        balance: userUpdated.walletBalance
                                    })
                                        deposit.save()
                                        userAccount.depositTransaction.push(deposit);
                                        lastDepositDate = new Date()
                                        userAccount.save()
                                        userUpdated.save().then((saved) => {
                                            item3.profit = 0;
                                            item3.status = "settled";
                                            item3.save()
                                        })
                                }
                            })
                        }
                    })
                }
            } else if (item3.bettype === "Lay") {
                if(item3.odds > result) {
                    DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: { walletBalance: item3.liability, profitLossChips: -item3.liability, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                        if (userUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    userUpdated.walletBalance = parseFloat(userUpdated.walletBalance) + parseFloat(item3.profit);
                                    var withdraw = new DB.withdraw({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        amount: item3.liability,
                                        balance: userUpdated.walletBalance
                                    })
                                    withdraw.save()
                                    userAccount.withdrawTransaction.push(withdraw)
                                    userAccount.lastWithdrawDate = new Date()
                                    userAccount.save()
                                    userUpdated.save().then((saved) => {
                                        item3.profit = item3.P_L;
                                        item3.P_L = item3.liability;
                                        item3.liability = 0;
                                        item3.save()
                                    })
                                }
                            })
                        }
                    })
                } else {
                    DB.user.findOneAndUpdate({ userName: item3.clientName }, { $inc: {profitLossChips: -item3.liability, exposure: -parseFloat(item3.liability) } }, { new: true, upsert: true }).then((userUpdated) => {
                        if (userUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var withdraw = new DB.withdraw({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        amount: item3.liability,
                                        balance: userUpdated.walletBalance
                                    })
                                    withdraw.save()
                                    userAccount.withdrawTransaction.push(withdraw)
                                    userAccount.lastWithdrawDate = new Date()
                                    userAccount.save()
                                    userUpdated.save().then((saved) => {
                                        item3.profit = 0;
                                        item3.status = "settled"
                                        item3.save()
                                    })
                                }
                            })
                        }
                    })
                }
            }
        })
        return res.status(200).json({status: true, message: "Fancy odds has been settled"});
    })
}

// user section profit and loss

exports.getUserSectionProfitAndLoss = async (req, res) => {

    try {
        let D1 = new Date(req.body.date1);
        let D2 = new Date(req.body.date2);

        let unique = await Utils.uniqueEventsID(req.body.userName, D1, D2);


        let bettingData = [];
        let dataArray = []



        unique.magetUserProfitAndLoss((item, index) => {
            dataArray.push(DB.betting.find({ clientName: req.body.userName, eventID: item, status: "settled" }));
        })


        Promise.all(dataArray).then(data => {
            //  console.log(data)
            // var mergedData = [].concat.apply([], data);
            // console.log(data)
            finalProfitLoss = data.map((item, index) => {
                var ProfitLossdata = item.filter((childitem) => {
                    let D3 = new Date(childitem.createdAt);
                    if (D3.getTime() <= D2.getTime() && D3.getTime() >= D1.getTime()) {
                        return childitem
                    }

                })

                return ProfitLossdata
            })



            // console.log(finalProfitLoss)
            let finalobj = [];
            let pp = finalProfitLoss.map((item) => {
                let obj = {};
                var profit1 = 0;
                var loss = 0;
                item.map((childItem) => {
                    profit1 = profit1 + childItem.profit,
                        loss = loss + childItem.liability

                })
                obj.data = item;
                obj.ProfitLoss = profit1 - loss
                finalobj.push(obj)

            })
            res.json(finalobj)

        })

    }

    catch (error) {
        console.log("try =========catch=========", error)

    }

}


exports.setManualOdds = (req, res) => {

    try {

        DB.manualMatchOdds.deleteMany({ eventID: req.body.eventID }).then((manualOdds) => {
            var manualMatchOdds = new DB.manualMatchOdds({
                eventID: req.body.eventID,
                odds1: req.body.odds1,
                odds2: req.body.odds2,
                odds3: req.body.odds3,
                odds4: req.body.odds4,
                odds5: req.body.odds5,
                odds6: req.body.odds6

            })

            manualMatchOdds.save().then((saved) => {

                return res.json("odds stored successfully")

            })

        })



    }
    catch (error) {
        console.log(error)
    }


}
// get  manual odds

exports.getManualOdds = (req, res) => {

    try {

        DB.manualMatchOdds.findOne({ eventID: req.body.eventID }).then((manualOdds) => {

            if (manualOdds) {
                return res.json(manualOdds)
            }

        })

    }
    catch (error) {
        console.log(error)
    }


}
// superMaster profit and loss

exports.adminProfitAndLoss = async (req, res) => {

    try {
        masters = await Utils.getAllAdminMasters(req.body.adminName);
        const Users = [];


        masters.map((item, index) => {
            Users.push(Utils.getAllMasterusers(item.userName));
        });

        Promise.all(Users).then((Data) => {

            let bettingData = []
            var mergedData = [].concat.apply([], Data);
            mergedData.map((item, index) => {
                bettingData.push(DB.betting.find({ clientName: item.userName, status: "settled" }));
            })

            Promise.all(bettingData).then(data => {

                var merged = [].concat.apply([], data);


                const unique = [...new Set(merged.map(item => item.marketID))]

                let MarketDATA = [];

                unique.map((item, index) => {

                    MarketDATA.push(merged.filter((merged) => {
                        return merged.marketID == item;
                    }));

                })

                Promise.all(MarketDATA).then(DATA => {


                    let finalobject = [];


                    DATA.map((item) => {
                        let object = {};
                        var profit2 = 0;
                        var loss2 = 0;
                        item.map((childItem) => {
                            profit2 = profit2 + childItem.profit,
                                loss2 = loss2 + childItem.liability

                        })
                        object.data = item;
                        object.marketID = item[0].marketID
                        object.ProfitLoss = profit2 - loss2
                        finalobject.push(object)

                    })
                    return res.json(finalobject)


                })

            })

        })


    }

    catch (error) {

        console.log(error)


    }

}


// admin profit and loss


exports.superAdminProfitAndLoss = async (req, res) => {

    try {

        masters = await Utils.getAllMasters();
        const Users = [];


        masters.map((item, index) => {
            Users.push(Utils.getAllMasterusers(item.userName));
        });

        Promise.all(Users).then((Data) => {

            let bettingData = []
            var mergedData = [].concat.apply([], Data);
            mergedData.map((item, index) => {
                bettingData.push(DB.betting.find({ clientName: item.userName, status: "settled" }));
            })

            Promise.all(bettingData).then(data => {

                var merged = [].concat.apply([], data);


                const unique = [...new Set(merged.map(item => item.marketID))]

                let MarketDATA = [];

                unique.map((item, index) => {

                    MarketDATA.push(merged.filter((merged) => {
                        return merged.marketID == item;
                    }));

                })

                Promise.all(MarketDATA).then(DATA => {


                    let finalobject = [];


                    DATA.map((item) => {
                        let object = {};
                        var profit2 = 0;
                        var loss2 = 0;
                        item.map((childItem) => {
                            profit2 = profit2 + childItem.profit,
                                loss2 = loss2 + childItem.liability

                        })
                        object.data = item;
                        object.marketID = item[0].marketID
                        object.ProfitLoss = profit2 - loss2
                        finalobject.push(object)

                    })
                    return res.json(finalobject)


                })

            })

        })


    }

    catch (error) {

        console.log(error)


    }

}



// master profit and loss
exports.masterProfitAndLoss = async (req, res) => {

    try {
        // var D1 = new Date(req.body.date1); 
        // var D2 = new Date(req.body.date2); 

        masters = await Utils.getAllMasterusers(req.body.masterName);
        // console.log(masters)

        Promise.all(masters).then((Data) => {

            let bettingData = []
            var mergedData = [].concat.apply([], Data);
            mergedData.map((item, index) => {
                bettingData.push(DB.betting.find({ clientName: item.userName, status: "settled" }));
            })

            Promise.all(bettingData).then(data => {

                var merged = [].concat.apply([], data);
                // 
                // var filteruserProfitLoss =  merged.filter((item)=> {
                //     let D3 = new Date(item.createdAt);

                //     if (D3.getTime() <= D2.getTime()  && D3.getTime() >= D1.getTime()){
                //         return item
                //     }

                // })
                // 


                const unique = [...new Set(merged.map(item => item.marketID))]

                let MarketDATA = [];

                unique.map((item, index) => {

                    MarketDATA.push(merged.filter((merged) => {
                        return merged.marketID == item;
                    }));

                })

                Promise.all(MarketDATA).then(DATA => {


                    let finalobject = [];


                    DATA.map((item) => {
                        let object = {};
                        var profit2 = 0;
                        var loss2 = 0;
                        item.map((childItem) => {
                            profit2 = profit2 + childItem.profit,
                                loss2 = loss2 + childItem.liability

                        })
                        object.data = item;
                        object.marketID = item[0].marketID
                        object.ProfitLoss = profit2 - loss2
                        finalobject.push(object)

                    })
                    return res.json(finalobject)


                })

            })

        })


    }

    catch (error) {
        console.log(error)

    }

}

// chips settlement for user

exports.chipSettlementForUser = (req, res) => {
    try {

        if (req.body.PL_Chips > 0) {

            DB.user.findOne({ _id: req.body.userid }).then((userUpdated) => {
                if (userUpdated) {
                    if (userUpdated.profitLossChips == 0 || userUpdated.profitLossChips < req.body.PL_Chips) {
                        return res.send({ status: 3, message: "no profit loss chips or given chips more than profit loss chips" })

                    }
                    userUpdated.walletBalance = userUpdated.walletBalance - req.body.PL_Chips;
                    userUpdated.profitLossChips = userUpdated.profitLossChips - req.body.PL_Chips;

                    DB.user.findOneAndUpdate({ userName: userUpdated.master }, { $inc: { walletBalance: req.body.PL_Chips, profitLossChips: req.body.PL_Chips } }, { new: true, upsert: true }).then((masterUpdated) => {
                        if (masterUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var withdraw = new DB.withdraw({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        withdrawIn: masterUpdated,
                                        withdrawInName: masterUpdated.userName,
                                        amount: req.body.PL_Chips,
                                        balance: userUpdated.walletBalance,
                                        cash: true


                                    })

                                    withdraw.save()
                                    userAccount.withdrawTransaction.push(withdraw)
                                    userAccount.walletBalance = parseInt(userAccount.walletBalance) - parseInt(req.body.PL_Chips)
                                    userAccount.amountwithdraw = parseInt(userAccount.amountwithdraw) + parseInt(req.body.PL_Chips)
                                    userAccount.lastWithdrawDate = new Date()
                                    userAccount.save().then((usersaved) => {
                                        if (usersaved) {
                                            DB.account.findOne({ userName: userUpdated.master }).then((masterAccount) => {
                                                var deposit = new DB.deposit({
                                                    userName: masterUpdated.userName,
                                                    accountHolderName: masterUpdated,
                                                    depositedBy: userUpdated,
                                                    depositedByName: userUpdated.userName,
                                                    amount: req.body.PL_Chips,
                                                    balance: masterUpdated.walletBalance,
                                                    cash: true


                                                })
                                                deposit.save()
                                                masterAccount.lastDepositDate = new Date()
                                                masterAccount.depositTransaction.push(deposit)
                                                masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) + parseInt(req.body.PL_Chips)
                                                userUpdated.save()
                                                masterAccount.save().then((mastersaved) => {
                                                    if (mastersaved) {
                                                        return res.send({ status: true, message: "settlement and Wallet Updated" })

                                                    }
                                                })

                                            })

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })


        }

        else if (req.body.PL_Chips < 0) {

            DB.user.findOne({ _id: req.body.userid }).then((userUpdated) => {
                if (userUpdated) {
                    if (userUpdated.profitLossChips == 0 || userUpdated.profitLossChips > req.body.PL_Chips) {
                        return res.send({ status: 3, message: "no profit loss chips or given chips more than profit loss chips" })

                    }

                    userUpdated.walletBalance = userUpdated.walletBalance - req.body.PL_Chips;
                    userUpdated.profitLossChips = userUpdated.profitLossChips - req.body.PL_Chips;

                    DB.user.findOneAndUpdate({ userName: userUpdated.master }, { $inc: { walletBalance: req.body.PL_Chips, profitLossChips: req.body.PL_Chips } }, { new: true, upsert: true }).then((masterUpdated) => {
                        if (masterUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var deposit = new DB.deposit({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        depositedBy: masterUpdated,
                                        depositedByName: masterUpdated.userName,
                                        amount: req.body.PL_Chips,
                                        balance: userUpdated.walletBalance,
                                        cash: true


                                    })

                                    deposit.save()
                                    userAccount.depositTransaction.push(deposit)
                                    userAccount.walletBalance = parseInt(userAccount.walletBalance) + parseInt(req.body.PL_Chips)
                                    userAccount.amountDepositedByMaster = parseInt(userAccount.amountDepositedByMaster) + parseInt(req.body.PL_Chips)
                                    userAccount.lastDepositDate = new Date()
                                    userAccount.save().then((usersaved) => {
                                        if (usersaved) {
                                            DB.account.findOne({ userName: userUpdated.master }).then((masterAccount) => {
                                                var withdraw = new DB.withdraw({
                                                    userName: masterUpdated.userName,
                                                    accountHolderName: masterUpdated,
                                                    withdrawIn: userUpdated,
                                                    withdrawInName: userUpdated.userName,
                                                    amount: req.body.PL_Chips,
                                                    balance: masterUpdated.walletBalance,
                                                    cash: true



                                                })

                                                withdraw.save()
                                                masterAccount.withdrawTransaction.push(withdraw)
                                                masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) - parseInt(req.body.PL_Chips)
                                                userAccount.lastWithdrawDate = new Date()
                                                userUpdated.save()
                                                masterAccount.save().then((mastersaved) => {
                                                    if (mastersaved) {
                                                        return res.send({ status: true, message: "Wallet Updated" })

                                                    }
                                                })

                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            })



        }
        else {

            return res.send({ status: true, message: "no chips for settlements" })

        }

    }
    catch (error) {

        console.log(error)

    }

}

// chips settlement for master

exports.chipSettlementForMaster = (req, res) => {
    try {

        if (req.body.PL_Chips > 0) {


            DB.user.findOne({ _id: req.body.userid }).then((userUpdated) => {
                if (userUpdated) {
                    if (userUpdated.profitLossChips == 0 || userUpdated.profitLossChips < req.body.PL_Chips) {
                        return res.send({ status: 3, message: "no profit loss chips or given chips more than profit loss chips" })

                    }
                    userUpdated.walletBalance = userUpdated.walletBalance - req.body.PL_Chips;
                    userUpdated.profitLossChips = userUpdated.profitLossChips - req.body.PL_Chips;

                    DB.user.findOneAndUpdate({ userName: userUpdated.admin }, { $inc: { walletBalance: req.body.PL_Chips, profitLossChips: req.body.PL_Chips } }, { new: true, upsert: true }).then((masterUpdated) => {
                        if (masterUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var withdraw = new DB.withdraw({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        withdrawIn: masterUpdated,
                                        withdrawInName: masterUpdated.userName,
                                        amount: req.body.PL_Chips,
                                        balance: userUpdated.walletBalance,
                                        cash: true


                                    })

                                    withdraw.save()
                                    userAccount.withdrawTransaction.push(withdraw)
                                    userAccount.walletBalance = parseInt(userAccount.walletBalance) - parseInt(req.body.PL_Chips)
                                    userAccount.amountwithdraw = parseInt(userAccount.amountwithdraw) + parseInt(req.body.PL_Chips)
                                    userAccount.lastWithdrawDate = new Date()
                                    userAccount.save().then((usersaved) => {
                                        if (usersaved) {
                                            DB.account.findOne({ userName: userUpdated.admin }).then((masterAccount) => {
                                                var deposit = new DB.deposit({
                                                    userName: masterUpdated.userName,
                                                    accountHolderName: masterUpdated,
                                                    depositedBy: userUpdated,
                                                    depositedByName: userUpdated.userName,
                                                    amount: req.body.PL_Chips,
                                                    balance: masterUpdated.walletBalance,
                                                    cash: true


                                                })
                                                deposit.save()
                                                masterAccount.lastDepositDate = new Date()
                                                masterAccount.depositTransaction.push(deposit)
                                                masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) + parseInt(req.body.PL_Chips)
                                                userUpdated.save()
                                                masterAccount.save().then((mastersaved) => {
                                                    if (mastersaved) {
                                                        return res.send({ status: true, message: "settlement and Wallet Updated" })

                                                    }
                                                })

                                            })

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })


        }

        else if (req.body.PL_Chips < 0) {

            DB.user.findOne({ _id: req.body.userid }).then((userUpdated) => {
                if (userUpdated) {
                    if (userUpdated.profitLossChips == 0 || userUpdated.profitLossChips > req.body.PL_Chips) {
                        return res.send({ status: 3, message: "no profit loss chips or given chips more than profit loss chips" })

                    }

                    userUpdated.walletBalance = userUpdated.walletBalance - req.body.PL_Chips;
                    userUpdated.profitLossChips = userUpdated.profitLossChips - req.body.PL_Chips;


                    DB.user.findOneAndUpdate({ userName: userUpdated.admin }, { $inc: { walletBalance: req.body.PL_Chips, profitLossChips: req.body.PL_Chips } }, { new: true, upsert: true }).then((masterUpdated) => {
                        if (masterUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var deposit = new DB.deposit({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        depositedBy: masterUpdated,
                                        depositedByName: masterUpdated.userName,
                                        amount: req.body.PL_Chips,
                                        balance: userUpdated.walletBalance,
                                        cash: true


                                    })

                                    deposit.save()
                                    userAccount.depositTransaction.push(deposit)
                                    userAccount.walletBalance = parseInt(userAccount.walletBalance) + parseInt(req.body.PL_Chips)
                                    userAccount.amountDepositedByMaster = parseInt(userAccount.amountDepositedByMaster) + parseInt(req.body.PL_Chips)
                                    userAccount.lastDepositDate = new Date()
                                    userAccount.save().then((usersaved) => {
                                        if (usersaved) {
                                            DB.account.findOne({ userName: userUpdated.admin }).then((masterAccount) => {
                                                var withdraw = new DB.withdraw({
                                                    userName: masterUpdated.userName,
                                                    accountHolderName: masterUpdated,
                                                    withdrawIn: userUpdated,
                                                    withdrawInName: userUpdated.userName,
                                                    amount: req.body.PL_Chips,
                                                    balance: masterUpdated.walletBalance,
                                                    cash: true



                                                })

                                                withdraw.save()
                                                masterAccount.withdrawTransaction.push(withdraw)
                                                masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) - parseInt(req.body.PL_Chips)
                                                userAccount.lastWithdrawDate = new Date()
                                                userUpdated.save()
                                                masterAccount.save().then((mastersaved) => {
                                                    if (mastersaved) {
                                                        return res.send({ status: true, message: "Wallet Updated" })

                                                    }
                                                })

                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            })



        }
        else {

            return res.send({ status: true, message: "no chips for settlements" })

        }

    }
    catch (error) {

        console.log(error)

    }

}


// chips settlement for super master

exports.chipSettlementForAdmin = (req, res) => {
    try {

        if (req.body.PL_Chips > 0) {
            DB.user.findOne({ _id: req.body.userid }).then((userUpdated) => {
                if (userUpdated) {
                    if (userUpdated.profitLossChips == 0 || userUpdated.profitLossChips < req.body.PL_Chips) {
                        return res.send({ status: 3, message: "no profit loss chips or given chips more than profit loss chips" })

                    }
                    userUpdated.walletBalance = userUpdated.walletBalance - req.body.PL_Chips;
                    userUpdated.profitLossChips = userUpdated.profitLossChips - req.body.PL_Chips;


                    DB.user.findOneAndUpdate({ userName: userUpdated.superadmin }, { $inc: { walletBalance: req.body.PL_Chips, profitLossChips: req.body.PL_Chips } }, { new: true, upsert: true }).then((masterUpdated) => {
                        if (masterUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var withdraw = new DB.withdraw({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        withdrawIn: masterUpdated,
                                        withdrawInName: masterUpdated.userName,
                                        amount: req.body.PL_Chips,
                                        balance: userUpdated.walletBalance,
                                        cash: true


                                    })

                                    withdraw.save()
                                    userAccount.withdrawTransaction.push(withdraw)
                                    userAccount.walletBalance = parseInt(userAccount.walletBalance) - parseInt(req.body.PL_Chips)
                                    userAccount.amountwithdraw = parseInt(userAccount.amountwithdraw) + parseInt(req.body.PL_Chips)
                                    userAccount.lastWithdrawDate = new Date()
                                    userAccount.save().then((usersaved) => {
                                        if (usersaved) {
                                            DB.account.findOne({ userName: userUpdated.superadmin }).then((masterAccount) => {
                                                var deposit = new DB.deposit({
                                                    userName: masterUpdated.userName,
                                                    accountHolderName: masterUpdated,
                                                    depositedBy: userUpdated,
                                                    depositedByName: userUpdated.userName,
                                                    amount: req.body.PL_Chips,
                                                    balance: masterUpdated.walletBalance,
                                                    cash: true


                                                })
                                                deposit.save()
                                                masterAccount.lastDepositDate = new Date()
                                                masterAccount.depositTransaction.push(deposit)
                                                masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) + parseInt(req.body.PL_Chips)
                                                userUpdated.save()
                                                masterAccount.save().then((mastersaved) => {
                                                    if (mastersaved) {
                                                        return res.send({ status: true, message: "settlement and Wallet Updated" })

                                                    }
                                                })

                                            })

                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })


        }

        else if (req.body.PL_Chips < 0) {
            DB.user.findOne({ _id: req.body.userid }).then((userUpdated) => {
                if (userUpdated) {
                    if (userUpdated.profitLossChips == 0 || userUpdated.profitLossChips > req.body.PL_Chips) {
                        return res.send({ status: 3, message: "no profit loss chips or given chips more than profit loss chips" })

                    }

                    userUpdated.walletBalance = userUpdated.walletBalance - req.body.PL_Chips;
                    userUpdated.profitLossChips = userUpdated.profitLossChips - req.body.PL_Chips;

                    DB.user.findOneAndUpdate({ userName: userUpdated.superadmin }, { $inc: { walletBalance: req.body.PL_Chips, profitLossChips: req.body.PL_Chips } }, { new: true, upsert: true }).then((masterUpdated) => {
                        if (masterUpdated) {
                            DB.account.findOne({ userName: userUpdated.userName }).then((userAccount) => {
                                if (userAccount) {
                                    var deposit = new DB.deposit({
                                        userName: userUpdated.userName,
                                        accountHolderName: userUpdated,
                                        depositedBy: masterUpdated,
                                        depositedByName: masterUpdated.userName,
                                        amount: req.body.PL_Chips,
                                        balance: userUpdated.walletBalance,
                                        cash: true


                                    })

                                    deposit.save()
                                    userAccount.depositTransaction.push(deposit)
                                    userAccount.walletBalance = parseInt(userAccount.walletBalance) + parseInt(req.body.PL_Chips)
                                    userAccount.amountDepositedByMaster = parseInt(userAccount.amountDepositedByMaster) + parseInt(req.body.PL_Chips)
                                    userAccount.lastDepositDate = new Date()
                                    userAccount.save().then((usersaved) => {
                                        if (usersaved) {
                                            DB.account.findOne({ userName: userUpdated.superadmin }).then((masterAccount) => {
                                                var withdraw = new DB.withdraw({
                                                    userName: masterUpdated.userName,
                                                    accountHolderName: masterUpdated,
                                                    withdrawIn: userUpdated,
                                                    withdrawInName: userUpdated.userName,
                                                    amount: req.body.PL_Chips,
                                                    balance: masterUpdated.walletBalance,
                                                    cash: true



                                                })

                                                withdraw.save()
                                                masterAccount.withdrawTransaction.push(withdraw)
                                                masterAccount.walletBalance = parseInt(masterUpdated.walletBalance) - parseInt(req.body.PL_Chips)
                                                userAccount.lastWithdrawDate = new Date()
                                                userUpdated.save()
                                                masterAccount.save().then((mastersaved) => {
                                                    if (mastersaved) {
                                                        return res.send({ status: true, message: "Wallet Updated" })

                                                    }
                                                })

                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })

                }
            })



        }
        else {

            return res.send({ status: true, message: "no chips for settlements" })

        }

    }
    catch (error) {

        console.log(error)

    }

}


//update exposure info
exports.updateExposure = (req, res) => {

    DB.exposureInfo.findOne({ userid: req.body.userid, eventID: req.body.eventID }).then((exposureIn) => {
        if (exposureIn) {

            exposureIn.remove();

            var exposureInfo = new DB.exposureInfo({
                userid: req.body.userid,
                eventID: req.body.eventID,
                runnersData: req.body.runnersData,
                marketType: req.body.marketType,

            })

            exposureInfo.save().then((saved) => {
                if (saved) {
                    return res.send({ status: true, message: "exposure info created successfully" })
                }

            })

        }

        else {


            var exposureInfo = new DB.exposureInfo({
                userid: req.body.userid,
                eventID: req.body.eventID,
                runnersData: req.body.runnersData,
                marketType: req.body.marketType,

            })

            exposureInfo.save().then((saved) => {
                if (saved) {
                    return res.send({ status: true, message: "exposure info created successfully" })
                }

            })

        }

    })

}

exports.getEventExposure = (req, res) => {

    DB.exposureInfo.findOne({ userid: req.body.userid, eventID: req.body.eventID }).then((exposureIn) => {
        if (exposureIn) {
            return res.send(exposureIn)

        }

    })

}

exports.getTotalExposure = (req, res) => {
    DB.exposureInfo.find({ userid: req.body.userid }).then((exposureIn) => {
        if (exposureIn) {

            return res.send(exposureIn)

        }

    })

}

// function importFancyOddsData () {
//     setTimeout(function(){
//         Request.get({
//         "headers": {"content-type": "application/json" },
//         "url": "http://65.1.37.38:4000/api/storeFancyOddsCron",
//         }, (error,response,body) => {
//             if(error) {
//                 return console.log(error);
//             }
//             console.log("Import data again");
    
//         })
//     }, 60000);
// }
// R SHARMA BOUNDARIES 2 done
// S GILL RUN 2 done
// FALL OF 1ST WKT IND 2 done
// ONLY 1 OVER RUN IND 2 done
// R SHARMA RUN 2 done
// S GILL BOUNDARIES 2 done
// 15 OVER RUN

// function fancyOddsStringCalc(stringData){
//     if (stringData.includes('BOUNDARIES')) {
//         let playerName = stringData.split('BOUNDARIES')[0];
//         return ['BOUNDARIES', playerName];
//     } else if (stringData.includes('RUN') && !stringData.includes('INN') && !stringData.includes('OVER')) {
//         let playerName = stringData.split('RUN')[0]
//         return ['RUN', playerName];
//     } else if(stringData.includes('FALL OF')){
//         let d = stringData.split('FALL OF')[1][1];
//         return ['FALL OF', d];
//     } else if (stringData.includes('RUN') && stringData.includes('ONLY') && stringData.includes('OVER')){
//         let d = stringData.split('ONLY')[1].split(" ")[1];
//         return ['ONLY',d];
//     } else if (stringData.includes('RUN') && !stringData.includes('ONLY') && stringData.includes('OVER')){
//         let d = stringData.split('OVER RUN')[0];
//         return ['OVER RUN', d];
//     } else{
//         return 'Manual';
//     }
// }
