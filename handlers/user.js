var jwt = require('jsonwebtoken'),
    secret = require('./../config/secret.js'),
    User = require('./../mongoose/user.js');

function UserHandler (){
  this.login = function(req, res){
    // ID
    var id = req.body.id || '';
    if(typeof id !== "string"){
      return res.send({error: 'Uncorrect identifier'},400);
    }
    var isEmail = (id == id.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[a-z]{2,4}/i));
    // Password
    var password = req.body.password || '';
    if(typeof password !== "string"){
      return res.send({error: 'Incorrect password'},400);
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

  this.signup = function(req, res){
    var user = {};
    // E-mail
    user.email = req.body.email || '';
    if(typeof user.email !== "string" || user.email != user.email.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[a-z]{2,4}/i)){
      return res.send({error: 'E-mail uncorrect'},400);
    }
    // Password
    user.password = req.body.password || '';
    if(typeof user.password !== "string" || user.password.length < 6){
      return res.send({error: 'Password too short'},400);
    }
    // Username
    user.username = req.body.username || '';
    if(typeof user.username !== "string" || user.username.length < 2){
      return res.send({error: 'Username too short'},400);
    }

    // Find if username and email already exist
    User.where({username: user.username}).count(function(err, count){
      if(count){
        return res.send({error: "Username already in use"});
      }
      User.where({email: user.email}).count(function(err, count){
        if(count){
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
      });
    })

  };

  this.getFromUsername = function(req,res){
    var username =  req.params.username || '';
    if(typeof username !== 'string' || username.length == 0){
      return res.send({error: 'No username'},400);
    }

    var projection = {
      activities: 1,
      description: 1,
      dob: 1,
      level: 1,
      location: 1,
      picture: 1,
      username: 1
    };

    User.findOne({username: username},projection,function(err,user){
      if(err){
        res.send({error: err});
      }
      res.send(user);
    });
  };

  this.update = function(req,res){
    var user = req.body;

    var keys = Object.keys(user);
    for(var i = 0; i<keys.length; i++){
      if(key)
        var field = user[keys[i]];
    }

    return res.send('ok');
  };
}

module.exports = UserHandler;
