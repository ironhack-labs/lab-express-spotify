require('dotenv').config();

const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const hbs = require('hbs');
const app = express();
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res) => { res.render('artist-search')});

app.get('/artist-search-results', (req, res) => { 
  let artist = req.query.search;
  console.log(artist);
  spotifyApi
    .searchArtists(artist)
    .then(data => {
      res.render('artist-search-results', { artists : data.body.artists.items});
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi  
    .getArtistAlbums(req.params.artistId)
    .then(artistAlbums => {
      res.render('albums', { albums : artistAlbums.body.items})
    })
    .catch(err => console.log('The error while searching the albums ', err));
});

app.get('/songs/:albumid', (req, res, next) => {
  spotifyApi  
    .getAlbumTracks(req.params.albumid)
    .then(albumsSongs => {
      res.render('songs', { songs : albumsSongs.body.items})
    })
    .catch(err => console.log('The error while searching the albums ', err));
});

app.listen(3001, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
