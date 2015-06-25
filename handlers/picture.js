var cloudinary = require('cloudinary');

function PictureHandler(){
  this.upload = function(req,res){
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
          // Mini
          picture.miniThumbUrlLarge = cloudinary.url(result.public_id, { width: 180, height: 120, crop: "fill" });
          picture.miniThumbUrlSquare = cloudinary.url(result.public_id, { width: 100, height: 100, crop: "fill" });
          picture.miniThumbUrlLong = cloudinary.url(result.public_id, { width: 120, height: 180, crop: "fill" });
          // Thumb
          picture.thumbUrlLarge = cloudinary.url(result.public_id, { width: 300, height: 200, crop: "fill" });
          picture.thumbUrlSquare = cloudinary.url(result.public_id, { width: 300, height: 300, crop: "fill" });
          picture.thumbUrlLong = cloudinary.url(result.public_id, { width: 200, height: 300, crop: "fill" });
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
}

module.exports = PictureHandler;
