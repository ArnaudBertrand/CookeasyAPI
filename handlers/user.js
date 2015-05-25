var jwt = require('jsonwebtoken');
var db = require('./../mongoose/mongoose.js');
var secret = require('./../config/secret.js');
var User = db.User;
var internals = {};

internals.login = function(req, res){
  var email = req.body.email || '';
  var password = req.body.password || '';
  // Check params
  if(email == '' || password == ''){
    return res.send(401);
  }
  // Find user
  User.findOne({email: email}, function(err,user){
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

internals.signup = function(req, res){
  var email = req.body.email || '';
  var username = req.body.username || '';
  var password = req.body.password || '';
  // Check params
  if(email == '' || username == '' || password == ''){
    return res.send(401);
  }
  // Find if user exists
  User.findOne({email: email}, function(err,user){
    if(user){
      return res.send({error: 'E-mail already exist'});
    }

    var newUser = new User({email: email, username: username, password: password});
    newUser.save(function(err){
      if(err){
        res.send({error: err});
      } else{
        var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
        res.send({success: true, token: token});
      }
    });
  });
};

module.exports = internals;
