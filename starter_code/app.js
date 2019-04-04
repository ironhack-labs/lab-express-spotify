const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));


// setting the spotify-api goes here:

// Remember to insert your credentials here
const clientId = '34cfe53e72fe4a348607c8c917a7de89',
    clientSecret = '65745d996e6148a4a72e58ab16877ebd';

const spotifyApi = new SpotifyWebApi({
  clientId : clientId,
  clientSecret : clientSecret
});

// Retrieve an access token
spotifyApi.clientCredentialsGrant()
  .then( data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists', (req, res, next) => {
  spotifyApi.searchArtists(req.query.artist)
    .then(data => {
      console.log("The received data from the API: ", data.body);
      res.render('artists', data.body.artists);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(data => {
      console.log('Artist albums', data.body);
      res.render('albums', data.body);
    })
    .catch(err => {
      console.log(err);
    })
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(data => {
      console.log('Artist tracks', data.body);
      res.render('tracks', data.body);
    })
    .catch(err => {
      console.log(err);
    })
});


app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
