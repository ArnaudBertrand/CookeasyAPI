var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var RecipeSchema = new Schema({
  name: { type: String, required: true },
  course: { type: Number, required: true },
  type: { type: Number, required: true },
  ingredients: [],
  steps: [],
  author: String
});

module.exports = Mongoose.model('Recipe', RecipeSchema);