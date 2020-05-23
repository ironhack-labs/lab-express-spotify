require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set(hbs.registerPartials(__dirname + '/views/partials'));
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
})

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

app.get('/', (req, res) => res.render('home'));

app.get('/artist-search', (req, res) => {
  spotifyApi
    .searchArtists(req.query.artist)
    .then(data => res.render("artist-search-results", data.body.artists.items))
    .catch(err => console.log('The error while searching artists occured:', err))
})

app.get('/albums/:artistId', (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.artistId)
    .then(data => res.render('albums', data.body.items))
    .catch(err => console.log('The error while searching albums occured:', err))
})

app.get('/albums/:albumId/tracks', (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.albumId)
    .then(data => res.render('tracks', data.body.items))
    .catch(err => console.log('The error while searching tracks occured:', err))
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));