// The db.js makes sure the application connects to the database.

var mongoose = require('mongoose');
mongoose.connect('mongodb://hengwujun:hwj147258369@ds053894.mlab.com:53894/rest-api', {
  useNewUrlParser: true
});