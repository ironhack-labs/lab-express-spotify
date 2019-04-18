const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const routes = require('./routes');

// config
const port = 3000;

// declarations
const app = express();

// middlewares
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// routes
app.use('/', routes);

app.listen(port, () =>
  console.log(`My Spotify project running on port ${port} 🎧 🥁 🎸 🔊`)
);
