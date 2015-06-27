var Recipe = require('./../mongoose/recipe.js');
    IngredientDao = require('./../dao/ingredient.dao.js');

var RecipeDao = {
  addComment: addComment,
  addUsersPicture: addUsersPicture,
  create: create,
  remove: remove,
  get: get,
  getTrends: getTrends,
  search: search
};

function addComment(id,comment,callback){
  Recipe.findOne(id, function(err,recipe){
    if(err) return callback(err);
    if(!recipe) return callback(null,{recipe: 'Recipe not exisiting'});

    recipe.comments.push(comment);
    recipe.comments.sort(function(a,b){
      return a.createdOn < b.createdOn;
    });

    recipe.save(function(err){
      if(err) return callback(err);

      callback(null,null);
    });
  });
  //    {$push: {comments: {$each: [comment], $sort: {createdOn:- 1}}}},
  //    {runValidators: true, safe: true, upsert: true, new: true},
  //    function(err, recipe){
  //      if(err) return callback(err);
  //      if(!recipe) return callback(null,{recipe: 'Recipe not exisiting'});
  //
  //      callback(null,null,recipe.comments);
  //    }
  //);
}

function addUsersPicture(){

}


function create(recipe,callback){
  var recipe = new Recipe(recipe);
  recipe.save(function(err){
    if(err) return callback(err);

    callback(null,{id: recipe._id});
  });
}

function remove(){

}

function get(id,callback){
  Recipe.findOne({_id: id},function(err, recipe){
    if(err) return callback(err);
    if(!recipe) return callback(null,{recipe: "Recipe does not exist"});

    callback(null,null,{recipe: recipe});
  });
}

function getTrends(nb,callback){
  Recipe.find({},function(err, recipes){
    if(err) return callback(err);

    callback(null,recipes);
  }).limit(nb);
}

function search(){

}

module.exports = RecipeDao;