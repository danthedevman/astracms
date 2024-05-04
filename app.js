require("dotenv").config();
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

//routers
const indexRouter = require('./routes/index');
const contentRouter = require('./routes/content');
const modelsRouter = require('./routes/models');
const assetsRouter = require('./routes/assets');
const usersRouter = require('./routes/users');
const settingsRouter = require('./routes/settings');

const app = express();

// view engine setup
app.use(expressLayouts);
app.set("layout", "./layouts/default");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/content', contentRouter);
app.use('/models', modelsRouter);
app.use('/assets', assetsRouter);
app.use('/users', usersRouter);
app.use('/settings', settingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
