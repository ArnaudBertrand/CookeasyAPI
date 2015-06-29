var Picture = require('./../mongoose/picture.js');

var PictureDao = {
  add: add
};

function add(picture,callback){
  var picture = new Picture(picture);
  picture.save(picture,function(err,pic){
    if(err) callback(err);
    return pic;
  });
}

module.exports = PictureDao;