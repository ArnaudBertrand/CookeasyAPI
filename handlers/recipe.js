var db = require('./../mongoose/mongoose.js');
var Recipe = db.Recipe;
var Ingredient = db.Ingredient;
var internals = {};

internals.addComment = function(req, res){
  var message = req.body.comment || '';
  // Check parameter
  if(typeof message !== "string"){
    return res.send({error: "Wrongs parameters types"});
  }
  if(message.length < 10 || message.length > 255){
    return res.send({error: "Message should be between 10 and 255 characters"});
  }

  // Set user
  var user = {};
  user.name = req.user.username;
  var comment = {author: user, message: message, date: Date.now()};

  // Add comment
  Recipe.findByIdAndUpdate(req.params.id,{$push: {'comments': comment}, {upsert: true}},function(err, model){
    if(err){
      return res.send({error: err});
    }
    res.send(model.comments);
  });
}

// Routes handlers
internals.create = function (req, res) {
  var name = req.body.name || '';
  var course = req.body.course || -1;
  var type = req.body.type || -1;
  var ingredients = req.body.ingredients || [];
  var steps = req.body.steps || [];
  var user = req.user;

  // Check parameters
  if((typeof name !== "string") || (typeof course !== "number") || (course !== parseInt(course,10)) || (typeof type !== "number") || (type !== parseInt(type,10)) || !(ingredients instanceof Array) || !(steps instanceof Array)){
    return res.send({error: "Wrongs parameters types"});
  }
  if(!user || name == '' || course == -1 || type == -1 || ingredients.length == 0 || steps.length == 0){
    return res.send({error: "Missing parameters"});
  }

  // Check ingredients
  var stop = false;
  ingredients.forEach(function(ingredient){
    var name = ingredient.name || '';
    var qte = ingredient.qte || 0;
    var unit = ingredient.unit || '';

    if(typeof name != "string" || typeof qte !== "number" || typeof unit !== "string"){
      stop = true;
      return res.send({error: "Invalid type parameters for ingredient"});
    }

    if(name == ''){
      stop = true;
      return res.send({error: "Invalid ingredient name"});
    }
    name = name.toLowerCase();
    if(!Ingredient.where({name: name}).count()){
      var ing = new Ingredient({name: name});
      ing.save(function(err){
        if(err){
          return res.send({error: err});
        }
      });
    }
  });

  // Check steps
  var stepCount = 0;
  steps.forEach(function(step){
    stepCount++;
    var action = step.action || '';
    var stepnb = step.number || 0;
    var time = step.time || 0;
    var picture = step.picture || '';

    // Check parameters
    if((typeof action !== "string")  || (typeof stepnb !== "number") || (typeof time !== "number") || (typeof picture !== "string")){
      stop = true;
      return res.send({error: "Invalid type parameters in step"});
    }
    if(action == '' || stepnb !== stepCount){
      stop = true;
      return res.send({error: "Invalid parameters in step"});
    }
  });

  // Do not save if an error occured during loops
  if(stop){
    return;
  }

  // Create the recipe
  var recipe = new Recipe({name: name, course: course, type: type, ingredients: ingredients, steps: steps, author: req.user.username});
  recipe.save(function(err){
    res.send({id: recipe._id});
  });
};

internals.get = function(req,res){
  Recipe.findOne({_id: req.params.id},function(err, recipe){
    if(recipe){
      console.log(recipe);
      res.send({success: true, recipe: recipe});
    } else {
      res.send({error: "Recipe does not exist"});
    }
  });
};

internals.delete = function(req,res){
  var user = req.user;
  Recipe.findOneAndRemove({_id: req.params.id, author: req.user.username}, function(err){
    if(err){
      res.send({error: err});
    }
    res.send({success: true});
  });
};

module.exports = internals;
