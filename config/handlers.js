var db = require('./../mongoose/mongoose.js');
var User = db.User;
var internals = {};

// Routes handlers
internals.get = function (request, reply) {
  reply('Home page');
};

internals.contact = function (request, reply) {
  reply('Contact page');
  console.log('test');
};

internals.userLogin = function(request, reply){
  User.findOne({username: request.payload.username}, function(err,user){
    if(err){
      reply({success: false, error: err});
    }
    if(!user){
      reply({success: false, error: 'User not found'});
    } else {
      user.comparePassword(request.payload.password.trim(), function(err, isValid){
        if(err){
          reply({success: false, error: err});
        } else if(!isValid){
          reply({success: false, error: 'Wrong password'});
        } else {
          reply({success: true});
        }
      });
    }
  });
};

internals.userSignup = function(request, reply){  
  var newUser = new User({username: request.payload.username, password: request.payload.password.trim()});
  newUser.save(function(err){
    if(err){
      reply({saved: false, error: err});
    } else{
      reply({saved: true});
    }
  });
};

internals.test = function(request, reply){
  console.log(request.payload);
  console.log('test ok')
}

module.exports = internals;