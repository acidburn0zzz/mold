import multer from 'multer'

let storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, next) {
    return next(null, Date.now() + '_' + file.originalname)
  }
})

let displayPictureStorage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, next) {
    next(null, req.user.username)
  }
})

let imageUpload = multer({ storage: storage })
let displayPictureUpload = multer({ storage: displayPictureStorage })

export {imageUpload, displayPictureUpload}
