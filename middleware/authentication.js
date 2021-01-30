const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
      token = token.slice(7);
      jwt.verify(token, "xyz1235", (err, decoded) => {
        if (err) {
          return res.send(401);
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.sendStatus(401);
    }
  }
};
