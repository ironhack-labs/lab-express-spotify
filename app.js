require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  //Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data =>  spotifyApi.setAccessToken(data.body['access_token']), console.log("token granted"))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get(`/`, (req, res) => res.render(`home`));
app.get(`/artist-search`, (req, res) => { 
  let search = req.query
    spotifyApi
    .searchArtists(search.artist)
    .then(data => {
      console.log('The received data from the API: ', data.body.artists.items);

      return res.render(`artist-search-results`, data.body.artists.items)
    })
    .catch(err => console.log('The error while searching artists occurred: ', err));

})


app.get('/albums/:artistId', (req, res, next) => {

  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(
    function(data) {
      console.log('Artist albums', data.body.items);
      res.render(`albums`, data.body.items)
    },
    function(err) {
      console.error(err);
    }
  );
});

app.get('/tracks/:trackId', (req, res, next) => {
  spotifyApi
  .getAlbumTracks(req.params.trackId)
  .then(
    function(data) {
      console.log('tracks', data.body.items);
      res.render(`tracks`, data.body.items)
    },
    function(err) {
      console.error(err);
    }
  );
});

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
