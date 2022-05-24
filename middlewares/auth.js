const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    console.log(req.session);
    if(req.session.userId) {
      next();
    } else {
      return res.status(401).json({
        message: "Votre session a expiré"
      });
    }
};