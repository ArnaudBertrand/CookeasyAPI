var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true }
});

UserSchema.pre('save', function(next) {
  var user = this;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')){
    return next();
  }

  // Hash the password
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash) {
    if (err){
      return next(err);
    }
    // Override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  console.log('PWD test');
  console.log(candidatePassword);
  console.log(this.password);
  bcrypt.hash(candidatePassword, SALT_WORK_FACTOR,function(err,hash){
    if (err){
      return cb(err);
    }
    console.log(hash);
    cb(null, hash === this.password);
  });
  /**bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    console.log(isMatch);
    if (err){
      return cb(err);
    }
    cb(null, isMatch);
  });*/
};

module.exports = mongoose.model('User', UserSchema);