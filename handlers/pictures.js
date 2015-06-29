var cloudinary = require('cloudinary');

var PicturesHandler = {
  upload: upload
};

function upload (req,res){
  var file = req.files.file;
  var author = req.user.username;
  var tags = req.body.tags || [];

  // Upload
  cloudinary.uploader.upload(
      file.path,
      function(picture) {
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
}

module.exports = PicturesHandler;
