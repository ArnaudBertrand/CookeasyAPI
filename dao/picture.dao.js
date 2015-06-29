var Picture = require('./../mongoose/picture.js');

var PictureDao = {
  add: add
};

function add(picture,callback){
  Picture.insert(picture,function(err,picture){
    if(err) callback(err);
    return picture;
  });
}

module.exports = PictureDao;