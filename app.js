require('dotenv').config();
require('./configs/hbs.config');
require('./configs/spotify.config');

const express = require('express');
const routes = require('./configs/routes.config');

// require spotify-web-api-node package here:
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
//app.use(express.static(__dirname + '/public'));
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Our routes go here:

app.use('/', routes);

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
