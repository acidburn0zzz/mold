import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import favicon from 'serve-favicon';
import v1API from './api/v1';
import cors from 'cors';
import {User, Site, Post, sequelize} from '../models';

let app = express();
app.use(cors());
app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1', v1API);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.sendStatus(404);
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

export {app};
