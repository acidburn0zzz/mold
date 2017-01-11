let multer = require('multer');
let storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, next) {
    if (req.body.bame) {
      return next(null, req.body.name);
    } else {
      return next(null, Date.now() + file.originalname);
    }
  }
});
let display_picture_storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, next) {
    next(null, req.user.username)
  }
});
let image_upload = multer({ storage: storage });
let display_picture_upload = multer({storage: display_picture_storage });

module.exports.image_upload = image_upload;
module.exports.display_picture_upload = display_picture_upload;
