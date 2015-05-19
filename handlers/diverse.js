var db = require('./../mongoose/mongoose.js');
var internals = {};


// Routes handlers
internals.home = function (req, res) {
  res.send('Home page');
};

internals.priv = function(req,res){
  res.send('Ok passed');
  console.log(req.user);
}

module.exports = internals;