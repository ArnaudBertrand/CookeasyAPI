var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 12;

/** Schema **/
var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

/** Validation **/
UserSchema.path('username').required(true, 'User needs a username');
UserSchema.path('email').required(true, 'User needs an e-mail address');
UserSchema.path('password').required(true, 'User needs a password');

/** Pre hooks **/
UserSchema.pre('save', function(next) {
  var user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')){
    return next();
  }

  // Hash the password
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
    if (err) return next(err);

    // Override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

/** Statics **/
UserSchema.methods = {
  login: login,
  exists: exists
};

/** Statics functions **/
function login(selector, password, cb) {
  this.findOne(selector,function(err,user){
    if(err) return callback(err);
    if(!user) return callback(null,{message: "User not found"});

    bcrypt.compare(password, this.password, function(err, isMatch) {
      if(err) return cb(err);
      if(!isMatch) return callback(null,{message: "Wrong password"});
      cb(null, null, user);
    });
  });
}

function exists(user,callback){
  var users = this;
  users.where({username: user.username}).count(function(err, count){
    if(err) return callback(err);
    if(count) return callback(null,{username: "Username already in use"});

    users.where({email: user.email}).count(function(err, count){
      if(err) return callback(err);
      if(count) return callback(null,{email: "E-mail already in use"});

      callback(null,null);
    });
  });
}

Mongoose.model('User', UserSchema);