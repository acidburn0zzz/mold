import {Site, User} from '../../models';

// Middleware for checking if site is inialized
function initialized(req, res, next) {
  Site.findOne().then(function (site) {
    if (site.initialized) {
      return next();
    } else {
      res.redirect('/setup');
    }
  });
};

function is_logged_in(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login');
  }
};

function ErrorCreator(status, message, site, back) {
  let error = new Error();
  error.status = status;
  error.message = message;
  error.site = site;
  error.back = back;
  return error;
}

module.exports.initialized = initialized;
module.exports.is_logged_in = is_logged_in;
module.exports.ErrorCreator = ErrorCreator;
