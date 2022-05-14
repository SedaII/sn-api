const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {/* 
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid user ID";
    } else { 
      next();
    }
 */
    console.log(req.session);
    if(req.session.userId) {
      next();
    } else {
      return res.status(401).json({
        message: "Votre session a expiré"
      });
    }
};