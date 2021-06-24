require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/', (req, res) => {
  res.render('index');
});

// form buscador artist
app.get('/artist-search', (req, res) => {
  const { artist } = req.query;

  spotifyApi
    .searchArtists(artist)
    .then(data => {
      //   console.log('The received data from the API: ', data.body.artists.items[0].images);
      const artists = data.body.artists.items;

      //   render artist result
      res.render('artist-search-results', { artists });
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

// albums
app.get('/albums/:artistId', (req, res, next) => {
  // .getArtistAlbums() code goes here
  const artistId = req.params.artistId;

  //   console.log(artistId);

  spotifyApi
    .getArtistAlbums(artistId)
    .then(data => {
      //   console.log(data.body);
      return data.body.items.map(a => a.id);
    })
    .then(function (albums) {
      //   console.log(albums);
      return spotifyApi.getAlbums(albums);
    })
    .then(function (data) {
      console.log(data.body.albums.tracks);
      //   res.send(data.body.albums[0]);
      const albums = data.body.albums;
      res.render('albums', { albums });
    });
});

app.get('/tracks/:trackId', (req, res) => {
  const { trackId } = req.params;
  //   console.log(trackId);
  spotifyApi.getAlbumTracks(trackId).then(track => {
    console.log(track.body.items);

    const tracks = track.body.items;

    res.render('tracks', { tracks: tracks });
  });
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
