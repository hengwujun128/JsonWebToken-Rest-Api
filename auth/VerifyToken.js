var jwt = require('jsonwebtoken');
var config = require('../config');
//You can now add the VerifyToken middleware to any chain of functions 
//and be sure the endpoints are secured. Only users with verified tokens can access the resources!
function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({
      auth: false,
      message: 'No token provided.'
    });
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err)
      return res.status(500).send({
        auth: false,
        message: 'Failed to authenticate token.'
      });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}
module.exports = verifyToken;
/**
 * 
 * We’re going to use this function as a custom middleware to check if a token exists 
 * and whether it is valid. 
 * After validating it, we add the decoded.id value to the request (req) variable
 * 
 * 
 */
//