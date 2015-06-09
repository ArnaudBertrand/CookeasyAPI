var db = require('./../mongoose/mongoose.js'),
  cloudinary = require('cloudinary'),
  Recipe = db.Recipe,
  internals = {};

internals.upload = function(req,res){
  var file = req.files.file;
  var id = req.params.id;
  var author = req.user.username;
  var tags = req.body.tags || [];

  // Upload
  cloudinary.uploader.upload(
    file.path,
    function(result) {
      // Set picture and thumbnail
      var picture = {};
      picture.url = result.url;
      picture.miniThumbUrl = cloudinary.url(result.public_id, { width: 100, height: 100, crop: "fill" });
      picture.thumbUrl = cloudinary.url(result.public_id, { width: 300, height: 300, crop: "fill" });
      picture.author = author;
      picture.createdOn =  Date.now();

      res.send({picture: picture});
    },
    {
      crop: 'limit',
      width: 800,
      height: 800,
      tags: tags
    }
  );
};

module.exports = internals;
