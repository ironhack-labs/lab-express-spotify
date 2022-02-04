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

spotifyApi.clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

app.get('/',  (req, res) => {
    res.render("home", {
      doctitle: 'home',
    })
  });

  app.get('/artist-search',  (req, res) => {
    console.log("QUERY",req.query);
    spotifyApi.searchArtists(req.query.artist.toLowerCase())
    .then(data => {
      res.render('artist-search-results', {artistList: data.body.artists.items})
      console.log('The received data from the API: ', data.body.artists.items);
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));
  });

 
  app.get('/albums/:artistId', (req, res, next) => {
    spotifyApi.getArtistAlbums()
  .then(data => {
    res.render('albums:artistId', {albumList:data.body})
    console.log('Artist albums', data.body);
  });
  });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
