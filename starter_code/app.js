const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser');
const routes = require('./routes/spotify-routes');

const app = express();

app.set('view engine', 'hbs');
app.set('views', `${__dirname}'/views'`);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', routes);

hbs.registerPartials(`${__dirname}/views/partials`);

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
