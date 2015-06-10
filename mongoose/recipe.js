var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var RecipeSchema = new Schema({
  name: { type: String, required: true },
  author: String,
  course: { type: Number, required: true },
  createdOn: Number,
  difficulty: Number,
  comments: [],
  imageUrl: String,
  ingredients: [],
  nbPerson: Number,
  pictures: Schema.Types.Mixed,
  pictures: [],
  steps: [],
  time: Number,
  utensils: []
});

module.exports = Mongoose.model('Recipe', RecipeSchema);
