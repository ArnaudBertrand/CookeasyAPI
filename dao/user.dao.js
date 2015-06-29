var User = require('./../mongoose/user.js');

var UserDao = {
  getFromUsername: getFromUsername,
  login: login,
  signup: signup
};

function getFromUsername (username,callback){
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
    if(err) return callback(err);
    if(!user) return callback(null,{user: 'User not found'});
    callback(null,null,user);
  });
}

function login (query,password,callback){
  User.findOne(query,function(err,user){
    if(err) return callback(err);
    if(!user) return callback(null,{message: "User not found"});

    user.comparePassword(password, function(err, isValid){
      if(err) return callback(err);
      if(!isValid) return callback(null,{message: "Incorrect password"});

      callback(null,null,user);
    });

  });
}

function signup (user,callback){
  User.where({username: user.username}).count(function(err, count){
    if(err) return callback(err);
    if(count) return callback(null,{username: "Username already in use"});

    User.where({email: user.email}).count(function(err, count){
      if(err) return callback(err);
      if(count) return callback(null,{email: "E-mail already in use"});

      var newUser = new User(user);
      newUser.save(function(err){
        if(err) return callback(err);

        callback(null,null,user);
      });
    });
  });
}

module.exports = UserDao;