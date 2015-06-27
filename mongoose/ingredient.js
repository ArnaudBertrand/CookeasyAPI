var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var IngredientSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  type: Number,
  tip: String,
  picture: String
  new: {type: Boolean, default: true}
});

module.exports = Mongoose.model('Ingredient', IngredientSchema);