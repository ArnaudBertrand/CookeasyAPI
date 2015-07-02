var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var IngredientSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  new: {type: Boolean, default: true},
  picture: String,
  recipes: [String],
  type: Number,
  tip: String
});

module.exports = Mongoose.model('Ingredient', IngredientSchema);