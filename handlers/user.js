var jwt = require('jsonwebtoken');
var db = require('./../mongoose/mongoose.js');
var secret = require('./../config/secret.js');
var User = db.User;
var internals = {};

internals.login = function(req, res){
  // ID
  var id = req.body.id || '';
  if(typeof id !== "string"){
    return res.send({error: 'Uncorrect identifier'},400);
  }
  var isEmail = id === id.match(/[a-z0-9]*@[a-z0-9]*\.[a-z]*/i);
  // Password
  var password = req.body.password || '';
  if(typeof password !== "string" || password.length < 6){
    return res.send({error: 'Password too short'},400);
  }

  // Find user
  var query = isEmail ? {email: id} : {username: id};
  User.findOne(query, function(err,user){
    // Check for errors
    if(err){
      return res.send({error: err});
    }
    // Check for user
    if(!user){
      return res.send({error: 'User not found'},400);
    }
    // Check for password
    user.comparePassword(password, function(err, isValid){
      if(err){
        return res.send({error: err});
      }

      if(!isValid){
        return res.send({error: 'Wrong password'},400);
      }

      // Create token
      var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
      res.send({token: token});
    });
  });
};

internals.signup = function(req, res){
  var user = {};
  // E-mail
  user.email = req.body.email || '';
  if(typeof user.email !== "string" || user.email !== user.email.match(/[a-z0-9]*@[a-z0-9]*\.[a-z]*/i)){
    return res.send({error: 'E-mail uncorrect'},400);
  }
  // Password
  user.password = req.body.password || '';
  if(typeof user.password !== "string" || user.password.length < 6){
    return res.send({error: 'Password too short'},400);
  }
  // Username
  user.username = req.body.username || '';
  if(typeof user.username !== "string" || user.username.length < 3){
    return res.send({error: 'Username too short'},400);
  }

  // Find if username and email already exist
  if(Ingredient.where({username: user.username}).count()){
    return res.send({error: "Username already in use"});
  }
  if(Ingredient.where({email: user.email}).count()){
    return res.send({error: "E-mail already in use"});
  }

  // Create user
  var newUser = new User(user);
  newUser.save(function(err){
    if(err){
      res.send({error: err});
    } else{
      var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
      res.send({success: true, token: token});
    }
  });
};

module.exports = internals;
