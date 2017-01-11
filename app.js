let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let passport = require('passport');
let session = require('express-session');
let sessionStore = require('connect-session-sequelize')(session.Store);
let routes = require('./routes/index');
let dash = require('./routes/dash');
let login = require('./routes/login');
let Page = require('./models/orm').Page;
let User = require('./models/orm').User;
let Site = require('./models/orm').Site;
let ORM = require('./models/orm').ORM;

let app = express();

app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

app.use(session({
  secret: 'crazy cool cat',
  store: new sessionStore({
    db: ORM
  }),
  saveUninitialized: false,
  resave: false,
  proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, next) {
  next(null, user);
});

passport.deserializeUser(function(user, next) {
  User.findOne({
    where: {
      username: user.username
    }
  }).then(function(user) {
    next(null, user);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use('/', routes);
app.use('/login', login);
app.use('/dash', dash);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  err.back = "/";
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    Site.findOne({ include: [Page] }).then(function(site) {
      res.status(err.status || 500);
      res.render('error_dev', {
        site: site,
        pages: site.pages,
        error: err
      });
    });
  });
  app.locals.pretty = true;
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  Site.findOne({ include: [Page] }).then(function(site) {
    res.status(err.status || 500);
    res.render('error', {
      site: site,
      pages: site.pages,
      error: err
    });
  });
});

if (app.get('env') == 'production') {
  let compression = require('compression');
  app.use(compression());
}

module.exports = app;
