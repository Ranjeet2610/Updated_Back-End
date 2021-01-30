const mongoose = require('mongoose');


var userSchema = new mongoose.Schema({
  createdAt: {type:String, default: new Date().toISOString().substring(0, 10)},
  status: {type:Boolean, default:false},
  Name:{type:String},
  userName:{type:String, required:true},
  master:{type:String},
  admin:{type:String},
  superadmin:{type:String},
  password:{type:String, required:true},
  passwordString:{type:String, required:true},
  walletBalance:{type:Number,default:0},
  exposure:{type:Number,default:0},
  profitLossChips:{type:Number,default:0},
  creditLimit:{type:Number, required:true,default:0},
  creditGiven:{type:Number, required:true,default:0},
  freeChips:{type:Number,default:0},
  enableBetting:{type:Boolean,default:false},
  Master:{type:Boolean,default:false},
  Admin:{type:Boolean,default:false},
  superAdmin:{type:Boolean,default:false},
  blocked:{type:Boolean,default:false},
  Commission:{type:Number,default:0},
  sessionCommission:{type:Number,default:0},
  ref:[{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  userSportsInfo:[{type: mongoose.Schema.Types.ObjectId, ref: 'userSportsInfo'}],
  ongoingCasinoGame:{type: mongoose.Schema.Types.ObjectId, ref: 'Casino'},
  completedCasinoGame:[{type: mongoose.Schema.Types.ObjectId, ref: 'Casino'}],
  winCasinoGame:[{type: mongoose.Schema.Types.ObjectId, ref: 'Casino'}],
  account:{type: mongoose.Schema.Types.ObjectId, ref: 'account'}
})





var userSportsInfoSchema = new mongoose.Schema({
  cricketmaxStacks:{type:Number,default:50000},
  cricketminStacks:{type:Number, default:100},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  cricketmaxProfit:{type:Number,default:50000},
  cricketmaxLoss:{type:Number,default:50000},
  cricketPreInplayProfit:{type:Number,default:0},
  cricketPreInplayStack:{type:Number,default:1},
  userName:{type:String,unique:false},
  cricketmaxOdds:{type:Number,default:100},
  cricketminOdds:{type:Number,default:1.01},
  fancymaxStacks:{type:Number,default:100},
  fancyminStacks:{type:Number, default:50000},
  fancymaxProfit:{type:Number,default:100}

})
// 
var exposureInfoSchema = new mongoose.Schema({
  
  userid:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  eventID:{type:Number},
  runnersData:{type:Array},
  marketType:{type:String}



})
// edit stakes
var userChipsInfoSchema = new mongoose.Schema({
  chipName1:{type:Number,default:500},
  chipName2:{type:Number, default:2000},
  chipName3:{type:Number,default:5000},
  chipName4:{type:Number,default:25000},
  chipName5:{type:Number,default:50000},
  chipvalue1:{type:Number,default:500},
  chipvalue2:{type:Number,default:2000},
  chipvalue3:{type:Number,default:5000},
  chipvalue4:{type:Number,default:25000},
  chipvalue5:{type:Number,default:50000},
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  userName:{type:String,unique:false},
})

var depositSchema = new mongoose.Schema({
  createdAt: {type:String, default: new Date().toISOString().substring(0, 10)},
  createdDate  :{type:String, default: new Date()},
  amount:{type:Number,required:true, default:0},
  accountHolderName:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  depositedByName:{type:String},
  depositedBy:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  userName:{type:String,unique:false},
  balance:{type:Number,default:0},
  cash:{type:Boolean,default:false},

})
var withdrawSchema = new mongoose.Schema({
  createdAt: {type:String, default: new Date().toISOString().substring(0, 10)},
  createdDate  :{type:String, default: new Date()},
  amount:{type:Number, default:0},
  accountHolderName:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  withdrawInName:{type:String},
  withdrawIn:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  userName:{type:String,unique:false},
  balance:{type:Number,default:0},
  cash:{type:Boolean,default:false},


})
var accountSchema = new mongoose.Schema({
  createdAt: {type:String, default: new Date().toISOString().substring(0, 10)},
  userName:{type:String,unique:true},
  accountHolderName:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  casinotransaction:[{type: mongoose.Schema.Types.ObjectId, ref: 'casinoGame'}],
  cricketTransaction:[{type: mongoose.Schema.Types.ObjectId, ref: 'cricketGame'}],
  walletBalance:{type:Number,required:true, default:0},
  amountDepositedByMaster:{type:Number, required:true,default:0},
  amountwithdraw:{type:Number, required:true,default:0},
  lastDepositDate:{type:String},
  lastWithdrawDate:{type:String},
  userType:{type:Boolean,default:false},
  depositTransaction:[{type: mongoose.Schema.Types.ObjectId, ref: 'deposit'}],
  withdrawTransaction:[{type: mongoose.Schema.Types.ObjectId, ref: 'withdraw'}],
  // bettingTransaction:[{type: mongoose.Schema.Types.ObjectId, ref: 'betting'}],



})

//place bet cricket

var bettingSchema = new mongoose.Schema({
  createdAt: {type:String, default: new Date().toISOString().substring(0, 10)},
  createdDate  :{type:String, default: new Date()},
  clientName:{type:String,required:true},
  userid:{type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  IP:{type:String},
  betcode: {type: Number},
  description:{type:String,required:true},
  marketType:{type:String},
  selection:{type:String,required:true},
  bettype:{type:String,required:true},
  selectionID:{type:Number,required:true},
  marketID:{type:String,required:true},
  eventID:{type:Number,required:true},
  stack:{type:Number,required:true},
  odds:{type:Number,required:true},
  P_L:{type:Number},
  profit:{type:Number},
  device:{type:Number},
  liability:{type:Number},
  status:{type:String,required:true},


})
// event data

var eventSchema = new mongoose.Schema({
  eventId:{type:Number,default:0},
  eventName:{type:String,unique:false},
  OpenDate:{type:String,unique:false},
  active:{type:Boolean,default:false},
  eventType:{type: Number, default: 4}

})

// match odds

var matchOddSchema = new mongoose.Schema({
  eventId: {type:Number,default:0},
  marketId:{type:String,default:0},
  isEnabled:{type:Boolean,default:true},
  marketName:{type:String,unique:false},
  marketStartTime:{type:String,unique:false}

})
// fancy odds

var FancyOddSchema = new mongoose.Schema({
  eventId: {type:Number,default:0},
  marketId:{type:String,default:0},
  LayPrice:{type:String, default:0},
  LaySize:{type:String, default:0},
  BackPrice:{type:String, default:0},
  BackSize:{type:String, default:0},
  isEnabled:{type:Boolean,default:true},
  isVisible:{type:Boolean,default:false},
  isSuspended:{type:Boolean, default: false},
  isBallRunning:{type:Boolean, default: false},
  marketName:{type:String,unique:false},
  marketStartTime:{type:String,unique:false},
  active:{type:Boolean,default:true},
  status: {type: String, default:''}

})

// match runner
var matchRunnerSchema = new mongoose.Schema({
  marketId:{type:String,default:0},
  selectionId:{type:Number,default:0},
  runnerName:{type:String,unique:false}

})

// fancy runner

var FancyRunnerSchema = new mongoose.Schema({
  marketId:{type:String,default:0},
  selectionId:{type:Number,default:0},
  runnerName:{type:String,unique:false},
  isRunnersVisible:{type:Boolean,default:false},


})

var manualMatchOddSchema = new mongoose.Schema({
 eventID:{type:Number,default:0},
 odds1:{type:Number,default:0},
 odds2:{type:Number,default:0},
 odds3:{type:Number,default:0},
 odds4:{type:Number,default:0},
 odds5:{type:Number,default:0},
 odds6:{type:Number,default:0},

})
// 
bettingSchema.pre('save', function (next) {

  // Only increment when the document is new
  if (this.isNew) {
    betting.count().then(res => {
          this.betcode = res; // Increment count
          next();
      });
  } else {
      next();
  }
});

// 
userSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

//news
var newsSchema = new mongoose.Schema({
  newsID:{type:Number,default:0},
  newsTitle:{type:String,unique:false},
  active:{type:Boolean,default:false},},
  { timestamps: true });


const user = mongoose.model('user',userSchema)
const account = mongoose.model('account',accountSchema)
const deposit = mongoose.model('deposit',depositSchema)
const withdraw = mongoose.model('withdraw',withdrawSchema)
const betting = mongoose.model('betting',bettingSchema)
const event= mongoose.model('event',eventSchema)
const matchOdds= mongoose.model('matchOdds',matchOddSchema)
const FancyOdds= mongoose.model('FancyOdds',FancyOddSchema)
const matchRunner= mongoose.model('matchRunner',matchRunnerSchema)
const FancyRunner= mongoose.model('FancyRunner',FancyRunnerSchema)
const manualMatchOdds= mongoose.model('manualMatchOdds',manualMatchOddSchema)
const userSportsInfo= mongoose.model('userSportsInfo',userSportsInfoSchema)
const userChipsInfo= mongoose.model('userChipsInfo',userChipsInfoSchema)
const exposureInfo= mongoose.model('exposureInfo',exposureInfoSchema)
const news= mongoose.model('news',newsSchema)







module.exports = {userSchema,userSportsInfo,exposureInfo,userChipsInfo,user,account,deposit,withdraw,betting,event,matchOdds,manualMatchOdds,FancyOdds,matchRunner,FancyRunner,news}
