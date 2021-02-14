const jwt = require("jsonwebtoken");
var DB = require('../models/user.model');
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      let tokenKey = token.split(" ")[1];
      DB.user.findOne({token:tokenKey}).then((user)=>{
        if(user == null){
          return res.sendStatus(401);
        }
        token = token.slice(7);
        jwt.verify(token, "xyz1235", (err, decoded) => {
          if (err) {
            return res.send(401);
          } else {
            req.decoded = decoded;
            next();
          }
        });
      });
    } else {
      return res.sendStatus(401);
    }
  }
};
