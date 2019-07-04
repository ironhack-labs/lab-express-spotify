const express = require('express');
const hbs = require('hbs');
const path = require('path');

hbs.registerPartials(__dirname + '/views/partials');
const viewController = require('./controllers/viewController');

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', viewController.index);
app.get('/artist', viewController.search);
app.get('/album/:artistId', viewController.artist);
app.get('/tracks/:album', viewController.albums);

app.listen(3000, () => {
	console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊');
});
