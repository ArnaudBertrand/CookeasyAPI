var db = require('./../mongoose/mongoose.js');
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
  User.findOne({username: req.params.username}, function(err,user){
    // Check for errors
    if(err){
      return res.send({success: false, error: err});
    }
    // Check for user
    if(!user){
      return res.send({success: false, error: 'User not found'});
    }
    // Check for password
    user.comparePassword(req.params.password.trim(), function(err, isValid){
      if(err){
        res.send({success: false, error: err});
      } else if(!isValid){
        res.send({success: false, error: 'Wrong password'});
      } else {
        res.send({success: true});
      }
    });
  });
};

internals.userSignup = function(req, res){  
  var newUser = new User({username: req.params.username, password: req.params.password.trim()});
  newUser.save(function(err){
    if(err){
      res.send({saved: false, error: err});
    } else{
      res.send({saved: true});
    }
  });
};

module.exports = internals;