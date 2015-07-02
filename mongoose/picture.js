var Mongoose = require('mongoose'),
    Schema = Mongoose.Schema;

var PictureSchema = new Schema({
  author: {type: String, required: true},
  createdOn: {type: Number, required: true},
  format: {type: String, required: true},
  height: {type: Number, required: true},
  public_id: {type: String, required: true},
  tags: [String],
  width: {type: Number, required: true}
});

Mongoose.model('Picture',PictureSchema);
