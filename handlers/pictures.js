var cloudinary = require('cloudinary'),
    PictureDao = require('./../dao/picture.dao.js');

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

        PictureDao.add(picture,function(err,picture){
          if(err) return next(err);
          res.send(picture);
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
