const postPutAssertBody = (req, res, next) => {
  req.body.title ? null : next(res.sendStatus(400));
  req.body.content ? null : next(res.sendStatus(400));
  req.body.draft ? null : next(res.sendStatus(400));
  return next();
}

export {postPutAssertBody};
