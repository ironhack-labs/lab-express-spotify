const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const indexRouter = require('./routes/index');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials')

// the routes go here:
app.get('/', indexRouter);
app.get('/artists', indexRouter)

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

//no entiendo porqué el data del primer then de la api es toda la info...