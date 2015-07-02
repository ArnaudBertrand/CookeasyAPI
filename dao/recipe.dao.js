var Recipe = require('./../mongoose/recipe.js');
    IngredientDao = require('./../dao/ingredient.dao.js');

var RecipeDao = {
  addComment: addComment,
  addUsersPicture: addUsersPicture,
  create: create,
  remove: remove,
  getRecipe: getRecipe,
  getRecipes: getRecipes,
  search: search
};

function addComment(id,comment,callback){
  Recipe.findById(id, function(err,recipe){
    if(err) return callback(err);
    if(!recipe) return callback(null,{recipe: 'Recipe not exisiting'});

    recipe.comments.push(comment);
    recipe.comments.sort(function(a,b){
      return a.createdOn < b.createdOn;
    });

    console.log(recipe.comments);
    recipe.save(function(err){
      if(err) return callback(err);

      callback(null,null,recipe.comments[0]);
    });
  });
}

function addUsersPicture(){

}


function create(recipe,callback){
  var recipe = new Recipe(recipe);
  recipe.save(function(err){
    if(err) return callback(err);
    console.log(recipe);
    callback(null,recipe._id);
  });
}

function remove(){

}

function getRecipe(id,callback){
  console.log('dao single');
  Recipe.findOne({_id: id},function(err, recipe){
    if(err) return callback(err);
    if(!recipe) return callback(null,{recipe: "Recipe does not exist"});

    callback(null,null,recipe);
  });
}

function getRecipes(nb,filter,callback){
  console.log('dao multi');
  var selector = {};

  // Matching filter
  if(filter.match){
    var items = filter.match.split(' '),
        regex = '';
    items.forEach(function(e){
      regex += '(?=.*' + e + '.*)';
    });
    selector.name = {$regex: regex, $options: "i"};
  }

}
Recipe.find(selector,function(err, recipes){
  if(err) return callback(err);

  callback(null,recipes);
}).limit(nb).populate('picture steps.picture');

function search(){

}

module.exports = RecipeDao;