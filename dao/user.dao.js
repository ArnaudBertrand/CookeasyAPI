var User = require('./../mongoose/user.js');

function UserDao() {
  this.login = function (query,callback){
    User.findOne(query,function(err,user){
      if(err) return callback(err,null,null);
      if(!user) return callback(null,false,{userId: "User not found"});

      user.comparePassword(password, function(err, isValid){
        if(err) return callback(null,false,null);
        if(!isValid) return callback(null,false,{password: "Wrong password"});

        callback(null,true,user);
      });

    });
  }
}

module.exports = UserDao;