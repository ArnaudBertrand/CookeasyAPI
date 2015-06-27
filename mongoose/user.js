var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema,
  bcrypt = require('bcrypt'),
  SALT_WORK_FACTOR = 12;

var UserSchema = new Schema({
  username: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
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
    if (err) return next(err);

    // Override the cleartext password with the hashed one
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err){
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = Mongoose.model('User', UserSchema);
