var jwt = require('jsonwebtoken');
var db = require('./../mongoose/mongoose.js');
var secret = require('./secret.js');
var User = db.User;
var internals = {};


// Routes handlers
internals.get = function (req, res) {
  res.send('Home page');
};

internals.contact = function (req, res) {
  res.send('Contact page');
  console.log('test');
};

internals.userLogin = function(req, res){
  var username = req.body.username || '';
  var password = req.body.password || '';
  // Check params
  if(username == '' || password == ''){
    return res.send(401);
  }
  // Find user
  User.findOne({username: username}, function(err,user){
    // Check for errors
    if(err){
      return res.send({success: false, error: err});
    }
    // Check for user
    if(!user){
      return res.send({success: false, error: 'User not found'});
    }
    // Check for password
    user.comparePassword(password, function(err, isValid){
      if(err){
        res.send({success: false, error: err});
      } else if(!isValid){
        res.send({success: false, error: 'Wrong password'});
      } else {
        var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
        res.send({success: true, token: token});
      }
    });
  });
};

internals.userSignup = function(req, res){  
  var username = req.body.username || '';
  var password = req.body.password || '';
  // Check params
  if(username == '' || password == ''){
    return res.send(401);
  }
  // Find if user exists
  User.findOne({username: username}, function(err,user){
    console.log(err);
    console.log(user);
    /**
    var newUser = new User({username: req.body.username, password: req.body.password.trim()});
    newUser.save(function(err){
      if(err){
        res.send({saved: false, error: err});
      } else{
        var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
        res.send({success: true, token: token});
      }
    });***/
  });
};

module.exports = internals;