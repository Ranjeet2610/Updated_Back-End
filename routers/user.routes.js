var Auth = require('../controllers/user.controller');
var Account = require('../controllers/account.controller');
var Token = require('../middleware/authentication');

// defined routing for auth module.
module.exports = function(router) {
    router.post('/createAccount', Auth.createUser);
    router.post('/login', Auth.login);
    router.post('/token', Auth.getRefreshToken);
    router.get('/getUsers',Token.checkToken, Auth.getUsers);
    router.get('/getMasters',Token.checkToken, Auth.getMasters);
    router.get('/getBlockUsers',Token.checkToken, Auth.getBlockUsers);
    router.get('/getBlockMasters',Token.checkToken, Auth.getBlockMasters);
    router.get('/getBlockAdmins',Token.checkToken, Auth.getBlockAdmins);
    router.get('/getAdmins',Token.checkToken, Auth.getAdmins);
    router.post('/closeUser',Token.checkToken, Auth.closeUser);
    router.post('/openUser',Token.checkToken, Auth.openUser);
    router.post('/lockUser',Token.checkToken, Auth.lockUser);
    router.post('/lockUnlockBetting',Token.checkToken, Auth.lockUnlockBetting);
    router.post('/getSuperAdminClosedAdmins',Token.checkToken, Auth.getSuperAdminClosedAdmins);
    router.post('/getAdminClosedMasters',Token.checkToken, Auth.getAdminClosedMasters);
    router.post('/getMasterClosedUsers',Token.checkToken, Auth.getMasterClosedUsers);
    router.post('/lockMatchOdds',Token.checkToken, Auth.lockMatchOdds);
    router.post('/enableFancyOdds',Token.checkToken, Auth.enableFancyOdds);
    router.post('/visibleFancyOdds',Token.checkToken, Auth.visibleFancyOdds);
    router.post('/visibleFancyRunners',Token.checkToken, Auth.visibleFancyRunners);
    router.post('/adminUpDown',Token.checkToken, Auth.adminUpDown);
    router.post('/superAdminUpDown',Token.checkToken, Auth.superAdminUpDown);
    router.post('/userPL',Token.checkToken, Auth.userPL);
    router.post('/adminUserPL',Token.checkToken, Auth.adminUserPL);
    router.post('/superAdminUserPL',Token.checkToken,Token.checkToken, Auth.superAdminUserPL);
    router.post('/updateExposure',Token.checkToken, Account.updateExposure);
    router.post('/getEventExposure',Token.checkToken, Account.getEventExposure);
    router.post('/getTotalExposure',Token.checkToken, Account.getTotalExposure);

    

    

    
    
    
    

    router.post('/getMasterUsers',Token.checkToken, Auth.getMasterUsers);
    router.post('/getAdminMasters',Token.checkToken, Auth.getAdminMasters);
    router.post('/getSuperAdminAdmins',Token.checkToken, Auth.getSuperAdminAdmins);
    router.post('/changePassword',Token.checkToken, Auth.changePassword);
    router.post('/changePasswordByUser',Token.checkToken, Auth.changePasswordByUser);
    router.post('/marketTypeData',Token.checkToken, Auth.marketTypeData);
    router.post('/fancyMarketTypeData',Token.checkToken, Auth.fancyMarketTypeData);
    router.post('/setUserSportsInfo',Token.checkToken, Auth.setUserSportsInfo);


    

    //defined routing for third party customized Api
    router.post('/getLiveSports',Token.checkToken, Auth.getLiveSports);
    router.get('/getLiveCompetitions/:id',Token.checkToken, Auth.getLiveCompetitions);
    router.post('/getLiveEvents', Token.checkToken, Auth.getLiveEvents);
    router.post('/listMarketOdds', Token.checkToken, Auth.listMarketOdds);
    router.post('/listMarketType', Token.checkToken, Auth.listMarketType);

    //defined routing for database store Api
    router.post('/storeLiveEvents',Auth.storeLiveEvents);
    router.post('/storeMarketType', Auth.storeMarketType);
    router.post('/ActiveLiveEvents',Token.checkToken, Auth.ActiveLiveEvents);
    router.get('/LiveEventsForUser', Auth.LiveEventsForUser);
    router.post('/getDbliveEvents',Token.checkToken, Auth.getDbliveEvents);
    

// defined routing for account module.
    router.post('/creditAmountByMaster',Token.checkToken, Account.creditAmountByMaster);
    router.post('/creditAmountByAdmin',Token.checkToken, Account.creditAmountByAdmin);
    router.post('/creditAmountBySuperAdmin',Token.checkToken,Account.creditAmountBySuperAdmin);
    router.get('/getAllDeposit',Token.checkToken, Account.getAllDeposit);
    router.post('/debitAmountByMaster',Token.checkToken, Account.debitAmountByMaster);
    router.post('/debitAmountByAdmin',Token.checkToken, Account.debitAmountByAdmin);
    router.post('/debitAmountBySuperAdmin',Token.checkToken, Account.debitAmountBySuperAdmin);
    router.get('/getAllwithdraw',Token.checkToken, Account.getAllWithdraw);
    router.get('/getAllAccountStament',Token.checkToken, Account.getAllAccountStament);
    router.post('/getAccountStament',Token.checkToken, Account.getAccountStament);
    router.post('/placeBet',Token.checkToken, Account.placeBet);
    router.post('/placeFancyBet',Token.checkToken,Account.placeFancyBet);
    
    //router.get('/BetSettleFancyOdds', Account.BetSettleFancyOdds);
    //router.get('/BetSettleMatchOdds', Account.BetSettleMatchOdds);
    
    
    router.post('/updateUserSportsInfo',Token.checkToken, Auth.updateUserSportsInfo);
    router.post('/updateUserChipsInfo',Token.checkToken, Auth.updateUserChipsInfo);
    router.post('/userSportsInfo',Token.checkToken, Auth.userSportsInfo);
    router.post('/userChipsInfo',Token.checkToken, Auth.userChipsInfo);
    
    router.post('/getMyprofile',Token.checkToken, Auth.getMyprofile);
    router.post('/updateMyprofile',Token.checkToken, Auth.updateMyprofile);
    router.post('/getUserOpenBetHistory',Token.checkToken, Account.getUserOpenBetHistory);
    router.post('/getUserOpenfancyBetHistory',Token.checkToken, Account.getUserOpenfancyBetHistory);
    router.post('/getUserOpenfancyBetHistoryfront',Token.checkToken, Account.getUserOpenfancyBetHistoryfront);
    
    router.post('/getMasterSectionOpenBetHistory',Token.checkToken, Account.getMasterSectionOpenBetHistory);
    router.post('/getAdminSectionOpenBetHistory',Token.checkToken, Account.getAdminSectionOpenBetHistory);
    router.post('/getSuperAdminSectionOpenBetHistory', Token.checkToken,  Account.getSuperAdminSectionOpenBetHistory);


    
    

    
    router.post('/getMasterOpenBetHistory',Token.checkToken, Account.getMasterOpenBetHistory);
    router.post('/getAdminOpenBetHistory',Token.checkToken, Account.getAdminOpenBetHistory);
    router.post('/getsuperAdminOpenBetHistory',Token.checkToken,Account.getsuperAdminOpenBetHistory);

    
    router.post('/getallUserOpenBetHistory',Token.checkToken, Account.getallUserOpenBetHistory);
    router.post('/getUserSettledBetHistory',Token.checkToken, Account.getUserSettledBetHistory);
    router.post('/getallUserSettledBetHistory',Token.checkToken, Account.getallUserSettledBetHistory);
    router.post('/getUserProfitAndLoss',Token.checkToken, Account.getUserProfitAndLoss);
    router.post('/getUserSectionProfitAndLoss',Token.checkToken, Account.getUserSectionProfitAndLoss);
    router.post('/setManualOdds',Token.checkToken, Account.setManualOdds);
    router.post('/getManualOdds',Token.checkToken, Account.getManualOdds);
    

    router.post('/adminProfitAndLoss',Token.checkToken, Account.adminProfitAndLoss);
    router.post('/superAdminProfitAndLoss',Token.checkToken, Account.superAdminProfitAndLoss);
    router.post('/masterProfitAndLoss',Token.checkToken, Account.masterProfitAndLoss);
    router.post('/chipSettlementForUser',Token.checkToken, Account.chipSettlementForUser);
    router.post('/chipSettlementForMaster', Token.checkToken,Account.chipSettlementForMaster);
    router.post('/chipSettlementForAdmin',Token.checkToken, Account.chipSettlementForAdmin);

    router.post('/getUserDetailsByEmail',Token.checkToken,Auth.getUserDetailsByEmail)

    //code for news added by shreesh
    router.post('/news',Token.checkToken, Auth.addNews);
    router.get('/news',Token.checkToken, Auth.getNews);
    router.put('/updatenews',Token.checkToken, Auth.updateNews);
    router.delete('/deletenews',Token.checkToken, Auth.deleteNews);

    //code for news added by shreesh
    router.get('/liveCricketScore',Token.checkToken, Auth.getLiveCricketScore);

    router.patch('/adminWalletBalance',Token.checkToken, Auth.updateAdminWalletbalance);

    // Code by harry
    router.get('/getAllBetting', Token.checkToken, Auth.getAllBetting);
    router.get('/getAllMasterandSupermaster', Token.checkToken, Auth.getAllMasterandSupermaster);
    router.get('/getBettingBasedOnMaster', Token.checkToken, Auth.getBettingBasedOnMaster);
    router.get('/getBettingBasedOnSuperMaster', Token.checkToken, Auth.getBettingBasedOnSuperMaster);
    router.patch('/suspendOrIsBallRunningFancyOdds', Token.checkToken, Auth.suspendOrIsBallRunningFancyOdds);
    router.put('/allsuspendAndIsballrunning', Token.checkToken, Auth.allsuspendAndIsballrunning);
    router.get('/storeFancyOddsCron', Auth.storeFancyOddsCron);
    router.post('/matchOddsBetSettlement',Token.checkToken, Account.matchOddsBetSettlement);
    router.post('/fancyOddsBetSettlement',Token.checkToken, Account.fancyOddsBetSettlement);
    router.get('/getBettedFancyOdds',Token.checkToken, Auth.getBettedFancyOdds);
    router.get('/getuserbasedOnAdmin',Token.checkToken, Auth.getuserbasedOnAdmin);
    router.delete('/dumpNonBettingFancy', Auth.dumpNonBettingFancy);
    router.get('/getUserInfo',Token.checkToken, Auth.getUserInfo);
    router.post('/addbetplacetime', Token.checkToken, Auth.addbetplacetime);
    router.get('/getbetplacetime', Token.checkToken, Auth.getbetplacetime);
    router.put('/activeInactiveNews', Token.checkToken, Auth.activeInactiveNews);
    router.get('/getactiveNews', Token.checkToken, Auth.getactiveNews);
    //router.get('/storeAllSports',Token.checkToken,  Auth.storeAllSports);
    router.put('/sportEnableDisable', Token.checkToken, Auth.sportEnableDisable);
    router.get('/getallsports', Token.checkToken, Auth.getallsports);
    router.get('/getChipsData', Token.checkToken, Auth.getChipsData);
    router.post('/getLiveMatchOdds', Token.checkToken, Auth.getLiveMatchOdds);
    router.post('/getAllFancyStack', Token.checkToken, Auth.getAllFancyStack);
    router.get('/storeMatchOddsCron',Auth.storeMatchOddsCron);
    router.put('/storeMatchOdds',Token.checkToken, Auth.storeMatchOdds);
    
    }