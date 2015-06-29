var jwt = require('jsonwebtoken'),
    secret = require('./../config/secret.js'),
    UserDao = require('./../dao/user.dao.js');

var UserHandler = {
  login: login,
  getFromUsername: getFromUsername,
  signup: signup,
  update: update
};

function login (req, res, next){
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

  UserDao.login(query,password,function(err,fail,user){
    if(err) return next(err);
    if(fail) return res.send(fail,400);
    // Create and send token
    var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
    res.send({token: token});
  });
}

function getFromUsername (req,res){
  var username =  req.params.username || '';
  if(typeof username !== 'string' || username.length == 0){
    return res.send({error: 'No username'},400);
  }

  UserDao.getFromUsername(username,function(err,fail,user){
    if(err) return next(err);
    if(fail) return res.send(fail,400);
    res.send(user);
  })
}

function signup (req, res){
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

  UserDao.signup(user,function(err,fail){
    if(err) return next(err);
    if(fail) return res.send(fail,400);
    // Create and send token
    var token = jwt.sign(user, secret.secretToken, { expiresInMinutes: 60 });
    res.send({success: true, token: token});
  });
}

function update (req,res){
  var user = req.body;

  var keys = Object.keys(user);
  //for(var i = 0; i<keys.length; i++){
  //  var key()
  //    var field = user[keys[i]];
  //}
  console.log(keys);
  return res.send('ok');
}

module.exports = UserHandler;
