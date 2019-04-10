const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');
const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + '/views/partials');
// setting the spotify-api goes here:
const clientId = '06d72fb9a7bb4f15a42dfe168c6e950f',
  clientSecret = '8edebf9b17d0466eaa65735a72361391';

const spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});
//token
spotifyApi
  .clientCredentialsGrant()
  .then(data => {
    spotifyApi.setAccessToken(data.body['access_token']);
  })
  .catch(error => {
    console.log('Something went wrong when retrieving an access token', error);
  });

// the routes go here:
app.get('/', (req, res) => {
  res.render('home.hbs');
});

app.get('/artists', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artistName)
    .then(data => {
      //  console.log('The received data from the API: ', data.body);
      res.render('artists', { bands: data.body.artists.items });
      //res.json(data.body);
    })
    .catch(err => {
      console.log('Artist not found. Error: ', err);
      res.render('artists');
    });
});

app.get('/albums/:id', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id)
    .then(album => {
      res.render('albums', { albums: album.body.items });
      //res.json(album.body.items);
    })
    .catch(err => {
      console.log('Albums not found. Error: ', err);
      res.render('albums');
    });
});

app.get('/tracks/:id', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id)
    .then(track => {
      //res.json(track);
      res.render('tracks', { tracks: track.body.items });
    })
    .catch(err => {
      console.log('tracks not found. Error: ', err);
      res.render('tracks');
    });
});

app.listen(3006, () =>
  console.log('My Spotify project running on port 3006 🎧 🥁 🎸 🔊')
);
