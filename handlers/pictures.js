var cloudinary = require('cloudinary'),
    Picture = require('mongoose').model('Picture');

var PicturesHandler = {
  upload: upload
};

function upload (req,res,next){
  var file = req.files.file;
  var author = req.user.username;
  var tags = req.body.tags || [];

  // Upload
  cloudinary.uploader.upload(
      file.path,
      function(picture) {
        picture.author = author;
        picture.createdOn =  Date.now();

        var imgToSave = new Picture(picture);
        imgToSave.save(function(err,imgSaved){
          if(err) return next(err);
          res.send(imgSaved);
        });
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
