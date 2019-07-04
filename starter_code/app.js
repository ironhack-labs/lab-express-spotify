const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const clientId = '5717596dd5e348deaea30cfa5a573860',
    clientSecret = 'a985492cfef44d7c97cb2f868dff2d2c';

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
  })

// the routes go here:

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/artists/', (req, res, next) => {
  let artist = req.query.artist;
  spotifyApi.searchArtists(`artist:${artist}`)
    .then(data => {
      let artists = data.body;
      res.render('artists', artists);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/albums/:artistId', (req, res, next) => {
  let artistId = req.params.artistId;
  spotifyApi.getArtistAlbums(artistId)
    .then(data => {
      let albums = data.body;
      res.render('albums', albums);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.get('/tracks/:albumId', (req, res, next) => {
  let albumId = req.params.albumId;
  spotifyApi.getAlbumTracks(albumId)
    .then(data => {
      let tracks = data.body;
      res.render('tracks', tracks);
      // res.send(tracks);
    })
    .catch(err => {
      console.log("The error while searching artists occurred: ", err);
    })
});

app.listen(3000, () => console.log("My Spotify project running on port 3000 🎧 🥁 🎸 🔊"));
