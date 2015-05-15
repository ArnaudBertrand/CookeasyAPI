var configs = {};

configs.userLogin = {
  validate: { payload: {
      username: Joi.string().min(3),
      password: Joi.string().min(3)
  }}};

configs.userSignup = {
  validate: { payload: {
      username: Joi.string().min(3),
      password: Joi.string().min(3)
  }}};

module.exports = configs;