var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var IngredientSchema = new Schema({
  name: { type: String, required: true, index: { unique: true } },
  type: { type: Number, required: true },
  tip: { type: String },
  picture: { type: String }
});

module.exports = Mongoose.model('Ingredient', IngredientSchema);