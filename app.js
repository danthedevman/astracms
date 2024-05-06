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
app.use(localMiddleware);

app.use(expressLayouts);
app.set("layout", "./layouts/bases");
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/register', registerRouter);
app.use('/', isLoggedIn, indexRouter);
app.use('/sys_base', isLoggedIn, indexRouter);
app.use('/:base/dashboard', isLoggedIn, canAccessBase, dashboardRouter);
app.use('/:base/content',isLoggedIn, canAccessBase, contentRouter);
app.use('/:base/models',isLoggedIn, canAccessBase, modelsRouter);
app.use('/:base/assets',isLoggedIn,canAccessBase, assetsRouter);
app.use('/:base/users',isLoggedIn,canAccessBase, usersRouter);
app.use('/:base/settings',isLoggedIn,canAccessBase, settingsRouter);

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
