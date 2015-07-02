var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema,
    Ingredient = Mongoose.model('Ingredient');

var CommentSchema = new Schema({
  author: {type: String, required: true},
  createdOn: {type: Number, default: Date.now()},
  mark: {type: Number, min: 1, max: 5},
  message: {type: String, required: true},
  updateOn: {type: Number, default: Date.now(), index: true}
});

var StepSchema = new Schema({
  number: {type: Number, min: 1, required: true},
  action: {type: String, minlength: 10, required: true},
  picture: {type: Schema.ObjectId, ref: 'Picture'},
  time: {type: Number, min: 0}
});

var RecipeSchema = new Schema({
  name: {type: String, default:'', trim: true},
  author: {type: Schema.ObjectId, ref: 'User'},
  course: {type: Number, min: 1, max: 3},
  createdOn: {type: Number, default: Date.now()},
  difficulty: {type: Number, min: 1, max: 5},
  comments: [CommentSchema],
  ingredients: [{type: Schema.ObjectId, ref: 'Ingredient'}],
  nbPerson: {type: Number, min:1},
  picture: {type: Schema.ObjectId, ref: 'Picture'},
  pictures: [{type: Schema.ObjectId, ref: 'Picture'}],
  steps: {type: [StepSchema]},
  time: {type: Number, min: 0},
  utensils: [String],
  updatedOn: {type: Number, default: Date.now()}
});

/** Validation **/
RecipeSchema.path('name').required(true, 'Recipe needs a name');
RecipeSchema.path('author').required(true, 'Recipe needs a name');
RecipeSchema.path('course').required(true, 'Recipe needs a course');
RecipeSchema.path('createdOn').required(true, 'Recipe needs a creation date');
RecipeSchema.path('difficulty').required(true, 'Recipe needs a difficulty');
RecipeSchema.path('ingredients').required(true, 'Recipe needs ingredients');
RecipeSchema.path('nbPerson').required(true, 'Recipe needs number of person');
RecipeSchema.path('picture').required(true, 'Recipe needs a main picture');
RecipeSchema.path('steps').required(true, 'Recipe needs some steps');
RecipeSchema.path('time').required(true, 'Recipe needs a duration');
RecipeSchema.path('updatedOn').required(true, 'Recipe needs an update date');

/** Post hooks **/
RecipeSchema.post('save', function(doc){
  var recipe = this;

  // Add the ingredient to the ingredient list if it doesn't exist
  if (!recipe.isModified('ingredients')){
    return;
  }

  recipe.ingredients.forEach(function(ingredient){
    Ingredient.addToRecipe(ingredient,doc._id,function(err){
      return console.log(err);
    });
  });
});

/** Methods **/
RecipeSchema.methods = {
  addComment: addComment,
  addUsersPicture: addUsersPicture,
  list: list
};

/** Statics **/
RecipeSchema.statics = {
  get: get
};

/** Methods functions **/
function addComment(id,comment,callback){
  this.findById(id, function(err,recipe){
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
  //TODO
}


function list(nb,filter,callback){
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

  this.find(selector,function(err, recipes){
    if(err) return callback(err);

    callback(null,recipes);
  }).limit(nb).populate('picture steps.picture');
}

/** Statics functions **/
function get(id,callback){
  this.findOne({_id: id},function(err, recipe){
    if(err) return callback(err);
    if(!recipe) return callback(null,{recipe: "Recipe does not exist"});

    callback(null,null,recipe);
  });
}

Mongoose.model('Recipe', RecipeSchema);
