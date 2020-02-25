
require("dotenv").config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: 'b84b6a08c27d4080bb8f0ff74c56244d',
    clientSecret: '65932c2bda634379bfff2824a92b827e'
  });
  spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body.access_token))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));  
// Our routes go here:
app.get('/', (req, res) => res.render('search-artists'));

app.get('/artists-search-results', (req, res) => {
    spotifyApi
      .searchArtists(req.query.searchArtist)
      .then((data) => {
        console.log('The received data from the API: ', data.body);
        res.render('artists-search-results', { data });
      })
      .catch((err) => console.log('The error while searching artists occurred: ', err));
  });

app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi
      .getArtistAlbums(req.params.artistId)
      .then(data => {
        const albums = data.body.items;
        res.render('albums', { albums });
      })
      .catch(err =>
        console.log('The error while searching albums occurred: ', err)
      );
  });

  app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
      .getAlbumTracks(req.params.albumId)
      .then((data) => {
        console.log('The received data from the API: ', data.body);
        res.render('tracks', { data });
      })
      .catch((err) => console.log('The error while searching tracks occurred: ', err));
  });
app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
