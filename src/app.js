import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import favicon from 'serve-favicon';
import api from './api';
//import login from './routes/login';
import cors from 'cors';
//import dash from './routes/dash';
import {User, Site, Post, sequelize} from '../models';

let app = express();
let sessionStore = require('connect-session-sequelize')(session.Store);
let store = new sessionStore({ db: sequelize });
store.sync();

app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(session({
  secret: 'crazy cool cat',
  store: store,
  saveUninitialized: false,
  resave: false,
  proxy: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', api);
//app.use('/login', login);
//app.use('/dash', dash);

passport.serializeUser((user, next) => {
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
//if (app.get('env') === 'development') {
  //app.use(function(err, req, res, next) {
    //Site.findOne({ include: [Page] }).then(function(site) {
      //res.status(err.status || 500);
      //res.render('error_dev', {
        //site: site,
        //pages: site.pages,
        //error: err
      //});
    //});
  //});
  //app.locals.pretty = true;
//}
//
app.locals.pretty = true;

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
  //Site.findOne({ include: [Page] }).then(function(site) {
    //res.status(err.status || 500);
    //res.render('error', {
      //site: site,
      //pages: site.pages,
      //error: err
    //});
  //});
//});

if (app.get('env') == 'production') {
  let compression = require('compression');
  app.use(compression());
}

module.exports = app;
