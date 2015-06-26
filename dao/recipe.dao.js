var Recipe = require('./../mongoose/recipe.js');

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
  Recipe.findByIdAndUpdate(id,
      {$push: {comments: {$each: [comment], $sort: {createdOn:- 1}}}},
      {safe: true, upsert: true, new: true},
      function(err, recipe){
        if(err) return callback(err);
        if(!recipe) return callback(null,{recipe: 'Recipe not exisiting'});

        callback(null,null,recipe.comments);
      }
  );
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

function getTrends(offset,nb,callback){
  Recipe.findOne({_id: "557881a4fcea910300386673"},function(err, recipe){
    if(recipe){
      res.send({recipes: [recipe]});
    } else {
      res.send({error: "Server error"});
    }
  });
}

function search(){

}

module.exports = RecipeDao;