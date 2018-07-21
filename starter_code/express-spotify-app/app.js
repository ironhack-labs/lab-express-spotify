const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();
const hbs = require('hbs');

// Remember to paste here your credentials
var clientId = 'fff1a9c70e5a49f19927b662f7a81637',
    clientSecret = '0c720d07fb064b2ebe925fa0162b4a96';

var spotifyApi = new SpotifyWebApi({
    clientId : clientId,
    clientSecret : clientSecret
});

// Retrieve an access token.
spotifyApi.clientCredentialsGrant()
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
  }, function(err) {
    console.log('Something went wrong when retrieving an access token', err);
});

//Setting the views engine
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

//Registering the partials
hbs.registerPartials(__dirname + '/views/partials');

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/artist', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(artist)
  .then(data => {
    let received = data;
    let image = received.body.artists.items[0].images;
    let items = received.body.artists.items;
    //res.send(item.images[0]);
    //res.send(`<img src = ${item[0].images[0].url} >`);
    res.render('artist', {image, items});
  })
  .catch(err => {
    console.log(`Error trying to retrieve Artist ${err}`);
  })
});

app.listen(3000);