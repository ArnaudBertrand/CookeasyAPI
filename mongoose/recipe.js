var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var IngredientSchema = new Schema({
  name: {type: String, required: true, trim: true, lowercase: true},
  qte: {type: Number, min: 0},
  unit: String
});

var CommentSchema = new Schema({
  author: {type: String, required: true},
  createdOn: {type: Date, default: Date.now},
  mark: {type: Number, min: 1, max: 5},
  message: {type: String, required: true},
  updateOn: {type: Date, default: Date.now}
});

var RecipeSchema = new Schema({
  name: {type: String,required: true, trim: true},
  author: {type: String, required: true},
  course: {type: Number, min: 1, max: 3, required: true},
  createdOn: {type: Date, default: Date.now},
  difficulty: {type: Number, min: 1, max: 5, required: true},
  comments: [CommentSchema],
  ingredients: [IngredientSchema],
  nbPerson: {type: Number, min:1, required: true},
  picture: Schema.Types.Mixed,
  pictures: [],
  steps: [],
  time: {type: Number, min: 0, required: true},
  utensils: [String],
  updatedOn: {type: Date, default: Date.now}
});

module.exports = Mongoose.model('Recipe', RecipeSchema);
