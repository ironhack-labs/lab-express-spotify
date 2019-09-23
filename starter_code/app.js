require('dotenv').config();
const bodyParser = require('body-parser');
const createError = require('http-errors');
const express = require("express");
const hbs = require("hbs");

const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const indexRouter = require('./routes/index');
const artistsRouter = require('./routes/artists');
const albumsRouter = require('./routes/albums');
const tracksRouter = require('./routes/tracks');

const app = express();
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/artists', artistsRouter);
app.use("/albums", albumsRouter);
app.use("/tracks", tracksRouter);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;