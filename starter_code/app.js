const express = require('express');
app = express();
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:
var clientId = 'bee482d7704547abb901940d9ccdb3bd',
  clientSecret = '3b4214af117847289ef58cd2716e5ac9';

var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});


app.use('/', require('./routes/index'))
app.use('/', require('./routes/artists'))
app.use('/', require('./routes/albums'))
app.use('/', require('./routes/albumtracks'))


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));

module.exports = app;


