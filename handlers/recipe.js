var db = require('./../mongoose/mongoose.js');
var Recipe = db.Recipe;
var Ingredient = db.Ingredient;
var internals = {};


// Routes handlers
internals.create = function (req, res) {
  var name = req.body.title || '';
  var course = req.body.course || -1;
  var type = req.body.type || -1;
  var ingredients = req.body.ingredients || [];
  var steps = req.body.steps || [];
  var user = req.user;
  // Check parameters
  if(typeof name !== "string" || typeof course !== "number" || course !== parseInt(course,10) || typeof type !== "number" ||
   type !== parseInt(type,10) || !(ingredients instanceof array) || !(steps instanceof array)){
    return res.send({success:false, error: "Wrongs parameters types"});
  }
  if(!user || name == '' || course == -1 || type == -1 || ingredients.length == 0 || steps.length == 0){
    return res.send({success:false, error: "Missing parameters"});
  }
/*
  // Check ingredients
  ingredients.forEach(function(ingredient){
    var name = ingredient.name || '';
    var qte = ingredient.qte || 0;
    var unit = ingredient.unit || '';

    if(typeof name != "string" || typeof qte !== "number" || typeof unit !== "string"){
      return res.send({success:false, error: "Invalid type parameters for ingredient"});
    }

    if(name == ''){
      return res.send({success:false, error: "Invalid ingredient name"});
    }
    name = name.toLowerCase();
    if(Ingredient.where({name: name}).count()){
      var ing = new Ingredient({name: name});
      ing.save(function(err){
        if(err){
          return res.send({success:false, error: "No name for ingredient"});
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
    var photo = step.time || '';

    // Check parameters
    if(typeof action !== "string"  || typeof stepnb !== "number" || typeof time !== "number" || typeof photo !== "string"){
      return res.send({success:false, error: "Invalid type parameters in step"});
    }
    if(action == '' || stepnb !== stepCount){
      return res.send({success:false, error: "Invalid parameters in step"});
    }
  });
*/
  // Create the recipe
  var recipe = new Recipe({name: name, course: course, type: type, ingredients: ingredients, steps: steps});
  recipe.save(function(err){
    res.send({success:true});
  }
};

internals.get = function(req,res){
  res.send('Ok passed');
  console.log(req.user);
};

internals.delete = function(req,res){
  res.send('Ok passed');
  console.log(req.user);
};

module.exports = internals;