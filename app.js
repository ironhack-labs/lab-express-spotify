require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

    app.get('/', (req, res) => {
        res.render('index');
      });

      app.get('/artist-search', (req, res) => {
        const artistName = req.query.artist;
        res.render('/artist-search', { artistName });
        spotifyApi
        .searchArtists(/*'HERE GOES THE QUERY ARTIST'*/)
        .then(data => {
        console.log('The received data from the API: ', data.body);})
        .catch(err => console.log('The error while searching artists occurred: ', err));
      });
    
      app.get('/artist-search-results', (req, res) => {
        res.render('/artist-search-results');
      });

      app.get('/albums/:artistId', (req, res, next) => {
        spotifyApi.getArtistAlbums()
        .then(data => {
            console.log('data from API :', data);})
        .catch(err => console.log('The error while searching albums occurred: ', err));
        });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
