var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

var PictureSchema = new Schema({
  author: {type: String},
  createdOn: {type: Number},
  format: {type: String},
  height: {type: Number},
  public_id: {type: String},
  tags: [String],
  width: {type: Number}
});

/** Validation **/
PictureSchema.path('author').required(true, 'Picture need an author');
PictureSchema.path('createdOn').required(true, 'Picture need a creation date');
PictureSchema.path('format').required(true, 'Picture need a format');
PictureSchema.path('height').required(true, 'Picture needs a height');
PictureSchema.path('public_id').required(true, 'Picture needs a public_id');
PictureSchema.path('width').required(true, 'Picture needs a width');

Mongoose.model('Picture',PictureSchema);
