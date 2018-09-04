var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
// you’re binding the layout of the schema to the model which is named 'User' 
//
mongoose.model('User', UserSchema);

module.exports = mongoose.model('User');