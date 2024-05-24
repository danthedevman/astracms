require("dotenv").config();
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');

//routers
const registerRouter = require('./routes/register');
const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const dashboardRouter = require('./routes/dashboard');
const contentRouter = require('./routes/content');
const modelsRouter = require('./routes/models');
const assetsRouter = require('./routes/assets');
const usersRouter = require('./routes/users');
const settingsRouter = require('./routes/settings');
const {isLoggedIn} = require('./middleware/auth');

//middleware
const {localMiddleware} = require('./middleware/locals');
const {canAccessBase} = require('./middleware/base');

const app = express();

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH_SECRET,
  baseURL: process.env.ENVIRONMENT === "production" ? process.env.BASE_URL : process.env.BASE_URL_DEV,
  clientID: process.env.AUTH_CLIENT_ID,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL
};

app.use(auth(config));

app.use(expressLayouts);
app.set("layout", "./layouts/bases");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRouter);
//require auth for all routes below
app.use(isLoggedIn);
app.use(localMiddleware);

app.use('/', indexRouter);
app.use('/sys_base', indexRouter);

app.use('/:base/', canAccessBase);
app.use('/:base/:model/search',searchRouter);
app.use('/:base/dashboard',dashboardRouter);
app.use('/:base/content', contentRouter);
app.use('/:base/models', modelsRouter);
app.use('/:base/assets',assetsRouter);
app.use('/:base/users', usersRouter);
app.use('/:base/settings', settingsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  res.locals.message = err.message;
  res.locals.error = process.env.ENVIRONMENT === 'dev' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
