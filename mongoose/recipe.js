var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var RecipeSchema = new Schema({
  name: { type: String, required: true },
  author: String,
  course: { type: Number, required: true },
  difficulty: Number,
  comments: [],
  imageUrl: String,
  ingredients: [],
  pictures: [],
  steps: [],
  utensils: []
});

module.exports = Mongoose.model('Recipe', RecipeSchema);
