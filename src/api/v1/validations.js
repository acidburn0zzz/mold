const postValidationSchema = {
  'title': {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Title cannot be empty'
  },
  'content': {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Content cannot be empty'
  },
  'draft': {
    in: 'body',
    notEmpty: true,
    errorMessage: 'Draft cannot be empty'
  }
}

function validatePostData (req, res, next) {
  req.checkBody(postValidationSchema)
  req.getValidationResult().then((validationResult) => {
    if (!validationResult.isEmpty()) {
      res.status(400).send(JSON.stringify(validationResult.array()))
    } else {
      return next()
    }
  })
}

let validatePageData = validatePostData

export {postValidationSchema, validatePostData, validatePageData}
