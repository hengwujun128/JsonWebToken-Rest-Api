/**
 * this file instanciate  expres and  return an express Instance
 * 
 * 
 */

var express = require('express');
var app = express();
var db = require('./db');

/**
 * every module contains two section,one is modal ,and the other is controller
 * 
 * 
 * 
 */
// user module
var UserController = require('./user/UserController');
app.use('/users', UserController);
// auth module
var AuthController = require('./auth/AuthController');
app.use('/api/auth', AuthController);
module.exports = app;