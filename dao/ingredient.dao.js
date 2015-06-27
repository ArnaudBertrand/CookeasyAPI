var Ingredient = require('./../mongoose/ingredient.js');

var RecipeDao = {
  addToRecipe: addToRecipe
};

function addToRecipe(ingredient,recipe,callback){
  Ingredient.update(
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

module.exports = RecipeDao;