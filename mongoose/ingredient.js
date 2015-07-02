var Mongoose = require('mongoose'),
  Schema = Mongoose.Schema;

/** Schema **/
var IngredientSchema = new Schema({
  name: { type: String, default:'', required: true, index: { unique: true } },
  new: {type: Boolean, default: true},
  picture: String,
  recipes: [String],
  type: Number,
  tip: String
});

/** Validation **/
IngredientSchema.path('name').required(true, 'Ingredient name cannot be blank');

/** Methods **/
IngredientSchema.methods = {
  addToRecipe: addToRecipe
};

/** Methods functions **/
function addToRecipe(ingredient,recipe,callback){
  this.update(
      {name: ingredient},
      {
        $addToSet: {recipes: recipe},
        $setOnInsert: {name: ingredient}
      },
      {upsert: true},
      function(err){
        callback(err);
      }
  );
}

Mongoose.model('Ingredient', IngredientSchema);