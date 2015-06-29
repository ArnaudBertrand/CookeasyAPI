var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

var IngredientSchema = new Schema({
  name: {type: String, required: true, trim: true, lowercase: true},
  qte: {type: Number, min: 0},
  unit: String
});

var CommentSchema = new Schema({
  author: {type: String, required: true},
  createdOn: {type: Number, default: Date.now()},
  mark: {type: Number, min: 1, max: 5},
  message: {type: String, required: true},
  updateOn: {type: Number, default: Date.now(), index: true}
});

var PictureSchema = new Schema({
  author: {type: String, required: true},
  createdOn: {type: Number, required: true},
  format: {type: String, required: true},
  height: {type: Number, required: true},
  public_id: {type: String, required: true},
  tags: [String],
  width: {type: Number, required: true}
});

var StepSchema = new Schema({
  number: {type: Number, min: 1, required: true},
  action: {type: String, minlength: 10, required: true},
  picture: PictureSchema,
  time: {type: Number, min: 0}
});

var RecipeSchema = new Schema({
  name: {type: String,required: true, trim: true},
  author: {type: String, required: true},
  course: {type: Number, min: 1, max: 3, required: true},
  createdOn: {type: Number, default: Date.now()},
  difficulty: {type: Number, min: 1, max: 5, required: true},
  comments: [CommentSchema],
  ingredients: [IngredientSchema],
  nbPerson: {type: Number, min:1, required: true},
  picture: {type: String, required: true},
  pictures: [PictureSchema],
  steps: {type: [StepSchema], required: true},
  time: {type: Number, min: 0, required: true},
  utensils: [String],
  updatedOn: {type: Number, default: Date.now()}
});

RecipeSchema.post('save', function(doc){
  var recipe = this;

  // Add the ingredient to the ingredient list if it doesn't exist
  if (!recipe.isModified('ingredients')){
    return;
  }

  recipe.ingredients.forEach(function(ingredient){
    IngredientDao.addToRecipe(ingredient,doc._id,function(err){
      return console.log(err);
    });
  });
});


module.exports = Mongoose.model('Recipe', RecipeSchema);
