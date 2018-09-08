// AuthController.js
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var VerifyToken = require('./VerifyToken');
// add middle to router
router.use(bodyParser.urlencoded({
  extended: false
}));
router.use(bodyParser.json());
// UserModel
var User = require('../user/User');


// jwt
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

// register
router.post('/register', function (req, res) {
  // 
  var hashedPassword = bcrypt.hashSync(req.body.password, 8);
  // take the hashed password, include name and email and create a new user.
  User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    },
    function (err, user) {
      if (err) return res.status(500).send("There was a problem registering the user.")
      // create a token for new user with id(id,secret,expiresIn)
      var token = jwt.sign({
        id: user._id
      }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).send({
        auth: true,
        token: token
      });
    });
});
// get the user id based on the token
router.get('/me', function (req, res, next) {
  // Here we’re expecting the token be sent along with the request in the headers. 
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({
    auth: false,
    message: 'No token provided.'
  });
  // This method decodes the token making it possible to view the original payload.
  // 使用 verify()方法对token 认证解密
  jwt.verify(token, config.secret, function (err, decoded) {
    if (err) return res.status(500).send({
      auth: false,
      message: 'Failed to authenticate token.'
    });

    // res.status(200).send(decoded);
    User.findById(
      decoded.id,
      // The password should never be returned with the other data about the user.
      // Let’s fix this. We can add a projection to the query and omit the password
      {
        password: 0
      },
      function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");

        res.status(200).send(user); //Comment this out!
        // next(user); // add this line for test middleware
      });
  });
});
// add VefifyToken middleware
router.get('/me2', VerifyToken, function (req, res, next) {
  User.findById(req.userId, {
    password: 0
  }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");

    res.status(200).send(user);
  });
});
// login
// It should check if a user with the given email exists at all.
// But also check if the provided password matches the hashed password in the database.
//  Only then will we want to issue a token.
router.post('/login', function (req, res) {
  User.findOne({
    email: req.body.email
  }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({
      auth: false,
      token: null
    });
    var token = jwt.sign({
      id: user._id
    }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({
      auth: true,
      token: token
    });
  });
});

// The logout endpoint is not needed.
// The act of logging out can solely be done through the client side.
router.get('/logout', function (req, res) {
  res.status(200).send({
    auth: false,
    token: null
  });
});
// add the middleware function
// router.use(function (user, req, res, next) {
//   res.status(200).send(user);
// });
module.exports = router